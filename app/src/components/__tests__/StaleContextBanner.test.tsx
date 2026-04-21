import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StaleContextBanner } from '../StaleContextBanner'

/**
 * C-5 Unit 1: the stale-context banner is a dumb presentational
 * component. Its contract is: render with `role="status"` +
 * `aria-live="polite"` so assistive tech announces the pre-fill notice,
 * and include the provided `dayName` in the body copy.
 */

describe('StaleContextBanner (C-5 Unit 1)', () => {
  it('renders with role=status and aria-live=polite', () => {
    render(<StaleContextBanner dayName="Tuesday" />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
  })

  it('includes the dayName in the body copy', () => {
    render(<StaleContextBanner dayName="Yesterday" />)
    expect(
      screen.getByText(/setup pre-?filled from yesterday/i),
    ).toBeInTheDocument()
  })

  it('nudges the tester to review without being pushy', () => {
    render(<StaleContextBanner dayName="Tuesday" />)
    // Copy contract: "Adjust if today's different." - per the C-5 plan
    // this language is intentionally gentle; a regression that makes it
    // more insistent should flip this test.
    expect(
      screen.getByText(/adjust if today.?s different/i),
    ).toBeInTheDocument()
  })
})
