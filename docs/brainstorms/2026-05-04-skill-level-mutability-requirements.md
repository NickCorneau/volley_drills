---
id: skill-level-mutability-requirements-2026-05-04
title: "Skill-level mutability requirements (Settings durable change; D137 supersedes Tune today eyebrow)"
status: complete
stage: validation
type: requirements
summary: "Completed requirements for D135-fired skill-level mutability. Current after D137: Settings hosts the durable skill-level change at /settings/skill-level, onboarding skill level remains the runtime input, and engine level filtering remains current. PARTIALLY SUPERSEDED 2026-05-06: Tune today relaxation eyebrow, levelRelaxed, regenerateDraftFocus, and /tune-today are retired."
authority: "Completed requirements handoff for skill-level mutability. Owns the surviving Settings/onboarding skill-level override, taxonomy choice, engine wiring contract, accessibility, and shared SkillLevelPicker reuse. D137 supersedes the Tune today eyebrow, relaxation flag, and regenerateDraftFocus requirements."
last_updated: 2026-05-06
depends_on:
  - docs/brainstorms/2026-04-29-session-focus-picker-requirements.md
  - docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/research/2026-04-27-cca2-dogfeed-findings.md
  - docs/research/2026-04-28-build17-pair-dogfeed-feedback.md
  - docs/research/2026-05-04-pair-serving-session-feedback.md
  - docs/decisions.md
decision_refs:
  - D91
  - D121
  - D130
  - D131
  - D135
  - D137
---

# Skill-Level Mutability Requirements

## Iteration log

**2026-05-06 D137 supersession note.** Settings remains canonical for durable skill-level changes, but this document's Tune today relaxation-eyebrow and `levelRelaxed` requirements are superseded by `docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md` and `docs/plans/2026-05-06-001-refactor-d137-tune-today-routing-cleanup-plan.md`. D137 deleted `/tune-today`, the controller, `regenerateDraftFocus`, and `SessionDraft.levelRelaxed`; skill level is now surfaced only through onboarding and `/settings/skill-level`.

**2026-05-04, post-`ce-doc-review`.** Six parallel reviewers (coherence, feasibility, product-lens, design-lens, scope-guardian, adversarial) surfaced findings the original draft glossed: assemblyMeta phantom, focus-strip mirror claim wrong, R6 vs R10/R22 contradiction, R3 saved-override gap, premise-framing single-reading. Material changes applied. Net: 35 R-IDs, 11 KDs, 2 DQs.

**2026-05-04, post-pivot to Settings + Tune today eyebrow.** User asked: "could this just be hidden in Settings since skill level doesn't change too often?" Both `ce-product-lens-reviewer` and `ce-design-lens-reviewer` evaluated and converged on the pivot. Substantial revision applied below — this entire body now reflects the new shape, not the original chip-row design. Material changes:

- **Surface pivot.** Tune today does NOT gain a Level chip row. Settings gains a "Change skill level" affordance (re-renders the existing 5-tier `SkillLevelScreen` UI with a heading swap, writes `storageMeta.onboarding.skillLevel`, returns to Settings). Tune today gains a single conditional 1-line eyebrow above Continue when the engine had to relax level for ≥1 focus-controlled slot today (tappable to Settings).
- **Field removal.** No `SetupContext.skillLevelOverride?: PlayerLevel`. Onboarding skill level IS the runtime input — `effectiveLevel(onboarding)` reads `storageMeta.onboarding.skillLevel` via the existing `skillLevelToDrillBand` shim. Per-session calibration is out of scope (no trigger evidence supports it).
- **Strip discipline collapses.** No per-session override means no `buildDraftFromCompletedBlocks` / `buildRecoveryDraft` strip work. KD11's asymmetric strip discipline disappears.
- **Repeat/recovery taxonomy clean.** No vocabulary mismatch (Settings uses the same 5-tier identity names users picked at onboarding). KD3's "absolute chips in engine vocabulary" choice disappears.
- **Architectural complexity dissolves.** No `ToggleChip` `disabled` prop, no dual-radiogroup keyboard traversal, no pair/solo group-label structural branching, no R36 inline note in its original form (replaced by the simpler relaxation eyebrow), no `regenerateDraftFocus` extension to accept a per-session field. The focus picker stays untouched.
- **Trigger-evidence match.** Seb's verbatim ("to better reflect my skill set" / "the option to choose a new difficulty setting") reads as identity correction. Settings is the linguistic match. Adversarial Finding 1 from the first review pass and Product-lens Finding A/B/E all flagged this; the original brainstorm dismissed them. The pivot accepts them.
- **A3 actor served, not deferred.** The unsure / wrong-onboarding user (the founder dogfeeders most likely include this case) can fix their answer once. The original brainstorm explicitly named "tap every session forever" as an accepted v1 trade-off; the pivot eliminates it.
- **Engine wiring (Track 1) survives intact.** This is the load-bearing engineering work — the engine has been ignoring `onboarding.skillLevel` since v0b. Whether Settings or per-session is the surface, wiring the engine to read level honestly is independently valuable.
- **Trajectory boundary preserved.** Tune today stays a one-row calm confirmation step in the common case. The eyebrow only renders when there's something honest to say; the validated 2026-05-04 design is preserved.

