// Pure helpers for `RpeSelector.tsx`. Kept in a sibling file so the
// `RpeSelector` component module only exports components — which the
// `react-refresh/only-export-components` lint rule enforces for Vite's
// Fast Refresh to work correctly during dev.
//
// See `RpeSelector.tsx` for the 2026-04-23 collapse rationale and the
// chip-to-RPE mapping contract.

/**
 * The three canonical effort anchors the 2026-04-23 walkthrough
 * closeout polish collapses the 11-chip RPE grid down to. Chip value
 * is the numeric `sessionRpe` that gets persisted when the user taps
 * the chip — chosen to line up with the Borg anchors so downstream
 * `effortLabel` bands (`app/src/lib/format.ts`) and the `D104` / `O12`
 * tuning-floor constants continue to operate on the same 0-10 domain.
 */
export const EFFORT_CHIPS = [
  { label: 'Easy', value: 3 },
  { label: 'Right', value: 5 },
  { label: 'Hard', value: 7 },
] as const

export type EffortChip = (typeof EFFORT_CHIPS)[number]

/**
 * Snap a historical `sessionRpe` number to the nearest canonical chip
 * value so a rehydrated draft shows a visible selection on the
 * three-chip UI, even if the stored value predates the 2026-04-23
 * collapse.
 *
 * Returns `null` when the stored value is `null` (skipped / expired
 * stubs, per `effortLabel`'s null handling).
 */
export function pickChipForRpe(rpe: number | null): number | null {
  if (rpe == null) return null
  let nearest: number = EFFORT_CHIPS[0].value
  let nearestDelta = Math.abs(rpe - nearest)
  for (const chip of EFFORT_CHIPS) {
    const delta = Math.abs(rpe - chip.value)
    if (delta < nearestDelta) {
      nearest = chip.value
      nearestDelta = delta
    }
  }
  return nearest
}
