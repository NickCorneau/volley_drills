import { describe, expect, it } from 'vitest'
import { RUN_FLOW_LABELS, SUNSET_RUN_FLOW_LABELS } from '../runFlowLexicon'

/**
 * Stage 0 of the run-flow beat contract: a single canonical label per
 * concept so drift cannot silently return (R3). The cross-surface render
 * guard lives in `screens/__tests__/runFlowLexicon.guard.test.tsx`.
 */
describe('run-flow lexicon (Stage 0 beat contract)', () => {
  it('pins the founder-decided action, cue, and more-cues labels', () => {
    expect(RUN_FLOW_LABELS.startAction).toBe('Start')
    expect(RUN_FLOW_LABELS.cue).toBe('Now')
    expect(RUN_FLOW_LABELS.moreCues).toBe('Show more cues')
  })

  it('pins the Stage 2 recovery-peek labels', () => {
    expect(RUN_FLOW_LABELS.peek).toBe('Peek setup')
    expect(RUN_FLOW_LABELS.peekClose).toBe('Back to drill')
  })

  it('pins the Stage 4 get-ready Adjust disclosure label', () => {
    expect(RUN_FLOW_LABELS.adjust).toBe('Adjust')
  })

  it('records the labels retired by Stage 1', () => {
    expect(SUNSET_RUN_FLOW_LABELS).toContain('Start next block')
    expect(SUNSET_RUN_FLOW_LABELS).toContain('GO')
    expect(SUNSET_RUN_FLOW_LABELS).toContain('Cue')
  })

  it('keeps active and sunset label sets disjoint', () => {
    const active = new Set<string>(Object.values(RUN_FLOW_LABELS))
    for (const retired of SUNSET_RUN_FLOW_LABELS) {
      expect(active.has(retired), `"${retired}" is both active and sunset`).toBe(false)
    }
  })
})
