---
id: focus-coverage-catalog-readiness-requirements-2026-04-30
title: "Focus Coverage Catalog Readiness Requirements"
status: active
stage: validation
type: requirements
summary: "Requirements for making Tune today focus choices fully catalog-backed across pass/serve/set, skill levels, setup configurations, long sessions, and swaps. Establishes that Volleycraft should not have thin or unavailable visible focus states; the catalog must meet a practical depth floor before the focus picker is considered complete."
authority: "Requirements handoff for focus-picker catalog readiness, source-backed gap audit, variant-first expansion, and readiness-over-cap posture."
last_updated: 2026-04-30
depends_on:
- docs/ideation/2026-04-30-focus-picker-drill-depth-ideation.md
- docs/ideation/2026-04-28-what-to-add-next-ideation.md
- docs/ideation/2026-04-29-skill-scope-and-game-layers-ideation.md
- docs/brainstorms/2026-04-29-session-focus-picker-requirements.md
- docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md
- docs/research/fivb-source-material.md
- docs/research/bab-source-material.md
- docs/research/vdm-development-matrix-takeaways.md
- docs/research/ltd3-development-matrix-synthesis.md
decision_refs:
- D81
- D101
- D130
- D135
---

# Focus Coverage Catalog Readiness Requirements

## Problem Frame

Tune today makes Passing, Serving, and Setting feel like first-class practice intents. That changes the catalog bar. A visible focus chip cannot be a best-effort filter that sometimes fails, silently falls back, or produces a practice where only one block matches the chosen intent.

The current live catalog is not yet at that bar. Passing is broadly covered, Setting is buildable but thin, and Serving is fragile: pair/no-net Serving likely cannot build a focused main-skill block, long Serving sessions still receive pass-flavored support blocks, and skill level is not currently honored by assembly. The product answer is not "thin focus" copy. The catalog should become deep enough to cover every visible focus across the relevant setup matrix.

This document defines the **completion bar** for Tune today catalog trust. Planning may phase the work, but the product should not declare the named-focus picker complete while any visible focus fails this bar. The release gate is explicit: named-focus Tune today is not v1-ready while any required matrix cell remains failing.

---

## Actors

- A1. Focus-steering player: chooses Passing, Serving, or Setting because they came to train that skill today.
- A2. Pair-session player: expects a shared focus to produce a pair-realistic practice, not a private preference layered over mismatched drills.
- A3. Future catalog author or planning agent: needs a concrete coverage bar before activating, adapting, or authoring drills.
- A4. Product maintainer: needs the focus picker to remain trustworthy without hiding unsupported states or adding ad hoc exceptions.

---

## Key Flows

- F1. Coverage audit
  - **Trigger:** A planner evaluates whether Tune today is complete enough to ship or extend.
  - **Actors:** A3, A4
  - **Steps:** The planner audits every focus across the required matrix, counts eligible main/support/pressure/swap coverage, records source blockers, and marks failing cells.
  - **Outcome:** The repo has a clear pass/fail view of catalog readiness, not a raw drill count.
  - **Covered by:** R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R14
- F2. Focused practice generation
  - **Trigger:** A1 or A2 chooses a visible focus such as Serving.
  - **Actors:** A1, A2
  - **Steps:** The app builds a practice whose main work, support work, pressure work when applicable, and swaps reinforce the chosen focus at the user's effective level and configuration.
  - **Outcome:** The focus choice feels real across the whole practice shape, including long sessions.
  - **Covered by:** R3, R4, R6, R7, R8, R9, R10, R21, R22, R23, R24, R29, R30
- F3. Gap closure
  - **Trigger:** The audit finds a failing coverage cell.
  - **Actors:** A3, A4
  - **Steps:** The maintainer first looks for source-backed variant repairs, then activates safe existing reserves, then authors new source-backed drill records only when the gap remains real.
  - **Outcome:** Catalog expansion is disciplined but not blocked by the old cap when coverage is required for focus trust.
  - **Covered by:** R11, R12, R13, R14, R15, R16, R17

---

## Requirements

**Coverage matrix**

