/**
 * Trust-loop U3 (R4/R5, KTD8) — the Review accept option's concrete
 * consequence, as a hedged drill exemplar.
 *
 * Pure composer: given the offered delta's focus and direction, the
 * current derived position (the same fold the offer gate used — see
 * `loadVerdictOffer`), and the reviewed session's context, name one
 * drill at the prospective position (one rung in the delta's
 * direction) the athlete could actually meet.
 *
 * KTD8 candidate rule: candidates are the drills at the prospective
 * rung that are assembly-available and eligible under the reviewed
 * session's context (the same `findCandidates` filter assembly uses),
 * excluding the drill just trained; first-authored ladder order picks
 * among them. No candidate → no caption — never a wrong-direction or
 * unassemblable drill (R5: a tendency, never a promise).
 *
 * Copy contract (KTD9): hedged plan-action voice ("lean toward …
 * like"), no em-dash, no stress vocabulary, no numbers-as-positions.
 */
import { STRESS_LADDERS } from '../../data/stressLadders'
import type { BlockSlot, SetupContext, StressDirection } from '../../model'
import type { ScopedFocus } from '../eligibleSessions'
import { findCandidates } from '../sessionAssembly/candidates'
import { focusLabel } from '../sessionFocus'
import { prospectiveStressPosition } from './stressPosition'

export interface AcceptConsequenceInput {
  focus: ScopedFocus
  direction: StressDirection
  /** Current derived ladder position for `focus`. */
  position: number
  /** The reviewed session's persisted `SetupContext`. */
  context: SetupContext
  /** The just-trained main_skill drill id, excluded from candidates. */
  excludeDrillId?: string
}

/**
 * Synthetic main_skill slot for the candidate lookup. Durations are
 * irrelevant here — `findCandidates` never reads them; only the slot
 * type (focus-controlled, main-skill-only drills allowed) matters.
 */
const EXEMPLAR_SLOT: BlockSlot = {
  type: 'main_skill',
  durationMinMinutes: 0,
  durationMaxMinutes: 0,
  intent: 'Accept-consequence exemplar lookup',
  required: true,
}

export function composeAcceptConsequence(input: AcceptConsequenceInput): string | null {
  const { focus, direction, position, context, excludeDrillId } = input
  if (direction === 'keep') return null

  // Defensive: post-gating (R15) the offered direction always moves,
  // but a clamped input must fail quiet rather than name a drill at
  // the position the athlete is already on.
  const prospective = prospectiveStressPosition(focus, position, direction)
  if (prospective === position) return null

  const rung = STRESS_LADDERS[focus].find((r) => r.rung === prospective)
  if (!rung) return null

  // The reviewed session's conditions, scoped to the delta's focus so
  // the focus-controlled candidate filter matches assembly's behavior
  // even when a legacy plan context carries no `sessionFocus`.
  const exemplarContext: SetupContext = { ...context, sessionFocus: focus }
  const available = new Map(
    findCandidates(EXEMPLAR_SLOT, exemplarContext).map((c) => [c.drill.id, c.drill]),
  )
  for (const drillId of rung.drillIds) {
    if (drillId === excludeDrillId) continue
    const drill = available.get(drillId)
    if (drill) {
      return `${focusLabel(focus)} sessions lean toward drills like ${drill.name}.`
    }
  }
  return null
}
