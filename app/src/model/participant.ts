/**
 * Session participant — forward-compatibility seam for `D115`/`D116`/
 * `D117` (`participants[]`, `PlayerProfile`, `TeamConsent`).
 *
 * Today (M001 / v0b), every session populates exactly one participant
 * with `role: 'self'` for solo sessions and exactly two
 * (`'self' + 'partner'`) for pair sessions. No partner UI ships in
 * v0b. The seam exists so when persistent pair / coach / multi-
 * participant code lands later, downstream readers already consume
 * a `SessionParticipant[]` and we do not have to refactor every
 * surface that today reads `playerCount: 1 | 2`.
 *
 * Layer rule: pure product type. No Dexie / React / services
 * dependencies (U4 of the architecture pass).
 */
export type SessionParticipantRole = 'self' | 'partner'

/**
 * Optional descriptive fields are forward-compatibility room. v0b
 * persists nothing past `role`; future passes may attach a
 * stable `playerProfileId`, a courtside `nickname`, or per-participant
 * consent metadata without mutating this interface's shape.
 */
export interface SessionParticipant {
  role: SessionParticipantRole
  /** Optional courtside-friendly label. Reserved for `D116` PlayerProfile. */
  nickname?: string
  /** Optional stable identifier across sessions. Reserved for `D116`. */
  playerProfileId?: string
}