- R1. The readiness audit must cover all visible focus choices: Passing, Serving, and Setting.
- R2. The readiness audit must cover all skill levels the product can claim or carry in drill metadata: beginner, intermediate, and advanced.
- R3. The readiness audit must cover the current setup configurations: solo + net, solo + wall/no net, solo open/no net/no wall, pair + net, and pair open/no net. Pair wall is not a separate configuration unless the product later makes wall access meaningful for pair mode.
- R4. The readiness audit must cover short, standard, and long practice lengths, including an actual generated 45-minute practice. The current 40-minute profile may be used as a comparison point, but it never satisfies 45-minute readiness by proxy if the product offers or claims a 45-minute practice.
- R5. A focus/configuration/level/duration cell is not covered by raw drill-family count. It is covered only by eligible active variants after participant, equipment, net/wall, and unmodeled-requirement filters are applied.

**Practical depth floor**

- R6. Each covered cell must have at least two eligible main-work drill families for the chosen focus. Materially distinct variants may count only when the gap card explains how the source, setup, scoring, or constraint change creates a different training problem rather than a renamed repeat.
- R7. Each covered cell must have at least one focus-reinforcing support option for technique or movement-style work. Support does not need to share the exact focus tag, but it must clearly reinforce the chosen focus using source-backed rationale and must be selectable by the generator before readiness passes.
- R8. Each covered cell must have at least one eligible pressure, scoring, or game-like option for the chosen focus when pressure work is applicable.
- R9. Each covered main-work or pressure slot must have at least one same-focus swap alternative that is not the current drill family. Off-focus swap fallback does not count toward readiness.
- R10. Long sessions must pass the same floor without feeling like a stretched short session. They should include enough focus-reinforcing variety that a 45-minute Serving, Passing, or Setting practice does not repeat one concept under new names.

**Focus contract**

- R11. Volleycraft should not have visible thin or unavailable focus states. If Passing, Serving, and Setting are visible peer choices, all three must meet the readiness bar across the required matrix before named-focus Tune today is v1-ready.
- R12. The product should not rely on user-facing thin/unavailable copy as the primary solution. Failure copy remains useful for unexpected runtime errors, but catalog readiness should prevent known unsupported focus states.
- R13. Recommended may remain the default, but it must not be the escape hatch for incomplete named-focus coverage.

**Catalog expansion posture**

- R14. Failing coverage cells must produce source-backed gap cards that name the focus, configuration, skill level, duration, missing slot type, likely source material, blockers, and whether the fix is a variant repair, reserve activation, or new drill. Once a card proposes activation, it must list the affected `drillId` and `variantId` values or state that a new ID is required.
- R15. Expansion should be variant-first when a source-backed drill family already exists and the missing piece is an eligible solo/pair/no-net/one-ball variant.
- R16. Catalog readiness overrides the earlier authoring cap when a gap prevents Tune today from honoring a visible focus. New active drill records are allowed when source-backed variant repair and safe reserve activation cannot meet the readiness floor.
- R17. Source-backed does not mean automatically active. FIVB, BAB, and Volleyball Canada drills must still pass M001 feasibility, safety, participant, equipment, and courtside simplicity constraints before activation. Non-FIVB/BAB/Volley Canada sources may only fill a readiness gap when the gap card explains why those primary sources are insufficient, records the source quality, and applies the same exact-reference and adaptation-delta bar.

**Scope control**

- R18. This work stays inside the current focus set: Passing, Serving, and Setting. It must not add Attack, out-of-system, side-out, transition, or game-like as new Tune today focus chips.
- R19. This work may use scenario or game-like source concepts to create pressure options, but those concepts remain supporting metadata or drill shape, not new user-facing focus taxonomy.
- R20. This work must preserve the recommendation-first product stance. The answer is a stronger catalog behind simple choices, not a new setup form or custom practice builder.

**Readiness mechanics and audit artifact**

