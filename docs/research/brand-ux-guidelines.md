---
id: brand-ux-guidelines
title: Brand & UX Guidelines
status: active
stage: planning
type: research
authority: canonical UX behaviour reference — typography, color, copy voice, layout, iconography, states, and per-screen posture for the Volleycraft prototype and M001 build
summary: "How Volleycraft should look and behave: a concrete, screen-by-screen reference for amateur athletes who take their sport seriously."
last_updated: 2026-04-19
depends_on:
  - docs/vision.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/product-naming.md
  - docs/archive/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md
  - docs/archive/plans/2026-04-19-feat-phase-f9-inter-self-host-plan.md
  - docs/archive/plans/2026-04-19-feat-phase-f10-timer-display-face-plan.md
  - docs/archive/plans/2026-04-19-feat-phase-f11-brand-hero-typography-plan.md
related:
  - canvases/typography-review.canvas.tsx
---

# Brand & UX Guidelines

## Agent Quick Scan

- Use this note when choosing type, color, copy voice, layout rhythm, icon treatment, empty-state handling, interaction pattern, or screen posture for Volleycraft.
- This note codifies the current state of the app after F1–F11 landed. It is prescriptive going forward; any change that contradicts it should either update this note first or reference a new decision in `docs/decisions.md`.
- Not this note for: outdoor legibility floors (`docs/research/outdoor-courtside-ui-brief.md`), the shibui thesis (`docs/research/japanese-inspired-visual-direction.md`), the product-name rationale (`docs/research/product-naming.md`), or product principles (`docs/vision.md` P1–P12). Those outrank this note when they conflict.

## Audience posture

The target user is an **amateur athlete who takes their sport seriously**. They are not:

- A casual fitness user (Apple Fitness+, Peloton). Volleycraft is not entertainment.
- A professional (AVP tour). Volleycraft is not a performance-analytics suite.
- A gamified-learner (Duolingo, Strava Segments). Volleycraft does not use streaks, badges, or hype copy.

They are someone who plays beach volleyball most weekends, wants to get better by Labor Day, has limited training time, and is willing to do the work if the workflow respects their time. The product's tone should read as a **well-kept notebook**, not a push-notification machine.

### What this posture rules in

- Plain language, short sentences, matter-of-fact copy.
- Numbers visible (RPE, blocks completed, session count, minutes). Athletes count.
- One clear action per screen; no tutorial overlays; no celebratory animations.
- Undo over confirm; quiet saves; no toast-spam.
- Outdoor-legible typography and touch-target sizes that survive sand and sweat.

### What this posture rules out

- Streaks, badges, point systems, "You crushed it!" copy.
- Social-feed mechanics, leaderboards, shareable achievements.
- Onboarding tours, tooltips, feature spotlights.
- Motivational imagery, hero photos of athletes, stock photography.
- Emoji as icons, hype color (bright green, neon yellow, gradient fills).

If a proposed UI element would feel embarrassing to a 38-year-old beach player reading their phone courtside alone between drills, it does not ship.

---

## 1 · Type system

### 1.1 Families

Two bundled families, both via Fontsource (variable, OFL, precached by the PWA workbox `woff2` glob):

| Role | Family | Loaded via | Used for |
|------|--------|------------|----------|
| Sans | `'Inter Variable'` | `@fontsource-variable/inter` | All body, labels, headings, buttons |
| Mono | `'JetBrains Mono Variable'` | `@fontsource-variable/jetbrains-mono` | `BlockTimer` digits, `RunScreen` preroll countdown |

Tokens live in `app/src/index.css` `@theme`: `--font-sans` and `--font-mono`. Both include system-fallback chains (`ui-sans-serif, system-ui, sans-serif` / `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`) so a missing woff2 still lands on a reasonable face.

**OpenType features enabled on `body`:**
- `font-feature-settings: 'cv11' 1;` — Inter's single-story `a` variant (humanist, refined).

**OpenType features enabled on timer surfaces:**
- `fontFeatureSettings: '"zero" 1'` — JetBrains Mono slashed zero, so `0` and `O` do not confuse in sun.

### 1.2 Scale

The production scale. Match one of these tokens at each call-site; introduce a new scale only by updating this section first.

