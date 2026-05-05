---
id: generated-diagnostics-d01-redistribution-handoff-requirements-2026-05-02
title: "Generated Diagnostics D01 Redistribution Handoff Requirements"
status: active
stage: validation
type: requirements
summary: "Requirements for the next D01 block-shape follow-up: test whether a narrow redistribution handoff is actually admissible for the remaining D01 pressure, and only apply it when it can materially move D01 without weakening training intent."
authority: "Requirements for the D01 redistribution-specific block-shape follow-up; authorizes a narrow handoff admission check, a bounded generated session-assembly redistribution handoff when admissible, and generated diagnostics reassessment, but does not authorize D01 metadata edits, source-backed content, U6 preview tooling, broad workload scoring, or unrelated redistribution policy changes."
last_updated: 2026-05-02
depends_on:
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-block-shape-fill-requirements.md
  - docs/plans/2026-05-02-007-feat-d01-block-shape-fill-plan.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
---

# Generated Diagnostics D01 Redistribution Handoff Requirements

## Problem Frame

The first D01 block-shape fill moved the main-skill selection itself: D01 target cells dropped from 18 to 12, and non-redistribution pressure dropped from 6 to 0. The remaining D01 pressure is redistribution-bearing, but the current causality receipt classifies the target as `pressure_remains_without_redistribution`: all 12 cells still exceed D01's authored max and fatigue cap even under the allocated-duration counterfactual.

The next follow-up should therefore avoid assuming handoff will close the gap. It should first make the causal read explicit, then apply a capacity-aware handoff only when the handoff can materially move D01 without distorting the training intent of another block. If the receipt proves handoff cannot close the remaining D01 pressure, the workflow should exit this D01 runtime loop and choose a next state rather than keep chasing tiny diagnostic deltas.

---

## Causal Read

- Current D01 target group: `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`.
- Current receipt facts: 12 affected cells, 12 redistribution-affected cells, 12 pressure-remains cells, 0 pressure-disappears cells, 0 non-redistribution pressure cells, and 106 counterfactual unfilled minutes.
- Representative examples in the fingerprint show `planned/allocated` pairs such as 12/7 and 23/10 against D01's `durationMaxMinutes: 5` and `fatigueCap.maxMinutes: 5`.
- Product implication: moving only skipped optional minutes away from D01 may reduce final planned duration, but it cannot validate the target unless D01's allocated duration is also brought within its envelope or the workflow explicitly chooses a different next state.

---

## Actors

- A1. Maintainer: Decides whether the residual D01 pressure is actually closed, partially moved, or should become a later policy/cap/catalog decision.
- A2. Agent implementer: Applies the narrow D01 redistribution handoff behavior and updates generated diagnostics.
- A3. Reviewer: Checks that this remains a D01-specific redistribution follow-up, not a broad generator rewrite.

---

## Key Flows

- F1. D01 redistribution handoff admission
  - **Trigger:** Optional-slot redistribution would add minutes to a selected `d01-solo` main-skill block that cannot carry the final planned duration.
  - **Actors:** A2, A3
  - **Steps:** The builder or receipt logic detects whether redistribution handoff can materially reduce D01 pressure, checks whether another already-selected block can absorb the redistributed minutes without violating workload or role intent, and applies the handoff only when both conditions hold.
  - **Outcome:** The generated session preserves intended total duration only when the handoff is both workload-safe and training-intent-safe; otherwise the receipt rejects handoff as the next D01 fill.
  - **Covered by:** R1, R2, R3, R4, R5, R6
- F2. Residual reassessment
  - **Trigger:** Diagnostics regenerate after the redistribution handoff.
  - **Actors:** A1, A2, A3
  - **Steps:** The generated diagnostics workbench records whether the D01 fill receipt moved from partially validated to validated, remained partially validated, or rejected handoff as insufficient, including what kind of block absorbed minutes when a handoff happened.
  - **Outcome:** The workflow knows whether D01 is closed enough to unblock the D47 path, whether capacity-aware redistribution should become a later policy candidate, or whether D01 needs a different cap/catalog/source-backed decision.
  - **Covered by:** R7, R8, R9, R10, R11, R12

---

## Requirements

**Redistribution behavior**

- R1. The follow-up should apply only when generated optional-slot redistribution would over-stretch selected `d01-solo` and a handoff can materially improve the D01 target receipt; it should not change ordinary non-D01 redistribution behavior.
- R2. The handoff should choose among already-selected blocks rather than introducing a new drill solely to absorb redistributed minutes.
- R3. A handoff target should be eligible only if its resulting planned duration stays within its authored max and fatigue cap when those limits are present and preserves the session's training intent, focus, and block role.
- R4. The handoff should preserve total generated session duration when an eligible already-selected target exists.
- R5. Target selection should prefer the least disruptive selected block that supports the same training intent before considering warmup or wrap; if a warmup or wrap absorbs minutes, the receipt should label that as duration preservation rather than full gap closure.
- R6. If no selected target can honestly absorb the redistributed minutes, or if D01 allocated-duration pressure would remain unchanged, the builder should keep existing behavior and let diagnostics report that handoff is not a sufficient D01 fill.
- R7. The follow-up should preserve deterministic assembly for a given seed and should not change hard candidate filters, swap alternatives, recovery-session assembly, or D01 workload metadata.

**Reassessment**

