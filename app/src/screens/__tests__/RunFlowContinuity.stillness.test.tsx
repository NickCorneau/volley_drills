import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { DrillCheckScreen } from '../DrillCheckScreen'
import { RunScreen } from '../RunScreen'
import { TransitionScreen } from '../TransitionScreen'
import { useDrillCheckController } from '../drillCheck/useDrillCheckController'
import { useRunController } from '../run/useRunController'
import { useTransitionController } from '../transition/useTransitionController'

vi.mock('../run/useRunController', () => ({ useRunController: vi.fn() }))
vi.mock('../transition/useTransitionController', () => ({ useTransitionController: vi.fn() }))
vi.mock('../drillCheck/useDrillCheckController', () => ({ useDrillCheckController: vi.fn() }))

const useRunControllerMock = vi.mocked(useRunController)
const useTransitionControllerMock = vi.mocked(useTransitionController)
const useDrillCheckControllerMock = vi.mocked(useDrillCheckController)

/**
 * Run-flow beat contract Stage 3 (D166, R11) — continuity-by-stillness
 * guard. The felt "one instrument" continuity across the beat seams is
 * achieved by *stillness*, not animation: the forward drill title holds
 * one typography and one position from the Transition / Run get-ready
 * read straight into the live cockpit, so nothing visibly jumps. This
 * guard pins that invariant so a future typography tweak on one beat
 * (or an introduced motion utility on the title) fails loudly.
 *
 * Scope note — the hero title lives on the three *forward* beats that
 * present the upcoming/active drill as the focal `<h1>`: Transition, Run
 * get-ready, and Run live. Drill Check is the reflective beat; its focal
 * element is the capture question by design (its drill-name `<h1>` is
 * intentionally `sr-only`, D145), so it is asserted only for the shared
 * header, not the hero title.
 */
const DRILL = 'Serve Receive Ladder'
const HERO_TITLE_CLASS = 'text-xl font-semibold tracking-tight text-text-primary'
const SAFETY_LABEL = 'Safety information'

