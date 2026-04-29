import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  DifficultyTag,
  PerDrillCapture as PerDrillCaptureRecord,
} from '../../model'
import {
  buildPerDrillCaptureRecord,
  type CaptureShape,
  mergePerDrillCaptures,
  resolveDrillCheckCaptureEligibility,
} from '../../domain/capture'
import { useSessionRunner } from '../../hooks/useSessionRunner'
import { isSchemaBlocked } from '../../lib/schema-blocked'
import { vibrate } from '../../platform'
import { routes } from '../../routes'
import { loadReviewDraft, patchReviewDraft } from '../../services/review'

const SHAPE_NONE: CaptureShape = { kind: 'none' }

export function useDrillCheckController(executionLogId: string) {
  const navigate = useNavigate()
  const pendingCaptureSave = useRef<Promise<boolean> | null>(null)

  const runner = useSessionRunner(executionLogId)
  const { plan, execution, loaded, currentBlockIndex, totalBlocks } = runner

  const prevBlockIdx = currentBlockIndex - 1

  const captureEligibility = useMemo(
    () =>
      resolveDrillCheckCaptureEligibility({
        plan,
        execution,
        currentBlockIndex,
      }),
    [plan, execution, currentBlockIndex],
  )

  const captureTarget =
    captureEligibility.status === 'eligible_counts' ||
    captureEligibility.status === 'eligible_difficulty_only'
      ? captureEligibility.block
      : null

  /**
   * D134 (2026-04-28): the controller exposes the per-block
   * `CaptureShape` so the screen can pass the discriminator straight
   * through to `PerDrillCapture` without duplicating the registry
   * lookup. The shape resolves to:
   *
   *   - `'count'` when the resolver returned `eligible_counts`
   *   - whatever `optionalCaptureShape` the resolver attached to
   *     `eligible_difficulty_only` (currently `'streak'` or `'none'`)
   *   - `'none'` on bypass (the screen does not render
   *     `PerDrillCapture` in that branch, but we keep the value
   *     defined so callers can pattern-match exhaustively)
   */
  const captureShape: CaptureShape = useMemo(() => {
    if (captureEligibility.status === 'eligible_counts') return { kind: 'count' }
    if (captureEligibility.status === 'eligible_difficulty_only') {
      return captureEligibility.optionalCaptureShape
    }
    return SHAPE_NONE
  }, [captureEligibility])

  const captureSuccessRule =
    captureEligibility.status === 'eligible_counts' ||
    captureEligibility.status === 'eligible_difficulty_only'
      ? captureEligibility.successRule
      : null

  const [captures, setCaptures] = useState<PerDrillCaptureRecord[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [difficulty, setDifficulty] = useState<DifficultyTag | null>(null)
  const [captureGood, setCaptureGood] = useState(0)
  const [captureTotal, setCaptureTotal] = useState(0)
  const [captureNotCaptured, setCaptureNotCaptured] = useState(false)
  // D134 (2026-04-28): Phase 2A streak local state. `null` = blank /
  // not committed; an integer in `[0, 99]` = a validated streak the
  // builder will encode as `metricCapture: { kind: 'streak', longest }`.
  const [captureStreakLongest, setCaptureStreakLongest] = useState<number | null>(null)
  const [captureSaveError, setCaptureSaveError] = useState<string | null>(null)

  // Rehydrate the full capture list before the UI can accept taps. A slow
  // draft read must not clobber the first difficulty chip a tester selects.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const draft = await loadReviewDraft(executionLogId)
        if (cancelled) return
        setCaptures(draft?.perDrillCaptures ?? [])
        setHydrated(true)
      } catch (err) {
        if (cancelled) return
        if (isSchemaBlocked()) {
          setHydrated(true)
          return
        }
        console.error('DrillCheck draft load failed:', err)
        setHydrated(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [executionLogId])

  // Mirror the persisted row for the just-finished block into the local
  // inputs. Do not depend on `captures`; the immediate-save effect below
  // writes back into that list while the user is editing.
  //
  // D134 (2026-04-28): a rehydrated row may carry either flat count
  // fields (legacy v5 / Phase 1 count drill) or a `metricCapture`
  // discriminator (Phase 2A streak). The two branches do not overlap
  // by construction (`PerDrillCapture` union); we read each into its
  // own local state slot so the rehydrated value flows back into the
  // right drawer.
  useEffect(() => {
    if (!hydrated) return
    if (!captureTarget) {
      setDifficulty(null)
      setCaptureGood(0)
      setCaptureTotal(0)
      setCaptureNotCaptured(false)
      setCaptureStreakLongest(null)
      return
    }
    const existing = captures.find((c) => c.blockIndex === prevBlockIdx)
    if (existing) {
      setDifficulty(existing.difficulty)
      setCaptureGood(existing.goodPasses ?? 0)
      setCaptureTotal(existing.attemptCount ?? 0)
      setCaptureNotCaptured(existing.notCaptured === true)
      setCaptureStreakLongest(
        existing.metricCapture?.kind === 'streak' ? existing.metricCapture.longest : null,
      )
    } else {
      setDifficulty(null)
      setCaptureGood(0)
      setCaptureTotal(0)
      setCaptureNotCaptured(false)
      setCaptureStreakLongest(null)
    }
    // `captures` deliberately omitted: the merge effect below feeds back
    // into `captures`; including it here would re-clobber the user's edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, captureTarget, prevBlockIdx])

  /**
   * Build the row the merge effect / Continue handler will persist.
   * Goes through the pure-domain `buildPerDrillCaptureRecord` builder
   * so the row union's mutual-exclusion guarantees are enforced at
   * the boundary — controllers do not hand-assemble rows.
   *
   * Branch order:
   *
   *   1. `notCaptured` is the explicit "tagged but skipped optional
   *      data" choice from the count branch. Highest priority because
   *      the user opted out of optional data on purpose.
   *   2. Count branch with non-zero values → count row. Unchanged
   *      pre-D134 behavior.
   *   3. Streak branch with a non-null validated value → streak row.
   *   4. Otherwise → difficulty-only row.
   */
  const buildCurrentCapture = useCallback((): PerDrillCaptureRecord | null => {
    if (!captureTarget) return null
    if (difficulty == null) return null
    if (!captureTarget.drillId || !captureTarget.variantId) return null

    const identity = {
      drillId: captureTarget.drillId,
      variantId: captureTarget.variantId,
      blockIndex: prevBlockIdx,
      difficulty,
      capturedAt: Date.now(),
    }

    if (captureNotCaptured) {
      return buildPerDrillCaptureRecord({ ...identity, kind: 'not_captured' })
    }
    if (captureShape.kind === 'count' && (captureGood > 0 || captureTotal > 0)) {
      return buildPerDrillCaptureRecord({
        ...identity,
        kind: 'count',
        goodPasses: captureGood,
        attemptCount: captureTotal,
      })
    }
    if (captureShape.kind === 'streak' && captureStreakLongest !== null) {
      return buildPerDrillCaptureRecord({
        ...identity,
        kind: 'streak',
        streakLongest: captureStreakLongest,
      })
    }
    return buildPerDrillCaptureRecord({ ...identity, kind: 'difficulty_only' })
  }, [
    captureGood,
    captureNotCaptured,
    captureShape,
    captureStreakLongest,
    captureTarget,
    captureTotal,
    difficulty,
    prevBlockIdx,
  ])

  const persistMergedCaptures = useCallback(
    (merged: PerDrillCaptureRecord[]): Promise<boolean> => {
      // Drill Check only owns `perDrillCaptures`. Patching just that
      // key preserves any RPE / note / quickTags / incompleteReason
      // the user typed on Review (U1 of the architecture pass).
      const pending = patchReviewDraft(executionLogId, {
        perDrillCaptures: merged,
      })
        .then(() => {
          setCaptureSaveError(null)
          return true
        })
        .catch((err) => {
          if (!isSchemaBlocked()) {
            console.error('DrillCheck draft save failed:', err)
            setCaptureSaveError('Could not save this drill check. Try again.')
          }
          return false
        })

      pendingCaptureSave.current = pending
      void pending.then(() => {
        if (pendingCaptureSave.current === pending) {
          pendingCaptureSave.current = null
        }
      })
      return pending
    },
    [executionLogId],
  )

  const flushCurrentCapture = useCallback(async (): Promise<boolean> => {
    const next = buildCurrentCapture()
    if (!next) return false
    const merged = mergePerDrillCaptures(captures, next)
    setCaptures(merged)
    return persistMergedCaptures(merged)
  }, [buildCurrentCapture, captures, persistMergedCaptures])

  // Persist every meaningful capture edit immediately; Continue also flushes
  // and waits for any pending write so route-forward cannot drop the row.
  useEffect(() => {
    if (!hydrated) return
    const next = buildCurrentCapture()
    if (!next) return
    setCaptures((prev) => {
      const merged = mergePerDrillCaptures(prev, next)
      void persistMergedCaptures(merged)
      return merged
    })
  }, [hydrated, buildCurrentCapture, persistMergedCaptures])

  // Bypass ineligible blocks with replace-routing so the user never sees an
  // empty Drill Check body and browser back returns to Run, not the bypass.
  useEffect(() => {
    if (!loaded) return
    if (!plan || !execution) return
    if (
      captureEligibility.status === 'bypass' &&
      captureEligibility.reason === 'session_complete'
    ) {
      navigate(routes.review(executionLogId), { replace: true })
      return
    }
    if (!captureTarget) {
      navigate(routes.transition(executionLogId), { replace: true })
    }
  }, [
    loaded,
    plan,
    execution,
    captureTarget,
    captureEligibility,
    executionLogId,
    navigate,
  ])

  const captureSatisfied = difficulty !== null

  const handleContinue = useCallback(async () => {
    if (!captureSatisfied) return
    const pending = pendingCaptureSave.current
    if (pending) {
      const saved = await pending
      if (!saved) return
    }
    const saved = await flushCurrentCapture()
    if (!saved) return
    vibrate(50)
    navigate(routes.transition(executionLogId))
  }, [captureSatisfied, executionLogId, flushCurrentCapture, navigate])

  const toggleNotCaptured = useCallback(() => {
    setCaptureNotCaptured((prev) => {
      const next = !prev
      if (next) {
        setCaptureGood(0)
        setCaptureTotal(0)
      }
      return next
    })
  }, [])

  return {
    plan,
    execution,
    loaded,
    totalBlocks,
    prevBlockIdx,
    captureTarget,
    captureShape,
    captureSuccessRule,
    difficulty,
    setDifficulty,
    captureGood,
    setCaptureGood,
    captureTotal,
    setCaptureTotal,
    captureNotCaptured,
    captureStreakLongest,
    setCaptureStreakLongest,
    captureSaveError,
    hydrated,
    captureSatisfied,
    handleContinue,
    toggleNotCaptured,
  }
}
