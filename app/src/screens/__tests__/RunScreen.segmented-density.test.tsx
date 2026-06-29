import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SEGMENT_INDEX_BONUS } from '../../hooks/useBlockPacingTicks'
import { RunScreen } from '../RunScreen'
import { useRunController } from '../run/useRunController'

vi.mock('../run/useRunController', () => ({
  useRunController: vi.fn(),
}))

const useRunControllerMock = vi.mocked(useRunController)

/**
 * Run-flow beat contract Stage 1 (R7b / R16) — segmented-drill body.
 *
 * Supersedes the 2026-05-25 H2 experiment
 * (`docs/design/reviews/2026-05-25-h1-h2-experiment-revaluation.md`).
 * The H2 experiment kept the full `courtsideInstructions` READ-DO
 * paragraph visible inline at `currentSegmentIndex === 0` and routed
 * it into a `<details>` afterward. The beat contract removes that read
 * from the live face entirely — Run is the one-cue DO-CONFIRM cockpit; the
 * full read is homed once, on the Run get-ready beat (post-D167; formerly
 * Transition). What remains on the live face:
 *
 *  - the live "Now" cue (or the SegmentList's own active row),
 *  - a **cue-only** "Show more cues" disclosure (rule 12a) when extra
 *    coaching cues exist,
 *  - the load-bearing `<SegmentList>` across every segment position.
 *
 * These tests pin that the inline instructions paragraph is gone at
 * all positions and that the SegmentList still carries the read.
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
      id: 'plan-seg-density',
      presetId: 'solo_open',
      presetName: 'Solo + Open',
      playerCount: 1,
      blocks: [],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: Date.now(),
    },
    execution: {
      id: 'exec-seg-density',
      planId: 'plan-seg-density',
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
    isGetReady: false,
    prevBlock: null,
    prevBlockStatus: null,
    showJustFinishedReceipt: false,
    rungIntentLine: null,
    handleStart: vi.fn(),
    handleStartShortened: vi.fn(),
    handleEndSessionRequest: vi.fn(),
    handleEndSessionConfirm: vi.fn(async () => undefined),
    handleEndSessionCancel: vi.fn(async () => undefined),
  } satisfies ReturnType<typeof useRunController>
}

function renderRun() {
  return render(
    <MemoryRouter initialEntries={['/run?id=exec-seg-density']}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RunScreen — segmented-drill density (beat contract Stage 1)', () => {
  it('never renders the inline courtsideInstructions read, even at segment 0 (R7b)', () => {
    useRunControllerMock.mockReturnValue(controller(0))
    renderRun()

    // The full READ-DO paragraph is gone from Run — both the H2-era
    // inline testid and the raw prose must be absent.
    expect(screen.queryByTestId('run-instructions-inline')).toBeNull()
    expect(screen.queryByText(/Four quick blocks/i)).toBeNull()
    // No instructions affordance either (the read is homed on the get-ready beat post-D167).
    expect(screen.queryByText(/Show .*instructions/i)).toBeNull()
  })

  it('keeps the inline read absent past segment 0 and in bonus territory', () => {
    for (const index of [1, SEGMENT_INDEX_BONUS]) {
      useRunControllerMock.mockReturnValue(controller(index))
      const { unmount } = renderRun()
      expect(screen.queryByTestId('run-instructions-inline')).toBeNull()
      expect(screen.queryByText(/Four quick blocks/i)).toBeNull()
      unmount()
    }
  })

  it('keeps the SegmentList visible across all states (load-bearing DO-CONFIRM read)', () => {
    for (const index of [0, 1, SEGMENT_INDEX_BONUS]) {
      useRunControllerMock.mockReturnValue(controller(index))
      const { unmount } = renderRun()
      expect(screen.getByRole('list', { name: 'Segments' })).toBeInTheDocument()
      unmount()
    }
  })

  it('offers a cue-only "Show more cues" disclosure that never reveals instructions (R16)', async () => {
    const user = userEvent.setup()
    useRunControllerMock.mockReturnValue(controller(0))
    renderRun()

    // SegmentList owns the active cue, so the block's coachingCue routes
    // to the cue-only disclosure (rule 12a). The label is the canonical
    // "Show more cues" — never "...and instructions".
    const summary = screen.getByText(/^Show more cues$/i)
    expect(screen.queryByText(/Show more cues and instructions/i)).toBeNull()

    await user.click(summary)

    const fullCue = within(summary.closest('details')!).getByLabelText(/Full coaching cue/i)
    expect(fullCue).toHaveTextContent('Short hops, loud feet.')
    expect(fullCue).not.toHaveTextContent(/Four quick blocks/i)
  })
})
