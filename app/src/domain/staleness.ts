/**
 * M002.1 U1 — staleness backlog comparator (R2).
 *
 * Orders the v1-scoped focuses (pass/serve/set) least-recently-trained
 * first, over eligible, focus-attributed sessions (see
 * `eligibleSessions.ts`). Pure domain: no Dexie, no React; the loader
 * passes attributed sessions in.
 *
 * KTD2: for a 3-focus set with one focus trained per session, a plain
 * least-recently-trained sort already gives anti-thrash (a just-trained
 * focus sinks to the tail) and anti-starvation (the oldest sits at the
 * head). Cooldown bands and aging-promotion thresholds are deferred to
 * the fuller-taxonomy milestone; the hysteresis that matters in v1
 * lives on the adaptation arm (`replayAdaptation`), not here.
 *
 * Calm invariant (R11): when there is no in-scope history at all
 * (new or fully-lapsed user) the order is a deterministic tie-break and
 * `freshStart` is set, so the surface frames a fresh start rather than
 * "behind on everything."
 */
import { SCOPED_FOCUSES, type AttributedTrainingSession, type ScopedFocus } from './eligibleSessions'

export interface StalenessOrder {
  /** All scoped focuses, most-stale (least-recently-trained) first. */
  ordered: ScopedFocus[]
  /** The concrete next focus — `ordered[0]`. */
  head: ScopedFocus
  /** The remaining focuses, still intent, not concrete. */
  deferredTail: ScopedFocus[]
  /** True when no eligible in-scope history exists (new/lapsed user). */
  freshStart: boolean
}

/**
 * A never-trained focus is maximally stale. Using `Infinity` keeps it
 * ahead of any trained focus and lets equally-untrained focuses fall
 * back to the deterministic `SCOPED_FOCUSES` tie-break order.
 */
function focusAge(focus: ScopedFocus, sessions: readonly AttributedTrainingSession[], now: number): number {
  let lastTrained: number | undefined
  for (const session of sessions) {
    if (session.focus !== focus) continue
    if (lastTrained === undefined || session.trainedAt > lastTrained) {
      lastTrained = session.trainedAt
    }
  }
  if (lastTrained === undefined) return Number.POSITIVE_INFINITY
  // Clamp against clock skew / future-dated rows (F9): a row dated
  // ahead of `now` reads as freshly trained (age 0), never negative.
  return Math.max(0, now - lastTrained)
}

export function sortByStaleness(
  sessions: readonly AttributedTrainingSession[],
  now: number,
): StalenessOrder {
  // Stable sort: most-stale-first by age, ties broken by the canonical
  // SCOPED_FOCUSES order so output is fully deterministic.
  const ordered = SCOPED_FOCUSES.map((focus, index) => ({
    focus,
    index,
    age: focusAge(focus, sessions, now),
  }))
    .sort((a, b) => (b.age - a.age) || (a.index - b.index))
    .map((entry) => entry.focus)

  return {
    ordered,
    head: ordered[0],
    deferredTail: ordered.slice(1),
    freshStart: sessions.length === 0,
  }
}
