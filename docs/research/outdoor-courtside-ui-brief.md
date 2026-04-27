---
id: outdoor-courtside-ui-brief
title: Outdoor Courtside UI Brief
status: active
stage: planning
type: research
authority: narrowed M001 outdoor legibility defaults, information-density guidance, and prototype validation focus
summary: "Narrowed outdoor legibility defaults and information-density guidance for M001."
last_updated: 2026-04-19
depends_on:
  - docs/research/beach-training-resources.md
  - docs/decisions.md
  - docs/prd-foundation.md
related:
  - docs/specs/m001-courtside-run-flow.md
  - docs/specs/m001-review-micro-spec.md
  - docs/specs/m001-home-and-sync-notes.md
  - docs/research/japanese-inspired-visual-direction.md
---

# Outdoor Courtside UI Brief

## Purpose

Capture the recent outdoor / courtside UI research in a compact format that humans and agents can apply quickly without rereading a long prose synthesis.

## Use This Note When

- choosing or reviewing theme, contrast, typography, spacing, or touch-target defaults
- judging whether an M001 courtside screen is too dense for live use
- deciding what should be frozen now versus validated in outdoor prototype testing
- checking whether a UI idea fits bright sun, glare, sandy hands, and short-glance interaction

## Canon Impact

This note informs canon. It does not replace it.

Its strongest findings have already been promoted into:

- `docs/decisions.md`
- `docs/prd-foundation.md`
- `docs/specs/m001-courtside-run-flow.md`
- `docs/specs/m001-review-micro-spec.md`

If this brief changes materially later, promote durable conclusions into those docs rather than treating this note as the only source of truth.

## Machine Summary

```yaml
theme_default: light_only
dark_mode_m001: defer
surface_defaults:
  background: white_or_off_white
  text: near_black
contrast_policy:
  minimum: wcag_aa
  preferred_for_session_critical_elements: stronger_than_minimum
type_scale:
  body_min_px: 16
  body_preferred_px: 18
  heading_min_px: 20
  timer_or_rep_digits_px: [56, 64]
touch_targets:
  target_px: [54, 60]
  spacing_px: [8, 16]
active_run_visible_fields:
  - block_title
  - one_primary_cue
  - timer_or_rep_target
  - current_phase_label
  - current_progress
  - next
  - pause
active_run_defer_or_hide:
  - long_instruction_lists
  - rich_analytics
  - optional_typing
  - dense_secondary_controls
  - non_critical_settings
freeze_now:
  - theme_stance
  - type_floor
  - touch_target_baseline
  - active_state_information_density
validate_later:
  - pure_white_vs_off_white
  - exact_accent_shades
  - review_input_control_shape
  - outdoor_noticeability_of_audio_or_haptics
```

## High-Confidence Findings

- Positive-polarity UI is the best default for outdoor use. For M001, use one light theme rather than splitting effort across light and dark.
- Session-critical content should maximize legibility first: timer digits, block labels, rep targets, and primary controls should sit on very light surfaces with near-black text.
- Body text should never drop below `16px`. Run-mode labels should prefer `18px`, and timer or rep digits should be dramatically larger than surrounding text.
- Controls used during a live drill should use a `54-60px` touch-target baseline and clear spacing.
- Active drill screens should show only what the user needs right now. Anything that does not help immediate action should move to prep, pause, transition, or summary.

## Freeze Now

- Light-only theme for M001.
- Near-black on white or slightly off-white as the baseline visual posture.
- System sans stack for performance and familiarity.
- `16px` absolute minimum body size and `18px` preferred run-mode body size.
- `56-64px` timer / rep digits.
- `54-60px` touch targets with `8-16px` spacing.
- Active-run layout limited to block title, one cue, timer or rep target, phase label, progress, and primary controls.

## Validate Later

- Whether pure white or a slightly warmer off-white is easier to read in direct sun over longer sessions.
- Exact accent shades for primary actions, progress, and success / warning states.
- Whether quick review inputs are fastest as large buttons, segmented controls, or a stepped slider.
- Whether outdoor audio or haptic cues are noticeable enough to matter in wind and ambient court noise.
- Whether a calmer, Japanese-inspired restraint / spacing direction improves focus and emotional tone without hurting glanceability.

