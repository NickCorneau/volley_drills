import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BlockTimer } from '../BlockTimer'

/**
 * Pre-close 2026-04-21 (founder pre-close review thought 3b): the
 * block-end 3-sec countdown has two halves per the outdoor-UI brief's
 * cue-stack invariant ("Visual first, always. Audio is
 * reinforcement.").
 *
 * Audio half: `RunScreen`'s poll loop fires `playPrerollTick()` at
 * `ceil(remaining)` 3 / 2 / 1, then `playBlockEndBeep()` on
 * transition. Audio half is covered by `audio.test.ts`.
 *
 * Visual half: `BlockTimer` flips the digit color from
 * `text-text-primary` to `text-accent` while `remainingSeconds` is in
 * the final 3 seconds, so the courtside reader gets a matched
 * visual cue even if they can't hear the audio (sand wind, muted
 * phone, noisy bench).
 *
 * `data-countdown` attribute exposes the state for tests and for
 * any future instrumentation without coupling to Tailwind class
 * strings.
 */

describe('BlockTimer end-countdown pulse (visual half of thought 3b)', () => {
  it('digits render with text-text-primary color when remainingSeconds > 3.5', () => {
    render(
      <BlockTimer
        remainingSeconds={30}
        totalSeconds={60}
        isPaused={false}
      />,
    )
    const digits = screen.getByTestId('block-timer-digits')
    expect(digits.dataset.countdown).toBe('false')
    expect(digits.className).toContain('text-text-primary')
    expect(digits.className).not.toContain('text-accent')
  })

  it('digits flip to text-accent color at remainingSeconds = 3', () => {
    // 3.0 is inside the <= 3.5 threshold. This frame is also the one
    // where `ceil(3.0) === 3` audibly fires `playPrerollTick()` in
    // RunScreen. Visual + audio land on the same frame.
    render(
      <BlockTimer
        remainingSeconds={3}
        totalSeconds={60}
        isPaused={false}
      />,
    )
    const digits = screen.getByTestId('block-timer-digits')
    expect(digits.dataset.countdown).toBe('true')
    expect(digits.className).toContain('text-accent')
    expect(digits.className).not.toContain('text-text-primary')
  })

  it('digits stay in text-accent at remainingSeconds = 1', () => {
    render(
      <BlockTimer
        remainingSeconds={1}
        totalSeconds={60}
        isPaused={false}
      />,
    )
    const digits = screen.getByTestId('block-timer-digits')
    expect(digits.dataset.countdown).toBe('true')
    expect(digits.className).toContain('text-accent')
  })

  it('digits return to text-text-primary at remainingSeconds = 0 (block ending)', () => {
    // At remaining === 0, the block is ending - handleBlockComplete
    // fires. We stop the accent highlight on this frame so the
    // visual "countdown" doesn't bleed past the boundary.
    render(
      <BlockTimer
        remainingSeconds={0}
        totalSeconds={60}
        isPaused={false}
      />,
    )
    const digits = screen.getByTestId('block-timer-digits')
    expect(digits.dataset.countdown).toBe('false')
    expect(digits.className).toContain('text-text-primary')
  })

  it('digits do NOT flip to text-accent while paused, even with <= 3 seconds remaining', () => {
    // Paused state means no countdown is active. The tester may have
    // paused mid-block in the final 3 seconds; don't surface an
    // urgency cue when the block isn't advancing.
    render(
      <BlockTimer
        remainingSeconds={2}
        totalSeconds={60}
        isPaused={true}
      />,
    )
    const digits = screen.getByTestId('block-timer-digits')
    expect(digits.dataset.countdown).toBe('false')
    expect(digits.className).toContain('text-text-primary')
  })

  it('threshold is 3.5 so the flip lands on the same frame as ceil(remaining) === 3', () => {
    // At remaining === 3.4, ceil === 4 - but we've crossed into the
    // visual countdown zone because the audio tick for "3" fires
    // imminently. The visual leads audio by up to 0.5s, which is
    // inside human perception tolerance and guarantees the visual
    // cannot lag the audio.
    const { rerender } = render(
      <BlockTimer
        remainingSeconds={3.6}
        totalSeconds={60}
        isPaused={false}
      />,
    )
    expect(
      screen.getByTestId('block-timer-digits').dataset.countdown,
    ).toBe('false')

    rerender(
      <BlockTimer
        remainingSeconds={3.4}
        totalSeconds={60}
        isPaused={false}
      />,
    )
    expect(
      screen.getByTestId('block-timer-digits').dataset.countdown,
    ).toBe('true')
  })
})
