---
id: repo-root
title: Volleycraft
status: active
stage: validation
type: hub
summary: "Repo hub: quick start, top-level layout, and links into the canonical docs."
authority: repo layout and human-facing orientation
last_updated: 2026-04-27
depends_on:
  - AGENTS.md
  - docs/catalog.json
  - docs/status/current-state.md
---

# Volleycraft

Volleyball personal training app for self-coached amateurs: structured session planning, courtside run mode, and rules-based adaptation. Beach-first in scope for M001 (see `docs/decisions.md` `D125` for the product-name rationale and beach-first / volleyball-inclusive positioning).

**Stage**: Phase 0 validation, operating in `D130` founder-use mode through 2026-07-20.  
**Build**: v0b Starter Loop is the M001 base. M001 Tier 1a and Tier 1b Layer A have shipped; remaining Tier 1b is gated by logged demand.  
**Live**: https://volleydrills.nicholascorneau.workers.dev  
**Status**: detailed posture and recent shipped history live in `docs/status/current-state.md`. The `D91` retention gate is deferred (not dropped); the active read is the `D130` partner-use Condition 3 final close on 2026-05-21.

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
- `docs/status/current-state.md` — current posture and recent shipped history
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
- v0b status registry (what's landed, what's deferred): `docs/plans/2026-04-16-003-rest-of-v0b-plan.md`
- v0a retrospective feedback backlog: `docs/research/2026-04-12-v0a-runner-probe-feedback.md`
