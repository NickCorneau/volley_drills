import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GlossReveal } from '../GlossReveal'

/**
 * RTL coverage for the layout-agnostic reveal atom. Pins the
 * default styling stack, the `as="div"` escape hatch for hosts
 * that are themselves `<p>`, and the appended-className pattern
 * surfaces use for grid placement / register overrides.
 */

describe('<GlossReveal>', () => {
  it('renders the ↳ glyph and the definition text', () => {
    render(<GlossReveal definition="ball lands within 1 m of the set window" />)

    // `↳` is aria-hidden; query it directly via textContent. The
    // bare definition is also in the rendered text for SR / copy.
    expect(screen.getByText(/ball lands within 1 m of the set window/)).toBeInTheDocument()
    const reveal = screen.getByText(/ball lands within 1 m of the set window/)
    expect(reveal.textContent).toContain('↳')
  })

  it('uses <p> by default with the locked styling stack', () => {
    const { container } = render(<GlossReveal definition="x" />)
    const reveal = container.firstChild as HTMLElement | null
    expect(reveal).not.toBeNull()
    expect(reveal!.tagName).toBe('P')
    expect(reveal!.className).toContain('animate-[gloss-def-reveal_120ms_ease-out]')
    expect(reveal!.className).toContain('text-sm')
    expect(reveal!.className).toContain('text-text-secondary')
  })

  it('renders as <div> when as="div" is passed (HTML invariant for <p>-host callers)', () => {
    const { container } = render(<GlossReveal definition="x" as="div" />)
    const reveal = container.firstChild as HTMLElement | null
    expect(reveal!.tagName).toBe('DIV')
  })

  it('appends caller-supplied className to the default styling stack', () => {
    const { container } = render(
      <GlossReveal definition="x" className="col-start-2 col-span-2" />,
    )
    const reveal = container.firstChild as HTMLElement | null
    expect(reveal!.className).toContain('col-start-2')
    expect(reveal!.className).toContain('col-span-2')
    // Default stack is preserved.
    expect(reveal!.className).toContain('text-sm')
  })
})
