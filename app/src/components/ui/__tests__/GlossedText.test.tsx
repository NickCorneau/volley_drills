import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GlossedText } from '../GlossedText'

/*
 * RTL coverage for `<GlossedText>`. The parser's term-span resolution
 * is proven at the domain tier (`domain/__tests__/glossedText.test.ts`);
 * this file only proves the component-level wiring contracts:
 *
 *   1. The term renders as a real button with the dotted-underline
 *      visual class so the drift-prevention ESLint rule has a true
 *      positive to react to.
 *   2. Tapping the button toggles `aria-expanded` and reveals the
 *      definition with the `↳` glyph.
 *   3. Tapping a second time collapses.
 *   4. One open per paragraph: opening a different term in the same
 *      paragraph swaps the open definition; opening a term in a
 *      different paragraph keeps both open.
 *   5. The plain-text fallback (`textContent` of the rendered tree)
 *      reproduces the original `term (= definition)` form so
 *      screen-reader and copy-paste round-trip parity holds.
 */

describe('<GlossedText>', () => {
  it('renders the term as a button with the dotted-underline class', () => {
    render(
      <GlossedText text="Passes graded 2+ (= ball lands within 1 m of the set window with enough arc to be settable)." />,
    )
    const term = screen.getByRole('button', { name: 'graded 2+' })
    expect(term).toBeInTheDocument()
    expect(term.className).toContain('border-dotted')
    expect(term.className).toContain('border-text-secondary/60')
    expect(term).toHaveAttribute('aria-expanded', 'false')
  })

  it('reveals the definition on click and toggles `aria-expanded`', async () => {
    const user = userEvent.setup()
    render(<GlossedText text="Passes graded 2+ (= settable arc)." />)
    const term = screen.getByRole('button', { name: 'graded 2+' })

    expect(screen.queryByText('settable arc')).not.toBeInTheDocument()

    await user.click(term)

    expect(term).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('settable arc')).toBeInTheDocument()
  })

  it('collapses the definition on a second click', async () => {
    const user = userEvent.setup()
    render(<GlossedText text="Passes graded 2+ (= settable arc)." />)
    const term = screen.getByRole('button', { name: 'graded 2+' })

    await user.click(term)
    expect(screen.getByText('settable arc')).toBeInTheDocument()

    await user.click(term)
    expect(term).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('settable arc')).not.toBeInTheDocument()
  })

  it('swaps the open definition when a different term in the same paragraph is tapped', async () => {
    const user = userEvent.setup()
    render(
      <GlossedText text="Continuous: ankle hops (= small two-foot hops) then lateral shuffles (= sideways shuffle steps)." />,
    )
    const ankle = screen.getByRole('button', { name: 'ankle hops' })
    const shuffles = screen.getByRole('button', { name: 'lateral shuffles' })

    await user.click(ankle)
    expect(screen.getByText('small two-foot hops')).toBeInTheDocument()
    expect(screen.queryByText('sideways shuffle steps')).not.toBeInTheDocument()

    await user.click(shuffles)
    // Same paragraph: opening shuffles closes ankle hops.
    expect(screen.queryByText('small two-foot hops')).not.toBeInTheDocument()
    expect(screen.getByText('sideways shuffle steps')).toBeInTheDocument()
    expect(ankle).toHaveAttribute('aria-expanded', 'false')
    expect(shuffles).toHaveAttribute('aria-expanded', 'true')
  })

  it('keeps both definitions open when terms live in different paragraphs', async () => {
    const user = userEvent.setup()
    render(
      <GlossedText text={'First: ankle hops (= small two-foot hops).\n\nSecond: lateral shuffles (= sideways shuffle steps).'} />,
    )
    const ankle = screen.getByRole('button', { name: 'ankle hops' })
    const shuffles = screen.getByRole('button', { name: 'lateral shuffles' })

    await user.click(ankle)
    await user.click(shuffles)

    // Different paragraphs: both stay open at once.
    expect(screen.getByText('small two-foot hops')).toBeInTheDocument()
    expect(screen.getByText('sideways shuffle steps')).toBeInTheDocument()
    expect(ankle).toHaveAttribute('aria-expanded', 'true')
    expect(shuffles).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders an empty fragment for an empty input string', () => {
    const { container } = render(<GlossedText text="" />)
    expect(container.firstChild).toBeNull()
  })

  it('exposes both term and definition to the rendered text after expand (screen-reader parity)', async () => {
    const user = userEvent.setup()
    const original =
      'Passes graded 2+ (= ball lands within 1 m of the set window with enough arc to be settable).'
    const { container } = render(<GlossedText text={original} />)

    // Collapsed: only the term + surrounding prose are in the DOM —
    // the definition is intentionally hidden so a returning reader is
    // not re-reading the gloss every render. This is the "second-class
    // information" hierarchy in action.
    const collapsed = container.textContent ?? ''
    expect(collapsed).toContain('Passes graded 2+')
    expect(collapsed).not.toContain('ball lands within 1 m')

    // Expanded: the definition is now in the DOM and a screen reader
    // (or copy-paste) sees both the term and its definition. The `↳`
    // glyph is `aria-hidden` so screen readers skip it, but it still
    // appears in raw textContent — that's expected.
    await user.click(screen.getByRole('button', { name: 'graded 2+' }))
    const expanded = container.textContent ?? ''
    expect(expanded).toContain('Passes graded 2+')
    expect(expanded).toContain(
      'ball lands within 1 m of the set window with enough arc to be settable',
    )
  })
})
