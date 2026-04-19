import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import {
  isVoice,
  loadVoiceFromStorage,
  voiceFromStoredValue,
} from '../voiceFromContext'

/**
 * Phase F Unit 2 (2026-04-19): voice context helper contract.
 *
 * `storageMeta.lastPlayerMode` is the single source of truth for
 * SkillLevelScreen's solo-vs-pair copy flip. First-open (no key
 * present) returns `null`; a returning tester with a prior session
 * returns `'solo' | 'pair'`.
 */

async function clearDb() {
  await Promise.all([
    db.storageMeta.clear(),
  ])
}

describe('isVoice (Phase F Unit 2)', () => {
  it('returns true for the two valid voice values', () => {
    expect(isVoice('solo')).toBe(true)
    expect(isVoice('pair')).toBe(true)
  })

  it('returns false for every other value', () => {
    expect(isVoice(undefined)).toBe(false)
    expect(isVoice(null)).toBe(false)
    expect(isVoice('')).toBe(false)
    expect(isVoice('Solo')).toBe(false) // case-sensitive
    expect(isVoice('PAIR')).toBe(false)
    expect(isVoice(1)).toBe(false)
    expect(isVoice({ mode: 'solo' })).toBe(false)
  })
})

describe('voiceFromStoredValue (Phase F Unit 2)', () => {
  it('passes through valid voice values', () => {
    expect(voiceFromStoredValue('solo')).toBe('solo')
    expect(voiceFromStoredValue('pair')).toBe('pair')
  })

  it('returns null for invalid values', () => {
    expect(voiceFromStoredValue(undefined)).toBeNull()
    expect(voiceFromStoredValue('solo2')).toBeNull()
    expect(voiceFromStoredValue(42)).toBeNull()
  })
})

describe('loadVoiceFromStorage (Phase F Unit 2)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('returns null when no lastPlayerMode key is present (cold state)', async () => {
    expect(await loadVoiceFromStorage()).toBeNull()
  })

  it('returns "solo" when storageMeta.lastPlayerMode === "solo"', async () => {
    await db.storageMeta.put({
      key: 'lastPlayerMode',
      value: 'solo',
      updatedAt: Date.now(),
    })
    expect(await loadVoiceFromStorage()).toBe('solo')
  })

  it('returns "pair" when storageMeta.lastPlayerMode === "pair"', async () => {
    await db.storageMeta.put({
      key: 'lastPlayerMode',
      value: 'pair',
      updatedAt: Date.now(),
    })
    expect(await loadVoiceFromStorage()).toBe('pair')
  })

  it('returns null when the stored value is a corrupted / future voice', async () => {
    await db.storageMeta.put({
      key: 'lastPlayerMode',
      value: 'crew-of-four', // hypothetical future value; unreachable today
      updatedAt: Date.now(),
    })
    expect(await loadVoiceFromStorage()).toBeNull()
  })
})
