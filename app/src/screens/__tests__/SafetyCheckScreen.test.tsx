import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db, type SetupContext } from '../../db'
import { buildDraft } from '../../domain/sessionBuilder'
import { FORBIDDEN_RE } from '../../lib/copyGuard'
import { saveDraft } from '../../services/session'
import { SafetyCheckScreen } from '../SafetyCheckScreen'

/**
 * C-3 Unit 4 (V0B-16): answer-first safety copy - inline consequence
 * lines under the pain question and the recency chips, using D86
 * regulatory vocabulary (no "injury risk", no "overload", no "spike",
 * no red).
 *
 * Pain consequence:  "We'll switch to a lighter session if yes."
 * Recency consequence: "Today or First time means a shorter, lower-intensity start."
 * (Copy-polish pass 2026-04-19 replaced the `->` arrow with natural
 * prose.)
 *
 * 2026-04-20 physio-review copy refresh (`D129`): the pain question
 * was reworded from "pain that changes how you move" to
 * "Any pain that's sharp, localized, or makes you avoid a movement?"
 * so DOMS is easier to self-sort. Heading matchers below use the
 * distinctive "sharp" token - strong enough to fail a regression,
 * loose enough to survive a subsequent copy tweak.
 *
 * Partner-walkthrough polish 2026-04-22: recency chip display labels
 * now read as "Today / Yesterday / 2+ days ago / First time"; the
 * persisted `trainingRecency` string values (`'0 days'`, `'1 day'`,
 * `'2+'`, `'First time'`) are unchanged for DB + adaptation
 * compatibility. Tests below match the rendered labels, not the
 * internal values. See
 * `docs/plans/2026-04-22-partner-walkthrough-polish.md`.
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

async function seedDraft(contextOverrides: Partial<SetupContext> = {}) {
  // SafetyCheckScreen loads a SessionDraft on mount; without one it
  // redirects to /setup. Seed a minimal draft so the safety copy renders.
  const draft = buildDraft({
    playerMode: 'solo',
    timeProfile: 15,
    netAvailable: false,
    wallAvailable: false,
    ...contextOverrides,
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

  afterEach(() => {
    vi.unstubAllGlobals()
    Reflect.deleteProperty(navigator, 'wakeLock')
  })

  it('renders the pain consequence line under the pain question', async () => {
    renderScreen()
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /any pain.*sharp/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/regular muscle soreness is fine/i)).toBeInTheDocument()
    expect(screen.getByText(/we.?ll switch to a lighter session if yes/i)).toBeInTheDocument()
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
      screen.getByText(/today or first time.*shorter.*lower-intensity start/i),
    ).toBeInTheDocument()
  })

  it('safety copy contains no D86 forbidden vocabulary (regulatory posture)', async () => {
    renderScreen()
    await screen.findByRole('heading', {
      level: 2,
      name: /any pain.*sharp/i,
    })
    const body = document.body.textContent ?? ''
    expect(body, `forbidden word in: ${body}`).not.toMatch(FORBIDDEN_RE)
  })

  it('renders a disabled Start session anchor before safety answers are complete', async () => {
    renderScreen()
    await screen.findByRole('heading', {
      level: 2,
      name: /when did you last train/i,
    })

    expect(screen.getByRole('button', { name: /^start session$/i })).toBeDisabled()
  })

  it('does not echo the draft or focus in the default safety header', async () => {
    await clearDb()
    await seedDraft({ playerMode: 'pair', netAvailable: true, wallAvailable: false, sessionFocus: 'serve' })
    renderScreen()

    await screen.findByRole('heading', { name: /before we start/i })
    expect(screen.queryByText(/pair \+ net/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/serving/i)).not.toBeInTheDocument()
  })

  it('mentions focus only when pain recovery overrides an explicit focus', async () => {
    const user = userEvent.setup()
    await clearDb()
    await seedDraft({ playerMode: 'pair', netAvailable: true, wallAvailable: false, sessionFocus: 'serve' })
    renderScreen()

    await user.click(await screen.findByRole('radio', { name: /^yes$/i }))

    expect(await screen.findByText(/recovery overrides today's focus/i)).toBeInTheDocument()
  })

  it('does not mention focus on recovery when no explicit focus was chosen', async () => {
    const user = userEvent.setup()
    renderScreen()

    await user.click(await screen.findByRole('radio', { name: /^yes$/i }))

    expect(screen.queryByText(/recovery overrides today's focus/i)).not.toBeInTheDocument()
  })

  it('first-time user (no ExecutionLog history): First time chip renders AND description mentions it', async () => {
    // seedDraft wrote a draft but no ExecutionLog, so
    // hasEverStartedSession returns false.
    renderScreen()

    expect(await screen.findByRole('radio', { name: /first time/i })).toBeInTheDocument()
    expect(
      screen.getByText(/today or first time.*shorter.*lower-intensity start/i),
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
    // ToggleChip uses role="radio" inside a role="radiogroup" container,
    // which is the accessible semantics for single-select chip rows.
    await screen.findByRole('radio', { name: /^today$/i })
    expect(screen.queryByRole('radio', { name: /first time/i })).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^today$/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^yesterday$/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^2\+ days ago$/i })).toBeInTheDocument()
    // Description drops the "or First time" clause so it matches the
    // rendered chip set. Copy-polish pass (2026-04-19) replaced the
    // `->` arrow with natural prose (`means a ... start.`); regex
    // stays flexible on the connecting phrase.
    expect(screen.getByText(/today\s+.*shorter.*lower-intensity start/i)).toBeInTheDocument()
    expect(screen.queryByText(/first time/i)).not.toBeInTheDocument()
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
    // pattern) and answers the "when did you last train" question - which
    // applies to every session regardless of pain status - first.
    expect(headings[0].textContent).toMatch(/when did you last train/i)
    expect(headings[1].textContent).toMatch(/any pain.*sharp/i)
  })

  it('primes audio from the Start session tap before routing to Run (iOS beep unlock)', async () => {
    const user = userEvent.setup()
    const audioContextCtor = vi.fn(function (this: unknown) {
      return {
        state: 'running',
        resume: vi.fn(() => Promise.resolve()),
        close: vi.fn(),
      }
    })
    vi.stubGlobal('AudioContext', audioContextCtor)
    vi.stubGlobal('webkitAudioContext', undefined)

    render(
      <MemoryRouter initialEntries={['/safety']}>
        <Routes>
          <Route path="/safety" element={<SafetyCheckScreen />} />
          <Route path="/run" element={<div data-testid="run-route">run</div>} />
          <Route path="/setup" element={<div data-testid="setup">setup</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('radio', { name: /^today$/i }))
    await user.click(screen.getByRole('radio', { name: /^no$/i }))
    await user.click(screen.getByRole('button', { name: /^start session$/i }))

    expect(audioContextCtor).toHaveBeenCalledTimes(1)
    expect(await screen.findByTestId('run-route')).toBeInTheDocument()
  })

  it('requests screen wake lock from the Start session tap before routing to Run (iOS auto-lock guard)', async () => {
    const user = userEvent.setup()
    const sentinel = {
      released: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      release: vi.fn(() => Promise.resolve()),
    }
    const request = vi.fn(() => Promise.resolve(sentinel))
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    })
    Object.defineProperty(navigator, 'wakeLock', {
      configurable: true,
      value: { request },
    })

    render(
      <MemoryRouter initialEntries={['/safety']}>
        <Routes>
          <Route path="/safety" element={<SafetyCheckScreen />} />
          <Route path="/run" element={<div data-testid="run-route">run</div>} />
          <Route path="/setup" element={<div data-testid="setup">setup</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('radio', { name: /^today$/i }))
    await user.click(screen.getByRole('radio', { name: /^no$/i }))
    await user.click(screen.getByRole('button', { name: /^start session$/i }))

    expect(request).toHaveBeenCalledWith('screen')
    expect(await screen.findByTestId('run-route')).toBeInTheDocument()
  })
})

describe('SafetyCheckScreen escape hatch', () => {
  beforeEach(async () => {
    await clearDb()
    await seedDraft()
  })

  // Rationale: pre-C-5 this screen had no back affordance, so a tester
  // who changed their mind after building a draft was stuck - the only
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
