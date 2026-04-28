import { routes } from '../../routes'

/**
 * Post-block routing policy.
 *
 * After a Run-side block ends — either naturally (timer complete),
 * via the Next button, or via Skip from Run/Transition — the
 * post-block routing decision is identical:
 *
 *   - If the just-finished block was the LAST in the plan, replace
 *     the route with `/review`.
 *   - Otherwise, push `/run/check` so the user lands on Drill Check
 *     for the just-finished block.
 *
 * That decision is pure product policy and used to be inlined in
 * three places inside `useRunController` and once in
 * `useTransitionController.handleSkip`. U5 hoists it into this small
 * domain module so:
 *
 *   1. The "where do I go after a block finishes?" rule has a single
 *      home, easy for future agents to find and change.
 *   2. The Run, DrillCheck, and Transition controllers stay thin —
 *      their job is wiring, not deciding the next route.
 *   3. Tests can pin the policy directly without spinning up a
 *      `react-router` test harness.
 *
 * Pure: the policy never reads or writes anything; callers feed it
 * the runtime answer for `isLast` and apply the returned descriptor
 * via `navigate(path, { replace })`.
 */
export type PostBlockRoute = {
  path: string
  /** Whether the navigation should `replace` the current history entry. */
  replace: boolean
}

export function postBlockRoute(executionLogId: string, isLast: boolean): PostBlockRoute {
  if (isLast) {
    return { path: routes.review(executionLogId), replace: true }
  }
  return { path: routes.drillCheck(executionLogId), replace: false }
}
