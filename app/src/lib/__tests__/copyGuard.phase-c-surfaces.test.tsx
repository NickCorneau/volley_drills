import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { Brandmark } from '../../components/Brandmark'
import { HomePrimaryCard } from '../../components/HomePrimaryCard'
import { HomeSecondaryRow } from '../../components/HomeSecondaryRow'
import { SoftBlockModal } from '../../components/SoftBlockModal'
import { StaleContextBanner } from '../../components/StaleContextBanner'
import { db } from '../../db'
import type { SessionDraft } from '../../db'
import { HomeScreen } from '../../screens/HomeScreen'
import { SettingsScreen } from '../../screens/SettingsScreen'
import { SkillLevelScreen } from '../../screens/SkillLevelScreen'
import { TodaysSetupScreen } from '../../screens/TodaysSetupScreen'
import type {
  LastCompleteBundle,
  PendingReview,
  ResumableSession,
} from '../../services/session'
import { scanElementForForbidden } from '../copyGuard'

/**
 * V0B-18 (Phase E Unit 3): per-surface regression scan.
 *
 * Every Phase C screen and component that renders user-visible copy
 * gets a one-test entry here asserting its rendered body + ARIA
 * attributes carry no D86 forbidden vocabulary. Complements
 * (doesn't replace) the deeper unit tests already living alongside
 * each surface (e.g. `CompleteScreen.copy-guard.test.tsx` covers
 * the 3-case summary matrix end-to-end; this file is the broad
 * sweep that catches regressions anywhere a new copy string sneaks in).
 *
 * Fixtures are intentionally minimal — the goal is "mount, render,
 * scan", not to exercise flows. A legit forbidden phrase here means
 * the offending copy literal itself is in the component JSX.
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

const fakePendingReview: PendingReview = {
  executionId: 'exec-pending',
  planName: 'Solo + Wall',
  completedAt: 1_700_000_000_000,
  deferralRemainingMs: 60 * 60 * 1000,
}

const fakeDraft: SessionDraft = {
  id: 'current',
  context: {
    playerMode: 'solo',
    timeProfile: 15,
    netAvailable: false,
    wallAvailable: false,
  },
  archetypeId: 'solo_open',
  archetypeName: 'Solo + Open',
  blocks: [],
  updatedAt: 1,
}

const fakeLastComplete: LastCompleteBundle = {
  log: {
    id: 'exec-last',
    planId: 'plan-last',
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: 1,
    completedAt: 1_700_000_000_000,
  },
  plan: {
    id: 'plan-last',
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [
      {
        id: 'b-1',
        type: 'main_skill',
        drillName: 'Passing',
        shortName: 'Pass',
        durationMinutes: 25,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: 1,
  },
  review: {
    id: 'review-exec-last',
    executionLogId: 'exec-last',
    sessionRpe: 6,
    goodPasses: 12,
    totalAttempts: 20,
    submittedAt: 1_700_000_000_000,
    status: 'submitted',
  },
}

const fakeResume: ResumableSession = {
  execution: fakeLastComplete.log,
  plan: fakeLastComplete.plan,
  interruptedAt: 1_700_000_000_000,
}

function assertClean(container: HTMLElement, surface: string) {
  const matches = scanElementForForbidden(container)
  expect(
    matches,
    `D86 forbidden vocabulary in ${surface}: ${JSON.stringify(matches)}`,
  ).toEqual([])
}

describe('V0B-18 D86 per-surface regression scan', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('Brandmark', () => {
    const { container } = render(<Brandmark />)
    assertClean(container, 'Brandmark')
  })

  it('StaleContextBanner', () => {
    const { container } = render(<StaleContextBanner dayName="Tuesday" />)
    assertClean(container, 'StaleContextBanner')
  })

  it('SoftBlockModal', () => {
    const { container } = render(
      <SoftBlockModal
        pendingReview={fakePendingReview}
        onFinish={() => {}}
        onSkipAndContinue={() => {}}
        onClose={() => {}}
      />,
    )
    assertClean(container, 'SoftBlockModal')
  })

  describe('HomePrimaryCard — all variants', () => {
    it('new_user', () => {
      const { container } = render(
        <HomePrimaryCard variant="new_user" onStart={() => {}} />,
      )
      assertClean(container, 'HomePrimaryCard.new_user')
    })

    it('review_pending (idle + confirming-skip)', () => {
      const idle = render(
        <HomePrimaryCard
          variant="review_pending"
          data={fakePendingReview}
          confirmingSkip={false}
          onFinish={() => {}}
          onSkip={() => {}}
          onConfirmSkip={() => {}}
          onCancelSkip={() => {}}
        />,
      )
      assertClean(idle.container, 'HomePrimaryCard.review_pending idle')

      const confirming = render(
        <HomePrimaryCard
          variant="review_pending"
          data={fakePendingReview}
          confirmingSkip
          onFinish={() => {}}
          onSkip={() => {}}
          onConfirmSkip={() => {}}
          onCancelSkip={() => {}}
        />,
      )
      assertClean(
        confirming.container,
        'HomePrimaryCard.review_pending confirming',
      )
    })

    it('draft', () => {
      const { container } = render(
        <HomePrimaryCard
          variant="draft"
          data={fakeDraft}
          onStart={() => {}}
          onEdit={() => {}}
        />,
      )
      assertClean(container, 'HomePrimaryCard.draft')
    })

    it('last_complete (normal + ended-early)', () => {
      // Phase F refactor: old `onEdit` + `onSameAsLast` merged into
      // a single `onStartDifferent` handler.
      const normal = render(
        <HomePrimaryCard
          variant="last_complete"
          data={fakeLastComplete}
          onRepeat={() => {}}
          onStartDifferent={() => {}}
        />,
      )
      assertClean(normal.container, 'HomePrimaryCard.last_complete normal')

      const endedEarly = render(
        <HomePrimaryCard
          variant="last_complete"
          data={{
            ...fakeLastComplete,
            log: {
              ...fakeLastComplete.log,
              status: 'ended_early',
              blockStatuses: [{ blockId: 'b-1', status: 'completed' }],
            },
          }}
          onRepeat={() => {}}
          onStartDifferent={() => {}}
          onRepeatWhatYouDid={() => {}}
        />,
      )
      assertClean(
        endedEarly.container,
        'HomePrimaryCard.last_complete ended_early',
      )
    })

    it('resume (ResumePrompt delegated)', () => {
      const { container } = render(
        <HomePrimaryCard
          variant="resume"
          data={fakeResume}
          onResume={() => {}}
          onDiscard={() => {}}
        />,
      )
      assertClean(container, 'HomePrimaryCard.resume')
    })
  })

  describe('HomeSecondaryRow — all variants', () => {
    it('review_pending_advisory', () => {
      const { container } = render(
        <ul>
          <HomeSecondaryRow
            variant="review_pending_advisory"
            data={fakePendingReview}
            onFinish={() => {}}
          />
        </ul>,
      )
      assertClean(container, 'HomeSecondaryRow.review_pending_advisory')
    })

    it('draft', () => {
      const { container } = render(
        <ul>
          <HomeSecondaryRow
            variant="draft"
            data={fakeDraft}
            onOpen={() => {}}
          />
        </ul>,
      )
      assertClean(container, 'HomeSecondaryRow.draft')
    })

    it('last_complete', () => {
      const { container } = render(
        <ul>
          <HomeSecondaryRow
            variant="last_complete"
            data={fakeLastComplete}
            onRepeat={() => {}}
          />
        </ul>,
      )
      assertClean(container, 'HomeSecondaryRow.last_complete')
    })
  })

  it('HomeScreen (new_user empty state)', async () => {
    const { container } = render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>,
    )
    await screen.findByRole('button', { name: /start first workout/i })
    assertClean(container, 'HomeScreen new_user')
  })

  it('SettingsScreen', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </MemoryRouter>,
    )
    await screen.findByRole('button', { name: /export training records/i })
    assertClean(container, 'SettingsScreen')
  })

  it('SkillLevelScreen', async () => {
    const { container } = render(
      <MemoryRouter>
        <SkillLevelScreen />
      </MemoryRouter>,
    )
    await screen.findByRole('heading', { name: /where.*pair today/i })
    assertClean(container, 'SkillLevelScreen')
  })

  it('TodaysSetupScreen (onboarding wrapper around SetupScreen)', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/onboarding/todays-setup']}>
        <Routes>
          <Route
            path="/onboarding/todays-setup"
            element={<TodaysSetupScreen />}
          />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /build session/i }),
      ).toBeInTheDocument(),
    )
    assertClean(container, 'TodaysSetupScreen')
  })
})
