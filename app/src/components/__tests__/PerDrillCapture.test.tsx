import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PerDrillCapture } from '../PerDrillCapture'

/**
 * Tier 1b D133 (2026-04-26): per-drill capture surface lives on the
 * Transition screen between blocks. This file pins the component
 * contract: required difficulty chips + optional collapsed counts.
 *
 * Sources:
 *   docs/specs/m001-review-micro-spec.md §"Per-drill capture at Transition (D133)"
 *   docs/research/2026-04-26-pair-rep-capture-options.md (Framing D)
 *   docs/plans/2026-04-26-pair-rep-capture-tier1b.md
 */

function noop() {}

describe('PerDrillCapture', () => {
  it('renders the three difficulty chips with stable per-chip vocabulary', () => {
    render(
      <PerDrillCapture
        drillName="One-arm Passing"
        difficulty={null}
        onDifficultyChange={noop}
        showCounts={false}
        goodPasses={0}
        attemptCount={0}
        notCaptured={false}
        onGoodChange={noop}
        onAttemptChange={noop}
        onToggleNotCaptured={noop}
      />,
    )

    const chips = screen.getAllByRole('radio')
    expect(chips).toHaveLength(3)
    expect(screen.getByRole('radio', { name: /^too hard$/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^still learning$/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^too easy$/i })).toBeInTheDocument()
  })

  it('marks the matching chip as aria-checked when difficulty is set', () => {
    const { rerender } = render(
      <PerDrillCapture
        drillName="One-arm Passing"
        difficulty={null}
        onDifficultyChange={noop}
        showCounts={false}
        goodPasses={0}
        attemptCount={0}
        notCaptured={false}
        onGoodChange={noop}
        onAttemptChange={noop}
        onToggleNotCaptured={noop}
      />,
    )
    for (const chip of screen.getAllByRole('radio')) {
      expect(chip).toHaveAttribute('aria-checked', 'false')
    }

    rerender(
      <PerDrillCapture
        drillName="One-arm Passing"
        difficulty="still_learning"
        onDifficultyChange={noop}
        showCounts={false}
        goodPasses={0}
        attemptCount={0}
        notCaptured={false}
        onGoodChange={noop}
        onAttemptChange={noop}
        onToggleNotCaptured={noop}
      />,
    )
    expect(screen.getByRole('radio', { name: /still learning/i })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(screen.getByRole('radio', { name: /too hard/i })).toHaveAttribute(
      'aria-checked',
      'false',
    )
  })

  it('calls onDifficultyChange with the tapped chip value', () => {
    const onDifficultyChange = vi.fn()
    render(
      <PerDrillCapture
        drillName="One-arm Passing"
        difficulty={null}
        onDifficultyChange={onDifficultyChange}
        showCounts={false}
        goodPasses={0}
        attemptCount={0}
        notCaptured={false}
        onGoodChange={noop}
        onAttemptChange={noop}
        onToggleNotCaptured={noop}
      />,
    )

    fireEvent.click(screen.getByRole('radio', { name: /too easy/i }))
    expect(onDifficultyChange).toHaveBeenCalledWith('too_easy')
  })

  it('hides both the "Add counts" affordance and the counts surface when showCounts=false (non-count drill)', () => {
    render(
      <PerDrillCapture
        drillName="Wall Reading"
        difficulty="too_hard"
        onDifficultyChange={noop}
        showCounts={false}
        goodPasses={0}
        attemptCount={0}
        notCaptured={false}
        onGoodChange={noop}
        onAttemptChange={noop}
        onToggleNotCaptured={noop}
      />,
    )

    expect(screen.queryByTestId('per-drill-add-counts')).not.toBeInTheDocument()
    expect(screen.queryByTestId('per-drill-counts')).not.toBeInTheDocument()
  })

  it('starts with counts collapsed behind an "Add counts" affordance when showCounts=true', () => {
    render(
      <PerDrillCapture
        drillName="One-arm Passing"
        difficulty="still_learning"
        onDifficultyChange={noop}
        showCounts={true}
        goodPasses={0}
        attemptCount={0}
        notCaptured={false}
        onGoodChange={noop}
        onAttemptChange={noop}
        onToggleNotCaptured={noop}
      />,
    )

    expect(screen.getByTestId('per-drill-add-counts')).toBeInTheDocument()
    expect(screen.queryByTestId('per-drill-counts')).not.toBeInTheDocument()
  })

  it('reveals the Good/Total inputs after tapping "Add counts"', () => {
    render(
      <PerDrillCapture
        drillName="One-arm Passing"
        difficulty="still_learning"
        onDifficultyChange={noop}
        showCounts={true}
        goodPasses={0}
        attemptCount={0}
        notCaptured={false}
        onGoodChange={noop}
        onAttemptChange={noop}
        onToggleNotCaptured={noop}
      />,
    )

    fireEvent.click(screen.getByTestId('per-drill-add-counts'))
    expect(screen.getByTestId('per-drill-counts')).toBeInTheDocument()
    expect(screen.queryByTestId('per-drill-add-counts')).not.toBeInTheDocument()
  })

  // 2026-04-27 V0B-28 surface-move (D104 layer-1 forced-criterion
  // prompt): when the user expands `Add counts`, the per-drill success
  // rule and the anti-generosity nudge render above the Good/Total
  // inputs. Sourced from the drill record's
  // `variant.successMetric.description` via `getBlockSuccessRule` on
  // the `DrillCheckScreen` wire-up. See
  // `docs/plans/2026-04-27-per-drill-success-criterion.md` and
  // `docs/specs/m001-review-micro-spec.md` §Required line 78.
  describe('V0B-28 forced-criterion prompt', () => {
    it('renders the per-drill success rule and the anti-generosity nudge above the inputs after expanding counts', () => {
      render(
        <PerDrillCapture
          drillName="Self Toss Target Practice"
          difficulty="still_learning"
          onDifficultyChange={noop}
          showCounts={true}
          successRuleDescription="Serves or serve-toss contacts landing in or near a marked target circle."
          goodPasses={0}
          attemptCount={0}
          notCaptured={false}
          onGoodChange={noop}
          onAttemptChange={noop}
          onToggleNotCaptured={noop}
        />,
      )

      fireEvent.click(screen.getByTestId('per-drill-add-counts'))
      const rule = screen.getByTestId('per-drill-success-rule')
      expect(rule).toHaveTextContent(/^Success rule:/)
      expect(rule).toHaveTextContent(
        /Serves or serve-toss contacts landing in or near a marked target circle\./,
      )
      expect(rule).toHaveTextContent(/If unsure, don.t count it as Good\./)
    })

    it('does not render the success rule while the counts surface is collapsed', () => {
      render(
        <PerDrillCapture
          drillName="Self Toss Target Practice"
          difficulty="still_learning"
          onDifficultyChange={noop}
          showCounts={true}
          successRuleDescription="Serves or serve-toss contacts landing in or near a marked target circle."
          goodPasses={0}
          attemptCount={0}
          notCaptured={false}
          onGoodChange={noop}
          onAttemptChange={noop}
          onToggleNotCaptured={noop}
        />,
      )

      expect(screen.queryByTestId('per-drill-success-rule')).not.toBeInTheDocument()
    })

    it('omits the success rule when successRuleDescription is undefined (defensive default)', () => {
      render(
        <PerDrillCapture
          drillName="Self Toss Target Practice"
          difficulty="still_learning"
          onDifficultyChange={noop}
          showCounts={true}
          goodPasses={0}
          attemptCount={0}
          notCaptured={false}
          onGoodChange={noop}
          onAttemptChange={noop}
          onToggleNotCaptured={noop}
        />,
      )

      fireEvent.click(screen.getByTestId('per-drill-add-counts'))
      expect(screen.getByTestId('per-drill-counts')).toBeInTheDocument()
      expect(screen.queryByTestId('per-drill-success-rule')).not.toBeInTheDocument()
    })

    it('omits the success rule on non-count drills (showCounts=false)', () => {
      render(
        <PerDrillCapture
          drillName="Pass and Slap Hands"
          difficulty="too_easy"
          onDifficultyChange={noop}
          showCounts={false}
          successRuleDescription="Clean contacts in a row (restart on obvious mishit)."
          goodPasses={0}
          attemptCount={0}
          notCaptured={false}
          onGoodChange={noop}
          onAttemptChange={noop}
          onToggleNotCaptured={noop}
        />,
      )

      expect(screen.queryByTestId('per-drill-success-rule')).not.toBeInTheDocument()
    })
  })
})
