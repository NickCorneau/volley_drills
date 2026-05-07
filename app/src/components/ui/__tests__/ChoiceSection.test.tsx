import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChoiceSubsection } from '../ChoiceSection'

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
