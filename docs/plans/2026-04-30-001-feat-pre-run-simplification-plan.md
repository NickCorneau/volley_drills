---
id: pre-run-simplification-2026-04-30
title: "feat: Pre-run flow (Tune today mandatory + Setup-stage cuts + Safety polish + skill-scope JSDoc)"
type: feat
status: complete
stage: validation
date: 2026-04-30
revised: 2026-04-30
shipped: 2026-04-30
origin: docs/brainstorms/2026-04-30-pre-run-simplification-requirements.md
authority: "Canonical implementation plan for the post-iteration 2026-04-30 simplification: ships Tune today mandatory pre-safety (the 2026-04-29-001 design verbatim) bundled with three orthogonal cuts (full Wind delete + conditional Wall + no default Safety focus echo + JSDoc skill-scope policy)."
summary: "Mandatory Tune today route between Setup and Safety with four chips (Recommended / Passing / Serving / Setting), all-enabled with fail-on-tap inline copy, source-aware Back ('setup' | 'home'), and the full 2026-04-29 architecture (effectiveFocus.ts shared resolver, services/session/regenerateDraftFocus.ts in-transaction use case, stale-write guard, repeat / recovery focus strip). Plus three orthogonal pre-run cuts: full Wind delete (field, UI, fixtures, windFriendly catalog cleanup); conditional Wall row (only when Solo + No Net); no default Safety focus echo (recovery-override line only when painFlag and a chosen focus exist together). Track 4 ships skill-scope policy as a JSDoc comment on the SkillFocus type union, not a D136 decision row. The 2026-04-30 simplification iteration that proposed an opt-in Tune today is superseded by this plan after agent red-team and user feedback."
last_updated: 2026-05-02
related:
  - docs/brainstorms/2026-04-30-pre-run-simplification-requirements.md
  - docs/brainstorms/2026-04-29-session-focus-picker-requirements.md
  - docs/archive/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/japanese-inspired-visual-direction.md
decision_refs:
  - D83
  - D91
  - D125
  - D130
  - D131
  - D135
---

# Pre-run flow

## Overview

Bundles four tracks into one PR (or two natural splits — see Phased Delivery):

- **Track 1.** Full Wind delete: drop the field from `SetupContext`, the `WindLevel` type, `windFriendly` from `EnvironmentFlags`, `env({ windFriendly: … })` from the catalog factory, and the test fixtures that set them. Make the Wall row on `SetupScreen` conditional on Solo + No Net.
- **Track 2.** Tune today **mandatory** as the v1 pre-safety review surface, exactly as the 2026-04-29-001 plan specced (4-chip Recommended / Passing / Serving / Setting; all-enabled with fail-on-tap inline copy; source-aware Back collapsed to `'setup' | 'home'`; the full architecture: shared focus resolver, in-transaction regeneration use case with stale-write guard, repeat / recovery focus strip).
- **Track 3.** Safety simplification: no default focus echo on the session summary line; the only Safety surface that mentions focus is a single line on the `PainOverrideCard` when `painFlag === true && draft.context.sessionFocus !== undefined`.
- **Track 4.** Skill-scope policy as a JSDoc comment on the `SkillFocus` type union in `app/src/types/drill.ts`. No D136 decision row. No types reservation.

This plan supersedes `docs/archive/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md` — that plan's design rationale (K3–K13) is preserved; its file scope is reauthored here. **Honest framing:** "preserved by reference" means *design rationale and decisions* are inherited, not that the code already exists. ~6 units of net-new code ship under this plan: `domain/sessionAssembly/effectiveFocus.ts`, `services/session/regenerateDraftFocus.ts`, `screens/TuneTodayScreen.tsx`, `screens/tuneToday/useTuneTodayController.ts`, plus edits to ~10 existing files across screens, components, domain, and tests.

The 2026-04-30 simplification iteration (opt-in Tune today) was rejected after agent red-team and user feedback. The opt-in shape charged 11 taps for A2's first focus session with no discoverable entry path; the user judged "less friction, fewer taps to first usage" the dominant constraint and reverted Track 2 to mandatory.

---

## Problem Frame

`D135` fired the Tier 1c trigger via real partner-walkthrough evidence: a user wanted to train serving today and could not steer the recommendation. The 2026-04-29-001 plan answered that with mandatory Tune today between Setup and Safety. The 2026-04-30 simplification iteration tried opt-in (default to Safety; reach Tune today via a Home affordance); adversarial review showed that shape gives the focus-steering user — the very person `D135` fired for — an 11-tap first-session detour with no discoverable path. User feedback chose mandatory.

Track 1 + 3 + 4 are independent simplification cuts that travel well alongside Track 2 and that the 2026-04-29-001 plan did not author.

---

## Requirements Trace

### Track 1 — Setup cuts

