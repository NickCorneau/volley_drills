---
id: outdoor-courtside-ui-brief
title: Outdoor Courtside UI Brief
status: active
stage: planning
type: research
authority: narrowed M001 outdoor legibility defaults, information-density guidance, and prototype validation focus
summary: "Narrowed outdoor legibility defaults and information-density guidance for M001."
last_updated: 2026-04-12
depends_on:
  - docs/research/beach-training-resources.md
  - docs/decisions.md
  - docs/prd-foundation.md
related:
  - docs/specs/m001-courtside-run-flow.md
  - docs/specs/m001-review-micro-spec.md
  - docs/specs/m001-home-and-sync-notes.md
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

## Apply To Current Setup

- `docs/decisions.md` should carry the durable defaults and M001 scope stance.
- `docs/prd-foundation.md` should carry the product-level courtside UX contract.
- `docs/specs/m001-courtside-run-flow.md` should stay strict about low information density during active blocks.
- `docs/specs/m001-review-micro-spec.md` should stay tap-first and typing-light.
- The current `app/` scaffold should not be treated as a design reference. When real UI work starts, remove generic template assumptions that imply dual-theme parity or small desktop-first controls.

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
