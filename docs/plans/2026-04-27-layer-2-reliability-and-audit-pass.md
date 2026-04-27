---
id: layer-2-reliability-and-audit-pass-2026-04-27
title: "Layer 2 reliability + audit pass (2026-04-27)"
type: plan
status: complete
stage: validation
authority: "Disposition and implementation record for the post-D133 Layer 2 queue scope: reliability fixes first, narrow mobile verification second, bounded accent audit third, stale behavior ideas deferred or killed."
summary: "Ships the high-value Layer 2 pass that followed the queue scope review: Drill Check now waits for per-drill capture persistence before navigation; draft setup editing hydrates the current draft context instead of the last completed context; Playwright covers current /review controls at 375 px against the 44 px hit-area floor; decorative accent uses were demoted without touching actions, selected chips, focus rings, timer/progress cues, or operational signals. Records Beach Prep Three truncate-with-expand as killed and auto-fill recency / Net-Wall persistence as deferred behavior changes."
last_updated: 2026-04-27
depends_on:
  - docs/plans/2026-04-27-skip-review-and-investment-footer.md
  - docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/specs/m001-review-micro-spec.md
  - docs/decisions.md
decision_refs:
  - D83
  - D91
  - D92
  - D102
  - D103
  - D104
  - D130
  - D133
---

# Layer 2 reliability + audit pass (2026-04-27)

## Agent Quick Scan

- **Reliability first.** The pass prioritizes two adjacent P1/P2 risks discovered while scoping the Layer 2 queue: per-drill capture durability on `/run/check`, and draft-aware setup hydration before any Net/Wall persistence behavior changes.
- **Verification second.** Adds a current-shape Playwright check for `/review` at 375 px. The test targets the shipped 3-chip RPE picker, Good/Total inputs, "Couldn't capture reps" button, note field, Done, and Finish later controls.
- **Audit third.** Accent demotion was kept bounded: only clearly decorative/readout uses changed. Primary actions, selected chips, links, focus rings, timer/progress cues, and run-flow operational signals kept their accent role.
- **Killed/deferred items are explicit.** `Beach Prep Three` truncate-with-expand is killed; auto-fill training recency and Net/Wall persistence remain deferred behavior changes, not Layer 2 polish work.

## Shipped Outcomes

### Per-drill capture persistence

`DrillCheckScreen` still autosaves every meaningful per-drill change, but `Continue` now waits for any pending save and then flushes the latest current capture before navigating to Transition. If the save fails, the user stays on Drill Check and sees an error instead of silently moving forward with a lost difficulty tag.

Regression coverage: `DrillCheckScreen.perDrillCapture.test.tsx` controls `saveReviewDraft()` with a deferred promise and proves `/run/check` does not navigate to `/run/transition` until persistence resolves.

### Draft-aware Setup hydration

Home's draft edit path now marks navigation to `/setup` as draft editing. `SetupScreen` uses that signal to hydrate from `getCurrentDraft().context`; plain `/setup` continues to hydrate from `getLastContext()` for normal start flows.

Regression coverage: `SetupScreen.test.tsx` seeds a last completed context and a different current draft context, then proves draft edit renders the draft's player mode, Net/Wall, and time profile.

### `/review` 375 px hit-area coverage

`e2e/review-hit-area.spec.ts` seeds a completed count-drill session, opens `/review?id=...` at a 375 px viewport, and asserts each current actionable control has a measurable bounding box at least 44 px wide and 44 px tall.

The scope deliberately excludes removed surfaces: no 0-10 RPE grid and no Quick-tags card.

### Accent audit demotions

Decorative/readout accent uses demoted:

- `PerDrillCapture` eyebrow `Quick tag`: `text-accent` -> `text-text-secondary`.
- `PassMetricInput` `% good` readout: `text-accent` -> `text-text-primary`.
- Heat-prevention tip bullets in `SafetyCheckScreen`: `text-accent` -> `text-text-secondary`.

Accent retained where it still does work: primary buttons, selected chips, action links, focus rings, timer/progress/countdown cues, paused state, run phase labels, and coaching cue left-rule markers.

## Killed Or Deferred

### Killed: `Beach Prep Three` truncate-with-expand

Do not build this. The underlying "blob" condition no longer holds because the warm-up copy was reformatted into numbered steps, and the 2026-04-22 Transition parity pass deliberately removed truncate-with-expand from that content pattern. Reintroducing it would regress the shipped one-surface scroll model.

### Deferred: auto-fill training recency

Do not build this as Layer 2 polish. Training recency remains part of the mandatory safety check (`D83`) and has a regression guard asserting it does not prefill from prior data. Any behavior change needs a dedicated setup/safety spec that decides how to preserve the safety contract while reducing repeat typing.

### Deferred: Net/Wall persistence

Do not add Net/Wall persistence as an isolated behavior change. The draft-aware Setup hydration bug had to be fixed first; further Net/Wall defaults should wait for a coherent setup behavior pass that accounts for `D102`/`D103`, current draft editing, and normal "start different session" flows.

## Verification

- `npm test -- src/screens/__tests__/DrillCheckScreen.perDrillCapture.test.tsx --run`
- `npm test -- src/screens/__tests__/SetupScreen.test.tsx --run`
- `npm test -- src/components/__tests__/PerDrillCapture.test.tsx src/components/__tests__/PassMetricInput.test.tsx src/screens/__tests__/SafetyCheckScreen.d83-regression.test.tsx --run`
- `npm run test:e2e -- e2e/review-hit-area.spec.ts --project=chromium`
