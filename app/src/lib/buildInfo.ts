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
 * timestamps. Surfacing a build version + ISO date in Settings
 * turns that triage step into one tap.
 *
 * Build-version semantics (2026-04-27 update). The injected value is
 * sourced from `git describe --tags --always --dirty` (see
 * `vite.config.ts::readBuildVersion`), so a clean build at a tagged
 * commit returns the tag itself (e.g., `v0b-alpha.16`). Inter-tag
 * commits return `<tag>-<n>-g<shortSha>`; uncommitted-tree builds
 * append `-dirty`; tagless repos fall back to a short SHA. The
 * tag-leading shape is more memorable than a 7-char SHA for tester
 * triage ("are you on v0b-alpha.16 or v0b-alpha.15?" reads better
 * than "are you on 47745e2 or cca2a55?").
 *
 * Field rename history. Pre-2026-04-27 this exported `BUILD_SHA`
 * (always a SHA via `git rev-parse --short HEAD`). Renamed to
 * `BUILD_VERSION` because the new resolution returns a tag when
 * one is reachable. Old `BUILD_SHA` callers should import
 * `BUILD_VERSION` instead.
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

declare const __VOLLEYCRAFT_BUILD_VERSION__: string | undefined
declare const __VOLLEYCRAFT_BUILD_DATE__: string | undefined

function readVersion(): string {
  try {
    if (typeof __VOLLEYCRAFT_BUILD_VERSION__ === 'string') {
      return __VOLLEYCRAFT_BUILD_VERSION__
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

export const BUILD_VERSION: string = readVersion()
export const BUILD_DATE: string = readDate()
