---
id: generated-diagnostics-workload-envelope-guidance-requirements-2026-05-01
title: "Generated Diagnostics Workload Envelope Guidance Requirements"
status: active
stage: validation
type: requirements
summary: "Focused requirements for U7: a small workload envelope authoring guide that turns generated diagnostics compression prompts into policy guidance before catalog, cap, or generator changes."
authority: "Requirements addendum for U7 workload envelope guidance after generated diagnostics triage and decision-debt compression; does not authorize catalog changes or runtime generator policy changes."
last_updated: 2026-05-01
depends_on:
  - docs/brainstorms/2026-05-01-generated-plan-diagnostics-next-steps-requirements.md
  - docs/brainstorms/2026-05-01-generated-diagnostics-decision-debt-compression-requirements.md
  - docs/decisions.md
  - docs/plans/2026-05-01-002-feat-generated-diagnostics-triage-workflow-plan.md
  - docs/research/warmup-cooldown-minimum-protocols.md
  - docs/research/srpe-load-adaptation-rules.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - docs/specs/m001-session-assembly.md
---

# Generated Diagnostics Workload Envelope Guidance Requirements

## Problem Frame

U4 compressed the generated-plan triage workbench into four human decision prompts. Three of them point to U7 workload envelope guidance: short-session cooldown minimums, technique under-min review, and broader workload envelope review. Together they cover 32 groups and 314 affected cells.

The risk is that maintainers or agents treat those rows as direct catalog-change instructions. They are not. They are evidence that the repo needs a small policy guide for choosing and reviewing `durationMinMinutes`, `durationMaxMinutes`, and `fatigueCap.maxMinutes` before changing caps, splitting blocks, adding source-backed content, or investigating generator redistribution.

---

## Actors

- A1. Founder/maintainer: Reviews generated diagnostics and decides whether an observation is acceptable policy, metadata debt, block-shape debt, content-depth debt, or generator-policy debt.
- A2. Catalog author: Uses guidance before editing drill workload metadata or proposing source-backed content additions.
- A3. Agent implementer: Turns the requirements into a small docs-first guide and keeps generated diagnostics linked to the right policy decision points.

---

## Requirements

**Guide scope**

- R1. The guidance should cover the three U7-triggering compression lanes: short-session cooldown minimum, technique under-min review, and workload envelope review.
- R2. The guidance should explain how to reason about `durationMinMinutes`, `durationMaxMinutes`, and `fatigueCap.maxMinutes` by block intent, not only by raw generated-plan failures.
- R3. The guidance should use a canonical candidate-disposition list: `accepted_policy_allowance`, `metadata_review_needed`, `block_shape_review_needed`, `source_depth_candidate`, `requires_U6_preview`, `route_to_U8`, and `no_implementation_action_yet`.
- R4. The guidance should explicitly state that generated observations are evidence for review, not automatic permission to add drills, loosen caps, or change runtime generation.
- R5. The guidance should separate stable policy from generated snapshot examples, including the source report/workbench ID whenever it references current counts or group keys.

**Decision rubric**

- R6. The guide should define a decision flow: classify the compression lane, answer the lane’s primary question, check the evidence threshold, choose one candidate disposition, route to U6/U8/no action when needed, and record or link the decision.
- R7. Short-session cooldown/wrap under-min groups should start from `D85`, `D105`, and the warm-up/cooldown research: Downshift is ~2-3 minutes, framed as transition/comfort, not recovery or injury prevention.
- R8. Technique under-min groups should be treated first as a training-intent question: intentionally short technique reps versus a real content-depth or block-shape gap.
- R9. Non-redistribution over authored-max or fatigue-cap groups should be treated first as workload envelope questions.
- R10. Redistribution-evidence prompts should remain routed to U8; U7 may state workload assumptions that U8 should consider, but it must not reroute redistribution prompts or decide redistribution policy.
- R11. The guide should give catalog authors a quick checklist for deciding whether a proposed workload metadata edit needs a concrete gap card, U6 preview, or no action.
- R12. The guide’s checklist should inspect layers in order: generated trace/block allocation, archetype slot envelope, variant workload and fatigue cap metadata, structured segments/copy, then source-backed content.
- R13. The guide should define action states for ambiguous cases: enough evidence, insufficient evidence, conflicting evidence, needs source-backed gap card, needs U6 preview, route to U8, and no implementation action.

**Workflow linkage**

- R14. U7 should create a short standalone guide unless planning finds an existing canonical home that avoids a new durable doc without losing scanability.
- R15. The generated triage workbench should reference the guide and stable anchors for U7-related compressed prompts once the guide exists, but U7 should not add or change generation/validation code unless separately planned.
- R16. U7 should not require building the full U6 catalog impact preview; it may name when a future concrete proposal should use U6.
- R17. U7 should update U7-linked compressed prompts or their review notes with guide-backed candidate dispositions so the guide reduces decision debt, not just documents policy.

