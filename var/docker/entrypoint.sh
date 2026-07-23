#!/usr/bin/env bash
# Load t6-apps/<slug>/config from Vault into the process environment and
# materialize /app/.env so dotenv-cli based start scripts keep working.
set -euo pipefail

APP_SLUG="${VAULT_APP_SLUG:-socialx}"
# Prefer VAULT_HOST (.env convention); VAULT_ADDR is an accepted alias.
VAULT_HOST_RAW="${VAULT_HOST:-${VAULT_ADDR:-}}"
ENV_FILE="${VAULT_ENV_FILE:-/app/.env}"

# Keys the Postiz stack expects in .env / process.env
CRITICAL_ENV_KEYS=(
  DATABASE_URL REDIS_URL JWT_SECRET MAIN_URL FRONTEND_URL
  NEXT_PUBLIC_BACKEND_URL BACKEND_INTERNAL_URL STORAGE_PROVIDER
  UPLOAD_DIRECTORY NEXT_PUBLIC_UPLOAD_DIRECTORY IS_GENERAL
  TEMPORAL_ADDRESS TEMPORAL_NAMESPACE DISABLE_REGISTRATION
  API_LIMIT FEE_AMOUNT OPENAI_API_KEY NX_ADD_PLUGINS
)

normalize_host() {
  local raw="$1"
  raw="${raw%/}"
  if [[ -z "$raw" ]]; then
    echo ""
    return
  fi
  if [[ "$raw" =~ ^https?:// ]]; then
    echo "$raw"
  else
    echo "https://${raw}"
  fi
}

write_env_line() {
  local key="$1"
  local val="$2"
  # Escape nothing exotic beyond newlines already stripped by callers
  printf '%s=%s\n' "$key" "$val" >> "${ENV_FILE}"
}

: > "${ENV_FILE}"

if [[ "${VAULT_SKIP_LOAD:-}" == "true" ]]; then
  echo "[vault] VAULT_SKIP_LOAD=true — skipping Vault config load"
elif [[ -n "${VAULT_HOST_RAW}" && -n "${VAULT_TOKEN:-}" ]]; then
  VAULT_HOST="$(normalize_host "${VAULT_HOST_RAW}")"
  PATH_SUFFIX="secret/data/t6-apps/${APP_SLUG}/config"
  URL="${VAULT_HOST}/v1/${PATH_SUFFIX}"
  echo "[vault] Loading config from ${PATH_SUFFIX} via ${VAULT_HOST}"

  CFG_JSON="$(curl -fsSL \
    -H "X-Vault-Token: ${VAULT_TOKEN}" \
    -H "Accept: application/json" \
    "${URL}")"

  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    key="${line%%=*}"
    val="${line#*=}"
    [[ -z "$key" || "$key" == "vault_token" || "$key" == "placeholder" ]] && continue
    env_key="$(echo "$key" | tr '[:lower:]' '[:upper:]')"
    # Prefer already-set K8s/env values (ESO wins over Vault blob).
    if [[ -n "${!env_key:-}" ]]; then
      write_env_line "$env_key" "${!env_key}"
    else
      write_env_line "$env_key" "$val"
      export "${env_key}=${val}"
    fi
  done < <(CFG_JSON="$CFG_JSON" python3 - <<'PY'
import json, os
data = json.loads(os.environ["CFG_JSON"]).get("data", {}).get("data", {}) or {}
for k, v in data.items():
    if v is None:
        continue
    s = v if isinstance(v, str) else str(v)
    s = s.replace("\n", "\\n").replace("\r", "")
    print(f"{k}={s}")
PY
)

  echo "[vault] Wrote vault-sourced keys to ${ENV_FILE}"
else
  echo "[vault] VAULT_HOST (or VAULT_ADDR) + VAULT_TOKEN not set — using existing environment"
fi

# Ensure critical keys from the process environment (ESO / ConfigMap) are in .env
# even if Vault omitted them or Vault load was skipped.
for env_key in "${CRITICAL_ENV_KEYS[@]}"; do
  if [[ -n "${!env_key:-}" ]] && ! grep -q "^${env_key}=" "${ENV_FILE}" 2>/dev/null; then
    write_env_line "$env_key" "${!env_key}"
  fi
done

echo "[vault] Final ${ENV_FILE} has $(wc -l < "${ENV_FILE}") keys"
exec "$@"
