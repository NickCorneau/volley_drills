import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { IncompleteReasonChips } from '../components/IncompleteReasonChips'
import { PassMetricInput } from '../components/PassMetricInput'
import { QuickTagChips } from '../components/QuickTagChips'
import { RpeSelector } from '../components/RpeSelector'
import { SafetyIcon } from '../components/SafetyIcon'
import { Button, Card, StatusMessage } from '../components/ui'
import type { ExecutionLog, IncompleteReason, SessionPlan } from '../db'
import { formatDurationLine, statusLabel } from '../lib/format'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { routes } from '../routes'
import { submitReview } from '../services/review'
import { loadSession } from '../services/session'

type LoadedSession =
  | { status: 'loading' }
  | { status: 'ready'; log: ExecutionLog; plan: SessionPlan | null }
  | { status: 'missing' }

function ReviewSessionContent({
  executionLogId,
}: {
  executionLogId: string
}) {
  const navigate = useNavigate()

  const [loaded, setLoaded] = useState<LoadedSession>({ status: 'loading' })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [sessionRpe, setSessionRpe] = useState<number | null>(null)
  const [good, setGood] = useState(0)
  const [total, setTotal] = useState(0)
  const [incompleteReason, setIncompleteReason] =
    useState<IncompleteReason | null>(null)
  const [quickTags, setQuickTags] = useState<string[]>([])
  const [shortNote, setShortNote] = useState('')

  useEffect(() => {
    let cancelled = false
    loadSession(executionLogId).then((result) => {
      if (cancelled) return
      if (!result) {
        setLoaded({ status: 'missing' })
      } else {
        setLoaded({
          status: 'ready',
          log: result.execution,
          plan: result.plan,
        })
      }
    })
    return () => {
      cancelled = true
    }
  }, [executionLogId])

  const handleSubmit = async () => {
    if (loaded.status !== 'ready' || sessionRpe == null || isSubmitting) return
    const { log } = loaded
    const isEndedEarly = log.status === 'ended_early'
    const submitWasDiscarded =
      isEndedEarly && log.endedEarlyReason === 'discarded_resume'
    const submitNeedsReason = isEndedEarly && !submitWasDiscarded
    if (submitNeedsReason && incompleteReason == null) return

    setSubmitError(null)
    setIsSubmitting(true)
    try {
      await submitReview({
        executionLogId,
        sessionRpe,
        goodPasses: showMetrics ? good : 0,
        totalAttempts: showMetrics ? total : 0,
        incompleteReason: submitNeedsReason
          ? (incompleteReason ?? undefined)
          : undefined,
        quickTags: quickTags.length > 0 ? quickTags : undefined,
        shortNote: shortNote.trim() || undefined,
      })
      navigate(routes.complete(executionLogId), { replace: true })
    } catch (err) {
      // When another tab has triggered a schema upgrade, `db.close()` rejects
      // the in-flight put. The `SchemaBlockedOverlay` is already taking over
      // the UI, so suppress our own error state to avoid a flash of
      // "Something went wrong" behind the overlay. Matches HomeScreen.
      if (isSchemaBlocked()) return
      console.error('Review submit failed:', err)
      setSubmitError(
        'Something went wrong saving your review. Please try again.',
      )
      setIsSubmitting(false)
    }
  }

  if (loaded.status === 'loading') {
    return <StatusMessage variant="loading" />
  }

  if (loaded.status === 'missing') {
    return (
      <StatusMessage
        variant="empty"
        message="Session not found."
        action={
          <Link
            to={routes.home()}
            className="font-semibold text-accent underline-offset-2 hover:underline"
          >
            Back to start
          </Link>
        }
      />
    )
  }

  const { log, plan } = loaded
  const hasSkillBlocks = plan?.blocks.some(
    (b) => b.type === 'main_skill' || b.type === 'pressure',
  ) ?? false

  const sessionTitle = plan?.presetName ?? 'Session'
  const durationPart = formatDurationLine(log)
  const statusPart = statusLabel(log.status)
  const isEndedEarly = log.status === 'ended_early'
  const wasDiscarded =
    isEndedEarly && log.endedEarlyReason === 'discarded_resume'
  const needsIncompleteReason = isEndedEarly && !wasDiscarded
  const showMetrics = !wasDiscarded && hasSkillBlocks
  const canSubmit =
    sessionRpe != null && (!needsIncompleteReason || incompleteReason != null)

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-8 pb-8">
      <header className="flex items-start justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Quick Review
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {sessionTitle} &middot; {durationPart} &middot; {statusPart}
          </p>
        </div>
        <SafetyIcon />
      </header>

      <Card className="flex flex-col gap-3">
        <h2
          id="rpe-heading"
          className="text-base font-semibold text-text-primary"
        >
          How hard was your session?
        </h2>
        <RpeSelector value={sessionRpe} onChange={setSessionRpe} />
      </Card>

      {showMetrics && (
        <Card className="flex flex-col gap-3">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              Good passes
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              <span className="font-medium text-text-primary">
                Success rule:
              </span>{' '}
              ball reached the target zone or the next contact was playable.{' '}
              <span className="font-medium text-text-primary">
                If unsure, count it as Not Good.
              </span>
            </p>
          </div>
          <PassMetricInput
            good={good}
            total={total}
            onGoodChange={setGood}
            onTotalChange={setTotal}
          />
        </Card>
      )}

      {needsIncompleteReason && (
        <Card className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-text-primary">
            Why did you end early?
          </h2>
          <IncompleteReasonChips
            value={incompleteReason}
            onChange={setIncompleteReason}
          />
        </Card>
      )}

      <Card className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-text-primary">
          Quick tags
        </h2>
        <QuickTagChips selected={quickTags} onChange={setQuickTags} />
      </Card>

      <section className="flex flex-col gap-2">
        <label
          htmlFor="review-note"
          className="text-sm font-semibold text-text-primary"
        >
          Short note{' '}
          <span className="font-normal text-text-secondary">(optional)</span>
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

      {submitError && <StatusMessage variant="error" message={submitError} />}

      <Button
        variant="primary"
        fullWidth
        onClick={() => void handleSubmit()}
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? 'Saving\u2026' : 'Submit Review'}
      </Button>
    </div>
  )
}

export function ReviewScreen() {
  const [searchParams] = useSearchParams()
  const executionLogId = searchParams.get('id')

  if (!executionLogId) {
    return (
      <StatusMessage
        variant="empty"
        message="Missing session. Open review from a completed run."
        action={
          <Link
            to={routes.home()}
            className="font-semibold text-accent underline-offset-2 hover:underline"
          >
            Back to start
          </Link>
        }
      />
    )
  }

  return (
    <ReviewSessionContent
      key={executionLogId}
      executionLogId={executionLogId}
    />
  )
}
