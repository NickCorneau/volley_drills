import type { DifficultyTag } from '../model'
import { validateStreakLongest } from '../domain/capture'
import { PassMetricInput } from './PassMetricInput'
import {
  ChoiceRow,
  type ChoiceRowOption,
  Disclosure,
  GlossInline,
  GlossReveal,
  NumberCell,
  useGloss,
} from './ui'

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
 *        drills. Renders the V0B-28 anti-generosity nudge above the
 *        inputs.
 *      - `'streak'` — single numeric input for the longest unbroken
 *        streak, behind a collapsed "Add longest streak (optional)"
 *        affordance. Used on `streak`-typed `main_skill` / `pressure`
 *        drills (D134, 2026-04-28). Carries no nudge because streak
 *        counting is intrinsically conservative — a missed contact ends
 *        the streak, so there is no honest interpretation of "If unsure,
 *        don't count it as Good." See `D134` row in `docs/decisions.md`.
 *      - `'none'` — no drawer; the chip row is the only capture
 *        surface. Used on Phase 2B-deferred drills (`points-to-target`,
 *        `pass-grade-avg`, `composite`, `completion`).
 *
 * **V0B-28 forced-criterion prompt (2026-04-27; T2-revised 2026-06-22)**:
 * the per-drill success rule is shown once, in the always-visible "You
 * aimed for: …" observable line above the difficulty chips (`<ObservableLine>`).
 * It is sourced from `variant.successMetric.description` via
 * `getBlockSuccessRule` and passed through `successRuleDescription`, so
 * it generalizes across pass / serve / set drills. The count drawer
 * adds only the anti-generosity nudge `If unsure, don't count it as
 * Good.` at the point of count entry — the `D104` layer-1 forcing
 * element. The rule text is NOT restated inside the drawers (T2 one-home
 * dedup; see docs/plans/2026-06-22-005-refactor-t2-duplicate-facts-plan.md
 * U7). Implements the first layer of the `D104` three-layer self-scoring
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
  difficulty: DifficultyTag | null
  onDifficultyChange: (next: DifficultyTag) => void
  /**
   * V0B-28 forced-criterion copy, sourced from
   * `variant.successMetric.description` via `getBlockSuccessRule`.
   * Optional so unit tests stay decoupled from the catalog. When
   * present, it renders once in the always-visible "You aimed for: …"
   * observable line above the chips and gates the count drawer's
   * anti-generosity nudge; when absent, both are omitted gracefully
   * (legacy drills).
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
  const { difficulty, onDifficultyChange, successRuleDescription } = props

  return (
    <section
      aria-labelledby="per-drill-heading"
      // T3 (2026-06-22 shibui audit): the bordered "form panel" chrome
      // (border + bg + padding) was removed so the capture surface reads
      // as a calm body inside the otherwise-empty Drill Check screen,
      // not a re-introduced card.
      className="flex flex-col gap-3"
      data-testid="per-drill-capture"
    >
      <div className="flex flex-col gap-1">
        {/*
          The "Drill check" eyebrow that previously sat here duplicated
          the eyebrow already rendered in `RunFlowHeader` at the top of
          `DrillCheckScreen` (two identical labels stacked a few rows
          apart). The screen header owns the section label; this card
          leads straight with its question heading.
        */}
        {/* T1 shibui (2026-06-22): the drill name already shows in the
            JustFinishedPill directly above (and the sr-only h1); "How was
            that?" drops the second in-screen repeat of the name. */}
        <h2 id="per-drill-heading" className="text-base font-semibold text-text-primary">
          How was that?
        </h2>
        {/*
          2026-05-10 first-time-runnability sweep R16
          (observe / reinforce / question template from Volleyball
          Canada Person Pillar Guidebook). Lead with the observable
          for the block — the measured behavior the drill aimed for —
          before the difficulty chips so the reader grades against an
          observable, not a vibe. The success rule description is
          sourced from `variant.successMetric.description` via the
          controller; absent for legacy drills, in which case the
          observable line is omitted gracefully.
        */}
        {successRuleDescription && (
          <ObservableLine successRuleDescription={successRuleDescription} />
        )}
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
 * V0B-28 anti-generosity nudge above (the success rule itself lives in
 * the always-visible observable line above the chips — T2 one-home).
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
        V0B-28 forced-criterion prompt (D104 layer-1): the anti-generosity
        nudge sits at the point of count entry. The success-rule text
        itself is NOT restated here — T2 (2026-06-22 shibui audit, one
        home per fact) made the always-visible "You aimed for: …"
        observable line above the chips the rule's single home, so the
        drawer kept only the count-only forcing nudge ("If unsure, don't
        count it as Good."). The streak branch drops the nudge entirely
        because streak counting is intrinsically conservative. See
        `docs/archive/plans/2026-04-27-per-drill-success-criterion.md`,
        the `D134` row in `docs/decisions.md`, and
        docs/plans/2026-06-22-005-refactor-t2-duplicate-facts-plan.md U7.
      */}
      {successRuleDescription && (
        <p
          className="text-sm font-medium text-text-primary"
          data-testid="per-drill-counts-nudge"
        >
          If unsure, don&rsquo;t count it as Good.
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
 * `Add longest streak (optional)`, expands to a single numeric input.
 * T2 (2026-06-22 shibui audit, one home per fact): the success rule is
 * not restated here — it lives once, in the always-visible "You aimed
 * for: …" observable line above the chips. The streak branch never
 * carried the anti-generosity nudge (streak counting is intrinsically
 * conservative — a missed contact ends the streak). Empty input commits
 * no row; invalid input shows inline correction text and does not
 * persist. Continue is never blocked by a blank or invalid streak — see
 * `useDrillCheckController.handleContinue`.
 */
function StreakDrawer({
  streakLongest,
  onStreakLongestChange,
}: {
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

/**
 * 2026-05-13 universalization: the "You aimed for: …" line uses
 * `<GlossInline>` so flagged terms in the success-rule description
 * (e.g. `Passes graded 2+ (= ball lands within 1 m …) across 24
 * tosses`) render as tappable dotted-underline buttons. The reveal
 * is rendered as a sibling `<div>` after the parent `<p>` (HTML
 * invariant — no `<p>` inside `<p>`), wrapped together inside the
 * existing `data-testid="per-drill-observable"` host so existing
 * test selectors keep resolving. T2 (2026-06-22): this is the single
 * home for the success rule — the drawers no longer restate it.
 */
function ObservableLine({
  successRuleDescription,
}: {
  successRuleDescription: string
}) {
  const { parts, openDefinition, isOpen, toggle } = useGloss(successRuleDescription)
  return (
    <div data-testid="per-drill-observable">
      <p className="text-sm text-text-secondary">
        You aimed for: <GlossInline parts={parts} isOpen={isOpen} onToggle={toggle} />
      </p>
      {openDefinition != null && <GlossReveal definition={openDefinition} />}
    </div>
  )
}

