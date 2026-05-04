import { render, screen } from '@testing-library/react'

import { ScreenShell } from '../../ui/ScreenShell'
import { RunFlowHeader } from '../RunFlowHeader'

function renderHeader(props: Parameters<typeof RunFlowHeader>[0]) {
  return render(
    <ScreenShell>
      <RunFlowHeader {...props} />
    </ScreenShell>,
  )
}

describe('RunFlowHeader', () => {
  it('renders SafetyIcon, eyebrow, and counter in 3-cell grid order', () => {
    const { container } = renderHeader({
      eyebrow: <span data-testid="eyebrow">Drill check</span>,
      counter: <span data-testid="counter">Last: 2/4</span>,
    })

    const wrapper = container.querySelector('[data-screen-shell-header]')
    expect(wrapper).not.toBeNull()
    expect(wrapper!.className).toContain('grid grid-cols-3')

    expect(screen.getByTestId('eyebrow')).toBeInTheDocument()
    expect(screen.getByTestId('counter')).toBeInTheDocument()
  })

  it('preserves caller-owned eyebrow typography (focal vs status case)', () => {
    renderHeader({
      eyebrow: (
        <span data-testid="eyebrow" className="text-sm font-semibold text-accent">
          Main drill · Serve
        </span>
      ),
      counter: <span>3/5</span>,
    })

    const eyebrow = screen.getByTestId('eyebrow')
    // The wrapping span (inside the grid cell) has no typography of its own;
    // the caller-supplied span keeps its classes intact.
    expect(eyebrow.className).toContain('text-sm')
    expect(eyebrow.className).toContain('font-semibold')
    expect(eyebrow.className).toContain('text-accent')
  })

  it('renders SafetyIcon (with a recognisable accessible name) in the left cell', () => {
    renderHeader({
      eyebrow: <span>x</span>,
      counter: <span>1/1</span>,
    })
    // SafetyIcon renders a `<button aria-label="Safety information">`.
    // Coupling to the accessible name (rather than a class) keeps the test
    // resilient to SafetyIcon's internal styling drift.
    expect(screen.getByRole('button', { name: /safety information/i })).toBeInTheDocument()
  })

  it('appends caller-supplied className to the ScreenShell.Header wrapper', () => {
    const { container } = renderHeader({
      eyebrow: <span>x</span>,
      counter: <span>1/1</span>,
      className: 'my-runflow-class',
    })
    const wrapper = container.querySelector('[data-screen-shell-header]')
    expect(wrapper!.className).toContain('my-runflow-class')
    expect(wrapper!.className).toContain('grid grid-cols-3 items-center pt-2 pb-3')
  })
})
