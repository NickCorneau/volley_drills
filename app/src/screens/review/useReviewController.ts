import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  ExecutionLog,
  IncompleteReason,
  PerDrillCapture as PerDrillCaptureRecord,
  SessionPlan,
} from '../../db'
import {
  aggregateDrillCaptures,
  hasMeaningfulReviewDraftInput,
  inferPlanMainMetricType,
  metricShowsReviewCounts,
} from '../../domain/capture'
import { formatDurationLine, statusLabel } from '../../lib/format'
import { isSchemaBlocked } from '../../lib/schema-blocked'
import { routes } from '../../routes'
import {
  expireReview,
  FINISH_LATER_CAP_MS,
  loadReviewDraft,
  patchReviewDraft,
  submitReview,
} from '../../services/review'
import { loadSession } from '../../services/session'

type LoadedSession =
  | { status: 'loading' }
  | { status: 'ready'; log: ExecutionLog; plan: SessionPlan | null }
  | { status: 'missing' }

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

    // Review owns the form fields. Captures are owned by Drill Check
    // and are intentionally omitted from the patch so a stale Review
    // state never blanks captures persisted by Drill Check (U1).
    void patchReviewDraft(executionLogId, {
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
    perDrillCaptures,
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
  const needsIncompleteReason = isEndedEarly && !wasDiscarded
  const metricType = inferPlanMainMetricType(plan)
  const showMetrics = !wasDiscarded && hasSkillBlocks && metricShowsReviewCounts(metricType)
  const captureAggregate =
    perDrillCaptures.length > 0 ? aggregateDrillCaptures(perDrillCaptures) : null
  const useAggregateSummary = captureAggregate !== null && captureAggregate.drillsTagged > 0
  const showMetricsCard = showMetrics || useAggregateSummary
  const isPairMode = plan?.playerCount === 2
  const rpePrompt = isPairMode ? 'How hard was this session for you?' : 'How hard was your session?'
  const canSubmit = sessionRpe != null && (!needsIncompleteReason || incompleteReason != null)
  const missingHint: string | null = isSubmitting
    ? null
    : sessionRpe == null
      ? 'Rate your effort above to submit.'
      : needsIncompleteReason && incompleteReason == null
        ? 'Pick a reason you ended early to submit.'
        : null

  const handleSubmit = async () => {
    if (!log || sessionRpe == null || isSubmitting) return
    const submitWasDiscarded = isEndedEarly && log.endedEarlyReason === 'discarded_resume'
    const submitNeedsReason = isEndedEarly && !submitWasDiscarded
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
        // Review's Finish Later path mirrors the autosave: only the
        // form fields it owns are patched. Drill Check's captures
        // already live on the row and must not be overwritten by a
        // stale local snapshot (U1).
        await patchReviewDraft(executionLogId, {
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
    handleToggleNotCaptured,
    handleSubmit,
    handleFinishLater,
    handleViewSavedReview,
  }
}
