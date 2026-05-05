---
id: brainstorm-2026-05-04-ui-primitive-consolidation
title: App-wide UI primitive consolidation
status: active
stage: requirements
type: requirements
summary: "Promote eight inline patterns from screens/components into shared primitives, split components/ui/ into atomic ui/ + Volleycraft-shaped patterns/ folders, fix the ActionOverlay focus-attribute string-contract, and add an ESLint guardrail so the same drift can't return."
last_updated: 2026-05-04
depends_on:
 - docs/brainstorms/2026-05-04-app-wide-choice-ui-consistency-requirements.md
 - .cursor/rules/component-patterns.mdc
---

# App-wide UI primitive consolidation

## Problem frame

The `app/` codebase has a hand-rolled `components/ui/` primitive layer (`Button`, `Card`, `ToggleChip`, `ChoiceSection`, `ScreenShell`, `ActionOverlay`, `BackButton`, `StatusMessage`) that is consumed correctly ~80% of the time. The remaining ~20% is the same surfaces re-built inline across screens. Each rebuild is small in isolation; together they are the drift-source the existing rule `.cursor/rules/component-patterns.mdc` is supposed to prevent but does not enforce.

A 2026-05-04 audit (deep `/shadcn` + `/ce-frontend-design` + `/ce-architecture-strategist` pass) catalogued ten patterns. Three sit in headers, three in modals, two in form inputs, and two in informational surfaces. The choice-row subset is already covered by [docs/brainstorms/2026-05-04-app-wide-choice-ui-consistency-requirements.md](docs/brainstorms/2026-05-04-app-wide-choice-ui-consistency-requirements.md) (in-flight); this brainstorm covers the remaining nine and the structural moves that go alongside.

The audit also surfaced two **structural smells** the architecture-strategist flagged as load-bearing:

1. `ActionOverlay`'s `data-action-overlay-initial-focus="true"` is a string-typed contract between callers and the overlay. Every modal must remember to set it; TypeScript can't enforce it; no test catches a typo. This bug compounds with every new modal and is the *underlying* cause of the per-modal duplication, not the surface symptom.
2. `FOCAL_SURFACE_CLASS` / `ELEVATED_PANEL_SURFACE` live in `components/ui/Card.tsx` but are consumed by non-Card surfaces (`SkillLevelScreen` option rows, `ActionOverlay` panel). The token name is correct; the file location implies a misleading "reach for Card" coupling.

Without the structural moves alongside the extractions, the same drift will return as new screens land.

## Goal

Reduce the ten audit patterns to a primitive set such that:

- Heading rows, modal shells, choice-row wrappers, disclosure buttons, callout panels, and large-numeric inputs each have **one canonical home** under `components/`.
- The home is structurally separated by domain: atomic primitives in `components/ui/`, Volleycraft-shaped composites (run-flow header, just-finished pill, back-button) in `components/patterns/`.
- The `ActionOverlay` focus contract becomes typed (ref or `primaryAction` slot), eliminating the string-attribute tax for the three callers that won't migrate to `ConfirmModal`.
- Surface tokens live in a tokens module (`components/ui/surfaces.ts`), not co-located with `Card`.
- A custom ESLint rule fails at edit time when the patterns named below are inlined outside their primitives.

The "same drift class can't reappear" half of the goal is what the ESLint rule earns; the rule is not optional here.

## Users and value

- **Founder dogfood (D130)** — fewer "is this a bug or intentional?" pauses on screens that should look uniform. The ScreenHeader spacer drift, the duplicated DrillCheck/Transition pill, and the four divergent confirm-modal layouts are visible to the user even if not consciously noticed.
- **Future agent edits (M002 onwards)** — one obvious primitive to reach for per surface, with the ESLint rule catching attempts to do otherwise. The `.cursor/rules/component-patterns.mdc` rule becomes self-enforcing rather than aspirational.
- **Architectural integrity** — the focus-attribute fix and surface-tokens relocation eliminate two leaky abstractions before they spread further. Both have one-time fix cost; both compound forever if deferred.

## Scope

### In scope

