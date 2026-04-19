---
id: repo-root
title: Volley Drills
status: active
stage: validation
type: hub
summary: "Repo hub: quick start, top-level layout, and links into the canonical docs."
authority: repo layout and human-facing orientation
last_updated: 2026-04-15
depends_on:
  - AGENTS.md
  - docs/catalog.json
---

# Volley Drills

Beach volleyball personal training app for self-coached amateurs: structured session planning, courtside run mode, and rules-based adaptation.

**Stage**: Phase 0 validation.  
**Prototype**: runnable v0a PWA under `app/`.  
**Gate**: M001 remains blocked on field-test evidence (`D91`).

## Quick Start

```bash
cd app
npm install
npm run dev
```

Expected URL: `http://localhost:5173`

## Start Here

- `AGENTS.md` — canonical prose repo contract
- `docs/catalog.json` — machine-readable doc map and routing
- `docs/README.md` — editorial index for the docs tree
- `app/README.md` — current prototype workspace status

Compatibility surfaces:

- `CLAUDE.md`
- `llms.txt`
- `agent-manifest.json`

These exist to point tools back to `AGENTS.md` and `docs/catalog.json`; they are intentionally thin.

## Repo Layout

| Path | Role | Start here |
| --- | --- | --- |
| `docs/` | product canon, milestones, specs, research, ops docs | `docs/README.md` |
| `app/` | runnable validation prototype | `app/README.md` |
| `scripts/` | validation and utility scripts (`bash`) | `scripts/validate-agent-docs.sh` |
| `.cursor/` | repo rules, hooks, and worktree setup | `.cursor/rules/` |
| `research-output/` | frozen provenance and raw research inputs | `research-output/README.md` |
| `archive/` | retired repo scaffolding kept as historical reference | `archive/agent-control-plane/README.md` |
| `test-screenshots/` | validation screenshots referenced by docs and QA notes | `test-screenshots/README.md` |

## Environment

Repo automation expects **WSL or Linux + bash + python3**. Editing from Windows Cursor is fine, but the repo scripts are not PowerShell-first.

## Deploy

The prototype is live at https://volleydrills.nicholascorneau.workers.dev as a Cloudflare Worker. See `docs/ops/deploy-cloudflare-worker.md` for manual, Workers Builds, and GitHub Actions paths. Shortest path:

```bash
cd app
npx wrangler login   # once per machine
npm run deploy
```

## Key Links

- Product principles: `docs/vision.md`
- Decision log: `docs/decisions.md`
- PRD and object model: `docs/prd-foundation.md`
- Roadmap: `docs/roadmap.md`
- Prototype feedback backlog: `docs/research/2026-04-12-v0a-runner-probe-feedback.md`
