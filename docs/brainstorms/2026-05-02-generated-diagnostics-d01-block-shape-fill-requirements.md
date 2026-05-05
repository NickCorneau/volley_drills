---
id: generated-diagnostics-d01-block-shape-fill-requirements-2026-05-02
title: "Generated Diagnostics D01 Block-Shape Fill Requirements"
status: active
stage: validation
type: requirements
summary: "Requirements for applying the first concrete D01 block-shape fill. Selects duration-aware main-skill rerouting over cap widening or repeated D01 blocks, and requires a reassessment receipt in generated diagnostics."
authority: "Requirements for the D01 block-shape fill; authorizes a narrow generated session-assembly selection change and generated diagnostics reassessment, but does not authorize D01 workload metadata edits, source-backed content, U6 preview tooling, broad theme work, or unrelated generator policy changes."
last_updated: 2026-05-02
depends_on:
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-workload-block-shape-proposal-requirements.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/ops/workload-envelope-authoring-guide.md
---

# Generated Diagnostics D01 Block-Shape Fill Requirements

## Problem Frame

The generated D01 workload/block-shape proposal selected `block_shape_review_needed` as the first concrete path. The problem is now specific: `d01-solo` is a short beginner passing drill, but generated main-skill allocation can ask it to carry more time than its 2-5 minute envelope and 5-minute fatigue cap support.

This fill should not widen D01 metadata, add source-backed content, or repeat D01 as multiple focus-controlled blocks. The v1 fill should reroute long main-skill allocations away from D01 when another eligible same-slot candidate can honestly carry the allocated duration.

---

## Actors

- A1. Maintainer: Accepts or rejects the D01 fill based on generated diagnostic movement and product/training-quality rationale.
- A2. Agent implementer: Applies the narrow duration-aware main-skill selection behavior and updates tests.
- A3. Reviewer: Checks that the fill does not become broad generator policy, cap widening, or repeated-drill masking.

---

## Key Flows

- F1. Duration-aware main-skill reroute
  - **Trigger:** The session builder selects a main-skill candidate for an allocated duration longer than that candidate's authored max or fatigue cap.
  - **Actors:** A2, A3
  - **Steps:** The builder intervenes only when the seeded default main-skill pick is overlong D01, then prefers a duration-fit same-slot candidate; if no exact fit exists, it prefers a stronger non-D01 workload envelope before falling back.
  - **Outcome:** D01 carries fewer overlong main-skill blocks without widening D01 metadata or changing unrelated seeded picks.
  - **Covered by:** R1, R2, R3, R4, R5, R6
- F2. Fill reassessment
  - **Trigger:** Diagnostics regenerate after the fill.
  - **Actors:** A1, A2, A3
  - **Steps:** The generated diagnostics workbench records whether the D01 target group disappeared, moved to accepted pressure, or remains unresolved, and separates diagnostic validation from training-quality validation.
  - **Outcome:** The D01 loop proves or falsifies the first concrete diagnostic-to-gap-fill path.
  - **Covered by:** R7, R8, R9, R10, R11, R12

---

## Requirements

**Fill behavior**

- R1. The fill should prefer a same-slot main-skill candidate whose `durationMaxMinutes` and `fatigueCap.maxMinutes` can carry the allocated main-skill duration when the seeded default pick is overlong D01.
- R2. The fill should apply only to generated main-skill D01 rerouting, not warmup, wrap, technique, movement proxy, pressure, recovery sessions, swap alternatives, or unrelated non-D01 default picks.
- R3. The fill should preserve all existing hard filters: setup, participants, equipment, player level, focus, and unmodeled requirements.
- R4. The fill should preserve deterministic assembly for a given seed.
- R5. If no eligible candidate can carry the allocated duration, the builder should prefer the strongest non-D01 workload envelope available; if no alternative exists, it should keep fallback behavior rather than failing draft generation.
- R6. The fill should leave D01 metadata unchanged and should not add D01 content or variants.

**Reassessment**

