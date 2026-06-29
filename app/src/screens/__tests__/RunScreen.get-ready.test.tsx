import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RUN_FLOW_LABELS } from '../../contracts/runFlowLexicon'
import { RunScreen } from '../RunScreen'
import { useRunController } from '../run/useRunController'

vi.mock('../run/useRunController', () => ({
  useRunController: vi.fn(),
}))

const useRunControllerMock = vi.mocked(useRunController)

function renderRun() {
  return render(
    <MemoryRouter initialEntries={['/run?id=exec-get-ready']}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

/**
 * U4 — the Run get-ready beat UI (run-flow beat contract Stage 4, D167,
 * R13/R15). The controller is mocked so these specs pin the rendered
 * surface in isolation: read-first body (receipt + title + block-opening
 * intent + full setup read) and the calm decide footer (Start dominant,
 * Shorten always CTA-width, Swap/Skip behind a cancelable Adjust).
 * Preroll-gating + which blocks land here is covered by
 * `run/__tests__/useRunController.test.tsx`.
 */
function controller(overrides: Partial<ReturnType<typeof useRunController>> = {}) {
  return {
    plan: {
      id: 'plan-get-ready',
      presetId: 'solo_open',
      presetName: 'Solo + Open',
      playerCount: 1,
      blocks: [],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: Date.now(),
    },
    execution: {
      id: 'exec-get-ready',
      planId: 'plan-get-ready',
      status: 'in_progress',
      activeBlockIndex: 1,
      blockStatuses: [
        { blockId: 'b-0', status: 'completed' },
        { blockId: 'b-1', status: 'planned' },
      ],
      startedAt: Date.now(),
    },
    loaded: true,
    currentBlock: {
      id: 'b-1',
      type: 'main_skill',
      drillName: 'Serve Receive Ladder',
      shortName: 'SR',
      durationMinutes: 6,
      coachingCue: 'Platform early · Angle to target',
      courtsideInstructions: 'Server feeds float serves. Passer holds a still platform to the setter.',
      required: true,
    },
    currentBlockIndex: 1,
    totalBlocks: 3,
    isPaused: false,
    activeDuration: 360,
    timer: {
      remainingSeconds: 360,
      isRunning: false,
      start: vi.fn(),
      pause: vi.fn(() => 360),
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
    isGetReady: true,
    prevBlock: {
      id: 'b-0',
      type: 'warmup',
      drillName: 'Movement Prep',
      shortName: 'Prep',
      durationMinutes: 4,
      coachingCue: 'Light feet',
      courtsideInstructions: 'Jog, then dynamic reaches.',
      required: false,
    },
    prevBlockStatus: { blockId: 'b-0', status: 'completed' },
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

describe('RunScreen get-ready beat (Stage 4, U4)', () => {
  beforeEach(() => {
    useRunControllerMock.mockReset()
  })

  it('renders a read-first body: title, upcoming duration, full setup read, and the Next: counter', () => {
    useRunControllerMock.mockReturnValue(controller())
    renderRun()

    expect(screen.getByRole('heading', { name: 'Serve Receive Ladder' })).toBeInTheDocument()
    expect(
      screen.getByText(/Server feeds float serves\. Passer holds a still platform/),
    ).toBeInTheDocument()
    // 2026-06-29 continuity restore: the shared RunFlowHeader counter carries
    // the `Next:` prefix on get-ready (mirrors the former Transition counter)
    // so it pairs with Drill Check's `Last: N/M`; the live beat keeps `N/M`.
    expect(screen.getByText('Next: 2/3')).toBeInTheDocument()
    // The upcoming-block duration is restored near the title cluster.
    expect(screen.getByText('6 min')).toBeInTheDocument()
    // The live one-cue ("Now") and its recovery peek belong to the live beat only.
    expect(screen.queryByText(RUN_FLOW_LABELS.cue)).toBeNull()
    expect(screen.queryByText(RUN_FLOW_LABELS.peek)).toBeNull()
  })

  it('keeps the live (DO-CONFIRM) beat counter bare — no Next: prefix, no duration line', () => {
    useRunControllerMock.mockReturnValue(controller({ isGetReady: false }))
    renderRun()

    expect(screen.getByText('2/3')).toBeInTheDocument()
    expect(screen.queryByText('Next: 2/3')).toBeNull()
    // The duration line is a get-ready orientation aid; the live cockpit owns
    // the running clock (BlockTimer) and does not restate the planned length.
    expect(screen.queryByText('6 min')).toBeNull()
  })

  it('Start is the dominant CTA and fires handleStart (not the shortened start)', async () => {
    const handleStart = vi.fn()
    const handleStartShortened = vi.fn()
    useRunControllerMock.mockReturnValue(controller({ handleStart, handleStartShortened }))
    renderRun()

    await userEvent.click(screen.getByRole('button', { name: RUN_FLOW_LABELS.startAction }))

    expect(handleStart).toHaveBeenCalledTimes(1)
    expect(handleStartShortened).not.toHaveBeenCalled()
  })

  it('Shorten stays at CTA width and fires the shortened start', async () => {
    const handleStart = vi.fn()
    const handleStartShortened = vi.fn()
    useRunControllerMock.mockReturnValue(controller({ handleStart, handleStartShortened }))
    renderRun()

    await userEvent.click(screen.getByRole('button', { name: RUN_FLOW_LABELS.shortenFull }))

    expect(handleStartShortened).toHaveBeenCalledTimes(1)
    expect(handleStart).not.toHaveBeenCalled()
  })

  it('shows the block-opening intent only when the controller supplies it', () => {
    useRunControllerMock.mockReturnValue(controller({ rungIntentLine: null }))
    const { rerender } = renderRun()
    expect(screen.queryByText('Adds a defender so reads stay honest')).toBeNull()

    useRunControllerMock.mockReturnValue(
      controller({ rungIntentLine: 'Adds a defender so reads stay honest' }),
    )
    rerender(
      <MemoryRouter initialEntries={['/run?id=exec-get-ready']}>
        <Routes>
          <Route path="/run" element={<RunScreen />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Adds a defender so reads stay honest')).toBeInTheDocument()
  })

  it('carries the just-finished receipt only when the controller dedup flag is set (R12)', () => {
    useRunControllerMock.mockReturnValue(controller({ showJustFinishedReceipt: false }))
    const { rerender } = renderRun()
    expect(screen.queryByText(/Movement Prep · Complete/)).toBeNull()

    useRunControllerMock.mockReturnValue(controller({ showJustFinishedReceipt: true }))
    rerender(
      <MemoryRouter initialEntries={['/run?id=exec-get-ready']}>
        <Routes>
          <Route path="/run" element={<RunScreen />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/Movement Prep · Complete/)).toBeInTheDocument()
  })

  it('keeps Swap / Skip behind a cancelable Adjust disclosure', async () => {
    useRunControllerMock.mockReturnValue(
      controller({
        hasAlternates: true,
        currentBlock: {
          id: 'b-1',
          type: 'main_skill',
          drillName: 'Serve Receive Ladder',
          shortName: 'SR',
          durationMinutes: 6,
          coachingCue: 'Platform early',
          courtsideInstructions: 'Server feeds float serves.',
          required: false,
        },
      }),
    )
    renderRun()

    // Collapsed by default: Swap / Skip are not in the footer yet.
    expect(screen.queryByRole('button', { name: RUN_FLOW_LABELS.swap })).toBeNull()
    expect(screen.queryByRole('button', { name: RUN_FLOW_LABELS.skip })).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: RUN_FLOW_LABELS.adjust }))
    expect(screen.getByRole('button', { name: RUN_FLOW_LABELS.swap })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: RUN_FLOW_LABELS.skip })).toBeInTheDocument()

    // Cancelable: tapping Adjust again re-collapses.
    await userEvent.click(screen.getByRole('button', { name: RUN_FLOW_LABELS.adjust }))
    expect(screen.queryByRole('button', { name: RUN_FLOW_LABELS.swap })).toBeNull()
    expect(screen.queryByRole('button', { name: RUN_FLOW_LABELS.skip })).toBeNull()
  })

  it('hides the Adjust disclosure when there is nothing to adjust (required block, no alternates)', () => {
    useRunControllerMock.mockReturnValue(controller({ hasAlternates: false }))
    renderRun()

    expect(screen.queryByRole('button', { name: RUN_FLOW_LABELS.adjust })).toBeNull()
  })
})
