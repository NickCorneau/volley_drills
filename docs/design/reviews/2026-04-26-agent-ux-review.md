---
id: 2026-04-26-agent-ux-review
title: "Volleycraft v0b — Deep UX review (2026-04-26)"
status: active
stage: validation
type: design-review
summary: "Agent-driven, screen-by-screen UX review of the v0b Starter Loop after the 2026-04-22 partner-walkthrough polish and the 2026-04-23 walkthrough-closeout polish. Establishes a 2026-04-26 baseline; assesses what landed cleanly, what still has friction, what user intents are well-served, and which findings warrant pre-D91 fixes vs. founder-session-trigger-gated Tier 1b work."
authority: "Point-in-time UX baseline. Not source of truth on its own. Cites brand-ux-guidelines.md, japanese-inspired-visual-direction.md, outdoor-courtside-ui-brief.md, and courtside-copy.mdc as the governing contracts."
last_updated: 2026-04-26
depends_on:
  - docs/research/brand-ux-guidelines.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/partner-walkthrough-results/2026-04-22-manual-ui-design-review.md
  - docs/plans/2026-04-22-partner-walkthrough-polish.md
  - docs/archive/plans/2026-04-23-walkthrough-closeout-polish.md
  - .cursor/rules/courtside-copy.mdc
related:
  - docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md
  - docs/research/2026-04-22-research-sweep-meta-synthesis.md
decision_refs:
  - D86
  - D91
  - D119
  - D125
  - D129
  - D130
  - D132
---

# Volleycraft v0b — Deep UX review (2026-04-26)

## Method

- **Build under test**: v0b Starter Loop, `app/` workspace, dev server at `http://localhost:5173`, post-2026-04-23 walkthrough-closeout polish.
- **Viewport**: Cursor IDE browser at iPhone-class dimensions (390 × 844 CSS px).
- **Coverage**: Home (returning), Settings, Setup, Safety (empty / filled / heat tips), Run (warm-up, pre-roll hint, paused, work block, after-swap, cool-down), Transition, Review (empty / filled), Complete, Home (post-session). 18 screenshots captured under `docs/design/reviews/2026-04-26-agent-ux-review-screenshots/`.
- **Evaluation rubric**:
  1. **Outdoor-first legibility** — `outdoor-courtside-ui-brief.md` floor (off-white surface, near-black text, ≥ 16 px body, WCAG AA).
  2. **One focal zone per screen** — `japanese-inspired-visual-direction.md`, the `tokonoma` rule.
  3. ***Ma***, not emptiness — restraint that clarifies hierarchy vs. dead air.
  4. **Thumb-zone & affordance** — primary action low and tappable; tappable things look tappable.
  5. **Shibui tone** — `brand-ux-guidelines.md` voice: steady, deliberate, not gamified, not clinical.
  6. **Copy invariants** — `.cursor/rules/courtside-copy.mdc`: headline-as-question, plain punctuation, jargon-test, equal cool-down review, audible structure.
  7. **User intent fit** — does each screen serve the *one* thing a self-coached amateur is trying to do at that moment?
- **Scope**: heuristic + flow + content review at fixed-viewport simulation. **Not a real-device test**, no Dynamic Type, no sunlight, no PWA install path. The remaining outdoor-glanceability questions still resolve in the D91 field run.
- **Comparison baseline**: `docs/research/partner-walkthrough-results/2026-04-22-manual-ui-design-review.md` (the last screen-by-screen pass before the 2026-04-23 closeout-polish landed). This review measures the delta and adds new findings.

## What landed cleanly since 2026-04-22

The 2026-04-23 walkthrough-closeout polish (and the prior 2026-04-22 partner-walkthrough polish) shipped six editorial-class items the prior review had flagged. Verified visible in this pass:

