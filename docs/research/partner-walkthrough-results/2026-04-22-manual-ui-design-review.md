# Manual UI / design review — Volleycraft v0b

**Date:** 2026-04-22
**Method:** Cursor IDE browser resized to iPhone-class viewport (390 × 844 CSS px), dev server on `http://localhost:5176`, navigated the full cold-start → session → review → complete → home → settings loop. Not a physical device — no safe-area, Dynamic Type, or real sunlight verification.
**Scope:** Layout, typography, color, contrast, hierarchy, touch affordance, alignment with the Volleycraft design language (`docs/research/japanese-inspired-visual-direction.md`, `docs/research/outdoor-courtside-ui-brief.md`), and the intended emotional response (calm, focused, trust, investment).

## Rubric

1. **Outdoor-first legibility** — the courtside brief's minima: white / off-white surface, near-black text, WCAG AA floor, body ≥ 16 px preferred.
2. **One focal zone per screen** — the Japanese visual direction: `tokonoma` structural rule, no competing equal-weight clusters.
3. `**Ma`, not emptiness** — breathing room that clarifies hierarchy vs. dead space that reads as "unfinished."
4. **Thumb-zone & affordance** — primary action at bottom, tappable things *look* tappable (not just text).
5. **Shibui tone** — restrained, intentional, one accent color used deliberately for action or status.
6. **Emotional response** — does this feel like a main training tool (trust, joy, investment), or a data-entry form?

## Screen-by-screen

### Skill-level onboarding (`/onboarding/skill-level`)

**Good.** Five cards, bold label + one-line description, single column, no horizontal overflow at 390 px. The "Not sure yet" escape hatch is the right move and signals the app won't pigeon-hole you. Copy voice is warm without being cute ("Keeping a friendly toss alive"). Strong jo-ha-kyu *open* — light and gentle.

**Issues.**

- `Where are you today?` is the H1 but visually it sits flush-left at the same horizontal indent as the cards. Reads more like a field label than a hero question. A slightly larger H1 with more air beneath it would strengthen the focal zone per `P2 / shibui` in the visual direction.
- No back / skip / step indicator. A tester will not know whether this is a one-time gate or a permanent part of onboarding. One small "Step 1 of 2" or progress dots would reduce commitment anxiety.

### Today's setup (`/onboarding/todays-setup`, `/setup`)

**Good.** Chip pairs (Players / Net / Wall / Time / Wind) are exactly how a player describes conditions to a teammate. The selected-state treatment — peach fill + orange border + orange text — reads clearly once *any* chip is selected, and the three-across Time / Wind rows still fit at 375 px.

**Issues.**

- **"Back to Home" / "← Skill level" link is visually tiny and far from the thumb.** On 844 px it sits in the extreme top-left, which is the hardest spot for a right-handed thumb and the easiest to miss near the display edge. This pattern repeats on Safety, Review, and Settings. Consider a taller 44-pt hit target, or a down-screen secondary action.
- **Disabled "Build session" state (before a choice) is peach.** Because the selected-chip state is also peach, a tester at first glance could read the disabled CTA as "lightly active." Either dim it further (gray 100 / 50 % text) or suppress it entirely until the form is valid — the latter is cleaner and on-thesis with "fewer equally-weighted elements."
- No `H1` visual weight change between the "wizard" (`/onboarding/todays-setup`) and the replay (`/setup`) view. Hard to tell if I'm in first-run or editing a draft. A small badge ("First session setup" vs. "Today's setup") or a quiet left-rail indicator would help.

### Before we start / safety (`/safety`)

**Good.** "Any pain that's sharp, or makes you guard a movement?" is the right grown-up tone — clinical without being scary, and the clarifier ("Regular muscle soreness is fine") lowers the barrier. Session summary subhead ("Solo + Open · 15 min, 4 blocks") in accent color confirms what you're committing to in one glance.

**Issues.**

