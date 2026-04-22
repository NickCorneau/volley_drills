---
id: ux-workflow-manual-test-2026-04-22
title: "UX workflow manual test — Volleycraft v0b (2026-04-22)"
status: active
stage: validation
type: research
summary: "End-to-end manual test of the first-session, run, review, and follow-up-session workflows on a 390×844 viewport. Measures ease-to-first-session, evaluates repeat-use pull, surfaces workflow issues, and scores against `docs/vision.md` P1–P12 and the `D130` / adversarial-memo founder-use bar. Complements the 2026-04-22 UI design review and the 2026-04-21 Player 3 manual test by focusing on workflow and vision alignment rather than visual/design."
authority: "Workflow-test ledger of record for 2026-04-22. Informs Tier 1b prioritization and Tier 2 repointing conditions. Outranks nothing."
last_updated: 2026-04-22
depends_on:
  - docs/vision.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/research/partner-walkthrough-results/2026-04-21-amateur-player-3-manual-test.md
  - docs/research/partner-walkthrough-results/2026-04-21-iphone-viewport-design-review.md
  - docs/research/partner-walkthrough-results/2026-04-22-manual-ui-design-review.md
related:
  - docs/research/founder-use-ledger.md
  - docs/specs/m001-review-micro-spec.md
decision_refs:
  - D91
  - D100
  - D123
  - D124
  - D129
  - D130
---

# UX workflow manual test — Volleycraft v0b

**Date:** 2026-04-22
**Method:** Cursor IDE browser driving the local dev build at `http://localhost:5176`, viewport resized to iPhone-class 390 × 844, full interactive flow. Not a real device — no sunlight, safe-area, or haptic verification.
**Scope:** Workflow and vision alignment. First-session ease, run flow, review flow, follow-up-session flow, abandoned-session recovery, settings. Complements the 2026-04-22 design review and the 2026-04-21 amateur Player-3 test — issues already fully diagnosed by those notes are referenced, not re-argued.

## Agent Quick Scan

- Use this doc for workflow-level findings, ease-to-first-session timing, main-tool-pull evidence, and vision alignment scoring.
- Not this doc for pure visual/design critique (see `2026-04-22-manual-ui-design-review.md`) or casual-tester affective response (see `2026-04-21-amateur-player-3-manual-test.md`).
- Headline finding: **cold-start to first running block is ~40 seconds with 5 intentional taps** — well under M001's `<=3 min` bar. The follow-up path from "Repeat this session" on Home to running again is **3 taps** (Repeat → Build → Continue) given a pre-filled setup and pre-answered safety, about **~15 s**. Both flows clear the target. The workflow debts that remain are all *tone and trust* (form-first first-impression, red-chip semantics, Safari-eviction warning on session 1), not friction.
- Update when a workflow changes shape (new screens, new gates, re-ordered flow) or when the `D130` founder-use window closes and a new stranger-cohort test happens.

## What I tested (observed flow)

Cold-start as a first-time user, then a returning-user flow, then an abandoned-session recovery flow, on a single browser session against the current deployed build:

1. **Cold start** — `/onboarding/skill-level` → `/onboarding/todays-setup` → `/safety` → `/run` (warm-up with 3-2-1 countdown) → Transition → Block 2 (work) → fast-forward to end → `/review` → `/complete` → `/` (Home, "Keep building").
2. **Follow-up session** — `/` Home (second open) → "Repeat this session" → `/setup?from=repeat` (pre-filled) → `/safety` (returning-user variant, "First time" chip hidden) → `/run` → Pause → End session → `/review` ("Ended early" subtitle + "Why did you end early?" chips).
3. **Review-pending Home state** — abandoned the early-end review mid-way → `/` now shows the D100 "Review your last session" CTA card, "Repeat" card below, and a two-row recent-workouts ledger with **Today · Passing · Partial** + **Today · Passing · Done** statuses.
4. **Settings** — single card, "Export training records", "Your data stays on this device" footer.

