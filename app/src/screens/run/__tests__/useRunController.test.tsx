import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SEGMENT_INDEX_BONUS } from '../../../domain/runFlow'
import { useBlockPacingTicks } from '../../../hooks/useBlockPacingTicks'
import { useRunController } from '../useRunController'
import { useSessionRunner } from '../../../hooks/useSessionRunner'
import { playSubBlockTick } from '../../../lib/audio'
import { routes } from '../../../routes'
import { buildRunnerFixture, type RunnerFixture } from '../../../test-utils/runnerFixture'
import type { DrillSegment } from '../../../types/drill'

const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}))

const timerHarness = vi.hoisted(() => ({
  onComplete: null as null | (() => unknown),
}))

const prerollHarness = vi.hoisted(() => ({
  count: null as number | null,
  start: vi.fn(),
}))

const wakeLockHarness = vi.hoisted(() => ({
  isLocked: true,
  request: vi.fn(async () => undefined),
  release: vi.fn(async () => undefined),
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
    isLocked: wakeLockHarness.isLocked,
    request: wakeLockHarness.request,
    release: wakeLockHarness.release,
  })),
}))

vi.mock('../../../hooks/usePreroll', () => ({
  usePreroll: vi.fn(() => ({
    count: prerollHarness.count,
    start: prerollHarness.start,
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
    prerollHarness.count = null
    wakeLockHarness.isLocked = true
    Object.values(timer).forEach((value) => {
      if (typeof value === 'function') value.mockClear()
    })
    timer.isRunning = true
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

  it('keeps the Safety-primed wake lock through preroll before the timer starts', () => {
    timer.isRunning = false
    prerollHarness.count = null
    fixture = buildRunnerFixture({
      executionId: 'exec-run',
      planId: 'plan-run',
      status: 'not_started',
    })
    vi.mocked(useSessionRunner).mockReturnValue(fixture.runner)

    renderHook(() => useRunController('exec-run', false), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    expect(wakeLockHarness.release).not.toHaveBeenCalled()
  })

  it('does not release the Safety-primed wake lock while the run state is still loading', () => {
    timer.isRunning = false
    fixture = buildRunnerFixture({
      executionId: 'exec-run',
      planId: 'plan-run',
      status: 'not_started',
    })
    vi.mocked(useSessionRunner).mockReturnValue({
      ...fixture.runner,
      plan: null,
      execution: null,
      loaded: false,
      currentBlock: null,
    })

    renderHook(() => useRunController('exec-run', false), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    expect(wakeLockHarness.release).not.toHaveBeenCalled()
    expect(wakeLockHarness.request).not.toHaveBeenCalled()
  })

  it('releases the wake lock when a loaded block is paused outside preroll', () => {
    timer.isRunning = false
    prerollHarness.count = null
    fixture = buildRunnerFixture({
      executionId: 'exec-run',
      planId: 'plan-run',
      status: 'paused',
    })
    vi.mocked(useSessionRunner).mockReturnValue(fixture.runner)

    renderHook(() => useRunController('exec-run', false), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    })

    expect(wakeLockHarness.release).toHaveBeenCalled()
  })

  /**
   * U7 of `docs/plans/2026-04-28-per-move-pacing-indicator.md`:
   * controller wires `currentBlock.segments` + the per-segment beep
   * + index-change callback into the pacing hook, and exposes
   * `currentSegmentIndex` to RunScreen. Mocked-hook contract is the
   * proof point at this tier; the real pacing math is covered by
   * `segmentTiming.test.ts` and `useBlockPacingTicks.test.ts`.
   */
  describe('segments wiring (U7)', () => {
    const FOUR_SEGMENTS: readonly DrillSegment[] = [
      { id: 's1', label: 'Jog', durationSec: 45 },
      { id: 's2', label: 'Hops', durationSec: 45 },
      { id: 's3', label: 'Arms', durationSec: 45 },
      { id: 's4', label: 'Shuffles', durationSec: 45 },
    ]

    function makeSegmentedFixture(segments: readonly DrillSegment[] = FOUR_SEGMENTS) {
      return buildRunnerFixture({
        executionId: 'exec-run',
        planId: 'plan-run',
        blocks: [
          {
            id: 'b-warm',
            type: 'warmup',
            drillName: 'Beach Prep Three',
            shortName: 'Beach Prep',
            durationMinutes: 3,
            coachingCue: 'Short hops, loud feet.',
            courtsideInstructions: 'Four quick blocks, ~45 s each.',
            required: true,
            segments,
          },
        ],
      })
    }

    it('passes segments + onSegmentEndTick + onSegmentIndexChange to the pacing hook', () => {
      const segFixture = makeSegmentedFixture()
      vi.mocked(useSessionRunner).mockReturnValue(segFixture.runner)

      renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })

      const lastCall = vi.mocked(useBlockPacingTicks).mock.lastCall
      expect(lastCall).toBeDefined()
      const opts = lastCall![0]
      expect(opts.segments).toEqual(FOUR_SEGMENTS)
      expect(typeof opts.onSegmentEndTick).toBe('function')
      expect(typeof opts.onSegmentIndexChange).toBe('function')
      // The end-of-segment beep reuses the existing sub-block-tick
      // sound per U7's design decision.
      opts.onSegmentEndTick?.()
      expect(playSubBlockTick).toHaveBeenCalled()
    })

    it('exposes currentSegmentIndex starting at 0 for a block with segments', () => {
      const segFixture = makeSegmentedFixture()
      vi.mocked(useSessionRunner).mockReturnValue(segFixture.runner)

      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })

      expect(result.current.currentSegmentIndex).toBe(0)
    })

    it('initializes currentSegmentIndex to 0 even for a block with no segments (value is ignored by RunScreen)', () => {
      // Default fixture has no segments. The controller still exposes
      // a `currentSegmentIndex` of 0; RunScreen's `<SegmentList>` is
      // gated on `currentBlock.segments?.length > 0` so the value
      // doesn't render anywhere.
      vi.mocked(useSessionRunner).mockReturnValue(fixture.runner)

      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })

      expect(result.current.currentSegmentIndex).toBe(0)
    })

    it('updates currentSegmentIndex when the pacing hook calls onSegmentIndexChange', () => {
      const segFixture = makeSegmentedFixture()
      vi.mocked(useSessionRunner).mockReturnValue(segFixture.runner)

      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })

      const opts = vi.mocked(useBlockPacingTicks).mock.lastCall![0]
      expect(opts.onSegmentIndexChange).toBeDefined()

      act(() => {
        opts.onSegmentIndexChange?.(2)
      })
      expect(result.current.currentSegmentIndex).toBe(2)

      act(() => {
        opts.onSegmentIndexChange?.(SEGMENT_INDEX_BONUS)
      })
      expect(result.current.currentSegmentIndex).toBe(SEGMENT_INDEX_BONUS)
    })

    /**
     * 2026-04-28 dogfeed iteration: Shorten on warmup/cooldown must
     * scale segment durations proportionally so the user does ALL
     * moves at faster timing instead of dropping the trailing
     * segments off the block end.
     *
     * `shortened: true` (Transition `Shorten block` flow) initializes
     * `activeDuration = durationMinutes * 30` (half-speed). The
     * controller's `effectiveSegments` memo scales the authored
     * segments accordingly.
     */
    it('passes scaled effectiveSegments to the pacing hook when shortened=true (4×45s → 4×22.5s)', () => {
      const segFixture = makeSegmentedFixture()
      vi.mocked(useSessionRunner).mockReturnValue(segFixture.runner)

      const { result } = renderHook(() => useRunController('exec-run', true /* shortened */), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })

      // The fixture authored a 3-min warmup with 4 × 45 s segments
      // (180 s sum). Shortened: activeDuration = 3 * 30 = 90 s.
      // Scale factor = 90/180 = 0.5 → each segment = 22.5 s.
      const opts = vi.mocked(useBlockPacingTicks).mock.lastCall![0]
      expect(opts.segments).toBeDefined()
      expect(opts.segments).toHaveLength(4)
      for (const seg of opts.segments ?? []) {
        expect(seg.durationSec).toBeCloseTo(22.5)
      }

      // Same scaled segments are exposed via the controller return so
      // RunScreen renders the same numbers in the SegmentList.
      expect(result.current.effectiveSegments).toBeDefined()
      expect(result.current.effectiveSegments).toHaveLength(4)
      for (const seg of result.current.effectiveSegments ?? []) {
        expect(seg.durationSec).toBeCloseTo(22.5)
      }
    })

    it('passes unscaled effectiveSegments when shortened=false (full-duration block)', () => {
      const segFixture = makeSegmentedFixture()
      vi.mocked(useSessionRunner).mockReturnValue(segFixture.runner)

      renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })

      // 3-min block, 4 × 45 s = 180 s segment sum. activeDuration =
      // 180. No scaling. effectiveSegments === currentBlock.segments
      // (referential equality preserved by the helper).
      const opts = vi.mocked(useBlockPacingTicks).mock.lastCall![0]
      expect(opts.segments).toBeDefined()
      expect(opts.segments?.map((s) => s.durationSec)).toEqual([45, 45, 45, 45])
    })
  })
})
