import { render, screen } from '@testing-library/react'
import { CarryForwardCell } from '../CarryForwardCell'
import { PlanForTodayLine } from '../PlanForTodayLine'
import { WeeklyReceiptSection } from '../WeeklyReceiptSection'
import type { PlanOutput } from '../../../domain/composePlan'
import type { ReceiptOutput } from '../../../domain/composeReceipt'

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

describe('WeeklyReceiptSection', () => {
  function receipt(overrides: Partial<ReceiptOutput> = {}): ReceiptOutput {
    return {
      consistency: { kind: 'banded', count: 2, band: 'steady' },
      feltDifficulty: { pass: 'often_stretched', serve: 'not_enough_yet', set: 'not_enough_yet' },
      headline: '2 sessions this week.',
      ...overrides,
    }
  }

  it('renders the behavioral headline and present felt-difficulty bands', () => {
    render(<WeeklyReceiptSection receipt={receipt()} />)
    expect(screen.getByText('2 sessions this week.')).toBeInTheDocument()
    expect(screen.getByText('Passing: stretching you.')).toBeInTheDocument()
  })

  it('omits focuses with not_enough_yet (no filler rows)', () => {
    render(<WeeklyReceiptSection receipt={receipt()} />)
    expect(screen.queryByText(/Serving:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Setting:/)).not.toBeInTheDocument()
  })

  it('renders no felt list when every focus is not_enough_yet', () => {
    render(
      <WeeklyReceiptSection
        receipt={receipt({
          feltDifficulty: {
            pass: 'not_enough_yet',
            serve: 'not_enough_yet',
            set: 'not_enough_yet',
          },
        })}
      />,
    )
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('never renders a readiness/confidence number (R7 deferred)', () => {
    const { container } = render(<WeeklyReceiptSection receipt={receipt()} />)
    expect(container.textContent?.toLowerCase()).not.toContain('confiden')
    expect(container.textContent?.toLowerCase()).not.toContain('ready')
  })
})