Net: ~22 R-IDs (down from 35), ~9 KDs (down from 11), ~2 DQs.

The original brainstorm body is preserved in commit history; this revision authoritatively replaces it.

---

## Problem Frame

`D135` fired the skill-level-mutability sibling trigger via partner-walkthrough OR clause: Seb's 2026-04-27 cca2 voice memo asked "let me change my skill set level to better reflect my skill set" and his 2026-04-28 build-17 voice memo repeated "the option to choose a new difficulty setting." The verbatim language reads as **identity correction** — *to better reflect* and *setting* both imply persistence — not per-session calibration. Today, `onboarding.skillLevel` is captured once at first-open and persisted in `storageMeta`; there is no surface to change it without re-doing onboarding. Worse, the assembly engine **does not read skill level at all** (`app/src/lib/skillLevel.ts`: "v0b ships the screen and persists the value but does not gate any code path on it") — even the onboarding answer is silently ignored at runtime. This ship wires the engine for the first time and adds the Settings affordance that lets the user change their answer durably.

The 2026-05-04 founder + Seb pair-serving session validated Tune today's focus picker reads cleanly as a one-row calm confirmation step. This pivot preserves that — Tune today stays one row in the common case. A single quiet eyebrow appears above Continue only when the engine had to relax the user's saved level today (the catalog has zero `levelMax: 'advanced'` drills with `pass | serve | set` focus, so this will fire reliably for users on Advanced); the eyebrow is tappable to Settings. The eyebrow is the catalog-honesty signal — without it, an `unsure` user pinned to Beginner could go months without ever knowing the engine has been quietly relaxing their main work to fit the catalog.

---

## Design Direction

- **Visual thesis.** Settings hosts the durable change. Tune today stays a one-row calm confirmation step (Focus + Continue). When the engine had to relax level for ≥1 focus-controlled slot today, a single quiet eyebrow line renders above the Continue button — tappable to Settings.
- **Settings affordance.** A new section on `SettingsScreen` renders the user's current skill level (using the 5-tier `SKILL_LEVEL_LABEL` from `app/src/lib/skillLevel.ts`) with a `Change` affordance that opens a Settings sub-route. The sub-route re-renders the existing `SkillLevelScreen` UI verbatim — same five focal cards, same `voiceFromContext`-driven copy, same `setStorageMetaMany` write — with a heading swap (`Where are you today?` → `Update your level`) and a back-affordance instead of forward navigation. Pick → write → return to Settings.
- **Tune today eyebrow.** A single short line above Continue (e.g., `Today's session is calibrated to your saved level — adjust in Settings.`) when `levelRelaxed: true`. Tappable; tapping navigates to Settings. Renders nothing when `levelRelaxed: false`.
- **Restraint.** No new components. No chip primitive changes. No dual radiogroup. No new vocabulary surface. No motion. The existing `SkillLevelScreen` UI is the design language; the eyebrow is one line of `text-text-secondary` text.

---

## Architecture Direction

