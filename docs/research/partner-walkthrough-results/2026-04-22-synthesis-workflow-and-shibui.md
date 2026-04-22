---

## id: synthesis-workflow-and-shibui-2026-04-22
title: "Synthesis — workflow test × shibui/attention pass (2026-04-22)"
status: active
stage: validation
type: research
summary: "Synthesis of the same-day workflow-focused manual test and the shibui/attention/respect pass. Names convergences, concessions where the shibui lens caught what the workflow pass missed, findings where workflow measurements still hold, and resolves the sharpest disagreement (the `Chosen because:` line on Run). Produces one merged priority list for Tier 1b and a repointed argument for Tier 2's `See why` modal."
authority: "Reconciles the 2026-04-22 workflow test and the 2026-04-22 shibui pass. Outranks neither; supersedes the Tier 1b prioritization proposed in `2026-04-22-ux-workflow-manual-test.md`."
last_updated: 2026-04-22
depends_on:
  - docs/research/partner-walkthrough-results/2026-04-22-ux-workflow-manual-test.md
  - docs/research/partner-walkthrough-results/2026-04-22-shibui-attention-respect-pass.md
  - docs/research/partner-walkthrough-results/2026-04-22-manual-ui-design-review.md
  - docs/research/partner-walkthrough-results/2026-04-21-amateur-player-3-manual-test.md
  - docs/research/partner-walkthrough-results/2026-04-21-iphone-viewport-design-review.md
  - docs/vision.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
decision_refs:
  - D91
  - D100
  - D105
  - D123
  - D124
  - D129
  - D130

# Synthesis — workflow test × shibui pass

## Agent Quick Scan

- Use this doc to read the 2026-04-22 workflow test and the 2026-04-22 shibui/attention/respect pass as one argument, not two.
- The two passes **converge on 7 findings**, **the shibui pass caught 4 that the workflow test missed**, and **the workflow test contributes 3 the shibui pass did not address** (repeat-use timing, D100 review-pending pivot, `Why did you end early?` as kept surface).
- The sharpest disagreement — `Chosen because:` on Run — resolves cleanly: **delete it from Run, relocate the same signal to the Tier-2 See-Why modal and the Swap bottom sheet.** The workflow pass's P9 IOU becomes the argument that accelerates Tier 2.
- Merged bottom line: the app's **core loop already works**; the opportunity between here and the 2026-07-20 re-eval is cutting roughly **12–15 unearned decisions** out of Safety + Review + Complete so the loop becomes "coach," not "form." Without those cuts, the loop is polished but solicitous. With them, the app becomes something you open on purpose.
- Not for: new visual/design critique (owned by `2026-04-22-manual-ui-design-review.md`), net-new workflow data (owned by `2026-04-22-ux-workflow-manual-test.md`), or the attention-respect derivation itself (owned by `2026-04-22-shibui-attention-respect-pass.md`).

## The two reads

**Workflow test** asked: *does this work, how fast, how does it feel across cold-start + repeat + recovery, does it line up with vision P1–P12.* Measurement-first.

**Shibui pass** asked: *would a tired amateur feel respected by this screen, or feel like the app is asking them to do the work.* Principle-first.

They are the same product read through two honest questions. The synthesis is not "average them." It is "accept both questions at once and see what survives."

## Where the two passes converge (strong agreements)

