---
id: brainstorm-m002-2-drill-check-reflection
title: M002.2 Drill Check Reflection (Coaching Arc Slice 2 - the After beat)
status: active
stage: build
type: requirements
date: 2026-07-04
topic: m002-2-drill-check-reflection
summary: "Close the Rung-Aware Coaching Arc's third beat: an optional, pull-to-reveal, one-line reflection on the Drill Check screen naming what the just-finished rep was training. Content is a NEW authored per-(focus,rung) field in a backward-looking register (distinct from intent / externalFocusCue / the Review card fields, each of which already owns its one home), resolved null-safe from the drill-actual rung like the shipped intent and live-cue helpers. Pull not push: a persistent collapsed-by-default affordance, never auto-expanded, never gating Continue, nothing persisted. The chip-conditioned stress-vs-execution split is deferred (it wants a persisted capture, a data-model commitment). Requires the sanctioned beat-contract row amendment (Drill Check gains one reflective field home)."
authority: requirements input for the M002.2 Drill Check reflection plan; subordinate to docs/decisions.md, docs/specs/run-flow-beat-contract.md, docs/specs/stress-rung-taxonomy.md, and the M002 series requirements
last_updated: 2026-07-05
depends_on:
  - docs/ideation/2026-06-30-m002-2-technique-how-depth-ideation.md
  - docs/brainstorms/2026-06-30-m002-2-rung-aware-coaching-arc-requirements.md
  - docs/plans/2026-06-30-001-feat-m002-2-rung-aware-live-cue-plan.md
  - docs/specs/run-flow-beat-contract.md
  - docs/specs/stress-rung-taxonomy.md
  - docs/decisions.md
  - docs/status/current-state.md
---

# M002.2 Drill Check Reflection Requirements

## Summary

The Rung-Aware Coaching Arc (`docs/ideation/2026-06-30-m002-2-technique-how-depth-ideation.md`) surfaces one authored rung record phase-matched across the three run-flow beats: the *why* before the rep (`intent` on the Run get-ready, `D163`), the *one cue* during (`externalFocusCue` as the live "Now" cue, `D176`), and the *reflection* after. The first two beats are shipped. This slice ships the third: right after the rep, on the Drill Check screen, the athlete can pull one calm backward-looking line naming what that rep was training.

This is the moment a coach would have spoken, and the post-rep timing is retention-favorable (feedback right after an attempt is retained better). The full Duolingo "Explain My Answer" template — feedback conditioned on the learner's actual response — belongs to the *deferred chip-conditioned split*, not this shape: the shipped line is rep-independent static rung content. It adds an optional learning moment beside an existing required interaction (the difficulty chip) at zero added typing.

**Shape decision (recommended default; founder skipped the confirm, so not yet founder-confirmed).** The simple pull-to-reveal line, with the chip-conditioned stress-vs-execution split deferred. The arc's own synthesis made this call ("a reflection, not a quiz"), and the two shapes sit on opposite sides of a cost cliff: the simple line is presentational-only (render-time derivation, nothing persisted, cheap to revert), while the split is only worth building if its answer persists — a new capture on the execution log and therefore a data-model commitment that deserves its own slice, justified by dogfood evidence from this one. The founder directed the build 2026-07-05 (the `/lfg` dispatch on this doc); the shape itself is confirmed or revised at this slice's first dogfood checkpoint, before the 14 authored strings are treated as settled register content (the slice-1 confirm-at-first-dogfood pattern).

## Why This Is Not An Echo

Every existing rung field already has exactly one full-weight home under the beat contract. The reflection must be a genuinely distinct register, not a third read of content the athlete has already seen:

| Field | Home | Register |
|---|---|---|
| `intent` | Run get-ready, block-opening only | forward: "what this rung trains" |
| `externalFocusCue` | Run live "Now" cue (`D176`) | imperative, during the rep |
| `explorationCriterion` / `graduationFeel` | Review "Next time" card (`D161`/`D162`) | session-end, verdict-framed |
| **reflection (new)** | **Drill Check, behind a pull affordance** | **backward-looking: "what that rep was doing to you"** |

Reusing an existing field demoted was considered and rejected: `intent` is banned on Drill Check by the contract, is authored forward-looking (grammatical surgery to rephrase), and would double-read within minutes on focus-opening blocks; `explorationCriterion` is authored in the right "notice" voice but demoting it here would make Review's verdict card a partial repeat read and dilute the session-end moment. A new field costs ~14 authored strings (one per rung: pass 5, serve 4, set 5) — the same authoring pass already done four times on the rung record.

## Actors

- **Self-coached amateur (primary; founder + Seb under `D130`).** Just finished a drill, tags the difficulty chip, and — when they want it — pulls one line telling them what that rep was training on the rung they actually trained.

## Key Flow

