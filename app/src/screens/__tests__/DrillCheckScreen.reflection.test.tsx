import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { DRILLS } from '../../data/drills'
import { getStressRung } from '../../data/stressLadders'
import { RUN_FLOW_LABELS } from '../../contracts/runFlowLexicon'
import type { BlockSlotType } from '../../types/session'
import { DrillCheckScreen } from '../DrillCheckScreen'

/**
 * D177 (M002.2 coaching-arc After beat): pull-to-reveal rung reflection
 * on Drill Check. Plan
 * `docs/plans/2026-07-04-001-feat-m002-2-drill-check-reflection-plan.md` U4.
 *
 * What this file pins:
 *   - On-ladder just-finished block → the collapsed "What did that
 *     train?" trigger renders below the capture block; the reflection
 *     line itself is NOT in the document until pulled (pull-not-push,
 *     D154). This is also the rendered-surface pin for the
 *     `RUN_FLOW_LABELS.reflect` lexicon entry (Drill Check is a new
 *     lexicon consumer; the cross-surface guard mounts only
 *     Transition + Run).
 *   - Tap → the authored rung `reflection` replaces the trigger
 *     (Disclosure's one-way contract) and receives programmatic focus
 *     so keyboard / SR users aren't dropped when the button unmounts.
 *   - The reflection never gates Continue: chip-only gating holds in
 *     both directions (revealed + no chip → still disabled; chip + never
 *     revealed → enabled).
 *   - Streak-shape blocks render BOTH pulls (streak drawer + reflection)
 *     without collision (origin AE4).
 *   - Off-ladder capture-eligible block (recovery drill in a main_skill
 *     slot) → no trigger at all, not a disabled/empty affordance.
 */

function drillById(id: string) {
  const drill = DRILLS.find((candidate) => candidate.id === id)
  if (!drill) throw new Error(`test fixture: missing drill ${id}`)
  return drill
}

function variantById(drill: (typeof DRILLS)[number], id: string) {
  const variant = drill.variants.find((candidate) => candidate.id === id)
  if (!variant) throw new Error(`test fixture: missing variant ${id}`)
  return variant
}

// d01 Pass & Slap Hands: pass rung 1, streak metric → main_skill slot
// gives difficulty-only + streak drawer + reflection (origin AE1/AE4).
const STREAK_DRILL = drillById('d01')
const STREAK_VARIANT = variantById(STREAK_DRILL, 'd01-solo')
// d10 The 6-Legged Monster: pass rung 3, pass-rate-good → count-eligible
// even in a technique support slot (no block-type gate on the arc).
const TECHNIQUE_COUNT_DRILL = drillById('d10')
const TECHNIQUE_COUNT_VARIANT = variantById(TECHNIQUE_COUNT_DRILL, 'd10-pair')
// d25 Downshift: recovery focus, completion metric → capture-eligible in
// a main_skill slot but off every ladder → no reflection affordance.
const OFF_LADDER_DRILL = drillById('d25')
const OFF_LADDER_VARIANT = variantById(OFF_LADDER_DRILL, 'd25-solo')

async function clearDb() {
  await Promise.all([
    db.sessionPlans.clear(),
    db.executionLogs.clear(),
    db.sessionReviews.clear(),
    db.timerState.clear(),
    db.sessionDrafts.clear(),
    db.storageMeta.clear(),
  ])
}