**Pattern extractions (eight):**

- **P1 ScreenHeader** (Volleycraft pattern): `BackButton + centered title + spacer` row used by SetupScreen, SafetyCheckScreen, SettingsScreen, TuneTodayScreen.
- **P2 RunFlowHeader** (Volleycraft pattern): `SafetyIcon + 3-cell-grid eyebrow + counter` used by RunScreen, TransitionScreen, DrillCheckScreen.
- **P3 ChoiceRow** (atomic primitive): `<div role="radiogroup" aria-label="..." className="flex/grid gap-2">{ToggleChip…}</div>` data-driven wrapper. Sibling to `ChoiceSection`. Replaces hand-rolled radiogroup wrappers in SetupScreen ×5, SafetyCheckScreen ×3, TuneTodayScreen, RpeSelector, IncompleteReasonChips, PerDrillCapture. Coordinates with the in-flight ChoiceSection brainstorm without overlapping its scope.
- **P4 Disclosure** (atomic primitive): collapsed-by-default reveal button (`Add counts (optional)` / `Add longest streak (optional)` in PerDrillCapture). The chevron-style heat expander on SafetyCheckScreen is a distinct shape (trigger remains visible) and gets its own `Expander` primitive.
- **P5 ConfirmModal** (Volleycraft pattern): title + description + safe-primary + secondary-or-danger composition over `ActionOverlay`. Replaces SoftBlockModal, SkipReviewModal, RunScreen end-session sheet (with `placement="bottom-sheet"`), and ResumePrompt's discard-step. ResumePrompt's outer "Session in progress" surface stays on raw `ActionOverlay` because its content shape is heavier than a confirm.
- **P6 Callout** (atomic primitive): `tone × emphasis × size` panel. Tones map to existing `warning-surface` / `info-surface` / `success/10` tokens. Replaces the inline panels on SafetyCheckScreen (heat warning + heat tips), PainOverrideCard, SettingsScreen export-success, and the body of `StatusMessage variant="error"`. `StatusMessage` keeps its semantic role (page-load state: loading/error/empty) and uses `Callout` internally.
- **P7 NumberCell** (atomic primitive): large numeric tap-to-type input with empty-zero placeholder, blur/Enter commit, optional `validate` callback. Replaces `PassMetricInput.NumberCell` and `PerDrillCapture.StreakInput`.
- **P8 JustFinishedPill** (Volleycraft pattern): warm panel + success-circle (check or dash) + drill name + "Complete"/"Skipped". Replaces the verbatim copy-paste in DrillCheckScreen and TransitionScreen.

**Structural moves (three):**

- **S1 Surface-tokens relocation**: move `FOCAL_SURFACE_CLASS` and `ELEVATED_PANEL_SURFACE` from `components/ui/Card.tsx` to `components/ui/surfaces.ts`. Re-export from `Card.tsx` so existing imports keep working. Update direct consumers (`SkillLevelScreen`, `ActionOverlay`, `home/cardStyles.ts`) to import from `surfaces.ts`.
- **S2 ActionOverlay focus-target API**: replace the `data-action-overlay-initial-focus="true"` string-attribute contract with a typed seam. Either a ref-based `initialFocusRef` prop or a dedicated `primaryAction` slot. The ref form also obsoletes ResumePrompt's `refocusKey` workaround for the discard-state transition. Lands **before** P5 (ConfirmModal) so the three non-ConfirmModal callers benefit too.
- **S3 Folder split**: move Volleycraft-shaped composites to `components/patterns/`. Targets: `BackButton.tsx` (courtside-flow specific, currently in `ui/`), the four new pattern primitives (`ScreenHeader`, `RunFlowHeader`, `ConfirmModal`, `JustFinishedPill`). Atomic primitives (`Button`, `Card`, `ChoiceSection`, `ChoiceRow`, `Disclosure`, `Expander`, `Callout`, `NumberCell`, `ScreenShell`, `ActionOverlay`, `StatusMessage`, `ToggleChip`, `surfaces`) stay in `components/ui/`. The barrel `components/ui/index.ts` continues to re-export `BackButton` for back-compat during the migration; new code imports from `components/patterns`.

