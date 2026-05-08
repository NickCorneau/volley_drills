---
id: plan-2026-05-05-001
title: "ops: Merge feat/focus-coverage-readiness into main and collapse to single-branch flow"
status: active
stage: validation
type: plan
authority: "Implementation plan for merging the unmerged feat/focus-coverage-readiness line into main, deleting feat branches, restoring lost skill-level mutability features as a follow-up commit, and adopting a single-branch (push-immediately) policy."
last_updated: 2026-05-07
depends_on:
 - docs/plans/2026-05-04-001-feat-skill-level-mutability-plan.md
 - docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md
 - docs/plans/2026-05-06-001-refactor-d137-tune-today-routing-cleanup-plan.md
 - docs/plans/2026-05-07-001-engine-two-pass-band-relax-plan.md
 - docs/plans/2026-05-07-002-d138-diagnostic-spine-canonicality-plan.md
 - docs/status/current-state.md
summary: "Strategy: accept feat/focus-coverage-readiness on overlapping-file conflicts (-X theirs), preserve main-only adds (focusCoverageAudit, SettingsSkillLevelScreen, SkillLevelPicker), then port the Tune today relaxation eyebrow + Settings sub-route forward in a follow-up commit on the merged base. Tag main pre-merge for safety. Delete both feat branches after merge. Document single-branch push-immediately policy in AGENTS.md."
---

# Merge feat/focus-coverage-readiness + collapse to single-branch

## Why now

User invoked `/lfg` with the explicit ask:

> i want to prioritize merging in feat/focus-coverage-readiness and then we
> fix the skill stuff, but lets fully merge in that branch and get rid of it.
> also main + origin/main shouldnt be a thing. lets just make everything
> origin/main (so collapse everything into a single branch, i hate this
> confusion across branches its too error prone)

Two problems being solved simultaneously:

1. **Merge debt.** `origin/feat/focus-coverage-readiness` (tip `4101539`) carries
   25 commits of focus-readiness diagnostics + UI consolidation that were never
   merged into main. The May 4 confusion (Tune today appears missing,
   wall/fence still present) traced back to this unmerged line, not a
   regression on main.
2. **Branch-divergence anxiety.** Multiple times this week the user has had
   to mentally distinguish local `main` from `origin/main`, multiple feat
   branches, etc. They want one source of truth.

## Scope

**In scope:**

- Merge `origin/feat/focus-coverage-readiness` into `main`, accepting feat on
  overlapping-file conflicts.
- Preserve main-only adds (focus coverage audit module + tests, Settings
  sub-route + Picker).
- Re-apply the Tune today relaxation eyebrow on top of the merged base where
  feasible (R10 / KD9 of the skill-level-mutability brainstorm).
- Push merged main to origin immediately.
- Delete `feat/focus-coverage-readiness` (local + remote).
- Delete `feat/warmup-wrap-segment-snap` (already merged-equivalent in main).
- Add a one-paragraph "single-branch push-immediately" policy to `AGENTS.md`.

**Explicitly NOT in scope:**

- A clean rebase of skill-level-mutability commits onto the merged base. The
  user said "we fix the skill stuff after"; conflicts are too dense for a
  surgical rebase to be worth the time. Re-add only the eyebrow + Settings
  sub-route by hand.
- Deep reconciliation of focus-readiness diagnostics output with the new
  focus coverage audit. Both can coexist (different output shapes, different
  consumers); a follow-up plan can decide whether to deprecate one.
- Re-running the parallel ce-code-review pass on the merged tree. The
  pipeline's `ce-code-review mode:autofix` step will catch surface issues;
  the deeper review can wait for the follow-up skill-stuff PR.

## Architecture

**Branch state pre-merge:**

- `main` / `origin/main`: `509f000` (skill-level mutability + focus coverage
  audit + Tune today eyebrow on the post-Tune-today base).
- `origin/feat/focus-coverage-readiness`: `4101539` (focus-readiness
  diagnostics + ChoiceSection UI layer + Setup-bypass-Tune-today routing,
  forked from `3e81a72`).
- Merge base: `3e81a72` (`feat(setup): Tune today, session focus assembly,
  and pre-run docs`).
- Overlapping changed files (24): all of `app/src/domain/sessionAssembly/*`,
  `SetupScreen.tsx`, `TuneTodayScreen.tsx`, `useTuneTodayController.ts`,
  `regenerateDraftFocus.ts`, `SettingsScreen.tsx`, `SkillLevelScreen.tsx`,
  `useSessionRunner.ts`, `routes.ts`, `HomeScreen.tsx`, `AGENTS.md`,
  `package.json`, `.gitignore`, plus tests + catalog/status docs.

**Merge strategy: `git merge -X theirs`.**

`-X theirs` resolves text conflicts in favor of the merged-in branch
(`feat/focus-coverage-readiness`), which is the user's stated priority.
Files that exist only on `main` (the picker, Settings sub-route, focus
coverage audit module, several test files) are unaffected by the strategy
flag — they remain on the merged tree because git's three-way merge sees
no conflict for "added on main, untouched on feat".

