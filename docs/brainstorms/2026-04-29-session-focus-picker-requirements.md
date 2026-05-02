---
id: session-focus-picker-requirements-2026-04-29
title: "Session focus picker requirements (partially superseded 2026-04-30)"
status: active
stage: validation
type: requirements
summary: "Requirements for the D135-fired Tier 1c session focus picker. Resolves the draft-screen ambiguity by selecting a Tune today review step as the v1 surface and codifies the architectural rigor (shared focus resolver, in-transaction regeneration use case, stale-write guards, repeat / recovery focus strip, accessibility semantics, privacy boundaries). PARTIALLY SUPERSEDED 2026-04-30: the short-lived opt-in fork in docs/brainstorms/2026-04-30-pre-run-simplification-requirements.md was itself superseded by docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md, which shipped mandatory Tune today with four chips, source-aware Back collapsed to setup/home, and no default Safety focus echo."
authority: "Requirements handoff for Tier 1c Stream 1 focus-picker behavior, draft-review surface, regeneration architecture, and repeat / recovery focus invariants. Final routing, chip presentation, and Safety echo are owned by docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md; everything else remains authoritative."
last_updated: 2026-05-02
depends_on:
  - docs/ideation/2026-04-28-what-to-add-next-ideation.md
  - docs/plans/2026-04-28-tier-1c-prepay-and-catalog-audit.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/decisions.md
decision_refs:
  - D91
  - D130
  - D131
  - D135
---

# Session Focus Picker Requirements

> **Partially superseded 2026-04-30.** The 2026-04-30 simplification brainstorm briefly proposed an opt-in Tune today path, but its own iteration log superseded that fork after red-team/user feedback. The final shipped plan is `docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md`: Tune today is mandatory on pre-run draft paths, renders four chips (`Recommended` / `Passing` / `Serving` / `Setting`) with fail-on-tap behavior, collapses source-aware Back to `setup` / `home`, and drops the default Safety focus echo. Remaining requirements here — especially focus regeneration, shared resolver, stale-write guards, and repeat / recovery focus strip — stay authoritative.

## Problem Frame

`D135` fired the Tier 1c focus-picker trigger: real partner/founder use surfaced the need to say "today I want serving" or otherwise steer the session toward pass, serve, or set. The active implementation plan correctly says the control must live after recommendation and not on `SetupScreen`, but it still says "draft screen" as if that surface already exists.

The current app has no dedicated draft-review route. `SetupScreen` builds a draft and routes to `/safety`; Home has `DraftCard`; `SafetyCheckScreen` renders only a one-line draft summary. If the focus picker only lands on Home, a fresh Setup flow misses the primary moment where a user wants to steer the newly recommended session. If it lands on Safety, preference tuning pollutes the safety contract. The right v1 is a minimal pre-safety **Tune today** review step: show the recommendation first, allow one-tap focus steering, then continue to Safety.

---

## Design Direction

- **Visual thesis.** Tune today should feel like a quiet confirmation step: warm off-white page, one white focal card, restrained accent, and enough space that the recommendation remains the center of attention.
- **Content plan.** Title and one short helper line, recommendation summary, focus control, today-only helper, pinned Continue to Safety. No block list, rationale paragraph, stats grid, icon row, or competing secondary action in v1.
- **Interaction plan.** Focus chips use the existing large-target selected/unselected states; regeneration shows one inline loading line while leaving the previous draft visible; failure reverts to the last valid focus and shows one short warning message.

---

## Architecture Direction

- **Architecture thesis.** Tune today is a dedicated draft-review route whose controller owns the saved `SessionDraft` and calls shared domain/service regeneration logic; the screen renders state and dispatches events.
- **State boundary.** `sessionFocus` is session-scoped state on the current draft context and resulting plan context. `Recommended` is UI-only and serializes as `undefined`.
- **Routing boundary.** Tune today owns draft review. Setup captures constraints, Tune today reviews/tunes the draft, Safety captures readiness, Run executes.
- **Selection boundary.** One shared pure focus-resolution rule feeds initial selection, build-time substitution, and swap alternatives so focused sessions cannot drift across candidate-pool paths.

---

## Definitions

