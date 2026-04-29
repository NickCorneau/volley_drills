import { useId, useState } from 'react'
import type { DifficultyTag } from '../db'
import { validateStreakLongest } from '../domain/capture'
import { PassMetricInput } from './PassMetricInput'

/**
 * Tier 1b D133 (2026-04-26): per-drill capture surface that lives on
 * the Drill Check screen (`/run/check`) after each completed main_skill
 * / pressure block. See `docs/specs/m001-review-micro-spec.md` §"Per-
 * drill capture at Drill Check (D133)" for the contract and
 * `docs/research/2026-04-26-pair-rep-capture-options.md` Framing D for
 * the design rationale.
 *
 * Two control families:
 *
 * 1. **Required** 3-anchor `Difficulty` chip row
 *    (`Too hard / Still learning / Too easy`). The Drill Check screen
 *    cannot advance until one chip is tapped. Vocabulary deliberately
 *    differs from the deleted session-level `QuickTagChips` so
 *    rehydration can never collapse a per-drill capture into the legacy
 *    session-level tag space — the middle anchor names a learning state,
 *    not an intensity rating.
 * 2. **Optional** capture drawer, shape-dependent on
 *    `captureShape.kind`:
 *
 *      - `'count'` — Good/Total counts via the existing
 *        `PassMetricInput`, behind a collapsed "Add counts (optional)"
 *        affordance. Used on `pass-rate-good` / `reps-successful`
 *        drills. Renders the V0B-28 forced-criterion prompt above the
 *        inputs.
 *      - `'streak'` — single numeric input for the longest unbroken
 *        streak, behind a collapsed "Add longest streak (optional)"
 *        affordance. Used on `streak`-typed `main_skill` / `pressure`
 *        drills (D134, 2026-04-28). Renders the success rule above
 *        the input but **drops the anti-generosity nudge** because
 *        streak counting is intrinsically conservative — a missed
 *        contact ends the streak, so there is no honest interpretation
 *        of "If unsure, don't count it as Good." See `D134` row in
 *        `docs/decisions.md`.
 *      - `'none'` — no drawer; the chip row is the only capture
 *        surface. Used on Phase 2B-deferred drills (`points-to-target`,
 *        `pass-grade-avg`, `composite`, `completion`).
 *
 * **V0B-28 forced-criterion prompt (2026-04-27)**: when the user opens
 * a drawer, render the per-drill success rule above the inputs as
 * `Success rule: <rule>.` plus, on the count branch only, the
 * anti-generosity nudge `If unsure, don't count it as Good.` The rule
 * is sourced from `variant.successMetric.description` via
 * `getBlockSuccessRule` and passed through `successRuleDescription`,
 * so the prompt generalizes across pass / serve / set drills.
 * Implements the first layer of the `D104` three-layer self-scoring
 * bias correction on the post-`D133` capture surface. See
 * `docs/plans/2026-04-27-per-drill-success-criterion.md` and
 * `docs/specs/m001-review-micro-spec.md` §Required line 78.
 */

const DIFFICULTY_CHIPS: { value: DifficultyTag; label: string }[] = [
  { value: 'too_hard', label: 'Too hard' },
  { value: 'still_learning', label: 'Still learning' },
  { value: 'too_easy', label: 'Too easy' },
]

/**
 * Discriminated prop union: the shape of the optional drawer is the
 * forcing function. A caller cannot pass count fields on a streak
 * drill, or vice versa, because each shape variant disjointly omits
 * the other shape's fields. The chip-only variant (`'none'`) declares
 * no drawer fields. Phase 2B `'points'` / `'grade'` shapes add new
 * disjoint variants without touching the existing arms.
 *
 * D134 (2026-04-28): `showCounts: boolean` was replaced with
 * `captureShape: CaptureShape` so the component shares its
 * discriminator with the metric-strategy registry and the controller
 * — one source of truth for "what shape do we render".
 */