- **"0 days" reads as alarmist in the chip row.** The subhead explicitly reframes this as positive ("0 days or First time means a shorter, lower-intensity start") but the default tester reaction to a high-number-vs-zero framing will still be "did I mess up?" This was flagged in the 2026-04-21 iPhone review and the Player 3 note; it is still true. Consider rewording the chips as **"Today," "Yesterday," "2+ days ago," "First time"** — same information, less spreadsheet tone, no ambiguity about whether zero is good.
- **Two "No / Yes" pairs in a row create muscle-memory risk** (also flagged by Player 3). Making the second question's chips a different order, icon, or size would break the pattern.
- The **"Heat & safety tips"** disclosure is a quiet orange link with a small arrow. It's on-brand but at 375 px in bright sun the arrow glyph is easy to miss. If this is information the safety contract expects users to see, consider a slightly larger tap target or an inline "▸ Heat & safety (tap to read)."
- **No explicit primary CTA is visible until both answers are given.** That's a reasonable progressive-disclosure choice, but the large empty lower half while waiting for the second answer reads as "page ended." Reserving that space for a ghost / disabled "Continue" button from the start would give the eye an end-of-form anchor.

### Run screen (`/run`)

**Very good.** This is the screen closest to fit-for-purpose. Drill name (H1), accent-colored phase / index row, large mono **timer**, single-row progress under the timer, and a Pause + Next + Swap button stack — the information budget is genuinely disciplined. The **"Show full coaching note"** disclosure on longer drills directly addresses Player 3's "drill text density" concern; first contact gets a 2-line teaser, expansion is opt-in.

**Issues.**

- **Numbered-step blob still shows up on the warm-up and stretch blocks.** For those two block types (warm-up, cooldown) the progressive-disclosure pattern from the work-block coaching note is not applied, so you still see "1. Jog or A-skip. 2. Ankle hops. 3. Arm circles. 4. Pivot-back starts." as one body paragraph. Courtside sun + sweat is exactly where Player 3's complaint lands. Either apply the same truncate-with-"Show full" pattern, or bullet-split each step on its own line so the *one-thing-to-do-now* floats visually.
- **Coaching-note card uses orange body text on peach surface.** That is intentional "quiet secondary-voice" per D86 / F3, and the measured contrast is above AA on the `info-surface` token (`--color-info-surface: #fef3e8`), but in bright daylight on real hardware this is the highest-risk surface in the app. Worth an explicit outdoor check on the D91 field run.
- **"Chosen because: …" reason line is gray-on-off-white.** Copy-density is small, but the token value is intentional (`--color-text-secondary #4b5563`, ~7.47 : 1 on `bg-warm`). That is AAA on paper; it may still read "afterthought" in sun because of the small type size and italic-like weight. Consider: same color, +1 size step, no italic, shorter copy ("*Main passing rep.*").
- **No visible block countdown cue** other than the numerical timer and a thin progress bar. At a glance from 2 m I can't tell whether I'm at 30 s left or 3 min left — the progress bar is ~4 px tall and accent-only, so it reads as a decorative underline. A thicker bar with a remaining-time chip, or a small "`0:47` left" repeat near the bar, would make the last-30-s push obvious.

### Transition (`/run/transition`)

**Excellent.** Green check + finished drill name + "Complete" card, divider, small "Up next" eyebrow, next drill H1, duration, one-paragraph description, and one big "Start next block" CTA. This is the cleanest screen in the app — a textbook example of the `tokonoma` rule. Bridges the gap between drills without cognitive overhead.

**Issues.**

- **Shorten block** is a plain orange link under the CTA with no icon or secondary-button chrome. It's fine, but because it's the only "escape" a tired athlete has, it deserves slightly stronger visibility — a pill-shaped outlined button at the same width as the CTA above would not violate the calm and would surface the option when it matters.

### Quick review (`/review`)

**Good bones, biggest design debt.** "How hard was your session?" (0–10), "Good passes" spinner, "Quick tags," "Short note," Submit. The structure is exactly what a solo session needs — nothing more.

