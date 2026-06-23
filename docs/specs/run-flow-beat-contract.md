---
id: spec-run-flow-beat-contract
title: Run-Flow Beat Contract
status: active
stage: validation
type: spec
summary: "The beat contract for the run flow (Transition / Run / Drill Check / Review): each athlete-facing field gets exactly one full-weight home, with named demoted and must-not-render placements, so the flow reads as one calm instrument. Stage 1 is shipped (D164); Stages 2-4 are deferred and gated on dogfood."
authority: canonical per-field placement contract for the run-flow beats and the run-flow label lexicon; gates where each athlete-facing field may render at full weight
last_updated: 2026-06-23
depends_on:
  - docs/decisions.md
  - docs/brainstorms/2026-06-23-run-flow-beat-contract-requirements.md
  - docs/plans/2026-06-23-001-feat-run-flow-stage1-beat-contract-plan.md
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

- **Transition** is **READ-DO**: the athlete is setting up; they read to learn what to do next.
- **Run (live)** is **DO-CONFIRM**: the athlete has started; they glance to confirm, not to learn. The one-cue cockpit (rule 12a) governs.

## Beat Contract (Stage 1 shipped, D164)

Each athlete-facing field has one full-weight home. "Demoted" = present but secondary (behind a disclosure or as a quiet line); "must-not-render" = deliberately absent on that surface this stage.

| Field | Full-weight home | Demoted | Must-not-render |
|---|---|---|---|
| Drill identity (title + eyebrow + duration) | Transition (READ-DO setup) and Run header | — | — |
| Full setup read (`courtsideInstructions`) | Transition (full `GlossedText` read) | — | **Run** (removed Stage 1; returns only as Stage 2's recovery peek) |
| Live coaching cue (`coachingCues[0]`) | Run "Now" | Run "Show more cues" (remaining cues, rule 12a) | **Transition** (no "Cue" / "More cues" block) |
| Rung `intent` (technique-how, `D163`) | Transition, **block-opening only** | — | mid-block Transition; Run; Drill Check |
| Segment list (`segments`) | Run `SegmentList` | — | — |
| Reflective + readiness rung content (`explorationCriterion` / `graduationFeel`) | Review verdict-gated "Next time" card (`D161`/`D162`) | — | — |
| Just-finished receipt | Transition quiet line (`D153`); Drill Check fuller pill | — | duplicated full-weight on both |

### Run-flow label lexicon

Canonical labels live in code at `app/src/contracts/runFlowLexicon.ts` (`RUN_FLOW_LABELS` + `SUNSET_RUN_FLOW_LABELS`), pinned by `runFlowLexicon.test.ts` and the cross-surface guard test.

- **Action CTA = "Start"** (was "Start next block"; sunset).
- **Live cue label = "Now"** (the Transition "Cue" label is retired).
- **Run extra-cues disclosure = "Show more cues"** (the combined "Show more cues and instructions" is retired — the disclosure is cue-only now).
- Swap / Shorten / Skip / block-counter strings are contextual variants recorded as canonical-at-current-strings; their normalization is a deferred founder pass, not drift.

## Block-Opening Rule (rung intent, R6)

`SessionPlan.blocks` is a flat ordered list with no "focus block" grouping; sessions are single-skill-chain. A focus run **opens** at index `i` when `getBlockSkillFocus(blocks[i])` is non-null and (`i === 0` or `getBlockSkillFocus(blocks[i-1]) !== getBlockSkillFocus(blocks[i])`). The rung `intent` line renders only on the opening Transition. Implemented as the pure helper `resolveBlockOpeningIntent` (`app/src/domain/drillMetadata.ts`); `resolveBlockRungIntent` is unchanged. **Accepted edge:** if a focus run's opening block is off-ladder (intent `null`) but a later same-focus block is on-ladder, positional gating shows nothing for that run (matches AE1; tracked, not solved).

## Staged Rollout

Risk-ordered and founder-dogfood-gated (origin: `docs/brainstorms/2026-06-23-run-flow-beat-contract-requirements.md`).

- **Stage 0 — Contract + lexicon.** This doc + `runFlowLexicon.ts`. **Shipped (D164).**
- **Stage 1 — Lean the beats apart.** Cut the Transition cue; gate rung intent to block-opening; remove Run's full read. **Shipped (D164).**
- **Stage 2 — Safe recovery.** Run's preroll becomes the full-weight read with a glare-safe one-touch "peek setup" recovery (the full read has exactly one home at a time). **Deferred.**
- **Stage 3 — Felt continuity.** Thread felt continuity across the seams; render the just-finished receipt once. **Deferred.**
- **Stage 4 — Optional collapse.** Reversible, read-first collapse of the decide-step (the athlete taps "Start" when ready; **no auto-advance** — a resting athlete is never rushed). **Deferred.**

## Invariants Preserved

- One-cue cockpit on Run (rule 12a); the full read is re-runnable from the rule-13 triple (`skillFocus` + `successMetric.description` + `coachingCues[0]`) without prose.
- No raw rung numbers in copy (`D157`); descriptive copy (`D154`).
- Shared run-family header; no Back / no End-session control on the live face (`D153`).
- `courtsideInstructions` ≤45-word ceiling and no em-dashes (rules 14/4).