type PerDrillCaptureCommonProps = {
  drillName: string
  difficulty: DifficultyTag | null
  onDifficultyChange: (next: DifficultyTag) => void
  /**
   * V0B-28 forced-criterion prompt copy, sourced from
   * `variant.successMetric.description` via `getBlockSuccessRule`.
   * Optional so unit tests stay decoupled from the catalog; when
   * absent, the criterion paragraph is omitted and the inputs render
   * unchanged. Only renders inside an expanded drawer.
   */
  successRuleDescription?: string
}

type PerDrillCaptureCountProps = {
  captureShape: { kind: 'count' }
  goodPasses: number
  attemptCount: number
  notCaptured: boolean
  onGoodChange: (next: number) => void
  onAttemptChange: (next: number) => void
  onToggleNotCaptured: () => void
}

type PerDrillCaptureStreakProps = {
  captureShape: { kind: 'streak' }
  /**
   * Persisted streak value, or `null` when the tester has not committed
   * one. The component manages its own local text state so the user can
   * type freely (empty string, partial digits) without the parent's
   * value re-rendering mid-edit; on blur it parses the text, validates
   * via `validateStreakLongest`, and calls `onStreakLongestChange` with
   * the integer or `null`.
   */
  streakLongest: number | null
  onStreakLongestChange: (next: number | null) => void
}

type PerDrillCaptureNoneProps = {
  captureShape: { kind: 'none' }
}

type PerDrillCaptureProps = PerDrillCaptureCommonProps &
  (PerDrillCaptureCountProps | PerDrillCaptureStreakProps | PerDrillCaptureNoneProps)

export function PerDrillCapture(props: PerDrillCaptureProps) {
  const { drillName, difficulty, onDifficultyChange, successRuleDescription } = props

  return (
    <section
      aria-labelledby="per-drill-heading"
      className="flex flex-col gap-3 rounded-[12px] border border-text-secondary/15 bg-bg-primary p-4"
      data-testid="per-drill-capture"
    >
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Quick tag</p>
        <h2 id="per-drill-heading" className="text-sm font-semibold text-text-primary">
          How was {drillName}?
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby="per-drill-heading">
        {DIFFICULTY_CHIPS.map((chip) => {
          const selected = difficulty === chip.value
          return (
            <button
              key={chip.value}
              type="button"
              role="radio"
              aria-checked={selected}
              data-difficulty={chip.value}
              onClick={() => onDifficultyChange(chip.value)}
              className={[
                'flex min-h-[54px] items-center justify-center rounded-[12px] px-2 py-2 text-center transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                selected
                  ? 'bg-accent text-white hover:bg-accent-pressed active:bg-accent-pressed'
                  : 'border border-text-secondary/25 bg-bg-primary text-text-primary hover:brightness-95 active:brightness-90',
              ].join(' ')}
            >
              <span className="text-sm font-semibold leading-tight">{chip.label}</span>
            </button>
          )
        })}
      </div>

      {renderDrawer(props, successRuleDescription)}
    </section>
  )
}

/**
 * Narrowing helper. The discriminator (`captureShape.kind`) sits one
 * level deep on each union arm, and TypeScript's narrowing across an
 * intersection-of-union (`Common & (A | B | C)`) does not always
 * propagate the nested-kind check back out to sibling fields like
 * `goodPasses` / `streakLongest`. Bridging through dedicated
 * `is*Props` predicates keeps each branch typed against the exact
 * variant, so the surrounding component stays readable while the
 * compiler still sees an exhaustive switch on `kind`. See
 * https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates.
 */
function isCountProps(
  props: PerDrillCaptureProps,
): props is PerDrillCaptureCommonProps & PerDrillCaptureCountProps {
  return props.captureShape.kind === 'count'
}

function isStreakProps(
  props: PerDrillCaptureProps,
): props is PerDrillCaptureCommonProps & PerDrillCaptureStreakProps {
  return props.captureShape.kind === 'streak'
}

