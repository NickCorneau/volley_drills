import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { RunScreen } from '../RunScreen'

/**
 * Partner-walkthrough pass 2026-04-21 (P1-11): rationale was rendered
 * BELOW the coaching-cue toggle at `text-xs` (12 px). Seb merged it
 * with the coach-cue cluster on first read.
 *
 * Fix: relocate rationale above `courtsideInstructions` as a subtitle
 * under the drill name, and honor the outdoor-UI brief 16 px body
 * floor. This test pins both invariants so a regression can't silently
 * drop rationale back into the cue region or below the floor.
 *
 * See `docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md`
 * row P1-11 and `docs/research/outdoor-courtside-ui-brief.md` §Freeze Now.
 */

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

async function seedPausedSession(execId: string, planId: string) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: planId,
    presetId: 'solo_open',
    presetName: 'Solo + Open',
    playerCount: 1,
    blocks: [
      {
        id: 'b-0',
        type: 'main_skill',
        drillName: 'Passing',
        shortName: 'Pass',
        durationMinutes: 5,
        coachingCue: 'Athletic posture.',
        courtsideInstructions: 'Self-toss; forearm pass up and down.',
        rationale: "Chosen because: today's main pass rep.",
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId,
    status: 'paused',
    activeBlockIndex: 0,
    blockStatuses: [{ blockId: 'b-0', status: 'in_progress' }],
    startedAt: now - 30_000,
    pausedAt: now - 5_000,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/run?id=${execId}`]}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RunScreen: rationale placement + typography (P1-11 / walkthrough 2026-04-21)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders rationale BEFORE courtsideInstructions in DOM order', async () => {
    await seedPausedSession('exec-ratio', 'plan-ratio')
    renderAt('exec-ratio')

    const rationale = await screen.findByText(
      /Chosen because: today's main pass rep\./i,
    )
    const instructions = await screen.findByText(
      /Self-toss; forearm pass up and down\./i,
    )

    // `compareDocumentPosition` returns DOCUMENT_POSITION_FOLLOWING (4)
    // when the reference node follows the argument in document order.
    // Rationale must precede instructions.
    expect(
      rationale.compareDocumentPosition(instructions) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('rationale uses text-sm (not text-xs / not legacy 16px scale)', async () => {
    await seedPausedSession('exec-size', 'plan-size')
    renderAt('exec-size')

    const rationale = await screen.findByText(
      /Chosen because: today's main pass rep\./i,
    )

    // Tailwind class-presence: rationale is secondary body; ships at
    // `text-sm` (founder 2026-04-22 downshift from 16 px / text-base).
    expect(rationale.className).toContain('text-sm')
    expect(rationale.className).not.toContain('text-xs')
    expect(rationale.className).not.toContain('text-base')
  })

  it('courtsideInstructions renders at text-base (16 px outdoor floor); Transition uses text-sm preview + collapse', async () => {
    await seedPausedSession('exec-instr', 'plan-instr')
    renderAt('exec-instr')

    const instructions = await screen.findByText(
      /Self-toss; forearm pass up and down\./i,
    )

    // Run keeps 16 px for courtsideInstructions during the block.
    // TransitionScreen (2026-04-22) uses a smaller preview + optional
    // "Show full prep" so long wrap lists do not bury the CTA stack.
    expect(instructions.className).toContain('text-base')
    expect(instructions.className).not.toContain('text-lg')
    expect(instructions.className).not.toContain('text-sm')
    expect(instructions.className).not.toContain('text-xs')
  })

  it('coachingCue renders at text-base (16 px outdoor floor)', async () => {
    await seedPausedSession('exec-cue-size', 'plan-cue-size')
    renderAt('exec-cue-size')

    // Short compact cue: full text is always shown in the coaching card
    // (no expand). Same round-2 downshift rationale as
    // courtsideInstructions above — run-mode body type unified at
    // `text-base` across all three run-card paragraphs (rationale,
    // instructions, coaching cue) so the screen reads as one
    // consistent voice rather than three escalating sizes.
    const cue = await screen.findByText(/Athletic posture\./i)
    expect(cue.className).toContain('text-base')
    expect(cue.className).not.toContain('text-lg')
    expect(cue.className).not.toContain('text-sm')
    expect(cue.className).not.toContain('text-xs')
  })
})