- **Architecture thesis.** A pure shared resolver `effectiveLevel(onboarding)` defines the runtime level for any candidate-pool decision. The assembly engine's `pickForSlot` consumes the resolver and prefers drills whose `[levelMin, levelMax]` band contains the effective level; when no in-band drill exists for a focus-controlled slot, the band gate relaxes (drills outside the band are admitted). This is the first time the engine reads level; the wiring is part of this ship.
- **State boundary.** Skill level lives in `storageMeta.onboarding.skillLevel` — the existing storage location. Settings mutates it via the existing `setStorageMetaMany` path. No `SessionDraft.context` change, no `SessionPlan.context` change, no new field anywhere.
- **Routing boundary.** Settings owns the durable level surface. Tune today owns the relaxation eyebrow only. Onboarding's `SkillLevelScreen` retains its first-open responsibility unchanged; the Settings sub-route reuses its UI.
- **Selection boundary.** One shared pure resolver feeds initial picks, build-time main-skill substitution, and swap alternatives so leveled sessions cannot drift across candidate-pool paths. Mirrors the focus-resolver discipline established by the focus picker.
- **Trajectory boundary.** Tune today stays a one-row calm confirmation step. The eyebrow is conditional, not persistent — it appears only when the engine has something honest to say. If a future per-session calibration trigger ever fires (with real evidence, not the original brainstorm's interpretation), the engine wiring shipped here is the chassis to add a chip on top of; the resolver signature and the build-time `levelRelaxed` flag are both designed to accept that extension.

---

## Definitions

- **Onboarding skill level** is the value persisted in `storageMeta.onboarding.skillLevel` using the 5-tier `SkillLevel` enum (`foundations` / `rally_builders` / `side_out_builders` / `competitive_pair` / `unsure`). It is the user's identity answer. Settings can change it.
- **Drill band** is the 3-tier `PlayerLevel` enum (`beginner` / `intermediate` / `advanced`) that drill records carry as `levelMin` / `levelMax`. The shim `skillLevelToDrillBand()` already maps onboarding to drill band (`unsure` → `beginner` per KD8).
- **Effective level** is the runtime value the engine actually uses: `skillLevelToDrillBand(onboarding) ?? 'beginner'`. There is no per-session override.
- **Level relaxation** is the build-time event when the engine could not fill a focus-controlled slot from the in-band pool and admitted a drill outside the user's band. Surfaces to the user via the Tune today eyebrow when ≥1 focus-controlled slot was relaxed.

---

## Friction Budget / Trust Thesis

- **Tune today common case (no relaxation):** zero new taps, zero new chrome. Identical to the validated 2026-05-04 calm shape.
- **Tune today relaxation case:** one quiet eyebrow line above Continue. Continue still works directly (no new taps required). User can tap the eyebrow to navigate to Settings if they want to fix it.
- **Settings change:** opt-in navigation. User who knows they want to change their level navigates Home → Settings → Change skill level → pick → return. The flow is identity-correction-shaped, matching the trigger evidence's "to better reflect my skill set" framing.
- **Engine honesty:** the user picked a level at onboarding; the engine now respects it. When the catalog can't fully honor it (today: any `Advanced` user on a focus-controlled session), the user is told via the eyebrow rather than silently overridden.
- **A3 served.** The `unsure` / wrong-onboarding user fixes their answer once. No "tap every session forever."

---

## Privacy / Data Boundary

- Skill level lives in `storageMeta.onboarding.skillLevel` — same location, same boundary as today.
- Settings mutates this value via the existing `setStorageMetaMany` path. The mutation is durable and identity-shaped.
- Full-history export already includes `storageMeta.onboarding.skillLevel` (verified in `app/src/services/export.ts`). No new field; no export-shape change.
- The Tune today eyebrow renders nothing persistent. The build-time `levelRelaxed` flag exists only for the duration of the controller render; not written to Dexie.
- This feature adds no telemetry event, no remote copy, no new persistence surface, and no Dexie schema migration.

---

## Actors

- **A1.** Founder / returning player who picked a calibrated level at onboarding and rarely needs to change it. Tune today: no new chrome in the common case. Settings: visited rarely, when a change is intended.
- **A2.** Pair-session partner. Doesn't directly interact with Settings; sees Tune today's eyebrow alongside the founder if relaxation fires. The pair conversation about "should we change our level" routes through Settings off-court.
- **A3.** First-run user who picked `unsure` (or the wrong band) at onboarding. **Now first-class served:** a single Settings change fixes the engine read for all future sessions. The eyebrow is the discoverability path that surfaces the affordance when the engine couldn't honor their saved answer.
- **A4.** Future implementation agent who needs the engine wiring, the resolver pattern, and the Settings reuse pattern documented so any future evolution (e.g., per-session calibration if real evidence ever fires) can land without re-litigating taxonomy or engine wiring.

---

## Key Flows

- **F1. Default flow (no relaxation)**
  - **Trigger:** A1 lands on Tune today after Setup or Home; the engine could honor their saved level for every focus-controlled slot.
  - **Steps:** Tune today renders Focus row + Continue (no eyebrow). A1 leaves it alone or picks a focus and taps Continue.
  - **Outcome:** Same as today's validated 2026-05-04 flow. Zero new taps.
  - **Covered by:** R1, R12.

- **F2. Settings durable change**
  - **Trigger:** A1 or A3 wants to durably change their skill level (e.g., "I picked unsure at onboarding and I think I'm actually intermediate now").
  - **Steps:** User navigates Home → Settings → "Change skill level" → sub-route opens with the existing 5-card SkillLevelScreen UI → user picks → write to `storageMeta.onboarding.skillLevel` → return to Settings.
  - **Outcome:** Future sessions read the new level. No effect on any in-flight draft (R8 — see Outstanding Questions for the explicit decision).
  - **Covered by:** R2, R3, R4, R5, R6, R7, R8.

- **F3. Tune today relaxation eyebrow**
  - **Trigger:** User lands on Tune today and the build returned `levelRelaxed: true` (engine had to relax level for ≥1 focus-controlled slot to fill the draft).
  - **Steps:** Tune today renders Focus row + a single inline eyebrow above Continue + Continue. The eyebrow is tappable.
  - **Outcome:** User sees honest signal. Tapping the eyebrow navigates to Settings (deep-link-ready: `routes.settings()` with anchor or query param to scroll to the skill-level section). Continue still routes to Safety unchanged.
  - **Covered by:** R9, R10, R11, R13.

- **F4. Repeat / recovery flow**
  - **Trigger:** A1 taps `Repeat this session` or Safety switches to recovery.
  - **Steps:** Both `buildDraftFromCompletedBlocks` and `buildRecoveryDraft` carry forward the saved plan/context unchanged. There is no per-session level override to strip.
  - **Outcome:** The rebuilt draft uses the same engine effective level (read from `storageMeta.onboarding.skillLevel`). If the user changed their Settings level since the original session, the rebuild reflects the new level.
  - **Covered by:** R12 (engine reads onboarding fresh on every build).

---

## Requirements

### Engine wiring (new in this ship)

- **R1.** A pure shared resolver `effectiveLevel(onboarding)` is the single source of truth for runtime skill level. It is consumed by initial slot picking (`pickForSlot`), build-time main-skill substitution (`pickMainSkillSubstitute`), and swap alternatives (`findSwapAlternatives`). Pure, no IO, no React. Mirrors `effectiveSkillTags` discipline from the focus picker.
- **R12.** The engine reads `skillLevelToDrillBand(onboarding.skillLevel) ?? 'beginner'` as the effective level. Missing/malformed/`unsure` falls through to `beginner` (KD8). The 5-tier `SkillLevel` taxonomy is not used by the engine — only its 3-tier projection.
- **R14.** Candidate-pool consumers (`pickForSlot`, `pickMainSkillSubstitute`, `findSwapAlternatives`) prefer drills whose `[levelMin, levelMax]` band contains the effective level. The pool is built as `focus ∩ level` (preferred). When that pool is empty for a focus-controlled slot, the engine retries with `focus only` (level relaxed). If that pool is also empty, the existing "no candidate" build-failure path applies unchanged. Level is never preferred over focus.
- **R15.** Whenever the engine retries with level relaxed in step 2 of R14 for ≥1 focus-controlled slot in a build, the build returns a `levelRelaxed: boolean` flag alongside the draft. Not persisted (KD9).
- **R16.** Onboarding skill level is read inside the build path, not snapshotted on `SetupContext`. Every `buildDraft` call reads `storageMeta.onboarding.skillLevel` via `getStorageMeta(...)`. (Settings change between Setup and Tune today is therefore reflected immediately on the next regeneration.)

### Settings durable change

- **R2.** `SettingsScreen` gains a new section between the Export card and the About local storage section, titled `Skill level`. The section displays the user's current skill level using `SKILL_LEVEL_LABEL[onboarding.skillLevel]` and a `Change` affordance.
- **R3.** Tapping `Change` navigates to a new Settings sub-route (`/settings/skill-level`). The sub-route renders the existing 5-card `SkillLevelScreen` UI verbatim with two changes: (a) heading text swap from `Where are you today?` (or its pair variant) to `Update your level` (final copy pinned during planning); (b) a back affordance in the header instead of forward navigation on pick.
- **R4.** Picking a level on the sub-route writes `storageMeta.onboarding.skillLevel` via `setStorageMetaMany({ 'onboarding.skillLevel': level })` and navigates back to Settings. The `'onboarding.step'` field is NOT mutated (the user has already completed onboarding; step writes are first-run-only).
- **R5.** The sub-route is reachable from Settings only. It is not registered as a first-run gate. `FirstOpenGate` continues to route fresh-install testers to `/onboarding/skill-level` per the existing C-3 Unit 1 contract.
- **R6.** The Settings affordance never shows the engine-band (`Beginner` / `Intermediate` / `Advanced`) translation. The user reads and writes in the 5-tier `SkillLevel` vocabulary they picked at onboarding. The shim (R12) is internal-only.
- **R7.** Pair/solo voice handling on the sub-route inherits from the existing `SkillLevelScreen` `voiceFromContext` discipline: pair voice when `lastPlayerMode === 'pair'`, solo voice otherwise. No new branching.
- **R8.** A Settings change does NOT mutate any in-flight `SessionDraft.context`. The active draft (if any) keeps its original assembly. The next build (Setup completion, Tune today regeneration via Focus chip, Repeat, Recovery) reads the new level.

### Tune today relaxation eyebrow

- **R9.** When the active draft's most recent `buildDraft` call returned `levelRelaxed: true`, Tune today renders one inline eyebrow line above the Continue button. Default copy candidate: `Today's session is calibrated to your saved level — adjust in Settings.` Final copy pinned during planning. Renders nothing when `levelRelaxed: false`.
- **R10.** The eyebrow is tappable. Tapping navigates to Settings (`navigate(routes.settings())`). The active draft is preserved; the user can return to Tune today via Back without losing state.
- **R11.** The eyebrow is announced to assistive tech via the existing `aria-live="polite"` region on Tune today (shared with the Focus row's pending message). It does not interrupt the screen.
- **R13.** The `levelRelaxed` flag must reach the controller for both build paths that produce the active draft: (a) initial build via SetupScreen.handleConfirm, (b) regeneration via the Focus chip's `regenerateDraftFocus` use case. Plan owns the mechanism (e.g., persist on `SessionDraft` as a non-domain UI hint, OR pass via router state, OR re-derive on Tune today mount). Plan picks one.

### Architecture guardrails

- **R17.** `effectiveLevel` is a pure module under `app/src/domain/sessionAssembly/` (alongside `effectiveFocus.ts`). It depends only on the onboarding skill-level value and the existing `skillLevelToDrillBand` shim.
- **R18.** No `SetupContext` field is added. `SetupContext` shape is unchanged.
- **R19.** Settings sub-route does not import Dexie/db directly. It uses `setStorageMetaMany` from `services/storageMeta.ts` (already the path used by `SkillLevelScreen`).
- **R20.** No swap-screen Level control. Level is a Settings concern; in-session swaps inherit the saved onboarding level via the resolver, but no swap-screen control surfaces level directly.
- **R21.** Onboarding flow (`SkillLevelScreen`) is unchanged. Settings sub-route reuses the same UI primitives via shared component extraction (a new `SkillLevelPicker` component that both the onboarding screen and the Settings sub-route render with different headers and post-pick behaviors). No duplication.
- **R22.** No persisted `levelRelaxed` trace beyond what's needed for R13. The flag exists only at build-return time and during the Tune today render for the active draft; it is not written into `SessionPlan` history.

---

## Acceptance Examples

- **AE1. Covers R1, R12.** Given a Tune today render with onboarding `'rally_builders'` (mapped to `intermediate`) and a setup whose effective combination produces a draft with no focus-controlled slot needing relaxation, Tune today renders Focus row + Continue with no eyebrow.
- **AE2. Covers R2, R3, R6.** Given a user navigates Home → Settings, the Settings screen renders a `Skill level` section showing `Side-out builders` (or whatever the saved 5-tier label is). Tapping `Change` opens `/settings/skill-level` with the same 5-card UI as onboarding, headed `Update your level`.
- **AE3. Covers R4, R5, R8.** Given the user picks `Competitive pair` on `/settings/skill-level`, `storageMeta.onboarding.skillLevel` updates to `competitive_pair`, navigation returns to Settings, and `storageMeta.onboarding.step` remains unchanged.
- **AE4. Covers R9, R10, R11, R13.** Given onboarding `'competitive_pair'` (mapped to `advanced`) and a setup that triggers the catalog-gap relaxation (e.g., serving session — zero `levelMax: 'advanced'` serving drills), Tune today renders Focus row + Continue + an inline eyebrow above Continue. Tapping the eyebrow navigates to `/settings`.
- **AE5. Covers R7.** Given a pair-mode session, the Settings sub-route renders pair-voice copy on the heading per `voiceFromContext` (e.g., `Update your shared level` if the existing pair-voice helper produces that). Solo-mode renders solo-voice copy.
- **AE6. Covers R14, R15.** Given a Serving session under today's catalog with effective level `advanced`, the build relaxes level on every serving-controlled slot, the build returns `levelRelaxed: true`, and the Tune today eyebrow (AE4) renders.
- **AE7. Covers R12 / KD8.** Given onboarding `'unsure'`, the engine reads effective level as `beginner` and the build does not relax for a Pass + Beginner setup (catalog has 26 beginner-min drills).
- **AE8. Covers R16, R8.** Given an active draft built under onboarding `intermediate`, the user navigates to Settings, changes to `competitive_pair`, returns to Home, and lands on Tune today. The active draft is unchanged. Tapping a different focus chip triggers regeneration; the new draft is built under `advanced`.
- **AE9. Covers R20.** Given an Advanced user mid-run hits Swap on a `main_skill` block, alternatives are the same as today (preference for in-band serving drills if any exist, falling back to all serving drills). No swap-screen Level control rendered.
- **AE10. Covers R5.** Given a fresh-install user, `FirstOpenGate` routes to `/onboarding/skill-level` (not `/settings/skill-level`); the new sub-route is unreachable until onboarding completes.

---

## Success Criteria

- A user who picked the wrong level at onboarding (or `unsure`) can fix it in one Settings visit, without re-doing onboarding.
- The assembly engine reads effective skill level for the first time, honoring the user's onboarding answer deterministically.
- Tune today preserves its validated 2026-05-04 calm one-row shape in the common case; the eyebrow only appears when there is something honest to say.
- When the catalog cannot honor the user's saved level, the user is told inline (eyebrow) and given a discoverability path to Settings — the trust contract stays honest.
- The engine-wiring foundation is in place for any future per-session calibration surface, if real evidence ever fires.
- Implementation reuses the existing `SkillLevelScreen` UI verbatim — zero new chip primitives, zero new accessibility contracts, zero new vocabulary surfaces.

---

## Scope Boundaries

- **No `SetupContext.skillLevelOverride?: PlayerLevel`.** Onboarding skill level IS the runtime input.
- **No Tune today Level chip row.** Tune today gains a single conditional 1-line eyebrow only.
- **No 5-tier `SkillLevel` exposure on Tune today.** The eyebrow is taxonomy-agnostic ("your saved level"). Settings uses the 5-tier names users already know.
- **No "auto-suggested level" from session history.** Onboarding is the only input.
- **No hard level filter.** Drills outside the band are admitted per R14 fallback when the focus pool is empty.
- **No persisted relaxation trace.** The build-time `levelRelaxed` flag drives the eyebrow only; not written to `SessionPlan` or `SessionDraft` long-term (R13 may persist on `SessionDraft` as a UI-only hint — plan picks).
- **No Dexie schema migration.** No new field.
- **No telemetry, profile mutation beyond the documented Settings change, or `D131` change.**
- **No new drill authoring.** Catalog gap for Advanced focus-controlled drills is recognized; the eyebrow makes it honest. Catalog authoring is a separate trigger (DQ1).
- **No swap-screen UI for level.** Level is a Settings concern.
- **No per-session calibration chip.** Out of scope; if real trigger evidence ever fires, the engine wiring shipped here is the chassis (R1, R12, R14, R15).
- **No `M001` cap consumption** — ships under the existing `D135` Tier 1c-sibling trigger.

### Deferred for later

- **Per-session calibration chip** on Tune today. Out of scope; would need fresh trigger evidence (e.g., ≥2 founder-ledger rows naming a "today should be different than my durable level" friction, OR partner-walkthrough hit to that effect). The engine wiring shipped here is reusable.
- **Catalog authoring of Advanced focus-controlled drills.** Same trigger as above (DQ1); fires when the eyebrow has been firing for ≥3 sessions in a row for a given user without behavior change.
- **Persisted relaxation trace + debug surface.** Out of v1; ship together when a consumer materializes.

### Outside this product's identity

- Pre-run choice as a feature surface that competes with the recommendation. The recommendation-first promise stays intact; the eyebrow is honest signal, not a control.

---

## Key Decisions

- **KD1. Settings is the durable change surface; Tune today is the honesty signal.** Match between trigger evidence (Seb's verbatim "to better reflect my skill set" / "difficulty setting") and surface is direct under Settings. The eyebrow gives the catalog-relaxation honesty channel without spending a permanent Tune today row on it.
- **KD2. Onboarding skill level IS the runtime input.** No `SetupContext.skillLevelOverride?` field. The shim `skillLevelToDrillBand` already exists; the engine just needs to call it via the new `effectiveLevel(onboarding)` resolver. Eliminates the per-session field, the strip discipline, the asymmetric-vs-focus question, the `regenerateDraftFocus` extension, the `assemblyMeta`-shaped concerns, and the brainstorm's KD11 entirely.
- **KD3. Settings sub-route reuses `SkillLevelScreen` via shared `SkillLevelPicker` component.** Extract the 5-card body into a reusable component. The onboarding screen and the Settings sub-route render it with different headers and post-pick behaviors. Cost is one small refactor; the alternative (wrap or copy) is more code with worse drift risk.
- **KD4. Eyebrow renders only when `levelRelaxed: true`.** When the engine fully honored the user's saved level, no eyebrow. The user sees the validated 2026-05-04 one-row Tune today. Shibui-aligned.
- **KD5. Eyebrow taps Settings, doesn't open a modal.** Tapping the eyebrow navigates to `/settings` (or future `/settings/skill-level` if deep-linkable). The user changes their level in Settings, returns to Tune today via Back, and the active draft is preserved (R8). Modal-on-Tune-today would shoehorn a control onto the calm surface; the navigation away is deliberate.
- **KD6. `levelRelaxed` flag plumbing — plan picks the mechanism.** The flag must reach the controller for both initial build (SetupScreen.handleConfirm) and Tune today regeneration paths (focus-chip taps). Three options for the plan: (a) persist on `SessionDraft` as a UI-only hint (smallest; lives one cycle), (b) pass via router state on the SetupScreen → Tune today navigation and recompute on regeneration, (c) re-derive on Tune today mount via a cheap `buildDraft` predicate. Plan picks one; the requirements doc records the contract (eyebrow renders iff most-recent build relaxed level for ≥1 focus-controlled slot).
- **KD7. The build-time `levelRelaxed` flag is the only new return-shape change to the engine.** `buildDraft` returns `{ draft, levelRelaxed } | null` instead of `SessionDraft | null`. Same change the original brainstorm proposed under KD6/K6; survives the pivot intact.
- **KD8. `unsure → beginner` shim re-validated under the new contract; held.** The mapping in `app/src/lib/skillLevel.ts:103` was authored when the engine ignored level. This ship makes the engine read it. Three alternatives evaluated:
  1. Map `unsure` to "no level constraint." Rejected: the resolver always needs a concrete band.
  2. Force a one-time explicit pick on first Tune today visit for `unsure` users. Rejected: adds friction for the user least likely to know the answer.
  3. Keep `unsure → beginner` (selected). The Settings affordance is the escape hatch; the eyebrow surfaces when the catalog can't honor a non-Beginner alternative.

  Add a JSDoc note to `app/src/lib/skillLevel.ts` documenting the post-engine-wiring re-validation.
- **KD9. No persisted relaxation trace beyond R13.** No `assemblyMeta` extension, no per-block trace on `SessionPlan`, no diagnostic field. If a v2 consumer materializes (debug surface, founder-tooling), author it then. The brainstorm's original KD10 stance survives the pivot.

---

## Dependencies / Assumptions

- The active app uses the focus-picker pattern landed by `docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md`. The shared focus resolver (`effectiveFocus.ts`) and Tune today controller (`useTuneTodayController.ts`) are the structural anchors; this ship adds a sibling resolver and wires onboarding through `buildDraft` callers but does not modify the focus-picker behavior.
- `D135` remains the authority for treating both the focus-picker trigger and the skill-level mutability sibling trigger as fired.
- `app/src/lib/skillLevel.ts::skillLevelToDrillBand` remains the canonical 5-tier-to-3-tier shim. KD8 re-validates the `unsure → beginner` row only.
- `D121` remains the authority for the 5-tier onboarding taxonomy. This ship uses the 5-tier vocabulary directly in Settings and never exposes the 3-tier engine band to users.
- `storageMeta.onboarding.skillLevel` reads return the persisted value from the existing v4 schema. This ship adds no schema migration.
- `app/src/screens/SettingsScreen.tsx` exists as a runnable Settings surface; this ship adds one section to it without restructuring the existing Export / About local storage layout.
- Catalog reality (assumption made explicit by ce-doc-review): the M001-active catalog has 26 drills with `levelMin: 'beginner'`, 8 with `levelMin: 'intermediate'`, and 0 with `levelMin: 'advanced'`. Only 3 drills have `levelMax: 'advanced'` and all are warmup/wrap. The eyebrow is therefore expected to fire reliably for any user on `competitive_pair → advanced`; KD4 commits to surfacing this honestly rather than silencing it.

---

## Outstanding Questions

### Resolve Before Planning

- None.

### Deferred to Planning

- **DQ1. Per-session calibration v2 trigger condition.** Per KD1, this ship defers any per-session chip surface. Pin the trigger conditions for a future ship: how many founder-ledger rows, what partner-walkthrough hit shape, what eyebrow-firing reading would justify adding the chip on top of the engine wiring. Default candidate (subject to refinement during planning): "≥2 founder-ledger rows in a 14-day window naming an explicit 'today should be different than my durable level' friction (not a 'my durable level is wrong' friction — that's a Settings discoverability problem, not a per-session signal), OR ≥1 partner-walkthrough P1 hit asking for per-session level steering." This DQ also doubles as the catalog-authoring trigger for filling the Advanced focus-controlled gap: if the eyebrow fires ≥3 sessions in a row for the same user without behavior change, that's the trigger to author Advanced content under the Tier 1b cap.
- **DQ2. Final copy strings.** Pin during planning under `.cursor/rules/courtside-copy.mdc`:
  - R3's sub-route heading: solo `Update your level`, pair `Update your shared level` (default candidates).
  - R9's eyebrow: `Today's session is calibrated to your saved level — adjust in Settings.` (default candidate). Should it name the band? Default: no — naming `Beginner` or `Intermediate` exposes the engine vocabulary the brainstorm deliberately keeps internal. Keep the eyebrow vocabulary-neutral.
  - R2's Settings section heading: `Skill level` (default candidate).
  - R2's Settings section secondary text (showing the current band): `Your level: {SKILL_LEVEL_LABEL[onboarding.skillLevel]}.` (default candidate).

---

## Next Steps

→ `/ce-plan` for structured implementation planning of the Settings + relaxation eyebrow shape, using the engine-wiring units from the original 2026-05-04-001 plan as inheritance and replacing the original Tracks 2+3 with the smaller Settings sub-route + eyebrow units.

---

## For Agents

- **Authoritative for**: requirements handoff for the skill-level mutability surface (Settings durable change + Tune today relaxation eyebrow), engine wiring contract, candidate-pool preference and fallback rule with build-time relaxation flag, Settings reuse of `SkillLevelScreen` via shared `SkillLevelPicker` component, eyebrow-as-honesty-channel pattern.
- **Edit when**: a future trigger fires for per-session calibration; a partner or founder session surfaces a friction not captured here; the catalog authoring track from DQ1 fires.
- **Belongs elsewhere**: implementation routing (the future plan in `docs/plans/`); copy strings (final pin during planning under `.cursor/rules/courtside-copy.mdc`); D135 trigger conditions (`docs/plans/2026-04-20-m001-tier1-implementation.md`); cap state (`docs/plans/2026-04-20-m001-adversarial-memo.md`); ce-doc-review findings audit trail (this iteration log header).
- **Outranked by**: `docs/decisions.md`; `docs/vision.md` principles; `docs/brainstorms/2026-04-29-session-focus-picker-requirements.md` for any architectural decision the focus picker established and this doc inherits without re-litigating.
