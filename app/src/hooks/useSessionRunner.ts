import { useCallback, useEffect, useRef, useState } from 'react'
import type { ExecutionLog, SessionPlan, SessionPlanBlock } from '../db'
import {
  buildAdvancedBlock,
  buildEndedSession,
  buildPausedExecution,
  buildResumedExecution,
  buildStartedBlock,
  computeActualDurationMinutes,
  loadSession,
  saveExecution,
} from '../services/session'
import { clearTimerState, flushTimerForBlock, readTimerState, recoverTimer } from '../services/timer'

export type SessionRunnerOptions = {
  getAccumulatedElapsed?: () => number
  /**
   * Returns the current effective block duration in seconds (i.e. the value
   * a Shorten action landed on, or the default block duration otherwise).
   * Used by the visibility / beforeunload flush paths so a shortened timer
   * is not silently reverted when the user backgrounds the tab before the
   * 5s interval writes.
   */
  getEffectiveDurationSeconds?: () => number | undefined
}

export function useSessionRunner(
  executionLogId: string,
  options?: SessionRunnerOptions,
) {
  const [execution, setExecution] = useState<ExecutionLog | null>(null)
  const [plan, setPlan] = useState<SessionPlan | null>(null)
  const [loaded, setLoaded] = useState(false)

  const executionRef = useRef<ExecutionLog | null>(null)
  const planRef = useRef<SessionPlan | null>(null)

  useEffect(() => {
    executionRef.current = execution
    planRef.current = plan
  })

  useEffect(() => {
    let cancelled = false
    loadSession(executionLogId).then((result) => {
      if (cancelled) return
      if (!result) {
        setExecution(null)
        setPlan(null)
      } else {
        setExecution(result.execution)
        setPlan(result.plan)
      }
      setLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [executionLogId])

  const currentBlockIndex = execution?.activeBlockIndex ?? 0
  const currentBlock: SessionPlanBlock | null =
    plan?.blocks[currentBlockIndex] ?? null
  const totalBlocks = plan?.blocks.length ?? 0
  const isPaused = execution?.status === 'paused'

  const persist = useCallback(async (updated: ExecutionLog) => {
    await saveExecution(updated)
    setExecution(updated)
  }, [])

  const startBlock = useCallback(async () => {
    const exec = executionRef.current
    const p = planRef.current
    if (!exec || !p) return
    const updated = buildStartedBlock(exec, p)
    if (!updated) return
    await persist(updated)
  }, [persist])

  const pauseBlock = useCallback(
    async (
      accumulatedElapsed: number,
      effectiveDurationSeconds?: number,
    ) => {
      const exec = executionRef.current
      if (!exec) return
      const updated = buildPausedExecution(exec)
      await persist(updated)
      await flushTimerForBlock(
        exec,
        accumulatedElapsed,
        effectiveDurationSeconds,
        'paused',
      )
    },
    [persist],
  )

  const resumeBlock = useCallback(async () => {
    const exec = executionRef.current
    if (!exec) return
    await persist(buildResumedExecution(exec))
  }, [persist])

  const advanceBlock = useCallback(
    async (status: 'completed' | 'skipped'): Promise<boolean> => {
      const exec = executionRef.current
      const p = planRef.current
      if (!exec || !p) return false
      const onLastBlock = exec.activeBlockIndex >= p.blocks.length - 1
      const timer =
        onLastBlock && status === 'skipped'
          ? await readTimerState()
          : undefined
      const { execution: updated, isLast } = buildAdvancedBlock(exec, p, status)
      if (isLast) {
        const partialSeconds =
          timer?.executionLogId === exec.id
            ? timer.accumulatedElapsed
            : undefined
        updated.actualDurationMinutes = computeActualDurationMinutes(updated, p, partialSeconds)
      }
      await persist(updated)
      await clearTimerState()
      return isLast
    },
    [persist],
  )

  const completeBlock = useCallback(
    () => advanceBlock('completed'),
    [advanceBlock],
  )

  const skipBlock = useCallback(
    () => advanceBlock('skipped'),
    [advanceBlock],
  )

  const endSession = useCallback(
    async (reason?: string) => {
      const exec = executionRef.current
      const p = planRef.current
      if (!exec || !p) return
      const timer = await readTimerState()
      const ended = buildEndedSession(exec, reason)
      const ownedElapsed =
        timer?.executionLogId === exec.id ? timer.accumulatedElapsed : undefined
      ended.actualDurationMinutes = computeActualDurationMinutes(
        ended,
        p,
        ownedElapsed,
      )
      await persist(ended)
      await clearTimerState()
    },
    [persist],
  )

  const flushTimer = useCallback(
    async (
      accumulatedElapsed: number,
      effectiveDurationSeconds?: number,
    ) => {
      const exec = executionRef.current
      if (!exec) return
      await flushTimerForBlock(exec, accumulatedElapsed, effectiveDurationSeconds)
    },
    [],
  )

  const recoverTimerState = useCallback(
    async (
      blockDurationSeconds: number,
    ): Promise<{
      remaining: number
      effectiveDurationSeconds: number
    } | null> => {
      const exec = executionRef.current
      if (!exec) return null
      return recoverTimer(
        exec.id,
        exec.activeBlockIndex,
        blockDurationSeconds,
      )
    },
    [],
  )

  const getAccumulatedElapsedRef = useRef(options?.getAccumulatedElapsed)
  const getEffectiveDurationRef = useRef(options?.getEffectiveDurationSeconds)
  useEffect(() => {
    getAccumulatedElapsedRef.current = options?.getAccumulatedElapsed
    getEffectiveDurationRef.current = options?.getEffectiveDurationSeconds
  })

  useEffect(() => {
    const flushFromLifecycle = () => {
      const getElapsed = getAccumulatedElapsedRef.current
      if (!getElapsed) return
      const exec = executionRef.current
      if (!exec) return
      if (exec.status !== 'in_progress' && exec.status !== 'paused') return
      const bs = exec.blockStatuses[exec.activeBlockIndex]
      if (bs?.status !== 'in_progress') return
      // Pass the effective duration so a shortened block is not reverted when
      // the user backgrounds or closes the tab before the 5s interval tick.
      const effectiveDuration = getEffectiveDurationRef.current?.()
      void flushTimer(getElapsed(), effectiveDuration)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flushFromLifecycle()
    }
    const onBeforeUnload = () => flushFromLifecycle()

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [flushTimer])

  return {
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
    endSession,
    flushTimer,
    recoverTimerState,
  }
}
