import { describe, expect, it } from 'vitest'

/**
 * V0B-20 safe-boundary policy guard test.
 *
 * `UpdatePrompt` must only mount on Home and Complete screens (D41). Active
 * session routes (Run, Safety, Transition, Review, Setup) must never surface
 * an update affordance that could interrupt a session mid-flow.
 *
 * This test enforces the policy via static source-file inspection rather than
 * rendering each screen because:
 * - Rendering every screen requires extensive mock harnessing (routes, db
 *   seeding, timers). A static grep is simpler and harder to accidentally
 *   silence.
 * - It catches the failure mode we actually care about: someone adding
 *   `<UpdatePrompt />` or a shared header that pulls in the prompt on a
 *   non-safe-boundary screen.
 */

const SAFE_BOUNDARY_SCREENS = new Set(['../HomeScreen.tsx', '../CompleteScreen.tsx'])

const screenSources = import.meta.glob<string>('../*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
})

describe('UpdatePrompt safe-boundary policy (V0B-20, D41)', () => {
  const files = Object.keys(screenSources).sort()

  it('covers all screen files', () => {
    expect(files.length).toBeGreaterThanOrEqual(6)
  })

  for (const file of files) {
    const isSafe = SAFE_BOUNDARY_SCREENS.has(file)
    const source = screenSources[file]

    it(`${file} ${isSafe ? 'mounts' : 'does not mount'} UpdatePrompt`, () => {
      const importsPrompt =
        /from ['"]\.\.\/components\/UpdatePrompt['"]/.test(source) || /<UpdatePrompt\b/.test(source)
      const usesHook = /useAppRegisterSW\b/.test(source)

      if (isSafe) {
        expect(importsPrompt, `${file} should import UpdatePrompt`).toBe(true)
        expect(usesHook, `${file} should use useAppRegisterSW`).toBe(true)
      } else {
        expect(importsPrompt, `${file} must NOT mount UpdatePrompt (safe-boundary policy)`).toBe(
          false,
        )
        expect(
          usesHook,
          `${file} must NOT call useAppRegisterSW directly (registration is module-scoped)`,
        ).toBe(false)
      }
    })
  }
})
