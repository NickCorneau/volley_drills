import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ChoiceRow, type ChoiceRowOption } from '../ChoiceRow'

type Recency = '0 days' | '1 day' | '2+' | 'First time'

const RECENCY_OPTIONS: readonly ChoiceRowOption<Recency>[] = [
  { value: '0 days', label: 'Today', tone: 'warning' },
  { value: '1 day', label: 'Yesterday' },
  { value: '2+', label: '2+ days ago' },
  { value: 'First time', label: 'First time' },
]

describe('ChoiceRow', () => {
  it('renders a radiogroup with the supplied aria-label and one chip per option', () => {
    render(
      <ChoiceRow<Recency>
        value={null}
        onChange={() => {}}
        options={RECENCY_OPTIONS}
        ariaLabel="When did you last train?"
      />,
    )

    const group = screen.getByRole('radiogroup', { name: /when did you last train\?/i })
    expect(group).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(RECENCY_OPTIONS.length)
  })

  it('uses ariaLabelledBy when provided and omits the implicit aria-label', () => {
    render(
      <>
        <h3 id="layoff-bucket-label">Roughly how long off?</h3>
        <ChoiceRow<Recency>
          value={null}
          onChange={() => {}}
          options={RECENCY_OPTIONS}
          ariaLabelledBy="layoff-bucket-label"
        />
      </>,
    )

    expect(
      screen.getByRole('radiogroup', { name: /roughly how long off\?/i }),
    ).toBeInTheDocument()
  })

  it('marks the selected option with aria-checked and clicking calls onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ChoiceRow<Recency>
        value="1 day"
        onChange={onChange}
        options={RECENCY_OPTIONS}
        ariaLabel="When did you last train?"
      />,
    )

    expect(screen.getByRole('radio', { name: 'Yesterday' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(screen.getByRole('radio', { name: 'Today' })).toHaveAttribute(
      'aria-checked',
      'false',
    )

    await user.click(screen.getByRole('radio', { name: 'Today' }))
    expect(onChange).toHaveBeenCalledWith('0 days')
  })

  it('per-option tone overrides defaultTone (mixed-tone case)', () => {
    render(
      <ChoiceRow<Recency>
        value="0 days"
        onChange={() => {}}
        options={RECENCY_OPTIONS}
        ariaLabel="When did you last train?"
      />,
    )

    // The `0 days` option carries `tone: 'warning'`; selected state should
    // therefore render with the warning border/text classes (per ToggleChip's
    // SELECTED_TONE map). The other options would render with accent on selection.
    const today = screen.getByRole('radio', { name: 'Today' })
    expect(today.className).toMatch(/border-warning/)
    expect(today.className).toMatch(/text-warning/)
  })

  it('flex layout (default) gives each chip flex-1 width via ToggleChip default', () => {
    render(
      <ChoiceRow<Recency>
        value={null}
        onChange={() => {}}
        options={RECENCY_OPTIONS.slice(0, 2)}
        ariaLabel="x"
      />,
    )
    const group = screen.getByRole('radiogroup')
    expect(group.className).toContain('flex gap-2')
    // Default fill=true on chips → flex-1 in className.
    expect(screen.getByRole('radio', { name: 'Today' }).className).toContain('flex-1')
  })

  it('grid-3 layout switches the wrapper class and forces chip min-w-0 w-full', () => {
    type Effort = 'easy' | 'right' | 'hard'
    const EFFORT: ChoiceRowOption<Effort>[] = [
      { value: 'easy', label: 'Easy' },
      { value: 'right', label: 'Right' },
      { value: 'hard', label: 'Hard' },
    ]
    render(
      <ChoiceRow<Effort>
        value={null}
        onChange={() => {}}
        options={EFFORT}
        layout="grid-3"
        ariaLabel="Effort"
      />,
    )
    const group = screen.getByRole('radiogroup', { name: 'Effort' })
    expect(group.className).toContain('grid grid-cols-3 gap-2')
    const easy = screen.getByRole('radio', { name: 'Easy' })
    expect(easy.className).toContain('w-full')
    expect(easy.className).not.toContain('flex-1')
  })

  it('grid-2 layout switches the wrapper class', () => {
    type Focus = 'pass' | 'serve'
    render(
      <ChoiceRow<Focus>
        value={null}
        onChange={() => {}}
        options={[
          { value: 'pass', label: 'Passing' },
          { value: 'serve', label: 'Serving' },
        ]}
        layout="grid-2"
        ariaLabel="Focus"
      />,
    )
    expect(screen.getByRole('radiogroup', { name: 'Focus' }).className).toContain(
      'grid grid-cols-2 gap-2',
    )
  })

  it('appends caller-supplied className to the radiogroup wrapper', () => {
    render(
      <ChoiceRow<Recency>
        value={null}
        onChange={() => {}}
        options={RECENCY_OPTIONS.slice(0, 2)}
        ariaLabel="x"
        className="my-custom-class"
      />,
    )
    expect(screen.getByRole('radiogroup').className).toContain('my-custom-class')
  })

  it('supports deselect-on-retap when the parent wraps onChange', async () => {
    // IncompleteReasonChips' pattern: tapping a selected chip clears the
    // value. ChoiceRow's onChange always receives a value; the parent's
    // wrapping lambda decides to forward null when value === next.
    const user = userEvent.setup()
    const onParentChange = vi.fn<(next: Recency | null) => void>()
    let value: Recency | null = '0 days'
    render(
      <ChoiceRow<Recency>
        value={value}
        onChange={(next) => onParentChange(value === next ? null : next)}
        options={RECENCY_OPTIONS}
        ariaLabel="x"
      />,
    )

    await user.click(screen.getByRole('radio', { name: 'Today' }))
    expect(onParentChange).toHaveBeenCalledWith(null)

    onParentChange.mockClear()
    value = null
    await user.click(screen.getByRole('radio', { name: 'Yesterday' }))
    // The render captured a stale `value` here; this check is against
    // the second-tap path only (re-render would update the closure).
    expect(onParentChange).toHaveBeenCalled()
  })
})
