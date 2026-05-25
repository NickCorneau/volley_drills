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
 * See `docs/archive/plans/2026-04-26-pre-d91-editorial-polish.md` Item 6.
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

/**
 * 2026-05-25 audit follow-up (L3): the raw `git describe` slug can grow
 * verbose for inter-tag commits — e.g.
 * `m001-validation-week5-catchup-2026-05-23-1-gbc6831d` — which reads
 * as an internal leak to a stranger cohort while still being useful in
 * founder-use / D91 triage. `formatBuildVersion(raw, mode)` returns the
 * raw value for dev (preserves triage telemetry-by-hand) and a short
 * form for prod. The short form prefers the trailing `g<7-char-sha>`
 * segment when present (the universal disambiguator for inter-tag
 * commits); when the slug is a clean tag (no `-N-g<sha>` suffix) it
 * passes through unchanged so semver-like tags like `v0b-alpha.16`
 * stay legible. A `-dirty` suffix is preserved across the truncation
 * because it's load-bearing for tester triage ("you're on a dirty
 * build, that explains the inconsistency").
 *
 * Pure helper; unit-tested in `__tests__/buildInfo.test.ts`.
 */
export function formatBuildVersion(raw: string, mode: 'dev' | 'prod'): string {
  if (mode === 'dev') return raw

  const dirtySuffix = raw.endsWith('-dirty') ? '-dirty' : ''
  const base = dirtySuffix ? raw.slice(0, -dirtySuffix.length) : raw

  const interTagMatch = base.match(/-(\d+)-g([0-9a-f]{7,})$/i)
  if (interTagMatch) {
    const sha = interTagMatch[2]
    return `${sha}${dirtySuffix}`
  }

  return raw
}
