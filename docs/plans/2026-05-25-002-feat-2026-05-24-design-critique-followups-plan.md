---
title: 2026-05-24 e2e design critique follow-ups
type: feat
status: active
date: 2026-05-25
origin: docs/design/reviews/2026-05-24-agent-e2e-design-critique.md
---

# 2026-05-24 e2e design critique follow-ups

## Summary

Ship every open editorial-class (EC) item from the 2026-05-24 e2e design critique, plus an experimental pass on the two D91-field-held outdoor-readability findings (H1 timer size, H2 active-run density) with a same-PR re-evaluation note. First unit lands the existing uncommitted WIP (M1/M2 warning-strong wiring, L2 ASCII hyphen, new axe coverage, canon §2.1/§2.2, plus bonus `rounded-base` / `rounded-focal` token cleanup and `SafetyCheckScreen` disabled-CTA `missingHint`) so the later canon-reconciliation unit doesn't conflict with the partial canon updates already on disk. Final units perform a doc-only canon-reconciliation pass on `docs/research/brand-ux-guidelines.md` for the eight DOC-drift rows the critique listed, and capture a re-evaluation of H1/H2 against viewport-bound evidence.

---

## Problem Frame

The 2026-05-24 e2e design critique (`docs/design/reviews/2026-05-24-agent-e2e-design-critique.md`) named one already-resolved Medium (M1 / M2 warning-surface contrast — same-day fix in the working tree, not yet committed), three EC Lows (L1 / L3 / L4), eight DOC-drift rows where `brand-ux-guidelines.md` is now stale relative to shipped code, and two Highs gated by the `D91` field run (H1 timer size, H2 active-run density). The Highs were classified `D91-FIELD / T1B` per `D127` / `D130` — held by default. The user has explicitly authorized this plan to experiment on H1 and H2 and re-evaluate their value once shipped, so they move from "held" to "exploratory in-tier" for this plan only. Everything else is plain editorial polish that does not require a decision.

---

## Requirements

- R1. The uncommitted 2026-05-24 audit WIP is committed and pushed on `main` (single-branch flow per AGENTS.md).
- R2. The Settings footer build slug (`SettingsScreen.tsx`) shows a short form in non-dev builds — long `git describe` slugs no longer leak to stranger cohorts.
- R3. The Settings "Export training records" card no longer uses the same string for both heading and button label.
- R4. The "2+ days ago" recency chip in `SafetyCheckScreen` no longer wraps to two lines at the 390 × 844 viewport.
- R5. The Transition vs Drill-check forward-CTA emphasis is reconciled — either matched, or the intentional asymmetry is documented in code + canon.
- R6. The `BlockTimer` digits experimentally render at the outdoor-courtside-ui-brief bench-distance range (72-88 px) instead of the current arm's-length 56 px, with the change framed as an experiment open to re-evaluation.
- R7. Active-run body density on `RunScreen` is experimentally reduced for segmented drills — the `courtsideInstructions` paragraph no longer competes for above-the-fold attention with the `SegmentList` once the user is past the first segment.
- R8. `docs/research/brand-ux-guidelines.md` is updated in a single editorial pass for the eight DOC-drift rows the critique listed; the M3 entry explicitly records the 2026-05-04 ideation rejection of solid-accent revert.
- R9. A short re-evaluation note (in the plan-archive or a new dated review snippet) captures the viewport-bound assessment of H1 / H2: keep, tune further, or revert.
- R10. `bash scripts/validate-agent-docs.sh` passes after every docs touch.
- R11. The full Vitest suite stays green; existing accessibility e2e (`app/e2e/accessibility.spec.ts`) stays at 8/8 (plus the four new selected/conditional warning scans the WIP adds).

---

## Scope Boundaries

