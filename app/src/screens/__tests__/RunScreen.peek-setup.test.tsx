import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RUN_FLOW_LABELS } from '../../contracts/runFlowLexicon'
import type { SessionPlanBlock } from '../../model'
import { RunScreen } from '../RunScreen'
import { useRunController } from '../run/useRunController'

vi.mock('../run/useRunController', () => ({
  useRunController: vi.fn(),
}))

const useRunControllerMock = vi.mocked(useRunController)

/**
 * Run-flow beat contract Stage 2 (D165, R8/R9/R10/R16): the recovery
 * "Drill details" affordance on Run (2026-06-29 founder merge of the old
 * "Show more cues" + "Peek setup" controls into one). This file pins the
 * read-only path: a single-cue block carries just the setup read, so the
 * overlay shows the read alone.
 *
 * Stage 1 removed the inline full read from the live face on purpose; this
 * stage adds a one-touch overlay to recover it mid-rep WITHOUT a second
 * full-weight home and WITHOUT pausing the block timer. The load-bearing,
 * mutation-checked assertions are negative-today:
 *   - the read is ABSENT from the live face by default (Stage-1 invariant),
 *   - opening the overlay NEVER pauses the timer (no pause path is called).
 * Each must go red if the behavior regresses.
 */

const SETUP_READ = 'Feed yourself a high toss and return five clean balls before you rotate.'

const RUNNING_BLOCK: SessionPlanBlock = {
  id: 'b-0',
  type: 'main_skill',
  drillName: 'Pass Back and Forth',
  shortName: 'Pass',
  durationMinutes: 5,
  coachingCue: 'Same height every pass.',
  courtsideInstructions: SETUP_READ,
  required: true,
}

function controller(
  overrides: Partial<ReturnType<typeof useRunController>> = {},
): ReturnType<typeof useRunController> {
  return {
    plan: {
      id: 'plan-peek',
      presetId: 'solo_open',
      presetName: 'Solo + Open',
      playerCount: 1,
      blocks: [],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: Date.now(),
    },
    execution: {
      id: 'exec-peek',
      planId: 'plan-peek',
      status: 'in_progress',
      activeBlockIndex: 0,
      blockStatuses: [{ blockId: 'b-0', status: 'in_progress' }],
      startedAt: Date.now(),
    },
    loaded: true,
    currentBlock: RUNNING_BLOCK,
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
    rungIntentLine: null,
    handleStart: vi.fn(),
    handleStartShortened: vi.fn(),
    handleEndSessionRequest: vi.fn(),
    handleEndSessionConfirm: vi.fn(async () => undefined),
    handleEndSessionCancel: vi.fn(async () => undefined),
    ...overrides,
  } satisfies ReturnType<typeof useRunController>
}

function renderRun() {
  return render(
    <MemoryRouter initialEntries={['/run?id=exec-peek']}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RunScreen — Stage 2 recovery overlay / Drill details (D165)', () => {
  beforeEach(() => {
    useRunControllerMock.mockReturnValue(controller())
  })

  it('offers a deliberate "Drill details" trigger when the block carries a setup read', () => {
    renderRun()
    expect(screen.getByRole('button', { name: RUN_FLOW_LABELS.peek })).toBeInTheDocument()
  })

  it('keeps the full read off the live face by default (Stage-1 invariant preserved)', () => {
    renderRun()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByText(SETUP_READ)).toBeNull()
  })

  it('omits the trigger when the block has no setup read to recover', () => {
    useRunControllerMock.mockReturnValue(
      controller({ currentBlock: { ...RUNNING_BLOCK, courtsideInstructions: '   ' } }),
    )
    renderRun()
    expect(screen.queryByRole('button', { name: RUN_FLOW_LABELS.peek })).toBeNull()
  })

  it('overlays the full read on tap and dismisses back to the cockpit', async () => {
    const user = userEvent.setup()
    renderRun()

    await user.click(screen.getByRole('button', { name: RUN_FLOW_LABELS.peek }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent(SETUP_READ)
    // The overlay is anchored to the drill it recovers.
    expect(within(dialog).getByRole('heading', { name: RUNNING_BLOCK.drillName })).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: RUN_FLOW_LABELS.peekClose }))

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByText(SETUP_READ)).toBeNull()
  })

  it('dismisses the overlay on Escape', async () => {
    const user = userEvent.setup()
    renderRun()

    await user.click(screen.getByRole('button', { name: RUN_FLOW_LABELS.peek }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('never pauses the block timer while the details overlay is open (R9)', async () => {
    const user = userEvent.setup()
    const pause = vi.fn(() => 240)
    const handlePause = vi.fn()
    useRunControllerMock.mockReturnValue(
      controller({
        handlePause,
        timer: {
          remainingSeconds: 240,
          isRunning: true,
          start: vi.fn(),
          pause,
          resume: vi.fn(),
          reset: vi.fn(),
          adjustRemaining: vi.fn(),
        },
      }),
    )
    renderRun()

    await user.click(screen.getByRole('button', { name: RUN_FLOW_LABELS.peek }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // The cockpit underneath stays in its running state — no Paused indicator
    // surfaces and no pause path fires from opening or closing the overlay.
    expect(screen.queryByText('Paused')).toBeNull()

    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: RUN_FLOW_LABELS.peekClose }))

    expect(pause).not.toHaveBeenCalled()
    expect(handlePause).not.toHaveBeenCalled()
  })
})
