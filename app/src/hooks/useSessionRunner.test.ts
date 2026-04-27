import { renderHook, act, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import type { ExecutionLog, SessionPlan, SessionPlanBlock } from '../db'

vi.mock('../services/session', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/session')>()
  return {
    loadSession: vi.fn(),
    buildStartedBlock: vi.fn(),
    buildPausedExecution: vi.fn(),
    buildResumedExecution: vi.fn(),
    buildAdvancedBlock: vi.fn(),
    buildEndedSession: vi.fn(),
    saveExecution: vi.fn(),
    computeActualDurationMinutes: actual.computeActualDurationMinutes,
  }
})

vi.mock('../services/timer', () => ({
  clearTimerState: vi.fn(),
  flushTimerForBlock: vi.fn(),
  readTimerState: vi.fn(),
  recoverTimer: vi.fn(),
}))

import { useSessionRunner } from './useSessionRunner'
import * as sessionService from '../services/session'
import * as timerService from '../services/timer'

const BLOCK: SessionPlanBlock = {
  id: 'block-1',
  type: 'warmup',
  drillName: 'Wrist Rolls',
  shortName: 'Wrist',
  durationMinutes: 3,
  coachingCue: 'Loose wrists',
  courtsideInstructions: '',
  required: true,
}

const BLOCK_2: SessionPlanBlock = {
  id: 'block-2',
  type: 'main_skill',
  drillName: 'Forearm Pass',
  shortName: 'FP',
  durationMinutes: 8,
  coachingCue: 'Platform angle',
  courtsideInstructions: '',
  required: true,
}

function makePlan(blocks: SessionPlanBlock[] = [BLOCK, BLOCK_2]): SessionPlan {
  return {
    id: 'plan-1',
    presetId: 'preset-1',
    presetName: 'Test Preset',
    playerCount: 1,
    blocks,
    safetyCheck: {
      painFlag: false,
      heatCta: false,
      painOverridden: false,
    },
    createdAt: Date.now(),
  }
}

function makeExec(overrides?: Partial<ExecutionLog>): ExecutionLog {
  return {
    id: 'exec-1',
    planId: 'plan-1',
    status: 'not_started',
    activeBlockIndex: 0,
    blockStatuses: [
      { blockId: 'block-1', status: 'planned' },
      { blockId: 'block-2', status: 'planned' },
    ],
    startedAt: Date.now(),
    ...overrides,
  }
}

const plan = makePlan()
const exec = makeExec()

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(sessionService.loadSession).mockResolvedValue({ execution: exec, plan })
  vi.mocked(sessionService.saveExecution).mockResolvedValue(undefined)
  vi.mocked(timerService.clearTimerState).mockResolvedValue(undefined)
  vi.mocked(timerService.flushTimerForBlock).mockResolvedValue(undefined)
  vi.mocked(timerService.readTimerState).mockResolvedValue(undefined)
  vi.mocked(timerService.recoverTimer).mockResolvedValue(null)
})

