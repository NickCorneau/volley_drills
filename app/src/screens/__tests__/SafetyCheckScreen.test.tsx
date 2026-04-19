import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { buildDraft } from '../../domain/sessionBuilder'
import { FORBIDDEN_RE } from '../../lib/copyGuard'
import { saveDraft } from '../../services/session'
import { SafetyCheckScreen } from '../SafetyCheckScreen'

/**
 * C-3 Unit 4 (V0B-16): answer-first safety copy — inline consequence
 * lines under the pain question and the recency chips, using D86
 * regulatory vocabulary (no "injury risk", no "overload", no "spike",
 * no red).
 *
 * Pain consequence:  "We'll switch to a lighter session if yes."
 * Recency consequence: "0 days or First time means a shorter, lower-intensity start."
 * (Copy-polish pass 2026-04-19 replaced the `->` arrow with natural
 * prose.)
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

async function seedDraft() {
  // SafetyCheckScreen loads a SessionDraft on mount; without one it
  // redirects to /setup. Seed a minimal draft so the safety copy renders.
  const draft = buildDraft({
    playerMode: 'solo',
    timeProfile: 15,
    netAvailable: false,
    wallAvailable: false,
  })
  if (draft) await saveDraft(draft)
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

describe('SafetyCheckScreen V0B-16 answer-first copy (C-3 Unit 4)', () => {
  beforeEach(async () => {
    await clearDb()
    await seedDraft()
  })

  it('renders the pain consequence line under the pain question', async () => {
    renderScreen()
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /pain that changes how you move/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/we.?ll switch to a lighter session if yes/i),
    ).toBeInTheDocument()
  })

  it('renders the recency consequence line under the recency chips', async () => {
    renderScreen()
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /when did you last train/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/0 days or first time.*shorter.*lower-intensity start/i),
    ).toBeInTheDocument()
  })

  it('safety copy contains no D86 forbidden vocabulary (regulatory posture)', async () => {
    renderScreen()
    await screen.findByRole('heading', {
      level: 2,
      name: /pain that changes how you move/i,
    })
    const body = document.body.textContent ?? ''
    expect(body, `forbidden word in: ${body}`).not.toMatch(FORBIDDEN_RE)
  })

  it('first-time user (no ExecutionLog history): First time chip renders AND description mentions it', async () => {
    // seedDraft wrote a draft but no ExecutionLog, so
    // hasEverStartedSession returns false.
    renderScreen()

    expect(
      await screen.findByRole('button', { name: /first time/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/0 days or first time.*shorter.*lower-intensity start/i),
    ).toBeInTheDocument()
  })

  it('returning user (any ExecutionLog on device): First time chip is hidden AND description drops the clause', async () => {
    // Seed one terminal ExecutionLog so hasEverStartedSession returns true.
    // The rationale for counting any log (even discarded) is pinned by
    // the service unit tests in session.v0b.test.ts.
    const now = Date.now()
    await db.executionLogs.put({
      id: 'exec-any',
      planId: 'plan-any',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 20 * 60_000,
      completedAt: now - 5 * 60_000,
    })

    renderScreen()

    // Recency chips mount once hasEverStartedSession resolves.
    await screen.findByRole('button', { name: /^0 days$/i })
    // First time chip is filtered out.
    expect(
      screen.queryByRole('button', { name: /first time/i }),
    ).not.toBeInTheDocument()
    // The other three chips are still rendered.
    expect(screen.getByRole('button', { name: /^0 days$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^1 day$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^2\+$/i })).toBeInTheDocument()
    // Description drops the "or First time" clause so it matches the
    // rendered chip set. Copy-polish pass (2026-04-19) replaced the
    // `->` arrow with natural prose (`means a ... start.`); regex
    // stays flexible on the connecting phrase.
    expect(
      screen.getByText(/0 days\s+.*shorter.*lower-intensity start/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/first time/i),
    ).not.toBeInTheDocument()
  })

  it('renders Recency first, Pain second (dogfeed UX reorder 2026-04-19)', async () => {
    renderScreen()
    // Wait for the form to mount.
    await screen.findByRole('heading', {
      level: 2,
      name: /when did you last train/i,
    })
    const headings = screen.getAllByRole('heading', { level: 2 })
    // Rationale for this order: the prior order placed Pain first and
    // rendered PainOverrideCard between the Pain and Recency sections
    // when Yes was tapped, which made the Recency chips below visually
    // look blocked by the override card. Reversing puts PainOverrideCard
    // directly beneath its triggering question (canonical reveal-on-answer
    // pattern) and answers the "when did you last train" question — which
    // applies to every session regardless of pain status — first.
    expect(headings[0].textContent).toMatch(/when did you last train/i)
    expect(headings[1].textContent).toMatch(/pain that changes how you move/i)
  })
})

describe('SafetyCheckScreen escape hatch', () => {
  beforeEach(async () => {
    await clearDb()
    await seedDraft()
  })

  // Rationale: pre-C-5 this screen had no back affordance, so a tester
  // who changed their mind after building a draft was stuck — the only
  // exits were "answer pain+recency" or closing the PWA entirely. The
  // draft is already persisted to `sessionDrafts`, so bouncing back to
  // Home is free from a data standpoint: the draft surfaces there via
  // the C-4 LastComplete / Draft priority rail.
  it('header renders a Back button that routes to Home', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/safety']}>
        <Routes>
          <Route path="/safety" element={<SafetyCheckScreen />} />
          <Route path="/" element={<div data-testid="home-route">home</div>} />
        </Routes>
      </MemoryRouter>,
    )

    // Name includes the left-arrow glyph; match by "Back" substring so
    // a later tweak to the glyph or whitespace doesn't spuriously break
    // the regression.
    const back = await screen.findByRole('button', { name: /back/i })
    await user.click(back)
    expect(await screen.findByTestId('home-route')).toBeInTheDocument()
  })

  it('leaving the screen via Back does NOT mutate the persisted draft', async () => {
    const user = userEvent.setup()
    const before = await db.sessionDrafts.get('current')
    expect(before).toBeDefined()

    render(
      <MemoryRouter initialEntries={['/safety']}>
        <Routes>
          <Route path="/safety" element={<SafetyCheckScreen />} />
          <Route path="/" element={<div data-testid="home-route">home</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('button', { name: /back/i }))
    await screen.findByTestId('home-route')

    const after = await db.sessionDrafts.get('current')
    expect(after).toEqual(before)
  })
})
