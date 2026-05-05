import { render, screen } from '@testing-library/react'
import { BlockTimer } from '../BlockTimer'

/**
 * Reconciled-list item #8 / design review A4 (originally shipped
 * 2026-04-26 as a thicker-bar + trailing `"X:XX left"` chip pair):
 * the pre-ship `h-2` accent-only bar (~8 px) read as decoration at
 * 2 m courtside rather than as a time signal. Two coupled changes
 * shipped as the visual half of the block-end countdown cue:
 *
 *   1. Progress bar height grew from `h-2` to `h-3` (~50% taller).
 *   2. A new `"X:XX left"` chip on the bar's trailing edge restated
 *      `formatTime(remaining)` as text.
 *
 * 2026-04-26 post-ship reversal: change (2) was reverted on the
 * same day. With Phase F10's `text-[56px]` digits sitting
 * immediately above the bar, the chip restated the exact same
 * value as the digits and read as a redundant time string
 * courtside ("3:53 / 3:53 left" — pick one). The bar at `h-3` is
 * thick enough to read as a relative-progress sense without an
 * explicit textual gloss; the digits remain the primary read; the
 * digits' accent flip in the final 3 seconds is still the single
 * visual countdown tick (covered in
 * `BlockTimer.end-countdown.test.tsx`).
 *
 * What this file asserts post-reversal:
 *   - The bar is `h-3` (the surviving half of A4).
 *   - The bar fill width tracks completed fraction.
 *   - The bar continues to render at frozen fill while paused.
 *   - The bar carries no sibling text element on its row (no chip).
 *
 * See:
 * `docs/research/partner-walkthrough-results/2026-04-22-trifold-synthesis.md`
 * §A4 (original framing),
 * `2026-04-22-all-passes-reconciled.md` item #8 (original framing),
 * `docs/archive/plans/2026-04-26-pre-d91-editorial-polish.md` Post-ship
 * amendment §"Item 7" (reversal rationale).
 */
describe('BlockTimer progress bar (visual half of #8 / A4, chip reverted)', () => {
  it('progress bar uses h-3 (thicker than the pre-2026-04-26 h-2)', () => {
    render(<BlockTimer remainingSeconds={47} totalSeconds={120} isPaused={false} />)
    const bar = screen.getByTestId('block-timer-bar')
    expect(bar.className).toContain('h-3')
    expect(bar.className).not.toContain('h-2')
  })

  it('progress fill width tracks completed fraction at the same h-3 thickness', () => {
    render(<BlockTimer remainingSeconds={30} totalSeconds={60} isPaused={false} />)
    const bar = screen.getByTestId('block-timer-bar')
    const fill = bar.firstElementChild as HTMLElement
    expect(bar.className).toContain('h-3')
    expect(fill.className).toContain('h-full')
    expect(fill.className).toContain('bg-accent')
    expect(fill.style.width).toBe('50%')
  })

  it('paused state still renders the bar at frozen fill (no animation, no suppression)', () => {
    render(<BlockTimer remainingSeconds={20} totalSeconds={60} isPaused={true} />)
    const bar = screen.getByTestId('block-timer-bar')
    const fill = bar.firstElementChild as HTMLElement
    // 60s total, 20s remaining → 40s completed → 66.6...%
    expect(fill.style.width).toMatch(/^66\.6/)
  })

  // Regression guard for the 2026-04-26 chip reversal. If a future
  // pass re-adds a textual time gloss next to the bar, this test
  // fails and the contributor reads the docstring above for the
  // reversal rationale before deciding whether the new evidence
  // earns the chip back.
  it('does NOT render a sibling "left" chip alongside the bar (chip reverted 2026-04-26)', () => {
    render(<BlockTimer remainingSeconds={47} totalSeconds={120} isPaused={false} />)
    expect(screen.queryByTestId('block-timer-chip')).toBeNull()
    expect(screen.queryByText(/left$/i)).toBeNull()
  })

  it('does not announce every running timer tick as a live-region update', () => {
    render(<BlockTimer remainingSeconds={47} totalSeconds={120} isPaused={false} />)
    const timer = screen.getByRole('timer')
    expect(timer).toHaveAttribute('aria-live', 'off')
    expect(timer).toHaveAccessibleName('0:47 remaining')
  })

  it('announces paused state politely', () => {
    render(<BlockTimer remainingSeconds={47} totalSeconds={120} isPaused />)
    const timer = screen.getByRole('timer')
    expect(timer).toHaveAttribute('aria-live', 'off')
    expect(timer).toHaveAccessibleName('0:47 remaining, paused')
    expect(screen.getByText(/Timer paused\. Tap Resume to continue\./i)).toHaveAttribute(
      'aria-live',
      'polite',
    )
  })
})
