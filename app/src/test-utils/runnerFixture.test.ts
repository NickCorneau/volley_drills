import { describe, expect, it } from 'vitest'
import { buildRunnerFixture } from './runnerFixture'

describe('buildRunnerFixture', () => {
  it('produces a runner with consistent blockStatuses[i].blockId === blocks[i].id', () => {
    const { runner } = buildRunnerFixture()
    if (!runner.plan || !runner.execution) throw new Error('expected plan + execution')
    expect(runner.execution.blockStatuses.map((s) => s.blockId)).toEqual(
      runner.plan.blocks.map((b) => b.id),
    )
  })

  it('exposes the same vi.fn instances on runner.X and mocks.X', () => {
    const { runner, mocks } = buildRunnerFixture()
    expect(runner.skipBlock).toBe(mocks.skipBlock)
    expect(runner.completeBlock).toBe(mocks.completeBlock)
    expect(runner.swapBlock).toBe(mocks.swapBlock)
  })

  it('defaults all boolean-returning action mocks to false (safe / no-op)', async () => {
    const { mocks } = buildRunnerFixture()
    await expect(mocks.completeBlock()).resolves.toBe(false)
    await expect(mocks.skipBlock()).resolves.toBe(false)
    await expect(mocks.swapBlock()).resolves.toBe(false)
  })

  it('defaults flushTimer to an awaitable async function', async () => {
    const { mocks } = buildRunnerFixture()
    await expect(mocks.flushTimer(0)).resolves.toBeUndefined()
  })

  it('throws on activeBlockIndex out of range', () => {
    expect(() => buildRunnerFixture({ activeBlockIndex: 5 })).toThrowError(
      /activeBlockIndex 5 is out of range/,
    )
    expect(() => buildRunnerFixture({ activeBlockIndex: -1 })).toThrowError(
      /activeBlockIndex -1 is out of range/,
    )
  })

  it('throws when given zero blocks', () => {
    expect(() => buildRunnerFixture({ blocks: [] })).toThrowError(/at least one block/)
  })
})
