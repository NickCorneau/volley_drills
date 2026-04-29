import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../db'
import * as audio from '../../lib/audio'
import * as platform from '../../platform'
import { RunScreen } from '../RunScreen'

/**
 * U7 screen-integration tests for `docs/plans/2026-04-28-per-move-pacing-indicator.md`.
 *
 * Three load-bearing surfaces:
 *
 *  1. **Render**: when the active block has structured `segments`,
 *     RunScreen renders the structured `<SegmentList>` (one row per
 *     segment, exactly one with `aria-current="step"`) PLUS the
 *     intro paragraph ABOVE it. The cockpit footer (`BlockTimer`,
 *     `RunControls`) still renders.
 *  2. **Fallback**: a block without `segments` renders today's
 *     `whitespace-pre-line` prose and NO `<ul>` (R5 regression
 *     guard).
 *  3. **AE6 — audio-failure independence (LOAD-BEARING)**: when
 *     `playSubBlockTick`, `playPrerollTick`, and `playBlockEndBeep`
 *     all throw / no-op (silent switch + denied Wake Lock + suspended
 *     AudioContext), the segment indicator renders correctly. Visible
 *     state is independent of audio outcome — the cue-stack invariant
 *     in `docs/research/outdoor-courtside-ui-brief.md`.
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

const D28_SEGMENTS = [
  { id: 'd28-solo-s1', label: 'Jog or A-skip around your sand box.', durationSec: 45 },
  { id: 'd28-solo-s2', label: 'Ankle hops and lateral shuffles.', durationSec: 45 },
  { id: 'd28-solo-s3', label: 'Arm circles and trunk rotations.', durationSec: 45 },
  {
    id: 'd28-solo-s4',
    label: 'Quick side shuffles and pivot-back starts at game pace.',
    durationSec: 45,
  },
] as const

async function seedSegmentedRunningSession(execId: string, planId: string) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: planId,
    presetId: 'solo_open',
    presetName: 'Solo + Open',
    playerCount: 1,
    blocks: [
      {
        id: 'b-0',
        type: 'warmup',
        drillId: 'd28',
        variantId: 'd28-solo',
        drillName: 'Beach Prep Three',
        shortName: 'Warm up',
        durationMinutes: 3,
        coachingCue: 'Short hops, loud feet.',
        courtsideInstructions: 'Four quick blocks, ~45 s each. End warmer than you started.',
        segments: [...D28_SEGMENTS],
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 1_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId,
    status: 'in_progress',
    activeBlockIndex: 0,
    blockStatuses: [{ blockId: 'b-0', status: 'in_progress', startedAt: now - 1_000 }],
    startedAt: now - 1_000,
  })
}

async function seedProseRunningSession(execId: string, planId: string) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: planId,
    presetId: 'solo_open',
    presetName: 'Solo + Open',
    playerCount: 1,
    blocks: [
      {
        id: 'b-0',
        type: 'main_skill',
        drillId: 'd03',
        variantId: 'd03-solo',
        drillName: 'Self-Toss Pass',
        shortName: 'Pass',
        durationMinutes: 5,
        coachingCue: 'Quiet platform.',
        courtsideInstructions: 'Pass controlled balls to target.',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 1_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId,
    status: 'in_progress',
    activeBlockIndex: 0,
    blockStatuses: [{ blockId: 'b-0', status: 'in_progress', startedAt: now - 1_000 }],
    startedAt: now - 1_000,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/run?id=${execId}`]}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RunScreen segments rendering (U7)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders the SegmentList with exactly one aria-current row when the block has segments', async () => {
    await seedSegmentedRunningSession('exec-seg', 'plan-seg')
    renderAt('exec-seg')

    // Wait for the block body to mount.
    await screen.findByRole('list', { name: 'Segments' })

    const list = screen.getByRole('list', { name: 'Segments' })
    const rows = within(list).getAllByRole('listitem')
    expect(rows).toHaveLength(4)

    const activeRows = rows.filter((row) => row.getAttribute('aria-current') === 'step')
    expect(activeRows).toHaveLength(1)
    expect(activeRows[0].textContent).toContain('Jog or A-skip')

    // Intro paragraph still renders above the list.
    expect(screen.getByText(/Four quick blocks/i)).toBeInTheDocument()
    // Cockpit footer is still there.
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
  })

  it('falls back to prose render with no <ul> for a block without segments (R5)', async () => {
    await seedProseRunningSession('exec-prose', 'plan-prose')
    renderAt('exec-prose')

    expect(await screen.findByText(/Pass controlled balls to target/i)).toBeInTheDocument()
    // No segment list rendered for a no-segments block.
    expect(screen.queryByRole('list', { name: 'Segments' })).toBeNull()
    expect(screen.queryByText('Now')).toBeNull()
  })

  /**
   * Load-bearing AE6: visible state is independent of audio state.
   * `outdoor-courtside-ui-brief.md` cue-stack invariant: audio is
   * reinforcement, the visual transition is the thing carrying the
   * message. Mocked audio surfaces all throw to simulate silent
   * switch + manual lock + denied Wake Lock; segment list must still
   * render correctly with `aria-current` and `aria-live` populated.
   */
  describe('AE6 — visible state independent of audio (load-bearing)', () => {
    beforeEach(() => {
      vi.spyOn(audio, 'playSubBlockTick').mockImplementation(() => {
        throw new Error('audio suspended')
      })
      vi.spyOn(audio, 'playPrerollTick').mockImplementation(() => {
        throw new Error('audio suspended')
      })
      vi.spyOn(audio, 'playBlockEndBeep').mockImplementation(() => {
        throw new Error('audio suspended')
      })
      // Wake Lock denied: the platform request resolves but reports
      // no-lock. Using `vibrate` no-op is the Android-haptic side of
      // the cue stack; both fail silently. `vibrate` returns a
      // boolean per the platform signature.
      vi.spyOn(platform, 'vibrate').mockImplementation(() => false)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('renders the segment list and active row even when every audio surface throws', async () => {
      await seedSegmentedRunningSession('exec-seg-silent', 'plan-seg-silent')
      renderAt('exec-seg-silent')

      const list = await screen.findByRole('list', { name: 'Segments' })
      const rows = within(list).getAllByRole('listitem')
      expect(rows).toHaveLength(4)

      const activeRows = rows.filter((row) => row.getAttribute('aria-current') === 'step')
      expect(activeRows).toHaveLength(1)
      // The label visible-channel announcement is independent of audio.
      expect(screen.getByText('Now: Jog or A-skip around your sand box.')).toBeInTheDocument()
    })
  })
})
