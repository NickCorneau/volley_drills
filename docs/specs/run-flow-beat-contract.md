---
id: spec-run-flow-beat-contract
title: Run-Flow Beat Contract
status: active
stage: validation
type: spec
summary: "The beat contract for the run flow (Transition / Run / Drill Check / Review): each athlete-facing field gets exactly one full-weight home, with named demoted and must-not-render placements, so the flow reads as one calm instrument. Stages 1-4 are shipped (D164, D165, D166, D167); Stage 4 collapsed Transition into a read-first Run get-ready beat, leaving Transition a reversible orphan."
authority: canonical per-field placement contract for the run-flow beats and the run-flow label lexicon; gates where each athlete-facing field may render at full weight
last_updated: 2026-06-30
depends_on:
  - docs/decisions.md
  - docs/brainstorms/2026-06-23-run-flow-beat-contract-requirements.md
  - docs/plans/2026-06-23-001-feat-run-flow-stage1-beat-contract-plan.md
  - docs/plans/2026-06-23-002-feat-run-flow-stage2-recovery-peek-plan.md
  - docs/plans/2026-06-23-003-feat-run-flow-stage3-4-continuity-collapse-plan.md
  - docs/specs/m001-courtside-run-flow.md
  - docs/specs/stress-rung-taxonomy.md
  - docs/research/brand-ux-guidelines.md
  - .cursor/rules/courtside-copy.mdc
decision_refs:
  - D153
  - D154
  - D157
  - D163
  - D164
  - D165
  - D166
  - D167
  - D169
  - D171
  - D172
---

# Run-Flow Beat Contract

## Purpose

The run flow is a sequence of **beats** — Transition, Run, Drill Check, Review — that a winded athlete reads one at a time. The failure mode this contract prevents is **duplication across beats**: the same field rendered at full weight on two screens one tap apart (the 2026-04-22 Transition "mirror Run" dress-rehearsal treatment), which makes each beat read as a paragraph instead of one instruction. The contract assigns **each athlete-facing field exactly one full-weight home**, with explicit demoted and must-not-render placements. It is consulted whenever a run-flow surface adds, moves, or removes a field.

## Use This Doc When

- adding or relocating any athlete-facing field on Transition / Run / Drill Check / Review
- deciding whether a field may render on a second run-flow surface
- choosing run-flow action / cue labels (use the lexicon below)
- reasoning about the staged rollout or what is deferred

## Not For

- the screen/route structure and timer mechanics (see `docs/specs/m001-courtside-run-flow.md`)
- stress-rung semantics or per-rung content authoring (see `docs/specs/stress-rung-taxonomy.md`)
- DO-CONFIRM / READ-DO copy registers and the one-cue rule (see `.cursor/rules/courtside-copy.mdc` rules 12/12a/13/14)

## Reading Registers

- **Run get-ready** is **READ-DO** (the post-Stage-4 collapse home, `D167`): the athlete is setting up; they read to learn what to do next. Pre-collapse this register lived on the **Transition** beat, now a reversible orphan.
- **Run (live)** is **DO-CONFIRM**: the athlete has started; they glance to confirm, not to learn. The one-cue cockpit (rule 12a) governs.

## Beat Contract (Stages 1-4 shipped, D164 / D165 / D166 / D167)

Each athlete-facing field has one full-weight home. "Demoted" = present but secondary (behind a disclosure, as a quiet line, or in an on-demand overlay); "must-not-render" = deliberately absent on that surface this stage. **Stage 4 (`D167`) collapsed the Transition decide-step into a read-first Run get-ready beat**, so the READ-DO homes below now live on the **Run get-ready** (pre-collapse they were on Transition, now a reversible orphan reachable only by deep link / rollback).