| Role | Tailwind | Size | Weight | Tracking | Where |
|------|----------|------|--------|----------|-------|
| Display — verdict | `text-4xl` | 36 px | 700 | `tracking-tight` | `CompleteScreen` verdict only |
| Display — prep title | `text-2xl` | 24 px | 700 | `tracking-tight` | `RunScreen` / `TransitionScreen` / `ReviewScreen` drill-or-screen h1 |
| Display — prep screen h1 | `text-xl` | 20 px | 700 | `tracking-tight` | `SetupScreen`, `SafetyCheckScreen`, `SettingsScreen`, `SkillLevelScreen` |
| Wordmark | `text-lg` | 18 px | 700 | `tracking-tight` | `HomeScreen` app-bar only |
| Modal/card h2 | `text-lg` | 18 px | 700 | — | `ResumePrompt`, `SoftBlockModal`, `SafetyIcon` sheet, `SchemaBlockedOverlay` |
| Section h2 | `text-base` | 16 px | 600 | — | Review cards, Safety sections, Settings cards, Setup sections |
| Body default | `text-base` | 16 px | 400 | — | Primary paragraph copy, textarea input |
| UI label / body small | `text-sm` | 14 px | 400–500 | — | Labels, meta lines, chip text, help copy |
| Support / footnote | `text-xs` | 12 px | 400 | — | Footers, fine-print explainers, RPE scale anchors |
| Timer — live | `text-[56px]` | 56 px | 700 | — | `BlockTimer` countdown digits (mono, tabular, slashed zero) |
| Timer — preroll | `text-[72px]` | 72 px | 700 | — | `RunScreen` preroll countdown (mono, tabular, slashed zero, accent color) |

**Forbidden sizes**: anything below `text-xs` (12 px) in body copy. The outdoor brief's 16 px body floor applies to all primary copy; `text-xs` is reserved for truly decorative captions inside large tap targets or explicit footnotes.

### 1.3 Weight distribution

The app should read as **weight-restrained**. Most text is 400 or 500; emphasis is earned.

- `font-normal` (400) — body copy, paragraph text, textarea input, meta copy.
- `font-medium` (500) — UI labels, supporting eyebrow labels (e.g. "Your last session"), ghost-button text, footer links.
- `font-semibold` (600) — section h2, chip labels, primary-CTA content, emphasis spans.
- `font-bold` (700) — display headings, wordmark, verdict, timer digits.

Do **not** default labels to semibold or bold because "they look more important." Restraint is how seriousness reads here.

### 1.4 Casing

All screen titles, section h2s, button labels, and eyebrow labels use **sentence case**. Examples:

- Good: `Today's setup`, `Quick review`, `Before we start`, `Finish review`, `Build session`, `Start next block`, `Keep building`, `Your last session`, `Up next`.
- Bad: `Today's Setup`, `Quick Review`, `Finish Review`, `Build Session`, `Start Next Block`.

Exceptions:
- Proper nouns and brand words retain their capitalization: `Volleycraft`, `iPhone`, `Safari`.
- Single-word imperative buttons are ambiguous and read the same either way: `Done`, `Pause`, `Next`, `Resume`, `Yes`, `No`. Prefer the single-case form.
- Drill names, plan names, and player-mode labels (`Solo + Net`, `One-Arm Passing Drill`) are content-level names and may use their own capitalization conventions.

Upper-case letter-tracked "dashboard eyebrow" labels (`UPPERCASE tracking-wider`) are **not allowed** as a design pattern. The one legitimate uppercase-tracked surface is the `BlockTimer` `PAUSED` state indicator, which is a transient state marker attached to the live timer, not a content eyebrow.

### 1.5 Typography pass lanes

Added 2026-05-03 from `docs/brainstorms/2026-05-02-volleycraft-typography-system-requirements.md`.

The current font families are not under review in the typography-system pass:

- `Inter Variable` remains the human UI/body family.
- `JetBrains Mono Variable` remains the timer/instrument family.
- No new display face, remote font request, broad brand-font replacement, or component-library theme replacement is authorized.

Use two evidence lanes when touching typography:

