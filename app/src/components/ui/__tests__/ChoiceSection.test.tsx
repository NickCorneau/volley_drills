import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChoiceSection, ChoiceSubsection } from '../ChoiceSection'

describe('ChoiceSection heading variants (D158)', () => {
  it('defaults to the question-scale heading (Safety keeps this)', () => {
    render(
      <ChoiceSection title="When did you last train?">
        <button type="button">Today</button>
      </ChoiceSection>,
    )

    const heading = screen.getByRole('heading', { level: 2, name: /last train/i })
    expect(heading).toHaveClass('text-base', 'font-semibold')
    expect(heading).not.toHaveClass('uppercase')
  })

  it('micro variant renders the quiet uppercase micro-label (Setup refine cluster)', () => {
    render(
      <ChoiceSection title="Players" headingVariant="micro">
        <button type="button">Solo</button>
      </ChoiceSection>,
    )

    // Accessible name stays the sentence-case title — uppercase is
    // purely visual (CSS), so screen readers are unaffected.
    const heading = screen.getByRole('heading', { level: 2, name: 'Players' })
    expect(heading).toHaveClass('text-xs', 'uppercase', 'tracking-wider', 'text-text-secondary')
  })

  it('micro variant on ChoiceSubsection matches the section treatment', () => {
    render(
      <ChoiceSubsection titleId="wall-label" title="Wall or fence nearby?" headingVariant="micro">
        <button type="button">Yes</button>
      </ChoiceSubsection>,
    )

    const heading = screen.getByRole('heading', { level: 3, name: /wall or fence/i })
    expect(heading).toHaveClass('text-xs', 'uppercase', 'tracking-wider', 'text-text-secondary')
  })
})

describe('ChoiceSubsection', () => {
  it('renders the conditional follow-up row with stable heading and children', () => {
    render(
      <ChoiceSubsection
        titleId="follow-up-title"
        title="Use a wall or fence?"
        description="Pick the surface you have today."
      >
        <button type="button">Wall</button>
      </ChoiceSubsection>,
    )

    expect(screen.getByRole('heading', { name: /wall or fence/i })).toHaveAttribute(
      'id',
      'follow-up-title',
    )
    expect(screen.getByText(/surface you have today/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /wall/i })).toBeInTheDocument()
  })
})
