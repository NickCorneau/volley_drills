import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { buildDraft } from '../../domain/sessionBuilder'
import { REPEAT_DRIFT_NOTE } from '../../domain/adaptation/steeringTrace'
import { saveDraft } from '../../services/session'
import { HomeScreen } from '../HomeScreen'

/**
 * Trust-loop U5 (R8/KTD7) — the Home repeat note: one quiet line beside
 * the Repeat affordance when the repeated plan's focus position moved
 * since that session was assembled. Fold semantics are pinned in the
 * domain suite (`repeatPlanDrifted`); this file pins the rendered
 * surface — the note tracks actual drift, never accept count, and rides
 * with whichever surface hosts the active Repeat affordance.
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

const COMPLETED_AT = Date.now() - 2 * 24 * 60 * 60 * 1000

async function seedLastComplete(opts: { verdict?: 'accepted' | 'kept_original' } = {}) {
  await db.sessionPlans.put({
    id: 'plan-lc',
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: COMPLETED_AT - 60_000,
    context: {
      playerMode: 'solo',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: true,
      sessionFocus: 'serve',
    },
  })
  await db.executionLogs.put({
    id: 'exec-lc',
    planId: 'plan-lc',
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: COMPLETED_AT - 25 * 60_000,
    completedAt: COMPLETED_AT,
  })
  await db.sessionReviews.put({
    id: 'review-exec-lc',
    executionLogId: 'exec-lc',
    sessionRpe: 6,
    goodPasses: 8,
    totalAttempts: 12,
    submittedAt: COMPLETED_AT,
    status: 'submitted',
    // The review of the repeated session itself: when accepted, the
    // serve position moved AFTER the plan's createdAt — exactly the
    // drift the note reports.
    ...(opts.verdict
      ? {
          offeredDelta: { kind: 'stress' as const, focus: 'serve' as const, direction: 'more' as const },
          verdictChoice: opts.verdict,
        }
      : {}),
  })
}

function renderHome() {
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/safety" element={<div data-testid="safety-route">safety</div>} />
        <Route path="/setup" element={<div data-testid="setup-route">setup</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('HomeScreen repeat note (trust-loop U5)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders the note on the last-complete card when the position moved since assembly (AE4)', async () => {
    await seedLastComplete({ verdict: 'accepted' })
    renderHome()

    await screen.findByRole('button', { name: /repeat last session/i })
    expect(screen.getByText(REPEAT_DRIFT_NOTE)).toBeInTheDocument()
  })

  it('renders no note when nothing moved since assembly (AE4)', async () => {
    await seedLastComplete()
    renderHome()

    await screen.findByRole('button', { name: /repeat last session/i })
    expect(screen.queryByText(REPEAT_DRIFT_NOTE)).not.toBeInTheDocument()
  })

  it('renders no note for a declined offer — drift tracks movement, not verdict rows', async () => {
    await seedLastComplete({ verdict: 'kept_original' })
    renderHome()

    await screen.findByRole('button', { name: /repeat last session/i })
    expect(screen.queryByText(REPEAT_DRIFT_NOTE)).not.toBeInTheDocument()
  })

  it('rides with the secondary Repeat row when a draft owns the primary card', async () => {
    await seedLastComplete({ verdict: 'accepted' })
    const draft = buildDraft({
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    })
    if (!draft) throw new Error('test fixture: buildDraft returned null')
    await saveDraft(draft)

    renderHome()

    // Draft takes the primary card; the Repeat affordance demotes to
    // the secondary row and the note rides with it.
    await screen.findByRole('button', { name: /^repeat$/i })
    expect(screen.getByText(REPEAT_DRIFT_NOTE)).toBeInTheDocument()
  })
})
