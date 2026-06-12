import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../db'
import { getStorageMeta } from '../../services/storageMeta'
import { HomeScreen } from '../HomeScreen'

/**
 * Home-coherence: the last_complete focal card launches the derived plan.
 *
 * The primary CTA "Start [focus] session" builds a draft steered to the
 * plan's next focus (reusing the last session's physical conditions) and
 * routes through the Setup -> Safety spine. When there is no prior context
 * to reuse, it falls back to a fresh Setup. Safety is never skipped.
 *
 * Also pins the single-flight race guard (`beginNonReviewAction`):
 * competing Home actions are disabled while a launch is mid-flight. The
 * pre-D158 pin lived in HomeScreen.repeat-race.test.tsx and was deleted
 * with the Repeat affordance; the contract survived the removal and now
 * protects the plan CTA plus the page-level escape link.
 */

vi.mock('../../services/storageMeta', async () => {
  const actual = await vi.importActual<typeof import('../../services/storageMeta')>(
    '../../services/storageMeta',
  )
  return {
    ...actual,
    getStorageMeta: vi.fn(),
  }
})

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

async function seedLastComplete(opts: { withContext: boolean }) {
  const completedAt = Date.now() - 2 * 24 * 60 * 60 * 1000
  await db.sessionPlans.put({
    id: 'plan-lc',
    presetId: 'pair_net',
    presetName: 'Pair + Net',
    playerCount: 2,
    // Empty blocks -> inferSessionFocus is 'partial' -> no trained focus ->
    // fresh-start plan head is 'pass', so the CTA reads "Start passing session".
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: completedAt - 60_000,
    context: opts.withContext
      ? {
          playerMode: 'pair',
          timeProfile: 25,
          netAvailable: true,
          wallAvailable: false,
          sessionFocus: 'serve',
        }
      : undefined,
  })
  await db.executionLogs.put({
    id: 'exec-lc',
    planId: 'plan-lc',
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: completedAt - 25 * 60_000,
    completedAt,
  })
  await db.sessionReviews.put({
    id: 'review-exec-lc',
    executionLogId: 'exec-lc',
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
        <Route path="/safety" element={<div data-testid="safety-route">safety</div>} />
        <Route path="/setup" element={<div data-testid="setup-route">setup</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('HomeScreen plan launch (Start [focus] session)', () => {
  beforeEach(async () => {
    await clearDb()
    vi.mocked(getStorageMeta).mockReset()
    // Matches the real implementation on a cleared storageMeta table.
    vi.mocked(getStorageMeta).mockResolvedValue(undefined)
  })

  it('launches a focus-steered session through Safety, overriding the prior focus', async () => {
    const user = userEvent.setup()
    await seedLastComplete({ withContext: true })
    renderHome()

    await user.click(await screen.findByRole('button', { name: /start passing session/i }))

    // Routes through the Setup -> Safety spine (never skips Safety).
    expect(await screen.findByTestId('safety-route')).toBeInTheDocument()

    const draft = await db.sessionDrafts.get('current')
    expect(draft).toBeDefined()
    // Prior focus (serve) overridden to the plan's next focus (pass).
    expect(draft!.context.sessionFocus).toBe('pass')
    // Physical conditions reused from the prior context.
    expect(draft!.context.playerMode).toBe('pair')
    expect(draft!.context.netAvailable).toBe(true)
  })

  it('falls back to fresh Setup when there is no prior context to reuse', async () => {
    const user = userEvent.setup()
    await seedLastComplete({ withContext: false })
    renderHome()

    await user.click(await screen.findByRole('button', { name: /start passing session/i }))

    expect(await screen.findByTestId('setup-route')).toBeInTheDocument()
    expect(await db.sessionDrafts.get('current')).toBeUndefined()
  })

  it('disables competing Home actions while the launch is mid-flight', async () => {
    const user = userEvent.setup()
    await seedLastComplete({ withContext: true })
    renderHome()

    const startPlan = await screen.findByRole('button', { name: /start passing session/i })

    // Arm the hanging skill-level read only AFTER Home has painted: the
    // initial snapshot's `loadPlanInputs` also reads
    // `onboarding.skillLevel`, and a pre-render pending mock would stall
    // the whole screen at Loading. The race window under test is the
    // read inside `startPlanSession`'s draft rebuild.
    let resolveSkillLevel: (value: undefined) => void = () => undefined
    vi.mocked(getStorageMeta).mockReturnValue(
      new Promise((resolve) => {
        resolveSkillLevel = resolve
      }),
    )

    await user.click(startPlan)

    // Single-flight: both the focal CTA and the page-level escape link
    // sit disabled until the in-flight launch settles.
    expect(startPlan).toBeDisabled()
    expect(
      await screen.findByRole('button', { name: /start a different session/i }),
    ).toBeDisabled()

    await act(async () => {
      resolveSkillLevel(undefined)
      await Promise.resolve()
    })

    expect(await screen.findByTestId('safety-route')).toBeInTheDocument()
    expect(await db.sessionDrafts.get('current')).toBeDefined()
  })
})
