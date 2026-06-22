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

  it('preserves caller-owned eyebrow typography (no override)', () => {
    // RunFlowHeader never overrides the caller's eyebrow typography — the
    // wrapping grid-cell span carries alignment only, never font classes.
    // (The actual run-flow eyebrow-weight invariant — that the real
    // screens use the calm status-marker treatment, T6 2026-06-22 — is
    // pinned at the screen tier in RunScreen.rationale-placement and
    // TransitionScreen.role-eyebrow, not here, since this fixture supplies
    // its own span and would pass with any classes.)
    renderHeader({
      eyebrow: (
        <span data-testid="eyebrow" className="text-sm font-medium text-text-secondary">
          Main drill · Serve
        </span>
      ),
      counter: <span>3/5</span>,
    })

    const eyebrow = screen.getByTestId('eyebrow')
    expect(eyebrow.className).toContain('text-sm')
    expect(eyebrow.className).toContain('font-medium')
    expect(eyebrow.className).toContain('text-text-secondary')
  })

  it('renders SafetyIcon (with a recognisable accessible name) in the left cell', () => {
    renderHeader({
      eyebrow: <span>x</span>,
      counter: <span>1/1</span>,
    })
    // SafetyIcon renders a `<button aria-label="Safety information">`.
    // Coupling to the accessible name (rather than a class) keeps the test
    // resilient to SafetyIcon's internal styling drift.
    const safety = screen.getByRole('button', { name: /safety information/i })
    expect(safety).toBeInTheDocument()
    // T6 (2026-06-22): the trigger is the 44px tap-target FLOOR. Pin it so
    // a future shrink below the brand §4.5 / outdoor-brief minimum breaks.
    expect(safety.className).toContain('h-11')
    expect(safety.className).toContain('w-11')
  })

  it('appends caller-supplied className to the ScreenShell.Header wrapper', () => {
    const { container } = renderHeader({
      eyebrow: <span>x</span>,
      counter: <span>1/1</span>,
      className: 'my-runflow-class',
    })
    const wrapper = container.querySelector('[data-screen-shell-header]')
    expect(wrapper!.className).toContain('my-runflow-class')
    expect(wrapper!.className).toContain('grid grid-cols-3 items-center')
    // Zone spacing comes from ScreenShell.Header's default `flow` rhythm
    // (HEADER_RHYTHM), not from this pattern's own className.
    expect(wrapper!.className).toContain('pt-2')
    expect(wrapper!.className).toContain('pb-3')
  })
})
