import { useState } from 'react'
import type { DifficultyTag } from '../db'
import { PassMetricInput } from './PassMetricInput'

/**
 * Tier 1b D133 (2026-04-26): per-drill capture surface that lives on the
 * Transition screen between blocks. See
 * `docs/specs/m001-review-micro-spec.md` §"Per-drill capture at
 * Transition (D133)" for the contract and
 * `docs/research/2026-04-26-pair-rep-capture-options.md` Framing D for
 * the design rationale.
 *
 * Two capture controls:
 *
 * 1. **Required** 3-anchor `Difficulty` chip row
 *    (`Too hard / Still learning / Too easy`). The Transition screen
 *    cannot advance until one chip is tapped. Vocabulary deliberately
 *    differs from the deleted session-level `QuickTagChips` so
 *    rehydration can never collapse a per-drill capture into the legacy
 *    session-level tag space — the middle anchor names a learning state,
 *    not an intensity rating.
 * 2. **Optional** Good/Total counts via the existing `PassMetricInput`,
 *    behind a collapsed "Add counts" affordance. Only rendered when
 *    `showCounts` is `true` (the Transition screen passes `true` only
 *    for count-based main-skill drills, see
 *    `domain/policies.ts` `COUNT_BASED_METRIC_TYPES`).
 */

const DIFFICULTY_CHIPS: { value: DifficultyTag; label: string }[] = [
  { value: 'too_hard', label: 'Too hard' },
  { value: 'still_learning', label: 'Still learning' },
  { value: 'too_easy', label: 'Too easy' },
]

type PerDrillCaptureProps = {
  drillName: string
  difficulty: DifficultyTag | null
  onDifficultyChange: (next: DifficultyTag) => void
  showCounts: boolean
  goodPasses: number
  attemptCount: number
  notCaptured: boolean
  onGoodChange: (next: number) => void
  onAttemptChange: (next: number) => void
  onToggleNotCaptured: () => void
}

export function PerDrillCapture({
  drillName,
  difficulty,
  onDifficultyChange,
  showCounts,
  goodPasses,
  attemptCount,
  notCaptured,
  onGoodChange,
  onAttemptChange,
  onToggleNotCaptured,
}: PerDrillCaptureProps) {
  const [countsOpen, setCountsOpen] = useState(false)

  return (
    <section
      aria-labelledby="per-drill-heading"
      className="flex flex-col gap-3 rounded-[12px] border border-text-secondary/15 bg-bg-primary p-4"
      data-testid="per-drill-capture"
    >
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">Quick tag</p>
        <h2 id="per-drill-heading" className="text-sm font-semibold text-text-primary">
          How was {drillName}?
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby="per-drill-heading">
        {DIFFICULTY_CHIPS.map((chip) => {
          const selected = difficulty === chip.value
          return (
            <button
              key={chip.value}
              type="button"
              role="radio"
              aria-checked={selected}
              data-difficulty={chip.value}
              onClick={() => onDifficultyChange(chip.value)}
              className={[
                'flex min-h-[54px] items-center justify-center rounded-[12px] px-2 py-2 text-center transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                selected
                  ? 'bg-accent text-white hover:bg-accent-pressed active:bg-accent-pressed'
                  : 'border border-text-secondary/25 bg-bg-primary text-text-primary hover:brightness-95 active:brightness-90',
              ].join(' ')}
            >
              <span className="text-sm font-semibold leading-tight">{chip.label}</span>
            </button>
          )
        })}
      </div>

      {showCounts && !countsOpen && (
        <button
          type="button"
          onClick={() => setCountsOpen(true)}
          className="self-start text-sm font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          data-testid="per-drill-add-counts"
        >
          Add counts (optional)
        </button>
      )}

      {showCounts && countsOpen && (
        <div className="flex flex-col gap-3" data-testid="per-drill-counts">
          <p className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">Counts</span>{' '}
            <span className="font-normal">(optional)</span>
          </p>
          <PassMetricInput
            good={goodPasses}
            total={attemptCount}
            onGoodChange={onGoodChange}
            onTotalChange={onAttemptChange}
            notCaptured={notCaptured}
            onToggleNotCaptured={onToggleNotCaptured}
          />
        </div>
      )}
    </section>
  )
}