- **R1.** Delete the Wind row from `SetupScreen` and onboarding's `Today's Setup`. Delete the `wind?: WindLevel` field from `SetupContext` and the `WindLevel` type from `app/src/types/session.ts`. Delete `windFriendly: boolean` from `EnvironmentFlags`. Delete the `windFriendly` arg from the `env(…)` factory in `app/src/data/drills.ts` and the `windFriendly: true | false` from every variant record. Update test fixtures that set `wind: 'calm'` or `windFriendly: true` to drop the field. No Dexie migration needed: legacy persisted records continue to carry `wind` in IndexedDB, and TypeScript reads silently ignore the extra field.
- **R2.** Render the Wall section on `SetupScreen` only when `playerMode === 'solo' && netAvailable === false`. Treat `wallAvailable` as `false` when the row is hidden.
- **R3.** Update `isComplete` to `playerMode !== null && netAvailable !== null && (showWall ? wallAvailable !== null : true)`.
- **R4.** Pre-fill from `getCurrentDraft()` / `getLastContext()` continues for Players, Net, and (when shown) Wall. Wind pre-fill code is removed.

### Track 2 — Tune today mandatory (architecture inherited from 2026-04-29-001)

- **R5.** A `/tune-today` route is registered through `routes.ts`, `App.tsx`, and `screenContracts.ts`.
- **R6.** Every pre-run path that creates or opens the singleton current draft routes to Tune today after the draft exists: fresh Setup, onboarding `Today's setup`, Home `Start session` (DraftCard primary), Home secondary draft Open, Repeat this session, Repeat what you did. `Change setup` continues to route to Setup edit mode.
- **R7.** `SetupContext.sessionFocus?: 'pass' | 'serve' | 'set'` lands; `undefined` means Recommended and is not serialized.
- **R8.** A pure shared focus resolver (`app/src/domain/sessionAssembly/effectiveFocus.ts`) defines effective skill tags for `main_skill` and `pressure` slots. Consumed by initial slot picking, build-time main-skill substitution (`pickMainSkillSubstitute`), and swap alternatives (`findSwapAlternatives`).
- **R9.** A draft regeneration use case in `app/src/services/session/regenerateDraftFocus.ts` reads the current saved draft, applies a stale-write guard (`updatedAt`-based revision check), calls `buildDraft` with the new context, and writes the replacement — all inside `db.transaction('rw', db.sessionDrafts, ...)`. Result shape: `{ ok: true, draft, changed: boolean } | { ok: false, reason: 'load' | 'stale' | 'build' | 'save' | 'schema_blocked' }`.
- **R10.** Tune today renders one focal recommendation card, four chips inside `<div role="radiogroup" aria-label="Focus">` (Recommended / Passing / Serving / Setting), and a pinned `Continue to safety` primary button. No block list, rationale paragraph, stats grid, icon row, or competing secondary action.
- **R11.** All four chips remain visible and enabled. If a selected non-Recommended focus cannot produce a valid draft for the current setup, the previous draft remains visible, the prior focus selection reverts, and a short inline warning explains the failure (e.g., "Can't build a setting-focused session for this setup"). No pre-check; the failure path is honest fail-on-tap.
- **R12.** Selecting a chip calls the regeneration use case. While pending, the previous draft remains visible and both focus and Continue actions are disabled to prevent double-submit. On success, the draft summary updates. On `{ ok: false, reason: 'stale' }` or `'save'` or `'build'`, the prior focus selection reverts and an inline warning shows. On `'schema_blocked'`, the screen stays in loading and `SchemaBlockedOverlay` paints the UI.
- **R13.** Selecting Recommended clears explicit `sessionFocus` and restores the Tune today visit's baseline draft via the regeneration use case in `useBaseline` mode.
- **R14.** Tune today direct-route entry: while loading the current draft, show a loading state. If no current draft exists, redirect to `/setup` with replace semantics. If draft loading fails, show a retryable error and a `Back to setup` action.
- **R15.** Back is **source-aware** with two values: from fresh Setup (`source: 'setup'`) it returns to Setup in edit-draft mode with the saved draft intact; from Home / Repeat / unknown (`source: 'home'`) it returns to Home with the saved draft intact. The four-value model from 2026-04-29 K7 is collapsed to two; reintroduce more values when an entry path needs to diverge.
- **R16.** Tune today does not import Dexie/db directly. It uses existing session services through the controller and the regeneration use case.
- **R17.** Successful focus regeneration commits a full replacement draft (updated `context` + regenerated `blocks` + new `assemblySeed`) before the visible summary is treated as committed. The save and the staleness check share one `db.transaction('rw', db.sessionDrafts, ...)`.
- **R18.** New drafts built from completed `SessionPlan.context` (Repeat, Repeat what you did) strip explicit `sessionFocus` before rebuilding — the canonical strip site is `buildDraftFromCompletedBlocks`. Historical plans may retain `sessionFocus` only as session history, not as reusable setup input.
- **R19.** Recovery drafts strip explicit `sessionFocus` — the canonical strip site is `buildRecoveryDraft`.
- **R20.** Swap alternatives during the eventual run honor the same selected focus semantics as the initial draft. A Serving session does not offer off-focus main-skill or pressure swaps unless no valid focused alternative exists, and the app explicitly explains the fallback.
- **R21.** Tune today follows a fixed calm hierarchy: title (reader-question H1 per `.cursor/rules/courtside-copy.mdc` rule 1, default candidates `What's today's focus?` / `Today's shared focus?`), recommendation summary, focus chip group with visible `<h2>` group label, today-only helper, Continue to safety. Labels use the existing user-facing gerund vocabulary (Passing / Serving / Setting).
- **R22.** The chip control is a semantic radiogroup or native-radio equivalent with an accessible group name, keyboard traversal, selected-state announcement, and visible focus ring. Loading, pending, and warning messages are announced politely to assistive tech without interrupting the screen.
- **R23.** Motion stays restrained. No decorative entrance animation. Existing color/press transitions are sufficient.
- **R24.** Pair-mode copy frames the selection as today's shared focus, not the founder's private preference.

### Track 3 — Safety simplification

- **R25.** Safety's session summary line stays `${archetypeName} · ${totalMinutes} min, ${blockCount} blocks` with **no** focus suffix. Override the 2026-04-29-001 plan's R7.
- **R26.** Render a recovery-override line only when **`painFlag === true && draft.context.sessionFocus !== undefined`**. Place it adjacent to the `PainOverrideCard` actions (above its primary recovery CTA). Default copy: `Recovery overrides today's focus.`. When `sessionFocus` is undefined, no focus copy renders anywhere on Safety.
- **R27.** Safety remains safety-only — no controls, no read-only metadata, no chip echo.

### Track 4 — Skill-scope JSDoc

- **R28.** Add a JSDoc comment on the `SkillFocus` type union in `app/src/types/drill.ts` recording the policy. Default candidate text:
  > `SkillFocus` is the technique-axis taxonomy for drills (the GMP a drill primarily trains). New values land only when partner-walkthrough evidence or ≥3 founder-ledger rows fire a `D135`-style trigger. `attack` is a planned future member of this union (it will pair with `serve` as the overhead-striking cluster) and is **not** in the union today; do not add it preemptively. `out_of_system`, `side_out`, `transition`, and `game_like` are **scenarios**, not skills, and belong on a future `DrillVariant.scenario?: Scenario` field, not in this union — do not add them here. See `docs/archive/brainstorms/2026-04-29-skill-scope-reservation-requirements.md` (superseded; historical analysis) and `docs/ideation/2026-04-29-skill-scope-and-game-layers-ideation.md`.
- **R29.** No D136 decision row. No `app/src/types/drill.ts` type changes beyond the JSDoc. No `Scenario` union. No `scenario?` field. No research note authored.
- **R30.** `docs/archive/brainstorms/2026-04-29-skill-scope-reservation-requirements.md` keeps `status: superseded` (already landed during the brainstorm phase). The supersession chain now points at the JSDoc rather than the deleted D136 plan.

### Cross-track

- **R31.** `bash scripts/validate-agent-docs.sh` passes after this plan and its companion edits land.

**Origin actors (from brainstorm):** A1 (recommendation-trusting majority), A2 (focus-steering minority — the `D135` partner), A3 (pair-mode user), A4 (first-run user), A5 (future implementation agent).
**Origin flows:** F1 (mandatory pre-safety review), F2 (focus-steering selection), F3 (focus revert via Recommended), F4 (Repeat to Tune today to Safety), F5 (Safety recovery override).
**Origin acceptance examples:** AE1 (mandatory routing), AE2 (Recommended → Serving → Recommended round-trip), AE3 (fail-on-tap with infeasible focus), AE4 (focus-respected swaps), AE5 (Repeat path), AE6 (390 px viewport calm), AE7 (architectural traceability), AE8 (no default Safety echo), AE9 (recovery override).

---

## Scope Boundaries