## Aesthetic Direction Experiments

If the product explores a calmer, more restrained visual language, use `docs/research/japanese-inspired-visual-direction.md` as the inspiration note.

That note does **not** override this brief. Outdoor readability, contrast, type size, and touch-target rules still win. Use the design-direction note to shape hierarchy, pacing, spacing, and restraint - not to justify lower contrast or decorative styling.

## Apply To Current Setup

- `docs/decisions.md` should carry the durable defaults and M001 scope stance.
- `docs/prd-foundation.md` should carry the product-level courtside UX contract.
- `docs/specs/m001-courtside-run-flow.md` should stay strict about low information density during active blocks.
- `docs/specs/m001-review-micro-spec.md` should stay tap-first and typing-light.
- The current `app/` v0a prototype is a validation tool, not a final M001 design reference. When M001 UI work starts, revisit prototype assumptions that may not match the final courtside design language.

## Agent Rules Of Thumb

- If there is a trade-off between density and readability, choose readability.
- If a control is intended for mid-drill use, default it into the `54-60px` range unless there is a strong reason not to.
- If a piece of information is not needed while the athlete is moving, move it off the active screen.
- Do not infer that dark mode must exist in M001.
- Do not infer that rich media, GIFs, or video are required in the run flow from this note.
- Do not infer that every screen should be oversized; prep and review can carry slightly more context, but they should still feel calm and tap-first.

## Open Questions For Outdoor Prototype Testing

- Which content is truly essential during an active drill versus merely nice to have?
- How quickly can users log `sessionRpe` and one skill metric using large tap controls?
- Does the default timer size remain glanceable in direct sun, sunglasses, and partial glare?
- Are audio cues helpful enough to justify complexity, or should the product rely mainly on visual state and transition screens?

## Source Families From This Research Pass

- Android accessibility guidance for contrast and touch-target sizing
- Nielsen Norman Group findings on light versus dark mode performance
- ESA accessibility summary on positive-polarity legibility
- Inclusive Web typography guidance
- touch-target size summaries from Apple / Android guidance and broader UX research
- interval-timer product patterns, especially Tabata-style apps
- outdoor-product UX guidance, including Adobe / RunGo-style simplification advice

## Pair-Set-Down Legibility And Cue Posture

Added 2026-04-16 after a cross-platform PWA cue-and-manifest review. This section sharpens the canonical courtside posture M001 is designed for, and locks the cue-stack invariants that `V0B-08` implements.

### Canonical posture

The phone is **set down on the bench at ∼1–3 m, screen up, awake, within pair reach**. This is the posture current-generation iPhone and Android web apps actually support well: visible, foreground, wake-lock-held. Solo arm's-length is a supported sub-mode but not the design center.

Explicitly rejected postures for M001:

- Phone in a pocket with the screen off. `navigator.vibrate()` is not a dependable channel for iPhone web apps (Safari or HSWA). Pocket mode is a native-app or wearable problem, not a PWA strength on iPhone.
- Phone backgrounded mid-session. Hidden-state JS timing on iPhone is fragile across lock-screen transitions; Web Audio on iPhone obeys the mute switch and does not behave like background media playback.

### Typography floor by viewing distance

Legibility work frames text size in physical letter height, not CSS pixels. Rough targets on a current 6.1-inch iPhone-class panel:

| Posture | Primary numeral (CSS px) | Secondary line (CSS px) | What's on screen |
| --- | --- | --- | --- |
| Solo arm's length (∼0.3 m) | 56–64 (v0a default, `D50`) | 16–18 | Block title, one cue, timer, phase label, progress, primary controls |
| Pair bench at ∼1 m | 72–88 (raise timer digits) | 18–20 | Same layout, but timer digits are the dominant element |
| Pair bench at ∼2 m | 112–144 (distance mode) | only if essential | One metric + one short secondary line |
| Bench at ∼3 m (edge of useful) | metric-only | suppress | Show only the active countdown / state; no sentence-style copy |

