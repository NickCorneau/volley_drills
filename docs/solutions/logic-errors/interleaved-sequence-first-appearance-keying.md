---
title: "First-occurrence detection: a prev-block-only compare re-fires on interleaved (non-contiguous) sequences"
date: 2026-06-23
category: logic-errors
module: app/run-flow-block-opening-intent
problem_type: logic_error
component: service_object
symptoms:
  - 'The run-flow rung-intent ("what this rung trains") line re-appeared on a later Transition after a different-focus support block interleaved a focus run (focus sequence set, pass, set), violating the R6 "show once, then recede" contract'
  - 'Domain unit tests were green: they seeded simplified contiguous plans like [warmup, pass, pass] with no interleaving support slot, so the re-open path was never exercised'
  - 'Found only by adversarial code review reasoning about reachable block compositions, not by any failing test or user report'
root_cause: logic_error
resolution_type: code_fix
severity: medium
related_components:
  - testing_framework
  - frontend_stimulus
tags:
  - block-opening
  - first-appearance
  - prefix-scan
  - interleaved-sequence
  - run-flow
  - beat-contract
  - domain-predicate
  - d164
---

# First-occurrence detection: a prev-block-only compare re-fires on interleaved (non-contiguous) sequences

## Problem

The run-flow "beat contract" (D164, Stage 1) gates the rung `intent` line — the one-line "what this rung trains" technique-how note — so it shows **once** when a skill focus first appears in a session, then **recedes** for the rest of that focus run (requirement R6, "show once, then recede"). The first implementation decided "is this block the opening of a focus run?" by comparing the block against **only its immediately-previous neighbor**. When a different-focus block interleaves a run (focus sequence `set → pass → set`), the resumed `set` block looks different from its `pass` predecessor, so the predicate treats it as a fresh opening and **re-shows** the intent line that should have receded.

## Symptoms

- The rung-intent line re-appeared on a Transition after a support block of a different focus interleaved a focus run — the line was supposed to show once and recede.
- The domain unit suite was fully green: it seeded simplified contiguous plans (`[warmup, pass, pass]`) with no interleaving slot, so the re-open path was structurally unreachable in the tests.
- The defect surfaced only through adversarial code-review reasoning about which block compositions the session builder can actually emit — there was no failing test and no user report.

## What Didn't Work

- **Adjacent / immediately-previous-block compare.** The planned predicate was: a focus block opens at index `i` when `getBlockSkillFocus(blocks[i])` is non-null AND `(i === 0 || getBlockSkillFocus(blocks[i-1]) !== getBlockSkillFocus(blocks[i]))`. It is correct for strictly contiguous runs but wrong the moment a focus recurs non-contiguously.

```ts
// BEFORE — adjacent compare. Re-opens on set → pass → set.
function isFocusBlockOpening(blocks, i, playerCount) {
  const focus = getBlockSkillFocus(blocks[i], playerCount)
  if (!focus) return false
  // "did the focus change vs the previous block?" — only looks back ONE step
  return i === 0 || getBlockSkillFocus(blocks[i - 1], playerCount) !== focus
}
```

- **Trusting the "sessions are single-skill-chain" assumption.** Both the plan and the spec rested on "sessions are a single skill chain, so a focus runs contiguously." That premise is *mostly* true but not load-bearing-safe: `SessionPlan.blocks` is a flat ordered list with **no focus-group field**, and the builder can interleave focuses (see Why This Works). The assumption is exactly what made the adjacent compare look sufficient.
- **The initial review pass also missed it.** A first reviewer assumed the support slot (`movement_proxy`) inherits the session focus via `effectiveSkillTags`. Re-verification found the actual mismatch (slot-fill matches `skillFocus.includes(focus)`, but display reads `skillFocus[0]`), which is what makes a different-*primary*-focus drill land mid-run.

## Solution

Replace the prev-only compare with a **prefix scan**: a focus block opens only if **no earlier block in the whole session** already surfaced that same focus (first-appearance keying). This is the landed implementation in `app/src/domain/drillMetadata.ts`:

```ts
// AFTER — first-appearance keying via a prefix scan. Shows each focus once.
export function resolveBlockOpeningIntent(
  blocks: readonly (SessionPlanBlock | null | undefined)[] | null | undefined,
  index: number,
  playerCount: 1 | 2,
): string | null {
  const block = blocks?.[index]
  if (!block) return null
  const focus = getBlockSkillFocus(block, playerCount)
  if (!focus) return null
  // Has this focus appeared ANYWHERE earlier in the session? If so, this
  // block is not the run's opening — recede.
  for (let i = 0; i < index; i += 1) {
    if (getBlockSkillFocus(blocks?.[i], playerCount) === focus) return null
  }
  return resolveBlockRungIntent(block, playerCount)
}
```

The fix is paired with a **discriminating interleave regression test** (`app/src/domain/__tests__/drillMetadata.blockOpening.test.ts`) that fails against the adjacent-compare version and passes against the prefix scan:

