import { useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSessionRunner } from '../hooks/useSessionRunner'
import { SafetyIcon } from '../components/SafetyIcon'

function formatDuration(minutes: number): string {
  return minutes === 1 ? '1 min' : `${minutes} min`
}

export function TransitionScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const executionLogId = searchParams.get('id') ?? ''

  const runner = useSessionRunner(executionLogId)
  const { plan, execution, currentBlockIndex, totalBlocks } = runner

  const prevBlockIdx = currentBlockIndex - 1
  const prevBlock = plan?.blocks[prevBlockIdx] ?? null
  const prevBlockStatus = execution?.blockStatuses[prevBlockIdx] ?? null
  const nextBlock = plan?.blocks[currentBlockIndex] ?? null
  const hasNextBlock = currentBlockIndex < totalBlocks

  useEffect(() => {
    if (!execution) return
    if (execution.status === 'completed' || !hasNextBlock) {
      navigate(`/review?id=${executionLogId}`, { replace: true })
    }
  }, [execution, hasNextBlock, executionLogId, navigate])

  const handleStartNext = useCallback(() => {
    navigate(`/run?id=${executionLogId}`)
  }, [navigate, executionLogId])

  const handleStartShortened = useCallback(() => {
    navigate(`/run?id=${executionLogId}`, { state: { shortened: true } })
  }, [navigate, executionLogId])

  const handleSkip = useCallback(async () => {
    const isLast = await runner.skipBlock()
    if (isLast) {
      navigate(`/review?id=${executionLogId}`, { replace: true })
    }
  }, [runner, navigate, executionLogId])

  if (!plan || !execution || !nextBlock) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-text-secondary">Loading…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-6 pb-8">
      <div className="flex items-center justify-between pt-2">
        <SafetyIcon />
        <span className="text-sm font-bold uppercase tracking-wider text-text-secondary">
          Transition
        </span>
        <span className="text-sm font-medium text-text-secondary">
          {currentBlockIndex}/{totalBlocks}
        </span>
      </div>

      {prevBlock && (
        <div className="flex items-start gap-3 rounded-[12px] bg-bg-warm p-4">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
            {prevBlockStatus?.status === 'completed' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </div>
          <div>
            <p className="font-semibold text-text-primary">{prevBlock.drillName}</p>
            <p className="text-sm text-success">
              {prevBlockStatus?.status === 'completed' ? 'Complete' : 'Skipped'}
            </p>
          </div>
        </div>
      )}

      <div className="border-t border-text-secondary/10" />

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Up Next
        </p>
        <h1 className="text-2xl font-bold text-text-primary">
          {nextBlock.drillName}
        </h1>
        <p className="text-sm text-text-secondary">
          {formatDuration(nextBlock.durationMinutes)}
        </p>
        {nextBlock.coachingCue && (
          <p className="text-sm text-text-secondary">{nextBlock.coachingCue}</p>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <button
          type="button"
          onClick={handleStartNext}
          className={[
            'min-h-[54px] w-full rounded-[16px] px-4 py-3 text-base font-semibold text-white',
            'bg-accent active:bg-accent-pressed transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
          ].join(' ')}
        >
          Start Next Block
        </button>
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={handleStartShortened}
            className="text-sm font-medium text-accent"
          >
            Shorten block
          </button>
          {!nextBlock.required && (
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm font-medium text-text-secondary"
            >
              Skip block
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