- No opt-in Tune today (the 2026-04-30 simplification's Track 2 was rejected after iteration).
- No `Recommended`-as-ambient-state (4-chip stays — Recommended is a visible peer chip).
- No feasibility pre-check at Tune today render. All chips enabled; failures are honest fail-on-tap with inline copy.
- No `Change focus` affordance on the Home draft card (mandatory routing makes it redundant).
- No focus echo on Safety in the default case.
- No types changes beyond `SetupContext.sessionFocus?` (Track 2) and the JSDoc on `SkillFocus` (Track 4). No `'attack'`, no `Scenario` union, no `scenario?` field on `DrillVariant`.
- No D136 decision row.
- No new research note (`docs/research/skill-vs-scenario-axes.md` is not authored).
- No retention of `wind` / `windFriendly` as a "dead read" — both are deleted (Track 1 strengthened per user feedback).
- No Dexie schema migration (Wind delete is type-only; legacy IDB records are silently ignored on read).
- No telemetry, profile mutation, or `D131` change.
- No `M001` cap consumption — all four tracks ship under the existing Tier 1c (`D135`) trigger.

### Deferred for later

- **Custom-drill builder where focus is part of drill setup.** User-raised 2026-04-30. Future direction where users author or configure a session by choosing a "main drill" and the focus is implicit in the drill choice. Different product model (drill-level intent vs session-level intent). Defer to post-M001 product exploration; does not affect this plan.
- **Auto-deriving Safety recency from session history.** Separate brainstorm.
- **Adding `attack` as a fifth Tune today chip.** Waits for `D135`-style trigger evidence.
- **Wind as a behavioral input.** If a future builder rule meaningfully consumes wind, re-introduce the field and the UI together.

### Outside this product's identity

- Pre-run choice as a feature surface. Volleycraft is recommendation-first by promise; pickers are not added because pickers feel "powerful."

---

## Context & Research

### K-ID inheritance matrix (from `docs/archive/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md`)

Honest accounting of which 2026-04-29 K-IDs survive, which are replaced, and which are obsolete:

| 2026-04-29 K-ID | Status under this plan | Notes |
|---|---|---|
| K1. New `/tune` route between Setup and Safety | **Inherited** | Route slug `/tune-today` (matches the screen identity). |
| K2. `SetupContext.sessionFocus?: 'pass' \| 'serve' \| 'set'` | **Inherited** | Mirrors existing optional-field shape; default `undefined`. |
| K3. Shared focus resolver (`effectiveFocus.ts`) | **Inherited** | Single source of truth for slot → effective skill tags. |
| K4. Regeneration use case in `services/session/` | **Inherited** | `db.transaction('rw', …)` stale-write guard preserved. |
| K5. Mint fresh seed per change; cache visit baseline | **Inherited** | `useBaseline` mode satisfies the Recommended-revert path. |
| K6. Re-query substitution inputs inside the use case | **Inherited** | Matches `SetupScreen.handleConfirm`. |
| K7. Source-aware Back via `useLocation().state.source` | **Replaced** | Four-value model collapsed to two: `'setup' \| 'home'`. Reintroduce more values when an entry path needs to diverge. |
| K8. `buildDraftFromCompletedBlocks` is the canonical strip site | **Inherited** | Repeat-rebuilt drafts always carry `sessionFocus: undefined`. |
| K9. `buildRecoveryDraft` is the canonical strip site | **Inherited** | Recovery always carries `sessionFocus: undefined`. |
| K10. All four chips enabled; failures explained inline | **Inherited** | The 2026-04-30 simplification's pre-check was rejected; honest fail-on-tap stays. |
| K11. Test pyramid: domain/controller heavy; one screen test | **Inherited** | |
| K12. Unmount semantics: Dexie commits; controller cancels React updates | **Inherited** | |
| K13. `RegenerateResult` enumerates `'load' \| 'stale' \| 'build' \| 'save' \| 'schema_blocked'` | **Inherited** | Schema-blocked branch routes to overlay. |

Two 2026-04-29 R-IDs are **overridden** by this plan:

- **R7** (read-only focus echo on Safety summary line). Overridden by Track 3 R25 — no default echo.
- **R8 / R12** wording around the Safety focus echo behavior is replaced by R25 + R26 + R27 of this plan.

### Relevant code and patterns

- `app/src/screens/SetupScreen.tsx` — Track 1 R1–R4 edits.
- `app/src/types/session.ts` — Track 1 R1 (delete `WindLevel`, `wind?`); Track 2 R7 (add `sessionFocus?`).
- `app/src/types/drill.ts` — Track 1 R1 (delete `windFriendly` from `EnvironmentFlags`); Track 4 R28 (add JSDoc on `SkillFocus`).
- `app/src/data/drills.ts` — Track 1 R1 (clean `env({ windFriendly: … })` calls + factory).
- `app/src/data/archetypes.ts` — `selectArchetype` already ignores wall for pair and prefers net over wall for solo; Track 1 R2 is a UI cut that does not change archetype semantics.
- `app/src/domain/sessionAssembly/candidates.ts` — Track 2 K3 (resolver consumed by `pickForSlot`).
- `app/src/domain/sessionAssembly/substitution.ts` — Track 2 K3 (resolver consumed by `pickMainSkillSubstitute`).
- `app/src/domain/sessionAssembly/swapAlternatives.ts` — Track 2 K3 (resolver replaces the static `SKILL_TAGS_BY_TYPE` lookup for `main_skill` / `pressure`).
- `app/src/domain/sessionBuilder.ts` — Track 2 K8 / K9 (focus strip on `buildDraftFromCompletedBlocks`, `buildRecoveryDraft`).
- `app/src/services/session/queries.ts` — `findLastCompletedDrillIdsByType` is the substitution input the regeneration use case re-queries (K6).
- `app/src/services/session/commands.ts` — `saveDraft`, `createSessionFromDraft`. Regeneration writes via the same path.
- `app/src/screens/HomeScreen.tsx` — Track 2 R6 (`handleDraftStart`, `handleRepeat`, `handleRepeatWhatYouDid` route through `/tune-today`).
- `app/src/components/home/DraftCard.tsx` — **unchanged** (mandatory routing means no `Change focus` affordance).
- `app/src/screens/SafetyCheckScreen.tsx` — Track 3 R25–R27 (no default focus echo; recovery-override line at `painFlag === true && draft.context.sessionFocus !== undefined`).
- `app/src/screens/drillCheck/useDrillCheckController.ts` — reference shape for the new Tune today controller.
- `app/src/components/ui/{ScreenShell, Card, ToggleChip, Button}` — UI primitives reused; no new visual language.
- `app/src/contracts/screenContracts.ts` — Tune today P12 contract entry.
- `app/src/routes.ts`, `app/src/App.tsx` — route registration.

### Test fixture sweep targets (Track 1 R1)

Files setting `wind: 'calm' | 'light' | 'strong'` or `windFriendly: true | false` that need updates:

- `app/src/test-utils/persistedRecords.ts`
- `app/src/test-utils/runnerFixture.ts`
- `app/src/screens/__tests__/SetupScreen.test.tsx`
- `app/src/services/__tests__/modelRoundTrip.test.ts`
- `app/src/data/__tests__/catalogValidation.test.ts`
- `app/src/data/drills.ts` (~20+ variant records using `env({ windFriendly: true, … })`)

Implementation does a single grep sweep before deletion to confirm no further sites.

### Institutional learnings

- The 2026-04-26 architecture pass codified screens-thin / domain-fat layering and the P12 screen-contract registry; preserved.
- The 2026-04-22 partner-walkthrough polish kept courtside surfaces calm and tap-first; preserved.
- The 2026-04-29 audio-pacing investigation showed how easily a single bug rides multiple draft surfaces; the shared focus resolver remains the analogous prevention.
- The 2026-04-30 simplification iteration: opt-in Tune today added an 11-tap detour for the `D135` use case. Rejected. Recorded for future iterations as evidence that mandatory-vs-opt-in for tier-1c features should be tested against the *trigger user's* friction budget, not the majority's.

### External references

External research already consumed in upstream brainstorm work covered focus / picker patterns, NN/g recommender UX, WCAG 2.2 target sizing, and ACSM/EIM readiness scope. No new external research warranted.

---

## Key Technical Decisions

- **K1. Tune today is mandatory (revert from opt-in).** *Rationale:* the `D135` use case (focus-steering on first session) reaches focus in 4 taps under mandatory and 11 under opt-in. The user judged "less friction, fewer taps to first usage" the dominant constraint. Mandatory wins.
- **K2. 2026-04-29-001 K1–K13 inherited verbatim except K7.** See the K-ID inheritance matrix above. *Rationale:* the architectural rigor of 2026-04-29-001 was not the problem with the opt-in iteration; routing posture was. Architecture survives the revert unchanged.
- **K3. K7 source-aware Back collapsed to `'setup' | 'home'`.** *Rationale:* mandatory has multiple entry paths so a single-value model is insufficient, but the four-value model is over-engineered for the actual divergence (Setup edit-mode vs Home with draft intact). Reintroduce more values when a third entry path needs to diverge.
- **K4. Full Wind delete (not "dead read").** Delete `WindLevel`, `wind?: WindLevel` on `SetupContext`, `windFriendly: boolean` on `EnvironmentFlags`, `env({ windFriendly: … })` calls in the catalog, and all test fixtures. No Dexie migration: legacy IDB records carry `wind` as silent extra fields that TypeScript narrowing ignores. *Rationale:* dead-read fields proliferate as cargo-cult patterns. The honest move is full delete; the cost (~10 fixtures + ~30 catalog records) is mechanical and bounded.
- **K5. Conditional Wall on `SetupScreen`.** Render the Wall section only when `playerMode === 'solo' && netAvailable === false`. Force `wallAvailable: false` when hidden. *Rationale:* `selectArchetype` already ignores wall for pair and prefers net over wall for solo; the row was decision-load with no payoff for ~80% of users. **Forward-compat note:** this hides any future `m001Candidate: true` variant whose `environmentFlags.needsWall === true && needsNet === false && playerMode === 'pair'`. Today's catalog has zero such variants (the only `needsWall: true` variant is `m001Candidate: false`); add a catalog invariant test in U2 to fail loudly if a future variant breaks the assumption.
- **K6. No default Safety focus echo.** Track 3 R25 overrides 2026-04-29-001 R7. The recovery-override line renders when `painFlag === true && draft.context.sessionFocus !== undefined`, adjacent to `PainOverrideCard` actions. *Rationale:* Safety is readiness; echoing focus on every session is information density without a job. The override case is the only Safety surface that has something useful to say about focus.
- **K7. Track 4 = JSDoc on `SkillFocus`, not D136 decision row.** *Rationale:* a decision row is paperwork before evidence by the brainstorm's own KD7 standard. JSDoc on the type union is the lowest-cost discoverability signal: any agent reading the union sees the policy without needing to load `docs/decisions.md`. If the policy ever needs a decisions-table row (e.g., when the trigger fires), author it then.
- **K8. The 2026-04-30 simplification iteration's Track 2 cuts (3-chip, opt-in, feasibility pre-check, `Use recommendation` link, `Change focus` affordance, source: 'home' only) are all rejected.** Tracks 1, 3, 4 carry forward unchanged from the brainstorm body (with Track 4 demoted to JSDoc).

---

## Open Questions

### Resolved during planning

- **Q1.** Tune today posture (opt-in vs mandatory). Resolved: mandatory. (User feedback after agent red-team.)
- **Q2.** Wind delete vs dead read. Resolved: full delete.
- **Q3.** Track 4 form (D136 row vs JSDoc). Resolved: JSDoc on `SkillFocus`.
- **Q4.** Recovery-override render condition. Resolved: `painFlag === true && draft.context.sessionFocus !== undefined`, not `useRecovery === true` (which is a click-time argument, not a render-time state).
- **Q5.** K-ID inheritance ambiguity. Resolved: explicit matrix above.
- **Q6.** Test file location for `effectiveFocus.test.ts`. Resolved: `app/src/domain/sessionAssembly/__tests__/effectiveFocus.test.ts` (matches the resolver's home directory).
- **Q7.** H1 form. Resolved: reader-question per `.cursor/rules/courtside-copy.mdc` rule 1; default candidates `What's today's focus?` (solo) / `Today's shared focus?` (pair). Pin during U6.
- **Q8.** Recovery-override copy. Default candidate: `Recovery overrides today's focus.`. Pin during U7.
- **Q9.** D-ID for skill-scope policy. Resolved: no D-ID; JSDoc instead.

### Deferred to implementation

- **DQ1.** Whether the `m001Candidate: true && needsWall: true && needsNet: false && playerMode='pair'` invariant test (K5) lives in `app/src/data/__tests__/catalogValidation.test.ts` or in a new file. Default: extend `catalogValidation.test.ts`.
- **DQ2.** Exact JSDoc copy on `SkillFocus` (R28). Default candidate is in R28. Pin during U9 review.
- **DQ3.** Whether `SetupScreen` needs a layout adjustment after Wind row removal (more vertical breathing room). Default: no — the four remaining sections (Players, Net, conditional Wall, Time) already have consistent spacing. Visual-check on a 390 px viewport during U2.

### Deferred to future iteration

- **Custom-drill builder where focus is part of drill setup.** User-raised 2026-04-30. Captured in the brainstorm's `Deferred for later` section. Post-M001 product exploration.

---

## Output Structure

```
app/src/
  contracts/
    screenContracts.ts                          # MODIFY — add tuneToday P12 entry
  domain/
    sessionAssembly/
      candidates.ts                             # MODIFY — pickForSlot consumes resolver
      substitution.ts                           # MODIFY — pickMainSkillSubstitute consumes resolver
      swapAlternatives.ts                       # MODIFY — findSwapAlternatives consumes resolver
      effectiveFocus.ts                         # NEW — shared focus resolver
      __tests__/
        effectiveFocus.test.ts                  # NEW
    sessionBuilder.ts                           # MODIFY — strip focus on buildDraftFromCompletedBlocks + buildRecoveryDraft
    __tests__/
      drillSelection.test.ts                    # MODIFY — focus-override scenarios
      findSwapAlternatives.test.ts              # MODIFY — focus-override scenarios
      buildDraftFromCompletedBlocks.test.ts     # MODIFY — focus-strip pin
      buildRecoveryDraft.test.ts                # NEW or MODIFY — focus-strip pin
  services/
    session/
      regenerateDraftFocus.ts                   # NEW — use case (rw transaction)
      __tests__/
        regenerateDraftFocus.test.ts            # NEW
  routes.ts                                     # MODIFY — add tuneToday helper + path '/tune-today'
  App.tsx                                       # MODIFY — register the route
  screens/
    TuneTodayScreen.tsx                         # NEW (4-chip mandatory; all enabled; fail-on-tap)
    SetupScreen.tsx                             # MODIFY — drop Wind; conditional Wall; isComplete update
    SafetyCheckScreen.tsx                       # MODIFY — recovery-override line at painFlag===true && sessionFocus!==undefined
    HomeScreen.tsx                              # MODIFY — handleDraftStart, handleRepeat, handleRepeatWhatYouDid all route to /tune-today
    tuneToday/
      useTuneTodayController.ts                 # NEW (mandatory posture; source: 'setup' | 'home')
      __tests__/
        useTuneTodayController.test.tsx         # NEW
    __tests__/
      TuneTodayScreen.test.tsx                  # NEW (render contract)
      SetupScreen.test.tsx                      # MODIFY
      SafetyCheckScreen.test.tsx                # MODIFY
  components/
    home/
      DraftCard.tsx                             # UNCHANGED (no Change focus affordance under mandatory)
  data/
    drills.ts                                   # MODIFY — drop windFriendly from env() factory + variants
    archetypes.ts                               # UNCHANGED
    __tests__/
      catalogValidation.test.ts                 # MODIFY — drop windFriendly; add Wall-conditional invariant test (K5)
  test-utils/
    persistedRecords.ts                         # MODIFY — drop wind
    runnerFixture.ts                            # MODIFY — drop wind
  types/
    session.ts                                  # MODIFY — delete WindLevel, wind?; add sessionFocus?
    drill.ts                                    # MODIFY — delete windFriendly; add JSDoc on SkillFocus
docs/
  catalog.json                                  # MODIFY (U10) — update plan canonical_for; already pre-updated for brainstorm
  status/current-state.md                       # MODIFY (U10) — recent shipped history line
```

---

## Implementation Units

- [x] **U1. Track 1 part A — Full Wind delete.**

**Goal:** Remove `WindLevel`, `wind?: WindLevel`, `windFriendly: boolean`, the `env({ windFriendly: … })` arg, and all test fixtures that set them.

**Requirements:** R1.

**Dependencies:** None.

**Files:**
- Modify: `app/src/types/session.ts` (delete `WindLevel` export, `wind?: WindLevel` from `SetupContext`)
- Modify: `app/src/types/drill.ts` (delete `windFriendly: boolean` from `EnvironmentFlags`)
- Modify: `app/src/data/drills.ts` (drop `windFriendly` from the `env(…)` factory's overrides type and defaults; remove `windFriendly: true | false` from every variant's `environmentFlags: env({ … })` call)
- Modify: `app/src/screens/SetupScreen.tsx` (remove `WindChoice` type, `[wind, setWind]` state, the Wind `<section>` block, the wind pre-fill `if (ctx.wind === 'light' || ctx.wind === 'strong')` branch, and the `if (wind === 'light') context.wind = 'light' else if (wind === 'strong') context.wind = 'strong'` block in `handleConfirm`)
- Modify: `app/src/test-utils/persistedRecords.ts` (drop `wind: 'calm'`)
- Modify: `app/src/test-utils/runnerFixture.ts` (drop `wind` if present)
- Modify: `app/src/screens/__tests__/SetupScreen.test.tsx` (drop assertions that the Wind row renders; drop `expect(draft?.context.wind).toBe('light')` style assertions)
- Modify: `app/src/services/__tests__/modelRoundTrip.test.ts` (drop `wind: 'calm'` if present)
- Modify: `app/src/data/__tests__/catalogValidation.test.ts` (drop `windFriendly: true` from the test env fixture)
- Modify: `app/src/model/index.ts` (drop `WindLevel` from the re-export list)

**Approach:**
- Step 1: grep `windFriendly|WindLevel|context\.wind|setWind|WindChoice|\bwind\?\b` over `app/src` to enumerate all sites. Update the file list above if more appear.
- Step 2: delete in this order: types → data records → test fixtures → screens → re-exports. The TypeScript compiler catches reference leaks at each step.
- Step 3: confirm `npm --prefix app run typecheck` passes after deletion.
- Step 4: confirm `npm --prefix app run test` passes (modulo expected updates).

**Patterns to follow:** Mechanical delete; no new logic.

**Test scenarios:**
- Regression: `npm --prefix app run typecheck` passes after delete (no leaked references).
- Regression: `findCandidates` results are bit-for-bit identical to pre-delete with the same context inputs (Wind was never read by the builder; deletion changes nothing observable).
- Regression: SetupScreen renders four sections (Players, Net, conditional Wall, Time), no Wind section.
- Regression: existing test fixtures previously asserting `wind: 'calm'` are updated and still pass.

**Verification:**
- `npm --prefix app run typecheck && npm --prefix app run test` green.
- Visual check on a 390 px viewport: SetupScreen has four (or three when Wall is hidden) sections.

---

- [x] **U2. Track 1 part B — Conditional Wall + Wall-required invariant test.**

**Goal:** Render the Wall section on `SetupScreen` only when `playerMode === 'solo' && netAvailable === false`. Force `wallAvailable: false` when hidden. Add an invariant test that fails if a future `m001Candidate: true` variant requires a wall in a context that hides the Wall row.

**Requirements:** R2, R3, R4 (Wall pre-fill); K5.

**Dependencies:** U1 (Wind delete; mechanically separate but reduces churn surface).

**Files:**
- Modify: `app/src/screens/SetupScreen.tsx` (`const showWall = playerMode === 'solo' && netAvailable === false`; render the Wall section only when `showWall`; in `handleConfirm`, set `wallAvailable: showWall ? wallAvailable! : false`; update `isComplete`)
- Modify: `app/src/screens/__tests__/SetupScreen.test.tsx` (test scenarios below)
- Modify: `app/src/data/__tests__/catalogValidation.test.ts` (Wall-required invariant test per K5)

**Approach:**
- `showWall` is derived from `playerMode` and `netAvailable`; pre-fill from `getCurrentDraft()` continues to populate `wallAvailable` when present, but the row only renders when `showWall` is true.
- Wall pre-fill silent override: when prefill returns `{ playerMode: 'pair', wallAvailable: true }`, the new draft is built with `wallAvailable: false`. Document this in a test scenario so future fixture review doesn't surprise.
- Invariant test: scan `app/src/data/drills.ts` for variants with `m001Candidate: true && needsWall: true && needsNet: false && playerMode-min/max consistent with pair`. Assert zero matches. The current catalog has zero (the only `needsWall: true` variant is `m001Candidate: false`); the test fails loudly if a future PR breaks the assumption.

**Patterns to follow:** existing `<section>` / `<ToggleChip role="radiogroup">` pattern.

**Test scenarios:**
- Happy path: render with `playerMode: null` → no Wall section. `isComplete === false` (Players + Net both null).
- Happy path: render with `playerMode: 'pair'` → no Wall section. `isComplete` resolves on Players + Net only.
- Happy path: render with `playerMode: 'solo'` + `netAvailable: true` → no Wall section. Builds `wallAvailable: false`.
- Happy path: render with `playerMode: 'solo'` + `netAvailable: false` → Wall section appears. `isComplete === false` until Wall is answered.
- Edge case: pre-fill of `{ playerMode: 'pair', wallAvailable: true }` → Wall not shown; new draft is built with `wallAvailable: false`. Document explicitly.
- Invariant: `catalogValidation.test.ts` Wall-required test passes (zero matches today).
- Covers AE6 (390 px viewport calm hierarchy).

**Verification:** `npm --prefix app run test -- SetupScreen catalogValidation` green.

---

- [x] **U3. Track 2 architecture — `SetupContext.sessionFocus?` + shared focus resolver.**

**Goal:** Land the optional `sessionFocus` field and the pure shared focus resolver.

**Requirements:** R7, R8.

**Dependencies:** None (parallel-safe with U1, U2).

**Files:**
- Modify: `app/src/types/session.ts` (add `sessionFocus?: 'pass' | 'serve' | 'set'` to `SetupContext`)
- Create: `app/src/domain/sessionAssembly/effectiveFocus.ts`
- Create: `app/src/domain/sessionAssembly/__tests__/effectiveFocus.test.ts`

**Approach:**
- Mirror the existing optional-field shape on `SetupContext`. (Originally specced as 2026-04-29-001 K2.)
- Author `effectiveSkillTags(slotType, context, fallback)`. When `slotType` is `'main_skill'` or `'pressure'` and `context.sessionFocus` is set, return `[context.sessionFocus]`. Otherwise return the fallback `slot.skillTags`.

**Patterns to follow:** Existing pure-domain helpers (`durations.ts`, `random.ts`).

**Test scenarios:**
- Happy path: `effectiveSkillTags('main_skill', { ...ctx, sessionFocus: 'serve' }, ['pass', 'serve'])` returns `['serve']`.
- Happy path: `effectiveSkillTags('pressure', { ...ctx, sessionFocus: 'pass' }, ['pass', 'serve'])` returns `['pass']`.
- Edge case: `slotType` not in `{main_skill, pressure}` (e.g., `'warmup'`, `'wrap'`) returns fallback even when focus is set.
- Edge case: `sessionFocus` undefined returns fallback for every slotType.
- Edge case: focus set to a value not in fallback (e.g., `serve` with fallback `['pass']`) still returns `[focus]` — narrowing, not intersection.

**Verification:** `npm --prefix app run test -- effectiveFocus` green.

---

- [x] **U4. Wire shared resolver into `pickForSlot`, `pickMainSkillSubstitute`, `findSwapAlternatives`.**

**Goal:** Make all candidate-pool consumers route slot-tag lookups through the shared resolver.

**Requirements:** R8, R20.

**Dependencies:** U3.

**Files:**
- Modify: `app/src/domain/sessionAssembly/candidates.ts` (`pickForSlot` calls resolver)
- Modify: `app/src/domain/sessionAssembly/substitution.ts` (`pickMainSkillSubstitute` calls resolver)
- Modify: `app/src/domain/sessionAssembly/swapAlternatives.ts` (`findSwapAlternatives` calls resolver — replaces the static `SKILL_TAGS_BY_TYPE` lookup for `main_skill` / `pressure`)
- Modify: `app/src/domain/__tests__/drillSelection.test.ts`
- Modify: `app/src/domain/__tests__/findSwapAlternatives.test.ts`

**Approach:** In each consumer, replace the direct `slot.skillTags` access (or the static `SKILL_TAGS_BY_TYPE` lookup) with `effectiveSkillTags(slot.type, context, slot.skillTags ?? [])`. The resolver is non-breaking when `sessionFocus` is undefined.

**Test scenarios:**
- Happy path: `pickForSlot` with `sessionFocus: 'serve'` only returns variants whose drills carry `serve`.
- Happy path: `findSwapAlternatives` with `sessionFocus: 'serve'` only offers serving alternates for `main_skill` / `pressure` blocks.
- Edge case: `sessionFocus: undefined` preserves today's behavior — every existing test in `drillSelection.test.ts` and `findSwapAlternatives.test.ts` regresses green without modification.
- Integration: `buildDraft` with a serving-focused context produces a draft whose `main_skill` block is a serving drill.
- Covers AE4 (focus-respected swaps).

**Verification:** existing tests + new focus-override tests green.

---

- [x] **U5. Regeneration use case (`regenerateDraftFocus.ts`).**

**Goal:** In-transaction draft regeneration with stale-write guard, baseline restore (`useBaseline` mode), and substitution input re-query.

**Requirements:** R9, R12, R17.

**Dependencies:** U3, U4.

**Files:**
- Create: `app/src/services/session/regenerateDraftFocus.ts`
- Create: `app/src/services/session/__tests__/regenerateDraftFocus.test.ts`

**Approach:** Inherit the 2026-04-29-001 plan's U5 description verbatim. The use case reads the current draft, runs the staleness check (input revision token vs current `updatedAt`), calls `buildDraft` with the new context (or restores the cached baseline in `useBaseline` mode), re-queries `findLastCompletedDrillIdsByType()` for substitution input, and writes the replacement — all inside `db.transaction('rw', db.sessionDrafts, ...)`.

`RegenerateResult` shape: `{ ok: true, draft, changed: boolean } | { ok: false, reason: 'load' | 'stale' | 'build' | 'save' | 'schema_blocked' }`.

**Patterns to follow:** the existing `db.transaction('rw', …)` pattern in `services/session/commands.ts` (`createSessionFromDraft`).

**Test scenarios:**
- Happy path: regeneration with `sessionFocus: 'serve'` returns `{ ok: true, draft, changed: true }`. Saved draft has `context.sessionFocus === 'serve'`; `main_skill` is a serving drill.
- Happy path baseline: `{ useBaseline: true }` returns `{ ok: true, draft: baseline, changed: true }`. Saved draft matches the cached baseline.
- Edge case: regeneration with the same focus already on the draft returns `{ ok: true, draft, changed: false }`.
- Error path: stale-write detected → `{ ok: false, reason: 'stale' }`; saved draft unchanged.
- Error path: `buildDraft` returns null (infeasible focus) → `{ ok: false, reason: 'build' }`; saved draft unchanged.
- Error path: schema-blocked → `{ ok: false, reason: 'schema_blocked' }`.
- Error path: save rejection (transaction rollback) → `{ ok: false, reason: 'save' }`.
- Integration: simulated concurrent invocation from two tabs produces deterministic results (one wins, one stales).

**Verification:** `npm --prefix app run test -- regenerateDraftFocus` green.

---

- [x] **U6. Tune today route + screen + controller (mandatory posture).**

**Goal:** Land `/tune-today` with the four-chip mandatory shape, all chips enabled, fail-on-tap inline copy, and source-aware Back collapsed to `'setup' | 'home'`.

**Requirements:** R5, R10, R11, R12, R13, R14, R15, R16, R21, R22, R23, R24.

**Dependencies:** U3, U4, U5.

**Files:**
- Modify: `app/src/routes.ts` (add `tuneToday: () => '/tune-today'`)
- Modify: `app/src/App.tsx` (register the route between `/setup` and `/safety`)
- Modify: `app/src/contracts/screenContracts.ts` (P12 contract entry for `TuneTodayScreen`)
- Create: `app/src/screens/TuneTodayScreen.tsx`
- Create: `app/src/screens/tuneToday/useTuneTodayController.ts`
- Create: `app/src/screens/tuneToday/__tests__/useTuneTodayController.test.tsx`
- Create: `app/src/screens/__tests__/TuneTodayScreen.test.tsx`

**Approach:**
- Controller pattern: same shape as `useDrillCheckController.ts`. State: `chipState: 'recommended' | 'pass' | 'serve' | 'set'`, `pending: boolean`, `warning: string | null`, `draft: SessionDraft | null`. Source parsed from `useLocation().state.source`; unknown values default to `'home'` (defensive).
- Screen render: `ScreenShell` with header (back button + reader-question H1 per `.cursor/rules/courtside-copy.mdc` rule 1; default candidates `What's today's focus?` for solo, `Today's shared focus?` for pair), focal `Card` with archetype + minutes + block-count summary, `<h2>` group label `Focus` (visible, sm-text), four `ToggleChip` chips inside `<div role="radiogroup" aria-label="Focus">` (Recommended | Passing | Serving | Setting), conditional inline pending message ("Updating…" or similar; pin during U6) below the chip row, conditional inline warning message (default candidate `Can't build a setting-focused session for this setup.`; pin during U6) on regeneration failure, today-only helper `Just for this session.` below the warning row, pinned `Continue to safety` primary `Button`.
- All four chips render with the same enabled treatment. Failure path: chip tap calls regeneration; on `{ ok: false, reason: 'build' | 'save' | 'stale' }`, the prior chip selection is restored and the warning copy renders. On `'schema_blocked'`, the screen falls into the existing `SchemaBlockedOverlay` path.
- Back: `source: 'setup'` navigates to `routes.setup({ state: { editDraft: true } })`; `source: 'home'` (or unknown) navigates to `routes.home()`. The saved draft is unchanged either way.
- Direct entry: while `getCurrentDraft()` is loading, render `<p>Loading…</p>`. If null, redirect to `routes.setup()` with replace semantics. If load throws, render a retryable error with `Back to setup`.

**Patterns to follow:**
- `app/src/screens/drillCheck/useDrillCheckController.ts` for controller shape.
- `app/src/screens/SafetyCheckScreen.tsx` for `ScreenShell` + radiogroup composition + `aria-live` polite announcements.
- `app/src/components/ui/ToggleChip.tsx` (`lg` size, `tone="accent"`).
- `app/src/contracts/screenContracts.ts` existing entries for the P12 contract format.

**Test scenarios:**
- Render contract: on mount with a current draft and no `sessionFocus`, the Recommended chip is selected; the focal card shows archetype + minutes + block count; H1 reads as a reader-question.
- Render contract: with `sessionFocus: 'serve'`, the Serving chip is selected.
- Render contract: H1 does not contain the literal string `Tune today` (per `.cursor/rules/courtside-copy.mdc` rule 1).
- Render contract: chips render inside `<div role="radiogroup" aria-label="Focus">` with a visible `<h2>` group label.
- Render contract: `Continue to safety` is the only primary action; no competing secondary controls.
- Controller: `pickFocus('serve')` invokes `regenerateDraftFocus({ sessionFocus: 'serve' })`. On `{ ok: true }`, chip becomes selected. On `{ ok: false, reason: 'stale' | 'build' | 'save' }`, chip selection reverts and warning renders.
- Controller: `pickFocus('recommended')` invokes `regenerateDraftFocus({ useBaseline: true })`.
- Controller: on mount with no current draft, redirects to `/setup` with `replace: true`.
- Controller: Back with `source: 'setup'` routes to `/setup` with `editDraft: true`; Back with `source: 'home'` (or unknown) routes to `/home`. Draft is unchanged in both cases.
- Controller: rapid double-tap on a chip is gated (chip and Continue disabled while pending; second tap is a no-op).
- Controller: on `{ ok: false, reason: 'schema_blocked' }`, the controller does not surface a warning — the existing `SchemaBlockedOverlay` paints the UI.
- Covers AE1 (mandatory routing), AE2 (Recommended → Serving → Recommended round-trip), AE3 (fail-on-tap with infeasible focus), AE7 (architectural traceability).

**Verification:** all new tests green; existing app builds clean.

---

- [x] **U7. Wire pre-run paths through Tune today.**

**Goal:** Every pre-run path that creates or opens the singleton current draft routes to `/tune-today` after the draft exists.

**Requirements:** R6.

**Dependencies:** U6.

**Files:**
- Modify: `app/src/screens/SetupScreen.tsx` (`handleConfirm` navigates to `routes.tuneToday()` with `state: { source: 'setup' }`; was `routes.safety()`)
- Modify: `app/src/screens/HomeScreen.tsx` (`handleDraftStart`, `handleRepeat`, `handleRepeatWhatYouDid`, and `handleStartDifferentSession` all navigate to `/tune-today` with `state: { source: 'home' }`; were `/safety`)
- Modify: onboarding's `Today's setup` flow (the same `SetupScreen.tsx` change covers it via `isOnboarding` branch — verify during U7)
- Modify: `app/src/screens/__tests__/SetupScreen.test.tsx` (route assertion updated)
- Modify: `app/src/screens/__tests__/HomeScreen.precedence.test.tsx`, `HomeScreen.start-different-session.test.tsx` (route assertions updated where they exist)

**Approach:** Mechanical route swap in five locations; pass `state: { source }` per K3.

**Test scenarios:**
- Happy path: tap `Build session` on Setup → navigates to `/tune-today` with `source: 'setup'`.
- Happy path: tap `Start session` on Home draft card → navigates to `/tune-today` with `source: 'home'`.
- Happy path: tap `Repeat this session` → rebuilt draft has `sessionFocus: undefined` (per K8); navigates to `/tune-today` with `source: 'home'`.
- Happy path: tap `Repeat what you did` → same as Repeat.
- Happy path: tap `Start a different session` (Home secondary) → builds a fresh setup-pre-filled context and navigates to `/tune-today`.
- Happy path: onboarding's `Today's setup` `Build session` → navigates to `/tune-today`.
- Regression: existing route assertions in HomeScreen tests are updated to expect `/tune-today` instead of `/safety`.
- Covers AE1 (mandatory routing), AE5 (Repeat path).

**Verification:** all updated tests green.

---

- [x] **U8. Repeat / recovery focus strip + Safety changes.**

**Goal:** Strip `sessionFocus` at the canonical sites; render the recovery-override line on Safety only when `painFlag === true && draft.context.sessionFocus !== undefined`; render no default focus echo on Safety.

**Requirements:** R18, R19, R25, R26, R27.

**Dependencies:** U3 (sessionFocus field).

**Files:**
- Modify: `app/src/domain/sessionBuilder.ts` (`buildDraftFromCompletedBlocks` and `buildRecoveryDraft` strip `sessionFocus` from the carried-forward context)
- Modify: `app/src/domain/__tests__/buildDraftFromCompletedBlocks.test.ts`
- Create or Modify: `app/src/domain/__tests__/buildRecoveryDraft.test.ts`
- Modify: `app/src/screens/SafetyCheckScreen.tsx` (no focus suffix on `sessionSummary`; conditional recovery-override line at `painFlag === true && draft.context.sessionFocus !== undefined`, adjacent to `PainOverrideCard`)
- Modify: `app/src/screens/__tests__/SafetyCheckScreen.test.tsx`

**Approach:**
- In `buildDraftFromCompletedBlocks`: when constructing the rebuilt draft's `context`, force `sessionFocus: undefined` regardless of input plan context.
- In `buildRecoveryDraft`: same — force `sessionFocus: undefined`.
- SafetyCheckScreen: keep existing `sessionSummary` line as `${archetypeName} · ${totalMinutes} min, ${blockCount} blocks` with **no** focus suffix.
- Conditional override line: render when `painFlag === true && draft.context.sessionFocus !== undefined`. Place it *above* the `PainOverrideCard`'s primary recovery CTA (so the user sees the consequence before clicking "Continue with lighter session"). Default copy: `Recovery overrides today's focus.` with the same muted tone as other sub-copy lines on Safety.

**Patterns to follow:** existing `sessionSummary` composition; existing `PainOverrideCard` adjacency.

**Test scenarios:**
- Happy path (strip): `buildDraftFromCompletedBlocks(plan)` where `plan.context.sessionFocus === 'serve'` returns a draft with `context.sessionFocus === undefined`.
- Happy path (strip): `buildRecoveryDraft({ ...ctx, sessionFocus: 'serve' })` returns a draft with `context.sessionFocus === undefined`.
- Render contract (Safety default): with `sessionFocus: 'serve'`, the session summary reads `Pair · Net · 25 min, 5 blocks` with no focus suffix.
- Render contract (Safety, painFlag false): no focus copy renders anywhere even when `sessionFocus` is set.
- Render contract (Safety, painFlag true, sessionFocus set): the override line renders adjacent to `PainOverrideCard`.
- Render contract (Safety, painFlag true, sessionFocus undefined): no override line.
- Regression (D83): pain + recency are still re-asked from scratch every session. The existing `SafetyCheckScreen.d83-regression.test.tsx` continues to pass — that test pins pain+recency, not focus. Track 3 does not affect D83.
- Regression (D86 copy guard): no new vocabulary introduced; existing copy-guard tests pass.
- Covers AE8 (no default focus echo), AE9 (recovery override).

**Verification:** all modified tests green.

---

- [x] **U9. Track 4 — JSDoc on `SkillFocus`.**

**Goal:** Document the skill-scope policy on the type union without a D136 decision row.

**Requirements:** R28, R29, R30.

**Dependencies:** None (parallel-safe with U1–U8).

**Files:**
- Modify: `app/src/types/drill.ts` (JSDoc above the `SkillFocus` type union)

**Approach:** Add a JSDoc block above the `export type SkillFocus = …` union (currently line 19) capturing the policy from R28. Keep it concise (~6–8 lines); the goal is "any agent reading this union understands the policy without leaving the file." Include the cross-reference to the superseded skill-scope brainstorm and the originating ideation as anchor points.

**Patterns to follow:** existing JSDoc style on other type exports in `app/src/types/drill.ts` (e.g., the `MetricType` comment, the `EnvironmentFlags` comment).

**Test scenarios:** Test expectation: none — JSDoc is documentation, not behavior. (No copy-guard test applies; the policy text is internal to the codebase, not user-facing.)

**Verification:**
- Visual review of the JSDoc rendered in the editor's hover.
- `npm --prefix app run typecheck` passes (sanity).

---

- [x] **U10. Catalog + status sync.**

**Goal:** Update `docs/catalog.json` `canonical_for` summary on this plan to reflect the post-iteration shape, and add a recent-shipped-history line to `docs/status/current-state.md` once the implementation lands.

**Requirements:** R31.

**Dependencies:** U1–U9.

**Files:**
- Modify: `docs/catalog.json` (update `canonical_for` summary on `pre-run-simplification-2026-04-30` entry)
- Modify: `docs/status/current-state.md` (one-line shipped-history note under Tier 1c)

**Approach:** Mechanical doc updates after the code lands. The brainstorm's `2026-04-30 iteration log` already explains the iteration; the status note just records "shipped."

**Test scenarios:** Test expectation: none — docs-only change.

**Verification:** `bash scripts/validate-agent-docs.sh` passes.

---

## System-Wide Impact

- **Interaction graph:** Tune today is mandatory between every pre-run path and Safety. The shared focus resolver is the single source of truth for `main_skill` / `pressure` slot tags; all three consumers (`pickForSlot`, `pickMainSkillSubstitute`, `findSwapAlternatives`) call it.
- **Error propagation:** The regeneration use case is the only Dexie writer for Tune today. Failure modes (`load`, `stale`, `build`, `save`, `schema_blocked`) propagate to the controller, which reverts chip selection and renders inline warnings (or routes to `SchemaBlockedOverlay` for schema-blocked).
- **State lifecycle risks:** Stale-write detection compares the input revision token against the current draft's `updatedAt`. Parallel tabs running `createSessionFromDraft` between Tune today's read and write trigger the staleness check; the use case rolls back without writing. Baseline restore writes through the same guarded path.
- **API surface parity:** `effectiveSkillTags` is the single source of truth for slot → effective skill tags. Any future swap path or candidate-pool consumer must call it; do not duplicate the logic.
- **Integration coverage:** The build → Tune today → Safety → Run path is covered end-to-end by U6 (controller) + U7 (route wiring) + U8 (Safety strip and override) tests.
- **Unchanged invariants:** `D83` (pain + recency re-asked every session) — preserved, regression-tested. `D131` (no telemetry) — preserved. `D134` (Phase 2A streak capture) — unaffected. The 4/10 cap (`docs/plans/2026-04-20-m001-adversarial-memo.md`) — unchanged. `SkillFocus` union (`pass | serve | set | movement | conditioning | recovery | warmup`) — unchanged. `DrillVariant` shape — unchanged except for `windFriendly` removal under Track 1. Dexie schema version — unchanged (Wind delete is type-only; the schema's Dexie version stays at 5).

---

## Risks & Dependencies

| Risk | Mitigation |
|---|---|
| Wind delete leaks: a fixture or production code path silently relied on `wind` being set. | U1 grep sweep + TypeScript compiler errors at every step. |
| Wall-conditional silent override changes future-catalog behavior. | U2 invariant test in `catalogValidation.test.ts` (K5) fires when a future m001 wall-using pair variant is authored. |
| K7 collapsed source-aware Back doesn't anticipate a third entry path. | If a future entry path needs a different Back behavior, restore the four-value model under that PR. |
| Recovery-override line placement is awkward with the existing PainOverrideCard layout. | DQ during U8 visual check on a 390 px viewport; placement adjustable without code changes elsewhere. |
| The 2026-04-29 wireframe asset (4-chip mandatory) still represents this design accurately. | Asset stays as the canonical wireframe; no replacement needed. |
| Phase split (Track 1 standalone vs everything together) creates an intermediate state where Wind is gone but Tune today routing isn't. | Acceptable: Wind delete is purely subtractive; SetupScreen still works. The intermediate state is a smaller Setup with same routing as today. |

---

## Phased Delivery

The plan can ship as one PR or as two:

### Phase 1 (Track 1 only — pure cleanup)
- **U1** Wind delete (full).
- **U2** Conditional Wall + Wall-required invariant test.

These are independent of Tracks 2–4 and ship a smaller Setup screen immediately. Lower review surface; ships before the larger Tune today work.

### Phase 2 (Tracks 2 + 3 + 4 — Tune today + Safety polish + JSDoc)
- **U3–U8** the full Tune today / focus / Safety stack.
- **U9** Track 4 JSDoc (parallel-safe with anything; bundle here for one PR).
- **U10** catalog + status sync.

These ship together because U3 (`sessionFocus` field) is consumed by U4 / U5 / U6 / U8, U6 needs U5's use case, and U7's routing needs U6's route. U9 is independent but rides for free.

If the PR feels manageable as a single review, ship all units together. Phase split is opportunistic, not required.

---

## Documentation / Operational Notes

- `docs/status/current-state.md` shipped-history line goes into U10.
- `docs/research/2026-04-29-tune-today-wireframe.png` (the original 4-chip wireframe asset) remains canonical for the Tune today design.
- No founder-use-ledger row required. All four tracks ship under the existing Tier 1c (`D135`) trigger.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-04-30-pre-run-simplification-requirements.md](../brainstorms/2026-04-30-pre-run-simplification-requirements.md) — see iteration log for the mandatory revert + Wind delete + JSDoc decisions.
- **Predecessor (superseded):** [docs/archive/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md](../archive/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md) — design rationale for K1–K13 inherited per the matrix above.
- **Cap & trigger discipline:** [docs/plans/2026-04-20-m001-adversarial-memo.md](2026-04-20-m001-adversarial-memo.md).
- **Decision references:** D83, D91, D125, D130, D131, D135.
