import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RunScreen } from '../RunScreen'
import { useRunController } from '../run/useRunController'

vi.mock('../run/useRunController', () => ({
  useRunController: vi.fn(),
}))

const useRunControllerMock = vi.mocked(useRunController)

function renderRun() {
  return render(
    <MemoryRouter initialEntries={['/run?id=exec-end-intent']}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

function controller(overrides: Partial<ReturnType<typeof useRunController>> = {}) {
  return {
    plan: {
      id: 'plan-end-intent',
      presetId: 'solo_open',
      presetName: 'Solo + Open',
      playerCount: 1,
      blocks: [],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: Date.now(),
    },
    execution: {
      id: 'exec-end-intent',
      planId: 'plan-end-intent',
      status: 'in_progress',
      activeBlockIndex: 1,
      blockStatuses: [
        { blockId: 'b-0', status: 'completed', completedAt: Date.now() },
        { blockId: 'b-1', status: 'in_progress' },
      ],
      startedAt: Date.now(),
    },
    loaded: true,
    currentBlock: {
      id: 'b-1',
      type: 'main_skill',
      drillName: 'Self-Toss Pass',
      shortName: 'Pass',
      durationMinutes: 5,
      coachingCue: 'Quiet platform.',
      courtsideInstructions: 'Pass to target.',
      required: true,
    },
    currentBlockIndex: 1,
    totalBlocks: 2,
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
    showEndConfirm: true,
    canWrapSession: true,
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

// U2 (2026-06-11 session-truth plan): two-intent end sheet. Display
// contract pinned by the plan: "I'm done" is a non-danger affirmative
// rendered first, "Cut session short" carries the danger variant
// second, "Go back" stays the safe dismiss with initial focus.
describe('RunScreen two-intent end sheet', () => {
  it('offers done and cut-short with the non-early title when work is banked', () => {
    useRunControllerMock.mockReturnValue(controller())

    renderRun()

    expect(screen.getByRole('dialog', { name: /end session here\?/i })).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: /early/i })).toBeNull()
    expect(screen.getByRole('button', { name: /i.m done/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cut session short/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument()
  })

  // Covers AE1 (sheet half): done routes the wrap intent to the controller.
  it('routes done to the wrap intent', async () => {
    const user = userEvent.setup()
    const handleEndSessionConfirm = vi.fn(async () => undefined)
    useRunControllerMock.mockReturnValue(controller({ handleEndSessionConfirm }))

    renderRun()

    await user.click(screen.getByRole('button', { name: /i.m done/i }))

    expect(handleEndSessionConfirm).toHaveBeenCalledTimes(1)
    expect(handleEndSessionConfirm).toHaveBeenCalledWith('done')
  })

  // Covers AE2 (sheet half): cut short routes the abandonment intent.
  it('routes cut short to the cut_short intent', async () => {
    const user = userEvent.setup()
    const handleEndSessionConfirm = vi.fn(async () => undefined)
    useRunControllerMock.mockReturnValue(controller({ handleEndSessionConfirm }))

    renderRun()

    await user.click(screen.getByRole('button', { name: /cut session short/i }))

    expect(handleEndSessionConfirm).toHaveBeenCalledTimes(1)
    expect(handleEndSessionConfirm).toHaveBeenCalledWith('cut_short')
  })

  it('pins danger styling to cut short only and initial focus to Go back', () => {
    useRunControllerMock.mockReturnValue(controller())

    renderRun()

    const done = screen.getByRole('button', { name: /i.m done/i })
    const cutShort = screen.getByRole('button', { name: /cut session short/i })
    const goBack = screen.getByRole('button', { name: /go back/i })

    // Danger variant paints bg-warning-surface; the affirmative must not.
    expect(cutShort.className).toContain('bg-warning-surface')
    expect(done.className).not.toContain('bg-warning-surface')
    expect(goBack.className).not.toContain('bg-warning-surface')
    expect(document.activeElement).toBe(goBack)
  })

  it('keeps the single cut-short shape and early title with zero completed blocks', async () => {
    const user = userEvent.setup()
    const handleEndSessionConfirm = vi.fn(async () => undefined)
    useRunControllerMock.mockReturnValue(
      controller({
        canWrapSession: false,
        execution: {
          id: 'exec-end-intent',
          planId: 'plan-end-intent',
          status: 'in_progress',
          activeBlockIndex: 0,
          blockStatuses: [
            { blockId: 'b-0', status: 'in_progress' },
            { blockId: 'b-1', status: 'planned' },
          ],
          startedAt: Date.now(),
        },
        currentBlockIndex: 0,
        handleEndSessionConfirm,
      }),
    )

    renderRun()

    expect(screen.getByRole('dialog', { name: /end session early\?/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /i.m done/i })).toBeNull()

    await user.click(screen.getByRole('button', { name: /^end session$/i }))

    expect(handleEndSessionConfirm).toHaveBeenCalledWith('cut_short')
  })

  it('disables every action while an end intent is in flight', async () => {
    const user = userEvent.setup()
    let resolveConfirm: () => void = () => {}
    const handleEndSessionConfirm = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveConfirm = resolve
        }),
    )
    useRunControllerMock.mockReturnValue(controller({ handleEndSessionConfirm }))

    renderRun()

    const done = screen.getByRole('button', { name: /i.m done/i })
    await user.click(done)
    // Second intent while the first is in flight must not double-fire.
    await user.click(screen.getByRole('button', { name: /cut session short/i }))

    expect(handleEndSessionConfirm).toHaveBeenCalledTimes(1)
    expect(handleEndSessionConfirm).toHaveBeenCalledWith('done')
    expect(done).toBeDisabled()
    expect(screen.getByRole('button', { name: /cut session short/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /go back/i })).toBeDisabled()

    resolveConfirm()
    await waitFor(() => expect(done).not.toBeDisabled())
  })
})
