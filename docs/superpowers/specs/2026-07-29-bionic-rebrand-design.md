# Replace user-visible Postiz branding with Bionic

**Date:** 2026-07-29
**Status:** Approved

## Goal

Every brand name a user reads in the web UI should say "Bionic". Nothing else changes.

## Scope

### In

| Surface | Count | Detail |
|---------|-------|--------|
| Translation values | 234 | 16 locales: `ar bn de en es fr he it ja ka_ge ko pt ru tr vi zh` |
| Frontend `Postiz` | 60 | `apps/frontend/src` — titles, headings, body copy |
| Frontend `Gitroom` | 23 | the `isGeneralServerSide() ? 'Postiz' : 'Gitroom'` ternaries |
| Logo components | 2 | `new-layout/logo.tsx`, `ui/logo-text.component.tsx` |

### Out, and why

- **`package.json` names** (`postiz-backend`, `postiz-frontend`, …) — renaming breaks module
  resolution and the Docker build, for no user-visible gain.
- **`@gitroom/*` import paths** — internal, never rendered.
- **`LICENSE`, `ICLA`, `CCLA`, `CONTRIBUTING`, `README`** — legal and attribution text. The
  upstream project is AGPL-3.0; attribution stays intact.
- **Docker / infra scripts, `sonar-project.properties`** — not user-visible.
- **`apps/extension`, `apps/backend`** — the browser extension and transactional emails are
  user-facing but are not "the pages (website)". Excluded by agreement; revisit separately.

## Decisions

Three ambiguities were resolved by the user rather than assumed:

1. **Logo assets → plain text wordmark.** No Bionic artwork exists. Both logo components
   currently draw hardcoded SVG paths spelling "Postiz". They are replaced with styled text
   reading "Bionic", keeping the existing purple `#612BD3` and the components' current
   dimensions so surrounding layout does not shift. Component names and exports are unchanged,
   so no call sites move.

2. **"Gitroom" also becomes "Bionic".** 23 places render `Gitroom` when
   `isGeneralServerSide()` is false. Leaving them means a foreign brand appears if that flag
   ever flips. The ternaries collapse to a single literal, removing the flag dependency for
   brand strings entirely.

3. **Postiz service references: rename text *and* strip the links.** Copy naming the N8N
   custom node, the MCP server, `docs.postiz.com` and `discord.postiz.com` describes services
   Bionic does not operate. Renaming the text while the link still resolved to Postiz would
   mislead users, so the outbound links are removed rather than relabelled.

## Approach

### Translation files

Replace capitalised `Postiz` → `Bionic` in values only. Verified before editing:

- Keys containing capitalised `Postiz`: **0**
- Values containing lowercase `postiz`: **0**

So a capital-sensitive replacement touches values exclusively. Keys such as
`faq_can_i_trust_postiz_gitroom` are lookup identifiers — renaming them would require editing
every call site and risks silent missing-translation fallbacks, for no visible benefit.

### Frontend strings

Both brands collapse to `Bionic`:

```tsx
title: `${isGeneralServerSide() ? 'Postiz' : 'Gitroom'} Settings`   // before
title: 'Bionic Settings'                                            // after
```

## Risks

**Translations are machine-generated.** `i18n.json` configures an OpenAI provider and
`i18n.lock` tracks generated output. Editing values directly puts them out of sync with the
lock, so a future i18n run could regenerate and revert these edits. Flagged rather than worked
around; resolving it means regenerating or updating the lock, which is a separate decision.

**Layout shift from the wordmark.** The replacement text may not occupy the same width as the
original SVG paths. Mitigated by preserving each component's declared dimensions.

## Verification

1. `grep -c Postiz` and `grep -c Gitroom` over `apps/frontend/src` and the locale
   directory → expect `0`.
2. Excluded paths unchanged: `package.json` names, `LICENSE`, `CONTRIBUTING`, infra scripts.
3. Frontend typechecks.
4. No remaining `*.postiz.com` links in user-visible frontend copy.
