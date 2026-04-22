---
id: partner-walkthrough-polish-2026-04-22
title: "Partner-walkthrough polish — editorial ship bundle (2026-04-22)"
type: plan
status: active
stage: build
summary: "Six-item editorial-class ship bundle derived from the 2026-04-22 all-passes reconciled synthesis. Scope is strictly what qualifies under the adversarial-memo authoring-budget cap as `Accept (pre-close)` / `Accept (landed)` class: copy, tokens, and small state-gated surfaces that do not require a spec revision or new Dexie schema. Remaining open items are tracked against their founder-session triggers in `docs/research/founder-use-ledger.md` and summarized in `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md`."
authority: "Scope contract for the 2026-04-22 polish ship. Supersedes nothing; complements `docs/plans/2026-04-20-m001-tier1-implementation.md`."
last_updated: 2026-04-22
depends_on:
  - docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md
  - docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/specs/m001-review-micro-spec.md
decision_refs:
  - D91
  - D105
  - D123
  - D127
  - D129
  - D130
---

# Partner-walkthrough polish — editorial ship bundle

## Scope (6 items, editorial-class)

1. **Safety recency chips — reword display labels.** `0 days / 1 day / 2+ / First time` → `Today / Yesterday / 2+ days ago / First time`. Persisted `trainingRecency` value stays as the current strings (`'0 days'` / `'1 day'` / `'2+'` / layoff buckets unchanged) for DB and adaptation-rule compatibility. **Display-only mapping.** Also updates the recency subtitle copy. [Source: three-pass convergence + Seb P1-X precedent of label-not-value fixes.]
2. **Neutral disabled CTA token.** Update `Button` `primary` variant's `disabled:` classes so a disabled primary renders as neutral gray (`bg-text-secondary/10 text-text-secondary/70`), not peach-tinted accent at 50 % opacity. Removes the peach-overload ambiguity flagged by design review A1. Two call-sites (Setup `Build session`, Review `Submit review`) benefit automatically; `disabled:cursor-not-allowed` remains. `disabled:hover:` and `disabled:active:` are explicitly re-stated so the variant's hover-darkening does not fire on a disabled button.
3. **`PainOverrideCard` microcopy — "we lower the load, not the time — your pick."** Single line added below the "Lighter session · N min" chip to address Seb's wording-check note that duration didn't shorten and the reason isn't explained. [Source: Seb walkthrough wording-check row on `PainOverrideCard`.]
4. **First-session verdict variant on Complete.** When `sessionCount === 1` AND `totalAttempts === 0` (the default path for a notCaptured-first session), `composeSummary` returns `verdict: "Keep building"` with a session-1 specific `reason: "First one's in the book. Ready when you are."` — re-using the existing `FORWARD_HOOK` so the session-1 line lands on the same "Ready when you are" handoff Phase F4 established. Deliberately avoids the em-dash glyph (the `CompleteScreen.copy-guard` test treats any em-dash on this surface as a regression of the old "Good passes: — " placeholder). Session-1-with-attempts falls through to the existing low-N tuning branch, which already carries its own first-few-sessions framing. [Source: design review T3 + trifold T3 resolution; existing voice preserved.]
5. **Preroll hint gated to first-time only.** The `"Keep the phone unlocked so the block-end beep can fire."` line on RunScreen's 3-2-1 preroll shows once, then is dismissed permanently via a `storageMeta['ux.prerollHintDismissed']` boolean. First-completed preroll sets the flag. [Source: Player 3 "timer anxiety" + workflow pass.]
6. **Shorten block styling on TransitionScreen.** Promote from bare text link to outlined pill button at CTA width (uses existing `Button variant="outline"`). [Source: design review issue on Transition.]

## Explicitly out of scope (captured in roadmap / ledgers, not shipped)

