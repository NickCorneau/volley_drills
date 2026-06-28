import { Navigate, useSearchParams } from 'react-router-dom'
import { routes } from '../routes'

/**
 * Run-flow beat contract Stage 4 (D167, R14): the forced Transition
 * decide-step collapsed into RunScreen's read-first get-ready beat, so
 * `/run/transition` no longer has a place in the flow (`routes.transition()`
 * has zero call sites). This redirect keeps the route reversible and
 * deep-link safe: a stale `/run/transition?id=…` bookmark now `replace`s
 * straight to the live `/run` get-ready instead of re-rendering the
 * standalone Transition read (which would double the setup read + receipt
 * one tap before the get-ready shows them again).
 *
 * The full `TransitionScreen` component + its controller and tests are
 * retained on disk for rollback — swap this element back to
 * `<TransitionScreen />` in `App.tsx` to restore the standalone beat.
 *
 * No `id` → home, mirroring the screens' "session not found" fallback
 * rather than routing to a `/run` with no execution to load.
 */
export function TransitionRedirect() {
  const [searchParams] = useSearchParams()
  const executionLogId = searchParams.get('id')
  return <Navigate to={executionLogId ? routes.run(executionLogId) : routes.home()} replace />
}
