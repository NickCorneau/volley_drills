import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { DrillSegment } from '../../../types/drill'
import { SegmentList } from '../SegmentList'

/**
 * Inline-gloss coverage for `<SegmentList>`. The base SegmentList
 * contract (active row, eachSide suffix, bonus paragraph, aria-live
 * announcer) is pinned in `SegmentList.test.tsx`; this file pins
 * the layered gloss behavior added in the 2026-05-13
 * universalization pass:
 *
 *   1. Flagged terms in segment labels render as dotted-underline
 *      `<button>`s; tapping reveals the `↳ definition` line.
 *   2. Each row is its own open-scope (per-row, mirroring the
 *      per-paragraph scope on `<GlossedText>`).
 *   3. Opening a different term in the SAME row swaps the
 *      definition.
 *   4. Layout invariants: the duration cell stays in column 3 and
 *      `aria-current` continues to mark the active row.
 *   5. Labels with no `(= …)` render unchanged (no buttons, no
 *      reveal slot).
 */

const SEGMENTS_WITH_GLOSSES: readonly DrillSegment[] = [
  {
    id: 's1',
    label:
      'Continuous: jog or A-skip (= skip forward, lifting the front knee until the thigh is parallel to the sand) around your sand box.',
    durationSec: 45,
  },
  {
    id: 's2',
    label:
      'Continuous: ankle hops (= small two-foot hops in place, springing off the balls of the feet) then lateral shuffles (= quick sideways shuffle steps, feet never crossing).',
    durationSec: 45,
  },
  {
    id: 's3',
    label: 'Continuous: arm circles forward and back, then trunk rotations side to side.',
    durationSec: 45,
  },
  {
    id: 's4',
    label:
      'Rep-paced at game tempo: quick side shuffles, then pivot-back starts (= pivot the inside foot and step back).',
    durationSec: 45,
  },
]

