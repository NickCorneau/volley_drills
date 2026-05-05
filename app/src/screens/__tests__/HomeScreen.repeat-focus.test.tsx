import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { HomeScreen } from '../HomeScreen'

/**
 * 2026-04-30 focus policy regression guard.
 *
 * Full Repeat ("Repeat last session") carries the prior plan's
 * `context.sessionFocus` forward — "same conditions" includes
 * yesterday's chosen focus. The user can still override on
 * Tune today before continuing.
 *
 * Partial Repeat ("Repeat shorter version") preserves the completed
 * blocks' plan context, focus included; see `buildDraftFromCompletedBlocks`.
 *
 * If a future change tries to strip focus from full Repeat, this
 * test should fail loudly so the policy decision gets re-litigated
 * instead of silently flipping.
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

async function seedFocusedLastComplete() {
  const completedAt = Date.now() - 2 * 24 * 60 * 60 * 1000
  await db.sessionPlans.put({
    id: 'plan-focused',
    presetId: 'pair_net',
    presetName: 'Pair + Net',
    playerCount: 2,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: completedAt - 60_000,
    context: {
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: true,
      wallAvailable: false,
      sessionFocus: 'serve',
    },
  })
  await db.executionLogs.put({
    id: 'exec-focused',
    planId: 'plan-focused',
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: completedAt - 25 * 60_000,
    completedAt,
  })
  await db.sessionReviews.put({
    id: 'review-exec-focused',
    executionLogId: 'exec-focused',
    sessionRpe: 6,
    goodPasses: 8,
    totalAttempts: 12,
    submittedAt: completedAt,
    status: 'submitted',
  })
}

function renderHome() {
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/tune-today" element={<div data-testid="tune-route">tune</div>} />
        <Route path="/setup" element={<div data-testid="setup-route">setup</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('HomeScreen full Repeat carries prior session focus', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('Repeat last session preserves sessionFocus on the rebuilt draft', async () => {
    const user = userEvent.setup()
    await seedFocusedLastComplete()
    renderHome()

    await user.click(
      await screen.findByRole('button', { name: /repeat last session/i }),
    )

    expect(await screen.findByTestId('tune-route')).toBeInTheDocument()

    const draft = await db.sessionDrafts.get('current')
    expect(draft).toBeDefined()
    expect(draft!.context.sessionFocus).toBe('serve')
    expect(draft!.context.playerMode).toBe('pair')
    expect(draft!.context.netAvailable).toBe(true)
  })

  it('Repeat last session applies the persisted onboarding skill level to legacy plan context', async () => {
    const user = userEvent.setup()
    await seedFocusedLastComplete()
    await db.storageMeta.put({
      key: 'onboarding.skillLevel',
      value: 'competitive_pair',
      updatedAt: Date.now(),
    })
    renderHome()

    await user.click(
      await screen.findByRole('button', { name: /repeat last session/i }),
    )

    expect(await screen.findByTestId('tune-route')).toBeInTheDocument()

    const draft = await db.sessionDrafts.get('current')
    expect(draft?.context.playerLevel).toBe('advanced')
    expect(draft?.blocks.map((block) => block.drillId)).not.toContain('d31')
  })
})