The v0b default keeps `D50`'s `56–64px` arm's-length floor. A distance-mode toggle on `TransitionScreen` / `RunScreen` is an optional Phase D follow-on to `V0B-08`, not required for the D91 field test. The principle to preserve: at the 3 m edge, sentence-style explanatory text cannot survive the distance at a usable letter height; the right answer is to show one dominant metric and the active countdown, and nothing else.

### Cue-stack invariants

These invariants are what `V0B-08` ships:

- **Visual first, always.** A full-screen state change on `TransitionScreen` is the primary conveyor of block boundaries. It fires even when audio and vibrate no-op.
- **Audio is reinforcement.** A short preloaded `<audio>` cue, unlocked by the same user gesture as session-start `persist()` (`V0B-25`), plays only when `document.visibilityState === 'visible'`. Prefer a preloaded `<audio>` element over pure Web Audio for cues; on iPhone, media playback has clearer platform guarantees than Web Audio does.
- **Haptic is Android-only.** `navigator.vibrate(35)` fires only behind a `/android/i.test(navigator.userAgent)` check. Plain `'vibrate' in navigator` is not sufficient because WebKit ships the property and no-ops it, which is indistinguishable from a working haptic at runtime.
- **No pocket / screen-off promise.** No surface in v0b tells the user their phone will buzz in a pocket, or cue them during a screen-off block. If Wake Lock is denied, the fallback is an oversized visible countdown and no nagging.
- **Audio shape.** Short, bright, non-speech cue. Energy around 1.8–3.0 kHz; optionally two short bursts separated by a small gap. Phone speakers outdoors do badly with low frequencies, and alarm-audibility work puts usable signal-over-noise margins in the mid-kHz band. Do not use a low thump.
- **Audio cannot be the only channel outdoors.** At phone-speaker-at-3 m on a windy beach, audio is reinforcement. The visual transition is the thing carrying the message.

### Brightness posture

Accept that the web has no robust cross-platform brightness control. Rely on device outdoor-brightness behavior. The product's contribution is contrast and type size, not brightness management. A one-time onboarding hint to raise brightness for outdoor sessions is acceptable; trying to solve sunlight with dark mode is not (and `D48` already commits to light-only for M001).

### Input ergonomics (bench-handoff band)

Capacitive touch degrades with sweat, water, and sand; `54–60px` targets (`D49`) clear platform minima but are near the lower edge of the NN/g "1 cm×1 cm" practical minimum. For the pair-set-down posture specifically:

- Primary run-screen controls want ≥60 px (≈9.5 mm) with generous spacing. Current v0a already hits this; do not reduce it when adding new controls.
- Avoid swipe as a primary commit gesture. Avoid press-and-hold for routine logging. Avoid double-tap confirm. Prefer undo over confirm. Swipes and holds depend on continuous contact quality and timing, which are exactly what degrade with moisture and handoffs.
- Keep between-rep and between-block actions in a handoff-safe band in the bottom third of the screen. No tiny top-right controls on the run screen. No destructive action near OS edges. The pause affordance should be impossible to hit by accident.

### Install-onboarding posture

iOS 26 lets users install any site as a web app, with an "Open as Web App" choice in the install UI. `apple-touch-icon` is still prudent even though Safari 15.4+ honors manifest icons; see `V0B-06` for the concrete icon set. Do not chase translucent edge-to-edge status-bar treatment before field testing; iOS web-app safe-area behavior keeps shifting, so `apple-mobile-web-app-status-bar-style: default` is the conservative choice (`app/index.html`). Installed HSWA `start_url` must respond successfully offline; the service worker precache already covers this.

### Freeze vs validate (updated 2026-04-16)

Additions to the existing Freeze Now / Validate Later lists above:

- **Freeze now:** bench-at-1–3 m as the canonical posture; visual-first cue stack; Android-only haptics; no pocket or screen-off promise; `apple-mobile-web-app-status-bar-style: default`.
- **Validate later:** whether distance-mode typography (one giant metric, 112–144 px) is worth the Phase D cost; whether a bench-handoff band in the bottom third materially reduces accidental taps; whether the 1.8–3.0 kHz double-burst cue is outdoor-noticeable enough at 3 m or needs a different timbre.