**Predicted lossy outcomes from `-X theirs`:**

| Lost / overwritten | Restoration plan |
| --- | --- |
| Tune today relaxation eyebrow render in `TuneTodayScreen.tsx` | Re-add as a follow-up commit (see U6 below). |
| `useTuneTodayController.ts` exposing `levelRelaxed` + `goToSettings` | Re-add as part of U6. |
| Two-pass `pickForSlot` / `pickMainSkillSubstitute` taking `effectiveLevelValue` | Feat branch has its own focus-readiness skill-level wiring (`d67f65d feat: apply skill level to focused generation`); accept feat's wiring. The d135 two-pass mechanism is functionally redundant on the merged base. |
| `SessionDraft.levelRelaxed` field in `model/draft.ts` | Drop. The eyebrow re-add will derive relaxation locally if feasible; otherwise the eyebrow becomes a known-deferred follow-up. |
| Settings `SetupScreen` Promise.allSettled onboarding read | Drop; feat's SetupScreen reads onboarding inline already. |

**Files preserved (main-only adds):**

- `app/src/components/onboarding/SkillLevelPicker.tsx` + tests
- `app/src/screens/SettingsSkillLevelScreen.tsx` + tests
- `app/src/data/focusCoverageAudit.ts` + tests + snapshot
- `app/scripts/generate-coverage-report.ts`
- `docs/reviews/2026-05-04-focus-coverage-audit.md`
- `docs/research/2026-05-04-pair-serving-session-feedback.md`
- `docs/research/founder-use-ledger.md` updates
- `docs/solutions/workflow-issues/route-founder-use-feedback-without-overfiring-scope-2026-05-04.md`
- `docs/residual-review-findings/feat-warmup-wrap-segment-snap.md`
- The skill-level brainstorm and plan docs.

**Single-branch policy (post-merge):**

- All work happens directly on `main`.
- After every commit, `git push origin main` immediately.
- No local-only commits beyond a few minutes during a single pipeline.
- New `AGENTS.md` paragraph documents this; no automation enforces it (the
  push-immediately discipline is human-owned).

## Implementation Units

### U1 — Pre-merge safety tag

Tag the current `main` tip so the pre-merge state is recoverable without
having to dig through the reflog.

```bash
git tag -a pre-focus-coverage-merge-2026-05-05 \
  -m "main tip immediately before merging feat/focus-coverage-readiness (2026-05-05)" 509f000
git push origin pre-focus-coverage-merge-2026-05-05
```

### U2 — Merge with `-X theirs`

```bash
git checkout main
git merge --no-ff -X theirs origin/feat/focus-coverage-readiness \
  -m "Merge branch 'feat/focus-coverage-readiness' into main (accept feat on conflicts)"
```

If git reports any conflicts (rare with `-X theirs`, but binary files or
add/add conflicts on different content can still surface), resolve them
preferring feat for code, preferring main for the four main-only doc
adds listed above.

### U3 — Verify build + test pass on merged tree

```bash
cd app
npx tsc -b --noEmit
npm run lint
```

If typecheck or lint fails, the most likely cause is a stale main-only
file referencing a feat-removed export. Fix the smallest set of files
needed (likely: drop the picker prop wiring if feat removed it, etc.).

### U4 — Wire main-only Settings sub-route into feat's routes.ts

Feat reworks `app/src/routes.ts` significantly (route names, contracts).
After merge, verify:

- `/settings/skill-level` still resolves to `SettingsSkillLevelScreen`.
- `routes.settingsSkillLevel()` still exists.
- `screenContracts.ts` includes `settingsSkillLevel`.

If feat dropped any of these (it forked before the route was added), re-add
them as small edits in this unit.

### U5 — Wire main-only SettingsScreen sub-section into feat's SettingsScreen

Feat changed `SettingsScreen.tsx` substantially (per the diff: 106 lines). Main
added a Skill level section (per the diff: 76 lines). After accepting feat
on conflict, the section is gone. Re-add the section in this unit, using
feat's new component primitives where they exist (e.g., feat's `ChoiceSection`
or `Card` if the section now belongs in one).

### U6 — Re-add Tune today relaxation eyebrow (best-effort)

Feat removed the `levelRelaxed` plumbing. Two options evaluated:

**Option A (preferred): re-add the field + eyebrow on the merged base.** Add
`levelRelaxed?: boolean` back to `SessionDraft`, set it in `buildDraft`'s
return path (likely needs to interact with feat's new `focusReadiness`
module — confirm the integration point), expose via the controller, render
the eyebrow.

**Option B (fallback if A is too tangled): defer the eyebrow.** Leave
`levelRelaxed` out of the merged tree. Document it as a residual finding
to handle in the follow-up skill-stuff PR. The Settings sub-route + Picker
still ship; the eyebrow becomes the deferred piece.

Pick Option A unless feat's `sessionAssembly` rewrite makes the
`levelRelaxed` derivation non-trivial. Hard timebox: 30 min. If A doesn't
land cleanly in 30 min, switch to B.

### U7 — Push merged main to origin

```bash
git push origin main
```

### U8 — Delete feat branches

