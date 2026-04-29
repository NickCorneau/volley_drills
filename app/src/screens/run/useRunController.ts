import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postBlockRoute, scaleSegmentsForBlockDuration } from '../../domain/runFlow'
import { findSwapAlternatives } from '../../domain/sessionBuilder'
import { useBlockPacingTicks } from '../../hooks/useBlockPacingTicks'
import { usePreroll } from '../../hooks/usePreroll'
import { useSessionRunner } from '../../hooks/useSessionRunner'
import { useTimer } from '../../hooks/useTimer'
import { computeShortened } from '../../lib/shorten'
import { isSchemaBlocked } from '../../lib/schema-blocked'
import {
  playBlockEndBeep,
  playPrerollTick,
  playSubBlockTick,
  useWakeLock,
  vibrate,
} from '../../platform'
import { routes } from '../../routes'
import { getStorageMeta, setStorageMeta } from '../../services/storageMeta'

export function useRunController(executionLogId: string, shortened: boolean) {
  const navigate = useNavigate()
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [prerollHintDismissed, setPrerollHintDismissed] = useState<boolean | null>(null)
  const blockDurRef = useRef(0)
  const remainingRef = useRef(0)
  const pendingEndSessionPauseRef = useRef<Promise<void> | null>(null)

  const runner = useSessionRunner(executionLogId, {
    getAccumulatedElapsed: useCallback(() => {
      return Math.max(0, blockDurRef.current - remainingRef.current)
    }, []),
    getEffectiveDurationSeconds: useCallback(() => {
      return blockDurRef.current > 0 ? blockDurRef.current : undefined
    }, []),
  })
  const {
    plan,
    execution,
    loaded,
    currentBlock,
    currentBlockIndex,
    totalBlocks,
    isPaused,
    startBlock,
    pauseBlock,
    resumeBlock,
    completeBlock,
    skipBlock,
    swapBlock,
    endSession,
    flushTimer,
    recoverTimerState,
  } = runner

  const defaultDuration = currentBlock ? currentBlock.durationMinutes * (shortened ? 30 : 60) : 0
  const [activeDuration, setActiveDuration] = useState(defaultDuration)
  const [prevBlockId, setPrevBlockId] = useState<string | null>(currentBlock?.id ?? null)

  if (currentBlock && currentBlock.id !== prevBlockId) {
    setActiveDuration(defaultDuration)
    setPrevBlockId(currentBlock.id)
  }

  useEffect(() => {
    blockDurRef.current = activeDuration
  }, [activeDuration])

  const [runError, setRunError] = useState<string | null>(null)

  const handleRunPersistenceError = useCallback((message: string, err: unknown) => {
    if (isSchemaBlocked()) return
    console.error(message, err)
    setRunError('Something went wrong. Try again or end session.')
  }, [])

  const handleBlockComplete = useCallback(async () => {
    try {
      playBlockEndBeep()
      vibrate([100, 50, 100])
      const isLast = await completeBlock()
      const next = postBlockRoute(executionLogId, isLast)
      navigate(next.path, { replace: next.replace })
    } catch (err) {
      console.error('Block complete failed:', err)
      setRunError('Something went wrong. Try again or end session.')
    }
  }, [completeBlock, navigate, executionLogId])

  const timer = useTimer(activeDuration, handleBlockComplete)
  const {
    isLocked: isWakeLocked,
    request: requestWakeLock,
    release: releaseWakeLock,
  } = useWakeLock()

  useEffect(() => {
    remainingRef.current = timer.remainingSeconds
  })

  const handlePrerollComplete = useCallback(() => {
    setPrerollHintDismissed(true)
    void setStorageMeta('ux.prerollHintDismissed', true).catch((err) => {
      if (isSchemaBlocked()) return
      console.error('prerollHintDismissed write failed:', err)
    })
    startBlock()
      .then(() => {
        timer.start(activeDuration)
        requestWakeLock()
      })
      .catch((err: unknown) => {
        if (isSchemaBlocked()) return
        console.error('Failed to start block:', err)
        navigate(routes.home(), { replace: true })
      })
    vibrate(100)
  }, [startBlock, timer, activeDuration, requestWakeLock, navigate])

  const preroll = usePreroll({
    onTick: playPrerollTick,
    onComplete: handlePrerollComplete,
  })
  const prerollCount = preroll.count
  const startWithPreroll = preroll.start
  const activeBlockStatus = execution?.blockStatuses[execution.activeBlockIndex]?.status

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const dismissed = await getStorageMeta(
          'ux.prerollHintDismissed',
          (v): v is boolean => typeof v === 'boolean',
        )
        if (cancelled) return
        setPrerollHintDismissed((prev) => (prev === true ? true : dismissed === true))
      } catch (err) {
        if (cancelled) return
        if (isSchemaBlocked()) return
        console.error('prerollHintDismissed read failed:', err)
        setPrerollHintDismissed((prev) => (prev === true ? true : null))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const initRef = useRef(false)
  useEffect(() => {
    if (!execution || !currentBlock || initRef.current) return
    const bs = execution.blockStatuses[execution.activeBlockIndex]
    if (!bs) return

    initRef.current = true

    if (bs.status === 'in_progress') {
      recoverTimerState(defaultDuration)
        .then((recovered) => {
          if (recovered) {
            setActiveDuration(recovered.effectiveDurationSeconds)
            blockDurRef.current = recovered.effectiveDurationSeconds
            if (execution.status === 'paused') {
              timer.reset(recovered.remaining)
            } else {
              timer.start(recovered.remaining)
              requestWakeLock()
            }
          } else if (execution.status === 'paused') {
            timer.reset(defaultDuration)
          } else {
            timer.start(defaultDuration)
            requestWakeLock()
          }
        })
        .catch((err: unknown) => {
          console.error('Failed to recover timer:', err)
          if (execution.status === 'paused') {
            timer.reset(defaultDuration)
          } else {
            timer.start(defaultDuration)
            requestWakeLock()
          }
        })
    } else if (bs.status === 'planned' || execution.status === 'not_started') {
      queueMicrotask(startWithPreroll)
    }
  }, [
    execution,
    currentBlock,
    defaultDuration,
    recoverTimerState,
    timer,
    requestWakeLock,
    startWithPreroll,
  ])

  useEffect(() => {
    if (!timer.isRunning || !currentBlock) return
    const interval = setInterval(() => {
      const elapsed = activeDuration - remainingRef.current
      flushTimer(elapsed, activeDuration)
    }, 5000)
    return () => clearInterval(interval)
  }, [timer.isRunning, activeDuration, currentBlock, flushTimer])

  // 2026-04-28 (`docs/plans/2026-04-28-per-move-pacing-indicator.md` U7):
  // segment-driven pacing for warmup / cooldown drills with composed
  // moves. The pacing hook owns the math via `computeSegmentState`;
  // the controller exposes the active index so RunScreen can render
  // the highlighted row.
  //
  // Always default to `0` so that on the first render after
  // `currentBlock` loads, RunScreen's `<SegmentList>` shows segment
  // 1 highlighted (matching the design spec's "Now through preroll"
  // resolution from OQ-P3). For non-segmented blocks the value is
  // ignored (RunScreen renders the prose path instead). On block-id
  // change the effect resets back to `0`; the pacing hook then
  // advances it via `onSegmentIndexChange` as boundaries elapse.
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0)
  useEffect(() => {
    setCurrentSegmentIndex(0)
  }, [currentBlock?.id])

  // 2026-04-28 dogfeed iteration: when the user shortens a warmup or
  // cooldown (Transition `Shorten block` → `shortened: true` state, or
  // mid-block Pause + Shorten → `computeShortened` halves activeDuration),
  // the authored segment durations no longer fit the block. Scale them
  // down proportionally so the indicator advances through ALL moves
  // (preserving warmup component coverage / cooldown stretch coverage)
  // at proportionally shorter timing. When the block is longer than
  // the segment sum (e.g., d26 wrap on a 4-min slot), segments stay
  // unchanged so the bonus paragraph still surfaces in overflow
  // territory. See `scaleSegmentsForBlockDuration` JSDoc.
  const effectiveSegments = useMemo(() => {
    if (!currentBlock?.segments?.length) return undefined
    if (activeDuration <= 0) return currentBlock.segments
    return scaleSegmentsForBlockDuration(currentBlock.segments, activeDuration)
  }, [currentBlock?.segments, activeDuration])

  useBlockPacingTicks({
    running: timer.isRunning,
    blockId: currentBlock?.id ?? null,
    subBlockIntervalSeconds: currentBlock?.subBlockIntervalSeconds,
    segments: effectiveSegments,
    remainingRef,
    blockDurRef,
    onEndCountdownTick: playPrerollTick,
    onSubBlockTick: playSubBlockTick,
    // End-of-segment beep reuses the existing sub-block tick sound
    // per U7's design decision (identical timbre keeps audio voice
    // consistent between drills with and without authored segments).
    onSegmentEndTick: playSubBlockTick,
    onSegmentIndexChange: setCurrentSegmentIndex,
  })

  useEffect(() => {
    if (!loaded) return
    const shouldHoldWakeLock =
      timer.isRunning || prerollCount != null || activeBlockStatus === 'planned'
    if (shouldHoldWakeLock) {
      requestWakeLock()
    } else {
      releaseWakeLock()
    }
  }, [loaded, timer.isRunning, prerollCount, activeBlockStatus, requestWakeLock, releaseWakeLock])

  const handlePause = useCallback(() => {
    timer.pause()
    const elapsed = activeDuration - remainingRef.current
    void pauseBlock(elapsed, activeDuration).catch((err: unknown) => {
      timer.resume()
      handleRunPersistenceError('Pause block failed:', err)
    })
  }, [timer, pauseBlock, activeDuration, handleRunPersistenceError])

  const handleResume = useCallback(() => {
    timer.resume()
    void resumeBlock().catch((err: unknown) => {
      timer.pause()
      handleRunPersistenceError('Resume block failed:', err)
    })
  }, [timer, resumeBlock, handleRunPersistenceError])

  const handleNext = useCallback(async () => {
    try {
      timer.pause()
      playBlockEndBeep()
      vibrate(100)
      const isLast = await completeBlock()
      const next = postBlockRoute(executionLogId, isLast)
      navigate(next.path, { replace: next.replace })
    } catch (err) {
      console.error('Next block failed:', err)
      setRunError('Something went wrong. Try again or end session.')
    }
  }, [timer, completeBlock, navigate, executionLogId])

  const handleSkip = useCallback(async () => {
    try {
      timer.pause()
      playBlockEndBeep()
      vibrate(100)
      const isLast = await skipBlock()
      const next = postBlockRoute(executionLogId, isLast)
      navigate(next.path, { replace: next.replace })
    } catch (err) {
      console.error('Skip block failed:', err)
      setRunError('Something went wrong. Try again or end session.')
    }
  }, [timer, skipBlock, navigate, executionLogId])

  const handleShorten = useCallback(() => {
    const { newRemainingSeconds, newDurationSeconds } = computeShortened(
      activeDuration,
      remainingRef.current,
    )
    setActiveDuration(newDurationSeconds)
    timer.reset(newRemainingSeconds)
  }, [timer, activeDuration])

  const handleSwap = useCallback(async () => {
    try {
      if (timer.isRunning) {
        timer.pause()
        const elapsed = activeDuration - remainingRef.current
        await pauseBlock(elapsed, activeDuration)
      }
      const ok = await swapBlock()
      if (!ok) {
        setRunError('No alternate drills available for this block.')
      }
    } catch (err) {
      console.error('Swap failed:', err)
      setRunError('Something went wrong. Try again or end session.')
    }
  }, [timer, pauseBlock, swapBlock, activeDuration])

  const [wasRunning, setWasRunning] = useState(false)

  const handleEndSessionRequest = useCallback(() => {
    if (timer.isRunning) {
      setWasRunning(true)
      timer.pause()
      const pendingPause = pauseBlock(activeDuration - remainingRef.current, activeDuration).catch(
        (err: unknown) => {
          timer.resume()
          handleRunPersistenceError('End-session pause failed:', err)
        },
      )
      const trackedPause = pendingPause.finally(() => {
        if (pendingEndSessionPauseRef.current === trackedPause) {
          pendingEndSessionPauseRef.current = null
        }
      })
      pendingEndSessionPauseRef.current = trackedPause
    } else {
      setWasRunning(false)
    }
    setShowEndConfirm(true)
  }, [timer, pauseBlock, activeDuration, handleRunPersistenceError])

  const handleEndSessionConfirm = useCallback(async () => {
    try {
      await pendingEndSessionPauseRef.current
      await endSession()
      navigate(routes.review(executionLogId), { replace: true })
    } catch (err) {
      console.error('End session failed:', err)
      setRunError('Something went wrong ending the session. Try again.')
    }
  }, [endSession, navigate, executionLogId])

  const handleEndSessionCancel = useCallback(async () => {
    if (wasRunning) {
      try {
        await pendingEndSessionPauseRef.current
      } finally {
        setShowEndConfirm(false)
      }
      timer.resume()
      void resumeBlock().catch((err: unknown) => {
        timer.pause()
        handleRunPersistenceError('End-session resume failed:', err)
      })
    } else {
      setShowEndConfirm(false)
    }
  }, [wasRunning, timer, resumeBlock, handleRunPersistenceError])

  useEffect(() => {
    if (!executionLogId) return
    if (execution && plan === null) {
      navigate(routes.home(), { replace: true })
      return
    }
    if (execution && (execution.status === 'completed' || execution.status === 'ended_early')) {
      navigate(routes.review(executionLogId), { replace: true })
    }
  }, [executionLogId, execution, plan, navigate])

  const planContext = plan?.context
  const hasAlternates = useMemo(
    () =>
      planContext && currentBlock
        ? findSwapAlternatives(currentBlock, planContext).length > 0
        : false,
    [currentBlock, planContext],
  )

  return {
    plan,
    execution,
    loaded,
    currentBlock,
    currentBlockIndex,
    totalBlocks,
    isPaused,
    activeDuration,
    timer,
    runError,
    prerollCount,
    prerollHintDismissed,
    showEndConfirm,
    isWakeLocked,
    hasAlternates,
    currentSegmentIndex,
    effectiveSegments,
    handlePause,
    handleResume,
    handleNext,
    handleSkip,
    handleShorten,
    handleSwap,
    handleEndSessionRequest,
    handleEndSessionConfirm,
    handleEndSessionCancel,
  }
}
