---
id: skip-review-modal-and-investment-footer-2026-04-27
title: "Skip-review confirm modal + Settings investment footer (2026-04-27)"
type: plan
status: shipped
stage: validation
authority: "Editorial-class polish bundle drawn from the genuinely-open Tier 1b items in `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §Genuinely-open Tier 1b bundle. Walkthrough-evidenced + multi-pass-converged; not founder-session-trigger-gated, so scope is strictly constrained to *editorial-class* per the 2026-04-22 adversarial-memo authoring-budget discipline (see `docs/plans/2026-04-20-m001-adversarial-memo.md` §5). No new drill records. No metadata schema changes. No persistence-behavior changes. No new archetype variants. No SetupScreen toggles. No Dexie migrations."
summary: "Two-item editorial-class polish bundle, the fourth successive pass after 2026-04-22 (six items), 2026-04-23 (four items), and 2026-04-26 (six items). Lifts the Home `Skip review` confirmation from an inline two-step row into a centered `role=dialog` modal whose shape matches the existing `End session early?` modal in RunScreen and the existing `ResumePrompt` / `SoftBlockModal` pattern, and adds a quiet `Logged: N sessions · H:MM total` line to the Settings footer above the existing privacy promise so the user has one passive cue of total investment without the surface getting louder. Two reconciled-list items demoted on closer inspection (`Beach Prep Three truncate-with-expand`: the underlying blob condition no longer holds and a prior parity pass deliberately removed the truncate-with-expand pattern; `Accent color demotion`: audit-class scope, separate pass)."
last_updated: 2026-04-27
depends_on:
 - docs/milestones/m001-solo-session-loop.md
 - docs/plans/2026-04-20-m001-tier1-implementation.md
 - docs/plans/2026-04-22-partner-walkthrough-polish.md
 - docs/plans/2026-04-23-walkthrough-closeout-polish.md
 - docs/plans/2026-04-26-pre-d91-editorial-polish.md
 - docs/plans/2026-04-20-m001-adversarial-memo.md
 - docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md
 - docs/research/founder-use-ledger.md
related:
 - .cursor/rules/courtside-copy.mdc
 - docs/research/brand-ux-guidelines.md
 - docs/research/japanese-inspired-visual-direction.md
decision_refs:
 - D91
 - D119
 - D125
 - D129
 - D130
 - D132
---

# Skip-review confirm modal + Settings investment footer (2026-04-27)

## Agent Quick Scan