1. **Review effort scale: 11 anchors → 3 anchors** (`Easy / Right / Hard`). Major cognitive-load drop on the session-closing screen. Captured: `16a-review-empty.png`, `16b-review-right-selected.png`.
2. **Quick-tags card removed from Review.** Review is now two cards (effort, good-passes) plus an optional note. The tag-state anomaly the 2026-04-22 review flagged is moot at the product layer.
3. **Hairline divider between effort and good-passes cards.** Reads as a deliberate section break rather than two adjacent equal-weight blobs.
4. **`Done` is full-width primary; `Finish later` is a quiet underline link.** Restores hierarchy after the equal-primary experiment was reversed (per 2026-04-24 founder design feedback). Disabled-state `Done` is now properly neutral gray, not peach — directly addressing the 2026-04-22 finding that "the disabled CTA can read as lightly active."
5. **2-hour Finish-Later countdown subtitle deleted** from the Review footer; expired-stub behavior unchanged. Footer reads as still / instructive instead of clock-pressured.
6. **Posture-sensitive Safari-eviction copy moved off Complete** into a Settings *About local storage* sub-section. Complete now closes with a single restrained "Saved in this browser on this device" + a small "Why is this?" link. Captured: `17-complete.png`, `11-settings.png`.

These are all correctly sized to the editorial-class authoring-budget cap and they are visible. The Review screen in particular is materially calmer than the 2026-04-22 capture.

## Core UX flow (as observed)

```
First-open  →  Skill-level (/onboarding/skill-level)
            →  Today's setup (/onboarding/todays-setup)
            →  Safety (/safety)
            →  Run, block 1 (/run)
            →  Transition (/run/transition)
            →  Run, block 2 …
            →  Review (/review)
            →  Complete (/complete/:id)
            →  Home (/)

Returning   →  Home  ──[ Review pending? ]──┬──► Review (resume)
                       ├──[ Resume in-progress draft ]──► Setup → Safety → Run …
                       └──[ Lite resume "Last · Repeat" ]──► Setup pre-filled
                       Settings link in footer.
```

The flow is **linear, predictable, and short**. Every screen has at most one or two ways out: either commit forward (primary CTA), or step back (small secondary). There are no sub-modes, no nested wizards, no settings sprawl. This is the single biggest virtue of v0b and it should be defended in the M001 full build.

## Screen-by-screen (post-2026-04-23 polish)

### Skill-level onboarding (`/onboarding/skill-level`)

Captured: `12-skill-level.png`.

**Good.**
- Five cards (`Just starting` / `One-season rec player` / `Active club / league player` / `Competitive amateur` / `Not sure yet`), bold label + one-line description, single column. Reads in one breath.
- Voice is warm without being cute ("Keeping a friendly toss alive"). Strong *jo-ha-kyu* open per the visual direction.
- "Not sure yet" escape hatch is the right move — explicitly signals "we won't pigeon-hole you."

**Issues (carried from 2026-04-22, unchanged).**
- `Where are you today?` H1 still sits flush-left at the same horizontal indent as the cards. It reads more like a field label than a hero question. The focal-zone rule from `japanese-inspired-visual-direction.md` would call for a slightly bigger H1 with more air beneath it.
- No back / skip / step indicator. A first-time user does not yet know whether this is a one-time gate or a permanent part of onboarding. A single quiet "Step 1 of 2" or two dots would reduce commitment anxiety without violating the restraint principle.

**User intent at this screen.** "Tell the app what kind of player I am, in one tap, without overcommitting."  Currently served well enough to not block the loop, but the H1 weight and missing step indicator are still mild friction.

### Today's setup (`/onboarding/todays-setup`, `/setup`)

Captured: `12-setup.png`.

**Good.**
- Chip pairs (Players / Net / Wall / Time / Wind) match how a player actually describes conditions to a teammate. The pattern is exactly the right shape for low-typing courtside use.
- Pre-fill from last session is implemented and visibly used (the chip selection on `/setup` matches the previously-set Solo + Net pair when returning).
- Button hierarchy on the bottom is clean: primary "Build session" full-width; secondary actions stay quiet.

