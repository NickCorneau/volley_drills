import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { PassMetricInput } from '../PassMetricInput'

/**
 * V0B-02 / B5 / H13: tap-to-type pass metric is the SOLE control on the
 * Review screen's pass-metric input. No +, no -, no ±5, no ±10. One
 * control, one interaction pattern (red-team fix plan v3).
 *
 * Typing a `good` that exceeds `total` auto-bumps `total` to match on
 * commit. notCaptured chip still lives below the numeric displays.
 */

function Harness({
  initialGood = 0,
  initialTotal = 0,
}: {
  initialGood?: number
  initialTotal?: number
}) {
  const [good, setGood] = useState(initialGood)
  const [total, setTotal] = useState(initialTotal)
  const [notCaptured, setNotCaptured] = useState(false)
  return (
    <PassMetricInput
      good={good}
      total={total}
      onGoodChange={setGood}
      onTotalChange={setTotal}
      notCaptured={notCaptured}
      onToggleNotCaptured={() => setNotCaptured((v) => !v)}
    />
  )
}

describe('PassMetricInput (V0B-02 / H13 tap-to-type)', () => {
  it('does NOT render any +/- or stepper buttons', () => {
    render(<Harness initialGood={3} initialTotal={5} />)

    expect(
      screen.queryByRole('button', { name: /increase good/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /decrease good/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /increase total/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /decrease total/i }),
    ).not.toBeInTheDocument()
  })

  it('renders tap-to-type numeric inputs labeled Good and Total', () => {
    render(<Harness initialGood={3} initialTotal={5} />)

    const good = screen.getByLabelText(/good/i) as HTMLInputElement
    const total = screen.getByLabelText(/total/i) as HTMLInputElement

    expect(good).toBeInTheDocument()
    expect(good).toHaveAttribute('inputMode', 'numeric')
    expect(good.value).toBe('3')

    expect(total).toBeInTheDocument()
    expect(total).toHaveAttribute('inputMode', 'numeric')
    expect(total.value).toBe('5')
  })

  it('typing a Good value commits the new number on blur', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const good = screen.getByLabelText(/good/i)

    await user.clear(good)
    await user.type(good, '8')
    await user.tab()

    expect((screen.getByLabelText(/good/i) as HTMLInputElement).value).toBe('8')
  })

  it('typing Good > Total auto-bumps Total to match on commit', async () => {
    const user = userEvent.setup()
    render(<Harness initialGood={0} initialTotal={10} />)

    const good = screen.getByLabelText(/good/i)
    await user.clear(good)
    await user.type(good, '15')
    await user.tab()

    const total = screen.getByLabelText(/total/i) as HTMLInputElement
    expect((screen.getByLabelText(/good/i) as HTMLInputElement).value).toBe('15')
    expect(total.value).toBe('15')
  })

  it('clamps negative typed values to 0 on commit', async () => {
    const user = userEvent.setup()
    render(<Harness initialGood={3} initialTotal={5} />)

    const good = screen.getByLabelText(/good/i)
    await user.clear(good)
    await user.type(good, '-2')
    await user.tab()

    expect((screen.getByLabelText(/good/i) as HTMLInputElement).value).toBe('0')
  })

  it('shows pass-rate line when Total > 0 and notCaptured is off', () => {
    render(<Harness initialGood={3} initialTotal={5} />)

    expect(screen.getByText(/60% good pass rate/i)).toBeInTheDocument()
  })

  it('keeps the notCaptured chip present below the numeric inputs', () => {
    render(<Harness initialGood={3} initialTotal={5} />)

    expect(
      screen.getByRole('button', { name: /couldn.t capture reps/i }),
    ).toBeInTheDocument()
  })
})
