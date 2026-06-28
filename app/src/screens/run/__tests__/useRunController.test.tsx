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

  // U2 (2026-06-11 session-truth plan): two-intent end routing + guards.
  describe('two-intent end routing (U2)', () => {
    it('routes done to wrapSession and navigates to Review', async () => {
      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })

      await act(async () => {
        await result.current.handleEndSessionConfirm('done')
      })

      expect(fixture.mocks.wrapSession).toHaveBeenCalledTimes(1)
      expect(fixture.mocks.endSession).not.toHaveBeenCalled()
      expect(navigateMock).toHaveBeenCalledWith(routes.review('exec-run'), { replace: true })
    })

    it('routes cut_short to endSession and navigates to Review', async () => {
      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })

      await act(async () => {
        await result.current.handleEndSessionConfirm('cut_short')
      })

      expect(fixture.mocks.endSession).toHaveBeenCalledTimes(1)
      expect(fixture.mocks.wrapSession).not.toHaveBeenCalled()
      expect(navigateMock).toHaveBeenCalledWith(routes.review('exec-run'), { replace: true })
    })

    it('defaults a bare confirm to the cut-short intent', async () => {
      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })

      await act(async () => {
        await result.current.handleEndSessionConfirm()
      })

      expect(fixture.mocks.endSession).toHaveBeenCalledTimes(1)
      expect(fixture.mocks.wrapSession).not.toHaveBeenCalled()
    })

    it('exposes canWrapSession=false when no block is completed', () => {
      // Default fixture starts at block 0 with nothing completed.
      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })

      expect(result.current.canWrapSession).toBe(false)
    })

    it('exposes canWrapSession=true once a block is completed', () => {
      const banked = buildRunnerFixture({
        executionId: 'exec-run',
        planId: 'plan-run',
        activeBlockIndex: 1,
      })
      vi.mocked(useSessionRunner).mockReturnValue(banked.runner)

      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })

      expect(result.current.canWrapSession).toBe(true)
    })

    it('does not resume the timer when cancel fires against a terminal execution (KTD8)', async () => {
      const terminal = buildRunnerFixture({
        executionId: 'exec-run',
        planId: 'plan-run',
        status: 'ended_early',
      })
      vi.mocked(useSessionRunner).mockReturnValue(terminal.runner)

      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })

      act(() => {
        result.current.handleEndSessionRequest()
      })

      await act(async () => {
        await result.current.handleEndSessionCancel()
      })

      expect(result.current.showEndConfirm).toBe(false)
      expect(timer.resume).not.toHaveBeenCalled()
      expect(terminal.mocks.resumeBlock).not.toHaveBeenCalled()
    })
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

  /**
   * Run-flow beat contract Stage 4 (D167, R13/R14): the read-first
   * get-ready beat gates the 3·2·1 count-in behind Start for
   * between-block starts (currentBlockIndex > 0) — exactly where the
   * Transition beat used to sit. Block 0 keeps the session-start
   * auto-preroll. `usePreroll` is mocked, so `prerollHarness.start` is
   * the count-in spy.
   */
  describe('get-ready beat (Stage 4, D167)', () => {
    // The real between-block state: the session is in progress but the
    // upcoming block has not started yet. buildRunnerFixture ties the
    // active block's status to the execution status, so force it back to
    // 'planned' to model "session running, next block not started."
    function freshBetweenBlock(index = 1): RunnerFixture {
      const fx = buildRunnerFixture({
        executionId: 'exec-run',
        planId: 'plan-run',
        activeBlockIndex: index,
        status: 'in_progress',
      })
      const bs = fx.runner.execution!.blockStatuses[index]!
      bs.status = 'planned'
      bs.startedAt = undefined
      return fx
    }

    it('lands on the get-ready (no auto count-in) for a between-block start', async () => {
      vi.mocked(useSessionRunner).mockReturnValue(freshBetweenBlock(1).runner)
      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })
      await act(async () => {
        await Promise.resolve()
      })

      expect(result.current.isGetReady).toBe(true)
      expect(prerollHarness.start).not.toHaveBeenCalled()
    })

    it('auto-starts the count-in for block 0 (session start), skipping the get-ready', async () => {
      vi.mocked(useSessionRunner).mockReturnValue(
        buildRunnerFixture({
          executionId: 'exec-run',
          planId: 'plan-run',
          activeBlockIndex: 0,
          status: 'not_started',
        }).runner,
      )
      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })
      await act(async () => {
        await Promise.resolve()
      })

      expect(result.current.isGetReady).toBe(false)
      expect(prerollHarness.start).toHaveBeenCalledTimes(1)
    })

    it('does not enter the get-ready when resuming an in-progress block', async () => {
      vi.mocked(useSessionRunner).mockReturnValue(
        buildRunnerFixture({
          executionId: 'exec-run',
          planId: 'plan-run',
          activeBlockIndex: 1,
          status: 'in_progress',
        }).runner,
      )
      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })
      await act(async () => {
        await Promise.resolve()
      })

      expect(result.current.isGetReady).toBe(false)
      expect(prerollHarness.start).not.toHaveBeenCalled()
    })

    it('handleStart leaves the get-ready and fires the count-in exactly once', async () => {
      vi.mocked(useSessionRunner).mockReturnValue(freshBetweenBlock(1).runner)
      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })
      await act(async () => {
        await Promise.resolve()
      })
      expect(prerollHarness.start).not.toHaveBeenCalled()

      act(() => {
        result.current.handleStart()
      })

      expect(result.current.isGetReady).toBe(false)
      expect(prerollHarness.start).toHaveBeenCalledTimes(1)
    })

    it('handleStartShortened starts the block at half the authored duration', async () => {
      // Default fixture block 1 ('b-main') is a 5-min main_skill: 300 s
      // full, 150 s shortened.
      vi.mocked(useSessionRunner).mockReturnValue(freshBetweenBlock(1).runner)
      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })
      await act(async () => {
        await Promise.resolve()
      })

      act(() => {
        result.current.handleStartShortened()
      })

      expect(result.current.isGetReady).toBe(false)
      expect(prerollHarness.start).toHaveBeenCalledTimes(1)
      expect(result.current.activeDuration).toBe(150)
    })
  })

  /**
   * Run-flow beat contract Stage 4 (D166, R15): the block-opening rung
   * intent keeps a home on the get-ready after the Transition collapse.
   * The controller reuses the same pure `resolveBlockOpeningIntent` the
   * Transition beat consulted, so the first-appearance keying (including
   * the set → pass → set interleave) is inherited and is unit-tested in
   * `domain/__tests__/drillMetadata.blockOpening.test.ts`. These cases
   * only pin the controller wiring + index.
   */
  describe('block-opening intent (Stage 4, U6)', () => {
    it('exposes the rung intent for a focus-opening block (warmup → pass)', () => {
      const fx = buildRunnerFixture({
        executionId: 'exec-run',
        planId: 'plan-run',
        playerCount: 2,
        activeBlockIndex: 1,
        status: 'in_progress',
        blocks: [
          { id: 'b-0', type: 'warmup', drillName: 'Warm up', durationMinutes: 3 },
          {
            id: 'b-1',
            type: 'main_skill',
            drillId: 'd24',
            drillName: 'Pass into a Corner',
            durationMinutes: 5,
          },
        ],
      })
      vi.mocked(useSessionRunner).mockReturnValue(fx.runner)

      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })

      expect(result.current.rungIntentLine).toBeTruthy()
      expect(typeof result.current.rungIntentLine).toBe('string')
    })

    it('exposes no rung intent for a synthetic (off-ladder) block', () => {
      // The default fixture blocks carry no drillId, so the catalog
      // resolves no skill focus → no intent.
      vi.mocked(useSessionRunner).mockReturnValue(fixture.runner)

      const { result } = renderHook(() => useRunController('exec-run', false), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      })

      expect(result.current.rungIntentLine).toBeNull()
    })
  })
})
