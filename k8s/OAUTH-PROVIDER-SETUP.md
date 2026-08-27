# SocialX OAuth Provider Setup

How each social platform's OAuth app must be created so socialx.baisoln.com
can post to it, and how the credentials flow into the running pod.

## Credential flow

```
Vault secret/t6-apps/socialx/config  (lowercase keys)
  → ExternalSecret socialx-secrets   (k8s/01-externalsecret.yaml, 5m refresh)
  → K8s Secret socialx-secrets       (UPPERCASE env vars via envFrom)
  → Reloader                         (k8s/09-reloader.yaml) auto-restarts the
                                     socialx deployment on any secret change
```

Update credentials with (all existing values are preserved):

```bash
TOKEN=$(cat ~/.vault-admin-token)
kubectl exec -i -n vault vault-0 -- env VAULT_TOKEN="$TOKEN" VAULT_ADDR=http://127.0.0.1:8200 \
  vault kv patch secret/t6-apps/socialx/config x_api_key=... x_api_secret=...
```

ESO syncs within 5 minutes; to force an immediate sync:

```bash
kubectl annotate externalsecret socialx-secrets -n socialx force-sync=$(date +%s) --overwrite
```

Each Vault change bounces the app for ~1–2 min (Recreate strategy), so batch
related keys into one `vault kv patch`.

## Per-platform OAuth apps

All callback URLs are on `https://socialx.baisoln.com`. Keys below are the
lowercase Vault property names; the pod sees them as the same name uppercased.

| Platform | Where to create the app | Callback URL(s) to register | Vault keys |
|---|---|---|---|
| X (Twitter) | developer.x.com — enable OAuth 1.0a user auth, read + write (consumer keys, not bearer) | `/integrations/social/x` | `x_api_key`, `x_api_secret` |
| LinkedIn + LinkedIn Page | developer.linkedin.com — one app; products: Sign In with LinkedIn, Share on LinkedIn, Community Management (for pages) | `/integrations/social/linkedin` and `/integrations/social/linkedin-page` | `linkedin_client_id`, `linkedin_client_secret` (one pair covers both) |
| Facebook + Instagram | developers.facebook.com — Business app; add Facebook Login + Instagram Graph API | `/integrations/social/facebook` and `/integrations/social/instagram` | `facebook_app_id`, `facebook_app_secret` (one pair covers both) |
| Threads | developers.facebook.com — **separate** app with the Threads API use case | `/integrations/social/threads` | `threads_app_id`, `threads_app_secret` |
| TikTok | developers.tiktok.com — app with Login Kit + Content Posting API | `/integrations/social/tiktok` | `tiktok_client_id`, `tiktok_client_secret` |
| YouTube | console.cloud.google.com — OAuth client, YouTube Data API v3 enabled | `/integrations/social/youtube` | `youtube_client_id`, `youtube_client_secret` (already configured) |
| Google My Business | console.cloud.google.com — may reuse the YouTube project; enable Business Profile APIs (requires Google's GBP API quota approval) | `/integrations/social/gmb` | `google_gmb_client_id`, `google_gmb_client_secret` |
| Pinterest | developers.pinterest.com — app (needs trial/standard access approval) | `/integrations/social/pinterest` | `pinterest_client_id`, `pinterest_client_secret` |
| Reddit | reddit.com/prefs/apps — type **web app**; client ID is the string under the app name | `/integrations/social/reddit` | `reddit_client_id`, `reddit_client_secret` |
| Medium | No server credentials — users paste a personal integration token in the socialx UI. Medium no longer issues new tokens, so only pre-existing tokens work. | — | — |

All 16 new Vault keys currently hold the value `PLACEHOLDER`. Replace a
platform's pair with real values and it becomes connectable in the socialx UI
(Settings → Add Channel) with no further infra steps.