- **Focus control state** is the UI selection: `Recommended`, `Passing`, `Serving`, or `Setting`.
- **Explicit session focus** is the stored session-scoped value: `pass`, `serve`, `set`, or `undefined`.
- **Recommended** means explicit session focus is `undefined`; it is a valid user choice, not a hidden missing state.
- **Inferred session focus** is the read-only label derived from selected blocks by existing inference logic. It must not be confused with the user's explicit session focus.

---

## Friction Budget / Trust Thesis

Tune today earns its extra step only if it makes the recommendation feel more controllable without becoming another setup form.

- No user is required to change focus; `Continue to Safety` is always the obvious happy path when a valid draft exists.
- The fresh Setup path adds at most one extra confirmation tap before Safety.
- The screen's copy budget stays short: one helper sentence, one focal summary, one today-only helper, one inline state message when needed.
- Stream 1 should dogfood focus alone before Stream 2 adds skill-level controls, unless a deliberate ledger script separately records focus-control and level-control use.

---

## Privacy / Data Boundary

- `sessionFocus` is not a profile, default, analytics, or telemetry field.
- While drafting, it may exist only on the current `SessionDraft.context`; after session creation, it may exist on `SessionPlan.context` as durable per-session training history.
- The current draft is transient and excluded from full-history export. Completed session plans are part of full-history export, so selected focus may leave the device only when the user exports or shares training data.
- "Today-only" means "does not become a future default or recommendation profile signal"; it does not mean completed session history forgets which focus was selected.
- Retention and deletion follow the existing session-history lifecycle. This feature adds no independent retention timer, remote copy, telemetry event, or profile mutation.

---

## Actors

- A1. Founder / returning player: starts a session with a concrete intent, such as serving today, and wants to steer without becoming a plan author.
- A2. Pair-session partner: shares the day's training intent and benefits when the session can be quickly aligned as a pair goal before safety/start.
- A3. Future implementation agent: needs a concrete surface decision so planning does not invent where the focus picker belongs.

---

## Key Flows

- F1. Fresh setup flow
  - **Trigger:** A1 completes `SetupScreen` and taps Build session.
  - **Actors:** A1
  - **Steps:** The app builds the recommended draft, routes to Tune today, shows the recommended session summary and focus control, then A1 either keeps Recommended or chooses Passing, Serving, or Setting.
  - **Outcome:** A saved draft exists with the chosen today-only focus semantics, and Continue routes to Safety.
  - **Covered by:** R1, R2, R3, R4, R5, R8, R9, R31, R32

- F2. Existing draft flow
  - **Trigger:** A1 opens Home with an existing current draft.
  - **Actors:** A1
  - **Steps:** Home still shows the draft card. The primary Start session action opens Tune today for the existing draft; Change setup remains the setup-edit escape hatch.
  - **Outcome:** Existing drafts pass through the same draft-review surface as fresh drafts without adding a third competing Home action.
  - **Covered by:** R6, R7, R32, R34

- F3. Focus change flow
  - **Trigger:** A1 changes focus from Recommended to a named focus, or back to Recommended.
  - **Actors:** A1
  - **Steps:** The app keeps the current draft visible while attempting to regenerate from the same setup context plus the selected focus. If regeneration succeeds, the summary updates. If regeneration fails, the prior draft remains and the app explains the failure briefly.
  - **Outcome:** Focus steering is reversible and never strands the user with no draft.
  - **Covered by:** R9, R10, R11, R12, R15, R36, R37, R38, R39

- F4. Safety recovery flow
  - **Trigger:** A1 selects or triggers a lighter recovery session from Safety after choosing a focus on Tune today.
  - **Actors:** A1
  - **Steps:** Safety replaces the draft with a recovery draft and makes clear that recovery overrides today's focus.
  - **Outcome:** The resulting plan does not claim an effective pass/serve/set focus for blocks that no longer contain focus-controlled work.
  - **Covered by:** R8, R18

---

## Requirements

**Tune today surface**
- R1. A newly built draft routes to a pre-safety Tune today review step before Safety. The step shows the recommendation before asking for any focus change.
- R2. Tune today uses one focal content card to summarize the recommended session in plain courtside language: archetype or session type as the main line, plus one compact metadata line with total minutes, block count, and current focus state.
- R3. Tune today has a primary Continue action that routes to Safety without requiring any focus change.
- R4. Tune today exposes exactly four focus states: Recommended, Passing, Serving, and Setting.
- R5. Recommended is the default state. It means "use the app's current recommendation" and maps to no explicit focus override.

