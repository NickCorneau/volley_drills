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
    // T2 (one home per fact): the default no longer repeats "change
    // later" — the onboarding subtitle ("Change anytime.") owns it.
    expect(screen.queryByText(/you can change this after/i)).not.toBeInTheDocument()
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

  // T6 competing-focal-weight (2026-06-22 shibui audit): the recommended
  // band carries a "Recommended" badge so the five equal cards gain an
  // entry point ("start here if unsure").
  it('marks the recommended band when provided, and only that band', () => {
    render(<SkillLevelPicker onPick={vi.fn()} recommendedLevel="rally_builders" />)
    expect(
      screen.getByRole('button', { name: /Rally builders.*Recommended/i }),
    ).toBeInTheDocument()
    // No other band carries the badge.
    expect(screen.getAllByText('Recommended')).toHaveLength(1)
    expect(
      screen.getByRole('button', { name: /Foundations/ }).textContent,
    ).not.toMatch(/Recommended/)
  })

  it('renders no recommended badge when no recommendedLevel is provided (Settings path)', () => {
    render(<SkillLevelPicker onPick={vi.fn()} />)
    expect(screen.queryByText('Recommended')).not.toBeInTheDocument()
  })

  it('shows both Current and Recommended badges when they fall on different bands', () => {
    render(
      <SkillLevelPicker
        onPick={vi.fn()}
        currentLevel="side_out_builders"
        recommendedLevel="rally_builders"
      />,
    )
    expect(screen.getByRole('button', { name: /Side-out builders.*Current/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Rally builders.*Recommended/i })).toBeInTheDocument()
  })

  it('shows only Current (not Recommended) when both fall on the same band', () => {
    render(
      <SkillLevelPicker
        onPick={vi.fn()}
        currentLevel="rally_builders"
        recommendedLevel="rally_builders"
      />,
    )
    expect(screen.getByRole('button', { name: /Rally builders.*Current/i })).toBeInTheDocument()
    expect(screen.queryByText('Recommended')).not.toBeInTheDocument()
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