| Lane | May ship now | Must stay evidence-gated |
| --- | --- | --- |
| Role and documentation | Role naming, route/state inventory, checklist updates, browser screenshot review | New typography authority outside this note |
| Source classes | Hard violations such as below-floor body/support text, active-run or safety-critical readability fixes with a named athlete outcome | Broad `text-sm` migration, default body-token retune, distance-mode behavior |
| Validation | Narrow drift guardrail and browser verification | Claims about glare, sunglasses, sweat, or 1-3 m set-down readability without real-device evidence |

### 1.6 First-pass type role checklist

This checklist is a decision aid, not a new abstraction layer. Start from the scale in §1.2 and the tokens in `app/src/index.css`; add code-level roles only when implementation proves the role repeats enough to justify it.

| Role bucket | Current examples | Active-run eligible | Default evidence lane |
| --- | --- | --- | --- |
| Active-run glance | Run phase/state, current cue, timer, primary controls | Yes | Ship-now for hard violations; field-validation-needed for distance claims |
| Trust / safety support | Safety consequence copy, Review blockers, storage/save trust lines | No, except active-run expectation setting | Ship-now when consequence or recovery clarity is at stake |
| Ordinary support / metadata | meta lines, chip helpers, secondary labels, footer explanations | No | Inspect-only unless below floor or trust-critical |
| Action labels | primary CTAs, secondary buttons, ghost links, confirm rows | Sometimes | Ship-now when tap target and label readability are affected |
| Timer / instrument text | `BlockTimer`, preroll countdown, exact time/count displays | Yes | Ship-now at current arm-length scale; larger states require evidence |
| Receipt / carry-forward | Complete verdict, saved state, next-step/carry-forward copy | No | Inspect-only unless trust or investment copy is unclear |

### 1.7 Route and state inventory

Use this inventory before changing classes. It prevents a typography pass from becoming a whole-app retune while still covering active and trust-critical surfaces.

| Surface / route family | Screen job | First-pass posture |
| --- | --- | --- |
| `/run` | active timer, cue, phase/state, primary controls | Apply-now for active-run glance roles and screenshot verification |
| `/safety` | consequence and safe-to-train confirmation | Apply-now for trust/safety support touched by the pass |
| `/review`, `/run/check` | end-session and drill-grain capture without lying | Apply-now for blocker/helper copy touched by the pass; inspect capture states |
| `/` | resume, review-pending, repeat, local trust cues | Inspect trust/resume roles; apply only documented hard violations |
| `/complete` | receipt, saved state, carry-forward | Inspect receipt/carry-forward roles; apply only documented hard violations |
| `/setup`, `/tune-today`, onboarding | prep choices and recommendation controls | Inspect-only unless touched copy is active-use or trust-critical |
| `/run/transition` | between-block handoff | Inspect active-run-adjacent state; defer behavior changes |
| Modals / overlays / prompts | recovery, blocked, confirm, resume, update | Inspect state-role consistency; apply only hard violations |
| `/settings` | export and local-storage explanation | Inspect trust/support roles; defer broad scale changes |

For touched surfaces, check these states when they exist: normal/default, loading or missing data, error/recovery, blocked or schema-blocked, interrupted/resume, skipped/partial/incomplete, and success/saved/receipt.

### 1.8 Verification and guardrail checklist

Browser verification at 390 × 844 can prove hierarchy and obvious layout regressions. It does not prove direct-sun, sunglasses, sweat, or 1-3 m set-down readability. Mark those as `field-validation-needed` unless real-device evidence was collected.

Minimum screenshot matrix for a typography pass that changes UI classes:

- Run active
- Safety consequence
- Review blocked/helper or `/run/check`
- Home trust or resume
- Complete receipt
- one error, recovery, blocked, or interrupted state

Guardrails should stay narrow. Approved first-pass checks:

- no body-like arbitrary text below `12px`
- no new uppercase tracked eyebrow outside the `BlockTimer` `PAUSED` state
- no arbitrary text sizes outside an explicit timer/display allowlist
- no decorative `font-mono`; mono belongs to timer/instrument text

Each exception must name the role bucket, surface, active-run eligibility, and rationale.

---

## 2 · Color

### 2.1 Palette

Tokens live in `app/src/index.css` `@theme`. Do not hardcode hex values in components.

