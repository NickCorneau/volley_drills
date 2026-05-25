# Residual Review Findings — `main` @ `2bd63d6`

**Source pipeline:** `/lfg` orchestrated against plan
[`docs/plans/2026-05-25-002-feat-2026-05-24-design-critique-followups-plan.md`](../plans/2026-05-25-002-feat-2026-05-24-design-critique-followups-plan.md).
Reviewer artifact: `/tmp/compound-engineering/ce-code-review/20260525-codereview/`.

**Why this file:** AGENTS.md `Operational Constraints` enforces single-branch
flow on `main` — every plan unit was committed directly and pushed, so there
is no PR body to append review findings to. Per `ce-code-review` autofix
mode's residual-handoff contract, downstream-resolver-owned findings get a
durable PR-body section OR a tracked fallback file. This is the fallback.

**Run shape:** 5 reviewer personas (`ce-correctness-reviewer`,
`ce-testing-reviewer`, `ce-maintainability-reviewer`,
`ce-project-standards-reviewer`, `ce-kieran-typescript-reviewer`). All
`safe_auto` findings landed in commit `2bd63d6` (`fix(review): apply
autofix feedback`). The items below are the residual `gated_auto` /
`manual` / `advisory` findings that downstream-resolver should pick up.

## Residual Review Findings

### Manual / gated_auto (downstream-resolver, not auto-applied)

- **[P2 → manual → downstream-resolver][correctness-2]** `app/src/lib/buildInfo.ts:97-101` —
  **`formatBuildVersion` regex latent edge case.** The current regex
  `/-(\d+)-g([0-9a-f]{7,})$/i` will false-positively truncate a clean tag
  whose own name ends in `-N-g<7+hex>` (e.g., a future tag literally named
  `release-1-gabcdef0` would render as `Build abcdef0 · <date>` instead of
  the tag). The current `v0b-alpha.*` tag convention is safe; latent only.
  Fix shape: either (a) document the tag-naming guardrail in
  `buildInfo.ts`, or (b) switch `vite.config.ts` to `git describe --long`
  so inter-tag is distinguishable from at-tag by an explicit `N=0` field.

- **[P3 → manual → downstream-resolver][T3]** `app/src/screens/SettingsScreen.tsx:282` —
  **Settings dev/prod gating not pinned in tests.** `formatBuildVersion('test', 'dev')`
  and `formatBuildVersion('test', 'prod')` both return `'test'`, so the
  existing `SettingsScreen.test.tsx:120` `Build test · test` assertion is
  mode-invariant. A flipped `import.meta.env.DEV` check or hardcoded mode
  would not fail the test. Fix: stub `__VOLLEYCRAFT_BUILD_VERSION__` to a
  verbose inter-tag slug in a new test case and assert truncation in prod
  mode.

- **[P3 → manual → downstream-resolver][T6]** `app/e2e/accessibility.spec.ts` —
  **Missing axe scans on incomplete-reason chip selected-warning and
  SetupScreen large-gap warning Callout.** `IncompleteReasonChips.tsx` has
  `defaultTone='warning'` and is rendered on `ReviewScreen:170`;
  `SetupScreen.tsx:406` renders `Callout tone='warning'` on the large-gap
  path. Both are within the U1 `text-warning-strong` wiring blast radius
  and are not in any of the four new selected/conditional warning scans
  the U1 commit added. Fix: add two new scans (Review incomplete-reason
  chip selected; Setup large-gap warning).

### Advisory / report-only

- **[P3 → advisory → human][PS-003]** new docs under `docs/plans/` and
  `docs/design/reviews/` — **D-ID backtick-vs-parens convention drift.**
  `.cursor/rules/docs-editorial-workflow.mdc` prescribes parenthesized
  stable IDs (e.g., `(D91)`). The new docs use backticked IDs
  (`` `D91` ``) to match the pre-existing surface convention in
  `docs/design/reviews/2026-05-24-agent-e2e-design-critique.md` and
  `docs/design/reviews/2026-04-26-agent-ux-review.md`. Pre-existing
  surface drift — the new docs match what's already there, not the
  rule. Resolve at the rule level (allow backticks for design-reviews
  surface) or sweep the surface (less attractive).

- **[P3 → advisory → human][maintainability-R1]** `docs/research/brand-ux-guidelines.md` —
  **Canon-vs-code reconciliation footnote sprawl.** The U8 pass inlined
  `previously claimed X; shipped is Y` footnotes across §1.2 / §2.3 /
  §6.4 / §7.x. Calibrated for one pass; future audits should consolidate
  into a top-level **Drift-Reconciliation appendix** or dated audit log
  to keep canon scannable. Do not rewrite this pass.

