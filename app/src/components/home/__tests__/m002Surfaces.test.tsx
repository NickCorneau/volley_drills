import { render, screen } from '@testing-library/react'
import { CarryForwardCell } from '../CarryForwardCell'
import { PlanForTodayLine } from '../PlanForTodayLine'
import type { PlanOutput } from '../../../domain/composePlan'

describe('PlanForTodayLine', () => {
  it('renders the plan render line', () => {
    const plan: PlanOutput = {
      nextFocus: 'set',
      backlog: ['serve', 'pass'],
      intentions: ['pass', 'serve', 'set'],
      freshStart: false,
      render: 'Next up: setting after a warm-up. Then serving and passing.',
    }
    render(<PlanForTodayLine plan={plan} />)
    expect(screen.getByText(/Next up: setting after a warm-up/)).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Your plan' })).toBeInTheDocument()
  })
})

describe('CarryForwardCell', () => {
  it('renders the carry-forward line', () => {
    render(<CarryForwardCell line="A bit more stress on serving next time." />)
    expect(screen.getByText('A bit more stress on serving next time.')).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'Carried forward from last time' }),
    ).toBeInTheDocument()
  })
})
