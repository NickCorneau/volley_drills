import { selectWarmup, WARMUP_FOCUS_EMPHASIS, type WarmupEmphasis } from '../selectWarmup'
import type { DrillSegment } from '../../../types/drill'
import type { ScopedFocus } from '../../eligibleSessions'

const BASE: DrillSegment[] = [
  { id: 's1', label: 'jog', durationSec: 45 },
  { id: 's2', label: 'ankle hops', durationSec: 45 },
  { id: 's3', label: 'arm circles', durationSec: 45 },
  { id: 's4', label: 'shuffles', durationSec: 45 },
]

describe('selectWarmup', () => {
  it('is a passthrough in v1 — empty emphasis registry returns base segments for every focus', () => {
    for (const focus of ['pass', 'serve', 'set'] as const) {
      expect(selectWarmup(focus, BASE)).toEqual(BASE)
    }
  })

  it('ships an empty emphasis registry in v1 (seam, not content)', () => {
    expect(WARMUP_FOCUS_EMPHASIS).toEqual({})
  })

  it('applies focus emphasis when content is injected — promotes the lead segment to the front', () => {
    const emphasis: Partial<Record<ScopedFocus, WarmupEmphasis>> = {
      serve: { leadSegmentId: 's3' }, // shoulder prep leads for serving
    }
    const out = selectWarmup('serve', BASE, emphasis)
    expect(out.map((s) => s.id)).toEqual(['s3', 's1', 's2', 's4'])
    // preserves the full set and total duration (no content invented)
    expect(out).toHaveLength(BASE.length)
    expect(out.reduce((sum, s) => sum + s.durationSec, 0)).toBe(
      BASE.reduce((sum, s) => sum + s.durationSec, 0),
    )
  })

  it('falls back to base order when the focus has no emphasis entry', () => {
    const emphasis = { serve: { leadSegmentId: 's3' } }
    expect(selectWarmup('pass', BASE, emphasis)).toEqual(BASE)
  })

  it('falls back to base order when the lead segment id is missing', () => {
    const emphasis = { pass: { leadSegmentId: 'nope' } }
    expect(selectWarmup('pass', BASE, emphasis)).toEqual(BASE)
  })

  it('handles an empty segment list without throwing', () => {
    expect(selectWarmup('set', [])).toEqual([])
  })
})
