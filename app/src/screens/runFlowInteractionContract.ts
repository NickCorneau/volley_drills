export type RunFlowInteractionId =
  | 'run.preroll'
  | 'run.wake_lock_hint'
  | 'run.pause_settling_modal'
  | 'run.persistence_error'
  | 'run.skip_route'
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
    invariant: 'New planned blocks enter a preroll before the timer starts and hide the phone-unlocked hint after first completion.',
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
    invariant: 'End-session cancel keeps the modal up while the pause write settles, then resumes if the block had been running.',
    coveredBy: ['useRunController.test.tsx'],
  },
  {
    id: 'run.persistence_error',
    surface: 'run',
    invariant: 'Run persistence failures show an actionable footer error instead of silently advancing state.',
    coveredBy: ['useSessionRunner.test.ts'],
  },
  {
    id: 'run.skip_route',
    surface: 'run',
    invariant: 'Run Next/Skip routes through Drill Check for non-terminal blocks so bypass logic stays centralized.',
    expectedRoute: 'drill_check',
    coveredBy: ['useRunController.test.tsx', 'DrillCheckScreen.perDrillCapture.test.tsx'],
  },
  {
    id: 'run.swap_error',
    surface: 'run',
    invariant: 'Swap is only exposed when alternates exist; a failed swap reports a no-alternates or retryable error.',
    coveredBy: ['RunControls.swap.test.tsx', 'useRunController.test.tsx'],
  },
  {
    id: 'drill_check.disabled_continue_hint',
    surface: 'drill_check',
    invariant: 'Continue stays disabled with a visible hint until the required difficulty chip is selected.',
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
    invariant: 'Ineligible blocks render loading while replace-routing to Transition or Review, never an empty capture body.',
    expectedRoute: 'transition',
    coveredBy: ['DrillCheckScreen.perDrillCapture.test.tsx'],
  },
  {
    id: 'transition.skip_route',
    surface: 'transition',
    invariant: 'Transition skip handles last-block review routing and non-terminal block advancement without surfacing Run controls.',
    expectedRoute: 'review',
    coveredBy: ['TransitionScreen.controller.test.tsx', 'useSessionRunner.test.ts'],
  },
  {
    id: 'transition.swap_error',
    surface: 'transition',
    invariant: 'Pre-start swap reports a no-alternates or retryable error while keeping the tester on Transition.',
    coveredBy: ['TransitionScreen.controller.test.tsx'],
  },
  {
    id: 'review.disabled_submit_hint',
    surface: 'review',
    invariant: 'Submit is disabled with an explicit missing-field hint until required review fields are present.',
    coveredBy: ['ReviewScreen.perDrillAggregate.test.tsx'],
  },
  {
    id: 'review.finish_later_persistence',
    surface: 'review',
    invariant: 'Finish Later preserves existing per-drill captures and meaningful review draft fields.',
    coveredBy: ['ReviewScreen.perDrillAggregate.test.tsx'],
  },
  {
    id: 'review.route_outcomes',
    surface: 'review',
    invariant: 'Submit, conflict, expired, discarded-resume, and missing-session outcomes route without data loss.',
    expectedRoute: 'complete',
    coveredBy: ['ReviewScreen.perDrillAggregate.test.tsx', 'useSessionRunner.test.ts'],
  },
] as const
