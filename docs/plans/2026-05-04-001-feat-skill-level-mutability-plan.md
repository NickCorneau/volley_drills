---
id: skill-level-mutability-2026-05-04
title: "feat: Skill-level mutability (engine wiring + Settings durable change)"
type: feat
status: complete
stage: validation
date: 2026-05-04
authority: "Completed implementation plan for the D135-fired skill-level mutability surface. Current after D137: Settings/onboarding skill-level persistence and engine level filtering remain current; Tune today, regenerateDraftFocus, and SessionDraft.levelRelaxed tracks are superseded."
summary: "Completed registry for the 2026-05-04 skill-level mutability work: effectiveLevel/partitionByLevel engine wiring, Settings skill-level override at /settings/skill-level, shared SkillLevelPicker extraction, and unsure-shim re-validation. PARTIALLY SUPERSEDED 2026-05-06 by D137: Tune today eyebrow, regenerateDraftFocus, and SessionDraft.levelRelaxed are deleted; current pre-run shape is Setup -> Safety with focus inline on Setup."
last_updated: 2026-05-06
related:
  - docs/brainstorms/2026-05-04-skill-level-mutability-requirements.md
  - docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md
  - docs/brainstorms/2026-04-29-session-focus-picker-requirements.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/japanese-inspired-visual-direction.md
decision_refs:
  - D91
  - D121
  - D130
  - D131
  - D135
  - D137
---

# Skill-level mutability

## Iteration log

**2026-05-06 D137 supersession note.** This plan remains a completed registry for the 2026-05-04 skill-level mutability work, but its Tune today eyebrow, `regenerateDraftFocus`, and `SessionDraft.levelRelaxed` tracks are superseded by `docs/plans/2026-05-06-001-refactor-d137-tune-today-routing-cleanup-plan.md`. The surviving current behavior is the Settings override at `/settings/skill-level` plus onboarding skill-level persistence; no Tune today route or relax-signal UI remains.

**2026-05-04 v1** — original plan: Tune today second-row chip + per-session `skillLevelOverride` field + asymmetric strip + R36 inline note + `ToggleChip` disabled prop + dual-radiogroup keyboard contract + pair/solo group label structural branching + 9 implementation units / 14 KDs / 3 DQs.

**2026-05-04 v2** — `ce-doc-review` plan-review pass surfaced critical findings: Phase 1 doesn't compile (cross-doc), `buildDraft` blast radius wider than enumerated (HomeScreen.handleRepeat, session.v0b.test.ts 7 sites, SafetyCheckScreen.test.tsx, TuneTodayScreen.test.tsx), `findSwapAlternatives` onboarding wire-through unspecified, R22 roving tabindex unimplemented in `ToggleChip`, R36 initial-mount gap, multiple cross-references broken (K7 → brainstorm DQ1 renumbered, R31 ID collision, KD1+DQ1 ambiguity).

**2026-05-04 v3 (this revision) — pivot to Settings + Tune today relaxation eyebrow.** User asked: "could this just be hidden in Settings since skill level doesn't change too often?" Both `ce-product-lens-reviewer` and `ce-design-lens-reviewer` evaluated and converged on the pivot. The brainstorm was rewritten to match (`docs/brainstorms/2026-05-04-skill-level-mutability-requirements.md` v3 iteration log). This plan is rewritten to match.

What survives from v1/v2: Track 1 engine wiring intact — `effectiveLevel` resolver, `partitionByLevel` primitive, two-pass wiring across `pickForSlot` / `pickMainSkillSubstitute` / `findSwapAlternatives`, `buildDraft` returning `{ draft, levelRelaxed } | null`, the `unsure → beginner` shim re-validation note. The R22 roving-tabindex blocker disappears (no chip row). The asymmetric-strip discipline disappears (no per-session field). The `ToggleChip` disabled prop disappears (not needed). The pair/solo group-label branching disappears (no group label). The `regenerateDraftFocus` extension disappears (no per-session level field for it to accept).

Net: 9 implementation units, 11 KDs, 1 DQ. Several units are smaller than v1's; the "Settings sub-route" and "eyebrow render" units are mechanical (reuse + render).

---

## Overview

Bundles three coupled tracks in one PR:

- **Track 1 — Engine wiring.** Author a pure shared resolver `effectiveLevel(onboarding)` that reads `storageMeta.onboarding.skillLevel` via the existing `skillLevelToDrillBand` shim. Author a `partitionByLevel(candidates, effectiveLevel)` primitive. Wire `pickForSlot`, `pickMainSkillSubstitute`, and `findSwapAlternatives` through a two-pool preference: in-band first (`focus ∩ level`), focus-only on empty (level relaxed) for focus-controlled slots only. Track relaxation via a build-time `levelRelaxed` boolean on `buildDraft`'s return.
- **Track 2 — Settings durable change.** Extract the 5-card body of `SkillLevelScreen` into a new shared `SkillLevelPicker` component. Refactor `SkillLevelScreen` to use it. Add a `Skill level` section to `SettingsScreen` showing the user's current skill level + a `Change` affordance that opens a new sub-route `/settings/skill-level`. The sub-route renders `SkillLevelPicker` with a heading swap and a back affordance; picking writes `storageMeta.onboarding.skillLevel` via `setStorageMetaMany` and navigates back to Settings. Onboarding's first-run `SkillLevelScreen` is unchanged in behavior.
- **Track 3 — Tune today relaxation eyebrow + JSDoc note.** When the active draft was built with `levelRelaxed: true`, Tune today renders a single inline eyebrow line above the Continue button — tappable to Settings. Plumb the `levelRelaxed` flag from `buildDraft` to the controller (default candidate per K6: persist on `SessionDraft` as a UI-only hint, not exposed in domain logic). Add a JSDoc note to `app/src/lib/skillLevel.ts` documenting that the `unsure → beginner` shim was reconsidered post-engine-wiring.

The three tracks ship together because they are tightly coupled: Track 2's Settings change is meaningful only with Track 1's engine wiring; Track 3's eyebrow is meaningful only when Track 1 produces the `levelRelaxed` flag and Track 2 provides a destination for the eyebrow tap.

This plan does NOT ship: a `SetupContext.skillLevelOverride?` field; a Tune today Level chip row; a per-session calibration UI; a `ToggleChip` `disabled` prop; a dual-radiogroup keyboard contract; a pair/solo group-label structural branch; an asymmetric strip discipline; a `regenerateDraftFocus` extension; new drill authoring (Tier 1b cap unconsumed); a swap-screen Level control; a persisted relaxation trace beyond the UI-only hint; a Dexie schema migration; telemetry.

---

## Problem Frame