1. **Transition screen is the high-water mark.** Workflow test: textbook P12. Shibui pass: textbook shibui. Do not touch.
2. `**Repeat this session` on Home is the best single interaction.** Both passes praise it by name. Workflow pass adds: it is the reason the app plausibly becomes a main tool, not a one-off try.
3. **Safari-eviction caveat lands too early on Complete.** Workflow pass: wrong audience, wrong timing. Shibui pass: wrong at any time — delete the "stops counting in ~2 hr" copy, keep the cap in the model. Synthesis: **delete both lines on Complete; compress to `✓ Saved on this device`; move any legal / ops copy to Settings.**
4. `**0 days` chip reads as an error, not a valid answer.** Both passes land on this; this test also confirmed the earlier iPhone-viewport flag empirically. **Re-color *and* re-copy.**
5. **Review screen is the biggest debt in the app.** Workflow pass: "requires scroll, exceeds 60 s target." Shibui pass: "17 decisions, RPE fluency assumption, success-rule lawyering." Same finding, two microscopes. See §"Merged Review proposal" below.
6. **Brandmark glyph / identity.** Workflow pass flagged volleyball-agnostic glyph. Shibui pass flagged `Side-out builders` / `Rally builders` / `platform` / `athletic posture` jargon. Same underlying issue: **the front door of the product assumes vocabulary the target user hasn't earned yet.** Fix together.
7. **Warm-up / cool-down numbered-step blob.** Workflow pass: not truncated the way work-block coaching notes are. Shibui pass: four text regions on Run is too many. Agree: **apply the same truncate-with-expand treatment, and one 3–6-word cue per block when running.**

## Where the shibui pass caught what the workflow test missed

The shibui pass is sharper because it asked "is this *earned*" instead of "does this *work*." Four findings I concede directly:

**C1 — `Chosen because:` on Run is the app explaining itself, not coaching.** I scored this as a Tier-1a trust win because per-block rationale *does* vary and *is* deterministic. The shibui pass reframes it correctly: mid-block is the worst reading moment, the line is an "please rate my reasoning" ask, and a good coach does not footnote their own choices. **Concede. See §"Resolving the single disagreement" below for where the signal goes instead.**

**C2 — The app re-asks training recency when it already knows.** I flagged "same-day second-session re-prompt is redundant" as a minor friction. The shibui pass sharpens: **the app has the answer in its own Dexie tables.** Asking anyway is a small confession that the app doesn't trust its own data. For returning users, auto-fill with "Today — tap to change." First-timers only see the picker.

**C3 — `Net` and `Wall` are court properties, not today's conditions.** I treated setup as a flat five-question form. The shibui pass splits: Wind is today's; Net and Wall rarely change. **Ask once; persist; surface a single "conditions different today?" escape for change days.** For a 3×/week user this saves ~6 taps/week.

**C4 — Accent color drift.** I did not audit orange across surfaces. The shibui pass catalogs seven jobs the accent is carrying. Agree with the strict read: **accent = action, or the state of the one thing you're doing right now.** Phase eyebrows, `Chosen because:` copy, summary subheads, and back links should be neutral typographic distinctions, not accent-colored.

## Where the workflow test's findings still stand

The shibui pass was a single-loop review; it does not measure follow-up, abandonment recovery, or quantified friction. Three findings from the workflow pass are not contradicted and remain the product's evidence base for those surfaces:

**H1 — Repeat-session path is 5 taps / ~18 s from Home to running.** The shibui cuts (auto-fill recency; persist net/wall; delete `Chosen because:` from Run) **shorten this to ~3 taps / ~10 s**. That number is the most important one in the whole document: it is what makes the app "worth opening tomorrow" mechanically.

**H2 — D100 review-pending Home pivot and `Partial` status.** The pivot is graceful, the Repeat card stays reachable, and the Home ledger distinguishes `Done` from `Partial`. Preserve.

**H3 — End-session-early flow + `Why did you end early?` chips.** Honest, non-shaming, captures planner signal. The shibui pass's "delete Quick tags on Review" is correct because RPE + note carry that signal; the early-end reason chips are *not* redundant with RPE because they answer a different question (*why stopped* vs. *how hard felt*). Keep the early-end chips.

## Resolving the single disagreement — `Chosen because:` on Run

The workflow pass argued this line discharges the P9 "feedback feeds forward visibly" IOU cheaply. The shibui pass argued it is the loudest unshibui moment in the app. Both are true.

**Resolution:**

