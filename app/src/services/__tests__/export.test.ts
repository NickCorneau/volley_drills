import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../db'
import { buildExportPayload, downloadExport } from '../export'

/**
 * V0B-15 (Phase E Unit 2): founder-accessible JSON export.
 *
 * `buildExportPayload` is the pure read that founder replay scripts
 * consume; `downloadExport` is the browser-side anchor-click trigger.
 * The payload shape MUST match what the founder's D91 / D104 replay
 * scripts expect — any additions here need a parallel update to those
 * scripts, so the test asserts the exact top-level key set.
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

beforeEach(async () => {
  await clearDb()
})

describe('buildExportPayload (V0B-15)', () => {
  it('returns the canonical payload shape even on an empty DB', async () => {
    const payload = await buildExportPayload()

    expect(Object.keys(payload).sort()).toEqual(
      [
        'exportedAt',
        'executionLogs',
        'schemaVersion',
        'sessionPlans',
        'sessionReviews',
        'storageMeta',
      ].sort(),
    )
    expect(payload.schemaVersion).toBe(4)
    expect(typeof payload.exportedAt).toBe('number')
    expect(payload.sessionPlans).toEqual([])
    expect(payload.executionLogs).toEqual([])
    expect(payload.sessionReviews).toEqual([])
    expect(payload.storageMeta).toEqual([])
  })

  it('includes every row from each tracked table', async () => {
    const now = Date.now()
    await db.sessionPlans.bulkPut([
      {
        id: 'plan-a',
        presetId: 'solo_wall',
        presetName: 'Solo + Wall',
        playerCount: 1,
        blocks: [],
        safetyCheck: {
          painFlag: false,
          heatCta: false,
          painOverridden: false,
        },
        createdAt: now - 60_000,
      },
      {
        id: 'plan-b',
        presetId: 'pair_net',
        presetName: 'Pair + Net',
        playerCount: 2,
        blocks: [],
        safetyCheck: {
          painFlag: false,
          heatCta: false,
          painOverridden: false,
        },
        createdAt: now - 30_000,
      },
    ])
    await db.executionLogs.put({
      id: 'exec-a',
      planId: 'plan-a',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 20 * 60_000,
      completedAt: now - 5 * 60_000,
      actualDurationMinutes: 15,
    })
    await db.sessionReviews.put({
      id: 'review-exec-a',
      executionLogId: 'exec-a',
      sessionRpe: 5,
      goodPasses: 8,
      totalAttempts: 12,
      submittedAt: now - 4 * 60_000,
      status: 'submitted',
      capturedAt: now - 4 * 60_000,
      captureDelaySeconds: 60,
      captureWindow: 'immediate',
      eligibleForAdaptation: true,
    })
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: now - 2 * 24 * 60 * 60 * 1000,
      updatedAt: now - 2 * 24 * 60 * 60 * 1000,
    })

    const payload = await buildExportPayload()

    expect(payload.sessionPlans).toHaveLength(2)
    expect(payload.sessionPlans.map((p) => p.id).sort()).toEqual([
      'plan-a',
      'plan-b',
    ])
    expect(payload.executionLogs).toHaveLength(1)
    expect(payload.executionLogs[0].id).toBe('exec-a')
    // V0B-23: actualDurationMinutes round-trips.
    expect(payload.executionLogs[0].actualDurationMinutes).toBe(15)

    expect(payload.sessionReviews).toHaveLength(1)
    // V0B-30 fields round-trip.
    expect(payload.sessionReviews[0].captureWindow).toBe('immediate')
    expect(payload.sessionReviews[0].eligibleForAdaptation).toBe(true)

    expect(payload.storageMeta).toHaveLength(1)
    expect(payload.storageMeta[0].key).toBe('onboarding.completedAt')
  })

  it('does NOT include sessionDrafts or timerState (transient state, not D91 replay material)', async () => {
    await db.sessionDrafts.put({
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
      updatedAt: Date.now(),
    })
    await db.timerState.put({
      id: 'active',
      executionLogId: 'exec-foo',
      blockIndex: 0,
      startedAt: Date.now(),
      accumulatedElapsed: 0,
      status: 'running',
      lastFlushedAt: Date.now(),
    })

    const payload = await buildExportPayload()

    // @ts-expect-error — sessionDrafts must NOT be a key of the payload
    expect(payload.sessionDrafts).toBeUndefined()
    // @ts-expect-error — timerState must NOT be a key of the payload
    expect(payload.timerState).toBeUndefined()
  })

  it('does not mutate the source rows', async () => {
    const plan = {
      id: 'plan-readonly',
      presetId: 'solo_wall',
      presetName: 'Solo + Wall',
      playerCount: 1 as const,
      blocks: [],
      safetyCheck: {
        painFlag: false,
        heatCta: false,
        painOverridden: false,
      },
      createdAt: 1,
    }
    await db.sessionPlans.put(plan)
    const payload = await buildExportPayload()

    // Modify the payload copy.
    payload.sessionPlans[0].presetName = 'MUTATED'

    // Source row in DB should be unchanged.
    const fromDb = await db.sessionPlans.get('plan-readonly')
    expect(fromDb?.presetName).toBe('Solo + Wall')
  })
})

describe('downloadExport (V0B-15)', () => {
  it('produces a Blob whose contents round-trip through JSON.parse to the payload', async () => {
    // Spy on URL.createObjectURL + revokeObjectURL. We can read the Blob
    // directly via FileReader in JSDOM.
    const blobs: Blob[] = []
    const createSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockImplementation((blob) => {
        if (blob instanceof Blob) blobs.push(blob)
        return 'blob:mock://test'
      })
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    // Seed one plan so the payload isn't pathologically empty.
    await db.sessionPlans.put({
      id: 'plan-dl',
      presetId: 'solo_wall',
      presetName: 'Solo + Wall',
      playerCount: 1,
      blocks: [],
      safetyCheck: {
        painFlag: false,
        heatCta: false,
        painOverridden: false,
      },
      createdAt: 1,
    })

    await downloadExport()

    // Let the microtask that triggers revoke run.
    await new Promise((r) => setTimeout(r, 0))

    expect(createSpy).toHaveBeenCalledTimes(1)
    expect(revokeSpy).toHaveBeenCalledTimes(1)
    expect(blobs).toHaveLength(1)
    expect(blobs[0].type).toBe('application/json')

    const text = await blobs[0].text()
    const parsed = JSON.parse(text)
    expect(parsed.schemaVersion).toBe(4)
    expect(parsed.sessionPlans).toHaveLength(1)
    expect(parsed.sessionPlans[0].id).toBe('plan-dl')

    createSpy.mockRestore()
    revokeSpy.mockRestore()
  })

  it('file name follows volley-drills-export-YYYY-MM-DD.json format', async () => {
    const createSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:mock://test')
    const revokeSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {})
    // Intercept anchor creation so we can read the `download` attribute.
    const clicks: string[] = []
    const originalCreate = document.createElement.bind(document)
    const createElSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tag: string) => {
        const el = originalCreate(tag)
        if (tag === 'a') {
          const anchor = el as HTMLAnchorElement
          const origClick = anchor.click.bind(anchor)
          anchor.click = () => {
            clicks.push(anchor.download)
            origClick()
          }
        }
        return el
      })

    try {
      await downloadExport()
      // Let the microtask that triggers URL.revokeObjectURL run.
      await new Promise((r) => setTimeout(r, 0))
    } finally {
      createElSpy.mockRestore()
      createSpy.mockRestore()
      revokeSpy.mockRestore()
    }

    expect(clicks).toHaveLength(1)
    expect(clicks[0]).toMatch(/^volley-drills-export-\d{4}-\d{2}-\d{2}\.json$/)
    // Basic sanity: the stamp is today's ISO date (UTC).
    const todayStamp = new Date().toISOString().slice(0, 10)
    expect(clicks[0]).toContain(todayStamp)
  })
})
