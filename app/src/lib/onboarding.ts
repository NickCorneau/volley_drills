/**
 * Onboarding resume-step semantics (C-3).
 *
 * Persisted to `storageMeta.onboarding.step` on every tap so a closed-tab
 * or schema-blocked-reload scenario returns the tester to the same screen.
 * Onboarding is considered complete once `storageMeta.onboarding.completedAt`
 * is set (written by `TodaysSetupScreen`'s Build handler); after that the
 * `step` key is informational only.
 *
 * The two values match the onboarding route path suffixes so the
 * `FirstOpenGate` can map step -> path without a separate table.
 */

export type OnboardingStep = 'skill_level' | 'todays_setup'

export function isOnboardingStep(value: unknown): value is OnboardingStep {
  return value === 'skill_level' || value === 'todays_setup'
}
