import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { isSkillLevel } from '../../lib/skillLevel'
import { getStorageMeta } from '../../services/storageMeta'
import { SettingsSkillLevelScreen } from '../SettingsSkillLevelScreen'

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

function renderScreen() {
  render(
    <MemoryRouter initialEntries={['/settings/skill-level']}>
      <Routes>
        <Route path="/settings/skill-level" element={<SettingsSkillLevelScreen />} />
        <Route path="/settings" element={<div data-testid="settings-route">settings</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('SettingsSkillLevelScreen (2026-05-04 skill-level-mutability ship, U5)', () => {
  it('renders the solo-voice heading by default and the 5 picker cards', async () => {
    renderScreen()

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Update your level' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Foundations/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Rally builders/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Side-out builders/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Competitive pair/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Not sure yet/ })).toBeInTheDocument()
  })

  it('renders the pair-voice heading when lastPlayerMode is pair', async () => {
    await db.storageMeta.put({
      key: 'lastPlayerMode',
      value: 'pair',
      updatedAt: Date.now(),
    })

    renderScreen()

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Update your shared level' }),
      ).toBeInTheDocument()
    })
  })

  it('writes onboarding.skillLevel and navigates back to /settings on pick', async () => {
    const user = userEvent.setup()
    renderScreen()

    await user.click(await screen.findByRole('button', { name: /Competitive pair/ }))

    expect(await screen.findByTestId('settings-route')).toBeInTheDocument()

    const saved = await getStorageMeta('onboarding.skillLevel', isSkillLevel)
    expect(saved).toBe('competitive_pair')
  })

  it('does NOT mutate onboarding.step on pick (R5 — distinguishes from first-open SkillLevelScreen)', async () => {
    // Pre-set a step value to confirm it's preserved.
    await db.storageMeta.put({
      key: 'onboarding.step',
      value: 'completed',
      updatedAt: Date.now(),
    })

    const user = userEvent.setup()
    renderScreen()

    await user.click(await screen.findByRole('button', { name: /Foundations/ }))
    await screen.findByTestId('settings-route')

    const stepEntry = await db.storageMeta.get('onboarding.step')
    expect(stepEntry?.value).toBe('completed')
  })

  it('Back button routes to /settings without writing', async () => {
    const user = userEvent.setup()
    renderScreen()

    await user.click(await screen.findByRole('button', { name: /back/i }))
    expect(await screen.findByTestId('settings-route')).toBeInTheDocument()

    const saved = await getStorageMeta('onboarding.skillLevel', isSkillLevel)
    expect(saved).toBeUndefined()
  })

  it('writes the picked level even when storageMeta already had a value (overwrites cleanly)', async () => {
    await db.storageMeta.put({
      key: 'onboarding.skillLevel',
      value: 'foundations',
      updatedAt: Date.now(),
    })

    const user = userEvent.setup()
    renderScreen()

    await user.click(await screen.findByRole('button', { name: /Side-out builders/ }))
    await screen.findByTestId('settings-route')

    const saved = await getStorageMeta('onboarding.skillLevel', isSkillLevel)
    expect(saved).toBe('side_out_builders')
  })
})
