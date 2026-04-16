export const routePaths = {
  home: '/',
  setup: '/setup',
  safety: '/safety',
  run: '/run',
  transition: '/run/transition',
  review: '/review',
  complete: '/complete',
} as const

export const routes = {
  home: () => routePaths.home,
  setup: () => routePaths.setup,
  safety: (preset: string, players: number) =>
    `${routePaths.safety}?preset=${encodeURIComponent(preset)}&players=${players}`,
  safetyFromDraft: () => routePaths.safety,
  run: (execId: string) =>
    `${routePaths.run}?id=${encodeURIComponent(execId)}`,
  transition: (execId: string) =>
    `${routePaths.transition}?id=${encodeURIComponent(execId)}`,
  review: (execId: string) =>
    `${routePaths.review}?id=${encodeURIComponent(execId)}`,
  complete: (execId: string) =>
    `${routePaths.complete}?id=${encodeURIComponent(execId)}`,
} as const
