import { render, screen } from '@testing-library/react'

import { JustFinishedPill } from '../JustFinishedPill'

describe('JustFinishedPill', () => {
  it('renders the drill name and "Complete" subtitle for status="completed"', () => {
    render(<JustFinishedPill drillName="Toss-pass-shag" status="completed" />)
    expect(screen.getByText('Toss-pass-shag')).toBeInTheDocument()
    expect(screen.getByText('Complete')).toBeInTheDocument()
  })

  it('renders the drill name and "Skipped" subtitle for status="skipped"', () => {
    render(<JustFinishedPill drillName="6-Legged Monster" status="skipped" />)
    expect(screen.getByText('6-Legged Monster')).toBeInTheDocument()
    expect(screen.getByText('Skipped')).toBeInTheDocument()
  })

  it('keeps the warm-panel + success-circle chrome on both status variants', () => {
    const { container, rerender } = render(
      <JustFinishedPill drillName="x" status="completed" />,
    )
    let outer = container.firstChild as HTMLElement
    expect(outer.className).toContain('rounded-base')
    expect(outer.className).toContain('bg-bg-warm')

    rerender(<JustFinishedPill drillName="x" status="skipped" />)
    outer = container.firstChild as HTMLElement
    expect(outer.className).toContain('rounded-base')
    expect(outer.className).toContain('bg-bg-warm')
  })

  it('renders an SVG glyph that screen readers skip (aria-hidden)', () => {
    const { container } = render(<JustFinishedPill drillName="x" status="completed" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg!.getAttribute('aria-hidden')).toBe('true')
  })

  describe('presentation="line" (shibui polish 2026-06-12, origin R7)', () => {
    it('renders one quiet "{drill} · Complete" line with no panel chrome or semibold', () => {
      const { container } = render(
        <JustFinishedPill drillName="Toss-pass-shag" status="completed" presentation="line" />,
      )
      expect(screen.getByText('Toss-pass-shag · Complete')).toBeInTheDocument()
      const outer = container.firstChild as HTMLElement
      expect(outer.className).toContain('text-sm')
      expect(outer.className).toContain('text-text-secondary')
      expect(outer.className).not.toContain('bg-bg-warm')
      expect(container.innerHTML).not.toContain('font-semibold')
    })

    it('renders the Skipped variant at the same type tier, with the dash glyph', () => {
      const { container } = render(
        <JustFinishedPill drillName="6-Legged Monster" status="skipped" presentation="line" />,
      )
      expect(screen.getByText('6-Legged Monster · Skipped')).toBeInTheDocument()
      const outer = container.firstChild as HTMLElement
      expect(outer.className).toContain('text-sm')
      expect(outer.className).toContain('text-text-secondary')
      // The dash-vs-check glyph is the only variant signal on the line.
      expect(container.querySelector('svg line')).not.toBeNull()
    })

    it('keeps the glyph aria-hidden and in the success tone', () => {
      const { container } = render(
        <JustFinishedPill drillName="x" status="completed" presentation="line" />,
      )
      const svg = container.querySelector('svg')
      expect(svg).not.toBeNull()
      expect(svg!.getAttribute('aria-hidden')).toBe('true')
      expect((svg!.parentElement as HTMLElement).className).toContain('text-success')
    })
  })
})
