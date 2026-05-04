/**
 * Plan U12 (2026-05-04): local ESLint plugin entry point. Wired into
 * `eslint.config.js` so the rule below is enforced on every TS/TSX
 * file under `app/src/`. Lives as a local file rather than a published
 * npm package — the rule is Volleycraft-specific.
 */

import noInlinePrimitiveDrift from './no-inline-primitive-drift.js'

export default {
  rules: {
    'no-inline-primitive-drift': noInlinePrimitiveDrift,
  },
}
