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

    expect(screen.queryByRole('button', { name: /increase good/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /decrease good/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /increase total/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /decrease total/i })).not.toBeInTheDocument()
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

  // 2026-04-26 pre-D91 editorial polish (`F7`): a fresh Review
  // screen used to render the literal "0" inside both the Good and
  // Total inputs, which read as "the user already entered zero"
  // rather than "no value yet". The fix renders the untouched-zero
  // state as empty + `placeholder="0"` so the field looks unfilled
  // until the user actually commits a value. The internal domain
  // values (`good` / `total`) are unchanged. See
  // `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 3.
  it('renders untouched zero values as empty + placeholder="0" (not literal "0")', () => {
    render(<Harness initialGood={0} initialTotal={0} />)

    const good = screen.getByLabelText(/good/i) as HTMLInputElement
    const total = screen.getByLabelText(/total/i) as HTMLInputElement

    expect(good.value).toBe('')
    expect(good).toHaveAttribute('placeholder', '0')

    expect(total.value).toBe('')
    expect(total).toHaveAttribute('placeholder', '0')
  })

  // Empty-string-commits-to-0 invariant (preserved across `F7`):
  // a user who clears a value and blurs ends up at 0, even though
  // the field re-renders empty (with the placeholder) so they see
  // exactly the same untouched-zero state as a fresh load. The
  // domain value committed by the parent is `0`, which is what
  // the auto-save / submit path needs.
  it('treats an empty blur as a commit to 0 and keeps placeholder visible', async () => {
    const user = userEvent.setup()
    render(<Harness initialGood={5} initialTotal={10} />)

    const good = screen.getByLabelText(/good/i) as HTMLInputElement
    expect(good.value).toBe('5')

    await user.clear(good)
    await user.tab()

    expect(good.value).toBe('')
    expect(good).toHaveAttribute('placeholder', '0')
    // The pass-rate still computes against the parent's domain value
    // (good === 0, total === 10 → 0% good pass rate). The visible
    // 0% line confirms the empty input committed to 0 even though
    // the field rendered empty.
    expect(screen.getByText(/^0% good pass rate$/i)).toBeInTheDocument()
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

    // 2026-04-26 pre-D91 editorial polish (`F7`): zero is now
    // uniformly rendered as an empty input + `placeholder="0"`,
    // regardless of how the value got to zero (clamp, clear-and-blur,
    // notCaptured, fresh mount). The clamp behavior itself is the
    // contract under test — the parent received `0` after the user
    // typed `-2` — and the visible "0" still comes through (as the
    // placeholder). The pass-rate line confirms the parent's domain
    // value: `good=0 / total=5 = 0%`.
    const goodInput = screen.getByLabelText(/good/i) as HTMLInputElement
    expect(goodInput.value).toBe('')
    expect(goodInput).toHaveAttribute('placeholder', '0')
    expect(screen.getByText(/^0% good pass rate$/i)).toBeInTheDocument()
  })

  it('shows pass-rate line when Total > 0 and notCaptured is off', () => {
    render(<Harness initialGood={3} initialTotal={5} />)

    expect(screen.getByText(/60% good pass rate/i)).toBeInTheDocument()
  })

  it('keeps the notCaptured chip present below the numeric inputs', () => {
    render(<Harness initialGood={3} initialTotal={5} />)

    expect(screen.getByRole('button', { name: /couldn.t capture reps/i })).toBeInTheDocument()
  })
})
