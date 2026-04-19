import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { isSkillLevel } from '../../lib/skillLevel'
import { isOnboardingStep } from '../../lib/onboarding'
import { SkillLevelScreen } from '../../screens/SkillLevelScreen'
import { getStorageMeta } from '../../services/storageMeta'
import { FirstOpenGate } from '../FirstOpenGate'

/**
 * C-3 Unit 5: resume semantics + C-0 backfill verification.
 *
 * The base `FirstOpenGate.test.tsx` covers the happy-path redirects;
 * this spec adds:
 * - Explicit `step: 'skill_level'` seed → skill-level redirect (not just
 *   the no-step default).
 * - A true tab-close / remount round-trip: persist state via
 *   SkillLevelScreen, unmount the tree, remount, assert the gate routes
 *   the tester to Today's Setup (the step they left off on).
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

function renderTree(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <FirstOpenGate>
        <Routes>
          <Route path="/" element={<div data-testid="home">home</div>} />
          <Route
            path="/onboarding/skill-level"
            element={<SkillLevelScreen />}
          />
          <Route
            path="/onboarding/todays-setup"
            element={<div data-testid="todays-setup">setup</div>}
          />
        </Routes>
      </FirstOpenGate>
    </MemoryRouter>,
  )
}

describe('FirstOpenGate resume semantics (C-3 Unit 5)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it("explicit step === 'skill_level' (no completedAt) redirects to /onboarding/skill-level", async () => {
    await db.storageMeta.put({
      key: 'onboarding.step',
      value: 'skill_level',
      updatedAt: 1,
    })
    renderTree('/')
    // SkillLevelScreen renders the welcome preamble on mount.
    expect(
      await screen.findByText(/welcome\. let.?s get you started\./i),
    ).toBeInTheDocument()
  })

  it('true tab-close/remount round-trip: SkillLevel pick then remount lands the tester on Today\u2019s Setup', async () => {
    const user = userEvent.setup()

    // First mount: fresh install, FirstOpenGate routes to Skill Level.
    const first = renderTree('/')
    await screen.findByText(/welcome\. let.?s get you started\./i)

    // Pick a band — SkillLevelScreen writes skillLevel + step via
    // setStorageMetaMany before navigating. We're testing the RESUME
    // contract, so we unmount BEFORE the in-memory navigation settles
    // on the new page. Unmount simulates tab-close mid-onboarding.
    await user.click(
      screen.getByRole('button', { name: /rally builders/i }),
    )

    // Verify the persistence landed (this matches SkillLevelScreen's
    // existing assertions — belt).
    const skillLevel = await getStorageMeta(
      'onboarding.skillLevel',
      isSkillLevel,
    )
    const step = await getStorageMeta('onboarding.step', isOnboardingStep)
    expect(skillLevel).toBe('rally_builders')
    expect(step).toBe('todays_setup')

    first.unmount()

    // Second mount: fresh MemoryRouter starts at `/` — the tester is
    // re-opening the PWA from Home Screen. FirstOpenGate reads
    // `step === 'todays_setup'` and redirects past Skill Level.
    renderTree('/')
    expect(await screen.findByTestId('todays-setup')).toBeInTheDocument()
    expect(
      screen.queryByText(/welcome\. let.?s get you started\./i),
    ).not.toBeInTheDocument()
  })

  it('fresh install (no meta) always routes to /onboarding/skill-level on first mount', async () => {
    // Sanity belt — the base FirstOpenGate.test covers this with a stub
    // skill-level route; this version uses the real SkillLevelScreen so
    // we also catch any integration mismatch between FirstOpenGate and
    // SkillLevelScreen's initial render.
    renderTree('/')
    expect(
      await screen.findByText(/welcome\. let.?s get you started\./i),
    ).toBeInTheDocument()
  })

  it('C-0 backfill coverage (H15): ExecutionLog + onboarding.completedAt keep the tester out of onboarding on next open', async () => {
    // H15 defense-in-depth: existing v3 testers with ExecutionLog records
    // get `onboarding.completedAt` backfilled at v4 upgrade time. Verify
    // the gate recognizes the sentinel and routes them to Home.
    await db.executionLogs.put({
      id: 'exec-existing-1',
      planId: 'plan-existing-1',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: 1,
      completedAt: 2,
    })
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: 3,
      updatedAt: 3,
    })

    renderTree('/')
    expect(await screen.findByTestId('home')).toBeInTheDocument()
    expect(
      screen.queryByText(/welcome\. let.?s get you started\./i),
    ).not.toBeInTheDocument()
  })
})
