import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ToggleChip } from '../ToggleChip'

describe('ToggleChip', () => {
  it('renders with accessible radio role and aria-checked reflecting selection', () => {
    render(
      <ToggleChip label="Solo" selected={false} onTap={() => {}} />,
    )
    const btn = screen.getByRole('radio', { name: 'Solo' })
    expect(btn).toHaveAttribute('aria-checked', 'false')
  })

  it('flips aria-checked when selected', () => {
    render(
      <ToggleChip label="Solo" selected onTap={() => {}} />,
    )
    expect(screen.getByRole('radio', { name: 'Solo' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('fires onTap when clicked', async () => {
    const onTap = vi.fn()
    render(<ToggleChip label="Solo" selected={false} onTap={onTap} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Solo' }))
    expect(onTap).toHaveBeenCalledTimes(1)
  })

  it('applies warning tone when tone="warning" and selected', () => {
    render(
      <ToggleChip
        label="Today"
        selected
        onTap={() => {}}
        tone="warning"
      />,
    )
    const btn = screen.getByRole('radio', { name: 'Today' })
    expect(btn.className).toContain('border-warning')
    expect(btn.className).toContain('bg-warning-surface')
  })

  it('applies accent tone by default when selected', () => {
    render(
      <ToggleChip label="Today" selected onTap={() => {}} />,
    )
    const btn = screen.getByRole('radio', { name: 'Today' })
    expect(btn.className).toContain('border-accent')
    expect(btn.className).toContain('bg-info-surface')
  })

  it('respects size="sm" hit target', () => {
    render(
      <ToggleChip label="Small" selected={false} onTap={() => {}} size="sm" />,
    )
    expect(
      screen.getByRole('radio', { name: 'Small' }).className,
    ).toContain('min-h-[48px]')
  })

  it('uses lg hit target by default', () => {
    render(<ToggleChip label="Large" selected={false} onTap={() => {}} />)
    expect(
      screen.getByRole('radio', { name: 'Large' }).className,
    ).toContain('min-h-[54px]')
  })
})