- **Delete the line from RunScreen.** (Agrees with the shibui pass.)
- **Preserve the reason-trace in the `SessionDraft` / `ExecutionLog` data model** exactly as Tier-1a specified. The signal is still computed; it is not displayed mid-block.
- **Surface it on-demand in two earned places:**
  1. The **Swap drill** bottom sheet — when a tester actually asks "why this one?" the answer is right there as they consider an alternative.
  2. The **Tier 2 `See why this session was chosen`** modal — the proper home for session-level reasoning.
- **Upgrade Tier 2 priority.** Deleting `Chosen because:` from Run *removes* the cheap surface that was partially discharging P9. The full modal is now the only place P9 lands. The workflow pass's P9 IOU becomes the strongest single argument to accelerate Tier 2's See-Why modal into the Tier-1b window, *if the Tier-1b logged-demand cap (≤10 drill records per adversarial memo) allows it.*

This resolution gets the shibui win *and* keeps the trust-by-reasoning infrastructure the Tier-1a plan built, just at a home that respects the moment of reading.

## Merged Review proposal (replaces both passes' Review sections)

Workflow pass listed issues; shibui pass listed cuts. The merged proposal is the shibui pass's cuts, validated against the workflow test's measurement and `docs/specs/m001-review-micro-spec.md`:


| Element                | Today                                                             | After                                                                                  | Rationale                                                                                                                 |
| ---------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| RPE scale              | 0–10, 11 chips, 2 rows                                            | **3 anchors** (Easy / Right / Hard), 1 row                                             | Shibui: RPE is sport-sci jargon; 3-point is the real signal for adaptive planning. Power-user 11-point lives in Settings. |
| Good passes card       | Visible; success-rule copy; pre-select "Couldn't capture"         | **Hidden by default**; shown only when the block's `successMetric.type` is count-based | Workflow: observed cross-talk with Quick tags; Shibui: success-rule lawyering reframes workout as a test.                 |
| Success-rule sentence  | Present                                                           | **Deleted**                                                                            | Shibui. Replace with "Rough guess is fine" only if card is visible for a count-based drill.                               |
| Quick tags             | Four chips (Too easy / About right / Too hard / Need partner)     | **Deleted**                                                                            | Duplicates RPE + note; `Need partner` belongs on *next* setup, not last review.                                           |
| Short note             | Optional textarea, always visible                                 | **Optional, collapsed behind "Add a note"**                                            | Reduces surface area; power users unaffected.                                                                             |
| Submit vs Finish later | Submit primary, Finish later secondary below                      | **Finish later** / **Done** equal weight; Done is the power move                       | Shibui: graceful exit is the default for a tired athlete.                                                                 |
| 2-hour countdown copy  | "This session stops counting in about 2 hr…"                      | **Deleted**                                                                            | Cap stays in the model; do not put a clock on the athlete's post-workout moment.                                          |
| Early-end reason chips | Present only on ended-early state (Time / Fatigue / Pain / Other) | **Keep as-is**                                                                         | Non-redundant with RPE; feeds planner.                                                                                    |


Result: ~17 decisions → **1 required + 1 optional**. ~60-s form → ~5-s acknowledgment.

The workflow test's observed reps/tags state cross-talk becomes moot — the card is gone on most drills and the tag grid is gone entirely.

## Merged priority list

Re-ordered by **attention tax recovered per line of code changed**, absorbing both passes. Items are tagged W (from workflow pass), S (from shibui pass), WS (both).

**Tier 1b — strong case for "do this before re-eval":**

