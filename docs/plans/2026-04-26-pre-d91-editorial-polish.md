---
id: pre-d91-editorial-polish-2026-04-26
title: "Pre-D91 editorial polish (2026-04-26)"
type: plan
status: draft
stage: validation
authority: "Editorial-class polish bundle drawn from the 2026-04-26 deep UX review (`docs/design/reviews/2026-04-26-agent-ux-review.md`). Walkthrough-evidenced + agent-evidenced; not founder-session-trigger-gated, so scope is strictly constrained to *editorial-class* per the 2026-04-22 adversarial-memo authoring-budget discipline (see `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §Authoring-budget cap): copy, typography, conditional renders, small visual fixes, and one build-time identifier wiring for D91 field-test debugging. No new drill records. No metadata schema changes. No persistence-behavior changes. No new archetype variants. No SetupScreen toggles. No Dexie migrations."
summary: "Six-item editorial-class polish bundle, the third successive pass after 2026-04-22 (six items) and 2026-04-23 (four items). Drops 3 of the 9 items originally batched in the 2026-04-26 review (`F1`, `F3`, `F4`) on re-reading the actual source — `F1` and `F3` are weaker than framed (the H1 weight is consistent with the app, the BackButton is already 44px, and quietness is intentional Shibui), and `F4` is stale (the 2026-04-23 recency reword removed the second `Yes/No` pair so the muscle-memory risk no longer exists). Six items remain: `F11` review-pending eyebrow voice, `F12` recent-workouts row collision, `F7` Good-passes `0/0` placeholder, `F9` `Completed session N` ordinal redundancy, `F10` `Today's verdict` solo-eyebrow redundancy (kept for pair as the only pair-context signal), `F14` build-id row in Settings for D91 field-test build identification. Estimated effort 3–5 hours focused; ordering goes lightest-touch first so each commit is independently shippable."
last_updated: 2026-04-26
depends_on:
  - docs/milestones/m001-solo-session-loop.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/plans/2026-04-22-partner-walkthrough-polish.md
  - docs/plans/2026-04-23-walkthrough-closeout-polish.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/design/reviews/2026-04-26-agent-ux-review.md
  - docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md
  - docs/research/founder-use-ledger.md
related:
  - docs/research/brand-ux-guidelines.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
  - .cursor/rules/courtside-copy.mdc
decision_refs:
  - D86
  - D91
  - D119
  - D125
  - D129
  - D130
  - D132
---

# Pre-D91 editorial polish (2026-04-26)

## Agent Quick Scan

- **Editorial-class only.** Six items. No drill records, no metadata schema changes, no persistence behavior changes, no new archetype variants, no SetupScreen toggles, no Dexie migrations. Same discipline as the 2026-04-22 (six items) and 2026-04-23 (four items) polish passes.
- **Walkthrough + agent-evidenced; not founder-session-trigger-gated.** Source is the 2026-04-26 deep UX review (`docs/design/reviews/2026-04-26-agent-ux-review.md`), which performed a screen-by-screen pass after the 2026-04-23 closeout-polish landed. The 2026-04-22 adversarial-memo authoring-budget cap remains: editorial-class fixes inside the courtside-copy / typography / conditional-render envelope can ship; Tier 1b authoring-budget items still require founder-session-trigger evidence.
- **Six items**, drawn from the dated review. Numbering preserves the review's `F#` indices so cross-reference stays sharp.
  - `F11` — Review-pending card eyebrow on Home: align voice with `aria-label="Review pending"` and the SoftBlockModal "review pending for {planName}" voice.
  - `F12` — Recent-workouts row: rename the `'partial'` focus-fallback rendered label `Partial` → `Mixed` so a partially-completed session whose focus inference fell back doesn't render as the visually-jarring `Yesterday Partial Partial`.
  - `F7` — Good-passes input: render `0` values as a placeholder (`–`) instead of a literal `"0"` so an untouched Review screen does not appear to have prefilled answers.
  - `F9` — Complete reason copy: drop the `Completed session N: ` / `Completed session N. ` ordinal prefix; the user does not need to be told this was their thirteenth session.
  - `F10` — Complete eyebrow: drop the `Today's verdict` solo eyebrow (the giant verdict word below already says it); keep `Today's pair verdict` for pair sessions because that string carries the only pair-context signal on the screen.
  - `F14` — Settings: a small monospace `Build {sha} · {date}` row in the footer area, sourced from a Vite `define`-injected constant. D91 field-test debugging hygiene; cheap.
- **Estimated effort: 3–5 hours focused.** Commits are independent; the order below goes lightest-touch first so any item can ship without the others.
- **What this pass does NOT do.** Tier 1b drill authoring (per the founder-use ledger trigger), Tier 1b unlocks gated by the founder-session trigger, schema or persistence changes, anything that touches the Dexie migration story, anything that introduces new copy posture states. Listed in §Out of scope.
- **Pair-first vision-stance alignment.** Per `D132`, each item is checked for solo-vs-pair voice. `F10` is the most pair-sensitive: dropping the eyebrow on solo while keeping the pair version is the explicit pair-first call-out (the eyebrow becomes a meaningful signal when it appears, instead of decorative noise on every screen). The other five items are pair-neutral.

## Why this plan exists

The 2026-04-26 deep UX review (`docs/design/reviews/2026-04-26-agent-ux-review.md`) is the third screen-by-screen pass after the 2026-04-22 and 2026-04-23 polish bundles. After a fresh re-read of the actual source for each finding, three of the nine originally batched items dropped on evidence (see §Trimmed-on-re-read below); six remain, and they fit the same editorial-class envelope the previous two passes used. Shipping them now keeps Seb's active usage on a cleaner product through the 2026-05-21 `D130` Condition 3 final-close window (provisional pass with the 2026-04-22 unprompted T+1-day open; final read-out 2026-05-21).