- R7. Generated diagnostics should record the D01 fill result against the prior stable group key `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`.
- R8. If the D01 group disappears after the fill, the D01 reassessment should mark diagnostic movement as validated.
- R9. If the D01 group remains, the reassessment should mark the fill as partially validated when affected cells or non-redistribution pressure move, or unresolved when no measurable movement appears, and preserve the remaining receipt facts.
- R10. Training-quality validation should remain separate from diagnostic validation; generated diagnostics may mark training quality as not assessed or partially validated by workload honesty/block-shape coherence, but not as field-validated.
- R11. The workbench should keep U6 deferred unless the fill creates a concrete cap/catalog proposal, which this slice should not do.
- R12. The parent generated diagnostics workflow should state that D01 has moved from proposal to fill/reassessment.

**Scope and safety**

- R13. Do not edit `app/src/data/drills.ts` or any D01 workload metadata.
- R14. Do not add source-backed content, new D01 variants, U6 preview tooling, or curated theme support.
- R15. Do not hide unresolved over-cap groups globally; the fill should change selection behavior and let diagnostics report the resulting evidence.
- R16. Do not silence `repeated_focus_controlled_family` diagnostics by repeating D01 as multiple blocks.

---

## Acceptance Examples

- AE1. **Covers R1-R6.** Given a main-skill slot allocated for more than 5 minutes and seeded selection would pick `d01-solo`, when another same-slot pass candidate can carry the duration or offers a stronger envelope, then the builder selects that candidate instead of stretching `d01-solo`.
- AE2. **Covers R2, R5.** Given a non-main-skill slot or no duration-fit main-skill candidate, when the builder runs, then existing selection and fallback behavior remain intact.
- AE3. **Covers R7-R10.** Given diagnostics regenerate after the fill, when the D01 target group is gone or reduced, then the triage workbench marks diagnostic movement validated or partially validated while training-quality validation remains separately bounded.
- AE4. **Covers R13-R16.** Given a reviewer checks the diff, when the fill lands, then there are no D01 metadata edits, source additions, U6 tooling, repeated D01 blocks, or suppressed diagnostics.

---

## Success Criteria

- The D01 over-cap/fatigue target group disappears or is explicitly reassessed in generated diagnostics.
- Generated sessions remain deterministic and valid for existing supported surfaces.
- D01 metadata remains honest and unchanged.
- The workflow proves one end-to-end diagnostic-to-fill loop: evidence -> proposal -> selected fill -> regenerated diagnostic receipt.

---

## Scope Boundaries

- Do not solve every generated-plan observation group.
- Do not optimize all candidate selection by workload score; v1 only gates overlong D01 main-skill choices against allocated duration.
- Do not change authored archetype durations in this slice.
- Do not add a UI surface.
- Do not claim field training-quality validation without a future dogfood/manual receipt.

---

## Key Decisions

- Reroute rather than split/repeat: Repeating D01 would create repeated focus-controlled-family pressure and hides the short-drill issue. Rerouting to a duration-fit or stronger-envelope main-skill candidate better matches the proposal.
- Main-skill only: D01's problem is a main-skill block-shape issue, so the fill should not alter other slot types yet.
- Diagnostics remain the proof surface: The generated triage workbench should show whether the target group moved, not merely trust the implementation.

---

## Dependencies / Assumptions

- Some eligible same-slot pass candidates can carry the affected main-skill durations; remaining D01 pressure may still require a redistribution-specific or catalog/cap follow-up.
- The existing diagnostic target group is current before the fill.
- Current hard filters and deterministic seed behavior remain authoritative.

---

## Outstanding Questions

### Deferred to Planning

- [Affects R1, R4][Technical] Should duration-fit selection happen before or after seeded shuffle, so determinism and variety remain balanced?
- [Affects R7-R10][Technical] Should the reassessment live in the existing D01 workload/block-shape proposal section or a separate D01 fill receipt section?
- [Affects R9][Technical] Which status names best fit the existing generated diagnostics language if D01 remains after the fill?

---

## Next Steps

-> `/ce-plan docs/brainstorms/2026-05-02-generated-diagnostics-d01-block-shape-fill-requirements.md`
