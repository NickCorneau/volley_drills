---
id: brainstorm-m002-2-rung-aware-coaching-arc
title: M002.2 Rung-Aware Live Cue (Coaching Arc Slice 1)
status: active
stage: build
type: requirements
date: 2026-06-30
topic: m002-2-rung-aware-coaching-arc
summary: "Make the live 'Now' cue rung-aware: when a block sits on a stress rung whose (primary skill focus, rung) carries an authored externalFocusCue, that cue becomes the single live cue on the Run live (DO-CONFIRM) beat, replacing — not supplementing — the drill's generic coachingCues[0] for that block. Ships externalFocusCue (authored in stressLadders.ts, validated, rendered nowhere) at the moment of execution, and dissolves the 2026-06-22 deferral's duplicate-read objection by swapping the one cue instead of adding a second. Adds a catalog-wide authoring check ('the floor') flagging live cues not in external-focus form. Slice 1 of the Rung-Aware Coaching Arc (floor + trunk); the Drill Check reflection (after), get-ready analogy depth + analogyCue field (before), and verdict-history calibration are deferred; the audio cockpit is out of scope (separate future fork). The substitution is guarded so it never overrides a drill's own load-bearing cue (gaze/perceptual or safety)."
authority: requirements input for the M002.2 rung-aware live-cue plan; subordinate to docs/decisions.md, docs/specs/run-flow-beat-contract.md, docs/specs/stress-rung-taxonomy.md, and the M002 series requirements
last_updated: 2026-06-30
depends_on:
  - docs/ideation/2026-06-30-m002-2-technique-how-depth-ideation.md
  - docs/brainstorms/2026-06-22-m002-2-technique-how-transition-intent-requirements.md
  - docs/specs/run-flow-beat-contract.md
  - docs/specs/stress-rung-taxonomy.md
  - docs/decisions.md
  - docs/status/current-state.md
---

# M002.2 Rung-Aware Live Cue Requirements

## Summary

Today the live "Now" cue in the Run cockpit is the drill's own `coachingCues[0]` — the same string whether the athlete is on rung 1 or rung 5 of a skill. The stress ladder reshapes which drill and rung get assembled, but at the moment of execution the ladder is invisible: the cue does not change with the rung.

This slice makes the live cue **rung-aware**. When a block sits on a stress rung whose `(primary skill focus, rung)` carries an authored `externalFocusCue`, that cue **becomes** the single live cue for that block — replacing the drill's generic `coachingCues[0]`, never shown alongside it. The substitution is **guarded**: it does not override a drill's own load-bearing cue (a gaze/perceptual cue or a safety cue), and it degrades to today's behavior for off-ladder blocks, rungs without an `externalFocusCue`, or cues that fail the live-cue budget (see R2/R4).