- R8. Generated diagnostics should reassess the same D01 fill target group after the handoff/admission check and keep the prior baseline visible.
- R9. If the D01 target group disappears, the D01 fill receipt should mark diagnostic movement as validated and note that field training quality remains unvalidated.
- R10. If D01 pressure remains, the receipt should preserve current affected-cell facts, identify whether the remaining pressure is still redistribution-shaped or allocated-duration-shaped, and state whether handoff was applied, rejected, or insufficient.
- R11. The receipt should record which block type absorbed redistributed minutes, when applicable, and whether passing-practice intent was preserved or merely total duration was preserved.
- R12. The parent generated diagnostics workflow should state whether D01 remains a blocker for resuming the D47 gap-closure path.
- R13. If the handoff validates, the receipt should recommend whether capacity-aware redistribution remains a D01-specific exception, becomes a later global generator-policy candidate, or closes as a one-off.
- R14. U6 preview remains deferred unless this follow-up creates a concrete catalog, cap, or source-backed activation proposal, which this slice should not do.

**Scope and safety**

- R15. Do not edit `app/src/data/drills.ts`, D01 workload metadata, authored archetype durations, or source-backed content.
- R16. Do not repeat D01 as multiple focus-controlled-family blocks in this slice.
- R17. Do not build a broad workload scoring system or globally optimize redistribution targets.
- R18. Do not hide unresolved diagnostics; behavior changes must be proven by regenerated diagnostics and tests.
- R19. Partial movement alone should not authorize another D01 runtime follow-up unless it names a new causal mechanism and a closure threshold.

---

## Acceptance Examples

- AE1. **Covers R1-R7.** Given skipped optional minutes would make selected `d01-solo` exceed 5 minutes, D01's allocated duration is within its envelope, and a selected same-focus support block can absorb those minutes within workload and role intent, when the draft is built, then the extra minutes are handed to that selected block and D01 remains within its envelope.
- AE2. **Covers R1, R6, R10.** Given skipped optional minutes would over-stretch D01 but D01's allocated duration already exceeds its envelope, when the handoff admission check runs, then the existing redistribution behavior remains and the receipt says handoff is insufficient rather than claiming closure.
- AE3. **Covers R1, R5, R11.** Given a warmup or wrap can technically absorb redistributed minutes but doing so would dilute the session's passing-practice intent, when the handoff is evaluated, then the target is rejected or labeled as duration preservation only.
- AE4. **Covers R1, R17.** Given a non-D01 main-skill block receives redistributed minutes, when the draft is built, then this D01 follow-up does not change that redistribution target merely because another block has more capacity.
- AE5. **Covers R8-R14.** Given diagnostics regenerate after the handoff/admission check, when the D01 target group disappears, remains, or is rejected as non-admissible, then the workbench records validated, partially validated, or insufficient movement without claiming field training-quality validation.

---

## Success Criteria

- The D01 target group disappears, or the receipt explicitly chooses one next state: cap/catalog proposal, no-change closure, or resume D47.
- If affected cells merely drop below 12, the receipt treats that as partial evidence only and does not authorize another D01 runtime loop without a new causal mechanism and threshold.
- Any residual D01 pressure is explicitly identified as allocated-duration-shaped, redistribution-shaped, or handoff-insufficient rather than hidden by the runtime change.
- Generated sessions keep total intended duration when a truthful selected handoff target exists.
- The D47 gap-closure path has a clear next state: resume D47, keep D01 open, or choose a later concrete cap/catalog proposal.

---

## Scope Boundaries

- Do not solve all redistribution groups.
- Do not make redistribution capacity-aware globally.
- Do not add new drills, variants, source-backed cards, catalog activation manifests, U6 previews, or UI.
- Do not claim courtside training-quality validation without manual dogfood evidence.
- Do not commit to abandoning D47 until the D01 reassessment receipt says whether D01 is still blocking it.

---

## Key Decisions

- Admission before handoff: The current receipt says pressure remains under the allocated-duration counterfactual, so handoff is only product-sound if it can materially move the D01 target or produce an explicit insufficient-handoff decision.
- Capacity-aware handoff over policy acceptance when admissible: The user goal is to actually fill programming gaps, so residual D01 pressure deserves one concrete block-shape test before being accepted as policy.
- Handoff over split/repeat: Repeating D01 risks the same repeated focus-controlled-family pressure the prior fill avoided; handing minutes to another selected block better preserves a coherent session shape.
- Already-selected targets only: Introducing a new drill during redistribution would turn this into a broader assembly rewrite and could create new focus/readiness side effects.
- Training intent over green diagnostics: A target that can carry minutes numerically is not enough; the receiving block must preserve the session's actual practice purpose.
- Diagnostics remain the proof surface: The follow-up should be accepted only through regenerated receipt movement, not through an implementation claim.

---

## Dependencies / Assumptions

- The remaining 12 D01 cells carry optional-slot redistribution evidence, but the current receipt says pressure remains under allocated-duration counterfactual; handoff may be insufficient for full closure.
- Some affected generated sessions may already include a selected non-D01 block that can absorb redistributed minutes honestly; if not, or if allocated D01 pressure remains, the receipt should prove that rather than forcing a worse shape.
- The D01 duration-aware main-skill reroute from the prior fill remains in place and is not re-litigated here.

---

## Outstanding Questions

### Deferred to Planning

- [Affects R2-R6][Technical] Should handoff target selection prefer the first eligible selected block by layout order, the strongest capacity envelope, or the least disruptive block type?
- [Affects R8-R13][Technical] Should the existing D01 fill receipt be extended, or should the workbench render a second `D01 Redistribution Handoff Receipt` section?

---

## Next Steps

-> `/ce-product-lens-reviewer` for product pressure review, then `/ce-plan docs/brainstorms/2026-05-02-generated-diagnostics-d01-redistribution-handoff-requirements.md`
