import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SafetyIcon } from '../components/SafetyIcon'
import { clearTimerState, db } from '../db'
import type { ExecutionLog, SessionPlan, SessionReview } from '../db'

type SessionBundle = {
  log: ExecutionLog
  plan: SessionPlan
  review: SessionReview
}

function effortLabel(rpe: number): string {
  if (rpe < 4) return 'Easy'
  if (rpe < 7) return 'Moderate'
  if (rpe < 10) return 'Hard'
  return 'Max'
}

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

  useEffect(() => {
    void clearTimerState()
  }, [])

  const bundle = useLiveQuery(
    async (): Promise<SessionBundle | null> => {
      if (!executionLogId) return null
      const log = await db.executionLogs.get(executionLogId)
      if (!log) return null
      const [plan, review] = await Promise.all([
        db.sessionPlans.get(log.planId),
        db.sessionReviews.where('executionLogId').equals(log.id).first(),
      ])
      if (!plan || !review) return null
      return { log, plan, review }
    },
    [executionLogId],
  )

  useEffect(() => {
    if (!executionLogId) {
      navigate('/', { replace: true })
    }
  }, [executionLogId, navigate])

  if (!executionLogId) {
    return null
  }

  if (bundle === undefined) {
    return (
      <div className="mx-auto flex w-full max-w-[390px] flex-col items-center justify-center gap-3 py-24">
        <p className="text-text-secondary">Loading…</p>
      </div>
    )
  }

  if (bundle === null) {
    return (
      <div className="mx-auto flex w-full max-w-[390px] flex-col items-center justify-center gap-4 py-24">
        <p className="text-text-primary">Session not found.</p>
        <button
          type="button"
          onClick={() => navigate('/', { replace: true })}
          className="min-h-[54px] px-4 font-semibold text-accent"
        >
          Back to start
        </button>
      </div>
    )
  }

  const { log, plan, review } = bundle
  const totalMinutes = plan.blocks.reduce((sum, b) => sum + b.durationMinutes, 0)
  const durationMinutesRounded = Math.max(0, Math.round(totalMinutes))
  const totalBlocks = plan.blocks.length
  const completedBlocks = log.blockStatuses.filter((b) => b.status === 'completed').length
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

      <div
        className="w-full rounded-[length:var(--radius-card)] bg-bg-warm px-4 py-4"
        aria-label="Session summary"
      >
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
              {goodPassRatePct !== null ? `${goodPassRatePct}%` : '—'}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Effort</dt>
            <dd className="font-medium text-text-primary">
              {effortLabel(review.sessionRpe)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex w-full flex-col gap-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full rounded-[length:var(--radius-button)] bg-accent px-4 py-3.5 text-base font-semibold text-white transition-colors hover:bg-accent-pressed active:bg-accent-pressed"
        >
          Done
        </button>
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
