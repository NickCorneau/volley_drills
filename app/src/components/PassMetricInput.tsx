import { NumberCell } from './ui'

type PassMetricInputBaseProps = {
  good: number
  total: number
  onGoodChange: (next: number) => void
  onTotalChange: (next: number) => void
}

/**
 * C-1 Unit 7 / R8: when the tester couldn't cleanly count reps, this
 * chip tags the review with `quickTags: ['notCaptured']` and zeros the
 * metric. Submit is still gated on RPE only.
 *
 * The chip and its state are paired (kieran-typescript finding K-TS-3):
 * a caller that passes only one half accidentally leaves the input in
 * a disabled / un-recoverable state. The discriminated union forces
 * callers to pass both or neither.
 */
type PassMetricInputProps = PassMetricInputBaseProps &
  (
    | { notCaptured?: undefined; onToggleNotCaptured?: undefined }
    | { notCaptured: boolean; onToggleNotCaptured: () => void }
  )

/**
 * V0B-02 / B5 / H13 (red-team fix plan v3): tap-to-type is the SOLE
 * pass-metric control on the Review screen. No +, no -, no ±5 / ±10.
 * One control, one interaction pattern - adding a third pattern is the
 * thesis-extension H6 that H13 explicitly rules out.
 *
 * Uses a numeric `<input>` with `inputMode="numeric"` + `pattern="[0-9]*"`
 * so iOS raises the numeric keypad. Commit happens on blur or Enter;
 * typing `good > total` auto-bumps `total` to match at commit time
 * (preserving the invariant that `good <= total`). Negatives clamp to 0.
 */
export function PassMetricInput({
  good,
  total,
  onGoodChange,
  onTotalChange,
  notCaptured = false,
  onToggleNotCaptured,
}: PassMetricInputProps) {
  const rate = total > 0 ? Math.round((good / total) * 100) : null

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-4">
        <NumberCell
          label="Good"
          value={good}
          disabled={notCaptured}
          // Empty commit (next === null) collapses to 0 so the existing
          // "blank means zero" contract is preserved courtside.
          onCommit={(next) => {
            const parsed = next ?? 0
            const clamped = Math.max(0, parsed)
            if (clamped > total) onTotalChange(clamped)
            onGoodChange(clamped)
          }}
        />
        <NumberCell
          label="Total"
          value={total}
          disabled={notCaptured}
          onCommit={(next) => {
            const parsed = next ?? 0
            const clamped = Math.max(good, Math.max(0, parsed))
            onTotalChange(clamped)
          }}
        />
      </div>
      {/*
        2026-04-27 (V0B-28 surface-move): rate label is skill-neutral
        (`% good`) because the per-drill success rule renders above the
        inputs inside `PerDrillCapture` on the active capture surface.
        The legacy `ReviewScreen` fallback path still hard-codes the
        passing rule above this component (out of scope this pass) — the
        rate line stays correct in that path because "% good" reads as
        "% good passes" once the rule above it has named the pass
        criterion. See
        `docs/archive/plans/2026-04-27-per-drill-success-criterion.md`.
      */}
      {rate != null && !notCaptured && (
        <p className="text-center text-sm font-semibold text-text-primary">{rate}% good</p>
      )}
      {onToggleNotCaptured && (
        <button
          type="button"
          onClick={onToggleNotCaptured}
          aria-pressed={notCaptured}
          className={[
            'mx-auto min-h-[44px] rounded-[12px] px-4 py-2 text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            notCaptured
              ? 'border border-accent bg-info-surface text-accent'
              : 'text-text-secondary underline-offset-2 hover:underline',
          ].join(' ')}
        >
          Couldn&rsquo;t capture reps this time
        </button>
      )}
    </div>
  )
}

// Plan U10 (2026-05-04): the inline `valueToDisplayText` helper and
// the local `NumberCell` component were extracted into
// `components/ui/NumberCell.tsx` with the empty-zero rule, blur/Enter
// commit, integer-shape check, and optional `validate` callback all
// centralised. The PassMetricInput callers above wrap `onCommit` to do
// the auto-bump (Good > Total triggers Total bump) explicitly rather
// than via `validate`, keeping that cross-field side effect visible in
// the call site.
