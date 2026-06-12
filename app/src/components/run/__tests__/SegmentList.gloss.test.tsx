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
 * universalization pass, amended by the 2026-06-12 shibui polish
 * (origin R9): gloss buttons render ONLY on the active row.
 *
 *   1. Flagged terms in the ACTIVE row's label render as
 *      dotted-underline `<button>`s; tapping reveals the
 *      `↳ definition` line.
 *   2. Past/future rows render plain text — gloss buttons drop from
 *      the a11y tree entirely (no invisible tappables), with the
 *      `(= …)` markup still stripped from the visible text.
 *   3. A row's definitions become reachable when it turns active;
 *      an open reveal unmounts when its row leaves active.
 *   4. Opening a different term in the SAME (active) row swaps the
 *      definition.
 *   5. Layout invariants: the duration cell stays in column 3 and
 *      `aria-current` continues to mark the active row.
 *   6. Active-row labels with no `(= …)` render unchanged (no
 *      buttons, no reveal slot).
 *
 * The pre-R9 "per-row open scope" contract (row 1 and row 4 holding
 * reveals open simultaneously) is dead by design — only one row can
 * offer glosses at a time now.
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

  it('renders gloss buttons only on the active row — past and future rows are plain text (R9)', () => {
    render(<SegmentList segments={SEGMENTS_WITH_GLOSSES} currentIndex={1} />)

    const list = screen.getByRole('list', { name: 'Segments' })
    const rows = within(list).getAllByRole('listitem')

    // Active row (index 1) offers its two gloss terms.
    expect(within(rows[1]).getByRole('button', { name: 'ankle hops' })).toBeInTheDocument()
    expect(
      within(rows[1]).getByRole('button', { name: 'lateral shuffles' }),
    ).toBeInTheDocument()

    // Past row (0) and future row (3) carry flagged terms but expose
    // NO buttons — the affordance leaves the a11y tree entirely.
    expect(within(rows[0]).queryAllByRole('button')).toHaveLength(0)
    expect(within(rows[3]).queryAllByRole('button')).toHaveLength(0)

    // Their visible text keeps the term words with `(= …)` stripped.
    expect(rows[0].textContent).toContain('A-skip')
    expect(rows[0].textContent).not.toContain('(=')
    expect(rows[3].textContent).toContain('pivot-back starts')
    expect(rows[3].textContent).not.toContain('(=')

    // Total buttons in the list == the active row's gloss-term count.
    expect(within(list).getAllByRole('button')).toHaveLength(2)
  })

  it('unmounts an open reveal when the row leaves active, and the next row gains its glosses (R9)', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <SegmentList segments={SEGMENTS_WITH_GLOSSES} currentIndex={0} />,
    )

    const list = screen.getByRole('list', { name: 'Segments' })
    let rows = within(list).getAllByRole('listitem')

    await user.click(within(rows[0]).getByRole('button', { name: 'A-skip' }))
    expect(
      within(rows[0]).getByText(/skip forward, lifting the front knee/),
    ).toBeInTheDocument()

    // Timer advances: row 0 turns done, row 1 turns active.
    rerender(<SegmentList segments={SEGMENTS_WITH_GLOSSES} currentIndex={1} />)
    rows = within(list).getAllByRole('listitem')

    expect(within(rows[0]).queryAllByRole('button')).toHaveLength(0)
    expect(
      within(rows[0]).queryByText(/skip forward, lifting the front knee/),
    ).not.toBeInTheDocument()
    expect(
      within(rows[1]).getByRole('button', { name: 'ankle hops' }),
    ).toBeInTheDocument()
  })

  it('renders zero gloss buttons in the bonus state (all rows done)', () => {
    render(<SegmentList segments={SEGMENTS_WITH_GLOSSES} currentIndex={-1} bonus="Hydrate." />)
    const list = screen.getByRole('list', { name: 'Segments' })
    expect(within(list).queryAllByRole('button')).toHaveLength(0)
  })

  it('swaps the open definition when a different term is tapped within the SAME (active) row', async () => {
    const user = userEvent.setup()
    render(<SegmentList segments={SEGMENTS_WITH_GLOSSES} currentIndex={1} />)

    // Scope to the row: the aria-live announcer outside the list
    // reproduces the active row's RAW label (including `(= …)`), so
    // document-level text queries would double-match.
    const list = screen.getByRole('list', { name: 'Segments' })
    const row = within(list).getAllByRole('listitem')[1]

    const ankle = within(row).getByRole('button', { name: 'ankle hops' })
    const shuffles = within(row).getByRole('button', { name: 'lateral shuffles' })

    await user.click(ankle)
    expect(within(row).getByText(/small two-foot hops in place/)).toBeInTheDocument()
    expect(
      within(row).queryByText(/quick sideways shuffle steps, feet never crossing/),
    ).not.toBeInTheDocument()

    await user.click(shuffles)
    expect(
      within(row).queryByText(/small two-foot hops in place/),
    ).not.toBeInTheDocument()
    expect(
      within(row).getByText(/quick sideways shuffle steps, feet never crossing/),
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

  it('renders unchanged for an ACTIVE segment label with no `(= …)` (no buttons, no reveal slot)', () => {
    render(<SegmentList segments={SEGMENTS_WITH_GLOSSES} currentIndex={2} />)
    const row3 = within(screen.getByRole('list', { name: 'Segments' })).getAllByRole(
      'listitem',
    )[2]
    expect(row3).toHaveAttribute('aria-current', 'step')
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
