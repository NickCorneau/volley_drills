import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { DrillSegment } from '../../../types/drill'
import { SEGMENT_INDEX_BONUS } from '../../../domain/runFlow'
import { SegmentList } from '../SegmentList'

/**
 * U7 component-tier proof obligations for `<SegmentList>`. Pinned at
 * the lowest useful tier per `.cursor/rules/testing.mdc`. Screen
 * integration concerns (controller wiring, fake-timer advancement,
 * audio-failure independence per AE6) live in
 * `app/src/screens/__tests__/RunScreen.segments.test.tsx`.
 */

const FOUR_SEGMENTS: readonly DrillSegment[] = [
  { id: 's1', label: 'Jog or A-skip around your sand box.', durationSec: 45 },
  { id: 's2', label: 'Ankle hops and lateral shuffles.', durationSec: 45 },
  { id: 's3', label: 'Arm circles and trunk rotations.', durationSec: 45 },
  { id: 's4', label: 'Quick side shuffles and pivot-back starts.', durationSec: 45 },
]

describe('<SegmentList>', () => {
  it('renders one row per segment with the active row marked aria-current="step"', () => {
    render(<SegmentList segments={FOUR_SEGMENTS} currentIndex={0} />)
    const list = screen.getByRole('list', { name: 'Segments' })
    const rows = within(list).getAllByRole('listitem')
    expect(rows).toHaveLength(4)
    const activeRows = rows.filter((row) => row.getAttribute('aria-current') === 'step')
    expect(activeRows).toHaveLength(1)
    expect(activeRows[0]).toHaveTextContent('Jog or A-skip')
  })

  it('moves the aria-current marker as currentIndex advances', () => {
    const { rerender } = render(<SegmentList segments={FOUR_SEGMENTS} currentIndex={0} />)
    let activeRow = document.querySelector('[aria-current="step"]')
    expect(activeRow?.textContent).toContain('Jog or A-skip')

    rerender(<SegmentList segments={FOUR_SEGMENTS} currentIndex={2} />)
    activeRow = document.querySelector('[aria-current="step"]')
    expect(activeRow?.textContent).toContain('Arm circles and trunk rotations')
    // Exactly one row carries aria-current at any time.
    expect(document.querySelectorAll('[aria-current="step"]')).toHaveLength(1)
  })

  it('renders all rows with no active marker and shows the bonus paragraph when in bonus territory', () => {
    render(
      <SegmentList
        segments={FOUR_SEGMENTS}
        currentIndex={SEGMENT_INDEX_BONUS}
        bonus="If time remains, mirror to the other side."
      />,
    )
    expect(document.querySelector('[aria-current="step"]')).toBeNull()
    expect(screen.getByText(/mirror to the other side/i)).toBeInTheDocument()
  })

  it('omits the bonus paragraph when in bonus territory but no bonus text is provided', () => {
    const { container } = render(
      <SegmentList segments={FOUR_SEGMENTS} currentIndex={SEGMENT_INDEX_BONUS} />,
    )
    // List is still there; no <p> outside the list.
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(0)
  })

  it('does not render the bonus paragraph mid-block (currentIndex inside the segment list)', () => {
    render(
      <SegmentList
        segments={FOUR_SEGMENTS}
        currentIndex={1}
        bonus="If time remains, mirror to the other side."
      />,
    )
    expect(screen.queryByText(/mirror to the other side/i)).toBeNull()
  })

  it('exposes an aria-live polite announcer that reads the active segment label', () => {
    const { container, rerender } = render(
      <SegmentList segments={FOUR_SEGMENTS} currentIndex={0} />,
    )
    const announcer = container.querySelector('[aria-live="polite"]')
    expect(announcer).not.toBeNull()
    expect(announcer?.textContent).toBe('Now: Jog or A-skip around your sand box.')

    rerender(<SegmentList segments={FOUR_SEGMENTS} currentIndex={2} />)
    expect(announcer?.textContent).toBe('Now: Arm circles and trunk rotations.')

    rerender(<SegmentList segments={FOUR_SEGMENTS} currentIndex={SEGMENT_INDEX_BONUS} />)
    expect(announcer?.textContent).toBe('All segments complete')
  })

  it('renders nothing visible for an empty segments array', () => {
    const { container } = render(<SegmentList segments={[]} currentIndex={SEGMENT_INDEX_BONUS} />)
    expect(container.firstChild).toBeNull()
  })

  /**
   * Reserved-field discipline (L2 from the institutional learnings
   * digest). `DrillSegment.cue?` is added to the type as a v2
   * forward-seam but MUST NOT be rendered by v1. Pin it here so the
   * seam cannot silently grow into a feature.
   */
  it('does not render the cue field even when authored on a segment', () => {
    const SEGMENTS_WITH_CUES: readonly DrillSegment[] = [
      {
        id: 's1',
        label: 'Walk with long exhales.',
        durationSec: 60,
        cue: 'Long exhale, let heart rate come down.',
      },
      {
        id: 's2',
        label: 'Sit or lean to rest calves and feet.',
        durationSec: 30,
        cue: 'Gentle tension only.',
      },
    ]
    const { container } = render(<SegmentList segments={SEGMENTS_WITH_CUES} currentIndex={0} />)
    expect(container.textContent).not.toContain('Long exhale')
    expect(container.textContent).not.toContain('Gentle tension only')
  })

  it('renders identically when cue is undefined vs present (visual parity for the v1 contract)', () => {
    const without: readonly DrillSegment[] = [
      { id: 's1', label: 'Walk.', durationSec: 60 },
      { id: 's2', label: 'Sit.', durationSec: 30 },
    ]
    const withCue: readonly DrillSegment[] = [
      { id: 's1', label: 'Walk.', durationSec: 60, cue: 'Long exhale.' },
      { id: 's2', label: 'Sit.', durationSec: 30, cue: 'Gentle tension only.' },
    ]
    const { container: a } = render(<SegmentList segments={without} currentIndex={0} />)
    const { container: b } = render(<SegmentList segments={withCue} currentIndex={0} />)
    expect(a.innerHTML).toBe(b.innerHTML)
  })

  it('shows the per-segment duration suffix in seconds with tabular-nums', () => {
    render(<SegmentList segments={FOUR_SEGMENTS} currentIndex={0} />)
    const suffixes = screen.getAllByText(/^45s$/)
    expect(suffixes).toHaveLength(4)
    for (const el of suffixes) {
      expect(el.className).toContain('tabular-nums')
    }
  })

  /**
   * 2026-04-28 dogfeed iteration (each-side stretches): unilateral
   * segments declare `eachSide: true`. The renderer appends a muted
   * "(each side)" suffix so the user knows to switch sides during
   * the segment. Bilateral segments render unchanged.
   */
  describe('eachSide rendering', () => {
    const MIXED_SEGMENTS: readonly DrillSegment[] = [
      { id: 's1', label: 'Walk with long exhales.', durationSec: 60 },
      {
        id: 's2',
        label: 'Hip stretch: cross one ankle over the opposite knee.',
        durationSec: 60,
        eachSide: true,
      },
      { id: 's3', label: 'Reach arms overhead.', durationSec: 30 },
      {
        id: 's4',
        label: 'Shoulder stretch: one arm across chest.',
        durationSec: 60,
        eachSide: true,
      },
    ]

    it('appends "(each side)" only on unilateral segments', () => {
      render(<SegmentList segments={MIXED_SEGMENTS} currentIndex={0} />)
      // Two eachSide segments → two "(each side)" suffixes rendered.
      const suffixes = screen.getAllByText(/\(each side\)/)
      expect(suffixes).toHaveLength(2)
    })

    it('does not append "(each side)" on bilateral segments', () => {
      const bilateralOnly: readonly DrillSegment[] = [
        { id: 's1', label: 'Walk.', durationSec: 60 },
        { id: 's2', label: 'Sit.', durationSec: 30 },
      ]
      const { container } = render(<SegmentList segments={bilateralOnly} currentIndex={0} />)
      expect(container.textContent).not.toContain('(each side)')
    })

    it('renders the suffix for the active row, past rows, and future rows alike', () => {
      // Mid-block: row 0 done, row 1 active (eachSide), row 3 future (eachSide).
      // The suffix should appear next to row 1 (now) and row 3 (future).
      render(<SegmentList segments={MIXED_SEGMENTS} currentIndex={1} />)
      expect(screen.getAllByText(/\(each side\)/)).toHaveLength(2)
    })

    it('renders the suffix in muted text-text-secondary color', () => {
      render(<SegmentList segments={MIXED_SEGMENTS} currentIndex={0} />)
      const suffix = screen.getAllByText(/\(each side\)/)[0]
      expect(suffix.className).toContain('text-text-secondary')
    })
  })
})