**Home and safety boundaries**
- R6. Home `DraftCard` remains an entry point for existing drafts. Its primary Start session action routes to Tune today; its Change setup escape hatch remains for changing constraints.
- R7. Home is not the only focus-picker surface; fresh Setup users must encounter Tune today before Safety without first returning to Home.
- R8. Safety remains safety-only. It echoes the final focus control state as read-only metadata when available, but it does not offer focus controls.

**Focus behavior**
- R9. Selecting Passing, Serving, or Setting is today-only. It may persist as per-session history on the current `SessionDraft.context` and resulting `SessionPlan.context`, including full-history export with that plan, but it does not mutate onboarding, Settings, persistent profile/default data, last-used focus, or future default focus.
- R10. Focus changes regenerate the whole draft from the same setup context plus the selected focus. The app does not patch a single block in place as the primary behavior.
- R11. While regeneration is pending, the previous draft remains visible and both focus and continue actions prevent double-submit behavior.
- R12. All four focus states remain visible and enabled in v1. If a selected focus cannot produce a valid draft for the current setup, the app keeps the previous saved draft, does not write the attempted focus into the draft, and shows a short explanation rather than silently changing focus or deleting the draft.
- R13. The focus choice affects only `main_skill` and `pressure` selection semantics. Warmup, technique, movement, and wrap remain recommendation-owned.
- R14. Swap alternatives during the eventual run honor the same selected focus semantics as the initial draft. A Serving session should not offer off-focus main-skill or pressure swaps unless no valid focused alternative exists and the app explicitly explains the fallback.
- R15. Returning to Recommended clears explicit `sessionFocus` and restores the current Tune today visit's baseline Recommended draft when available; if no baseline is available, it regenerates with explicit focus cleared before saving.
- R16. New drafts built from completed `SessionPlan.context` must strip explicit `sessionFocus` before rebuilding, unless the user is continuing the still-current draft. Historical plans may retain `sessionFocus` only as session history, not as reusable setup input.
- R17. Home Repeat and Repeat what you did flows route rebuilt drafts to Tune today with Recommended selected.
- R18. If Safety switches to a recovery draft, explicit `sessionFocus` is cleared or treated as overridden by recovery. Safety copy should make clear that recovery overrides today's focus.

**Copy and UX**
- R19. Copy uses today-only language, such as "Today" or "this session," and avoids implying a permanent profile change.
- R20. The focus control is tap-first, large-target, and readable outdoors. No typing, sliders, hidden menus, or multi-step filter forms.
- R21. Labels use the existing user-facing gerund vocabulary: Passing, Serving, Setting. Internal enum names must not leak into UI copy.
- R22. Tune today follows a fixed calm hierarchy: title, recommendation summary, focus control, today-only helper, Continue to Safety.
- R23. Tune today must not add block-by-block previews, recommendation rationale paragraphs, icons, stats grids, or extra secondary actions in v1.
- R24. The focus control uses an existing large-target chip/radiogroup pattern with visible selected and focus states. Four choices may wrap or stack, but must not shrink below courtside tap-target expectations.
- R25. The focus control is implemented as a semantic radiogroup or native-radio equivalent with an accessible group name, keyboard traversal, selected state announcement, and visible focus ring.
- R26. Pending focus regeneration shows one inline loading message near the focus control and disables Continue plus focus taps until the attempt resolves.
- R27. Failed regeneration reverts to the last valid focus, keeps the prior draft, and shows one short inline warning message.
- R28. Loading, pending, and warning messages are announced politely to assistive technology without interrupting the screen.
- R29. Motion stays restrained and system-native: no decorative entrance animation or celebratory transition. Existing color/press transitions are sufficient.
- R30. User-facing copy must not imply the whole session is exclusively Passing, Serving, or Setting. If needed, helper copy may clarify that focus steers the main work while warmup and supporting blocks stay app-picked. In pair mode, copy should frame the selection as today's shared focus, not only the founder's private preference.

