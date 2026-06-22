import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('keeps the collapsed counts affordance at a comfortable tap height', () => {
    render(
      <PerDrillCapture
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

    expect(screen.getByTestId('per-drill-add-counts').className).toContain('min-h-[44px]')
  })

  it('reveals the Good/Total inputs after tapping "Add counts"', () => {
    render(
      <PerDrillCapture
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

  // 2026-04-27 V0B-28 (D104 layer-1 forced-criterion), T2-revised
  // 2026-06-22: the per-drill success rule shows once in the always-
  // visible "You aimed for: …" observable line above the chips; the
  // count drawer adds only the anti-generosity nudge at the point of
  // count entry. Rule sourced from the drill record's
  // `variant.successMetric.description` via `getBlockSuccessRule` on the
  // `DrillCheckScreen` wire-up. See
  // `docs/archive/plans/2026-04-27-per-drill-success-criterion.md`,
  // `docs/specs/m001-review-micro-spec.md` §Required line 78, and
  // docs/plans/2026-06-22-005-refactor-t2-duplicate-facts-plan.md U7.
  describe('V0B-28 forced-criterion prompt', () => {
    it('shows the rule once in the observable line and the count nudge in the drawer (no rule restated)', () => {
      render(
        <PerDrillCapture
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

      // The rule's single home: the observable line above the chips.
      const observable = screen.getByTestId('per-drill-observable')
      expect(observable).toHaveTextContent(
        /You aimed for: Serves or serve-toss contacts landing in or near a marked target circle\./,
      )

      fireEvent.click(screen.getByTestId('per-drill-add-counts'))
      // The drawer carries only the anti-generosity nudge...
      const nudge = screen.getByTestId('per-drill-counts-nudge')
      expect(nudge).toHaveTextContent(/^If unsure, don.t count it as Good\.$/)
      // ...and does NOT restate the rule (no "Success rule:" anywhere).
      expect(screen.queryByText(/Success rule:/)).not.toBeInTheDocument()
      expect(screen.queryByTestId('per-drill-success-rule')).not.toBeInTheDocument()
    })

    it('does not render the count nudge while the counts surface is collapsed', () => {
      render(
        <PerDrillCapture
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

      // The nudge lives inside the collapsed drawer; the rule itself
      // stays visible in the observable line above the chips.
      expect(screen.queryByTestId('per-drill-counts-nudge')).not.toBeInTheDocument()
      expect(screen.getByTestId('per-drill-observable')).toBeInTheDocument()
    })

    it('omits the rule and the nudge when successRuleDescription is undefined (defensive default)', () => {
      render(
        <PerDrillCapture
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

      // Legacy drills (no description): no observable line...
      expect(screen.queryByTestId('per-drill-observable')).not.toBeInTheDocument()
      fireEvent.click(screen.getByTestId('per-drill-add-counts'))
      expect(screen.getByTestId('per-drill-counts')).toBeInTheDocument()
      // ...and no nudge in the drawer.
      expect(screen.queryByTestId('per-drill-counts-nudge')).not.toBeInTheDocument()
    })

    it('shows the rule in the observable line but adds no drawer nudge on chip-only drills (captureShape: none)', () => {
      render(
        <PerDrillCapture
          difficulty="too_easy"
          onDifficultyChange={noop}
          captureShape={{ kind: 'none' }}
          successRuleDescription="Clean contacts in a row (restart on obvious mishit)."
        />,
      )

      expect(screen.getByTestId('per-drill-observable')).toHaveTextContent(
        /You aimed for: Clean contacts in a row \(restart on obvious mishit\)\./,
      )
      // No drawer, so no count nudge.
      expect(screen.queryByTestId('per-drill-counts-nudge')).not.toBeInTheDocument()
      expect(screen.queryByTestId('per-drill-add-counts')).not.toBeInTheDocument()
    })
  })
})

// D134 (2026-04-28): Phase 2A — optional streak capture for
// `streak`-typed `main_skill` / `pressure` drills. Drawer is collapsed
// by default behind `Add longest streak (optional)`; expanded body is a
// single numeric input. T2 (2026-06-22): the success rule is not
// restated in the drawer — it lives once in the observable line above
// the chips; the streak branch never carried the anti-generosity nudge.
// Continue is NEVER disabled by a blank or invalid streak (the
// controller-tier test pins that side of the contract); invalid input
// shows inline correction copy and persists nothing.
describe('PerDrillCapture captureShape: streak (Phase 2A — D134)', () => {
  it('starts with the streak drawer collapsed behind an "Add longest streak (optional)" affordance', () => {
    render(
      <PerDrillCapture
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

  it('keeps the collapsed streak affordance at a comfortable tap height', () => {
    render(
      <PerDrillCapture
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        streakLongest={null}
        onStreakLongestChange={noop}
      />,
    )

    expect(screen.getByTestId('per-drill-add-streak').className).toContain('min-h-[44px]')
  })

  it('reveals the streak input after tapping the affordance', () => {
    render(
      <PerDrillCapture
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

  it('shows the rule in the observable line and restates nothing (no rule, no nudge) in the streak drawer', () => {
    render(
      <PerDrillCapture
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        successRuleDescription="Clean contacts in a row before a mishit."
        streakLongest={null}
        onStreakLongestChange={noop}
      />,
    )

    // The rule's single home: the observable line above the chips.
    expect(screen.getByTestId('per-drill-observable')).toHaveTextContent(
      /You aimed for: Clean contacts in a row before a mishit\./,
    )

    fireEvent.click(screen.getByTestId('per-drill-add-streak'))
    const drawer = screen.getByTestId('per-drill-streak')
    // The streak drawer restates neither the rule nor a nudge.
    expect(within(drawer).queryByText(/Success rule:/)).not.toBeInTheDocument()
    expect(within(drawer).queryByText(/If unsure, don.t count it as Good/)).not.toBeInTheDocument()
    expect(screen.queryByTestId('per-drill-counts-nudge')).not.toBeInTheDocument()
  })

  it('input uses inputMode=numeric and pattern=[0-9]* for iOS number-pad', () => {
    render(
      <PerDrillCapture
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
    // Plan U10 (2026-05-04): the invalid message lives on `NumberCell`'s
    // `invalidMessage` prop instead of a per-caller test id; query by
    // text content directly.
    expect(
      screen.getByText(/Use a whole number\. This result will be skipped unless fixed\./),
    ).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows inline correction text and commits null when the value is out of range (>99)', () => {
    const onStreakLongestChange = vi.fn()
    render(
      <PerDrillCapture
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
    expect(
      screen.getByText(/Use a whole number\. This result will be skipped unless fixed\./),
    ).toBeInTheDocument()
  })

  it('clears the inline correction text once the value becomes valid', () => {
    const { rerender } = render(
      <PerDrillCapture
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
    expect(
      screen.getByText(/Use a whole number\. This result will be skipped unless fixed\./),
    ).toBeInTheDocument()

    rerender(
      <PerDrillCapture
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        streakLongest={3}
        onStreakLongestChange={noop}
      />,
    )
    expect(
      screen.queryByText(/Use a whole number\. This result will be skipped unless fixed\./),
    ).not.toBeInTheDocument()
  })

  it('rehydrates the input text from streakLongest on mount', () => {
    render(
      <PerDrillCapture
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

/**
 * 2026-05-13 universalization (T2-revised 2026-06-22): the GlossedText
 * affordance applies to PerDrillCapture's "You aimed for: …" observable
 * line — the single home for the success rule. Flagged terms inside
 * `successRuleDescription` render as dotted-underline tappable buttons;
 * tapping reveals a quiet `↳ definition` line beneath the parent `<p>`
 * (the reveal is a sibling element, NOT a `<p>` nested inside the parent
 * `<p>` — the `per-drill-observable` testid host is a `<div>` wrapper so
 * the HTML invariant holds). The drawers no longer restate the rule, so
 * gloss now lives only on the observable line.
 */
describe('PerDrillCapture inline gloss behavior (2026-05-13 universalization)', () => {
  const GLOSSED_RULE =
    'Passes graded 2+ (= ball lands within 1 m of the set window with enough arc to be settable) across 24 tosses.'

  it('renders flagged terms in the observable line as dotted-underline buttons', () => {
    render(
      <PerDrillCapture
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'none' }}
        successRuleDescription={GLOSSED_RULE}
      />,
    )

    const observable = screen.getByTestId('per-drill-observable')
    const term = within(observable).getByRole('button', { name: 'graded 2+' })
    expect(term).toBeInTheDocument()
    expect(term.className).toContain('border-dotted')
    expect(term.className).toContain('border-text-secondary/60')
    expect(term).toHaveAttribute('aria-expanded', 'false')
  })

  it('reveals the definition under the observable line when the term is tapped', async () => {
    const user = userEvent.setup()
    render(
      <PerDrillCapture
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'none' }}
        successRuleDescription={GLOSSED_RULE}
      />,
    )

    const observable = screen.getByTestId('per-drill-observable')
    expect(
      within(observable).queryByText(/ball lands within 1 m of the set window/),
    ).not.toBeInTheDocument()

    await user.click(within(observable).getByRole('button', { name: 'graded 2+' }))

    const reveal = within(observable).getByText(
      /ball lands within 1 m of the set window/,
    )
    expect(reveal).toBeInTheDocument()
    expect(reveal.textContent).toContain('↳')
  })

  it('renders flagged terms in the observable-line rule and keeps the count nudge in the drawer', async () => {
    const user = userEvent.setup()
    render(
      <PerDrillCapture
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'count' }}
        successRuleDescription={GLOSSED_RULE}
        goodPasses={0}
        attemptCount={0}
        notCaptured={false}
        onGoodChange={noop}
        onAttemptChange={noop}
        onToggleNotCaptured={noop}
      />,
    )

    // Gloss lives on the observable line (the rule's single home).
    const observable = screen.getByTestId('per-drill-observable')
    const term = within(observable).getByRole('button', { name: 'graded 2+' })
    await user.click(term)
    expect(
      within(observable).getByText(/ball lands within 1 m of the set window/),
    ).toBeInTheDocument()

    // The count drawer still carries the anti-generosity nudge.
    fireEvent.click(screen.getByTestId('per-drill-add-counts'))
    expect(screen.getByTestId('per-drill-counts-nudge')).toHaveTextContent(
      /If unsure, don.t count it as Good\./,
    )
  })

  it('renders flagged terms in the observable-line rule for streak drills, with no drawer rule or nudge', async () => {
    const user = userEvent.setup()
    render(
      <PerDrillCapture
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'streak' }}
        successRuleDescription={GLOSSED_RULE}
        streakLongest={null}
        onStreakLongestChange={noop}
      />,
    )

    // Gloss lives on the observable line (the rule's single home).
    const observable = screen.getByTestId('per-drill-observable')
    await user.click(within(observable).getByRole('button', { name: 'graded 2+' }))
    expect(
      within(observable).getByText(/ball lands within 1 m of the set window/),
    ).toBeInTheDocument()

    // The streak drawer restates neither the rule nor a nudge.
    fireEvent.click(screen.getByTestId('per-drill-add-streak'))
    const drawer = screen.getByTestId('per-drill-streak')
    expect(within(drawer).queryByText(/Success rule:/)).not.toBeInTheDocument()
    expect(screen.queryByTestId('per-drill-counts-nudge')).not.toBeInTheDocument()
  })

  it('does not render gloss buttons or reveal slots when the description has no `(= …)`', () => {
    render(
      <PerDrillCapture
        difficulty="still_learning"
        onDifficultyChange={noop}
        captureShape={{ kind: 'none' }}
        successRuleDescription="Clean contacts in a row before a mishit."
      />,
    )

    const observable = screen.getByTestId('per-drill-observable')
    expect(within(observable).queryByRole('button')).not.toBeInTheDocument()
    expect(observable.textContent).toContain('Clean contacts in a row before a mishit.')
  })
})