| Token | Hex | Role |
|-------|-----|------|
| `--color-accent` | `#b45309` | Primary action, progress fill, phase label, accent text links, selected-chip fill |
| `--color-accent-pressed` | `#92400e` | Pressed/hover state on accent surfaces |
| `--color-bg-primary` | `#ffffff` | Focal card surface |
| `--color-surface-calm` | `#fcfaf5` | Page field (warm off-white) |
| `--color-bg-warm` | `#f5f5f0` | Secondary/soft card surface |
| `--color-text-primary` | `#1a1a1a` | Primary body and display text |
| `--color-text-secondary` | `#6b7280` | Labels, meta, support copy |
| `--color-success` | `#059669` | Completion markers, save confirmations |
| `--color-warning` | `#dc2626` | Destructive/serious actions, pain flow, incomplete chips |
| `--color-warning-surface` | `#fee2e2` | Pain-override card surface |
| `--color-info-surface` | `#fef3e8` | Heat & safety tips panel |

### 2.2 Color rules

- **One accent.** `accent` (`#b45309`, warm amber) is the single action/progress/phase color. Do not introduce a second accent, gradient, or "accent-blue secondary." One color, used deliberately.
- **Near-black on warm off-white is the baseline.** Page field is `surface-calm` (`#fcfaf5`); focal cards are `bg-primary` (pure white). Text is `text-primary` (#1a1a1a). This satisfies the outdoor brief's light-only, high-contrast freeze.
- **Semantic colors are not decorative.** `success` means "this action saved/completed." `warning` means "this is destructive or is protecting you from harm." Do not use `warning-surface` as a generic highlight; do not use `success` as a generic positive tone.
- **No gradients.** Flat color fills only.
- **No shadows as decoration.** Surface cards use a `shadow-sm` plus a hairline `ring-1 ring-text-primary/5` (Phase F1). That is the one shadow allowed, used once, to lift focal cards from the warm page field.

### 2.3 Color-role table

If you are about to paint a new UI element, pick from this table. If the element does not fit any row, the element probably should not be coloured at all.

| Element | Default | Selected / Active | Pressed |
|---------|---------|-------------------|---------|
| Primary CTA | `bg-accent text-white` | — | `bg-accent-pressed` |
| Outline button | `border text-text-primary` | — | `bg-bg-warm` |
| Ghost button (tertiary) | `text-accent` | — | `text-accent-pressed` |
| Danger outline | `border-warning text-warning` | — | `bg-warning-surface` |
| Selected chip | `bg-accent text-white` | — | — |
| Unselected chip | `border text-text-primary bg-bg-primary` | `bg-accent text-white` | — |
| Destructive chip (Pain "Yes", Incomplete reason) | `border text-text-primary` | `border-warning text-warning bg-warning-surface/50` | — |
| Progress fill | `bg-accent` on `bg-bg-warm` track | — | — |
| Phase label (Run) | `text-accent font-semibold` | — | — |
| Completion mark | `bg-success text-white` | — | — |

---

## 3 · Copy voice

### 3.1 Tone

- **Plain, matter-of-fact, economical.** The athlete is a grown-up; speak that way.
- **Present tense, second person when addressing the user.** "Rate your effort above to submit." "Your data stays on this device." "We'll switch to a lighter session if yes."
- **No marketing verbs.** Avoid "unlock," "supercharge," "crush," "level up," "join."
- **No hype, no urgency.** Avoid "🎉", "Great job!", "You nailed it!".
- **No apology-spam.** "Something went wrong" is acceptable when true. Do not say "Oops!" or "Sorry!".
- **Quiet encouragement is allowed at verdict boundaries.** `Keep building`, `One more in the book. Ready when you are.` This is the one sanctioned place to be a little warm.

### 3.2 Casing and punctuation

- All screen titles, section headings, button labels, and eyebrow labels: **sentence case** (§1.4).
- Period at the end of footer copy and standalone explainer sentences. No period on button labels, chip labels, single-word titles, or eyebrow labels.
- Use the typographic middle dot `·` (U+00B7) as a separator in meta lines: `Solo + Net · 15 min · today`. Do not use `|`, `-`, or `/` in this position.
- Use an em dash `—` (U+2014) for parenthetical asides. Do not use `--` or two hyphens.
- Numerals in prose: spell out zero through nine unless adjacent to a unit (`3 min`, `2+`, `0 days`, `1 day`).
- Units: short form, lowercase, single space (`15 min`, not `15 Mins` or `15min`).

### 3.3 Verdict copy palette

Current verdict strings from `composeSummary` — do not expand casually:

- `Keep building` — default steady-state verdict.
- `Lighter next` — post-pain-flow verdict.
- `No change` — skipped-review verdict.

### 3.4 Meta lines

The one-liner that orients the user on Safety, Home-review-pending, and Complete:

- Safety: `{playerMode} · {timeMinutes} min, {blockCount} blocks`
- Home review-pending: `{planName}`
- Complete reason: `Session {n}. One more in the book. Ready when you are.`
- Home last-complete: `{planMinutes} min · {daysAgo}` (with `· ended early` appended if relevant)

Keep these compact. One middle dot separator max per meta line.

### 3.5 Numeric formatting

- `3 min`, not `3 minutes`. `15 min`, not `15mins`.
- `0 days` / `1 day` / `2+` / `First time` on the recency chip scale.
- Completed/total pairs use slash: `4/4`, `3/3`, `2/2`. Tabular-nums on numeric columns.
- Pass-rate line: `{good}/{total} good · {percent}%` when present.

---

## 4 · Layout and rhythm

### 4.1 Canvas

- Target viewport: 390 × 844 (iPhone-class). Everything must be comfortable there.
- Outer column `max-w-[390px] mx-auto`. Inner gutter `px-4`.
- Page field `bg-surface-calm` (warm off-white) with `safe-area-inset` padding on top and bottom (F1/F3).

### 4.2 Focal-zone principle

**One focal zone per screen.** The single most important thing on each screen must be unambiguously the heaviest visual element. If a banner, eyebrow, or helper paragraph is fighting the focal element, the banner loses.

| Screen | Focal zone |
|--------|-----------|
| Home | Primary card (variant-selected by precedence) |
| Onboarding — Skill level | The four option cards as a grouped list |
| Onboarding — Today's setup | The chip grid resolving to `Build session` |
| Safety | The two gate questions + their selected state |
| Run | The timer (live) or the drill title (between blocks) |
| Transition | The "Up next" drill title + `Start next block` CTA |
| Review | Whichever card the user is currently interacting with |
| Complete | The verdict (`Keep building` etc.) |
| Settings | The single Export card |

### 4.3 Spacing scale

- Outer column vertical gap: `gap-8` (32 px) on Home; `gap-6` (24 px) on prep/run/review screens.
- Card internal rhythm: `p-6 gap-4` for focal cards (F1); `px-4 py-3` for secondary rows (F1).
- Section gaps inside a card: `gap-3` tight; `gap-4` default.
- Button padding: `px-6 py-4` for full-width primary; `px-4 py-2` for outline/ghost.

### 4.4 Surface system

Three surface types. Use consistently.

| Surface | Background | Border | Shadow | Use |
|---------|-----------|--------|--------|-----|
| Page field | `bg-surface-calm` | — | — | Outer page |
| Focal card | `bg-bg-primary` (white) | `ring-1 ring-text-primary/5` | `shadow-sm` | Primary card, Export card, Quick Review cards, Complete recap card |
| Soft card / warm surface | `bg-bg-warm` | — | — | Transition prev-block summary, ResumePrompt paused block, Complete session recap (alternative) |

`ResumePrompt` uses `shadow-lg` because it is a modal dialog (elevated above the page), not a page card — the only legitimate use of `shadow-lg`.

### 4.5 Touch targets

- Primary CTA: `min-h-[56px]` (fractionally taller than secondary, intentional).
- Outline / secondary CTA: `min-h-[54px]`.
- Ghost tap target (links, toggles): `min-h-[44px]` minimum, per WCAG and the outdoor brief.
- Chip: `min-h-[48px]` with `min-w-[48px]` per chip.
- Back button: `min-h-[44px]` inside a 44×44 tap box.

Do not go below these. Sand and sweat both degrade capacitive touch.

### 4.6 No swipes, no holds, no double-tap

- Primary commit actions: tap, not swipe.
- Destructive confirms: two-tap reveal-and-tap pattern (`Skip review` → `Yes, skip` / `Never mind`). Not press-and-hold.
- No double-tap anywhere.
- Undo over confirm whenever possible (e.g. `End session` → navigation to a recoverable state rather than a modal).

---

## 5 · Iconography

### 5.1 SVG only, no emoji

Emoji render differently per OS (Apple vs Google vs Microsoft) and tie the brand to the host platform's glyph. They are not allowed in UI chrome. Icons are inline SVG, stroke-based, that inherit the current text color.

Legitimate icon sources:
- `Brandmark` component — the volleyball-in-rounded-square logo (F1, replaced the 🏐 emoji).
- Inline purpose-built SVGs (the `VerdictGlyph` two-bar horizontal on Complete; the check-mark on Transition prev-block; the shield on the `SafetyIcon` component).

If a new UI element needs a glyph, draw an inline SVG with:
- `viewBox="0 0 24 24"` (standard) unless there is a specific reason otherwise.
- Stroke width `2.5` for outline icons, `3` for emphasis icons.
- `stroke-linecap="round"` and `stroke-linejoin="round"`.
- `currentColor` for the stroke so the icon inherits text color.
- `aria-hidden="true"` if decorative; a parent `aria-label` carries meaning.

### 5.2 Icon scale

- 16 px — inline with body text (e.g. save-state check on Complete).
- 20–24 px — inline with headings or card rows (e.g. Transition completion mark).
- 28 px — app-bar Brandmark (Home header).
- 32–44 px — focal icons (e.g. SafetyIcon shield).

---

## 6 · State treatments

### 6.1 Loading

- Use `StatusMessage variant="loading"` or a plain `"Loading…"` string in `text-text-secondary`. No skeleton loaders, no spinners as chrome.
- Keep below-the-fold content absent rather than shown as placeholder. Skeletons on a 390×844 courtside screen are noise.

### 6.2 Empty

- "New user" empty state is a positive CTA (`Start first workout`) with explainer, not a "no data yet" void.
- For list views that may be legitimately empty, a single line of `text-text-secondary` body copy is enough — no illustrated empty-state.

### 6.3 Error

- `StatusMessage variant="error"` — `text-sm font-medium text-warning` with the error message.
- Do not apologize; state the situation and the recovery path. "Couldn't reach storage. Try again." not "Oops! Something went wrong :(".
- `ErrorBoundary` is the bottom-of-the-stack catch. Its copy is `text-xl font-bold`, matter-of-fact, with a `Try again` button.

### 6.4 Disabled

- Full-width primary button when disabled: `opacity-50 cursor-not-allowed` on the same accent color. The disabled state visibly is-the-same-button, just muted.
- Always include a visible helper line above disabled primary buttons explaining why it is disabled: "Rate your effort above to submit.", "Pick a reason you ended early to submit."

### 6.5 Success

- Save confirmations are quiet. A single inline line with a small check-mark SVG and `text-success` body copy. No toast, no snackbar, no animation.

### 6.6 Pressed / hover

- Primary: `active:bg-accent-pressed`, `hover:bg-accent-pressed` (desktop).
- Outline: `active:bg-bg-warm`, `hover:bg-bg-warm` (F7).
- Ghost: `active:text-accent-pressed`, `hover:text-accent-pressed` (F7).
- Secondary: `active:bg-bg-warm` (F7).
- Every interactive surface must have a visible press state. Missing press-state feedback is a bug.

---

## 7 · Per-screen posture

Each screen has an intended posture. These are the reference treatments; when adding a new screen, match the closest posture rather than inventing a new one.

### 7.1 Home

- App-bar band: inline `Brandmark` (28 px) + `Volleycraft` wordmark (`text-lg font-bold tracking-tight`). Subtle but owned (F11).
- One primary card, exactly, chosen by the 5-variant precedence (`resume > review_pending > draft > last_complete > new_user`).
- Optional secondary-rows cluster below the primary, as a single soft-container list (F1). Secondary rows flatten their surface; only the list container holds the shadow/ring.
- Footer: `Settings` link + `Your data stays on this device.` in `text-xs text-text-secondary`.

### 7.2 Onboarding (Skill level, Today's setup)

- **Left-aligned**, softer posture than prep screens.
- Intro line + left-aligned h1 + supporting line ("You can change this later.").
- First-time content cards with title + descriptor.
- Tertiary "Not sure yet" underline link as escape hatch.

### 7.3 Prep (Setup, Safety, Settings)

- **Centered** `← Back` button (left) + centered h1 (`text-xl font-bold tracking-tight`).
- On Safety: an amber `text-sm font-medium` meta line just below the h1 (session-summary orientation device).
- Section h2s: `text-base font-semibold`.
- Binary/trinary chip rows for inputs.
- One primary CTA; one tertiary "Back"-ish escape.

### 7.4 Run (active drill)

- Minimal app-bar: `SafetyIcon`, phase label (accent sentence-case: `Warm up` / `Work` / `Downshift`), `{index}/{total}`.
- Drill h1 (`text-2xl font-bold tracking-tight`) + single instruction paragraph + coaching cues + `Hide cues` toggle.
- Timer in JetBrains Mono at 56 px with slashed zero.
- Controls: Pause + Next as a pair; Pause becomes Resume + reveals Shorten / End session when paused.

### 7.5 Transition (between blocks)

- App-bar: `SafetyIcon`, `Transition` label (sentence case, `text-sm font-medium text-text-secondary`), `Next: {index}/{total}`.
- Prev-block summary card: green check + drill name + `Complete` (or `Skipped`) in success green.
- `Up next` eyebrow (sentence case) + next-block h1 (`text-2xl font-bold tracking-tight`) + duration + instructions.
- Primary `Start next block` CTA + tertiary `Shorten block`.

### 7.6 Review

- Centered h1 `Quick review` (`text-2xl font-bold tracking-tight`) + meta line.
- Four cards, each a section: RPE scale, Good passes (conditional), Ended-early reason (conditional), Quick tags.
- Textarea card: `Short note (optional)` label with `font-normal` qualifier.
- Primary `Submit review`; tertiary `Finish later`; footnote about the 2-hour deferral window.

### 7.7 Complete

- Minimal app-bar: `SafetyIcon` only.
- Centered column: `Today's verdict` h1 (`text-sm font-medium text-text-secondary`) + `VerdictGlyph` + verdict h2 (`text-4xl font-bold tracking-tight`, F11) + reason paragraph.
- Session-recap card: `Session recap` label + 4-row definition list (`Session`, `Drills completed`, `Good passes`, `Effort`).
- Primary `Done`; quiet green-check save confirmation; storage-posture footnote.

### 7.8 Modals (Resume, Soft-block, Schema-blocked)

- `role="dialog" aria-modal="true"`.
- `bg-bg-primary`, `rounded-[12px]`, `shadow-lg`.
- `max-w-[340px]`, centered over `bg-black/40` scrim.
- h2 `text-lg font-bold`, body `text-sm text-text-secondary`, primary + secondary buttons stacked.

---

## 8 · Interaction patterns

### 8.1 Navigation

- Back is always in the upper-left, always `← {destination}` or `← Back`, always accent color, always at `min-h-[44px]`. Rendered via `BackButton` primitive (F9).
- Forward progression is via a single primary button near the focal zone. Never a swipe.
- The app does not use tab bars. Each screen resolves to exactly one destination or stays on itself.

### 8.2 Confirmations

- **Undo over confirm.** Prefer reversible actions that route the user to a recoverable surface over modal confirms.
- When a confirm is required (Discard resume, Skip review), use the **two-tap reveal-and-confirm** pattern: first tap reveals a small confirm row with `Yes, ...` (danger variant) + `Never mind` (outline) side by side. Second tap commits.
- Do not use native `confirm()` or `alert()`.

### 8.3 Interception

- Review-pending state intercepts non-review Home CTAs with a `SoftBlockModal` (D-C1). Dismissal is scoped to the execId and persisted — once dismissed, subsequent taps on that same execId pass through.
- The interception carries a dual-path choice: `Finish review` (primary) + `Skip and continue` (ghost).

### 8.4 Responsiveness

- No haptics promised on iOS (WebKit no-ops `navigator.vibrate`). Android-only haptic via UA sniff (V0B-08).
- Audio cue is reinforcement, not the primary channel (V0B-08 / outdoor brief).
- Wake Lock best-effort; fallback is an oversized visible countdown.

---

## 9 · Data, privacy, and trust

### 9.1 Local-first posture

- All user data (sessions, drafts, reviews) lives in IndexedDB on the device. The app never contacts an external service during a session.
- Fonts are self-hosted (F9) so first paint is fully offline.
- No analytics, no telemetry, no crash reporter.
- Footer copy on Home and Settings repeats the promise: `Your data stays on this device.`

### 9.2 Data honesty

- On Complete, the green-check save confirmation is followed by a quiet footnote acknowledging that iPhone Safari may evict data. Do not hide this — it is part of trust.
- Export (`Export training records` on Settings) produces a plain JSON file with the schema version stamped. Users can own their data.

### 9.3 No dark patterns

- No email gates, no subscriptions, no upsells.
- No "Don't leave!" interception on navigation (beyond the review soft-block, which exists to protect data quality, not conversion).
- No dark-pattern copy ("Are you sure you want to miss out on...").

---

## 10 · Decisions this note codifies

These are the durable design decisions that emerged from F1–F11 and this audit. Any change that contradicts one of these should update this note or create a new entry in `docs/decisions.md`.

| ID (informal) | Decision | Source |
|---------------|----------|--------|
| BX-1 | Inter Variable is the body/UI face. JetBrains Mono Variable is the timer face. Both self-hosted via Fontsource. | F9, F10 |
| BX-2 | No emoji in UI chrome; SVG only. | F1 Brandmark rationale; this note §5.1 |
| BX-3 | All screen titles, section headings, button labels, eyebrow labels are sentence case. | F8 + this note §1.4 |
| BX-4 | No `UPPERCASE tracking-wider` dashboard-eyebrow pattern; the live `BlockTimer` `PAUSED` state indicator is the one exception. | F8 + this note §1.4 |
| BX-5 | One accent color (`#b45309` warm amber). Semantic colors (`success`, `warning`) are not decorative. | this note §2 |
| BX-6 | One focal zone per screen; `shadow-sm + ring-1/5` is the one allowed card elevation; `shadow-lg` is modal-only. | F1 + this note §4 |
| BX-7 | Local-first by default; fonts and app data never leave the device. | P10 + F9 |
| BX-8 | Amateur-serious tone: no streaks, badges, hype copy, motivational imagery, or dark patterns. | this note §3.1, §9.3 |
| BX-9 | Onboarding is left-aligned; prep is centered. | this note §7.2, §7.3 |
| BX-10 | Two-tap reveal-and-confirm for destructive actions; undo over confirm whenever possible. | this note §8.2 |

---

## 11 · Update when

- A new screen is added or an existing screen changes posture materially.
- A new color token, font family, or icon family is introduced.
- Copy voice drifts (hype, gamification, marketing-ese) and needs re-anchoring.
- A new interaction pattern is proposed (e.g. swipe, long-press) that this note rules out.
- A durable decision from this note is revisited and changed in `docs/decisions.md`.

Small inconsistencies (a stray period, a button that drifted to Title Case) should be fixed in-place without updating this note. Large decisions (new accent color, new display face, new motion system) should update this note first, then ship.

## 12 · Not for

- Product scope or feature prioritization — see `docs/prd-foundation.md`, `docs/roadmap.md`, milestone charters.
- Specific courtside readability defaults (type floor, touch-target baseline, run-mode information density) — see `docs/research/outdoor-courtside-ui-brief.md`. That note outranks this one on readability.
- The shibui / `ma` / `tokonoma` structural thesis — see `docs/research/japanese-inspired-visual-direction.md`. This note implements that direction; it does not replace it.
- The naming rationale — see `docs/research/product-naming.md`. This note names "Volleycraft" but does not re-litigate the rename decision.

## 13 · For agents

- **Authoritative for**: concrete type / color / copy / layout / icon / state / interaction defaults for Volleycraft surfaces.
- **Edit when**: the item falls under §11 "Update when" above.
- **Belongs elsewhere**: readability floors (`outdoor-courtside-ui-brief.md`), thematic direction (`japanese-inspired-visual-direction.md`), naming (`product-naming.md`), product principles (`vision.md`), scope (`prd-foundation.md`).
- **Outranked by**: `docs/vision.md` (product principles P1–P12), `docs/decisions.md` (durable decisions), `docs/research/outdoor-courtside-ui-brief.md` (readability contract).
- **Key pattern**: the §2.3 color-role table, §1.2 type scale, §7 per-screen posture, and §10 decisions table are the most-consulted references. When in doubt, read those sections before writing new component chrome.
