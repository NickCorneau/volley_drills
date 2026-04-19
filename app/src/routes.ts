export const routePaths = {
  home: '/',
  setup: '/setup',
  safety: '/safety',
  run: '/run',
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