**Issues (carried from 2026-04-22, unchanged).**
- "Back to Home" / "← Skill level" links remain visually tiny in the top-left corner — the worst spot for a right-handed thumb and easiest to fat-finger near the display edge. Pattern repeats on Safety, Review, and Settings.
- The `H1` does not visibly differ between `/onboarding/todays-setup` (first-run wizard) and `/setup` (replay). The same chips, same primary CTA, same heading position. A small badge ("First session setup" vs. "Today's setup") or a quiet left-rail indicator would tell the user what mode they are in.
- No persisted "remember Net/Wall" toggle. Net/Wall is environment-state, not session-state, and re-asking it every session is small but real friction. Listed in the 2026-04-23 plan's *Deferred / founder-session-trigger-gated* bucket; correctly held there.

**User intent.** "Tell the app what conditions I have today, fast." Served well; the only outstanding friction is the back-link size.

### Safety (`/safety`)

Captured: `13-safety-empty.png`, `13b-safety-filled.png`, `13c-safety-with-heat-tips.png`.

**Good.**
- The recency-band reword from the 2026-04-23 plan is shipped: chips read `Today / Yesterday / 2+ days ago / First time` instead of `0 days`. The session-summary subhead ("Solo + Net · 15 min · 4 blocks") in accent color is the right one-glance commitment confirmation.
- Pain question copy ("Any pain that's sharp, or makes you guard a movement?") is the right grown-up tone — clinical without being scary, with a clarifier ("Regular muscle soreness is fine") that lowers the barrier without watering the gate down. Aligned with `D86` (regulatory boundary) and `D129` (post-physio-review wording).
- The "Heat & safety tips" disclosure expanded reveals tight, scannable, courtside-relevant copy. The expanded panel is on-brand and on-rubric.

**Issues.**
- **Two `Yes / No` pairs in immediate succession still create muscle-memory risk** (carried from Player 3 + 2026-04-22). This is mid-priority but real: the Safety gate is the surface where a wrong tap matters most. Breaking the pattern between the two questions — different chip order, a small icon, a different chip width — is a cheap mitigation.
- **"Heat & safety tips" disclosure** is a small orange link with a `+` glyph at 375 px. On-brand but easy to miss in bright sun. The 2026-04-22 review recommended a slightly larger tap target; not yet shipped.
- **No ghost / disabled "Continue" button is visible while the form is incomplete.** The lower half reads as "page ended" until the second answer is given. A reserved-but-disabled CTA from the start would give the eye an end-of-form anchor.

**User intent.** "Confirm I'm safe to train, fast, without it feeling like a medical questionnaire." Served well in tone; mildly imperfect in muscle-memory and end-of-form anchoring.

### Run, warm-up block (`/run`)

Captured: `14a-run-warmup.png`.

**Good.**
- Drill name (H1), accent-colored phase / index ("Warm-up · 1 of 4"), large mono **timer**, single-row progress under the timer, and a Pause + Next + Swap stack — the information budget is genuinely disciplined.
- "Show full coaching note" disclosure on the warm-up coaching note is now applied (it was the missing pattern flagged in the 2026-04-22 review for warm-up and cool-down). First contact gets a 2-line teaser; expansion is opt-in. Captured visibly on `14a-run-warmup.png`: the body shows a one-line description plus a "Show full" link rather than the old numbered-step blob.
- "Chosen because: …" reason line is present and quiet, not loud — correctly used as a confidence-builder, not a sales pitch.

**Issues.**
- **Coaching-note card still uses orange body text on peach surface.** Intentional per `D86` / Phase F3, and the measured contrast is above AA on the `info-surface` token, but on real outdoor hardware this is the highest-risk surface in the app. Recommended explicit outdoor check on the D91 field run; not yet performed.
- **No visible block-end countdown cue** other than the numerical timer and a thin progress bar. From 2 m the progress bar reads as decorative underline. A thicker bar with a remaining-time chip near the bar would make the last-30-s push obvious. **Listed in the 2026-04-23 plan's *Deferred / founder-session-trigger-gated* bucket** — correctly held there pending founder evidence, but a non-trivial outdoor-glanceability gap.

**User intent.** "Tell me what to do right now, with a clear sense of how long is left." First half served well; the second half (time-remaining glanceability) is genuinely unsolved.

### Run, work block (`/run`)

Captured: `14e-run-work-block.png`, `14d-run-after-swap.png`.

