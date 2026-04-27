import { describe, expect, it } from 'vitest'
import { getStorageCopy, STORAGE_COPY, type InstallPosture } from './storageCopy'

const POSTURES: InstallPosture[] = ['browser-tab', 'installed-not-persisted', 'installed-persisted']

describe('storageCopy', () => {
  it('returns browser-tab copy with a 7-day Safari-removal hint', () => {
    const copy = getStorageCopy('browser-tab')
    expect(copy.primary).toBe('Saved in this browser on this device')
    expect(copy.secondary).toContain('iPhone Safari')
    expect(copy.secondary).toContain('remove')
  })

  it('returns installed-not-persisted copy with a best-effort caveat', () => {
    const copy = getStorageCopy('installed-not-persisted')
    expect(copy.primary).toBe('Saved on this device')
    expect(copy.secondary).toContain('Not backed up')
    expect(copy.secondary).toContain('reclaimed')
  })

  it('returns installed-persisted copy with the strongest-state language', () => {
    const copy = getStorageCopy('installed-persisted')
    expect(copy.primary).toBe('Saved on this device')
    expect(copy.secondary).toContain('strongest')
    expect(copy.secondary).toContain('Still not a backup')
  })

  it('never promises sync or backup in any state (D118)', () => {
    for (const posture of POSTURES) {
      const copy = getStorageCopy(posture)
      const combined = `${copy.primary} ${copy.secondary}`.toLowerCase()
      expect(combined).not.toContain('synced')
      // "Not backed up" is allowed (negation); "backed up" without "not" before
      // it is not, so guard on the unambiguous positive claims instead.
      expect(combined).not.toContain('saved everywhere')
      expect(combined).not.toContain('cloud backup')
    }
  })

  it('installed states share the same primary line (D118 design intent)', () => {
    expect(STORAGE_COPY['installed-not-persisted'].primary).toBe(
      STORAGE_COPY['installed-persisted'].primary,
    )
  })

  it('only the browser-tab state uses a posture-specific headline', () => {
    expect(STORAGE_COPY['browser-tab'].primary).not.toBe(
      STORAGE_COPY['installed-not-persisted'].primary,
    )
  })
})
