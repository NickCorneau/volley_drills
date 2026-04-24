---
id: walkthrough-closeout-polish-2026-04-23
title: "Walkthrough closeout polish pass (2026-04-23)"
type: plan
status: complete
stage: shipped
authority: "Editorial-class polish bundle supplementing Tier 1a content per `docs/plans/2026-04-20-m001-tier1-implementation.md` + `docs/plans/2026-04-22-partner-walkthrough-polish.md` lineage. Walkthrough-evidenced, not founder-session-trigger-gated, so scope is strictly constrained to *editorial-class* items per the 2026-04-22 adversarial-memo authoring-budget discipline (`docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §Authoring-budget cap): copy, typography, tokens, small visual fixes, and conditional-render hides. No new drill records. No metadata schema changes. No persistence-behavior additions. No new archetype variants. No SetupScreen toggles. No Dexie migrations."
summary: "Four-item editorial-class polish bundle drawn from `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §Genuinely-open Tier 1b bundle, items **2 + 3 + 4 + 16**. On 2026-04-24 execution pass, items 2 and 16 were discovered as already-shipped in the 2026-04-22 polish pass (chip-label rename + `PainOverrideCard` microcopy, period form per courtside-copy §4); items 3 and 4 shipped cleanly in this pass. Shipped: RPE 11→3 anchors (Easy / Right / Hard mapping to sessionRpe 3 / 5 / 7 so the 0-10 Dexie domain and `effortLabel` bands stay intact); Quick-tags card deleted (QuickTagChips.tsx removed); hairline divider between RPE and Good-passes cards; Good-passes card hidden entirely when main-skill `successMetric.type` is non-count (not just pre-selected notCaptured); `Done` and `Finish later` both full-width primary buttons (Submit review renamed to Done); 2-hour Finish-Later countdown subtitle deleted from Review footer (expired-stub behavior unchanged — A6 / A9 paths + `expireStaleReviews` sweep still fire on the same cap); posture-sensitive Safari-eviction secondary copy compressed off Complete and into a new Settings `About local storage` sub-section driven by the same `getStorageCopy(posture)` source of truth; Complete carries a small `Why is this?` link to Settings. Larger Tier 1b items (Persist Net/Wall, Auto-fill training recency, Visual block-end countdown cue, reproduce effort/tag anomaly, Skip-review confirmation modal, first-session-only verdict string) are **explicitly deferred** to founder-session-trigger-gated Tier 1b work and listed in the Deferred section for transparency."
last_updated: 2026-04-24
depends_on:
  - docs/milestones/m001-solo-session-loop.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/plans/2026-04-22-partner-walkthrough-polish.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md
  - docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md
  - docs/research/2026-04-22-research-sweep-meta-synthesis.md
related:
  - docs/research/courtside-copy.mdc
  - docs/research/warmup-cooldown-minimum-protocols.md
  - docs/research/regulatory-boundary-pain-gated-training-apps.md
decision_refs:
  - D82
  - D83
  - D86
  - D91
  - D123
  - D129
  - D130
  - D132
---

# Walkthrough closeout polish pass (2026-04-23)

## Agent Quick Scan

