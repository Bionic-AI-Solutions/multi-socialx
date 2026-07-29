# SocialX Kubernetes manifests

This folder is the canonical deploy for SocialX. It is self-contained —
`./deploy.sh` applies everything in order and is safe to re-run:

```bash
./k8s/deploy.sh
```

It previously delegated to `k8s-infrastructure/deploy/tier6-apps/deploy-socialx.sh`,
which does not exist, so the documented path failed. The manifests here are the
real ones (the infra copy holds only the ExternalSecret).

| Item | Location |
|------|----------|
| Manifests | this folder (`00-` … `08-`, applied in order) |
| Deploy script | `k8s/deploy.sh` |
| Vault path | `secret/t6-apps/socialx/config` |
| Auth | Keycloak Bionic → oauth2-proxy-socialx (`socialx-access`) |
| Google IdP | `secret/t5-gateway/keycloak/google` + setup-google.sh |
| Image | `docker.io/docker4zerocool/socialx:v0.1.4` (pinned, not `:latest`) |
| URL | https://socialx.baisoln.com |

## State that lives outside this namespace

Deleting the `socialx` namespace does **not** destroy application data — both
databases are on the shared `pg-ceph` cluster in the `pg` namespace:

| Data | Location | Survives namespace delete? |
|------|----------|----------------------------|
| App database | `pg-ceph-rw.pg.svc.cluster.local/socialx` | Yes |
| Temporal databases | same cluster, role `temporal_socialx` | Yes |
| `socialx-secrets`, `dockerhub-pull-secret` | Vault via ExternalSecrets | Yes, re-synced |
| TLS certificate | cert-manager | Yes, reissued |
| Uploaded media | PVC `socialx-uploads` (`Retain`) | **PV is retained, but a fresh deploy binds a new empty volume** |

The `socialx-temporal-db` Secret is **not** in Vault. `deploy.sh` owns it: it
reuses the live password if present, otherwise generates one, and realigns the
Postgres role either way so the Secret and the database can't drift apart.

To preserve uploaded media across a teardown, retain and re-bind the existing
PV rather than letting `05-pvc.yaml` provision a new one.

Google Cloud Console must allow:

```
https://auth.bionicaisolutions.com/realms/Bionic/broker/google/endpoint
https://socialx.baisoln.com/integrations/social/youtube
```

Authorized JavaScript origins:

```
https://auth.bionicaisolutions.com
https://socialx.baisoln.com
```
