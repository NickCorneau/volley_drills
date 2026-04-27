import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { FINISH_LATER_CAP_MS } from '../../services/review'
import { ReviewScreen } from '../ReviewScreen'

/**
 * A9 (red-team fix plan v3 §A9 / H16): CompleteScreen is the universal
 * post-session landing. A past-cap load on ReviewScreen auto-routes to
 * /complete/{execId} so the C-2 Case A ("No change") summary fires,
 * instead of stranding the tester on a dead-end "Back to start" lock.
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

async function seedPastCap(execId: string) {
  const now = Date.now()
  const completedAt = now - (FINISH_LATER_CAP_MS + 60_000)
  await db.sessionPlans.put({
    id: `plan-${execId}`,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: completedAt - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: completedAt - 15 * 60_000,
    completedAt,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/review?id=${execId}`]}>
      <Routes>
        <Route path="/review" element={<ReviewScreen />} />
        <Route path="/complete" element={<div data-testid="complete-route">complete</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ReviewScreen A9 universal landing on past-cap load', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('auto-routes to /complete/{execId} when the log is past the 2 h cap at mount', async () => {
    await seedPastCap('exec-past')
    renderAt('exec-past')

    expect(await screen.findByTestId('complete-route')).toBeInTheDocument()
    expect(screen.queryByText(/saved too late for planning/i)).not.toBeInTheDocument()
  })

  it('writes the expired stub before navigating so CompleteScreen can load the bundle (A9 correctness-1 fix)', async () => {
    await seedPastCap('exec-past-stub')
    renderAt('exec-past-stub')

    // Wait for the A9 redirect to land on /complete.
    await screen.findByTestId('complete-route')

    // After the redirect, a terminal skipped stub must exist for this execId
    // so that CompleteScreen's loadSessionBundle (which requires a review
    // record) can render the C-2 Case A summary rather than "Session not
    // found.". Before the fix, the navigate fired BEFORE any write, leaving
    // CompleteScreen with bundle === null.
    const stub = await db.sessionReviews.where('executionLogId').equals('exec-past-stub').first()
    expect(stub).toBeDefined()
    expect(stub?.status).toBe('skipped')
    expect(stub?.quickTags).toContain('expired')
    expect(stub?.sessionRpe).toBeNull()
  })

  it('past-cap mount with a pre-existing draft preserves the draft payload into the stub', async () => {
    // Correctness-1 / adv-1 variant: tester's filled-out draft (RPE + note +
    // metrics) must NOT be silently wiped when the cap elapses. The stub
    // preserves the user's inputs while still flagging the record ineligible
    // for adaptation (captureWindow='expired', eligibleForAdaptation=false,
    // quickTags includes 'expired', status='skipped').
    await seedPastCap('exec-past-with-draft')
    await db.sessionReviews.put({
      id: 'review-exec-past-with-draft',
      executionLogId: 'exec-past-with-draft',
      sessionRpe: 7,
      goodPasses: 14,
      totalAttempts: 22,
      incompleteReason: 'pain',
      quickTags: ['notCaptured'],
      shortNote: 'right shoulder pull, stopped early',
      submittedAt: Date.now() - 30 * 60_000,
      status: 'draft',
    })

    renderAt('exec-past-with-draft')
    await screen.findByTestId('complete-route')

    const stub = await db.sessionReviews
      .where('executionLogId')
      .equals('exec-past-with-draft')
      .first()
    expect(stub).toBeDefined()
    expect(stub?.status).toBe('skipped')
    expect(stub?.captureWindow).toBe('expired')
    expect(stub?.eligibleForAdaptation).toBe(false)
    // The draft payload is preserved for honest replay / V0B-15 export.
    expect(stub?.sessionRpe).toBe(7)
    expect(stub?.goodPasses).toBe(14)
    expect(stub?.totalAttempts).toBe(22)
    expect(stub?.incompleteReason).toBe('pain')
    expect(stub?.shortNote).toBe('right shoulder pull, stopped early')
    // quickTags includes both the preserved 'notCaptured' and the 'expired'
    // marker so readers can distinguish expired-with-draft from expired-empty.
    expect(stub?.quickTags).toContain('expired')
    expect(stub?.quickTags).toContain('notCaptured')
  })
})