**Guardrail (one):**

- **G1 Custom ESLint rule** (`eslint-plugin-volleycraft-ui` or inline rule): fails when forbidden inline patterns appear in `app/src/screens/` or `app/src/components/` outside the primitive that owns them. Concretely:
  - `<div role="radiogroup">` or `role="radiogroup"` outside `ChoiceRow.tsx`
  - The hand-rolled "BackButton + h1 + spacer" trio outside `ScreenHeader.tsx`
  - The `data-action-overlay-initial-focus` attribute (after S2 ships, this attribute should not appear anywhere)
  - The verbatim "warm panel + success circle + drill name" markup outside `JustFinishedPill.tsx`
  - `bg-warning-surface` / `bg-info-surface` / `bg-success/10` on a `<div>` larger than 1 line (suggests a `Callout` is needed); allow on inline spans/badges
  - Tokens to add later as new patterns land

  Rule must allow the primitive files themselves to use the patterns, and must allow `__tests__/` to render the patterns directly. Fix-on-save is out of scope; the rule reports only.

### Out of scope

- **D8 SectionEyebrow** (`text-xs font-medium text-text-secondary` eyebrow + title + body trio). Architecture lens: contexts diverge intentionally (eyebrow weight, mt spacing, body color) and typography is still in editorial flux pre-D91. Document the pattern in `.cursor/rules/component-patterns.mdc` instead.
- **D10 broad text-link normalization**. The five flavors of "small underlined accent text button" each do different things (tertiary action, navigation, toggle, disclosure, error-state escape). Variance is intentional. The ones that *are* duplicates get folded into the right primitive (`Disclosure` absorbs the PerDrillCapture buttons; the StatusMessage action-prop cleanup absorbs the three back-to-home links).
- Extending `ChoiceSection` with new slots (`helperLink`, `inlineWarning`, `iconBadge`, etc.). The closed slot set is doing real architectural work; new needs use opaque `children`.
- Adopting CVA, Radix, or shadcn/ui anywhere. Separately decided 2026-05-04: the existing primitives are too domain-specialized to benefit from a library swap during D130.
- Visual-snapshot regression testing. The ESLint rule + existing RTL component tests are the agreed safety net.
- Touching `BlockTimer`, `RpeSelector`, `IncompleteReasonChips`, `PainOverrideCard`, `SegmentList`, `SafetyIcon`, `Brandmark`, `ErrorBoundary`, `FirstOpenGate`, `UpdatePrompt`, `home/cardStyles.ts` content. They consume the new primitives where applicable but their own contracts don't change.
- M002-driven primitives (charts, popovers, command palette, tooltip, etc.). Not needed for current screens.

## Requirements

### Pattern extractions

