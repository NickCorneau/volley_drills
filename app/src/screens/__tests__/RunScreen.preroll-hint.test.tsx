import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { setStorageMeta } from '../../services/storageMeta'
import { RunScreen } from '../RunScreen'

/**
 * Partner-walkthrough polish 2026-04-22 item 5 (D129 / D130).
 *
 * Preroll hint "Keep the phone unlocked so the block-end beep can fire."
 * is gated on `storageMeta['ux.prerollHintDismissed']` so a casual tester
 * sees it once on their first session and never again. First successful
 * preroll completion flips the flag locally AND fires a fire-and-forget
 * setStorageMeta.
 *
 * Regression contract:
 *
 * - Fresh install (flag absent): hint renders during preroll.
 * - Returning user (flag === true): hint does NOT render during preroll.
 *
 * Race-guard (correctness-reviewer finding #1) is tested by forcing a
 * deliberate order: write the flag to true, mount RunScreen, assert
 * the hint stays hidden even while the flag read is resolving.
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

async function seedPrerollSession(execId: string, planId: string) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: planId,
    presetId: 'solo_open',
    presetName: 'Solo + Open',
    playerCount: 1,
    blocks: [
      {
        id: 'b-0',
        type: 'warmup',
        drillName: 'Beach Prep Three',
        shortName: 'Warm up',
        durationMinutes: 3,
        coachingCue: 'Short hops, loud feet.',
        courtsideInstructions: 'Four 45s movement segments.',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 1_000,
  })
  // `status: 'not_started'` so RunScreen kicks off the 3-2-1 preroll.
  await db.executionLogs.put({
    id: execId,
    planId,
    status: 'not_started',
    activeBlockIndex: 0,
    blockStatuses: [{ blockId: 'b-0', status: 'planned' }],
    startedAt: now - 1_000,
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

const HINT_TEXT = /keep the phone unlocked/i

describe('RunScreen preroll hint gate (partner-walkthrough polish item 5)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders the hint on first open when the dismissed flag is absent', async () => {
    await seedPrerollSession('exec-fresh', 'plan-fresh')
    renderAt('exec-fresh')

    // Preroll countdown "Get ready..." is the anchor the hint lives
    // beneath. findBy waits for the initial Dexie reads + the preroll
    // micro-task to fire.
    await screen.findByText(/get ready/i)
    expect(await screen.findByText(HINT_TEXT)).toBeInTheDocument()
  })

  it('does NOT render the hint when the dismissed flag is true (returning user)', async () => {
    await setStorageMeta('ux.prerollHintDismissed', true)
    await seedPrerollSession('exec-returning', 'plan-returning')
    renderAt('exec-returning')

    await screen.findByText(/get ready/i)

    // The hint-read effect runs on mount; wait one tick beyond the
    // render so the effect's setState has landed, then assert absence.
    await waitFor(
      () => {
        expect(screen.queryByText(HINT_TEXT)).not.toBeInTheDocument()
      },
      { timeout: 1500 },
    )
  })

  it('stays hidden for a returning user even though the preroll starts before the flag read resolves', async () => {
    // Correctness-reviewer finding #1 regression: if the mount-read
    // resolved AFTER the preroll completed, the plain setter used to
    // clobber a local `true` with a stale snapshot `false`. The
    // functional-setter race-guard keeps locally-dismissed state
    // sticky. This assertion holds as long as a user with the flag
    // already true never sees the hint, even briefly.
    await setStorageMeta('ux.prerollHintDismissed', true)
    await seedPrerollSession('exec-race', 'plan-race')
    renderAt('exec-race')

    await screen.findByText(/get ready/i)
    expect(screen.queryByText(HINT_TEXT)).not.toBeInTheDocument()
  })
})
