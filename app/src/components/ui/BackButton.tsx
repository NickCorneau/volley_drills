import { cx } from '../../lib/cn'

type BackButtonProps = {
  /**
   * Visible label after the arrow, e.g. `"Back"`, `"Home"`,
   * `"Skill level"`. The button renders `&larr; {label}`; the
   * arrow is marked `aria-hidden` so screen readers read the
   * accessible name (below), not "leftward arrow".
   */
  label: string
  onClick: () => void
  /**
   * Optional override for the screen-reader accessible name.
   * Defaults to `"Back"` when `label === "Back"` and
   * `"Back to {label}"` otherwise. Override when the destination
   * label doesn't read naturally in the `"Back to X"` form.
   */
  'aria-label'?: string
  className?: string
}

/**
 * Phase F9 (2026-04-19): shared back-button primitive.
 *
 * Consolidates the back-arrow chrome previously written inline on
 * `SettingsScreen`, `SetupScreen`, and `SafetyCheckScreen`. All three
 * carried the same visual intent (small 44 px tap target in the top-
 * left of the screen header, accent color, leftward arrow + label),
 * but had drifted slightly — SetupScreen was missing `min-h-[44px]`
 * and `px-2` entirely, so it rendered as a smaller tap target than
 * the other two.
 *
 * A single primitive keeps the back affordance visually identical
 * everywhere and gives a single place to add tactile press feedback
 * (`active:text-accent-pressed`, matching the Phase F7 ghost-variant
 * Button treatment).
 *
 * Accessibility: the `&larr;` glyph is decorative and would read as
 * "leftward arrow" to a screen reader if left exposed. `aria-label`
 * on the button overrides the composite text and produces a clean
 * announcement. Consumers can override the default `"Back to {label}"`
 * form when needed.
 */
export function BackButton({
  label,
  onClick,
  className,
  'aria-label': ariaLabel,
}: BackButtonProps) {
  const accessibleName =
    ariaLabel ?? (label === 'Back' ? 'Back' : `Back to ${label}`)

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={accessibleName}
      className={cx(
        'min-h-[44px] px-2 text-sm text-accent transition-colors',
        // Phase F11 (2026-04-19): hover matches the Phase F7 press
        // state so desktop pointers get the same clickability cue —
        // the accent text darkens to `accent-pressed` on hover, then
        // stays at that shade during the press.
        'hover:text-accent-pressed active:text-accent-pressed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className,
      )}
    >
      <span aria-hidden="true">&larr;</span> {label}
    </button>
  )
}