**Issues — this is where I would invest next.**

1. **Unselected effort numbers (0–10) and quick tags look like static text, not chips.** Before a selection is made, the 0–10 grid has no borders, no background fill, no chip affordance — the numbers sit on the card as raw text. After selection, a single tile snaps to filled orange with white text, which is beautiful. But the *pre-selection* look is the one a tester sees first, and Player 3's "I'd leave both at zero" instinct is partly caused by this: tappable things should always *look* tappable. A faint outline or neutral chip background on all 11 tiles (before selection) would fix this without breaking the shibui palette. Same applies to `Too easy / About right / Too hard / Need partner`.
2. **The effort grid wraps 0–5 then 6–10.** The asymmetric 6-then-5 split is not inherently wrong (`P5 — asymmetry for hierarchy`), but at 375 px it reads as a layout accident rather than an intentional emphasis, because neither row is given extra weight. Either `0-1-2-3-4-5 / 6-7-8-9-10` with the second row slightly wider / accented "harder" side, or a single 11-wide horizontal slider would read as more deliberate.
3. **Three stacked gray cards is the most bordered-heavy screen in the app.** The Japanese visual direction note explicitly calls out Review as "the best place to explore the calmer direction first — fewer border-heavy boxes." Swapping the card backgrounds for divider lines + stronger section heading + generous `gap-6` would make the screen feel less like a form and more like an intake sheet.
4. **Disabled Submit is peach again.** Same concern as Setup: visually similar enough to the selected-chip state that a tester can mistake it for "close to ready." A true gray disabled state would remove ambiguity.
5. **Interaction anomaly observed:** clicking the "About right" Quick tag after selecting effort **7 ("Hard")** appears to re-set the effort chip to **5 ("Moderate")** and auto-submit. The review landed on Complete with Effort = Moderate even though 7 was previously selected. Either the tag is wired to overwrite effort (unexpected) or an adjacent hit area caught the submit. Worth reproducing and filing — see `docs/specs/m001-review-micro-spec.md` for the intended contract.
6. **"Good passes" target-zone copy is the heaviest prose on the screen.** The success rule is necessary for the serious tester, but for the casual Player-3 persona it reads as homework. Consider a collapsed-by-default "What counts as Good?" affordance — matches the coaching-note progressive disclosure from Run.

### Complete (`/complete/:id`)

**Excellent.** The strongest screen in the app for emotional response.

- The tiny two-dash ornament above the verdict ("═") is exactly the `shibui` restraint the direction note asks for — a decorative moment that earns its place.
- "Keep building" + "Session 1. One more in the book. Ready when you are." is the right closing tone: affirming, honest, forward-looking. It respects the trio of joy / trust / investment without overclaiming.
- Session recap as a key-value table (no chrome) is honest and scannable.
- **Save-status line** ("✓ Saved in this browser on this device") plus the frank iPhone-Safari caveat is the single most trust-building sentence in the product. Do not dilute it.

**Issues.**

- **"Back to home"** CTA is anchored to the bottom, which is correct for thumb reach — but the gap between the recap and the CTA is ~55 % of the viewport. Either raise the CTA to ~60 % down the page, or fill the band with something intentional (a tiny "Next up, when you're ready: [light] [moderate]" peek, or just more generous air around the verdict). Dead space on the *completion* screen is cheapest — but the verdict itself is currently surrounded by less air than the empty band below it, which inverts the hierarchy.
- **Verdict copy** is one of three: `Keep building`, `No change`, a third case per spec. On a session with effort = 5 (moderate), "Keep building" is correct, but for a first-ever session a subtle "Session 1 → logged." or similar would make the first-complete moment feel specifically milestone-ish rather than pattern-matched to later sessions.

### Home (`/`, LastComplete state)

**Good, close to right.**

- Brandmark + "Volleycraft" wordmark, "Your last session" card with Solo + Open / 15 min · today / **Repeat this session** (primary) / Start a different session (secondary link), "Your recent workouts" list, Settings link, "Your data stays on this device."
- The priority model is clear: the last session is the main action, with one obvious escape to build something new.