All local-first, no network calls required.

## Workflow map (observed)

```
[Skill level (1-time)] → [Today's setup] → [Safety] → [Run] → [Review] → [Complete]
          ↑                      ↑                                 ↓
       first run only     pre-filled on repeat              back to [Home]
                                                                  ↓
                                                       [Home: Repeat | Start different | Recent | Settings]
                                                                  ↓
                                                       [Home pending review?] → [Finish review | Skip]
```

## Ease-to-first-session (cold start)

Timer started at first contact with `/onboarding/skill-level`, stopped when block 2 timer was visibly running.

| Step | Action | Cumulative time | Tap count |
|------|--------|----------------:|----------:|
| Skill level | Tap "Rally builders" | ~5 s | 1 |
| Today's setup | Tap Solo, Net No, Wall No (defaults accepted for Time 15 min and Wind Calm) | ~20 s | 4 |
| Today's setup | Tap "Build session" | ~22 s | 5 |
| Safety | Tap "1 day", Tap "No" pain | ~30 s | 7 |
| Safety | Tap "Continue" (progressive disclosure) | ~33 s | 8 |
| Run — warmup | 3-2-1 countdown, then timer running | ~40 s | — |

**Result:** 8 intentional taps, ~40 s to first running block.
**M001 target:** `<= 3 min` to a believable starter session.
**Verdict:** Clears the bar by a large margin. Time is not the bottleneck.

Observations inside the budget:

