import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SafetyIcon } from '../components/SafetyIcon'
import { Button, StatusMessage } from '../components/ui'
import { useSessionRunner } from '../hooks/useSessionRunner'
import { formatDuration } from '../lib/format'
import { routes } from '../routes'

export function TransitionScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const executionLogId = searchParams.get('id') ?? ''

  const runner = useSessionRunner(executionLogId)
  const { plan, execution, loaded, currentBlockIndex, totalBlocks } = runner

  const prevBlockIdx = currentBlockIndex - 1
  const prevBlock = plan?.blocks[prevBlockIdx] ?? null
  const prevBlockStatus = execution?.blockStatuses[prevBlockIdx] ?? null
  const nextBlock = plan?.blocks[currentBlockIndex] ?? null
  const hasNextBlock = currentBlockIndex < totalBlocks

  useEffect(() => {
    if (!execution) return
    if (execution.status === 'completed' || !hasNextBlock) {
      navigate(routes.review(executionLogId), { replace: true })
    }
  }, [execution, hasNextBlock, executionLogId, navigate])

  const handleStartNext = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(100)
    navigate(routes.run(executionLogId))
  }, [navigate, executionLogId])

  const handleStartShortened = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(100)
    navigate(routes.run(executionLogId), { state: { shortened: true } })
  }, [navigate, executionLogId])

  const [isSkipping, setIsSkipping] = useState(false)
  const [skipError, setSkipError] = useState<string | null>(null)

  const handleSkip = useCallback(async () => {
    if (isSkipping) return
    setIsSkipping(true)
    try {
      if (navigator.vibrate) navigator.vibrate(100)
      const isLast = await runner.skipBlock()
      if (isLast) {
        navigate(routes.review(executionLogId), { replace: true })
      }
    } catch (err) {
      console.error('Skip block failed:', err)
      setSkipError('Something went wrong. Try again.')
      setIsSkipping(false)
    }
  }, [runner, navigate, executionLogId, isSkipping])

  if (!plan || !execution || !nextBlock) {
    if (loaded) {
      return (
        <StatusMessage
          variant="empty"
          message="Session not found."
          action={
            <Link
              to={routes.home()}
              className="min-h-[54px] inline-flex items-center px-4 font-semibold text-accent underline-offset-2 hover:underline"
            >
              Back to start
            </Link>
          }
        />
      )
    }
    return <StatusMessage variant="loading" />
  }

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-6 pb-8">
      <div className="flex items-center justify-between pt-2">
        <SafetyIcon />
        {/* Phase F8 (2026-04-19): was `text-sm font-bold uppercase
            tracking-wider`. Dropped the dashboard-eyebrow voice to
            `text-sm font-medium` sentence case; the "Transition"
            label is a calm status marker, not a hero. See
            `docs/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md`. */}
        <span className="text-sm font-medium text-text-secondary">
          Transition
        </span>
        <span className="text-sm font-medium text-text-secondary">
          Next: {currentBlockIndex + 1}/{totalBlocks}
        </span>
      </div>

      {prevBlock && (
        <div className="flex items-start gap-3 rounded-[12px] bg-bg-warm p-4">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
            {prevBlockStatus?.status === 'completed' ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </div>
          <div>
            <p className="font-semibold text-text-primary">
              {prevBlock.drillName}
            </p>
            <p className="text-sm text-success">
              {prevBlockStatus?.status === 'completed' ? 'Complete' : 'Skipped'}
            </p>
          </div>
        </div>
      )}

      <div className="border-t border-text-secondary/10" />

      {skipError && <StatusMessage variant="error" message={skipError} />}

      <div className="flex flex-col gap-2">
        {/* Phase F8 (2026-04-19): was `text-xs font-semibold uppercase
            tracking-wider` eyebrow. Dropped to sentence-case `text-xs
            font-medium` so the next-block h1 below carries the focal
            weight. Drill-title h1 gained `tracking-tight` to match the
            Review / prep-screen display-heading treatment. */}
        <p className="text-xs font-medium text-text-secondary">
          Up next
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          {nextBlock.drillName}
        </h1>
        <p className="text-sm text-text-secondary">
          {formatDuration(nextBlock.durationMinutes)}
        </p>
        {nextBlock.courtsideInstructions && (
          <p className="text-sm leading-relaxed text-text-primary">
            {nextBlock.courtsideInstructions}
          </p>
        )}
      </div>

      {skipError && <StatusMessage variant="error" message={skipError} />}

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <Button variant="primary" fullWidth onClick={handleStartNext}>
          Start Next Block
        </Button>
        <div className="flex items-center justify-center gap-6">
          <Button variant="ghost" onClick={handleStartShortened}>
            Shorten block
          </Button>
          {!nextBlock.required && (
            <Button
              variant="ghost"
              className="text-text-secondary"
              onClick={handleSkip}
            >
              Skip block
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
