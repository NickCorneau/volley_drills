import { Link, useSearchParams } from 'react-router-dom'
import { IncompleteReasonChips } from '../components/IncompleteReasonChips'
import { PassMetricInput } from '../components/PassMetricInput'
import { RpeSelector } from '../components/RpeSelector'
import { SafetyIcon } from '../components/SafetyIcon'
import { Button, Card, ScreenShell, StatusMessage } from '../components/ui'
import { formatPassRateLine } from '../lib/format'
import { routes } from '../routes'
import { useReviewController } from './review/useReviewController'

function ReviewSessionContent({ executionLogId }: { executionLogId: string }) {
  const {
    loaded,
    conflictedWith,
    submitError,
    isSubmitting,
    sessionRpe,
    setSessionRpe,
    good,
    setGood,
    total,
    setTotal,
    incompleteReason,
    setIncompleteReason,
    quickTags,
    shortNote,
    setShortNote,
    sessionTitle,
    durationPart,
    statusPart,
    needsIncompleteReason,
    showMetricsCard,
    useAggregateSummary,
    captureAggregate,
    isPairMode,
    rpePrompt,
    canSubmit,
    missingHint,
    handleToggleNotCaptured,
    handleSubmit,
    handleFinishLater,
    handleViewSavedReview,
  } = useReviewController(executionLogId)

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
            Back to home
          </Link>
        }
      />
    )
  }

  if (conflictedWith !== null) {
    const message =
      conflictedWith === 'submitted'
        ? 'This session was already reviewed. Showing what we saved.'
        : 'This session was already skipped. Showing what we saved.'
    return (
      <StatusMessage
        variant="empty"
        message={message}
        action={
          <Button variant="primary" onClick={handleViewSavedReview}>
            View saved review
          </Button>
        }
      />
    )
  }

  return (
    <ScreenShell>
      <ScreenShell.Header className="flex flex-col items-center gap-1 pt-2 pb-3">
        <div className="flex w-full items-center justify-between">
          <SafetyIcon />
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">Quick review</h1>
          <div className="h-14 w-14 shrink-0" aria-hidden />
        </div>
        <p className="text-sm text-text-secondary">
          {sessionTitle} &middot; {durationPart} &middot; {statusPart}
        </p>
      </ScreenShell.Header>

      <ScreenShell.Body className="gap-6 pb-4">
        <Card className="flex flex-col gap-3">
          <h2 id="rpe-heading" className="text-sm font-semibold text-text-primary">
            {rpePrompt}
          </h2>
          {isPairMode && (
            <p className="text-sm text-text-secondary">
              One rating per device. Partner&rsquo;s score isn&rsquo;t required.
            </p>
          )}
          <RpeSelector value={sessionRpe} onChange={setSessionRpe} />
        </Card>

        {showMetricsCard && (
          <>
            <div
              className="h-px w-full bg-text-secondary/15"
              role="presentation"
              aria-hidden="true"
            />
            <Card className="flex flex-col gap-3">
              {useAggregateSummary && captureAggregate ? (
                <>
                  <h2 className="text-sm font-semibold text-text-primary">Good passes</h2>
                  <p className="text-sm text-text-secondary">
                    Captured between blocks on{' '}
                    <span className="font-medium text-text-primary">
                      {captureAggregate.drillsTagged}
                    </span>{' '}
                    drill
                    {captureAggregate.drillsTagged === 1 ? '' : 's'}.
                  </p>
                  <p
                    className="text-base font-semibold text-text-primary"
                    data-testid="per-drill-aggregate"
                  >
                    {captureAggregate.drillsWithCounts > 0
                      ? formatPassRateLine(
                          captureAggregate.goodPasses,
                          captureAggregate.totalAttempts,
                        )
                      : 'Counts not logged for any drill.'}
                  </p>
                </>
              ) : (
                <>
                  <div>
                    <h2 className="text-sm font-semibold text-text-primary">Good passes</h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      <span className="font-medium text-text-primary">Success rule:</span> ball
                      reached the target zone or the next contact was playable.{' '}
                      <span className="font-medium text-text-primary">
                        If unsure, don&rsquo;t count it as Good.
                      </span>
                    </p>
                  </div>
                  <PassMetricInput
                    good={good}
                    total={total}
                    onGoodChange={setGood}
                    onTotalChange={setTotal}
                    notCaptured={quickTags.includes('notCaptured')}
                    onToggleNotCaptured={handleToggleNotCaptured}
                  />
                </>
              )}
            </Card>
          </>
        )}

        {needsIncompleteReason && (
          <Card className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-text-primary">Why did you end early?</h2>
            <IncompleteReasonChips value={incompleteReason} onChange={setIncompleteReason} />
          </Card>
        )}

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
            className="min-h-[88px] w-full resize-y rounded-[12px] border border-text-primary/10 bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </section>
      </ScreenShell.Body>

      <ScreenShell.Footer className="flex flex-col gap-3 pt-4">
        {submitError && <StatusMessage variant="error" message={submitError} />}
        {missingHint && (
          <p className="text-center text-sm text-text-secondary" aria-live="polite">
            {missingHint}
          </p>
        )}
        <Button
          variant="primary"
          fullWidth
          onClick={() => void handleSubmit()}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? 'Saving…' : 'Done'}
        </Button>
        <Button variant="link" onClick={() => void handleFinishLater()} disabled={isSubmitting}>
          Finish later
        </Button>
      </ScreenShell.Footer>
    </ScreenShell>
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
            Back to home
          </Link>
        }
      />
    )
  }

  return <ReviewSessionContent key={executionLogId} executionLogId={executionLogId} />
}
