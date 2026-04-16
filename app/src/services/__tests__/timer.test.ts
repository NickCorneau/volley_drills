import { db } from '../../db'
import type { ExecutionLog } from '../../db'
import { flushTimerForBlock, readTimerState, clearTimerState, recoverTimer } from '../timer'

const SAMPLE_EXEC: ExecutionLog = {
  id: 'exec-1',
  planId: 'plan-1',
  status: 'in_progress',
  activeBlockIndex: 0,
  blockStatuses: [{ blockId: 'b1', status: 'in_progress', startedAt: 1000 }],
  startedAt: 1000,
}

beforeEach(async () => {
  await db.timerState.clear()
})

describe('flushTimerForBlock', () => {
  it('writes state that can be read back', async () => {
    await flushTimerForBlock(SAMPLE_EXEC, 42, 180)
    const saved = await readTimerState()
    expect(saved).toBeDefined()
    expect(saved!.executionLogId).toBe('exec-1')
    expect(saved!.accumulatedElapsed).toBe(42)
    expect(saved!.effectiveDurationSeconds).toBe(180)
    expect(saved!.status).toBe('running')
  })

  it('overwrites previous state', async () => {
    await flushTimerForBlock(SAMPLE_EXEC, 42, 180)
    await flushTimerForBlock(SAMPLE_EXEC, 99, 180)
    const saved = await readTimerState()
    expect(saved?.accumulatedElapsed).toBe(99)
  })

  it('respects explicit status override', async () => {
    await flushTimerForBlock(SAMPLE_EXEC, 42, 180, 'paused')
    const saved = await readTimerState()
    expect(saved?.status).toBe('paused')
  })
})

describe('readTimerState', () => {
  it('returns undefined when no state exists', async () => {
    const result = await readTimerState()
    expect(result).toBeUndefined()
  })
})

describe('clearTimerState', () => {
  it('removes existing state', async () => {
    await flushTimerForBlock(SAMPLE_EXEC, 42, 180)
    await clearTimerState()
    const result = await readTimerState()
    expect(result).toBeUndefined()
  })

  it('is safe to call when empty', async () => {
    await clearTimerState()
    const result = await readTimerState()
    expect(result).toBeUndefined()
  })
})

describe('recoverTimer', () => {
  it('recovers remaining time and effective duration from saved state', async () => {
    await flushTimerForBlock(SAMPLE_EXEC, 42, 180)
    const recovered = await recoverTimer('exec-1', 0, 180)
    expect(recovered?.remaining).toBe(180 - 42)
    expect(recovered?.effectiveDurationSeconds).toBe(180)
  })

  it('returns null when no saved state', async () => {
    const recovered = await recoverTimer('exec-1', 0, 180)
    expect(recovered).toBeNull()
  })

  it('returns null for mismatched execution', async () => {
    await flushTimerForBlock(SAMPLE_EXEC, 42, 180)
    const recovered = await recoverTimer('other-exec', 0, 180)
    expect(recovered).toBeNull()
  })

  it('returns null for mismatched block index', async () => {
    await flushTimerForBlock(SAMPLE_EXEC, 42, 180)
    const recovered = await recoverTimer('exec-1', 1, 180)
    expect(recovered).toBeNull()
  })
})
