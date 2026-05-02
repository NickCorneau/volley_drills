---
id: v0b-starter-loop-feedback
title: "v0b Starter Loop: Field-Look Feedback"
status: active
stage: validation
type: research-synthesis
authority: living log of v0b Starter Loop UX feedback from non-developer testers; stable IDs for findings and their resolution status
summary: "Non-developer field-look reactions to the v0b Starter Loop build, captured between the 2026-04-17 feature-complete mark and the D91 cohort kickoff."
last_updated: 2026-04-19
depends_on:
  - docs/milestones/m001-solo-session-loop.md
  - docs/plans/2026-04-16-003-rest-of-v0b-plan.md
  - docs/specs/m001-review-micro-spec.md
  - docs/specs/m001-courtside-run-flow.md
  - docs/research/product-naming.md
  - docs/research/2026-04-12-v0a-runner-probe-feedback.md
decision_refs:
  - D104
  - D125
open_question_refs: []
---

# v0b Starter Loop: Field-Look Feedback

## Agent Quick Scan

- **What this is:** Living log of non-developer reactions to the v0b Starter Loop build. Sibling to `docs/research/2026-04-12-v0a-runner-probe-feedback.md` (v0a probe), scoped to post-rename v0b.
- **Why it matters:** Non-player first-look feedback is a useful control signal alongside the upcoming D91 cohort. It surfaces copy / UX legibility bugs the developer cannot see and positive signals that are otherwise invisible.
- **How to use it:** Read the newest dated entry first when findings conflict. Treat `Ship` rows as closed once the referenced commit lands and the spec / canon is synced.
- **Current state (as of 2026-04-19):** One non-player first-look session captured. Two real copy / UX bugs surfaced and fixed in the same pass. Three positive signals captured for D91 debrief reference.
- **Not this doc for:** v0a runner-probe retest evidence (that's `2026-04-12-v0a-runner-probe-feedback.md`), D91 cohort protocol (`docs/research/pre-telemetry-validation-protocol.md`), or the naming rubric behind *Volleycraft* (`docs/research/product-naming.md`).

## Stable-ID convention

Findings use `VB-FL-NN` IDs so they can be cited from commits, specs, and later debriefs without colliding with the v0a `FB-NN` range. `FL` = field look. Increment `NN` monotonically across all entries in this file.

---

## Entry: 2026-04-19 — Emilie (non-player spouse, general impressions)

### Context

Unsolicited post-use feedback from a non-volleyball-playing spouse after a casual walk-through of the v0b build on 2026-04-19. Tester is not a beach volleyball player; she was giving design / idea-level impressions, not a competence-based field test. The build she saw was the v0b Starter Loop at Phase F11 (`docs/plans/2026-04-16-003-rest-of-v0b-plan.md` §6). The app was in the process of renaming *Volley Drills → Volleycraft* (`D125`, `docs/research/product-naming.md`), and it is not confirmed whether she ran the pre-rename or post-rename wordmark.

This is **not** D91 evidence. It is a control-group first-look reaction, useful as a legibility probe against the cohort and as a source of small copy / UX defects that a courtside tester may not surface because they are wrapped up in the activity.

### Findings

| ID        | Observation                                                                                                                                                                                                                                                                            | Severity | Disposition              | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VB-FL-1` | **"If unsure, count it as Not Good" implies a phantom button.** The ReviewScreen pass-metric card presents a forced-criterion prompt ending with the instruction `count it as Not Good`, but the only controls on the card are two numeric cells labeled Good and Total. Tester went looking for a Not Good button and was confused when none existed. | P1       | **Fixed 2026-04-19**     | Reformulated to `If unsure, don't count it as Good.` in `app/src/screens/ReviewScreen.tsx`. Preserves `V0B-28` / `D104` layer-1 forced-criterion anti-generosity nudge (still explicit, still a prompt following the one-sentence success rule) while matching the actual affordance. Spec updated: `docs/specs/m001-review-micro-spec.md` §Required. `BinaryPassScore = 'good' \| 'not-good'` internal vocabulary is unchanged — only the user-facing clause's wording changed. |
| `VB-FL-2` | **Swap-induced pause reads as "the timer is broken."** Phase F Unit 4 Swap deliberately pauses the timer when the tester swaps the active drill (`app/src/hooks/useSessionRunner.ts` `swapBlock`, `app/src/screens/RunScreen.tsx` `handleSwap`) so the tester doesn't burn block time on a stale drill display. The "Paused" pill on `BlockTimer` was the only cue that the pause had happened. The tester did not connect her Swap action to the stopped timer and described having to "go to pause and unpause" before the timer picked back up. | P2       | **Fixed 2026-04-19**     | Added an actionable subtitle to the paused state in `app/src/components/BlockTimer.tsx`: `Tap Resume to continue.` Generic across all pause triggers (Swap, Shorten, explicit Pause) so no pause-reason state needs to be tracked. The F4 design intent (Swap auto-pauses to protect block-time integrity) is preserved; only the cause/effect legibility changed.                                                                                                                                                                                              |
| `VB-FL-3` | **"Volley" brand word vacuum on first hearing.** Tester volunteered `War Volley`, `Volley`, and `Volleys` as naming suggestions, referencing a volleyball book she is reading that uses the *volley* vocabulary. She did not articulate a rejection of *Volleycraft*; the reach for the bare noun is consistent with either pre-rename `Volley Drills` confusion (T1 fail: "names the inventory, not the product") or post-rename unfamiliarity with the new wordmark. | P3       | **No rename; tagline signal.** | The 13-test rubric in `docs/research/product-naming.md` rules `Volley` (T5 distinctiveness fail, T6 SERP contested), `War Volley` (T4 voice fail — martial), and `Volleys` (T5 fail). Tester's instinct is still useful as a tagline / subhead signal: a one-line descriptor that honors the "practice / volleys / logged" vocabulary without reopening `D125`. Not an action item for v0b; flagged for the post-`D91` brand pass. |
| `VB-FL-7` | **Swap lands on a drill identical to the next (or previous) plan block.** Mid-run Swap cycles the ranked alternate list (`findSwapAlternatives`), which previously only excluded the *current* block's drill name. Nothing prevented the pick from matching the immediately-next block, so a tester could tap Swap and watch the same drill render twice in a row across the transition. Tester reported tapping Swap and landing on the same drill as the upcoming block (example: swapped into "Six-Legged Monster" while the next plan block was also "Six-Legged Monster"). | P2       | **Fixed 2026-04-19**     | Extended `findSwapAlternatives` in `app/src/domain/sessionBuilder.ts` with an optional `excludeDrillNames` set and wired `useSessionRunner.swapBlock` to pass `plan.blocks[activeBlockIndex ± 1].drillName`. Falls back to base exclusion when the tight pool (e.g., solo+wall with only 2 eligible drills) would empty the candidate list — landing on a neighbor is better than no-op. Current-drill exclusion is never relaxed. Five new unit tests cover the exclusion, the fallback, the current-drill invariant, and the no-op cases (empty / undefined options). |

### Positive signals (first-hearing, unsolicited)

These are control-group signals the D91 cohort will either corroborate or contradict. They matter more because they were **volunteered in the same breath as the complaints** — signal that the tester was actually paying attention and not performing approval.

| ID        | Signal                                                                                                                              | Why it matters                                                                                                                                                                                                                                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VB-FL-4` | Colors are landing. Tester called the palette out without prompting.                                                                | Phase F1 Japanese-inspired calm pass (`docs/archive/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md`) + warm-vermilion brandmark is connecting on a non-player eye. Useful evidence that the restraint direction is not reading as flat or undesigned. No action; log so the D91 debrief has a reference point.                           |
| `VB-FL-5` | The in-app log / comment capture is landing as a feature, not as chrome.                                                             | The tester specifically praised being able to "keep a log of your comments too." The Quick tags + optional note in ReviewScreen is the review-surface affordance most at risk of being invisible to testers who just want to submit and go. A non-player calling it out unprompted is the best available evidence that the surface is legible. |
| `VB-FL-6` | Pause / resume / next / adjust-as-you-go is registering as flexibility, not friction.                                                | The tester praised the mid-run affordances (`Pause`, `Resume`, `Next`, `Shorten`, `Swap`) as a coherent set. This is the part of the run flow most at risk of being perceived as a "rigid workout app" vs a "considerate coach." Non-player read that it's flexible is signal that the F4 Swap + D-C7 end-early handling are paying off. |

### Actions taken in this pass

- **Code:** `app/src/screens/ReviewScreen.tsx` — reformulated the `V0B-28` anti-generosity clause (`VB-FL-1`).
- **Code:** `app/src/components/BlockTimer.tsx` — added the `Tap Resume to continue` subtitle to the paused state (`VB-FL-2`).
- **Code:** `app/src/domain/sessionBuilder.ts` + `app/src/hooks/useSessionRunner.ts` — `findSwapAlternatives` now accepts an `excludeDrillNames` option; `swapBlock` passes the adjacent plan blocks' drill names so Swap can't land on a drill identical to the next or previous block (`VB-FL-7`). Fallback preserves the existing behavior when the pool is too tight to satisfy neighbor exclusion.
- **Tests:** `app/src/domain/__tests__/findSwapAlternatives.test.ts` — five new cases covering neighbor exclusion, the fallback branch, the current-drill invariant, and the no-op (empty / undefined) options paths.
- **Docs:** `docs/specs/m001-review-micro-spec.md` — updated the Required-fields clause that mandates the exact V0B-28 phrase so the spec matches shipped copy.
- **Docs:** this file created; `docs/catalog.json` and `docs/research/README.md` updated to register the new research note per the machine-scannable-docs rule.

### Not acted on (deliberately)

- **`VB-FL-3` rename reconsideration.** `D125` is not reopened. The 13-test rubric in `docs/research/product-naming.md` is the bar; tester's specific suggestions do not beat it. Tagline / subhead work is a separate post-`D91` artifact.
- **Swap redesign (remove auto-pause).** The F4 intent — that Swap protects block-time integrity by pausing — is sound. The fix to `VB-FL-2` is legibility, not behavior change. Revisit only if the D91 cohort reports the auto-pause as friction rather than helpful.

### What to watch in the D91 cohort

- Do cohort testers also bounce off the `Not Good` / `Don't count it as Good` instruction, or does a player's existing mental model of a "good pass" carry the forced-criterion prompt without needing the negative clause at all?
- Does the `Tap Resume to continue` subtitle remove the Swap-pause surprise, or does the auto-pause behavior itself need to go?
- Do cohort testers volunteer the log / comment capture (`VB-FL-5`) as useful, or does it read as overhead once the tester is tired?
- With the `VB-FL-7` neighbor exclusion in place, do cohort testers still surface Swap-picks-a-repeat complaints? If yes, the next layer is probably widening the "neighbor" window past `±1` (e.g., the whole session's remaining blocks) or adding a "same drill family" notion above raw drill-name equality.

## For agents

- **Authoritative for:** stable IDs for v0b Starter Loop field-look findings, their resolution status, and the positive-signal control set.
- **Edit when:** a new non-developer or non-cohort tester surfaces usable feedback on the v0b build, or a `VB-FL-NN` finding's disposition changes.
- **Belongs elsewhere:** v0a runner-probe retest evidence (`docs/research/2026-04-12-v0a-runner-probe-feedback.md`), D91 cohort protocol (`docs/research/pre-telemetry-validation-protocol.md`), product naming canon (`docs/research/product-naming.md`), review-surface contract (`docs/specs/m001-review-micro-spec.md`).
- **Outranked by:** `docs/decisions.md`, `docs/specs/m001-review-micro-spec.md`, `docs/milestones/m001-solo-session-loop.md`.
- **Key pattern:** `VB-FL-NN` IDs are stable across commits, spec updates, and later debriefs; cite them rather than quoting the prose.
