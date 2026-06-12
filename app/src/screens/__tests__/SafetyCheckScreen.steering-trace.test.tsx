import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { ExecutionLog, SessionPlan, SessionReview } from '../../model'
import type { ScopedFocus } from '../../domain/eligibleSessions'
import { buildDraft } from '../../domain/sessionBuilder'
import { saveDraft } from '../../services/session'
import { ADAPT_DISCLOSURE_DISMISSED_KEY } from '../../services/steeringTrace'
import { SafetyCheckScreen } from '../SafetyCheckScreen'

/**
 * Trust-loop U4 (2026-06-11 plan) — Safety steering trace: the
 * cash-the-promise line (R6/R7), the first-steered one-time disclosure
 * (R9), the evergreen "How sessions adapt" gloss (R10), pain-override
 * suppression, and the display rulings (R1/R3, AE6). Decision-table
 * coverage lives in the domain suite; this file pins the rendered
 * surface.
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

async function seedSteeredDraft(focus: ScopedFocus = 'set', updatedAt?: number) {
  const draft = buildDraft({
    playerMode: 'solo',
    timeProfile: 15,
    netAvailable: false,
    wallAvailable: true,
    sessionFocus: focus,
  })
  if (!draft) throw new Error('test fixture: buildDraft returned null')
  await saveDraft({
    ...draft,
    steeredFocus: focus,
    ...(updatedAt === undefined ? {} : { updatedAt }),
  })
}

async function seedUnsteeredDraft() {
  const draft = buildDraft({
    playerMode: 'solo',
    timeProfile: 15,
    netAvailable: false,
    wallAvailable: true,
  })
  if (!draft) throw new Error('test fixture: buildDraft returned null')
  await saveDraft(draft)
}

function acceptedReview(
  focus: ScopedFocus,
  direction: 'more' | 'less',
  submittedAt: number,
): SessionReview {
  return {
    id: `review-${focus}-${submittedAt}`,
    executionLogId: `log-${focus}-${submittedAt}`,
    sessionRpe: 5,
    goodPasses: 0,
    totalAttempts: 0,
    submittedAt,
    status: 'submitted',
    offeredDelta: { kind: 'stress', focus, direction },
    verdictChoice: 'accepted',
  }
}

function steeredPlan(id: string, createdAt: number, focus: ScopedFocus): SessionPlan {
  return {
    id,
    presetId: 'preset-1',
    presetName: 'Test preset',
    playerCount: 1,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt,
    steeredFocus: focus,
  }
}

function terminalLog(planId: string): ExecutionLog {
  return {
    id: `exec-${planId}`,
    planId,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: 1,
  }
}

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/safety']}>
      <Routes>
        <Route path="/safety" element={<SafetyCheckScreen />} />
        <Route path="/setup" element={<div data-testid="setup">setup</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(async () => {
  await clearDb()
})

describe('SafetyCheckScreen steering trace (trust-loop U4)', () => {
  it('renders the steering line on a steered draft built after an arming accept (AE2)', async () => {
    await db.sessionReviews.add(acceptedReview('set', 'more', 1000))
    await seedSteeredDraft('set')

    renderScreen()
    expect(await screen.findByText('A bit more stress on setting today.')).toBeInTheDocument()
  })

  it('renders no line once the promise is consumed by a trained steered session', async () => {
    await db.sessionReviews.add(acceptedReview('set', 'more', 1000))
    await db.sessionPlans.add(steeredPlan('plan-1', 2000, 'set'))
    await db.executionLogs.add(terminalLog('plan-1'))
    await seedSteeredDraft('set')

    renderScreen()
    await screen.findByRole('heading', { name: /when did you last train/i })
    expect(screen.queryByText(/stress on setting/i)).not.toBeInTheDocument()
    // Trained-steered history keeps the disclosure logic intact: the
    // first-steered disclosure may still show; the line must not.
  })

  it("renders the 'less' accept in the easing voice", async () => {
    // Intermediate band so the 'less' accept moves (set 2 -> 1).
    await db.storageMeta.put({
      key: 'onboarding.skillLevel',
      value: 'rally_builders',
      updatedAt: Date.now(),
    })
    await db.sessionReviews.add(acceptedReview('set', 'less', 1000))
    await seedSteeredDraft('set')

    renderScreen()
    expect(await screen.findByText('Easing the stress on setting today.')).toBeInTheDocument()
  })

  it('first steered session with no accepts shows the disclosure and no line (AE3)', async () => {
    await seedSteeredDraft('set')

    renderScreen()
    expect(
      await screen.findByText(/your plan quietly adjusts its challenge as you train/i),
    ).toBeInTheDocument()
    expect(screen.queryByText(/stress on setting/i)).not.toBeInTheDocument()
  })

  it('dismissing the disclosure persists the flag and hides it on the next steered visit (R9)', async () => {
    const user = userEvent.setup()
    await seedSteeredDraft('set')

    const first = renderScreen()
    await user.click(await screen.findByRole('button', { name: /got it/i }))

    expect(
      screen.queryByText(/your plan quietly adjusts its challenge as you train/i),
    ).not.toBeInTheDocument()
    await waitFor(async () => {
      const row = await db.storageMeta.get(ADAPT_DISCLOSURE_DISMISSED_KEY)
      expect(row?.value).toBe(true)
    })
    first.unmount()

    renderScreen()
    await screen.findByRole('heading', { name: /when did you last train/i })
    expect(
      screen.queryByText(/your plan quietly adjusts its challenge as you train/i),
    ).not.toBeInTheDocument()
  })

  it('a glanced-past (undismissed) disclosure re-shows on the next steered visit', async () => {
    await seedSteeredDraft('set')

    const first = renderScreen()
    await screen.findByText(/your plan quietly adjusts its challenge as you train/i)
    first.unmount()

    renderScreen()
    expect(
      await screen.findByText(/your plan quietly adjusts its challenge as you train/i),
    ).toBeInTheDocument()
  })

  it('unsteered draft renders no line, no disclosure, and no gloss when never steered (AE5)', async () => {
    await db.sessionReviews.add(acceptedReview('set', 'more', 1000))
    await seedUnsteeredDraft()

    renderScreen()
    await screen.findByRole('heading', { name: /when did you last train/i })
    expect(screen.queryByTestId('steering-trace')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /how sessions adapt/i })).not.toBeInTheDocument()
  })

  it('gloss stays reachable on an unsteered draft once any persisted plan was steered (R10)', async () => {
    const user = userEvent.setup()
    await db.sessionPlans.add(steeredPlan('plan-1', 1000, 'set'))
    await seedUnsteeredDraft()

    renderScreen()
    const trigger = await screen.findByRole('button', { name: /how sessions adapt/i })
    await user.click(trigger)
    expect(screen.getByText(/nothing changes without your okay/i)).toBeInTheDocument()
  })

  it('pain override suppresses the line, disclosure, and gloss', async () => {
    const user = userEvent.setup()
    await db.sessionReviews.add(acceptedReview('set', 'more', 1000))
    await seedSteeredDraft('set')

    renderScreen()
    await screen.findByText('A bit more stress on setting today.')

    const painGroup = screen.getByRole('radiogroup', { name: /sharp pain or guarding/i })
    await user.click(within(painGroup).getByRole('radio', { name: 'Yes' }))

    expect(screen.queryByText('A bit more stress on setting today.')).not.toBeInTheDocument()
    expect(screen.queryByTestId('steering-trace')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /how sessions adapt/i })).not.toBeInTheDocument()

    // Answering No restores the trace - "active" means currently flagged.
    await user.click(within(painGroup).getByRole('radio', { name: 'No' }))
    expect(await screen.findByText('A bit more stress on setting today.')).toBeInTheDocument()
  })

  it('trace copy carries no raw numbers or reserved vocabulary (AE6 Safety slice)', async () => {
    const user = userEvent.setup()
    await db.sessionReviews.add(acceptedReview('set', 'more', 1000))
    await seedSteeredDraft('set')

    renderScreen()
    await screen.findByText('A bit more stress on setting today.')
    await user.click(screen.getByRole('button', { name: /how sessions adapt/i }))

    const trace = screen.getByTestId('steering-trace').textContent ?? ''
    const gloss = screen.getByText(/nothing changes without your okay/i).textContent ?? ''
    for (const text of [trace, gloss]) {
      expect(text).not.toMatch(/rung|ladder|steer/i)
      expect(text).not.toMatch(/\d/)
      expect(text).not.toContain('\u2014')
    }
  })
})
