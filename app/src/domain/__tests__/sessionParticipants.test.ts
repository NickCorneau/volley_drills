import { describe, expect, it } from 'vitest'
import {
  defaultParticipantsForPlayerCount,
  getSessionParticipants,
  isPairSession,
} from '../sessionParticipants'
import { currentPersistedPlan } from '../../test-utils/persistedRecords'

describe('getSessionParticipants', () => {
  it('returns the persisted participants array when present', () => {
    const plan = currentPersistedPlan({
      playerCount: 2,
      participants: [
        { role: 'self', nickname: 'A' },
        { role: 'partner', nickname: 'B' },
      ],
    })
    const result = getSessionParticipants(plan)
    expect(result).toEqual([
      { role: 'self', nickname: 'A' },
      { role: 'partner', nickname: 'B' },
    ])
  })

  it('falls back to the default array derived from playerCount when participants are absent', () => {
    const plan = currentPersistedPlan({ playerCount: 1, participants: undefined })
    expect(getSessionParticipants(plan)).toEqual([{ role: 'self' }])
  })

  it('falls back to a self+partner pair for legacy two-player plans', () => {
    const plan = currentPersistedPlan({ playerCount: 2, participants: undefined })
    expect(getSessionParticipants(plan)).toEqual([
      { role: 'self' },
      { role: 'partner' },
    ])
  })

  it('treats an empty participants array as a fallback signal, not as a zero-participant session', () => {
    const plan = currentPersistedPlan({ playerCount: 2, participants: [] })
    // Defensive: an empty array is never the truth (a session with zero
    // participants is not a valid v0b shape). Project from playerCount
    // so legacy data heals on read.
    expect(getSessionParticipants(plan)).toHaveLength(2)
  })
})

describe('defaultParticipantsForPlayerCount invariant', () => {
  it('returns exactly playerCount participants for both supported modes', () => {
    expect(defaultParticipantsForPlayerCount(1)).toHaveLength(1)
    expect(defaultParticipantsForPlayerCount(2)).toHaveLength(2)
  })
})

describe('isPairSession', () => {
  it('reads pair-mode from the participants array, not playerCount', () => {
    const partnerPersisted = currentPersistedPlan({
      playerCount: 1, // legacy denormalized cache, intentionally wrong here
      participants: [{ role: 'self' }, { role: 'partner' }],
    })
    expect(isPairSession(partnerPersisted)).toBe(true)
  })

  it('reads solo-mode from a single-self participants array', () => {
    const soloPlan = currentPersistedPlan({
      playerCount: 2, // legacy denormalized cache, intentionally wrong here
      participants: [{ role: 'self' }],
    })
    expect(isPairSession(soloPlan)).toBe(false)
  })

  it('falls back to playerCount when the array is missing', () => {
    expect(isPairSession(currentPersistedPlan({ playerCount: 1, participants: undefined }))).toBe(
      false,
    )
    expect(isPairSession(currentPersistedPlan({ playerCount: 2, participants: undefined }))).toBe(
      true,
    )
  })
})
