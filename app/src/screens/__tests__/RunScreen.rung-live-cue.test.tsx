import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RUN_FLOW_LABELS } from '../../contracts/runFlowLexicon'
import { DRILLS } from '../../data/drills'
import { getStressRung } from '../../data/stressLadders'
import type { SessionPlanBlock } from '../../model'
import { RunScreen } from '../RunScreen'
import { useRunController } from '../run/useRunController'

/**
 * M002.2 rung-aware live cue — screen-level wiring (plan
 * `docs/plans/2026-06-30-001-feat-m002-2-rung-aware-live-cue-plan.md` U4).
 *
 * `resolveBlockLiveCueOverride` (unit-tested in
 * `domain/__tests__/drillMetadata.liveCue.test.ts`) and the selector's
 * preferred-cue gate (`run/__tests__/currentCue.test.ts`) are proven in
 * isolation. This suite pins the RunScreen integration the units cannot see:
 *   1. an unguarded ladder block shows the rung's `externalFocusCue` on the
 *      live "Now" face in place of the drill's generic `coachingCues[0]`;
 *   2. R9 — the "Drill details" overlay leads its cue section with that live
 *      cue and never resurfaces the displaced `coachingCues[0]`, but still
 *      carries the drill's remaining cues;
 *   3. a guard-protected drill (d07's gaze cue) keeps its own `coachingCues[0]`
 *      live and never shows the rung cue;
 *   4. R4 "never grows a Now slot" — when today's chain would suppress the
 *      "Now" section (drill-name fallback), the override is withheld so it
 *      cannot mint a cue where none rendered.
 *
 * Fixtures are read from the real catalog so a future re-authoring of the
 * cues or the pass ladder fails these tests loudly rather than drifting.
 */

vi.mock('../run/useRunController', () => ({
  useRunController: vi.fn(),
}))

const useRunControllerMock = vi.mocked(useRunController)

// Pass rung 3 is d24's rung; its authored external-focus cue is the
// substitution winner (single clause, within CUE_COMPACT_MAX).
const PASS_RUNG_3_CUE = 'Pick the landing spot early and arrive before the ball does.'

const d24 = DRILLS.find((d) => d.id === 'd24')
const d24Cues = d24?.variants[0]?.coachingCues ?? []
const d07 = DRILLS.find((d) => d.id === 'd07')
const d07Cues = d07?.variants[0]?.coachingCues ?? []

