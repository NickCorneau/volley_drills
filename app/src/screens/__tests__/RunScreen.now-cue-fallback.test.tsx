import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RunScreen } from '../RunScreen'
import { useRunController } from '../run/useRunController'

// T2 (2026-06-22 shibui audit) U8: when the "Now" cue selector falls
// back to the drill name (no usable coaching cue, no single-line
// instruction), the drill name must appear only in the `h1` — the
// "Now" section is suppressed so the name is not stated twice on one
// surface. The selector (`selectNonSegmentedCurrentCue`) is unchanged;
// this pins the screen-level render guard. See plan
// `docs/plans/2026-06-22-005-refactor-t2-duplicate-facts-plan.md` U8.

vi.mock('../run/useRunController', () => ({
  useRunController: vi.fn(),
}))

const useRunControllerMock = vi.mocked(useRunController)

function renderRun() {
  return render(
    <MemoryRouter initialEntries={['/run?id=exec-now-fallback']}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

function controller(overrides: Partial<ReturnType<typeof useRunController>> = {}) {
  return {
    plan: {
      id: 'plan-now-fallback',
      presetId: 'solo_open',
      presetName: 'Solo + Open',
      playerCount: 1,
      blocks: [],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: Date.now(),
    },
    execution: {
      id: 'exec-now-fallback',
      planId: 'plan-now-fallback',
      status: 'in_progress',
      activeBlockIndex: 0,
      blockStatuses: [{ blockId: 'b-0', status: 'in_progress' }],
      startedAt: Date.now(),
    },
    loaded: true,
    currentBlock: {
      id: 'b-0',
      type: 'main_skill',
      drillName: 'Cross-Court Spike Repeat',
      shortName: 'Spike',
      durationMinutes: 5,
      // Blank coaching cue + a multi-line instruction body forces the
      // selector to fall back to the drill name for the "Now" cue.
      coachingCue: '',
      courtsideInstructions:
        'Hitter starts at the ten-foot line.\nSetter feeds a high ball.\nReset and repeat for the block.',
      required: true,
    },
    currentBlockIndex: 0,
    totalBlocks: 1,
    isPaused: false,
    activeDuration: 300,
    timer: {
      remainingSeconds: 240,
      isRunning: true,
      start: vi.fn(),
      pause: vi.fn(() => 240),
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
    currentSegmentIndex: 0,
    effectiveSegments: undefined,
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
    ...overrides,
  } satisfies ReturnType<typeof useRunController>
}

describe('RunScreen — drill name lives only in the h1 (T2 U8)', () => {
  beforeEach(() => {
    useRunControllerMock.mockReturnValue(controller())
  })

  it('suppresses the "Now" section when the cue falls back to the drill name', () => {
    renderRun()

    // The drill name is shown once, in the heading.
    expect(
      screen.getByRole('heading', { level: 1, name: 'Cross-Court Spike Repeat' }),
    ).toBeInTheDocument()

    // The "Now" section does not echo the drill name.
    expect(screen.queryByRole('region', { name: 'Now' })).toBeNull()
    expect(screen.queryByText(/^Now$/)).toBeNull()

    // The drill name appears exactly once on the surface.
    expect(screen.getAllByText('Cross-Court Spike Repeat')).toHaveLength(1)
  })

  it('shows no full-instructions read on Run for a cue-less block (R7b)', () => {
    renderRun()

    // Run-flow beat contract Stage 1 (R7b): a block with no coaching cue
    // has nothing to put behind "Show more cues", and the full
    // courtsideInstructions read is homed on Transition — so Run shows
    // neither a disclosure nor the instruction prose.
    expect(screen.queryByText(/Show full instructions/i)).toBeNull()
    expect(screen.queryByText(/Show more cues/i)).toBeNull()
    expect(screen.queryByLabelText(/Full drill instructions/i)).toBeNull()
    expect(screen.queryByText(/Hitter starts at the ten-foot line/i)).toBeNull()
  })

  it('still renders the "Now" section when a real coaching cue exists', () => {
    useRunControllerMock.mockReturnValue(
      controller({
        currentBlock: {
          id: 'b-0',
          type: 'main_skill',
          drillName: 'Cross-Court Spike Repeat',
          shortName: 'Spike',
          durationMinutes: 5,
          coachingCue: 'Snap the wrist over the ball.',
          courtsideInstructions: 'Hitter starts at the ten-foot line.',
          required: true,
        },
      }),
    )

    renderRun()

    const nowRegion = screen.getByRole('region', { name: 'Now' })
    expect(nowRegion).toHaveTextContent('Snap the wrist over the ball.')
  })
})
