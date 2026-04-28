import type { SessionParticipant, SessionPlan } from '../model'

/**
 * Project the canonical `SessionParticipant[]` from a plan.
 *
 * Forward-compatibility seam (U6 of the architecture pass): readers
 * that ask "who was on court?" or "is this a pair session?" should
 * call this helper instead of reading `plan.playerCount` directly.
 *
 * Resolution order:
 *   1. `plan.participants` if present — the authoritative
 *      `D115`/`D116`/`D117` shape.
 *   2. Otherwise derive from the legacy `playerCount` denormalized
 *      cache so plans persisted before the seam still resolve.
 *
 * Pure: no IO, no Dexie, no React. Domain rule lives here so future
 * code that adds a third role (`'group'`, `'coach'`) only edits one
 * place.
 */
export function getSessionParticipants(plan: SessionPlan): SessionParticipant[] {
  if (plan.participants && plan.participants.length > 0) {
    return plan.participants
  }
  return defaultParticipantsForPlayerCount(plan.playerCount)
}

/**
 * Build the canonical participants array for a v0b plan from the
 * legacy `playerCount` value. v0b's only roles are `'self'` (solo) and
 * `'self' + 'partner'` (pair); future modes register here when they
 * land.
 *
 * Exported so `createSessionFromDraft` populates the array consistently
 * with the projection above. The
 * `participants.length === playerCount` invariant relies on this
 * single source of derivation.
 */
export function defaultParticipantsForPlayerCount(
  playerCount: SessionPlan['playerCount'],
): SessionParticipant[] {
  if (playerCount === 2) {
    return [{ role: 'self' }, { role: 'partner' }]
  }
  return [{ role: 'self' }]
}

/** Convenience: is the session a pair session by participant projection? */
export function isPairSession(plan: SessionPlan): boolean {
  return getSessionParticipants(plan).length >= 2
}