| Field | Full-weight home | Demoted | Must-not-render |
|---|---|---|---|
| Drill identity (title + eyebrow + duration) | Run get-ready (READ-DO setup) and Run header | — | — |
| Full setup read (`courtsideInstructions`) | Run get-ready (full `GlossedText` read; READ-DO home migrated off Transition) | Run "Drill details" overlay (D165/D169 recovery only; timer keeps running; absent when the read is already on screen as the SegmentList) | **Run live cockpit body** (removed Stage 1; recoverable only via the transient overlay) |
| Live coaching cue (`coachingCues[0]`) | Run "Now" | Run "Drill details" overlay (remaining cues, rule 12a; merged with the setup read into one control per D169) | **Run get-ready** (no "Cue" / "More cues" block — the cue's only home is the live "Now") |
| Rung `intent` (technique-how, `D163`) | Run get-ready, **block-opening only** | — | mid-block get-ready; Run live; Drill Check |
| Segment list (`segments`) | Run `SegmentList` | — | — |
| Reflective + readiness rung content (`explorationCriterion` / `graduationFeel`) | Review verdict-gated "Next time" card (`D161`/`D162`) | — | — |
| Just-finished receipt | **Drill Check panel pill only** — there the finished drill is the capture *subject* (its `<h1>` is `sr-only`, `D145`), so the pill is the visible drill identity. **Removed `D171`** from the bypass beats. | — | Run get-ready and the Transition orphan (the quiet `line` receipt was dropped `D171`: restating the just-finished drill one tap later is redundant; continuity rests on stillness, `D166` R11) |

### Run-flow label lexicon

Canonical labels live in code at `app/src/contracts/runFlowLexicon.ts` (`RUN_FLOW_LABELS` + `SUNSET_RUN_FLOW_LABELS`), pinned by `runFlowLexicon.test.ts` and the cross-surface guard test.

- **Action CTA = "Start"** (was "Start next block"; sunset).
- **Live cue label = "Now"** (the Transition "Cue" label is retired).
- **Run recovery overlay (D165, merged D169) = "Drill details"** trigger / **"Back to drill"** dismiss. One control opens the on-demand overlay carrying BOTH the remaining coaching cues AND the full setup read (sections labeled "Cues" / "Setup" only when both render; **setup read first, then cues**, per `D172` — the cues lean on terms the read defines, so the read grounds them and the crisp cues land last as the send-off above "Back to drill"). The prior split — an inline cue-only "Show more cues" disclosure plus a separate "Peek setup" read button — is retired; both strings are sunset (`SUNSET_RUN_FLOW_LABELS`), alongside the earlier-retired combined "Show more cues and instructions".
- Swap / Shorten / Skip / block-counter strings are contextual variants recorded as canonical-at-current-strings; their normalization is a deferred founder pass, not drift.

## Block-Opening Rule (rung intent, R6)

`SessionPlan.blocks` is a flat ordered list with no "focus block" grouping; sessions are single-skill-chain by intent, but a focus can still recur **non-contiguously** — a focus-controlled support slot can resolve to a drill whose primary focus differs from its neighbors (e.g. a `['pass','set']` drill landing in a set session's technique/movement slot makes the focus sequence read `set → pass → set`). A focus run **opens** at index `i` when `getBlockSkillFocus(blocks[i])` is non-null and **no earlier block in the session already surfaced that same focus** — first-appearance keying via a prefix scan over `blocks[0..i-1]`, *not* a compare against only `blocks[i-1]` (a previous-block-only compare re-opens the primary focus on the block after an interleaving support slot, re-showing the line that should have receded). The rung `intent` line renders only on that focus run's opening beat — the Run **get-ready** post-Stage-4 (`D167`), the Transition pre-collapse — then recedes for the rest of the focus run. Implemented as the pure helper `resolveBlockOpeningIntent` (`app/src/domain/drillMetadata.ts`), pinned by the `set → pass → set` interleave regression in `drillMetadata.blockOpening.test.ts`; `resolveBlockRungIntent` is unchanged. See `docs/solutions/logic-errors/interleaved-sequence-first-appearance-keying.md` for the adjacent-compare-vs-prefix-scan root cause. **Accepted edge:** if a focus run's opening block is off-ladder (intent `null`) but a later same-focus block is on-ladder, positional gating shows nothing for that run (matches AE1; tracked, not solved).

## Staged Rollout

Risk-ordered and founder-dogfood-gated (origin: `docs/brainstorms/2026-06-23-run-flow-beat-contract-requirements.md`).

- **Stage 0 — Contract + lexicon.** This doc + `runFlowLexicon.ts`. **Shipped (D164).**
- **Stage 1 — Lean the beats apart.** Cut the Transition cue; gate rung intent to block-opening; remove Run's full read. **Shipped (D164).**
- **Stage 2 — Safe recovery.** A glare-safe one-touch overlay recovers the full read on Run while the block timer keeps running; the read keeps its single full-weight home on the get-ready beat. **Shipped (D165); merged with the Stage-1 extra-cues disclosure into one "Drill details" control (D169, 2026-06-29)** — see the lexicon note and the beat-contract table.
- **Stage 3 — Felt continuity.** Thread felt continuity across the seams; render the just-finished receipt once (shared `drillCheckBypassedForPreviousBlock` dedup) and pin continuity-by-stillness (identical forward title typography + shared header, no motion). **Shipped (D166).** **Amended (D171, 2026-06-30):** the quiet `line` receipt on the bypass beats (Run get-ready + Transition orphan) was removed as redundant — continuity now rests on the stillness mechanism alone (the `RunFlowContinuity.stillness.test.tsx` guard is unchanged), and only the Drill Check panel pill remains (as the capture-subject identity). `drillCheckBypassedForPreviousBlock` is retained for the Drill-Check-vs-bypass *routing* it still governs.
- **Stage 4 — Optional collapse.** Reversible, read-first collapse of the decide-step into a Run **get-ready** beat (the athlete taps "Start" when ready; **no auto-advance** — a resting athlete is never rushed; preroll gates on Start). Drill Check now flows straight to `/run`; `TransitionScreen` + `/run/transition` are retained as a reversible orphan (`D137` redirect pattern, zero `routes.transition()` call sites). The READ-DO setup read + block-opening intent migrate onto the get-ready. **Shipped (D167).**

## Invariants Preserved

- One-cue cockpit on Run (rule 12a); the full read is re-runnable from the rule-13 triple (`skillFocus` + `successMetric.description` + `coachingCues[0]`) without prose.
- No raw rung numbers in copy (`D157`); descriptive copy (`D154`).
- Shared run-family header; no Back / no End-session control on the live face (`D153`).
- `courtsideInstructions` ≤45-word ceiling and no em-dashes (rules 14/4).
