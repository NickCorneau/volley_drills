import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Disclosure } from '../Disclosure'

describe('Disclosure', () => {
  it('renders the trigger label as a 44px-tap-target button when collapsed', () => {
    render(
      <Disclosure label="Add counts (optional)">
        <p>drawer body</p>
      </Disclosure>,
    )

    const trigger = screen.getByRole('button', { name: /add counts \(optional\)/i })
    expect(trigger).toBeInTheDocument()
    expect(trigger.className).toContain('min-h-[44px]')
    expect(screen.queryByText('drawer body')).not.toBeInTheDocument()
  })

  it('forwards testId to the collapsed trigger', () => {
    render(
      <Disclosure label="Add counts (optional)" testId="per-drill-add-counts">
        <p>drawer body</p>
      </Disclosure>,
    )
    expect(screen.getByTestId('per-drill-add-counts')).toBeInTheDocument()
  })

  it('replaces the trigger with children when expanded (and the trigger is no longer reachable)', async () => {
    const user = userEvent.setup()
    render(
      <Disclosure label="Add counts (optional)">
        <p>drawer body</p>
      </Disclosure>,
    )

    await user.click(screen.getByRole('button', { name: /add counts \(optional\)/i }))
    expect(screen.getByText('drawer body')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /add counts \(optional\)/i }),
    ).not.toBeInTheDocument()
  })

  it('renders the canonical underlined-accent visual on the trigger', () => {
    render(
      <Disclosure label="x">
        <span>y</span>
      </Disclosure>,
    )
    const trigger = screen.getByRole('button', { name: 'x' })
    expect(trigger.className).toContain('text-accent')
    expect(trigger.className).toContain('underline-offset-2')
    expect(trigger.className).toContain('hover:underline')
  })
})