The discipline this plan honors is "editorial polish supplements core, it does not replace it." The named anti-pattern from the 2026-04-22 trifold synthesis is **polish-velocity substitution** — making cosmetic fixes feel like progress while core M001 functionality stalls. This plan keeps shipping the cheap editorial improvements *because* they fit inside an authoring budget that the active Tier 1b drill authoring work (founder-use ledger trigger fires) is the real-progress complement to. Tier 1b authoring is the next-priority work; this pass is hours-of-effort preparation that lets the Tier 1b cohort run on a calmer surface.

## Gate status

- **Authoring-budget cap status** (per `docs/plans/2026-04-20-m001-adversarial-memo.md` §5): this plan authors **zero new drill records**. The cap remains at its current level for future Tier 1b waves; this plan does not consume any.
- **Tier 1b founder-session trigger** (per `docs/plans/2026-04-20-m001-tier1-implementation.md`): **NOT required for this plan** because all six items are editorial-class fixes supplementing Tier 1a content, not Tier 1b scope. The trigger is now firing for *drill authoring* (per the latest founder-use ledger entry) but that is a parallel work-stream tracked under its own plan.
- **`D130` Condition 3** (partner unprompted open within 30 days): **provisional pass** with Seb's 2026-04-22 unprompted T+1-day open. Final read-out 2026-05-21. This plan does not implicate the gate; it lands editorial polish that the partner is already actively using past.
- **`D86` (no warning iconography)**: all six items pass — no red, no warning glyphs, no alarm voice introduced.
- **`D91` (field-test cohort)**: `F14` directly serves the D91 field-test by giving the founder a copy-paste build identifier when a tester reports a bug.

## Source-of-truth check (before scope)

Per `AGENTS.md` source-of-truth order, this plan honors the following ordering:

1. `docs/vision.md` — Shibui restraint, low typing, courtside glanceability. All six items pass.
2. `docs/decisions.md` — `D86` no-warning, `D91` field-test gate, `D119` v0b feature-complete posture, `D125` pair-first vision (`F10` is the only pair-sensitive item; handled), `D129` Safety screen post-physio review wording (untouched here), `D130` `D130` Condition 3 (unaffected), `D132` pair-first stance check.
3. `docs/prd-foundation.md` — single-loop discipline; no new surfaces.
4. `docs/roadmap.md` — sits inside the validation phase next to Tier 1b drill authoring.
5. `docs/milestones/m001-solo-session-loop.md` — supplements Tier 1a content.
6. `docs/specs/` — n/a; no spec changes.
7. `docs/research/`:
   - `brand-ux-guidelines.md` — voice, typography, color, copy invariants. `F11` and `F9` are voice-alignment fixes against this doc.
   - `japanese-inspired-visual-direction.md` — restraint and Ma. `F10` is a direct Ma fix (drop redundant eyebrow).
   - `outdoor-courtside-ui-brief.md` — outdoor legibility floor. None of the items reduce contrast or legibility.
   - `partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` — `F11` and `F12` are continuations of the reconciled-file's voice work.
   - `founder-use-ledger.md` — confirms Tier 1b trigger is now firing for drill authoring, which this plan does *not* consume.
8. `docs/ops/` — n/a.
9. `AGENTS.md` — repo contract; followed.
10. `CLAUDE.md` — pointer surface; followed.

## Scope

### Item 1 (`F11`): Review-pending card eyebrow voice

**What**: Change the eyebrow line on the Home review-pending card from `Review your last session` to `Review pending`.

**Why**: The card's `aria-label` is already `"Review pending"`, the SoftBlockModal already says `"You have a review pending for {planName}"`, and the card's primary button is already `Finish review`. The visible eyebrow is the only line out of step with that voice. `Review your last session` reads as a polite invitation; `Review pending` reads as the obligation it actually is. Same surface area, sharper signal.

**Pair-first check**: voice-neutral; no pair-vs-solo concern.

**Files touched**:
- `app/src/components/home/ReviewPendingCard.tsx` — change the eyebrow `<p>` from `Review your last session` to `Review pending`.
- `app/src/components/__tests__/HomePrimaryCard.test.tsx` — update any assertion that matches the old eyebrow string. The existing aria-label assertion (`/review pending/i`) stays valid.
- Any other Home / ReviewPendingCard test that asserts on the literal eyebrow string. Quick grep: `Review your last session` appears only in the component and possibly one snapshot/text matcher.

**Files NOT touched**:
- The `aria-label` (already `"Review pending"`).
- The button label `Finish review` (already correctly named).
- The skip path (`Skip review` / `Never mind` / `Yes, skip` — unchanged).
- The plan-name line below the eyebrow (carries the session identity; unchanged).

**Verification**:
- Build the app, navigate to Home with a pending review seeded; visually confirm `Review pending` reads as the eyebrow.
- `pnpm --filter app test` passes.
- Snapshot tests if any update with the new string.

**Risk**: very low. Single-string change. Reversible in seconds.

---

### Item 2 (`F12`): Recent-workouts `'partial'` fallback rename

**What**: When `inferSessionFocus` falls back to `'partial'`, the rendered label in `RecentSessionsList` collides with the `'Partial'` status column to produce `Yesterday Partial Partial`. Rename the rendered fallback label `Partial` → `Mixed`. Keep the internal enum value `'partial'` unchanged.

**Why**: Self-described in `app/src/domain/sessionFocus.ts` lines 60–68: "the fallback means 'we couldn't pin a focus' which is close enough to 'the session ran partial' that either read is informative rather than wrong." That rationale is honest but misses the visual cost: a partner-walkthrough tester reading `Yesterday Partial Partial` reads it as a duplicate-render glitch first, and only later reasons through the two-column-meaning explanation. `Mixed` matches the actual semantic ("we couldn't pin a single focus → multiple skills represented") and cannot collide with `Done` / `Partial` regardless of completion state.

**Pair-first check**: voice-neutral.