1. Athlete finishes a ladder-bearing block; the run flow lands on Drill Check when the block is capture-eligible. The existing bypass set is wider than warmup/wrap: non-count support-slot blocks (a ladder-bearing drill in a technique / movement slot whose metric captures no counts) and missing-catalog-id blocks also bypass Drill Check today, unchanged by this slice.
2. Below the capture card, a quiet collapsed affordance (e.g. "What did that train?") is present.
3. Tapping it reveals the rung's authored reflection line — one calm sentence. The reveal is transient (not persisted; resets on leaving the screen).
4. The difficulty chip remains the only gate on Continue; the athlete can ignore the affordance entirely.
5. Off-ladder blocks show no affordance at all (absent, not disabled).

## Requirements

- **R1.** On Drill Check, when the just-finished block resolves to a stress rung carrying an authored reflection, render one persistent, predictable, collapsed-by-default affordance; tapping it reveals the rung's reflection line.
- **R2. Pull, not push; one-way per visit.** Collapsed by default on every visit; never auto-expands; the reveal is transient UI state (nothing persisted). Expanding is deliberately one-way for the screen visit: the trigger label is replaced by the reflection line and there is no re-collapse until the screen unmounts (`Disclosure` semantics, matching the same-screen capture drawers; the re-collapsible `Expander` was considered and rejected — a one-sentence reveal does not earn a second control, and same-screen idiom consistency wins). Consistent with the arc's depth-is-always-pulled principle.
- **R3. New authored field, backward-looking register.** The content is a new per-`(focus, rung)` field on the stress-rung record. Register rules: one calm sentence; past-facing ("that rep was …" voice); process-framed, never a judgment of the rep (`D154`: copy never gates and never grades); no rung numbers (`D157`); courtside-copy invariants hold (no em-dash; jargon glossed or avoided). **Distinct-from-siblings rule:** a reflection must not be a tense-transform of the rung's `intent` — it names what the rep was doing to the athlete (a mechanism or effect) that neither `intent` nor `explorationCriterion` already states, and the authoring pass reviews each of the 14 strings against its rung's four sibling fields before founder review. Authoring rules live in `docs/specs/stress-rung-taxonomy.md` alongside the sibling fields.
- **R4. Resolution mirrors the shipped pattern.** A pure, null-safe domain helper (block → reflection string), keyed on the block's primary skill focus and drill-actual rung (the `resolveBlockRungIntent` / `resolveBlockLiveCueOverride` pattern), unit-tested at the domain tier; the screen stays thin. No block-type gate at the resolver tier — the helper resolves on any ladder-bearing block, matching the intent and live-cue helpers. **Accepted edge (surface tier):** the reflection renders only where Drill Check mounts, and Drill Check bypasses ladder-bearing blocks in non-count support slots (e.g. `d38` in a technique slot) — those blocks get the before and during beats but no after beat. This is an accepted coverage bound (the beat contract's "Accepted edge" convention), not a regression; widening capture eligibility is a separate product decision. Off-ladder block, unknown rung, or absent reflection → `null`, affordance absent, never a throw.
- **R5. Never gates.** The difficulty chip remains the only gate on Continue. The reflection adds no capture, no required interaction, no persisted state.
- **R6. One home (beat-contract amendment).** The reflection renders only on Drill Check. The beat contract gains one row: full-weight home = Drill Check (behind the pull affordance); must-not-render = Run get-ready, Run live, Review. The existing `intent` must-not-render on Drill Check stays untouched — this is the "distinct reflective field" row-amendment the ideation's verifier sanctioned, not a relaxation.
- **R7. Persistent affordance, no first-appearance gating.** Unlike the intent line (block-opening only), the affordance appears on every ladder-bearing Drill Check. Rationale: collapsed it costs one quiet line; a control that comes and goes cannot be habituated (the persistent-predictable progressive-disclosure rule); and "what did that rep train" is as legitimate on block 4 as on block 1 even when the string repeats. Single-skill-chain sessions steered to one rung make the within-session repeat the **common case**, not an edge: consecutive Drill Checks on same-focus blocks reveal the identical string by design, so dogfood should distinguish repetition fatigue (a framing question, see OQ4) from filler strings (a revert trigger).
- **R8. Lexicon-sourced label.** The affordance label is one canonical string in the run-flow lexicon (`RUN_FLOW_LABELS`). Default: "What did that train?" — founder-swappable in one place.
- **R9. Sparse screen stays sparse; revealed line reads at body weight.** Collapsed state adds exactly one quiet secondary line below the capture card; the capture question remains the visible focal element; the footer is unchanged. The revealed reflection renders at body-read weight (the outdoor brief's 16px body minimum — it is the payload the athlete actually reads at arm's length), not the collapsed trigger's secondary treatment.
- **R10. Presentational only.** No Dexie schema change (stays v7), no route change, no assembly / adaptation / steering / export change, no Home pixels (`D156`). The new authored field is static catalog data and extends the existing hard rung-content presence gate plus the sibling authoring lints.

## Acceptance Examples