**Architecture guardrails**
- R31. Tune today is a first-class route registered through the app's typed route helpers, app route tree, and P12 screen-contract registry.
- R32. Every pre-run path that creates or opens the singleton current draft routes to Tune today after the draft exists: fresh Setup, onboarding Today's setup, Home DraftCard Start session, Home secondary draft Open, Repeat this session, and Repeat what you did. Change setup continues to route to Setup edit mode. Already-started session resume is not a pre-run draft path.
- R33. Tune today handles direct route entry: while loading the current draft it shows a loading state; if no current draft exists it redirects to Setup with replace semantics; if draft loading fails it shows a retryable error and a Back to setup action.
- R34. Tune today Back is source-aware. From fresh Setup it returns to Setup in edit-draft mode with the saved draft intact; from Home, repeat, or unknown source it returns Home with the saved draft intact. Escape does not navigate the screen.
- R35. Tune today does not import Dexie/db directly. It uses existing session service/domain functions, with a controller or local use-case hook when that keeps the screen thin.
- R36. Successful focus regeneration saves or commits a full replacement draft with the updated context and regenerated blocks before the visible summary is treated as committed.
- R37. Focus regeneration captures the source draft identity (`updatedAt` or an equivalent revision token), re-reads before saving, and discards the result if the current draft changed or the controller unmounted.
- R38. Regeneration uses a `DraftRegenerationInput` assembled outside the screen component: `SetupContext` with the selected focus, the chosen assembly-seed policy, and the same recent-completion substitution input used by normal Setup builds. Planning must choose whether substitution input is snapshotted on draft creation or re-queried inside the regeneration use case.
- R39. If regeneration builds successfully but saving the replacement draft fails, Tune today keeps the prior saved draft visible/current, reverts to the last saved focus, re-enables controls, and shows a retryable warning.
- R40. One shared pure focus resolver defines effective skill tags for `main_skill` and `pressure` candidate pools. It is consumed by initial slot picking, build-time main-skill substitution, and swap alternatives.
- R41. Focused swap fallback is explicit: if no focused alternative exists for `main_skill` or `pressure`, the app either shows no alternative or explains the fallback. It must not silently show off-focus options.
- R42. Future skill-level mutability may share the Tune today surface, but it remains a separate context field, separate control row, separate implementation stream, and must make its own retention/export/privacy decision before implementation.
- R43. This document authorizes Stream 1 only. Stream 2 skill-level mutability must be replanned after Tune today exists; no shared adjustment abstraction or second control row ships in the focus-picker implementation.
- R44. The older "Swap-Focus button" / fixed cycle wording in prior plans is superseded for v1 UI by this document's four-option chip/radiogroup requirement.

---

## Acceptance Examples

- AE1. **Covers R1, R3, R4, R5, R31, R32.** Given a fresh setup with no selected focus, when the user taps Build session, the app shows Tune today before Safety with Recommended selected and Continue available.
- AE2. **Covers R9, R10, R15, R36.** Given Tune today shows Recommended, when the user chooses Serving and then chooses Recommended again, the draft returns to the visit's baseline recommendation behavior without changing any persistent setting.
- AE3. **Covers R11, R12, R27, R39.** Given a user chooses Setting in a setup that cannot produce a valid setting-focused draft, the previous draft remains visible and the user sees a short "Can't build a setting-focused session for this setup" style explanation.
- AE4. **Covers R13, R14, R40, R41.** Given the user starts a Serving-focused session, when they later swap a `main_skill` or `pressure` block, the offered alternatives respect Serving focus by default.
- AE5. **Covers R6, R7, R8, R32, R34.** Given a current draft exists on Home, the primary Start session action opens Tune today for that draft, Change setup still opens Setup edit mode, and Safety contains only safety/readiness controls plus a read-only session summary.
- AE6. **Covers R22, R23, R24, R25.** Given Tune today renders on a 390 px iPhone-class viewport, the screen presents one focal recommendation card, one focus chip group, and one primary Continue action without block previews or competing secondary controls.
- AE7. **Covers R31, R35, R40.** Given Tune today is implemented, a future agent can trace route registration, screen contract, screen-thin draft IO, and shared focus resolution without finding selection logic duplicated in screen code.
- AE8. **Covers R33.** Given a user opens Tune today with no current draft, when the screen resolves loading, the app redirects to Setup and does not show focus controls.
- AE9. **Covers R32.** Given Home exposes a secondary current-draft row, Repeat this session, or Repeat what you did, when the user opens or creates a pre-run draft from those paths, Tune today opens before Safety.
- AE10. **Covers R34.** Given a user builds a fresh setup and lands on Tune today, when they tap Back, Setup opens in edit-draft mode and the saved draft remains unchanged.
- AE11. **Covers R34.** Given a user opened Tune today from Home, repeat, or an unknown source, when they tap Back, Home renders the same draft and no draft fields are mutated.
- AE12. **Covers R37, R39.** Given focus regeneration succeeds in memory but saving the replacement draft fails, the prior draft summary remains visible, the prior focus remains selected, Continue is re-enabled, and an inline retryable warning is shown.
- AE13. **Covers R16, R17.** Given a prior completed plan was Serving-focused, when the user taps Repeat this session or Repeat what you did on a later day, the rebuilt draft opens Tune today with Recommended selected rather than silently preserving Serving.
- AE14. **Covers R8, R18.** Given a Serving-focused draft reaches Safety, Safety shows the focus as read-only metadata; if the user switches to recovery, Safety makes clear that recovery overrides today's focus and the resulting recovery plan does not claim Serving as effective focus.
- AE15. **Covers R30.** Given the draft is pair-mode, Tune today frames the choice as the pair's shared focus for this session, not as a private founder preference.

