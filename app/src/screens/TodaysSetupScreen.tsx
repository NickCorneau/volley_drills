import { SetupScreen } from './SetupScreen'

/**
 * C-3 Unit 3 thin wrapper - first-open "Today's Setup" is just the
 * existing `SetupScreen` in its onboarding posture:
 *
 * - No last-session prefill (there's no last session on first open).
 * - Back arrow returns to `/onboarding/skill-level`.
 * - Build writes `storageMeta.onboarding.completedAt` before routing to
 *   `/safety`; the `FirstOpenGate` then recognizes the tester as
 *   onboarded on subsequent opens.
 *
 * Keeping the two surfaces on one component (SetupScreen) avoids a
 * parallel maintenance burden - the safety-check handoff and
 * escape-to-onboarding logic are shared.
 */
export function TodaysSetupScreen() {
  return <SetupScreen isOnboarding />
}
