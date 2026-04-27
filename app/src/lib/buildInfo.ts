/**
 * 2026-04-26 pre-D91 editorial polish (`F14`): typed accessor for
 * the build identifiers Vite injects via `define` in
 * `vite.config.ts`.
 *
 * Why this file exists. When a D91 field-test tester reports "the
 * timer skipped a beat at the end of block 2," the founder's first
 * triage question is "what build are you on?" Without a user-
 * visible build identifier the tester has no way to answer that
 * question without the founder cross-referencing Cloudflare deploy
 * timestamps. Surfacing a short SHA + ISO date in Settings turns
 * that triage step into one tap.
 *
 * Resolution order:
 *   1. Globals injected by Vite's `define` plugin at build time
 *      (production / preview / dev — all three populate them).
 *   2. Defensive `'dev'` / `'unknown'` fallbacks if either global
 *      is missing at runtime, so a misconfigured CI never crashes
 *      the app on Settings open. This *should* never trigger; the
 *      defaults exist to keep the app honest about uncertainty
 *      rather than to silently hide a config bug.
 *
 * Test environment: `src/test-setup.ts` declares stub values for
 * both globals so unit tests run without touching the real Vite
 * pipeline.
 *
 * See `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 6.
 */

declare const __VOLLEYCRAFT_BUILD_SHA__: string | undefined
declare const __VOLLEYCRAFT_BUILD_DATE__: string | undefined

function readSha(): string {
  try {
    if (typeof __VOLLEYCRAFT_BUILD_SHA__ === 'string') {
      return __VOLLEYCRAFT_BUILD_SHA__
    }
  } catch {
    // ReferenceError on a non-Vite runtime path: fall through.
  }
  return 'dev'
}

function readDate(): string {
  try {
    if (typeof __VOLLEYCRAFT_BUILD_DATE__ === 'string') {
      return __VOLLEYCRAFT_BUILD_DATE__
    }
  } catch {
    // ReferenceError on a non-Vite runtime path: fall through.
  }
  return 'unknown'
}

export const BUILD_SHA: string = readSha()
export const BUILD_DATE: string = readDate()
