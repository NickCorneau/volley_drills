---
id: pre-run-simplification-requirements-2026-04-30
title: "Pre-run choice-load simplification requirements"
status: active
stage: validation
type: requirements
summary: "Cut pre-run choice tax to the bone in four parallel tracks: Setup-stage cuts (drop Wind, conditional Wall), Tune today goes opt-in (Setup → Safety stays default; Tune today reachable only via 'Change focus' on Home draft card), Safety simplification (no default focus echo), and skill-scope docs-only (single decision row instead of types reservation + research note). Preserves the 2026-04-29 architectural work on focus resolution, regeneration, and repeat/recovery focus strip; only changes who is routed through Tune today by default (no one)."
authority: "Supersedes the Tune-today-mandatory routing requirements, the four-chip Recommended-as-peer pattern, and the Safety focus echo from docs/brainstorms/2026-04-29-session-focus-picker-requirements.md. Supersedes the types reservation + research note shape from docs/brainstorms/2026-04-29-skill-scope-reservation-requirements.md, replacing it with a single docs/decisions.md row. Triggers a re-issue of docs/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md."
last_updated: 2026-04-30
depends_on:
  - docs/brainstorms/2026-04-29-session-focus-picker-requirements.md
  - docs/brainstorms/2026-04-29-skill-scope-reservation-requirements.md
  - docs/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md
  - docs/vision.md
  - docs/decisions.md
  - docs/research/skill-correlation-amateur-beach.md
decision_refs:
  - D83
  - D91
  - D125
  - D130
  - D131
  - D135
---

# Pre-run choice-load simplification

