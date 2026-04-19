---
id: deploy-cloudflare-pages
title: Deploy to Cloudflare Pages (superseded)
status: superseded
stage: ops
type: ops
authority: historical pointer to the current Worker deployment runbook
last_updated: 2026-04-19
superseded_by: docs/ops/deploy-cloudflare-worker.md
depends_on:
  - docs/ops/deploy-cloudflare-worker.md
---

# Deploy to Cloudflare Pages (superseded)

This project no longer deploys to Cloudflare Pages. The live site at https://volleydrills.nicholascorneau.workers.dev is a Cloudflare **Worker** with static assets, configured via `app/wrangler.jsonc`.

See `docs/ops/deploy-cloudflare-worker.md` for the current manual, Workers Builds, GitHub Actions, and tagged-release deploy paths.

The Pages flow was retired in commit `dce2a3a` / `2782c79` / `32b5ff3` (2026-04-12) when the project switched to a Worker to get first-party SPA asset handling without a `_redirects` file.
