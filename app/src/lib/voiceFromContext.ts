/**
 * Phase F Unit 2 (2026-04-19), revised same-day per D128: voice context
 * helper for the onboarding + setup surfaces.
 *
 * The onboarding screens originally shipped with **pair voice**
 * ("Where's the pair today?" / "We can keep a friendly toss alive.")
 * as the cold-state default per D121. That framing misleads solo users
 * on a solo-first product (`D5`) - they read the first screen as "not
 * for me." The initial Phase F fix only flipped voice for **returning**
 * solo testers; D128 follows on by also flipping the **cold-state
 * default** to solo voice, so screen one reads "Where are you today?"
 * for every first-open user. Pair voice is reserved for returning
 * testers whose last session was a pair session.
 *
 * The signal is `storageMeta.lastPlayerMode`, written by
 * `createSessionFromDraft` on every session create (solo draft →
 * `'solo'`; pair draft → `'pair'`). When no signal is available
 * (first open, cleared storage, etc.) callers default to solo voice
 * per D128. The taxonomy enum (`storageMeta.onboarding.skillLevel`
 * per D121) is unchanged across voices.
 *
 * Rationale trail:
 * - `docs/specs/m001-phase-c-ux-decisions.md` → Surface 1 (D-C4 Phase F
 *   amendment + 2026-04-19 follow-on)
 * - `docs/decisions.md` D122 (pre-D91 validity carve-outs), D128
 *   (cold-state default flipped to solo voice)
 * - `docs/plans/2026-04-19-feat-phase-f-d91-validity-hardening-plan.md`
 *   Unit 2 (open question resolution)
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
 * Consumers default to **solo voice** on `null` per D128 (was pair
 * voice in the initial Phase F cut; flipped same-day to align screen
 * one with D5).
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
