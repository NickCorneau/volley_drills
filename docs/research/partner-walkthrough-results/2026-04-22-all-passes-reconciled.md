---

## id: all-passes-reconciled-2026-04-22
title: "All-passes reconciled — seven-input synthesis (2026-04-22)"
status: active
stage: validation
type: research
summary: "Final reconciliation of the four 2026-04-22 passes (workflow, shibui, design review, trifold synthesis) and the three 2026-04-21 inputs they build on (Seb's Tier 1a partner walkthrough with its founder-response dispositions, Player 3 amateur test, iPhone viewport review). Scrubs the trifold's proposed Tier 1b bundle against the already-landed pre-close work catalogued in Seb's walkthrough, absorbs Seb's post-close (N1–N3) mentions and the Condition 3 provisional-pass signal, re-evaluates the `Chosen because:` tension in light of its pre-close relocation + typography bump, and leaves a tighter open list plus updated discipline guardrails. Supersedes the trifold on priority list only; the trifold's finding-level reasoning and tension resolutions remain valid."
authority: "Canonical priority list across all partner-walkthrough feedback through 2026-04-22. Supersedes the Tier 1b bundles in `2026-04-22-trifold-synthesis.md`, `2026-04-22-synthesis-workflow-and-shibui.md`, and `2026-04-22-ux-workflow-manual-test.md`. Defers to Seb's founder-response dispositions (`2026-04-21-tier-1a-walkthrough.md`) on any item where they disagree, and to the adversarial memo's authoring-budget cap on unlock decisions."
last_updated: 2026-04-24
depends_on:
  - docs/research/partner-walkthrough-results/2026-04-22-trifold-synthesis.md
  - docs/research/partner-walkthrough-results/2026-04-22-synthesis-workflow-and-shibui.md
  - docs/research/partner-walkthrough-results/2026-04-22-ux-workflow-manual-test.md
  - docs/research/partner-walkthrough-results/2026-04-22-shibui-attention-respect-pass.md
  - docs/research/partner-walkthrough-results/2026-04-22-manual-ui-design-review.md
  - docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md
  - docs/research/partner-walkthrough-results/2026-04-21-amateur-player-3-manual-test.md
  - docs/research/partner-walkthrough-results/2026-04-21-iphone-viewport-design-review.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/vision.md
decision_refs:
  - D91
  - D100
  - D105
  - D123
  - D124
  - D127
  - D129
  - D130
  - D131

# All-passes reconciled — seven-input synthesis

## Agent Quick Scan

- **Read this first** if you want one decision-ready view of partner-walkthrough output through 2026-04-22. The upstream docs stay valid for evidence and reasoning.
- **Three headline outcomes from reconciliation:**
  1. **Roughly half of the trifold's proposed Tier 1b bundle was already landed pre-close on 2026-04-21** as direct dispositions against Seb's walkthrough. The genuinely-open Tier 1b list below is tighter — 11 items, down from 19.
  2. `**D130` Condition 3 is at *provisional* pass** — Seb opened the app unprompted at T+1 day (2026-04-22). Final read-out remains 2026-05-21. This weakens the trifold's "accelerate Tier-2 See-Why modal" argument; natural Tier-2 unlock via the `D130` gate is now plausible before re-eval.
  3. **The `Chosen because:` tension partially resolves on its own.** The pre-close fix (relocated above `courtsideInstructions`, typography 12 px → 16 px) addresses the confusion and afterthought-legibility concerns the workflow test and design review surfaced. The shibui pass's "delete it" argument now rests on aesthetics alone, not confusion. **Hold the current state; do not delete in Tier 1b absent founder-use evidence.**
- **Supersedes** the Tier 1b lists in the trifold, the two-way synthesis, and the workflow manual test. Their finding-level reasoning and the trifold's tension resolutions (T1–T4) stay valid.
- **Defers** to Seb's founder-response dispositions table on any conflict; those dispositions incorporate the adversarial-memo authoring-budget cap and founder-session-trigger discipline that the same-day synthesis passes did not.
- **Not for:** net-new walkthrough data, re-arguing resolved finding-level questions, or rewriting the merged Review proposal (which survives unchanged from the trifold).

## The seven-input feedback corpus


