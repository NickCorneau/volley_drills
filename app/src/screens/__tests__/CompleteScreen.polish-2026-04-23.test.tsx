import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { CompleteScreen } from '../CompleteScreen'
import { SettingsScreen } from '../SettingsScreen'

/**
 * 2026-04-23 walkthrough closeout polish plan Item 3 — Complete screen
 * posture-sensitive Safari-eviction footnote moved to Settings; the
 * `✓ Saved on this device` trust line stays, and a small `Why is
 * this?` link carries the tester to the Settings explainer.
 *
 * Sources:
 *   docs/plans/2026-04-23-walkthrough-closeout-polish.md
 *   docs/research/partner-walkthrough-results/2026-04-22-trifold-synthesis.md
 *
 * D118 three-state durability posture is unchanged; this is a
 * placement edit, not a durability-claim edit. `storageCopy.ts`
 * remains the authoritative source for both the Complete primary line
 * and the Settings detail body.
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

async function seedSubmitted(execId: string) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: `plan-${execId}`,
    presetId: 'preset-1',
    presetName: 'Test Preset',
    playerCount: 1,
    blocks: [
      {
        id: 'b-1',
        type: 'main_skill',
        drillName: 'Passing',
        shortName: 'Pass',
        durationMinutes: 15,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status: 'completed',
    activeBlockIndex: 1,
    blockStatuses: [{ blockId: 'b-1', status: 'completed' }],
    startedAt: now - 20 * 60_000,
    completedAt: now - 5 * 60_000,
  })
  await db.sessionReviews.put({
    id: `review-${execId}`,
    executionLogId: execId,
    sessionRpe: 5,
    goodPasses: 10,
    totalAttempts: 15,
    submittedAt: now,
    status: 'submitted',
  })
}

describe('CompleteScreen 2026-04-23 polish (Safari caveat compression)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders the "Saved on this device" trust line (posture-sensitive primary, D118-preserving)', async () => {
    await seedSubmitted('exec-saveline')
    render(
      <MemoryRouter initialEntries={['/complete?id=exec-saveline']}>
        <Routes>
          <Route path="/complete" element={<CompleteScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    await screen.findByText(/keep building/i)
    const saveStatus = screen.getByTestId('save-status')
    // The save-status block carries the primary line — either "Saved
    // on this device" (installed postures) or "Saved in this browser
    // on this device" (browser-tab posture). Match the shared stem.
    expect(saveStatus.textContent).toMatch(/saved .* on this device/i)
  })

  it('does NOT render the posture-sensitive Safari-eviction secondary detail on Complete', async () => {
    await seedSubmitted('exec-no-evict-detail')
    render(
      <MemoryRouter initialEntries={['/complete?id=exec-no-evict-detail']}>
        <Routes>
          <Route path="/complete" element={<CompleteScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    await screen.findByText(/keep building/i)
    const body = document.body.textContent ?? ''
    // These fragments are the three posture-sensitive `secondary`
    // strings from `storageCopy.ts` that previously rendered below
    // the save line on Complete. After the compression they live in
    // Settings only.
    expect(body).not.toMatch(/safari can remove browser data/i)
    expect(body).not.toMatch(/not backed up/i)
    expect(body).not.toMatch(/strongest local durability/i)
  })

  it('exposes a "Why is this?" affordance that links to Settings', async () => {
    await seedSubmitted('exec-why-link')
    render(
      <MemoryRouter initialEntries={['/complete?id=exec-why-link']}>
        <Routes>
          <Route path="/complete" element={<CompleteScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    await screen.findByText(/keep building/i)
    const link = screen.getByRole('link', { name: /why is this/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/settings')
  })
})

describe('SettingsScreen 2026-04-23 polish (About local storage sub-section)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders the About local storage section with the posture-sensitive detail body', async () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    const section = await screen.findByTestId('settings-storage-info')
    expect(section).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /about local storage/i }),
    ).toBeInTheDocument()
    // In jsdom the install posture defaults to `browser-tab`. The
    // browser-tab secondary copy calls out iPhone Safari eviction.
    // Matching on the distinctive token lets the test remain honest
    // even if the exact sentence is later wordsmithed.
    expect(section.textContent).toMatch(/safari/i)
  })

  it('points the Complete "Why is this?" link at a surface that actually carries the explainer', async () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    // The Settings surface the Complete `Why is this?` link lands on
    // must carry the explainer. If the section is renamed or moved,
    // this assertion fails loudly alongside the Complete-side test
    // that pins the link target — keeping the two surfaces honest
    // together, not independently.
    expect(
      await screen.findByTestId('settings-storage-info'),
    ).toBeInTheDocument()
  })
})
