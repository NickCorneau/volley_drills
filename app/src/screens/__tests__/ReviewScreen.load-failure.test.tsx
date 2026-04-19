import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../db'
import { ReviewScreen } from '../ReviewScreen'

/**
 * Reliability finding rel-1 / correctness-3: if ReviewScreen's mount IIFE
 * rejects for any reason OTHER than a schema-blocked upgrade, the screen
 * must drop into a recoverable state (e.g. the 'missing' StatusMessage
 * with a Back-to-start link), NOT strand the tester on an indefinite
 * loading spinner.
 *
 * We simulate the failure by stubbing `db.executionLogs.get` to throw;
 * `loadSession` surfaces that as a rejected promise, which ReviewScreen's
 * mount effect must catch.
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
    <MemoryRouter initialEntries={[`/review?id=${execId}`]}>
      <Routes>
        <Route path="/review" element={<ReviewScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ReviewScreen recovers from non-schema-blocked DB errors (rel-1 fix)', () => {
  let getSpy: ReturnType<typeof vi.spyOn> | undefined

  beforeEach(async () => {
    await clearDb()
  })

  afterEach(() => {
    getSpy?.mockRestore()
    getSpy = undefined
  })

  it('falls back to the Session-not-found status message when db.executionLogs.get rejects', async () => {
    getSpy = vi
      .spyOn(db.executionLogs, 'get')
      .mockRejectedValue(new Error('simulated transient IDB read failure'))

    renderAt('exec-fail')

    // Must NOT remain on the loading spinner indefinitely. The recoverable
    // UX is the existing "Session not found." StatusMessage with a
    // Back-to-start link that is already rendered for the `missing` state.
    expect(
      await screen.findByText(/session not found/i, undefined, {
        timeout: 3000,
      }),
    ).toBeInTheDocument()
  })
})
