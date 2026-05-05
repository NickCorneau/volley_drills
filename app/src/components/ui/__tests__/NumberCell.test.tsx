import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { NumberCell } from '../NumberCell'

describe('NumberCell', () => {
  it('renders an input labelled by the visible label', () => {
    render(<NumberCell label="Good" value={0} onCommit={() => {}} />)
    const input = screen.getByLabelText('Good')
    expect(input).toBeInTheDocument()
    expect(input.tagName).toBe('INPUT')
  })

  it('value === 0 renders as empty input with placeholder (empty-zero rule)', () => {
    render(<NumberCell label="Good" value={0} onCommit={() => {}} />)
    const input = screen.getByLabelText('Good') as HTMLInputElement
    expect(input.value).toBe('')
    expect(input.placeholder).toBe('0')
  })

  it('value > 0 renders the decimal string', () => {
    render(<NumberCell label="Good" value={42} onCommit={() => {}} />)
    expect((screen.getByLabelText('Good') as HTMLInputElement).value).toBe('42')
  })

  it('blur on empty input commits null (parent decides whether to persist)', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    render(<NumberCell label="Good" value={0} onCommit={onCommit} />)

    const input = screen.getByLabelText('Good')
    await user.click(input)
    await user.tab()
    expect(onCommit).toHaveBeenCalledWith(null)
  })

  it('blur on a valid integer commits the parsed number', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    render(<NumberCell label="Good" value={0} onCommit={onCommit} />)

    const input = screen.getByLabelText('Good')
    await user.click(input)
    await user.keyboard('7')
    await user.tab()
    expect(onCommit).toHaveBeenCalledWith(7)
  })

  it('Enter triggers commit (not just blur)', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    render(<NumberCell label="Good" value={0} onCommit={onCommit} />)

    const input = screen.getByLabelText('Good')
    await user.click(input)
    await user.keyboard('5{Enter}')
    expect(onCommit).toHaveBeenCalledWith(5)
  })

  it('non-integer-shaped input rejects via invalidMessage and commits null', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    render(
      <NumberCell
        label="Streak"
        value={0}
        onCommit={onCommit}
        invalidMessage="Use a whole number."
      />,
    )

    const input = screen.getByLabelText('Streak')
    await user.click(input)
    await user.keyboard('1.5')
    await user.tab()
    expect(onCommit).toHaveBeenCalledWith(null)
    expect(screen.getByText('Use a whole number.')).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('validate callback can clamp the parsed value before commit', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    render(
      <NumberCell
        label="Total"
        value={0}
        onCommit={onCommit}
        // Clamp to >= 5 (PassMetricInput-style "Good <= Total" pattern).
        validate={(parsed) => Math.max(5, parsed)}
      />,
    )

    await user.click(screen.getByLabelText('Total'))
    await user.keyboard('2')
    await user.tab()
    expect(onCommit).toHaveBeenCalledWith(5)
  })

  it('validate returning null shows invalidMessage and commits null', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    render(
      <NumberCell
        label="Streak"
        value={0}
        onCommit={onCommit}
        validate={(parsed) => (parsed > 99 ? null : parsed)}
        invalidMessage="Out of range."
      />,
    )

    await user.click(screen.getByLabelText('Streak'))
    await user.keyboard('150')
    await user.tab()
    expect(onCommit).toHaveBeenCalledWith(null)
    expect(screen.getByText('Out of range.')).toBeInTheDocument()
  })

  it('disabled prevents typing and shows the disabled visual', () => {
    render(<NumberCell label="Good" value={5} onCommit={() => {}} disabled />)
    const input = screen.getByLabelText('Good') as HTMLInputElement
    expect(input).toBeDisabled()
    expect(input.className).toContain('disabled:opacity-40')
  })

  it('helperText renders below the input', () => {
    render(
      <NumberCell
        label="Streak"
        value={0}
        onCommit={() => {}}
        helperText="Leave blank if unsure."
      />,
    )
    expect(screen.getByText('Leave blank if unsure.')).toBeInTheDocument()
  })

  it('parent value changes resync the displayed text (rehydration / auto-bump)', () => {
    const { rerender } = render(<NumberCell label="Good" value={0} onCommit={() => {}} />)
    expect((screen.getByLabelText('Good') as HTMLInputElement).value).toBe('')

    rerender(<NumberCell label="Good" value={7} onCommit={() => {}} />)
    expect((screen.getByLabelText('Good') as HTMLInputElement).value).toBe('7')
  })

  it('forwards testId for callers that key off DOM lookup', () => {
    render(<NumberCell label="x" value={0} onCommit={() => {}} testId="streak-input" />)
    expect(screen.getByTestId('streak-input')).toBeInTheDocument()
  })
})
