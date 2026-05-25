import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RunScreen } from '../RunScreen'
import { useRunController } from '../run/useRunController'

vi.mock('../run/useRunController', () => ({
  useRunController: vi.fn(),
}))

const useRunControllerMock = vi.mocked(useRunController)

/**
 * 2026-05-25 H2 experiment (plan U7).
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
 * only while the user is at segment 0 (or paused at segment 0,
 * including preroll). Once `currentSegmentIndex > 0`, the paragraph
 * routes into the existing `<details>` affordance — the SegmentList
 * continues to carry the load-bearing read; the full paragraph stays
 * reachable behind a "Show full instructions" / "Show more cues and
 * instructions" summary but no longer competes for above-the-fold
 * attention.
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

describe('RunScreen H2 experiment — segmented-drill body density', () => {
  it('renders the inline courtsideInstructions paragraph at segment 0 (READ-DO context)', () => {
    useRunControllerMock.mockReturnValue(controller(0))
    renderRun()

    expect(screen.getByText(/Four quick blocks/i)).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Drill details' })).toBeNull()
    expect(screen.queryByText(/Show .*instructions/i)).toBeNull()
  })

  it('collapses the courtsideInstructions paragraph into <details> when past segment 0 (DO-CONFIRM density)', () => {
    useRunControllerMock.mockReturnValue(controller(1))
    renderRun()

    // The <details> summary is rendered as a button-like element with
    // the "Show more cues and instructions" label (because the warmup
    // drill has both an instructions overflow AND a coaching cue
    // overflow that doesn't match `currentCue` — SegmentList owns the
    // active cue, so coachingCue routes to detail too).
    expect(screen.getByText(/Show .*instructions/i)).toBeInTheDocument()

    // The inline paragraph is no longer in the open render tree (the
    // <details> is closed by default, so its content is in the DOM but
    // hidden — we assert against an element with the inline class
    // signature, not text content).
    const inlineParagraph = screen
      .queryAllByText(/Four quick blocks/i)
      .find((el) => el.tagName === 'P' && el.parentElement?.tagName === 'DIV')
    expect(inlineParagraph).toBeUndefined()
  })

  it('keeps the SegmentList visible in both states (load-bearing DO-CONFIRM read)', () => {
    useRunControllerMock.mockReturnValue(controller(0))
    const { unmount } = renderRun()
    expect(screen.getByRole('list', { name: 'Segments' })).toBeInTheDocument()
    unmount()

    useRunControllerMock.mockReturnValue(controller(1))
    renderRun()
    expect(screen.getByRole('list', { name: 'Segments' })).toBeInTheDocument()
  })
})
