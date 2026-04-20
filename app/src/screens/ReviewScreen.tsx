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
import {
  expireReview,
  FINISH_LATER_CAP_MS,
  loadReviewDraft,
  saveReviewDraft,
  submitReview,
} from '../services/review'
import { loadSession } from '../services/session'

type LoadedSession =
  | { status: 'loading' }
  | { status: 'ready'; log: ExecutionLog; plan: SessionPlan | null }
  | { status: 'missing' }

function isPastDeferralCap(log: ExecutionLog, now: number): boolean {
  const endAt = log.completedAt ?? log.startedAt
  return now - endAt >= FINISH_LATER_CAP_MS
}

/**
 * Render the remaining Finish-Later window as a concrete countdown instead
 * of a static "2 hours" promise. Red-team UX #14. Granularity matches the
 * cap (2 h) so we only need minutes; we round UP to avoid ever showing "0
 * min left" while the session is still actionable.
 */
function formatFinishLaterWindow(log: ExecutionLog, now: number): string {
  const endAt = log.completedAt ?? log.startedAt
  const remainingMs = Math.max(0, FINISH_LATER_CAP_MS - (now - endAt))
  if (remainingMs <= 0) return 'stops counting now'
  const minutesLeft = Math.max(1, Math.ceil(remainingMs / 60_000))
  if (minutesLeft >= 60) {
    const h = Math.floor(minutesLeft / 60)
    const m = minutesLeft % 60
    if (m === 0) return `stops counting in about ${h} hr`
    return `stops counting in about ${h} hr ${m} min`
  }
  return `stops counting in about ${minutesLeft} min`
}

