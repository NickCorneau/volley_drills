# feat: M002.2 technique-how — rung intent line on Transition

**Origin:** `docs/brainstorms/2026-06-22-m002-2-technique-how-transition-intent-requirements.md`
**Plan type:** feat · **Depth:** Lightweight
**Created:** 2026-06-22

## Summary

Render the authored per-rung `intent` string as a single quiet line on the **Transition** screen, naming what the upcoming drill's stress rung trains. It is the minimal first slice of M002.2's run-time technique-how half: one field (`intent`), one surface (Transition). The line shows only for ladder-bearing `main_skill` / `pressure` blocks that resolve to a pass/serve/set rung; it is silent (and Transition is byte-identical to today) for warmup/wrap/recovery/off-ladder blocks. Pure render-time read of already-authored static data — no Dexie/schema/route/assembly/adaptation/export change.

## Problem Frame

The four per-rung progression fields are authored in `app/src/data/stressLadders.ts`. `explorationCriterion` + `graduationFeel` render on Review (`D161`/`D162`); the two technique-how fields (`intent`, `externalFocusCue`) render nowhere. This slice ships `intent` on Transition — the READ-DO beat — because Run is the DO-CONFIRM cockpit (courtside-copy rule 12a: one cue at arm's length; the drill's `coachingCues[0]` already owns the "Now" line), so adding rung copy there would put two external-focus cues in competition. Transition has room to read before the rep starts. Founder steer this session: as minimal as possible — one field, one surface, extend after dogfood.

## Key Technical Decisions