- **[P3 → advisory → human][maintainability-R2]** `app/src/components/BlockTimer.tsx`,
  `app/src/screens/RunScreen.tsx`, `app/src/screens/DrillCheckScreen.tsx`,
  `app/src/screens/SettingsScreen.tsx` — **H1 / H2 / L1 / L3 audit
  comments must travel with any D91-triggered revert.** Comment density
  itself is calibrated for the repo's institutional-memory posture
  (pre-existing 30-line `BlockTimer.tsx` JSDoc, AGENTS.md,
  `courtside-copy.mdc`). Suppressed as a code-quality finding. Tracked
  as risk: when D91 field-run evidence resolves keep / tune-further /
  revert on H1 / H2, the new experiment comments must be swept with the
  code. Don't leave orphaned comments naming a removed experiment.

- **[P3 → advisory → human][correctness-residual-1]** `app/src/screens/RunScreen.tsx:113-116`
  (H2) — **Paused-at-N>0 design ambiguity.** `currentSegmentIndex` does
  not rewind on pause; the H2 collapse therefore stays in effect when
  the user pauses at segment > 0. The new code comment enumerates only
  the paused-at-0 case; whether paused-at-N should behave the same as
  running-at-N is an unstated design choice. Treating paused-at-N as
  same-as-running-at-N is defensible; surface for explicit decision if
  D91 field evidence flags it.

- **[P3 → advisory → human][correctness-residual-2]** `app/src/components/ui/Expander.tsx`
  (pre-existing; flagged in passing by ce-kieran-typescript) — `onOpenChange?.(next)`
  moved outside the `setOpen` updater. Correct for StrictMode (the
  stated rationale) but loses the functional updater's incidental
  rapid-double-click safety. React processes each browser click as its
  own render cycle, so closure-based read of `open` sees latest state
  for typical interaction. Not a bug; advisory only. Out of named
  plan-2026-05-25-002 scope.

- **[P3 → advisory → human][correctness-residual-3]** `app/src/lib/buildInfo.ts` —
  **`import.meta.env.DEV` mode-edge ambiguity.** `import.meta.env.DEV`
  is `true` for any Vite mode `!== 'production'`. The configured
  `dev` / `build` / `preview` npm scripts are all safe (build defaults
  to mode `production`; preview serves the production bundle). Latent
  surprise only on a hypothetical `vite build --mode <non-production>`
  invocation, which is not a configured script today.

### Testing gaps (testing reviewer's residual_risks bucket)

- **G1**: `app/src/components/BlockTimer.tsx` `text-[72px]` is enforced
  only at the static-analysis tier
  (`app/scripts/validate-typography-guardrails.mjs`). One-line RTL
  assertion against the rendered digit class would close the runtime
  tier. Low confidence; static-analysis enforcement is the canonical
  gate per repo convention.
- **G2**: `app/src/lib/__tests__/buildInfo.test.ts` doesn't cover the
  empty-string / sub-7-char-SHA / dev-with-`-dirty`-clean-tag edges.
  Not realistic `git describe` outputs; coverage sufficient.

### Suppressed (below anchor-75 confidence gate)

- **[M2]** `app/src/screens/RunScreen.tsx:98-126` — H2 gating splits
  state across `segmentInstructionsAvailable` / `Inline` / `Collapsed`
  plus an OR-disjunct in `hasInstructionDetail`. Correct at N=2; flag
  for the next contributor that adds another gate. Optional refactor:
  collapse into a `type InstructionsRender = 'inline' | 'collapsed' |
  'overflow-only' | 'none'` discriminated union.
- **[kts-2]** `app/src/screens/RunScreen.tsx:117-121` —
  `hasInstructionDetail` OR-expression read clarity. Same shape as M2;
  optional refactor to extract `nonSegmentedInstructionDetail` as a
  named local.

## Sources

- Reviewer artifact: `/tmp/compound-engineering/ce-code-review/20260525-codereview/`
  (per-reviewer JSON: `correctness.json`, `testing.json`,
  `maintainability.json`, `project-standards.json`,
  `kieran-typescript.json`).
- Plan: `docs/plans/2026-05-25-002-feat-2026-05-24-design-critique-followups-plan.md`.
- Origin critique: `docs/design/reviews/2026-05-24-agent-e2e-design-critique.md`.
- Autofix commit: [`2bd63d6`](https://github.com/NickCorneau/volley_drills/commit/2bd63d6)
  `fix(review): apply autofix feedback`.
