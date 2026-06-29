import { render, screen } from '@testing-library/react'
import { PainOverrideCard } from '../PainOverrideCard'

/**
 * Copy guard: the lighter-session card heading + sub-line carry the
 * 2026-06-29 de-jargon pass (U2): present-tense "Lighter session ready"
 * and plain "Easier drills today." (were "Switched to a lighter session"
 * / "Lower-load technique work today."). These strings had no render
 * coverage, so pin them against a silent revert.
 */
describe('PainOverrideCard copy', () => {
  it('pins the de-jargoned lighter-session heading and sub-line', () => {
    render(
      <PainOverrideCard
        recoveryMinutes={15}
        onContinueRecovery={vi.fn()}
        onOverride={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Lighter session ready' })).toBeInTheDocument()
    expect(screen.getByText('Easier drills today.')).toBeInTheDocument()
  })
})