async function seedSession({
  prevType,
  prevDrill,
  prevVariant,
  playerCount,
}: {
  prevType: BlockSlotType
  prevDrill: (typeof DRILLS)[number]
  prevVariant: (typeof DRILLS)[number]['variants'][number]
  playerCount: 1 | 2
}) {
  const execId = 'exec-reflection-test'
  const planId = `plan-${execId}`
  const now = Date.now()

  await db.sessionPlans.put({
    id: planId,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount,
    blocks: [
      {
        id: 'block-prev',
        type: prevType,
        drillId: prevDrill.id,
        variantId: prevVariant.id,
        drillName: prevDrill.name,
        shortName: prevDrill.shortName ?? prevDrill.name,
        durationMinutes: 5,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
      {
        id: 'block-next',
        type: 'main_skill',
        drillId: TECHNIQUE_COUNT_DRILL.id,
        variantId: TECHNIQUE_COUNT_VARIANT.id,
        drillName: TECHNIQUE_COUNT_DRILL.name,
        shortName: TECHNIQUE_COUNT_DRILL.shortName ?? TECHNIQUE_COUNT_DRILL.name,
        durationMinutes: 8,
        coachingCue: '',
        courtsideInstructions: '',
        required: false,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })

  await db.executionLogs.put({
    id: execId,
    planId,
    status: 'in_progress',
    activeBlockIndex: 1,
    blockStatuses: [
      { blockId: 'block-prev', status: 'completed' },
      { blockId: 'block-next', status: 'planned' },
    ],
    startedAt: now - 10 * 60_000,
  })

  return execId
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/run/check?id=${execId}`]}>
      <Routes>
        <Route path="/run/check" element={<DrillCheckScreen />} />
        <Route path="/run" element={<div>RunScreen stub</div>} />
        <Route path="/review" element={<div>ReviewScreen stub</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

async function waitForCaptureCard() {
  await waitFor(() => {
    expect(screen.getByTestId('per-drill-capture')).toBeInTheDocument()
  })
}

beforeEach(async () => {
  await clearDb()
})

describe('DrillCheckScreen rung reflection (D177)', () => {
  it('renders the collapsed lexicon trigger, not the line, on an on-ladder block', async () => {
    const execId = await seedSession({
      prevType: 'main_skill',
      prevDrill: STREAK_DRILL,
      prevVariant: STREAK_VARIANT,
      playerCount: 1,
    })
    renderAt(execId)
    await waitForCaptureCard()

    const trigger = screen.getByTestId('drill-check-reflection-trigger')
    // Rendered-surface pin for RUN_FLOW_LABELS.reflect (new consumer).
    expect(trigger).toHaveTextContent(RUN_FLOW_LABELS.reflect)
    expect(trigger).toHaveTextContent('What did that train?')
    expect(screen.queryByTestId('drill-check-reflection')).not.toBeInTheDocument()

    // Placement pin: the pull sits BELOW the capture block so the
    // required ask stays focal (plan U4 / OQ2 resolution).
    const captureCard = screen.getByTestId('per-drill-capture')
    expect(
      captureCard.compareDocumentPosition(trigger) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    // Styling pin: the dotted underline is the read-pull vs input-pull
    // differentiator against the capture drawers' hover-underline pulls.
    expect(trigger.className).toContain('decoration-dotted')
  })

  it('reveals the authored rung reflection one-way and moves focus to it', async () => {
    const execId = await seedSession({
      prevType: 'main_skill',
      prevDrill: STREAK_DRILL,
      prevVariant: STREAK_VARIANT,
      playerCount: 1,
    })
    renderAt(execId)
    await waitForCaptureCard()

    fireEvent.click(screen.getByTestId('drill-check-reflection-trigger'))

    const line = screen.getByTestId('drill-check-reflection')
    expect(line).toHaveTextContent(getStressRung('pass', 1)!.reflection)
    // One-way Disclosure contract: the trigger is gone until unmount.
    expect(screen.queryByTestId('drill-check-reflection-trigger')).not.toBeInTheDocument()
    // A11y: focus follows the reveal so the unmounted button doesn't
    // strand keyboard / screen-reader users at <body>.
    await waitFor(() => {
      expect(line).toHaveFocus()
    })
  })

  it('never gates Continue: revealed without a chip stays disabled, chip without reveal enables', async () => {
    const execId = await seedSession({
      prevType: 'main_skill',
      prevDrill: STREAK_DRILL,
      prevVariant: STREAK_VARIANT,
      playerCount: 1,
    })
    renderAt(execId)
    await waitForCaptureCard()

    const continueButton = screen.getByRole('button', { name: /continue/i })

    // Direction 1: pulling the reflection satisfies nothing.
    fireEvent.click(screen.getByTestId('drill-check-reflection-trigger'))
    expect(continueButton).toBeDisabled()
    expect(screen.getByTestId('drill-check-gating-hint')).toBeInTheDocument()

    // Direction 2: the chip alone enables Continue; the reflection was
    // never part of the gate.
    fireEvent.click(screen.getByRole('radio', { name: /still learning/i }))
    await waitFor(() => {
      expect(continueButton).toBeEnabled()
    })
  })

  it('enables Continue via the chip alone when the reflection is never revealed', async () => {
    const execId = await seedSession({
      prevType: 'main_skill',
      prevDrill: STREAK_DRILL,
      prevVariant: STREAK_VARIANT,
      playerCount: 1,
    })
    renderAt(execId)
    await waitForCaptureCard()

    fireEvent.click(screen.getByRole('radio', { name: /still learning/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled()
    })
    // The pull was never touched: still collapsed, line never mounted.
    expect(screen.getByTestId('drill-check-reflection-trigger')).toBeInTheDocument()
    expect(screen.queryByTestId('drill-check-reflection')).not.toBeInTheDocument()
  })

  it('coexists with the streak drawer: both pulls render without collision (AE4)', async () => {
    const execId = await seedSession({
      prevType: 'main_skill',
      prevDrill: STREAK_DRILL,
      prevVariant: STREAK_VARIANT,
      playerCount: 1,
    })
    renderAt(execId)
    await waitForCaptureCard()

    expect(screen.getByTestId('per-drill-add-streak')).toBeInTheDocument()
    expect(screen.getByTestId('drill-check-reflection-trigger')).toBeInTheDocument()

    // Opening the streak drawer leaves the reflection pull collapsed and
    // untouched — independent Disclosures, independent state.
    fireEvent.click(screen.getByTestId('per-drill-add-streak'))
    expect(screen.getByTestId('drill-check-reflection-trigger')).toBeInTheDocument()
    expect(screen.queryByTestId('drill-check-reflection')).not.toBeInTheDocument()
  })

  it('keeps the revealed line mounted and does not re-steal focus when a drawer opens after it (AE4 reverse order)', async () => {
    const execId = await seedSession({
      prevType: 'main_skill',
      prevDrill: STREAK_DRILL,
      prevVariant: STREAK_VARIANT,
      playerCount: 1,
    })
    renderAt(execId)
    await waitForCaptureCard()

    // Reveal first, then open the streak drawer and type into it.
    fireEvent.click(screen.getByTestId('drill-check-reflection-trigger'))
    const line = screen.getByTestId('drill-check-reflection')
    await waitFor(() => {
      expect(line).toHaveFocus()
    })

    fireEvent.click(screen.getByTestId('per-drill-add-streak'))
    const streakInput = screen.getByLabelText(/longest streak/i)
    streakInput.focus()
    fireEvent.change(streakInput, { target: { value: '4' } })

    // The revealed line persists (same node, one-way contract holds
    // across sibling re-renders) and its mount-only focus effect does
    // not re-fire to steal focus from the input mid-entry.
    expect(screen.getByTestId('drill-check-reflection')).toBe(line)
    expect(streakInput).toHaveFocus()
  })

  it('renders the reflection on a count-eligible technique support slot (no block-type gate)', async () => {
    const execId = await seedSession({
      prevType: 'technique',
      prevDrill: TECHNIQUE_COUNT_DRILL,
      prevVariant: TECHNIQUE_COUNT_VARIANT,
      playerCount: 2,
    })
    renderAt(execId)
    await waitForCaptureCard()

    fireEvent.click(screen.getByTestId('drill-check-reflection-trigger'))
    expect(screen.getByTestId('drill-check-reflection')).toHaveTextContent(
      getStressRung('pass', 3)!.reflection,
    )
  })

  it('renders no affordance at all for an off-ladder capture-eligible block', async () => {
    const execId = await seedSession({
      prevType: 'main_skill',
      prevDrill: OFF_LADDER_DRILL,
      prevVariant: OFF_LADDER_VARIANT,
      playerCount: 1,
    })
    renderAt(execId)
    await waitForCaptureCard()

    expect(screen.queryByTestId('drill-check-reflection-trigger')).not.toBeInTheDocument()
    expect(screen.queryByTestId('drill-check-reflection')).not.toBeInTheDocument()
  })
})