---

## Acceptance Examples

- AE1. **Covers R1, R6, R7.** Given the `d25-solo` wrap under-min prompt, when a maintainer reads the guide, they can decide whether short Downshift under-min behavior is an `accepted_policy_allowance` under `D85`/`D105` or a later metadata/copy alignment candidate.
- AE2. **Covers R1, R6, R8.** Given a technique under-min group, when a catalog author reads the guide, they can distinguish intentional short technique work from a `source_depth_candidate` or `block_shape_review_needed` disposition.
- AE3. **Covers R2, R6, R9, R12.** Given an over-fatigue group without redistribution evidence, when an agent routes it through the guide, the checklist inspects block allocation, archetype slot envelope, variant workload/fatigue metadata, and structured segments before choosing `metadata_review_needed` or `block_shape_review_needed`.
- AE4. **Covers R3, R4, R11, R16.** Given a proposed catalog change inspired by generated diagnostics, when the author checks the guide, they see that actual metadata/content changes require a concrete proposal gate such as source-backed evidence or future U6 preview.
- AE5. **Covers R10, R15.** Given the generated triage workbench, when U7 is complete, U7-linked prompts point to the guide while generator redistribution prompts still point to U8.
- AE6. **Covers R5, R15.** Given the guide references current "32 groups / 314 cells" evidence, when diagnostics change, the generated snapshot reference is clearly separated from stable policy and can be refreshed without rewriting the policy.
- AE7. **Covers R13, R17.** Given a prompt with insufficient or conflicting evidence, when U7 is complete, the prompt receives a guide-backed action state instead of being silently treated as resolved.

---

## Success Criteria

- A maintainer can use the guide to make the next decision for the 32 non-redistribution U7-linked groups without scanning all row-level triage entries.
- A catalog author can tell when workload metadata guidance is enough and when a gap card, block split, cap review, U6 preview, or U8 redistribution comparison is required.
- U7-linked compressed prompts gain guide-backed candidate dispositions such as `accepted_policy_allowance`, `metadata_review_needed`, `block_shape_review_needed`, `source_depth_candidate`, `requires_U6_preview`, `route_to_U8`, or `no_implementation_action_yet`.
- Downstream planning does not need to invent the guide’s audience, decision outcomes, scope boundaries, or relationship to U6/U8.

---

## Scope Boundaries

- Do not change drill metadata, caps, fatigue limits, block allocation, or runtime generator behavior in this brainstorm.
- Do not add source-backed content or declare a content gap resolved.
- Do not build the U6 catalog impact preview.
- Do not solve U8 redistribution policy inside U7.
- Do not turn the guide into a full coaching methodology or periodization model.
- Do not require every existing triage row to receive a final resolution before the guide is useful.
- Do not let guide-backed candidate dispositions directly edit catalog metadata; any actual `durationMinMinutes`, `durationMaxMinutes`, `fatigueCap.maxMinutes`, block allocation, or drill-content change must route through a concrete gap card, activation manifest, U6 preview, or separate implementation plan with affected group keys and catalog IDs.

---

## Key Decisions

- Create a standalone but small workload envelope authoring guide by default: U4 shows the policy is reused across multiple compression lanes and affected-cell classes.
- Keep the guide decision-oriented rather than exhaustive: it should help maintainers choose the next action, not encode every volleyball programming principle.
- Treat U7 as a policy clarification layer before catalog and generator changes: it can route work to U6 or U8 but should not absorb those units.
- Treat redistribution evidence as U8-owned: U7 can define workload assumptions for U8 to consider but should not decide redistribution policy.

---

## Dependencies / Assumptions

- The generated diagnostics triage workbench remains the evidence surface for current affected groups.
- U4 decision-debt compression remains the summary surface for choosing the next unit.
- Existing source-backed gap card conventions continue to govern any catalog/content additions.
- The guide starts from `D85`, `D105`, `docs/research/warmup-cooldown-minimum-protocols.md`, `docs/research/srpe-load-adaptation-rules.md`, `docs/specs/m001-session-assembly.md`, and `docs/reviews/2026-04-30-focus-coverage-gap-cards.md`; generated diagnostics do not override those sources.

---

## Outstanding Questions

### Deferred to Planning

- [Affects R14, R15][Technical] Should U7 links in the generated triage workbench point to guide sections by stable anchors, or only reference the guide as a whole?
- [Affects R5, R15][Technical] Should stale U7 guide links/anchors be covered by `diagnostics:report:check`, agent-doc validation, or a lighter doc check?

---

## Next Steps

-> `/ce-plan` for U7 workload envelope guidance.
