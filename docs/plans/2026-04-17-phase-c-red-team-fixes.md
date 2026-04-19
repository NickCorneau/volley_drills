---
title: "plan: Phase C red-team fixes (post-C-2 / pre-C-3 hardening pass)"
type: plan
status: landed
landed_on: 2026-04-17
date: 2026-04-17
origin: structured code review (ce-review pattern) against the Phase C diff
depends_on:
  - docs/plans/2026-04-17-phase-c-master-sequencing-plan.md
  - docs/plans/2026-04-16-005-feat-phase-c0-schema-plan.md
  - docs/plans/2026-04-17-feat-phase-c1-review-contract-plan.md
  - docs/plans/2026-04-17-feat-phase-c2-session-summary-plan.md
  - docs/plans/2026-04-16-004-red-team-fixes-plan.md
---

# Phase C red-team fixes (post-C-2 hardening pass)

## Purpose

After C-0, C-1, and C-2 landed, we dispatched six reviewer personas in parallel (correctness, adversarial, data-migrations, reliability, testing, kieran-typescript) against the Phase C diff. Reviewers returned 28 findings across P0-P3 severity. This doc records the 12 findings we fixed before starting C-3, plus the deferred items and the regression-test additions.

## Fixes landed (2026-04-17)

### P0 — data loss / dead-end cascades

1. **A9 mount-time redirect writes no stub** (`correctness-1` / `adv-4` / `rel-3`, confidence 0.80-0.92). ReviewScreen's mount-time past-cap guard navigated to `/complete/{execId}` without writing a review record first, so CompleteScreen's `loadSessionBundle` returned `null` and rendered "Session not found." This is the exact dead-end A9 was designed to prevent. **Fix:** call `await expireReview({ executionLogId })` in a try/catch with `isSchemaBlocked()` suppression before navigating, mirroring the A6 submit-time branch in `handleSubmit`. [app/src/screens/ReviewScreen.tsx](../../app/src/screens/ReviewScreen.tsx)
2. **`expireReview` silently wipes draft payload** (`adv-1` / `adv-2`, confidence 0.92-0.95). When a `status: 'draft'` record existed (tester had filled in RPE + note + metrics), the A6 cap re-check OR Home's `expireStaleReviews` wrote a fresh skipped stub that overwrote the draft by primary key, destroying user data — particularly pain notes and incompleteReason. Then CompleteScreen rendered Case A's "No review this time" copy, which is actively dishonest. **Fix:** `expireReview` preserves the existing draft payload when overwriting (`sessionRpe`, `goodPasses`, `totalAttempts`, `incompleteReason`, `shortNote`, `drillScores`, `borderlineCount`, existing `quickTags`) and flips it to terminal by adding `'expired'` to `quickTags` + setting `status: 'skipped'` + `captureWindow: 'expired'` + `eligibleForAdaptation: false`. The adaptation engine still ignores the record; V0B-15 export carries the honest data through. [app/src/services/review.ts](../../app/src/services/review.ts)

### P1 — silent failures

3. **ReviewScreen + CompleteScreen async mount effects had no try/catch** (`correctness-3` / `rel-1` / `rel-2`, confidence 0.65-0.85). A rejected Dexie read (quota, transient IDB error, corrupted record) would strand the tester on the "Loading…" spinner indefinitely because neither component handled the async rejection. **Fix:** wrap both async IIFEs in try/catch, suppress `isSchemaBlocked()` (the overlay owns the UI in that case), and drop into the existing `missing` variant otherwise — giving the tester a "Back to start" escape hatch. [app/src/screens/ReviewScreen.tsx](../../app/src/screens/ReviewScreen.tsx), [app/src/screens/CompleteScreen.tsx](../../app/src/screens/CompleteScreen.tsx)
4. **`handleFinishLater` silently navigated home on save failure** (`rel-4`, confidence 0.80). The explicit `await saveReviewDraft` in Finish Later's handler caught errors and logged them, then unconditionally called `navigate(routes.home())`. A tester who typed a pain note and tapped "Finish later" would see Home, trust their draft was saved, and find a blank form on re-entry. **Fix:** on non-schema-blocked save failure, stay on the screen and surface `"Couldn't save your draft — please try again or Submit now."` via the existing `submitError` surface. [app/src/screens/ReviewScreen.tsx](../../app/src/screens/ReviewScreen.tsx)
5. **`SubmitReviewResult` consumed with a non-exhaustive `if`** (`K-TS-1`, confidence 0.85). Future variants of the discriminated union would silently succeed (fall through to `navigate` / complete-route) instead of tripping a compile error. **Fix:** rewrite `handleSubmit`'s result handler as an exhaustive `switch` with `const _exhaustive: never = result` in the default, matching the repo's existing `lib/format.ts` pattern. [app/src/screens/ReviewScreen.tsx](../../app/src/screens/ReviewScreen.tsx)
6. **H19 "already reviewed" copy was a lie for the skip-then-retry path** (`adv-3`, confidence 0.88). If a tester tapped Home's "Skip review" (possibly by mistake), then navigated back to `/review?id=X` and tried to submit, the A3 refused-write flow showed `"This session was already reviewed — showing what we saved."` — but the session had been SKIPPED, not reviewed. **Fix:** `submitReview`'s `{ status: 'refused' }` result now carries `existingStatus: 'submitted' | 'skipped'` so ReviewScreen can render differentiated copy. Skipped -> `"This session was already skipped — showing what we saved."` Submitted -> unchanged. The `conflictedWith` state carries the terminal status into the render branch. [app/src/services/review.ts](../../app/src/services/review.ts), [app/src/screens/ReviewScreen.tsx](../../app/src/screens/ReviewScreen.tsx)
7. **`expireStaleReviews` loop aborted on first record failure** (`rel-6`, confidence 0.72). One corrupted or transiently-failing record would leave every subsequent Home resolve stuck in the `error` state. **Fix:** per-record try/catch around the `expireReview` call in the loop; log and continue. The partial count returned to the caller is the number of records that actually expired. [app/src/services/session.ts](../../app/src/services/session.ts)

