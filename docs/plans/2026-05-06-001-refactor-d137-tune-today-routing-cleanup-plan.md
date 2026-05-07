---
id: d137-tune-today-routing-cleanup-plan-2026-05-06
title: "Refactor D137 Tune Today Routing Cleanup"
type: refactor
status: complete
stage: validation
date: 2026-05-06
last_updated: 2026-05-06
origin: docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md
authority: "Implementation plan for D137 route cleanup and the 2026-05-04 skill-level relax-signal cleanup."
depends_on:
  - docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md
  - docs/plans/2026-05-05-001-merge-focus-coverage-and-collapse-branches-plan.md
  - docs/ops/app-architecture-guidance.md
summary: "Plan to delete Tune today and levelRelaxed plumbing, route Home repeat paths to Safety, preserve Settings skill-level override, rename the focus coverage audit bucket, and sync the D137 decision trail."
---

# Refactor D137 Tune Today Routing Cleanup

## Summary

Implement D137 as a delete-and-ratify pass: remove Tune today and the dead skill-level relax-signal path, normalize Home repeat paths to Safety, keep Settings as the skill-level override, and update the audit/docs trail to match post-merge engine reality.

---

## Problem Frame

The 2026-05-05 merge left the app with the desired Setup → Safety shape but retained the old Tune today route and `levelRelaxed` plumbing. That dead surface now makes both product behavior and future-agent routing harder to reason about.

---

## Requirements

**Routing shape**
- R1. Setup → Safety remains the canonical pre-run route, with Focus inline on Setup and Recommended defaulted.
- R2. `/tune-today`, `TuneTodayScreen`, the Tune today controller, screen contract, and `regenerateDraftFocus` are removed.
- R3. Home repeat, repeat-what-you-did, and draft-start actions route directly to Safety.

**Skill-level cleanup**
- R4. No replacement relax-signal UI is introduced.
- R5. `SessionDraft.levelRelaxed` and all read/write plumbing are removed.
- R6. `focusCoverageAudit` renames `level_unhonored` to `cannot_generate_at_level`.
- R7. `/settings/skill-level` remains the durable skill-level override.
- R8. Settings keeps a compact correction path when no valid saved level is available so migrated/backfilled users can repair the profile; normal saved-level access still shows the current label.
- R9. The Settings skill-level picker marks the current saved level.

**Design polish**
- R10. `SettingsSkillLevelScreen` uses shared `ScreenHeader`.
- R11. `ChoiceSubsection` adds a 150-200 ms CSS-only reveal transition.

**Decision trail**
- R12. `docs/decisions.md` records D137 without modifying the unrelated D135 row.
- R13. Superseded Tune today / relax-signal docs point forward to D137.
- R14. `docs/status/current-state.md`, `docs/catalog.json`, and app-facing docs reflect the cleanup.

**Origin actors:** A1 founder + partner user, A2 future M001 player, A3 Settings revisit user.

**Origin flows:** F1 fresh setup, F2 repeat session, F3 skill-level recalibration.

**Origin acceptance examples:** AE1-AE10 from `docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md`.

---

## Scope Boundaries

- Do not consolidate `focusReadiness`, `focusCoverageAudit`, or `generatedPlanDiagnostics`; that is D138.
- Do not decide validator script gating or compression; that is D139. CI adoption is one possible gating outcome, not a separate scope.
- Do not add or edit drill catalog source content or drill variants.
- Do not refactor `generatedPlanDiagnosticTriage` type names.
- Do not add daily difficulty controls, a pre-build preview screen, or any replacement relax-signal UI.
- Do not change onboarding skill-level behavior beyond keeping shared picker compatibility.

### Deferred to Follow-Up Work