**Files touched**:
- `app/src/domain/sessionFocus.ts` — change the `case 'partial':` branch in `focusLabel()` from `return 'Partial'` to `return 'Mixed'`. Update the surrounding comment block (lines 60–68) to reflect that the collision is now resolved by label-divergence rather than tolerated.
- `app/src/domain/__tests__/sessionFocus.test.ts` — update the expectation for the `'partial'` case from `Partial` → `Mixed`.

**Files NOT touched**:
- The `SkillFocus | 'partial'` type union (`'partial'` stays the internal key; only the rendered label changes).
- Any persisted Dexie value (this is a render-time function with no persistence).
- `RecentSessionsList.tsx` (consumes `focusLabel` directly; no call-site change needed).
- Any reading of "good passes" partial counts (separate concept, unaffected).

**Verification**:
- `pnpm --filter app test app/src/domain/__tests__/sessionFocus.test.ts` passes after the expectation update.
- Manual: seed a session whose blocks don't satisfy the focus-inference happy path (e.g. a Recovery block + a single Movement block where inference falls back), observe the recent-workouts row reads `Yesterday Mixed Partial` instead of `Yesterday Partial Partial`.

**Risk**: very low. Single label string change, single test change.

---

### Item 3 (`F7`): Good-passes `0/0` placeholder

**What**: On the Review screen, when both `Good` and `Total` fields are at their initial value `0`, display them as a placeholder (`–` or empty with a `placeholder="0"` hint) instead of a literal typed `"0"`. The current rendering shows two large `0` digits centered in the input, which on first glance reads as "the user already entered zero" rather than "no value yet."

**Why**: `PassMetricInput.tsx` derives the input's display string as `String(value)`, so when `value === 0` the field renders the literal `"0"`. On a freshly-loaded Review screen this looks like a typed value rather than an empty input. Several review surfaces in the v0b build use placeholder-on-empty patterns (e.g. notes textarea); this is the one place that doesn't.

**Pair-first check**: voice-neutral.

