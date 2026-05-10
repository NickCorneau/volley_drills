---
id: repo-root
title: Volleycraft
status: active
stage: validation
type: hub
summary: "Repo hub: quick start, top-level layout, and links into the canonical docs."
authority: repo layout and human-facing orientation
last_updated: 2026-05-10
depends_on:
  - AGENTS.md
  - docs/catalog.json
  - docs/status/current-state.md
---

# Volleycraft

Volleyball personal training app for self-coached amateurs: structured session planning, courtside run mode, and rules-based adaptation. Beach-first in scope for M001 (see `docs/decisions.md` `D125` for the product-name rationale and beach-first / volleyball-inclusive positioning).

Built and tested in pair-mode with one volleyball partner across the M001 founder-use window. The partner came back unprompted within 24 hours of first use, has continued running sessions both with the founder and on his own, and the two now use it together at every practice (~2x weekly). Both report it makes training easier and feels like it's helping them get better.

**Stage**: Phase 0 validation, operating in `D130` founder-use mode through 2026-07-20.
**Build**: v0b Starter Loop is the M001 base. M001 build phase complete as of 2026-05-08 (Tier 1a + Tier 1b Layer A + Tier 1c shipped, Tier 2 deferred behind Condition 3); validation phase active through the 2026-07-20 `D130` re-eval.
**Live**: https://volleydrills.nicholascorneau.workers.dev
**Status**: detailed posture and recent shipped history live in `docs/status/current-state.md`. The `D91` retention gate is deferred (not dropped). `D130` partner-use Condition 3 is at provisional pass — strengthened by the partner's T+1 unprompted message, T+2 instrumented session, and sustained co-use — with the final 30-day quiet-window close on 2026-05-21.

## Quick Start

```bash
npm --prefix app install
npm run dev
```

Expected URL: `http://localhost:5173`

Common root checks delegate to the runnable app under `app/`:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run validate:docs
```

Use `npm run validate` for the root typecheck + lint + unit test + agent-doc validation bundle. App-local commands in `app/README.md` remain supported.

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
- Current generated-plan diagnostics report: `docs/reviews/2026-05-01-generated-plan-diagnostics-report.md`
- v0b status registry (what's landed, what's deferred): `docs/plans/2026-04-16-003-rest-of-v0b-plan.md`
- v0a retrospective feedback backlog: `docs/research/2026-04-12-v0a-runner-probe-feedback.md`
