import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../db'
import * as sessionBuilder from '../../domain/sessionBuilder'
import * as planInputsService from '../../services/planInputs'
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
    // D158 (setup-01 frame 06): the incomplete hint renders twice on
    // purpose — once in the focal slot at the top of the cluster, once
    // in the footer next to the disabled Build button.
    expect(screen.getAllByText('Choose wall or fence availability to build.')).toHaveLength(2)
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

      // Build is disabled and the incomplete hint shows the wall ask
      // (focal slot + footer per D158 frame 06).
      expect(screen.getByRole('button', { name: /build session/i })).toBeDisabled()
      expect(screen.getAllByText(/wall or fence availability/i).length).toBeGreaterThan(0)
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
    // D159: a named pick is the user's choice — no resolved provenance.
    expect(draft?.context.focusSource).toBeUndefined()
  })

  /**
   * D158 (2026-06-12 shibui comp review, setup-01 frame):
   * recommendation-first restructure. A focal resolved line tops the
   * refine cluster ("Solo + Net · 14 min · Recommended focus"); its
   * minute segment always reads the *assembled preview total* — the
   * same number the footer Callout reports — so the screen's two
   * duration statements can never disagree (duration-honesty R4).
   * While Setup is incomplete the slot carries the existing hint copy
   * in quiet secondary voice instead of a fabricated summary.
   */
  describe('D158 setup-01 focal resolved line', () => {
    beforeEach(async () => {
      await db.storageMeta.put({
        key: 'onboarding.completedAt',
        value: 1_700_000_000_000,
        updatedAt: 1_700_000_000_000,
      })
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('renders archetype + assembled minutes + focus, agreeing with the footer Callout', async () => {
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
          </Routes>
        </MemoryRouter>,
      )

      // D159: Recommended resolves through the plan — a fresh DB
      // resolves deterministically to the staleness tie-break head
      // (pass), rendered with its provenance.
      const line = await screen.findByTestId('setup-resolved-line')
      expect(line.textContent).toMatch(/^Solo \+ Net · \d+ min · Passing \(recommended\)$/)

      const lineMinutes = line.textContent?.match(/· (\d+) min ·/)?.[1]
      const callout = await screen.findByTestId('setup-assembled-duration')
      const calloutMinutes = callout.textContent?.match(/about (\d+) min/)?.[1]
      expect(lineMinutes).toBeDefined()
      expect(lineMinutes).toBe(calloutMinutes)
    })

    it('tracks an explicit focus chip in the resolved line', async () => {
      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
          </Routes>
        </MemoryRouter>,
      )

      await screen.findByTestId('setup-resolved-line')
      await user.click(
        within(screen.getByRole('radiogroup', { name: 'Focus' })).getByRole('radio', {
          name: 'Passing',
        }),
      )

      await waitFor(() => {
        expect(screen.getByTestId('setup-resolved-line').textContent).toMatch(/Passing focus$/)
      })

      // Post-change duration honesty: the rebuilt line's minutes still
      // agree with the footer Callout. All three line segments read the
      // same preview build (the focus label comes from
      // `previewDraft.context`, not live chip state), so a focus change
      // can never pair a fresh label with the previous build's minutes.
      const lineMinutes = screen
        .getByTestId('setup-resolved-line')
        .textContent?.match(/· (\d+) min ·/)?.[1]
      const calloutMinutes = screen
        .getByTestId('setup-assembled-duration')
        .textContent?.match(/about (\d+) min/)?.[1]
      expect(lineMinutes).toBeDefined()
      expect(lineMinutes).toBe(calloutMinutes)
    })

    it('derives the focus segment from the preview draft context, not live chip state', async () => {
      // Discriminating pin for the atomic-segments fix: stub buildDraft
      // to return a draft whose context stamps a focus that disagrees
      // with the clicked chip. Under draft-context sourcing the line
      // reads the draft's focus; under the old live-chip sourcing it
      // would read the chip's. (The disagreement is synthetic — in
      // production the rebuilt draft always reflects the chips one
      // commit later; this isolates the sourcing, which act() flushing
      // makes unobservable with the real builder.)
      const fakeDraft: SessionDraft = {
        id: 'current',
        context: {
          playerMode: 'solo',
          timeProfile: 15,
          netAvailable: true,
          wallAvailable: false,
          sessionFocus: 'serve',
        },
        archetypeId: 'solo_net',
        archetypeName: 'Solo + Net',
        assemblyAlgorithmVersion: 8,
        blocks: [
          {
            id: 'block-0',
            type: 'main_skill',
            drillId: 'd03',
            variantId: 'd03-solo',
            drillName: 'fixture drill',
            shortName: 'fixture',
            durationMinutes: 14,
            coachingCue: 'fixture',
            courtsideInstructions: 'fixture',
            required: true,
            rationale: 'fixture',
          },
        ],
        updatedAt: 1,
      }
      vi.spyOn(sessionBuilder, 'buildDraft').mockReturnValue(fakeDraft)

      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
          </Routes>
        </MemoryRouter>,
      )

      await screen.findByTestId('setup-resolved-line')
      await user.click(
        within(screen.getByRole('radiogroup', { name: 'Focus' })).getByRole('radio', {
          name: 'Passing',
        }),
      )

      await waitFor(() => {
        expect(screen.getByTestId('setup-resolved-line').textContent).toMatch(/Serving focus$/)
      })
    })

    it('renders the quiet hint placeholder in the focal slot while Setup is incomplete', async () => {
      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
          </Routes>
        </MemoryRouter>,
      )

      await user.click(await screen.findByRole('radio', { name: 'Solo' }))
      await user.click(
        within(screen.getByRole('radiogroup', { name: 'Net available' })).getByRole('radio', {
          name: 'No',
        }),
      )

      expect(screen.queryByTestId('setup-resolved-line')).not.toBeInTheDocument()
      expect(screen.getByTestId('setup-resolved-line-placeholder').textContent).toBe(
        'Choose wall or fence availability to build.',
      )
    })
  })

  /**
   * D159: with the Recommended pill selected, Setup resolves
   * `nextFocus` through the same composePlan-over-loadPlanInputs read
   * Home uses and stamps `sessionFocus` + `focusSource: 'resolved'`
   * into the build context — staleness rotation and stress steering on
   * the default path, with honest provenance and unstamped fallbacks.
   */
  describe('D159 Recommended resolves through the derived plan', () => {
    beforeEach(async () => {
      await db.storageMeta.put({
        key: 'onboarding.completedAt',
        value: 1_700_000_000_000,
        updatedAt: 1_700_000_000_000,
      })
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    async function seedTrainedSession(
      suffix: string,
      drillName: string,
      endedAt: number,
    ): Promise<void> {
      await db.sessionPlans.put(
        currentPersistedPlan({
          id: `plan-${suffix}`,
          blocks: [{ drillName }],
          createdAt: endedAt - 30 * 60_000,
        }),
      )
      await db.executionLogs.put(
        currentPersistedExecutionLog({
          id: `exec-${suffix}`,
          planId: `plan-${suffix}`,
          status: 'completed',
          blockStatuses: [{ status: 'completed' }],
          startedAt: endedAt - 25 * 60_000,
          completedAt: endedAt,
        }),
      )
    }

    it('stamps the staleness head with resolved provenance and steering inputs (R1)', async () => {
      // Pass and set were trained recently; serve never → serve is the
      // staleness head the Recommended build must resolve to.
      const now = Date.now()
      await seedTrainedSession('pass', 'Continuous Passing', now - 2 * 86_400_000)
      await seedTrainedSession('set', 'Bump Set Fundamentals', now - 1 * 86_400_000)

      const buildSpy = vi.spyOn(sessionBuilder, 'buildDraft')
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
          </Routes>
        </MemoryRouter>,
      )

      await screen.findByTestId('setup-assembled-duration')

      const [context, options] = buildSpy.mock.calls[buildSpy.mock.calls.length - 1]!
      expect(context.sessionFocus).toBe('serve')
      expect(context.focusSource).toBe('resolved')
      // The steering inputs ride the same build (D154 seam).
      expect(options?.stressPositions).toBeDefined()

      const line = screen.getByTestId('setup-resolved-line')
      expect(line.textContent).toMatch(/Serving \(recommended\)$/)
    })

    it('fresh user: Build persists a pass-stamped resolved draft (deterministic head)', async () => {
      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
            <Route path="/safety" element={<div data-testid="safety-route">safety</div>} />
          </Routes>
        </MemoryRouter>,
      )

      await screen.findByTestId('setup-assembled-duration')
      await user.click(screen.getByRole('button', { name: /build session/i }))
      expect(await screen.findByTestId('safety-route')).toBeInTheDocument()

      const draft = await db.sessionDrafts.get('current')
      expect(draft?.context.sessionFocus).toBe('pass')
      expect(draft?.context.focusSource).toBe('resolved')
    })

    it('hydrates a resolved draft to the Recommended pill and re-resolves the summary line', async () => {
      // Divergent fixture: the persisted draft was resolved to serve,
      // but the current staleness head is pass (fresh DB). The pill
      // maps to Recommended, the line shows the re-resolved focus, and
      // the persisted draft stays untouched until Build.
      await db.sessionDrafts.put({
        id: 'current',
        context: {
          playerMode: 'pair',
          timeProfile: 40,
          netAvailable: true,
          wallAvailable: false,
          sessionFocus: 'serve',
          focusSource: 'resolved',
        },
        archetypeId: 'pair_net',
        archetypeName: 'Pair + Net',
        blocks: [],
        updatedAt: 1,
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
        within(screen.getByRole('radiogroup', { name: 'Focus' })).getByRole('radio', {
          name: 'Recommended',
          checked: true,
        }),
      ).toBeInTheDocument()

      const line = await screen.findByTestId('setup-resolved-line')
      expect(line.textContent).toMatch(/Passing \(recommended\)$/)

      // The preview rebuild never writes — the draft is untouched until Build.
      const persisted = await db.sessionDrafts.get('current')
      expect(persisted?.context.sessionFocus).toBe('serve')
      expect(persisted?.updatedAt).toBe(1)
    })

    it('hydrates a user-picked draft focus to its named pill (provenance-free)', async () => {
      await db.sessionDrafts.put({
        id: 'current',
        context: {
          playerMode: 'pair',
          timeProfile: 40,
          netAvailable: true,
          wallAvailable: false,
          sessionFocus: 'serve',
        },
        archetypeId: 'pair_net',
        archetypeName: 'Pair + Net',
        blocks: [],
        updatedAt: 1,
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
        within(screen.getByRole('radiogroup', { name: 'Focus' })).getByRole('radio', {
          name: 'Serving',
          checked: true,
        }),
      ).toBeInTheDocument()
      const line = await screen.findByTestId('setup-resolved-line')
      expect(line.textContent).toMatch(/Serving focus$/)
    })

    it('falls back to the unstamped integrative build when the stamped build returns null', async () => {
      const unstampedDraft: SessionDraft = {
        id: 'current',
        context: {
          playerMode: 'solo',
          timeProfile: 15,
          netAvailable: true,
          wallAvailable: false,
        },
        archetypeId: 'solo_net',
        archetypeName: 'Solo + Net',
        assemblyAlgorithmVersion: 8,
        blocks: [
          {
            id: 'block-0',
            type: 'main_skill',
            drillId: 'd03',
            variantId: 'd03-solo',
            drillName: 'fixture drill',
            shortName: 'fixture',
            durationMinutes: 14,
            coachingCue: 'fixture',
            courtsideInstructions: 'fixture',
            required: true,
            rationale: 'fixture',
          },
        ],
        updatedAt: 1,
      }
      const buildSpy = vi
        .spyOn(sessionBuilder, 'buildDraft')
        .mockImplementation((context) => (context.focusSource === 'resolved' ? null : unstampedDraft))

      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
            <Route path="/safety" element={<div data-testid="safety-route">safety</div>} />
          </Routes>
        </MemoryRouter>,
      )

      // The fallback build renders (no error), reading as unstamped
      // Recommended.
      const line = await screen.findByTestId('setup-resolved-line')
      expect(line.textContent).toMatch(/Recommended focus$/)

      // The stamped attempt happened, then the unstamped retry.
      const stampedCalls = buildSpy.mock.calls.filter(
        ([context]) => context.focusSource === 'resolved',
      )
      const unstampedCalls = buildSpy.mock.calls.filter(
        ([context]) => context.focusSource === undefined && context.sessionFocus === undefined,
      )
      expect(stampedCalls.length).toBeGreaterThan(0)
      expect(unstampedCalls.length).toBeGreaterThan(0)

      // Build commits the fallback draft without surfacing an error.
      await user.click(screen.getByRole('button', { name: /build session/i }))
      expect(await screen.findByTestId('safety-route')).toBeInTheDocument()
      const draft = await db.sessionDrafts.get('current')
      expect(draft?.context.sessionFocus).toBeUndefined()
    })

    it('keeps Recommended unstamped and usable when the plan-input load rejects', async () => {
      vi.spyOn(planInputsService, 'loadPlanInputs').mockRejectedValue(new Error('boom'))

      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
            <Route path="/safety" element={<div data-testid="safety-route">safety</div>} />
          </Routes>
        </MemoryRouter>,
      )

      const line = await screen.findByTestId('setup-resolved-line')
      expect(line.textContent).toMatch(/Recommended focus$/)

      await user.click(screen.getByRole('button', { name: /build session/i }))
      expect(await screen.findByTestId('safety-route')).toBeInTheDocument()
      const draft = await db.sessionDrafts.get('current')
      expect(draft?.context.sessionFocus).toBeUndefined()
      expect(draft?.context.focusSource).toBeUndefined()
    })

    it('stamps the draft when Build fires before the preview inputs settle (confirm fallback mirrors resolution)', async () => {
      // Hold the plan-input read open so the mount inputs never settle
      // before Build; the confirm fallback must resolve on its own.
      let resolvePlanInputs: (bundle: planInputsService.PlanInputsBundle) => void = () => undefined
      const pending = new Promise<planInputsService.PlanInputsBundle>((resolve) => {
        resolvePlanInputs = resolve
      })
      vi.spyOn(planInputsService, 'loadPlanInputs').mockReturnValue(pending)

      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route path="/setup" element={<SetupScreen />} />
            <Route path="/safety" element={<div data-testid="safety-route">safety</div>} />
          </Routes>
        </MemoryRouter>,
      )

      // Build immediately — the preview inputs are still pending.
      await user.click(await screen.findByRole('button', { name: /build session/i }))
      expect(screen.queryByTestId('setup-assembled-duration')).not.toBeInTheDocument()

      resolvePlanInputs({
        reviews: [],
        trainedSessions: [],
        skillBand: undefined,
        lastAcceptedDelta: null,
      })

      expect(await screen.findByTestId('safety-route')).toBeInTheDocument()
      const draft = await db.sessionDrafts.get('current')
      expect(draft?.context.sessionFocus).toBe('pass')
      expect(draft?.context.focusSource).toBe('resolved')
    })
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
