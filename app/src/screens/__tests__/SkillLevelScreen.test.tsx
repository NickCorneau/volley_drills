import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { isSkillLevel } from '../../lib/skillLevel'
import { isOnboardingStep } from '../../lib/onboarding'
import { getStorageMeta } from '../../services/storageMeta'
import { SkillLevelScreen } from '../SkillLevelScreen'

/**
 * C-3 Unit 2 (D121 / D-C4): SkillLevelScreen renders four pair-first
 * functional bands + a "Not sure yet" escape. Each tap atomically writes
 * `storageMeta.onboarding.skillLevel` (machine enum) AND
 * `storageMeta.onboarding.step = 'todays_setup'` before navigating to
 * `/onboarding/todays-setup`. No back arrow (first-open = no prior
 * screen per H9 / C-3 plan).
 *
 * D128 (2026-04-19 follow-on to Phase F Unit 2): cold-state default is
 * **solo voice** ("Where are you today?"), not pair voice. Pair voice
 * only shows when `storageMeta.lastPlayerMode === 'pair'`. See the
 * voice-aware tests at the bottom of this file.
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

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/onboarding/skill-level']}>
      <Routes>
        <Route
          path="/onboarding/skill-level"
          element={<SkillLevelScreen />}
        />
        <Route
          path="/onboarding/todays-setup"
          element={<div data-testid="todays-setup-route">next</div>}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('SkillLevelScreen (C-3 Unit 2 / D121)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it("renders the welcome preamble + solo-voice cold-state heading + 'You can change this later.' (D128)", async () => {
    renderScreen()
    expect(
      await screen.findByText(/welcome\. let.?s get you started\./i),
    ).toBeInTheDocument()
    // D128: cold-state default is solo voice. The returning-pair path
    // below covers the flip to pair voice.
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /where are you today\?/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /where.?s the pair today\?/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByText(/you can change this later/i)).toBeInTheDocument()
  })

  it('renders five interactive elements: 4 band buttons + 1 Not-sure-yet link', async () => {
    renderScreen()
    const buttons = await screen.findAllByRole('button')
    // No back arrow on first-open (the Not-sure-yet link is rendered as a
    // text button, which is still counted here). The four band buttons
    // plus the escape -> 5 interactive total. If a back arrow were
    // accidentally added, the count would exceed 5.
    expect(buttons).toHaveLength(5)
    expect(
      screen.getByRole('button', { name: /foundations/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /rally builders/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /side-out builders/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /competitive pair/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /not sure yet/i }),
    ).toBeInTheDocument()
  })

  it('each band button renders its short action-anchored descriptor', async () => {
    renderScreen()
    const foundations = await screen.findByRole('button', {
      name: /foundations/i,
    })
    expect(
      within(foundations).getByText(/keeping a friendly toss alive/i),
    ).toBeInTheDocument()

    const rally = screen.getByRole('button', { name: /rally builders/i })
    expect(
      within(rally).getByText(/pass easy serves, short rallies/i),
    ).toBeInTheDocument()

    const sideOut = screen.getByRole('button', { name: /side-out builders/i })
    expect(
      within(sideOut).getByText(/pass to target, attack the 3rd/i),
    ).toBeInTheDocument()

    const comp = screen.getByRole('button', { name: /competitive pair/i })
    expect(
      within(comp).getByText(/tougher serves, game-like play/i),
    ).toBeInTheDocument()
  })

  it('tapping "Foundations" atomically writes skillLevel + step and navigates to /onboarding/todays-setup', async () => {
    const user = userEvent.setup()
    renderScreen()
    await user.click(
      await screen.findByRole('button', { name: /foundations/i }),
    )

    expect(
      await screen.findByTestId('todays-setup-route'),
    ).toBeInTheDocument()

    const skillLevel = await getStorageMeta(
      'onboarding.skillLevel',
      isSkillLevel,
    )
    const step = await getStorageMeta('onboarding.step', isOnboardingStep)
    expect(skillLevel).toBe('foundations')
    expect(step).toBe('todays_setup')
  })

  it('tapping "Rally builders" writes skillLevel === "rally_builders"', async () => {
    const user = userEvent.setup()
    renderScreen()
    await user.click(
      await screen.findByRole('button', { name: /rally builders/i }),
    )

    expect(
      await screen.findByTestId('todays-setup-route'),
    ).toBeInTheDocument()
    const skillLevel = await getStorageMeta(
      'onboarding.skillLevel',
      isSkillLevel,
    )
    expect(skillLevel).toBe('rally_builders')
  })

  it('tapping "Side-out builders" writes skillLevel === "side_out_builders"', async () => {
    const user = userEvent.setup()
    renderScreen()
    await user.click(
      await screen.findByRole('button', { name: /side-out builders/i }),
    )
    const skillLevel = await getStorageMeta(
      'onboarding.skillLevel',
      isSkillLevel,
    )
    expect(skillLevel).toBe('side_out_builders')
  })

  it('tapping "Competitive pair" writes skillLevel === "competitive_pair"', async () => {
    const user = userEvent.setup()
    renderScreen()
    await user.click(
      await screen.findByRole('button', { name: /competitive pair/i }),
    )
    const skillLevel = await getStorageMeta(
      'onboarding.skillLevel',
      isSkillLevel,
    )
    expect(skillLevel).toBe('competitive_pair')
  })

  it('tapping "Not sure yet" writes skillLevel === "unsure" (explicit opt-out, not a sentinel)', async () => {
    const user = userEvent.setup()
    renderScreen()
    await user.click(
      await screen.findByRole('button', { name: /not sure yet/i }),
    )

    expect(
      await screen.findByTestId('todays-setup-route'),
    ).toBeInTheDocument()
    const skillLevel = await getStorageMeta(
      'onboarding.skillLevel',
      isSkillLevel,
    )
    const step = await getStorageMeta('onboarding.step', isOnboardingStep)
    expect(skillLevel).toBe('unsure')
    expect(step).toBe('todays_setup')
  })

  it('writes skillLevel and step ATOMICALLY (multi-key transaction, not two separate writes)', async () => {
    const user = userEvent.setup()
    renderScreen()
    await user.click(
      await screen.findByRole('button', { name: /foundations/i }),
    )
    await screen.findByTestId('todays-setup-route')

    // Read both rows; their `updatedAt` should match (single
    // `setStorageMetaMany` transaction writes one timestamp for both).
    const skillRow = await db.storageMeta.get('onboarding.skillLevel')
    const stepRow = await db.storageMeta.get('onboarding.step')
    expect(skillRow).toBeDefined()
    expect(stepRow).toBeDefined()
    expect(skillRow!.updatedAt).toBe(stepRow!.updatedAt)
  })

  it('renders no back arrow (first-open = no prior screen per H9)', async () => {
    renderScreen()
    await screen.findByText(/welcome\. let.?s get you started\./i)
    expect(
      screen.queryByRole('button', { name: /back/i }),
    ).not.toBeInTheDocument()
  })

  // Phase F Unit 2 (2026-04-19) + D128 - voice-aware header copy.
  //
  // Cold state (no prior session) reads as **solo voice** per D128 -
  // covered by the cold-state heading test above. The two tests below
  // cover the returning-solo-tester + returning-pair-tester paths:
  // `storageMeta.lastPlayerMode` flips the heading copy without
  // touching the D121 taxonomy. The returning-pair case is the only
  // path that now shows "Where's the pair today?" - pair voice is no
  // longer the cold-state default.

  it('Phase F Unit 2: returning solo tester sees solo-voice heading', async () => {
    await db.storageMeta.put({
      key: 'lastPlayerMode',
      value: 'solo',
      updatedAt: Date.now(),
    })
    renderScreen()

    // `loadVoiceFromStorage` resolves asynchronously; wait for the
    // flip. If the voice never loaded, the default pair heading would
    // still render.
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /where are you today\?/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /where.?s the pair today\?/i }),
    ).not.toBeInTheDocument()
  })

  it('Phase F Unit 2: returning pair tester sees pair-voice heading (unchanged)', async () => {
    await db.storageMeta.put({
      key: 'lastPlayerMode',
      value: 'pair',
      updatedAt: Date.now(),
    })
    renderScreen()

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /where.?s the pair today\?/i,
      }),
    ).toBeInTheDocument()
  })

  it('Phase F Unit 2: voice flip does NOT alter the persisted enum taxonomy (solo tester still writes "foundations")', async () => {
    const user = userEvent.setup()
    await db.storageMeta.put({
      key: 'lastPlayerMode',
      value: 'solo',
      updatedAt: Date.now(),
    })
    renderScreen()

    await screen.findByRole('heading', { name: /where are you today\?/i })
    await user.click(
      screen.getByRole('button', { name: /foundations/i }),
    )

    const skillLevel = await getStorageMeta(
      'onboarding.skillLevel',
      isSkillLevel,
    )
    // Enum persisted is identical across voices - D121 taxonomy is
    // untouched by Phase F.
    expect(skillLevel).toBe('foundations')
  })
})