- No new content, schema, persistence, routing, or drill-record changes (critique's `What this review does NOT do`).
- No Tier 1b unlock or scope expansion under `D130`.
- No revision of `D86`, `D91`, `D125`, `D127`, `D129`, `D130`, `D132`, `D137`.
- No re-litigation of the M3 selected-chip color decision — the 2026-05-04 ideation rejected solid-accent revert; this plan records that in canon, it does not re-open it.
- No real-device sunlight testing. The H1 / H2 re-evaluation in U9 is **viewport-bound** at 390 × 844; the `D91` field-run gate stays in place for the durable decision.
- No replacement of `D91` evidence. Even if H1 / H2 read well at viewport-bound assessment, this plan does not close `D91`; that gate remains owned by the actual field run.

### Deferred to Follow-Up Work

- Durable H1 / H2 keep/revert decision once `D91` field-run sunlight evidence exists.
- `D127` body-token retune + distance-mode (broader font-size scale change) — out of scope; this plan touches only the `BlockTimer` digit size and the segmented-drill body density.
- Lock-screen presence spike for iOS PWA AudioContext (referenced in RunScreen preroll comments).

---

## Context & Research

### Relevant Code and Patterns

- `app/src/index.css` — `--color-warning-strong` token (already in the WIP) + the existing `rounded-base` / `rounded-focal` semantic radius tokens.
- `app/src/components/BlockTimer.tsx` — current digit class `font-mono text-[56px] font-bold leading-none tabular-nums` (line ~67). The Phase F10 + 3.5 s accent-flip + thicker `h-3` progress bar are intentional; the experiment touches the digit size only.
- `app/src/screens/RunScreen.tsx` lines ~98-108 + 184-256 — `hasVisibleSegmentInstructions` gates the inline `courtsideInstructions` paragraph above the `SegmentList`; the existing `<details>` affordance (`Show more cues and instructions`) already collapses non-visible instructions / cues. The H2 experiment extends this pattern to the segmented case.
- `app/src/screens/SettingsScreen.tsx` line ~143 / 154 (Export card heading + button label), ~273 (build slug `<p>` using `BUILD_VERSION` / `BUILD_DATE`).
- `app/src/lib/buildInfo.ts` — typed `BUILD_VERSION` / `BUILD_DATE` accessors backed by Vite `define` injection (`__VOLLEYCRAFT_BUILD_VERSION__` / `__VOLLEYCRAFT_BUILD_DATE__`). The L3 short-form helper lives here, not in the screen.
- `app/src/screens/SafetyCheckScreen.tsx` — recency `ChoiceRow` options including `2+ days ago`; the existing `missingHint` in the WIP sits in the same screen.
- `app/src/screens/TransitionScreen.tsx` line 207 (`Button variant="primary" fullWidth onClick={handleStartNext}` → `Start next block`).
- `app/src/screens/DrillCheckScreen.tsx` line 223 (`Button variant="primary" fullWidth onClick={handleContinue} disabled={!captureSatisfied}` → `Continue`). The button is **already** primary; the audit screenshot captured the disabled state, which renders lower-contrast. This shapes the U5 decision.
- `docs/research/brand-ux-guidelines.md` §1.2 type scale, §2.3 color-role table, §7 per-screen posture.
- `.cursor/rules/courtside-copy.mdc` rule 4 (no em-dashes in prose) — already enforced by the WIP L2 fix.
- `docs/research/outdoor-courtside-ui-brief.md` — bench-distance 72-88 px timer floor; active-run 6-field cockpit invariants.
- `docs/ideation/2026-05-04-setup-screen-default-path-polish-ideation.md` — explicitly rejected "stronger selected-chip states" (relevant to canon M3 reconciliation).

### Institutional Learnings

- `.cursor/rules/component-patterns.mdc` — `FOCAL_SURFACE_CLASS` (the radius rename is already in the WIP), `ConfirmModal` / `ActionOverlay` shells, the disabled-CTA `missingHint` voice the WIP extends to Safety.
- `.cursor/rules/docs-editorial-workflow.mdc` — `last_updated` bump + `bash scripts/validate-agent-docs.sh` after canon edits.
- `.cursor/rules/machine-scannable-docs.mdc` — YAML frontmatter must be real YAML; cross-reference rather than duplicate canon.
- `AGENTS.md` Operational Constraints — single-branch flow on `main`; push after every commit.

### External References

None gathered; the critique itself is the research artifact, the code surfaces are named with file paths and line numbers, local patterns are strong, and topic risk is low (pure UX/copy/doc work — no auth, payments, migration, or external contract). Per Phase 1.2 guidance, external research is skipped.

---

## Key Technical Decisions

- **The first unit ships the uncommitted WIP exactly as-is** (M1/M2 warning-strong propagation + L2 + four new axe scans + canon §2.1/§2.2 + the bonus `rounded-base` / `rounded-focal` token cleanup + `SafetyCheckScreen` `missingHint`). Splitting the diff buys nothing — every change traces to the same audit day; the bonus items are coherent improvements that landed alongside. One commit, audit-day-themed message.
- **L3 short-build-slug helper lives in `lib/buildInfo.ts`, not inline in `SettingsScreen`.** Triage hygiene wants the long `git describe` slug in dev for D91 founder-use; only the user-facing display gets the short form. A helper at the seam keeps both code paths legible and unit-testable.
- **L4a button label rename: `Export`** (single imperative) — matches the rest of the app's button voice (`Done`, `Pause`, `Next`). Card heading `Export training records` stays.
- **L1 direction: document the intent, do not change the variant.** Inspection shows `DrillCheckScreen`'s `Continue` is already `variant="primary"`; the audit's "outline" read came from the disabled state. The real signal is that disabled-primary reads low-emphasis at glare distance until a capture chip is selected, which is correct UX (the existing `missingHint` covers the "why"). The fix is a code comment + a canon note explaining the disabled-state read; no variant change.
- **H1 experiment target: 72 px** (`text-[72px]`) — the bottom of the outdoor brief's bench-distance range. Conservative for a first cut; if viewport-bound assessment supports going higher, U9's re-evaluation can recommend 80-88 px in a follow-up. Implementation keeps every other `BlockTimer` invariant intact (Phase F10 JetBrains Mono + slashed zero, 3.5 s accent-flip, `h-3` progress bar, paused-state subtitle).
- **H2 experiment shape: gate the inline `courtsideInstructions` paragraph on segment index.** When `hasVisibleSegmentInstructions` is true AND `currentSegmentIndex > 0`, route the paragraph into the existing `<details>` affordance (re-using `Show more cues and instructions` / `Show full instructions`) instead of rendering it inline above the `SegmentList`. The first segment keeps the full READ-DO paragraph; subsequent segments drop it. This honors the outdoor brief's DO-CONFIRM density rule (`courtside-copy.mdc` rule 13) without removing READ-DO content from the user's reach.
- **Canon-reconciliation is doc-only — code is right per the critique.** `brand-ux-guidelines.md` gets one editorial pass; no app code touched in U8.
- **Re-evaluation in U9 is viewport-bound, not field-bound.** It is a same-PR closing note that records the agent's assessment of H1 / H2 against the 2026-05-24 screenshots and the new state; it does not pretend to close `D91`. If the viewport-bound assessment says "revert," U9 reverts the H1 / H2 code in the same PR — the experiment is allowed to fail safely.
- **One commit per implementation unit, on `main`.** Push after each commit. No long-lived feature branch per AGENTS.md single-branch flow.

---

## Open Questions

### Resolved During Planning

- **Does L1 require a variant change?** No — `DrillCheckScreen`'s `Continue` is already `variant="primary"`. The audit captured the disabled state. L1 becomes documentation, not code.
- **Where does the L3 short-build-slug helper live?** In `lib/buildInfo.ts`, not inline. Keeps `SettingsScreen` thin and makes the helper unit-testable.
- **Is the H1 / H2 work scope-creeping into D127 body-token retune?** No — U6 changes one component's digit size; U7 changes one screen's conditional render. The broader `D127` font-scale rebuild stays deferred.

### Deferred to Implementation

- **Exact regex / parse for non-tag `git describe` slugs in `formatBuildVersion`.** The slug format (`<tag-or-branch>-<n>-g<sha>` or bare `<sha>`) is shaped by git; the helper will pattern-match against the trailing `g<7-char-sha>` and prefer that segment over the verbose lead. Implementer picks the precise pattern + fallback when no `g<sha>` is present.
- **Exact recency chip remediation.** Either `2+ days` (shorter label) or `ChoiceRow` width tuning at the row level. Implementer picks based on what fits cleanly at 390 px without breaking the existing 0 / 1 / 2+ option semantics.
- **Whether H2 should also apply when `hasVisibleSegmentInstructions` is false.** Today the false case already routes instructions to `<details>`; no change needed unless the implementer surfaces a measured density problem in the same-screen `currentCue` block.

---

## Implementation Units

- U1. **Ship the in-flight 2026-05-24 audit WIP**

**Goal:** Commit and push the existing uncommitted working-tree diff as a single audit-day-themed unit. Captures M1 / M2 warning-strong propagation, L2 ASCII-hyphen removal, four new axe scans, canon §2.1 / §2.2 updates, and the coherent bonus items (`rounded-base` / `rounded-focal` semantic radius tokens, `SafetyCheckScreen` disabled-CTA `missingHint`).

**Requirements:** R1, R11

**Dependencies:** None

**Files:**
- Modify: every file currently in `git diff HEAD --stat` (29 files), notably:
  - `app/src/index.css` (`--color-warning-strong`)
  - `app/src/components/ui/ToggleChip.tsx`, `app/src/components/ui/Button.tsx`, `app/src/components/ui/Callout.tsx`
  - `app/src/components/PainOverrideCard.tsx`, `app/src/components/ResumePrompt.tsx`, `app/src/components/patterns/ConfirmModal.tsx`
  - `app/src/screens/SafetyCheckScreen.tsx` (warning-strong heading + new `missingHint`)
  - `app/src/screens/SkillLevelScreen.tsx` (L2 — `unsureSubtext` override removed)
  - `app/src/components/ui/Card.tsx`, `app/src/components/ui/ChoiceSection.tsx`, `app/src/components/ui/NumberCell.tsx`, `app/src/components/ui/surfaces.ts` + several others — bonus `rounded-base` / `rounded-focal` token cleanup
  - `app/e2e/accessibility.spec.ts` (+97 lines — four new scans: selected warning chip, pain override-confirm, heat tips expanded, end-session confirm modal)
  - `docs/research/brand-ux-guidelines.md` (§2.1 / §2.2 token doc — partial; rest of canon-reconciliation lives in U8)
  - `docs/design/README.md` (Reviews table + `last_updated`)

**Approach:**
- Single commit; do not split. Commit message lead: `fix(ui): close 2026-05-24 audit M1 / M2 / L2 + axe; bonus rounded-* tokens + safety missingHint`.
- Push to `origin/main` immediately after commit per AGENTS.md single-branch flow.
- Run `bash scripts/validate-agent-docs.sh` before commit; expect green.
- Run `npm test` and `npm run test:e2e -- accessibility.spec.ts` from `app/`; expect green (the new axe scans should pass).

**Patterns to follow:**
- AGENTS.md Operational Constraints — single-branch flow on `main`; push after every commit.
- Audit-day-themed commit message style consistent with prior audit-closeout commits in git history.

**Test scenarios:**
- Integration: `npm test` in `app/` stays green (existing component / domain / services tests cover the warning-strong wiring).
- Integration: `npm run test:e2e -- accessibility.spec.ts` shows 12/12 passing (the prior 8 plus 4 new selected/conditional scans).
- Edge case: `bash scripts/validate-agent-docs.sh` passes (the canon §2.1 / §2.2 + `docs/design/README.md` updates have valid YAML).

**Verification:**
- `git status` is clean after push.
- `git log --oneline -1` shows the audit commit on `main`.
- `git push` reports `origin/main` matches `HEAD`.

---

- U2. **L3 — Shorten Settings build slug for non-dev builds**

**Goal:** Stop leaking long `git describe` slugs (`m001-validation-week5-catchup-2026-05-23-1-gbc6831d`) to non-dev users while preserving the verbose form for founder-use / D91 triage.

**Requirements:** R2

**Dependencies:** U1

**Files:**
- Modify: `app/src/lib/buildInfo.ts` — add `formatBuildVersion(raw: string, mode: 'dev' | 'prod')` (or similar shape) that returns the raw value for dev and a short form for prod.
- Modify: `app/src/screens/SettingsScreen.tsx` line ~273 — use the helper.
- Test: `app/src/lib/__tests__/buildInfo.test.ts` (create or extend) — covers the slug shapes.

**Approach:**
- Detect dev vs prod from Vite's `import.meta.env.DEV` (or the existing pattern in the codebase if one exists).
- For prod: prefer the trailing `g<7-char-sha>` segment (strip everything before the last `-g`); if no `g<sha>` is present (clean tag like `v0b-alpha.16`), keep the tag as-is.
- For dev: return the raw value unchanged so D91 triage telemetry-by-hand stays intact.
- Helper is pure — easy unit test.

**Patterns to follow:**
- The thin-helper-with-pure-test pattern from `app/src/lib/format.ts` (and the existing `lib/cn.ts`).
- The Vite `define` injection seam already in `buildInfo.ts` — don't add new env channels.

**Test scenarios:**
- Happy path: `formatBuildVersion('v0b-alpha.16', 'prod')` returns `v0b-alpha.16` (clean tag passes through).
- Happy path: `formatBuildVersion('m001-validation-week5-catchup-2026-05-23-1-gbc6831d', 'prod')` returns `bc6831d` (or `gbc6831d` — implementer's call; commit to one shape and test it).
- Happy path: `formatBuildVersion('m001-validation-week5-catchup-2026-05-23-1-gbc6831d', 'dev')` returns the raw value unchanged.
- Edge case: `formatBuildVersion('bc6831d', 'prod')` returns `bc6831d` (bare SHA fallback when no tag).
- Edge case: `formatBuildVersion('v0b-alpha.16-3-g1234567-dirty', 'prod')` handles the `-dirty` suffix without losing the `g<sha>` anchor.

**Verification:**
- `npm test` stays green with the new helper test.
- Manual: `npm run build && npm run preview` in `app/` shows a short build slug in the Settings footer; `npm run dev` shows the long form.
- The Settings footer comment block (lines ~252-268 in `SettingsScreen.tsx`) is updated to reflect the dev/prod split rather than the prior "long form everywhere" rationale.

---

- U3. **L4a — Rename "Export training records" button label to "Export"**

**Goal:** Stop the Settings export card heading and button label from echoing each other.

**Requirements:** R3

**Dependencies:** U1

**Files:**
- Modify: `app/src/screens/SettingsScreen.tsx` line ~154 — change button label `Export training records` → `Export`; keep `Exporting…` for the in-flight state.
- Modify: tests that assert against the old label string, if any exist (likely in `app/src/screens/__tests__/SettingsScreen.test.tsx` or e2e).

**Approach:**
- Pure copy change. Card heading on line ~143 stays as `Export training records` (provides the "what" context); button gets the single-imperative `Export`.
- In-flight state stays `Exporting…` (ellipsis already encoded as `\u2026`).
- Update any test assertions that grep for the old label.

**Patterns to follow:**
- The single-imperative button voice already used elsewhere (`Done`, `Pause`, `Next`, `Resume`).
- `.cursor/rules/courtside-copy.mdc` `## 3.2` voice (no em-dashes, plain punctuation).

**Test scenarios:**
- Happy path: `SettingsScreen` renders a button with accessible name `Export` (and not `Export training records`) in the idle state.
- Happy path: While the export is in flight, the button reads `Exporting…` (existing behavior, regression-pinned).
- Integration: Any e2e test that taps the Settings export flow keeps passing without label-string updates required beyond this rename.

**Verification:**
- `npm test` stays green (with any string-assertion updates applied).
- `npm run test:e2e` stays green.

---

- U4. **L4b — Fix "2+ days ago" recency chip wrap**

**Goal:** Stop the recency chip from wrapping to two lines at 390 × 844.

**Requirements:** R4

**Dependencies:** U1

**Files:**
- Modify: `app/src/screens/SafetyCheckScreen.tsx` recency `ChoiceRow` options (or the layout class on the row).

**Approach:**
- Two viable shapes; implementer picks based on what fits cleanly at 390 px:
  1. **Shorter label**: `2+ days ago` → `2+ days` (or `2+ days off`). Lowest-risk; keeps the existing layout invariants intact.
  2. **Layout tuning**: small width / `min-w` tweak on the chip row so all three options share the row without wrapping.
- Whichever shape ships, keep the 0 / 1 / 2+ option semantics intact — the recency value model does not change.

**Patterns to follow:**
- The existing `ChoiceRow` layout (`flex` / `grid-2` / `grid-3`) — pick the variant that already fits the other two recency options.
- `.cursor/rules/component-patterns.mdc` `<ChoiceRow>` contract.

**Test scenarios:**
- Happy path: All three recency chips render on a single line at 390 px wide.
- Happy path: Each chip's accessible name still uniquely identifies its option (no two chips share the same text after the rename).
- Edge case: Tapping the renamed chip still maps to the same `recency` storage write the original label produced.

**Verification:**
- `npm test` stays green.
- Manual: 390 × 844 viewport screenshot of `/safety` shows all three chips on one row.

---

- U5. **L1 — Document the disabled-CTA emphasis intent (code comment + canon)**

**Goal:** Capture in code + canon that `DrillCheckScreen`'s `Continue` is intentionally `variant="primary"` but renders disabled (low-emphasis) until a capture chip is selected, so future agents don't "fix" it by promoting an already-primary button or by demoting `Start next block` to match.

**Requirements:** R5

**Dependencies:** U1

**Files:**
- Modify: `app/src/screens/DrillCheckScreen.tsx` near line 223 — add a block comment before the `<Button>` explaining the disabled-state intent.
- Modify: `docs/research/brand-ux-guidelines.md` §7.x DrillCheck (or the post-block screen section that covers it) — record the disabled-primary CTA convention. Coordinated with U8's broader canon-reconciliation pass; this row may land in U8's editorial pass instead of U5 if U8 ships in the same session.

**Approach:**
- One- or two-paragraph code comment naming: (a) the audit observation, (b) the existing `missingHint` voice that covers the "why," (c) the rule against promoting disabled-primary or demoting the matching `Start next block` CTA.
- No variant change. No layout change.
- If U8 runs in the same session, the canon note rides in U8; otherwise U5 owns it.

**Patterns to follow:**
- The "post-ship reversal" / "non-player tester feedback" comment style already in `BlockTimer.tsx` (lines 30-44) and `RunScreen.tsx` (lines 282-305).

**Test scenarios:**
- Test expectation: none — this unit is pure documentation. No behavioral change.

**Verification:**
- `git diff` on `DrillCheckScreen.tsx` shows only added comment lines (no JSX or logic changes).
- `bash scripts/validate-agent-docs.sh` passes if U5 touches canon.

---

- U6. **H1 experiment — Bump BlockTimer digits to bench-distance range**

**Goal:** Move the live block timer digit size from arm's-length (56 px) toward the outdoor brief's bench-distance floor (72-88 px). First-cut target: 72 px.

**Requirements:** R6

**Dependencies:** U1

**Files:**
- Modify: `app/src/components/BlockTimer.tsx` line ~67 — change `text-[56px]` to `text-[72px]`.
- Modify: the leading JSDoc / comment in `BlockTimer.tsx` — add a 2026-05-25 note explaining the experiment, citing this plan and the outdoor brief.

**Approach:**
- Change one Tailwind arbitrary-value class. Every other invariant stays: `font-mono` (JetBrains Mono Variable per Phase F10), `font-bold`, `leading-none`, `tabular-nums`, the 3.5 s accent-flip threshold, `fontFeatureSettings: '"zero" 1'` slashed-zero, the `data-testid` / `data-countdown` hooks.
- Verify the new digit row still fits in the cockpit footer at 390 × 844 alongside the `h-3` progress bar and the `RunControls` row. If it pushes content above the fold, the implementer downgrades to 64 px (between current and floor) and notes it in U9.
- The preroll count-in digit (RunScreen line ~289) **stays at 72 px** as it already does — no change there; the experiment closes the size gap between preroll and live timer, which currently jumps 72 → 56 → ...

**Patterns to follow:**
- The Tailwind arbitrary-value class pattern already in `BlockTimer.tsx` and the preroll digit in `RunScreen.tsx`.
- The "Phase F10" / "2026-04-26 reconciled-list" comment style already in `BlockTimer.tsx`.

**Test scenarios:**
- Happy path: `BlockTimer` renders with a digit element whose computed font-size is 72 px.
- Edge case: Existing `block-timer-digits` and `block-timer-bar` testids still resolve.
- Edge case: The 3.5 s accent-flip still toggles `data-countdown` and `text-accent` color exactly as before (no regression in the countdown half).
- Integration: `RunScreen` cockpit footer layout still has `BlockTimer + RunControls + (optional wake-lock hint)` visible at 390 × 844 with no overlap.

**Verification:**
- `npm test` stays green (any existing `BlockTimer` snapshot or size assertion either still matches or gets updated to 72 px in the same unit).
- Manual screenshot at 390 × 844: live timer digits clearly larger than the 2026-05-24 baseline; cockpit footer not clipped.

---

- U7. **H2 experiment — Reduce active-run body density for segmented drills**

**Goal:** Stop the `courtsideInstructions` paragraph from competing with the `SegmentList` once the user is past the first segment in a segmented drill. First segment keeps the full READ-DO paragraph; segments 2+ route the paragraph into the existing `<details>` collapse.

**Requirements:** R7

**Dependencies:** U1

**Files:**
- Modify: `app/src/screens/RunScreen.tsx` — extend the gating on `hasVisibleSegmentInstructions` and `hasInstructionDetail` so that when the current segment index advances past 0, the inline paragraph routes through the existing `<details>` affordance instead of rendering inline above the `SegmentList`.
- Modify: the controller / view-model that exposes `currentSegmentIndex` to the screen (already exists per the existing render).
- Possibly modify: `app/src/screens/run/useRunController.ts` (or wherever the inline-vs-details routing decision is cleanest to express).
- Test: `app/src/screens/__tests__/RunScreen.*.test.tsx` — add a new test or extend an existing test that asserts the segment-index-gated inline render.

**Approach:**
- Compute a new boolean `inlineSegmentInstructionsVisible` = `hasVisibleSegmentInstructions && currentSegmentIndex === 0`.
- When `inlineSegmentInstructionsVisible` is true, render the `courtsideInstructions` paragraph inline (current behavior).
- When `hasVisibleSegmentInstructions && currentSegmentIndex > 0`, set `hasInstructionDetail` true (routing the paragraph into the `<details>` collapse with the existing `Show more cues and instructions` / `Show full instructions` label).
- This is a render-only change — no state, persistence, or routing impact. The `SegmentList` itself stays unchanged.
- The behavior auto-reverts on Pause / Resume because `currentSegmentIndex` rewinds at preroll boundaries; the implementer should confirm this is the desired behavior (paused state shows full READ-DO again) or scope-gate the change to running-only.

**Patterns to follow:**
- The existing `hasVisibleSegmentInstructions` / `hasInstructionDetail` / `hasInlineDetail` derivation block in `RunScreen.tsx` (lines ~98-108) — extend it, don't replace.
- The `<details>` affordance pattern + `inlineDetailSummaryLabel` function already in `RunScreen.tsx`.
- `.cursor/rules/courtside-copy.mdc` rule 13 (triple-only DO-CONFIRM readability) — this experiment aligns with the rule's intent.

**Test scenarios:**
- Happy path: For a segmented drill at `currentSegmentIndex === 0`, the `courtsideInstructions` paragraph renders inline above the `SegmentList`.
- Happy path: For the same drill at `currentSegmentIndex === 1` (or higher), the inline paragraph is gone and the `<details>` affordance shows `Show more cues and instructions` (or `Show full instructions`) wrapping the same `courtsideInstructions` text.
- Happy path: Tapping the `<details>` summary reveals the full `courtsideInstructions` text.
- Edge case: For a non-segmented drill (no `SegmentList` rendered), the behavior is unchanged from today — the `<details>` already handles its instruction-detail case.
- Edge case: For a drill with a single segment (segments.length === 1), the inline paragraph stays visible (the segment never advances past 0).
- Integration: Preroll → first segment → second segment transition triggers the routing flip exactly once when the index crosses 0 → 1.

**Verification:**
- `npm test` stays green; the new RunScreen test (or extended existing test) covers both segment-0 and segment-1+ render paths.
- Manual screenshot pair at 390 × 844 on a segmented drill (e.g., `d28-solo` Beach Prep Three) — segment 0 shows the paragraph + list; segment 1 shows the list + collapsed details.

---

- U8. **DOC canon-reconciliation pass on `brand-ux-guidelines.md`**

**Goal:** One editorial pass over `docs/research/brand-ux-guidelines.md` reconciling the eight DOC-drift rows the critique listed. Code is right; this updates the canon to match shipped behavior.

**Requirements:** R8, R10

**Dependencies:** U1 (the WIP already touched §2.1 / §2.2 for warning-strong; U8 must not conflict)

**Files:**
- Modify: `docs/research/brand-ux-guidelines.md` — eight section edits:
  1. §7.1 home wordmark: `text-lg` / 700 → `text-xl` / `font-semibold` (per shipped `HomeScreen.tsx:346`).
  2. §7.2 onboarding "Not sure yet": tertiary underline link → full focal card (field-validated — a tester missed the link; `SkillLevelScreen.tsx:145`).
  3. §7.4 Run h1: `text-2xl` / 700 → `text-xl` / `font-semibold` (per shipped `RunScreen.tsx:186`).
  4. §7.6 Review h1: `text-2xl` / 700 → `text-xl` / `font-semibold` (per shipped `ReviewScreen.tsx:89`).
  5. §7.6 RPE input: "0-10 chip grid" → 3-way `Easy / Right / Hard` (per shipped `RpeSelector.tsx`).
  6. §7.6 Review submit label: `Submit review` → `Done` (per shipped `ReviewScreen.tsx:211`).
  7. §7.7 Complete CTA: `Done` → `Back to home` (per shipped `CompleteScreen.tsx:427`; walkthrough P1-2).
  8. §7.7 Complete solo eyebrow: present → omitted on solo (intentional `Ma`; pair keeps it; per shipped `CompleteScreen.tsx:284`).
  9. §2.3 selected chip (M3): solid `bg-accent text-white` → soft `bg-info-surface text-accent`. Inline note: the 2026-05-04 setup-screen-polish ideation (`docs/ideation/2026-05-04-setup-screen-default-path-polish-ideation.md`) explicitly rejected reverting to solid-accent; this row records the shipped soft-selected treatment as the canon position.
- Modify: `docs/research/brand-ux-guidelines.md` frontmatter `last_updated: 2026-05-25`.
- Modify (if U5's canon note didn't already land): §7.x DrillCheck / post-block section — disabled-primary CTA reads low-emphasis until the capture chip is selected; do not promote it, do not demote the matching `Start next block` to match.

**Approach:**
- One editorial pass; preserve the existing prose voice and §-numbering.
- Cross-reference the 2026-05-04 ideation by stable doc path in the M3 row to anchor the rejection.
- Each row is a paragraph-level edit, not a structural one — the §-headings stay.
- After save, run `bash scripts/validate-agent-docs.sh`.

**Patterns to follow:**
- The `last_updated` bump pattern already used in the WIP's `brand-ux-guidelines.md` and `docs/design/README.md` diffs.
- `.cursor/rules/machine-scannable-docs.mdc` (real YAML frontmatter, cross-reference rather than duplicate).

**Test scenarios:**
- Edge case: `bash scripts/validate-agent-docs.sh` returns clean (the YAML frontmatter parses; no broken cross-refs).
- Edge case: A `grep` for `text-2xl` in §7.4 / §7.6 returns no matches (the prior canon claim is gone).
- Edge case: A `grep` for `bg-accent text-white` in §2.3 returns no matches as a *selected-chip* description (it may still appear as the primary-CTA description, which is correct).

**Verification:**
- `bash scripts/validate-agent-docs.sh` passes.
- Spot-read of §1.2 / §2.3 / §7 sections confirms the prose matches shipped behavior.

---

- U9. **Re-evaluate H1 / H2 experiments — viewport-bound assessment + decision note**

**Goal:** Same-PR closing note that captures the viewport-bound assessment of H1 (timer size) and H2 (active-run body density). The user explicitly asked for re-evaluation after experimenting; this is the artifact that records it.

**Requirements:** R9

**Dependencies:** U6, U7

**Files:**
- Create: `docs/design/reviews/2026-05-25-h1-h2-experiment-revaluation.md` (or append a section to the 2026-05-24 critique under `## Resolution update (2026-05-25, follow-up)` — pick one; the dated-review file is cleaner).
- Possibly modify: `docs/design/README.md` Reviews table to register the new file (if a separate file is chosen).
- Possibly modify: `docs/catalog.json` to register the new doc (per `.cursor/rules/machine-scannable-docs.mdc`).

**Approach:**
- Capture a side-by-side observation at 390 × 844: 2026-05-24 baseline screenshots (already in `docs/design/reviews/2026-05-24-agent-e2e-design-critique-screenshots/`) vs. fresh Playwright captures after U6 + U7.
- Three explicit deliverables in the note:
  1. **H1 assessment**: did 72 px hold the cockpit footer layout? Read as more legible at viewport-bound assessment? If yes, keep; if marginal, recommend 80 px in a follow-up. If it pushed content above the fold, U9 reverts to 64 px in the same PR and records why.
  2. **H2 assessment**: does the segment-1+ density read cleaner? Any segmented drills where the inline paragraph is load-bearing (e.g., `d28-solo` warmup pacing per the 2026-05-10 cadence-format extension)? If any, recommend a per-drill opt-out signal in a follow-up plan.
  3. **`D91` deferral re-statement**: viewport-bound assessment is not field-bound; durable keep/revert lives with the actual `D91` field run.
- The note is short — 1-2 screen-lengths max. Cite the original critique by ID.

**Patterns to follow:**
- The 2026-05-24 critique's `## Resolution update` block (same-day M1 / M2 fix record) as a template — that worked well and matches the user's evidence-first voice.
- `.cursor/rules/machine-scannable-docs.mdc` frontmatter (`id`, `title`, `status`, `stage`, `type`, `summary`, `authority`, `last_updated`, `depends_on`).
- `docs/design/README.md` Reviews-table registration pattern.

**Test scenarios:**
- Test expectation: none — this unit is pure documentation. No behavioral change.

**Verification:**
- `bash scripts/validate-agent-docs.sh` passes.
- `docs/design/README.md` Reviews table shows the new row (if a separate file was created).
- `docs/catalog.json` registers the new doc (if applicable).

---

## System-Wide Impact

- **Interaction graph:** Limited. H2 (U7) is the only unit touching the run-flow render path; the change is render-only and does not move state, services, or domain logic.
- **Error propagation:** U2 introduces a small helper in `lib/buildInfo.ts`; failures default to the raw value (current behavior) so no new error surface ships.
- **State lifecycle risks:** None. No persistence, schema, or routing changes.
- **API surface parity:** None. No public APIs, CLI flags, or env vars change.
- **Integration coverage:** The new RunScreen test in U7 is the only new integration-flavored coverage; the rest is unit / pure / docs.
- **Unchanged invariants:** Dexie schema stays at v6. `routePaths`, `screenContracts.ts` P12 entries, `SESSION_ASSEMBLY_ALGORITHM_VERSION` are all untouched. `D86` regulatory `copyGuard` voice is unaffected (every copy change goes through plain words: `Export`, `2+ days`, no new vocabulary).

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| H1 timer bump (U6) pushes the cockpit footer above the fold at 390 × 844. | U9 catches this in viewport-bound assessment; same-PR revert allowed. Implementer downgrades to 64 px if the 72 px target breaks layout. |
| H2 density gating (U7) hides load-bearing first-segment context on segmented drills with cadence-format prose (`d28-solo` warmup). | U9 catches in the side-by-side. Per-drill opt-out is named as a follow-up if the assessment surfaces a real problem; the U7 default keeps segment-0 paragraph visible specifically to avoid this. |
| Canon-reconciliation in U8 silently drifts back from shipped behavior because the prose was re-edited without grounding in code. | Each U8 row cites the shipped file + line; reviewer can spot-check each row against the cited surface. |
| The WIP commit (U1) bundles audit fixes with the bonus token cleanup + safety hint, making a future bisect harder. | Acceptable trade-off — the bonus items are audit-day coherent improvements; the commit message names them explicitly so bisect can still narrow to the file group. |
| Re-evaluation in U9 collapses into a fake-decisive note that papers over field-evidence absence. | U9 explicitly restates that viewport-bound assessment ≠ field-bound; `D91` keep/revert stays with the actual field run. |

---

## Documentation / Operational Notes

- `bash scripts/validate-agent-docs.sh` must pass after U1 (canon §2.1 / §2.2 partial), U8 (full canon pass), and U9 (new dated review).
- Cross-platform: this repo is WSL/bash-first per AGENTS.md; the implementer should not introduce PowerShell-flavored steps.
- Single-branch flow: every unit commits to `main` and pushes immediately. No long-lived feature branch.
- `docs/catalog.json` may need a new entry for U9's dated review; check via `.cursor/rules/machine-scannable-docs.mdc`.

---

## Sources & References

- **Origin document:** `docs/design/reviews/2026-05-24-agent-e2e-design-critique.md` (full e2e design + WCAG 2.1 AA critique at 390 × 844 production build).
- Related design canon: `docs/research/brand-ux-guidelines.md`, `docs/research/outdoor-courtside-ui-brief.md`, `docs/research/japanese-inspired-visual-direction.md`.
- Related copy canon: `.cursor/rules/courtside-copy.mdc` (rule 4 prose punctuation, rule 13 DO-CONFIRM density).
- Related ideation: `docs/ideation/2026-05-04-setup-screen-default-path-polish-ideation.md` (rejected solid-accent revert — informs U8 M3 row).
- Related prior review: `docs/design/reviews/2026-04-26-agent-ux-review.md`.
- Decisions referenced: `D86`, `D91`, `D125`, `D127`, `D129`, `D130`, `D132`, `D134`, `D137`.
- AGENTS contract: `AGENTS.md` Operational Constraints (single-branch flow).