**Implementation note** — this one is *the* item in the bundle that requires nontrivial care. The `NumberCell` component holds `text` as local state synced from `value` via a `useEffect`. The cleanest way to show a placeholder for "untouched 0" without breaking the existing typing UX is:
- Initialize `text` as `value === 0 ? '' : String(value)` (instead of always `String(value)`).
- In the `useEffect`, only set `text = String(value)` when `value !== 0` OR when the local `text` is non-empty (so we don't fight a parent that already committed `0`).
- Add a `placeholder="0"` attribute on the `<input>`.
- Keep the existing `commit()` behavior: empty string commits to `0`. This means the user can still type, blur, and end at `0` — but the placeholder shows when they haven't touched the field.

This is the only item with non-trivial logic risk. Confirm with the existing `PassMetricInput.test.tsx` suite that the empty-string-commits-to-0 invariant still holds.

**Files touched**:
- `app/src/components/PassMetricInput.tsx` — initialize `text` conditionally on `value === 0`; refine the sync `useEffect` to avoid clobbering an empty-text untouched state; add `placeholder="0"`.
- `app/src/components/__tests__/PassMetricInput.test.tsx` — add a test that asserts the `<input>` renders empty (with placeholder `"0"`) when `value === 0` initially. Keep all existing tests green.
- Any Review-screen render test that asserts on the literal `"0"` text in the field — likely a small handful, fix them as you go.

**Files NOT touched**:
- The pass-rate calculation (`rate` only displays when `total > 0`; already correct).
- The `notCaptured` chip behavior (independent).
- `ReviewScreen.tsx` (consumes `PassMetricInput` directly; no caller-side change).

**Verification**:
- All existing tests in `PassMetricInput.test.tsx` and the Review-screen test files pass.
- Manual: load `/review/<id>` on a fresh session; both fields show empty with a placeholder, not a literal `"0"`. Type `7` into Good, press Enter; field commits to `7`. Press Enter on an empty Total field; it commits to `7` (auto-bumped) or `0` per existing semantics.

**Risk**: low-to-moderate. The change is small but threads through three states (initial, edited, blurred-empty). Existing tests cover most of it; the new "untouched-0 renders empty" test is the new contract this item adds.

---

### Item 4 (`F9`): Drop `Completed session N` ordinal

**What**: In `app/src/domain/sessionSummary.ts`, drop the `Completed session N: ` / `Completed session N. ` prefix from the rendered reason copy on Complete. Specifically:
- Line 144: `Completed session ${sessionCount}. One more in the book. ${FORWARD_HOOK}` → `One more in the book. ${FORWARD_HOOK}`
- Line 146: `Completed session ${sessionCount}: ${passAttemptStatsLine(...)}` → `${passAttemptStatsLine(...)}`

**Why**: The 2026-04-22 disambiguation pass renamed the prefix to `Completed session N` to fix a "Session 13" / "13 attempts" misread. That fix worked, but the deeper question — does the user need the ordinal at all? — was deferred. The 2026-04-26 review observes that a self-coached amateur on a courtside Complete screen does not consult their session count to decide what to do next: they read the verdict, the rate, the reason, and tap Back to home. The ordinal is informational backfill, not actionable. Dropping it removes one phrase from a screen that should already feel maximally restrained (the brand's single Jo-Ha-Kyu "kyu" beat per `F11` of the prior plan). The lifetime session-count signal is still surfaced through `formatDayName` rolling-recency on the Home recent-workouts row; it has not been deleted, only moved off the verdict surface.

**Pair-first check**: voice-neutral; the prefix was identical in solo and pair already.

**Files touched**:
- `app/src/domain/sessionSummary.ts` — edit lines 144 and 146 to drop the prefix. Optionally rename the `sessionCount` parameter to drop it from `composeDefaultReason`'s signature if no other use remains; verify by grepping the call sites.
- `app/src/domain/__tests__/sessionSummary.test.ts` — the relevant cases assert on the rendered reason string. Update each affected `expect` to match the new copy.

**Files NOT touched**:
- The `countSubmittedReviews()` data path (still valuable for analytics / future surfaces).
- The verdict word and verdict glyph (the Jo-Ha-Kyu hero — unchanged).
- The `passAttemptStatsLine` formatter (delivers `7 good passes today out of 22 attempts.` — unchanged; this is the line that becomes the head of the reason string post-edit).
- The `FIRST_SESSION_NO_ATTEMPTS_REASON` (already does not contain the ordinal — `First one's in the book. ${FORWARD_HOOK}`).

**Verification**:
- `pnpm --filter app test app/src/domain/__tests__/sessionSummary.test.ts` passes.
- Snapshot/copy-guard test in `app/src/screens/__tests__/CompleteScreen.copy-guard.test.tsx` updated for the new reason strings.
- Manual: complete a session with ≥1 attempt; reason reads `7 good passes today out of 22 attempts. Ready when you are.` Complete a session with 0 attempts (and `sessionCount > 1`); reason reads `One more in the book. Ready when you are.`

**Risk**: low. Two string edits + matching test updates.

---

### Item 5 (`F10`): Drop `Today's verdict` eyebrow on solo, keep on pair

**What**: In `app/src/screens/CompleteScreen.tsx`, conditionally render the `<h1>` page-title eyebrow only when `summary.header === "Today's pair verdict"` (pair). On solo, the header three-column row still mounts (SafetyIcon + spacer for layout balance) but the centered `<h1>` slot is empty.

**Why**: The eyebrow was hoisted into the top bar in the 2026-04-21 second-pass field-test fix to clean up a weirdly-padded empty band. That fix was correct at the time. The 2026-04-26 review observes that on a solo session, the eyebrow `Today's verdict` and the giant `<h2>` verdict word below say the same thing — the eyebrow is a label-on-the-data the data already labels itself. Dropping it on solo lets the verdict word stand alone, which is more Ma. On pair, the eyebrow `Today's pair verdict` carries the only pair-context signal on the screen — the verdict word ("Keep building" / "Lighter next" / "No change") does not say "pair" anywhere. Keeping the pair eyebrow preserves that signal.

This is the one item in the bundle where the fix is conditional on pair-vs-solo, which is exactly the `D132` pair-first vision-stance alignment in action: the eyebrow becomes information when it carries information, and absent when it doesn't.

**Pair-first check**: this *is* the pair-first item. Solo is silenced; pair is kept. The asymmetry is the point.

**Files touched**:
- `app/src/screens/CompleteScreen.tsx` — guard the `<h1>` render by `summary.header === "Today's pair verdict"`. Document the asymmetry inline so a future reader does not "fix" the solo-empty branch by adding a redundant solo eyebrow.
- `app/src/domain/sessionSummary.ts` — no change to `header` derivation; both strings still emit. The omission is render-time, not domain-time. (Rationale: the `header` field is still useful for screen readers / future surfaces. Hardening the domain layer to not emit on solo would be a behavior change that ripples.)
- `app/src/screens/__tests__/CompleteScreen.summary.test.tsx` — update the solo case's expectation: the page-title eyebrow is absent in the rendered DOM, replaced by the heading-outline-balancing spacer. The pair case's expectation (eyebrow present, reads `Today's pair verdict`) stays.
- `app/src/screens/__tests__/CompleteScreen.copy-guard.test.tsx` — drop or amend any assertion that requires the solo eyebrow string to be in the document.

**Files NOT touched**:
- The verdict glyph + word + reason paragraph (the visual hero — unchanged).
- The Session recap card (Drills completed / Good passes / Effort rows — unchanged).
- The `Back to home` CTA + `SavedCheckIcon` + `Why is this?` link (footer — unchanged).
- The pair `Today's pair verdict` eyebrow (kept).

**Heading-outline note**: with the solo eyebrow gone, the page's only `<h1>` is removed on solo. The verdict `<h2>` continues to announce via `aria-live="polite"`. Two options to preserve the heading outline: (a) accept the verdict `<h2>` as the de facto page heading on solo and keep the markup as-is (cleaner, slightly looser semantic), or (b) bump the verdict `<h2>` to `<h1>` on solo and keep `<h2>` on pair (sub-heading under the pair eyebrow). Pick (a) for simplicity — the screen has a single heading on solo, which is honest, and the heading-outline-validity question is moot for a single-heading page. Document the choice inline.

**Verification**:
- `pnpm --filter app test` passes after the test updates.
- Manual: complete a solo session, observe no eyebrow above the verdict glyph (just the SafetyIcon left + balancing spacer right). Complete a pair session, observe `Today's pair verdict` eyebrow present.
- Accessibility: VoiceOver / TalkBack manual pass — verdict word still announces; pair eyebrow announces in pair sessions only. No "missing heading" warning expected from heading-outline tools because (a) is the chosen handling.

**Risk**: low-to-moderate. The asymmetric render is the kind of conditional that future contributors might "fix" by re-adding the solo eyebrow. The inline documentation comment is the load-bearing artifact that prevents that regression.

---

### Item 6 (`F14`): Build-id row in Settings (D91 field-test debugging)

**What**: Inject a build-time identifier (short SHA + ISO date) via Vite `define`, expose it as a typed export from a new `app/src/lib/buildInfo.ts`, and surface it as a small monospace row inside or directly below the `<ScreenShell.Footer>` of the Settings screen.

**Why**: When a D91 field-test tester reports "the timer skipped a beat at the end of block 2," the founder's first triage question is "what build are you on?" Today there is no answer the tester can give without the founder going to Cloudflare and cross-referencing deploy timestamps. A user-visible build identifier in Settings — small, monospace, copyable on press — turns that triage step into one tap. Same hygiene as a stack-trace's `version` line.

The injection happens at Vite build time so production deploys carry the real SHA + date. Development builds carry `dev` placeholders so local work doesn't fail to build when git state is unusual (worktree / detached HEAD / etc).

**Pair-first check**: voice-neutral; same row regardless of voice.

**Files touched**:
- `app/vite.config.ts` — add a `define` block that injects two constants: `__VOLLEYCRAFT_BUILD_SHA__` (string, short SHA from `git rev-parse --short HEAD` at build time, falling back to `'dev'` if the command fails) and `__VOLLEYCRAFT_BUILD_DATE__` (string, ISO `YYYY-MM-DD` at build time). Both are stringified via `JSON.stringify(...)` so they're safe to drop into source as identifiers.
- `app/src/lib/buildInfo.ts` (new file) — declare and export `BUILD_SHA: string` and `BUILD_DATE: string` consts that pull from the injected globals (with `declare global` ambient typing for both globals so TypeScript knows them). Default to `'dev'` and `'unknown'` if either is missing at runtime (defensive — a misconfigured CI shouldn't crash the app).
- `app/src/screens/SettingsScreen.tsx` — render a small footer row, inside or just below the existing `<ScreenShell.Footer>`. Suggested copy: `Build {BUILD_SHA} · {BUILD_DATE}`. Style: `text-xs text-text-secondary font-mono` (monospace so it reads as a copyable identifier rather than human prose). Position: directly under the existing `Your data stays on this device.` line, with a small gap. No tap behavior in v1 (copy-on-tap is a v2 nicety; v1 just shows the string for the tester to read aloud or screenshot).
- Add a TypeScript ambient declaration so the two `__VOLLEYCRAFT_BUILD_*__` globals are typed. Either add to `app/src/vite-env.d.ts` (if it exists) or include in `app/src/lib/buildInfo.ts` directly via `declare const`.

**Files NOT touched**:
- The PWA manifest (build-id is *not* part of the install identity).
- The Cloudflare Worker config (deploy infra unchanged; the injection is at build time).
- Any persistence (build-id is not stored; it's a static constant).
- Any test setup (the injected globals can be set in `test-setup.ts` to `'test'` / `'test'` to stabilize tests — straightforward).

**Acceptance criteria**:
- A production build (`pnpm --filter app build`) embeds the actual short SHA and date.
- A development build (`pnpm --filter app dev`) embeds `dev` placeholders without erroring on a clean checkout.
- The Settings footer renders the row in human and screen-reader-friendly form.
- Tests pass with stub values injected via `test-setup.ts`.

**Verification**:
- Build the app from a clean checkout: `pnpm --filter app build`. Inspect the produced `dist/assets/*.js` (or use the dev server's source-mapped output) for the literal SHA — confirms the `define` is wired.
- Open `/settings` in the app: confirm the row reads `Build abc1234 · 2026-04-26` (or whatever the real values are at build time).
- Run the test suite: `pnpm --filter app test` — passes with stubbed values.

**Risk**: low. The Vite `define` plugin is the standard mechanism; the worst-case failure is a build error (caught immediately) or a missing constant at runtime (caught by the defensive defaults). The Settings footer addition is single-card minimal — same scope-guardian discipline as the 2026-04-23 `About local storage` sub-section.

**Optional v2** (out of scope for this plan): a one-tap copy-to-clipboard handler on the build row. Defer until a tester actually asks for it.

---

## Implementation order

Lightest-touch first, smallest blast radius. Each item is independently shippable; ordering is an optimization, not a dependency chain.

1. **`F11` Review-pending eyebrow** — single string. ~5 minutes.
2. **`F12` `'partial'` → `Mixed`** — single label + single test. ~10 minutes.
3. **`F9` Drop `Completed session N`** — two string edits + matching test updates. ~20 minutes.
4. **`F10` Solo-eyebrow drop** — conditional render + test updates + heading-outline note. ~30 minutes.
5. **`F7` `0/0` placeholder** — the only item with non-trivial state-management logic. ~45 minutes.
6. **`F14` Build-id wiring** — Vite config + new lib file + Settings row + ambient typing. ~60 minutes.

Total: ~3 hours focused, with a 50% buffer for test churn and verification → 4–5 hours realistic.

## Test obligations

Each item brings its own test deltas; no item is a "no test" change.

| Item | Existing tests touched | New test added |
| --- | --- | --- |
| `F11` | `HomePrimaryCard.test.tsx`, any test asserting on the literal eyebrow string | none |
| `F12` | `sessionFocus.test.ts` (one expectation) | none |
| `F9` | `sessionSummary.test.ts` (multiple `expect` updates), `CompleteScreen.copy-guard.test.tsx` | none |
| `F10` | `CompleteScreen.summary.test.tsx`, `CompleteScreen.copy-guard.test.tsx` | optional: `eyebrow absent in solo, present in pair` if not already expressible from existing cases |
| `F7` | `PassMetricInput.test.tsx` (rendering + commit invariants) | one: `untouched 0 renders empty input with placeholder` |
| `F14` | none directly; `test-setup.ts` set the build-id globals to stub strings | optional: `Settings renders a build-id row` if it adds value beyond happy-path |

## Validation

- `pnpm --filter app lint` clean.
- `pnpm --filter app typecheck` clean.
- `pnpm --filter app test` passes.
- `pnpm --filter app build` produces a production bundle with the build-id injected.
- Manual smoke pass on the iPhone-class viewport browser (390 × 844 CSS px) for each touched surface: Home (review-pending), Home (recent-workouts row with a falling-back focus session), Review (`0/0` placeholder), Complete (solo eyebrow absent + pair eyebrow present), Settings (build-id row legible + the `About local storage` sub-section unchanged).
- `bash scripts/validate-agent-docs.sh` — ensures this plan is registered in `docs/catalog.json` and routing is clean.

## Trimmed-on-re-read

Three of the nine items the 2026-04-26 review originally batched did not survive the source re-read for this plan. Documenting *why* each fell out so the trim is auditable.

### `F1` — Skill-level H1 weight + Ma — DROPPED

**Original framing**: the onboarding `<h1>` reads quiet for a first-screen welcome; could use more visual weight + Ma.

**Re-read evidence** (`app/src/screens/SkillLevelScreen.tsx` lines 159–166): the `<h1>` is `text-xl font-semibold tracking-tight text-text-primary` — identical to every other `<h1>` in the app (Setup, Safety, Settings, Review). The header padding `pt-8 pb-4` is generous and provides intentional Ma above the headline. The five option cards below sit in a calm `gap-4` rail.

The "feels quiet" reaction was me wanting a louder welcome on cold-state. A louder onboarding `<h1>` is the *opposite* of the brand's Shibui voice and would create a typography exception for one screen that breaks consistency across the rest. The brief is explicit (`docs/research/japanese-inspired-visual-direction.md`, `brand-ux-guidelines.md` §1.4): restraint is the voice.

**Conclusion**: not a fix; a self-correcting taste preference. Dropped.

### `F3` — Back-link tap target — DROPPED (including the narrowed Settings-only version)

**Original framing**: top-left back-links on Setup / Safety / Review / Settings feel small and hard to find on a sun-lit phone.

**Re-read evidence** (`app/src/components/ui/BackButton.tsx`): the shared primitive renders at `min-h-[44px] px-2`. That is exactly the iOS Human Interface Guidelines minimum tap target. The visual restraint (accent text, no surface, no border) is the intentional Shibui treatment for a non-primary affordance — the corner-back is a *quiet escape hatch by design*, not a dropped requirement.

The narrowed version I considered was "Settings could add a footer 'Back to home' primary button since Settings is leaf-only nav." Reading `app/src/screens/SettingsScreen.tsx`: Settings already has a populated footer (`Your data stays on this device.`), and adding a *primary* CTA below a settings card would make the leaf-most surface in the app the visually-loudest one, fighting the calm. The corner BackButton works correctly here.

**Conclusion**: the tap target is already correct; the visual quietness is intentional; the narrowed version doesn't earn its keep. Dropped.

### `F4` — Safety muscle-memory two `Yes/No` pairs — DROPPED (stale)

**Original framing**: two `Yes/No` pairs in immediate succession on Safety create muscle-memory misfire risk.

**Re-read evidence** (`app/src/screens/SafetyCheckScreen.tsx` lines 280–399): the recency band is now four chips (`Today / Yesterday / 2+ days ago / First time`), not a `Yes/No` pair. Only the pain question is a `Yes/No`. The muscle-memory hazard the 2026-04-22 review described — two adjacent identical-shaped binary controls — no longer exists post the 2026-04-23 closeout-polish recency reword.

This finding was a carry-over from the 2026-04-22 review I should have re-verified before listing.

**Conclusion**: stale. Dropped.

## Out of scope

- **Tier 1b drill authoring.** Founder-use ledger has triggered drill-authoring work; that is a separate plan and consumes a separate authoring budget.
- **Schema or persistence changes.** None of the six items touch Dexie, the migration story, the schema-blocked overlay, or any persisted shape.
- **New copy posture states.** The three D118 storage postures stay exactly as they are; the `getStorageCopy(posture)` source of truth is unchanged.
- **New SetupScreen toggles.** Same discipline as the prior two passes.
- **Drill metadata schema work.** Belongs in the founder-session-trigger-gated Tier 1b bucket.
- **Visual block-end countdown cue, Persist Net/Wall, Auto-fill training recency, Skip-review confirmation modal, first-session-only verdict string.** All carried into Tier 1b under their own plans.
- **Copy-on-tap behavior for the build-id row** (`F14` v2 nicety). Defer until a tester actually asks for it.

## Adversarial frame: anti-substitution check

The 2026-04-22 trifold synthesis names **polish-velocity substitution** — "making cosmetic fixes feel like progress while core M001 functionality stalls" — as the active failure mode this stage of validation needs to watch for. This plan is six items of cosmetic polish. Why is it not the named failure?

Three checks:

1. **The Tier 1b core work is now active.** The founder-use ledger trigger for drill authoring fires now, and that work is being scoped under its own plan. This polish pass is not a substitute for that plan; it is a separate, parallel, smaller-effort surface-cleanup.
2. **The authoring budget is honored.** Zero new drill records. Zero schema migrations. Zero new persistence states. Six items, all editorial.
3. **Each item is justified by user-visible evidence.** `F11` and `F12` are voice-alignment fixes against established voice contracts (`courtside-copy.mdc`, the SoftBlockModal copy). `F7` is a *real* visual misread observed in the screenshot capture. `F9` and `F10` are restraint-restoration after copy that has accreted across passes. `F14` is unambiguous infrastructure for the D91 cohort.

If the plan ships and Tier 1b drill authoring stalls, that is the substitution failure — and the founder-use ledger plus the next dated review will catch it. If both ship in parallel, the polish passes are doing their job: keeping a partner's daily-driver surface clean while the core moves.

## Authority and rollback

This plan is editorial-class only. Each commit is independently reversible by reverting the specific change. The only item with a non-cosmetic surface footprint is `F14` (Vite `define` injection); reverting `F14` is a single-commit revert of `vite.config.ts` + `lib/buildInfo.ts` + the Settings render row.

## Post-ship amendment

Items added after the original six shipped, discovered during the same-day re-run smoke pass. Recorded as amendments rather than retro-numbered into the original list so the "six items shipped + N amendments" reading stays auditable.

### Item 7 — Drop the redundant `"X:XX left"` progress-bar chip

**Status**: shipped 2026-04-26, same day as the original six.

**Surface**: `app/src/components/BlockTimer.tsx`.

**Trigger**: founder re-run smoke pass at iPhone width on `/run`. The big block timer (`text-[56px]` Phase F10 digits) and the trailing chip read as redundant time strings — `3:53` directly above `3:53 left`. Founder feedback verbatim: "we don't need both."

**Original framing** (2026-04-22 trifold synthesis §A4 / reconciled-list item #8): the pre-ship `h-2` accent-only progress bar read as decoration from 2 m courtside. The fix shipped as a coupled pair:

1. Bar height grew from `h-2` to `h-3` (thicker, reads as a real signal).
2. A trailing `formatTime(remaining) + " left"` chip restated the same value as text.

The chip was framed at the time as a "redundant secondary cue tied to the bar" so the bar's meaning would be unambiguous "even when the digits are out of peripheral focus."

**Re-read evidence**: in the live post-Phase-F10 layout, the digits are `text-[56px]` and sit immediately above the bar in the same vertical thumb-zone. The chip restated `formatTime(remaining)` exactly — the same shape (`X:XX`), the same font face (`font-mono` + JetBrains slashed-zero), in the same vertical column, ~80 px below the digits. The "out of peripheral focus" hedge that justified the chip pre-F10 no longer holds against the lifted digit size; the digits *are* the peripheral read. The chip became the redundant thing that A4 was originally trying to avoid.

**Decision**: keep change (1) — the `h-3` bar is the surviving and load-bearing half of A4. Drop change (2) — remove the chip JSX entirely.

**Restraint discipline**: this is the `D86` no-warning / Shibui voice operating in normal-state UI. Two restatements of the same value across an 80 px column violates the "one read, one place" principle the rest of the surface honors (the verdict word on Complete, the eyebrow on Home, the focal H1 on Setup). Restoring the principle is editorial-class by definition.

**Files touched**:

- `app/src/components/BlockTimer.tsx` — chip JSX removed; row container flattened (the bar no longer needs a `flex` row wrapper); docstring updated to record the reversal and instruct future contributors not to re-add without fresh courtside evidence.
- `app/src/components/__tests__/BlockTimer.progress-chip.test.tsx` → renamed `BlockTimer.progress-bar.test.tsx`; chip-only assertions dropped; bar-thickness, fill-width, paused-frozen-fill assertions kept; one regression-guard test added that asserts the chip is *not* re-introduced.
- `docs/plans/2026-04-26-pre-d91-editorial-polish.md` — this section.

**Validation**:

- The `h-3` bar reads cleanly without a textual gloss at iPhone width — confirmed by smoke at `390 × 844` after the change.
- Lint, typecheck, full test suite pass.
- `BlockTimer.end-countdown.test.tsx` is untouched: it asserts only on `block-timer-digits`, so the digit-flip-on-final-3-seconds invariant is preserved by construction.

**Authority and rollback**: single-component reversion; reverting this amendment is a single commit that re-adds the chip JSX and restores the prior test file. The `h-3` bar height stays in either direction — that part of A4 is not in dispute.

**Adversarial check**: is this polish-velocity substitution? No — the founder's "we don't need both" was a real misread on a real screen; the fix is one component + one test file; the surrounding Tier 1b drill-authoring work is not displaced by this amendment.

### Item 8 — Surface the per-drill tag distribution on the Complete recap

**Status**: shipped 2026-04-27.

**Surface**: `app/src/lib/format.ts`, `app/src/services/review.ts`, `app/src/screens/CompleteScreen.tsx` (recap card).

**Trigger**: founder design pass after Item 7 closeout. The user taps a difficulty chip per main-skill / pressure block on the Transition surface (`Too hard / Still learning / Too easy`, see `D133` and the `PerDrillCapture` component), and that tap *evaporates* from the user-visible flow at session end. The Complete recap shows Session, Drills completed, Good passes, and Effort — but not the tag distribution. The chip taps feel like data extraction with no return read.

**Original framing**: pre-Item-8 the per-drill captures fed two consumers — (a) the legacy session-level Good/Total card on Review (gating its visibility), and (b) the recap aggregation on Complete (preferring summed counts over the session-level fields). The `difficulty` chip itself was *only* persisted into `perDrillCaptures[].difficulty` for the downstream adaptation engine. From the user's perspective the tap had no on-screen acknowledgement.

**Re-read evidence**: confirmed in `app/src/screens/CompleteScreen.tsx` recap `<dl>` lines and `app/src/services/review.ts` `aggregateDrillCaptures` shape — the aggregator exposes `drillsTagged`, `drillsWithCounts`, `drillsNotCaptured`, but no per-tag distribution and no consumer renders the tap counts back to the user.

**Decision**: extend the aggregator with a `tagBreakdown` field (`{ too_hard, still_learning, too_easy }`, three keys exhausting the `DifficultyTag` union) and add a quiet `Difficulty` row to the Complete recap card. The row hides entirely when no chips were tapped (legacy reviews, all-warmup sessions, future skip modes), collapses to `"All <bucket>"` when every tap landed on one chip, and otherwise emits a dot-separated tally ordered by severity (`too_hard` first → `still_learning` → `too_easy`).

**Restraint discipline**: the row sits between Good passes and Effort so the recap reads `Session → Drills → Counts → Tags → Effort` — counts and tags (both per-drill outputs) cluster, with effort (the session-level RPE) closing it. The text is `text-primary` to match Effort's weight (both are tester-supplied signals); Drills/Good-passes stay `text-text-secondary` (auto-derived). Hiding the row on the no-captures path preserves the existing recap exactly for legacy reviews — zero visual delta for any session that shipped before Tier 1b. The line is non-tabular (prose, not a number column) so courtside scan reads it as an observation, not a metric.

**Why not match the session-level RPE vocabulary (`Easy / Right / Hard`)**: the per-drill chips and the session RPE measure different things. The per-drill `Too hard / Still learning / Too easy` is a *calibration* signal (is this drill at the right level?); the middle anchor `Still learning` names a *progression state*, not an *intensity*. The session-level `Easy / Right / Hard` is an *exertion* signal (how hard did the whole session feel today?). Collapsing the vocabularies would force the adaptation engine to disambiguate calibration from exertion at consumption time. The chip docstring on `PerDrillCapture` (`app/src/components/PerDrillCapture.tsx` lines 16–21) carries an explicit anti-collapse comment.

**Files touched**:

- `app/src/services/review.ts` — `AggregateCapturesResult` gains `tagBreakdown`; `aggregateDrillCaptures` accumulates per-tag counts (including `notCaptured` rows, since the chip was tapped — only the counts were optional).
- `app/src/lib/format.ts` — new `formatDifficultyBreakdownLine` pure helper. Returns `null` when the consumer should hide the row, `"All <bucket>"` for single-bucket distributions, dot-separated severity-ordered tally otherwise.
- `app/src/screens/CompleteScreen.tsx` — recap card gains a conditionally-rendered `Difficulty` row between Good passes and Effort. `data-testid="recap-difficulty"`.
- `app/src/services/__tests__/review.perDrillCaptures.test.ts` — aggregator zero-state expectations updated for the new field; new `tagBreakdown` describe block.
- `app/src/lib/__tests__/format.difficultyBreakdown.test.ts` — new file covering the four rendering branches (null, all-X collapse, mixed dot-separated, zero-bucket omission).
- `app/src/screens/__tests__/CompleteScreen.perDrillAggregate.test.tsx` — new describe block covering mixed / all-one-bucket / no-captures / empty-array branches.
- `docs/plans/2026-04-26-pre-d91-editorial-polish.md` — this section.

**Validation**:

- 28/28 unit tests green across the three touched test files (`format.difficultyBreakdown`, `review.perDrillCaptures`, `CompleteScreen.perDrillAggregate`).
- Legacy review path (no `perDrillCaptures` field) renders identical recap to the pre-Item-8 ship — verified by the existing legacy-path test plus the new "hides when no captures" test.

**Authority and rollback**: editorial-class. Reverting Item 8 is three commits (or one combined commit) reverting the `format.ts` helper + the `CompleteScreen` row + the aggregator field. The aggregator change is forward-compatible (new field is additive); existing consumers in `ReviewScreen` ignore it.

**Adversarial check**: is this polish-velocity substitution? No — the chip taps were already happening; this is the consumer that closes the loop. Tier 1b drill authoring is not displaced; the recap row is a one-screen surface change with three small test files. The chip vocabulary itself stays untouched, preserving the calibration-vs-exertion split that the adaptation engine depends on.

### Item 9 — Split per-drill capture onto a dedicated `/run/check` screen

**Status**: shipped 2026-04-27, same pass as Item 8.

**Surface**: new `app/src/screens/DrillCheckScreen.tsx`, slimmed `app/src/screens/TransitionScreen.tsx`, three `RunScreen` redirect sites, `app/src/routes.ts`, `app/src/App.tsx`.

**Trigger**: founder design pass review of the Transition layout. The post-block reflective beat (the per-drill chip + optional counts, `PerDrillCapture` component) sat at the top of the Transition body, *above* the Up Next briefing (drill name + rationale + full prep + cue). Two cognitive jobs — reflection on what just happened, rehearsal of what's next — competed for the same scroll on a 390 px viewport. On any non-trivial cue the Start CTA was buried below the fold and the chip prompt was the first thing the user read instead of the next-drill briefing they actually needed.

**Original framing**: the `D133` Tier 1b implementation landed `PerDrillCapture` on Transition because the Transition surface was the natural "between drills" pause — the same render cycle handled both the just-finished pill and the up-next preview. That landed in 2026-04-26 with footer-level button gating (`captureSatisfied`) and a "Tag how that drill went to keep going" hint.

**Re-read evidence**:

1. The capture sat *above* the next-drill briefing, not below. On any cue longer than ~3 lines the next-drill briefing pushed the Start CTA below the visible viewport.
2. The "Tag how that drill went to keep going" gating hint was UI-state masking a layout problem — the user had to read past three blocks of next-drill content to discover that the grey CTA was waiting on a tap they made above-fold but seven scroll-lines later.
3. The reflective beat and the rehearsal beat have different cognitive jobs (`looking back` vs `looking forward`); colocating them dilutes both. The Jo-Ha-Kyu-style natural cadence is `you finished` → `what was that?` → `here's what's next` → `go`, not `you finished + what was that? + here's what's next` → `go`.

**Decision**: dedicated `/run/check` route between Run and Transition. Drill check renders ONLY the just-finished drill name + chips + optional counts + a single "Continue" button. Transition renders ONLY the Up Next briefing + Start/Shorten/Skip/Swap actions. When there's no capture target (warmup → main, technique block, skipped block, post-swap blocks where the previous block was skipped), DrillCheck auto-redirects to Transition so the user never sees a blank reflective beat.

**Restraint discipline**: gating becomes architectural rather than UI-state. The "you can't reach Up Next without tapping a chip" invariant is enforced by route progression instead of by a footer hint and a grey CTA. One screen, one job. The chip vocabulary is identical (`Too hard / Still learning / Too easy`); only the host surface changed.

**Files touched**: see commit. Capture state, draft persistence effects, capture-target derivation, and the "Tag how that drill went" hint moved verbatim from `TransitionScreen` to `DrillCheckScreen`. `RunScreen` redirects all three `navigate(routes.transition(...))` sites to `routes.drillCheck(...)`. The existing `TransitionScreen.perDrillCapture.test.tsx` was retargeted to `DrillCheckScreen.perDrillCapture.test.tsx` with the route URL updated; assertions on the capture surface stayed identical.

**Adversarial check**: is splitting one screen into two over-architecting? No — each new surface has a single clear job, the bypass logic is one effect (`navigate(transition, { replace: true })` when no target), and the existing capture invariants (chip-required, count optionality, draft round-trip) are preserved by lifting the same code into the new screen rather than re-implementing it. Tier 1b drill authoring is not displaced; the change is a layout reorganization, not a feature expansion.
