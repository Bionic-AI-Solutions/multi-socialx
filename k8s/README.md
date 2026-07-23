# SocialX Kubernetes manifests (mirrors)

Canonical deploy lives in **k8s-infrastructure** (no app source tree required):

```bash
cd /path/to/k8s-infrastructure/deploy
export VAULT_TOKEN=<admin-token>
./tier6-apps/deploy-socialx.sh
```

| Item | Location |
|------|----------|
| Manifests | `k8s-infrastructure/deploy/tier6-apps/manifests/socialx/` |
| Deploy script | `k8s-infrastructure/deploy/tier6-apps/deploy-socialx.sh` |
| ExternalSecret | `k8s-infrastructure/deploy/vault/apps/socialx/` |
| Vault path | `secret/t6-apps/socialx/config` |
| Auth | Keycloak Bionic → oauth2-proxy-socialx (`socialx-access`) |
| Google IdP | `secret/t5-gateway/keycloak/google` + setup-google.sh |
| Image | `docker.io/docker4zerocool/socialx:latest` |
| URL | https://socialx.baisoln.com |

Files in this folder are kept in sync for local development convenience.
`./deploy.sh` is a thin wrapper that calls the infra script.

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