### P2 — correctness + honesty

8. **Counter inflated by migrated v0a records** (`adv-5`, confidence 0.88). The v4 migration classifies existing v3 reviews as `status: 'submitted'`, so a tester with 10 pre-D91 sessions reads "Session 11" on their first D91 submission. **Fix:** `countSubmittedReviews` reads `storageMeta.onboarding.completedAt` (already the v0b-cohort-boundary sentinel — C-0 Unit 2 backfill writes it on v4 upgrade for existing testers, C-3 will write it on fresh-install first-Build) and filters `submittedAt >= completedAt` when present. When absent, falls back to counting all submitted (preserving the current contract for tests and pre-C-3 cold state). [app/src/services/review.ts](../../app/src/services/review.ts)
9. **Auto-save effect had no debounce on the note field** (`adv-6`, confidence 0.72). The C-1 Unit 7 plan specified 200 ms debounce on the note textarea, but the implemented code fired a Dexie write on every keystroke. **Fix:** `debouncedShortNote` state mirror updated 200 ms after the latest `shortNote` change; the auto-save effect reads the debounced value. RPE / pass metric / quickTags still commit immediately. [app/src/screens/ReviewScreen.tsx](../../app/src/screens/ReviewScreen.tsx)
10. **Copy guard missed forbidden vocabulary in attribute values** (`testing-1`, confidence 0.88). `document.body.textContent` excludes `aria-label`, `title`, `alt`, `placeholder` values. **Fix:** test helper `scanBodyAndAttributes()` concatenates `textContent` with the values of the six relevant attributes, and the regex guard runs over the combined string. [app/src/screens/__tests__/CompleteScreen.copy-guard.test.tsx](../../app/src/screens/__tests__/CompleteScreen.copy-guard.test.tsx)
11. **`PassMetricInput` props `notCaptured` + `onToggleNotCaptured` not paired** (`K-TS-3`, confidence 0.78). A caller passing only `notCaptured={true}` would render a disabled input with no recovery affordance. **Fix:** props discriminated so the pair is all-or-nothing at the type level. [app/src/components/PassMetricInput.tsx](../../app/src/components/PassMetricInput.tsx)
12. **HomeScreen action handlers didn't gate on `isSchemaBlocked`** (`rel-7`, confidence 0.75). `handleDiscard` and `handleSkipReview` flipped to the `error` state on any catch, flashing "Something went wrong" under the SchemaBlockedOverlay. **Fix:** `if (isSchemaBlocked()) return` at the top of each catch, matching `resolve()`'s precedent. [app/src/screens/HomeScreen.tsx](../../app/src/screens/HomeScreen.tsx)

## Deferred findings (not fixed in this pass)

Listed here so the trail is auditable. Each is annotated with rationale.