| #   | Doc                                           | Date                                | Lens                                                               | Shape                                                                  |
| --- | --------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 1   | `2026-04-21-amateur-player-3-manual-test.md`  | 2026-04-21                          | Reluctant-amateur affective tone                                   | First-person notes                                                     |
| 2   | `2026-04-21-iphone-viewport-design-review.md` | 2026-04-21                          | 390/375 px viewport fit                                            | Screen-list + 5 risks                                                  |
| 3   | `2026-04-21-tier-1a-walkthrough.md` (**Seb**) | 2026-04-21 (+2026-04-22 post-close) | Formal partner walkthrough, Pass 1 solo × 2 + Pass 2 pair on grass | Findings + founder-response dispositions + 30-day quiet-window tracker |
| 4   | `2026-04-22-ux-workflow-manual-test.md`       | 2026-04-22                          | Workflow + timing + P1–P12                                         | Timed end-to-end test                                                  |
| 5   | `2026-04-22-shibui-attention-respect-pass.md` | 2026-04-22                          | Shibui × attention × respect-for-amateur                           | Principle pass, maximally subtractive                                  |
| 6   | `2026-04-22-manual-ui-design-review.md`       | 2026-04-22                          | Craft + tokens + emotional response                                | Screen-by-screen + cross-cutting                                       |
| 7   | `2026-04-22-trifold-synthesis.md`             | 2026-04-22                          | Three-way synthesis of #4, #5, #6                                  | Priority bundle                                                        |


(Plus the two-way synthesis at `2026-04-22-synthesis-workflow-and-shibui.md`, retained as reasoning trace.)

## Reconciliation — trifold priority list against what has actually landed

Scrubbing each trifold Tier 1b item against Seb's **pre-close dispositions table** and post-close (N-row) dispositions:


| Trifold item                                                        | Status after reconciliation                                                                                                                                                                                                                                                                                                                                                                                                     | Source                        |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 1. Neutral `disabled` CTA token                                     | **Open.** Design review A1; no pre-close fix.                                                                                                                                                                                                                                                                                                                                                                                   | —                             |
| 2. Delete `Chosen because:` from Run                                | **Re-evaluate; hold.** Seb P1-11 pre-close: relocated above `courtsideInstructions`, typography 12 px → 16 px, pinned by `RunScreen.rationale-placement.test.tsx`. Confusion and afterthought-legibility concerns are mitigated; shibui-aesthetic concern is not. Downgrade to **Tier 1b on founder-use trigger** (`founder-use-ledger.md` entries flagging "line feels like coach footnoting").                                | Seb P1-11                     |
| 3. Rewrite Review per merged proposal                               | **Partially landed; rest open.** Pre-close landed: notCaptured pre-selected for non-count `successMetric.type`, `RpeSelector` anchor rail removed with per-chip aria-label + `SELECTED_HINT`. Still open: RPE 11 → 3 anchors; delete Quick tags; divider-line treatment; delete 2-hour countdown copy; `Done` / `Finish later` equal weight; hide Good-passes card entirely on non-count drills (not just default-notCaptured). | Seb P1-12, P2-3               |
| 4. Reword `0 days` → `Today / Yesterday / 2+ days ago / First time` | **Open.** Not in Seb's walkthrough; three passes converge (Player 3, iPhone viewport, design review).                                                                                                                                                                                                                                                                                                                           | —                             |
| 5. Warm-up / cool-down progressive disclosure                       | **Partially landed; rest open.** Seb P1-8 landed: enumerated six stretches in `d26 Lower-body Stretch Micro-sequence` with inline cues. Still open: **truncate-with-expand pattern for numbered warm-up steps** (Beach Prep Three still renders as a blob). Tap-to-expand per-stretch demo remains Tier 1b on trigger.                                                                                                          | Seb P1-8                      |
| 6. Auto-fill training recency                                       | **Open.** No pre-close fix.                                                                                                                                                                                                                                                                                                                                                                                                     | —                             |
| 7. Persist `Net` / `Wall` across sessions                           | **Open.** No pre-close fix.                                                                                                                                                                                                                                                                                                                                                                                                     | —                             |
| 8. Delete 2-hour countdown; compress Complete Safari caveat         | **Open.** Shibui + workflow + design review converge.                                                                                                                                                                                                                                                                                                                                                                           | —                             |
| 9. Block-end countdown cue on Run                                   | **Partially landed; visual open.** Seb P2-2 pre-close landed: audio block-end tick-tick-tick-BEEP via `playSubBlockTick()` (1400 Hz) + entrance-ramp 3-sec countdown. **Visual countdown cue** (thicker progress bar + "0:47 left" chip) from design review A4 remains open.                                                                                                                                                    | Seb P2-2                      |
| 10. Reproduce + file effort/tag state anomaly                       | **Open.** May become moot if Quick-tags card is deleted per merged Review proposal, but the design review's suspected auto-submit path needs direct repro before D91.                                                                                                                                                                                                                                                           | —                             |
| 11. Gate "keep phone unlocked" warm-up hint                         | **Open.**                                                                                                                                                                                                                                                                                                                                                                                                                       | —                             |
| 12. Skip-review confirmation modal                                  | **Open.**                                                                                                                                                                                                                                                                                                                                                                                                                       | —                             |
| 13. `Not sure yet` as default onboarding path                       | **Partially landed; proposal downgrades.** Seb P1-1 pre-close landed: `Not sure yet` promoted from `variant="link"` text button to fifth focal-surface option card with recommend-first descriptor. This addresses the "didn't notice on first scan" confusion. The stronger shibui proposal (make it the *default* path with the four bands becoming an adjustable Setting) is now a **Tier 2** question, not Tier 1b.         | Seb P1-1                      |
| 14. Plain-language jargon rewrites                                  | **Largely landed; residual is lint.** Seb P1-4 / P1-5 / P1-6 / P1-7 all landed. Courtside-copy rule §2 with flagged-vocabulary table is the ongoing machine-verifiable invariant. BAB vocabulary (Pokey / Tomahawk / Sideout / High Line / Cut Shot) is pre-registered but wasn't exercised in Seb's walkthrough — verifies on the next archetype walkthrough. Remove from Tier 1b; keep the lint rule.                         | Seb P1-4 / P1-5 / P1-6 / P1-7 |
| 15. First-session-only verdict string                               | **Open.**                                                                                                                                                                                                                                                                                                                                                                                                                       | —                             |
| 16. Quiet `Logged: N sessions · HH:MM` footer                       | **Open.**                                                                                                                                                                                                                                                                                                                                                                                                                       | —                             |
| 17. Accelerate Tier-2 See-Why modal                                 | **Downgrade; monitor Condition 3.** See "Condition 3 implications" below.                                                                                                                                                                                                                                                                                                                                                       | —                             |
| 18. Accent color demotion across non-action surfaces                | **Open.**                                                                                                                                                                                                                                                                                                                                                                                                                       | —                             |
| 19. `Shorten block` button styling on Transition                    | **Open.**                                                                                                                                                                                                                                                                                                                                                                                                                       | —                             |


**Summary:** 8 items still cleanly open; 4 items partially landed with a smaller remainder; 4 items landed or downgraded; 3 items re-evaluated against new evidence.

## Findings from Seb's walkthrough not yet surfaced in the same-day synthesis passes

The four 2026-04-22 passes missed or under-weighted these, either because Seb's environment (iOS Safari PWA, grass court, pair session) differs from the workflow test's dev-browser solo loop, or because the signal is verbal not visual:

**S1 — "Couldn't tell which screen was Home" (Seb P1-2).** After his first completed session, Seb perceived the setup / session-selection screen as Home and tried to "leave" the post-session screen. The Tier-1a last-3-sessions row exists on the real Home, but the hierarchy didn't read to him. **Landed:** pre-close renamed every "Back to start" recovery link across RunScreen / TransitionScreen / ReviewScreen / CompleteScreen.missing / SessionGuard / ErrorBoundary to `Back to home`. Added to the *what's already done* column; noted as ongoing: the Home affordance itself may still need a persistent "Home" icon/label if the next partner walkthrough re-surfaces the same confusion.