describe('useSessionRunner', () => {
  it('loads session on mount and exposes plan/execution', async () => {
    const { result } = renderHook(() => useSessionRunner('exec-1'))

    await waitFor(() => expect(result.current.loaded).toBe(true))

    expect(result.current.plan).toEqual(plan)
    expect(result.current.execution).toEqual(exec)
    expect(result.current.currentBlockIndex).toBe(0)
    expect(result.current.currentBlock).toEqual(BLOCK)
    expect(result.current.totalBlocks).toBe(2)
    expect(result.current.isPaused).toBe(false)
  })

  it('sets loaded=true with null data when session not found', async () => {
    vi.mocked(sessionService.loadSession).mockResolvedValue(null)

    const { result } = renderHook(() => useSessionRunner('missing'))

    await waitFor(() => expect(result.current.loaded).toBe(true))

    expect(result.current.plan).toBeNull()
    expect(result.current.execution).toBeNull()
  })

  it('sets loaded=true with null data when session load rejects', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(sessionService.loadSession).mockRejectedValue(new Error('dexie read failed'))

    const { result } = renderHook(() => useSessionRunner('exec-error'))

    await waitFor(() => expect(result.current.loaded).toBe(true))

    expect(result.current.plan).toBeNull()
    expect(result.current.execution).toBeNull()
  })

  it('startBlock calls buildStartedBlock + saveExecution', async () => {
    const started = makeExec({
      status: 'in_progress',
      blockStatuses: [
        { blockId: 'block-1', status: 'in_progress', startedAt: Date.now() },
        { blockId: 'block-2', status: 'planned' },
      ],
    })
    vi.mocked(sessionService.buildStartedBlock).mockReturnValue(started)

    const { result } = renderHook(() => useSessionRunner('exec-1'))
    await waitFor(() => expect(result.current.loaded).toBe(true))

    await act(async () => {
      await result.current.startBlock()
    })

    expect(sessionService.buildStartedBlock).toHaveBeenCalledWith(exec, plan)
    expect(sessionService.saveExecution).toHaveBeenCalledWith(started)
    expect(result.current.execution).toEqual(started)
  })

  it('pauseBlock calls buildPausedExecution + flushTimerForBlock', async () => {
    const inProgressExec = makeExec({ status: 'in_progress' })
    vi.mocked(sessionService.loadSession).mockResolvedValue({
      execution: inProgressExec,
      plan,
    })
    const paused = makeExec({ status: 'paused', pausedAt: Date.now() })
    vi.mocked(sessionService.buildPausedExecution).mockReturnValue(paused)

    const { result } = renderHook(() => useSessionRunner('exec-1'))
    await waitFor(() => expect(result.current.loaded).toBe(true))

    await act(async () => {
      await result.current.pauseBlock(15, 180)
    })

    expect(sessionService.buildPausedExecution).toHaveBeenCalledWith(inProgressExec)
    expect(sessionService.saveExecution).toHaveBeenCalledWith(paused)
    expect(timerService.flushTimerForBlock).toHaveBeenCalledWith(inProgressExec, 15, 180, 'paused')
  })

  it('resumeBlock calls buildResumedExecution + saveExecution', async () => {
    const pausedExec = makeExec({ status: 'paused', pausedAt: Date.now() })
    vi.mocked(sessionService.loadSession).mockResolvedValue({
      execution: pausedExec,
      plan,
    })
    const resumed = makeExec({ status: 'in_progress' })
    vi.mocked(sessionService.buildResumedExecution).mockReturnValue(resumed)

    const { result } = renderHook(() => useSessionRunner('exec-1'))
    await waitFor(() => expect(result.current.loaded).toBe(true))

    await act(async () => {
      await result.current.resumeBlock()
    })

    expect(sessionService.buildResumedExecution).toHaveBeenCalledWith(pausedExec)
    expect(sessionService.saveExecution).toHaveBeenCalledWith(resumed)
  })

  it('completeBlock advances block and clears timer; returns isLast', async () => {
    const advanced = makeExec({
      activeBlockIndex: 1,
      blockStatuses: [
        { blockId: 'block-1', status: 'completed', completedAt: Date.now() },
        { blockId: 'block-2', status: 'planned' },
      ],
    })
    vi.mocked(sessionService.buildAdvancedBlock).mockReturnValue({
      execution: advanced,
      isLast: false,
    })

    const { result } = renderHook(() => useSessionRunner('exec-1'))
    await waitFor(() => expect(result.current.loaded).toBe(true))

    let isLast: boolean | undefined
    await act(async () => {
      isLast = await result.current.completeBlock()
    })

    expect(isLast).toBe(false)
    expect(sessionService.buildAdvancedBlock).toHaveBeenCalledWith(exec, plan, 'completed')
    expect(timerService.clearTimerState).toHaveBeenCalled()
    expect(result.current.currentBlockIndex).toBe(1)
  })

  it('skipBlock marks block skipped; returns isLast=true when final', async () => {
    const skipped = makeExec({
      status: 'completed',
      activeBlockIndex: 2,
      blockStatuses: [
        { blockId: 'block-1', status: 'completed', completedAt: Date.now() },
        { blockId: 'block-2', status: 'skipped', completedAt: Date.now() },
      ],
      completedAt: Date.now(),
    })
    vi.mocked(sessionService.buildAdvancedBlock).mockReturnValue({
      execution: skipped,
      isLast: true,
    })

    const { result } = renderHook(() => useSessionRunner('exec-1'))
    await waitFor(() => expect(result.current.loaded).toBe(true))

    let isLast: boolean | undefined
    await act(async () => {
      isLast = await result.current.skipBlock()
    })

    expect(isLast).toBe(true)
    expect(sessionService.buildAdvancedBlock).toHaveBeenCalledWith(exec, plan, 'skipped')
    expect(timerService.clearTimerState).toHaveBeenCalled()
  })

  it('endSession builds ended state + clears timer', async () => {
    const ended = makeExec({
      status: 'ended_early',
      completedAt: Date.now(),
      endedEarlyReason: 'user_quit',
    })
    vi.mocked(sessionService.buildEndedSession).mockReturnValue(ended)

    const { result } = renderHook(() => useSessionRunner('exec-1'))
    await waitFor(() => expect(result.current.loaded).toBe(true))

    await act(async () => {
      await result.current.endSession('user_quit')
    })

    expect(sessionService.buildEndedSession).toHaveBeenCalledWith(exec, 'user_quit')
    expect(sessionService.saveExecution).toHaveBeenCalledWith(ended)
    expect(timerService.clearTimerState).toHaveBeenCalled()
    expect(result.current.execution).toEqual(ended)
  })

  it('isPaused reflects execution status', async () => {
    const pausedExec = makeExec({ status: 'paused', pausedAt: Date.now() })
    vi.mocked(sessionService.loadSession).mockResolvedValue({
      execution: pausedExec,
      plan,
    })

    const { result } = renderHook(() => useSessionRunner('exec-1'))
    await waitFor(() => expect(result.current.loaded).toBe(true))

    expect(result.current.isPaused).toBe(true)
  })

  it('flushTimer delegates to flushTimerForBlock', async () => {
    const { result } = renderHook(() => useSessionRunner('exec-1'))
    await waitFor(() => expect(result.current.loaded).toBe(true))

    await act(async () => {
      await result.current.flushTimer(42, 180)
    })

    expect(timerService.flushTimerForBlock).toHaveBeenCalledWith(exec, 42, 180)
  })

  it('recoverTimerState delegates to recoverTimer with current exec', async () => {
    vi.mocked(timerService.recoverTimer).mockResolvedValue({
      remaining: 55,
      effectiveDurationSeconds: 180,
    })

    const { result } = renderHook(() => useSessionRunner('exec-1'))
    await waitFor(() => expect(result.current.loaded).toBe(true))

    const recovered = await act(async () => {
      return await result.current.recoverTimerState(180)
    })

    expect(recovered?.remaining).toBe(55)
    expect(timerService.recoverTimer).toHaveBeenCalledWith('exec-1', 0, 180)
  })

  it('sets actualDurationMinutes when completing the last block', async () => {
    const completed = makeExec({
      status: 'completed',
      activeBlockIndex: 2,
      blockStatuses: [
        { blockId: 'block-1', status: 'completed', completedAt: Date.now() },
        { blockId: 'block-2', status: 'completed', completedAt: Date.now() },
      ],
      completedAt: Date.now(),
    })
    vi.mocked(sessionService.buildAdvancedBlock).mockReturnValue({
      execution: completed,
      isLast: true,
    })

    const { result } = renderHook(() => useSessionRunner('exec-1'))
    await waitFor(() => expect(result.current.loaded).toBe(true))

    await act(async () => {
      await result.current.completeBlock()
    })

    const saved = vi.mocked(sessionService.saveExecution).mock.calls[0][0]
    expect(saved.actualDurationMinutes).toBe(11)
  })

  it('sets actualDurationMinutes when ending session early with partial timer', async () => {
    const inProgressExec = makeExec({
      status: 'in_progress',
      activeBlockIndex: 1,
      blockStatuses: [
        { blockId: 'block-1', status: 'completed', completedAt: Date.now() },
        { blockId: 'block-2', status: 'in_progress', startedAt: Date.now() },
      ],
    })
    vi.mocked(sessionService.loadSession).mockResolvedValue({
      execution: inProgressExec,
      plan,
    })

    const ended = makeExec({
      status: 'ended_early',
      activeBlockIndex: 1,
      blockStatuses: [
        { blockId: 'block-1', status: 'completed', completedAt: Date.now() },
        { blockId: 'block-2', status: 'skipped', completedAt: Date.now() },
      ],
      completedAt: Date.now(),
      endedEarlyReason: 'user_quit',
    })
    vi.mocked(sessionService.buildEndedSession).mockReturnValue(ended)
    vi.mocked(timerService.readTimerState).mockResolvedValue({
      id: 'active',
      executionLogId: 'exec-1',
      blockIndex: 1,
      startedAt: Date.now(),
      accumulatedElapsed: 120,
      status: 'running',
      lastFlushedAt: Date.now(),
    })

    const { result } = renderHook(() => useSessionRunner('exec-1'))
    await waitFor(() => expect(result.current.loaded).toBe(true))

    await act(async () => {
      await result.current.endSession('user_quit')
    })

    const saved = vi.mocked(sessionService.saveExecution).mock.calls[0][0]
    expect(saved.actualDurationMinutes).toBe(5)
  })

  // Red-team RT-4: advanceBlock('skipped') on last block with a non-zero
  // timer must include the partial time. Previous test mocked readTimerState
  // to undefined so the branch was never exercised.
  it('sets actualDurationMinutes when skipping the last block with a non-zero timer', async () => {
    const inProgressExec = makeExec({
      status: 'in_progress',
      activeBlockIndex: 1,
      blockStatuses: [
        { blockId: 'block-1', status: 'completed', completedAt: Date.now() },
        { blockId: 'block-2', status: 'in_progress', startedAt: Date.now() },
      ],
    })
    vi.mocked(sessionService.loadSession).mockResolvedValue({
      execution: inProgressExec,
      plan,
    })

    const skipped = makeExec({
      status: 'completed',
      activeBlockIndex: 2,
      blockStatuses: [
        { blockId: 'block-1', status: 'completed', completedAt: Date.now() },
        { blockId: 'block-2', status: 'skipped', completedAt: Date.now() },
      ],
      completedAt: Date.now(),
    })
    vi.mocked(sessionService.buildAdvancedBlock).mockReturnValue({
      execution: skipped,
      isLast: true,
    })
    vi.mocked(timerService.readTimerState).mockResolvedValue({
      id: 'active',
      executionLogId: 'exec-1',
      blockIndex: 1,
      startedAt: Date.now(),
      accumulatedElapsed: 120,
      status: 'running',
      lastFlushedAt: Date.now(),
    })

    const { result } = renderHook(() => useSessionRunner('exec-1'))
    await waitFor(() => expect(result.current.loaded).toBe(true))

    await act(async () => {
      await result.current.skipBlock()
    })

    const saved = vi.mocked(sessionService.saveExecution).mock.calls[0][0]
    // block-1 completed (3 min) + 120s partial = 5 min
    expect(saved.actualDurationMinutes).toBe(5)
  })

  // Red-team adversarial finding (2026-04-27): mutating actions on
  // `useSessionRunner` MUST serialize through a single in-flight queue
  // so a rapid pause + endSession (or pause + resume from the
  // end-session modal cancel path) cannot interleave their underlying
  // saveExecution writes. Without the queue, both `saveExecution` calls
  // would launch in parallel - the second can resolve first and the
  // stale `paused` write lands on top of the `ended_early` record.
  it('serializes mutating actions so a queued endSession waits for an in-flight pauseBlock to flush', async () => {
    const inProgressExec = makeExec({ status: 'in_progress' })
    vi.mocked(sessionService.loadSession).mockResolvedValue({
      execution: inProgressExec,
      plan,
    })
    const paused = makeExec({ status: 'paused', pausedAt: Date.now() })
    vi.mocked(sessionService.buildPausedExecution).mockReturnValue(paused)
    const ended = makeExec({
      status: 'ended_early',
      completedAt: Date.now(),
      endedEarlyReason: 'user_quit',
    })
    vi.mocked(sessionService.buildEndedSession).mockReturnValue(ended)

    // Hand-rolled deferred so we can hold the first saveExecution open
    // and observe whether endSession started its work prematurely.
    let releaseFirstSave: () => void = () => {}
    const firstSave = new Promise<void>((resolve) => {
      releaseFirstSave = resolve
    })
    vi.mocked(sessionService.saveExecution)
      .mockImplementationOnce(() => firstSave)
      .mockResolvedValue(undefined)

    const { result } = renderHook(() => useSessionRunner('exec-1'))
    await waitFor(() => expect(result.current.loaded).toBe(true))

    let pausePromise: Promise<unknown> | undefined
    let endPromise: Promise<unknown> | undefined
    act(() => {
      pausePromise = result.current.pauseBlock(15, 180)
      endPromise = result.current.endSession('user_quit')
    })

    // Pause's persist is in flight (saveExecution called once with the
    // paused stub) but endSession has NOT started its derivation yet -
    // it's queued behind pauseBlock. If the queue were absent both
    // builders would have fired by now.
    await Promise.resolve()
    await Promise.resolve()
    expect(sessionService.saveExecution).toHaveBeenCalledTimes(1)
    expect(sessionService.saveExecution).toHaveBeenLastCalledWith(paused)
    expect(sessionService.buildPausedExecution).toHaveBeenCalledTimes(1)
    expect(sessionService.buildEndedSession).not.toHaveBeenCalled()

    // Release pause's save. endSession runs only after pauseBlock fully
    // finishes, including its post-persist `flushTimerForBlock` step.
    await act(async () => {
      releaseFirstSave()
      await pausePromise
      await endPromise
    })

    expect(sessionService.buildEndedSession).toHaveBeenCalledTimes(1)
    // Two saves landed, in pause-then-end order, not in parallel.
    expect(sessionService.saveExecution).toHaveBeenCalledTimes(2)
    expect(sessionService.saveExecution).toHaveBeenNthCalledWith(1, paused)
    expect(sessionService.saveExecution).toHaveBeenNthCalledWith(2, ended)
  })

  // Red-team RT-4 corollary: a stale timer from a different execution must
  // NOT contribute partial seconds to the current session's duration.
  it('skipping the last block ignores a timer owned by a different execution', async () => {
    const inProgressExec = makeExec({
      status: 'in_progress',
      activeBlockIndex: 1,
      blockStatuses: [
        { blockId: 'block-1', status: 'completed', completedAt: Date.now() },
        { blockId: 'block-2', status: 'in_progress', startedAt: Date.now() },
      ],
    })
    vi.mocked(sessionService.loadSession).mockResolvedValue({
      execution: inProgressExec,
      plan,
    })

    const skipped = makeExec({
      status: 'completed',
      activeBlockIndex: 2,
      blockStatuses: [
        { blockId: 'block-1', status: 'completed', completedAt: Date.now() },
        { blockId: 'block-2', status: 'skipped', completedAt: Date.now() },
      ],
      completedAt: Date.now(),
    })
    vi.mocked(sessionService.buildAdvancedBlock).mockReturnValue({
      execution: skipped,
      isLast: true,
    })
    vi.mocked(timerService.readTimerState).mockResolvedValue({
      id: 'active',
      executionLogId: 'different-exec-id',
      blockIndex: 1,
      startedAt: Date.now(),
      accumulatedElapsed: 120,
      status: 'running',
      lastFlushedAt: Date.now(),
    })

    const { result } = renderHook(() => useSessionRunner('exec-1'))
    await waitFor(() => expect(result.current.loaded).toBe(true))

    await act(async () => {
      await result.current.skipBlock()
    })

    const saved = vi.mocked(sessionService.saveExecution).mock.calls[0][0]
    // Stale timer's 120s must NOT be added; only block-1's 3 min counts.
    expect(saved.actualDurationMinutes).toBe(3)
  })
})
