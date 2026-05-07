import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SkillLevelPicker } from '../SkillLevelPicker'

describe('SkillLevelPicker', () => {
  it('renders all 5 skill level options', () => {
    render(<SkillLevelPicker onPick={vi.fn()} />)
    expect(screen.getByRole('button', { name: /Foundations/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Rally builders/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Side-out builders/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Competitive pair/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Not sure yet/ })).toBeInTheDocument()
  })

  it('uses descriptor copy on each band card', () => {
    render(<SkillLevelPicker onPick={vi.fn()} />)
    expect(screen.getByText('Keeping a friendly toss alive.')).toBeInTheDocument()
    expect(screen.getByText('Tougher serves, game-like play.')).toBeInTheDocument()
  })

  it('uses default unsure subtext when no override is provided', () => {
    render(<SkillLevelPicker onPick={vi.fn()} />)
    expect(screen.getByText(/We'll size a light starter/)).toBeInTheDocument()
  })

  it('uses custom unsure subtext when provided (Settings sub-route variant)', () => {
    render(
      <SkillLevelPicker
        onPick={vi.fn()}
        unsureSubtext="Pick the band that fits your current level."
      />,
    )
    expect(screen.getByText('Pick the band that fits your current level.')).toBeInTheDocument()
    expect(screen.queryByText(/We'll size a light starter/)).not.toBeInTheDocument()
  })

  it('marks the current saved level when provided', () => {
    render(<SkillLevelPicker onPick={vi.fn()} currentLevel="side_out_builders" />)

    const current = screen.getByRole('button', { name: /Side-out builders.*Current/i })
    expect(current).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('button', { name: /Rally builders/ })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('fires onPick with the picked SkillLevel value', async () => {
    const user = userEvent.setup()
    const onPick = vi.fn()
    render(<SkillLevelPicker onPick={onPick} />)

    await user.click(screen.getByRole('button', { name: /Rally builders/ }))
    expect(onPick).toHaveBeenCalledWith('rally_builders')

    await user.click(screen.getByRole('button', { name: /Not sure yet/ }))
    expect(onPick).toHaveBeenCalledWith('unsure')
  })

  it('exposes a 5-card list with the expected accessible label', () => {
    render(<SkillLevelPicker onPick={vi.fn()} />)
    const list = screen.getByRole('list', { name: /Skill level options/ })
    expect(list).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })
})
