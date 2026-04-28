import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useRunController } from '../useRunController'
import { useSessionRunner } from '../../../hooks/useSessionRunner'
import { routes } from '../../../routes'
import { buildRunnerFixture, type RunnerFixture } from '../../../test-utils/runnerFixture'

const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}))

const timerHarness = vi.hoisted(() => ({
  onComplete: null as null | (() => unknown),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('../../../hooks/useSessionRunner', () => ({
  useSessionRunner: vi.fn(),
}))

const timer = {
  remainingSeconds: 120,
  isRunning: true,
  start: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  reset: vi.fn(),
}

vi.mock('../../../hooks/useTimer', () => ({
  useTimer: vi.fn((_duration: number, onComplete: () => unknown) => {
    timerHarness.onComplete = onComplete
    return timer
  }),
}))

vi.mock('../../../hooks/useWakeLock', () => ({
  useWakeLock: vi.fn(() => ({
    isLocked: true,
    request: vi.fn(),
    release: vi.fn(),
  })),
}))

vi.mock('../../../hooks/usePreroll', () => ({
  usePreroll: vi.fn(() => ({
    count: null,
    start: vi.fn(),
  })),
}))

vi.mock('../../../hooks/useBlockPacingTicks', () => ({
  useBlockPacingTicks: vi.fn(),
}))

vi.mock('../../../lib/audio', () => ({
  playBlockEndBeep: vi.fn(),
  playPrerollTick: vi.fn(),
  playSubBlockTick: vi.fn(),
}))

vi.mock('../../../services/storageMeta', () => ({
  getStorageMeta: vi.fn(async () => true),
  setStorageMeta: vi.fn(async () => undefined),
}))

let fixture: RunnerFixture

function makeFixture(): RunnerFixture {
  return buildRunnerFixture({
    executionId: 'exec-run',
    planId: 'plan-run',
    blocks: [
      {
        id: 'b-0',
        type: 'main_skill',
        drillName: 'Self-Toss Pass',
        shortName: 'Pass',
        durationMinutes: 3,
        coachingCue: 'Quiet platform.',
        courtsideInstructions: 'Pass to target.',
        required: true,
      },
    ],
  })
}

describe('useRunController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    timerHarness.onComplete = null
    Object.values(timer).forEach((value) => {
      if (typeof value === 'function') value.mockClear()
    })
    fixture = makeFixture()
    vi.mocked(useSessionRunner).mockReturnValue(fixture.runner)
  })

  it('routes skipped non-terminal blocks through Drill Check', async () => {
    fixture.mocks.skipBlock.mockResolvedValueOnce(false)
    const { result } = renderHook(() => useRunController('exec-run', false), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    await act(async () => {
      await result.current.handleSkip()
    })

    expect(navigateMock).toHaveBeenCalledWith(routes.drillCheck('exec-run'), { replace: false })
  })

  it('routes terminal skipped blocks to Review', async () => {
    fixture.mocks.skipBlock.mockResolvedValueOnce(true)
    const { result } = renderHook(() => useRunController('exec-run', false), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    await act(async () => {
      await result.current.handleSkip()
    })

    expect(navigateMock).toHaveBeenCalledWith(routes.review('exec-run'), { replace: true })
  })

  it('routes non-terminal Next through Drill Check', async () => {
    fixture.mocks.completeBlock.mockResolvedValueOnce(false)
    const { result } = renderHook(() => useRunController('exec-run', false), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    await act(async () => {
      await result.current.handleNext()
    })

    expect(navigateMock).toHaveBeenCalledWith(routes.drillCheck('exec-run'), { replace: false })
  })

  it('routes terminal Next to Review', async () => {
    fixture.mocks.completeBlock.mockResolvedValueOnce(true)
    const { result } = renderHook(() => useRunController('exec-run', false), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    await act(async () => {
      await result.current.handleNext()
    })

    expect(navigateMock).toHaveBeenCalledWith(routes.review('exec-run'), { replace: true })
  })

  it('routes non-terminal timer completion through Drill Check', async () => {
    fixture.mocks.completeBlock.mockResolvedValueOnce(false)
    renderHook(() => useRunController('exec-run', false), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    await act(async () => {
      await timerHarness.onComplete?.()
    })

    expect(navigateMock).toHaveBeenCalledWith(routes.drillCheck('exec-run'), { replace: false })
  })

  it('routes terminal timer completion to Review', async () => {
    fixture.mocks.completeBlock.mockResolvedValueOnce(true)
    renderHook(() => useRunController('exec-run', false), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    await act(async () => {
      await timerHarness.onComplete?.()
    })

    expect(navigateMock).toHaveBeenCalledWith(routes.review('exec-run'), { replace: true })
  })

  it('keeps the end-session modal open while cancel waits for the pause write to settle', async () => {
    let resolvePause!: () => void
    fixture.mocks.pauseBlock.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolvePause = resolve
      }),
    )
    fixture.mocks.resumeBlock.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useRunController('exec-run', false), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    act(() => {
      result.current.handleEndSessionRequest()
    })
    expect(result.current.showEndConfirm).toBe(true)

    let cancelPromise!: Promise<void>
    act(() => {
      cancelPromise = result.current.handleEndSessionCancel()
    })
    expect(result.current.showEndConfirm).toBe(true)

    await act(async () => {
      resolvePause()
      await cancelPromise
    })

    expect(result.current.showEndConfirm).toBe(false)
    expect(timer.resume).toHaveBeenCalled()
    expect(fixture.mocks.resumeBlock).toHaveBeenCalled()
  })

  it('reports no alternates when mid-run swap returns false', async () => {
    fixture.mocks.swapBlock.mockResolvedValueOnce(false)
    const { result } = renderHook(() => useRunController('exec-run', false), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    await act(async () => {
      await result.current.handleSwap()
    })

    expect(timer.pause).toHaveBeenCalled()
    expect(fixture.mocks.pauseBlock).toHaveBeenCalled()
    expect(result.current.runError).toBe('No alternate drills available for this block.')
  })

  it('reports a retryable error when mid-run swap rejects', async () => {
    fixture.mocks.swapBlock.mockRejectedValueOnce(new Error('write failed'))
    const { result } = renderHook(() => useRunController('exec-run', false), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    await act(async () => {
      await result.current.handleSwap()
    })

    expect(result.current.runError).toBe('Something went wrong. Try again or end session.')
  })
})
