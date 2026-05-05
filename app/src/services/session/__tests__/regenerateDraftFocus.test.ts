import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db'
import { buildDraft } from '../../../domain/sessionBuilder'
import { regenerateDraftFocus } from '../regenerateDraftFocus'

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

function makeDraft() {
  const draft = buildDraft(
    {
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: true,
      wallAvailable: false,
    },
    { assemblySeed: 'regenerate-focus-baseline' },
  )
  if (!draft) throw new Error('Expected fixture draft to build')
  return { ...draft, updatedAt: 100 }
}

beforeEach(async () => {
  await clearDb()
})

describe('regenerateDraftFocus', () => {
  it('regenerates and saves a focused draft', async () => {
    const draft = makeDraft()
    await db.sessionDrafts.put(draft)

    const result = await regenerateDraftFocus({
      expectedUpdatedAt: draft.updatedAt,
      sessionFocus: 'serve',
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.changed).toBe(true)
    expect(result.draft.context.sessionFocus).toBe('serve')

    const saved = await db.sessionDrafts.get('current')
    expect(saved?.context.sessionFocus).toBe('serve')
    const mainSkill = saved?.blocks.find((block) => block.type === 'main_skill')
    expect(mainSkill).toBeDefined()
  })

  it('restores a baseline draft through the guarded path', async () => {
    const baseline = makeDraft()
    const focused = {
      ...baseline,
      context: { ...baseline.context, sessionFocus: 'serve' as const },
      updatedAt: 200,
    }
    await db.sessionDrafts.put(focused)

    const result = await regenerateDraftFocus({
      expectedUpdatedAt: focused.updatedAt,
      useBaseline: true,
      baselineDraft: baseline,
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.changed).toBe(true)
    expect(result.draft.context.sessionFocus).toBeUndefined()

    const saved = await db.sessionDrafts.get('current')
    expect(saved?.context.sessionFocus).toBeUndefined()
  })

  it('returns stale without overwriting a newer draft', async () => {
    const draft = makeDraft()
    await db.sessionDrafts.put({ ...draft, updatedAt: 200 })

    const result = await regenerateDraftFocus({
      expectedUpdatedAt: 100,
      sessionFocus: 'serve',
    })

    expect(result).toEqual({ ok: false, reason: 'stale' })
    const saved = await db.sessionDrafts.get('current')
    expect(saved?.updatedAt).toBe(200)
    expect(saved?.context.sessionFocus).toBeUndefined()
  })

  it('returns changed false when selecting the already-saved focus', async () => {
    const draft = {
      ...makeDraft(),
      context: { ...makeDraft().context, sessionFocus: 'serve' as const },
    }
    await db.sessionDrafts.put(draft)

    const result = await regenerateDraftFocus({
      expectedUpdatedAt: draft.updatedAt,
      sessionFocus: 'serve',
    })

    expect(result).toEqual({ ok: true, draft, changed: false })
  })

  describe('onboarding skill-level propagation (2026-05-04 skill-level-mutability ship, U3)', () => {
    it('propagates levelRelaxed: true to the saved draft when onboarding maps to advanced + serving (catalog gap)', async () => {
      // 'competitive_pair' → 'advanced'; catalog has zero
      // levelMax: 'advanced' drills with serve focus, so any
      // serving regen must surface the relaxation.
      await db.storageMeta.put({
        key: 'onboarding.skillLevel',
        value: 'competitive_pair',
        updatedAt: Date.now(),
      })
      const draft = makeDraft()
      await db.sessionDrafts.put(draft)

      const result = await regenerateDraftFocus({
        expectedUpdatedAt: draft.updatedAt,
        sessionFocus: 'serve',
      })

      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.draft.levelRelaxed).toBe(true)

      const saved = await db.sessionDrafts.get('current')
      expect(saved?.levelRelaxed).toBe(true)
    })

    it('propagates levelRelaxed: false when onboarding maps to a level the catalog can fully honor', async () => {
      await db.storageMeta.put({
        key: 'onboarding.skillLevel',
        value: 'foundations',
        updatedAt: Date.now(),
      })
      const draft = makeDraft()
      await db.sessionDrafts.put(draft)

      const result = await regenerateDraftFocus({
        expectedUpdatedAt: draft.updatedAt,
        sessionFocus: 'pass',
      })

      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.draft.levelRelaxed).toBe(false)

      const saved = await db.sessionDrafts.get('current')
      expect(saved?.levelRelaxed).toBe(false)
    })

    it('recomputes levelRelaxed on regen rather than carrying a stale value (the user-named regression)', async () => {
      // Seed a stale draft with levelRelaxed: true (e.g., left over
      // from a previous higher-level config). Onboarding now maps
      // to a level the catalog can fully honor for the new focus.
      // Regen must recompute the flag to false rather than carry
      // the stale true through to the saved row.
      await db.storageMeta.put({
        key: 'onboarding.skillLevel',
        value: 'foundations',
        updatedAt: Date.now(),
      })
      const draft = { ...makeDraft(), levelRelaxed: true }
      await db.sessionDrafts.put(draft)

      const result = await regenerateDraftFocus({
        expectedUpdatedAt: draft.updatedAt,
        sessionFocus: 'pass',
      })

      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.draft.levelRelaxed).toBe(false)

      const saved = await db.sessionDrafts.get('current')
      expect(saved?.levelRelaxed).toBe(false)
    })
  })
})
