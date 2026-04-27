export const routePaths = {
  home: '/',
  setup: '/setup',
  safety: '/safety',
  run: '/run',
  /**
   * 2026-04-27 plan Item 9: dedicated reflective beat between Run and
   * Transition. The just-finished drill's chip + optional counts live
   * here so the next-drill briefing on `/run/transition` is single-
   * purpose. DrillCheckScreen auto-redirects to `/run/transition` when
   * the previous block isn't a count-eligible main_skill / pressure
   * block (warmup, technique, wrap, or skipped) so the user never sees
   * an empty reflective beat. See
   * `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 9.
   */
  drillCheck: '/run/check',
  transition: '/run/transition',
  review: '/review',
  complete: '/complete',
  settings: '/settings',
  onboardingSkillLevel: '/onboarding/skill-level',
  onboardingTodaysSetup: '/onboarding/todays-setup',
} as const

export const routes = {
  home: () => routePaths.home,
  setup: () => routePaths.setup,
  safety: () => routePaths.safety,
  run: (execId: string) =>
    `${routePaths.run}?id=${encodeURIComponent(execId)}`,
  drillCheck: (execId: string) =>
    `${routePaths.drillCheck}?id=${encodeURIComponent(execId)}`,
  transition: (execId: string) =>
    `${routePaths.transition}?id=${encodeURIComponent(execId)}`,
  review: (execId: string) =>
    `${routePaths.review}?id=${encodeURIComponent(execId)}`,
  complete: (execId: string) =>
    `${routePaths.complete}?id=${encodeURIComponent(execId)}`,
  settings: () => routePaths.settings,
  onboardingSkillLevel: () => routePaths.onboardingSkillLevel,
  onboardingTodaysSetup: () => routePaths.onboardingTodaysSetup,
} as const
