/**
 * Run-flow interaction contract — TRANSITIONAL characterization spec.
 *
 * Status: TRANSITIONAL (U7 of the architecture pass).
 *
 * Origin: this registry was introduced before the controllers were
 * extracted out of the screen files. It captured the run-flow
 * invariants the controllers had to preserve mid-refactor so red
 * tests never lost their anchor. Today, with controllers, the
 * `postBlockRoute` policy, and the P12 screen contracts in place,
 * many of these rows have a real structural home: the route policy
 * lives in `domain/runFlow/`, the screen-level contract lives in
 * `contracts/screenContracts.ts`, and the actual behavior is pinned
 * by hooks/component tests. The registry stays for now as a
 * **characterization** of legacy expectations that are still load-
 * bearing in case any of those structural homes regresses.
 *
 * Sunset rule (U7):
 *   A row retires from the active set into `SUNSET_RUN_FLOW_CONTRACT`
 *   when ALL of the following hold:
 *     1. The invariant has a structural home — a P12 screen contract
 *        (`screenContracts.ts`), a domain policy (e.g.
 *        `domain/runFlow/postBlockRoute`), or a typed model rule.
 *     2. At least one screen-level red test guards the structural
 *        home.
 *     3. The migration is recorded in the sunset block below with the
 *        new home so future agents can trace where the invariant
 *        moved.
 *
 *   Active-row count MUST decrease over time. The U7 baseline drop is
 *   `run.skip_route` — the post-block routing rule now lives in
 *   `app/src/domain/runFlow/postBlockRoute.ts` with its own pure unit
 *   suite; the wiring is still asserted by `useRunController` tests.
 *
 * Layer rule: pure data module. No imports from screens / services /
 * Dexie / React. The test that audits this registry lives at
 * `__tests__/runFlowInteractionContract.test.ts`.
 */
export type RunFlowInteractionId =
  | 'run.preroll'
  | 'run.wake_lock_hint'
  | 'run.pause_settling_modal'
  | 'run.persistence_error'
  | 'run.swap_error'
  | 'drill_check.disabled_continue_hint'
  | 'drill_check.save_pending'
  | 'drill_check.save_error'
  | 'drill_check.bypass_without_flicker'
  | 'transition.skip_route'
  | 'transition.swap_error'
  | 'review.disabled_submit_hint'
  | 'review.finish_later_persistence'
  | 'review.route_outcomes'

export type RunFlowInteractionContract = {
  id: RunFlowInteractionId
  surface: 'run' | 'drill_check' | 'transition' | 'review'
  invariant: string
  expectedRoute?: 'run' | 'drill_check' | 'transition' | 'review' | 'complete' | 'home'
  coveredBy: readonly string[]
}