- The setup screen enforces three radio choices (Players / Net / Wall) with *no* default, while Time and Wind have defaults. This is the right asymmetry (beach assumptions shouldn't be guessed), but the mixed-default model gives the user no visual cue about *which* fields are required; the "Build session" button just quietly stays disabled.
- The "Continue" button on Safety is progressive-disclosed — it does not exist until both questions are answered. Good hygiene, but the bottom of the screen reads as "page ended" during the gap. Either a ghost disabled button from the start, or tighter copy, would anchor the eye. (Same concern in the design review.)
- The 3-2-1 countdown doubles as an on-ramp: you read the warm-up description while the counter ticks down. Good use of dead time.

## Follow-up session ease (repeat flow)

The second-open story is what D130 founder-use mode is optimizing for. I tapped "Repeat this session" on the Home card and timed through.

| Step | Action | Cumulative time | Tap count |
|------|--------|----------------:|----------:|
| Home | Tap "Repeat this session" | ~2 s | 1 |
| Setup (pre-filled banner: *"Setup pre-filled from Today. Adjust if today's different."*) | Tap "Build session" | ~5 s | 2 |
| Safety (returning-user variant — "First time" chip hidden) | Tap "0 days", "No", "Continue" | ~15 s | 5 |
| Run | Timer running on warm-up | ~18 s | — |

**Result:** 5 taps, ~18 s to first running block on session 2+.
**Verdict:** This is a very strong repeat-use path. The "Repeat this session" card on Home is the single best interaction in the product — P12 is fully satisfied (one clear action, one confidence signal, one reason to come back).

Subtle returning-user touches that are doing a lot of work:

- **Skill level screen is gone on second open.** Once chosen, it doesn't re-prompt. D123 recommendation-first posture.
- **Setup banner + pre-filled chips.** Honest about state ("pre-filled from Today"), invites edit, doesn't force rebuild.
- **Safety's "First time" chip disappears for returning users.** Small but meaningful — the app is reading state.
- **Helper text on the same chip row updates** from *"0 days or First time means a shorter, lower-intensity start"* to *"0 days means a shorter, lower-intensity start."* Context-aware copy.

The friction on the repeat path is almost entirely on Safety. It is correctly re-asked every session (pain is *today's* state, not a preference), but for a same-day second session the re-prompt of layoff is redundant. Not a Tier-1 issue; noting it for later.

## Main-tool pull (Home after 1+ complete session)

The Home surface is what decides whether this is a "main training tool" or a "one-time try." After session 1 completes with a review, I landed on a Home I would actually open again:

- **Your last session** card with session context (Solo + Open · 15 min · today) and primary "Repeat this session" CTA.
- **Your recent workouts** ledger — single row the first time (Today · Passing · Done) — two rows after the abandoned-run test (partial + done) — clearly distinguishes **Done / Partial** states. This is the Tier 1a last-3-sessions row (`D130` Unit 5) functioning as advertised, and it is exactly the surface that prevents the founder from needing to keep session history outside the app (adversarial-memo Condition 2).
- **Settings** link + "Your data stays on this device" subtext as the only footer. No social, no ranks, no open-ended nav.

**This is the strongest P12 screen in the app.** One action, one signal, one reason to return.

What still undercuts the "main tool" feel:

- **Brandmark ambiguity.** The lozenge glyph in the header reads more like a lowercase "e" or a "c" than a clearly volleyball-coded mark. On a Home-Screen install this is the user's first visual anchor every day. The naming rationale (D125) is volleyball-inclusive, but the glyph does not yet say volleyball.
- **Complete-screen local-first caveat is too early.** The first completed session's footer reads *"Works offline. iPhone Safari can remove browser data if the site sits unused for a while or if browser data is cleared."* That is honest, and correct per `P10`, but on **session 1** the user hasn't yet earned enough trust to absorb a data-loss caveat; it lands as "your data might disappear." Consider surfacing this either (a) once after the third session, (b) inside Settings only, or (c) compressed to the single line "✓ Saved on this device" on the complete screen with the full caveat moved to a tap-to-expand.
- **"Your recent workouts" is styled as plain text rows, not tappable records.** The row reads "Today · Passing · Done" with no affordance; a user who wants to peek at what they did cannot tap through. Tier 2 scope lands a full history screen — fine — but giving each row a subtle tap affordance between now and then would make the ledger feel like a ledger and not a caption.

## Run-flow workflow (courtside simulation)

I walked through block 1 → transition → block 2, then paused and ended early. Workflow-level notes (design-level visual notes are in `2026-04-22-manual-ui-design-review.md`):

**Transition screen is the best surface in the app.** ✓ "Beach Prep Three · Complete" → divider → "Up next" eyebrow → `Pass & Slap Hands` · 4 min · one-paragraph description → **Start next block** (primary) + **Shorten block** (secondary). One clear action, one confidence signal (previous block ✓), one forward step. Zero cognitive tax at the block boundary — exactly where courtside mental bandwidth collapses.

**Paused state gives the user real options.** Resume / Shorten / End session. "End session" is red-tinted, confirms with a modal ("End session early? Your progress will be saved and you can review what you completed."), and on confirm routes to the Review with a truthful **"Ended early"** subtitle. The "Why did you end early?" chips (Time / Fatigue / Pain / Other) turn an abandoned session into a useful signal — behavioural input that the builder can use. This is the right design.

**Swap drill is gated on the warm-up and cool-down.** Good — warm-up is mandatory per `D85` / `D105`. A runtime "Swap drill" is visible on work blocks. This is the only in-run escape the user has today; there is no pre-run draft/preview screen, so the swap must live mid-run. That is the D130 v0b trimming ("no Session Prep screen, no dedicated rationale/preview surface") and it is tolerable — the "Chosen because:" line per block compensates somewhat. If a Tier-1c focus-toggle ships, the draft-screen location will make swap easier to reach *before* the clock starts.

**"Chosen because:" lines vary per block.** I saw:

- Warm-up — *"every session opens with a sand-specific warmup."* (static template)
- Block 2 — *"low-intensity passing rep to groove the pattern."* (block-specific, builder-derived)

Per-block variation is the right outcome of the Tier 1a promotion of this surface (`D130` Tier 1a Unit 4). Trust-by-sentence is cheaper and more defensible than a "see why" modal.

**Workflow issue, small:** after tapping "Next" on block 2, the following snapshot lost the Swap button row that had been visible when the block first opened. Likely a state effect (layout recomputes when the timer crosses a threshold), but worth verifying — if Swap is only available at the top of a block, that should be explicit. Either it is always visible mid-block or it is explicitly a "first 10 s" affordance.

**Workflow issue, important:** the "Keep the phone unlocked so the block-end beep can fire" hint that appears during the warm-up countdown is exactly the line Player 3 flagged as "making me manage the app instead of the workout." On a second session the user already knows the contract; showing this every single time is noise. Tier-1b candidate: show once after the first warm-up, or only show after a block-miss is actually detected.

## Review-flow workflow

Workflow-level notes only — see design review for visual grid / color / chip critique.

**Submit is correctly gated on effort.** Good contract enforcement per `docs/specs/m001-review-micro-spec.md`.

**"Finish later" preserves `review_pending`.** Verified by abandoning the early-end review mid-way and observing Home pivot to the D100 "Review your last session" card. The pivot is graceful — the Repeat card stays accessible below, so the user is never forced back into a review they are not ready for. This respects the 2-hour window honestly surfaced as "This session stops counting in about 2 hr, then it won't affect planning."

**Interaction cross-talk between "Couldn't capture reps" and Quick tags.** Observed: tapping `About right`, then tapping `Couldn't capture reps` deselected `About right`. Expected behavior per the review micro-spec should keep reps-capture state and quick-tags independent. Either (a) reps-skip and tags share a state machine by accident, or (b) selection animation overlapped the snapshot. Reproducibility worth checking against the spec — file as a tracked bug if confirmed.

**"Ended early" subtitle + "Why did you end early?" chips** is elegant and doesn't shame the user. "Ended early" replaces "Complete" in the recap subtitle and on the Home `Recent workouts` ledger as **Partial**. This is the kind of honest surface that builds trust over weeks.

## Abandoned-session recovery

The D100 review-pending Home state performs well:

- Primary **Review your last session** card with Finish review + Skip review.
- Secondary Repeat card still clickable below (escape valve).
- Recent workouts ledger shows both sessions with distinct **Partial** and **Done** statuses.

This is a better state than most "you left mid-thing" UIs I have used; it does not punish the user or block Home. One concern: **"Skip review" is a link with no confirmation.** The `m001-review-micro-spec.md` review-envelope contract is not yet clear to the user; if Skip discards the review permanently (or lets the 2-hour window expire), a lightweight confirmation — "Skip for now? We'll stop counting this session in about 2 hours." — would match the same honest posture the Complete screen already uses.

## Vision alignment scorecard (P1 – P12)

| Principle | State | Notes |
|-----------|:-----:|-------|
| **P1** — If annoying on sand, it does not ship | ✅ mostly | Transition + Run are low-friction. Timer density and coaching-note length still require fresh-user sun-read (design review flags the two warm-up / cooldown numbered blobs). |
| **P2** — Structured objects beat unstructured chat | ✅ | Everything is chips, cards, and structured surfaces. No chat anywhere. |
| **P3** — Few self-logged metrics collected consistently | ✅ | RPE + optional rep count + single short note is the right surface area. "Couldn't capture reps" removes the reps-collection ask without breaking the model. |
| **P4** — Session flow and believable progression beat drill volume | ✅ | The archetype + ranked fill produced a coherent 4-block session. Rationale per block ("Chosen because:") makes the flow legible. Tier 1b setting probe will test breadth. |
| **P5** — Safety built in, not optional | ✅ | Safety is a gate, heat & safety tips reachable from the shield icon on every screen, End-session path preserves data. D129 physio pass landed. |
| **P6** — Solo or pair fallback before trusted | ✅ on solo | Pair was not tested in this session; the `Pair` path was visible in setup. Partner walkthrough with Seb (2026-04-21) covered that side. |
| **P7** — Human owns the plan; no generative AI in critical path | ✅ | Deterministic. No LLM calls observed in the assembly or run paths. |
| **P8** — Constraint-aware recommendations | ✅ | Setup chips (Players, Net, Wall, Time, Wind) flow into assembly; session subtitle confirms ("Solo + Open · 15 min, 4 blocks"). |
| **P9** — Feedback feeds forward visibly | ⚠️ partial | Review captures effort + tags + note + reason-for-early-end, but there is no visible signal on the *next* Home visit that today's answers will shape tomorrow's session. The adaptation is real but invisible. Tier 2 "See why" modal is where this clarity lands; until then, P9 is an IOU. |
| **P10** — Local-first, device is the primary copy | ✅ | Explicit everywhere. Settings has JSON export. Complete screen is honest (perhaps too honest on session 1 — see above). |
| **P11** — Recommend before interrogate | ⚠️ form-first on first-ever open | Skill level + 5-input setup + safety is still the first-run shape. Tier 2 D123-posture polish is the known fix. Repeat-use path is much better — one-tap Repeat honors P11. |
| **P12** — One action, one signal, one reason to return | ✅ on Home, Transition, Complete; ⚠️ on Setup and Review | Home and Transition are textbook P12. Setup and Review have multiple equal-weight sections and no single focal zone. |

## Findings, ranked

### P1 — Strong (keep; do not touch)

1. **Transition screen.** Textbook single-focal-zone design. Do not add to it; polish only if user testing shows confusion about "up next" vs "complete."
2. **"Repeat this session" flow from Home.** Three taps, ~15 s from Home to running. Preserve this path's simplicity through any future Tier-1c Swap-Focus or Tier-2 See-Why work.
3. **End-session-early review subtitle + "Why did you end early?" chips.** Honest, non-shaming, captures signal. Preserve the word **Partial** in the Home ledger.
4. **D100 review-pending Home pivot.** Graceful, non-blocking. The only polish needed is adding a short confirmation to "Skip review."
5. **Per-block "Chosen because:" rationale line.** Varies between blocks, cheap, legible. Do not inflate into a dense explanation — the modal is Tier 2.

### P2 — Important (address in Tier 1b or as scoped polish)

6. **Red/salmon "0 days" chip reads as an error, not a valid answer.** Confirmed on 2026-04-22 manual run; flagged in the 2026-04-21 iPhone review. The intended "we'll downshift" semantic is correct; the colour choice is the wrong channel to carry that meaning. Prefer copy — e.g. *"Today · we'll keep it lighter"* — and reserve red for actual warnings. This is a trust issue, not a visual one.
7. **Complete-screen Safari-eviction caveat too early in the user journey.** On session 1 it lands as "your data might disappear." Compress to `✓ Saved on this device` on the complete screen and move the full caveat to Settings and/or gate it to post-session-3.
8. **"Keep the phone unlocked so the block-end beep can fire" appears every warm-up.** Player-3-flagged; still present. Show once, or only after a missed block-end is detected.
9. **"Skip review" has no confirmation.** Lightweight modal matching the "End session early?" pattern would remove ambiguity about what Skip does to the 2-hour window.
10. **Reps-capture and Quick-tags state cross-talk (Review screen).** Observed deselection of a previously-pressed tag when toggling "Couldn't capture reps this time." Reproduce against `m001-review-micro-spec.md`; if real, treat as a bug.
11. **Brandmark glyph is volleyball-agnostic.** On a Home-Screen install it's the daily first visual — it should say volleyball at a glance. Low-urgency but high visibility.

### P3 — Lower priority (log, address when convenient)

12. **Setup defaults are inconsistent** (Time and Wind have defaults; Players, Net, Wall do not). Not wrong; the asymmetry is right for beach. But an ephemeral "we default to calm + 15 min, change if different" helper would match the setup banner pattern that already exists on the repeat path.
13. **"Build session" disabled state is peach-tinted** and reads as "almost ready." Design review flags this. True-gray disabled would remove ambiguity.
14. **"Your recent workouts" rows are plain text**, not tappable. Tier 2 ships full history; a tap affordance here meanwhile (even a ghost chevron) would signal "this is a ledger, not a caption."
15. **Warm-up and cool-down numbered-step blobs** are not truncated-with-"Show full" the way work-block coaching notes are. Apply the same progressive-disclosure treatment for courtside legibility.
16. **Back/Home links are small, top-left.** Thumb-unfriendly on right-handed devices; well-known pattern cost.

## Recommendations, sequenced

**Tier 1b candidates driven by this test (ordered by logged-demand likelihood):**

1. **Re-color or re-copy the "0 days" chip** so that a valid answer does not carry an error-tone. This is a ≈10-line change in the chip token application and improves first-run trust meaningfully.
2. **Gate the "keep phone unlocked" hint** to show once, or on observed block-end miss. Low-risk, moderate Player-3-style payoff.
3. **Compress Complete-screen local-first caveat** and move the scary line to Settings / Help. The current placement fights the `Investment` posture in `docs/vision.md` experience brief.
4. **Add "Skip review" confirmation modal** aligned to the "End session early?" pattern.

**Tier 2 scope, already planned — this test strengthens the case:**

- **"See why this session was chosen" modal (`D130` Tier 2).** The P9 IOU observed in this test is the strongest argument for landing this when Tier 2 unblocks. Per-block rationale is good; a session-level "why this shape today" closes the feedback loop visibly.
- **Richer deterministic summary copy on Complete.** "Keep building. Session 1." is good for session 1 but reads the same at session 5 and session 20. Tier 2 summary copy should vary with sRPE trend + reps + streak so Complete feels like an evolving verdict, not a template.
- **Full session history screen.** Now justified — two rows on Home today will be 20 rows in a month.

**Out of scope for this test but worth recording:**

- A **session draft / preview** surface would resolve the P11 form-first impression on first-run by letting the user see a recommendation *before* the safety gate. This is explicitly deferred per D130 and should remain so until the current Tier-1 posture is exhausted — but this test confirms it is the highest-value V0-vs-actual-M001 gap.

## Not tested (worth flagging)

- Real hardware / safe-area / outdoor glare.
- iOS "Add to Home Screen" install and `lastPlayerMode` round-trip through offline restart.
- Pair mode end-to-end (covered by the 2026-04-21 partner walkthrough on grass with Seb).
- Longer-gap returning-user state (app unopened for 3+ days, Safari data eviction edge).
- Multi-day `review_pending` — what happens when the 2-hour window expires.
- The `Swap drill` alternative-ranking correctness (did not exercise).
- Drill content coverage beyond the default single-focus pass session.

## Evidence links

- Observed URLs traversed: `/onboarding/skill-level`, `/onboarding/todays-setup`, `/safety`, `/run` (warmup + work), `/run/transition`, `/review`, `/complete`, `/` (Home — pre- and post-review-pending), `/setup?from=repeat`, `/settings`.
- Session IDs used during the test were local-only (`id=1a7b15c7-…` and `id=4e600943-…`) — not preserved beyond this browser.
- Cross-references: `docs/research/partner-walkthrough-results/2026-04-21-amateur-player-3-manual-test.md` (affective/tone), `docs/research/partner-walkthrough-results/2026-04-21-iphone-viewport-design-review.md` (viewport fit), `docs/research/partner-walkthrough-results/2026-04-22-manual-ui-design-review.md` (visual/design), `docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md` (Seb pair test).

## Review questions for the human

1. Does the `D130` Tier-1b ordering accept the four "Tier 1b candidates driven by this test" above, or should any be deferred?
2. Is the Complete-screen local-first caveat load-bearing for D91 informed-consent purposes, or is compressing it on session 1 acceptable?
3. Was the observed reps/quick-tags interaction cross-talk intentional behavior, or should it be filed as a bug against `docs/specs/m001-review-micro-spec.md`?
4. Does the "draft / preview" shape remain a Tier 2+ item even if this test's P11 observation repeats in the stranger-cohort re-eval, or should it move forward under an early `D130` trigger?
