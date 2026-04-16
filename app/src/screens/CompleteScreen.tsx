import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SafetyIcon } from '../components/SafetyIcon'
import { Button, Card, StatusMessage } from '../components/ui'
import { effortLabel } from '../lib/format'
import { routes } from '../routes'
import { loadSessionBundle, type SessionBundle } from '../services/review'
import { clearTimerState } from '../services/timer'

type BundleState =
  | { status: 'loading' }
  | { status: 'ready'; bundle: SessionBundle }
  | { status: 'missing' }

function SessionCompleteIcon() {
  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent"
      aria-hidden
    >
      <svg
        className="h-8 w-8 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
  )
}

function SavedCheckIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-success"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export function CompleteScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const executionLogId = searchParams.get('id')

  const [bundleState, setBundleState] = useState<BundleState>({
    status: 'loading',
  })

  useEffect(() => {
    void clearTimerState()
  }, [])

  useEffect(() => {
    if (!executionLogId) return
    let cancelled = false
    loadSessionBundle(executionLogId).then((result) => {
      if (cancelled) return
      if (!result) {
        setBundleState({ status: 'missing' })
      } else {
        setBundleState({ status: 'ready', bundle: result })
      }
    })
    return () => {
      cancelled = true
    }
  }, [executionLogId])

  useEffect(() => {
    if (!executionLogId) {
      navigate(routes.home(), { replace: true })
    }
  }, [executionLogId, navigate])

  if (!executionLogId) {
    return null
  }

  if (bundleState.status === 'loading') {
    return <StatusMessage variant="loading" />
  }

  if (bundleState.status === 'missing') {
    return (
      <StatusMessage
        variant="empty"
        message="Session not found."
        action={
          <Button
            variant="ghost"
            onClick={() => navigate(routes.home(), { replace: true })}
          >
            Back to start
          </Button>
        }
      />
    )
  }

  const { log, plan, review } = bundleState.bundle
  const totalMinutes = plan.blocks.reduce(
    (sum, b) => sum + b.durationMinutes,
    0,
  )
  const durationMinutesRounded = Math.max(0, Math.round(totalMinutes))
  const totalBlocks = plan.blocks.length
  const completedBlocks = log.blockStatuses.filter(
    (b) => b.status === 'completed',
  ).length
  const goodPassRatePct =
    review.totalAttempts > 0
      ? Math.round((review.goodPasses / review.totalAttempts) * 100)
      : null

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col items-center gap-8 pb-10 pt-4">
      <div className="self-start">
        <SafetyIcon />
      </div>
      <div className="flex flex-col items-center gap-4 text-center">
        <SessionCompleteIcon />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Session Complete
          </h1>
          <p className="mt-2 text-text-secondary">
            {plan.presetName} · {durationMinutesRounded} min
          </p>
        </div>
      </div>

      <Card className="w-full" aria-label="Session summary">
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Blocks completed</dt>
            <dd className="font-medium tabular-nums text-text-primary">
              {completedBlocks}/{totalBlocks}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Good pass rate</dt>
            <dd
              className={`font-medium tabular-nums ${goodPassRatePct !== null ? 'text-success' : 'text-text-secondary'}`}
            >
              {goodPassRatePct !== null ? `${goodPassRatePct}%` : '\u2014'}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Effort</dt>
            <dd className="font-medium text-text-primary">
              {effortLabel(review.sessionRpe)}
            </dd>
          </div>
        </dl>
      </Card>

      <div className="flex w-full flex-col gap-4">
        <Button
          variant="primary"
          fullWidth
          onClick={() => navigate(routes.home())}
        >
          Done
        </Button>
        <p className="flex items-center justify-center gap-2 text-sm font-medium text-success">
          <SavedCheckIcon />
          Saved on device
        </p>
      </div>

      <p className="max-w-[320px] text-center text-sm text-text-secondary">
        Thanks for testing! Your feedback helps us improve.
      </p>
    </div>
  )
}