- **`intent` only; Transition only.** `externalFocusCue` is held back (overlaps the drill's `coachingCues[0]`); Run + Drill Check are untouched (revisit after dogfood). See origin Fixed Decisions.
- **Per-block, drill-actual rung.** Resolve the rung the upcoming drill actually sits on via `getBlockSkillFocus(nextBlock, playerCount)` → `stressRungForDrill(focus, drillId)` → `getStressRung(focus, rung).intent`. No adaptation/offer/derived-position state is read — this is honest "this drill trains X."
- **Pure domain helper, thin screen.** Add `resolveBlockRungIntent(block, playerCount): string | null` to `app/src/domain/drillMetadata.ts`, beside the sibling `getBlockX` resolvers. The controller exposes a `string | null`; the screen renders it. No catalog/ladder lookup in JSX (data-access layer rules). Domain may import `data/stressLadders` (the established `progressionRead.ts` precedent).
- **Type bridge.** `getBlockSkillFocus` returns `EyebrowSkillFocus` and `stressRungForDrill` takes `StressLadderFocus`; both are `Extract<SkillFocus, 'pass'|'serve'|'set'>`, so the focus value passes directly without widening either type.
- **Null-safe, presentational.** Missing focus / off-ladder drill / unknown rung / absent `intent` → return `null`, render nothing, never throw (Transition renders in the run-flow body; a throw trips the app-root ErrorBoundary). No persisted state, no schema/route/assembly change (R6).
- **Placement.** Quiet unlabeled `text-sm text-text-secondary` line under the duration line, above the full `courtsideInstructions`. Plain text (no `GlossedText`) for this slice.

## Implementation Units

### U1. Pure domain resolver `resolveBlockRungIntent`

- **Goal:** Map a planned block + player count to its rung `intent` string, or `null` when the block is not ladder-bearing.
- **Requirements:** R2, R3, R4, R5, R7, R8.
- **Dependencies:** none.
- **Files:**
  - `app/src/domain/drillMetadata.ts` (add `resolveBlockRungIntent`)
  - `app/src/domain/__tests__/drillMetadata.rungIntent.test.ts` (new)
- **Approach:** Reuse `getBlockSkillFocus(block, playerCount)` for the primary focus (returns `null` for warmup/wrap/recovery/non-surfaced skills). When non-null, call `stressRungForDrill(focus, block.drillId)`; when that returns a rung, return `getStressRung(focus, rung)?.intent ?? null`. Guard the missing `drillId` case (return `null`). Keep the function pure (no React, no Dexie) — import `stressRungForDrill` / `getStressRung` from `../data/stressLadders`.
- **Patterns to follow:** the existing `getBlockSuccessRule` / `getBlockMetricType` / `getBlockSkillFocus` resolvers in the same file (same null-return contract, same variant/drill lookup grain).
- **Test scenarios** (domain tier):
  - Pass drill on a known rung (e.g. `d24` → pass rung 3) returns the pass rung-3 `intent` string. *(Covers AE1.)*
  - Set drill on rung 1 (`d38`) returns the **set** rung-1 `intent`, not a pass/serve string. *(Covers AE3.)*
  - Warmup/off-ladder block (no skill focus, e.g. `d28`) returns `null`. *(Covers AE2.)*
  - Block with a surfaced focus but a `drillId` absent from that focus's ladder returns `null` (no throw). *(Covers AE4.)*
  - Block with `drillId` undefined returns `null`.
  - Dual-focus drill (`d20`, primary `pass`) returns its **pass** ladder rung `intent` (primary-focus resolution). *(Covers AE5.)*
- **Verification:** new domain test passes; `getBlockSkillFocus` behavior unchanged.

### U2. Surface the line through the Transition controller and screen

- **Goal:** Expose the resolved line from `useTransitionController` and render it as a quiet line on `TransitionScreen`.
- **Requirements:** R1, R6, R8.
- **Dependencies:** U1.
- **Files:**
  - `app/src/screens/transition/useTransitionController.ts` (compute `rungIntentLine` from `nextBlock` + `plan.playerCount`; add to the return object)
  - `app/src/screens/TransitionScreen.tsx` (render the line under the duration `<p>`, above the `GlossedText` instructions)
  - `app/src/screens/__tests__/TransitionScreen.controller.test.tsx` (extend) or `app/src/screens/__tests__/TransitionScreen.rungIntent.test.tsx` (new)
- **Approach:** In the controller, derive `rungIntentLine = nextBlock ? resolveBlockRungIntent(nextBlock, plan?.playerCount ?? 1) : null` (mirror the `playerCount ?? 1` fallback the screen already uses for `getBlockSkillFocus`). Return it. In the screen, after the duration line inside the Up Next `div`, conditionally render `{rungIntentLine && <p className="text-sm text-text-secondary">{rungIntentLine}</p>}`. No label, no chrome.
- **Patterns to follow:** the screen's existing `getBlockSkillFocus(nextBlock, plan.playerCount)` eyebrow call (same focus source, so eyebrow + line never disagree); the existing quiet-secondary duration `<p>` for typography.
- **Test scenarios** (screen-integration / controller tier):
  - Next block is a ladder-bearing pass drill → the `intent` string is present in the rendered Transition body. *(Covers AE1.)*
  - Next block is warmup/off-ladder → no `intent` line renders; existing Up Next briefing is unchanged. *(Covers AE2.)*
  - Null-safe: a synthetic next block with an unknown drill renders Transition without throwing and without the line. *(Covers AE4.)*
- **Verification:** Transition renders the line for on-ladder next blocks and nothing for off-ladder ones; existing TransitionScreen tests stay green; `tsc` + lint clean.

## Scope Boundaries

### Deferred to Follow-Up Work

- `externalFocusCue` rendering; Run "Show more cues" disclosure treatment; Drill Check render; `GlossedText` treatment of the line. Revisit after dogfood (origin OQ2).

### Outside this product's identity (carried from origin)

- The "easing is legitimate" `less`-offer Review read and Safety-trace enrichment (separate named follow-ons, explicitly out of this pass).
- No raw rung numbers ever render (`D157`); the line is descriptive technique-how, not a graded/score signal (`D154`).

## Verification

- `cd app && npx tsc --noEmit` and `npm run lint` clean.
- `npm test` green, including the new U1 domain test and U2 Transition test.
- Founder dogfood watch (origin OQ1): does the line read as additive depth or redundant beside the drill's own copy on single-drill rungs?
- `bash scripts/validate-agent-docs.sh` passes (origin + plan are new durable docs).