function runController(
  overrides: Partial<ReturnType<typeof useRunController>> = {},
): ReturnType<typeof useRunController> {
  return {
    plan: {
      id: 'plan-continuity',
      presetId: 'solo_open',
      presetName: 'Solo + Open',
      playerCount: 1,
      blocks: [],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: Date.now(),
    },
    execution: {
      id: 'exec-continuity',
      planId: 'plan-continuity',
      status: 'in_progress',
      activeBlockIndex: 1,
      blockStatuses: [
        { blockId: 'b-0', status: 'completed' },
        { blockId: 'b-1', status: 'in_progress' },
      ],
      startedAt: Date.now(),
    },
    loaded: true,
    currentBlock: {
      id: 'b-1',
      type: 'main_skill',
      drillName: DRILL,
      shortName: 'SR',
      durationMinutes: 6,
      coachingCue: 'Platform early',
      courtsideInstructions: 'Server feeds float serves.',
      required: true,
    },
    currentBlockIndex: 1,
    totalBlocks: 3,
    isPaused: false,
    activeDuration: 360,
    timer: {
      remainingSeconds: 360,
      isRunning: true,
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
    isGetReady: false,
    rungIntentLine: null,
    handleStart: vi.fn(),
    handleStartShortened: vi.fn(),
    handleEndSessionRequest: vi.fn(),
    handleEndSessionConfirm: vi.fn(async () => undefined),
    handleEndSessionCancel: vi.fn(async () => undefined),
    ...overrides,
  }
}

function transitionController(): ReturnType<typeof useTransitionController> {
  return {
    plan: {
      id: 'plan-continuity',
      presetId: 'solo_open',
      presetName: 'Solo + Open',
      playerCount: 1,
      blocks: [],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: Date.now(),
    },
    execution: {
      id: 'exec-continuity',
      planId: 'plan-continuity',
      status: 'in_progress',
      activeBlockIndex: 1,
      blockStatuses: [
        { blockId: 'b-0', status: 'completed' },
        { blockId: 'b-1', status: 'planned' },
      ],
      startedAt: Date.now(),
    },
    loaded: true,
    currentBlockIndex: 1,
    totalBlocks: 3,
    nextBlock: {
      id: 'b-1',
      type: 'main_skill',
      drillName: DRILL,
      shortName: 'SR',
      durationMinutes: 6,
      coachingCue: 'Platform early',
      courtsideInstructions: 'Server feeds float serves.',
      required: true,
    },
    rungIntentLine: null,
    skipError: null,
    swapError: null,
    hasAlternates: false,
    handleStartNext: vi.fn(),
    handleStartShortened: vi.fn(),
    handleSkip: vi.fn(),
    handleSwap: vi.fn(),
  }
}

function drillCheckController(): ReturnType<typeof useDrillCheckController> {
  return {
    plan: {
      id: 'plan-continuity',
      presetId: 'solo_open',
      presetName: 'Solo + Open',
      playerCount: 1,
      blocks: [],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: Date.now(),
    },
    execution: {
      id: 'exec-continuity',
      planId: 'plan-continuity',
      status: 'in_progress',
      activeBlockIndex: 1,
      blockStatuses: [
        { blockId: 'b-0', status: 'completed' },
        { blockId: 'b-1', status: 'planned' },
      ],
      startedAt: Date.now(),
    },
    loaded: true,
    totalBlocks: 3,
    prevBlockIdx: 0,
    captureTarget: {
      id: 'b-0',
      type: 'main_skill',
      drillName: DRILL,
      shortName: 'SR',
      durationMinutes: 6,
      coachingCue: 'Platform early',
      courtsideInstructions: 'Server feeds float serves.',
      required: true,
    },
    captureShape: { kind: 'none' },
    captureSuccessRule: null,
    // Null keeps the D177 reflection Disclosure out of this guard's DOM.
    // RUN_FLOW_LABELS.reflect is intentionally NOT asserted here: this
    // cross-surface guard walks the forward beats (Transition + Run);
    // Drill Check is a new lexicon consumer whose rendered pin lives in
    // DrillCheckScreen.reflection.test.tsx. Do not add `reflect` to any
    // sunset list on the strength of its absence from this file.
    reflectionLine: null,
    difficulty: null,
    setDifficulty: vi.fn(),
    captureGood: 0,
    setCaptureGood: vi.fn(),
    captureTotal: 0,
    setCaptureTotal: vi.fn(),
    captureNotCaptured: false,
    captureStreakLongest: null,
    setCaptureStreakLongest: vi.fn(),
    captureSaveError: null,
    hydrated: true,
    inputsHydrated: true,
    captureSatisfied: false,
    handleContinue: vi.fn(async () => undefined),
    toggleNotCaptured: vi.fn(),
  }
}

function mountRun() {
  return render(
    <MemoryRouter initialEntries={['/run?id=exec-continuity']}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

function mountTransition() {
  return render(
    <MemoryRouter initialEntries={['/run/transition?id=exec-continuity']}>
      <Routes>
        <Route path="/run/transition" element={<TransitionScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

function mountDrillCheck() {
  return render(
    <MemoryRouter initialEntries={['/run/check?id=exec-continuity']}>
      <Routes>
        <Route path="/run/check" element={<DrillCheckScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('run-flow continuity-by-stillness (Stage 3, R11)', () => {
  beforeEach(() => {
    useRunControllerMock.mockReset()
    useTransitionControllerMock.mockReset()
    useDrillCheckControllerMock.mockReset()
  })

  it('holds the hero drill title at one typography across Transition → Run get-ready → Run live', () => {
    const classes: string[] = []

    useTransitionControllerMock.mockReturnValue(transitionController())
    const t = mountTransition()
    classes.push(screen.getByRole('heading', { name: DRILL }).className)
    t.unmount()

    useRunControllerMock.mockReturnValue(runController({ isGetReady: true }))
    const g = mountRun()
    classes.push(screen.getByRole('heading', { name: DRILL }).className)
    g.unmount()

    useRunControllerMock.mockReturnValue(runController({ isGetReady: false }))
    const l = mountRun()
    classes.push(screen.getByRole('heading', { name: DRILL }).className)
    l.unmount()

    // One typography, no drift: every forward beat renders the title identically.
    expect(new Set(classes)).toEqual(new Set([HERO_TITLE_CLASS]))
  })

  it('introduces no motion/animation utility on the hero title (stillness, reduced-motion safe)', () => {
    const renderers: Array<() => void> = [
      () => useTransitionControllerMock.mockReturnValue(transitionController()),
      () => useRunControllerMock.mockReturnValue(runController({ isGetReady: true })),
      () => useRunControllerMock.mockReturnValue(runController({ isGetReady: false })),
    ]
    const mounts = [mountTransition, mountRun, mountRun]

    renderers.forEach((setMock, i) => {
      setMock()
      const view = mounts[i]!()
      const title = screen.getByRole('heading', { name: DRILL })
      expect(title.className).not.toMatch(/\b(animate-|transition\b|transition-|motion-)/)
      view.unmount()
    })
  })

  it('renders the same shared RunFlowHeader on all four run-flow beats', () => {
    useDrillCheckControllerMock.mockReturnValue(drillCheckController())
    const c = mountDrillCheck()
    expect(screen.getByRole('button', { name: SAFETY_LABEL })).toBeInTheDocument()
    c.unmount()

    useTransitionControllerMock.mockReturnValue(transitionController())
    const t = mountTransition()
    expect(screen.getByRole('button', { name: SAFETY_LABEL })).toBeInTheDocument()
    t.unmount()

    useRunControllerMock.mockReturnValue(runController({ isGetReady: true }))
    const g = mountRun()
    expect(screen.getByRole('button', { name: SAFETY_LABEL })).toBeInTheDocument()
    g.unmount()

    useRunControllerMock.mockReturnValue(runController({ isGetReady: false }))
    const l = mountRun()
    expect(screen.getByRole('button', { name: SAFETY_LABEL })).toBeInTheDocument()
    l.unmount()
  })
})