**Issues.**

- **Brandmark at 32 px renders ambiguous.** The glyph is a volleyball silhouette in a rounded square (per `src/components/Brandmark.tsx`), but at 32 × 32 on this viewport the curves read as a stylized "C" or "e" rather than a ball. Not wrong per se, but at thumbnail scale the brand recognition leans on the wordmark, not the mark. Either bump the mark to 36–40 px on Home only, or add a micro-caption test — real testers should be asked to identify the mark without context.
- **"Your recent workouts" row** ("Today   Passing   Done") is deliberately non-interactive (see the component JSDoc — Tier 1a decision). That is documented, and I respect the rationale. For a casual user, though, the plain-text row *looks* like a link that forgot to be a link. A sub-heading ("Last three — tap for detail in a future update") or even a muted `—` between columns would signal "read-only log" rather than "broken link."
- **Settings** as a centered underlined link beneath the recent-workouts list is the lightest-weight settings entry I've seen in a PWA, which is intentional and good. But on 844 px it sits at ~45 % down the page with nothing below it for another 55 %. This is the cleanest candidate for bottom-anchoring Settings (small "Settings" + "Your data stays on this device" footer).

### Settings (`/settings`)

**Good, intentionally minimal.** Export JSON, one helper sentence, Back link. Nothing to fix; the minimalism is the feature.

## Cross-cutting observations

### Typography

- **Inter Variable** with the `cv11` single-story `a` stylistic set is a strong, on-thesis choice (`P2`, shibui). The lowercase `a` does read calmer than the geometric double-story default. Good.
- **JetBrains Mono Variable** on the block timer is the right pairing — the timer is the only place in the app that *needs* a mono display face, and the variable weight picks up well at ~72 px.
- The `--text-body` / `--text-body-secondary` tokens are scaffolded at 14 px waiting on D91 evidence (`D127`). My recommendation after this walkthrough: **the outdoor floor is more important than the scaffolding prudence**. The "Chosen because," coaching note, and "Good passes" success-rule copy are the three places I most expect to regret 14 px in sun. When D91 evidence arrives, the retune to 16 px / `leading-6` should land in the same PR as field-test insight — do not split it across two passes.

### Color

- One accent (`--color-accent #b45309`, burnt orange) applied consistently as action + selected-state + label color. Emotional read: warm, earthy, courtside-plausible. No dark-mode bias, no gradient noise. Fully on-thesis.
- Warm-off-white (`--color-surface-calm #fcfaf5`) page field behind white focal cards does give the intended "slight pop" without breaking the outdoor contract. You can see it on Home and Review.
- **One genuine concern: peach overload.** The same peach family is used for (a) disabled CTAs, (b) selected chips, (c) the info-surface coaching card, (d) the safety chip selected state. That's not a bug — it is the palette — but the eye learns to interpret peach as "active-but-secondary" within 2–3 screens, which then makes the disabled peach CTA feel half-active. One cheap fix: give disabled CTAs a neutral gray variant so peach = attention every time.
- The 2026-04-21 token migrations (gray-600 for `--color-text-secondary`, emerald-700 for `--color-success`) did visibly improve body and success copy legibility. Good call.

### Motion

- Motion is intentionally minimal. Chip selection flips to filled orange crisply, Next / Start-next-block navigations are instant. Nothing jitters or shimmers. On-thesis with shibui.
- One missing motion: **the 3-2-1 preroll**. Didn't catch it in this walkthrough (clicked through before it fired) but worth confirming on D91 that the countdown tick is *visibly* perceptible on the timer — the audio tick exists (`lib/audio.ts`); the visual one is what the athlete will see if AirPods are in.

### Touch targets

- All chips and CTAs measured visually at ≥ 44 pt. The tight zone is the top-left `← Back` on every screen — small link, hard to hit, near edge.
- The 0–10 effort numbers in Review *may* be at the comfortable lower bound (~36–40 pt each based on the grid). Worth a Playwright overlay check, per the 2026-04-21 iPhone review's follow-up.