- Full Review cut (RPE 11 → 3 anchors, delete Quick tags, divider-line card swap, delete 2-hour window copy, `Done` / `Finish later` equal weight, hide Good-passes entirely). **Requires `docs/specs/m001-review-micro-spec.md` revision first.** Deferred.
- Auto-fill training recency from Dexie for returning users. Cross-cutting state + adaptation-rule touchpoint. Deferred.
- Persist `Net` / `Wall` across sessions. Cross-cutting draft-state change. Deferred.
- Visual block-end countdown cue (thicker progress bar + "0:47 left" chip). Touches BlockTimer visual tokens. Deferred.
- Complete-screen Safari-eviction footnote compression. Touches D118 three-state posture-sensitive copy. Deferred.
- Skip-review confirmation modal. Interacts with H19 conflict-flow copy. Deferred.
- `Logged: N sessions · HH:MM total` footer near Settings. Needs investment-surface placement thought; keeps `RecentSessionsList` passive per A7. Deferred.
- Accent color audit across non-action surfaces. Scope. Deferred.
- Effort / tag state anomaly. Needs direct reproduction. Deferred (spawned as standalone bug).
- Warm-up numbered-step truncate-with-expand pattern. Needs scoping. Deferred.
- `Chosen because:` deletion from Run. On founder-use trigger per reconciled synthesis. Deferred.
- All trigger-gated Tier 1b items (pair role-swap audio cue, in-session rep counter, full drill-metadata-driven capture UI, stretch-demo). Wait for founder-session trigger.

## Acceptance

- All unit + component tests in `app/` pass.
- ESLint clean.
- `npm run build` clean.
- Manual cold-start smoke loop: Skill level → Setup → Safety (verify new chip labels + PainOverrideCard copy when `painFlag=yes`) → Run (verify preroll hint shows first time, does not show on second block after dismiss) → Transition (verify Shorten button styling) → Review → Complete (verify first-session verdict copy).
- Disabled `Build session` and `Submit review` render as neutral gray, not peach-tinted.
- `trainingRecency` values written to Dexie remain the existing string enum (`'0 days'` etc.) so legacy records and adaptation rules are unaffected.

## Invariants preserved

- **Internal `TrainingRecency` values unchanged.** Display labels are a separate map.
- **`storageMeta` schema extended only with one new key** (`ux.prerollHintDismissed`) following the existing UX-flag pattern (`FirstOpenGate`, etc.).
- **D118 posture-sensitive storage copy** (`storageCopy.ts`) untouched — Complete caveat compression is deferred.
- **`m001-review-micro-spec.md` contract** untouched — full Review cut is deferred.
- **Courtside-copy rule §2** respected — every copy change is a label, not a persisted value; no drill-content change.
- **`RecentSessionsList` passivity** preserved.
- **`D127` typography scaffolding** preserved (14 px stays until D91-insight PR).

## Red-team subagents (after implementation)

Launch in parallel:
- `correctness-reviewer` — logic, edge cases, state transitions, especially `composeSummary` session-1 branch and `storageMeta` preroll-flag write timing.
- `scope-guardian-reviewer` — verify the bundle doesn't overreach into deferred items.
- `project-standards-reviewer` — courtside-copy rule, outdoor-UI brief, AGENTS.md compliance.
- `testing-reviewer` — coverage gaps around the 6 changes.

Iterate until no P0/P1 findings remain.

## Follow-up work to update after ship

- `docs/milestones/m001-solo-session-loop.md` — reflect what landed as partner-walkthrough-polish-pass.
- `docs/research/founder-use-ledger.md` — add a reminder row documenting the trigger-gated Tier 1b items that remain (role-swap cue, rep counter, full capture UI, stretch-demo, `Chosen because:` delete).
- `docs/roadmap.md` — note the deferred Review cut as gated on spec revision; note cross-cutting state items (recency auto-fill, net/wall persistence) as Tier 1b candidates.
- `docs/plans/2026-04-20-m001-adversarial-memo.md` Amendment Log — record which items shipped as pre-close-class editorial, which remain trigger-gated.
- `docs/decisions.md` — no new D#; this is all within existing D129 / D130 / courtside-copy-rule authority.

## Voice

Six small, cohesive editorial fixes that let the app sound more like the voice it already has on Transition, Complete, and the `End session early?` modal. No new surfaces, no new spec work, no new drill content. Ship, validate, and then let founder-use evidence unlock the rest.
