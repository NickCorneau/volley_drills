import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { RpeSelector } from '../RpeSelector'
import { pickChipForRpe } from '../rpeSelectorUtils'

/**
 * 2026-04-23 walkthrough closeout polish item 2 (merged Review
 * proposal in
 * `docs/research/partner-walkthrough-results/2026-04-22-trifold-synthesis.md`
 * + plan `docs/plans/2026-04-23-walkthrough-closeout-polish.md`):
 * `RpeSelector` collapsed from 11 numeric chips to 3 labelled chips
 * (Easy=3 / Right=5 / Hard=7).
 *
 * The Dexie `sessionRpe` field remains a number in the 0-10 domain so
 * `composeSummary`, `effortLabel`, the `phase-c0-schema-v4` migration
 * backfill, and the `D104` / `O12` progression floor constants all
 * continue to operate unchanged. The capture UI reports one of three
 * canonical anchor values (3 / 5 / 7) for new sessions; historical
 * non-canonical values rehydrate via `pickChipForRpe` which snaps the
 * stored value to the nearest chip for display without mutating the
 * underlying data.
 */

function Harness({ initial = null }: { initial?: number | null }) {
  const [value, setValue] = useState<number | null>(initial)
  return (
    <>
      <h2 id="rpe-heading">How hard was your session?</h2>
      <RpeSelector value={value} onChange={setValue} />
      <p data-testid="captured">{value === null ? 'null' : String(value)}</p>
    </>
  )
}

describe('RpeSelector 3-chip picker', () => {
  it('renders exactly three chips labelled Easy, Right, Hard', () => {
    render(<Harness />)
    const chips = screen.getAllByRole('radio')
    expect(chips).toHaveLength(3)
    expect(screen.getByRole('radio', { name: /^easy$/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^right$/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^hard$/i })).toBeInTheDocument()
  })

  it('does not render any numeric 0-10 chip label (post-collapse regression guard)', () => {
    render(<Harness />)
    for (const n of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      expect(screen.queryByRole('radio', { name: new RegExp(`^${n}$`) })).not.toBeInTheDocument()
    }
  })

  it('Easy maps to canonical sessionRpe=3', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('radio', { name: /^easy$/i }))
    expect(screen.getByTestId('captured')).toHaveTextContent('3')
  })

  it('Right maps to canonical sessionRpe=5', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('radio', { name: /^right$/i }))
    expect(screen.getByTestId('captured')).toHaveTextContent('5')
  })

  it('Hard maps to canonical sessionRpe=7', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('radio', { name: /^hard$/i }))
    expect(screen.getByTestId('captured')).toHaveTextContent('7')
  })

  it('selecting a chip marks aria-checked=true on exactly one', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('radio', { name: /^right$/i }))
    expect(screen.getByRole('radio', { name: /^right$/i })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: /^easy$/i })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('radio', { name: /^hard$/i })).toHaveAttribute('aria-checked', 'false')
  })

  describe('pickChipForRpe (historical value rehydration)', () => {
    it('returns null for null stored value (skipped / expired stubs)', () => {
      expect(pickChipForRpe(null)).toBeNull()
    })

    it.each([
      { stored: 0, snapped: 3 },
      { stored: 1, snapped: 3 },
      { stored: 2, snapped: 3 },
      { stored: 3, snapped: 3 },
      { stored: 4, snapped: 3 },
      { stored: 5, snapped: 5 },
      { stored: 6, snapped: 5 },
      { stored: 7, snapped: 7 },
      { stored: 8, snapped: 7 },
      { stored: 9, snapped: 7 },
      { stored: 10, snapped: 7 },
    ])('snaps historical sessionRpe=$stored to chip value $snapped', ({ stored, snapped }) => {
      expect(pickChipForRpe(stored)).toBe(snapped)
    })
  })

  it('rehydrates from a non-canonical historical value by snapping to the nearest chip', () => {
    render(<Harness initial={8} />)
    // Stored value 8 is preserved in the harness state, but the UI
    // shows Hard (7) as checked.
    expect(screen.getByRole('radio', { name: /^hard$/i })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByTestId('captured')).toHaveTextContent('8')
  })
})
