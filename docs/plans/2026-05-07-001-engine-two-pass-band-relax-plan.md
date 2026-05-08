---
id: engine-two-pass-band-relax-plan-2026-05-07
title: "Engine Two-Pass Band Relax in pickForSlot"
type: refactor
status: complete
stage: validation
date: 2026-05-07
last_updated: 2026-05-07
origin: docs/plans/2026-05-05-001-merge-focus-coverage-and-collapse-branches-plan.md
authority: "Implementation plan for the engine-only restoration of the two-pass band relax in `pickForSlot`. Closes the 'skill-stuff' merge follow-up left by the 2026-05-05 collapse plan."
depends_on:
  - docs/plans/2026-05-05-001-merge-focus-coverage-and-collapse-branches-plan.md
  - docs/plans/2026-05-06-001-refactor-d137-tune-today-routing-cleanup-plan.md
  - docs/decisions.md
  - docs/status/current-state.md
summary: "Restore the pre-merge engine intent that an out-of-band UNUSED same-focus drill is preferred over duplicating an in-band drill on a focus-controlled required slot. Engine-only: D137 still owns the 'no levelRelaxed UI' decision."
---

# Engine Two-Pass Band Relax in pickForSlot

## Summary

The 2026-05-05 merge of `feat/focus-coverage-readiness` overwrote the pre-merge two-pass behavior in `pickForSlot` and `pickMainSkillSubstitute` with a hard `playerLevel` filter. `D137` then retired the user-visible `levelRelaxed` eyebrow, deliberately leaving the engine question open: does the hard filter silently produce thin sessions for the narrow `competitive_pair × serve` cell?

Investigation confirmed yes — on paper. The audit reports 180/180 cells "covered," but 18 cells (every `serve × competitive_pair` configuration) sit at the absolute coverage floor of 2 in-band main drill families, and a traced sample session silently picks the same drill twice across `technique` and `main_skill`. No founder-ledger complaint has fired because no `competitive_pair × serve` session has been logged yet.

This plan restores the engine intent without reintroducing any UI surface: when a focus-controlled REQUIRED slot has exhausted its in-band UNUSED pool, prefer an out-of-band UNUSED drill of the same focus over duplicating an in-band drill. `D137` is unchanged — there is still no `levelRelaxed` eyebrow, no copy hint, and no tune-today re-route.

---

## Problem Frame

Two ways the post-merge hard filter degrades the courtside experience:

1. **Silent duplication.** `competitive_pair × serve × pair_open × 25-min` resolves to `playerLevel: 'advanced'`. The advanced-band serve drill set is `{d22, d33}` (d23 is `m001Candidate: false`, d51 is gated to `main_skill` only). The required pass picks `d22` for technique and the only remaining in-band `d33` for main_skill — fine. The optional `movement_proxy` and `pressure` slots silently drop because both in-band drills are now used and `allowUsedFallback: false`. A 25-min session ships short. A 40-min session in the same cell trades that drop for a duplicate when the layout has more required focus-controlled slots than in-band drills.
2. **Hard build failures on hot edges.** When all in-band candidates have already been used by earlier required slots in the layout, the old code's fallback was to shuffle from `candidates` (now empty after the band filter) — `pool.length === 0` returns `undefined`, and the entire build returns `null`. Rare, but a real production cliff.

Neither has fired in the founder ledger yet, but the audit numbers and a trace-by-hand both confirm the failure mode is reachable, and the partner-walkthrough cell that surfaces it (`competitive_pair × serve`) has not yet been visited.

---

## Requirements

**Engine behavior**
- R1. `pickForSlot`, when called on a focus-controlled slot with `playerLevel` set, MUST prefer out-of-band UNUSED candidates of the same focus over in-band USED candidates when the in-band UNUSED pool is empty.
- R2. The relax MUST NOT fire for non-focus-controlled slots (warmup, wrap), preserving their non-focus-aware behavior.
- R3. The relax MUST NOT fire when an in-band UNUSED candidate exists. No degradation of the happy path.
- R4. Optional slots (`allowUsedFallback === false`) MUST still return `undefined` when the in-band UNUSED pool is empty. The relax does not silently rescue optional slots; that is a session-builder policy choice we are not changing here.
- R5. The relax MUST share its band-membership predicate with the audit. `partitionByLevel` is the single source of truth.

**No UI surface**
- R6. No `levelRelaxed` eyebrow, no copy hint, no toast, no metadata flag on the block. The relax is invisible to the courtside reader. `D137` is preserved.

**Test coverage**
- R7. A unit test pinning the positive path: in-band exhausted ⇒ out-of-band same-focus drill returned.
- R8. A unit test pinning the negative path: in-band still has an unused drill ⇒ no relax, deterministic in-band pick.
- R9. A unit test pinning the optional-slot guard: `allowUsedFallback: false` ⇒ `undefined`, even when the relax could have rescued the slot.

**No regressions**
- R10. The full test suite continues to pass (the 2133 tests already in the repo).
- R11. The pinned `'advanced-serving-pair-open'` build still places `d22` or `d33` at `main_skill`. Out-of-band drills only appear when the in-band pool was already consumed.
- R12. The 2026-05-04 focus-coverage audit snapshot remains at 180/180 covered.

