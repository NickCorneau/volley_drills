---
title: "feat: Phase F4 Complete forward-hook"
type: plan
status: landed
landed_on: 2026-04-19
date: 2026-04-19
origin: "Follow-on experiment to Phase F1 / F2 / F3 calm pass; addresses the 'no forward hook' gap flagged on CompleteScreen during the joy / trust / investment audit"
depends_on:
  - docs/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md
  - docs/plans/2026-04-19-feat-phase-f2-shared-focal-surface-plan.md
  - docs/plans/2026-04-19-feat-phase-f3-warmer-page-surface-plan.md
  - docs/specs/m001-review-micro-spec.md
  - docs/specs/m001-phase-c-ux-decisions.md
  - docs/research/japanese-inspired-visual-direction.md
---

# Phase F4: Complete forward-hook

## Overview

Phase F4 adds one short forward-looking sentence to the default summary reason on `CompleteScreen` so the post-session screen ends as a handoff rather than a flat past-tense verdict. The line is `"Ready when you are."` — calm, action-anchored, respects user agency, makes no claim the v0b adaptation engine can't back up.

Pure copy change inside the existing summary composer. No new routes, no new controls, no schema changes, no token changes. One constant added, three test assertions updated.

## Problem frame

The earlier joy / trust / investment audit flagged `CompleteScreen` as "no forward hook, ends flat." Looking at the three summary cases:

- **Skipped:** `"No review this time. Next session stays at the same level."` — already forward-looking ✓
- **Submitted + pain:** `"You stopped early with pain. Next session will be gentler to let things settle."` — already forward-looking ✓
- **Default / submitted:** `"Session N. X good passes today out of Y attempts."` — past-tense only ✗

The default case is the most common outcome — a submitted, non-pain session — and it's where the "end-of-session feels flat" complaint lands hardest. Phase F4 closes that gap inside the existing composer without adding any structural surface.

## Scope boundaries

### In scope

- Extend `composeDefaultReason` in `app/src/domain/sessionSummary.ts` to append `"Ready when you are."` to:
  - the `totalAttempts === 0` (recovery / notCaptured) sub-case
  - the `totalAttempts >= 50` / "normal N" sub-case
  - the `goodPasses === 0 && totalAttempts > 0` sub-case
- Leave the low-N bootstrap sub-case unchanged — it already carries its own forward-looking line (`"Just getting started. I'll start tuning once you have a few more in the book."`).
- Leave the skipped and pain cases unchanged — both already forward-looking.
- Update the three affected assertions in `app/src/domain/sessionSummary.test.ts`.

### Out of scope

- The `Done` button text. Terminal and calm, leave as-is.
- Any new next-step surface, queue preview, or secondary CTA on `CompleteScreen`. Those are `M002 Weekly Confidence Loop` scope (`docs/milestones/m002-weekly-confidence-loop.md`).
- Any promise that the v0b adaptation engine will make a specific change — the engine doesn't fire in v0b (`D-C2`, `D122`). The hook stays generic.
- Analytics / telemetry on whether the hook increases Home return rate.

## Requirements trace

- R1. `FORWARD_HOOK = 'Ready when you are.'` is a module-local constant in `sessionSummary.ts`, commented with the rationale (joy / trust / investment posture, respects user agency, does not overpromise adaptation).
- R2. `composeDefaultReason` appends `FORWARD_HOOK` to the three default sub-cases listed above.
- R3. `composeDefaultReason` does NOT append `FORWARD_HOOK` to the low-N bootstrap sub-case — that sub-case has a more specific forward-looking line (`"I'll start tuning once you have a few more in the book."`) that explains what changes next at the engine level.
- R4. The new copy passes the existing `FORBIDDEN_RE` copy-guard regex (`docs/lib/copyGuard.ts`: `compared|trend|progress|spike|overload|injury risk|baseline|early sessions|first \d+ days`).
- R5. Three existing tests in `sessionSummary.test.ts` are updated to expect the new suffix; the property test (status × incompleteReason → exactly one case) and the copy-guard regex test remain unchanged and pass.
- R6. `CompleteScreen` itself is not modified; it already renders `summary.reason` as a paragraph.

## Key technical decisions