### Emotional response

Matched against the `docs/vision.md` triple (joy, trust, investment) and this rubric:

- **Trust:** the save-status line on Complete, the matter-of-fact safety copy, the offline "Your data stays on this device" throughline, and the honest three-case verdict structure all compound into a "this thing knows what it is" feeling. Strong.
- **Joy:** the warm palette, the tiny `═` ornament on Complete, the coaching-note micro-copy ("Short hops, loud feet."), and the Inter `cv11` humanist `a` do land as *pleasurable* rather than clinical. Not maximal joy — it's a restrained joy, which is probably correct for a training tool.
- **Investment:** this is the weakest of the three today. The home screen after one session looks almost identical to the home screen after ten sessions — no streak, no small visible earned-ness, no "you've invested this much time." The recent-workouts list is three rows and then nothing. A quiet running total ("Logged: 4 sessions · 1 h 05 m") in the footer band near Settings would be an early seed. This is the cheapest place to add a single line of emotional compound interest without breaking the calm.

## Alignment summary


| Principle                             | Delivery | Notes                                                                      |
| ------------------------------------- | -------- | -------------------------------------------------------------------------- |
| One focal zone per screen             | B+       | Complete and Transition nail it. Review has three co-equal cards.          |
| `Ma` — active space                   | B        | Vertical dead space on every tall screen; CTAs often float mid-page.       |
| Shibui restraint                      | A−       | One accent, one display face, one ornament. Discipline is real.            |
| Outdoor readability                   | A−       | Tokens hit AAA on paper. Field-validate Review's small copy.               |
| Thumb zone / affordance               | B        | CTAs are bottom-weighted; unselected review chips do not read as tappable. |
| Emotional response (joy/trust/invest) | B+       | Joy and trust land. Investment surface is thin.                            |


## Top five changes I would queue before the D91 field run

1. **Add a neutral `disabled` CTA token** distinct from peach. Apply to Setup "Build session" and Review "Submit review." Cost: one token, two call-sites. Biggest single clarity win.
2. **Re-word the safety "0 days / 1 day / 2+" row** as "Today / Yesterday / 2+ days ago / First time." Same information, removes the alarmist 0. Matches the same semantic rewording the recent-workouts list did ("Yes/No" → "Done/Partial").
3. **Apply progressive-disclosure to warm-up and cooldown coaching notes**, the same pattern already used on work blocks. One fewer text blob in sun on two screens per session.
4. **Give all Review chips (0–10 and quick tags) a neutral default outline / surface** so the tappable thing looks tappable before interaction. Keeps the filled-orange selection reveal intact.
5. **Investigate the quick-tag / effort interaction** observed during this walkthrough (selecting "About right" after effort-7 appeared to reset effort to 5 and auto-advance to Complete). Either this is a real state-bug, or the tag-row's hit geometry is overlapping the Submit button — both need fixing.

## Not changed, on purpose

- The `RecentSessionsList` is deliberately passive per component JSDoc and the adversarial-memo Condition 2 rationale. Don't make it a link in Tier 1a.
- The `--text-body` scaffolding stays at 14 px until D91 evidence lands (`D127`). Recommend the retune land *with* the field-test PR, not before it.
- Settings minimalism is a feature, not a gap.

## Follow-ups

- Physical iPhone pass (safe-area, Dynamic Type, real sun) per the 2026-04-21 iPhone viewport follow-ups.
- Playwright hit-area overlay on `/review` at 375 px to confirm 44 pt floor on the 0–10 grid and quick tags.
- Repro + file the effort/tag interaction anomaly before D91 (user-visible state bug).
- Consider promoting "investment surface" (session count, minutes logged) into the M002 weekly-confidence layer rather than squeezing it into Home — the `docs/research/japanese-inspired-visual-direction.md` note already flags M002 as the highest-leverage place for calmer receipts.