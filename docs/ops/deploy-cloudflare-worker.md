---
id: deploy-cloudflare-worker
title: Deploy to Cloudflare Worker
status: active
stage: ops
type: ops
authority: deployment runbook for the `volleydrills` Cloudflare Worker
last_updated: 2026-04-19
depends_on:
  - app/wrangler.jsonc
  - app/package.json
  - .github/workflows/deploy-cloudflare.yml
---

# Deploy to Cloudflare Worker

The `app/` Vite build is published as a static-asset Cloudflare Worker named `volleydrills`.

- **Production URL**: https://volleydrills.nicholascorneau.workers.dev
- **Worker name**: `volleydrills` (see `app/wrangler.jsonc`)
- **Asset directory**: `app/dist` (SPA fallback handled by `not_found_handling: "single-page-application"`)

> Historical note: an earlier iteration of this project ran on Cloudflare Pages. It now runs on Cloudflare Workers with static assets. If you see references to Pages in older commits or docs, they are stale.

## TL;DR

- **Pushing to `main` does not auto-deploy by default.** Pick one of the automated paths in [Automated deploys](#automated-deploys) to make it do so.
- Manual one-shot deploy from your machine: `cd app && npm run deploy`.

## Prerequisites

- Cloudflare account with Workers enabled
- Access to the `volleydrills` Worker in the dashboard
- For local deploys: `wrangler login` completed once per machine (OAuth browser flow)

## Manual deploy

Use this to ship from your workstation.

```bash
cd app
npx wrangler login      # once per machine, opens a browser
npm run deploy          # runs build + wrangler deploy
```

`npm run deploy` is defined in `app/package.json` and calls `npm run build && wrangler deploy`. The build writes `app/dist/`; Wrangler uploads that directory per `app/wrangler.jsonc`.

To preview the deploy without publishing:

```bash
npm run deploy:dry-run
```

> **Warning**: `wrangler deploy` ships your current working tree's build, not the `main` branch. Commit or stash uncommitted changes first if you want prod to match `main`.

## Automated deploys

Two supported options. Pick one — running both is redundant.

### Option A — Cloudflare Workers Builds (recommended)

Cloudflare builds and deploys on its own infrastructure when you push to GitHub. No secrets to manage in the repo.

1. Dashboard -> **Workers & Pages** -> `volleydrills` -> **Settings** -> **Builds**
2. Click **Connect** and authorize the `NickCorneau/volley_drills` GitHub repo
3. Configure:
   - **Production branch**: `main`
   - **Root directory**: `app`
   - **Build command**: `npm run build`
   - **Deploy command**: `npx wrangler deploy`
4. Save. The next push to `main` will trigger a build + deploy. Build logs appear in the dashboard under **Deployments**.

Preview deploys for non-`main` branches can be enabled in the same Builds panel if desired.

### Option B — GitHub Actions (`.github/workflows/deploy-cloudflare.yml`)

A committed workflow that builds and deploys via `cloudflare/wrangler-action@v3`.

Triggers:

- push to `main` (paths: `app/**` or the workflow file)
- push of a tag matching `v*` (e.g. `v0.3.0`)
- manual `workflow_dispatch` from the Actions tab

One-time setup — add two **repository secrets** (Settings -> Secrets and variables -> Actions -> New repository secret):

| Name | Value | How to get it |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | Scoped API token | Dashboard -> **My Profile** -> **API Tokens** -> **Create Token** -> template **"Edit Cloudflare Workers"**. Scope to the account that owns `volleydrills`. |
| `CLOUDFLARE_ACCOUNT_ID` | Your account ID | Dashboard -> **Workers & Pages** -> right sidebar shows **Account ID**. |

Once both secrets are set, any push to `main` touching `app/**` will deploy. To deploy a tagged release:

```bash
git tag v0.3.0
git push origin v0.3.0
```

## Tagged releases

`git push origin vX.Y.Z` triggers option B (if enabled) and still works alongside option A (option A deploys every push; tags are harmless no-ops). Use tags when you want an auditable "this commit went to prod" marker; for day-to-day iteration, pushing to `main` is enough.

## Verifying a deploy

1. Dashboard -> `volleydrills` -> **Deployments** shows the new version + timestamp
2. Load https://volleydrills.nicholascorneau.workers.dev and hard-refresh (Ctrl-Shift-R)
3. Deep links: navigate to `/run`, `/safety`, `/complete` directly and refresh each — SPA fallback should serve `index.html`
4. DevTools -> Application -> Service Workers: confirm a new `sw.js` is installing and activating

> PWA caching can make a fresh deploy appear stale on an already-installed client. The service worker in `vite-plugin-pwa` uses `skipWaiting`-style precaching; close all tabs of the app and reopen, or uninstall the PWA, to force the update.

## Rollback

Dashboard -> `volleydrills` -> **Deployments** -> pick a prior version -> **Rollback**. This is instant and does not touch git.

## Troubleshooting

- **"You are not authenticated"** on local deploy: run `npx wrangler login` and retry.
- **GitHub Action fails with auth error**: verify both `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set and that the token's scope includes the correct account + the "Workers Scripts: Edit" permission.
- **Deploy succeeded but prod looks unchanged**: it's the installed PWA's service worker serving cached assets. Close all app tabs, or uninstall and reinstall the home-screen app, to pick up the new SW.
- **404 on `/run` or other deep links**: confirm `app/wrangler.jsonc` still has `"not_found_handling": "single-page-application"`.
- **Build fails in CI with peer-dep errors**: `app/package.json` pins `vite-plugin-pwa`'s `vite` peer via `overrides`; if this ever breaks, set `NPM_FLAGS=--legacy-peer-deps` for option A, or add `env: { NPM_CONFIG_LEGACY_PEER_DEPS: true }` to the workflow for option B.
