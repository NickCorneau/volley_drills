import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  AdaptationDelta,
  ExecutionLog,
  IncompleteReason,
  PerDrillCapture as PerDrillCaptureRecord,
  SessionPlan,
  VerdictChoice,
} from '../../model'
import {
  aggregateDrillCaptures,
  hasMeaningfulReviewDraftInput,
  inferPlanMainMetricType,
  metricShowsReviewCounts,
} from '../../domain/capture'
import { composeAcceptConsequence } from '../../domain/adaptation/acceptConsequence'
import { composeProgressionRead, resolveTrainedRung } from '../../domain/adaptation/progressionRead'
import { composeCarryForwardLine } from '../../domain/adaptation/replayAdaptation'
import { isScopedFocus } from '../../domain/eligibleSessions'
import { inferSessionFocus } from '../../domain/sessionFocus'
import { loadVerdictOffer } from '../../services/verdictOffer'
import { formatDurationLine, statusLabel } from '../../lib/format'
import { isSchemaBlocked } from '../../lib/schema-blocked'
import { routes } from '../../routes'
import {
  expireReview,
  FINISH_LATER_CAP_MS,
  loadReviewDraft,
  patchReviewForm,
  submitReview,
} from '../../services/review'
import { loadSession } from '../../services/session'

type LoadedSession =
  | { status: 'loading' }
  | { status: 'ready'; log: ExecutionLog; plan: SessionPlan | null }
  | { status: 'missing' }

/**
 * U3 (2026-06-11 session-truth plan): ends the SYSTEM recorded, not a
 * choice the user made. `discarded_resume` (A8 stubs), `missing_plan`
 * (orphaned log repair), and `resume_out_of_bounds` (clamped resume)
 * must not face the "why did you end early?" reason gate - there is no
 * honest answer. User abandonments (`user_quit` etc.) keep the gate;
 * deliberate wraps are `completed`, so the gate self-resolves there.
 */
const SYSTEM_ENDED_REASONS = new Set(['discarded_resume', 'missing_plan', 'resume_out_of_bounds'])

function isPastDeferralCap(log: ExecutionLog, now: number): boolean {
  const endAt = log.completedAt ?? log.startedAt
  return now - endAt >= FINISH_LATER_CAP_MS
}

