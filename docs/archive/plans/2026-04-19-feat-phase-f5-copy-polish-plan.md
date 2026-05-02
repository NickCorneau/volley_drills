---
title: "feat: Phase F5 copy polish for description consistency"
type: plan
status: landed
landed_on: 2026-04-19
date: 2026-04-19
origin: "User asked for a pass across the app to tighten long descriptions and keep lengths consistent screen-to-screen"
depends_on:
  - docs/archive/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md
  - docs/archive/plans/2026-04-19-feat-phase-f2-shared-focal-surface-plan.md
  - docs/archive/plans/2026-04-19-feat-phase-f3-warmer-page-surface-plan.md
  - docs/archive/plans/2026-04-19-feat-phase-f4-complete-forward-hook-plan.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/regulatory-boundary-pain-gated-training-apps.md
---

# Phase F5: Copy polish for description consistency

## Overview

Phase F5 tightens the four longest user-facing description strings across the app so screen-to-screen description length feels intentionally consistent, and replaces one awkward arrow-syntax phrase with natural prose. Pure copy change: no behavior, no schema, no tokens, no new controls.

The `SkillLevelScreen` four option descriptors (~30 characters each) are the implicit reference — they already show what restrained, evenly-paced description copy feels like. Phase F5 brings the other screens into the same family without rewriting anything the regulatory or safety contract depends on.

## Problem frame

A quick pass across every descriptive body-copy string in the app (section subheads, inline consequence lines, modal bodies, help text) surfaced four outliers that were noticeably longer than everything else and one phrase that used an awkward `->` arrow that doesn't match the app's natural-prose voice:

| Location | Before (chars) | Issue |
|---|---|---|
| `SettingsScreen` export body | 131 | Two sentences; the second (`Nothing leaves your device until you share the file.`) duplicates the footer copy and the three-state save copy that's already elsewhere. |
| `PainOverrideCard` body | 98 | Two sentences; `We've switched you to lower-load technique work today.` is partly redundant with the heading just above it (`Switched to a lighter session`). |
| `SafetyCheckScreen` recency subtext (both variants) | 42 / 56 | Uses `->` arrow syntax that reads as a diagram convention, not natural prose. Clashes with the natural-prose pattern everywhere else in the app. |
| `ResumePrompt` discard confirm body | 91 | Starts with `Discarding ends this session.` — the word `Discard` is already on the button above; the preamble adds nothing. |

The other long strings in the app (`CompleteScreen` three-state save copy per `D118`, `ReviewScreen` pass-metric forced-criterion prompt per `V0B-28`, `RunScreen` end-session-confirm body) are deliberately specific and load-bearing — Phase F5 leaves them alone.

## Scope boundaries

### In scope

- **Tighten `SettingsScreen` export body:** 131 → 61 chars. Drop the redundant second sentence.
- **Tighten `PainOverrideCard` body:** 98 → 52 chars. Drop the `We've switched you to` preamble (heading already says so); preserve wellness vocabulary (`lower-load technique work`, `skip`) per `D86`.
- **Rewrite `SafetyCheckScreen` recency subtext (both variants):** replace `->` arrow with `means a` natural prose. Keeps regex-compatible with the existing permissive test assertion.
- **Tighten `ResumePrompt` discard confirm body:** 91 → 70 chars. Drop the `Discarding` preamble.
- **Update one `SafetyCheckScreen` test regex** that previously required the literal `->` arrow; new regex stays permissive enough that future natural-prose rewrites won't break it.

### Out of scope

- `CompleteScreen` three-state save copy (`D118` / `V0B-24`). Load-bearing regulatory framing.
- `ReviewScreen` forced-criterion pass-metric prompt (`V0B-28`, `D104` three-layer bias correction). Explicitly specified to be literal and a little longer than average.
- `ReviewScreen` Finish Later countdown. Not noticeably long in any single case (~45–70 chars), and `formatFinishLaterWindow` is carefully structured per red-team UX #14.
- `RunScreen` end-session-confirm dialog body. Slightly long but context-specific (warmup vs remaining-blocks variants); flow-critical copy that deserves its space.
- `SoftBlockModal` body. Asks a clarifying question with the plan name inline; ~80 chars and reads cleanly.
- Any screen title or header casing. That's a separate design-system decision (sentence case vs title case) worth its own pass.
- Any copy that touches `D86` regulatory avoid-phrase list or the wellness vocabulary required by `docs/research/regulatory-boundary-pain-gated-training-apps.md`.

## Requirements trace

- R1. `SettingsScreen` renders `Downloads your session history as a JSON file you can share.` (61 chars, one sentence).
- R2. `PainOverrideCard` body renders `Lower-load technique work today. You can also skip.` (52 chars, two short clauses). Preserves the wellness vocabulary (`lower-load`, `skip`) and the voluntary-skip offer.
- R3. `SafetyCheckScreen` recency subtext renders:
  - existing-user variant: `0 days means a shorter, lower-intensity start.` (47 chars)
  - first-time variant: `0 days or First time means a shorter, lower-intensity start.` (61 chars)