1. **Delete `Chosen because:` from Run.** [S, W-accepted] Biggest single shibui win; preserves data-model trace.
2. **Rewrite Review per merged proposal above.** [WS] The largest attention-tax reduction in the app.
3. **Re-color + re-copy the `0 days` chip.** [WS] Trust issue, not visual.
4. **Auto-fill training recency for returning users.** [S, W-accepted] "Today — tap to change." Removes one question for ~all repeat sessions.
5. **Persist `Net` / `Wall` across sessions; ask only on first setup and on explicit "conditions different today."** [S, W-accepted] Saves ~6 taps/week for a 3×/week user.
6. **Delete the 2-hour countdown copy on Review** and the Safari-eviction line on Complete. [WS] Compress to `✓ Saved on this device`; move any remaining legal / ops copy to Settings.
7. **Gate the "keep phone unlocked" warm-up hint to first-time-only** (or on observed block-end miss). [W]
8. **Add confirmation to `Skip review`** matching the "End session early?" modal pattern. [W]

**Tier 1b or earlier, content-shaped:**

1. **Make `Not sure yet` the default onboarding path for skill level.** [S, W-accepted] The existing copy already describes exactly this; promote it from escape to default, make the specific band an adjustable Setting. Aligns with P11 "recommend before interrogate" better than the current five-card gate.
2. **Rewrite jargon labels**: `Side-out builders` → plain-language, `Rally builders` → plain-language, `platform` → "forearms," `Athletic posture` → "knees soft, weight on balls of feet." [S, W-accepted]
3. **Apply the coaching-note truncate-with-expand pattern to warm-up and cool-down numbered steps.** [WS]

**Tier 1b or Tier 2, evidence-dependent:**

1. **Accent color demotion across non-action surfaces.** [S] Phase eyebrows, section labels, reason copy, back links → neutral typographic distinctions.
2. **Accelerate the Tier-2 `See why this session was chosen` modal** into the Tier-1b window if the ≤10-drill cap permits. [W] Justified by: deleting `Chosen because:` from Run leaves P9 with no visible home.
3. **Give `Your recent workouts` rows a tap affordance** (ghost chevron) ahead of the full history screen in Tier 2. [W]

**Tier 2 or later (unchanged from the original plans):**

- Full session-history screen.
- Richer Complete-screen summary copy that evolves with trend data (now additionally justified by the shibui pass's "Nice session. Same kind next time?" voice example).
- First-run polish to full D123 posture — note that items 9, 10, and 11 above do most of the D123 work preemptively.

## What this changes about the Tier 1 plan

The `docs/plans/2026-04-20-m001-tier1-implementation.md` Tier-1a commitments were the right set *at the time they were written*. After this synthesis, three specific revisions are proposed — none of which break Tier-1a's acceptance bar, but several of which change what "done" looks like:

- **Tier 1a Unit 4** (`Chosen because:` on each RunScreen block) → **inverted**. Keep the derivation; delete the display. Move the signal to the Swap bottom sheet and the future See-Why modal. This may warrant a small amendment to the Tier 1a plan rather than a new tier.
- **Tier 1b cap (≤10 new drill records)** is unaffected by any item above except (13), which is surface work, not content.
- **Tier 1c focus-toggle architecture** is not affected. If anything, the merged Review (Easy / Right / Hard) makes focus-friction easier to detect in the ledger, because RPE values stop being noisy.

## Open questions surfaced by the synthesis

1. Does deleting `Chosen because:` from Run in Tier 1b require a matching Tier-1a plan amendment (Unit 4), or is it a polish follow-up?
2. Does the merged Review proposal change the `m001-review-micro-spec.md` contract in a way that requires a spec revision before code?
3. Is accelerating the Tier-2 See-Why modal worth breaking the `D130` "Tier 2 unblocks on Tier-1a acceptance + Condition 3 pass + two weeks of weekly founder sessions" gate, or should it wait?
4. For the skill-level default (`Not sure yet` as path, not escape), is there a first-run band-detection heuristic the planner can use from session 2's RPE + completion signal, so the specific band question can move into Settings instead of onboarding?

## Voice check

The shibui pass ends with a rewritten Review that is six words and two escapes. The workflow pass ends with four review questions for the human. Between them, the voice the product *should* sound like is already written. The job is to let the app sound the same way: one question, one signal, quiet permission to stop.