function ReviewSessionContent({
  executionLogId,
}: {
  executionLogId: string
}) {
  const navigate = useNavigate()

  const [loaded, setLoaded] = useState<LoadedSession>({ status: 'loading' })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // H19 (red-team fix plan v3): flips to a non-null value when submitReview
  // refuses because a terminal record already exists (concurrent-tab submit,
  // Home-skip, past-cap auto-expire). The `existingStatus` field lets the
  // conflict copy differentiate "already reviewed" from "already skipped"
  // so the tester sees honest UX in both cases (adv-3 fix).
  const [conflictedWith, setConflictedWith] = useState<
    'submitted' | 'skipped' | null
  >(null)
  // Keep a clock-tick in state so the Finish Later countdown below stays
  // accurate while the user sits on the form, without calling Date.now()
  // from render (which trips the react-hooks/purity rule). Once a minute
  // is plenty for a 2 h cap. Red-team UX #14.
  const [nowMs, setNowMs] = useState<number>(() => Date.now())
  useEffect(() => {
    const tick = setInterval(() => setNowMs(Date.now()), 60_000)
    return () => clearInterval(tick)
  }, [])

  const [sessionRpe, setSessionRpe] = useState<number | null>(null)
  const [good, setGood] = useState(0)
  const [total, setTotal] = useState(0)
  const [incompleteReason, setIncompleteReason] =
    useState<IncompleteReason | null>(null)
  const [quickTags, setQuickTags] = useState<string[]>([])
  const [shortNote, setShortNote] = useState('')
  // C-1 Unit 7 plan calls for 200 ms debounce on the note field (every
  // keystroke is expensive on Dexie) while RPE / pass metric / quickTags
  // commit immediately. `debouncedShortNote` is the value the auto-save
  // effect reads; it lags `shortNote` by 200 ms. Adversarial finding
  // adv-6 fix.
  const [debouncedShortNote, setDebouncedShortNote] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebouncedShortNote(shortNote), 200)
    return () => clearTimeout(t)
  }, [shortNote])
  // Flip to true after `loadSession` + `loadReviewDraft` have resolved
  // (whether or not a draft existed). Until then we must NOT persist a
  // draft, otherwise the pre-hydration zeros would clobber any real
  // draft already on disk. C-1 Unit 7.
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const result = await loadSession(executionLogId)
        if (cancelled) return
        if (!result) {
          setLoaded({ status: 'missing' })
          setHydrated(true)
          return
        }
        // A8 belt (red-team fix plan v3 §A8): a discarded-resume session
        // is never a valid review target. The service-layer A1 filters
        // keep these out of `findPendingReview` / `expireStaleReviews`;
        // this guard catches any stale URL tap that lands here for such
        // a log.
        if (result.execution.endedEarlyReason === 'discarded_resume') {
          navigate(routes.home(), { replace: true })
          return
        }
        // A9 (red-team fix plan v3 §A9 / H16): if the log is already past
        // the 2 h Finish Later cap at mount, write the expired stub here
        // BEFORE routing — CompleteScreen's loadSessionBundle requires a
        // review record to render. Relying on "the next Home-resolve sweep
        // will write it" is a dead-end race: a tester who lands on
        // `/review?id=X` directly (deep link, PWA resume, bookmark) never
        // bounces through Home first, so without an inline write they
        // would see "Session not found." on CompleteScreen.
        //
        // `expireReview` preserves any existing draft payload so the
        // tester's RPE + pain note + metrics survive into the terminal
        // skipped stub (red-team adversarial findings adv-1 / adv-2).
        if (isPastDeferralCap(result.execution, Date.now())) {
          try {
            await expireReview({ executionLogId })
          } catch (err) {
            if (!isSchemaBlocked()) {
              console.error(
                'A9 mount-time expireReview failed; continuing to /complete',
                err,
              )
            }
          }
          if (cancelled) return
          navigate(routes.complete(executionLogId), { replace: true })
          return
        }

        // Rehydrate form state from any persisted draft BEFORE marking
        // `hydrated`. The save-effect is gated on `hydrated`, so this
        // ensures no pre-hydration zero-state write races with the real
        // draft.
        const draft = await loadReviewDraft(executionLogId)
        if (cancelled) return
        if (draft) {
          setSessionRpe(draft.sessionRpe)
          setGood(draft.goodPasses)
          setTotal(draft.totalAttempts)
          setIncompleteReason(draft.incompleteReason ?? null)
          setQuickTags(draft.quickTags ?? [])
          setShortNote(draft.shortNote ?? '')
        }
        setLoaded({
          status: 'ready',
          log: result.execution,
          plan: result.plan,
        })
        setHydrated(true)
      } catch (err) {
        // Reliability finding rel-1: a rejected Dexie read here (quota,
        // corruption, transient InvalidStateError) would otherwise strand
        // the tester on the loading spinner indefinitely. When the schema
        // upgrade is mid-flight, SchemaBlockedOverlay already owns the
        // UI so we suppress our own fallback. Otherwise drop into the
        // `missing` variant — same recoverable UX as "record not found",
        // with a Back-to-start escape hatch.
        if (cancelled) return
        if (isSchemaBlocked()) return
        console.error('ReviewScreen mount failed:', err)
        setLoaded({ status: 'missing' })
        setHydrated(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [executionLogId, navigate])

  // Persist draft on every meaningful form-state change (A3 envelope
  // via `saveReviewDraft`). Gated on `hydrated` so we don't overwrite a
  // real draft with pre-load zeros. Fire-and-forget; `isSchemaBlocked`
  // is handled inside `saveReviewDraft`'s A3 transaction (which is a
  // Dexie write and errors with `DatabaseClosedError` when blocked —
  // we swallow the error here because the overlay owns the UI). C-1 R7.
  useEffect(() => {
    if (!hydrated) return
    if (loaded.status !== 'ready') return
    // First-meaningful-change gate: require either an RPE set OR some
    // pass-metric activity OR quickTag OR note. All-zero/all-default
    // is treated as "no edits yet" and no draft write happens.
    const meaningful =
      sessionRpe != null ||
      good !== 0 ||
      total !== 0 ||
      quickTags.length > 0 ||
      debouncedShortNote.trim() !== '' ||
      incompleteReason != null
    if (!meaningful) return

    void saveReviewDraft({
      executionLogId,
      sessionRpe,
      goodPasses: good,
      totalAttempts: total,
      incompleteReason: incompleteReason ?? undefined,
      quickTags: quickTags.length > 0 ? quickTags : undefined,
      shortNote: debouncedShortNote.trim() || undefined,
    }).catch((err) => {
      if (isSchemaBlocked()) return
      console.error('Review draft save failed:', err)
    })
  }, [
    hydrated,
    loaded.status,
    executionLogId,
    sessionRpe,
    good,
    total,
    incompleteReason,
    quickTags,
    debouncedShortNote,
  ])

  const handleToggleNotCaptured = () => {
    const hasTag = quickTags.includes('notCaptured')
    if (hasTag) {
      setQuickTags(quickTags.filter((t) => t !== 'notCaptured'))
      return
    }
    // Tap-on: zero the metric + tag. Un-tap leaves the zeros (per plan
    // Key Decision #5); the tester can adjust afterwards if they want.
    setGood(0)
    setTotal(0)
    setQuickTags([...quickTags, 'notCaptured'])
  }

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
      // A6 (red-team fix plan v3 §A6) + D120: re-check the 2 h Finish
      // Later cap at the moment the user tapped Submit. A tester who sat
      // on the form past the cap never produces a valid adaptation
      // input, so we write a terminal expired stub (skipped) and route
      // to /complete instead of submitting. The C-2 Case A summary
      // ("No change") renders there because the stub is status:'skipped'.
      if (isPastDeferralCap(log, Date.now())) {
        await expireReview({ executionLogId })
        navigate(routes.complete(executionLogId), { replace: true })
        return
      }
      const result = await submitReview({
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
      // H19 (adv-3 fix + K-TS-1 exhaustive-switch fix): the A3 transaction
      // refuses silently when a terminal record already exists for this
      // execId. `existingStatus` tells us whether the conflict is
      // "submitted" (different surface finalized the review) or "skipped"
      // (user tapped Home's Skip Review). Different copy on each case.
      // Exhaustive switch so a new `SubmitReviewResult` variant fails to
      // compile rather than silently falling through to "success".
      switch (result.status) {
        case 'ok':
          navigate(routes.complete(executionLogId), { replace: true })
          return
        case 'refused':
          setConflictedWith(result.existingStatus)
          setIsSubmitting(false)
          return
        default: {
          const _exhaustive: never = result
          throw new Error(
            `Unhandled submitReview result: ${JSON.stringify(_exhaustive)}`,
          )
        }
      }
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

  if (conflictedWith !== null) {
    // H19 (red-team fix plan v3 + adv-3 differentiation fix): a terminal
    // record already exists. Copy differentiates "already reviewed"
    // (someone else submitted) from "already skipped" (user tapped Skip
    // Review from Home, possibly by mistake, then returned). Claiming
    // "already reviewed" for a skipped session is a false statement that
    // adv-3 flagged as dishonest UX.
    const message =
      conflictedWith === 'submitted'
        ? 'This session was already reviewed. Showing what we saved.'
        : 'This session was already skipped. Showing what we saved.'
    return (
      <StatusMessage
        variant="empty"
        message={message}
        action={
          <Button
            variant="primary"
            onClick={() =>
              navigate(routes.complete(executionLogId), { replace: true })
            }
          >
            View saved review
          </Button>
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
  const isPairMode = plan?.playerCount === 2
  const rpePrompt = isPairMode
    ? 'How hard was this session for you?'
    : 'How hard was your session?'
  const canSubmit =
    sessionRpe != null && (!needsIncompleteReason || incompleteReason != null)

  // Surface exactly what's blocking submission instead of leaving the
  // button grey and silent. Red-team UX #9. Order matches reading order of
  // the form so the hint points at the first missing field.
  const missingHint: string | null = isSubmitting
    ? null
    : sessionRpe == null
      ? 'Rate your effort above to submit.'
      : needsIncompleteReason && incompleteReason == null
        ? 'Pick a reason you ended early to submit.'
        : null

  const handleFinishLater = async () => {
    if (isSubmitting) return
    // C-1 Unit 8: belt-and-suspenders over the auto-save effect — flush
    // the latest form state to the draft before navigating away. A3
    // semantics: this is a no-op if a terminal record somehow already
    // exists on this execId (Unit 7's `saveReviewDraft`).
    const meaningful =
      sessionRpe != null ||
      good !== 0 ||
      total !== 0 ||
      quickTags.length > 0 ||
      shortNote.trim() !== '' ||
      incompleteReason != null
    if (meaningful) {
      try {
        await saveReviewDraft({
          executionLogId,
          sessionRpe,
          goodPasses: good,
          totalAttempts: total,
          incompleteReason: incompleteReason ?? undefined,
          quickTags: quickTags.length > 0 ? quickTags : undefined,
          shortNote: shortNote.trim() || undefined,
        })
      } catch (err) {
        // Reliability finding rel-4: silent-navigate on save failure
        // violates the Finish-Later contract — tester believes the draft
        // was persisted, comes back to a blank form. When the schema is
        // upgrading, SchemaBlockedOverlay owns the UI (let it through).
        // Otherwise stay on the screen and surface the error so the
        // tester can retry Finish Later or Submit.
        if (!isSchemaBlocked()) {
          console.error('Review draft save on Finish Later failed:', err)
          setSubmitError(
            "Couldn't save your draft. Please try again or Submit now.",
          )
          return
        }
      }
    }
    navigate(routes.home())
  }

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-8 pb-8">
      <header className="flex items-start justify-between pt-2">
        <div>
          {/* Phase F12 (2026-04-19): sentence case (was "Quick
              Review" Title Case) per brand-ux guidelines §1.4. */}
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Quick review
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
          {rpePrompt}
        </h2>
        {isPairMode && (
          <p className="text-sm text-text-secondary">
            One rating per device. Partner&rsquo;s score isn&rsquo;t required.
          </p>
        )}
        <RpeSelector value={sessionRpe} onChange={setSessionRpe} />
      </Card>

      {showMetrics && (
        <Card className="flex flex-col gap-3">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              Good passes
            </h2>
            {/* 2026-04-19 non-player tester note: the original phrasing
                ("count it as Not Good") implied a phantom "Not Good"
                control because the binary `good | not-good` vocabulary
                lives in `BinaryPassScore` but never surfaces as a UI
                button — the only controls here are the Good / Total
                numeric cells. Reformulated to preserve the V0B-28
                anti-generosity nudge (D104 layer-1 forced-criterion
                correction) while matching the actual affordance. The
                "Success rule: …" scaffold, the one-sentence rule, and
                the follow-up anti-generosity clause are all still
                present; only the clause's wording changed. See
                `docs/research/2026-04-19-v0b-starter-loop-feedback.md`
                and `docs/specs/m001-review-micro-spec.md` §Required. */}
            <p className="mt-1 text-sm text-text-secondary">
              <span className="font-medium text-text-primary">
                Success rule:
              </span>{' '}
              ball reached the target zone or the next contact was playable.{' '}
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

      {missingHint && (
        <p
          className="text-center text-sm text-text-secondary"
          aria-live="polite"
        >
          {missingHint}
        </p>
      )}

      <Button
        variant="primary"
        fullWidth
        onClick={() => void handleSubmit()}
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? 'Saving\u2026' : 'Submit review'}
      </Button>
      <Button
        variant="link"
        onClick={() => void handleFinishLater()}
        disabled={isSubmitting}
      >
        Finish later
      </Button>
      <p className="-mt-2 text-center text-xs text-text-secondary">
        {`This session ${formatFinishLaterWindow(log, nowMs)}, then it won\u2019t affect planning.`}
      </p>
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
