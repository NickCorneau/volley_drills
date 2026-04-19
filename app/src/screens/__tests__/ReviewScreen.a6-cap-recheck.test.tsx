import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { db } from '../../db'
import { FINISH_LATER_CAP_MS } from '../../services/review'
import { ReviewScreen } from '../ReviewScreen'

/**
 * A6: ReviewScreen.handleSubmit re-checks `isPastDeferralCap(log, now())`
 * before calling submitReview. If past, routes to /complete/{execId}
 * without writing a submitted review — any write would lose validity
 * against the 2 h cap per D120.
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

async function seedWithCompletion(execId: string, completedAt: number) {
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
        <Route
          path="/complete"
          element={<div data-testid="complete-route">complete</div>}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ReviewScreen A6 submit-time cap re-check', () => {
  let dateNowSpy: ReturnType<typeof vi.spyOn> | undefined

  beforeEach(async () => {
    await clearDb()
  })

  afterEach(() => {
    dateNowSpy?.mockRestore()
    dateNowSpy = undefined
  })

  it('inside the cap: normal submit writes a submitted review and routes to /complete', async () => {
    const user = userEvent.setup()
    // Completed 10 min ago — well inside the 2 h cap.
    const completedAt = Date.now() - 10 * 60_000
    await seedWithCompletion('exec-inside', completedAt)

    renderAt('exec-inside')
    await screen.findByRole('heading', { name: /quick review/i })

    // Pick an RPE so Submit becomes enabled.
    await user.click(screen.getByRole('radio', { name: /^6/ }))
    await user.click(screen.getByRole('button', { name: /submit review/i }))

    await screen.findByTestId('complete-route')

    const stored = await db.sessionReviews
      .where('executionLogId')
      .equals('exec-inside')
      .first()
    expect(stored?.status).toBe('submitted')
    expect(stored?.sessionRpe).toBe(6)
  })

  it('past the cap while filling the form: Submit routes to /complete with an expired skipped stub and no submitted review', async () => {
    const user = userEvent.setup()
    // Seed a log inside the cap at mount time so the mount-time check
    // reports `ready`, not `expired`.
    const mountTime = Date.now()
    const completedAt = mountTime - (FINISH_LATER_CAP_MS - 30_000)
    await seedWithCompletion('exec-crosscap', completedAt)

    renderAt('exec-crosscap')
    await screen.findByRole('heading', { name: /quick review/i })
    await user.click(screen.getByRole('radio', { name: /^7/ }))

    // Simulate the tester sitting through the 2 h cap: bump the clock so
    // Date.now() now reports past-cap while the form-state render is
    // still mounted with `loaded.status === 'ready'`.
    dateNowSpy = vi
      .spyOn(Date, 'now')
      .mockReturnValue(completedAt + FINISH_LATER_CAP_MS + 60_000)

    await user.click(screen.getByRole('button', { name: /submit review/i }))

    await screen.findByTestId('complete-route')

    const stored = await db.sessionReviews
      .where('executionLogId')
      .equals('exec-crosscap')
      .first()
    // Terminal markers: the record is expired and NOT eligible for
    // adaptation, so the engine ignores it — exactly the correctness bar
    // A6 was designed to enforce.
    expect(stored?.status).toBe('skipped')
    expect(stored?.captureWindow).toBe('expired')
    expect(stored?.eligibleForAdaptation).toBe(false)
    expect(stored?.quickTags).toContain('expired')
    // The tester typed RPE=7 before the cap elapsed during form-filling.
    // With the draft-preservation fix (adv-1/adv-2), the auto-save effect's
    // draft record carries that RPE into the terminal stub rather than
    // silently wiping it. Engine ignores it via the markers above; export
    // / history retains the honest data.
    expect(stored?.sessionRpe).toBe(7)
  })
})