export const RUN_FLOW_INTERACTION_CONTRACT: readonly RunFlowInteractionContract[] = [
  {
    id: 'run.preroll',
    surface: 'run',
    invariant:
      'New planned blocks enter a preroll before the timer starts and hide the phone-unlocked hint after first completion.',
    coveredBy: ['RunScreen.preroll-hint.test.tsx'],
  },
  {
    id: 'run.wake_lock_hint',
    surface: 'run',
    invariant: 'A running timer without an active wake lock keeps the courtside warning visible.',
    coveredBy: ['RunScreen.preroll-hint.test.tsx'],
  },
  {
    id: 'run.pause_settling_modal',
    surface: 'run',
    invariant:
      'End-session cancel keeps the modal up while the pause write settles, then resumes if the block had been running.',
    coveredBy: ['useRunController.test.tsx'],
  },
  {
    id: 'run.persistence_error',
    surface: 'run',
    invariant:
      'Run persistence failures show an actionable footer error instead of silently advancing state.',
    coveredBy: ['useSessionRunner.test.ts'],
  },
  {
    id: 'run.swap_error',
    surface: 'run',
    invariant:
      'Swap is only exposed when alternates exist; a failed swap reports a no-alternates or retryable error.',
    coveredBy: ['RunControls.swap.test.tsx', 'useRunController.test.tsx'],
  },
  {
    id: 'drill_check.disabled_continue_hint',
    surface: 'drill_check',
    invariant:
      'Continue stays disabled with a visible hint until the required difficulty chip is selected.',
    coveredBy: ['DrillCheckScreen.perDrillCapture.test.tsx'],
  },
  {
    id: 'drill_check.save_pending',
    surface: 'drill_check',
    invariant: 'Continue waits for any in-flight capture save before routing forward.',
    expectedRoute: 'transition',
    coveredBy: ['DrillCheckScreen.perDrillCapture.test.tsx'],
  },
  {
    id: 'drill_check.save_error',
    surface: 'drill_check',
    invariant: 'Capture save failures keep the tester on Drill Check and show a retryable error.',
    coveredBy: ['DrillCheckScreen.perDrillCapture.test.tsx'],
  },
  {
    id: 'drill_check.bypass_without_flicker',
    surface: 'drill_check',
    invariant:
      'Ineligible blocks render loading while replace-routing to Transition or Review, never an empty capture body.',
    expectedRoute: 'transition',
    coveredBy: ['DrillCheckScreen.perDrillCapture.test.tsx'],
  },
  {
    id: 'transition.skip_route',
    surface: 'transition',
    invariant:
      'Transition skip handles last-block review routing and non-terminal block advancement without surfacing Run controls.',
    expectedRoute: 'review',
    coveredBy: ['TransitionScreen.controller.test.tsx', 'useSessionRunner.test.ts'],
  },
  {
    id: 'transition.swap_error',
    surface: 'transition',
    invariant:
      'Pre-start swap reports a no-alternates or retryable error while keeping the tester on Transition.',
    coveredBy: ['TransitionScreen.controller.test.tsx'],
  },
  {
    id: 'review.disabled_submit_hint',
    surface: 'review',
    invariant:
      'Submit is disabled with an explicit missing-field hint until required review fields are present.',
    coveredBy: ['ReviewScreen.perDrillAggregate.test.tsx'],
  },
  {
    id: 'review.finish_later_persistence',
    surface: 'review',
    invariant:
      'Finish Later preserves existing per-drill captures and meaningful review draft fields.',
    coveredBy: ['ReviewScreen.perDrillAggregate.test.tsx'],
  },
  {
    id: 'review.route_outcomes',
    surface: 'review',
    invariant:
      'Submit, conflict, expired, discarded-resume, and missing-session outcomes route without data loss.',
    expectedRoute: 'complete',
    coveredBy: ['ReviewScreen.perDrillAggregate.test.tsx', 'useSessionRunner.test.ts'],
  },
] as const

/**
 * Sunset entries — invariants that have moved to a structural home.
 *
 * Each entry retains the historical id, the original invariant, and a
 * pointer to where the invariant now lives. Tests assert that the
 * historical id is NO LONGER present in `RUN_FLOW_INTERACTION_CONTRACT`
 * so the registry length strictly decreases.
 */
export type SunsetRunFlowEntry = {
  id: string
  retiredOn: string
  originalInvariant: string
  movedTo: {
    structuralHome: string
    coveredBy: readonly string[]
  }
}

export const SUNSET_RUN_FLOW_CONTRACT: readonly SunsetRunFlowEntry[] = [
  {
    id: 'run.skip_route',
    retiredOn: '2026-04-28',
    originalInvariant:
      'Run Next/Skip routes through Drill Check for non-terminal blocks so bypass logic stays centralized.',
    movedTo: {
      structuralHome:
        'app/src/domain/runFlow/postBlockRoute.ts — pure policy returns `{ path, replace }` for terminal vs non-terminal block ends.',
      coveredBy: [
        'postBlockRoute.test.ts',
        'useRunController.test.tsx',
        'DrillCheckScreen.perDrillCapture.test.tsx',
      ],
    },
  },
] as const