describe('<SegmentList> inline gloss behavior', () => {
  it('renders flagged segment-label terms as dotted-underline buttons', () => {
    render(<SegmentList segments={SEGMENTS_WITH_GLOSSES} currentIndex={0} />)

    const term = screen.getByRole('button', { name: 'A-skip' })
    expect(term).toBeInTheDocument()
    expect(term.className).toContain('border-dotted')
    expect(term.className).toContain('border-text-secondary/60')
    expect(term).toHaveAttribute('aria-expanded', 'false')
  })

  it('reveals the definition with the ↳ glyph when a term button is tapped', async () => {
    const user = userEvent.setup()
    render(<SegmentList segments={SEGMENTS_WITH_GLOSSES} currentIndex={0} />)

    const list = screen.getByRole('list', { name: 'Segments' })
    const rows = within(list).getAllByRole('listitem')
    const term = within(rows[0]).getByRole('button', { name: 'A-skip' })

    // Before tap: no reveal inside the row. (The aria-live announcer
    // outside the list still reproduces the raw label including the
    // literal `(= …)` form, so we deliberately scope to the row to
    // assert the visible affordance, not the SR announcer text.)
    expect(
      within(rows[0]).queryByText(
        /skip forward, lifting the front knee until the thigh is parallel to the sand/,
      ),
    ).not.toBeInTheDocument()

    await user.click(term)

    expect(term).toHaveAttribute('aria-expanded', 'true')
    const reveal = within(rows[0]).getByText(
      /skip forward, lifting the front knee until the thigh is parallel to the sand/,
    )
    expect(reveal).toBeInTheDocument()
    expect(reveal.textContent).toContain('↳')
  })

  it('isolates open scopes per row — tapping a term in row 1 does not close row 4 (per-row contract)', async () => {
    const user = userEvent.setup()
    render(<SegmentList segments={SEGMENTS_WITH_GLOSSES} currentIndex={0} />)

    const list = screen.getByRole('list', { name: 'Segments' })
    const rows = within(list).getAllByRole('listitem')

    await user.click(within(rows[0]).getByRole('button', { name: 'A-skip' }))
    await user.click(within(rows[3]).getByRole('button', { name: 'pivot-back starts' }))

    expect(within(rows[0]).getByRole('button', { name: 'A-skip' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(
      within(rows[3]).getByRole('button', { name: 'pivot-back starts' }),
    ).toHaveAttribute('aria-expanded', 'true')
    // Both reveals visible inside their respective rows (per-row scope).
    expect(
      within(rows[0]).getByText(/skip forward, lifting the front knee/),
    ).toBeInTheDocument()
    expect(
      within(rows[3]).getByText(/pivot the inside foot and step back/),
    ).toBeInTheDocument()
  })

  it('swaps the open definition when a different term is tapped within the SAME row', async () => {
    const user = userEvent.setup()
    render(<SegmentList segments={SEGMENTS_WITH_GLOSSES} currentIndex={0} />)

    const ankle = screen.getByRole('button', { name: 'ankle hops' })
    const shuffles = screen.getByRole('button', { name: 'lateral shuffles' })

    await user.click(ankle)
    expect(screen.getByText(/small two-foot hops in place/)).toBeInTheDocument()
    expect(
      screen.queryByText(/quick sideways shuffle steps, feet never crossing/),
    ).not.toBeInTheDocument()

    await user.click(shuffles)
    expect(
      screen.queryByText(/small two-foot hops in place/),
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(/quick sideways shuffle steps, feet never crossing/),
    ).toBeInTheDocument()
    expect(ankle).toHaveAttribute('aria-expanded', 'false')
    expect(shuffles).toHaveAttribute('aria-expanded', 'true')
  })

  it('preserves layout invariants: duration cell remains in the row, aria-current marks the active row', async () => {
    const user = userEvent.setup()
    render(<SegmentList segments={SEGMENTS_WITH_GLOSSES} currentIndex={0} />)

    const list = screen.getByRole('list', { name: 'Segments' })
    const rows = within(list).getAllByRole('listitem')
    expect(rows).toHaveLength(4)

    // Active row before any reveal.
    expect(rows[0]).toHaveAttribute('aria-current', 'step')
    expect(rows[0].textContent).toContain('45s')

    // Open a reveal in the active row; aria-current and the duration
    // suffix both still belong to the same row.
    await user.click(screen.getByRole('button', { name: 'A-skip' }))

    expect(rows[0]).toHaveAttribute('aria-current', 'step')
    expect(rows[0].textContent).toContain('45s')
    // The reveal lives inside the active row (it is the same `<li>`,
    // not a sibling).
    expect(rows[0].textContent).toContain(
      'skip forward, lifting the front knee until the thigh is parallel to the sand',
    )
  })

  it('renders unchanged for segment labels with no `(= …)` (no buttons, no reveal slot)', () => {
    render(<SegmentList segments={SEGMENTS_WITH_GLOSSES} currentIndex={0} />)
    const row3 = within(screen.getByRole('list', { name: 'Segments' })).getAllByRole(
      'listitem',
    )[2]
    expect(row3.textContent).toContain('arm circles forward and back')
    expect(within(row3).queryAllByRole('button')).toHaveLength(0)
    expect(row3.textContent).not.toContain('↳')
  })

  it('keeps the (each side) suffix beside the inline parts when a gloss reveal is open', async () => {
    const user = userEvent.setup()
    const segments: readonly DrillSegment[] = [
      {
        id: 'eachside',
        label:
          'Hip stretch with pivot-back starts (= pivot the inside foot and step back).',
        durationSec: 60,
        eachSide: true,
      },
    ]

    render(<SegmentList segments={segments} currentIndex={0} />)
    const list = screen.getByRole('list', { name: 'Segments' })
    const rows = within(list).getAllByRole('listitem')

    expect(within(rows[0]).getByText(/\(each side\)/)).toBeInTheDocument()
    await user.click(within(rows[0]).getByRole('button', { name: 'pivot-back starts' }))
    // After reveal, both the inline (each side) suffix and the
    // reveal definition are present in the row.
    expect(within(rows[0]).getByText(/\(each side\)/)).toBeInTheDocument()
    expect(
      within(rows[0]).getByText(/pivot the inside foot and step back/),
    ).toBeInTheDocument()
  })
})
