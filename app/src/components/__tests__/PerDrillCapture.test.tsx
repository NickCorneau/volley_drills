import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PerDrillCapture } from '../PerDrillCapture'

/**
 * Tier 1b D133 (2026-04-26): per-drill capture surface lives on
 * Drill Check (`/run/check`) between blocks. This file pins the component
 * contract: required difficulty chips + optional collapsed counts.
 *
 * Sources:
 *   docs/specs/m001-review-micro-spec.md §"Per-drill capture at Drill Check (D133)"
 *   docs/research/2026-04-26-pair-rep-capture-options.md (Framing D)
 *   docs/plans/2026-04-26-pair-rep-capture-tier1b.md
 *
 * D134 (2026-04-28): the prop API moved from `showCounts: boolean` to
 * `captureShape: { kind: 'count' | 'streak' | 'none' }`. Phase 2A adds
 * the streak drawer for `streak`-typed `main_skill` / `pressure`
 * drills.
 */

function noop() {}

describe('PerDrillCapture difficulty chips (always rendered)', () => {
  it('renders the three difficulty chips with stable per-chip vocabulary', () => {
    render(
      <PerDrillCapture
        drillName="One-arm Passing"
        difficulty={null}
        onDifficultyChange={noop}
        captureShape={{ kind: 'none' }}
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
        captureShape={{ kind: 'none' }}
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
        captureShape={{ kind: 'none' }}
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
        captureShape={{ kind: 'none' }}
      />,
    )

    fireEvent.click(screen.getByRole('radio', { name: /too easy/i }))
    expect(onDifficultyChange).toHaveBeenCalledWith('too_easy')
  })
})

describe('PerDrillCapture captureShape: none (Phase 2B-deferred drills)', () => {
  it('renders neither the count drawer nor the streak drawer', () => {
    render(
      <PerDrillCapture
        drillName="Wall Reading"
        difficulty="too_hard"
        onDifficultyChange={noop}
        captureShape={{ kind: 'none' }}
      />,
    )

    expect(screen.queryByTestId('per-drill-add-counts')).not.toBeInTheDocument()
    expect(screen.queryByTestId('per-drill-counts')).not.toBeInTheDocument()
    expect(screen.queryByTestId('per-drill-add-streak')).not.toBeInTheDocument()
    expect(screen.queryByTestId('per-drill-streak')).not.toBeInTheDocument()
  })
})

describe('PerDrillCapture captureShape: count', () => {
  it('starts with counts collapsed behind an "Add counts" affordance', () => {
    render(
      <PerDrillCapture
        drillName="One-arm Passing"
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'count' }}
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
    expect(screen.queryByTestId('per-drill-add-streak')).not.toBeInTheDocument()
  })

  it('reveals the Good/Total inputs after tapping "Add counts"', () => {
    render(
      <PerDrillCapture
        drillName="One-arm Passing"
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'count' }}
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
          captureShape={{ kind: 'count' }}
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
          captureShape={{ kind: 'count' }}
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
          captureShape={{ kind: 'count' }}
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

    it('omits the success rule on chip-only drills (captureShape: none)', () => {
      render(
        <PerDrillCapture
          drillName="Pass and Slap Hands"
          difficulty="too_easy"
          onDifficultyChange={noop}
          captureShape={{ kind: 'none' }}
          successRuleDescription="Clean contacts in a row (restart on obvious mishit)."
        />,
      )

      expect(screen.queryByTestId('per-drill-success-rule')).not.toBeInTheDocument()
    })
  })
})

