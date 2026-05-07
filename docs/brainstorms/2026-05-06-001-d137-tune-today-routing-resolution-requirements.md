---
id: brainstorm-2026-05-06-001
title: "D137 — Tune today routing-shape resolution + d135 skill-level cleanup"
status: complete
stage: validation
type: brainstorm
authority: "Captures the decision to embrace feat/focus-coverage-readiness's Setup-direct-to-Safety routing as the canonical pre-run flow, delete the now-dead Tune today screen and d135 skill-level relax-signal infrastructure, and ratify the merge as D137 in docs/decisions.md. D136 is not reused because its provisional single-focus-per-session row was retracted under O24. The D135 row in docs/decisions.md is unrelated walkthrough-equivalence policy and remains untouched."
last_updated: 2026-05-06
depends_on:
  - docs/plans/2026-05-05-001-merge-focus-coverage-and-collapse-branches-plan.md
  - docs/research/2026-05-04-pair-serving-session-feedback.md
  - docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md
  - docs/brainstorms/2026-05-04-skill-level-mutability-requirements.md
  - docs/decisions.md
summary: >-
  The 2026-05-05 merge changed the pre-run route from
  "Setup → Tune today → Safety" to "Setup → Safety" and orphaned the d135
  skill-level relax-signal code. User review of the F1 evidence settled the
  routing shape toward the unified Setup page with Recommended focus defaulted.
  Skill level is reframed as an identity/capability marker, not daily difficulty
  tuning, so this brainstorm keeps Settings as the manual override, deletes the
  Tune today and levelRelaxed plumbing, renames the misleading audit bucket, and
  carries three small UI cleanup items.
---

# D137 — Tune today routing-shape resolution + d135 cleanup

## Summary

Ratify the post-merge Setup → Safety shape as the canonical pre-run flow. Delete the dead Tune today and `levelRelaxed` infrastructure, keep `/settings/skill-level` as the durable skill-level override, and record the decision trail so future work does not have to re-litigate the merge.

---

## Problem Frame

The 2026-05-05 merge of `feat/focus-coverage-readiness` collapsed the pre-merge Setup → Tune today → Safety flow into Setup-with-focus → Safety. That change matched the newer Setup UI but landed as a merge outcome rather than an explicit product decision.

Three reviewers converged on the same concern: the app now has a better default flow, but the codebase still carries dead infrastructure from the old shape. `/tune-today`, its controller, `regenerateDraftFocus`, and the `levelRelaxed` eyebrow invite future agents to reason about behavior the runtime no longer produces.

The load-bearing product distinction is whether Seb's 2026-05-04 F1 evidence validated a separate Tune today screen or a focus picker with Recommended selected by default. User review settled this as the latter: focus belongs on the same page as today's setup, with Recommended preselected so the user does not have to think.

Skill level also needs reframing. It is not a daily difficulty knob. It is a capability marker that should eventually be auto-managed by the app, with Settings as the manual override. That makes the Tune today relax-signal eyebrow over-built for current use.

---

## Actors

- A1. Founder + partner user: primary D130 evaluator whose recent pair-serving feedback anchored the F1 signal.
- A2. Future M001 player: inherits the post-cleanup Home → Setup/Repeat → Safety → Run shape.
- A3. Settings revisit user: occasionally recalibrates saved skill level outside the daily start-session path.

---

## Key Flows

- F1. Fresh setup
  - **Trigger:** User starts a different session from Home.
  - **Actors:** A1, A2
  - **Steps:** Home → Setup with Players / Net / conditional Wall / Time / Focus → Build session → Safety → Run.
  - **Outcome:** The user reaches Safety without a Tune today stop; Recommended remains the low-friction default.
  - **Covered by:** R1, R2
- F2. Repeat session
  - **Trigger:** User repeats a previous completed session or draft from Home.
  - **Actors:** A1, A2
  - **Steps:** Home repeat action rebuilds or resumes a draft → Safety → Run.
  - **Outcome:** Repeat uses the same pre-run route shape as fresh setup.
  - **Covered by:** R3
- F3. Skill-level recalibration
  - **Trigger:** User opens Settings and chooses to change skill level.
  - **Actors:** A3
  - **Steps:** Settings → Skill level → picker shows current saved level → user picks → Settings reflects new label.
  - **Outcome:** Skill level remains adjustable without appearing in the daily run-start flow.
  - **Covered by:** R7, R8, R9

---

## Requirements

**Routing shape**
- R1. Setup → Safety is the canonical pre-run route. Setup carries the Focus picker inline with Recommended as the default-checked option.
- R2. The `/tune-today` route, `TuneTodayScreen`, Tune today controller, screen-contract entry, and `regenerateDraftFocus` service are removed instead of redirect-stubbed.
- R3. Home repeat, repeat-what-you-did, and draft-start handlers route directly to Safety so Home no longer carries a separate pre-run pattern.

**Skill-level cleanup**
- R4. No pre-run relax-signal UI ships in this pass: no eyebrow, banner, Safety hint, or replacement surface.
- R5. `SessionDraft.levelRelaxed` and all read/write plumbing are removed. Drafts that previously persisted the optional field continue to load because post-cleanup code no longer reads it.
- R6. The audit's `level_unhonored` bucket is renamed to `cannot_generate_at_level` so the label matches the post-merge hard-filter engine behavior.
- R7. `/settings/skill-level` remains the durable manual override for saved skill level.
- R8. Settings keeps a compact correction path for migrated/backfilled profiles with no valid saved skill level; normal access still assumes FirstOpenGate has already collected a value.
- R9. The Settings skill-level picker marks the current saved level before the user picks.

