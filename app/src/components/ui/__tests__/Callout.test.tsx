import { render, screen } from '@testing-library/react'

import { Callout } from '../Callout'

describe('Callout', () => {
  it('renders the children content', () => {
    render(<Callout tone="info">Hello world</Callout>)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('warning tone defaults to flat emphasis (no border, warning surface, warning text)', () => {
    const { container } = render(<Callout tone="warning">x</Callout>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('bg-warning-surface')
    expect(el.className).toContain('text-warning')
    expect(el.className).not.toContain('border')
  })

  it('warning tone with hairline emphasis adds the warning border', () => {
    const { container } = render(
      <Callout tone="warning" emphasis="hairline">
        x
      </Callout>,
    )
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('border-warning/30')
    expect(el.className).toContain('bg-warning-surface')
  })

  it('info tone uses info-surface and text-secondary (heat tips case)', () => {
    const { container } = render(<Callout tone="info">x</Callout>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('bg-info-surface')
    expect(el.className).toContain('text-text-secondary')
  })

  it('success tone uses success surface (Settings export-success case)', () => {
    const { container } = render(
      <Callout tone="success" size="sm" role="status">
        Export saved
      </Callout>,
    )
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('bg-success/10')
    expect(el.className).toContain('text-success')
    expect(el).toHaveAttribute('role', 'status')
  })

  it('default size is md (p-4)', () => {
    const { container } = render(<Callout tone="info">x</Callout>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('p-4')
  })

  it('size sm is the inline status strip (centered, py-3, sm text)', () => {
    const { container } = render(
      <Callout tone="warning" size="sm" role="alert">
        x
      </Callout>,
    )
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('px-4 py-3')
    expect(el.className).toContain('text-center')
    expect(el.className).toContain('text-sm')
    expect(el.className).toContain('font-medium')
    expect(el).toHaveAttribute('role', 'alert')
  })

  it('omits role attribute when neither alert nor status is requested', () => {
    const { container } = render(<Callout tone="info">x</Callout>)
    const el = container.firstChild as HTMLElement
    expect(el.hasAttribute('role')).toBe(false)
  })

  it('appends caller-supplied className to the wrapper', () => {
    const { container } = render(
      <Callout tone="info" className="my-callout-class">
        x
      </Callout>,
    )
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('my-callout-class')
  })
})