- R21. The readiness bar applies to behavior the app can actually express. If skill-level readiness is required, focused generation must consume the existing onboarding skill level, mapped through `skillLevelToDrillBand()`, before that cell can pass final readiness; metadata-only coverage is diagnostic, not sufficient. This slice must not add a new skill-level UI, override, or persistence path.
- R22. Explicit 45-minute readiness means a generated 45-minute practice can satisfy the same depth floor. Planning may choose the implementation shape, but readiness cannot be declared solely because the 40-minute profile passes or because a 45-minute total is inferred outside generated session behavior.
- R23. Pressure work is required for long sessions and for any session layout with a `pressure` slot. Short or standard layouts without a pressure slot may mark pressure `not_applicable`, but the audit must record the reason instead of silently exempting the cell.
- R24. Swap coverage is measured per generated focus-controlled slot. If a generated long session has both `main_skill` and `pressure` focus-controlled slots, each slot needs its own same-focus alternative.
- R25. The audit report should be scan-first: top summary by focus, failing cells grouped by visible user risk, then per-cell details with linked gap cards. Risk buckets are `cannot_generate`, `off_focus_support`, `no_same_focus_swap`, `thin_long_session`, `skill_level_unhonored`, and `source_trace_missing`.
- R26. Audit cells and gap cards use a fixed status vocabulary: `covered`, `failing`, `not_applicable`, `source_candidate`, `blocked_by_source`, `blocked_by_product_gate`, `fixed_pending_verification`, and `verified`. Status lifecycle is monotonic unless a regression is found: `failing` -> `source_candidate` -> `fixed_pending_verification` -> `verified`; `blocked_by_source` and `blocked_by_product_gate` require an explicit unblock note before moving forward.
- R27. Gap cards distinguish `candidate_source_material` from `exact_source_reference`. A card may start with candidate source material, but activation requires an exact source reference, adaptation delta, eligibility rationale, affected `drillId` / `variantId` traceability, and why the adapted variant remains faithful to the source and M001 constraints.
- R28. A cap override requires a named failing user-visible cell, a source-backed gap card, a variant-first check, the smallest useful activation batch, and a review checkpoint before additional drill records activate. Each override batch must have a manifest listing the included gap cards, new or changed `drillId` / `variantId` values, cap delta, verification command, and checkpoint criteria before the next batch starts.
- R29. No-net Serving coverage must be a source-backed serving-mechanics, routine, target, or partner-rehearsal promise. It must not pretend to train net-clearance or live serve pressure without a net.
- R30. Counts are not the only readiness proof. The audit must include generated-session coherence checks that sample practices read as focused end-to-end and do not pass by repeating one concept under different names.
- R31. This document inherits Tune today interaction, focus-chip accessibility, and focus-selection flow behavior from `docs/brainstorms/2026-04-29-session-focus-picker-requirements.md` and `docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md`; it does not redefine those UI contracts.
- R32. Every generated `technique` or `movement_proxy` slot counted by readiness must be focus-reinforcing for the selected named focus. `warmup` and `wrap` remain recommendation-owned and may stay general-purpose unless a later plan explicitly expands the focus contract to them.

---

## Acceptance Examples

- AE1. **Covers R1, R3, R6, R7, R8, R9, R24, R29, R32.** Given a pair + no-net setup, beginner level, and Serving focus, the readiness audit fails today unless it can find at least two eligible serving main-work options, one serving-reinforcing support option, one serving pressure option when pressure applies, and one same-focus swap for each generated focus-controlled slot.
- AE2. **Covers R4, R10, R22, R23, R30.** Given a 45-minute Serving practice for one or two players, an actual generated practice has enough serving-reinforcing main/support/pressure variety that it does not feel like a passing session with one serving block.
- AE3. **Covers R2, R5, R21.** Given an advanced Setting cell, a beginner-only setting drill does not count toward advanced readiness unless its variant or source adaptation is explicitly suitable for advanced use and the generator can honor the effective level from existing onboarding skill level via `skillLevelToDrillBand()`.
- AE4. **Covers R11, R12, R13.** Given a named focus is visible on Tune today, the app should not knowingly depend on "can't build this focus today" copy for a normal setup. Known unsupported cells are catalog-readiness failures.
- AE5. **Covers R14, R15, R16, R17.** Given a failing Serving/no-net/pair cell, the first follow-up is to inspect source-backed serving families for valid pair/open or one-ball variants before creating a new drill record; if no variant repair can satisfy the floor, a new source-backed drill may be authorized.
- AE6. **Covers R18, R19, R20.** Given FIVB has rich modified-game content, the work may use those formats to strengthen pressure blocks, but it must not add a "Game-like" chip or turn setup into a custom plan builder.
- AE7. **Covers R25, R26, R27.** Given the audit is generated or written, a future agent can scan focus-level health first, inspect failing cells by user-risk bucket, then open gap cards that separate candidate source material from exact activation-ready source references and affected catalog IDs.
- AE8. **Covers R28.** Given three Serving cells fail, planning proposes the smallest source-backed activation batch with a manifest and checkpoint instead of treating every failed cell as blanket permission for unlimited new drills.