```bash
git push origin --delete feat/focus-coverage-readiness
git branch -D feat/focus-coverage-readiness
git push origin --delete feat/warmup-wrap-segment-snap
git branch -D feat/warmup-wrap-segment-snap
```

`feat/warmup-wrap-segment-snap` is already merged-equivalent in main
(`7219a2e` and `8910303` are in the May-4 docs prefix on main). Delete
without merging.

### U9 — Document single-branch policy in AGENTS.md

Add a short paragraph under `## Operational Constraints`:

> **Single-branch flow (2026-05-05 onward).** All work happens on `main`.
> Push to `origin` after every commit. No long-lived feature branches —
> if the change needs review-time isolation, branch for the duration of
> the work and merge back the same session. The branch-vs-origin
> divergence has been a repeated source of confusion; the discipline is
> human-owned and intended to keep `main` and `origin/main` in lock-step.

### U10 — Update catalog + status

- `docs/catalog.json`: bump `last_updated`, add this plan entry.
- `docs/status/current-state.md`: append a "2026-05-05" entry recording
  the merge, the lost-and-restored map, and the new single-branch policy.

## Verification

```bash
cd app
npx tsc -b --noEmit                              # must be clean
npm run lint                                     # must be clean
npm test -- focusCoverageAudit SettingsScreen \
   SettingsSkillLevelScreen SkillLevelPicker \
   TuneTodayScreen SetupScreen sessionBuilder    # the surfaces most likely to break
npm run dev                                      # smoke: Setup → Build → routes correctly
```

Then ce-code-review autofix pass + ce-test-browser pipeline mode per
LFG steps 3 + 6.

## Rollback

If the merged tree is broken beyond what U3-U6 can fix in one session:

```bash
git reset --hard pre-focus-coverage-merge-2026-05-05
git push --force-with-lease origin main
```

The backup tag exists exactly for this.

## Open follow-ups (after pipeline DONE)

- ~~"Skill stuff fix" — full rebase of the skill-level mutability work
  (engine wiring, two-pass picker, eyebrow if deferred in U6) onto the
  merged base. Not in this pipeline.~~ **Resolved 2026-05-07** in two
  passes:
  1. The user-visible `levelRelaxed` eyebrow + `regenerateDraftFocus`
     plumbing was retired by `D137` (`docs/plans/2026-05-06-001-refactor-d137-tune-today-routing-cleanup-plan.md`).
     No replacement UI is shipping; that part of the thread is closed
     by intent.
  2. The engine question — does the post-merge hard `playerLevel`
     filter silently produce thin sessions for `competitive_pair` on
     serve / set? — was investigated and resolved in
     `docs/plans/2026-05-07-001-engine-two-pass-band-relax-plan.md`.
     `pickForSlot` now prefers an out-of-band UNUSED same-focus drill
     over duplicating an in-band drill on a focus-controlled REQUIRED
     slot whose in-band UNUSED pool has been exhausted. Engine-only,
     no UI surface; the audit and the runtime engine now share
     `partitionByLevel` as the single band-membership predicate.
- Reconciliation between feat's `focusReadiness` diagnostic output and
  the new `focusCoverageAudit` module — they overlap in intent but
  produce different artifacts. **Resolved 2026-05-07** as `D138`
  (`docs/plans/2026-05-07-002-d138-diagnostic-spine-canonicality-plan.md`,
  `docs/decisions.md` `D138`). Investigation showed the overlap was
  not "two complementary surfaces" but "two parallel implementations
  where one was already retired by attrition." `focusCoverageAudit`
  is the live detection diagnostic (snapshot regression test, markdown
  report at `docs/reviews/2026-05-04-focus-coverage-audit.md`, walks
  the user-facing 5-tier `SkillLevel`, risk-bucket vocabulary
  maintained by `D137`). `focusReadiness`'s audit logic
  (`buildFocusReadinessAudit`, `evaluateFocusReadinessCell`) and
  gap-card / activation-manifest remediation API were a parallel
  implementation whose only remaining consumers were its own tests;
  no script, plan, or product surface ever consumed the gap-card /
  activation-manifest workflow. Resolution: prune `focusReadiness.ts`
  to the dimension constants and types still imported by
  `app/src/domain/generatedPlanDiagnostics.ts` (`VisibleFocus`,
  `ReadinessConfiguration`, `ReadinessConfigurationId`,
  `VISIBLE_FOCUSES`, `PLAYER_LEVELS`, `READINESS_DURATIONS`,
  `READINESS_CONFIGURATIONS`); delete `focusReadiness.test.ts`
  (the dimension constants are exercised through
  `generatedPlanDiagnostics.test.ts`); rewrite the doc-comment to
  declare the file's narrower role and record why the speculative
  remediation API was retired so future agents do not silently
  restore an unmaintained surface. Engine-only — zero behavior
  change in any live diagnostic; zero UI surface change;
  `focusCoverageAudit` snapshot unchanged at 180/180 covered;
  `generatedPlanDiagnostics` 540 cells unchanged. `D139`
  (validator script gating / compression) remains separately deferred.