**Good.**
- Same H1 / phase-row / mono-timer / progress-bar pattern as warm-up — consistency is doing real work here.
- The "Try a different drill" / Swap surface is clean and the after-swap state shows the new drill cleanly without losing context. Captured on `14d-run-after-swap.png`.
- Pause and Next buttons are large enough for a sweaty thumb and clearly distinguished by treatment.

**Issues.**
- Same `coaching-note orange-on-peach` and `block-end glanceability` carry-overs as warm-up.
- The cue/safety strip ("Breathe. · Avoid pain. · Hold steady.") is restrained and appropriate. No issues here, noting it as confirmed-good.

**User intent.** Same as warm-up. Served well except for time-remaining glanceability.

### Run, paused (`/run` with timer paused)

Captured: `14c-run-paused.png`.

**Good.**
- Pause state is visually clear (button glyph swap, timer reads "Paused"), but the rest of the screen does not blink, flash, or redraw — a calm pause is the correct affordance for someone who paused to deal with a real-world interruption.
- Resume CTA returns the timer to where it was without surprise.

**Issues.**
- Minor: no sense of *how long* the session has been paused. Not clearly important for an amateur self-coached use case; flag-only.

### Run, pre-roll hint (`/run` first-block of session)

Captured: `14b-run-preroll.png`.

**Good.**
- The pre-roll hint shows up exactly when needed (first block of a session, before the timer is started) and stays out of the way thereafter. Voice ("Keep the screen on; locking your phone pauses the timer and sound.") is direct without being preachy.
- Wake-lock copy is on-thesis: it is a real-world constraint and the app says so plainly.

**Issues.**
- The hint is a quiet bottom-banner; on a small screen it sits below the timer and competes mildly with the cue strip. Not blocking; flag-only for the typography pass.

### Transition between blocks (`/run/transition`)

Captured: `15-transition.png`, `15b-transition-cooldown.png`.

**Good.**
- Two screens, two states: between work blocks the transition page shows the next block's name + a "Start next block" primary CTA + a small "30s rest" indication; before the cool-down the transition shows the cool-down framing in a quieter tone.
- The `15b-transition-cooldown.png` capture confirms cool-down is not treated as a second-class throwaway — it gets the same H1, the same phase row, the same timer treatment as the warm-up. This is the *equal cool-down review* invariant from `courtside-copy.mdc` honored at the layout level.

**Issues.**
- Transition does not include an "audible structure" cue for sub-blocks. The 2026-04-22 reconciled file flagged audible structure for timed sub-blocks as a *shipping gap* (still open). Not blocking the loop but real.

**User intent.** "Pause at a natural break, then continue when I'm ready." Served well.

### Review (`/review`)

Captured: `16a-review-empty.png`, `16b-review-right-selected.png`.

**Good.**
- *Major calmness improvement.* The 11-tile RPE grid is gone. Three big chip buttons (`Easy / Right / Hard`) with the disabled-Done state in proper neutral gray. The hairline divider between the effort card and the good-passes card reads as a deliberate section break.
- "How hard was your session?" is a real question; the cool-down review parity is honored (no second-class effort scale).
- Good-passes card uses two big tap-to-type spinbuttons (`Good`, `Total`) and a "Couldn't capture reps this time" toggle — exactly the right shape for a sweaty thumb at the end of a session. The success-rule clarifier ("ball reached the target zone or the next contact was playable. If unsure, don't count it as Good.") is on-thesis: the app teaches the metric instead of relying on the user's own definition.
- Filled state (`Right` selected) animates cleanly: the chip fills, the disabled-Done copy ("Rate your effort above to submit.") disappears, and `Done` becomes the full-width primary action with `Finish later` underneath as a quiet underline link.

