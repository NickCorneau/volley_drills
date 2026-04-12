type PassMetricInputProps = {
  good: number
  total: number
  onGoodChange: (next: number) => void
  onTotalChange: (next: number) => void
}

export function PassMetricInput({
  good,
  total,
  onGoodChange,
  onTotalChange,
}: PassMetricInputProps) {
  const rate =
    total > 0 ? Math.round((good / total) * 100) : null

  const decGood = () => onGoodChange(Math.max(0, good - 1))
  const incGood = () => {
    const next = good + 1
    if (next > total) onTotalChange(next)
    onGoodChange(next)
  }

  const decTotal = () => onTotalChange(Math.max(good, total - 1))
  const incTotal = () => onTotalChange(total + 1)

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium text-text-primary">Good</span>
          <span className="text-2xl font-bold tabular-nums text-text-primary">
            {good}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={decGood}
              disabled={good <= 0}
              aria-label="Decrease good passes"
              className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-text-primary/20 bg-bg-primary text-xl font-semibold text-text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-40 active:bg-bg-warm"
            >
              −
            </button>
            <button
              type="button"
              onClick={incGood}
              aria-label="Increase good passes"
              className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-text-primary/20 bg-bg-primary text-xl font-semibold text-text-primary transition-colors active:bg-bg-warm"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium text-text-primary">Total</span>
          <span className="text-2xl font-bold tabular-nums text-text-primary">
            {total}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={decTotal}
              disabled={total <= good}
              aria-label="Decrease total attempts"
              className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-text-primary/20 bg-bg-primary text-xl font-semibold text-text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-40 active:bg-bg-warm"
            >
              −
            </button>
            <button
              type="button"
              onClick={incTotal}
              aria-label="Increase total attempts"
              className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-text-primary/20 bg-bg-primary text-xl font-semibold text-text-primary transition-colors active:bg-bg-warm"
            >
              +
            </button>
          </div>
        </div>
      </div>
      {rate != null && (
        <p className="text-center text-base font-semibold text-accent">
          {rate}% good pass rate
        </p>
      )}
    </div>
  )
}