1. **Generic hook, not adaptive copy.** The adaptation engine (`D104`, `D113`) doesn't fire in v0b. A default-case line like `"Next session stays the same"` would read as a promise the engine isn't making yet, and a line like `"We'll tune next time"` would violate the D86 avoid-phrase posture on overpromise. `"Ready when you are."` is calm, honest, and forward-looking without claiming engine behavior.
2. **Phrase chosen for tone, not persuasion.** The Japanese-inspired visual direction calls for restraint. `"Ready when you are."` respects user agency (no "come back tomorrow" nudging), matches the shibui posture, and stays short enough to sit under the existing reason line without layout impact.
3. **Append at composer layer, not render layer.** Putting the hook inside `composeDefaultReason` keeps the `CompleteScreen.summary.reason` structure intact (one string in, one string out), and the existing copy-guard regex + property test cover the new copy automatically.
4. **Low-N case keeps its bespoke hook.** The bootstrap line explains what changes next at the engine level (`"I'll start tuning once you have a few more in the book."`). Swapping it for the generic hook would be a regression — the bootstrap hook is already stronger than F4's generic one and is earned by the low-N condition.
5. **No change to skipped or pain cases.** Both already have forward-looking sentences that are specific to their verdict ("Next session stays at the same level" / "Next session will be gentler to let things settle"). Replacing them with the generic hook would flatten meaningful differentiation.

## Implementation units

- [x] **Unit 1: Append `FORWARD_HOOK` inside `composeDefaultReason`** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/domain/sessionSummary.ts`

  **Approach:**
  - Add the `FORWARD_HOOK` constant above `composeDefaultReason` with inline commentary on rationale and copy-guard compliance.
  - `totalAttempts === 0`: return `Session N. One more in the book. Ready when you are.`
  - `totalAttempts >= 50` OR `goodPasses === 0`: return `Session N. X good passes today out of Y attempts. Ready when you are.`
  - `totalAttempts < 50 && goodPasses > 0`: unchanged — keep the existing `"Just getting started. I'll start tuning…"` bootstrap line.

  **Verification:**
  - `npm run lint` clean.
  - 67 Vitest files / 496 tests green after the test update below.

- [x] **Unit 2: Update the three affected default-case test assertions** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/domain/sessionSummary.test.ts`

  **Approach:**
  - Update three assertions in the `Case C (default)` describe block: the high-N canonical, the `goodPasses === 0` sub-case, and the `totalAttempts === 0` (notCaptured) sub-case all expect `. Ready when you are.` as the suffix.
  - Leave the low-N bootstrap assertion, the pain assertion, and the skipped assertion untouched.
  - Leave the property test (status × incompleteReason enumeration) and the copy-guard regex test untouched.

  **Verification:**
  - Vitest green across the full suite.
  - Copy-guard regex test still passes — `"Ready when you are."` is entirely outside the avoid-phrase list.

## System-wide impact

- **Interaction graph:** none. `CompleteScreen`'s render surface is unchanged.
- **Error propagation:** none.
- **State lifecycle:** none.
- **API surface parity:** none. `composeSummary` signature and return shape unchanged; `summary.reason` is still one string.
- **Integration coverage:** existing 496 tests pass. The regex guard in the final describe block of `sessionSummary.test.ts` still runs on all cases and covers the new hook for free.
- **Unchanged invariants:**
  - Minimum-honest summary posture (`D-C2`, `H10`): still 3 cases, still no engine-claim language.
  - Copy-guard regulatory posture (`D86`, `V0B-18`): `"Ready when you are."` does not match any avoid phrase.
  - `CompleteScreen` inverted-pyramid layout and save-status display (`D118`).

## Risks and dependencies

| Risk | Mitigation |
|------|------------|
| `"Ready when you are."` reads as too casual / too forward for a safety-adjacent training product | Phrase is short, calm, and non-persuasive. Sits *after* any pain or "Lighter next" reason line (those cases don't receive it — they have their own bespoke forward-looking sentences). |
| Future adaptation engine lights up and the generic hook undercuts a specific recommendation | When `M001-build` adaptation fires, replace the generic hook in the default case with engine-driven forward-looking copy. The single-constant location (`FORWARD_HOOK` in `sessionSummary.ts`) makes that a one-line change. |
| Localization later adds work | The hook lives in one place in the composer; localization of summary copy is already anticipated as one of those "pending i18n" items, and this line adds one more entry to whatever string table eventually replaces the composer. |

## Documentation / operational notes

- No release-note impact.
- If a tester dogfeed pass suggests the phrase feels off, iteration is one-line: change `FORWARD_HOOK` and three test strings.
- No changes to `docs/catalog.json`, `AGENTS.md`, or agent-doc routing surfaces.

## Sources and references

- `docs/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md`, `docs/plans/2026-04-19-feat-phase-f2-shared-focal-surface-plan.md`, `docs/plans/2026-04-19-feat-phase-f3-warmer-page-surface-plan.md` — the surrounding calm pass.
- `docs/specs/m001-review-micro-spec.md` — review payoff contract ("Review is not only data capture. It must feel worth doing.").
- `docs/specs/m001-phase-c-ux-decisions.md` Surface 5 — 3-case summary matrix; Phase F4 adds copy inside Case C only.
- `docs/research/japanese-inspired-visual-direction.md` — shibui / restraint; jo-ha-kyu (open, build, close cleanly) applied to the summary line.
- `docs/research/regulatory-boundary-pain-gated-training-apps.md` — avoid-phrase list; new hook is outside it.
