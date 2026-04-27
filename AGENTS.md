---
id: agents
title: Agent Orientation
status: active
stage: validation
type: agent-contract
summary: "Canonical prose repo contract: current state, read order, source-of-truth order, and repo-wide working constraints."
authority: repo-wide routing, working constraints, and agent-facing orientation
last_updated: 2026-04-27
depends_on:
 - docs/catalog.json
 - docs/vision.md
 - docs/decisions.md
 - docs/ops/agent-operations.md
---

# Agent Orientation

## Identity

**Volleycraft** — volleyball training workflow app for self-coached amateurs. Beach-first in M001 scope; volleyball-inclusive long-run (see `D125` in `docs/decisions.md` and `docs/research/product-naming.md` for the naming rationale, the 13-test rubric, and the rename-scope guardrails — including which identifiers were deliberately not renamed). The v0b Starter Loop (React + Dexie + PWA) is **feature-complete** under `app/` as the D91 field-test artifact (`D119`); Phases A/B/C/E/F all landed 2026-04-17 → 2026-04-19. M001 full build remains gated on D91 field-test evidence against v0b.

## Purpose

Give agents one durable, concise repo contract for current state, read order, source-of-truth order, and repo-wide working constraints.

## Use This File When

- entering the repo cold
- deciding what to read next
- resolving source-of-truth conflicts
- checking repo-wide constraints or current project posture
- updating agent-facing guidance

## Not For

- replacing canonical product docs such as `docs/vision.md`, `docs/decisions.md`, or `docs/prd-foundation.md`
- acting as the exhaustive machine index
- storing raw research detail or implementation history
- duplicating deep control-plane or archive detail that belongs elsewhere

## Update When

- the repo-wide read order changes
- source-of-truth order changes
- current phase, milestone, or blocking gate changes
- repo-wide automation expectations materially change
- canonical entry surfaces change

## Machine Contract

- `AGENTS.md` is the canonical prose repo contract.
- `docs/catalog.json` is the machine-readable doc map and routing table.
- `README.md` is the human repo hub.
- `docs/README.md` is the prose editorial index for `docs/`.
- `docs/ops/agent-operations.md` is the current runtime/operations guide.
- `docs/ops/agent-documentation-contract.md` owns doc-surface conventions and change propagation.
- `CLAUDE.md`, `llms.txt`, and `agent-manifest.json` are thin compatibility surfaces only.

## Current State