- **R1 (P1)** `components/patterns/ScreenHeader.tsx` exposes `{ backLabel, onBack, title, right? }`. Renders the existing 3-cell grid (BackButton | centered h1 | optional right slot). Default right slot is an auto-balanced spacer matching BackButton's measured width — eliminates the hardcoded `w-12` magic number.
- **R2 (P2)** `components/patterns/RunFlowHeader.tsx` exposes `{ eyebrow, counter }` (both `ReactNode`). Wraps `ScreenShell.Header` with `grid grid-cols-3 items-center pt-2 pb-3` and renders `SafetyIcon` left, eyebrow center, counter right via `justify-self-{start,center,end}`. Eyebrow and counter typography stays caller-owned (Run uses `font-semibold text-accent`; Transition/DrillCheck use `font-medium text-text-secondary` — this is intentional focal-vs-status distinction).
- **R3 (P3)** `components/ui/ChoiceRow.tsx` exposes `<ChoiceRow value, onChange, options, ariaLabel | ariaLabelledBy, layout, perOptionTone? />`. `layout` is `'flex' | 'grid-2' | 'grid-3'`. `options` is `{ value, label, tone?, size?, ariaLabel? }[]`. Tone is per-option (SafetyCheckScreen Recency mixes accent + warning chips). Owns the `role="radiogroup"`, the `aria-label`/`aria-labelledby`, the chip layout container, and the `ToggleChip` mapping. Pairs with `ChoiceSection` (in-flight brainstorm) — `ChoiceSection` continues to own heading + description + footnote + opaque children.
- **R4 (P4 part a)** `components/ui/Disclosure.tsx` exposes `{ label, children, testId? }`. Renders the underlined-accent 44px-tap-target button when collapsed; renders `children` when expanded. Owns local open state. The collapse-after-open behavior is not needed (PerDrillCapture's drawers don't re-collapse).
- **R5 (P4 part b)** `components/ui/Expander.tsx` exposes `{ trigger, children }`. The trigger stays visible after expanding (chevron rotates). Used by SafetyCheckScreen's heat expander; not the same shape as `Disclosure`.
- **R6 (P5)** `components/patterns/ConfirmModal.tsx` exposes `{ title, description?, safeAction, destructiveAction?, onDismiss, role?, placement? }`. `safeAction` and `destructiveAction` are `{ label, onClick, variant?, disabled? }`. `placement: 'centered' | 'bottom-sheet'` (RunScreen end-session uses bottom-sheet). Internally wraps `ActionOverlay` and uses the new typed-focus seam from S2 to autofocus `safeAction`. Replaces SoftBlockModal, SkipReviewModal, the RunScreen end-session sheet, and the discard-step inside ResumePrompt. The first three become 5-line callers; ResumePrompt's discard-step is a thin internal use of `ConfirmModal` while the outer "Session in progress" surface stays on raw `ActionOverlay`.
- **R7 (P6)** `components/ui/Callout.tsx` exposes `{ tone, emphasis?, size?, role?, children }`. Tones: `'info' | 'warning' | 'success'`. `emphasis: 'flat' | 'hairline'` (warning + hairline = the heat-warning panel; flat covers the heat-tips panel and the export-success message). `size: 'md' | 'sm'`. `StatusMessage variant="error"` is rewritten to render `<Callout tone="warning" size="sm" role="alert">{message}</Callout>` internally. PainOverrideCard's outer warning panel becomes a `<Callout tone="warning" emphasis="flat" size="md">`.
- **R8 (P7)** `components/ui/NumberCell.tsx` exposes `{ label, value, onCommit, validate?, disabled?, placeholder?, invalidMessage?, testId? }`. `validate?: (n: number) => number | null` lets PassMetricInput pass its clamp-to-good logic and PerDrillCapture pass `validateStreakLongest`. Owns the empty-zero placeholder rule, the local text state, the blur/Enter commit, the inputMode/pattern attributes, and the `aria-invalid` + `aria-describedby` wiring.
- **R9 (P8)** `components/patterns/JustFinishedPill.tsx` exposes `{ drillName, status }` where `status: 'completed' | 'skipped'`. Owns the warm panel, the success-tone circle, the check or dash SVG glyph, and the "Complete"/"Skipped" subtitle. Replaces the inline pill in DrillCheckScreen.tsx (always `'completed'`) and TransitionScreen.tsx (variant on `prevBlockStatus`).

### Structural moves

- **R10 (S1)** `components/ui/surfaces.ts` exists and exports `FOCAL_SURFACE_CLASS` and `ELEVATED_PANEL_SURFACE` with their existing class strings and existing comment-block rationale (the `ring + shadow` ban-list explanation must travel with the tokens). `Card.tsx` continues to re-export both for back-compat. Direct consumers (`SkillLevelScreen.tsx`, `ActionOverlay.tsx`, `home/cardStyles.ts`) update their import path to `surfaces.ts`. No behavior change.
- **R11 (S2)** `ActionOverlay` exposes a typed initial-focus seam — choose ONE of:
  - **R11a (chosen)** `initialFocusRef?: RefObject<HTMLElement>` prop. Caller passes a ref (e.g., `const safeButtonRef = useRef<HTMLButtonElement>(null)`) and attaches it to the safe-primary button. Easier to thread through `ConfirmModal` (which receives the action props and creates the ref internally) and obsoletes ResumePrompt's `refocusKey` workaround (the discard-state transition swaps the ref target).
  - **R11b** `primaryAction?: { node: ReactNode }` slot. Less flexible for ResumePrompt's two-state confirming flow; rejected.
  After R11 lands, the `data-action-overlay-initial-focus="true"` attribute is removed from every caller. The ESLint rule G1 forbids re-introducing it.