**Documentation surface**
- R13. `docs/status/current-state.md` records the merge follow-up as resolved and adds a Recent Shipped History entry.
- R14. `docs/plans/2026-05-05-001-merge-focus-coverage-and-collapse-branches-plan.md` updates the "skill-stuff" follow-up status from open to resolved with a back-pointer to this plan.
- R15. `partitionByLevel.ts`'s doc-comment is refreshed so it lists current consumers (audit + relax pass) rather than the pre-merge two-pool prose.
- R16. `docs/catalog.json` registers this plan.

---

## Approach

### Single change site

`pickForSlot` in `app/src/domain/sessionAssembly/candidates.ts` owns the entire engine-side change. The new logic:

```
candidates = findCandidates(slot, context, options)
unused = candidates - usedDrillIds

if unused empty AND allowUsedFallback === false:
  return undefined                                  # unchanged

if unused not empty:
  pool = shuffle(unused)                            # unchanged happy path
elif playerLevel set AND focus-controlled slot:
  widerContext = { ...context, playerLevel: undefined }
  wider = findCandidates(slot, widerContext)        # no band filter
  outOfBand = partitionByLevel(wider, playerLevel).outOfBand
  widerUnused = outOfBand - usedDrillIds
  pool = shuffle(widerUnused) if widerUnused else shuffle(candidates)
else:
  pool = shuffle(candidates)                        # unchanged

# unchanged downstream: duration-fit reroute + slot-type preferences
```

`partitionByLevel` is the band-membership primitive. `effectiveLevel` is not touched here — the caller still resolves `SkillLevel → PlayerLevel` upstream (in `SetupScreen.tsx`).

`pickMainSkillSubstitute` is intentionally NOT changed. Substitution rules key on drill ID; if the substitute is out-of-band the rule was authored to fail closed there. We do not promote the user past their band via a substitution rule; that is a band-policy change, not a duplicate-avoidance change.

`findSwapAlternatives` is intentionally NOT changed. Mid-run swap is user-initiated and the existing focus-relax fallback already handles the no-alternative cliff.

### Why suppress `context.playerLevel` too

`findCandidates` resolves `effectivePlayerLevel = options.playerLevel ?? context.playerLevel`. Production paths pass `playerLevel` only via options, but tests (and any caller carrying a saved level forward) sometimes set it on the context. Stripping only the option leaves the band filter on and the relax silently no-ops. Cloning the context and deleting `playerLevel` is the same pattern `findSwapAlternatives` uses for its `sessionFocus` strip.

### Test surface

Three tests added to `app/src/domain/sessionBuilder.test.ts` next to the existing `'advanced serving focus can build a pair open 40-minute practice'` test, since they share a fixture context and are easier to read against the existing pinned cases:

- **Positive (R7).** technique slot, advanced serve focus, `usedDrillIds = {d22, d33}`, `allowUsedFallback: true` ⇒ pick is not in `{d22, d33}` and `skillFocus.includes('serve')`.
- **Negative (R8).** Same slot, `usedDrillIds = {d22}` ⇒ pick is `d33` exactly.
- **Optional-slot guard (R9).** `movement_proxy` slot, `usedDrillIds = {d22, d33}`, `allowUsedFallback: false` ⇒ pick is `undefined`.

---

## Acceptance Criteria

- [x] R1 / R2 / R3 / R4 / R5: engine change in `pickForSlot` only; `partitionByLevel` shared with audit; non-focus and optional slots untouched.
- [x] R6: no UI / metadata surface on blocks. `D137` preserved.
- [x] R7 / R8 / R9: three unit tests added and passing.
- [x] R10: full suite green (2133 tests).
- [x] R11: `'advanced-serving-pair-open'` pinned build still asserts `['d22', 'd33']` at `main_skill`.
- [x] R12: focus-coverage audit snapshot unchanged at 180/180 covered.
- [x] R13 / R14 / R15 / R16: status, merge plan, doc-comment, and catalog updated.

---

## Out of Scope

- **Backfilling out-of-band drills with band-bridging metadata.** The relax pulls the existing same-focus pool unchanged. If a band-bridging drill needs a different label or session-time-only modification, that is a future drill-authoring change.
- **Reintroducing `levelRelaxed`.** `D137` retired the eyebrow; this plan does not reverse that. If a future partner walkthrough surfaces "I expected this drill to be harder," the response will be a content-side fix (drill addition or band re-band), not a UI surface.
- **Rewriting `pickMainSkillSubstitute` or `findSwapAlternatives`.** Substitution and swap have their own focus-relax shapes; this plan only changes the default selection path.
- **Relaxing across focus.** The relax stays within the same `effectiveSkillTags`. A `serve` session is still a serve session even when relaxed.

---

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Out-of-band drill copy reads as "easy" to a competitive partner | The relax fires only on a thin cell; the alternative is silent duplication, which reads worse. Real ledger data will tell us if a band-bridging copy fix is needed before any UI surface. |
| Future caller sets `playerLevel` on context AND forgets options | `widerContext` strips both. Tested via the unit tests, which set `playerLevel` on the context exactly to expose this case. |
| Audit and engine drift on band predicate | Both consume `partitionByLevel`. Doc-comment now lists current consumers; future band-rules changes propagate through one file. |

---

## Verification

- `npm run typecheck` — green.
- `npm run lint` — green.
- `npm run test -- --run` — 151 files / 2133 tests passing.
- `bash scripts/validate-agent-docs.sh` (after the doc edits) — green.
