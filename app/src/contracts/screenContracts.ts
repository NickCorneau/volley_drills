/**
 * P12 screen contract registry.
 *
 * Encodes `docs/vision.md` P12 — "one clear action, one confidence
 * signal, one reason to come back" — for every route the app
 * exposes. Centralizing the registry (vs. exporting one contract per
 * screen file) keeps the entire app's P12 posture readable in a
 * single file and makes review-by-future-agents one read instead of
 * twelve. TypeScript exhaustiveness across `routePaths` keys
 * guarantees no route ships without an explicit contract or
 * exemption (see `__tests__/screenContracts.test.ts`).
 *
 * Layer rule: this module owns the P12 product contract. Screens
 * render. Contracts live here. Tests in
 * `app/src/contracts/__tests__/` enforce the boundary.
 */
import type { routePaths } from '../routes'
import {
  type ScreenContract,
  defineScreenContract,
  exemptScreenContract,
} from './screen'

/**
 * Every key from `routePaths` MUST appear in this registry. If a
 * future agent adds a new route, the `Record` keyword forces the
 * compiler to demand a corresponding contract here.
 */
export type RouteKey = keyof typeof routePaths

export const SCREEN_CONTRACTS: Record<RouteKey, ScreenContract> = {
  home: defineScreenContract({
    route: '/',
    screen: 'Home',
    action: 'Start (or resume) today\'s session.',
    signal: 'A primary card showing the most-recent finished session, any pending review, and tomorrow\'s next step.',
    reason: 'One-tap re-entry into the courtside loop, including pending-review nudges per `D130`.',
  }),
  setup: defineScreenContract({
    route: '/setup',
    screen: 'Setup',
    action: 'Lock in today\'s session shape — minutes, mode, environment.',
    signal: 'A live preview of the planned blocks for the chosen profile.',
    reason: 'Confidence that the next 25 / 45 minutes will be productive before tapping Start.',
  }),
  safety: defineScreenContract({
    route: '/safety',
    screen: 'SafetyCheck',
    action: 'Confirm pain / fatigue / heat status before training.',
    signal: 'Recency chips, heat CTA, and pain banner reflecting today\'s state.',
    reason: 'Per `D129`, a fast safety beat that protects the player so the loop stays trustworthy.',
  }),
  run: defineScreenContract({
    route: '/run',
    screen: 'Run',
    action: 'Run the current block — pause / resume / shorten / swap / next / skip.',
    signal: 'Active timer, sub-block ticks, wake-lock state, and current block briefing.',
    reason: 'P1 courtside friction is minimized — one clear control surface for the working block.',
  }),
  drillCheck: defineScreenContract({
    route: '/run/check',
    screen: 'DrillCheck',
    action: 'Tag difficulty (and counts when the metric supports it) for the just-finished block.',
    signal: 'Difficulty chip + optional good/total counters reflecting the captured state.',
    reason: 'Single reflective beat per drill so review and adaptation have signal worth keeping.',
  }),
  transition: defineScreenContract({
    route: '/run/transition',
    screen: 'Transition',
    action: 'Start the next block (or skip / swap it).',
    signal: 'Next-drill briefing with role eyebrow and previous-drill recap.',
    reason: 'A single-purpose hand-off between blocks so the run controls stay calm.',
  }),
  review: defineScreenContract({
    route: '/review',
    screen: 'Review',
    action: 'Submit (or Finish Later) the session review with RPE, captures, and an optional note.',
    signal: 'Per-drill aggregate, RPE chip, capture-window banner.',
    reason: 'Closes the loop on this session and keeps the adaptation engine\'s signal fresh.',
  }),
  complete: defineScreenContract({
    route: '/complete',
    screen: 'Complete',
    action: 'Acknowledge the session is done and return to Home.',
    signal: 'Session-summary tally, capture aggregate, streak / cohort signal.',
    reason: 'A small win-state moment that pulls the user back tomorrow.',
  }),
  settings: exemptScreenContract({
    route: '/settings',
    screen: 'Settings',
    rationale:
      'Settings is multi-purpose founder/founder-mode tooling (export, replay, build info). It deliberately surfaces several actions and is reviewed against `docs/vision.md` P14, not P12.',
    trackedIn: 'docs/plans/2026-04-26-app-architecture-pass.md (U7)',
  }),
  onboardingSkillLevel: defineScreenContract({
    route: '/onboarding/skill-level',
    screen: 'SkillLevel',
    action: 'Choose the player\'s starting skill level.',
    signal: 'Highlighted skill-level option with a short description.',
    reason: 'Sets the trajectory for the first session\'s difficulty so the app earns trust on day one.',
  }),
  onboardingTodaysSetup: defineScreenContract({
    route: '/onboarding/todays-setup',
    screen: 'TodaysSetup',
    action: 'Lock in the first session\'s setup before launching Run.',
    signal: 'Inline preview of the chosen onboarding setup.',
    reason: 'Funnels onboarding into a real session so the next return is to Home, not Setup.',
  }),
}
