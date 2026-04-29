---
id: current-state
title: Current State
status: active
stage: validation
type: status
summary: "Canonical current-state snapshot and recent shipped-history log for Volleycraft."
authority: current project posture, recent shipped history, and active validation gates
last_updated: 2026-04-28
depends_on:
  - AGENTS.md
  - docs/catalog.json
  - docs/decisions.md
  - docs/research/founder-use-ledger.md
---

# Current State

## Purpose

Keep detailed project posture and recent shipped-history out of entry surfaces while preserving one canonical place for agents to inspect current state.

## Use This File When

- checking what has shipped recently
- updating `AGENTS.md` or `docs/catalog.json` current-state pointers
- deciding whether a planned change is inside M001 / D130 founder-use mode

## Not For

- replacing product canon in `docs/vision.md`, `docs/decisions.md`, or `docs/prd-foundation.md`
- replacing dated plans, specs, or research notes
- storing raw field notes that belong in `docs/research/`

## Update When

- active phase, milestone, gate, or deployment posture changes
- a shipped implementation materially changes M001 behavior or agent routing
- a new status/history doc supersedes this one

## Machine Contract

- `AGENTS.md` and `docs/catalog.json` should summarize and point here rather than duplicating the full history.
- Dated plans and research notes remain the detailed source for individual shipped changes.
- Stable decision IDs in `docs/decisions.md` remain authoritative over status prose.

## Snapshot

- **Phase**: 0 validation.
- **Mode**: `D130` founder-use mode through 2026-07-20 re-evaluation; D91 retention gate is deferred, not dropped.
- **Active milestone**: `M001` Solo Session Loop. Tier 1a and Tier 1b Layer A have shipped; remaining Tier 1b work is gated by logged demand.
- **Next milestone**: `M002` Weekly Confidence Loop, post-M001.
- **Runtime**: Cursor-first repo; automation expects WSL/Linux, bash, and python3.
- **App**: v0b Starter Loop under `app/` is runnable and deployed at <https://volleydrills.nicholascorneau.workers.dev>.
- **Persistence**: Dexie schema is v5; `perDrillCaptures` live on the `/run/check` Drill Check surface.
- **Current gate**: `D130` Condition 3 is a provisional pass from Seb's T+1-day open on 2026-04-22; final read-out is 2026-05-21. Conditions 1 and 2 are tracked weekly in `docs/research/founder-use-ledger.md`.

## Recent Shipped History

