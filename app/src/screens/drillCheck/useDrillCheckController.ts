import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  DifficultyTag,
  PerDrillCapture as PerDrillCaptureRecord,
} from '../../db'
import {
  mergePerDrillCaptures,
  resolveDrillCheckCaptureEligibility,
} from '../../domain/drillCheckCapture'
import { useSessionRunner } from '../../hooks/useSessionRunner'
import { isSchemaBlocked } from '../../lib/schema-blocked'
import { routes } from '../../routes'
import { loadReviewDraft, patchReviewDraft } from '../../services/review'

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
  const showCaptureCounts = captureEligibility.status === 'eligible_counts'
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
  useEffect(() => {
    if (!hydrated) return
    if (!captureTarget) {
      setDifficulty(null)
      setCaptureGood(0)
      setCaptureTotal(0)
      setCaptureNotCaptured(false)
      return
    }
    const existing = captures.find((c) => c.blockIndex === prevBlockIdx)
    if (existing) {
      setDifficulty(existing.difficulty)
      setCaptureGood(existing.goodPasses ?? 0)
      setCaptureTotal(existing.attemptCount ?? 0)
      setCaptureNotCaptured(existing.notCaptured === true)
    } else {
      setDifficulty(null)
      setCaptureGood(0)
      setCaptureTotal(0)
      setCaptureNotCaptured(false)
    }
    // `captures` deliberately omitted: the merge effect below feeds back
    // into `captures`; including it here would re-clobber the user's edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, captureTarget, prevBlockIdx])

  const buildCurrentCapture = useCallback((): PerDrillCaptureRecord | null => {
    if (!captureTarget) return null
    if (difficulty == null) return null
    if (!captureTarget.drillId || !captureTarget.variantId) return null
    return {
      drillId: captureTarget.drillId,
      variantId: captureTarget.variantId,
      blockIndex: prevBlockIdx,
      difficulty,
      capturedAt: Date.now(),
      ...(captureNotCaptured
        ? { notCaptured: true }
        : showCaptureCounts && (captureGood > 0 || captureTotal > 0)
          ? {
              goodPasses: captureGood,
              attemptCount: captureTotal,
            }
          : {}),
    }
  }, [
    captureGood,
    captureNotCaptured,
    captureTarget,
    captureTotal,
    difficulty,
    prevBlockIdx,
    showCaptureCounts,
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
    if (navigator.vibrate) navigator.vibrate(50)
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
    showCaptureCounts,
    captureSuccessRule,
    difficulty,
    setDifficulty,
    captureGood,
    setCaptureGood,
    captureTotal,
    setCaptureTotal,
    captureNotCaptured,
    captureSaveError,
    hydrated,
    captureSatisfied,
    handleContinue,
    toggleNotCaptured,
  }
}
