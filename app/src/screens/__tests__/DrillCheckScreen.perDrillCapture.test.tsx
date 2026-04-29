import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../db'
import { DRILLS } from '../../data/drills'
import { loadReviewDraft, patchReviewDraft, saveReviewDraft } from '../../services/review'
import type { BlockSlotType } from '../../types/session'
import { DrillCheckScreen } from '../DrillCheckScreen'

vi.mock('../../services/review', async () => {
  const actual = await vi.importActual<typeof import('../../services/review')>(
    '../../services/review',
  )
  return {
    ...actual,
    loadReviewDraft: vi.fn(actual.loadReviewDraft),
    saveReviewDraft: vi.fn(actual.saveReviewDraft),
    patchReviewDraft: vi.fn(actual.patchReviewDraft),
  }
})

/**
 * 2026-04-27 pre-D91 editorial polish (plan Item 9): per-drill capture
 * wiring on the dedicated `/run/check` reflective beat.
 *
 * Originally lived on `TransitionScreen` under D133 (Tier 1b). The
 * surface moved to `DrillCheckScreen` so the next-drill briefing on
 * Transition is single-purpose. Capture rules are unchanged; only the
 * host route moved.
 *
 * Sources:
 *   docs/plans/2026-04-26-pre-d91-editorial-polish.md Item 9
 *   docs/specs/m001-review-micro-spec.md §"Per-drill capture at Drill Check (D133)"
 *   docs/research/2026-04-26-pair-rep-capture-options.md (Framing D)
 *
 * What this file pins:
 *   - Capture surface renders when the prev block is completed and either
 *     main_skill / pressure, or count-eligible regardless of slot type.
 *     Warmup, wrap, non-count support slots, and skipped blocks bypass.
 *   - The "Continue" CTA stays disabled until a difficulty chip is
 *     tapped; the gating hint is visible while disabled.
 *   - A tap on a chip persists a `perDrillCaptures` row through
 *     `saveReviewDraft` so the tag survives a Finish-Later round trip.
 *   - An existing draft with a capture for this block hydrates the
 *     chip and clears the gating hint on first render.
 */

const COUNT_DRILL = (() => {
  const drill = DRILLS.find(
    (d) =>
      d.variants[0]?.successMetric.type === 'pass-rate-good' ||
      d.variants[0]?.successMetric.type === 'reps-successful',
  )
  if (!drill) throw new Error('test fixture: no count drill in catalog')
  return drill
})()

const COUNT_VARIANT = COUNT_DRILL.variants[0]!

function drillById(id: string) {
  const drill = DRILLS.find((candidate) => candidate.id === id)
  if (!drill) throw new Error(`test fixture: missing drill ${id}`)
  return drill
}

function variantById(drill: (typeof DRILLS)[number], id: string) {
  const variant = drill.variants.find((candidate) => candidate.id === id)
  if (!variant) throw new Error(`test fixture: missing variant ${id}`)
  return variant
}

const TECHNIQUE_COUNT_DRILL = drillById('d10')
const TECHNIQUE_COUNT_VARIANT = variantById(TECHNIQUE_COUNT_DRILL, 'd10-pair')
const MOVEMENT_COUNT_DRILL = drillById('d03')
const MOVEMENT_COUNT_VARIANT = variantById(MOVEMENT_COUNT_DRILL, 'd03-pair')
const NON_COUNT_DRILL = drillById('d38')
const NON_COUNT_VARIANT = variantById(NON_COUNT_DRILL, 'd38-pair')

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