**Design polish**
- R10. `SettingsSkillLevelScreen` uses the shared `ScreenHeader` primitive instead of hand-rolled header markup, with no intended visual redesign.
- R11. `ChoiceSubsection` reveals conditional content, such as "Wall or fence nearby?", with a 150-200 ms CSS-only height/opacity transition.

**Decision trail**
- R12. `docs/decisions.md` gains a D137 entry ratifying Setup → Safety and documenting the d135 skill-level cleanup. The entry must not modify the unrelated D135 walkthrough-equivalence row.
- R13. The 2026-04-30 pre-run simplification plan and 2026-05-04 skill-level mutability plan are marked superseded where their Tune today / relax-signal surfaces conflict with D137.
- R14. `docs/status/current-state.md` and `docs/catalog.json` record the cleanup and route future diagnostics / validator questions to D138 / D139 follow-ups.

---

## Acceptance Examples

- AE1. **Covers R1, R2.** Given a user on Setup with Recommended focus still selected, when they tap Build session, they land on Safety and no Tune today screen renders.
- AE2. **Covers R1.** Given a user changes focus on Setup before building, when they continue, the generated draft reflects that focus and routes directly to Safety.
- AE3. **Covers R3.** Given a user with a completed session on Home, when they tap a repeat action, the app rebuilds or resumes the draft and routes to Safety, not Tune today.
- AE4. **Covers R2.** Given a stale bookmark to `/tune-today`, when the route is loaded, no Tune today screen import or contract remains; the app falls through to the existing unmatched-route behavior.
- AE5. **Covers R4, R5.** Given the current 180/180-covered catalog, when a user builds sessions across saved skill levels, no relax-signal UI appears and no code path reads `levelRelaxed`.
- AE6. **Covers R6.** Given the focus coverage audit runs after cleanup, the snapshot contains `cannot_generate_at_level` and no `level_unhonored` bucket.
- AE7. **Covers R7, R8, R9.** Given a user opens Settings with a saved skill level, the section shows their current level, the sub-route picker marks that level, and choosing another card writes through and returns to Settings. Given a migrated/backfilled profile has no valid saved level, Settings shows a compact Set skill level correction path.
- AE8. **Covers R10.** Given the user opens `/settings/skill-level`, the header matches shared `ScreenHeader` chrome rather than a one-off local header.
- AE9. **Covers R11.** Given the user changes Setup from a state without wall/fence to Solo + No net, the wall/fence subsection reveals with a short transition instead of popping the layout.
- AE10. **Covers R12, R13, R14.** Given a doc reader scans the decision trail, D137 is the routing-shape decision, D136 is not reused, D135 in decisions remains untouched, and D138/D139 are reserved for diagnostics and validator follow-ups.

---

## Success Criteria

- The app's run-start path feels calmer: one setup page, one Safety checkpoint, no hidden Tune today detour.
- Skill level reads as a saved identity/capability setting with manual override, not a daily tuning control.
- The codebase no longer carries dead Tune today or relax-signal infrastructure that future agents must reason about.
- The decision trail is explicit enough that a future route, diagnostics, or skill-level change can cite D137 instead of reconstructing this merge history.

---

## Scope Boundaries

- No diagnostic spine consolidation. The `focusReadiness`, `focusCoverageAudit`, and `generatedPlanDiagnostics` overlap becomes D138.
- No validator script gating decision. Whether architecture, typography, or diagnostics scripts become CI gates becomes D139.
- No source-backed reroute registry refactor.
- No `generatedPlanDiagnosticTriage` type-name cleanup.
- No other design-iterator findings beyond the current-level marker, `ScreenHeader` reuse, and `ChoiceSubsection` reveal.
- No drill catalog content changes.
- No auto-managed skill-level implementation.
- No daily difficulty knob or replacement pre-build preview screen.

---

## Key Decisions

- KD1. Setup-with-focus is canonical because the validated F1 signal was focus + Recommended-default on the setup page, not a separate Tune today screen.
- KD2. Skill level is identity/capability, not difficulty. Settings remains the manual override; the app may auto-manage skill level later.
- KD3. Delete Tune today entirely. A redirect stub would preserve dead surface area without preserving real user value.
- KD4. Delete `levelRelaxed` instead of preserving it as a future hook. If a future signal is evidence-backed, re-add the smallest needed shape then.
- KD5. Rename `level_unhonored` to `cannot_generate_at_level` because the post-merge engine hard-filters instead of relaxing.
- KD6. Keep Settings quiet for the normal saved-level case, but preserve a compact correction path for migrated/backfilled users missing `onboarding.skillLevel`; FirstOpenGate owns initial collection on entry paths.
- KD7. D137 is the new routing-shape decision. D136 remains a retracted provisional slot under O24, D135 remains unrelated walkthrough-equivalence policy, D138 is reserved for diagnostic spine canonicality, and D139 is reserved for validator gating.

---

## Outstanding Questions

### Deferred to Implementation

- DQ1. Exact `aria-current` value for the current-level card (`true` vs `page`) should follow the simplest accessible test shape.
- DQ2. Exact transition classes and duration for `ChoiceSubsection` should be picked in implementation within the 150-200 ms range.

### Deferred to Future Brainstorms

- D138. Diagnostic spine canonicality across `focusReadiness`, `focusCoverageAudit`, and `generatedPlanDiagnostics`.
- D139. Validator script gating or compression.
- Auto-managed skill level after more M001/D130 evidence.

---

## Sources & References

- `docs/plans/2026-05-05-001-merge-focus-coverage-and-collapse-branches-plan.md`
- `docs/research/2026-05-04-pair-serving-session-feedback.md`
- `docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md`
- `docs/brainstorms/2026-05-04-skill-level-mutability-requirements.md`
- `docs/decisions.md`
- `docs/status/current-state.md`