// D134 (2026-04-28): Phase 2A — optional streak capture for
// `streak`-typed `main_skill` / `pressure` drills. Drawer is collapsed
// by default behind `Add longest streak (optional)`; expanded body
// renders the success rule (no anti-generosity nudge) and a single
// numeric input. Continue is NEVER disabled by a blank or invalid
// streak (the controller-tier test pins that side of the contract);
// invalid input shows inline correction copy and persists nothing.
describe('PerDrillCapture captureShape: streak (Phase 2A — D134)', () => {
  it('starts with the streak drawer collapsed behind an "Add longest streak (optional)" affordance', () => {
    render(
      <PerDrillCapture
        drillName="Bump Set Fundamentals"
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        streakLongest={null}
        onStreakLongestChange={noop}
      />,
    )

    expect(screen.getByTestId('per-drill-add-streak')).toBeInTheDocument()
    expect(screen.queryByTestId('per-drill-streak')).not.toBeInTheDocument()
    expect(screen.queryByTestId('per-drill-add-counts')).not.toBeInTheDocument()
    expect(screen.queryByTestId('per-drill-counts')).not.toBeInTheDocument()
  })

  it('reveals the streak input after tapping the affordance', () => {
    render(
      <PerDrillCapture
        drillName="Bump Set Fundamentals"
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        streakLongest={null}
        onStreakLongestChange={noop}
      />,
    )

    fireEvent.click(screen.getByTestId('per-drill-add-streak'))
    expect(screen.getByTestId('per-drill-streak')).toBeInTheDocument()
    expect(screen.getByLabelText(/Longest streak/i)).toBeInTheDocument()
    expect(
      screen.getByText(/If you counted, enter your best unbroken streak\. Leave blank if unsure\./i),
    ).toBeInTheDocument()
    expect(screen.queryByTestId('per-drill-add-streak')).not.toBeInTheDocument()
  })

  it('renders the success rule above the input WITHOUT the anti-generosity nudge', () => {
    render(
      <PerDrillCapture
        drillName="Bump Set Fundamentals"
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        successRuleDescription="Clean contacts in a row before a mishit."
        streakLongest={null}
        onStreakLongestChange={noop}
      />,
    )

    fireEvent.click(screen.getByTestId('per-drill-add-streak'))
    const rule = screen.getByTestId('per-drill-success-rule')
    expect(rule).toHaveTextContent(/^Success rule:/)
    expect(rule).toHaveTextContent(/Clean contacts in a row before a mishit\./)
    // The anti-generosity nudge belongs only to the count branch.
    expect(rule).not.toHaveTextContent(/If unsure, don.t count it as Good/)
  })

  it('input uses inputMode=numeric and pattern=[0-9]* for iOS number-pad', () => {
    render(
      <PerDrillCapture
        drillName="Bump Set Fundamentals"
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        streakLongest={null}
        onStreakLongestChange={noop}
      />,
    )

    fireEvent.click(screen.getByTestId('per-drill-add-streak'))
    const input = screen.getByTestId('per-drill-streak-input')
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveAttribute('inputmode', 'numeric')
    expect(input).toHaveAttribute('pattern', '[0-9]*')
  })

  it('commits a parsed integer on blur for valid input', () => {
    const onStreakLongestChange = vi.fn()
    render(
      <PerDrillCapture
        drillName="Bump Set Fundamentals"
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        streakLongest={null}
        onStreakLongestChange={onStreakLongestChange}
      />,
    )

    fireEvent.click(screen.getByTestId('per-drill-add-streak'))
    const input = screen.getByTestId('per-drill-streak-input')
    fireEvent.change(input, { target: { value: '7' } })
    fireEvent.blur(input)
    expect(onStreakLongestChange).toHaveBeenLastCalledWith(7)
  })

  it('commits null on blur when the input is empty (no row written)', () => {
    const onStreakLongestChange = vi.fn()
    render(
      <PerDrillCapture
        drillName="Bump Set Fundamentals"
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        streakLongest={null}
        onStreakLongestChange={onStreakLongestChange}
      />,
    )

    fireEvent.click(screen.getByTestId('per-drill-add-streak'))
    const input = screen.getByTestId('per-drill-streak-input')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.blur(input)
    expect(onStreakLongestChange).toHaveBeenLastCalledWith(null)
  })

  it('shows inline correction text and commits null when the value is invalid (non-integer)', () => {
    const onStreakLongestChange = vi.fn()
    render(
      <PerDrillCapture
        drillName="Bump Set Fundamentals"
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        streakLongest={null}
        onStreakLongestChange={onStreakLongestChange}
      />,
    )

    fireEvent.click(screen.getByTestId('per-drill-add-streak'))
    const input = screen.getByTestId('per-drill-streak-input')
    fireEvent.change(input, { target: { value: '1.5' } })
    fireEvent.blur(input)

    expect(onStreakLongestChange).toHaveBeenLastCalledWith(null)
    expect(screen.getByTestId('per-drill-streak-invalid')).toHaveTextContent(
      /Use a whole number\. This result will be skipped unless fixed\./,
    )
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows inline correction text and commits null when the value is out of range (>99)', () => {
    const onStreakLongestChange = vi.fn()
    render(
      <PerDrillCapture
        drillName="Bump Set Fundamentals"
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        streakLongest={null}
        onStreakLongestChange={onStreakLongestChange}
      />,
    )

    fireEvent.click(screen.getByTestId('per-drill-add-streak'))
    const input = screen.getByTestId('per-drill-streak-input')
    fireEvent.change(input, { target: { value: '100' } })
    fireEvent.blur(input)

    expect(onStreakLongestChange).toHaveBeenLastCalledWith(null)
    expect(screen.getByTestId('per-drill-streak-invalid')).toBeInTheDocument()
  })

  it('clears the inline correction text once the value becomes valid', () => {
    const { rerender } = render(
      <PerDrillCapture
        drillName="Bump Set Fundamentals"
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        streakLongest={null}
        onStreakLongestChange={noop}
      />,
    )
    fireEvent.click(screen.getByTestId('per-drill-add-streak'))
    const input = screen.getByTestId('per-drill-streak-input')
    fireEvent.change(input, { target: { value: '1.5' } })
    fireEvent.blur(input)
    expect(screen.getByTestId('per-drill-streak-invalid')).toBeInTheDocument()

    rerender(
      <PerDrillCapture
        drillName="Bump Set Fundamentals"
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        streakLongest={3}
        onStreakLongestChange={noop}
      />,
    )
    expect(screen.queryByTestId('per-drill-streak-invalid')).not.toBeInTheDocument()
  })

  it('rehydrates the input text from streakLongest on mount', () => {
    render(
      <PerDrillCapture
        drillName="Bump Set Fundamentals"
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        streakLongest={5}
        onStreakLongestChange={noop}
      />,
    )

    fireEvent.click(screen.getByTestId('per-drill-add-streak'))
    const input = screen.getByTestId('per-drill-streak-input') as HTMLInputElement
    expect(input.value).toBe('5')
  })
})