**S2 — Pair role-swap audio cue (Seb P2-2, deferred Tier 1b).** Pair drills that alternate tosser/receiver have no audible swap cue; players stare at the phone to know when to switch. **Status:** Tier 1b on founder trigger ("founder logs ≥2 pair sessions with unclear role transitions"). Requires new `variant.roleSwapAtMinute?` metadata. Add to the genuinely-open list below.

**S3 — In-session running rep counter for pair drills (Seb N2, 2026-04-22 unsolicited).** Seb asked for a visible running tally with a one-tap increment during the session, plus a way to *see* those reps later. Disposition: **Tier 1b on founder trigger**, reinforcing P2-3. Partner mentions do not substitute for the trigger per the adversarial memo's authoring-budget cap (§5). Raises priority of the *in-session running-tally* variant specifically (not just the post-block modal) when the trigger fires. Add.

**S4 — `PainOverrideCard` "we lower the load, not the time" microcopy.** From Seb's wording-check reconciliation row: duration did not shorten when he tapped `pain: yes` (correct per `D113` band design), but Seb asked about it. A one-line microcopy ("we lower the load, not the time — your pick") may be worth Tier 1b. **Status:** Open, low-cost. Add.

**S5 — Tap past-session row on Home to see detail (Seb N1, 2026-04-22 unsolicited).** Pre-registered as Tier 2 scope (full session history screen). Seb's mention is partner corroboration; does not unlock Tier 1b. **Status:** Tier 2, matches the design review's A7 constraint (keep `RecentSessionsList` passive in Tier 1a / 1b).

**S6 — Positive: 6-Legged Monster pair drill was fun and produced observed mid-session improvement (Seb P2-5).** Wontfix-info, but a real signal: drill design is strong when the vocabulary is readable. The P1-6 / P1-7 copy rewrites (inside/outside → near/far, combinatoric matrix → enumerated spots) landed on top of a good drill shape, not a broken one.

