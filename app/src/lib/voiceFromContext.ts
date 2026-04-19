/**
 * Phase F Unit 2 (2026-04-19): voice context helper for the onboarding
 * + setup surfaces.
 *
 * The onboarding screens default to **pair voice** ("Where's the pair
 * today?" / "We can keep a friendly toss alive.") on first open per
 * D121. That framing misleads solo users on a solo-first product (`D5`)
 * — they read the first screen as "not for me." The fix without
 * re-opening the D121 taxonomy: swap the surface copy to **solo voice**
 * when the user has a prior solo session on record, and keep pair voice
 * as the cold-state default.
 *
 * The signal is `storageMeta.lastPlayerMode`, written by
 * `createSessionFromDraft` on every session create (solo draft →
 * `'solo'`; pair draft → `'pair'`). A returning tester who cleared
 * storage then re-onboarded in pair mode is correctly read as pair on
 * their NEXT onboarding pass; the taxonomy enum
 * (`storageMeta.onboarding.skillLevel` per D121) is unchanged.
 *
 * Rationale trail:
 * - `docs/specs/m001-phase-c-ux-decisions.md` → Surface 1 (D-C4 Phase F
 *   amendment)
 * - `docs/decisions.md` D122 (pre-D91 validity carve-outs)
 * - `docs/plans/2026-04-19-feat-phase-f-d91-validity-hardening-plan.md`
 *   Unit 2
 */

import { getStorageMeta } from '../services/storageMeta'

export type Voice = 'solo' | 'pair'

/** Type guard for values persisted to `storageMeta.lastPlayerMode`. */
export function isVoice(value: unknown): value is Voice {
  return value === 'solo' || value === 'pair'
}

/**
 * Load the last known player mode from `storageMeta.lastPlayerMode`.
 *
 * Returns `'solo'` or `'pair'` when a prior session exists, or `null`
 * when no signal is available (first open, cleared storage, etc.).
 * Consumers default to pair voice on `null` per the Phase F contract.
 */
export async function loadVoiceFromStorage(): Promise<Voice | null> {
  const value = await getStorageMeta('lastPlayerMode', isVoice)
  return value ?? null
}

/**
 * Pure helper mirroring `loadVoiceFromStorage` for callers that already
 * have the raw `unknown` value in hand (e.g. from a single bulk
 * `storageMeta.toArray()` read). Keeps the voice contract in one place.
 */
export function voiceFromStoredValue(value: unknown): Voice | null {
  return isVoice(value) ? value : null
}