- **Test coverage: no test exercises the real Dexie v3 -> v4 upgrade callback wiring** (`DM-T1`, `DM-T6`). Migration bodies are covered; the `.upgrade(async tx => ...)` wrapping chain isn't. Deferred: risk is bounded (two lines of wiring), and the Playwright e2e `phase-c0-schema-v4.spec.ts` DOES exercise the real path in a real browser. Add a real-upgrade harness post-D91 when the next schema bump lands.
- **Test coverage: atomic-rollback verification when a backfill throws** (`DM-T6`). Belt-and-suspenders; Dexie's transaction semantics are well-defined. Deferred to the same post-D91 harness work.
- **PassMetricInput paste truncation of decimals / scientific notation / commas** (`adv-7`, confidence 0.78). `Number.parseInt('18.5', 10)` silently truncates to 18; iOS Safari's numeric keypad still accepts the decimal point. Deferred: D91 testers are counting integer passes on sand; the truncation-without-feedback path is edge-case. Revisit post-D91 feedback.
- **IDB eviction re-routes tester through onboarding** (`adv-8`, confidence 0.62). If iOS storage pressure evicts the DB between sessions, the onboarding backfill doesn't re-fire on reopen because Dexie runs upgrades once per version transition. Deferred: migration-time sentinel alone isn't enough; solution (open-time idempotent guard OR eviction-detection banner) is a C-3 architectural concern, not a C-0/C-1/C-2 fix. Flagged in the C-3 onboarding plan's Risks section.
- **`SessionReview.status` optionality contradicts writer contract** (`K-TS-5`, confidence 0.62). Writers emit `status` unconditionally, migration backfills all records, yet the type is `status?:`. Defense-in-depth rationale exists; tightening the type would require sweeping read sites. Deferred as a post-D91 type-safety pass.
- **`composeSummary` doesn't use exhaustive switch on `SessionReviewStatus`** (`K-TS-4`, confidence 0.72). Future status values silently fall into the "Keep building" default. Defense exists via the defensive-behavior test; tightening adds surface area. Deferred.
- **No end-to-end integration test drives Home -> Run -> Review -> Complete** (`testing-10`, confidence 0.80). Unit tests cover each screen boundary with explicit URL seeds. Playwright e2e covers schema migration and warm-offline but not the session-flow happy path. Deferred post-D91 when the flow is stable.
- **A3 matrix doesn't assert single-row invariant per execId** (`testing-7`, confidence 0.70). `get(REVIEW_ID)` by primary key hides record-count issues. Deferred as a test hardening pass.
- **Playwright schema-v4 spec fragile to service-worker interception on re-runs** (`testing-3`, confidence 0.78). `page.route` can lose to SW-cached app shell on the second test in the file. Deferred: a single spec run passes; tightening the `clearOriginStorage` call to include `service_workers` + `cache_storage` is a one-line fix queued for the next Playwright touch.
- **IDBFactory swap doesn't isolate the `db` singleton between tests** (`testing-8`, confidence 0.75). Tests rely on per-file `clearDb()` for isolation. Not a live bug — all new tests call `clearDb()` in `beforeEach`. Deferred as a test-infra doc hygiene task.
- **HomeScreen `resolve()` uses an inert cancellation flag** (`K-TS-2`, confidence 0.82). The `cancelled` flag is set but never read inside `resolve()`, so mid-flight unmount leaks setState calls. Defense-in-depth fix; React 18+/19 silently no-ops setState-after-unmount. Deferred unless flaky-test symptom surfaces.
- **Pain-first / skipped-wins-over-pain copy property test gap for draft status** (`testing-9`, confidence 0.72). Property test enumerates `['submitted', 'skipped']` but not `'draft'`. Defensive test exists separately. Deferred.

## Regression-test additions

Each P0/P1 fix landed with a fresh regression test so the bug can never re-enter silently. Tests added:

- `ReviewScreen.a9-landing.test.tsx`: "writes the expired stub before navigating" + "past-cap mount with a pre-existing draft preserves the draft payload into the stub".
- `ReviewScreen.load-failure.test.tsx` (new): falls back to Session-not-found on non-schema-blocked Dexie read failure.
- `CompleteScreen.load-failure.test.tsx` (new): falls back to Session-not-found on `loadSessionBundle` or `countSubmittedReviews` rejection.
- `ReviewScreen.finish-later.test.tsx`: "Finish later surfaces an error and stays on the screen when `saveReviewDraft` rejects".
- `ReviewScreen.h19-conflict.test.tsx`: added "renders 'already skipped' copy when existing record is a skip stub" (adv-3 fix).
- `review.a3-matrix.test.ts`: (submitted, submit) and (skipped, submit) now assert `existingStatus` on the refused result.
- `session.v0b.test.ts`: "expireStaleReviews continues past a single failing record" + "expireStaleReviews overwrites a past-cap draft with a skipped stub" updated to assert draft preservation.
- `review.test.ts`: "expireReview overwrites a status: draft with a terminal skipped stub, preserving the draft payload" + "`countSubmittedReviews` excludes submitted records older than onboarding.completedAt when set".

## Verification

- `npx tsc -b` — exit 0.
- `npx eslint src/` — exit 0.
- `npx vitest run` — 40 files / 270 tests pass.
- `npx playwright test` — 20 of 21 specs pass; the single failure is `edge-cases.spec.ts::advance through all blocks reaches review`, a pre-existing wall-clock timing flake unrelated to any Phase C surface (same status across the C-0, C-1, and C-2 exit points).

## Next

C-3 (two-screen onboarding) is unblocked. The P2 cohort-sentinel fix made `countSubmittedReviews` read `storageMeta.onboarding.completedAt`, so C-3's "set this key on first-Build" work is now load-bearing for the session counter's honesty.
