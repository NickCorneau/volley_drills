import type { DifficultyTag } from '../model'
import { validateStreakLongest } from '../domain/capture'
import { PassMetricInput } from './PassMetricInput'
import { ChoiceRow, type ChoiceRowOption, Disclosure, NumberCell } from './ui'

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
 * `docs/archive/plans/2026-04-27-per-drill-success-criterion.md` and
 * `docs/specs/m001-review-micro-spec.md` §Required line 78.
 */

const DIFFICULTY_CHIPS: readonly ChoiceRowOption<DifficultyTag>[] = [
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
        <p className="text-xs font-medium text-text-secondary">Drill check</p>
        <h2 id="per-drill-heading" className="text-base font-semibold text-text-primary">
          How was {drillName}?
        </h2>
      </div>

      <ChoiceRow<DifficultyTag>
        value={difficulty}
        onChange={onDifficultyChange}
        options={DIFFICULTY_CHIPS}
        layout="grid-3"
        ariaLabelledBy="per-drill-heading"
      />

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
  return (
    <Disclosure label="Add counts (optional)" testId="per-drill-add-counts">
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
        See `docs/archive/plans/2026-04-27-per-drill-success-criterion.md`
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
    </Disclosure>
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
  return (
    <Disclosure label="Add longest streak (optional)" testId="per-drill-add-streak">
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
        <StreakInput streakLongest={streakLongest} onStreakLongestChange={onStreakLongestChange} />
      </div>
    </Disclosure>
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
/**
 * Plan U10 (2026-05-04): the streak cell is a thin caller of `NumberCell`
 * with `validate={validateStreakLongest}` for the 0..99 integer range
 * check and `invalidMessage` carrying the existing correction copy.
 * The empty-zero rule, blur/Enter commit, and `aria-invalid` /
 * `aria-describedby` wiring all live on `NumberCell` now.
 *
 * NumberCell's onCommit returns `number | null`; the streak parent's
 * `onStreakLongestChange` already accepts that signature, so the call
 * passes through directly. NumberCell's internal `value` prop is `number`
 * (not nullable), so we map `null → 0` for the rendered display state —
 * `valueToDisplayText(0) === ''` keeps the empty placeholder showing.
 */
function StreakInput({
  streakLongest,
  onStreakLongestChange,
}: {
  streakLongest: number | null
  onStreakLongestChange: (next: number | null) => void
}) {
  return (
    <NumberCell
      label="Longest streak"
      value={streakLongest ?? 0}
      onCommit={onStreakLongestChange}
      validate={validateStreakLongest}
      invalidMessage="Use a whole number. This result will be skipped unless fixed."
      helperText="If you counted, enter your best unbroken streak. Leave blank if unsure."
      testId="per-drill-streak-input"
      // The streak input historically left-aligned its label / helper text
      // (`items-start`) while PassMetricInput's cells centered theirs
      // (`items-center`). NumberCell's default is `items-center`; the
      // helper text below the input renders centered which reads fine
      // courtside. Drop the items-start divergence on extraction.
    />
  )
}