- **R12 (S3)** `components/patterns/` directory exists and holds: `ScreenHeader.tsx`, `RunFlowHeader.tsx`, `ConfirmModal.tsx`, `JustFinishedPill.tsx`, `BackButton.tsx` (moved from `ui/`). `components/patterns/index.ts` exports all five. `components/ui/index.ts` continues to re-export `BackButton` from the new location for back-compat — existing call-site imports do not need to change in this effort. Tests for moved/new files live under `components/patterns/__tests__/`.

### Guardrail

- **R13 (G1)** ESLint rule `volleycraft/no-inline-primitive-drift` (or equivalent name) reports errors for the patterns enumerated under G1 in scope. Rule lives in a local `eslint-rules/` directory and is wired via the existing `eslint.config.js` (no new npm package). Rule allows the primitive files themselves and `__tests__/` files. Rule docs explain each forbidden pattern with a "use X instead" pointer. CI fails on rule violations (`npm run lint` is already in `package.json`).

### Compatibility / non-regression

- **R14** All existing tests pass after the refactor. Where DOM shape changed (e.g., the BackButton + spacer markup is now wrapped by `ScreenHeader`), tests update to query the new structure but assert the same accessible name / behavior.
- **R15** No visual regression on a 390 × 844 iPhone viewport. Founder verification: walk Setup → Tune Today → Safety → Run → Drill Check → Transition → Complete and confirm headings, modals, callouts, and pills look identical to pre-refactor.
- **R16** No bundle-size regression (the refactor moves code; it does not add dependencies). `npm run build` succeeds; the resulting `dist/` is within ±5% of the pre-refactor size.
- **R17** No accessibility regression. Existing axe-core Playwright coverage (`app/e2e/accessibility.spec.ts`) continues to pass. The radiogroup wiring on `ChoiceRow` is the high-risk surface — verify with axe + manual VoiceOver pass on Setup and Safety screens.

## Acceptance examples

- **AE1 (R1)** `SettingsScreen` renders `<ScreenHeader backLabel="Back" onBack={() => navigate(routes.home())} title="Settings" />` and the rendered DOM has identical heading text, identical BackButton position, and a balanced right-spacer that visually centers the title regardless of BackButton width changes.
- **AE2 (R2)** `RunScreen`, `TransitionScreen`, and `DrillCheckScreen` each render `<RunFlowHeader eyebrow={...} counter={...} />`. The 40-line "why grid not flex" comment from `RunScreen.tsx:171` lives once on `RunFlowHeader.tsx`. The three callers' header markup is each ≤ 8 lines.
- **AE3 (R3)** `SetupScreen`'s Players section renders `<ChoiceRow value={playerMode} onChange={setPlayerMode} options={PLAYER_OPTIONS} ariaLabel="Player mode" layout="flex" />` instead of the hand-rolled radiogroup wrapper. `RpeSelector` is reduced to ~10 lines: it owns rehydration logic and delegates rendering to `ChoiceRow`. `IncompleteReasonChips` becomes a 5-line wrapper.
- **AE4 (R4 + R8)** `PerDrillCapture` no longer contains the duplicated `inline-flex min-h-[44px] self-start ...` button strings or the `StreakInput` / `NumberCell` parallel implementations; it composes `<Disclosure>` and `<NumberCell>` from `components/ui`.
- **AE5 (R6 + R11)** `SoftBlockModal.tsx`, `SkipReviewModal.tsx`, the end-session sheet block in `RunScreen.tsx`, and the discard-step block in `ResumePrompt.tsx` each use `<ConfirmModal>`. The string `data-action-overlay-initial-focus="true"` does not appear anywhere in `app/src/`. `SchemaBlockedOverlay`, which keeps using raw `ActionOverlay`, passes `initialFocusRef` to point to its Reload button.
- **AE6 (R7)** `StatusMessage variant="error"` renders identical visual output to its pre-refactor implementation, but its body uses `<Callout tone="warning" size="sm" role="alert">`. `SafetyCheckScreen`'s heat warning panel renders `<Callout tone="warning" emphasis="hairline">`, the heat tips panel renders `<Callout tone="info">`, and `SettingsScreen`'s export-success message renders `<Callout tone="success" size="sm" role="status">`.
- **AE7 (R9)** `DrillCheckScreen` and `TransitionScreen` both render `<JustFinishedPill drillName={...} status={...} />`. The check / dash SVG markup, the `bg-success` circle, and the warm panel chrome live once in `components/patterns/JustFinishedPill.tsx`.
- **AE8 (R10)** Importing `FOCAL_SURFACE_CLASS` from `components/ui/Card` continues to work. New code in `SkillLevelScreen` imports it from `components/ui/surfaces` directly; the ban-list rationale comment is on the `surfaces.ts` definition.
- **AE9 (R12)** `components/patterns/index.ts` exists. `BackButton` is importable from both `components/ui` (back-compat) and `components/patterns` (canonical). New pattern primitives are importable only from `components/patterns`.
- **AE10 (R13)** Adding a new `<div role="radiogroup">` outside `ChoiceRow.tsx` to any file under `app/src/screens/` or `app/src/components/` causes `npm run lint` to fail with a clear "use ChoiceRow instead" message. Re-introducing `data-action-overlay-initial-focus` causes `npm run lint` to fail.

