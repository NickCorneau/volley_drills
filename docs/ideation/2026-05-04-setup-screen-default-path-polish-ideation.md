---
id: setup-screen-default-path-polish-ideation-2026-05-04
title: Setup Screen Default Path Polish Ideation
status: active
stage: validation
type: ideation
summary: "Ranked ideation for clarifying the build-ready setup screen without adding new setup steps or louder chip states."
date: 2026-05-04
topic: setup-screen-default-path-polish
focus: SetupScreen polish after Focus moved into Today's setup and Solo/Net defaults were added
mode: repo-grounded
---

# Ideation: Setup Screen Default Path Polish

## Grounding Context

The setup screen now carries Players, Net, Time, and Focus on one mobile-first surface. Fresh setup defaults to Solo, Net yes, 15 min, and Recommended focus; the `Build session` CTA is already enabled on the default path. Design review found that the current one-screen structure is directionally right: keep Focus as a wrapped pill row, keep Wall/fence nested under Net when Solo + no net is selected, avoid enabled footer helper copy, and do not make selected chips visually louder.

Relevant constraints:

- `docs/research/brand-ux-guidelines.md` treats `/setup` typography as inspect-only unless touched copy is trust-critical or active-use.
- `docs/research/japanese-inspired-visual-direction.md` defines calm/shibui as restraint, spacing, and focus, not lower contrast or smaller type.
- `docs/research/outdoor-courtside-ui-brief.md` keeps large tap targets, light surfaces, and readable near-black text as the prep-screen baseline.
- `docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md` established that setup should ask only what changes today and should not reintroduce dead-read controls.

## Ranked Ideas

### 1. Optional Focus Cue

**Description:** Keep the Focus pill row, but label the section as optional using the existing quiet optional-label pattern.

**Rationale:** Focus is useful tuning, but Recommended is the default happy path and is only persisted when the user chooses a non-recommended focus. The UI should not make Focus feel as required as Players, Net, and Time.

**Downsides:** Adds a little more copy to an already dense setup screen, so it should be expressed in the heading rather than as another helper line.

**Confidence:** 90%

**Complexity:** Low

**Status:** Explored

### 2. Practical Wall Follow-Up Copy

**Description:** Change the conditional wall prompt from `Wall or fence?` to `Wall or fence nearby?`.

**Rationale:** The nested question appears only when Solo + no net is selected. The current copy is terse enough to feel like a category label; the revised copy makes it clearly about available training equipment.

**Downsides:** Very small change; only improves a conditional path.

**Confidence:** 85%

**Complexity:** Low

**Status:** Explored

### 3. Default Confidence Line

**Description:** Add a quiet line under the title such as `Change only what is different today.`

**Rationale:** This reframes setup as exception handling instead of form completion.

**Downsides:** It may add visual noise at the top of a screen that is already working, and it risks reintroducing a stale-context-banner feel that recent cleanup removed.

**Confidence:** 62%

**Complexity:** Low

**Status:** Unexplored

### 4. Dynamic Build CTA

**Description:** Change the button label based on focus or setup, such as `Build recommended session` or `Build passing session`.

**Rationale:** The CTA could confirm that the default is intentional.

**Downsides:** It may make the footer busier and overstate how much the chosen focus changes the generated session. Keep the primary action stable for now.

**Confidence:** 45%

**Complexity:** Medium

**Status:** Unexplored

### 5. Setup Summary Sentence

**Description:** Add a readiness sentence like `Ready: Solo, net, 15 min, recommended focus`.

**Rationale:** A readback could make defaults feel intentional and glanceable.

**Downsides:** It duplicates chip state, adds another scan target, and may compete with the one strong CTA.

**Confidence:** 40%

**Complexity:** Medium

**Status:** Unexplored

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| 1 | Forced 2x2 Focus grid | Gives optional tuning the same weight as required setup rows. |
| 2 | Solid selected-chip treatment | Makes four default selections feel louder and more fatiguing. |
| 3 | Footer helper copy when enabled | Makes a ready form feel conditional; helper copy should remain for incomplete states only. |
| 4 | Hide Focus behind a new button | Reintroduces another step/control after the user just asked to reduce pages and buttons. |
| 5 | Collapse setup into a summary-first editor | Promising later, but too large for the current polish pass and would need more product validation. |