**Issues.**
- **Good-passes card on a non-count drill** (e.g., when the main-skill drill's `successMetric.type` is non-count) is correctly *hidden entirely* per the 2026-04-23 plan. Verified via capture on a Solo + Net session that uses count metrics (card visible). Should be re-verified on a non-count drill in a follow-up pass; flagging here as not directly captured in this review.
- **Effort labels are still slightly ambiguous.** `Right` is intended to mean "right-effort, the load matched my session goal" — i.e. the *just-right* middle band. A first-time user could read it as "yes (correct)" or as a body-side label (right vs. left). The 2026-04-23 plan called this out and the wording stuck because the alternatives (`Just right`, `On target`, `Honest`, etc.) all had downsides. Worth one more pass at the next courtside-copy review, with a willingness to leave it if no better word exists.
- **No micro-copy explaining the 0/0 default for Good/Total** when the spinbuttons sit empty. A user might tap "Done" without realizing the 0 is the literal value being saved. Either change the empty-state to a placeholder dash, or keep 0 but require an explicit interaction (or "Couldn't capture reps this time" toggle) before submit. Mild but real.

**User intent.** "Close the loop on the session in under 20 seconds, without lying." Served well after the closeout polish; the empty-state-defaults-to-0 question is the one real friction left.

### Complete (`/complete/:id`)

Captured: `17-complete.png`.

**Good.**
- Quietly elegant: small subdued "Today's verdict" subhead, a single horizontal hairline rule (very *tokonoma*-like), an H1 verdict ("Keep building"), and a one-sentence sub ("Completed session 14. One more in the book. Ready when you are."). The verdict copy is restrained — not "🎉 Way to go!" — and aligns with `brand-ux-guidelines.md` voice ("steady, deliberate, not gamified").
- Session recap card (Session / Drills completed / Good passes / Effort) is the right level of detail. "Good passes" rendering as `–` when not captured is correct restraint.
- Footer carries a single "Back to home" primary action, a green check + "Saved in this browser on this device" reassurance, and a small "Why is this?" link to Settings. The eviction-copy compression from the 2026-04-23 plan is shipped and visibly cleaner than the 2026-04-22 version.

**Issues.**
- **"Completed session 14" is confusing on a personal device.** The number is the local session count and is correct, but "session 14" without context can read as "you are part of cohort 14" or "you were the 14th person to do this." Either drop the number, or contextualize it (`This is your 14th completed session.`). Listed in the 2026-04-23 plan's *Deferred / founder-session-trigger-gated* bucket as the *first-session-only verdict string* item; held correctly, but the "session N" framing is independent and could land as editorial.
- "Today's verdict" tag is a touch corporate for the brand voice. `brand-ux-guidelines.md` favors questions and statements over labels. A wording tweak (`Session closed.` or simply omitting the tag) would land cleaner.

**User intent.** "Confirm the session is saved and let me move on." Served well. The two issues here are voice nits, not flow blockers.

### Home — returning user (`/`)

Captured: `01-home-returning-user.png`, `18-home-after-completion.png`.

**Good.**
- Clean three-tier vertical stack: review-pending card (when applicable), `Last · {focus} – Repeat` lite-resume card, "Your recent workouts" list, Settings link in the footer. No bottom nav, no badges, no spurious counts.
- The "Repeat" affordance on the lite-resume card is the right shape for a returning user who is in a hurry: one tap, pre-filled.

**Issues.**
- **"Your recent workouts" list rows have low information density per row.** Each row reads `Day · Focus · Status` (e.g., `Today  Serving  Done`). When the focus ends in a status-like word ("Partial"), the row reads as `Friday  Partial  Partial` — confusing and ugly. Ship-fix-cost is small (rename the focus value to something not-ambiguous when it would collide with a status string, or render focus and status with visibly different weights/colors so they don't run together).
- **Recent-workouts list rows are not obviously tappable.** No chevron, no hover affordance at desktop, no per-row detail screen exists yet. The user reasonably expects to tap into a session and read the recap. Two clean options: (a) make rows a no-op for v0b and add a tiny "(no detail view yet — coming in M001)" footer, or (b) ship a minimal per-session detail screen reusing the Complete recap card. Option (a) is editorial-class and could land before D91; option (b) is Tier 1b.
- **The Review-pending card on `18-home-after-completion.png` is correct** (a previous session's review is still pending after I completed today's), but the wording "Review your last session" can read as "review the *most recent* session" — i.e. the one I just completed — which is not what is happening. The card is actually offering to finish the *previously unfinished* review. A small wording tweak ("Finish your earlier review" or "One review still open") would disambiguate.
- **Settings is in the footer as an underline-only link.** It is consistent with the brand's quiet-secondary-action posture, but at 390 px in sun the underline-only treatment is the thinnest tap target on the screen. If it survives the courtside-copy invariants, it survives; if it gets a slightly larger hit area, also fine.

**User intent.** "Pick up where I left off, fast, without the app trying to upsell me on features." Served extremely well; the recent-workouts row collisions and the review-pending wording are the two cleanest editorial-class wins.

### Settings (`/settings`)

Captured: `11-settings.png`.

**Good.**
- Quiet, single-column, minimal. The new "About local storage" sub-section (driven by `getStorageCopy(posture)`) is the canonical home for the eviction-copy that used to live on Complete. Posture-sensitive wording is preserved without polluting the session-closing surface.
- The page is the right shape for a v0b: Settings is *where uncommon information lives*, not where unloved features go to be hidden.

**Issues.**
- The page is sparse, which is correct, but the "Back to Home" / "← Home" link is again the thumb-corner pattern from Setup / Safety / Review. Same treatment recommendation.
- No visible app-version / build-id surface. For the D91 field run this is small but real — testers needing to report what build they are on currently have nowhere to look. A small "Build {sha-short} · {date}" row at the bottom would be enough.

**User intent.** "Find one specific piece of information without being distracted by feature controls I don't need." Served well.

## Pros and cons of v0b as a whole

### Pros (defend these in the M001 full build)

1. **Linear flow with no sub-modes.** Every screen has a single primary action and at most one secondary. Does not feel like a CMS or a settings sprawl. Aligned with `D119` (v0b feature-complete as the D91 field-test artifact) and the *opinionated default + bounded escape hatches* posture (`prescriptive-default-bounded-flex.md`).
2. **Restrained voice, well-kept-notebook tone.** No exclamation points, no badges, no streak gamification, no emoji confetti. The verdict copy on Complete (`Keep building.`) is exactly right for a self-coached amateur who takes their sport seriously. Aligned with `brand-ux-guidelines.md`.
3. **Pain-gated safety wording is grown-up.** "Any pain that's sharp, or makes you guard a movement?" with a regular-soreness clarifier is on-rubric for `D86` (regulatory boundary) and avoids both alarmism and dismissiveness.
4. **Equal cool-down review.** Cool-down is not a throwaway. Same H1, same phase row, same timer treatment as warm-up. The *equal cool-down review* copy invariant is honored at the layout level. This is non-trivial; many fitness apps fail this.
5. **Closeout-polish improvements stuck.** All six items the 2026-04-23 plan promised are visibly shipped, and the Review screen in particular is materially calmer than the 2026-04-22 baseline.
6. **Local-first save copy is honest.** "Saved in this browser on this device" + "Why is this?" link is a clean way to communicate the eviction-prone reality without being either alarmist or hand-wavy.
7. **Pre-fill from last session works on Setup.** Returning users do not re-pick the same Net + Wall + Time + Wind every time; the chip selection is restored. This is both a UX win and a *signal* the app respects the user's time.

### Cons (what is genuinely friction-bearing today)

1. **Block-end glanceability is unsolved.** From 2 m, neither the progress bar nor the timer cleanly tells me "30s left." This is the highest-leverage outdoor-first miss in the build, and it is correctly held in the *founder-session-trigger-gated* bucket — but it is not a small problem.
2. **Coaching-note orange-on-peach surface is the highest-risk outdoor surface.** Above AA on paper, untested in real sun. Listed for D91 field validation; not solvable by editorial pass.
3. **Top-left back-link pattern repeats on Setup, Safety, Review, Settings.** Tiny target, far from the thumb, near the display edge. Editorial-class fix.
4. **`0/0` Good-passes default on Review** can be saved as literal-zero with a single tap on `Done`. Either dash-placeholder the empty state or require an explicit interaction. Editorial-class fix.
5. **Recent-workouts list collisions.** `Friday  Partial  Partial` reads ambiguously when focus and status overlap in vocabulary. Editorial-class fix at the focus-name layer.
6. **No app-version / build-id surface in Settings.** Small but real for D91 testers.
7. **Skill-level H1 weight and missing step indicator** carry over from 2026-04-22 unchanged.
8. **Two `Yes / No` pairs on Safety** still create muscle-memory risk; one icon or different chip width would mitigate.
9. **`Today's verdict` label** on Complete is a touch corporate for the brand voice.
10. **Recent-workouts rows are non-tappable but look like they should be tappable.** Either disclose the limitation, or ship a minimal detail screen reusing Complete's recap card.

## What user intents v0b serves well, badly, and not at all

| Intent | Today's posture |
| --- | --- |
| "Tell me what to do right now, with a clear sense of how long is left." | **Half-served.** The `what` is excellent; the `how-long-left` is unsolved (block-end glanceability). |
| "Confirm I'm safe to train without it feeling like a medical questionnaire." | **Well-served.** Voice is right; the muscle-memory and disclosure-target nits are mild. |
| "Pick up where I left off, fast." | **Well-served.** Resume / Repeat / Review-pending pattern is exactly the right shape. |
| "Close the loop on the session in under 20 seconds, without lying." | **Well-served after the closeout polish.** The `0/0` default is the only real friction. |
| "Find one specific piece of information without being distracted by feature controls I don't need." | **Well-served.** Settings is sparse and correct. |
| "Tap into an old session and read the recap." | **Not served.** Recent-workouts rows look tappable but are not. Either disclose or ship the detail screen. |
| "Decide whether to do another session today." | **Partially served.** Complete's verdict copy ("One more in the book. Ready when you are.") opens the door. The Home post-completion state could either show a one-line streak / cadence cue, or — more on-brand — leave the decision entirely to the user. The current "leave the decision to the user" choice is correct. |
| "Train as a pair, not a solo." | **Service-aware but not yet pair-first.** `D132` (2026-04-22) calls for pair-first mental-model checks on every editorial pass; v0b layout is solo-first with pair-friendly copy. Not blocking; flagged as a follow-on for any Tier 1b work that touches Setup or Run. |
| "Use the app outdoors in real sun on real hardware." | **Unverified.** Currently held by the D91 field run. The two surfaces flagged for explicit outdoor check (coaching-note orange-on-peach, progress-bar glanceability) need real-device evidence. |

## Findings & recommendations, classified

Classification follows the 2026-04-22 adversarial-memo authoring-budget discipline (`docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §Authoring-budget cap):

- **EC = editorial-class:** copy / typography / token / small visual fix / conditional-render hide. Walkthrough evidence is sufficient. May ship in-tier without unlocking Tier 1b.
- **T1B = founder-session-trigger-gated Tier 1b.** Held until founder-use ledger advances per `D130`.
- **D91-FIELD = needs real-device sunlight evidence.** Held by the D91 field run.
- **DECISION = needs a product/voice decision before it can ship.**

| # | Finding | Class | Effort | Notes |
| --- | --- | --- | --- | --- |
| F1 | Skill-level H1 weight and step indicator | EC | Small | Increase H1 size step + add a quiet "Step 1 of 2" indicator; matches `japanese-inspired-visual-direction.md`. |
| F2 | Visible mode badge on Setup (`First session setup` vs `Today's setup`) | EC | Small | Distinguishes wizard from replay. |
| F3 | Top-left back-link is too small | EC | Small | Increase hit target to ≥ 44 pt or move to a down-screen secondary action. Repeats across Setup / Safety / Review / Settings. |
| F4 | Two `Yes / No` pairs on Safety create muscle-memory risk | EC | Small | Different chip order, an icon, or different chip width on the second question. |
| F5 | "Heat & safety tips" disclosure is easy to miss in sun | EC | Small | Slightly larger tap target or inline "▸ Heat & safety (tap to read)." |
| F6 | Reserved-but-disabled Continue CTA on Safety while form is incomplete | EC | Small | Provides an end-of-form anchor. |
| F7 | `0/0` Good-passes default on Review can be saved with a single Done tap | EC | Small | Dash-placeholder the empty state or require an explicit interaction before submit. |
| F8 | Effort label `Right` could be misread as "yes (correct)" | DECISION + EC | Small | One more courtside-copy pass; willing to leave if no better word exists. |
| F9 | "Completed session 14" wording on Complete is ambiguous | EC | Small | Recontextualize as "This is your 14th completed session." or drop the number. |
| F10 | "Today's verdict" tag is corporate-ish | EC | Small | Drop, or rephrase as a question / statement consistent with brand voice. |
| F11 | Review-pending card wording on Home post-completion is ambiguous | EC | Small | "Finish your earlier review" or "One review still open." |
| F12 | Recent-workouts row collisions (`Friday Partial Partial`) | EC | Small | Rename the colliding focus values, or render focus and status with visibly different weights / colors. |
| F13 | Recent-workouts rows look tappable but are not | EC (disclose) or T1B (build) | Small / Medium | Option A: add a tiny "Tap-to-view coming in M001" footer. Option B: ship minimal detail screen reusing Complete's recap card. |
| F14 | App-version / build-id row in Settings | EC | Small | Adds D91 field-run telemetry-by-hand. |
| F15 | Block-end countdown cue (thicker bar + remaining-time chip) | T1B | Medium | Already correctly held in the 2026-04-23 plan's Deferred bucket. |
| F16 | Persist Net / Wall across sessions | T1B | Medium | Already correctly held. |
| F17 | Auto-fill training recency from last session timestamp | T1B | Small | Already correctly held. |
| F18 | Audible structure cue for timed sub-blocks | T1B | Medium | Already a flagged shipping gap. |
| F19 | Coaching-note orange-on-peach in real sun | D91-FIELD | n/a | Cannot be resolved without outdoor evidence. |
| F20 | Pre-roll wake-lock hint placement at small viewports | EC | Small | Slightly higher in the layout, or as a single-line cue strip rather than a banner. |
| F21 | Pause duration not surfaced when paused | T1B (low priority) | Small | Probably not worth the air-time. Listed for completeness. |

### Recommended pre-D91 batch (editorial-class only)

If a tight follow-on polish pass is run before the D91 field test, **F1, F2, F3, F4, F5, F6, F7, F9, F10, F11, F12, F14, and F20** are all editorial-class, low-risk, and addressable inside a single focused session. None of them require unlocking Tier 1b; all of them improve the surface a D91 tester will see. **F8** is editorial-class but needs a voice decision and should be run through one more courtside-copy review first.

### Held correctly by the existing Tier 1b plan

**F13 (build), F15, F16, F17, F18, F21** — these are correctly in the *founder-session-trigger-gated* bucket per the 2026-04-23 plan and the 2026-04-22 reconciled file. **No new Tier 1b authoring is recommended by this review.** The point of this pass is to verify v0b is calm enough to run the D91 cohort against, not to expand scope.

### Held by the D91 field run

**F19** (coaching-note orange-on-peach in real sun) cannot be resolved by simulation. Calling it out so the field-run protocol explicitly logs it.

## What this review does NOT do

- **Does not unlock Tier 1b** authoring per the 2026-04-22 adversarial-memo authoring-budget cap.
- **Does not propose schema changes**, persistence-behavior changes, new drill records, or new SetupScreen toggles.
- **Does not modify** `D86`, `D91`, `D119`, `D125`, `D129`, `D130`, or `D132`.
- **Does not replace** the 2026-04-22 manual UI design review; it builds on it. Both reviews remain readable in their dated locations.
- **Does not migrate** existing design-canonical docs (`brand-ux-guidelines.md`, `japanese-inspired-visual-direction.md`, `outdoor-courtside-ui-brief.md`, the `courtside-copy.mdc` rule). They are referenced by 40+ files (plan docs, decision references, source code, `.cursor/rules`); a migration is its own change. The new `docs/design/` hub indexes them in place instead.

## Where this lives

- This review: `docs/design/reviews/2026-04-26-agent-ux-review.md`.
- Screenshots: `docs/design/reviews/2026-04-26-agent-ux-review-screenshots/` (18 files, named by the order they appear in the flow).
- Discovery hub: `docs/design/README.md`.
- Catalog registration: `docs/catalog.json` `docs[]` and `update_routing` rows.
- Editorial routing: `docs/README.md` Structure table row for `design/`.