**S7 — Protocol signal weaknesses the four 2026-04-22 passes were unaware of.** Pass 1 was partly synchronous (founder present, contaminating Task 2 swap-loop); Pass 2 ran on grass not sand (sand-specific signal not captured); Pass 2 read-aloud step was skipped (readability answer came from Seb's own self-test). These do not invalidate the findings but weaken the signal on: Task-2 swap UX, courtside readability claims, and pair-on-sand behavior. **Implication:** pre-D91 checklist item below reserves a repeat pair session **on sand** before any D91 stranger launch.

## `D130` Condition 3 status and implications

- **Unprompted open at T+1 day (2026-04-22) — provisional pass.** Reported via Seb's own unsolicited message (not instrumented), and day-1 opens carry a "fresh-walkthrough excitement" confound. Final read-out 2026-05-21.
- Founder is upholding the no-prompting invariant per `D131`; weekly Dexie-export checks are the only instrumentation.
- **Implication for the trifold's Tier-2 See-Why acceleration argument:** weaker. The trifold's case was "deleting `Chosen because:` from Run leaves P9 with no home, therefore accelerate the modal." With (a) the `Chosen because:` pre-close relocation + typography fix now in, and (b) Condition 3 already trending toward pass, the natural `D130` Tier-2 unlock (Tier 1a acceptance + Condition 3 pass + two weeks of weekly founder sessions) may fire before 2026-07-20. **Do not force Tier-2 acceleration in Tier 1b.** Monitor Condition 3 weekly; revisit if final read-out slips or if founder-use evidence surfaces an explicit See-Why demand.

## The `Chosen because:` question, reopened then closed

The trifold resolved this as "delete from Run, re-home in Swap sheet + Tier-2 modal." Reconciliation reopens and re-closes the question:

- **Two of the three complaints against the line are already addressed.** The workflow test's "cheap P9 trust win" framing is no longer under threat (the line is at 16 px above the drill instructions, not a 12 px gray afterthought below the coach-cue toggle). The design review's "gray-on-off-white afterthought" concern is substantially mitigated by the typography bump.
- **The shibui complaint stands alone:** "the app asking for credit at the worst reading moment." This is an aesthetic / philosophical argument, not a confusion argument.
- **Seb's own read** (P1-11) was that he conflated the line with coach cues — a placement / separation problem. The pre-close fix addresses exactly that.

**Resolution:** hold the current state. Put the "delete from Run" proposal on a founder-use trigger — if ≥1 founder-use-ledger entry explicitly flags the line as "footnoting," execute the delete-from-Run + Swap-sheet re-home as originally proposed. Until then, the surface is earning its placement. The trifold's T1 tension resolution is *paused, not abandoned*.

## Genuinely-open Tier 1b bundle (reconciled)

Ordered by attention-tax-per-LOC, scrubbed against landings. Items tagged by source: **W** workflow, **S** shibui, **D** design review, **SEB** Seb walkthrough / post-close, **P3** Player 3, **IV** iPhone viewport.

1. **Neutral `disabled` CTA token** distinct from peach; apply to Setup `Build session` and Review `Submit`/`Done`. **[Landed 2026-04-22]** per `docs/plans/2026-04-22-partner-walkthrough-polish.md` item 2. [D A1]
2. **Reword `0 days` → `Today / Yesterday / 2+ days ago / First time`.** **[Landed 2026-04-22]** per `docs/plans/2026-04-22-partner-walkthrough-polish.md` item 1 — display labels mapped in `PRIMARY_RECENCY_LABEL` while internal `trainingRecency` string values stay unchanged for Dexie / adaptation compatibility. [W + S + D + P3 + IV]
3. **Finish the Review cut** (RPE 11 → 3 anchors; delete Quick tags; divider-line treatment; delete 2-hour countdown; `Done` / `Finish later` equal weight; fully hide Good-passes card on non-count drills, not just default-notCaptured). **[Landed 2026-04-24]** per `docs/plans/2026-04-23-walkthrough-closeout-polish.md` items 2 + 3. RPE chips are now `Easy / Right / Hard` mapping to canonical sessionRpe 3 / 5 / 7 via `app/src/components/rpeSelectorUtils.ts` (non-canonical historical values snap to nearest chip for display, not mutated on disk); `QuickTagChips` component deleted; hairline divider between RPE and Good-passes; 2-hour `This session stops counting in about N hr M min` subtitle removed; Submit → Done + Finish later upgraded to `variant="primary"` full-width; Good-passes gated on `inferMainSkillMetricType` being count-based. [W + S + D, building on Seb P1-12 + P2-3]
4. **Delete 2-hour Review-window copy**; compress Complete Safari-eviction footnote to Settings; keep the `✓ Saved on this device` line. **[Landed 2026-04-24]** per `docs/plans/2026-04-23-walkthrough-closeout-polish.md` item 3. Posture-sensitive secondary moved into a new Settings `About local storage` sub-section driven by the same `getStorageCopy(posture)` source of truth; Complete carries a small `Why is this?` link. `D118` three-state durability posture unchanged. [W + S + D]
5. **Auto-fill training recency** for returning users — `Today — tap to change` — reading from the app's own Dexie tables. [S, W-accepted]
6. **Persist `Net` / `Wall` across sessions**; ask only on first setup and on explicit "conditions different today." [S, W-accepted]
7. **Truncate-with-expand pattern for numbered warm-up steps** (Beach Prep Three blob). [D + P3, building on Seb P1-8's stretch-list enumeration landing]
8. **Visual block-end countdown cue** on Run — thicker progress bar + "0:47 left" chip. [D A4] Complements the already-landed audio tick (Seb P2-2).
9. **Reproduce and file the effort / tag state anomaly before D91** — even if the Quick-tags card is deleted in item 3, confirm the path is the fix, not silent latency. [D A6] **Note (2026-04-24):** the Quick-tags card deletion landed in this pass (item 3 above), so the user-visible surface for the anomaly is gone; the underlying reproduction + test-case work remains open for code-hygiene / D91 reasons.
10. **Gate "keep phone unlocked" warm-up hint** to first-time-only or on observed block-end miss. **[Landed 2026-04-22]** per `docs/plans/2026-04-22-partner-walkthrough-polish.md` item 5 — `storageMeta.ux.prerollHintDismissed` gate. [W + P3]
11. **Skip-review confirmation modal** matching the `End session early?` pattern. [W]
12. **First-session-only verdict string** on Complete (`Session 1 → logged. First one is in the book.`). **[Landed 2026-04-22]** per `docs/plans/2026-04-22-partner-walkthrough-polish.md` item 4. [D + T3]
13. **Quiet `Logged: N sessions · HH:MM total` footer** near Settings. [D A5]
14. **Accent color demotion** across non-action surfaces. [S + D A1-adjacent]
15. **`Shorten block` button styling on Transition** — outlined pill at CTA width. **[Landed 2026-04-22]** per `docs/plans/2026-04-22-partner-walkthrough-polish.md` item 6. [D]
16. **`PainOverrideCard` "we lower the load, not the time — your pick" microcopy.** **[Landed 2026-04-22]** per `docs/plans/2026-04-22-partner-walkthrough-polish.md` item 3 — shipped in courtside-copy-rule §4 compliant period form (`We lower the load, not the time. Your pick.`) rather than the walkthrough-verbatim em-dash form, because rule §4 explicitly forbids em-dashes in user-visible prose and cites this exact sentence as the canonical "Bad → Good" example. Same meaning, plain punctuation. [SEB wording-check]
17. **Screen Wake Lock + gesture-bound audio prime on active session (timer-end screen-off anxiety / audio-suspend-on-lock).** **[Landed 2026-04-24]** surfaced by the founder's 2026-04-21 joint-session read-back (`docs/research/founder-use-ledger.md` §"Content gaps surfaced on the 2026-04-21 sessions" gap 4). iOS Safari PWA suspends audio when the screen locks, so the block-end tick-tick-tick-BEEP and sub-block pacing ticks cannot be relied on if the screen turns off mid-session. The 2026-04-22 preroll "keep phone unlocked" copy hint was gated first-time-only in the polish ship, which dismissed it for the two most-experienced users courtside. Shipped structural fix in `app/src/hooks/useWakeLock.ts`: request screen wake lock while the Run timer is active, release on pause / transition / unmount, gracefully no-op when `navigator.wakeLock` is unavailable, and re-acquire on `visibilitychange` back to visible if the browser released the lock while the session was still supposed to hold it. Follow-up same-day audio fix: `app/src/lib/audio.ts` exports `primeAudioForGesture()` and `SafetyCheckScreen` calls it from the Continue tap before routing to Run, because iOS Safari requires `AudioContext` creation/resume to happen inside a real user gesture; RunScreen's preroll itself starts from route/effect timing and cannot unlock audio reliably. Tests: `app/src/hooks/__tests__/useWakeLock.test.ts` covers unsupported API fallback, visibility-return re-acquire, explicit-release non-reacquire, and unmount release; `app/src/lib/__tests__/audio.test.ts` covers silent audio priming; `SafetyCheckScreen.test.tsx` covers Continue-tap priming before Run. Complements but does not replace reconciled-list item #8 (visual block-end countdown cue). Infrastructure, not content; did not consume the Tier 1b 10-drill cap.

### Tier 1b — gated by founder-session trigger (authoring-budget cap discipline)

These are real, pre-registered, and should *not* ship on partner-walkthrough evidence alone. They unlock when the founder-use ledger hits the stated trigger:

- **Pair role-swap audio cue** (`variant.roleSwapAtMinute?` metadata; distinct audio). Trigger: founder logs ≥2 pair sessions with unclear role transitions in `founder-use-ledger.md`. [SEB P2-2 Tier-1b half]
- **In-session running rep counter** for pair drills. Trigger: founder logs ≥2 sessions where the notCaptured default feels wrong, OR ≥1 `pass-rate-good` session where the guess was explicitly noted as fake. [SEB P2-3 + N2]
- **Full drill-metadata-driven capture UI** on Review (hide Good/Total entirely for non-count drills; branch `PassMetricInput` on capture style). Same trigger as above. [SEB P2-3]
- **Tap-to-expand per-stretch demo** in the wrap block. Trigger: founder logs ≥1 wrap where more form detail was wanted mid-block, OR partner walkthrough surfaces the need. [SEB P1-8 Tier-1b half]
- **Delete `Chosen because:` from Run** + Swap-sheet re-home. Trigger: ≥1 founder-use-ledger entry flagging "line feels like coach footnoting." Until then, the current relocated + 16 px state holds. [Trifold T1, re-opened and paused]

### Tier 2 (preserved; reinforced by reconciliation)

- `**See why this session was chosen` modal** — natural unlock on `D130` gate. Do not force.
- **Full session history screen** with tap-through on the recent-workouts list. [SEB N1 corroborates]
- **Richer Complete-screen summary copy** that evolves with trend data.
- **Band detection heuristic** so the specific skill-level pick can move from onboarding into Settings. [Stronger shibui proposal, bumped here after Seb P1-1 landed the focal-card promotion]
- `**--text-body` retune** to 16 px / `leading-6` lands with the D91-insight PR per `D127`. [D A3]
- **Distance-mode typography** for bench-height reading (timer digits 72–88 px). Trigger: ≥2 founder sand sessions with readability flagged. [SEB P2-1 Tier-2 half]

### Not changed, on purpose (discipline enforced across Tier 1b)

- `RecentSessionsList` stays passive in Tier 1b. [D A7, SEB N1 handled as Tier 2]
- Settings stays single-card minimal. Only additive is the one investment footer (#13), *below* the Export card. [D A7]
- Typography scaffolding stays at 14 px until D91 evidence. [D A3, `D127`]
- The `═` ornament on Complete is the only decoration. [D]
- The Swap UX itself is not re-engineered on Tier 1a evidence — Seb's direct answer was "Right gesture, felt intuitive." [Seb Q7]

## Authoring-budget cap discipline (imported from Seb's walkthrough)

The single most important governance fact the same-day synthesis passes were unaware of, verbatim from Seb's post-close dispositions preamble:

> *"partner walkthrough findings feed into gate evidence but do **not** unlock Tier 1b authoring on their own — that remains founder-session-trigger-gated. Small pre-close-class editorial fixes that fit inside the courtside-copy rule may still ship in-tier."*

**Consequences for this doc:**

- Items 1–16 above are the Tier 1b bundle *if* the underlying triggers fire. They are not automatically unlocked by this synthesis.
- The pre-close pattern (direct editorial fixes ship; metadata / architecture work waits for founder-session trigger) is the standing operating model.
- The courtside-copy rule §2 + flagged-vocabulary table is the machine-verifiable invariant that catches new vocabulary regressions without needing a new partner walkthrough.

## Updated pre-D91 discipline checklist (scrubbed)

Strictly items that are still open and required before a D91 cohort kickoff. Items landed via Seb pre-close are already struck; 2026-04-22 polish-pass ships and the 2026-04-24 closeout-polish ship are annotated inline.

- ✅ Neutral `disabled` CTA token shipped (item 1). [2026-04-22 polish pass]
- ✅ `Today / Yesterday / 2+ days ago / First time` wording live on Safety (item 2). [2026-04-22 polish pass — display-label mapping via `PRIMARY_RECENCY_LABEL`]
- ✅ Review cut completed per merged proposal (item 3). [2026-04-24 closeout polish — RPE 3-chip, Quick tags deleted, divider, Done / Finish later equal weight, Good-passes gated on count metric]
- ✅ 2-hour Review-window copy removed; Complete save-line intact; Safari-eviction footnote moved to Settings (item 4). [2026-04-24 closeout polish — `About local storage` sub-section on Settings + `Why is this?` link on Complete]
- Training recency auto-fills for returning users; `Net` / `Wall` persist (items 5, 6). **Still open.** Founder-session-trigger-gated per the authoring-budget cap.
- Warm-up numbered-step truncate-with-expand (item 7). **Still open.**
- Visual block-end countdown cue on Run (item 8). **Still open.**
- Effort / tag state anomaly reproduced and fixed with a regression test (item 9). **User-visible surface gone** via 2026-04-24 Quick-tags card deletion; underlying repro remains open for code-hygiene / D91.
- ✅ "Keep phone unlocked" hint gated (item 10). [2026-04-22 polish pass — `storageMeta.ux.prerollHintDismissed`]
- Skip-review confirmation modal (item 11). **Still open.**
- ✅ First-session-only verdict string on Complete (item 12). [2026-04-22 polish pass]
- `Logged: N sessions · HH:MM total` footer (item 13). **Still open.**
- Accent color audit complete (item 14). **Still open.**
- ✅ `Shorten block` styling on Transition (item 15). [2026-04-22 polish pass]
- ✅ `PainOverrideCard` microcopy (item 16). [2026-04-22 polish pass — courtside-copy §4 period form]
- ✅ Screen Wake Lock + gesture-bound audio prime on active session (item 17). [2026-04-24 hook hardening + Safety Continue audio prime — wake lock re-acquires on visibility return, releases on explicit pause / unmount, graceful fallback when unsupported; audio context created/resumed from a real tap before Run preroll]
- Playwright hit-area overlay at 375 px on `/review` confirms 44 pt floor on the reduced chip row.
- **Repeat pair session on sand** (Seb Pass 2 ran on grass; sand-specific readability + warmup behavior still unverified).
- Physical iPhone pass for safe-area + Dynamic Type + real sunlight scheduled.
- Weekly Dexie-export Condition-3 check through 2026-05-21.

If any trigger-gated Tier 1b item (pair role-swap cue, in-session rep counter, full capture UI, stretch-demo, `Chosen because:` delete) unlocks during this window, add it to the checklist at that time.

## What actually changes in the Tier 1 plan, after reconciliation

Relative to `docs/plans/2026-04-20-m001-tier1-implementation.md`:

- **No Tier-1a amendment needed for Unit 4.** The trifold's "invert Unit 4" proposal is paused per §"`Chosen because:` question" above; the current pre-close state (relocated + 16 px, tested by `RunScreen.rationale-placement.test.tsx`) satisfies the confusion- and legibility-based cases.
- **Tier 1a Unit 5** (last-3-sessions row) stands; kept passive through Tier 1b per multiple reinforcing sources.
- **Tier 1b ≤10-drill-record cap** is unaffected — every item 1–16 above is surface / copy / state / copy-rule work, not new drill content. The trigger-gated items involve metadata (`variant.roleSwapAtMinute?`, capture-style branching) and UI, not new drill records.
- **Tier 1c focus-toggle architecture** remains unaffected; the RPE reduction (item 3) will make focus-friction easier to detect in the ledger when Tier 1c evidence is being gathered.
- `**D127` typography retune** is explicitly preserved — it lands with the D91-insight PR, not before.

## Open questions (reduced)

1. **Does the Tier 1b bundle (items 1–16) need to be blocked on founder-session triggers per the authoring-budget cap**, or does the multi-source convergence in this synthesis constitute its own evidence? The safer read is: each item needs either a pre-close-class editorial justification (fits inside the courtside-copy rule or outdoor-UI brief floor) *or* a founder-session trigger. List which items qualify as editorial-class before scheduling.
2. **Does the merged Review proposal require a `docs/specs/m001-review-micro-spec.md` revision** before code? Likely yes for item 3 (RPE 11 → 3 is a contract change).
3. **If Condition 3 passes at 2026-05-21**, does Tier 2 unlock automatically per `D130`, or does it wait for the two-weeks-of-weekly-founder-sessions gate clause? Clarify before planning Tier 2 sequencing.
4. **For the band-detection heuristic** (Tier 2 skill-level auto-detect), is there enough sRPE + completion signal from 2–3 sessions to infer a band that the user would accept, or does the four-band + "Not sure yet" focal-card set stay the canonical entrypoint? Trigger via founder-use ledger: ≥3 sessions where `skillLevel: unsure` persisted and the assembled sessions felt consistently well- or ill-sized.
5. **Is a second partner walkthrough needed before D91** to exercise BAB vocabulary (Pokey / Tomahawk / Sideout / High Line / Cut Shot) that Seb's `solo_open` + `pair_open` plans did not surface? The courtside-copy rule §2 catches regressions on *known* terms; it does not validate the *unexercised* terms in the flagged-vocabulary table.

## Voice check (carried from trifold)

All seven passes keep landing on the same place: the app already has the voice it should use — the Complete verdict, the save-status line, the Transition `Up next` card, the honest `End session early?` modal. Each item in the Tier 1b bundle is either **removing something not in that voice** or **giving an existing surface the discipline to hold it**. Seb's own closing read — that the flow felt natural, the two clusters of friction are onboarding/navigation and vocabulary, and he would follow the program alone — is the same conclusion the four 2026-04-22 passes reach from different angles.

Permission to stop.