`D135` fired the skill-level-mutability sibling trigger via partner-walkthrough OR clause (Seb's 2026-04-27 cca2 + 2026-04-28 build-17 voice memos). The verbatim language reads as identity correction: "to better reflect my skill set" + "the option to choose a new difficulty setting." Today, `onboarding.skillLevel` is captured once at first-open and persisted in `storageMeta`; there is no surface to change it without re-doing onboarding. Worse, the assembly engine **does not read skill level at all** — even the onboarding answer is silently ignored. This ship wires the engine for the first time and adds the Settings affordance for durable change. Tune today gains a single conditional eyebrow that surfaces engine relaxation honestly.

The 2026-05-04 founder + Seb pair-serving session validated Tune today's focus picker reads cleanly as a one-row calm confirmation step. This pivot preserves that — Tune today stays one row in the common case.

Per the requirements brainstorm v3 (`docs/brainstorms/2026-05-04-skill-level-mutability-requirements.md`), the trigger evidence has two readings (per-session calibration vs identity correction). This ship targets the identity-correction reading; per-session calibration is deferred under the named v2 trigger in DQ1.

---

## Requirements Trace

### Track 1 — Engine wiring

- **R1.** A pure shared resolver `effectiveLevel(onboarding)` is the single source of truth for runtime skill level.
- **R12.** Engine reads `skillLevelToDrillBand(onboarding.skillLevel) ?? 'beginner'`. Missing/malformed/`unsure` → `beginner` (KD8).
- **R14.** Two-pool consumer preference: `focus ∩ level` first; on empty for focus-controlled slot, retry `focus only` (level relaxed); else "no candidate" (existing path).
- **R15.** `buildDraft` returns `{ draft, levelRelaxed } | null` instead of `SessionDraft | null`. The flag is `true` if any focus-controlled slot in the build retried via the level-relax pool. Not persisted in domain shape (R22 — UI-only hint per K6).
- **R16.** Onboarding skill level is read inside the build path, not snapshotted on `SetupContext`. Every `buildDraft` call reads `storageMeta.onboarding.skillLevel` via `getStorageMeta(...)` (or the caller passes the value through, decided in K6 per K9).
- **R17.** `effectiveLevel` lives under `app/src/domain/sessionAssembly/` alongside `effectiveFocus.ts`.
- **R18.** No `SetupContext` field is added.

### Track 2 — Settings durable change

- **R2.** `SettingsScreen` gains a new section between the Export card and the About local storage section, titled `Skill level`.
- **R3.** Tapping `Change` in the new section navigates to `/settings/skill-level`.
- **R4.** The sub-route renders `SkillLevelPicker` (the new shared component extracted in U5) with a heading swap (default candidate `Update your level` solo / `Update your shared level` pair) and a back affordance.
- **R5.** Picking a level writes `storageMeta.onboarding.skillLevel` via `setStorageMetaMany({ 'onboarding.skillLevel': level })` and navigates back to Settings. `'onboarding.step'` is NOT mutated.
- **R6.** The sub-route is reachable from Settings only. `FirstOpenGate` continues to route fresh-install testers to `/onboarding/skill-level` per the existing C-3 Unit 1 contract.
- **R7.** The Settings affordance never shows the engine-band (`Beginner` / `Intermediate` / `Advanced`) translation. The user reads and writes in the 5-tier `SkillLevel` vocabulary.
- **R8.** Pair/solo voice handling on the sub-route inherits from the existing `voiceFromContext` discipline.
- **R9.** A Settings change does NOT mutate any in-flight `SessionDraft.context`. The active draft (if any) keeps its original assembly. The next build reads the new level.
- **R19.** Settings sub-route does not import Dexie/db directly. Uses `setStorageMetaMany` from `services/storageMeta.ts`.
- **R21.** Onboarding flow (`SkillLevelScreen`) is unchanged in user-visible behavior. Settings sub-route reuses the same UI primitives via the shared `SkillLevelPicker` component (no UI duplication).

### Track 3 — Tune today relaxation eyebrow + JSDoc note

- **R10.** When the active draft's most recent `buildDraft` call returned `levelRelaxed: true`, Tune today renders one inline eyebrow line above Continue. Default copy candidate: `Today's session is calibrated to your saved level — adjust in Settings.` Final copy pinned in U7.
- **R11.** The eyebrow is tappable. Tapping navigates to `routes.settings()`. The active draft is preserved.
- **R13.** The eyebrow is announced to assistive tech via the existing `aria-live="polite"` region on Tune today.
- **R20.** No swap-screen Level control. Level is a Settings concern.
- **R22.** No persisted relaxation trace beyond the UI-only hint specified by K6. The flag exists for the duration of the controller render of the active draft; not written to `SessionPlan`.
- **R23.** `app/src/lib/skillLevel.ts` gains a JSDoc note documenting the `unsure → beginner` shim was reconsidered post-engine-wiring (KD8).

### Cross-track

- **R24.** `bash scripts/validate-agent-docs.sh` passes after this plan and its companion edits land.

**Origin actors (from brainstorm):** A1 (calibrated returning player), A2 (pair partner), A3 (unsure / wrong-onboarding user — first-class served), A4 (future implementation agent).

**Origin flows:** F1 (default flow no relaxation), F2 (Settings durable change), F3 (Tune today relaxation eyebrow), F4 (Repeat/Recovery — no strip needed because no per-session field).

**Origin acceptance examples:** AE1 (default render no eyebrow), AE2 (Settings section render), AE3 (sub-route pick + write + return), AE4 (Tune today eyebrow renders + tap → Settings), AE5 (pair-mode voice on sub-route), AE6 (catalog gap relaxation), AE7 (`unsure` → Beginner default), AE8 (Settings change does not mutate in-flight draft), AE9 (no swap-screen Level control), AE10 (FirstOpenGate routes fresh installs to onboarding, not Settings sub-route).

---

## Scope Boundaries

- No `SetupContext.skillLevelOverride?` field. Onboarding skill level IS the runtime input.
- No Tune today Level chip row. Tune today gains a single conditional 1-line eyebrow only.
- No per-session calibration chip. Out of scope; named v2 trigger in DQ1.
- No `ToggleChip` `disabled` prop addition (not needed without a chip row).
- No dual-radiogroup keyboard contract (not needed).
- No pair/solo group-label structural branching on Tune today (not needed).
- No `regenerateDraftFocus` extension to accept a per-session level field (not needed).
- No asymmetric strip discipline in `buildDraftFromCompletedBlocks` / `buildRecoveryDraft` (no per-session field to strip).
- No 5-tier `SkillLevel` exposure on Tune today. The eyebrow is taxonomy-agnostic. Settings uses 5-tier names.
- No "auto-suggested level" from session history. Onboarding is the only input.
- No hard level filter (R14 fallback always allows the build).
- No persisted relaxation trace beyond the UI-only hint specified by K6.
- No Dexie schema migration. K6's UI-only hint is type-only on `SessionDraft`; legacy persisted records are silently `undefined` on read.
- No telemetry, profile mutation beyond Settings change, or `D131` change.
- No new drill authoring. Catalog gap for Advanced focus-controlled drills is recognized; the eyebrow makes it honest. Catalog authoring is a separate trigger (DQ1).
- No swap-screen Level control.
- No `M001` cap consumption — ships under the existing `D135` Tier 1c-sibling trigger.

### Deferred for later

- **Per-session calibration chip** on Tune today. Out of scope; named v2 trigger in DQ1.
- **Catalog authoring of Advanced focus-controlled drills.** Same trigger as above.
- **Persisted relaxation trace + debug surface.** Out of v1; ship when a consumer materializes.

### Outside this product's identity

- Per-session calibration as a feature surface that competes with the recommendation. The recommendation-first promise stays intact; the eyebrow is honest signal, not a control.

---

## Context & Research

### Architectural anchors

The focus-picker ship (`docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md`) established three patterns this plan extends:

1. **Pure shared resolver** under `app/src/domain/sessionAssembly/` (`effectiveFocus.ts`). `effectiveLevel.ts` is its sibling.
2. **Tune today controller pattern** at `app/src/screens/tuneToday/useTuneTodayController.ts`. Extended (U7) to read `levelRelaxed` from the active draft's UI-only hint and expose it for the eyebrow render.
3. `**SkillLevelScreen` first-open pattern** at `app/src/screens/SkillLevelScreen.tsx`. Refactored (U5) so its 5-card body lives in a shared `SkillLevelPicker` that the new Settings sub-route also consumes.

### Catalog reality (load-bearing)

Inspection of `app/src/data/drills.ts`:

- 26 drills `levelMin: 'beginner'`, 8 drills `levelMin: 'intermediate'`, **0 drills `levelMin: 'advanced'`**.
- 3 drills with `levelMax: 'advanced'`: `d25`, `d26`, `d28` — all warmup/wrap.
- **Zero drills have `levelMax: 'advanced' && skillFocus: ['pass' | 'serve' | 'set']`.**

Consequence under R14: any user on `advanced` band (mapping from onboarding `'competitive_pair'`) triggers the level-relax fallback on every focus-controlled slot. The eyebrow renders. This is expected v1 behavior — covered honestly by the eyebrow rather than silenced.

### Relevant code and patterns

- `app/src/types/session.ts` — UNCHANGED (R18: no SetupContext field).
- `app/src/lib/skillLevel.ts` — Track 3 (R23 JSDoc note).
- `app/src/domain/sessionAssembly/effectiveFocus.ts` — pattern reference.
- `app/src/domain/sessionAssembly/candidates.ts` — Track 1 (`pickForSlot` two-pass).
- `app/src/domain/sessionAssembly/substitution.ts` — Track 1 (`pickMainSkillSubstitute` two-pass).
- `app/src/domain/sessionAssembly/swapAlternatives.ts` — Track 1 (level ordering inside `computeAlternatives`).
- `app/src/domain/sessionBuilder.ts` — Track 1 (`buildDraft` returns `{ draft, levelRelaxed }`); reads onboarding inside the build path per K9.
- `app/src/services/session/regenerateDraftFocus.ts` — Track 1 (consume new return shape; thread `levelRelaxed` through to controller via the UI-only hint per K6).
- `app/src/screens/SetupScreen.tsx` — Track 1 (consume new return shape; thread `levelRelaxed` to draft via K6).
- `app/src/screens/HomeScreen.tsx` — Track 1 (`handleRepeat` consumes new return shape).
- `app/src/screens/SafetyCheckScreen.tsx` — Track 1 (consumes new return shape via `buildRecoveryDraft` if applicable; otherwise unchanged).
- `app/src/screens/SkillLevelScreen.tsx` — Track 2 (refactor to consume `SkillLevelPicker`).
- `app/src/components/onboarding/SkillLevelPicker.tsx` — Track 2 NEW (extracted from `SkillLevelScreen`).
- `app/src/screens/SettingsScreen.tsx` — Track 2 (add `Skill level` section).
- `app/src/screens/SettingsSkillLevelScreen.tsx` — Track 2 NEW (Settings sub-route).
- `app/src/screens/TuneTodayScreen.tsx` — Track 3 (render eyebrow when `levelRelaxed`).
- `app/src/screens/tuneToday/useTuneTodayController.ts` — Track 3 (expose `levelRelaxed` from return shape).
- `app/src/routes.ts`, `app/src/App.tsx` — Track 2 (register `/settings/skill-level`).
- `app/src/contracts/screenContracts.ts` — Track 2 (P12 entry for `SettingsSkillLevelScreen`).
- `app/src/db/types.ts` (re-export hub) — possibly Track 1 if `SessionDraft` shape gains the UI-only hint per K6 (TBD during U4).

### Test scope per layer (proof-tier policy from `.cursor/rules/testing.mdc`)

- **Domain:** `effectiveLevel` resolver; `partitionByLevel` primitive; `pickForSlot` / `pickMainSkillSubstitute` / `findSwapAlternatives` two-pool behavior; `buildDraft` returning `levelRelaxed: true/false` correctly; the existing `buildDraftFromCompletedBlocks` / `buildRecoveryDraft` continue to round-trip cleanly without strip work (regression).
- **Services:** `regenerateDraftFocus` consumes the new return shape; `levelRelaxed` propagates correctly; existing transaction boundary unchanged.
- **Controllers:** `useTuneTodayController` exposes `levelRelaxed` from active draft; correctly reads the UI-only hint.
- **Components:** `SkillLevelPicker` renders 5 cards with appropriate copy (one render-test per component-tier convention); `Settings` skill-level section renders with correct current-level label.
- **Screen integration:** `TuneTodayScreen` eyebrow renders iff `levelRelaxed: true` and is tappable; `SettingsScreen` skill-level section renders + Change navigates to sub-route; `SettingsSkillLevelScreen` pick + write + back navigation.
- **E2E:** None new. The Settings → sub-route → write → return flow can be covered if desired but is not required (component + integration tier coverage is sufficient).

### Institutional learnings

- The 2026-04-30 pre-run-simplification ship's K-ID inheritance discipline keeps architectural rigor portable across sibling features. Apply the same shape here.
- The 2026-04-26 architecture pass codified screens-thin / domain-fat layering and the P12 screen-contract registry; preserved.
- The 2026-04-22 partner-walkthrough polish kept courtside surfaces calm and tap-first; preserved (and the 2026-05-04 v3 pivot doubles down — Tune today stays one row in the common case).

### External references

External research already consumed in upstream brainstorm work covered focus / picker patterns, NN/g recommender UX, WCAG 2.2 target sizing, and ACSM/EIM readiness scope. No new external research warranted.

---

## Key Technical Decisions

- **K1. `effectiveLevel(onboarding) → PlayerLevel` is a pure module under `app/src/domain/sessionAssembly/`.** Mirrors `effectiveFocus.ts`. Returns `skillLevelToDrillBand(onboarding) ?? 'beginner'`. Accepts `onboarding: unknown` and runs through `isSkillLevel` internally so consumers don't need a separate validation pass. *Rationale:* one resolver, three consumers, exactly the discipline the focus picker established for `effectiveSkillTags`.
- **K2. Two-pool primitive `partitionByLevel(candidates, effectiveLevel)`.** Returns `{ inBand: Candidate[], outOfBand: Candidate[] }`. Each consumer composes the same primitive without duplicating the band-overlap predicate. Note: only `findSwapAlternatives` uses both halves; `pickForSlot` and `pickMainSkillSubstitute` use `inBand` for the first pass and the full pool for the second pass. The shape is justified by ord-map centralization (`beginner=0, intermediate=1, advanced=2`) more than by both-halves consumption.
- **K3. `pickForSlot` runs the existing slot-type-specific selector twice** for focus-controlled slots (`main_skill`, `pressure`). First pass: `inBand` pool. Second pass: full pool (level relaxed). On second-pass success, return `{ pick, levelRelaxed: true }`. For `warmup`, `technique`, `movement_proxy`, `wrap` — apply the level filter optionally (in-band preferred) but treat out-of-band fallback as silent (no `levelRelaxed: true`). *Rationale:* the eyebrow is about user-visible promise; warmup/wrap content does not carry that promise.
- **K4. `pickMainSkillSubstitute` runs `findSubstitute` twice with two pools.** Inner-pass relaxation surfaces the same `levelRelaxed: true` signal (substitute path is on `main_skill`, focus-controlled).
- **K5. `findSwapAlternatives` adds level as ordering, not filter.** Swap returns ordered alternatives; level relaxation in the swap pool is "in-band first, then out-of-band" (re-sorting), not "filter then fall back." The existing focus-relax wrapper at lines 47–61 stays as the outermost tier. The full chain becomes `[in-band-focus, out-of-band-focus, focus-stripped]`. **Insertion point:** apply the level partition LAST in `computeAlternatives` (after preferred-progression / substitute promotion at lines 106–127), so promotion wins ties and level breaks unrelated drills. R15 does not fire from Swap (it is a build-time signal, not a user-action signal).
- **K6. `buildDraft` returns `{ draft, levelRelaxed }` instead of `SessionDraft | null`.** The boolean is `true` if any focus-controlled slot in the build retried via the level-relax pool. Build failure (no candidate even after relaxation) returns `null` (preserves current contract). **Plumbing to controller:** persist `levelRelaxed?: boolean` on `SessionDraft` as a UI-only hint (NOT in `SetupContext`, NOT in `SessionPlan`, NOT in domain logic — a top-level optional field on the draft object only). Set it on every successful build. The Tune today controller reads it from the active draft and renders the eyebrow per R10. *Rationale:* simplest mechanism; survives router state loss; reflects the current draft's relaxation accurately whether built initially or regenerated; legacy drafts without the field read as `undefined` (no eyebrow).
- **K7. No `regenerateDraftFocus` extension for level.** The use case continues to accept `sessionFocus?` only. After the build, the new return shape's `levelRelaxed` is propagated through to the saved draft per K6. The early-return short-circuit at `regenerateDraftFocus.ts:57` is unchanged.
- **K8. `unsure → beginner` mapping unchanged; add JSDoc note.** Three alternatives evaluated and rejected (per brainstorm KD8). Keep the v0b shim. Add a comment block in `app/src/lib/skillLevel.ts` so a future agent reading the file sees the choice was reconsidered.
- **K9. Onboarding read site: at `buildDraft` entry.** `buildDraft` reads `getStorageMeta('onboarding.skillLevel', isSkillLevel)` itself (or accepts `onboarding?` as an optional `BuildDraftOptions` field, with the caller responsible for passing it). Default during planning: pass `onboarding` through `BuildDraftOptions` so `buildDraft` stays pure synchronous (matches existing `lastCompletedByType` pattern). Callers (`SetupScreen.handleConfirm`, `regenerateDraftFocus`, `HomeScreen.handleRepeat`) read onboarding before calling `buildDraft` and pass it through.
- **K10. `SkillLevelPicker` is a shared component under `app/src/components/onboarding/`.** Extracted from `SkillLevelScreen.tsx`'s body (the `<ul>` of 5 cards including the `'unsure'` card). Props: `voice` (already an enum), `headingCopy` (string — the wrapper picks per pair/solo), `subheadingCopy` (string), `onPick: (level: SkillLevel) => Promise<void>`. The wrapper screens (`SkillLevelScreen` for onboarding; `SettingsSkillLevelScreen` for Settings sub-route) handle voice loading, pick callback, and surrounding chrome.
- **K11. `SettingsSkillLevelScreen` is a new screen at `/settings/skill-level`.** Loads the current `onboarding.skillLevel` for display (informational; the picker doesn't pre-select to avoid implying the current value is "wrong"). On pick, writes `setStorageMetaMany({ 'onboarding.skillLevel': level })`, then `navigate(routes.settings())`. Back affordance returns to Settings without writing.

---

## Open Questions

### Resolved during planning

- **Q1.** Surface placement (chip row vs Settings vs hybrid)? Resolved: Settings + Tune today eyebrow (per ce-product-lens + ce-design-lens reviewers and user direction).
- **Q2.** `SetupContext.skillLevelOverride?` field? Resolved: NOT added (R18). Onboarding IS the runtime input.
- **Q3.** `regenerateDraftFocus` rename or extend? Resolved: neither. Use case unchanged (K7).
- **Q4.** `levelRelaxed` plumbing mechanism? Resolved: persist as UI-only hint on `SessionDraft` (K6).
- **Q5.** `buildDraft` onboarding read site? Resolved: caller passes through `BuildDraftOptions` (K9).
- **Q6.** Two-pool primitive vs inline filter? Resolved: shared `partitionByLevel` (K2).
- **Q7.** `SkillLevelScreen` reuse for Settings sub-route? Resolved: extract `SkillLevelPicker` shared component (K10).
- **Q8.** Settings sub-route pre-selects current level? Resolved: NO (informational display in Settings section; picker does not pre-select). Default per K11; revisit if user feedback flags lack of pre-selection as confusing.
- **Q9.** Repeat/Recovery strip discipline? Resolved: not applicable (no per-session field). `buildDraftFromCompletedBlocks` and `buildRecoveryDraft` are untouched.
- **Q10.** R22 roving tabindex? Resolved: not applicable (no chip row). `ToggleChip` is untouched.
- **Q11.** Pair/solo group-label structural branching? Resolved: not applicable on Tune today (no Level group label). Settings sub-route inherits voice from `voiceFromContext` per existing `SkillLevelScreen` pattern.
- **Q12.** `unsure` shim re-validation? Resolved: keep `unsure → beginner`; JSDoc note (K8 / R23).

### Deferred to implementation

- **DQ1. Final copy strings.** Pin during planning under `.cursor/rules/courtside-copy.mdc`:
  - R10 eyebrow: `Today's session is calibrated to your saved level — adjust in Settings.` (default candidate). Should it name the band? Default: no — keep vocabulary-neutral so it doesn't expose the engine band the brainstorm deliberately keeps internal.
  - R2 Settings section: heading `Skill level`, body `Your level: {SKILL_LEVEL_LABEL[onboarding.skillLevel]}.` (default candidates).
  - R4 sub-route heading: solo `Update your level`, pair `Update your shared level` (default candidates).
  - R4 sub-route subheading: `Same descriptors as onboarding; pick the band that fits your current level.` (default candidate).

### Deferred to future iteration

- **Per-session calibration chip on Tune today.** Out of scope per KD1 of brainstorm. Named v2 trigger: ≥2 founder-ledger rows in a 14-day window naming an explicit "today should be different than my durable level" friction (NOT a "my durable level is wrong" friction — that's a Settings discoverability problem, not a per-session signal), OR ≥1 partner-walkthrough P1 hit asking for per-session level steering.
- **Catalog authoring of Advanced focus-controlled drills.** Same v2 trigger as above; fires when the eyebrow has been firing for ≥3 sessions in a row for the same user without behavior change.
- **Persisted relaxation trace + debug surface.** Out of v1; ship when a consumer materializes.

---

## Output Structure

```
app/src/
  contracts/
    screenContracts.ts                          # MODIFY — add settingsSkillLevel P12 entry
  components/
    onboarding/
      SkillLevelPicker.tsx                      # NEW — extracted from SkillLevelScreen body
      __tests__/
        SkillLevelPicker.test.tsx               # NEW — render contract for the 5-card body
  domain/
    sessionAssembly/
      effectiveLevel.ts                         # NEW — pure resolver
      partitionByLevel.ts                       # NEW — two-pool primitive
      candidates.ts                             # MODIFY — pickForSlot two-pass for focus-controlled slots
      substitution.ts                           # MODIFY — pickMainSkillSubstitute two-pass
      swapAlternatives.ts                       # MODIFY — level partition inside computeAlternatives (last)
      __tests__/
        effectiveLevel.test.ts                  # NEW
        partitionByLevel.test.ts                # NEW
    sessionBuilder.ts                           # MODIFY — buildDraft accepts onboarding via BuildDraftOptions; returns { draft, levelRelaxed } | null
    sessionBuilder.test.ts                      # MODIFY — new return shape + levelRelaxed scenarios
    __tests__/
      drillSelection.test.ts                    # MODIFY — level scenarios
      findSwapAlternatives.test.ts              # MODIFY — level-ordering scenarios
  services/
    session/
      regenerateDraftFocus.ts                   # MODIFY — consume new return shape; persist levelRelaxed via K6 UI-only hint
      __tests__/
        regenerateDraftFocus.test.ts            # MODIFY — new return shape; levelRelaxed propagation
    __tests__/
      session.v0b.test.ts                       # MODIFY — 7 buildDraft callsites unwrap new return shape
  routes.ts                                     # MODIFY — add settingsSkillLevel: () => '/settings/skill-level'
  App.tsx                                       # MODIFY — register the route
  screens/
    SettingsScreen.tsx                          # MODIFY — add Skill level section between Export card and About local storage
    SettingsSkillLevelScreen.tsx                # NEW — Settings sub-route
    SkillLevelScreen.tsx                        # MODIFY — refactor to consume SkillLevelPicker (no behavior change)
    SetupScreen.tsx                             # MODIFY — read onboarding; pass through BuildDraftOptions; consume new return shape; persist levelRelaxed via K6
    HomeScreen.tsx                              # MODIFY — handleRepeat consumes new return shape; passes onboarding through
    TuneTodayScreen.tsx                         # MODIFY — render eyebrow when levelRelaxed
    tuneToday/
      useTuneTodayController.ts                 # MODIFY — expose levelRelaxed from active draft
      __tests__/
        useTuneTodayController.test.tsx         # MODIFY — eyebrow plumbing (or NEW if missing)
    __tests__/
      SettingsScreen.test.tsx                   # MODIFY — Skill level section render + Change navigation
      SettingsSkillLevelScreen.test.tsx         # NEW — pick + write + back navigation
      SkillLevelScreen.test.tsx                 # MODIFY — confirms refactor preserves behavior
      SetupScreen.test.tsx                      # MODIFY — onboarding read + new return shape unwrap
      TuneTodayScreen.test.tsx                  # MODIFY — eyebrow render contract (and existing 2 buildDraft callsites unwrap)
      HomeScreen.repeat-ended-early.test.tsx    # MODIFY — handleRepeat unwrap
      SafetyCheckScreen.test.tsx                # MODIFY — buildDraft callsite unwrap
  lib/
    skillLevel.ts                               # MODIFY — KD8/R23 JSDoc note (no behavior change)
  test-utils/
    persistedRecords.ts                         # MODIFY — fixture factory may need levelRelaxed defaulting (per K6)
docs/
  brainstorms/
    2026-05-04-skill-level-mutability-requirements.md  # UNCHANGED (origin; v3 already authored)
  catalog.json                                  # MODIFY (U9) — register this plan + brainstorm
  status/current-state.md                       # MODIFY (U9) — recent shipped history line after implementation lands
```

---

## Implementation Units

- **U1. Track 1 part A — `effectiveLevel` resolver + `partitionByLevel` primitive.**

**Goal:** Land the pure shared resolver and two-pool primitive consumers will compose.

**Requirements:** R1, R12, R17; K1, K2.

**Dependencies:** None.

**Files:**

- Create: `app/src/domain/sessionAssembly/effectiveLevel.ts`.
- Create: `app/src/domain/sessionAssembly/partitionByLevel.ts`.
- Create: `app/src/domain/sessionAssembly/__tests__/effectiveLevel.test.ts`.
- Create: `app/src/domain/sessionAssembly/__tests__/partitionByLevel.test.ts`.

**Approach:**

- `effectiveLevel(onboarding: unknown): PlayerLevel`: returns `isSkillLevel(onboarding) ? skillLevelToDrillBand(onboarding) : 'beginner'`. Imports `skillLevelToDrillBand` and `isSkillLevel` from `app/src/lib/skillLevel.ts`.
- `partitionByLevel(candidates, effectiveLevel)`: returns `{ inBand: Candidate[], outOfBand: Candidate[] }`. Band-overlap predicate: `drill.levelMin <= effectiveLevel <= drill.levelMax` using ordinal map `beginner=0, intermediate=1, advanced=2`.

**Patterns to follow:** `effectiveFocus.ts` (14 lines, pure, one consumer-facing function).

**Test scenarios:**

- `effectiveLevel`: each of the 5 SkillLevel values maps correctly (foundations→beginner, rally_builders→intermediate, side_out_builders→intermediate, competitive_pair→advanced, unsure→beginner); `undefined` / unknown / non-string input returns `beginner`.
- `partitionByLevel`: drill `[beginner, intermediate]` is in-band for `beginner` and `intermediate`, out-of-band for `advanced`; drill `[intermediate, intermediate]` is in-band for `intermediate` only; empty candidates return empty partitions.

**Verification:** `npm --prefix app run typecheck && npm --prefix app run test -- effectiveLevel partitionByLevel` green.

---

- **U2. Track 1 part B — Wire `effectiveLevel` into candidate consumers and update `buildDraft` return shape.**

**Goal:** Make all candidate-pool consumers route through the resolver and the two-pool primitive. Change `buildDraft` to return `{ draft, levelRelaxed } | null`.

**Requirements:** R14, R15, R16; K3, K4, K5, K6, K9.

**Dependencies:** U1.

**Files:**

- Modify: `app/src/domain/sessionAssembly/candidates.ts` (`pickForSlot` accepts `effectiveLevelValue: PlayerLevel`; runs the existing selector twice for `main_skill`/`pressure`; for non-focus-controlled slots applies in-band preference only without setting `levelRelaxed`).
- Modify: `app/src/domain/sessionAssembly/substitution.ts` (`pickMainSkillSubstitute` runs `findSubstitute` twice).
- Modify: `app/src/domain/sessionAssembly/swapAlternatives.ts` (apply `partitionByLevel` LAST in `computeAlternatives` after preferred/substitute promotion; concatenate `[inBand, outOfBand]`; receive `effectiveLevelValue` as a new optional parameter).
- Modify: `app/src/domain/sessionBuilder.ts` (`buildDraft` accepts `onboarding?: unknown` via `BuildDraftOptions`; computes `effectiveLevelValue = effectiveLevel(onboarding)`; passes it to `pickForSlot` / `pickMainSkillSubstitute`; aggregates per-slot `levelRelaxed` into one build-level boolean; returns `{ draft, levelRelaxed: boolean } | null`).
- Modify: `app/src/domain/sessionBuilder.test.ts` (new return shape; new test cases for `levelRelaxed` true/false).
- Modify: `app/src/domain/__tests__/drillSelection.test.ts` (level scenarios).
- Modify: `app/src/domain/__tests__/findSwapAlternatives.test.ts` (level-ordering scenarios; assert preferred-progression promotion still wins ties).

**Approach:**

- `pickForSlot` signature gains `effectiveLevelValue: PlayerLevel`. For focus-controlled slots: compute `inBand` via `partitionByLevel`; first pass the existing selector logic against `inBand`; if a pick → `{ pick, levelRelaxed: false }`. Second pass against the full pool; if a pick → `{ pick, levelRelaxed: true }`. Else `{ pick: undefined, levelRelaxed: false }`. For non-focus-controlled slots: same first-pass-then-second-pass but always return `levelRelaxed: false` (or omit the relaxation report).
- `pickMainSkillSubstitute`: same two-pass discipline against in-band then full pool; returns `{ candidate, rationale, levelRelaxed }`.
- `findSwapAlternatives` / `computeAlternatives`: in `computeAlternatives`, AFTER the preferred-progression / substitute promotion (around line 127, before `.map(...)` at line 129), apply `partitionByLevel(filtered, effectiveLevelValue)` and re-concatenate as `[...inBand, ...outOfBand]`. The existing focus-relax wrapper at lines 47-61 stays as the outermost tier. NOTE: `findSwapAlternatives` accepts `effectiveLevelValue: PlayerLevel` as a new parameter; callers pass it through.
- `buildDraft`: `BuildDraftOptions` gains `onboarding?: unknown`. At entry, `const effectiveLevelValue = effectiveLevel(options?.onboarding)`. Track local `let levelRelaxed = false` over the slot loop; OR-aggregate the per-slot flag. Change return to `{ draft, levelRelaxed } | null`. Existing callers (in U3) update accordingly.

**Test scenarios:**

- `pickForSlot` with `effectiveLevelValue: 'advanced'` and an `intermediate`-only catalog returns the in-band `pick` (`levelRelaxed: false`) for warmup; returns out-of-band `pick` (`levelRelaxed: true`) for `main_skill`/`pressure`.
- `pickMainSkillSubstitute` with no in-band substitute falls back to the full pool with `levelRelaxed: true`.
- `findSwapAlternatives` with `effectiveLevelValue: 'advanced'` returns alternatives in `[in-band-first, out-of-band-after]` order; preferred-progression promotion still wins ties (in-band promoted-target stays at front; out-of-band promoted-target also stays at front, before the rest).
- `buildDraft` with onboarding `'competitive_pair'` and a Serving setup returns `{ draft, levelRelaxed: true }` (catalog has zero `levelMax: 'advanced'` serving drills).
- `buildDraft` with onboarding `'rally_builders'` and a Pass setup returns `{ draft, levelRelaxed: false }`.
- `buildDraft` with no onboarding (omit option) returns `{ draft, levelRelaxed: false }` for any setup (effective level falls through to beginner; existing tests pass with the unwrap).
- All existing `drillSelection.test.ts` and `findSwapAlternatives.test.ts` tests continue to pass with the unwrap (default `effectiveLevel = beginner` is the previous implicit behavior).

**Verification:** `npm --prefix app run test -- drillSelection findSwapAlternatives sessionBuilder candidates substitution effectiveLevel partitionByLevel` green.

---

- **U3. Track 1 part C — Wire onboarding through `buildDraft` callers; thread `levelRelaxed` into `SessionDraft` UI-only hint.**

**Goal:** All production callers of `buildDraft` read onboarding and pass it through, then unwrap the new return shape and persist `levelRelaxed` on `SessionDraft` per K6.

**Requirements:** R12, R15, R16; K6, K9.

**Dependencies:** U2.

**Files:**

- Modify: `app/src/db/types.ts` or `app/src/model/draft.ts` (add `levelRelaxed?: boolean` to `SessionDraft` shape — UI-only hint; not persisted in `SessionPlan`).
- Modify: `app/src/test-utils/persistedRecords.ts` (factory may default `levelRelaxed` for fixtures; verify).
- Modify: `app/src/screens/SetupScreen.tsx` (`handleConfirm` reads onboarding via `getStorageMeta`; passes through `BuildDraftOptions`; unwraps `{ draft, levelRelaxed }`; saves draft with `levelRelaxed` field).
- Modify: `app/src/screens/HomeScreen.tsx` (`handleRepeat` line 196: reads onboarding; passes through; unwraps; saves with `levelRelaxed`).
- Modify: `app/src/services/session/regenerateDraftFocus.ts` (reads onboarding; passes through `BuildDraftOptions`; unwraps; persists `levelRelaxed` on the saved draft).
- Modify: `app/src/services/session/__tests__/regenerateDraftFocus.test.ts` (assert `levelRelaxed` propagates correctly; existing tests update to use new return shape).
- Modify: `app/src/services/__tests__/session.v0b.test.ts` (7 buildDraft callsites unwrap; persistedRecords.ts fixture may need a `levelRelaxed: false` default).
- Modify: `app/src/screens/__tests__/SetupScreen.test.tsx` (onboarding fixture via `db.storageMeta.put`; unwrap).
- Modify: `app/src/screens/__tests__/SafetyCheckScreen.test.tsx` (line 52 buildDraft callsite unwrap).
- Modify: `app/src/screens/__tests__/HomeScreen.repeat-ended-early.test.tsx` (handleRepeat unwrap).
- Modify: `app/src/screens/__tests__/TuneTodayScreen.test.tsx` (existing 2 buildDraft callsites at lines 21 and 85 unwrap; new test fixtures default onboarding for setLevelRelaxed scenarios — see U7).

**Approach:**

- Per K6, add `levelRelaxed?: boolean` to `SessionDraft` (the type at `app/src/db/types.ts` or `app/src/model/draft.ts`). This is an optional field; legacy persisted drafts read as `undefined` (treated as `false` by the eyebrow render).
- For `buildRecoveryDraft` and `buildDraftFromCompletedBlocks` (which build drafts without going through `buildDraft`), the `levelRelaxed` field defaults to `false` or is computed inline (recovery uses fewer slots so level relaxation is less likely; conservative default `false`). Document explicitly in the function bodies.
- Each production caller pattern:
  ```typescript
  const onboarding = await getStorageMeta('onboarding.skillLevel', isSkillLevel)
  const result = buildDraft(context, { lastCompletedByType, onboarding })
  if (!result) {
    // existing null-handling path
    return
  }
  const { draft, levelRelaxed } = result
  await saveDraft({ ...draft, levelRelaxed })
  ```
- `regenerateDraftFocus`: same pattern inside the existing transaction. The early-return short-circuit (no actual rebuild needed) preserves the previous draft's `levelRelaxed` value (no change).
- Test fixture sweep: every `db.sessionDrafts.put({...})` test that builds a draft via `buildDraft` mocks needs the unwrap. Per the v2 ce-doc-review feasibility findings, the affected files are enumerated above.

**Test scenarios:**

- SetupScreen flow: with onboarding `'competitive_pair'` (mapped to `'advanced'`) and a serving setup, `handleConfirm` saves a draft with `levelRelaxed: true`.
- SetupScreen flow: with onboarding `'rally_builders'` and a passing setup, `handleConfirm` saves a draft with `levelRelaxed: false`.
- SetupScreen flow: with no onboarding (clean install), engine effective level falls through to `'beginner'`; existing tests pass.
- HomeScreen.handleRepeat: same patterns; saved repeat-rebuilt draft carries `levelRelaxed` from the rebuild (which reads current onboarding).
- regenerateDraftFocus: focus chip change on a draft with `levelRelaxed: true` may produce a draft with `levelRelaxed: false` if the new focus + saved level combination has in-band drills; pin both directions.
- session.v0b.test.ts unwrap: all 7 callsites continue to assert what they previously did about draft contents.

**Verification:** `npm --prefix app run typecheck && npm --prefix app run test` (full suite) green.

---

- **U4. Track 2 part A — Extract `SkillLevelPicker` shared component.**

**Goal:** Refactor `SkillLevelScreen` body into a reusable `SkillLevelPicker` component the Settings sub-route also consumes.

**Requirements:** R21; K10.

**Dependencies:** None (parallel-safe with U1, U2, U3).

**Files:**

- Create: `app/src/components/onboarding/SkillLevelPicker.tsx`.
- Create: `app/src/components/onboarding/__tests__/SkillLevelPicker.test.tsx`.
- Modify: `app/src/screens/SkillLevelScreen.tsx` (consume `SkillLevelPicker`; preserve all current behavior).
- Modify: `app/src/screens/__tests__/SkillLevelScreen.test.tsx` (regression confirms refactor preserves behavior; no test removals).

**Approach:**

- `SkillLevelPicker` props:
  ```typescript
  export interface SkillLevelPickerProps {
    voice: Voice
    onPick: (level: SkillLevel) => Promise<void> | void
    /** Optional: if omitted, the picker renders all 5 cards in the order from SKILL_LEVELS */
  }
  ```
  Body: the current 5-card `<ul>` from `SkillLevelScreen.tsx:180-209` (the `BANDS.map(...)` for the four bands + the 'unsure' card).
- `SkillLevelScreen` becomes a thin wrapper: header (heading + subtitle from current copy), `<SkillLevelPicker voice={voice} onPick={handlePick} />`. The `handlePick` callback contains the existing `setStorageMetaMany({ 'onboarding.skillLevel': level, 'onboarding.step': 'todays_setup' })` + navigate.
- Preserve all existing semantics: `acting.current` lock, error logging, `isSchemaBlocked` check, the focal-surface card style.

**Patterns to follow:** Existing `SkillLevelScreen` body. The extraction is purely structural; no behavior changes.

**Test scenarios:**

- `SkillLevelPicker` renders 5 cards with appropriate labels for solo voice + pair voice.
- `SkillLevelPicker` `onPick` callback fires with the correct `SkillLevel` value when a card is tapped.
- `SkillLevelScreen` regression: existing tests pass without modification (the screen behaves identically post-refactor).

**Verification:** `npm --prefix app run test -- SkillLevelPicker SkillLevelScreen` green.

---

- **U5. Track 2 part B — `SettingsSkillLevelScreen` sub-route + Settings section + route registration.**

**Goal:** Add the Settings sub-route, register it in routes/App/contracts, and add the `Skill level` section to `SettingsScreen`.

**Requirements:** R2, R3, R4, R5, R6, R7, R8, R9, R19; K11.

**Dependencies:** U4.

**Files:**

- Modify: `app/src/routes.ts` (add `settingsSkillLevel: () => '/settings/skill-level'` and the route path constant).
- Modify: `app/src/App.tsx` (register `<Route path={routePaths.settingsSkillLevel} element={<SettingsSkillLevelScreen />} />`).
- Modify: `app/src/contracts/screenContracts.ts` (add P12 entry).
- Create: `app/src/screens/SettingsSkillLevelScreen.tsx`.
- Modify: `app/src/screens/SettingsScreen.tsx` (add `Skill level` section).
- Create: `app/src/screens/__tests__/SettingsSkillLevelScreen.test.tsx`.
- Modify: `app/src/screens/__tests__/SettingsScreen.test.tsx` (Skill level section render + Change navigation).

**Approach:**

`**SettingsSkillLevelScreen`:**

```typescript
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackButton, ScreenShell } from '../components/ui'
import { SkillLevelPicker } from '../components/onboarding/SkillLevelPicker'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { type SkillLevel } from '../lib/skillLevel'
import { loadVoiceFromStorage, type Voice } from '../lib/voiceFromContext'
import { routes } from '../routes'
import { setStorageMetaMany } from '../services/storageMeta'

export function SettingsSkillLevelScreen() {
  const navigate = useNavigate()
  const acting = useRef(false)
  const [voice, setVoice] = useState<Voice>('solo')

  useEffect(() => {
    let cancelled = false
    void loadVoiceFromStorage().then((loaded) => {
      if (!cancelled && loaded) setVoice(loaded)
    })
    return () => { cancelled = true }
  }, [])

  const handlePick = useCallback(async (level: SkillLevel) => {
    if (acting.current) return
    acting.current = true
    try {
      // R5: write skillLevel only; do NOT mutate onboarding.step
      await setStorageMetaMany({ 'onboarding.skillLevel': level })
      navigate(routes.settings())
    } catch (err) {
      acting.current = false
      if (isSchemaBlocked()) return
      console.error('SettingsSkillLevelScreen: failed to persist skill level', err)
    }
  }, [navigate])

  // Heading copy candidate; pin during U7 review under courtside-copy.mdc
  const heading = voice === 'pair' ? 'Update your shared level' : 'Update your level'

  return (
    <ScreenShell>
      <ScreenShell.Header className="flex items-center gap-2 pt-2 pb-3">
        <BackButton label="Back" onClick={() => navigate(routes.settings())} />
        <h1 className="flex-1 text-center text-xl font-semibold tracking-tight text-text-primary">
          {heading}
        </h1>
        <div className="w-12" />
      </ScreenShell.Header>
      <ScreenShell.Body className="pb-6">
        <SkillLevelPicker voice={voice} onPick={handlePick} />
      </ScreenShell.Body>
    </ScreenShell>
  )
}
```

`**SettingsScreen` skill-level section** (added between Export Card and About local storage section, around line 145):

```jsx
{/* R2: Skill level section. Reads onboarding.skillLevel for display.
    Tap Change → /settings/skill-level. */}
<section
  aria-labelledby="settings-skill-level-heading"
  className="flex flex-col gap-2 rounded-[12px] border border-text-secondary/15 bg-bg-warm/40 p-4"
>
  <h2 id="settings-skill-level-heading" className="text-sm font-semibold text-text-primary">
    Skill level
  </h2>
  <p className="text-sm text-text-secondary">
    Your level: <span className="font-medium text-text-primary">{currentLevelLabel}</span>.
  </p>
  <Button
    variant="link"
    onClick={() => navigate(routes.settingsSkillLevel())}
  >
    Change
  </Button>
</section>
```

The `currentLevelLabel` is loaded from `storageMeta.onboarding.skillLevel` via `getStorageMeta` (single-shot read on mount, similar to the existing `tally` read at lines 47-63). Hidden if no onboarding value (fresh install before onboarding completes — protected by `FirstOpenGate` anyway).

**Patterns to follow:**

- `SkillLevelScreen` for the wrapper shape (`SettingsSkillLevelScreen` is its mirror with a different `onPick`).
- Existing `SettingsScreen` sections (`About local storage` is the closest precedent — same border/padding shape).
- `SkillLevelPicker` from U4.
- `routes.ts` existing helper pattern.

**Test scenarios:**

- `SettingsSkillLevelScreen`: voice loads correctly (solo and pair); picking each of the 5 levels writes `onboarding.skillLevel` correctly via `setStorageMetaMany` and navigates back to `/settings`; `onboarding.step` is NOT mutated by the pick (regression — distinguishes from `SkillLevelScreen`); BackButton routes to `/settings` without writing.
- `SettingsScreen`: Skill level section renders the current level label; Change button navigates to `/settings/skill-level`; section hidden when no onboarding value present (defensive); section position is between Export card and About local storage.
- `FirstOpenGate` regression: fresh-install testers still route to `/onboarding/skill-level`, not `/settings/skill-level`.

**Verification:** `npm --prefix app run test -- SettingsSkillLevelScreen SettingsScreen FirstOpenGate` green.

---

- **U6. Track 3 part A — Tune today eyebrow render.**

**Goal:** Render the inline eyebrow above Continue when the active draft was built with `levelRelaxed: true`. Tap → Settings.

**Requirements:** R10, R11, R13, R20, R22; KD4 (brainstorm), KD5 (brainstorm).

**Dependencies:** U3 (the `levelRelaxed` field on `SessionDraft` exists).

**Files:**

- Modify: `app/src/screens/tuneToday/useTuneTodayController.ts` (expose `levelRelaxed` from the active draft's UI-only hint).
- Modify: `app/src/screens/TuneTodayScreen.tsx` (render eyebrow when `levelRelaxed` is true; tappable to Settings).
- Modify: `app/src/screens/__tests__/TuneTodayScreen.test.tsx` (eyebrow render contract; tap navigation).
- Modify or Create: `app/src/screens/tuneToday/__tests__/useTuneTodayController.test.tsx` (`levelRelaxed` exposed in return shape).

**Approach:**

**Controller (`useTuneTodayController.ts`):**

Add `levelRelaxed` to the controller's return shape. Source from `draft?.levelRelaxed === true`. After every `regenerateDraftFocus` success, the saved draft (now persisted with `levelRelaxed` per K6 / U3) is set into state via `setDraft(result.draft)`, so the eyebrow re-derives automatically from the active draft.

```typescript
// In return statement:
return {
  // ...existing fields...
  levelRelaxed: draft?.levelRelaxed === true,
}
```

**Screen (`TuneTodayScreen.tsx`):**

Add a conditional eyebrow above the Continue button in the Footer:

```jsx
<ScreenShell.Footer className="flex flex-col gap-2 pt-4">
  {levelRelaxed && (
    <button
      type="button"
      onClick={() => navigate(routes.settings())}
      className="text-sm text-text-secondary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      aria-live="polite"
    >
      {/* R10 default candidate; pin in U7 review */}
      Today's session is calibrated to your saved level — adjust in Settings.
    </button>
  )}
  <Button
    variant="primary"
    fullWidth
    disabled={pending}
    aria-label="Continue to safety check"
    onClick={continueToSafety}
  >
    Continue
  </Button>
</ScreenShell.Footer>
```

The eyebrow is a `<button>` (tappable), styled as text — no chip, no card. Visible focus ring on keyboard focus. Tapping calls `navigate(routes.settings())`.

**Patterns to follow:**

- `Card` and `Button` from `components/ui`.
- Existing Tune today controller return shape and JSX layout.
- `aria-live="polite"` discipline (the eyebrow shares the existing live region).

**Test scenarios:**

- `TuneTodayScreen`: when active draft has `levelRelaxed: true`, eyebrow renders with the default copy candidate; tapping the eyebrow calls `navigate('/settings')`; Continue still routes to `/safety` independently.
- `TuneTodayScreen`: when active draft has `levelRelaxed: false` or `undefined` (legacy), no eyebrow renders.
- `TuneTodayScreen`: on focus chip change that triggers regeneration with `levelRelaxed: true`, the eyebrow appears after the regeneration completes; on focus chip change to a focus where the catalog has full Advanced coverage, the eyebrow disappears.
- `useTuneTodayController`: `levelRelaxed` in return shape correctly reflects active draft's UI-only hint.

**Verification:** `npm --prefix app run test -- TuneTodayScreen useTuneTodayController` green; visual check on a 390 px viewport that the two-line footer (eyebrow + Continue) maintains calm hierarchy.

---

- **U7. Track 3 part B — `skillLevel.ts` JSDoc note + final copy review.**

**Goal:** Document the post-engine-wiring re-validation of the `unsure → beginner` shim. Pin all final copy strings under `.cursor/rules/courtside-copy.mdc`.

**Requirements:** R23; K8; DQ1.

**Dependencies:** U5 (Settings sub-route exists for navigation target reference) and U6 (eyebrow exists).

**Files:**

- Modify: `app/src/lib/skillLevel.ts` (JSDoc note above the function or above the `case 'unsure'` branch).
- Modify: `app/src/screens/SettingsSkillLevelScreen.tsx` (final heading copy if changed from default candidate).
- Modify: `app/src/screens/SettingsScreen.tsx` (final Skill level section heading + body copy).
- Modify: `app/src/screens/TuneTodayScreen.tsx` (final eyebrow copy).

**Approach:**

JSDoc note on `skillLevelToDrillBand`:

```typescript
/**
 * ...existing JSDoc...
 *
 * 2026-05-04: this mapping was re-validated under the new contract where
 * the assembly engine reads effective level via `effectiveLevel(onboarding)`
 * (see `app/src/domain/sessionAssembly/effectiveLevel.ts`). Three alternatives
 * were considered (map `unsure` to "no level constraint"; force a one-time
 * explicit pick on first Tune today visit; keep `unsure → beginner`). Held:
 * keep `unsure → beginner`. The Settings affordance at `/settings/skill-level`
 * is the durable escape hatch; the Tune today eyebrow surfaces engine
 * relaxation honestly when the catalog cannot honor a non-Beginner level.
 * See `docs/brainstorms/2026-05-04-skill-level-mutability-requirements.md`
 * §"Key Decisions / KD8" for the alternatives evaluation.
 */
```

Copy review:

- R10 eyebrow text against `.cursor/rules/courtside-copy.mdc`.
- R2 / R3 / R4 default candidates pinned.

**Patterns to follow:** Existing function JSDoc style on `skillLevelToDrillBand`. Existing copy review discipline.

**Test scenarios:** None — JSDoc is documentation; copy changes are aesthetic.

**Verification:** Visual review; `npm --prefix app run typecheck` passes (sanity).

---

- **U8. Cross-cutting test sweep — confirm no `buildDraft` callsite was missed.**

**Goal:** Verify every `buildDraft(...)` callsite enumerated in U3 + the Output Structure was actually updated; the test suite passes end-to-end.

**Requirements:** R15 (return-shape change is fully propagated).

**Dependencies:** U3, U6.

**Files:** None new; this is a verification unit.

**Approach:**

- Run `rg "buildDraft\(" app/src` and confirm every result either (a) has been updated to unwrap `{ draft, levelRelaxed }`, (b) is in a comment / docstring, or (c) is in a test that's been updated.
- Cross-check against the v2 plan-review feasibility findings F2 enumeration (which named `session.v0b.test.ts` 7 sites, `SafetyCheckScreen.test.tsx`, `TuneTodayScreen.test.tsx`).
- Run the full test suite. Investigate any failure that's not a known fixture issue.
- Confirm `findSwapAlternatives` callers (`useTransitionController.ts`, `useRunController.ts`, `useSessionRunner.ts`) all pass through the new `effectiveLevelValue` parameter via the appropriate read path (controllers / hooks read onboarding via `getStorageMeta` once at mount or per-call as appropriate; default candidate is read once and cache).

**Test scenarios:** N/A — verification only.

**Verification:** `npm --prefix app run typecheck && npm --prefix app run test` clean.

---

- **U9. Catalog + status sync.**

**Goal:** Update `docs/catalog.json` entry for this plan + brainstorm v3, and add a recent-shipped-history line to `docs/status/current-state.md` once implementation lands.

**Requirements:** Cross-track R24.

**Dependencies:** U1–U8.

**Files:**

- Modify: `docs/catalog.json` (entries for `skill-level-mutability-requirements-2026-05-04` and `skill-level-mutability-2026-05-04` reflecting the v3 pivot; update `last_updated`).
- Modify: `docs/status/current-state.md` (recent shipped history line).

**Approach:** Mechanical doc updates after the code lands.

**Test scenarios:** None — docs-only.

**Verification:** `bash scripts/validate-agent-docs.sh` passes.

---

## System-Wide Impact

- **Interaction graph:** Tune today gains a conditional eyebrow above Continue. Settings gains a new section + sub-route. Both Focus chip taps and initial builds route through the same `effectiveLevel` resolver which is the single source of truth for runtime level.
- **Error propagation:** The `regenerateDraftFocus` use case's existing failure modes (`load`, `stale`, `build`, `save`, `schema_blocked`) are unchanged. The Tune today eyebrow renders nothing on `levelRelaxed: false` or `undefined` (legacy drafts).
- **State lifecycle risks:** `SessionDraft.levelRelaxed` is a UI-only hint. It is computed at build time and persisted with the draft. Stale-write detection in `regenerateDraftFocus` is unchanged. Legacy drafts (pre-this-ship) read as `undefined` on the new field; the eyebrow stays hidden, which is the right behavior (we don't know if relaxation occurred for legacy drafts).
- **API surface parity:** `effectiveLevel` is the single source of truth for slot → effective level. Any future swap path or candidate-pool consumer must call it. `partitionByLevel` is the single primitive for the two-pool composition. `SkillLevelPicker` is the single component for the 5-card body; both onboarding and Settings render it.
- **Integration coverage:** Build → save (with `levelRelaxed`) → Tune today (read flag) → eyebrow render → Settings tap → sub-route → write → return is covered end-to-end by U3 + U5 + U6 tests.
- **Unchanged invariants:** `D83` (pain + recency re-asked every session) — preserved. `D131` (no telemetry) — preserved. `D134` (Phase 2A streak capture) — unaffected. The 4/10 cap (`docs/plans/2026-04-20-m001-adversarial-memo.md`) — unchanged. `SkillFocus` union — unchanged. `DrillVariant` shape — unchanged. `PlayerLevel` shape — unchanged. `SetupContext` shape — unchanged (R18). Dexie schema version — unchanged. `ToggleChip` — unchanged. Focus picker behavior — unchanged. `assemblySeed` and `assemblyAlgorithmVersion` — unchanged.

---

## Risks & Dependencies


| Risk                                                                                                                | Mitigation                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `buildDraft` return-shape change has wide blast radius across tests.                                                | U3 enumerates all callsites explicitly per v2 plan-review finding F2. U8 is a verification sweep. The unwrap is mechanical (`if (!result) return null; const { draft, levelRelaxed } = result;`).                                                                                                          |
| Catalog reality means Advanced fires the eyebrow on every focus-controlled session for `competitive_pair` users.    | KD9 + R10 surface this honestly. The eyebrow's existence is a feature, not a bug — it tells the user the engine couldn't fully honor their saved level today. DQ1 (catalog authoring v2 trigger) fires when the eyebrow has been firing for ≥3 sessions in a row for a given user without behavior change. |
| Two-pool composition in `pickForSlot` runs the slot-type-specific selector twice; subtle behavior changes possible. | U2 test scenarios pin all four slot types' two-pass behavior including warmup/wrap (which should NOT contribute to `levelRelaxed`). Existing slot-type heuristics are preserved verbatim — the partition is layered on top.                                                                                |
| `SettingsSkillLevelScreen` extracts shared component from `SkillLevelScreen`; refactor risk to the first-open flow. | U4 regression tests confirm `SkillLevelScreen` behavior is unchanged. The extraction is purely structural.                                                                                                                                                                                                 |
| `findSwapAlternatives` onboarding wire-through — three controller/hook callers don't currently read `storageMeta`.  | U2 adds `effectiveLevelValue` parameter; U8 verifies the wire-through to `useTransitionController`, `useRunController`, `useSessionRunner`. Default mechanism: each caller reads onboarding once at mount and passes the resolved `PlayerLevel` through.                                                   |
| `levelRelaxed` UI-only hint on `SessionDraft` adds a non-domain field.                                              | KD9 (brainstorm) explicitly accepts this as a UI hint, not a domain truth. Documented in JSDoc on the field declaration. The hint is per-draft, not per-block; minimal blast radius.                                                                                                                       |


---

## Phased Delivery

This plan ships as one PR. The v2 plan considered a Phase 1 / Phase 2 split; the v3 pivot makes the single-PR shape natural because:

- The engine wiring (Track 1) and the eyebrow (Track 3) are tightly coupled — the eyebrow has nothing to render without Track 1's `levelRelaxed` flag.
- The Settings sub-route (Track 2) and the eyebrow (Track 3) are coupled — the eyebrow's tap navigates to Settings.
- The Settings sub-route reuses `SkillLevelPicker` which is extracted in U4 with no behavior change to onboarding.

If the diff size argues for a split, a defensible cut is: ship U1 + U2 + U3 + U8 as Phase 1 (engine wiring with tests, no UI surfaces) and U4 + U5 + U6 + U7 + U9 as Phase 2 (UI surfaces). Phase 1 standalone is honest under this v3 pivot — engine improvement is independently valuable for any user with a non-`unsure` onboarding answer. The v2 plan's Phase 1 problem (regenerateDraftFocus.ts wouldn't compile) is resolved here because U3 explicitly updates that file.

---

## Documentation / Operational Notes

- `docs/status/current-state.md` shipped-history line goes into U9.
- No founder-use-ledger row required. This ship lands under the existing `D135` Tier 1c-sibling trigger.
- The R10 eyebrow's default copy is recorded as a candidate in U6; final pin happens during U7 under `.cursor/rules/courtside-copy.mdc`.
- The 2026-05-04 founder + Seb pair-serving session validated Tune today's first dogfood. The next session that exercises a Settings change + a fresh build is the empirical test of R10's copy and the eyebrow's discoverability path.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-04-skill-level-mutability-requirements.md](../brainstorms/2026-05-04-skill-level-mutability-requirements.md) — v3 iteration log records the pivot decision and reviewer convergence.
- **Sibling pattern:** [docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md](2026-04-30-001-feat-pre-run-simplification-plan.md) — focus-picker architecture this plan extends.
- **Trigger source:** [docs/plans/2026-04-20-m001-tier1-implementation.md](2026-04-20-m001-tier1-implementation.md) §"Skill-level mutability — separate surface, separate trigger".
- **Cap & trigger discipline:** [docs/plans/2026-04-20-m001-adversarial-memo.md](2026-04-20-m001-adversarial-memo.md).
- **Decision references:** D91, D121, D130, D131, D135.