- D138 diagnostic spine canonicality: separate brainstorm + plan.
- D139 validator script gating or compression: separate brainstorm + plan.
- Auto-managed skill level: future product work after more M001/D130 evidence.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/routes.ts`, `app/src/App.tsx`, and `app/src/contracts/screenContracts.ts` own route registration and P12 screen contracts; route deletion should remove all route-facing surfaces in lock-step.
- `app/src/screens/HomeScreen.tsx` currently routes `handleDraftStart`, `handleRepeat`, and `handleRepeatWhatYouDid` to `routes.tuneToday()`. These should switch to `routes.safety()` while preserving existing rebuild/fallback behavior.
- `app/src/components/FirstOpenGate.tsx` only routes incomplete onboarding from `/`, so stale `/tune-today` deep links need an explicit first-open guard after the route is removed.
- `app/src/screens/SetupScreen.tsx` already routes Build session directly to Safety, so this plan should preserve it rather than rework Setup.
- `app/src/screens/TuneTodayScreen.tsx`, `app/src/screens/tuneToday/useTuneTodayController.ts`, and `app/src/services/session/regenerateDraftFocus.ts` are the removable Tune today surface.
- `app/src/model/draft.ts` still documents and exposes `levelRelaxed`; no post-merge build path produces a meaningful relax signal.
- `app/src/screens/SettingsScreen.tsx`, `app/src/screens/SettingsSkillLevelScreen.tsx`, and `app/src/components/onboarding/SkillLevelPicker.tsx` own the Settings override.
- `app/src/components/ui/ChoiceSection.tsx` owns `ChoiceSubsection`; the wall/fence reveal should land in the shared primitive, not in `SetupScreen`.
- `app/src/data/focusCoverageAudit.ts`, `app/src/data/__tests__/focusCoverageAudit.test.ts`, and `app/src/data/__tests__/focusCoverageAudit.snapshot.json` own the audit bucket vocabulary.
- `README.md` and `app/README.md` both contain app-flow/current-state prose that can become stale when `/tune-today` is deleted.

### Institutional Learnings

- `docs/solutions/workflow-issues/route-founder-use-feedback-without-overfiring-scope-2026-05-04.md`: keep founder-use evidence narrow; D137 is cleanup/ratification, not a feature expansion.
- `docs/brainstorms/2026-05-04-skill-level-mutability-requirements.md`: preserve Settings mutability but do not turn skill level into a daily tuning knob.
- `docs/plans/2026-05-04-007-feat-app-wide-choice-ui-consistency-plan.md`: extend shared `ChoiceSection` primitives rather than adding bespoke setup markup.
- `docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md`: diagnostic labels are product truth surfaces and must match engine behavior.
- `docs/ops/app-architecture-guidance.md`: route and docs propagation need to move together across route helpers, app routes, contracts, tests, and docs.

### External References

- None. Local patterns are sufficient.

---

## Key Technical Decisions

- Clean delete `/tune-today` rather than redirect-stub it. The origin doc explicitly rejects keeping dead route surface area, and the existing unmatched-route fallback already handles stale URLs.
- Route Home repeat paths to Safety after saving a draft, while preserving the existing fallback-to-Setup behavior when rebuild fails.
- Treat stale persisted `levelRelaxed` fields as harmless extra data. No Dexie migration is needed because TypeScript code stops reading the optional field.
- Add current-level display as an opt-in `SkillLevelPicker` prop. Onboarding does not pass it; Settings does.
- Mark the current saved level with visible `Current` text, an accent outline, and `aria-current="true"` while keeping the card enabled and tappable.
- Keep the `ChoiceSubsection` transition CSS-only and primitive-level. Avoid adding animation dependencies or screen-local wrappers unless implementation reveals a pure-CSS mount limitation.
- Rename only the audit bucket label and explanatory comments; do not broaden this into diagnostic consolidation.
- Reserve D137 for routing cleanup, D138 for diagnostic spine canonicality, and D139 for validator script gating or compression.

---

## Open Questions

### Resolved During Planning

- D-number assignment: use D137 because D136 was a retracted provisional slot under O24, and leave decisions.md D135 untouched.
- Tune today deletion vs redirect: delete; the app already has a catchall fallback for stale URLs.
- `regenerateDraftFocus` callers: local research found only Tune today controller and its test as consumers, plus service barrel exports.

### Deferred to Implementation

- Exact `ChoiceSubsection` transition classes should be picked during implementation within the 150-200 ms range; if mount/unmount makes height animation awkward, prefer the smallest primitive-level adaptation that preserves the API.

---

## Implementation Units

- U1. **Route And Home Flow Cleanup**

**Goal:** Remove Tune today from app routing and send every pre-run route path to Safety.

**Requirements:** R1, R2, R3, R4.

**Dependencies:** None.

**Files:**
- Modify: `app/src/routes.ts`
- Modify: `app/src/App.tsx`
- Modify: `app/src/contracts/screenContracts.ts`
- Modify: `app/src/components/FirstOpenGate.tsx`
- Modify: `app/src/screens/HomeScreen.tsx`
- Test: `app/src/contracts/__tests__/screenContracts.test.ts`
- Test: `app/src/components/__tests__/FirstOpenGate.test.tsx`
- Test: `app/src/components/__tests__/FirstOpenGate.resume.test.tsx`
- Test: `app/src/screens/__tests__/HomeScreen.repeat-focus.test.tsx`
- Test: `app/src/screens/__tests__/HomeScreen.repeat-ended-early.test.tsx`
- Test: `app/src/screens/__tests__/HomeScreen.repeat-race.test.tsx`

**Approach:**
- Remove the `tuneToday` route path, route helper, `<Route>`, import, and screen-contract entry together.
- Replace Home draft/repeat/repeat-what-you-did success navigations with `routes.safety()`.
- Update Home comments to describe Repeat → Safety and preserve existing Setup fallback behavior.
- Treat stale `/tune-today` and first-open Settings deep links as onboarding entry paths when onboarding or skill-level collection is incomplete; completed users with a saved skill level can still fall through to Home via the unmatched-route redirect.

**Execution note:** Update the affected route expectation tests before or alongside code changes so stale Tune today assertions drive the cleanup.

**Patterns to follow:**
- Existing route helper usage in `SetupScreen` and `SafetyCheckScreen`.
- P12 exhaustiveness enforced by `screenContracts.test.ts`.

**Test scenarios:**
- Happy path: full Repeat from Home rebuilds a draft with prior focus and lands on Safety.
- Happy path: Repeat with persisted onboarding skill level still applies the mapped player level and lands on Safety.
- Edge case: ended-early full repeat writes a full-plan draft and lands on Safety.
- Race guard: competing Home actions remain disabled while Repeat rebuilds, then Safety appears.
- Integration: route-contract test passes after `tuneToday` is removed from both route paths and contracts.
- Edge case: first-open stale `/tune-today` routes to onboarding skill level instead of bypassing onboarding to Home.
- Edge case: completed-user stale `/tune-today` redirects with replace to Home and does not loop on Back.

**Verification:**
- No `routes.tuneToday` call sites remain in app code.
- Stale `/tune-today` is safe for both incomplete onboarding and completed-user deep-link cases.

---

- U2. **Delete Tune Today And Relax-Signal Plumbing**

**Goal:** Remove the screen/controller/service/test surface and delete `SessionDraft.levelRelaxed`.

**Requirements:** R2, R4, R5.

**Dependencies:** U1.

**Files:**
- Delete: `app/src/screens/TuneTodayScreen.tsx`
- Delete: `app/src/screens/tuneToday/useTuneTodayController.ts`
- Delete: `app/src/screens/__tests__/TuneTodayScreen.test.tsx`
- Delete: `app/src/services/session/regenerateDraftFocus.ts`
- Delete: `app/src/services/session/__tests__/regenerateDraftFocus.test.ts`
- Modify: `app/src/services/session/index.ts`
- Modify: `app/src/model/draft.ts`
- Modify: `app/src/components/ui/ChoiceRow.tsx`
- Modify: `app/src/components/patterns/ScreenHeader.tsx`
- Modify: `app/src/lib/skillLevel.ts`
- Test: existing TypeScript build and affected session test suites

**Approach:**
- Remove service barrel exports for `regenerateDraftFocus`.
- Remove the `levelRelaxed` field and its explanatory JSDoc from `SessionDraft`.
- Sweep app code, tests, and active-code comments for `TuneToday`, `Tune today`, `tuneToday`, `regenerateDraftFocus`, `levelRelaxed`, and `relaxation eyebrow`.

**Patterns to follow:**
- Existing model file comments should describe current persisted shape only; do not leave historical Tune today rationale in the active model contract.

**Test scenarios:**
- Compile-time: no imports reference deleted Tune today/service files.
- Integration: stale drafts with extra persisted `levelRelaxed` data do not require migration because app code does not read the field.
- Regression: seeding a legacy draft object with extra `levelRelaxed: true` still allows Safety to promote a plan, and the saved plan does not carry the field.
- Regression: no UI test asserts eyebrow behavior after deletion.

**Verification:**
- Text search finds no live app references to `levelRelaxed`, `TuneToday`, or `regenerateDraftFocus`.

---

- U3. **Settings Skill-Level Override Polish**

**Goal:** Preserve the Settings override while making it honest and current-state aware.

**Requirements:** R7, R8, R9, R10.

**Dependencies:** U2 for removal of the eyebrow/fallback rationale.

**Files:**
- Modify: `app/src/screens/SettingsScreen.tsx`
- Modify: `app/src/screens/SettingsSkillLevelScreen.tsx`
- Modify: `app/src/components/onboarding/SkillLevelPicker.tsx`
- Test: `app/src/screens/__tests__/SettingsScreen.test.tsx`
- Test: `app/src/screens/__tests__/SettingsSkillLevelScreen.test.tsx`
- Test: `app/src/components/onboarding/__tests__/SkillLevelPicker.test.tsx`

**Approach:**
- Hide the Settings skill-level section when no valid saved level is available.
- Add an optional current-level marker to `SkillLevelPicker` and pass it from `SettingsSkillLevelScreen`.
- Load the current saved level in `SettingsSkillLevelScreen` without mutating onboarding step semantics.
- Replace the hand-rolled settings sub-route header with `ScreenHeader`.
- Pin Settings states before implementation:
  - loading: no fallback text flash;
  - valid saved level: show section with current label and Change affordance;
  - missing/invalid value: show a compact Set skill level correction row;
  - read error: follow current Settings fail-quiet pattern;
  - direct `/settings/skill-level` with no saved level: render picker with no current marker and still allow a write.
- Pin the current card behavior: visible `Current` marker, accent outline, `aria-current="true"`, card remains enabled and follows the same save-and-return behavior if tapped.

**Execution note:** Test-first for `SkillLevelPicker.currentLevel` and Settings fallback behavior; the visual marker is small but user-facing.

**Patterns to follow:**
- Existing async single-shot Settings reads for tally/skill-level.
- Existing `ScreenHeader` usage in `SettingsScreen` and `SetupScreen`.

**Test scenarios:**
- Happy path: Settings with saved level renders "Your level" and Change navigates to the sub-route.
- Edge case: Settings with no saved level shows the correction row and routes to the skill-level sub-route.
- Happy path: Settings sub-route marks the current saved level and still writes a changed pick back to storage.
- Accessibility: current-level card exposes an accessible current-state marker.
- Edge case: direct `/settings/skill-level` with no saved value renders no current marker and still writes a selected level.
- Regression: onboarding `SkillLevelPicker` use remains unchanged when no current level is passed.

**Verification:**
- The override route still writes only `onboarding.skillLevel` and does not mutate `onboarding.step`.

---

- U4. **ChoiceSubsection Reveal Transition**

**Goal:** Make conditional choice rows reveal deliberately instead of popping layout.

**Requirements:** R11.

**Dependencies:** None.

**Files:**
- Modify: `app/src/components/ui/ChoiceSection.tsx`
- Test: existing Setup screen tests or a focused component test if the transition needs explicit coverage

**Approach:**
- Add a primitive-level CSS-only height/opacity transition for `ChoiceSubsection`.
- Preserve `titleId`, `aria-labelledby`, heading hierarchy, and children API.
- Avoid adding dependencies or caller-specific motion logic.
- Use reduced-motion-safe classes, do not steal focus when the subsection appears, preserve DOM order after the triggering choice, and keep touch targets unchanged.
- Keep this in the D137 pass because Setup becomes the canonical pre-run page; the conditional wall/fence reveal is now part of the primary setup experience rather than an incidental secondary screen detail.

**Patterns to follow:**
- Existing `ChoiceSection` primitive owns conditional row layout.
- Tailwind utility transitions already used across the app for low-cost interaction polish.

**Test scenarios:**
- Visual/manual: Setup Solo + No net reveals the wall/fence subsection with a short transition.
- Accessibility: keyboard selection of Solo + No net reveals the subsection without moving focus unexpectedly.
- Regression: ChoiceSubsection still renders title, description, and children with stable IDs.

**Verification:**
- No new animation dependency is introduced.

---

- U5. **Focus Coverage Audit Bucket Rename**

**Goal:** Align the audit vocabulary with post-merge engine behavior.

**Requirements:** R6.

**Dependencies:** None.

**Files:**
- Modify: `app/src/data/focusCoverageAudit.ts`
- Modify: `app/src/data/__tests__/focusCoverageAudit.test.ts`
- Modify: `app/src/data/__tests__/focusCoverageAudit.snapshot.json`
- Modify: `app/scripts/generate-coverage-report.ts`
- Modify: `docs/reviews/2026-05-04-focus-coverage-audit.md`

**Approach:**
- Rename `level_unhonored` to `cannot_generate_at_level` in the risk union, risk accumulation, summary initialization, test fixtures, and generated markdown/report surfaces.
- Keep detection logic unchanged.
- Rewrite or remove stale generated-report prose that describes `level_unhonored`, level relaxation, or the Tune today eyebrow; prefer report copy derived from the current audit result instead of hardcoded historical failure narrative.

**Patterns to follow:**
- Existing snapshot-driven audit flow: code + snapshot + generated markdown move together.

**Test scenarios:**
- Happy path: summary still reports 180 covered / 0 failing with the new bucket name at zero.
- Regression: no snapshot or generated report contains `level_unhonored`.
- Integration: report generation still reads the same audit output shape with the renamed bucket.
- Regression: generated markdown no longer says the Tune today eyebrow fires when the audit bucket appears.

**Verification:**
- Audit snapshots rebaseline only label text, not coverage semantics.

---

- U6. **Decision Trail And Docs Sync**

**Goal:** Make D137 discoverable and retire stale Tune today / eyebrow docs.

**Requirements:** R12, R13, R14.

**Dependencies:** U1-U5 should define the final app behavior before status text is finalized.

**Files:**
- Modify: `docs/decisions.md`
- Modify: `docs/status/current-state.md`
- Modify: `docs/catalog.json`
- Modify: `README.md`
- Modify: `app/README.md`
- Modify: `docs/brainstorms/2026-05-04-skill-level-mutability-requirements.md`
- Modify: `docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md`
- Modify: `docs/plans/2026-05-04-001-feat-skill-level-mutability-plan.md`
- Reference: `docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md`
- Reference: `docs/plans/2026-05-06-001-refactor-d137-tune-today-routing-cleanup-plan.md`

**Approach:**
- Add D137 as the routing-shape ratification row in `docs/decisions.md`.
- Mark the specific Tune today / relax-signal portions of older active docs as superseded by D137 without broadly invalidating shipped plan registries.
- Keep complete shipped registries in `docs/plans/` as `complete` + `active_registry: true` unless intentionally changing them to `superseded`; do not add `canonical_successor` to a complete active registry.
- Verify/update existing D137 catalog entries rather than adding duplicates. Catalog ids to inspect include `d137-tune-today-routing-resolution-requirements-2026-05-06`, `d137-tune-today-routing-cleanup-plan-2026-05-06`, `skill-level-mutability-requirements-2026-05-04`, `skill-level-mutability-2026-05-04`, and `merge-focus-coverage-and-collapse-branches-2026-05-05`.
- Update `README.md` and `app/README.md` route/current-flow prose so cold agents do not rediscover deleted `/tune-today`.

**Patterns to follow:**
- `docs/ops/agent-documentation-contract.md` change propagation rules.
- Existing catalog entries with `canonical_successor` for superseded docs.

**Test scenarios:**
- Documentation validation: agent docs validation passes.
- Traceability: a reader can follow D137 from decisions → brainstorm → plan → status.
- Regression: D136 remains a retracted/open-question slot under O24; D135 row remains untouched.
- Regression: no active catalog summary describes Tune today or `levelRelaxed` as current behavior after D137 lands.

**Verification:**
- Routing-critical docs are synchronized and machine-readable catalog entries are valid.

---

## System-Wide Impact

- **Interaction graph:** Home repeat/draft-start flows now share Setup's direct-to-Safety shape. Setup itself remains unchanged.
- **Error propagation:** Home rebuild errors continue to fall back to Setup; removing Tune today does not introduce a new error surface.
- **State lifecycle risks:** Persisted drafts may contain historical `levelRelaxed`, but the app stops reading it and does not require a Dexie migration.
- **API surface parity:** Route helpers, React routes, P12 contracts, Home tests, and app docs must all drop Tune today together.
- **Integration coverage:** Browser smoke should cover Setup → Safety, Home repeat → Safety, and Settings → Skill level → Settings.
- **Unchanged invariants:** Onboarding skill-level flow, session assembly logic, drill catalog content, and diagnostic-spine architecture remain outside this cleanup.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Deleting `/tune-today` misses an indirect caller | Search for `tuneToday`, `/tune-today`, `TuneToday`, and `regenerateDraftFocus` after U1/U2; rely on typecheck. |
| Settings current-level marker changes onboarding picker behavior | Make the prop optional and add a regression test for default picker rendering. |
| `ChoiceSubsection` transition becomes brittle under conditional mount/unmount | Keep the change primitive-level and CSS-only; accept a modest reveal rather than complex animation state. |
| Docs drift persists in catalog or app README | Include docs sync as its own implementation unit and run docs validation. |
| Audit bucket rename accidentally changes semantics | Keep detection logic unchanged and inspect snapshot diff for label-only movement. |

---

## Documentation / Operational Notes

- This work follows the 2026-05-05 single-branch flow in `AGENTS.md`: implement on `main`, commit, and push to `origin` after the commit.
- No schema migration, feature flag, or rollout switch is planned.
- If implementation discovers a real `cannot_generate_at_level` failing cell, stop and treat it as a catalog/diagnostic finding, not as permission to reintroduce relax-signal UI in this pass.

---

## Verification Strategy

- `cd app && npm run build`
- `cd app && npm run lint`
- `cd app && npm test -- routes screenContracts FirstOpenGate SetupScreen HomeScreen SettingsScreen SettingsSkillLevelScreen SkillLevelPicker focusCoverageAudit`
- `cd app && npm run audit:coverage`
- `cd app && npm run test:e2e -- e2e/phase-c5-repeat.spec.ts e2e/phase-c3-onboarding.spec.ts`
- Browser smoke: Setup → Safety, Home repeat → Safety, first-open stale `/tune-today` → onboarding, completed-user stale `/tune-today` → Home, Settings → Skill level → save → Settings.
- `bash scripts/validate-agent-docs.sh`

---

## Sources & References

- **Origin document:** `docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md`
- **Merge plan:** `docs/plans/2026-05-05-001-merge-focus-coverage-and-collapse-branches-plan.md`
- **Superseded pre-run plan:** `docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md`
- **Superseded 2026-05-04 skill-level mutability work:** `docs/brainstorms/2026-05-04-skill-level-mutability-requirements.md`
- **Field evidence:** `docs/research/2026-05-04-pair-serving-session-feedback.md`
- **Docs contract:** `docs/ops/agent-documentation-contract.md`
- **Relevant code:** `app/src/routes.ts`, `app/src/App.tsx`, `app/src/screens/HomeScreen.tsx`, `app/src/screens/SettingsSkillLevelScreen.tsx`, `app/src/data/focusCoverageAudit.ts`
