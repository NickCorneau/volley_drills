import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { RUN_FLOW_LABELS, SUNSET_RUN_FLOW_LABELS } from '../../contracts/runFlowLexicon'
import { db } from '../../db'
import { RunScreen } from '../RunScreen'
import { TransitionScreen } from '../TransitionScreen'

/**
 * U7 cross-surface lexicon guard (run-flow beat contract Stage 1, R3/R4).
 *
 * Renders the two live beats from real seeded sessions and pins the
 * contract at the rendered-DOM level: Transition shows the "Start" CTA
 * and no coaching cue; Run shows the "Now" cue and no full read; and no
 * `SUNSET_RUN_FLOW_LABELS` entry appears in DOM text or ARIA on either
 * beat. The scanner is case-SENSITIVE and whole-phrase so a retired
 * label rendered at its canonical casing is caught WITHOUT colliding
 * with active copy that merely shares a lowercase token ("Go back",
 * "coaching cue"). The final `describe` is the non-vacuous proof: the
 * scanner fires on planted retired labels and stays silent on the active
 * copy it must not flag.
 */

const TRANSITION_CUE = 'Set your contact point before the feed arrives.'
const TRANSITION_READ = 'Feed yourself a high toss and return it to the same spot each time.'
const RUN_CUE = 'Quiet platform, eyes to target.'
const RUN_READ = 'GUARDREAD alpha setup line.\nGUARDREAD bravo setup line.'

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

async function seedTransition(execId: string, planId: string) {
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
        drillName: 'Beach Prep Three',
        shortName: 'Beach Prep',
        durationMinutes: 3,
        coachingCue: 'Short hops, loud feet.',
        courtsideInstructions: 'Four quick blocks, ~45 s each.',
        required: true,
      },
      {
        id: 'b-1',
        type: 'main_skill',
        drillName: 'Pass into a Corner',
        shortName: 'Pass Corner',
        durationMinutes: 5,
        coachingCue: TRANSITION_CUE,
        courtsideInstructions: TRANSITION_READ,
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId,
    status: 'in_progress',
    activeBlockIndex: 1,
    blockStatuses: [
      { blockId: 'b-0', status: 'completed', startedAt: now - 200_000, completedAt: now - 30_000 },
      { blockId: 'b-1', status: 'in_progress' },
    ],
    startedAt: now - 200_000,
  })
}

async function seedRun(execId: string, planId: string) {
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
        drillName: 'Passing',
        shortName: 'Pass',
        durationMinutes: 5,
        coachingCue: RUN_CUE,
        courtsideInstructions: RUN_READ,
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId,
    status: 'paused',
    activeBlockIndex: 0,
    blockStatuses: [{ blockId: 'b-0', status: 'in_progress' }],
    startedAt: now - 30_000,
    pausedAt: now - 5_000,
  })
}

function renderTransition(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/run/transition?id=${execId}`]}>
      <Routes>
        <Route path="/run/transition" element={<TransitionScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

function renderRun(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/run?id=${execId}`]}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function collectTextAndAria(root: ParentNode): string {
  // Collect each text node separately so adjacent-sibling text does not
  // smush ("...blockGO...") and defeat the whole-phrase boundary scan.
  const parts: string[] = []
  const doc = (root as Node).ownerDocument ?? document
  const walker = doc.createTreeWalker(root as Node, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const value = node.textContent
    if (value && value.trim()) parts.push(value)
  }
  for (const attr of ['aria-label', 'aria-description', 'title', 'alt'] as const) {
    root.querySelectorAll(`[${attr}]`).forEach((el) => {
      const value = el.getAttribute(attr)
      if (value) parts.push(value)
    })
  }
  return parts.join('\n')
}

function findSunsetHits(haystack: string): string[] {
  return SUNSET_RUN_FLOW_LABELS.filter((label) => {
    // Case-sensitive, whole-phrase. `GO` will not match "Go back";
    // `Cue` will not match "coaching cue".
    const re = new RegExp(`(^|[^\\w])${escapeRegExp(label)}([^\\w]|$)`)
    return re.test(haystack)
  })
}

describe('run-flow lexicon guard — Transition beat', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders the "Start" CTA, no coaching cue, and no retired label', async () => {
    await seedTransition('exec-guard-t', 'plan-guard-t')
    const { container } = renderTransition('exec-guard-t')
    await screen.findByText('Pass into a Corner')

    expect(screen.getByRole('button', { name: RUN_FLOW_LABELS.startAction })).toBeInTheDocument()
    // The cue's only home is Run's "Now" — none of it leaks onto Transition.
    expect(screen.queryByText(TRANSITION_CUE)).toBeNull()
    expect(screen.queryByText('Cue')).toBeNull()

    expect(findSunsetHits(collectTextAndAria(container))).toEqual([])
  })
})

describe('run-flow lexicon guard — Run beat', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders the "Now" cue, no full read, and no retired label', async () => {
    await seedRun('exec-guard-r', 'plan-guard-r')
    const { container } = renderRun('exec-guard-r')
    expect(await screen.findByText(RUN_FLOW_LABELS.cue)).toBeInTheDocument()
    expect(screen.getByText(RUN_CUE)).toBeInTheDocument()

    // Run-flow beat contract Stage 1 (R7b): the full read is homed on
    // Transition, never on Run.
    expect(screen.queryByText(/GUARDREAD/)).toBeNull()
    expect(collectTextAndAria(container)).not.toContain('GUARDREAD')

    expect(findSunsetHits(collectTextAndAria(container))).toEqual([])
  })
})

describe('run-flow lexicon guard — scanner is non-vacuous', () => {
  it('flags every planted retired label', () => {
    const { container } = render(
      <div>
        {SUNSET_RUN_FLOW_LABELS.map((label) => (
          <p key={label}>{label}</p>
        ))}
      </div>,
    )
    expect(findSunsetHits(collectTextAndAria(container)).sort()).toEqual(
      [...SUNSET_RUN_FLOW_LABELS].sort(),
    )
  })

  it('does not false-positive on active copy that shares a token', () => {
    const { container } = render(
      <div>
        <button type="button">Go back</button>
        <span>{RUN_FLOW_LABELS.startAction}</span>
        <span>{RUN_FLOW_LABELS.peek}</span>
        <span aria-label="Full coaching cue">coaching cue</span>
      </div>,
    )
    expect(findSunsetHits(collectTextAndAria(container))).toEqual([])
  })
})
