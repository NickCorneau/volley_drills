import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { SessionPlanBlock } from '../../model'
import { RunScreen } from '../RunScreen'
import { useRunController } from '../run/useRunController'

vi.mock('../run/useRunController', () => ({
  useRunController: vi.fn(),
}))

const useRunControllerMock = vi.mocked(useRunController)

function renderRun() {
  return render(
    <MemoryRouter initialEntries={['/run?id=exec-run-face']}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

function controller(overrides: Partial<ReturnType<typeof useRunController>> = {}) {
  return {
    plan: {
      id: 'plan-run-face',
      presetId: 'solo_open',
      presetName: 'Solo + Open',
      playerCount: 1,
      blocks: [],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: Date.now(),
    },
    execution: {
      id: 'exec-run-face',
      planId: 'plan-run-face',
      status: 'in_progress',
      activeBlockIndex: 0,
      blockStatuses: [{ blockId: 'b-0', status: 'in_progress' }],
      startedAt: Date.now(),
    },
    loaded: true,
    currentBlock: {
      id: 'b-0',
      type: 'main_skill',
      drillName: 'Partner Passing',
      shortName: 'Pass',
      durationMinutes: 5,
      coachingCue:
        'Caller names short or deep · Partner shades the seam · Reset together before the next serve-receive ball',
      courtsideInstructions: 'One player serves easy balls. One player owns the call.',
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
    handleEndSessionRequest: vi.fn(),
    handleEndSessionConfirm: vi.fn(async () => undefined),
    handleEndSessionCancel: vi.fn(async () => undefined),
    ...overrides,
  } satisfies ReturnType<typeof useRunController>
}

describe('RunScreen Run Face v1', () => {
  beforeEach(() => {
    useRunControllerMock.mockReturnValue(controller())
  })

  it('renders one current cue and keeps full detail reachable inline', async () => {
    const user = userEvent.setup()
    renderRun()

    expect(screen.getByText(/^Now$/)).toBeInTheDocument()
    expect(screen.getByText('Caller names short or deep')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).toBeNull()
    const summary = screen.getByText(/Full instructions and cue/i)
    const details = summary.closest('details')
    expect(details).not.toHaveAttribute('open')

    await user.click(summary)

    expect(details).toHaveAttribute('open')
    expect(screen.getByLabelText(/Full coaching cue/i)).toBeVisible()
    expect(screen.getByLabelText(/Full coaching cue/i)).toHaveTextContent(
      'Caller names short or deep · Partner shades the seam',
    )
    expect(screen.getByLabelText(/Full drill instructions/i)).toBeVisible()
  })

  it('labels cue-only disclosure accurately for segmented blocks', async () => {
    const user = userEvent.setup()
    useRunControllerMock.mockReturnValue(
      controller({
        currentBlock: {
          id: 'b-0',
          type: 'warmup',
          drillName: 'Beach Prep Three',
          shortName: 'Warm up',
          durationMinutes: 3,
          coachingCue: 'Short hops, loud feet.',
          courtsideInstructions: 'Four quick blocks, ~45 s each.',
          required: true,
          segments: [{ id: 's-1', label: 'Jog or A-skip around your sand box.', durationSec: 45 }],
        },
        effectiveSegments: [
          { id: 's-1', label: 'Jog or A-skip around your sand box.', durationSec: 45 },
        ],
      }),
    )

    renderRun()

    const summary = screen.getByText(/Full coaching cue/i)
    expect(screen.queryByText(/Full instructions and cue/i)).toBeNull()

    await user.click(summary)

    expect(screen.getByLabelText(/Full coaching cue/i)).toBeVisible()
    expect(screen.getByLabelText(/Full coaching cue/i)).toHaveTextContent('Short hops, loud feet.')
  })

  it('shows run errors without hiding the cockpit controls', () => {
    useRunControllerMock.mockReturnValue(
      controller({
        runError: 'Pause, then resume or end session if this keeps happening.',
      }),
    )

    renderRun()

    expect(
      screen.getByText(/Pause, then resume or end session if this keeps happening/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(
      /Pause, then resume or end session if this keeps happening/i,
    )
    expect(screen.getByRole('timer', { name: /4:00 remaining/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('gives preroll countdown timer semantics', () => {
    useRunControllerMock.mockReturnValue(controller({ prerollCount: 3 }))

    renderRun()

    expect(screen.getByRole('timer', { name: /3 seconds until block starts/i })).toBeInTheDocument()
  })

  it('renders the end-session confirm as a focused, labelled dialog', () => {
    const handleEndSessionCancel = vi.fn()
    useRunControllerMock.mockReturnValue(
      controller({
        showEndConfirm: true,
        handleEndSessionCancel,
      }),
    )

    renderRun()

    expect(screen.getByRole('dialog', { name: /end session early/i })).toHaveAccessibleDescription(
      /blocks remaining/i,
    )
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /go back/i }))
  })

  it('keeps end-session confirm focus trapped and Escape cancels instead of ending', async () => {
    const user = userEvent.setup()
    const handleEndSessionCancel = vi.fn()
    const handleEndSessionConfirm = vi.fn(async () => undefined)
    useRunControllerMock.mockReturnValue(
      controller({
        showEndConfirm: true,
        handleEndSessionCancel,
        handleEndSessionConfirm,
      }),
    )

    renderRun()

    const goBack = screen.getByRole('button', { name: /go back/i })
    const endSession = screen.getByRole('button', { name: /^end session$/i })

    expect(document.activeElement).toBe(goBack)
    await user.tab()
    expect(document.activeElement).toBe(endSession)
    await user.tab()
    expect(document.activeElement).toBe(goBack)

    await user.keyboard('{Escape}')
    expect(handleEndSessionCancel).toHaveBeenCalledTimes(1)
    expect(handleEndSessionConfirm).not.toHaveBeenCalled()
  })

  it('keeps the existing Go back cancellation action', async () => {
    const user = userEvent.setup()
    const handleEndSessionCancel = vi.fn()
    useRunControllerMock.mockReturnValue(
      controller({
        showEndConfirm: true,
        handleEndSessionCancel,
      }),
    )

    renderRun()

    await user.click(screen.getByRole('button', { name: /go back/i }))
    expect(handleEndSessionCancel).toHaveBeenCalledTimes(1)
  })

  it('keeps the existing end-session confirmation action', async () => {
    const user = userEvent.setup()
    const handleEndSessionConfirm = vi.fn(async () => undefined)
    useRunControllerMock.mockReturnValue(
      controller({
        showEndConfirm: true,
        handleEndSessionConfirm,
      }),
    )

    renderRun()

    await user.click(screen.getByRole('button', { name: /^end session$/i }))
    expect(handleEndSessionConfirm).toHaveBeenCalledTimes(1)
  })

  it('guards against double-activating the end-session confirmation', async () => {
    const user = userEvent.setup()
    let resolveEndSession: () => void = () => {}
    const handleEndSessionConfirm = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveEndSession = resolve
        }),
    )
    useRunControllerMock.mockReturnValue(
      controller({
        showEndConfirm: true,
        handleEndSessionConfirm,
      }),
    )

    renderRun()

    const endSession = screen.getByRole('button', { name: /^end session$/i })
    await user.dblClick(endSession)

    expect(handleEndSessionConfirm).toHaveBeenCalledTimes(1)
    expect(endSession).toBeDisabled()

    resolveEndSession()
    await waitFor(() => expect(endSession).not.toBeDisabled())
  })

  it('ignores cancellation while end-session confirmation is in flight', async () => {
    const user = userEvent.setup()
    let resolveEndSession: () => void = () => {}
    const handleEndSessionCancel = vi.fn()
    const handleEndSessionConfirm = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveEndSession = resolve
        }),
    )
    useRunControllerMock.mockReturnValue(
      controller({
        showEndConfirm: true,
        handleEndSessionCancel,
        handleEndSessionConfirm,
      }),
    )

    renderRun()

    const endSession = screen.getByRole('button', { name: /^end session$/i })
    await user.click(endSession)
    await user.keyboard('{Escape}')

    expect(handleEndSessionConfirm).toHaveBeenCalledTimes(1)
    expect(handleEndSessionCancel).not.toHaveBeenCalled()

    resolveEndSession()
    await waitFor(() => expect(endSession).not.toBeDisabled())
  })

  it('preserves wrap-block end-session copy', () => {
    const wrapBlock = {
      id: 'b-wrap',
      type: 'wrap',
      drillName: 'Downshift Walk',
      shortName: 'Walk',
      durationMinutes: 3,
      coachingCue: 'Breathe easy.',
      courtsideInstructions: 'Walk and let your heart rate settle.',
      required: true,
    } satisfies SessionPlanBlock

    useRunControllerMock.mockReturnValue(
      controller({
        showEndConfirm: true,
        currentBlock: wrapBlock,
      }),
    )

    renderRun()

    expect(screen.getByRole('dialog', { name: /end session early/i })).toHaveAccessibleDescription(
      /downshift/i,
    )
  })
})
