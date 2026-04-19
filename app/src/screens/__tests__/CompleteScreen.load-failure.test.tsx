import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../db'
import { CompleteScreen } from '../CompleteScreen'

/**
 * Reliability finding rel-2: if CompleteScreen's Promise.all rejects for
 * any reason OTHER than a schema-blocked upgrade, the screen must drop
 * into a recoverable state (e.g. the 'missing' StatusMessage with a
 * Back-to-start button), NOT strand the tester on an indefinite loading
 * spinner. CompleteScreen is the terminal post-session screen — failure
 * here silently breaks the entire D91 post-session loop.
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

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/complete?id=${execId}`]}>
      <Routes>
        <Route path="/complete" element={<CompleteScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CompleteScreen recovers from non-schema-blocked DB errors (rel-2 fix)', () => {
  let spy: ReturnType<typeof vi.spyOn> | undefined

  beforeEach(async () => {
    await clearDb()
  })

  afterEach(() => {
    spy?.mockRestore()
    spy = undefined
  })

  it('falls back to the Session-not-found message when db.executionLogs.get rejects inside loadSessionBundle', async () => {
    // loadSessionBundle -> db.executionLogs.get(...) is the first await.
    spy = vi
      .spyOn(db.executionLogs, 'get')
      .mockRejectedValue(new Error('simulated transient IDB read failure'))

    renderAt('exec-cs-fail')

    expect(
      await screen.findByText(/session not found/i, undefined, {
        timeout: 3000,
      }),
    ).toBeInTheDocument()
  })

  it('falls back to the Session-not-found message when countSubmittedReviews rejects', async () => {
    // countSubmittedReviews -> db.sessionReviews.toArray() in services/review.ts.
    spy = vi
      .spyOn(db.sessionReviews, 'toArray')
      .mockRejectedValue(new Error('simulated quota failure on counter read'))

    renderAt('exec-cs-counter-fail')

    expect(
      await screen.findByText(/session not found/i, undefined, {
        timeout: 3000,
      }),
    ).toBeInTheDocument()
  })
})