This is **slice 1 of the Rung-Aware Coaching Arc** (`docs/ideation/2026-06-30-m002-2-technique-how-depth-ideation.md`): the **trunk** (the rung's `externalFocusCue` as the live cue) plus the **floor** (a catalog-wide authoring check that flags live cues not written in external-focus form). It ships the app's best-authored, currently-unrendered cue content at the only moment it matters — the rep.

## Relationship To The 2026-06-22 Deferral

The adjacent slice (`docs/brainstorms/2026-06-22-m002-2-technique-how-transition-intent-requirements.md`) shipped the rung `intent` line — the *why-before* — and **deliberately held back `externalFocusCue`** with one specific reason: it is itself an external-focus cue and overlaps the drill's `coachingCues[0]`, so rendering both would be a duplicate read at glare distance.

This slice reopens `externalFocusCue` with the mechanism that dissolves that exact objection: **swap the one cue, do not add a second.** On a rung block the rung's `externalFocusCue` *is* the `coachingCues[0]` slot's content — so the cockpit still renders exactly one cue (courtside-copy rule 12a intact), and there is no duplicate read. The deferral was about *addition*; this is *substitution*.

Substitution removes the duplicate-read problem but introduces a new one: because `externalFocusCue` is authored per `(focus, rung)` while `coachingCues[0]` is per-drill, a blanket swap can erase a drill's own load-bearing cue (e.g., a gaze/perceptual cue) and on a multi-drill rung can even contradict it. R2/R4 therefore *guard* the swap — keeping the drill cue live where it is load-bearing — rather than applying substitution unconditionally.

With the `intent` line (why-before) already shipped and this rung-aware cue (cue-during) added, the run flow reads phase-matched across two of three beats. This slice delivers the **cue-during** beat of the run-time technique-how half without touching the sparse Drill Check beat or adding a new authored field; the **depth-after** piece (the Drill Check "what that rep trained" reflection — the ideation's highest-novelty element) remains a committed next slice, not a discretionary follow-on.

## Problem Frame

`D154` shipped rung-steered assembly; `D157`/`D163` made steering and the rung `intent` legible at the read-before-you-run beat. But `externalFocusCue` — the authored, validated, per-rung prompt that "makes the step real" — renders nowhere. The athlete is steered onto a rung, told what it trains *before* the rep, but during the rep hears only the drill's generic cue, identical at every rung.

The design constraint that has kept the cockpit clean: **Run live is the DO-CONFIRM beat** — courtside-copy rule 12a renders exactly one cue at arm's length; rule 13 forbids re-reading prose there. Any rung treatment in the cockpit must therefore *be* the one cue, not an extra one. The trunk fits that constraint exactly.

## Scope Decisions (this session)

The founder skipped the scope question, so the slice below is the **recommended default (founder not yet confirmed)** — warranted by the ideation's risk-ordered rollout (floor → trunk first), not by the skip itself. It is open to revision and should be confirmed at the first dogfood checkpoint, before any cue-authoring investment converts the reversible swap into sunk cost.

- **Floor + Trunk only.** Ship the rung-aware live cue (trunk) and the authoring check (floor). The Drill Check reflection (after), the get-ready analogy depth layer + `analogyCue` field (before), and verdict-history calibration are deferred (see Scope Boundaries), each revisit-after-dogfood, not permanently excluded.
- **Substitute (guarded), never supplement.** On a rung block, `externalFocusCue` replaces `coachingCues[0]` as the single live cue — *unless* the drill's own cue is load-bearing (gaze/perceptual or safety), in which case the drill cue stays live. The cockpit always shows exactly one cue (R2/R4).
- **Drill-actual rung, single-sourced.** The cue is resolved from the rung the block **actually sits on** (the `stressRungForDrill(focus, drillId)` pattern), derived at render time — never stored, duplicated, or read from adaptation/offer state.
- **No new authored field.** This slice renders only the already-authored `externalFocusCue`; it introduces no new content field (that cost belongs to the deferred *before* slice).

## Actors

- **Self-coached amateur (primary; founder + Seb under `D130`).** Mid-rep, glances at the cockpit and sees the cue for the rung they are actually on — different at rung 1 than at rung 5 of the same skill — instead of one generic drill cue.

## Key Flow

1. Athlete starts a block; the run flow lands on Run live (the one-cue cockpit).
2. The block is a ladder-bearing `main_skill` / `pressure` drill whose primary skill resolves to a rung, and that rung has an authored `externalFocusCue`.
3. The cockpit's single "Now" cue renders the rung's `externalFocusCue` instead of the drill's `coachingCues[0]`.
4. For off-ladder blocks, or rungs with no `externalFocusCue`, the cockpit renders `coachingCues[0]` exactly as it does today.

## Requirements

- **R1.** On Run live, when the block resolves to a stress rung that carries an authored `externalFocusCue` *and* the R2 guard permits, render that `externalFocusCue` as the single live "Now" cue.
- **R2. Guarded substitution.** The rung's `externalFocusCue` replaces `coachingCues[0]` as the live cue *unless* the drill's own `coachingCues[0]` is a **load-bearing drill-specific cue** — a gaze/perceptual cue (courtside-copy rule 12c) or a safety cue (rule 12b internal-focus exception) — in which case the drill cue stays live. The two are never shown together; exactly one live cue renders (rule 12a preserved). Rationale: `externalFocusCue` is authored per `(focus, rung)` and shared across every drill on that rung, so a blanket swap can erase or contradict a drill's own essential cue (the exact protected-cue taxonomy is a planning detail — see OQ1/OQ6).
- **R3.** Resolution is a **pure domain helper** (block → live-cue string), keyed on the block's **primary** skill focus and drill-actual rung (the `stressRungForDrill` / `resolveBlockRungIntent` pattern), unit-tested at the domain tier. The screen stays thin; no catalog/ladder lookups in JSX (data-access rules). The live cue is currently produced by `selectNonSegmentedCurrentCue` in `app/src/screens/run/currentCue.ts` (a three-source selector: coaching cue → single-line instructions → drill name, gated by `CUE_COMPACT_MAX`); this helper feeds the rung cue into that selector's coaching-cue slot — a new domain helper plus a single screen rewire, not a pure swap of an existing function.
- **R4. Fallback is total and null-safe.** Feeding the rung cue through `selectNonSegmentedCurrentCue` makes it inherit that selector's behavior: an off-ladder block, unknown rung, absent `externalFocusCue`, a guard-protected drill cue (R2), or a rung cue exceeding `CUE_COMPACT_MAX` all fall back to today's chain (`coachingCues[0]` → instructions → drill name, with the existing drill-name suppression) and never throw. A rung cue never grows a "Now" slot where none renders today.
- **R5.** The rung-aware cue appears **only** in the live-cue home (Run live, DO-CONFIRM). It is not added to the get-ready/read beat, the rung `intent` line, or Drill Check (beat contract: one home per field). It is **silent by design**: the rung cue renders in the same "Now" slot with the same label — no rung marker or indicator is added (that would break rule 12a).
- **R6. Floor (authoring check), run before the trunk.** A catalog-wide validation surfaces live cues that do not follow external-focus phrasing form **and** that exceed the live-cue budget (`CUE_COMPACT_MAX`). Scope for this slice: the `externalFocusCue` strings this slice can render live, plus the `coachingCues[0]` that act as the live fallback on ladder-bearing blocks; the broader non-ladder `coachingCues[0]` phrasing audit is deferred (OQ4). Warn-level, via the existing non-blocking advisory lane (the `auditRungDepth`-style lane, not the hard `validateDrillCatalog` gate); it does not block runtime.
- **R7. Copy register.** An `externalFocusCue` used as the live cue must satisfy the live "Now" cue bar (short, glanceable at arm's length, external-focus, present-tense action) and the courtside-copy invariants (no em-dash; jargon glossed if present). Over-budget strings are an authoring violation the floor (R6) flags; if one slips through at runtime it degrades through the same `selectNonSegmentedCurrentCue` fallback chain (R4) rather than rendering raw or wrapping — there is no in-place truncation.
- **R8. Sequence: floor first, then trunk.** Run the R6 floor, triage and rewrite the flagged / over-budget `externalFocusCue` strings, *then* enable the trunk (R1/R2) so the cue promoted to the sole live slot is already fit. The catalog only validates `externalFocusCue` for **presence**, not fitness, so the floor is the first fitness gate — matching the ideation's risk-ordered rollout (floor de-risks trunk).
- **R9. Recovery overlay consistency.** On a rung block where the rung cue is live, the "Drill details" recovery overlay (`D165`/`D169`) leads its cue section with the live `externalFocusCue` and does not resurface the displaced `coachingCues[0]`, so R2's "never shown together" is not undone one tap away.
- **R10. Presentational only.** No new persisted state, no Dexie schema change, no new route, no change to session assembly, adaptation, steering, or export. The change is which string fills the existing one-cue slot.

## Acceptance Examples

- A pass drill on rung 2 with `externalFocusCue` "Send the ball straight back up to the same height every time" → the cockpit's "Now" cue reads that string; the drill's `coachingCues[0]` does not appear.
- The same skill on rung 5 with a different authored `externalFocusCue` → the cockpit shows the rung-5 cue. The athlete sees the cue change as they climb.
- A warmup block (off-ladder) → the cockpit shows `coachingCues[0]`, exactly as today.
- A ladder-bearing rung whose `externalFocusCue` is empty/absent → falls back to `coachingCues[0]`; no blank cue, no throw.
- The authoring check flags an `externalFocusCue` written as an internal/body cue ("bend your knees") → surfaced in the diagnostics report for the founder to rewrite in external-focus form.
- A perceptual/read drill on a rung (e.g., "Pass & Look", whose `coachingCues[0]` is a gaze cue) → the guard (R2) keeps the drill's gaze cue live; the rung cue does not override it.
- A rung whose `externalFocusCue` exceeds the live-cue budget and slipped past the floor → degrades through the existing cue chain (R4); it is not truncated or rendered raw, and the floor (R6) had already flagged it.

## Scope Boundaries

### Deferred for later (named, not built)

- **After — Drill Check "what that rep trained" reflection.** Highest-novelty depth, but requires a beat-contract amendment (Drill Check currently must-not-render technique-how) and a new element on an intentionally sparse screen. Next candidate slice; gated on dogfooding the trunk.
- **Before — get-ready analogy depth layer + `analogyCue`.** A new catalog-wide authored field (real ongoing authoring cost) plus an on-demand depth surface. Deferred; the *why-before* is already served by the shipped rung `intent` line.
- **Self-tuning — verdict-history calibration.** Depth that recedes as the athlete graduates a focus. Lowest confidence; needs the depth surfaces to exist first.

### Outside this product's identity

- The eyes-off-phone **audio cue cockpit** — a separate future fork (medium-flip + iOS `AudioContext` blocker + a rule-12a/`D163` decision revisit); the arc does not depend on it.
- AI-generated or open-ended cues (`P7` / "no AI slop").
- Multi-cue / simultaneous coaching during the rep.

## Home

No Home presence. This slice changes the Run live cue only; it integrates through the run flow, not the Home focal slot (`D156` covenant — no claimant lane consumed, no render-budget change).

## Success Criteria (founder-use, qualitative)

- During real sessions the live cue **visibly differs by rung** for the same skill, and the founder finds the rung-aware cue at least as useful as — ideally more than — the generic drill cue (measured against `docs/research/founder-use-ledger.md`, not a counter).
- On rungs that bundle multiple distinct drills (e.g., pass rung 3), the founder confirms the **shared rung cue is at least as useful as each member drill's own `coachingCues[0]`** — the discriminating test that detects the substitution trade (a shared rung cue going blander than a drill's specific cue), so the revert condition can actually fire instead of passing by construction.
- **No clutter regression:** still exactly one cue; no "too much text" feeling at glare distance.
- The authoring check surfaces a **finite, fixable list** of non-external-focus live cues, which then get rewritten.
- **Revert condition:** if rung-aware cues feel noisier or worse than the generic cue across a week of dogfood, revert the trunk (a derivation swap — cheap to undo).

## Open Questions

- **OQ1 (partly addressed by R2's guard).** Which `coachingCues[0]` count as "load-bearing" and must survive the guard? Rule 12c gaze/perceptual cues and 12b safety cues are in; the exact taxonomy (does a rule-12d role cue qualify? is it detected by a cue tag or a heuristic?) is a planning detail.
- **OQ2 — resolved: manual-first.** The floor starts as a founder review pass over the presence-validated cue set (rule 12b is reviewer-applied today, not automated); an optional lexical heuristic is added later only if dogfood shows live-cue drift a manual pass can't keep up with.
- **OQ3 — resolved.** The live cue is selected by `selectNonSegmentedCurrentCue` in `app/src/screens/run/currentCue.ts` (a three-source selector, not `coachingCues[0]` exclusively); the single `currentCue` call site in `RunScreen` is the singular substitution point. R3/R4 are written against this.
- **OQ4 — resolved: narrow.** The floor covers the cues this slice can render live (the `externalFocusCue` strings + the ladder-block `coachingCues[0]` fallbacks). The catalog-wide non-ladder `coachingCues[0]` phrasing audit is deferred to a later slice so "floor + trunk" stays bounded.
- **OQ5.** Are the multi-drill rungs (e.g., pass rung 3 = 9 drills) actually assembled into active founder/Seb session plans? This bounds how often the R2 substitution trade fires in dogfood.
- **OQ6.** Does any drill's `coachingCues[0]` *contradict* (not merely under-specify) its rung's `externalFocusCue` at glare distance (e.g., a "don't move early" drill cue under an "arrive early" rung cue)? If so, the guard (R2) must treat contradiction as a protect-the-drill-cue case, and the floor (R6) should flag the pair.

## Dependencies / Assumptions

- `StressRung.externalFocusCue` is authored for every rung and **validated for presence only** (`catalogValidation.ts` checks non-empty, not glanceability or external-focus form). Its fitness as the *sole* live cue is unverified until the R6 floor runs — hence the R8 sequence (floor before trunk). Rungs without it fall back per R4.
- Assumes the block → `(primary focus, rung)` resolution already exists (`stressRungForDrill` / `resolveBlockRungIntent`) and can be extended to resolve `externalFocusCue`.
- Assumes the one-cue live home (Run live, DO-CONFIRM) is the correct and only place for the cue (`D154` / `D164` beat contract; courtside-copy rules 12a/13).
