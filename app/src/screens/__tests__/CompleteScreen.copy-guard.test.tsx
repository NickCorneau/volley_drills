import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { FORBIDDEN_RE } from '../../lib/copyGuard'
import { CompleteScreen } from '../CompleteScreen'

/**
 * C-2 Unit 4 / H10 / D86 / V0B-18: CompleteScreen never renders
 * forbidden summary vocabulary. `composeSummary` is the sole copy
 * source (its unit test covers the composer itself); this is the
 * integration-level guard that catches any copy introduced directly
 * in the screen's JSX.
 *
 * The regex + avoid-phrase list live in `lib/copyGuard.ts` so every
 * consuming screen test imports the same source of truth (V0B-18
 * consolidation).
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

async function seedSubmitted({
  execId,
  playerCount,
  goodPasses,
  totalAttempts,
  incompleteReason,
}: {
  execId: string
  playerCount: 1 | 2
  goodPasses: number
  totalAttempts: number
  incompleteReason?: 'time' | 'fatigue' | 'pain' | 'other'
}) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: `plan-${execId}`,
    presetId: 'preset-1',
    presetName: 'Test Preset',
    playerCount,
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
    sessionRpe: 6,
    goodPasses,
    totalAttempts,
    incompleteReason,
    submittedAt: now,
    status: 'submitted',
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/complete?id=${execId}`]}>
      <Routes>
        <Route path="/complete" element={<CompleteScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CompleteScreen copy guard (H10 / D86)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('default low-N case has no forbidden vocabulary', async () => {
    await seedSubmitted({
      execId: 'cg-low-n',
      playerCount: 1,
      goodPasses: 5,
      totalAttempts: 10,
    })
    renderAt('cg-low-n')
    await screen.findByText('Keep building')
    const scan = scanBodyAndAttributes()
    expect(scan, `forbidden word in: ${scan}`).not.toMatch(FORBIDDEN_RE)
  })

  it('default high-N pair case has no forbidden vocabulary', async () => {
    await seedSubmitted({
      execId: 'cg-high-n',
      playerCount: 2,
      goodPasses: 40,
      totalAttempts: 60,
    })
    renderAt('cg-high-n')
    await screen.findByText('Keep building')
    const scan = scanBodyAndAttributes()
    expect(scan).not.toMatch(FORBIDDEN_RE)
  })

  it('pain case has no forbidden vocabulary', async () => {
    await seedSubmitted({
      execId: 'cg-pain',
      playerCount: 1,
      goodPasses: 3,
      totalAttempts: 8,
      incompleteReason: 'pain',
    })
    renderAt('cg-pain')
    await screen.findByText('Lighter next')
    const scan = scanBodyAndAttributes()
    expect(scan).not.toMatch(FORBIDDEN_RE)
  })
})

/**
 * Testing finding testing-1: `document.body.textContent` does not include
 * attribute values. Forbidden copy in `aria-label` / `title` / `alt` /
 * `placeholder` would slip past a textContent-only sweep. Scan the text
 * AND the relevant a11y/title/alt/placeholder attribute values so the
 * guard catches both.
 */
function scanBodyAndAttributes(): string {
  const text = document.body.textContent ?? ''
  const attrNames = [
    'aria-label',
    'aria-description',
    'aria-placeholder',
    'title',
    'alt',
    'placeholder',
  ]
  const attrValues: string[] = []
  for (const attr of attrNames) {
    document.body
      .querySelectorAll(`[${attr}]`)
      .forEach((el) => {
        const v = el.getAttribute(attr)
        if (v) attrValues.push(v)
      })
  }
  return `${text}\n${attrValues.join('\n')}`
}

describe('CompleteScreen V0B-13: N alongside % on pass-rate display', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders "N% (good of total)" in the recap card, not bare percent', async () => {
    await seedSubmitted({
      execId: 'v13',
      playerCount: 1,
      goodPasses: 18,
      totalAttempts: 25,
    })
    renderAt('v13')
    await screen.findByText('Keep building')
    expect(screen.getByText('72% (18 of 25)')).toBeInTheDocument()
  })

  it('renders em dash for zero-attempt reviews, not "0%" or "NaN%"', async () => {
    await seedSubmitted({
      execId: 'v13-zero',
      playerCount: 1,
      goodPasses: 0,
      totalAttempts: 0,
    })
    renderAt('v13-zero')
    // Wait for async bundle load + summary compose before sampling body.
    await screen.findByText('Keep building')
    const body = document.body.textContent ?? ''
    // The "Good passes" recap row renders a plain hyphen sentinel when
    // no attempts were recorded (Unit 4 formatPassRateLine contract;
    // copy pass 2026-04-17 replaced the em-dash).
    expect(body).toContain('Good passes')
    expect(body).not.toMatch(/\bNaN%?/i)
    // The em-dash must NOT appear anywhere in the rendered body.
    expect(body).not.toContain('\u2014')
  })

  it('sanity: regex guard correctly fires on a forbidden fixture', () => {
    const hostile = 'This session compared to baseline shows progress.'
    expect(hostile).toMatch(FORBIDDEN_RE)
  })
})
