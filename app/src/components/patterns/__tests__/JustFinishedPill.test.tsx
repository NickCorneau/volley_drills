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
    expect(outer.className).toContain('rounded-[12px]')
    expect(outer.className).toContain('bg-bg-warm')

    rerender(<JustFinishedPill drillName="x" status="skipped" />)
    outer = container.firstChild as HTMLElement
    expect(outer.className).toContain('rounded-[12px]')
    expect(outer.className).toContain('bg-bg-warm')
  })

  it('renders an SVG glyph that screen readers skip (aria-hidden)', () => {
    const { container } = render(<JustFinishedPill drillName="x" status="completed" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg!.getAttribute('aria-hidden')).toBe('true')
  })
})