function renderRun() {
  return render(
    <MemoryRouter initialEntries={['/run?id=exec-rung-cue']}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

function controller(
  block: Partial<SessionPlanBlock>,
  playerCount: 1 | 2 = 1,
): ReturnType<typeof useRunController> {
  return {
    plan: {
      id: 'plan-rung-cue',
      presetId: 'solo_open',
      presetName: 'Solo + Open',
      playerCount,
      blocks: [],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: Date.now(),
    },
    execution: {
      id: 'exec-rung-cue',
      planId: 'plan-rung-cue',
      status: 'in_progress',
      activeBlockIndex: 0,
      blockStatuses: [{ blockId: 'b-0', status: 'in_progress' }],
      startedAt: Date.now(),
    },
    loaded: true,
    currentBlock: {
      id: 'b-0',
      type: 'main_skill',
      drillName: 'Placeholder',
      shortName: 'Placeholder',
      durationMinutes: 5,
      coachingCue: '',
      courtsideInstructions: '',
      required: true,
      ...block,
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
    rungIntentLine: null,
    handleStart: vi.fn(),
    handleStartShortened: vi.fn(),
    handleEndSessionRequest: vi.fn(),
    handleEndSessionConfirm: vi.fn(async () => undefined),
    handleEndSessionCancel: vi.fn(async () => undefined),
  } satisfies ReturnType<typeof useRunController>
}

describe('RunScreen — rung-aware live cue (M002.2 U4)', () => {
  it('pins the fixtures against the live catalog', () => {
    // Guards the whole suite: if the pass ladder or d24/d07 copy is
    // re-authored, this fails first rather than the behavioral tests
    // silently testing the wrong strings.
    expect(getStressRung('pass', 3)?.externalFocusCue).toBe(PASS_RUNG_3_CUE)
    expect(d24Cues.length).toBeGreaterThan(1)
    expect(d24Cues[0]).not.toBe(PASS_RUNG_3_CUE)
    expect(d07Cues[0]).toBe("Look at your partner's hand the moment your platform meets the ball.")
  })

  it('substitutes the rung external-focus cue for the drill cue on the live face (d24)', () => {
    useRunControllerMock.mockReturnValue(
      controller({
        drillId: 'd24',
        variantId: 'd24-solo',
        drillName: 'Pass into a Corner',
        coachingCue: d24Cues.join(' · '),
        courtsideInstructions: 'Toss off the wall; pass to the corner target.',
      }),
    )

    renderRun()

    const nowRegion = screen.getByRole('region', { name: RUN_FLOW_LABELS.cue })
    expect(nowRegion).toHaveTextContent(PASS_RUNG_3_CUE)
    // The displaced generic cue is NOT on the live face.
    expect(screen.queryByText(d24Cues[0])).toBeNull()
  })

  it('leads the Drill details overlay with the live cue and drops the displaced cue[0] (R9)', () => {
    useRunControllerMock.mockReturnValue(
      controller({
        drillId: 'd24',
        variantId: 'd24-solo',
        drillName: 'Pass into a Corner',
        coachingCue: d24Cues.join(' · '),
        courtsideInstructions: 'Toss off the wall; pass to the corner target.',
      }),
    )

    renderRun()
    fireEvent.click(screen.getByRole('button', { name: RUN_FLOW_LABELS.peek }))

    const cuesSection = screen.getByRole('region', { name: 'Coaching cues' })
    const lines = Array.from(cuesSection.querySelectorAll('p')).map((p) => p.textContent)

    // Leads with the live cue…
    expect(lines[0]).toBe(PASS_RUNG_3_CUE)
    // …never resurfaces the displaced generic cue[0]…
    expect(lines).not.toContain(d24Cues[0])
    // …but keeps the drill's remaining cues.
    expect(lines).toContain(d24Cues[1])
    expect(lines).toContain(d24Cues[2])
  })

  it('keeps a guard-protected gaze cue live and never shows the rung cue (d07)', () => {
    useRunControllerMock.mockReturnValue(
      controller(
        {
          drillId: 'd07',
          variantId: 'd07-pair',
          drillName: 'Pass & Look',
          coachingCue: d07Cues.join(' · '),
          courtsideInstructions: 'Partner serves; flash a number on contact.',
        },
        2,
      ),
    )

    renderRun()

    const nowRegion = screen.getByRole('region', { name: RUN_FLOW_LABELS.cue })
    expect(nowRegion).toHaveTextContent(d07Cues[0])
    expect(screen.queryByText(PASS_RUNG_3_CUE)).toBeNull()

    // The overlay carries the drill's OWN cues (guard intact), not the rung cue.
    fireEvent.click(screen.getByRole('button', { name: RUN_FLOW_LABELS.peek }))
    const cuesSection = screen.getByRole('region', { name: 'Coaching cues' })
    const lines = Array.from(cuesSection.querySelectorAll('p')).map((p) => p.textContent)
    expect(lines[0]).toBe(d07Cues[0])
    expect(lines).not.toContain(PASS_RUNG_3_CUE)
  })

  it('never grows a Now slot: withholds the override when the base cue falls back to the drill name (R4)', () => {
    // Synthetic: an on-ladder drill (d24) with no coaching cue and a
    // multi-line read forces today's chain to the drill-name source, which
    // suppresses the "Now" section. The override must NOT mint a cue there.
    useRunControllerMock.mockReturnValue(
      controller({
        drillId: 'd24',
        variantId: 'd24-solo',
        drillName: 'Pass into a Corner',
        coachingCue: '',
        courtsideInstructions: 'Toss off the wall.\nMove and pass to the corner.',
      }),
    )

    renderRun()

    expect(screen.queryByRole('region', { name: RUN_FLOW_LABELS.cue })).toBeNull()
    expect(screen.queryByText(PASS_RUNG_3_CUE)).toBeNull()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Pass into a Corner' }),
    ).toBeInTheDocument()
  })
})