> **2026-04-30 iteration log** (added after agent red-team on the 2026-04-30 plan; user feedback resolved the mandatory-vs-opt-in fork):
>
> - **Track 2 reverted to mandatory Tune today.** The opt-in shape failed adversarial review on the use case it was built for (D135's focus-steering user paid 11 taps for the first focus session with no discoverable entry on Setup or Safety). The user judged "less friction, fewer taps to first usage" the dominant constraint and reverted Track 2 to the 2026-04-29-001 mandatory design (4-chip Recommended/Passing/Serving/Setting; all chips enabled with fail-on-tap; source-aware Back). Track 2 R7–R24 in the body below are **superseded** by the 2026-04-30-001 plan's K-ID inheritance matrix. Tracks 1, 3, 4 (Setup cuts, Safety polish, skill-scope policy) carry forward.
> - **Track 1 strengthened to full Wind delete.** "Dead read" was rejected as a maintenance hazard. Wind is fully removed: `WindLevel` and `wind?` on `SetupContext`, `windFriendly` on `EnvironmentFlags`, `env({ windFriendly: … })` in the catalog, and the test fixtures that set them. No Dexie migration required (TypeScript reads silently ignore extra fields on legacy persisted records).
> - **Track 4 demoted from D136 decision row to JSDoc.** Per KD7's own paperwork-before-evidence standard plus scope-guardian F4 + adversarial A5: the policy ("`SkillFocus` is the technique axis; `attack` is reserved for D135-style trigger evidence; out-of-system / side-out / transition / game-like are scenarios, not skills") lives as a JSDoc comment on the `SkillFocus` type union. Zero ceremony, same discoverability, no decisions-table churn.
> - **Custom-drill idea captured as future exploration.** User raised: "what if the focus was when setting up the drill (a custom drill)?" — read as a future product direction where focus selection moves into a custom-drill builder flow rather than a session-level pick. Captured under "Deferred for later" as post-M001 exploration; does not affect this plan.
> - **Other agent fixes applied to the 2026-04-30-001 plan**: K-ID inheritance matrix added explicitly, recovery-override render condition pinned to `painFlag === true && draft.context.sessionFocus !== undefined`, H1 reader-question form preserved from 2026-04-29 DQ2, test file paths pinned, AE coverage mapped per unit, "preserved by reference" framing made honest (~6 units of net-new code).
>
> The body below describes the original 2026-04-30 simplification thesis; **read the 2026-04-30-001 plan for what actually ships**.

## Problem Frame

Three observations triggered this brainstorm:

1. The 2026-04-29 Tune today plan made a pre-safety review step mandatory for every fresh setup, repeat, draft, and home start path. That charged a universal pre-run choice tax for a behavior only a minority of users want — even with `Recommended` selected, four visible chips still demanded attention before Safety.
2. `SetupScreen` currently asks five questions before letting the user build a session, and at least two of them carry close to zero behavioral payoff under the current builder: **Wind** has no consumer in `findCandidates` (the `windFriendly` flag exists on variants but is not read), and **Wall** is irrelevant unless the user is Solo + No Net (`selectArchetype` ignores wall for pair, and net wins for solo).
3. The 2026-04-29 skill-scope reservation work proposed types changes, a research note, an exhaustive-switch sweep, and catalog cross-links to *prepare* for a future trigger that has not fired. That is paperwork before evidence.

Each violates the same principle: **don't ask users to make decisions that don't change today's session, and don't pay carrying cost for features whose trigger hasn't fired**. The fix is not new screens or new types — it is fewer required choices everywhere, and a posture of waiting for evidence before reserving schema surface.

Tune today, when invoked, remains valuable. Its architectural work (shared focus resolver, in-transaction regeneration use case, stale-write guard, repeat / recovery focus strip) earns its keep when a user actually wants to steer focus. The change is who routes through it by default (no one) and how Setup behaves when the user just wants to train.

---

## Approach

Four parallel tracks, each cut-shaped:

- **Track 1 — Setup-stage cuts.** Drop the Wind row entirely. Hide the Wall row unless `playerMode === 'solo' && netAvailable === false`. Players, Net, and Time stay; Time keeps its `15` default.
- **Track 2 — Tune today goes opt-in.** Default routes (`Setup → Safety`, `Repeat → Safety`, Home `Start session → Safety`, onboarding `Today's setup → Safety`) skip Tune today. The route is reachable only via a small secondary `Change focus` action on the Home draft card. When entered, Tune today shows the recommendation and three focus chips (`Passing / Serving / Setting`); `Recommended` becomes ambient default state, not a peer chip. Infeasible chips are pre-checked and disabled.
- **Track 3 — Safety simplification.** Remove the default focus echo from the Safety summary line. Render focus-related copy only when the user switches to recovery and that recovery overrode a prior chosen focus. Recency, pain, and heat-tip behavior are unchanged.
- **Track 4 — Skill-scope docs-only.** No types changes. No research note. A single decision row in `docs/decisions.md` records the policy: "out-of-system is scenario, not skill; attack is a future skill axis member that waits for D135-style trigger evidence; no schema or content changes until that trigger fires." `docs/brainstorms/2026-04-29-skill-scope-reservation-requirements.md` is marked superseded.

The four tracks are independent enough to ship in any order, but Track 2's controller / route / regeneration code is the largest piece and naturally lands together with Track 3's Safety echo cut.

---

## Definitions

- **Default pre-run path** — any path that creates or selects the singleton current `SessionDraft` and routes the user toward a session start: `Setup → /safety`, `Repeat → /safety`, Home `Start session → /safety`, onboarding `Today's setup → /safety`. After this brainstorm, none of these routes pass through `/tune-today` by default.
- **Opt-in focus tuning** — the user explicitly taps `Change focus` on the Home draft card to enter `/tune-today`. Without that explicit action, `/tune-today` is not visited.
- **Focus chip** — a UI control on Tune today representing a non-Recommended focus (`Passing` / `Serving` / `Setting`). After this brainstorm, `Recommended` is no longer rendered as a peer chip; it is the ambient default state of the draft when no chip is selected.
- **Feasibility pre-check** — at Tune today render time, compute whether each focus could produce a valid draft for the current `SetupContext` (using `findCandidates` against the `main_skill` slot's effective skill tags). Chips for infeasible focus are rendered disabled with a short reason rather than enabled-and-failing-on-tap.

---

## Friction Budget / Trust Thesis

A user who opens the app to train should reach Run with at most: setup answers (3 in the common case), build, safety (pain + recency), continue. Nothing else. Every additional decision must either change the session's content meaningfully today or be opt-in.

- **Common-case Setup**: Players + Net + Time = 3 taps. `15 min` and `Calm` defaults absorb the rest. (Wall hidden unless Solo + No Net.)
- **Common-case Tune today**: not visited.
- **Common-case Safety**: pain (Yes/No) + recency chip = 2 taps.
- **Total tap budget for the recommendation-trusting user**: ~5 deliberate taps from app-open to Run, with no Tune today visit and no Wind row.

The minority who want to steer focus pays one detour: build → Safety → tap Back → Home → tap `Change focus` on the draft card → choose a chip → Continue to safety → continue. That is six taps for the non-default flow, which is honest about who pays the cost.

---

## Privacy / Data Boundary

- No new persisted fields. `SetupContext.sessionFocus?` (already specced in the 2026-04-29 brainstorm) remains the storage surface; this brainstorm does not change its persistence semantics.
- No telemetry, no profile mutation, no Dexie migration. `D131` posture preserved.
- No new types in the catalog (Track 4): no `'attack'` enum value, no `Scenario` union, no optional `scenario?` field on `DrillVariant` — until trigger evidence fires.

---

## Actors

- **A1. Recommendation-trusting user (the majority).** Opens the app, wants to train, trusts the recommendation. After this brainstorm, this user makes 3 setup taps and 2 safety taps. They never see Tune today.
- **A2. Focus-steering user (the minority).** Opens the app with a concrete intent ("today I want serving"). After this brainstorm, this user takes one extra detour: build, bail Safety, tap `Change focus` on Home, pick a chip. The detour is real but bounded.
- **A3. Pair-mode user.** Same flow as A1 or A2; `Wall` is never shown (pair mode ignores wall in `selectArchetype`); pair-mode focus copy framing is unchanged from the 2026-04-29 doc.
- **A4. First-run user.** Onboarding routes Skill Level → Today's Setup → Safety → Run. They never see Tune today on first run. (The Home `Change focus` affordance is available on subsequent runs once a draft exists.)
- **A5. Future implementation agent.** Reads this doc to understand which 2026-04-29 requirements are still authoritative and which are superseded.

---

## Key Flows

- **F1. Recommendation-trusting fresh setup (the new default).**
  - **Trigger:** A1 taps `Plan a session` from Home with no current draft.
  - **Steps:** Setup shows Players, Net, Time (and Wall iff Solo + No Net). User taps through. `Build session` saves the draft and navigates to `/safety`. Safety asks pain + recency. `Continue` creates the session.
  - **Outcome:** User reaches Run in ~5 deliberate taps. No Tune today visit.
  - **Covered by:** R1, R2, R3, R4, R10, R11, R12

- **F2. Focus-steering user (opt-in).**
  - **Trigger:** A2 has a current draft (just built, or built earlier and bailed Safety) and wants to train serving today.
  - **Steps:** From Home, A2 taps `Change focus` on the draft card. The route opens `/tune-today` with the recommendation summary, three chips (`Passing / Serving / Setting`), and `Continue to safety` primary. A2 picks `Serving`. The draft regenerates in place. A2 taps `Continue`. Safety renders without a focus echo. Continue creates the session.
  - **Outcome:** Focus steering is reachable, regeneration semantics from 2026-04-29 are preserved, but the surface is opt-in.
  - **Covered by:** R13, R14, R15, R16, R17, R20, R21, R22

- **F3. Focus revert.**
  - **Trigger:** A2 picked `Serving` earlier and now wants to go back to the system recommendation.
  - **Steps:** On Tune today, a quiet secondary `Use recommendation` link replaces the chip-revert pattern. Tap clears `sessionFocus` and restores the visit's baseline draft (semantics from K5 in the 2026-04-29 plan are preserved).
  - **Outcome:** Reverting feels like a verb, not a fourth chip.
  - **Covered by:** R15, R16

- **F4. Infeasible focus pre-check.**
  - **Trigger:** A2 opens Tune today with a setup that cannot produce a valid Setting-focused draft (e.g., a context where no `set`-tagged variant survives the `findCandidates` filter).
  - **Steps:** The `Setting` chip renders disabled with a short reason ("Not available with today's setup"). Tap is a no-op or a brief tooltip; no regeneration is attempted.
  - **Outcome:** No dead-end taps. The user sees the constraint up front.
  - **Covered by:** R19

- **F5. Repeat / Repeat-what-you-did.**
  - **Trigger:** A1 taps `Repeat this session` or `Repeat what you did` on Home.
  - **Steps:** The rebuilt draft has `sessionFocus: undefined` (focus strip from K8 / R16 of the 2026-04-29 plan is preserved). The route navigates directly to `/safety`, not Tune today.
  - **Outcome:** Repeat stays one-tap-to-safety. No focus carry-over.
  - **Covered by:** R7, R23

- **F6. Safety recovery override.**
  - **Trigger:** A2 chose `Serving` on Tune today, reached Safety, answered `pain = yes`, picked `Continue with recovery`.
  - **Steps:** `buildRecoveryDraft` returns a draft with `sessionFocus` stripped (semantics from K9 / R18 of the 2026-04-29 plan are preserved). Safety renders one short copy line acknowledging the override.
  - **Outcome:** Recovery overrides focus deterministically; the override is the only Safety surface that mentions focus.
  - **Covered by:** R26, R27

---

## Requirements

### Track 1 — Setup-stage cuts

- **R1. Drop the Wind row.** Remove the Wind section from `SetupScreen` and from onboarding's `Today's Setup`. The `wind?: WindLevel` field on `SetupContext` and the `windFriendly` flag on `DrillVariant` remain in the schema (no migration); they are dead reads in v1 and may be re-introduced as user input only when builder logic actually consumes them.
- **R2. Make the Wall row conditional.** Render the Wall section only when `playerMode === 'solo' && netAvailable === false`. In all other contexts, treat `wallAvailable` as `false` for archetype selection (matches `selectArchetype` behavior today: pair mode ignores wall; solo with net selects `solo_net` regardless of wall).
- **R3. Default Time to 15 min, no required tap.** Time keeps its current `15` default and remains a tappable row, but `isComplete` does not require Time to have been touched (it already doesn't — confirm and codify). No new behavior; this is a docs note clarifying that Time is "default-acceptable."
- **R4. Setup `isComplete` becomes "Players + Net" only.** Drop `wallAvailable !== null` from `isComplete` since Wall is now conditional. When the Wall row is shown and the user has not chosen, the build is gated. When the Wall row is hidden, `wallAvailable` is treated as `false` and build proceeds.
- **R5. Setup screen test fixtures and call sites continue to compile.** Existing `SetupContext` fixtures that pass `wind`, `wallAvailable: true` etc. remain valid (the fields stay on the type). No fixture rewrite required for the schema; only screen-level tests for the dropped/hidden rows need updates.
- **R6. Stale-context banner / pre-fill behavior.** Pre-fill from `getCurrentDraft()` / `getLastContext()` continues to apply to Players, Net, and (when shown) Wall. Wind pre-fill is dead code after R1 and is removed.

### Track 2 — Tune today goes opt-in

- **R7. Setup builds and routes directly to `/safety`.** `SetupScreen.handleConfirm` builds the draft, saves it, and navigates to `routes.safety()`. No `/tune-today` step.
- **R8. Onboarding `Today's setup` builds and routes directly to `/safety`.** Same as R7 for the onboarding entry path.
- **R9. Home `Start session` (primary action on the draft card) routes directly to `/safety`.** No `/tune-today` step.
- **R10. Home `Repeat this session` / `Repeat what you did` route directly to `/safety`.** Rebuilt drafts continue to strip `sessionFocus` per the 2026-04-29 K8 / R16 invariant.
- **R11. Home draft card adds a small `Change focus` secondary action.** Sits alongside `Change setup`. Quiet style (matches `Change setup` weight). Routes to `/tune-today`. This is the only entry point to Tune today in v1.
- **R12. Tune today direct-route entry behavior is unchanged.** R33 of the 2026-04-29 doc remains authoritative: while loading the current draft show a loading state; if no current draft exists redirect to `/setup` with replace semantics; if loading fails show retryable error and `Back to setup`.
- **R13. Tune today renders three focus chips, not four.** The chip set is `Passing | Serving | Setting`. No `Recommended` chip. Initial state on first entry is "no chip selected" (representing the Recommended baseline).
- **R14. Tune today shows `Use recommendation` as a quiet secondary link when a chip is selected.** Tapping clears `sessionFocus` and restores the visit's baseline draft via the existing regeneration use case in `useBaseline` mode (semantics from K5 of the 2026-04-29 plan are preserved). When no chip is selected, the link is hidden.
- **R15. Tune today regeneration semantics are unchanged.** The shared focus resolver (`effectiveFocus.ts`), the in-transaction regeneration use case (`services/session/regenerateDraftFocus.ts`), the stale-write guard, and source-aware Back are preserved.
- **R16. Source-aware Back collapses to a single source.** Replace the four-value `'setup' | 'home' | 'repeat' | 'home-secondary'` with `source: 'home'` only. Tune today is reachable from Home in v1; Back from Tune today routes to Home with the saved draft intact. (The four-value model can be reintroduced if a future entry path needs to diverge.)
- **R17. Continue from Tune today routes to `/safety`.** Unchanged from 2026-04-29 R3.
- **R18. Tune today does not import Dexie/db directly.** Unchanged from 2026-04-29 R35.
- **R19. Infeasible chips are pre-checked and disabled.** On Tune today render, compute feasibility by running each candidate focus through `effectiveSkillTags` + `findCandidates` against the current draft's `main_skill` slot. Render infeasible chips disabled with a short reason ("Not available with today's setup"). When all three chips are infeasible, the screen shows a calm message and only `Continue to safety` remains tappable. Supersedes 2026-04-29 R12 (which kept all chips enabled under the mandatory-exposure assumption).
- **R20. Pending regeneration semantics are unchanged.** 2026-04-29 R11, R26, R27, R28 (loading line, disable controls, revert on failure, polite live-region announcements) remain authoritative.
- **R21. Failed regeneration semantics are unchanged.** 2026-04-29 R39 (in-memory build succeeded but save failed → keep prior draft, revert chip, retryable warning) remains authoritative.
- **R22. Stale-write guard semantics are unchanged.** 2026-04-29 R36, R37 remain authoritative.
- **R23. Repeat-flow focus strip stays at `buildDraftFromCompletedBlocks`.** Unchanged from 2026-04-29 K8.
- **R24. Recovery-flow focus strip stays at `buildRecoveryDraft`.** Unchanged from 2026-04-29 K9.

### Track 3 — Safety simplification

- **R25. Remove the default focus echo from the Safety summary line.** The `sessionSummary` rendered under the Safety header continues to show `${archetypeName} · ${totalMinutes} min, ${blockCount} blocks`. It does **not** append a focus suffix. Supersedes 2026-04-29 R8 / R7 / U8 default behavior.
- **R26. Render a focus-override line only when recovery overrides an explicit focus.** When `useRecovery === true` and the source draft had `sessionFocus` set, the recovery card (or a short adjacent line) reads "Recovery overrides today's focus." When `sessionFocus` was already undefined, no focus copy renders anywhere on Safety.
- **R27. Safety remains safety-only.** No focus controls, no read-only metadata, no chip echo. Pain, recency, and heat-tip behavior are unchanged. Supersedes 2026-04-29 R8 (read-only focus echo).

### Track 4 — Skill-scope docs-only

- **R28. Author one decision row in `docs/decisions.md`.** Next available `D` ID (expected `D136` at write time). Content: (a) "out-of-system is scenario, not skill" as a stable design principle; (b) "`attack` is a future skill axis member; expose a fifth `Tune today` chip and author attack drills only when D135-style trigger evidence fires"; (c) "no types changes (`SkillFocus` union stays as-is), no `scenario?` field on `DrillVariant`, no research note, no catalog reservation entry until that trigger"; (d) "the 2026-04-29 reservation requirements are superseded by the 2026-04-30 simplification brainstorm."
- **R29. Mark `docs/brainstorms/2026-04-29-skill-scope-reservation-requirements.md` as superseded.** Frontmatter `status: superseded`. A short superseded-by note pointing at this brainstorm and the new decision row. Catalog `canonical_for` summary updated to reflect the supersession.
- **R30. Update the 2026-04-29 skill-scope ideation `related:` block.** The `related:` field of `docs/ideation/2026-04-29-skill-scope-and-game-layers-ideation.md` adds a forward link to the new decision row and to this brainstorm.
- **R31. No types changes.** `app/src/types/drill.ts` is not edited under this brainstorm. No `'attack'` reservation. No `Scenario` union. No `scenario?` on `DrillVariant`. CI catalog validation rules are unchanged.

### Cross-track

- **R32. Re-issue `docs/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md`.** Mark as superseded; the new implementation plan (handoff to `/ce-plan` from this brainstorm) covers Tracks 1–4.
- **R33. Mark `docs/brainstorms/2026-04-29-session-focus-picker-requirements.md` as partially superseded.** Frontmatter remains `status: active` (most R-IDs are preserved by reference); add a section near the top listing the specific R-IDs and KDs that are superseded by this brainstorm (Tune-today-mandatory routing R32; Recommended-as-peer-chip R4 / R5; Safety focus echo R8; source-aware Back four-value model implicit in R34; all-enabled chips R12).
- **R34. Validation must pass.** `bash scripts/validate-agent-docs.sh` passes after this brainstorm and its plan land.

---

## Acceptance Examples

- **AE1. Covers R1, R2, R3, R4.** Given a fresh user opens Setup, when the screen renders, they see Players, Net, and Time. Wall is not shown (because no answer to Net yet, and the rule is Solo + No Net). Wind is not shown.
- **AE2. Covers R2.** Given a user picks Solo + No Net, the Wall row appears. Picking Solo + Net hides Wall again. Picking Pair always hides Wall.
- **AE3. Covers R7, R10.** Given a fresh setup user taps `Build session`, the app saves the draft and navigates directly to `/safety`. `/tune-today` is not visited.
- **AE4. Covers R11.** Given Home shows a current draft, the draft card has `Start session` (primary), `Change setup` (secondary), and `Change focus` (secondary). Tapping `Start session` routes to `/safety`. Tapping `Change focus` routes to `/tune-today`.
- **AE5. Covers R13.** Given a user opens Tune today, they see three chips: `Passing`, `Serving`, `Setting`. There is no `Recommended` chip. With no chip selected, the recommendation summary shows the system-built session.
- **AE6. Covers R14.** Given a user picked `Serving` on Tune today, a `Use recommendation` link appears below the chip row. Tapping it clears `sessionFocus` and restores the baseline draft. With no chip selected, the link is hidden.
- **AE7. Covers R19.** Given a setup that cannot produce a valid Setting-focused draft, the `Setting` chip renders disabled with a short reason. Tapping is a no-op. The `Passing` and `Serving` chips remain tappable if feasible.
- **AE8. Covers R25, R27.** Given a user reaches Safety with `sessionFocus = 'serve'`, the session summary line reads `Pair · Net · 25 min, 5 blocks` with no focus suffix. The pain question, recency chips, and heat-tips block render unchanged.
- **AE9. Covers R26.** Given a user with `sessionFocus = 'serve'` answers `pain = yes` and taps `Continue with recovery`, the recovery card shows "Recovery overrides today's focus." A user whose `sessionFocus` was already undefined sees no focus copy.
- **AE10. Covers R10, R23.** Given a prior completed plan was Serving-focused, when the user taps `Repeat this session`, the rebuilt draft has `sessionFocus: undefined` and the route goes directly to `/safety`.
- **AE11. Covers R16.** Given a user opens Tune today from Home and taps Back, they return to Home with the saved draft intact. (No `setup` source path exists in v1.)
- **AE12. Covers R28, R29, R30, R31.** Given the docs-only Track 4 lands, `docs/decisions.md` has a new `D136` row stating the policy. `app/src/types/drill.ts` is unchanged (no `'attack'` value, no `Scenario` union). `docs/brainstorms/2026-04-29-skill-scope-reservation-requirements.md` has `status: superseded` in frontmatter.
- **AE13. Covers R34.** Given the brainstorm and plan PR land, `bash scripts/validate-agent-docs.sh` passes without errors.

---

## Success Criteria

- A recommendation-trusting user reaches Run in ~5 deliberate taps from app open with no Tune today visit.
- A focus-steering user can reach `/tune-today` in one tap from Home (`Change focus`) and steer focus without dead-end taps.
- Setup shows three rows (Players, Net, Time) in the common case; four (+ Wall) only for Solo + No Net.
- Safety mentions focus only when recovery overrides it.
- No types changes ship under this brainstorm. The skill-scope policy lives in one decision row, not three docs.
- Prior 2026-04-29 architectural rigor (focus resolver, regeneration use case, stale-write guard, repeat / recovery focus strip) is preserved exactly when Tune today is invoked.

---

## Scope Boundaries

- No `Recommended` peer chip.
- No mandatory pre-safety review step.
- No focus echo on Safety in the default case.
- No types changes (no `'attack'` reservation, no `Scenario` union, no `scenario?` on `DrillVariant`).
- No new research note (`docs/research/skill-vs-scenario-axes.md` is not authored).
- No catalog entry for the (now-cut) types reservation.
- No Wind UI in Setup.
- No Wall UI when irrelevant (anything other than Solo + No Net).
- No Dexie migration.
- No telemetry, no profile mutation.
- No new tests beyond what's required to pin the cuts and the conditional Wall behavior.

### Deferred for later

- **Custom-drill builder where focus is part of drill setup.** User-raised 2026-04-30: "what if the focus was when setting up the drill (a custom drill)?" — a future direction where users author or configure a session by picking a "main drill" and the focus is implicit in that choice rather than a separate session-level chip. This is a different product model (drill-level intent vs session-level intent) and would supersede or coexist with Tune today depending on shape. Defer to post-M001 product exploration; does not affect Tune today mandatory shipping now.
- **Auto-deriving Safety recency from session history.** Real product implications (what does "First time" mean if `ExecutionLogs` exist but the user had a long layoff? Override path? Default for genuinely unknown layoff?). Separate brainstorm.
- **Adding `attack` as a fifth Tune today chip.** Waits for `D135`-style trigger evidence (partner walkthrough flag or ≥3 founder-ledger rows naming an attack gap).
- **Exposing scenario as a UX axis.** Same evidence threshold; documented in the JSDoc policy on `SkillFocus`.
- **Wind as a behavioral input.** If a future builder rule meaningfully consumes wind, re-introduce both the field and the UI together. Until then, fully removed (per 2026-04-30 iteration log).
- **A second entry path to Tune today (e.g., from Setup post-build link).** Moot under mandatory Tune today (every pre-run path enters automatically). Resurface only if mandatory-shape friction surfaces in dogfeed.

### Outside this product's identity

- Pre-run choice as a feature surface. Volleycraft is recommendation-first by promise; every choice we surface must change the session today or carry the user's own intent. We don't add pickers because pickers feel "powerful."

---

## Key Decisions

- **KD1. Tune today exists; Tune today is opt-in.** The route, the regeneration use case, the shared focus resolver, the stale-write guard, the repeat / recovery focus strip — all preserved exactly. The change is *who routes through Tune today by default* (no one). This is the smallest cut that respects both the `D135`-fired need and the simplification thesis.
- **KD2. `Recommended` is ambient state, not a chip.** Showing "the default" as a peer of "Passing / Serving / Setting" trains users to think they need to inspect or pick something. Replacing it with a `Use recommendation` link (visible only when a chip is selected) makes the verb shape match the user's mental model: "go back to the default."
- **KD3. Pre-check feasibility at render, not at tap.** Once Tune today is opt-in, the user has already chosen to think about focus. Showing them a chip that fails on tap is worse than showing it dimmed up front. This contradicts 2026-04-29 R12, which was justified by mandatory exposure; under opt-in, the calculus flips.
- **KD4. Cut Wind, keep `wind?` on the schema.** Removing the field would force a Dexie migration and break test fixtures. Removing the UI is a surface change; the field becomes a dead read until a future builder rule consumes it. Honest about what we're cutting.
- **KD5. Wall is conditional, not deleted.** When the user *is* Solo + No Net, Wall genuinely changes archetype selection (`solo_wall` vs `solo_open`). Hiding it unconditionally would silently drop `solo_wall` accessibility.
- **KD6. Safety's session summary stays minimal.** Echoing focus on Safety is information density without a job. Recovery override is the only case where Safety has something useful to say about focus.
- **KD7. Skill-scope is paperwork before evidence.** Reserving types, authoring a research note, and threading exhaustive-switch arms through the codebase to *prepare* for a trigger that hasn't fired is exactly the kind of scope creep the cap discipline (`docs/plans/2026-04-20-m001-adversarial-memo.md`) exists to prevent. One decision row captures the *posture* (we will add attack when evidence fires; out-of-system is scenario, not skill); the implementation cost waits for the evidence.
- **KD8. Source-aware Back collapses to one value.** Four enum values were over-modeled for an implementation that only has one entry path in v1. Reintroduce the four-value model when a second entry path materializes.
- **KD9. The 2026-04-29 architectural work is preserved by reference, not copied.** `effectiveFocus.ts`, `regenerateDraftFocus.ts`, the in-transaction stale-write guard, and the repeat / recovery focus strip all remain authoritative when Tune today is invoked. This brainstorm changes routing and chip presentation, not the underlying architecture.

---

## Dependencies / Assumptions

- The 2026-04-29 plan's architectural decisions (K3, K4, K5, K6, K8, K9, K10–K13) are preserved by reference; the new implementation plan (handoff) inherits them.
- The Home draft card has room for a third secondary action (`Change focus`) without redesign. If layout testing reveals it doesn't, planning collapses `Change setup` and `Change focus` into a `Change…` menu — but v1 assumes they fit.
- `findCandidates` against the `main_skill` slot is cheap enough to call at Tune today render time for feasibility pre-check (it's a static-catalog filter, no Dexie reads). Confirmed by reading `app/src/domain/sessionAssembly/candidates.ts`.
- Removing the Wind row does not regress any catalog test (`windFriendly` is set on variants but not consumed by `findCandidates`; confirmed by grep).
- The next available `D` ID is `D136`. Planning confirms by reading `docs/decisions.md` HEAD.

---

## Outstanding Questions

### Resolve Before Planning

- None. The user resolved Track 4 (skill-scope: docs-only) and approved Track 2's opt-in shape (option A). Tracks 1 and 3 follow directly from the red-team consensus.

### Deferred to Planning

- **DQ1.** Whether the `Change focus` action on Home draft card lives next to `Change setup` (sibling) or under a small `…` menu. Default for v1: sibling, kept quiet. Promote to a menu if the draft card layout testing reveals it doesn't fit on a 390 px viewport.
- **DQ2.** Exact copy for the Tune today disabled-chip reason. Default candidate: "Not available with today's setup." Pin during implementation.
- **DQ3.** Exact copy for the recovery-override line. Default candidate: "Recovery overrides today's focus." Pin during implementation.
- **DQ4.** Whether Track 3 (Safety simplification) requires copy-guard test updates, given that the regulatory copy guard scans rendered Safety output. Default: planning verifies and adjusts the test list. No copy is being added that introduces new vocabulary; the change is removing an echo.
- **DQ5.** Whether the existing `TimeProfile = 15 | 25 | 40` row visually changes after Wind is removed (more vertical breathing room). Default: no layout change required; planning visually verifies on a 390 px viewport screenshot.

---

## Supersession Map

| Source doc | What this brainstorm supersedes | What stays authoritative there |
|---|---|---|
| `docs/brainstorms/2026-04-29-session-focus-picker-requirements.md` | R4 / R5 (four-chip Recommended-as-peer pattern), R7 / R32 (mandatory routing through Tune today on every pre-run path), R8 (Safety read-only focus echo as default), R12 (all-four-chips-always-enabled under mandatory exposure), R34's four-value source-aware Back model. | Most R-IDs (R1–R3, R9–R11, R13–R18, R19–R30, R33, R35–R44). All KDs except KD2 (Home as entry point — now also the *only* entry point) and KD3 (Safety stays pure — now stricter; no echo at all). |
| `docs/brainstorms/2026-04-29-skill-scope-reservation-requirements.md` | All R-IDs (R1–R18). The entire types reservation + research note + catalog cross-link shape. | The problem framing in `docs/ideation/2026-04-29-skill-scope-and-game-layers-ideation.md` is unchanged; that ideation's S1 + S2 + S5 are still the right *direction*, but the implementation cost is deferred to evidence. |
| `docs/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md` | Status changes to `superseded`. The new plan covers Tracks 1–4 of this brainstorm and inherits 2026-04-29's K3–K13 by reference where applicable. | None — superseded in full by the new plan. |

---

## Next Steps

→ `/ce-plan` to produce a single implementation plan covering Tracks 1–4. The plan should be sequenced so that Track 1 (Setup-stage cuts) and Track 4 (skill-scope docs-only) can land independently if Tracks 2 and 3 take longer; Track 2 and Track 3 naturally land together (same Safety / Tune today / Home edit pass).
