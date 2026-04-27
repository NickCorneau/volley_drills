import { describe, expect, it } from 'vitest'
import {
  selectPrimaryCard,
  selectSecondaryRows,
  type FlagSummary,
  type PrimaryVariant,
  type SecondaryRow,
} from './homePriority'

/**
 * C-4 Unit 2: pure precedence functions for the Home priority model.
 *
 * Precedence (flat, 4-row per H11 / C5 - no age tiers):
 *   resume > review_pending > draft > last_complete > new_user
 *
 * Secondary row rules (per C-4 plan Unit 2):
 *   - resume primary mutes everything (empty secondary list)
 *   - review_pending primary: draft + last_complete appear as secondary
 *     rows when active
 *   - draft primary: last_complete appears as secondary when active
 *   - last_complete or new_user primary: no secondary rows (review_pending
 *     being true always takes primary before them)
 */

const ALL_COMBINATIONS: FlagSummary[] = []
for (const resume of [false, true]) {
  for (const reviewPending of [false, true]) {
    for (const draft of [false, true]) {
      for (const lastComplete of [false, true]) {
        ALL_COMBINATIONS.push({
          resume,
          reviewPending,
          draft,
          lastComplete,
        })
      }
    }
  }
}

function expectedPrimary(f: FlagSummary): PrimaryVariant {
  if (f.resume) return 'resume'
  if (f.reviewPending) return 'review_pending'
  if (f.draft) return 'draft'
  if (f.lastComplete) return 'last_complete'
  return 'new_user'
}

function expectedSecondary(f: FlagSummary): SecondaryRow[] {
  if (f.resume) return []
  const primary = expectedPrimary(f)
  const rows: SecondaryRow[] = []
  if (primary === 'review_pending') {
    if (f.draft) rows.push({ kind: 'draft' })
    if (f.lastComplete) rows.push({ kind: 'last_complete' })
  }
  if (primary === 'draft' && f.lastComplete) {
    rows.push({ kind: 'last_complete' })
  }
  return rows
}

function label(f: FlagSummary): string {
  const parts = []
  if (f.resume) parts.push('resume')
  if (f.reviewPending) parts.push('reviewPending')
  if (f.draft) parts.push('draft')
  if (f.lastComplete) parts.push('lastComplete')
  return parts.length === 0 ? 'none' : parts.join('+')
}

describe('selectPrimaryCard (C-4 Unit 2) - all 16 flag combinations', () => {
  for (const flags of ALL_COMBINATIONS) {
    it(`[${label(flags)}] -> ${expectedPrimary(flags)}`, () => {
      expect(selectPrimaryCard(flags)).toBe(expectedPrimary(flags))
    })
  }
})

describe('selectSecondaryRows (C-4 Unit 2) - all 16 flag combinations', () => {
  for (const flags of ALL_COMBINATIONS) {
    it(`[${label(flags)}] -> ${JSON.stringify(expectedSecondary(flags))}`, () => {
      expect(selectSecondaryRows(flags)).toEqual(expectedSecondary(flags))
    })
  }
})

describe('selectPrimaryCard - precedence spot checks', () => {
  it('resume beats everything', () => {
    expect(
      selectPrimaryCard({
        resume: true,
        reviewPending: true,
        draft: true,
        lastComplete: true,
      }),
    ).toBe('resume')
  })

  it('reviewPending beats draft + lastComplete', () => {
    expect(
      selectPrimaryCard({
        resume: false,
        reviewPending: true,
        draft: true,
        lastComplete: true,
      }),
    ).toBe('review_pending')
  })

  it('draft beats lastComplete', () => {
    expect(
      selectPrimaryCard({
        resume: false,
        reviewPending: false,
        draft: true,
        lastComplete: true,
      }),
    ).toBe('draft')
  })

  it('nothing -> new_user', () => {
    expect(
      selectPrimaryCard({
        resume: false,
        reviewPending: false,
        draft: false,
        lastComplete: false,
      }),
    ).toBe('new_user')
  })
})

describe('selectSecondaryRows - intent checks', () => {
  it('resume mutes all secondaries even when other flags are set', () => {
    expect(
      selectSecondaryRows({
        resume: true,
        reviewPending: true,
        draft: true,
        lastComplete: true,
      }),
    ).toEqual([])
  })

  it('review_pending primary renders draft + last_complete as secondary rows', () => {
    expect(
      selectSecondaryRows({
        resume: false,
        reviewPending: true,
        draft: true,
        lastComplete: true,
      }),
    ).toEqual([{ kind: 'draft' }, { kind: 'last_complete' }])
  })

  it('draft primary with last_complete renders last_complete as secondary', () => {
    expect(
      selectSecondaryRows({
        resume: false,
        reviewPending: false,
        draft: true,
        lastComplete: true,
      }),
    ).toEqual([{ kind: 'last_complete' }])
  })

  it('last_complete primary has no secondary rows', () => {
    expect(
      selectSecondaryRows({
        resume: false,
        reviewPending: false,
        draft: false,
        lastComplete: true,
      }),
    ).toEqual([])
  })

  it('new_user primary has no secondary rows', () => {
    expect(
      selectSecondaryRows({
        resume: false,
        reviewPending: false,
        draft: false,
        lastComplete: false,
      }),
    ).toEqual([])
  })
})

describe('selectPrimaryCard - invariant: always returns exactly one variant', () => {
  it('no flag combination ever returns undefined or an unknown variant', () => {
    const valid = new Set<PrimaryVariant>([
      'resume',
      'review_pending',
      'draft',
      'last_complete',
      'new_user',
    ])
    for (const flags of ALL_COMBINATIONS) {
      const primary = selectPrimaryCard(flags)
      expect(valid.has(primary), `unknown variant for ${label(flags)}`).toBe(true)
    }
  })
})
