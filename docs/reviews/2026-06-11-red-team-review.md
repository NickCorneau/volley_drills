---
id: 2026-06-11-red-team-review
title: "Whole-App Red Team — Product Value, Architecture, Code Correctness (2026-06-11)"
status: active
stage: validation
type: review
summary: "Five-track adversarial review of the post-M001 v0b app (product value, architecture, code correctness, design-language adherence, live mobile pass). Verified one P0 session-data race (ADV-1 double-advance) and one P1 timer-state bug (ADV-2 non-idempotent pause) — both fixed same-day with regression tests. Names three strategic findings routed to founder/M002 reconciliation rather than fixed: validation-ratchet drift (D132→D146→D147), the D91/D127 type-floor deadlock, and the process-exoskeleton tax. Companion design-track capture: docs/design/reviews/2026-06-11-red-team-design-language-review.md."
authority: "Point-in-time red-team capture and same-day fix log. Not source of truth on its own; strategic findings route to docs/decisions.md and M002 reconciliation, not directly to canon."
last_updated: 2026-06-11
depends_on:
  - docs/vision.md
  - docs/decisions.md
  - docs/status/current-state.md
  - docs/ops/app-architecture-guidance.md
related:
  - docs/design/reviews/2026-06-11-red-team-design-language-review.md
  - docs/reviews/2026-04-20-m001-red-team.md
  - docs/reviews/2026-05-24-multi-skill-app-audit.md
decision_refs:
  - D91
  - D127
  - D130
  - D132
  - D137
  - D145
  - D146
  - D147
  - D149
  - D150
---

# Whole-App Red Team — Product Value, Architecture, Code Correctness (2026-06-11)

## Agent Quick Scan

- Five adversarial tracks run in parallel on 2026-06-11 against `main` + the live dev build: product value, architecture, code correctness, design-language code audit, live mobile pass (390×844). Design tracks are captured in the companion doc under `docs/design/reviews/`.
- **Two mechanical findings were verified in code and fixed the same day** (ADV-1, ADV-2 — see Fix Log). One live-pass P0 was **falsified on verification** (Setup `Recommended` chip — it is a real selectable option, see companion doc).
- **Strategic findings were deliberately NOT fixed here.** They are routed (see Routing) because they are product decisions, not bugs: fixing them ad-hoc would repeat the canon-drift failure this review itself flags.
- Authoritative for: what the red team found, what was verified vs. contested, what was fixed on 2026-06-11, and where each unfixed item routes.
- Not authoritative for: the decisions themselves. If a routed item gets decided, `docs/decisions.md` wins.

## Method

- Read-only subagent tracks: product-lens (value), architecture-strategist, adversarial code review, design-language audit, browser-driven live mobile pass at 390×844 on the dev server.
- Independent measurements taken directly: ~28.3k production LOC (`app/src`), ~38.3k test LOC (unit + e2e), ~85k lines of docs across 358 files (~3× production code).
- Verification pass (same day, this session): each P0/P1 candidate re-checked against shipped code before any fix. Working tree carried uncommitted M002.1 home-coherence WIP at review time; fixes below were kept disjoint from that WIP (run loop, timer, domain, RunControls).

## Track Verdicts

| Track | Verdict | Headline |
| --- | --- | --- |
| Product value | Real but narrow (n=2) | D91 stranger-pull falsification structurally unrunnable; pre-registered conditions acted as a ratchet (D132 → D146 → D147) |
| Architecture | Asset + parasitic exoskeleton | Layered core is sound and genuinely enforced; ~4.8k LOC of CI-gated diagnostics/process tooling taxes exactly the churn M002 needs |
| Code correctness | 1 verified P0, 2 P1 | Double-advance race falsely completes never-run drills; timer semantics contradict the on-screen promise |
| Design language | B+ / B− / C / A− (see companion) | Token system healthy; every contrast failure is an ad-hoc bypass; outdoor brief least-honored contract |
| Live mobile pass | B+ courtside app | Run timer excellent; one P0 claim falsified on verification (Recommended chip) |

