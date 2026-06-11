import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../db'
import * as sessionBuilder from '../../domain/sessionBuilder'
import type { SessionDraft, SetupContext } from '../../model'
import {
  currentPersistedExecutionLog,
  currentPersistedPlan,
} from '../../test-utils/persistedRecords'
import { SetupScreen } from '../SetupScreen'

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

beforeEach(async () => {
  await clearDb()
})

describe('SetupScreen (C-3)', () => {
  it('onboarding: back navigates to skill level route', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/onboarding/todays-setup']}>
        <Routes>
          <Route path="/onboarding/todays-setup" element={<SetupScreen isOnboarding />} />
          <Route path="/onboarding/skill-level" element={<div>skill-level-route</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /skill level/i }))
    expect(await screen.findByText('skill-level-route')).toBeInTheDocument()
  })

  it('onboarding: starts with the one-tap Solo + Net default selected', () => {
    render(
      <MemoryRouter initialEntries={['/onboarding/todays-setup']}>
        <Routes>
          <Route path="/onboarding/todays-setup" element={<SetupScreen isOnboarding />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('radio', { name: 'Solo', checked: true })).toBeInTheDocument()
    expect(
      within(screen.getByRole('radiogroup', { name: 'Net available' })).getByRole('radio', {
        name: 'Yes',
        checked: true,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '15 min', checked: true })).toBeInTheDocument()
    expect(
      within(screen.getByRole('radiogroup', { name: 'Focus' })).getByRole('radio', {
        name: 'Recommended',
        checked: true,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /^focus$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /build session/i })).toBeEnabled()
    expect(screen.queryByText(/choose .* to build/i)).not.toBeInTheDocument()
  })

  it('onboarding: builds without a wind choice and routes straight to Safety', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/onboarding/todays-setup']}>
        <Routes>
          <Route path="/onboarding/todays-setup" element={<SetupScreen isOnboarding />} />
          <Route path="/safety" element={<div data-testid="safety-route">safety</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('radio', { name: 'Solo' }))
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Net available' })).getByRole('radio', {
        name: 'No',
      }),
    )
    expect(screen.getByText('Wall or fence nearby?')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: /wall or fence nearby/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /build session/i })).toBeDisabled()
    expect(screen.getByText('Choose wall or fence availability to build.')).toBeInTheDocument()
    expect(screen.queryByRole('radiogroup', { name: 'Wind' })).not.toBeInTheDocument()
    await user.click(
      within(screen.getByRole('radiogroup', { name: /wall or fence nearby/i })).getByRole('radio', {
        name: 'No',
      }),
    )
    expect(screen.getByRole('button', { name: /build session/i })).toBeEnabled()
    expect(
      within(screen.getByRole('radiogroup', { name: 'Focus' })).getByRole('radio', {
        name: 'Recommended',
      }),
    ).toHaveAttribute('aria-checked', 'true')
    await user.click(screen.getByRole('button', { name: /build session/i }))

    expect(await screen.findByTestId('safety-route')).toBeInTheDocument()

    const draft = await db.sessionDrafts.get('current')
    expect(draft?.context.wallAvailable).toBe(false)

    const completed = await db.storageMeta.get('onboarding.completedAt')
    expect(typeof completed?.value).toBe('number')
  })

  it('renders Wall only for Solo with no net', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/onboarding/todays-setup']}>
        <Routes>
          <Route path="/onboarding/todays-setup" element={<SetupScreen isOnboarding />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.queryByRole('radiogroup', { name: /wall or fence/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Solo' }))
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Net available' })).getByRole('radio', {
        name: 'Yes',
      }),
    )
    expect(screen.queryByRole('radiogroup', { name: /wall or fence/i })).not.toBeInTheDocument()

    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Net available' })).getByRole('radio', {
        name: 'No',
      }),
    )
    expect(screen.getByRole('radiogroup', { name: /wall or fence nearby/i })).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Pair' }))
    expect(screen.queryByRole('radiogroup', { name: /wall or fence/i })).not.toBeInTheDocument()
  })

  it('builds with wallAvailable false when Wall is hidden and routes straight to Safety', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/onboarding/todays-setup']}>
        <Routes>
          <Route path="/onboarding/todays-setup" element={<SetupScreen isOnboarding />} />
          <Route path="/safety" element={<div data-testid="safety-route">safety</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('radio', { name: 'Pair' }))
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Net available' })).getByRole('radio', {
        name: 'Yes',
      }),
    )
    expect(screen.queryByRole('radiogroup', { name: /wall or fence/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /build session/i }))

    expect(await screen.findByTestId('safety-route')).toBeInTheDocument()

    const draft = await db.sessionDrafts.get('current')
    expect(draft?.context.wallAvailable).toBe(false)
  })

  it('2026-04-22 one-tap Repeat cleanup: plain /setup never renders the stale-context banner', async () => {
    // Regression guard: when `handleRepeat` routed to /setup?from=repeat
    // the banner ("Setup pre-filled from Tuesday…") lived above the
    // chip rows. The one-tap Repeat change retires that entry point
    // entirely — Setup should never render a `role="status"` banner
    // regardless of what's seeded, because the only non-onboarding
    // entries now are `Start a different session` and `Start new session`.
    // Pre-fill via `getLastContext()` still happens silently.
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: 1,
      updatedAt: 1,
    })
    const completedAt = Date.now() - 3 * 24 * 60 * 60 * 1000
    await db.sessionPlans.put({
      id: 'plan-lc',
      presetId: 'solo_wall',
      presetName: 'Solo + Wall',
      playerCount: 1,
      blocks: [],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: completedAt - 60_000,
      context: {
        playerMode: 'solo',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: true,
      },
    })
    await db.executionLogs.put({
      id: 'exec-lc',
      planId: 'plan-lc',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: completedAt - 20 * 60_000,
      completedAt,
    })
    await db.sessionReviews.put({
      id: 'review-exec-lc',
      executionLogId: 'exec-lc',
      sessionRpe: 6,
      goodPasses: 10,
      totalAttempts: 15,
      submittedAt: completedAt,
      status: 'submitted',
    })

    render(
      <MemoryRouter initialEntries={['/setup']}>
        <Routes>
          <Route path="/setup" element={<SetupScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    // Silent pre-fill from the last context still happens.
    await screen.findByRole('radio', { name: 'Solo', checked: true })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('draft edit: pre-fills from the current draft instead of the last completed context', async () => {
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: 1,
      updatedAt: 1,
    })
    const completedAt = Date.now() - 3 * 24 * 60 * 60 * 1000
    await db.sessionPlans.put({
      id: 'plan-lc',
      presetId: 'solo_wall',
      presetName: 'Solo + Wall',
      playerCount: 1,
      blocks: [],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: completedAt - 60_000,
      context: {
        playerMode: 'solo',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: true,
      },
    })
    await db.sessionDrafts.put({
      id: 'current',
      context: {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: true,
        wallAvailable: false,
      },
      archetypeId: 'pair_net',
      archetypeName: 'Pair + Net',
      blocks: [],
      updatedAt: completedAt,
    })

    render(
      <MemoryRouter initialEntries={[{ pathname: '/setup', state: { editDraft: true } }]}>
        <Routes>
          <Route path="/setup" element={<SetupScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    await screen.findByRole('radio', { name: 'Pair', checked: true })
    expect(
      within(screen.getByRole('radiogroup', { name: 'Net available' })).getByRole('radio', {
        name: 'Yes',
        checked: true,
      }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('radiogroup', { name: /wall or fence/i })).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '40 min', checked: true })).toBeInTheDocument()
  })

  it('non-onboarding Build does NOT write onboarding.completedAt (regression guard per C-3 Unit 3 test scenarios)', async () => {
    // Pre-set the completedAt sentinel so the non-onboarding escape
    // doesn't bounce us to /onboarding/*.
    const existingCompletedAt = 1_700_000_000_000
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: existingCompletedAt,
      updatedAt: existingCompletedAt,
    })

    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/setup']}>
        <Routes>
          <Route path="/setup" element={<SetupScreen />} />
          <Route path="/safety" element={<div data-testid="safety-route">safety</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('radio', { name: 'Solo' }))
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Net available' })).getByRole('radio', {
        name: 'No',
      }),
    )
    await user.click(
      within(screen.getByRole('radiogroup', { name: /wall or fence nearby/i })).getByRole('radio', {
        name: 'No',
      }),
    )
    await user.click(screen.getByRole('button', { name: /build session/i }))

    expect(await screen.findByTestId('safety-route')).toBeInTheDocument()

    // Non-onboarding Build must NOT mutate the sentinel - updatedAt
    // unchanged from the seed, value unchanged.
    const row = await db.storageMeta.get('onboarding.completedAt')
    expect(row?.value).toBe(existingCompletedAt)
    expect(row?.updatedAt).toBe(existingCompletedAt)
  })

  /**
   * 2026-05-24 duration-honesty plan, Stage 2 — U5 (R7+R8+R10 / PD-2 (A)
   * build-on-completable). The preview build fires when Setup is
   * completable; the resulting assembled total appears above the Build
   * button. On Build commit the preview draft is persisted byte-for-
   * byte (no rebuild), so Run executes the duration the user saw at
   * commit.
   */
  describe('R7+R8+R10 assembled-duration preview (U5)', () => {
    it('surfaces the assembled total above the Build button once Setup is completable', async () => {
      const existingCompletedAt = 1_700_000_000_000
      await db.storageMeta.put({
        key: 'onboarding.completedAt',
        value: existingCompletedAt,
        updatedAt: existingCompletedAt,
      })

      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
          </Routes>
        </MemoryRouter>,
      )

      // Default Solo + Net + 15 + Recommended is completable on mount;
      // the duration appears once the preview build settles.
      const durationNode = await screen.findByTestId('setup-assembled-duration')
      expect(durationNode.textContent).toMatch(/This session will run about \d+ min\./)
    })

    it('hides the duration preview when Setup is not yet completable (incompleteHint owns the surface)', async () => {
      const existingCompletedAt = 1_700_000_000_000
      await db.storageMeta.put({
        key: 'onboarding.completedAt',
        value: existingCompletedAt,
        updatedAt: existingCompletedAt,
      })

      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
          </Routes>
        </MemoryRouter>,
      )

      // Switch to Solo + No net so the Wall question must be answered
      // before Setup is completable.
      await user.click(await screen.findByRole('radio', { name: 'Solo' }))
      await user.click(
        within(screen.getByRole('radiogroup', { name: 'Net available' })).getByRole('radio', {
          name: 'No',
        }),
      )

      // Build is disabled and the incomplete hint shows the wall ask.
      expect(screen.getByRole('button', { name: /build session/i })).toBeDisabled()
      expect(screen.getByText(/wall or fence availability/i)).toBeInTheDocument()
      // Duration preview is not rendered while Setup is incomplete.
      expect(screen.queryByTestId('setup-assembled-duration')).not.toBeInTheDocument()
    })

    it('updates the assembled total when the user changes focus mid-Setup', async () => {
      const existingCompletedAt = 1_700_000_000_000
      await db.storageMeta.put({
        key: 'onboarding.completedAt',
        value: existingCompletedAt,
        updatedAt: existingCompletedAt,
      })

      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
          </Routes>
        </MemoryRouter>,
      )

      // Default 15-min profile produces one duration.
      const initial = (await screen.findByTestId('setup-assembled-duration')).textContent
      const initialMatch = initial?.match(/about (\d+) min/)
      expect(initialMatch).not.toBeNull()
      const initialMinutes = Number.parseInt(initialMatch![1], 10)

      // Bump to 40 min — the preview rebuilds to the longer profile and
      // displays a larger total.
      await user.click(screen.getByRole('radio', { name: '40 min' }))
      const next = await screen.findByTestId('setup-assembled-duration')
      const nextMatch = next.textContent?.match(/about (\d+) min/)
      expect(nextMatch).not.toBeNull()
      const nextMinutes = Number.parseInt(nextMatch![1], 10)
      expect(nextMinutes).toBeGreaterThan(initialMinutes)
    })

    it('persists the preview-built draft on Build commit; assembled total equals persisted block sum (R7+R8)', async () => {
      const existingCompletedAt = 1_700_000_000_000
      await db.storageMeta.put({
        key: 'onboarding.completedAt',
        value: existingCompletedAt,
        updatedAt: existingCompletedAt,
      })

      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
            <Route path="/safety" element={<div data-testid="safety-route">safety</div>} />
          </Routes>
        </MemoryRouter>,
      )

      const durationNode = await screen.findByTestId('setup-assembled-duration')
      const displayedMatch = durationNode.textContent?.match(/about (\d+) min/)
      expect(displayedMatch).not.toBeNull()
      const displayedMinutes = Number.parseInt(displayedMatch![1], 10)

      await user.click(screen.getByRole('button', { name: /build session/i }))
      expect(await screen.findByTestId('safety-route')).toBeInTheDocument()

      const draft = await db.sessionDrafts.get('current')
      expect(draft).toBeDefined()
      const persistedTotal = draft!.blocks.reduce((sum, b) => sum + b.durationMinutes, 0)
      expect(persistedTotal).toBe(displayedMinutes)
    })
  })

  /**
   * 2026-05-24 duration-honesty plan, Stage 2 — U6 (R9 large-gap
   * guard). When the gap between the named profile and the assembled
   * total crosses the 5-min threshold, surface an inline `Callout
   * tone="warning"` above the Build button. The warning does NOT
   * block commit (R9: tell the truth, keep agency).
   *
   * The natural-build path rarely exceeds the 5-min threshold under
   * U2's pass-fallback recovery, so these tests stub `buildDraft` to
   * produce a sparse draft and verify the warning surface in
   * isolation. Boundary, no-fire, and commit cases all use this stub
   * pattern so the U6 surface is pinned without depending on real
   * catalog depth.
   */
  describe('R9 large-gap warning (U6)', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    function stubBuildDraftWithTotal(totalMinutes: number, context: SetupContext): void {
      const fakeDraft: SessionDraft = {
        id: 'current',
        context,
        archetypeId: 'pair_net',
        archetypeName: 'Pair + Net',
        assemblyAlgorithmVersion: 8,
        blocks: [
          {
            id: 'block-0',
            type: 'main_skill',
            drillId: 'd03',
            variantId: 'd03-pair',
            drillName: 'fixture drill',
            shortName: 'fixture',
            durationMinutes: totalMinutes,
            coachingCue: 'fixture',
            courtsideInstructions: 'fixture',
            required: true,
            rationale: 'fixture',
          },
        ],
        updatedAt: 1,
      }
      vi.spyOn(sessionBuilder, 'buildDraft').mockReturnValue(fakeDraft)
    }

    it('fires the warning when the assembled gap is >= 5 min (10-min gap fixture)', async () => {
      const existingCompletedAt = 1_700_000_000_000
      await db.storageMeta.put({
        key: 'onboarding.completedAt',
        value: existingCompletedAt,
        updatedAt: existingCompletedAt,
      })

      // Stub buildDraft to produce a 30-min total under a 40-min
      // profile — gap = 10, well over the 5-min threshold.
      stubBuildDraftWithTotal(30, {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: true,
        wallAvailable: false,
      })

      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
          </Routes>
        </MemoryRouter>,
      )

      // Switch to the 40-min profile so the stubbed 30-min total
      // produces a 10-min gap.
      await user.click(await screen.findByRole('radio', { name: '40 min' }))
      const warning = await screen.findByTestId('setup-large-gap-warning')
      expect(warning.textContent).toMatch(/about 30 min instead of 40/i)
      // Info callout is NOT rendered when warning fires (never both).
      expect(screen.queryByTestId('setup-assembled-duration')).not.toBeInTheDocument()
    })

    it('fires the warning at exactly the 5-min boundary (>=, not >)', async () => {
      const existingCompletedAt = 1_700_000_000_000
      await db.storageMeta.put({
        key: 'onboarding.completedAt',
        value: existingCompletedAt,
        updatedAt: existingCompletedAt,
      })

      stubBuildDraftWithTotal(35, {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: true,
        wallAvailable: false,
      })

      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
          </Routes>
        </MemoryRouter>,
      )

      await user.click(await screen.findByRole('radio', { name: '40 min' }))
      expect(await screen.findByTestId('setup-large-gap-warning')).toBeInTheDocument()
    })

    it('does NOT fire the warning at gap = 4 (under threshold)', async () => {
      const existingCompletedAt = 1_700_000_000_000
      await db.storageMeta.put({
        key: 'onboarding.completedAt',
        value: existingCompletedAt,
        updatedAt: existingCompletedAt,
      })

      stubBuildDraftWithTotal(36, {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: true,
        wallAvailable: false,
      })

      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
          </Routes>
        </MemoryRouter>,
      )

      await user.click(await screen.findByRole('radio', { name: '40 min' }))
      // Info callout shows the duration; warning is hidden.
      const info = await screen.findByTestId('setup-assembled-duration')
      expect(info.textContent).toMatch(/about 36 min/)
      expect(screen.queryByTestId('setup-large-gap-warning')).not.toBeInTheDocument()
    })

    it('does NOT fire the warning when the assembled total equals or exceeds the named profile (defensive)', async () => {
      const existingCompletedAt = 1_700_000_000_000
      await db.storageMeta.put({
        key: 'onboarding.completedAt',
        value: existingCompletedAt,
        updatedAt: existingCompletedAt,
      })

      // Defensive fixture: under R1+R2+R3 the total never exceeds the
      // named profile, but we pin the boundary behavior anyway.
      stubBuildDraftWithTotal(40, {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: true,
        wallAvailable: false,
      })

      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
          </Routes>
        </MemoryRouter>,
      )

      await user.click(await screen.findByRole('radio', { name: '40 min' }))
      expect(screen.queryByTestId('setup-large-gap-warning')).not.toBeInTheDocument()
      expect(await screen.findByTestId('setup-assembled-duration')).toBeInTheDocument()
    })

    it('does NOT block commit when the warning is visible', async () => {
      const existingCompletedAt = 1_700_000_000_000
      await db.storageMeta.put({
        key: 'onboarding.completedAt',
        value: existingCompletedAt,
        updatedAt: existingCompletedAt,
      })

      stubBuildDraftWithTotal(30, {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: true,
        wallAvailable: false,
      })

      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
            <Route path="/safety" element={<div data-testid="safety-route">safety</div>} />
          </Routes>
        </MemoryRouter>,
      )

      await user.click(await screen.findByRole('radio', { name: '40 min' }))
      expect(await screen.findByTestId('setup-large-gap-warning')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /build session/i })).toBeEnabled()
      await user.click(screen.getByRole('button', { name: /build session/i }))
      expect(await screen.findByTestId('safety-route')).toBeInTheDocument()
    })
  })

  it('builds the selected focus on the setup page instead of requiring a Tune today stop', async () => {
    const existingCompletedAt = 1_700_000_000_000
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: existingCompletedAt,
      updatedAt: existingCompletedAt,
    })

    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/setup']}>
        <Routes>
          <Route path="/setup" element={<SetupScreen />} />
          <Route path="/safety" element={<div data-testid="safety-route">safety</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('radio', { name: 'Pair' }))
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Net available' })).getByRole('radio', {
        name: 'Yes',
      }),
    )
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Focus' })).getByRole('radio', {
        name: 'Passing',
      }),
    )
    await user.click(screen.getByRole('button', { name: /build session/i }))

    expect(await screen.findByTestId('safety-route')).toBeInTheDocument()
    const draft = await db.sessionDrafts.get('current')
    expect(draft?.context.sessionFocus).toBe('pass')
  })

  /**
   * D154 stress steering: the on-mount preview inputs carry the derived
   * ladder positions, so the preview build — the draft handleConfirm
   * persists without rebuilding — is rung-steered. Spy-through (real
   * assembly runs) so the assertion targets the seam, not the shuffle.
   */
  it('passes the derived stress positions into the preview build (D154)', async () => {
    const existingCompletedAt = 1_700_000_000_000
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: existingCompletedAt,
      updatedAt: existingCompletedAt,
    })
    await db.sessionReviews.add({
      id: 'review-stress',
      executionLogId: 'log-stress',
      sessionRpe: 5,
      goodPasses: 0,
      totalAttempts: 0,
      submittedAt: existingCompletedAt,
      status: 'submitted',
      offeredDelta: { kind: 'stress', focus: 'pass', direction: 'more' },
      verdictChoice: 'accepted',
    })

    const buildSpy = vi.spyOn(sessionBuilder, 'buildDraft')
    try {
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
          </Routes>
        </MemoryRouter>,
      )

      // The default Solo + Net setup is completable, so the preview
      // build fires once the on-mount inputs resolve.
      await screen.findByTestId('setup-assembled-duration')

      expect(buildSpy).toHaveBeenCalled()
      const lastOptions = buildSpy.mock.calls[buildSpy.mock.calls.length - 1]?.[1]
      // No persisted skill level → beginner start (rung 1); the
      // accepted `more` on pass moves pass to 2.
      expect(lastOptions?.stressPositions).toEqual({ pass: 2, serve: 1, set: 1 })
    } finally {
      buildSpy.mockRestore()
    }
  })

  /**
   * U5/KTD6 clock calibration: the on-mount preview inputs also carry
   * the derived session-grain calibration, so the preview build — and
   * therefore the persisted draft — scales the drill-minute budget
   * toward honest wall time. Same spy-through seam as the D154 test.
   */
  it('passes the derived clock calibration into the preview build (U5)', async () => {
    const existingCompletedAt = 1_700_000_000_000
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: existingCompletedAt,
      updatedAt: existingCompletedAt,
    })
    // Three clean completes, each running 1.2x over a 20-minute plan.
    for (let i = 0; i < 3; i++) {
      const startedAt = existingCompletedAt + i * 86_400_000
      await db.sessionPlans.put(
        currentPersistedPlan({
          id: `plan-cal-${i}`,
          blocks: [{ durationMinutes: 20 }],
          createdAt: startedAt,
        }),
      )
      await db.executionLogs.put(
        currentPersistedExecutionLog({
          id: `exec-cal-${i}`,
          planId: `plan-cal-${i}`,
          status: 'completed',
          blockStatuses: [{ status: 'completed' }],
          startedAt,
          completedAt: startedAt + 24 * 60_000,
        }),
      )
    }

    const buildSpy = vi.spyOn(sessionBuilder, 'buildDraft')
    try {
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
          </Routes>
        </MemoryRouter>,
      )

      await screen.findByTestId('setup-assembled-duration')

      expect(buildSpy).toHaveBeenCalled()
      const lastOptions = buildSpy.mock.calls[buildSpy.mock.calls.length - 1]?.[1]
      expect(lastOptions?.calibration?.sampleCount).toBe(3)
      expect(lastOptions?.calibration?.overheadRatio).toBeCloseTo(1.2, 5)
    } finally {
      buildSpy.mockRestore()
    }
  })
})
