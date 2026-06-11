import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SEGMENT_INDEX_BONUS } from '../../hooks/useBlockPacingTicks'
import { RunScreen } from '../RunScreen'
import { useRunController } from '../run/useRunController'

vi.mock('../run/useRunController', () => ({
  useRunController: vi.fn(),
}))

const useRunControllerMock = vi.mocked(useRunController)

/**
 * 2026-05-25 H2 experiment (plan U7 + code-review fix correctness-1/T1).
 *
 * The 2026-05-24 e2e design critique flagged the active-run body as
 * text-dense for a sun-readable screen on segmented drills: drill
 * title + intro paragraph + 4-item SegmentList + "Show more cues"
 * expander were all visible above the fold. `courtside-copy.mdc` rule
 * 13 (DO-CONFIRM triple-only readability) names the
 * `skillFocus` + `successMetric.description` + `coachingCues[0]`
 * triple as the load-bearing read once the user is past initial
 * READ-DO context.
 *
 * The H2 experiment keeps the full READ-DO paragraph visible INLINE
 * only at `currentSegmentIndex === 0` (which covers running the first
 * segment and paused-at-segment-0, including preroll). Every other
 * position - running past segment 0, paused past segment 0, and bonus
 * territory (`SEGMENT_INDEX_BONUS === -1`, emitted by
 * `useBlockPacingTicks` when the block runs past
 * `sum(segments[].durationSec)` on long wraps like d25-solo /
 * d26-solo cooldowns) - routes the paragraph into the existing
 * `<details>` affordance. The SegmentList continues to carry the
 * load-bearing read; the full paragraph stays reachable behind a "Show
 * full instructions" / "Show more cues and instructions" summary.
 *
 * Durable keep / revert gated on the D91 field run. Viewport-bound
 * assessment lives in
 * `docs/design/reviews/2026-05-25-h1-h2-experiment-revaluation.md`.
 */

const SEGMENTS = [
  { id: 's1', label: 'Jog or A-skip around your sand box.', durationSec: 45 },
  { id: 's2', label: 'Ankle hops and lateral shuffles.', durationSec: 45 },
  { id: 's3', label: 'Arm circles and trunk rotations.', durationSec: 45 },
  { id: 's4', label: 'Quick side shuffles and pivot-back starts at game pace.', durationSec: 45 },
]

function controller(currentSegmentIndex: number): ReturnType<typeof useRunController> {
  return {
    plan: {
      id: 'plan-h2',
      presetId: 'solo_open',
      presetName: 'Solo + Open',
      playerCount: 1,
      blocks: [],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: Date.now(),
    },
    execution: {
      id: 'exec-h2',
      planId: 'plan-h2',
      status: 'in_progress',
      activeBlockIndex: 0,
      blockStatuses: [{ blockId: 'b-0', status: 'in_progress' }],
      startedAt: Date.now(),
    },
    loaded: true,
    currentBlock: {
      id: 'b-0',
      type: 'warmup',
      drillId: 'd28',
      variantId: 'd28-solo',
      drillName: 'Beach Prep Three',
      shortName: 'Warm up',
      durationMinutes: 3,
      coachingCue: 'Short hops, loud feet.',
      courtsideInstructions: 'Four quick blocks, ~45 s each. End warmer than you started.',
      segments: SEGMENTS,
      required: true,
    },
    currentBlockIndex: 0,
    totalBlocks: 1,
    isPaused: false,
    activeDuration: 180,
    timer: {
      remainingSeconds: 120,
      isRunning: true,
      start: vi.fn(),
      pause: vi.fn(() => 120),
      resume: vi.fn(),
      reset: vi.fn(),
      adjustRemaining: vi.fn(),
    },
    runError: null,
    prerollCount: null,
    prerollHintDismissed: true,
    showEndConfirm: false,
    canWrapSession: false,
    isWakeLocked: true,
    hasAlternates: false,
    currentSegmentIndex,
    effectiveSegments: SEGMENTS,
    handlePause: vi.fn(),
    handleResume: vi.fn(),
    handleNext: vi.fn(),
    handleSkip: vi.fn(),
    handleShorten: vi.fn(),
    handleSwap: vi.fn(),
    handleEndSessionRequest: vi.fn(),
    handleEndSessionConfirm: vi.fn(async () => undefined),
    handleEndSessionCancel: vi.fn(async () => undefined),
  } satisfies ReturnType<typeof useRunController>
}

function renderRun() {
  return render(
    <MemoryRouter initialEntries={['/run?id=exec-h2']}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RunScreen H2 experiment - segmented-drill body density', () => {
  it('renders the inline courtsideInstructions paragraph at segment 0 (READ-DO context)', () => {
    useRunControllerMock.mockReturnValue(controller(0))
    renderRun()

    expect(screen.getByTestId('run-instructions-inline')).toBeInTheDocument()
    expect(screen.getByTestId('run-instructions-inline').textContent).toMatch(/Four quick blocks/i)
    expect(screen.queryByText(/Show .*instructions/i)).toBeNull()
  })

  it('collapses the courtsideInstructions paragraph into <details> when past segment 0 (DO-CONFIRM density)', () => {
    useRunControllerMock.mockReturnValue(controller(1))
    renderRun()

    // The <details> summary is rendered with the "Show more cues and
    // instructions" label (the warmup drill has both an instructions
    // overflow AND a coaching cue overflow that does not match
    // `currentCue` - SegmentList owns the active cue, so coachingCue
    // routes to detail too).
    expect(screen.getByText(/Show .*instructions/i)).toBeInTheDocument()

    // The inline paragraph is no longer rendered at all when past
    // segment 0; assert directly against the data-testid.
    expect(screen.queryByTestId('run-instructions-inline')).toBeNull()
  })

  it('collapses the inline paragraph in bonus territory (SEGMENT_INDEX_BONUS === -1)', () => {
    // 2026-05-25 code-review fix (correctness-1 / T1): when the
    // block runs past sum(segments[].durationSec) into bonus territory
    // (e.g., d25-solo / d26-solo cooldowns on long wraps),
    // useBlockPacingTicks emits SEGMENT_INDEX_BONUS === -1. The
    // initial H2 predicate (`currentSegmentIndex <= 0`) re-expanded
    // the inline paragraph here, double-rendering body prose. The
    // fixed `currentSegmentIndex === 0` keeps the paragraph in the
    // <details> collapse in bonus territory. Regression coverage
    // against a future flip back to `<= 0`.
    useRunControllerMock.mockReturnValue(controller(SEGMENT_INDEX_BONUS))
    renderRun()

    expect(screen.queryByTestId('run-instructions-inline')).toBeNull()
    expect(screen.getByText(/Show .*instructions/i)).toBeInTheDocument()
  })

  it('keeps the SegmentList visible across all states (load-bearing DO-CONFIRM read)', () => {
    useRunControllerMock.mockReturnValue(controller(0))
    const { unmount: unmount0 } = renderRun()
    expect(screen.getByRole('list', { name: 'Segments' })).toBeInTheDocument()
    unmount0()

    useRunControllerMock.mockReturnValue(controller(1))
    const { unmount: unmount1 } = renderRun()
    expect(screen.getByRole('list', { name: 'Segments' })).toBeInTheDocument()
    unmount1()

    useRunControllerMock.mockReturnValue(controller(SEGMENT_INDEX_BONUS))
    renderRun()
    expect(screen.getByRole('list', { name: 'Segments' })).toBeInTheDocument()
  })
})
