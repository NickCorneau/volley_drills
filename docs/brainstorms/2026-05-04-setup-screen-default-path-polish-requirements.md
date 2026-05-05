---
id: setup-screen-default-path-polish-requirements-2026-05-04
title: Setup Screen Default Path Polish Requirements
status: active
stage: validation
type: requirements
summary: "Requirements for making Focus read as optional tuning and clarifying the no-net wall/fence follow-up while preserving the setup default path."
date: 2026-05-04
topic: setup-screen-default-path-polish
---

# Setup Screen Default Path Polish Requirements

## Problem Frame

The merged setup screen is now the right shape: one page, low typing, and a build-ready default path. The remaining design issue is pressure, not capability. Because Solo, Net yes, 15 min, and Recommended focus can all appear selected at once, the UI should make clear that the user can accept the recommendation and only change what is different today. The polish should stay tiny: clarify Focus as optional tuning, make the wall/fence follow-up more practical, and preserve the current calm one-screen flow.

---

## Actors

- A1. Courtside player: wants to start a useful session quickly, with enough control to adapt to today’s court.
- A2. Downstream implementing agent: needs clear product boundaries so this does not become a broader setup redesign.

---

## Key Flows

- F1. Default build-ready setup
  - **Trigger:** A player lands on Today’s setup with the default choices selected.
  - **Actors:** A1
  - **Steps:** The player scans the setup rows, recognizes Focus as optional tuning, leaves Recommended selected, and taps `Build session`.
  - **Outcome:** The setup feels ready rather than unfinished; Safety remains the next step.
  - **Covered by:** R1, R2, R4

- F2. Solo with no net
  - **Trigger:** A player selects Solo and Net no.
  - **Actors:** A1
  - **Steps:** The screen reveals one subordinate wall/fence follow-up, the player answers it, and the build action becomes ready again.
  - **Outcome:** The extra question reads as a practical equipment fallback, not another top-level setup category.
  - **Covered by:** R2, R3

---

## Requirements

- R1. Focus must read as optional tuning, while keeping the existing Focus choices visible on the setup screen.
- R2. The build-ready default path must remain quiet: no extra enabled-footer helper copy, no new setup step, and no added required answer.
- R3. The wall/fence follow-up must remain visually subordinate under the Net section and use clearer equipment-oriented copy.
- R4. The polish must not make selected chips visually stronger, force Focus into the same visual weight as required setup rows, or broadly retune setup typography.
- R5. Existing setup behavior must remain intact: default selections, direct navigation to Safety, draft focus persistence only for non-recommended focus, and wall gating for Solo + no net.

---

## Acceptance Examples

- AE1. **Covers R1, R2, R4.** Given a fresh setup screen with Solo, Net yes, 15 min, and Recommended selected, when the player scans the screen, Focus is visibly marked as optional and `Build session` is enabled without any extra ready-state helper copy.
- AE2. **Covers R3, R5.** Given Solo is selected and Net is changed to no, when the wall/fence follow-up appears, it uses clearer nearby-equipment copy and still blocks build until the player answers yes or no.
- AE3. **Covers R5.** Given the player selects Passing focus and builds, when the draft is saved, the selected non-recommended focus is still persisted.

---

## Success Criteria

- A player can understand that the default setup is acceptable without having to inspect every chip.
- The conditional no-net path is clearer without becoming more prominent.
- A downstream agent can implement the polish as a small copy/state-test change, not a new setup architecture.

---

## Scope Boundaries

- Do not add a summary bar, readiness receipt, or dynamic CTA copy in this pass.
- Do not hide Focus behind another button or reintroduce a separate tuning page for this setup path.
- Do not change the chip component’s selected visual treatment globally.
- Do not make broad D127 typography changes or claim field readability improvements from browser-only evidence.

---

## Key Decisions

- Keep Focus visible but label it optional: this preserves the user’s request for fewer pages while reducing decision pressure.
- Keep footer copy reserved for incomplete states: the enabled `Build session` button should be the only strong footer signal.
- Keep Wall/fence nested: the follow-up is only relevant when no net is available, so it should not become a top-level setup section.

---

## Dependencies / Assumptions

- The current `Recommended` focus default remains the fastest common path.
- Existing setup tests are the right place to guard the product behavior.

---

## Outstanding Questions

### Resolve Before Planning

- None.

### Deferred to Planning

- [Affects R1][Technical] Whether the optional cue should be expressed as heading text or a separate helper line, based on the existing UI patterns.

---

## Next Steps

-> /ce-plan for structured implementation planning.