## Decisions

- **D1** Folder split lands in this effort, not deferred. `components/ui/` for atomic primitives, `components/patterns/` for Volleycraft-shaped composites. The split is done at S3 (alongside the extractions) so each new pattern primitive is born in the right home — no second migration later.
- **D2** Surface-tokens relocation (S1) lands as the first commit, before any extraction touches `Card.tsx` or `ActionOverlay.tsx`. Cheap, separable, eliminates an architectural risk.
- **D3** Focus-attribute fix (S2) lands **before** ConfirmModal extraction (P5). Architecture lens: extracting ConfirmModal first hides the smell behind a wrapper but leaves the three non-ConfirmModal callers paying the contract tax. Fixing the seam first makes ConfirmModal a thin convenience layer over an already-correct primitive.
- **D4** ESLint rule (G1) is mandatory, not optional. The whole consolidation is undermined if drift can re-emerge at edit time. ESLint over Vitest grep because the user explicitly chose edit-time enforcement; CI failure as a backstop.
- **D5** `ChoiceSection` keeps its closed slot set (`title`, `description`, `footerNote`, `optional`, `children`). New requests for `helperLink` / `inlineWarning` / `iconBadge` slots are rejected; callers use opaque `children` (see TuneTodayScreen's StatusMessage warning, brainstorm R7). The radiogroup wiring becomes a separate sibling primitive `ChoiceRow`, not a `ChoiceSection` slot.
- **D6** `Callout` does NOT swallow `StatusMessage`. `StatusMessage` keeps its semantic role (page-load state: loading/error/empty) and uses `Callout` for its error body. They are different abstractions: one is page state, the other is information surface.
- **D7** `Disclosure` and `Expander` are separate primitives (different shapes — Disclosure replaces the trigger; Expander keeps trigger + reveals below). Don't unify behind one prop.
- **D8** `BackButton` moves to `components/patterns/` (it's a courtside-flow-specific affordance, not a generic atomic primitive), but `components/ui/index.ts` re-exports it for back-compat so no import-path churn lands in this effort.
- **D9** No CVA, no Radix, no shadcn install. Decided 2026-05-04 in the audit thread.
- **D10** `BlockTimer`, `RpeSelector`, `PainOverrideCard`, `SegmentList`, `SafetyIcon`, `Brandmark`, `home/cardStyles.ts` keep their existing shapes. They consume the new primitives where applicable but their public APIs do not change.

## Risks

| Risk | Mitigation |
|---|---|
| Focus-attribute fix (S2) regresses modal-focus behavior across all four current callers | Land S2 with a Vitest test that asserts `document.activeElement` after mount equals the passed `initialFocusRef.current` for SoftBlockModal, SkipReviewModal, ResumePrompt, SchemaBlockedOverlay. Run before extracting ConfirmModal |
| `Callout` swallowing all the inline panels destabilizes pixel-level rendering on PainOverrideCard / heat panels | Snapshot the rendered DOM of each affected screen pre-refactor; diff post-refactor; founder visual verification on iPhone viewport |
| `ChoiceRow` API doesn't survive the per-option-tone case (Recency row mixes accent + warning chips) | API explicitly accepts per-option tone in the `options` array. Verify with a SafetyCheckScreen Recency test that confirms the warning chip renders with warning tone styling |
| ESLint rule (G1) produces false positives that block CI on legitimate code | Ship with a narrow allow-list (primitive files, test files); add inline `// eslint-disable-next-line` escape valve documented in rule docs; iterate on false positives in a follow-up PR rather than blocking the consolidation |
| Folder split (S3) causes import-path churn that touches ~20 files in one mega-PR | The barrel `components/ui/index.ts` re-exports moved primitives during this effort; only NEW imports use the new path. A follow-up cleanup PR migrates remaining imports. The `BackButton` move stays back-compat via re-export |
| The four ConfirmModal callers have subtly different copy / button counts that don't fit the API | The API supports 1 or 2 actions (safe-primary required, destructive-secondary optional). ResumePrompt's two-state flow (Discard → Yes-discard) is the edge case: handle by mounting two separate ConfirmModals on state, not by adding a third action slot |
| The ESLint rule lands but contributors disable it | Document the rule's intent in `.cursor/rules/component-patterns.mdc`. Rule violations get a short pointer to the rationale. PR review catches `eslint-disable` comments without a reason |
| Existing in-flight ChoiceSection brainstorm conflicts with this brainstorm's R3 (ChoiceRow) | Coordinate: the in-flight brainstorm covers `ChoiceSection` heading layout; this one adds the sibling `ChoiceRow` for the radiogroup body. They land in the same plan if sequenced together. R3 here explicitly *extends* the in-flight scope rather than overlapping |

## Verification

- `npm test -- --run` (full Vitest suite passes; new component tests for ScreenHeader, RunFlowHeader, ChoiceRow, Disclosure, Expander, ConfirmModal, Callout, NumberCell, JustFinishedPill, surfaces, patched ActionOverlay)
- `npm run lint` (passes; the new ESLint rule reports zero violations on the post-refactor codebase, and synthetic violations are confirmed to fire in a sandbox file)
- `npm run build` (succeeds; `dist/` size within ±5% of baseline)
- `npm run architecture:check` (existing layer-boundary checks continue to pass — no new violations)
- `npm run test:e2e -- --project=chromium app/e2e/accessibility.spec.ts` (axe-core flow remains clean)
- `npm run test:e2e -- --project=chromium app/e2e/session-flow.spec.ts app/e2e/edge-cases.spec.ts app/e2e/phase-c3-onboarding.spec.ts` (the three flows touching the most refactored surfaces stay green)
- Founder visual verification on a 390 × 844 iPhone viewport: walk Setup → Tune Today → Safety → Run (preroll, mid-block, paused, end-session sheet) → Drill Check → Transition → Complete → Settings; confirm headings/modals/callouts/pills/inputs are visually identical to pre-refactor

## Sequencing intent (informs the plan)

The plan should sequence as: **S1 → S2 → P3 → P1 → P2 → P8 → P4+P5 → P6 → P7 → P9 → S3 → G1 → cleanup-pass**. Two structural commits open the work, the in-flight ChoiceRow lands next so the in-flight brainstorm can converge, then headers + pill + disclosure + modal + callout + numeric input land in a sequence that avoids touching the same file twice unnecessarily. Folder split lands late so all new primitives are born in the right home in one commit. ESLint rule lands last so it can lint a clean codebase, with the cleanup pass after to fix any latent violations the rule surfaces.