- **Phase**: 0 (validation)
- **Mode**: `D130` founder-use mode (2026-04-20 → 2026-07-20 re-eval). D91 retention gate is **deferred**, not dropped.
- **Posture**: v0b Starter Loop is the M001 base; Tier 1a landed 2026-04-21 (`docs/plans/2026-04-20-m001-tier1-implementation.md`); 2026-04-22 partner-walkthrough polish bundle landed (6 editorial items); 2026-04-23 walkthrough closeout polish landed (4 items: 3-anchor RPE 3/5/7, Quick-tags removed, Submit→Done with Finish-later as link, Review-window copy + Safari caveat compressed); 2026-04-24 **Screen Wake Lock + audio-priming infrastructure** landed (gesture-bound from Safety Continue, releases on pause/transition, re-acquires on visibility, fallback when unsupported); 2026-04-26 pre-D91 editorial polish landed (6 items, `docs/plans/2026-04-26-pre-d91-editorial-polish.md`) and the founder pair pass session fired the Tier 1b `P2-3` trigger (`docs/research/founder-use-ledger.md`); **`D133` ratified and shipped 2026-04-27** — pair rep-capture moved to per-drill Difficulty (required) + Good/Total (optional) on `/run/check` (`DrillCheckScreen`) after completed blocks, Transition refocused on Up Next, **Dexie schema bumped to v5** with `perDrillCaptures`, session-level Good/Total card removed from Review for count drills; **Tier 1b Layer A drill authoring shipped same day** — `d31`, `d33`, `d40`, `d42` plus safe same-chain progression links; `d36` deferred to `O7`, `d43` deferred to `D101`; same-day perf and validation hardening pass also landed; **2026-04-27 reconciled-list editorial polish (`R11` + `R13`) shipped** (`docs/plans/2026-04-27-skip-review-and-investment-footer.md`) — Home `Skip review` confirm lifted from inline two-step into a centered `SkipReviewModal` matching `End session early?`; quiet `Logged: N session{s} · H:MM total` Settings footer gated on `count > 0`; `R7` (Beach Prep Three truncate-with-expand) and `R14` (accent-color demotion) demoted with rationale recorded; **2026-04-27 solo-vs-pair variant sweep shipped** (`docs/plans/2026-04-27-solo-vs-pair-variant-sweep.md`) — 8 new tuned Pair variants on `d01`/`d05`/`d22`/`d31`/`d38`/`d39`/`d40`/`d33` (each with partner-aware copy, success metric, and `participants: {min: 2, ideal: 2, max: 2}`); `d33-solo-net` split into `d33-solo` + `d33-pair`; `participants.max=1` tightened on `d22-solo`/`d33-solo`/`d38-solo`/`d39-solo`; warmup/cooldown labels relabeled `Solo`→`Any` on `d25`/`d26`/`d28` (variant IDs preserved for migration safety); new `participants_label_mismatch` `catalogValidation` rule guards against `Solo`/`Pair` label drift from `participants.min/max`. Live at [https://volleydrills.nicholascorneau.workers.dev](https://volleydrills.nicholascorneau.workers.dev).
- **Active milestone**: `M001` Solo Session Loop (Tier 1b Layer A shipped; remaining Tier 1b work is gated by logged demand)
- **Next milestone in queue**: `M002` Weekly Confidence Loop (post-M001 self-coached follow-on, per `D124`)
- **Current gate**: `D130` Condition 3 (partner unprompted open within 30 days) — **provisional pass** (Seb T+1-day open 2026-04-22); final read-out 2026-05-21. Conditions 1 (solo-first ≥40%) and 2 (outside-app planning events) tracked in `docs/research/founder-use-ledger.md` weekly. Tier 1b `P2-3` unlock condition met 2026-04-26.
- **Prototype feedback**: start with `docs/research/2026-04-12-v0a-runner-probe-feedback.md` for any retrospective work against v0a; current v0b execution status lives in `docs/plans/2026-04-16-003-rest-of-v0b-plan.md`. Most recent partner-walkthrough synthesis is `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md`. Pair rep-capture framing options: `docs/research/2026-04-26-pair-rep-capture-options.md`; Tier 1b shipped implementation plans: `docs/plans/2026-04-26-pair-rep-capture-tier1b.md` and `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md`.
- **Key open questions**: `O4`, `O5`, `O6`, `O7`, `O11`, `O12`, `O14`, `O15`, `O16`, `O18`, `O19` in `docs/decisions.md`.

## Cold-Start Protocol

Read only as much as the task needs.

1. `AGENTS.md`
2. `docs/catalog.json`
3. Load the smallest relevant pack:
 - Product direction: `docs/vision.md` -> `docs/decisions.md` -> `docs/prd-foundation.md`
 - Milestone/spec work: `docs/milestones/m001-solo-session-loop.md` -> relevant `docs/specs/`
 - Prototype work: `docs/research/2026-04-12-v0a-runner-probe-feedback.md` -> `app/README.md`
 - Research: `docs/research/README.md` -> narrowest relevant note
 - Design / UX work: `docs/design/README.md` -> referenced design-canonical doc (brand / visual / outdoor)
 - Docs editing: `docs/README.md` -> `docs/ops/agent-documentation-contract.md`
 - Agent/runtime guidance: `docs/ops/agent-operations.md`

## Source-of-Truth Order

When guidance conflicts, higher rank wins:

1. `docs/vision.md`
2. `docs/decisions.md`
3. `docs/prd-foundation.md`
4. `docs/roadmap.md`
5. `docs/milestones/`
6. `docs/specs/`
7. `docs/research/`
8. `docs/ops/`
9. `AGENTS.md`
10. `CLAUDE.md`

Rules of thumb:

- `docs/decisions.md` is the first stop for anything that sounds decided, open, or ruled out.
- Research informs canon; it does not silently override canon.
- Compatibility surfaces stay pointer-oriented and should not become second sources of truth.

## Stable IDs And Doc Conventions

- `P*` — principles in `docs/vision.md`
- `D*` — decisions in `docs/decisions.md`
- `O*` — open questions in `docs/decisions.md`
- `M*` — milestones in `docs/milestones/`
- `R*` — requirements in specs where used

Durable docs under `docs/` should keep YAML frontmatter and explicit ownership. Prefer cross-references over copying canon into multiple places.

## Operational Constraints

- This repo is Cursor-first.
- Automation expects **WSL or Linux + bash + python3**. Editing from Windows Cursor is fine, but repo scripts are not PowerShell-first.
- Keep autonomous work bounded: one task, explicit verification, explicit escalation triggers.
- The older queued-task control plane is archived; do not assume `ops/agent/` is an active workflow surface.
- Keep recommendations aligned with courtside mobile use, low typing, and local-first behavior.
- New durable findings should move into canonical docs; `research-output/` remains frozen provenance.

## Verification Hints

- Agent/doc surface changes: `bash scripts/validate-agent-docs.sh`
- App changes: run the narrowest relevant `app/` verification commands

## Learned User Preferences

- Prefer product clarity and the smallest useful MVP over premature feature expansion.
- Favor structured workflows over chat-first UX.
- Optimize for fast, low-typing, readable courtside interaction.
- Optimize for joy, trust, and investment together: the app should feel like a main training tool, not a data-entry form.
- Prefer deleting or demoting stale documentation rather than leaving misleading material at canonical tiers.

## Learned Workspace Facts

- The v0b Starter Loop under `app/` is real, runnable, and deployed; M001 work continues in tiers on top of it under `D130` founder-use mode. Older planning docs may describe v0a or pre-build state. Treat `docs/plans/2026-04-16-003-rest-of-v0b-plan.md` §1 and §6 as the canonical v0b "what landed" registry; treat `docs/plans/2026-04-20-m001-tier1-implementation.md`, `docs/plans/2026-04-26-pair-rep-capture-tier1b.md`, `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md`, and `docs/plans/2026-04-27-solo-vs-pair-variant-sweep.md` as the M001 Tier 1a / Tier 1b registries. The current Dexie schema is **v5** (`perDrillCaptures` added for `D133`); rep-capture lives on `/run/check` (`DrillCheckScreen`), not on Transition or Review. Tier 1b Layer A authored four drills (`d31`, `d33`, `d40`, `d42`); `d43 Triangle Setting` remains unauthored because its BAB source form is 3-player and waits for `D101`. The 2026-04-27 solo-vs-pair variant sweep authored 8 tuned Pair variants on existing `m001Candidate: true` drill families (`d01`/`d05`/`d22`/`d31`/`d33`/`d38`/`d39`/`d40`); `d22-pair` and `d22-solo` carry `equipment.balls: 'many'` and are correctly excluded by `hasUnmodeledRequirements` in `sessionBuilder` pending `D102` equipment-context resolution. The `participants_label_mismatch` `catalogValidation` rule prevents future `Solo`/`Pair` label drift from `participants.min/max`.
- The active automation environment is WSL/bash-friendly.
- Historical control-plane scaffolding now lives in `archive/agent-control-plane/`.