function renderDrawer(props: PerDrillCaptureProps, successRuleDescription: string | undefined) {
  if (isCountProps(props)) {
    return (
      <CountDrawer
        successRuleDescription={successRuleDescription}
        goodPasses={props.goodPasses}
        attemptCount={props.attemptCount}
        notCaptured={props.notCaptured}
        onGoodChange={props.onGoodChange}
        onAttemptChange={props.onAttemptChange}
        onToggleNotCaptured={props.onToggleNotCaptured}
      />
    )
  }
  if (isStreakProps(props)) {
    return (
      <StreakDrawer
        successRuleDescription={successRuleDescription}
        streakLongest={props.streakLongest}
        onStreakLongestChange={props.onStreakLongestChange}
      />
    )
  }
  return null
}

/**
 * Count-drawer: collapsed-by-default behind `Add counts (optional)`,
 * expands to the legacy `PassMetricInput` Good/Total cells with the
 * V0B-28 forced-criterion prompt + anti-generosity nudge above.
 */
function CountDrawer({
  successRuleDescription,
  goodPasses,
  attemptCount,
  notCaptured,
  onGoodChange,
  onAttemptChange,
  onToggleNotCaptured,
}: {
  successRuleDescription: string | undefined
  goodPasses: number
  attemptCount: number
  notCaptured: boolean
  onGoodChange: (next: number) => void
  onAttemptChange: (next: number) => void
  onToggleNotCaptured: () => void
}) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="self-start text-sm font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        data-testid="per-drill-add-counts"
      >
        Add counts (optional)
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3" data-testid="per-drill-counts">
      <p className="text-sm text-text-secondary">
        <span className="font-medium text-text-primary">Counts</span>{' '}
        <span className="font-normal">(optional)</span>
      </p>
      {/*
        V0B-28 forced-criterion prompt (D104 layer-1). Voice mirrors
        the legacy `ReviewScreen` fallback path so the rule reads as
        one rule across the codebase, but the criterion text is now
        sourced from the drill record (`variant.successMetric.description`)
        instead of being hard-coded for passing. The anti-generosity
        nudge ("If unsure, don't count it as Good.") is the count-only
        layer-1 correction; the streak branch below intentionally
        drops it because streak counting is intrinsically conservative.
        See `docs/plans/2026-04-27-per-drill-success-criterion.md`
        and the `D134` row in `docs/decisions.md`.
      */}
      {successRuleDescription && (
        <p className="text-sm text-text-secondary" data-testid="per-drill-success-rule">
          <span className="font-medium text-text-primary">Success rule:</span>{' '}
          {successRuleDescription}{' '}
          <span className="font-medium text-text-primary">
            If unsure, don&rsquo;t count it as Good.
          </span>
        </p>
      )}
      <PassMetricInput
        good={goodPasses}
        total={attemptCount}
        onGoodChange={onGoodChange}
        onTotalChange={onAttemptChange}
        notCaptured={notCaptured}
        onToggleNotCaptured={onToggleNotCaptured}
      />
    </div>
  )
}

/**
 * Streak drawer (D134, 2026-04-28): collapsed-by-default behind
 * `Add longest streak (optional)`, expands to a single numeric input
 * with the success rule above (no anti-generosity nudge — see the
 * comment in `CountDrawer`). Empty input commits no row; invalid
 * input shows inline correction text and does not persist. Continue
 * is never blocked by a blank or invalid streak — see
 * `useDrillCheckController.handleContinue`.
 */
function StreakDrawer({
  successRuleDescription,
  streakLongest,
  onStreakLongestChange,
}: {
  successRuleDescription: string | undefined
  streakLongest: number | null
  onStreakLongestChange: (next: number | null) => void
}) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="self-start text-sm font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        data-testid="per-drill-add-streak"
      >
        Add longest streak (optional)
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3" data-testid="per-drill-streak">
      <p className="text-sm text-text-secondary">
        <span className="font-medium text-text-primary">Streak</span>{' '}
        <span className="font-normal">(optional)</span>
      </p>
      {/*
        V0B-28 forced-criterion prompt on the streak branch, with the
        anti-generosity clause dropped per `D134` rationale: streak
        counting is intrinsically conservative (a missed contact ends
        the streak) so applying the count-drill anxiety here would
        import nuance the input does not actually need.
      */}
      {successRuleDescription && (
        <p className="text-sm text-text-secondary" data-testid="per-drill-success-rule">
          <span className="font-medium text-text-primary">Success rule:</span>{' '}
          {successRuleDescription}
        </p>
      )}
      <StreakInput
        streakLongest={streakLongest}
        onStreakLongestChange={onStreakLongestChange}
      />
    </div>
  )
}