export function useReviewController(executionLogId: string) {
  const navigate = useNavigate()

  const [loaded, setLoaded] = useState<LoadedSession>({ status: 'loading' })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [conflictedWith, setConflictedWith] = useState<'submitted' | 'skipped' | null>(null)

  const [sessionRpe, setSessionRpe] = useState<number | null>(null)
  const [good, setGood] = useState(0)
  const [total, setTotal] = useState(0)
  const [incompleteReason, setIncompleteReason] = useState<IncompleteReason | null>(null)
  const [quickTags, setQuickTags] = useState<string[]>([])
  const [shortNote, setShortNote] = useState('')
  const [perDrillCaptures, setPerDrillCaptures] = useState<PerDrillCaptureRecord[]>([])
  const [debouncedShortNote, setDebouncedShortNote] = useState('')
  const [hydrated, setHydrated] = useState(false)
  // Default is keep-original so doing nothing is the safe, no-reshuffle path.
  const [offeredDelta, setOfferedDelta] = useState<AdaptationDelta | null>(null)
  // The derived ladder position the offer gate resolved (trust-loop
  // U2/U3): one fold serves the gate and the consequence caption.
  const [offerPosition, setOfferPosition] = useState<number | null>(null)
  const [verdictChoice, setVerdictChoice] = useState<VerdictChoice>('kept_original')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedShortNote(shortNote), 200)
    return () => clearTimeout(t)
  }, [shortNote])

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
        if (result.execution.endedEarlyReason === 'discarded_resume') {
          navigate(routes.home(), { replace: true })
          return
        }
        if (isPastDeferralCap(result.execution, Date.now())) {
          try {
            await expireReview({ executionLogId })
          } catch (err) {
            if (!isSchemaBlocked()) {
              console.error('A9 mount-time expireReview failed; continuing to /complete', err)
            }
          }
          if (cancelled) return
          navigate(routes.complete(executionLogId), { replace: true })
          return
        }

        const draft = await loadReviewDraft(executionLogId)
        if (cancelled) return
        if (draft) {
          setSessionRpe(draft.sessionRpe)
          setGood(draft.goodPasses)
          setTotal(draft.totalAttempts)
          setIncompleteReason(draft.incompleteReason ?? null)
          setQuickTags(draft.quickTags ?? [])
          setShortNote(draft.shortNote ?? '')
          setPerDrillCaptures(draft.perDrillCaptures ?? [])
        }
        setLoaded({
          status: 'ready',
          log: result.execution,
          plan: result.plan,
        })
        setHydrated(true)

        // Best-effort: a failure here must never block the review from loading.
        const focus = result.plan ? inferSessionFocus(result.plan.blocks) : 'partial'
        if (isScopedFocus(focus)) {
          try {
            const { offer, position } = await loadVerdictOffer(focus, executionLogId)
            if (!cancelled && offer.direction !== 'keep') {
              setOfferedDelta(offer)
              setOfferPosition(position)
            }
          } catch (offerErr) {
            if (!isSchemaBlocked()) {
              console.error('Verdict offer load failed; continuing without it', offerErr)
            }
          }
        }
      } catch (err) {
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

  useEffect(() => {
    if (!hydrated) return
    if (loaded.status !== 'ready') return
    const meaningful = hasMeaningfulReviewDraftInput({
      sessionRpe,
      goodPasses: good,
      totalAttempts: total,
      quickTags,
      shortNote: debouncedShortNote,
      incompleteReason,
    })
    if (!meaningful) return

    void patchReviewForm(executionLogId, {
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
    setGood(0)
    setTotal(0)
    setQuickTags([...quickTags, 'notCaptured'])
  }

  const readySession = loaded.status === 'ready' ? loaded : null
  const log = readySession?.log ?? null
  const plan = readySession?.plan ?? null
  const hasSkillBlocks =
    plan?.blocks.some((b) => b.type === 'main_skill' || b.type === 'pressure') ?? false
  const sessionTitle = plan?.presetName ?? 'Session'
  const durationPart = log ? formatDurationLine(log) : ''
  const statusPart = log ? statusLabel(log.status) : ''
  const isEndedEarly = log?.status === 'ended_early'
  const wasDiscarded = isEndedEarly && log?.endedEarlyReason === 'discarded_resume'
  const isSystemEnded = isEndedEarly && SYSTEM_ENDED_REASONS.has(log?.endedEarlyReason ?? '')
  const needsIncompleteReason = isEndedEarly && !isSystemEnded
  const metricType = inferPlanMainMetricType(plan)
  const showMetrics = !wasDiscarded && hasSkillBlocks && metricShowsReviewCounts(metricType)
  const captureAggregate =
    perDrillCaptures.length > 0 ? aggregateDrillCaptures(perDrillCaptures) : null
  const useAggregateSummary = captureAggregate !== null && captureAggregate.drillsTagged > 0
  const showMetricsCard = showMetrics || useAggregateSummary
  const isPairMode = plan?.playerCount === 2
  const rpePrompt = isPairMode ? 'How hard was this session for you?' : 'How hard was your session?'
  const canSubmit = sessionRpe != null && (!needsIncompleteReason || incompleteReason != null)
  // A 'keep' offer produces a null line (composeCarryForwardLine), so the
  // verdict block is absent whenever there's nothing worth changing.
  const verdictLine = offeredDelta ? composeCarryForwardLine(offeredDelta) : null
  // Trust-loop U3 (R4): the accept option's hedged drill exemplar at
  // the prospective position. Null fails quiet — legacy plans without
  // context, non-scoped focus, or an empty/ineligible prospective rung
  // all render no caption rather than a wrong one (KTD8).
  const acceptConsequenceLine =
    offeredDelta !== null &&
    offerPosition !== null &&
    plan?.context !== undefined &&
    isScopedFocus(offeredDelta.focus)
      ? composeAcceptConsequence({
          focus: offeredDelta.focus,
          direction: offeredDelta.direction,
          position: offerPosition,
          context: plan.context,
          excludeDrillId: plan.blocks.find((b) => b.type === 'main_skill')?.drillId,
        })
      : null
  // M002.2 progression read (plan 2026-06-22-001): the trained rung's
  // explorationCriterion (reflection, direction-agnostic) and the
  // offer-position rung's graduationFeel (readiness, 'more' only). Gated
  // on the same offer the verdict card is. Deliberately does NOT reuse
  // the acceptConsequence guard wholesale - that requires plan.context,
  // which the progression read does not need. Null-safe (never throws).
  const progressionRead =
    offeredDelta !== null && offerPosition !== null && isScopedFocus(offeredDelta.focus)
      ? composeProgressionRead({
          focus: offeredDelta.focus,
          trainedRung: resolveTrainedRung(offeredDelta.focus, plan?.blocks),
          offerPosition,
          direction: offeredDelta.direction,
        })
      : { reflection: null, readiness: null }
  const progressionReflectionLine = progressionRead.reflection
  // T5 verdict-card density cap (2026-06-22 shibui audit; revisits D161):
  // on a `more` offer the readiness line (graduationFeel) overlaps the
  // carry-forward offer line ("you're ready for more") and the reflection
  // line, so it is the redundant one when the card is dense. Suppress it
  // whenever the accept-consequence renders, capping the card at 3 prose
  // lines (offer -> reflection -> accept-consequence). Readiness survives
  // only as the forward line when no accept-consequence renders (legacy /
  // no-context plans), so a `more` card always carries a step-up read and
  // never exceeds 3 prose lines.
  const progressionReadinessLine = acceptConsequenceLine ? null : progressionRead.readiness
  const missingHint: string | null = isSubmitting
    ? null
    : sessionRpe == null
      ? 'Pick effort to finish.'
      : needsIncompleteReason && incompleteReason == null
        ? 'Pick a reason you ended early to finish.'
        : null

  const handleSubmit = async () => {
    if (!log || sessionRpe == null || isSubmitting) return
    const submitNeedsReason =
      isEndedEarly && !SYSTEM_ENDED_REASONS.has(log.endedEarlyReason ?? '')
    if (submitNeedsReason && incompleteReason == null) return

    setSubmitError(null)
    setIsSubmitting(true)
    try {
      if (isPastDeferralCap(log, Date.now())) {
        await expireReview({ executionLogId })
        navigate(routes.complete(executionLogId), { replace: true })
        return
      }
      const aggregate = perDrillCaptures.length > 0 ? aggregateDrillCaptures(perDrillCaptures) : null
      const submitGood = aggregate ? aggregate.goodPasses : showMetrics ? good : 0
      const submitTotal = aggregate ? aggregate.totalAttempts : showMetrics ? total : 0
      const result = await submitReview({
        executionLogId,
        sessionRpe,
        goodPasses: submitGood,
        totalAttempts: submitTotal,
        incompleteReason: submitNeedsReason ? (incompleteReason ?? undefined) : undefined,
        quickTags: quickTags.length > 0 ? quickTags : undefined,
        shortNote: shortNote.trim() || undefined,
        perDrillCaptures: perDrillCaptures.length > 0 ? perDrillCaptures : undefined,
        offeredDelta: offeredDelta ?? undefined,
        verdictChoice: offeredDelta ? verdictChoice : undefined,
      })
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
          throw new Error(`Unhandled submitReview result: ${JSON.stringify(_exhaustive)}`)
        }
      }
    } catch (err) {
      if (isSchemaBlocked()) return
      console.error('Review submit failed:', err)
      setSubmitError('Something went wrong saving your review. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleFinishLater = async () => {
    if (isSubmitting) return
    const meaningful = hasMeaningfulReviewDraftInput({
      sessionRpe,
      goodPasses: good,
      totalAttempts: total,
      quickTags,
      shortNote,
      incompleteReason,
    })
    if (meaningful) {
      try {
        await patchReviewForm(executionLogId, {
          sessionRpe,
          goodPasses: good,
          totalAttempts: total,
          incompleteReason: incompleteReason ?? undefined,
          quickTags: quickTags.length > 0 ? quickTags : undefined,
          shortNote: shortNote.trim() || undefined,
        })
      } catch (err) {
        if (!isSchemaBlocked()) {
          console.error('Review draft save on Finish Later failed:', err)
          setSubmitError("Couldn't save your draft. Please try again or Submit now.")
          return
        }
      }
    }
    navigate(routes.home())
  }

  const handleViewSavedReview = () => {
    navigate(routes.complete(executionLogId), { replace: true })
  }

  return {
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
    verdictLine,
    acceptConsequenceLine,
    progressionReflectionLine,
    progressionReadinessLine,
    verdictChoice,
    setVerdictChoice,
    handleToggleNotCaptured,
    handleSubmit,
    handleFinishLater,
    handleViewSavedReview,
  }
}