- 2026-04-21: M001 Tier 1a landed in `docs/plans/2026-04-20-m001-tier1-implementation.md`.
- 2026-04-22 to 2026-04-24: partner-walkthrough polish, review closeout polish, and wake-lock/audio-priming infrastructure shipped.
- 2026-04-26: pre-D91 editorial polish shipped, and the founder pair pass session fired the Tier 1b `P2-3` trigger.
- 2026-04-27: `D133` pair rep-capture shipped. Pair capture moved to per-drill Difficulty plus optional Good/Total on `/run/check`; Transition refocused on Up Next; Review uses the per-drill aggregate; Dexie schema bumped to v5.
- 2026-04-27: Tier 1b Layer A authored `d31`, `d33`, `d40`, and `d42`; `d36` waits on `O7`, and `d43` waits on `D101`.
- 2026-04-27: reconciled-list editorial polish shipped: Home skip-review confirm moved to `SkipReviewModal`, Settings gained the quiet logged-session footer, and `R7`/`R14` were demoted with rationale.
- 2026-04-27: solo-vs-pair variant sweep added tuned Pair variants and the `participants_label_mismatch` catalog validation guard.
- 2026-04-27: V0B-28 per-drill success criterion moved into the Drill Check count surface through `getBlockSuccessRule`.
- 2026-04-27: cca2 dogfeed synthesis captured eight validated findings (F1–F8) and same-day fixes for `d26` cooldown copy plus technique/movement-proxy slot picking.
- 2026-04-27: cca2 F1/F8 follow-ups shipped role/skill eyebrows, removed per-block rationale prose from Run/Transition, added courtside-copy rule 6, swept m001 candidate drill instructions, and centered Run/Transition/DrillCheck headers with grid layout.
- 2026-04-28: app architecture pass U0–U10 landed (`docs/plans/2026-04-26-app-architecture-pass.md`, status: complete). Atomic-commit cleanup, field-merging review-draft writes (`patchReviewDraft`), capture-domain consolidation with a metric-strategy registry, `services/review/` SRP split, new pure `app/src/model/` layer with `db/` demoted to adapter, controller decomposition + `app/src/platform/` for browser-runtime concerns, forward-compatibility seams (`SessionParticipant[]`, `SkillVector`, `ExportSession` adapter, `CoachPayload` type), the P12 screen contract registry + sunset rule for `runFlowInteractionContract`, refreshed `.cursor/rules/` + testing pyramid map, durable `docs/ops/app-architecture-guidance.md` for future agents, and a final holistic red-team gate (one P2 controller-import fix; two P3 follow-ups recorded). 10 atomic commits, 1065/1065 Vitest pass, typecheck + production build clean.
- 2026-04-28: per-drill-capture-coverage Phase 1 (gap 2b) and per-drill-success-criterion (V0B-28 surface-move) close-out — both plans shipped inside the U2 capture-domain consolidation (`11fed34`) and stale plan statuses synced. The Drill Check eligibility decision is now keyed off the metric-type strategy registry in `app/src/domain/capture/eligibility.ts::resolveDrillCheckCaptureEligibility`: count-eligible drills (`pass-rate-good` / `reps-successful`) capture regardless of slot type (only `warmup` / `wrap` excluded), so `d10-pair` at technique and `d03-pair` at movement_proxy stop falling silent (cca2 dogfeed F1 + F2 gap 2b closed). The V0B-28 forced-criterion prompt now renders the per-drill success rule + anti-generosity nudge inside the expanded `Add counts` body, sourced from `variant.successMetric.description` via `getBlockSuccessRule`; `PassMetricInput`'s rate label is skill-neutral `% good`; `d33`'s `successMetric.description` reads the per-attempt rule `Serve lands in the called zone.` on both Solo and Pair siblings; spec `primarySkillMetric` block reads `the drill check surface (post-D133)` with the source-from-record clause. Phase 2 (gap 2a, non-count main_skill drills get a per-`successMetric.type` capture story) stays gated on (i) Phase 1 live for ≥4 sessions, OR (ii) ≥2 founder-ledger sessions where Difficulty-only is explicitly noted as insufficient, OR (iii) partner walkthrough ≥P1 specifically on the gap. Verification: 1065/1065 Vitest, lint clean, build clean.
- 2026-04-28: build-17 founder + Seb pair dogfeed (15 min, no net, RPE 5, completed). Positive validation for the new role/skill eyebrow + drill subcategory cues and for the optional-count posture (Seb: "I like the option to count… you don't always want to, or feel forced like you need to"). Repeated frictions: cooldown / sub-block pacing beeps were missing or inaudible despite the 2026-04-24 wake-lock + audio-primer ship, and the landing-page / "option to choose a new difficulty setting" remained Seb's "consistent point." Routing: audio cues stay an **investigation step** under the `docs/roadmap.md` screen-lock audio-suspend risk bullet, not a new feature scope; focus-picker and skill-level mutability stay **evidence-accumulating, not triggered** under the Tier 1c and sibling-trigger language in `docs/plans/2026-04-20-m001-tier1-implementation.md`; the optional-count posture is now a pre-registered design constraint on any future Framing C live counter (`docs/plans/2026-04-26-pair-rep-capture-tier1b.md`). Findings: `docs/research/2026-04-28-build17-pair-dogfeed-feedback.md`. Ledger: `docs/research/founder-use-ledger.md` 2026-04-28 row.

## Routing Notes

- For v0b landed status, start with `docs/plans/2026-04-16-003-rest-of-v0b-plan.md`.
- For M001 Tier 1a / Tier 1b shipped registries, use the dated plans named in `docs/catalog.json`.
- For active founder-use evidence, use `docs/research/founder-use-ledger.md`.
- For open questions and decided constraints, use `docs/decisions.md`.
