import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { IncompleteReasonChips } from '../components/IncompleteReasonChips'
import { PassMetricInput } from '../components/PassMetricInput'
import { QuickTagChips } from '../components/QuickTagChips'
import { RpeSelector } from '../components/RpeSelector'
import { SafetyIcon } from '../components/SafetyIcon'
import { db } from '../db'
import type { ExecutionLog, ExecutionStatus, IncompleteReason, SessionPlan } from '../db/types'

function formatDurationLine(log: ExecutionLog): string {
  const end = log.completedAt ?? log.pausedAt
  if (!end) return '—'
  const mins = Math.max(1, Math.round((end - log.startedAt) / 60000))
  return `${mins} min`
}

function statusLine(status: ExecutionStatus): string {
  switch (status) {
    case 'completed':
      return 'Complete'
    case 'ended_early':
      return 'Ended early'
    case 'in_progress':
      return 'In progress'
    case 'not_started':
      return 'Not started'
    case 'paused':
      return 'Paused'
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

function MissingIdMessage() {
  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col items-center gap-4 py-12 text-center">
      <p className="text-text-primary">Missing session. Open review from a completed run.</p>
      <Link
        to="/"
        className="font-semibold text-accent underline-offset-2 hover:underline"
      >
        Back to start
      </Link>
    </div>
  )
}

type LoadedSession =
  | { status: 'loading' }
  | { status: 'ready'; log: ExecutionLog; plan: SessionPlan | null }
  | { status: 'missing' }

function ReviewSessionContent({ executionLogId }: { executionLogId: string }) {
  const navigate = useNavigate()

  const [loaded, setLoaded] = useState<LoadedSession>({ status: 'loading' })

  const [sessionRpe, setSessionRpe] = useState<number | null>(null)
  const [good, setGood] = useState(0)
  const [total, setTotal] = useState(0)
  const [incompleteReason, setIncompleteReason] = useState<IncompleteReason | null>(null)
  const [quickTags, setQuickTags] = useState<string[]>([])
  const [shortNote, setShortNote] = useState('')

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const foundLog = await db.executionLogs.get(executionLogId)
      if (cancelled) return
      if (!foundLog) {
        setLoaded({ status: 'missing' })
        return
      }
      const foundPlan = await db.sessionPlans.get(foundLog.planId)
      if (cancelled) return
      setLoaded({ status: 'ready', log: foundLog, plan: foundPlan ?? null })
    })()

    return () => {
      cancelled = true
    }
  }, [executionLogId])

  const handleSubmit = async () => {
    if (loaded.status !== 'ready' || sessionRpe == null) return
    const { log } = loaded

    const reviewId = `review-${executionLogId}`
    await db.sessionReviews.put({
      id: reviewId,
      executionLogId,
      sessionRpe,
      goodPasses: good,
      totalAttempts: total,
      incompleteReason:
        log.status === 'ended_early' ? incompleteReason ?? undefined : undefined,
      quickTags: quickTags.length > 0 ? quickTags : undefined,
      shortNote: shortNote.trim() || undefined,
      submittedAt: Date.now(),
    })

    navigate(`/complete?id=${encodeURIComponent(executionLogId)}`)
  }

  if (loaded.status === 'loading') {
    return (
      <div className="mx-auto flex w-full max-w-[390px] justify-center py-16 text-text-secondary">
        Loading…
      </div>
    )
  }

  if (loaded.status === 'missing') {
    return (
      <div className="mx-auto flex w-full max-w-[390px] flex-col items-center gap-4 py-12 text-center">
        <p className="text-text-primary">Session not found.</p>
        <Link
          to="/"
          className="font-semibold text-accent underline-offset-2 hover:underline"
        >
          Back to start
        </Link>
      </div>
    )
  }

  const { log, plan } = loaded
  const sessionTitle = plan?.presetName ?? 'Session'
  const durationPart = formatDurationLine(log)
  const statusPart = statusLine(log.status)
  const canSubmit = sessionRpe != null

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-8 pb-8">
      <header className="flex items-start justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Quick Review
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {sessionTitle} · {durationPart} · {statusPart}
          </p>
        </div>
        <SafetyIcon />
      </header>

      <section className="flex flex-col gap-3 rounded-[12px] bg-bg-warm p-4">
        <h2 id="rpe-heading" className="text-base font-semibold text-text-primary">
          How hard was your session?
        </h2>
        <RpeSelector value={sessionRpe} onChange={setSessionRpe} />
      </section>

      <section className="flex flex-col gap-3 rounded-[12px] bg-bg-warm p-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Good passes</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Ball reached target zone or next contact was playable
          </p>
        </div>
        <PassMetricInput
          good={good}
          total={total}
          onGoodChange={setGood}
          onTotalChange={setTotal}
        />
      </section>

      {log.status === 'ended_early' && (
        <section className="flex flex-col gap-3 rounded-[12px] bg-bg-warm p-4">
          <h2 className="text-base font-semibold text-text-primary">
            Why did you end early?
          </h2>
          <IncompleteReasonChips
            value={incompleteReason}
            onChange={setIncompleteReason}
          />
        </section>
      )}

      <section className="flex flex-col gap-3 rounded-[12px] bg-bg-warm p-4">
        <h2 className="text-base font-semibold text-text-primary">Quick tags</h2>
        <QuickTagChips selected={quickTags} onChange={setQuickTags} />
      </section>

      <section className="flex flex-col gap-2">
        <label htmlFor="review-note" className="text-sm font-semibold text-text-primary">
          Short note <span className="font-normal text-text-secondary">(optional)</span>
        </label>
        <textarea
          id="review-note"
          rows={3}
          value={shortNote}
          onChange={(e) => setShortNote(e.target.value)}
          placeholder="Anything else?"
          className="min-h-[88px] w-full resize-y rounded-[12px] border border-text-primary/10 bg-bg-primary px-3 py-2 text-base text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </section>

      <button
        type="button"
        onClick={() => void handleSubmit()}
        disabled={!canSubmit}
        className={[
          'min-h-[56px] w-full rounded-[16px] px-4 py-3 text-base font-semibold text-white',
          'transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'bg-accent active:bg-accent-pressed',
        ].join(' ')}
      >
        Submit Review
      </button>
    </div>
  )
}

export function ReviewScreen() {
  const [searchParams] = useSearchParams()
  const executionLogId = searchParams.get('id')

  if (!executionLogId) {
    return <MissingIdMessage />
  }

  return <ReviewSessionContent key={executionLogId} executionLogId={executionLogId} />
}