- Pass rung-1 block (e.g. `d01`) finished → Drill Check shows the pill, the chip, and a collapsed "What did that train?" line; tapping reveals one sentence in the reflection register (e.g. "That rep was building one contact point you can find without looking." — example of register only, final strings authored in the build; note it adds a mechanism the rung's `intent` "Groove a repeatable pass on a steady feed" does not state, per the R3 distinct-from-siblings rule).
- The same skill on a higher rung → a different reflection, matching the rung actually trained.
- Off-ladder main block → no affordance renders.
- Warmup / wrap block → Drill Check is bypassed today; nothing changes.
- Ladder-bearing block in a non-count support slot (e.g. `d38` in a technique slot) → Drill Check is bypassed today, so no reflection renders even though the intent line and live cue fired — the R4 accepted edge, not a regression.
- Two same-focus blocks on the same rung within one session → both Drill Checks show the collapsed affordance, and pulling reveals the identical string both times (expected repeat, not a defect).
- Count-capture, streak-capture, and difficulty-only blocks → the affordance renders in all three capture shapes (it keys off the block's drill, not the capture shape).
- The athlete never taps it → Continue works exactly as today; nothing is recorded about the non-tap.
- A rung whose reflection is missing → hard catalog validation failure at authoring time (presence gate), and the resolver's null-path keeps runtime safe regardless.

## Scope Boundaries

### Deferred for later (named, not built)

- **Chip-conditioned stress-vs-execution split.** On a "hard / still learning" tap, a one-tap split (was it the pace/stress, or the execution?) with the rung cue surfaced on the technique branch. Only worth building if the answer persists (a new capture on the execution log — a data-model slice with its own decision packet); gate on either dogfood signal from this slice: wanting to record why it was hard ("I keep wanting to tell it why that was hard") or wanting in-the-moment disambiguation ("I can't tell whether that was the pace or my execution").
- **Before — get-ready analogy depth layer + `analogyCue`.** Unchanged from the arc's deferral.
- **Self-tuning — verdict-history calibration.** Needs the depth surfaces to exist first; unchanged.

### Outside this product's identity

- AI-generated or open-ended reflections (`P7` / no AI slop) — the line is authored, static, per-rung.
- Any quiz, grading, or required-input framing of the post-rep moment.
- The eyes-off-phone audio cockpit (separate future fork, unchanged).

## Home

No Home presence. This slice changes the Drill Check body only; it integrates through the run flow, not the Home focal slot (`D156` covenant — no claimant lane consumed, no render-budget change).

## Success Criteria (founder-use, qualitative)

- The revealed line reads like a coach's post-rep one-liner, not a doc excerpt; the founder actually taps it sometimes during real sessions (measured against `docs/research/founder-use-ledger.md`, not a counter).
- No clutter regression: the collapsed affordance never registers as noise on the sparse screen; tagging feels as light as today.
- The reflection is felt as distinct from the get-ready intent and the Review card, not a repeat read.
- **Revert condition:** if the affordance reads as clutter or the line as filler across a week of dogfood, delete the affordance and the field (render-only + static data — cheap to undo).

## Open Questions

- **OQ1.** Final label wording ("What did that train?" vs. alternatives) — founder taste, evaluated against the quiz-framing exclusion: the label sits directly below the required capture question, so it must read as the athlete's own question to pull, never as a second ask. Single-sourced in the lexicon so a swap is one string.
- **OQ2.** Exact placement below the capture card (immediately after it vs. anchored at the body's end) — settle at build against the 390x844 layout; the constraint is R9 (the capture question stays focal).
- **OQ3.** Whether the reflection should ever gain a drill-level override (per-drill reflection where the rung line under-serves a specific drill, the guard-registry analog). Out for v1; revisit only if dogfood surfaces a concrete torn read.
- **OQ4.** If dogfood surfaces repetition fatigue (rather than filler strings), is a first-reveal-per-`(focus, rung)`-per-session default a sanctioned fallback, or does it break R7's persistent-predictable rationale? Named as a knob now so the revert condition does not fire against the wrong cause.

## Dependencies / Assumptions

- The block → `(primary focus, drill-actual rung)` resolution exists (`getBlockSkillFocus` → `stressRungForDrill` → `getStressRung`) and is the pattern to mirror; the Drill Check controller has the plan (and thus `playerCount`) and the just-finished block in scope.
- The `rung_content_missing` hard gate and the sibling authoring lints exist and extend naturally to a fifth field; all 14 rungs get the field in the same change (all-or-nothing, like the M002.2 progression-content layer).
- The collapsed-by-default `Disclosure` primitive (already used by the capture drawers on this screen) is the affordance; no new primitive is assumed.
- Under `D130` founder-use mode, the 14 strings are agent-drafted in the authored register and founder-reviewed through dogfood, matching how the sibling rung content landed.
- **Slice-1 sequencing gate disposition.** Slice 1 deferred this slice "gated on dogfooding the trunk." As of 2026-07-04 a live 390x844 verification dogfood of the trunk is on record (the `D176` decision row: substitution, phase-match, R9 overlay, and guard behavior all observed), but no founder field session with the trunk is on the ledger yet and the trunk's one-week felt-quality revert window is still open. The founder's explicit 2026-07-05 build direction (`/lfg` on this doc) discharges the sequencing gate by founder call under `D130`. Contingency: the reflection is mechanically independent of the live-cue swap — if the trunk's revert condition later fires, this slice stands on its own as rung-content depth, but the arc's phase-matched premise weakens and the first dogfood checkpoint should re-read the shape.
