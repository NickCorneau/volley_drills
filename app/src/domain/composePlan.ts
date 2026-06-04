/**
 * M002.1 U3 — thin-spine plan projection (R1, R3).
 *
 * "The plan" is a pure projection over already-captured records: the
 * durable intentions (focuses being trained), the staleness-ordered
 * ready backlog, and the single concrete next session. Mirrors the
 * `composeSummary` formatter discipline — input struct in, output
 * struct out, deterministic, no Dexie/React (KTD1). The loader does the
 * Dexie read + focus attribution and passes `AttributedTrainingSession[]`
 * in; nothing is persisted, so the plan is always regenerable from the
 * same inputs (D150).
 *
 * The weekly behavioral cadence (R1) is surfaced by the receipt (U7),
 * which reads the same eligible-session set — composePlan owns the
 * focus intentions + backlog + next-session projection so the two
 * surfaces don't duplicate the cadence computation.
 */
import type { AdaptationDelta } from '../model'
import {
  SCOPED_FOCUSES,
  type AttributedTrainingSession,
  type ScopedFocus,
} from './eligibleSessions'
import { sortByStaleness } from './staleness'

export interface PlanInput {
  sessions: readonly AttributedTrainingSession[]
  now: number
  /** An accepted next-time delta for the head focus, if the user accepted one. */
  acceptedDelta?: AdaptationDelta
}

export interface PlanOutput {
  /** The concrete next session's focus (staleness head). */
  nextFocus: ScopedFocus
  /** The remaining focuses, still intent (not concrete). */
  backlog: ScopedFocus[]
  /** Durable intentions — the focuses being trained. */
  intentions: ScopedFocus[]
  /** True for a new/lapsed user with no in-scope history. */
  freshStart: boolean
  /** Bounded ≤45-word courtside render of the next session. */
  render: string
}

const FOCUS_PHRASE: Record<ScopedFocus, string> = {
  pass: 'passing',
  serve: 'serving',
  set: 'setting',
}

function listPhrase(focuses: ScopedFocus[]): string {
  const phrases = focuses.map((focus) => FOCUS_PHRASE[focus])
  if (phrases.length === 0) return ''
  if (phrases.length === 1) return phrases[0]
  return `${phrases.slice(0, -1).join(', ')} and ${phrases[phrases.length - 1]}`
}

export function composePlan(input: PlanInput): PlanOutput {
  const { sessions, now, acceptedDelta } = input
  const order = sortByStaleness(sessions, now)
  const nextFocus = order.head

  // Durable intentions: focuses with in-scope history; on a fresh start
  // the starting plan trains all three.
  const trained = new Set(sessions.map((s) => s.focus))
  const intentions: ScopedFocus[] = order.freshStart
    ? [...SCOPED_FOCUSES]
    : SCOPED_FOCUSES.filter((focus) => trained.has(focus))

  let render = order.freshStart
    ? `First up: ${FOCUS_PHRASE[nextFocus]} after a warm-up. ${capitalize(
        listPhrase(order.deferredTail),
      )} are queued.`
    : `Next up: ${FOCUS_PHRASE[nextFocus]} after a warm-up. Then ${listPhrase(order.deferredTail)}.`

  // An accepted stress delta on the next focus nudges the framing
  // (never reshuffles the backlog order).
  if (
    acceptedDelta &&
    acceptedDelta.direction !== 'keep' &&
    acceptedDelta.focus === nextFocus
  ) {
    render += acceptedDelta.direction === 'more' ? ' Plan to add a little stress.' : ' Plan to ease the stress.'
  }

  return {
    nextFocus,
    backlog: order.deferredTail,
    intentions,
    freshStart: order.freshStart,
    render,
  }
}

function capitalize(text: string): string {
  return text.length === 0 ? text : text[0].toUpperCase() + text.slice(1)
}