```ts
it('does not re-open a focus when a different-focus support block interleaves the run', () => {
  // set → pass → set: the resumed set block (index 2) must NOT re-open.
  const blocks = [setOpen, passInterleave, setResume]
  expect(resolveBlockOpeningIntent(blocks, 0, 2)).toBeTruthy()   // set opens once
  expect(resolveBlockOpeningIntent(blocks, 1, 2)).toBeTruthy()   // pass opens its own focus
  expect(resolveBlockRungIntent(setResume, 2)).toBeTruthy()      // a real rung DOES exist...
  expect(resolveBlockOpeningIntent(blocks, 2, 2)).toBeNull()     // ...so null proves gating, not a missing rung
})
```

The last two assertions are the load-bearing pair: asserting the resumed block has a real non-null rung *and* that the opening helper returns `null` proves the suppression is the gate firing, not an accidentally-empty rung.

## Why This Works

A prev-only compare answers "did the value **change** since the last element?" — which is *not* the same question as "is this the **first** time this value has appeared?" The two coincide only when equal values are guaranteed contiguous. For ordered lists where a value can recur non-contiguously, you need state over the whole prefix (a scan or a `seen` set), not a single look-back.

The reason interleaving is reachable here (and not a synthetic edge) is a structural mismatch in how focus is computed on two different paths:

- **Slot filling** matches candidate drills with `skillFocus.includes(sessionFocus)` — a dual-focus drill qualifies for a slot if the session focus is anywhere in its `skillFocus`.
- **Display / gating** reads the drill's **primary** focus, `getBlockSkillFocus` → `skillFocus[0]`.

So a `['pass','set']` drill (e.g. `d20`/`d21`, primary `pass`) can be chosen to fill a technique/movement slot inside a named **set** session, and the same is true for `['pass','serve']` drills (`d08`/`d18`) in a serve session. The session's *primary-focus sequence* then reads `set → pass → set`, even though the builder considers it a single-chain set session. First-appearance keying is robust to that because it keys on "has this focus opened yet," independent of neighbor order.

## Prevention

- **When computing "first / new / changed" over an ordered collection, ask whether equal values are guaranteed contiguous.** If they are not (or you cannot prove it), use a prefix scan or a `seen` set, not a `prev !== current` compare. A prev-only compare is a latent bug the moment a value can recur non-contiguously.
- **Distrust "the data is always contiguous/sorted/single-chain" invariants that no type or field enforces.** Here the "single-skill-chain" premise had no structural guarantee (flat `blocks[]`, no focus-group field) and two code paths derived focus differently. Treat unenforced shape assumptions as review hazards.
- **Make the regression test an A-B-A interleave, and make it discriminating.** A contiguous-only fixture (`[warmup, pass, pass]`) passes against the buggy code, so it pins nothing. The test must (a) interleave a different value between two equal ones and (b) prove the suppressed case has a real positive value of its own, so a future "always null" mutation can't pass it.
- **Keep "compute focus" single-sourced.** The deeper cause was two derivations of focus (`includes` for selection vs `[0]` for display). When a property is computed on more than one path, mismatches like this become reachable; prefer one resolver both paths call.
- **Sync the canonical spec when the predicate changes.** See Related Issues — the contract doc still describes the adjacent compare.

## Related Issues

- **Stale canonical spec (action needed):** `docs/specs/run-flow-beat-contract.md` §"Block-Opening Rule" still documents the **adjacent-compare** predicate (`i === 0 || getBlockSkillFocus(blocks[i-1]) !== getBlockSkillFocus(blocks[i])`). The shipped code uses the prefix scan. The spec should be updated to first-appearance keying so the canonical contract matches reality.
- **Partially stale plan:** `docs/plans/2026-06-23-001-feat-run-flow-stage1-beat-contract-plan.md` U3 "Key Technical Decisions" + the mermaid flowchart still show the adjacent predicate; the post-ship residuals note (bottom of the plan) acknowledges the fix but the body is misleading for future readers.
- **Decisions:** `docs/decisions.md` — D163 (rung intent first placed on every ladder-bearing Transition) → D164 (beat contract Stage 1: gate to block-opening, "one home per field"). The opening semantics were corrected from adjacent-compare to first-appearance during D164's code review, pre-ship.
- **Code:** `app/src/domain/drillMetadata.ts` (`resolveBlockOpeningIntent`, with an inline rationale block), `app/src/domain/__tests__/drillMetadata.blockOpening.test.ts` (interleave regression), `app/src/screens/transition/useTransitionController.ts` (consumer → `rungIntentLine`).
- **Accepted edge (not solved here):** if a focus run's *opening* block is off-ladder (`intent` resolves `null`), the line stays null for the whole run even if a later same-focus block is on-ladder — tracked Stage-1 limitation (AE1).
- **Adjacent learning (prevention overlap only):** `docs/solutions/ui-bugs/torn-ui-read-from-mixing-live-state-with-effect-rebuilt-draft.md` — different bug class, but shares the discipline that a review-caught run-flow bug needs a discriminating, mutation-checked test.