- **Editorial-class only.** Four items. No drill records, no metadata schema changes, no persistence behavior changes, no new archetype variants, no SetupScreen toggles, no Dexie migration. Same discipline as the 2026-04-22 polish pass that landed 6 items cleanly.
- **Walkthrough-evidenced, not founder-session-trigger-gated.** The 2026-04-22 adversarial-memo authoring-budget cap (`docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §Authoring-budget cap) is explicit: *"partner walkthrough findings feed into gate evidence but do **not** unlock Tier 1b authoring on their own — that remains founder-session-trigger-gated. Small pre-close-class editorial fixes that fit inside the courtside-copy rule may still ship in-tier."* This plan ships only fixes in that "editorial class."
- **Four items**, all from the reconciled file's §Genuinely-open Tier 1b bundle. Numbering preserves the reconciled-file index so cross-reference stays sharp.
  - Item 2: `0 days` wording reword on Safety recency.
  - Item 3: Review merged-proposal remainder (five sub-edits on one screen).
  - Item 4: Delete 2-hour Review-window copy + Complete Safari-eviction footnote compression.
  - Item 16: `PainOverrideCard` "we lower the load, not the time — your pick" microcopy.
- **Estimated effort: 3–5 hours focused.** All four items are within a single developer session. Test additions land with each change, not as a separate unit.
- **What this pass does NOT do.** Larger walkthrough-surfaced items — Persist Net/Wall, Auto-fill training recency, Visual block-end countdown cue, effort/tag state anomaly reproduction, Skip-review confirmation modal, first-session-only verdict string on Complete — are **explicitly deferred** to founder-session-trigger-gated Tier 1b work. Listed in §Deferred below.
- **Pair-first vision-stance alignment.** Per `D132` (2026-04-22), each item is authored with pair-first mental-model checks: does the copy read naturally whether the user is training solo or as a pair member? Where a small wording tweak can strengthen pair-first framing without scope creep, it lands; where it cannot, the fix stays editorially neutral. Specifically, item 4's `PainOverrideCard` microcopy is a good micro-opportunity; items 1, 2, and 3 are vision-neutral in their current form.

## Why this plan exists

Seb's Tier 1a walkthrough (Pass 1 solo ×2 + Pass 2 pair on grass, 2026-04-21) returned ~19 findings; roughly half landed pre-close on 2026-04-21 as direct dispositions, and six more landed via the 2026-04-22 partner-walkthrough polish plan. The reconciled synthesis at `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` lists the remaining genuinely-open items in two sub-lists:

1. **Items 1–16: Tier 1b bundle if triggers fire.** Items 2, 3, 4, and 16 of that list are editorial-class and fit the courtside-copy / typography / conditional-render discipline that walkthrough evidence is sufficient to unlock.
2. **Tier 1b gated by founder-session trigger (strict sub-list).** Items there — pair role-swap audio cue, in-session running rep counter, full drill-metadata-driven capture UI, tap-to-expand per-stretch demo, delete `Chosen because:` — require founder-use-ledger evidence before they can ship. This plan does not touch them.

The walkthrough closeout gap between those two sub-lists is small, editorial, and a natural follow-on to the 2026-04-22 polish pass. Shipping it now keeps Seb's active usage on a cleaner product through the 2026-05-21 `D130` Condition 3 final-close window (reached with Seb's unprompted T+1-day open on 2026-04-22, now waiting on the 30-day window to fully close).

## Gate status

- **Authoring-budget cap status** (per `docs/plans/2026-04-20-m001-adversarial-memo.md` §5): this plan authors **zero new drill records**. The cap has 4 of 10 drills remaining for future Tier 1b waves; this plan does not consume any.
- **Tier 1b founder-session trigger** (per `docs/plans/2026-04-20-m001-tier1-implementation.md` lines 270–276): **NOT required for this plan** because all four items are editorial-class fixes supplementing Tier 1a content, not Tier 1b scope. The trigger remains unmet today; this plan does not attempt to bypass it and does not implicate it.
- **2026-04-22 adversarial-memo §A3 ligament**: worth honoring as a ritual whenever the founder next engages with the memo (per `docs/research/2026-04-22-research-sweep-meta-synthesis.md` §R1 revised). Not a precondition for this plan.

## Scope

### Item 1 (reconciled #2): Safety-check recency reword

**What**: On the pre-session Safety check, replace the current `0 days since last training` numeric string with a human-readable band: `Today`, `Yesterday`, `2+ days ago`, `First time`.

**Why**: Three walkthrough passes converged on this (workflow + shibui + design review + Player 3 + iPhone viewport). The numeric string reads like a log entry; the band reads like a sentence. High-frequency surface (every session's first screen).

**Files touched**:
- `app/src/screens/SafetyCheckScreen.tsx` — recency-band derivation function (compute the band from the existing last-session timestamp in Dexie; no schema change), replace the numeric-string render with the band string.
- `app/src/screens/__tests__/SafetyCheckScreen.test.tsx` — four test cases (Today / Yesterday / 2+ days ago / First time) covering the band derivation.
- Any courtside-copy snapshot tests that assert on the old string.

**Files NOT touched**:
- No change to the underlying Dexie read (it already returns a timestamp).
- No change to `D129` post-physio-review safety wording; the DOMS-permission line and pain-flag question stay exactly as-is.
- No new toggles or settings.

**Acceptance criteria**:
1. `Today` when the last session started on the current local date.
2. `Yesterday` when the last session started on the previous local date.
3. `2+ days ago` when the last session started 2+ local-calendar-days ago.
4. `First time` when no prior `ExecutionLog` row exists.
5. No visible "0 days" or raw-number wording anywhere on the Safety screen.
6. `npm run test`, `npm run lint`, `npm run build` all green.

### Item 2 (reconciled #3): Review merged-proposal remainder

**What**: Finish the Review-screen cut that the 2026-04-22 polish pass landed partially. Five sub-edits on one screen, all editorial-class:

- **RPE anchor reduction**: RPE scale currently presents ~11 anchors; reduce to 3 anchors (low / medium / high wording per the merged proposal in the reconciled file). Same underlying 0–10 capture; fewer visible labels.
- **Delete Quick tags**: remove the Quick-tags card from Review entirely. The effort / tag state anomaly the design review flagged (reconciled #9) is then moot at the product layer, though the underlying reproduce-and-file item remains in §Deferred for code-hygiene reasons.
- **Divider-line treatment**: visual separator between RPE and Good-passes sections per the design-review recommendation (Tier 1a shipped the section with no divider).
- **`Done` / `Finish later` equal weight**: treat both as primary buttons visually. Current styling weights `Done` more heavily, which reads as reprimanding the "Finish later" path.
- **Hide Good-passes card entirely on non-count drills**: currently the card defaults to `notCaptured` for non-count `successMetric.type`; the merged proposal completes the fix by hiding the card entirely rather than showing it in a default-notCaptured state. Reads from the drill's existing `successMetric.type`; no new fields.

**Why**: Seb P1-12 + P2-3 landed the first half pre-close; the remainder is editorial-class and directly on the same surface. Reduces Review-screen cognitive load on every session's final step.

**Files touched**:
- `app/src/screens/ReviewScreen.tsx` — RPE anchor rendering, divider layout, button styling, Good-passes card conditional rendering.
- `app/src/screens/__tests__/ReviewScreen.test.tsx` — test cases for the new RPE anchor count, Quick-tags-removed assertion, Good-passes card hidden on non-count drills.
- `app/src/components/RpeSelector.tsx` (or equivalent) — anchor-label array.
- Any courtside-copy or layout snapshot tests.

**Files NOT touched**:
- No change to `sessionRpe` capture shape in Dexie (still 0–10).
- No new `successMetric.type` values.
- No archetype changes.

**Acceptance criteria**:
1. RPE selector shows 3 anchor labels (low / medium / high placement) spanning the existing 0–10 range.
2. Quick-tags card is not rendered on Review.
3. A visual divider separates RPE and Good-passes sections.
4. `Done` and `Finish later` render with equal visual weight (both primary styling, differentiated only by position / label).
5. Good-passes card is not rendered when the current drill's `successMetric.type` indicates a non-count drill; card renders normally for count drills.
6. All existing Review tests continue to pass (sessionRpe capture, review submission, notCaptured default preservation for count drills).
7. `npm run test`, `npm run lint`, `npm run build` green.

### Item 3 (reconciled #4): Delete 2-hour Review-window copy + compress Complete Safari caveat

**What**: Two small copy cuts on the Complete screen and adjacent surfaces:

- **Delete the 2-hour Review-window countdown**. The current copy communicates a 2-hour limit on deferred reviews; the workflow + shibui + design-review passes all converged that this reads as pressure, not helpfulness. Remove the countdown copy entirely; the underlying expiry logic (per `V0B-31` expired-stub behavior) is unchanged — users still get the expired-stub behavior if a review is abandoned, they just aren't counted-down at.
- **Compress the Complete screen's Safari-eviction footnote into Settings**. The current Complete screen carries explanatory copy about iOS Safari storage eviction behavior (tied to `D118` three-state durability wording). Move the detailed explanation into a Settings sub-item; keep the concise `✓ Saved on this device` line on Complete.

**Why**: Both reduce visual noise on surfaces where the user is finishing a session. The underlying durability posture (`D118` posture-sensitive copy, never claiming "backed up") stays exactly as-is; this is a *placement* edit, not a durability-claim edit.

**Files touched**:
- `app/src/screens/CompleteScreen.tsx` — remove the 2-hour countdown block; trim the Safari-eviction footnote to one line (the existing "Saved on this device" surface) + add a "Why is this?" link to Settings.
- `app/src/screens/ReviewScreen.tsx` — remove any adjacent 2-hour wording if it's echoed.
- `app/src/screens/SettingsScreen.tsx` — add the detailed Safari-eviction explanation section (folded, not expanded by default).
- `app/src/screens/__tests__/CompleteScreen.test.tsx` — remove assertions on the deleted 2-hour copy; add assertion that the "Saved on this device" line remains.
- Any `e2e/*` specs that assert on the 2-hour copy.

**Files NOT touched**:
- No change to `D57` / `D118` durability posture or three-state copy (`Saved on this device` / posture-sensitive wording stays).
- No change to the expired-stub behavior itself.
- No change to `storageMeta`.

**Acceptance criteria**:
1. No "2-hour" or countdown copy appears anywhere on Complete, Review, or adjacent surfaces.
2. Complete screen shows the `✓ Saved on this device` line (or its posture-sensitive equivalent per `D118`) and a "Why is this?" affordance linking to Settings.
3. Settings has a new sub-section covering the Safari-eviction behavior previously on Complete.
4. The expired-stub behavior continues to work exactly as before (review expires into a stub after the same interval, users are not prompted to "review within 2 hours").
5. `npm run test`, `npm run lint`, `npm run build` green.

### Item 4 (reconciled #16): `PainOverrideCard` microcopy

**What**: On the `PainOverrideCard` that shows when the user reports pain on the Safety check, add a one-line microcopy clarifying that the pain-branch reduces session load but not session duration:

> `we lower the load, not the time — your pick`

(exact wording per Seb's walkthrough note; the `— your pick` tail gives the user clear agency over continuing or ending.)

**Why**: Seb's post-close wording check reconciliation row noted that when he tapped `pain: yes`, the session duration did not shorten — which is correct per `D113` band-design intent — but the lack of copy explaining the trade-off briefly left him uncertain. One line closes the loop without adding scope. Low-cost, high-clarity.

**Files touched**:
- `app/src/components/PainOverrideCard.tsx` — one-line copy addition.
- `app/src/components/__tests__/PainOverrideCard.test.tsx` — assert on the new copy.
- `app/src/lib/courtside-copy.ts` (or equivalent) — add to the flagged-vocabulary table if that's where microcopy constants live.

**Files NOT touched**:
- No change to the pain-flag capture or branching logic.
- No change to `D113` band-design math.
- No change to `D129` safety wording.
- No change to `D82 / D83 / D86 / D88 / D129` regulatory posture; this microcopy is a user-facing clarification, not a new claim, and fits inside the `docs/research/regulatory-boundary-pain-gated-training-apps.md` posture. The "your pick" language emphasizes user agency, not prescription.

**Acceptance criteria**:
1. Microcopy renders on `PainOverrideCard` when pain is flagged.
2. Wording matches Seb's walkthrough note exactly.
3. Does not trigger any avoid-phrases flag from `docs/research/regulatory-boundary-pain-gated-training-apps.md`.
4. `npm run test`, `npm run lint`, `npm run build` green.

## Pair-first vision-stance review (per `D132`)

Each item reviewed for pair-first alignment:

| Item | Pair-first check | Action |
|---|---|---|
| 1 — Safety recency reword | Vision-neutral. `Today / Yesterday / 2+ days ago / First time` reads naturally for solo or pair sessions. | Ship as-is. |
| 2 — Review cut | Vision-neutral. RPE / Good-passes are individual-scope capture; pair-first framing would come from a different surface (e.g., a future "what the partner did / what we did" review split), explicitly out of scope. | Ship as-is. |
| 3 — 2-hour / Safari copy compression | Vision-neutral. Durability language does not touch pair framing. | Ship as-is. |
| 4 — `PainOverrideCard` microcopy | Mildly pair-first-aware. "Your pick" language reinforces user agency (solo or pair), consistent with `P13`. If the user is in pair mode and flagged pain, the microcopy still reads right — "we lower the load, not the time — your pick" applies to the user's own load regardless of pair presence. | Ship as-is. |

No pair-first rewording is proposed for this bundle. If the user wants a broader pair-first copy pass across the app, that is a separate, larger scope-out item, not this plan.

## Tests

New test cases:

1. `SafetyCheckScreen.test.tsx` — four cases: `Today` / `Yesterday` / `2+ days ago` / `First time` band derivation; assert the rendered string matches.
2. `ReviewScreen.test.tsx` — (a) RPE selector renders 3 anchor labels; (b) Quick-tags card is not rendered; (c) divider renders between RPE and Good-passes sections; (d) `Done` and `Finish later` have equal visual weight (assert on styling class tokens); (e) Good-passes card is not rendered when `successMetric.type` is non-count.
3. `CompleteScreen.test.tsx` — (a) no "2-hour" copy renders; (b) "Saved on this device" line renders; (c) Settings link affordance renders.
4. `SettingsScreen.test.tsx` — the new Safari-eviction sub-section renders correctly.
5. `PainOverrideCard.test.tsx` — microcopy renders, matches exact wording.

Regression suite:

- Existing ~566 tests continue to pass unchanged (post-Tier-1a baseline).
- No e2e scenarios should regress; specifically the `phase-c` onboarding e2e, warm-offline e2e, and the pain-flag-branch paths.

## Deferred (explicitly out of this plan)

These items surfaced in the walkthrough reconciled list but do not fit the editorial-class discipline; they require a founder-session trigger per the adversarial-memo authoring-budget cap:

| Item | From reconciled # | Why deferred | Founder-session trigger |
|---|---|---|---|
| Persist `Net` / `Wall` across sessions | 6 | Persistence behavior change (reads/writes `storageMeta`); not editorial. | Founder logs ≥2 sessions manually re-entering these after having set them. |
| Auto-fill training recency for returning users | 5 | Behavior change (reads Dexie on-render); editorial-adjacent but nontrivially interacts with Safety-check logic. | Founder logs ≥1 session explicitly noting recency re-entry friction. |
| Neutral `disabled` CTA token | 1 | Design-token addition, small but crosses component boundaries (Setup + Review); should batch with other token refactors to avoid churn. | Ships in the next token / theming wave when one is scoped. |
| Truncate-with-expand pattern for Beach Prep Three steps | 7 | Pattern-level UI addition, not pure copy. | Founder logs ≥1 wrap where more form detail was wanted, OR partner walkthrough surfaces the need. |
| Visual block-end countdown cue on Run (progress bar + "0:47 left" chip) | 8 | New visual primitive on the run screen; behavior-adjacent. | Founder logs ≥1 session where the block-end was missed despite the audio tick. |
| Reproduce and file effort/tag state anomaly | 9 | Bug-repro work; may become moot once item 2 lands (Quick tags deleted) but the underlying path should be understood before `D91` reopens. | Can run any time; tracked in Tier 2 backlog until `D91` reopens. |
| Gate "keep phone unlocked" warm-up hint to first-time-only | 10 | Conditional logic, not copy. | Founder logs ≥2 sessions noting the hint as redundant. |
| Skip-review confirmation modal | 11 | New modal, UX scaffolding. | Founder logs ≥1 session where they skipped review and later regretted losing the capture. |
| First-session-only verdict string on Complete | 12 | Editorial-class but conditional on session count (reads from Dexie); defer to batch with item-5 if auto-fill training recency also lands, since both share the same first-render-from-Dexie pattern. | Lands with auto-fill training recency (item 5 above) when that fires. |
| Quiet `Logged: N sessions · HH:MM total` footer near Settings | 13 | Minor accumulation surface; scope-guardian A7 says Settings stays single-card minimal in Tier 1b. | Post-Tier-2. |
| Accent color demotion across non-action surfaces | 14 | Token refactor, batchable. | Next token / theming wave. |
| `Shorten block` button styling on Transition | 15 | Token refactor, batchable. | Next token / theming wave. |

**Pair role-swap audio cue**, **in-session running rep counter**, **full drill-metadata-driven capture UI**, **tap-to-expand per-stretch demo**, and **delete `Chosen because:` from Run** stay in the stricter founder-session-trigger sub-list per the reconciled file; they are not re-enumerated here.

## Acceptance (plan-level)

This plan ships when **all** of the following hold:

1. All four items land with acceptance criteria passing.
2. `npm run lint` and `npm run build` clean.
3. New + regression tests pass.
4. No scope creep: no items from §Deferred slip in without an explicit amendment-log entry.
5. Tier 1a acceptance items remain unaffected (warmup authoring bug fix; setting minimum probe; vocabulary sweep; `Chosen because:` single-sentence rationale at 16 px; last-3-sessions row on Home).
6. No pair-first-aware rewordings beyond the one small `PainOverrideCard` agency-reinforcing microcopy.
7. No drill authoring. No schema migration. No `archetypes.ts` skillTags widening. No SetupScreen toggles.
8. `docs/milestones/m001-solo-session-loop.md` Agent Quick Scan gets a one-line update noting the 2026-04-23 walkthrough closeout polish landed (mirroring the 2026-04-22 polish-plan update).

## Post-ship follow-ups (track, do not bundle)

- Monitor Seb's usage over the next 4 weeks (2026-04-23 → 2026-05-21 `D130` Condition 3 final close). Specifically: did the reworded Safety recency read naturally? Did the Review cut reduce the completion time? Did the `PainOverrideCard` microcopy come up in any conversation?
- If any deferred item's trigger fires during the same window, **do not bundle into this plan**; author a follow-on plan per the Tier 1b trigger-gated discipline.
- If pair-first framing surfaces a need for broader copy work beyond this plan's single microcopy touch, scope a dedicated "pair-first copy pass" plan rather than bolting items onto this one.
- Re-check the `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` open list after this ships; update its landed / partial / open status rows in the same editing pass that marks this plan as complete.

## Ship log

**2026-04-24 — executed.** All four items resolved; plan moves to `status: complete / stage: shipped`.

- **Item 1 (Safety recency reword) — already landed in the 2026-04-22 polish pass.** `app/src/screens/SafetyCheckScreen.tsx` `PRIMARY_RECENCY_LABEL` already maps `'0 days' → 'Today'`, `'1 day' → 'Yesterday'`, `'2+' → '2+ days ago'`, `'First time' → 'First time'`; subtitles already read as `Today means a shorter, lower-intensity start.` / `Today or First time means a shorter, lower-intensity start.`; `SafetyCheckScreen.test.tsx` already asserts on the rendered labels (`^today$`, `^yesterday$`, `^2\+ days ago$`). No user-visible `0 days` string remains on the Safety surface. Internal type literals (`'0 days'`, `'1 day'`, `'2+'`) persist in Dexie for DB / adaptation compatibility per `D129`. Acceptance criteria #5 (no raw-number wording visible) is satisfied by the shipped 2026-04-22 work; acceptance criteria #1–4 describe auto-derivation from a Dexie `ExecutionLog` timestamp — that is "Auto-fill training recency for returning users", explicitly deferred in this plan's §Deferred table per the founder-session-trigger discipline, and was not re-implemented here.
- **Item 2 (Review merged-proposal remainder) — shipped.** `RpeSelector` collapsed from 11 numeric chips (0-10) to three labelled chips (Easy / Right / Hard) mapping to canonical sessionRpe values 3 / 5 / 7. Pure helpers (`EFFORT_CHIPS` / `pickChipForRpe`) moved to `app/src/components/rpeSelectorUtils.ts` to satisfy the `react-refresh/only-export-components` lint rule. Historical non-canonical sessionRpe values (e.g. 4, 6, 8) rehydrate via `pickChipForRpe` which snaps to the nearest chip for display without mutating the underlying data. `QuickTagChips` card deleted from `ReviewScreen.tsx`; `app/src/components/QuickTagChips.tsx` deleted (no other importers). Hairline divider (`h-px bg-text-secondary/15`) added between the RPE and Good-passes cards when both render. Good-passes card now gated on `inferMainSkillMetricType(plan)` returning a `COUNT_BASED_METRIC_TYPES` value (or `null` for synthetic / unknown drills, so the rest of the `ReviewScreen.*.test.tsx` suite's `drillName: 'Passing'` fixtures continue to exercise the count path). Pre-close default-to-`notCaptured`-on-non-count logic removed because the card is hidden entirely — the `totalAttempts === 0` signal `composeSummary` already reads carries the notCaptured state for downstream consumers. Button footer: Submit review renamed to **Done**, both Done and Finish later render as full-width `variant="primary"` equal-weight buttons, differentiated by position (Done on top) and label. 2-hour Finish-Later countdown subtitle deleted from the footer; `formatFinishLaterWindow` + `nowMs` tick state removed. A6 / A9 past-cap re-route logic unchanged — expired-stub behavior still fires on the same cap.
- **Item 3 (2-hour copy + Safari caveat compression) — shipped.** `This session stops counting in about N hr M min, then it won't affect planning.` footer subtitle deleted from `ReviewScreen.tsx` (same edit that covers Item 2's `Finish later` remainder). `CompleteScreen.tsx` trimmed to the primary `✓ Saved on this device` line (posture-sensitive per `D118`) plus a small `Why is this?` link to `/settings`. New `About local storage` section added to `SettingsScreen.tsx` rendering `storageCopy.primary` / `storageCopy.secondary` from `getStorageCopy(useInstallPosture().posture)` — same source of truth the Complete save-status line draws from, so the two surfaces stay in lockstep if the posture copy is later revised. `D118` three-state durability posture is unchanged; `storageCopy.ts` + `storageCopy.test.ts` untouched. Scope-guardian A7 (Settings stays single-card minimal in Tier 1b) respected: the Settings addition is the *same* `storageCopy` body previously on Complete, moved one surface over, not net-new content.
- **Item 4 (`PainOverrideCard` microcopy) — already landed in the 2026-04-22 polish pass.** `app/src/components/PainOverrideCard.tsx` line 101 already renders `We lower the load, not the time. Your pick.` — the courtside-copy-rule-compliant period form (rule §4 explicitly cites this exact sentence as the canonical "Bad → Good" example, forbidding em-dashes in user-visible prose). The plan's wording note `we lower the load, not the time — your pick` was the founder's source-walkthrough verbatim quote; the shipped form holds the same meaning with plain punctuation per the invariant. Acceptance criterion #3 (no D86 avoid-phrases) is satisfied; the `PainOverrideCard` microcopy comment block (2026-04-22 `D129` / `D130`) documents the courtside-copy-rule reconciliation.

**Files changed in this pass.**
- `app/src/components/RpeSelector.tsx` — 3-chip rewrite.
- `app/src/components/rpeSelectorUtils.ts` — new, holds `EFFORT_CHIPS` + `pickChipForRpe`.
- `app/src/components/__tests__/RpeSelector.test.tsx` — new, 9 tests covering chip render, chip-to-value mapping, non-canonical rehydration snap.
- `app/src/components/QuickTagChips.tsx` — deleted.
- `app/src/screens/ReviewScreen.tsx` — QuickTagChips card deleted; divider added; Good-passes visibility gate updated; Submit → Done; Finish later → primary; 2-hour countdown removed.
- `app/src/screens/__tests__/ReviewScreen.polish-2026-04-23.test.tsx` — new, covers all five Item 2 sub-edits + Item 3 countdown removal.
- `app/src/screens/__tests__/ReviewScreen.draft.test.tsx` — updated to new chip labels; docblock addendum.
- `app/src/screens/__tests__/ReviewScreen.finish-later.test.tsx` — updated to new chip labels.
- `app/src/screens/__tests__/ReviewScreen.h19-conflict.test.tsx` — updated to new chip labels + Done button label.
- `app/src/screens/__tests__/ReviewScreen.a6-cap-recheck.test.tsx` — updated to new chip labels + Done button label; `sessionRpe` expected value change (6 → 5 because the test now picks `Right`).
- `app/src/screens/__tests__/ReviewScreen.pair-copy.test.tsx` — updated to new chip labels + Done button label.
- `app/src/screens/CompleteScreen.tsx` — posture-sensitive secondary line removed; `Why is this?` link added.
- `app/src/screens/SettingsScreen.tsx` — new `About local storage` sub-section driven by `getStorageCopy(posture)`.
- `app/src/screens/__tests__/CompleteScreen.polish-2026-04-23.test.tsx` — new, covers the trust-line preservation, Safari-eviction removal from Complete, `Why is this?` link target, and the Settings explainer existence.

**Verification.** `npm run lint` clean. `npm run build` clean. `npm run test` → 82 files, 639 tests passing (baseline before this pass was ~616 after a grow-in period since the plan's 566 estimate).

**Deferred on this pass (ledgered, not blocked) — subsequently applied 2026-04-24.**

Originally batched for a separate editorial sweep. The sweep ran 2026-04-24 in a single pass immediately after the code ship. What landed:

- **`D132` downstream propagation edits (3 surfaces).** `docs/research/persistent-team-identity.md` Agent Quick Scan gained an `O13` re-weighting note (strategic importance of eventual persistent pair identity is higher under pair-first; `D117` graduation gate unchanged). `docs/milestones/m001-solo-session-loop.md` Agent Quick Scan gained a one-line "solo-first here is tactical; `D132` pair-first is strategic" clarifier keyed to the milestone's own name. `docs/plans/2026-04-20-m001-adversarial-memo.md` Condition 1 gained a `D132` re-reading block — threshold and falsification consequence unchanged, interpretation updated (≥40% solo-share measures whether the accommodated solo case works, not whether solo-first is strategic).
- **Adversarial-memo amendment log entry.** New entry "2026-04-24 — Walkthrough closeout polish pass (editorial-class, pre-close class)" records the ship, the items-already-landed reconciliation, and the decision-ID authority chain. No falsification condition weakened; co-signer requirement waived per the amendment rule.
- **A3 ligament Weekly Log addendum (partial discharge).** Honest structural addendum appended under week 1 of the Weekly Log capturing the 2026-04-22 / -23 / -24 authoring scope, trigger (e) interim reading (agent-assisted open asymmetry), Condition 1 / 2 / 3 interim status, and the authoring-budget cap check. Founder's own end-to-end memo re-read remains pending and is explicitly flagged as the final closer step.
- **Meta-synthesis §Next steps table refresh.** `docs/research/2026-04-22-research-sweep-meta-synthesis.md` §Next steps updated: moves #2, #3, #4 marked as landed / partially discharged; move #1 (§R7 exit-3 decision) remains open as founder decision with a cost-of-delay-is-zero note because Tier 1b is still trigger-gated; new move #6 "What's next" lands a recommendation for the next concrete step (founder runs a personal training session against the shipped Tier 1a build in the week of 2026-04-27).

**What remains open after 2026-04-24.**

1. `§R7 exit-3 upgrade decision` — founder-only call. Holds until the Tier 1b trigger fires.
2. Founder's A3 memo re-read (one ≤5 min read; append `A3 re-read YYYY-MM-DD — <n> min` line under the week-1 addendum when done).
3. Continued Seb usage + founder post-injury usage — background behavior, not canon work.

## For agents

- **Authoritative for:** the four-item editorial-class walkthrough closeout polish scope, the pair-first-alignment review per `D132`, the deferred-items disposition table, the gate-status discipline (walkthrough-evidenced, no founder-session trigger required), and the 2026-04-24 ship-log reconciliation above.
- **Edit when:** any item lands or moves status (mark in Acceptance section + update `docs/milestones/m001-solo-session-loop.md` Agent Quick Scan); the scope needs an explicit amendment (author a clear Amendment Log entry below this section); the reconciled-list open-items change (bump last_updated on both this plan and the reconciled file).
- **Belongs elsewhere:** Tier 1b drill authoring (`docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` and its trigger); founder-session-trigger-gated Tier 1b items (reconciled file's stricter sub-list); Tier 2 scope (`docs/milestones/m001-solo-session-loop.md` Tier 2 section); adversarial-memo amendments (`docs/plans/2026-04-20-m001-adversarial-memo.md` Amendment Log).
- **Outranked by:** `docs/plans/2026-04-20-m001-adversarial-memo.md` (authoring-budget cap, falsification conditions); `docs/decisions.md` (any D# that supersedes, specifically `D132` pair-first stance); `docs/vision.md`.
- **Key pattern:** walkthrough-evidenced editorial-class polish pass following the 2026-04-22 polish-plan precedent. Bounded scope by design; deferred items named explicitly to prevent silent inclusion.
