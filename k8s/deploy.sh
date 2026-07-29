#!/usr/bin/env bash
# Deploy SocialX into the `socialx` namespace, from scratch or over an
# existing install. Safe to re-run.
#
# Postgres for both the app and Temporal lives on the shared pg-ceph cluster
# in the `pg` namespace, so it survives a namespace teardown. Everything in
# the `socialx` namespace itself is recreated from the manifests here.
#
# The socialx-temporal-db Secret is created by this script (Temporal's
# credentials are not in Vault). Password resolution, in order:
#   1. $SOCIALX_TEMPORAL_PG_PASSWORD, if exported
#   2. the password already in the live Secret, if the namespace still has one
#   3. a freshly generated one
# In every case the Postgres role is realigned to match, so a rebuild cannot
# end up with a Secret and a database that disagree.
#
# Usage:
#   ./k8s/deploy.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NAMESPACE="socialx"
PG_NAMESPACE="pg"
TEMPORAL_DB_USER="temporal_socialx"
TEMPORAL_SECRET="socialx-temporal-db"

log()   { echo "  $*"; }
step()  { echo; echo "==> $*"; }
error() { echo "ERROR: $*" >&2; }

command -v kubectl >/dev/null || { error "kubectl not found"; exit 1; }
kubectl cluster-info >/dev/null 2>&1 || { error "cannot reach the cluster"; exit 1; }

find_pg_primary() {
  local pod
  for pod in $(kubectl get pods -n "$PG_NAMESPACE" -o name 2>/dev/null | grep pg-ceph | sed 's|pod/||'); do
    if kubectl exec -n "$PG_NAMESPACE" "$pod" -c postgres -- \
        psql -U postgres -tAc "SELECT pg_is_in_recovery();" 2>/dev/null | grep -qx 'f'; then
      echo "$pod"
      return 0
    fi
  done
  kubectl get pods -n "$PG_NAMESPACE" -o name 2>/dev/null | grep pg-ceph | head -1 | sed 's|pod/||'
}

step "1/5 Namespace"
kubectl apply -f "${SCRIPT_DIR}/00-namespace.yaml"

step "2/5 Temporal Postgres role and credentials"
# Reuse the existing password when there is one, so a re-run against a live
# install doesn't rotate the role out from under a running Temporal.
TEMPORAL_PG_PASSWORD="${SOCIALX_TEMPORAL_PG_PASSWORD:-}"
if [[ -z "$TEMPORAL_PG_PASSWORD" ]]; then
  TEMPORAL_PG_PASSWORD="$(kubectl -n "$NAMESPACE" get secret "$TEMPORAL_SECRET" \
    -o jsonpath='{.data.POSTGRES_PWD}' 2>/dev/null | base64 -d 2>/dev/null || true)"
fi
if [[ -z "$TEMPORAL_PG_PASSWORD" ]]; then
  TEMPORAL_PG_PASSWORD="$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)"
  log "Generated a new Temporal Postgres password"
else
  log "Reusing the existing Temporal Postgres password"
fi

PG_POD="$(find_pg_primary)"
[[ -n "$PG_POD" ]] || { error "no pg-ceph pod found in namespace '$PG_NAMESPACE'"; exit 1; }
log "Postgres primary: $PG_POD"

# CREATEDB is required: Temporal's auto-setup image creates its own
# `temporal` and `temporal_visibility` databases on first boot.
if kubectl exec -n "$PG_NAMESPACE" "$PG_POD" -c postgres -- \
    psql -U postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='${TEMPORAL_DB_USER}';" 2>/dev/null | grep -qx 1; then
  kubectl exec -n "$PG_NAMESPACE" "$PG_POD" -c postgres -- \
    psql -U postgres -c "ALTER USER ${TEMPORAL_DB_USER} WITH PASSWORD '${TEMPORAL_PG_PASSWORD}' CREATEDB LOGIN;" >/dev/null
  log "Role '${TEMPORAL_DB_USER}' updated"
else
  kubectl exec -n "$PG_NAMESPACE" "$PG_POD" -c postgres -- \
    psql -U postgres -c "CREATE USER ${TEMPORAL_DB_USER} WITH PASSWORD '${TEMPORAL_PG_PASSWORD}' CREATEDB LOGIN;" >/dev/null
  log "Role '${TEMPORAL_DB_USER}' created"
fi

kubectl -n "$NAMESPACE" create secret generic "$TEMPORAL_SECRET" \
  --from-literal=POSTGRES_USER="${TEMPORAL_DB_USER}" \
  --from-literal=POSTGRES_PWD="${TEMPORAL_PG_PASSWORD}" \
  --from-literal=POSTGRES_SEEDS="pg-ceph-rw.${PG_NAMESPACE}.svc.cluster.local" \
  --dry-run=client -o yaml | kubectl apply -f - >/dev/null
log "Secret '${TEMPORAL_SECRET}' applied"

step "3/5 Vault-managed secrets (ExternalSecrets)"
kubectl apply -f "${SCRIPT_DIR}/01-externalsecret.yaml"
log "Waiting for socialx-secrets to sync from Vault..."
kubectl -n "$NAMESPACE" wait --for=condition=Ready externalsecret/socialx-secrets --timeout=180s || {
  error "socialx-secrets did not sync — is Vault path t6-apps/socialx/config seeded?"
  exit 1
}

step "4/5 Applying manifests"
for manifest in 02-configmap.yaml 02b-nginx-configmap.yaml 03-redis.yaml \
                04-temporal.yaml 05-pvc.yaml 06-deployment.yaml \
                07-ingress.yaml 08-oauth2-proxy-externalname.yaml; do
  kubectl apply -f "${SCRIPT_DIR}/${manifest}"
done

step "5/5 Waiting for workloads"
# Temporal must be serving before the app can finish booting. The app retries
# internally, but waiting here keeps the script's output honest.
kubectl -n "$NAMESPACE" rollout status deploy/socialx-temporal --timeout=600s
kubectl -n "$NAMESPACE" rollout status deploy/socialx --timeout=900s

echo
echo "SocialX deployed. https://socialx.baisoln.com"