- **Editorial-class only.** Two items. No drill records, no metadata schema changes, no persistence behavior changes, no new archetype variants, no SetupScreen toggles, no Dexie migrations. Same discipline as the 2026-04-22 / 2026-04-23 / 2026-04-26 polish passes.
- **Walkthrough-evidenced + multi-pass-converged; not founder-session-trigger-gated.** Source is the reconciled-list items 11 (`Skip-review confirmation modal`) and 13 (`Quiet Logged: N sessions · HH:MM total footer`) in `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §Genuinely-open Tier 1b bundle. Both fit the editorial-class envelope (UI shape change + one quiet copy line + one read-only service query); both have been queued since 2026-04-22.
- **Two items shipped:**
  - `R11` — Skip-review confirm modal: lift the inline two-step confirm currently rendered inside `ReviewPendingCard` (first-tap shows a `Never mind` / `Yes, skip` row beneath the card) into a centered `role=dialog` `aria-modal=true` modal with the same destructive-confirm shape as `RunScreen`'s `End session early?` modal (safe-primary first, danger below; `Esc` closes; backdrop is opaque enough to read the modal as the only legal target). The modal copy reuses the existing inline-confirm copy verbatim — no new strings to vet against `courtside-copy` — but the surface is now structurally distinct from a card body, so an accidental tap on `Skip review` no longer takes a partial action: it opens a modal that the user has to actively confirm or dismiss.
  - `R13` — Settings investment footer: a one-line `Logged: N sessions · H:MM total` row in the `SettingsScreen` footer, between the existing `About local storage` body and the privacy promise (`Your data stays on this device.`). Gated on `count > 0` so a fresh install renders nothing. Reads only finalized terminal sessions (excludes discarded-resume stubs via `isTerminalSession`), via a new `getSessionTallySummary()` query in the existing `services/session` barrel.
- **Two items demoted on close inspection** (recorded for next-pass auditors):
  - `R7` — `Beach Prep Three` truncate-with-expand: the underlying "blob" condition no longer holds (`d28` was reformatted into numbered lines on 2026-04-21) and the 2026-04-22 Transition parity pass *deliberately removed* the truncate-with-expand pattern from `TransitionScreen` for consistency. Re-introducing it would regress that decision. **Demoted, not shipped.**
  - `R14` — Accent color demotion across non-action surfaces: audit-class scope (touches every non-CTA surface), explicitly broader than the editorial-class envelope this plan honors. **Deferred to a separate audit pass.**
- **One item already shipped today** (recorded for traceability): the `d26 Lower-body Stretch Micro-sequence` cooldown copy fix (gloss `hip flexor`, `half-kneel`, `tuck pelvis`) shipped as part of today's dogfeed-sweep `cd3b01e`. Founder-use-ledger 2026-04-26 entry called it out as a content gap; the gloss landed in `app/src/data/drills.ts` ahead of this plan being authored.
- **Estimated effort: 2–3 hours focused.** Commits are independent; the modal item can ship without the footer item and vice versa. Tests are the bulk of the cost.

## Why this plan exists

Both items have been queued since 2026-04-22 in the reconciled-list bundle (items 11, 13). The 2026-04-26 pre-D91 polish pass deliberately scoped them out because that pass focused on review/complete editorial finishes rather than Home/Settings. With the 2026-04-27 `D133` pair-rep-capture + Tier 1b drill-authoring ship landed earlier today, the next genuine block of editorial-class polish work that can land before the 2026-05-21 `D130` Condition 3 final read-out is exactly this two-item bundle.

The discipline this plan honors is the same one the previous three polish passes honored: **editorial polish supplements core, it does not replace it.** Tier 1b drill authoring (`d31` / `d33` / `d40` / `d42` shipped 2026-04-27) is the real-progress complement; this two-item pass is hours-of-effort preparation that lets the next active-tester week run on a slightly calmer surface.

## Gate status

- **Authoring-budget cap status** (per `docs/plans/2026-04-20-m001-adversarial-memo.md` §5): this plan authors **zero new drill records**. The cap is unchanged.
- **Tier 1b founder-session trigger** (per `docs/plans/2026-04-20-m001-tier1-implementation.md`): **NOT required for this plan** because both items are editorial-class fixes inside the courtside-copy / structural-render envelope. Item `R11` lifts an existing surface into a more durable shape; item `R13` adds one quiet line wired to a read-only service query.
- **`D130` Condition 3 status**: provisional pass (Seb T+1-day open 2026-04-22); final read-out 2026-05-21. Neither item changes the read on Condition 3.

## Items shipped

### `R11` — Skip-review confirm modal

**Where:** `app/src/components/SkipReviewModal.tsx` (new), `app/src/components/home/ReviewPendingCard.tsx`, `app/src/components/HomePrimaryCard.tsx`, `app/src/screens/HomeScreen.tsx`.

**Pre-state.** When the Home review-pending primary card is up and the user taps `Skip review`, the card flips into an inline two-step confirm row inside the same `<section>`: a small bg-warm helper paragraph (`Skipping leaves this session out of what comes next.`) plus a side-by-side `Never mind` / `Yes, skip` button pair. The `confirmingSkip` boolean is owned by `HomeScreen` and threaded down through `HomePrimaryCard` into `ReviewPendingCard`.

The pattern works, but it has two weaknesses the reconciled list flagged:

1. **Visual discoverability is weak.** The confirm row sits inside the same card surface as the original `Skip review` link, so a tester who tapped `Skip review` slightly off-target (or by reflex) sees a small in-card change rather than a clear "you are about to do something destructive" signal. The destructive `Yes, skip` button is the same width and visual prominence as the original `Skip review` link.
2. **Pattern inconsistency.** The rest of the app uses centered `role=dialog` modals for *every* destructive confirm: `End session early?` (`RunScreen`), `Reopen session` / discard confirmation (`ResumePrompt`), and the `Finish your review first?` soft-block (`SoftBlockModal`). The Home skip-review confirm was the lone in-card two-step row — a deliberate exception that earned its place when red-team #5 first landed it but no longer reads as a *match* for the current modal language.

**Post-state.** Tapping `Skip review` opens a centered modal:

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the title.
- Backdrop `bg-black/45` (matches `ResumePrompt` / `SoftBlockModal`).
- Title: `Skip review?` (sentence-case question form, matching `End session early?`).
- Body: `Skipping leaves this session out of what comes next. The session is still saved to your history.` (first sentence verbatim from the existing inline-confirm copy; second sentence is a new short reassurance line because the modal no longer sits inside the card whose `Review pending` aria-label and plan-name body already implied "the session is in your history" — without that surrounding context the confirm needs to carry the reassurance itself).
- Two buttons, safe-primary first, danger below — matching `End session early?`:
  - Primary: `Never mind` (closes the modal, no write).
  - Danger: `Yes, skip` (calls the same `handleConfirmSkip` path that exists today; writes the skipped stub via `skipReview()` and routes to `/complete/{execId}`).
- `Esc` key closes the modal (same handler as `SoftBlockModal`).
- The `Skip review` link inside the card still shows the same label and still uses `variant="link"` so the visual entry point doesn't change — only the confirm surface does.

**Component shape.**

- `SkipReviewModal` is a new file in `app/src/components/` (sibling to `SoftBlockModal.tsx` and `ResumePrompt.tsx`), not under `components/home/`, because the modal is *not* a home-card variant — it is a destructive confirm that happens to be triggered from a Home card today. Future surfaces that need to skip a review (e.g., a deep-link recovery path) can mount the same modal.
- `ReviewPendingCard` simplifies: drop the `confirmingSkip`, `onConfirmSkip`, `onCancelSkip` props. Card now has just `data`, `onFinish`, `onSkip`. The `Skip review` link calls `onSkip` directly; the parent owns the modal.
- `HomePrimaryCard`'s `review_pending` variant simplifies in lockstep: `confirmingSkip`, `onConfirmSkip`, `onCancelSkip` move out of the discriminated-union prop shape.
- `HomeScreen` keeps the existing `confirmingSkip` boolean state and the existing `handleRequestSkip` / `handleConfirmSkip` / `handleCancelSkip` callbacks — only the *render* moves: `confirmingSkip === true` now mounts `<SkipReviewModal>` at the screen root next to `<SoftBlockModal>`, instead of feeding into the card.

**Tests touched / added.**

- `app/src/components/__tests__/HomePrimaryCard.test.tsx`: drop the two confirm-shape tests on `review_pending` (one for the idle Skip-review tap, one for the confirming-state buttons); replace with a single shape test that asserts the card renders only the `Finish review` and `Skip review` controls and never renders any inline confirm-row buttons.
- `app/src/screens/HomeScreen.test.tsx`: assertions update to find a `role="dialog"` with name matching `/skip review\?/i` after the first `Skip review` tap, and to query the modal's `Yes, skip` / `Never mind` buttons by role instead of inside the card.
- New: `app/src/components/__tests__/SkipReviewModal.test.tsx` — `Esc` closes via `onCancel`, primary `Never mind` closes via `onCancel`, danger `Yes, skip` calls `onConfirm`, modal carries `role="dialog"` + `aria-modal="true"` + `aria-labelledby`.
- `app/src/lib/__tests__/copyGuard.phase-c-surfaces.test.tsx`: the existing `HomePrimaryCard - all variants` block renders the `review_pending` variant in two states (idle + confirming-skip) — drop the confirming-skip render. Add a separate render of `SkipReviewModal` that gets scanned by `assertClean`. Net: one fewer render in `HomePrimaryCard`, one more render of the new modal, no copy regressions.

### `R13` — Settings investment footer

**Where:** `app/src/screens/SettingsScreen.tsx`, `app/src/services/session/queries.ts` (new query), `app/src/services/session/index.ts` (re-export), `app/src/lib/format.ts` (new helper).

**Surface.** A one-line row in the `SettingsScreen` footer, between the existing `About local storage` body section and the privacy promise (`Your data stays on this device.`). Reads:

```
Logged: 3 sessions · 0:42 total
Your data stays on this device.
Build {sha} · {date}
```

**Copy.**

- `Logged: 1 session · 0:11 total` (singular for `count === 1`).
- `Logged: 5 sessions · 1:23 total` (plural for `count > 1`).
- The duration is rendered as `H:MM` (zero-padded minutes only — hours never zero-padded). Same convention as `formatTime()` in `lib/format.ts`. `0:42` for 42 min; `1:00` for 60 min; `12:30` for 12 h 30 min.
- The line is hidden entirely when `count === 0`. A fresh install / first-week-of-use never renders this row (Shibui — quiet absence is correct when there is nothing to mirror back).

**Source-of-truth wiring.**

- New query `getSessionTallySummary(): Promise<{ count: number; totalMinutes: number }>` in `app/src/services/session/queries.ts`. Reads `getTerminalExecutionLogs()` (already exists), filters with `isTerminalSession` (already exists; excludes `discarded_resume` stubs per `A8`), counts the result, and sums `Math.max(1, Math.round((endedAt(log) - log.startedAt) / 60_000))` per session — same arithmetic that `formatDurationLine()` uses for individual rows so the per-row sum matches the footer total exactly.
- Re-exported from the existing `services/session` barrel.
- Consumed by `SettingsScreen` via a `useEffect` + `useState` pair that runs once on mount (Settings is a leaf screen with no live-update requirement; a single-shot read is sufficient). Errors fail quiet — if the query throws, the footer line simply hides for this render. `isSchemaBlocked()` is the only error path that would reach this surface, and the schema-blocked overlay already owns that UI.
- New helper `formatTotalDurationLine(minutes: number): string` in `lib/format.ts`. Returns `"H:MM"` (zero-padded minutes) so multiple consumers (this footer plus any future surface that wants a total-minutes string) can share the format. Pure, testable in isolation.

**Why above the privacy promise, not below.** The privacy promise (`Your data stays on this device.`) is the existing footer canon and the most-personal sentence on the screen. The build-id row is metadata. The investment footer sits between them in the rhythm "sessions you've put in → privacy promise → build metadata," which reads as most-personal-first and lets the investment line carry through to the canonical footer voice without competing with it. The reconciled list calls for "near Settings"; this placement satisfies that without elevating the line above the privacy line.

**Tests added.**

- New: `app/src/screens/__tests__/SettingsScreen.investment-footer.test.tsx`:
  - With zero terminal sessions: the row is **not** rendered (no `data-testid="settings-investment-footer"` element).
  - With one completed session of 11 min: renders `Logged: 1 session · 0:11 total` (singular form, exact format).
  - With three sessions (mixed `completed` + `ended_early`, total 42 min): renders `Logged: 3 sessions · 0:42 total` (plural form).
  - Discarded-resume stubs are **not** counted (seeds a `discarded_resume`-flagged log alongside two real terminal logs; asserts count is `2`, not `3`).
- New: `app/src/lib/__tests__/format.totalDurationLine.test.ts` — pure helper tests covering `0` minutes (`0:00`), under-an-hour (`0:42`), exactly-one-hour (`1:00`), and over-an-hour (`12:30`).
- New: `app/src/services/session/__tests__/getSessionTallySummary.test.ts` — query-level test. Seeds a mix of `completed`, `ended_early`, `discarded_resume`, and `paused` execution logs. Asserts the count equals only the terminal-non-discarded subset and the totalMinutes equals the sum of `formatDurationLine`-equivalent minutes per session.

## Items demoted (recorded for next-pass auditors)

### `R7` — `Beach Prep Three` truncate-with-expand

**Reconciled-list framing:** "Truncate-with-expand pattern for numbered warm-up steps (Beach Prep Three blob)."

**Why demoted.** Two intervening pieces of work make this no longer the right fix:

1. **The underlying "blob" condition no longer holds.** `d28 Beach Prep Three` was reformatted on 2026-04-21 (Tier 1a content polish r3) so its `courtsideInstructions` now read as numbered lines (`1. Bounce-step plus arm circles…` / `2. Side-shuffle…` / `3. Two-foot lateral hops…`) — the same enumerated-step pattern Seb's `d26 Lower-body Stretch Micro-sequence` walkthrough fix introduced. The "still renders as a blob" critique in the trifold predates that reformat.
2. **The 2026-04-22 Transition parity pass deliberately removed truncate-with-expand from `TransitionScreen`.** That pass's authority note: warm-up / wrap blocks read better as one short, scannable list than as a "tap to read more" affordance, because the user is already in a 2 m courtside read of the screen and an expand-collapse adds a tap they have to think about. Re-introducing the pattern on the same content surface that the parity pass deliberately calmed would be a direct regression.

**Status:** demoted. If a future founder-use-ledger entry surfaces *new* evidence (e.g. a partner sees the numbered list as too long), revisit then.

### `R14` — Accent color demotion across non-action surfaces

**Reconciled-list framing:** "Accent color demotion across non-action surfaces."

**Why demoted from this pass.** Audit-class scope. The task touches every non-CTA surface across HomeScreen, RunScreen, TransitionScreen, ReviewScreen, CompleteScreen, SettingsScreen, and the per-card components — that exceeds the editorial-class envelope this plan honors and would benefit from being scoped as a focused color-token audit pass. A separate audit-class plan should:

1. Inventory every non-action use of `text-accent` / `bg-accent` / `border-accent`.
2. Decide per-instance whether the accent is doing real signaling work or decorative work.
3. Replace decorative uses with neutral tokens (`text-text-secondary`, etc.).

**Status:** deferred to a separate plan. Not blocking D91.

## Items previously shipped today (recorded for traceability)

### `d26 Lower-body Stretch Micro-sequence` cooldown copy

**What shipped:** glosses for `hip flexor` (front of upper thigh), `half-kneel` (one knee on the ground, other foot in front), and the calf / hamstring step descriptions sharpened. The 2026-04-26 founder-use-ledger entry surfaced the gap when Seb's pair walkthrough partner asked what those terms meant mid-cool-down.

**Where:** `app/src/data/drills.ts`, `d26.courtsideInstructions`.

**Commit:** `cd3b01e` (today's dogfeed-sweep batch). Recorded here so this plan tracks all editorial-class work done on the open Tier 1b reconciled-list items today.

## Out of scope

- New drill records (founder-use-ledger trigger required per the authoring-budget cap; a Tier 1b drill-authoring wave shipped earlier today and consumed the cap available at this point).
- Persistence-layer changes (Dexie stays at v5).
- Any change to the *behavior* of skipping a review (the `skipReview()` write path, the `/complete` route, the `expireStaleReviews` 2 h cap) — only the confirm UI changes.
- Any change to the existing `SoftBlockModal` (the modal that fires on a non-review CTA tap with a review pending). It already has the right shape; the new `SkipReviewModal` is a sibling, not a refactor.
- Any change to the `ResumePrompt` discard-confirm. It uses an inline two-step row inside the modal because the modal is *already* the safety surface; no nested modal needed.

## Verification plan

- App: `npm run typecheck && npm run lint && npm run test -- --run` from `app/`.
- Agent docs: `bash scripts/validate-agent-docs.sh`.
- Catalog/posture: bump `docs/catalog.json` `last_updated` and `repo_state.posture` to record the 2026-04-27 polish-pass ship; bump `docs/milestones/m001-solo-session-loop.md` `last_updated`; `AGENTS.md` Current State posture line gets a one-clause append referencing this plan; `docs/research/founder-use-ledger.md` gets a same-day pointer entry.

## Status log

- 2026-04-27 — plan authored. Two-item bundle (`R11` + `R13`); two demoted items recorded (`R7`, `R14`); one already-shipped item recorded (`d26` cooldown copy).
- 2026-04-27 — **shipped.** `R11` lifted Skip-review confirm into the new centered `SkipReviewModal` (role=dialog + aria-modal + aria-labelledby; `Esc` closes; safe-primary `Never mind` first, danger `Yes, skip` below — matches `End session early?`). `ReviewPendingCard` simplified to drop `confirmingSkip` / `onConfirmSkip` / `onCancelSkip`; `HomePrimaryCard.review_pending` variant simplified in lockstep; `HomeScreen` mounts the modal at root next to `SoftBlockModal`. `R13` added `getSessionTallySummary()` (count + summed minutes; mirrors `formatDurationLine` per-session math; excludes `discarded_resume` via `isTerminalSession`) and `formatTotalDurationLine(minutes)` helper, then wired the `Logged: N session{s} · H:MM total` row above the privacy line on `SettingsScreen`, gated on `count > 0`. Verification: `npx tsc --noEmit -p tsconfig.app.json` clean, `npm run lint` clean, `npm test` 824 / 824 (101 files) green, `bash scripts/validate-agent-docs.sh` passed. New tests: `SkipReviewModal.test.tsx` (5), `format.totalDurationLine.test.ts` (8), `getSessionTallySummary.test.ts` (5), `SettingsScreen.investment-footer.test.tsx` (4); existing tests touched: `HomePrimaryCard.test.tsx`, `HomeScreen.test.tsx`, `copyGuard.phase-c-surfaces.test.tsx`.