/**
 * Streak input: tap-to-type single integer cell. Mirrors `NumberCell`
 * in `PassMetricInput.tsx` so the keyboard / commit / sync behavior
 * reads the same across both capture surfaces. Empty input commits
 * `null` (no row written). Invalid input (non-integer, out of range)
 * shows inline correction text and commits `null` so the controller
 * does not persist a streak row, while leaving the typed text visible
 * so the user can fix it. The 0..99 range comes from
 * `validateStreakLongest`.
 */
function StreakInput({
  streakLongest,
  onStreakLongestChange,
}: {
  streakLongest: number | null
  onStreakLongestChange: (next: number | null) => void
}) {
  const id = useId()
  const helperId = useId()
  const errorId = useId()

  const [text, setText] = useState(() =>
    streakLongest === null ? '' : String(streakLongest),
  )
  const [showInvalid, setShowInvalid] = useState(false)

  // React "adjust state during render" pattern for syncing local text
  // when the parent's controlled value changes (rehydration, swap, etc).
  // Tracking a snapshot of the prop and reacting to changes during
  // render — instead of inside `useEffect` — avoids the cascading-render
  // warning while preserving the rule that a user typing locally is not
  // wiped by a parent re-render that still reports `null`. The reset
  // only fires when the parent's value materially changed AND landed on
  // a meaningful integer; a parent clear (`null`) leaves the local
  // text untouched so a partially-typed draft survives.
  // See https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [streakLongestSnapshot, setStreakLongestSnapshot] = useState(streakLongest)
  if (streakLongest !== streakLongestSnapshot) {
    setStreakLongestSnapshot(streakLongest)
    if (streakLongest !== null) {
      setText(String(streakLongest))
      setShowInvalid(false)
    }
  }

  const commit = () => {
    const trimmed = text.trim()
    if (trimmed === '') {
      onStreakLongestChange(null)
      setShowInvalid(false)
      return
    }
    // Reject non-integer-shaped strings up front (e.g. `1.5`, `-3`,
    // `5e2`, `5px`). `parseInt` would silently truncate `1.5` to `1`,
    // hiding the input mistake — the streak surface promises whole
    // numbers, so we surface the correction text instead. The numeric
    // range / integer-domain check still goes through the pure
    // `validateStreakLongest` helper for parity with the controller's
    // hydration path.
    if (!/^\d+$/.test(trimmed)) {
      onStreakLongestChange(null)
      setShowInvalid(true)
      return
    }
    const parsed = Number.parseInt(trimmed, 10)
    const validated = validateStreakLongest(parsed)
    if (validated === null) {
      onStreakLongestChange(null)
      setShowInvalid(true)
      return
    }
    setShowInvalid(false)
    onStreakLongestChange(validated)
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        Longest streak
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={text}
        placeholder="0"
        aria-describedby={`${helperId} ${showInvalid ? errorId : ''}`.trim()}
        aria-invalid={showInvalid}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            ;(e.target as HTMLInputElement).blur()
          }
        }}
        className="h-16 w-28 rounded-[12px] border-2 border-text-primary/20 bg-bg-primary text-center text-3xl font-bold tabular-nums text-text-primary placeholder:text-text-primary/30 focus-visible:border-accent focus-visible:outline-none"
        data-testid="per-drill-streak-input"
      />
      {showInvalid && (
        <p
          id={errorId}
          className="text-sm text-text-secondary"
          data-testid="per-drill-streak-invalid"
        >
          Use a whole number. This result will be skipped unless fixed.
        </p>
      )}
      <p id={helperId} className="text-sm text-text-secondary">
        If you counted, enter your best unbroken streak. Leave blank if unsure.
      </p>
    </div>
  )
}