async function seedTwoBlockSession({
  prevType,
  prevCompleted,
  prevDrill = COUNT_DRILL,
  prevVariant = COUNT_VARIANT,
  playerCount = 1,
  prevBlockIndex = 0,
}: {
  prevType: BlockSlotType
  prevCompleted: boolean
  prevDrill?: (typeof DRILLS)[number]
  prevVariant?: (typeof DRILLS)[number]['variants'][number]
  playerCount?: 1 | 2
  prevBlockIndex?: number
}) {
  const execId = 'exec-drillcheck-test'
  const planId = `plan-${execId}`
  const now = Date.now()
  const priorBlocks = Array.from({ length: prevBlockIndex }, (_, index) => ({
    id: `block-prior-${index}`,
    type: 'technique' as const,
    drillId: COUNT_DRILL.id,
    variantId: COUNT_VARIANT.id,
    drillName: COUNT_DRILL.name,
    shortName: COUNT_DRILL.shortName ?? COUNT_DRILL.name,
    durationMinutes: 4,
    coachingCue: '',
    courtsideInstructions: '',
    required: true,
  }))

  await db.sessionPlans.put({
    id: planId,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount,
    blocks: [
      ...priorBlocks,
      {
        id: 'block-prev',
        type: prevType,
        drillId: prevDrill.id,
        variantId: prevVariant.id,
        drillName: prevDrill.name,
        shortName: prevDrill.shortName ?? prevDrill.name,
        durationMinutes: 5,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
      {
        id: 'block-next',
        type: 'main_skill',
        drillId: COUNT_DRILL.id,
        variantId: COUNT_VARIANT.id,
        drillName: COUNT_DRILL.name,
        shortName: COUNT_DRILL.shortName ?? COUNT_DRILL.name,
        durationMinutes: 8,
        coachingCue: '',
        courtsideInstructions: '',
        required: false,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })

  await db.executionLogs.put({
    id: execId,
    planId,
    status: 'in_progress',
    activeBlockIndex: prevBlockIndex + 1,
    blockStatuses: [
      ...priorBlocks.map((block) => ({
        blockId: block.id,
        status: 'completed' as const,
      })),
      {
        blockId: 'block-prev',
        status: prevCompleted ? 'completed' : 'skipped',
      },
      { blockId: 'block-next', status: 'planned' },
    ],
    startedAt: now - 10 * 60_000,
  })

  return execId
}

// Probe component that exposes the current router location to the
// test, so bypass redirects are observable as a structural assertion
// (the user lands on `/run/transition`) rather than only as a "capture
// card not present" assertion.
function LocationProbe() {
  const location = useLocation()
  return <div data-testid="route-probe">{location.pathname}</div>
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/run/check?id=${execId}`]}>
      <Routes>
        <Route
          path="/run/check"
          element={
            <>
              <LocationProbe />
              <DrillCheckScreen />
            </>
          }
        />
        <Route
          path="/run/transition"
          element={
            <>
              <LocationProbe />
              <div>TransitionScreen stub</div>
            </>
          }
        />
        <Route
          path="/run"
          element={
            <>
              <LocationProbe />
              <div>RunScreen stub</div>
            </>
          }
        />
        <Route
          path="/review"
          element={
            <>
              <LocationProbe />
              <div>ReviewScreen stub</div>
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(async () => {
  const actualReview = await vi.importActual<typeof import('../../services/review')>(
    '../../services/review',
  )
  vi.mocked(loadReviewDraft).mockImplementation(actualReview.loadReviewDraft)
  vi.mocked(saveReviewDraft).mockImplementation(actualReview.saveReviewDraft)
  vi.mocked(patchReviewDraft).mockImplementation(actualReview.patchReviewDraft)
  vi.clearAllMocks()
  await clearDb()
})

describe('DrillCheckScreen per-drill capture (Item 9 / D133)', () => {
  it('bypasses to /run/transition when the prev block was a warmup', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'warmup',
      prevCompleted: true,
    })
    renderAt(execId)

    // Wait for the bypass effect to land on the Transition stub. The
    // capture card never renders because the screen unmounts before
    // first paint of the body.
    await waitFor(() => {
      expect(screen.getByTestId('route-probe')).toHaveTextContent('/run/transition')
    })
    expect(screen.queryByTestId('per-drill-capture')).not.toBeInTheDocument()
  })

  it('bypasses to /run/transition when the prev block was a wrap', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'wrap',
      prevCompleted: true,
    })
    renderAt(execId)

    await waitFor(() => {
      expect(screen.getByTestId('route-probe')).toHaveTextContent('/run/transition')
    })
    expect(screen.queryByTestId('per-drill-capture')).not.toBeInTheDocument()
  })

  it('bypasses to /run/transition when the prev block was skipped', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: false,
    })
    renderAt(execId)

    await waitFor(() => {
      expect(screen.getByTestId('route-probe')).toHaveTextContent('/run/transition')
    })
    expect(screen.queryByTestId('per-drill-capture')).not.toBeInTheDocument()
  })

  it('renders capture with counts for a count-eligible technique block', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'technique',
      prevCompleted: true,
      prevDrill: TECHNIQUE_COUNT_DRILL,
      prevVariant: TECHNIQUE_COUNT_VARIANT,
      playerCount: 2,
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    expect(screen.getByTestId('per-drill-add-counts')).toBeInTheDocument()
  })

  it('renders capture with counts for a count-eligible movement_proxy block', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'movement_proxy',
      prevCompleted: true,
      prevDrill: MOVEMENT_COUNT_DRILL,
      prevVariant: MOVEMENT_COUNT_VARIANT,
      playerCount: 2,
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    expect(screen.getByTestId('per-drill-add-counts')).toBeInTheDocument()
  })

  it('bypasses a non-count technique block until per-metric capture shapes ship', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'technique',
      prevCompleted: true,
      prevDrill: NON_COUNT_DRILL,
      prevVariant: NON_COUNT_VARIANT,
      playerCount: 2,
    })
    renderAt(execId)

    await waitFor(() => {
      expect(screen.getByTestId('route-probe')).toHaveTextContent('/run/transition')
    })
    expect(screen.queryByTestId('per-drill-capture')).not.toBeInTheDocument()
  })

  it('keeps main_skill non-count drills on the difficulty-only capture path', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
      prevDrill: NON_COUNT_DRILL,
      prevVariant: NON_COUNT_VARIANT,
      playerCount: 2,
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    expect(screen.queryByTestId('per-drill-add-counts')).not.toBeInTheDocument()
  })

  it('renders the capture card and gates Continue until a chip is tapped', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    const cont = screen.getByRole('button', { name: /continue/i })
    expect(cont).toBeDisabled()
    expect(screen.getByTestId('drill-check-gating-hint')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: /still learning/i }))

    await waitFor(() => {
      expect(cont).not.toBeDisabled()
    })
    expect(screen.queryByTestId('drill-check-gating-hint')).not.toBeInTheDocument()
  })

  it('does not render the capture card until draft hydration has completed', async () => {
    let resolveDraft!: (draft: Awaited<ReturnType<typeof loadReviewDraft>>) => void
    const pendingDraft = new Promise<Awaited<ReturnType<typeof loadReviewDraft>>>((resolve) => {
      resolveDraft = resolve
    })
    vi.mocked(loadReviewDraft).mockReturnValueOnce(pendingDraft)

    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
    })
    renderAt(execId)

    expect(screen.queryByTestId('per-drill-capture')).not.toBeInTheDocument()

    await act(async () => {
      resolveDraft(null)
      await pendingDraft
    })

    expect(await screen.findByTestId('per-drill-capture')).toBeInTheDocument()
  })

  it('persists the tapped difficulty into the review draft via patchReviewDraft', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    fireEvent.click(screen.getByRole('radio', { name: /too hard/i }))

    await waitFor(() => expect(patchReviewDraft).toHaveBeenCalled())
    const [calledExecId, patch] = vi.mocked(patchReviewDraft).mock.calls.at(-1) ?? []
    expect(calledExecId).toBe(execId)
    expect(patch?.perDrillCaptures).toHaveLength(1)
    const row = patch!.perDrillCaptures![0]
    expect(row).toBeDefined()
    if (row) {
      expect(row.difficulty).toBe('too_hard')
      expect(row.drillId).toBe(COUNT_DRILL.id)
      expect(row.variantId).toBe(COUNT_VARIANT.id)
      expect(row.blockIndex).toBe(0)
    }
    // Drill Check must not pass any of Review's form fields, so it
    // cannot clobber an in-progress RPE / note write (U1).
    expect(patch).not.toHaveProperty('sessionRpe')
    expect(patch).not.toHaveProperty('goodPasses')
    expect(patch).not.toHaveProperty('totalAttempts')
  })

  it('persists optional Good/Total counts from the capture surface', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'movement_proxy',
      prevCompleted: true,
      prevDrill: MOVEMENT_COUNT_DRILL,
      prevVariant: MOVEMENT_COUNT_VARIANT,
      playerCount: 2,
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    fireEvent.click(screen.getByTestId('per-drill-add-counts'))
    fireEvent.change(screen.getByLabelText(/^good$/i), { target: { value: '7' } })
    fireEvent.blur(screen.getByLabelText(/^good$/i))
    fireEvent.change(screen.getByLabelText(/^total$/i), { target: { value: '10' } })
    fireEvent.blur(screen.getByLabelText(/^total$/i))
    fireEvent.click(screen.getByRole('radio', { name: /still learning/i }))

    await waitFor(async () => {
      const draft = await db.sessionReviews.where('executionLogId').equals(execId).first()
      const row = draft?.perDrillCaptures?.[0]
      expect(row).toEqual(
        expect.objectContaining({
          drillId: MOVEMENT_COUNT_DRILL.id,
          variantId: MOVEMENT_COUNT_VARIANT.id,
          blockIndex: 0,
          difficulty: 'still_learning',
          goodPasses: 7,
          attemptCount: 10,
        }),
      )
    })
  })

  it('preserves earlier captures when saving a later block capture', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
      prevBlockIndex: 1,
    })
    await db.sessionReviews.put({
      id: `review-${execId}`,
      executionLogId: execId,
      sessionRpe: null,
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: [
        {
          drillId: COUNT_DRILL.id,
          variantId: COUNT_VARIANT.id,
          blockIndex: 0,
          difficulty: 'too_easy',
          capturedAt: Date.now(),
        },
      ],
      submittedAt: Date.now(),
      status: 'draft',
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    fireEvent.click(screen.getByRole('radio', { name: /still learning/i }))

    await waitFor(async () => {
      const draft = await db.sessionReviews.where('executionLogId').equals(execId).first()
      expect(draft?.perDrillCaptures?.map((capture) => capture.blockIndex)).toEqual([0, 1])
      expect(draft?.perDrillCaptures?.[0]?.difficulty).toBe('too_easy')
      expect(draft?.perDrillCaptures?.[1]?.difficulty).toBe('still_learning')
    })
  })

  it('replaces an existing capture for the same block instead of duplicating it', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
    })
    await db.sessionReviews.put({
      id: `review-${execId}`,
      executionLogId: execId,
      sessionRpe: null,
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: [
        {
          drillId: COUNT_DRILL.id,
          variantId: COUNT_VARIANT.id,
          blockIndex: 0,
          difficulty: 'too_easy',
          capturedAt: Date.now(),
        },
      ],
      submittedAt: Date.now(),
      status: 'draft',
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    fireEvent.click(screen.getByRole('radio', { name: /too hard/i }))

    await waitFor(async () => {
      const draft = await db.sessionReviews.where('executionLogId').equals(execId).first()
      expect(draft?.perDrillCaptures).toHaveLength(1)
      expect(draft?.perDrillCaptures?.[0]?.blockIndex).toBe(0)
      expect(draft?.perDrillCaptures?.[0]?.difficulty).toBe('too_hard')
    })
  })

  it('waits for the latest per-drill capture save before navigating to transition', async () => {
    let resolveSave!: () => void
    const pendingSave = new Promise<void>((resolve) => {
      resolveSave = resolve
    })
    vi.mocked(patchReviewDraft).mockReturnValueOnce(pendingSave)

    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    fireEvent.click(screen.getByRole('radio', { name: /still learning/i }))
    await waitFor(() => expect(patchReviewDraft).toHaveBeenCalled())

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(screen.getByTestId('route-probe')).toHaveTextContent('/run/check')

    await act(async () => {
      resolveSave()
      await pendingSave
    })

    await waitFor(() => {
      expect(screen.getByTestId('route-probe')).toHaveTextContent('/run/transition')
    })
  })

  it('stays on Drill Check and shows an error when a pending capture save rejects', async () => {
    let rejectSave!: (err: Error) => void
    const pendingSave = new Promise<void>((_, reject) => {
      rejectSave = reject
    })
    vi.mocked(patchReviewDraft).mockReturnValueOnce(pendingSave)

    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    fireEvent.click(screen.getByRole('radio', { name: /still learning/i }))
    await waitFor(() => expect(patchReviewDraft).toHaveBeenCalled())

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByTestId('route-probe')).toHaveTextContent('/run/check')

    await act(async () => {
      rejectSave(new Error('save failed'))
      await pendingSave.catch(() => undefined)
    })

    expect(screen.getByTestId('route-probe')).toHaveTextContent('/run/check')
    expect(await screen.findByText(/could not save this drill check/i)).toBeInTheDocument()
  })

  it('stays on Drill Check and shows an error when the Continue flush rejects', async () => {
    vi.mocked(patchReviewDraft)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('flush failed'))

    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    fireEvent.click(screen.getByRole('radio', { name: /still learning/i }))
    await waitFor(() => expect(patchReviewDraft).toHaveBeenCalledTimes(1))

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(screen.getByTestId('route-probe')).toHaveTextContent('/run/check')
    })
    expect(await screen.findByText(/could not save this drill check/i)).toBeInTheDocument()
  })

  it('rehydrates the tapped chip when an existing draft already has a capture for this block', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
    })

    await db.sessionReviews.put({
      id: `review-${execId}`,
      executionLogId: execId,
      sessionRpe: null,
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: [
        {
          drillId: COUNT_DRILL.id,
          variantId: COUNT_VARIANT.id,
          blockIndex: 0,
          difficulty: 'too_easy',
          capturedAt: Date.now(),
        },
      ],
      submittedAt: Date.now(),
      status: 'draft',
    })

    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    await waitFor(() => {
      expect(screen.getByRole('radio', { name: /too easy/i })).toHaveAttribute(
        'aria-checked',
        'true',
      )
    })
    expect(screen.queryByTestId('drill-check-gating-hint')).not.toBeInTheDocument()
  })

  it('navigates to /run/transition on Continue after a chip is tapped', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    fireEvent.click(screen.getByRole('radio', { name: /still learning/i }))

    const cont = screen.getByRole('button', { name: /continue/i })
    await waitFor(() => expect(cont).not.toBeDisabled())
    fireEvent.click(cont)

    await waitFor(() => {
      expect(screen.getByTestId('route-probe')).toHaveTextContent('/run/transition')
    })
  })

  // D134 (2026-04-28): Phase 2A streak path. The just-finished drill
  // is a `streak`-typed `main_skill` block (`d38-pair` Bump Set
  // Fundamentals); the screen renders the `Add longest streak
  // (optional)` drawer instead of the `Add counts` affordance, and
  // a typed-and-blurred value persists on the row as
  // `metricCapture: { kind: 'streak', longest }`. Mutual exclusion
  // with count fields is enforced at the model layer; this test
  // verifies the wire-up.
  describe('Phase 2A streak path (D134)', () => {
    it('renders the streak drawer for a streak-typed main_skill drill (not the count drawer)', async () => {
      const execId = await seedTwoBlockSession({
        prevType: 'main_skill',
        prevCompleted: true,
        prevDrill: NON_COUNT_DRILL,
        prevVariant: NON_COUNT_VARIANT,
        playerCount: 2,
      })
      renderAt(execId)

      await screen.findByTestId('per-drill-capture')
      expect(screen.getByTestId('per-drill-add-streak')).toBeInTheDocument()
      expect(screen.queryByTestId('per-drill-add-counts')).not.toBeInTheDocument()
    })

    it('persists a streak capture as metricCapture: { kind: streak, longest }', async () => {
      const execId = await seedTwoBlockSession({
        prevType: 'main_skill',
        prevCompleted: true,
        prevDrill: NON_COUNT_DRILL,
        prevVariant: NON_COUNT_VARIANT,
        playerCount: 2,
      })
      renderAt(execId)

      await screen.findByTestId('per-drill-capture')
      fireEvent.click(screen.getByRole('radio', { name: /still learning/i }))
      fireEvent.click(screen.getByTestId('per-drill-add-streak'))
      const input = screen.getByTestId('per-drill-streak-input')
      fireEvent.change(input, { target: { value: '7' } })
      fireEvent.blur(input)

      await waitFor(async () => {
        const draft = await db.sessionReviews.where('executionLogId').equals(execId).first()
        const row = draft?.perDrillCaptures?.[0]
        expect(row).toEqual(
          expect.objectContaining({
            drillId: NON_COUNT_DRILL.id,
            variantId: NON_COUNT_VARIANT.id,
            blockIndex: 0,
            difficulty: 'still_learning',
            metricCapture: { kind: 'streak', longest: 7 },
          }),
        )
        // Mutual exclusion: a streak row never carries count fields.
        expect(row?.goodPasses).toBeUndefined()
        expect(row?.attemptCount).toBeUndefined()
        expect(row?.notCaptured).toBeUndefined()
      })
    })

    it('does NOT block Continue when the streak drawer is left blank', async () => {
      const execId = await seedTwoBlockSession({
        prevType: 'main_skill',
        prevCompleted: true,
        prevDrill: NON_COUNT_DRILL,
        prevVariant: NON_COUNT_VARIANT,
        playerCount: 2,
      })
      renderAt(execId)

      await screen.findByTestId('per-drill-capture')
      fireEvent.click(screen.getByRole('radio', { name: /still learning/i }))

      const cont = screen.getByRole('button', { name: /continue/i })
      await waitFor(() => expect(cont).not.toBeDisabled())
      fireEvent.click(cont)

      await waitFor(() => {
        expect(screen.getByTestId('route-probe')).toHaveTextContent('/run/transition')
      })
    })

    it('does NOT block Continue when the streak drawer holds an invalid value', async () => {
      const execId = await seedTwoBlockSession({
        prevType: 'main_skill',
        prevCompleted: true,
        prevDrill: NON_COUNT_DRILL,
        prevVariant: NON_COUNT_VARIANT,
        playerCount: 2,
      })
      renderAt(execId)

      await screen.findByTestId('per-drill-capture')
      fireEvent.click(screen.getByRole('radio', { name: /still learning/i }))
      fireEvent.click(screen.getByTestId('per-drill-add-streak'))
      const input = screen.getByTestId('per-drill-streak-input')
      fireEvent.change(input, { target: { value: '1.5' } })
      fireEvent.blur(input)

      const cont = screen.getByRole('button', { name: /continue/i })
      await waitFor(() => expect(cont).not.toBeDisabled())
      fireEvent.click(cont)

      await waitFor(() => {
        expect(screen.getByTestId('route-probe')).toHaveTextContent('/run/transition')
      })
      // The persisted row collapses to difficulty-only — no
      // metricCapture, no count fields.
      const draft = await db.sessionReviews.where('executionLogId').equals(execId).first()
      const row = draft?.perDrillCaptures?.[0]
      expect(row?.metricCapture).toBeUndefined()
      expect(row?.goodPasses).toBeUndefined()
      expect(row?.attemptCount).toBeUndefined()
      expect(row?.difficulty).toBe('still_learning')
    })

    it('rehydrates streakLongest from an existing draft row with metricCapture', async () => {
      const execId = await seedTwoBlockSession({
        prevType: 'main_skill',
        prevCompleted: true,
        prevDrill: NON_COUNT_DRILL,
        prevVariant: NON_COUNT_VARIANT,
        playerCount: 2,
      })
      await db.sessionReviews.put({
        id: `review-${execId}`,
        executionLogId: execId,
        sessionRpe: null,
        goodPasses: 0,
        totalAttempts: 0,
        perDrillCaptures: [
          {
            drillId: NON_COUNT_DRILL.id,
            variantId: NON_COUNT_VARIANT.id,
            blockIndex: 0,
            difficulty: 'still_learning',
            capturedAt: Date.now(),
            metricCapture: { kind: 'streak', longest: 5 },
          },
        ],
        submittedAt: Date.now(),
        status: 'draft',
      })
      renderAt(execId)

      await screen.findByTestId('per-drill-capture')
      // The chip rehydrates first.
      await waitFor(() => {
        expect(screen.getByRole('radio', { name: /still learning/i })).toHaveAttribute(
          'aria-checked',
          'true',
        )
      })
      // Open the streak drawer; the input should rehydrate to 5.
      fireEvent.click(screen.getByTestId('per-drill-add-streak'))
      const input = screen.getByTestId('per-drill-streak-input') as HTMLInputElement
      expect(input.value).toBe('5')
    })
  })
})