---

## Success Criteria

- A user can choose Passing, Serving, or Setting without encountering a normal setup where the app knowingly cannot build a credible focused practice.
- Named-focus Tune today is not considered v1-ready until all required matrix cells are `verified` or explicitly `not_applicable`.
- A long focused practice, especially Serving, feels focused across support, main, pressure, and swap behavior rather than only in one block.
- Future agents can identify exactly which catalog cells are failing and why before proposing drill authoring.
- Source-backed expansion grows the catalog without counting ineligible source drills as active coverage.
- Skill-level and long-session readiness cannot pass on paper while generation still ignores those dimensions.
- Planning can proceed without inventing the coverage matrix, the minimum depth bar, or the cap posture.

---

## Scope Boundaries

- No thin/unavailable focus UX as a planned steady state.
- No new focus chips beyond Passing, Serving, and Setting.
- No Attack activation.
- No scenario taxonomy implementation.
- No hard skill-level UI or skill-level override in this requirements slice; readiness uses the existing onboarding skill level via `skillLevelToDrillBand()` and audits beginner/intermediate/advanced coverage.
- No AI-generated drill content.
- No group or 3+ player support unless a source-backed drill is being logged as a future gap card behind `D101`.
- No medical or injury-prevention claims in drill copy; safety-bearing changes still route through existing safety guidance.

---

## Key Decisions

- **No thin focus states.** Visible focus choices should be fully supported by the catalog, not presented as best-effort filters.
- **Maximal v1 readiness matrix.** Coverage includes skill level, current setup configurations, explicit 45-minute readiness, and swap depth.
- **Practical floor.** Each covered cell needs two main options, one support option, one pressure option where applicable, and one same-focus swap per focus-controlled slot.
- **Support-slot guarantee.** Readiness-counted `technique` and `movement_proxy` blocks must reinforce the selected named focus; `warmup` and `wrap` remain general recommendation-owned slots.
- **Variant-first expansion.** Prefer adapting or activating source-backed variants before authoring new drill families.
- **Readiness over cap, with a replacement protocol.** The previous authoring cap yields when missing catalog depth prevents Tune today from honoring its visible focus promise, but only through named gap cards, variant-first checks, smallest useful batches, and review checkpoints.

---

## Dependencies / Assumptions

- The current focus set remains Passing, Serving, and Setting.
- The source archives (`docs/research/fivb-source-material.md`, `docs/research/bab-source-material.md`, `docs/research/vdm-development-matrix-takeaways.md`, and `docs/research/ltd3-development-matrix-synthesis.md`) are sufficient to seed the first gap-card pass.
- Advanced-level coverage may expose larger catalog gaps than beginner/intermediate coverage; that is an expected finding, not a reason to weaken the matrix.
- Planning may decide whether explicit 45-minute support means a new time profile, a stronger long-profile audit, or both.

---

## Outstanding Questions

### Resolve Before Planning

- None.

### Deferred to Planning

- [Affects R4/R22][Technical] Decide the implementation shape for explicit 45-minute readiness, including whether to add a first-class 45-minute time profile or another mechanism that generates an actual 45-minute practice.
- [Affects R6-R10][Technical] Decide whether the audit should be a docs-only table, a test-backed generated report, or both.
- [Affects R15-R17][Needs research] For each failing cell, identify the exact FIVB, BAB, Volleyball Canada, or other source material that can safely fill the gap.

---

## Next Steps

-> `/ce-plan` for structured implementation planning of the focus coverage audit, source-backed gap cards, and variant-first catalog expansion sequence.