- R4. `ResumePrompt` discard confirm body renders `Ends this session. Progress is saved to history but can't be resumed.` (70 chars).
- R5. `SafetyCheckScreen` existing-user test regex is updated from `/0 days\s+->\s+shorter.*lower-intensity start/i` to `/0 days\s+.*shorter.*lower-intensity start/i` (permissive middle, so future natural-prose rewrites don't need a new PR).
- R6. The `D86` `FORBIDDEN_RE` copy-guard regex (`compared|trend|progress|spike|overload|injury risk|baseline|early sessions|first \d+ days`) continues to match nothing in any rewritten copy. All Phase C / F copy-guard tests still pass.
- R7. No other tests need changes. The single `SafetyCheckScreen` test update is the whole test-side impact of F5.

## Key technical decisions

1. **Tighten the bodies, not the headings.** Every heading in the app is already ≤4 words (`Export training records`, `Switched to a lighter session`, `When did you last train?`, `Session in progress`). The body lines were the outliers; headings were not.
2. **Preserve meaning over every pure character count.** `PainOverrideCard` keeps `lower-load` (required D86 wellness vocabulary) and keeps the voluntary-skip offer (user-agency affordance). The first-time recency line keeps both `or First time` and `shorter, lower-intensity start` because both are content the tester needs, not padding.
3. **Natural prose beats diagram syntax.** `->` is a diagram convention that reads well in technical docs but looks mechanical inside a calm, outdoor-product UI. `means a` is the smallest natural-prose substitution that keeps the same conditional meaning.
4. **Regex permissiveness over string equality.** Updating the existing-user SafetyCheck test to `/0 days\s+.*shorter.*lower-intensity start/i` lets future copy rewrites land without breaking the assertion, provided the three key phrases stay in order.

## Implementation units

- [x] **Unit 1: `SettingsScreen` export body** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/screens/SettingsScreen.tsx`

  **Approach:**
  - Replace the two-sentence description with `Downloads your session history as a JSON file you can share.`

  **Verification:** eslint + vitest clean; no tests assert this copy.

- [x] **Unit 2: `PainOverrideCard` body** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/PainOverrideCard.tsx`

  **Approach:**
  - Replace the two-sentence body with `Lower-load technique work today. You can also skip.`
  - Verify D86 wellness vocabulary is preserved and the skip offer is not dropped.

  **Verification:** eslint + vitest clean; no tests assert this copy.

- [x] **Unit 3: `SafetyCheckScreen` recency subtext** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/screens/SafetyCheckScreen.tsx`
  - Modify: `app/src/screens/__tests__/SafetyCheckScreen.test.tsx`

  **Approach:**
  - Replace the two `->`-arrow variants with natural-prose `means a` variants.
  - Update the existing-user test regex from `/0 days\s+->\s+shorter.*lower-intensity start/i` to `/0 days\s+.*shorter.*lower-intensity start/i` (permissive middle).
  - Update the file's top-of-file docstring that cited the old copy.

  **Verification:** vitest clean; both the first-time and existing-user variant tests pass.

- [x] **Unit 4: `ResumePrompt` discard confirm body** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/ResumePrompt.tsx`

  **Approach:**
  - Replace the two-sentence body with `Ends this session. Progress is saved to history but can't be resumed.`

  **Verification:** vitest clean; only the `Reopen Session` button label is asserted anywhere and that's unchanged.

## System-wide impact

- **Interaction graph:** none.
- **Error propagation:** none.
- **State lifecycle:** none.
- **API surface parity:** none.
- **Integration coverage:** 67 Vitest files / 496 tests green after the one test-regex widening in `SafetyCheckScreen.test.tsx`.
- **Unchanged invariants:**
  - `D86` wellness vocabulary (`lighter`, `lower-load`, `skip`) preserved on every safety-adjacent surface.
  - `V0B-28` forced-criterion pass-metric prompt unchanged.
  - `D118` three-state save copy unchanged.
  - All outlines, primary CTAs, and modal shapes preserved.

## Risks and dependencies

| Risk | Mitigation |
|------|------------|
| Shortened `PainOverrideCard` body feels too terse on a safety-adjacent surface | The heading above it (`Switched to a lighter session`) still carries the full framing; the body now complements rather than echoes. Wellness vocabulary and voluntary-skip offer preserved. If field feedback says it reads too terse, add the "if you prefer" clause back — one-line change. |
| `0 days means a shorter, lower-intensity start.` reads slightly different in both variants | That's intentional. The first-time variant is slightly longer because it carries the `or First time` disjunction; the existing-user variant is tighter because its chip set excludes `First time`. The recency-filtering logic already ensures copy matches the rendered chip set. |
| Copy polish creates drift with the two existing Phase F plans (`F1`/`F2`/`F3`/`F4`) | Kept as a separate Phase F5 plan so the F1–F4 scope stories stay readable; `depends_on` links the chain. |
| Some future change restores the `->` arrow | The test regex still asserts `0 days ... shorter ... lower-intensity start` in order, so arrow-syntax would pass. Copy guidance in this plan discourages it. |

## Documentation / operational notes

- No release-note impact.
- No updates needed to `docs/catalog.json`, `AGENTS.md`, or the agent-doc routing surfaces.
- Future copy passes should reference this plan plus `docs/research/japanese-inspired-visual-direction.md` (restraint, natural prose) and `docs/research/regulatory-boundary-pain-gated-training-apps.md` (D86 wellness vocabulary).

## Sources and references

- `docs/archive/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md` through `-f4-complete-forward-hook-plan.md` — the surrounding calm pass; F5 completes the "consistent, restrained copy" side of the direction.
- `docs/research/japanese-inspired-visual-direction.md` — restraint / shibui framing.
- `docs/research/regulatory-boundary-pain-gated-training-apps.md` — wellness-vocabulary constraints preserved in the `PainOverrideCard` rewrite.
- `docs/lib/copyGuard.ts` (ref in repo) — `FORBIDDEN_RE` list that every Phase F copy change is cross-checked against.
