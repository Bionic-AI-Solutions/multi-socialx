# Paste-into-Claude prompt: browser-assisted OAuth app creation

Paste everything below the line into Claude on the Mac (Claude for Chrome /
computer use). Fill in nothing beforehand — Claude pauses and hands you the
keyboard wherever a login, 2FA, or personal detail is needed.

---

You have control of my browser. Help me create OAuth apps on several social
platform developer portals so my self-hosted social scheduler at
**https://socialx.baisoln.com** (a Postiz fork) can post to them. We will go
portal by portal; I stay at the keyboard the whole time.

## Division of labor

- **You**: navigate portals, find the right forms, fill in all app/technical
  fields (names, URLs, callbacks, scopes/products), and tell me clearly when
  it's my turn.
- **Me**: logins, 2FA, CAPTCHAs, phone/identity verification, payment or plan
  selections, and any personal/business details. When you hit one of these,
  stop and say "your turn — do X", then wait for me to say "done".
- **Never** type, guess, or autofill passwords or personal data. Never submit
  a form with irreversible effects (app creation is fine; anything involving
  payment, deletion, or identity verification waits for my explicit OK).
- If a portal requires something we don't have (privacy policy URL, company
  page, app review), note it, fill what we can, and move on — partial
  progress is fine.

## Shared values (use everywhere they fit)

- App name: `SocialX` (append `-<platform>` if taken)
- Website / app URL: `https://socialx.baisoln.com`
- Description: "Self-hosted social media scheduling tool for my own accounts."
- Privacy policy / Terms URLs: ask me when required — I'll provide.
- Category, if asked: productivity / business tool.
- All OAuth callback/redirect URIs are exact and case-sensitive, on
  `https://socialx.baisoln.com` — register them exactly as written per
  platform below.

## Platforms, in order (easiest first)

### 1. Reddit — https://www.reddit.com/prefs/apps
- "create another app" → type: **web app**.
- Redirect URI: `https://socialx.baisoln.com/integrations/social/reddit`
- Collect: **client ID** (the string under the app name) and **secret**.
- Record as: `reddit_client_id`, `reddit_client_secret`.

### 2. LinkedIn — https://developer.linkedin.com → My apps → Create app
- Requires associating a LinkedIn **company page** — I'll pick it.
- Products to add: **Sign In with LinkedIn using OpenID Connect**,
  **Share on LinkedIn**, and request **Community Management API** (needed for
  posting as the company page; may require review — request it and note the
  status).
- Auth tab → Authorized redirect URLs — add BOTH:
  - `https://socialx.baisoln.com/integrations/social/linkedin`
  - `https://socialx.baisoln.com/integrations/social/linkedin-page`
- Collect from the Auth tab: **Client ID**, **Primary Client Secret**.
- Record as: `linkedin_client_id`, `linkedin_client_secret` (one pair serves
  both personal and page posting).

### 3. Pinterest — https://developers.pinterest.com → My apps
- Create app (may require requesting **trial access** — fill the form, use
  the description above; note approval status if not instant).
- Redirect URI: `https://socialx.baisoln.com/integrations/social/pinterest`
- Scopes if asked: `boards:read`, `boards:write`, `pins:read`, `pins:write`,
  `user_accounts:read`.
- Record as: `pinterest_client_id`, `pinterest_client_secret`.

### 4. X (Twitter) — https://developer.x.com
- I may need to choose/confirm a plan tier — hand me control there and tell
  me what each tier allows for posting before I choose.
- In the app's **User authentication settings**: enable **OAuth 1.0a**,
  permissions **Read and write**, type: Web App.
  - Callback URI: `https://socialx.baisoln.com/integrations/social/x`
  - Website URL: `https://socialx.baisoln.com`
- Collect from **Keys and tokens**: **API Key** and **API Key Secret**
  (consumer keys — NOT the bearer token, NOT access token/secret).
- Record as: `x_api_key`, `x_api_secret`.

### 5. Facebook + Instagram — https://developers.facebook.com → Create App
- App type/use case: **Business** (Instagram posting rides on this same app
  via the Instagram Graph API — no separate app needed).
- Add products: **Facebook Login for Business** and **Instagram**.
- Settings → Basic: app domain `socialx.baisoln.com`; privacy policy URL —
  ask me.
- Facebook Login → Settings → Valid OAuth Redirect URIs — add BOTH:
  - `https://socialx.baisoln.com/integrations/social/facebook`
  - `https://socialx.baisoln.com/integrations/social/instagram`
- Keep the app in **Development mode** for now — that's sufficient for
  posting to pages/accounts I admin; full App Review can come later.
- Collect from Settings → Basic: **App ID**, **App Secret**.
- Record as: `facebook_app_id`, `facebook_app_secret`.

### 6. Threads — https://developers.facebook.com → Create App (a SECOND app)
- Use case: **Access the Threads API**.
- Redirect URI: `https://socialx.baisoln.com/integrations/social/threads`
- Permissions: `threads_basic`, `threads_content_publish`.
- Add my Threads account as a Threads tester (Roles) so dev mode works.
- Collect the **Threads App ID** and **Threads App Secret** (from the
  Threads use-case settings, not the main app settings).
- Record as: `threads_app_id`, `threads_app_secret`.

### 7. TikTok — https://developers.tiktok.com
- Register me as a developer if needed (hand me any identity steps).
- Create app; add products **Login Kit** and **Content Posting API**.
- Redirect URI: `https://socialx.baisoln.com/integrations/social/tiktok`
- Scopes: `user.info.basic`, `video.publish`, `video.upload`.
- TikTok requires an app audit before production posting — submit what we
  can, enable sandbox mode, and note the review status.
- Record as: `tiktok_client_id` (their "Client key"), `tiktok_client_secret`.

### 8. Google My Business — https://console.cloud.google.com
- Use my EXISTING Google Cloud project (the one with the YouTube OAuth
  client — I'll point you to it) so the consent screen is already done.
- Enable APIs: **My Business Account Management API**, **My Business
  Business Information API**, **Google My Business API**.
- Note: Business Profile API access needs a quota request via Google's GBP
  access form — if quota is 0, open the form, fill the technical parts, and
  hand me the business-detail fields.
- Create a NEW OAuth client (type: Web application):
  - Authorized redirect URI: `https://socialx.baisoln.com/integrations/social/gmb`
- Record as: `google_gmb_client_id`, `google_gmb_client_secret`.

(Medium is skipped — it takes a personal integration token in the SocialX UI
and Medium no longer issues new ones. YouTube is already configured.)

## Final deliverable

As we finish each platform, keep a running tally. At the end (or whenever I
say "wrap up"), output:

1. A table: platform · status (done / pending review / blocked-on) · the
   collected values, using exactly the `record as` key names above.
2. A single ready-to-run command containing every collected pair, in this
   exact shape (omit platforms we didn't finish):

```bash
ssh gpu 'TOKEN=$(cat ~/.vault-admin-token); kubectl exec -i -n vault vault-0 -- \
  env VAULT_TOKEN="$TOKEN" VAULT_ADDR=http://127.0.0.1:8200 \
  vault kv patch secret/t6-apps/socialx/config \
  reddit_client_id=VALUE reddit_client_secret=VALUE \
  linkedin_client_id=VALUE linkedin_client_secret=VALUE'
```

That command feeds my Vault → External Secrets → auto-restart pipeline; the
platforms become connectable in the SocialX UI within ~5 minutes of me
running it.

3. A short list of any follow-ups (pending reviews, missing privacy policy,
   quota approvals) so I can track them.

Start with Reddit. Before each platform, give me a one-line heads-up of what
you're about to do and what you'll need from me.