---

## Success Criteria

- A user who knows what they came to train can steer the next session after seeing the recommendation and before answering Safety.
- A user who does not care can keep Recommended and continue with one obvious action.
- Safety remains focused on readiness, not preference tuning.
- Planning no longer has to invent what "draft screen" means for Tier 1c.
- Focus selection semantics are shared across initial assembly, build-time substitution, and swap alternatives.
- Stream 1 can be dogfooded alone before any skill-level mutability control is added to the same surface.

---

## Scope Boundaries

- No SetupScreen focus picker.
- No editable focus controls on Safety.
- No persistence beyond the current draft/session plan context; no persistent last-used focus, profile mutation, Dexie migration, or telemetry.
- No skill-level override implementation in this requirements slice: no controls, context fields, copy, tests, or implementation affordances.
- No hard level filtering.
- No new drill authoring and no Tier 1b authoring-cap consumption.
- No rich block-by-block preview in v1.

---

## Key Decisions

- **KD1. Tune today is the v1 draft-review surface.** It is the smallest honest surface that fresh Setup users actually encounter before Safety.
- **KD2. Home is an entry point, not the canonical focus surface.** Home can expose Tune today for existing drafts, but relying on Home alone misses the fresh-build path.
- **KD3. Safety stays pure.** Preference tuning and safety readiness answer different questions and should not share controls.
- **KD4. Recommended is explicit but not serialized as a focus value.** It should feel like a valid user choice while preserving current behavior (`undefined` in context).
- **KD5. Regeneration beats patching.** Rebuilding the draft keeps session assembly, rationale, substitution, and later swap semantics coherent.
- **KD6. Tune today owns draft review but not persistence policy.** Session-scoped focus belongs on draft/plan context; long-lived preference remains out of scope.
- **KD7. Focus resolution is shared domain behavior.** The same rule must govern initial picks, build-time substitution, and swaps.
- **KD8. Swap parity stays in v1 despite scope pressure.** A focused session that later offers off-focus main-work swaps would break the core trust promise; the scope boundary is enforced by changing only `main_skill` / `pressure` candidate semantics, not by deferring swaps.

---

## Dependencies / Assumptions

- The active implementation plan remains sequenced as catalog audit first, then Tier 1c focus picker, then skill-level override.
- `D135` remains the authority for treating the Tier 1c trigger as fired.
- The Tune today route/surface may be created during planning; this brainstorm verifies that a dedicated draft-review route does not exist today and selects one at the requirements level.
- The existing active plan's "Swap-Focus button" cycle language is treated as superseded UI detail. Its domain intent survives; this requirements doc owns the v1 surface shape.

---

## Outstanding Questions

### Resolve Before Planning

- None.

### Deferred to Planning

- [Affects R10][Technical] Whether draft regeneration should preserve the previous assembly seed or mint a fresh seed when focus changes.
- [Affects R38][Technical] Whether recent-completion substitution input is snapshotted on draft creation or re-queried inside the regeneration use case.

---

## Next Steps

-> `/ce-plan` for structured implementation planning of the Tier 1c session focus picker, using Tune today as the selected v1 draft-review surface.