## Code Findings (verified)

### ADV-1 — Double-advance race (P0) — VERIFIED, FIXED 2026-06-11

`useSessionRunner`'s serial mutation queue guarantees **ordering, not idempotence**. A Next tap racing the timer's block-end completion (or a plain double-tap; Run's Next/Skip had no in-flight guard) enqueued two advances. The first `persist()` schedules a render and the ref-sync effect publishes the advanced state before the first op's promise resolves, so the second op read the *fresh* ref and marked the **next block completed without it ever running**. Past the last block, `buildAdvancedBlock` spread `blockStatuses[idx]` past the array end and persisted a malformed `{ status, completedAt }` row with no `blockId`, which flowed into exports.

**Fix**: in-flight advance dedupe in `useSessionRunner.advanceBlock` (concurrent requests resolve to the in-flight result; ref clears on settle so the "Try again" path stays retryable) + a past-end no-op guard in `domain/executionState.buildAdvancedBlock`. Regression tests in `hooks/useSessionRunner.test.ts` (2) and `domain/executionState.test.ts` (1).

### ADV-2 — Non-idempotent pause (P1) — VERIFIED, FIXED 2026-06-11

`useTimer.resume()` received an idempotence guard on 2026-04-27 (prior red team); `pause()` did not. A double-tap of Pause (the paused layout only renders after the pauseBlock Dexie write + re-render) re-added the entire running segment to `accumulatedRef` — `startTsRef` is never advanced between calls — double-counting elapsed. Near the end of a block the doubled value clamps remaining to 0:00 and the next Resume tick auto-completes the block.

**Fix**: `pause()` now mirrors `resume()`'s `isRunningRef` guard and returns the already-banked elapsed when not running; `start()`/`reset()` sync the ref; the auto-complete tick banks the final segment so a post-complete `pause()` reports truthful elapsed. Regression test in `hooks/__tests__/useTimer.test.ts`.

### ADV-3 — Split-brain lock/background timer semantics (P1) — VERIFIED, NOT FIXED (routed)

The live RAF path computes elapsed from `performance.now()` wall time, so hidden/locked time **counts** and a block can auto-complete on unlock. The discard/recovery path restores from the last 5s flush, so hidden time **does not count** there. Two contradictory behaviors behind one gesture — while RunScreen footer copy promises "Locking your phone pauses the timer." Whether locked time should pause or count is a **product decision about what a training block means**, not a bug fix; it needs one decision, one implementation across both paths, and truthful copy. Routed below.

### ADV-4 — Audio/cue residuals (P2 cluster) — NOT FIXED (routed)

AudioContext priming gaps on some entry paths into timed blocks; cue audio after backgrounding. Bundled into the ADV-3 timer-semantics work since the fix surface overlaps (`platform/` audio + run controller).

## Value / Architecture Findings (routed, not fixed)

1. **Falsification structurally unrunnable (P0-class, strategic).** D91 (stranger-cohort retention) requires putting the app in new hands, but the 2-player product scope excludes the founder's actual 3s/4s network. The premise test cannot fire as designed. Every recent field signal (F2 attack content, F4 3s/4s, F5 tactics) pulls toward shapes the pair-first 2-player scope forbids.
2. **Pre-registered conditions as ratchet (P0-class, strategic).** The D132 → D146 → D147 chain shows a fail-trending condition reframed to "pass-equivalent," ratified, then M001 closed by executive call. The machinery built to prevent rationalization was used to launder it. The 2026-07-20 D130 re-eval risks the same treatment.
3. **Process exoskeleton outweighs the product.** ~85k doc lines and decision IDs into the D150s govern an n=2 product; in-app, ~4.8k LOC of CI-gated diagnostics and contract tooling (some analyzing retired mechanisms) plus prose-pinning tests tax content/UI churn. Recommendation is **subtraction, not restructuring** — but deleting CI-gated surfaces reverses prior decisions and needs a decision packet.
4. **Mutation queue documented stronger than it is.** Per-mount, ordering-only. Partially mitigated by the ADV-1 dedupe; the doc-comment in `useSessionRunner.ts` was extended to name the ordering-vs-idempotence distinction.
5. **Trust pillar attacked from three sides.** The same promise — "the timer and the plan are dependable" — failed in code (ADV-1/ADV-2, now fixed), in copy (lock-pauses-timer line, ADV-3, open), and in the field (2/2 founder sessions flagged duration budgeting; behavioral ledger silent since 2026-05-10).

## Canon Drift (fixed where mechanical, routed where decisional)

| Item | Status |
| --- | --- |
| `AGENTS.md` / `app/README.md` / `docs/status/current-state.md` said Dexie **v6**; shipped schema is **v7** (M002.1 `offeredDelta`/`verdictChoice`, D150/D151) | **Fixed 2026-06-11** (all three references updated) |
| D145 0-b records the Review h1 as left-aligned; shipped code has it centered in the flex header. D145 0-d records the discard confirm as neutral; shipped code uses `variant="danger"`. Git history (`-S` pickaxe) shows **neither recorded state ever shipped** — the danger variant dates to the original v0b commit, and no commit ever introduced a left-aligned Review h1 | **Verified, routed** — decisions.md is founder-owned and was WIP-dirty at review time; D145 needs amendment (or the code needs changing to match it, which would itself be a design decision) |
| D127 holds `--text-body` at 14px pending D91 field evidence; D91 is deferred indefinitely and M001 closed by fiat, so the 16px outdoor floor is gated on evidence no longer scheduled to arrive | **Routed** — D127's trigger needs a new owner/condition |

## Routing — where each unfixed item goes

| Item | Route |
| --- | --- |
| ADV-3 timer lock/background semantics (+ ADV-4 audio) | Needs a decision row (pause vs. count hidden time), then one implementation across live + recovery paths + truthful RunScreen copy. Candidate for early M002 hardening work |
| D145 0-b / 0-d phantom states | Founder amends D145 (annotate mis-recorded reality) or directs a code change to match it |
| D127 type-floor trigger ownership | Founder re-owns the trigger now that D91 is indefinitely deferred (re-eval naturally fits the 2026-07-20 D130 window close) |
| Process-exoskeleton subtraction (~5–7k LOC candidate) | Decision packet before deletion; CI gates were decision-backed (e.g. D139-era) and should be un-decided, not silently removed |
| 3+ player scope / falsification reachability | Input to the M002 series reconciliation (D149) and the 2026-07-20 D130 re-eval — this is the existing cohort-decision agenda, now with the red-team framing attached |
| Validation-ratchet concern (D132→D146→D147 pattern) | Founder awareness; suggest the 2026-07-20 re-eval names an external tripwire it cannot reframe |
| Duration budgeting / trust field signals | Already in the M001 carry-forward absorbed into M002; red team adds urgency, not new scope |

## Fix Log (2026-06-11, this session)

- `app/src/hooks/useSessionRunner.ts` — ADV-1 in-flight advance dedupe
- `app/src/domain/executionState.ts` — ADV-1 past-end guard in `buildAdvancedBlock`
- `app/src/hooks/useTimer.ts` — ADV-2 `pause()` idempotence guard + synchronous `isRunningRef` maintenance in `start()`/`reset()`/auto-complete
- `app/src/components/RunControls.tsx` — End-session resting-state contrast (`text-warning` → `text-warning-strong`; see companion design doc)
- `app/src/hooks/useSessionRunner.test.ts`, `app/src/hooks/__tests__/useTimer.test.ts`, `app/src/domain/executionState.test.ts` — 4 new regression tests; targeted suites green (47 + 29 tests), `tsc --noEmit` clean
- `AGENTS.md`, `app/README.md`, `docs/status/current-state.md` — Dexie v6 → v7 canon corrections

## What held up under attack

Migrations (v1→v7 chain), draft lifecycle, capture-window math, export integrity, the layer model (no Dexie imports in screens, no policy in JSX found), deterministic generation, and the token system's base values. The Run-screen timer experience graded excellent in the live pass.
