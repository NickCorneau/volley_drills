import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { buildDraft } from '../../domain/sessionBuilder'
import { TuneTodayScreen } from '../TuneTodayScreen'

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

function makeDraft() {
  const draft = buildDraft(
    {
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: true,
      wallAvailable: false,
    },
    { assemblySeed: 'tune-today-test' },
  )
  if (!draft) throw new Error('Expected fixture draft to build')
  return draft
}

async function seedDraft(overrides: Partial<ReturnType<typeof makeDraft>> = {}) {
  await db.sessionDrafts.put({
    ...makeDraft(),
    ...overrides,
  })
}

function renderScreen(initialState: unknown = { source: 'home' }) {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/tune-today', state: initialState }]}>
      <Routes>
        <Route path="/tune-today" element={<TuneTodayScreen />} />
        <Route path="/safety" element={<div>safety-route</div>} />
        <Route path="/setup" element={<div>setup-route</div>} />
        <Route path="/" element={<div>home-route</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(async () => {
  await clearDb()
})

describe('TuneTodayScreen', () => {
  it('renders the pair H1 and chips with Recommended selected by default', async () => {
    await seedDraft()
    renderScreen()

    // Pair-mode H1 is the noun phrase "Today's shared focus" (no
    // question mark, no "What's"). Solo H1 is "Today's focus" — see
    // the dedicated solo test below.
    expect(
      await screen.findByRole('heading', { level: 1, name: "Today's shared focus" }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 1, name: "What's today's focus?" }),
    ).not.toBeInTheDocument()

    const group = screen.getByRole('radiogroup', { name: 'Focus' })
    expect(within(group).getByRole('radio', { name: 'Recommended' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(within(group).getByRole('radio', { name: 'Passing' })).toBeInTheDocument()
    expect(within(group).getByRole('radio', { name: 'Serving' })).toBeInTheDocument()
    expect(within(group).getByRole('radio', { name: 'Setting' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue to safety check/i })).toBeInTheDocument()
  })

  it('renders the solo H1 (noun phrase, no question mark) for a solo draft', async () => {
    const soloDraft = buildDraft(
      {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: false,
        wallAvailable: true,
      },
      { assemblySeed: 'tune-today-test-solo' },
    )
    if (!soloDraft) throw new Error('Expected fixture solo draft to build')
    await db.sessionDrafts.put(soloDraft)
    renderScreen()

    expect(
      await screen.findByRole('heading', { level: 1, name: "Today's focus" }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 1, name: "Today's shared focus" }),
    ).not.toBeInTheDocument()
  })

  it('reflects a saved serving focus as selected', async () => {
    const draft = makeDraft()
    await seedDraft({ context: { ...draft.context, sessionFocus: 'serve' } })
    renderScreen()

    const group = await screen.findByRole('radiogroup', { name: 'Focus' })
    expect(within(group).getByRole('radio', { name: 'Serving' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('does not show transient updating copy when changing focus', async () => {
    const user = userEvent.setup()
    await seedDraft()
    renderScreen()

    await user.click(await screen.findByRole('radio', { name: 'Serving' }))

    expect(screen.queryByText(/updating focus/i)).not.toBeInTheDocument()
  })

  it('continues to safety', async () => {
    const user = userEvent.setup()
    await seedDraft()
    renderScreen()

    await user.click(await screen.findByRole('button', { name: /continue to safety check/i }))

    expect(await screen.findByText('safety-route')).toBeInTheDocument()
  })

  it('backs to setup edit mode when opened from setup', async () => {
    const user = userEvent.setup()
    await seedDraft()
    renderScreen({ source: 'setup' })

    await user.click(await screen.findByRole('button', { name: /^back$/i }))

    expect(await screen.findByText('setup-route')).toBeInTheDocument()
  })
})
