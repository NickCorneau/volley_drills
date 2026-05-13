---
title: "feat: coachingCues[0] external-focus second pass + d10 worked specimen"
type: feat
status: active
date: 2026-05-13
origin: docs/plans/2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md
---

# feat: coachingCues[0] external-focus second pass + d10 worked specimen

## Summary

Second-pass sweep on `coachingCues[0]` external-focus enforcement. The 2026-05-10 first-time-runnability sweep is in progress on disk (uncommitted across `app/src/data/drills.ts`, `.cursor/rules/courtside-copy.mdc`, `app/src/data/__tests__/drillCopyRegressions.test.ts`, `app/src/screens/RunScreen.tsx`, plus new `GlossedText` UI primitive). The founder dogfeeded `d10 The 6-Legged Monster` and named `coachingCues[0]` *"Point shoulders to target"* as not actually load-bearing for the active-run reader: the cue points at a body part (shoulders) and asks the reader to introspect orientation, when the load-bearing outcome is *where the ball lands*. Rule 12(b) external-focus is reviewer-only today; the in-progress sweep landed pair-coordination fixes (rule 8/9/10/11), word-count trims (rule 14), and operational-scoring glosses (rule 2 scoring) but did not enforce body-part-token rejection at `coachingCues[0]`. This plan adds that mechanical lint, re-audits the M001 catalog for `[0]` external-focus violations, fixes them with d10 as the worked specimen, and ships the combined sweep behind one PR so the next D130 session lands on a fully-strengthened catalog.

---

## Problem Frame

The user is on the live PWA at the `RunScreen` for `d10-pair The 6-Legged Monster`, rep 3 of 6. They see:

- Eyebrow: `Movement · Pass`
- Drill name: `The 6-Legged Monster`
- Phase label: `Now`
- One cue rendered: `Point shoulders to target.`
- Affordance: `Show more cues and instructions`

The render layout (one-cue-default + drawer affordance) is the U3 ship from the 2026-05-10 plan and is working. The cue copy is the failure. *"Point shoulders to target"* names a body part as the load-bearing instruction, when the active-run reader needs the outcome (where the ball goes). Per rule 12(b), `coachingCues[0]` *"names an outcome (ball flight, target, partner reach, landing mark, contact sound) or an environmental referent — not a body part, joint, muscle, or internal sensation."* The 2026-05-10 sweep applied to `d10-pair` (per the inline comment) but reordered cues without rewriting `[0]`, leaving the body-part-named cue at `[0]`.

A scan of M001-candidate drills' current `coachingCues[0]` reveals the same gap on at least these drills (full audit in U3):

- `d01-solo` `[0] = "Ready posture."` — body-state introspection; no outcome.
- `d01-pair` `[0] = "Pass to a height your partner can catch."` — outcome ✓ (kept for reference).
- `d03-pair` `[0] = "Ribs tucked - do not over-arch."` — body-part introspection.
- `d05-solo` `[0] = "Pass high enough to be settable."` — outcome ✓.
- `d05-pair` `[0] = "Aim your arm angle toward the target."` — body-part with outcome appended; mixed.
- `d09-pair` `[0] = "Platform set early."` — body-part.
- `d10-pair` `[0] = "Point shoulders to target."` — body-part with outcome appended; user-flagged.
- `d11-pair` `[0] = "Arm behind ball."` — body-part.
- `d11-solo` `[0] = "Arm behind ball."` — body-part.
- `d15-pair` `[0] = "Outside leg forward."` — body-part.
- `d15-pair-open` `[0] = "Outside leg forward at contact."` — body-part.
- `d18-pair` `[0] = "Play ball in front."` — outcome (where) ✓.
- `d22-pair` `[0] = "Develop a serving routine."` — process; not body-part.
- `d38-pair` `[0] = "Platform square to target."` — body-part with outcome appended; mixed.
- `d38-solo` `[0] = "Platform square to target."` — same.
- `d39-solo` `[0] = "Contact above the forehead."` — body-part.
- `d40-solo` `[0] = "Move first."` — generic; no outcome.
- `d40-pair` `[0] = "Move first."` — generic; no outcome.

The reviewer-checklist enforcement of rule 12(b) is not catching this class. A mechanical lint would.

---

## Requirements

- R1. Add a mechanical lint in `app/src/data/__tests__/drillCopyRegressions.test.ts` that fails when `coachingCues[0]` of any `m001Candidate: true` drill leads with a body-part token from a flagged-token table. The lint flags only `[0]` (not the rest of the list) because rule 12(b) constrains `[0]` specifically.
- R2. The lint supports a per-variant escape hatch via an inline comment `// cue0-exception: <reason>` adjacent to the variant; the lint scans `drills.ts` source for the comment and skips the variant when present.
- R3. Body-part token table seeded with: `shoulder`, `shoulders`, `arm`, `arms`, `leg`, `legs`, `hip`, `hips`, `knee`, `knees`, `elbow`, `elbows`, `wrist`, `wrists`, `platform`, `ribs`, `forehead`, `forearm`, `forearms`, `posture`, `body`, `head`, `chest`, `back`, `feet`, `ankle`, `ankles`, `palm`, `palms`, `thumb`, `thumbs`, `finger`, `fingers`, `hand`, `hands` (when leading the cue, not as object). The lint detects the token at sentence start (first content word, case-insensitive) or as a possessive-led subject (`"Your shoulders..."`, `"Keep your hips..."`) — not as an object inside a phrase (`"Send the ball past your partner's shoulders"` is fine).
- R4. The lint also flags the imperative pattern *"Point/Square/Aim/Set/Plant/Hold/Tuck/Lift/Drop/Bend/Tilt [body-part] ..."* at sentence start (verbs that act on a body part as their direct object). Token list of body-acting verbs above the body-part list above.
- R5. Re-audit the M001-candidate catalog and update `docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md` with a new column `cue0-external` (✓ pass / ✗ fail / `cue0-exception`) and a per-drill notes column for the exception rationale where used.
- R6. Fix all `cue0-external` ✗ failures in `app/src/data/drills.ts`. Where a load-bearing external cue is already present at `[1]` or `[2]`, reorder. Where no external cue exists, rewrite using the existing rule 12(b) external pattern (outcome / target / ball flight / landing / sound). Each rewrite carries an inline comment `// 2026-05-13 cue0 external-focus second pass: <what changed>`.
- R7. The d10-pair fix is the worked specimen for the second-pass plan. Replace `coachingCues[0]` with an outcome-led cue that survives the active-run triple-only readability probe (rule 13) for a movement-pass drill. Document the rewrite shape in the assessment doc as the canonical d10 specimen.
- R8. The combined PR ships the in-progress 2026-05-10 sweep + this second-pass work as one logical change: catalog ground-truth + lints + audit + cue0 fixes + the 2026-05-10 docs (ideation, requirements, plan, assessment, solutions). Commits stay logically grouped (one commit per implementation unit) so review can follow the chain.

---

## Scope Boundaries

- Do not change the rule 12 sub-rules (a/b/c/d). Rule 12(b) is the rule being enforced; the lint is the new mechanical surface.
- Do not change `coachingCues[]` count on any variant. Reordering and `[0]` rewrite are permitted; adding/removing cues is not.
- Do not change `successMetric.description`, `successMetric.target`, `courtsideInstructions`, `participants`, `equipment`, `workload`, `environmentFlags`, `skillFocus`, `m001Candidate`, `progressionDescription`, or `regressionDescription`. Sweep is `coachingCues[]` only.
- Do not extend rule 12(c) gaze-target-first to drills it does not cover today. Perceptual-cognitive vs movement-mechanical classification is unchanged.
- Do not redo the in-progress 2026-05-10 sweep on `courtsideInstructions` or other fields — that work is already on disk and lands as U1 commit.
- Do not change `RunScreen` render. The one-cue-default is the right surface; the fix is in the cue copy, not the render.
- Do not address recovery / wrap drills (`d25`, `d26`) for cue0 external-focus — rule 12 applies to skill drills; recovery/wrap drills carry their own rule 5 weight and breath-led cues are valid there.

### Deferred to Follow-Up Work

- **Body-part token list extension**: the seed list will likely need extension after the first lint run surfaces real false positives or misses. Tune in U3.
- **Cue rewriting at `[1]` and `[2]`**: this plan only constrains `[0]`. Rule 12(b) extends *as a coverage rule* across the list (cues that are body-part-led should not stack), but enforcement at `[1]`/`[2]` is not a mechanical lint in this plan. PR-review remains the surface for the rest of the list.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/data/drills.ts` — the M001-candidate drill catalog (modified on disk by the 2026-05-10 sweep).
- `app/src/data/__tests__/drillCopyRegressions.test.ts` — existing mechanical lint suite (modified on disk by the 2026-05-10 sweep). New lint follows the existing focused-regression-test style.
- `.cursor/rules/courtside-copy.mdc` — canonical rule file (modified on disk). Rule 12 is the rule being mechanically enforced.
- `docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md` — per-drill assessment artifact (already exists; we extend it with the new `cue0-external` column).
- `docs/solutions/2026-05-10-drill-first-time-runnability-system.md` — system-level reference; remains the canonical entry doc for new authors.
- `app/src/screens/RunScreen.tsx` — the render surface that consumes `coachingCues[0]` (modified on disk by U3 from 2026-05-10 plan; render is not changed in this plan).
- `app/src/components/ui/GlossedText.tsx` (new, on disk) — wraps inline-glossed terms.

### Institutional Learnings

- The 2026-05-10 ideation surfaced rule 12(b) as a cue-ordering coverage rule. The in-progress sweep author treated it as a reviewer-checklist item and didn't catch d10's `[0]`. This is exactly the case the founder warned about in the rule 12 origin paragraph: *"the author IS the doer in D130 founder-use mode; observer-POV cues are unenforceable when no observer is present."* Body-part-led cues at `[0]` are observer-POV cues — the doer cannot self-check "are my shoulders pointed?" mid-rep without breaking concentration.
- Mechanical lint is the right lever when reviewer-checklist enforcement misses a class. The 2026-05-10 plan adopted this pattern (R9 / R14 / rule-2 extensions all mechanical); rule 12(b) was incorrectly classified as reviewer-only because it has more nuance than R9 (body-part can appear as an object, not only a subject).
- Worked-specimen first: the d10 fix is the canonical example future authors land on. The assessment doc carries the d10 before/after as the rule 12(b) worked specimen.

### External References

- Wulf (2013) *Attentional Focus and Motor Learning: A Review of 15 Years* — the external-focus warrant for rule 12(b).
- Vickers (2007) *Quiet Eye* — the gaze-target-first warrant for rule 12(c).
- The 2026-05-10 ideation artifact carries the full warrant trail.

---

## Key Technical Decisions

- **Lint detects body-part tokens at `[0]` start, not anywhere in the cue.** A body-part can appear as an *object* in an external-focus cue ("send the ball past your partner's shoulder" is fine; the action is on the ball). The lint flags subject/imperative position only.
- **Two detection patterns:** (a) body-part token as the first content word ("Shoulders square to target", "Arm behind ball"), and (b) body-acting verb + body-part object at sentence start ("Point shoulders to target", "Tuck ribs"). Both signal the cue is asking the doer to introspect rather than name an outcome.
- **Per-variant escape via inline comment.** Rule 12(b) names legitimate exceptions (safety on a jump-float shoulder cue, beginner stance pre-load). The lint respects `// cue0-exception: <reason>` placed adjacent to the variant in `drills.ts`. Comment is a permanent record visible in PR review.
- **Reorder before rewrite.** When the catalog already has a load-bearing external cue at `[1]` or `[2]`, reorder rather than rewrite. Preserves the author's voice. Only rewrite when no external cue exists in the list.
- **Combined PR.** The in-progress 2026-05-10 sweep ships in the same PR as this second-pass work. Reasoning: the 2026-05-10 work is logically prerequisite (it landed the rule, the lint infrastructure, and the assessment skeleton); shipping them separately doubles the review burden without adding signal.
- **Commit grouping:** one commit per implementation unit. U1 commits the 2026-05-10 baseline cleanly so the second-pass diff is reviewable in isolation. Reviewers can read commit-by-commit.
- **d10 worked specimen target shape:** outcome-led, names where the ball goes. Candidate rewrite: `"Send every pass back to the set window — even from the wide tosses."` Names the outcome (set window), the constraint (every pass), and the harder case (wide tosses) without naming a body part. Final wording lands in U4.
- **No new schema fields.** The 2026-05-10 plan deferred Theme G; this plan honors the deferral.

---

## Open Questions

### Resolved During Planning

- **Should this be a separate plan or an update to 2026-05-10-004?** Separate plan. The 2026-05-10 plan's status is `active` and its diff is large; this is a focused second-pass that surfaced from real founder dogfeed and warrants its own scope. Both plans ship in one PR.
- **Should the lint flag `[1]` and `[2]` too?** No, not in this plan. Rule 12(b) constrains `[0]` specifically as the load-bearing first cue. PR review remains the surface for the rest of the list. Separate brainstorm if the catalog evidence later warrants extension.
- **Should recovery/wrap drills (`d25`, `d26`) be in scope?** No. Rule 12 governs skill drills; breath-led cues on recovery drills are valid and should not be flagged.
- **Should we add a body-part token table to `flaggedTerms.ts` (the new file on disk)?** Likely yes long-term; for this plan, keep the token list inline in the lint test to avoid coupling. Refactor if the same list is needed elsewhere.

### Deferred to Implementation

- **Final body-part token list.** Seed list in R3 above. First lint run will surface false positives (e.g., "Hand the ball to partner") that need either disambiguation or token removal. Tune during U3.
- **d10 final cue wording.** Candidate in Key Technical Decisions; finalize during U4 with founder voice check.
- **Whether to refactor the lint to import from `flaggedTerms.ts`.** Decide during U2 if the same list is reused; otherwise inline.

---

## High-Level Technical Design

This plan is structurally a *commit baseline + lint + audit + fix + verify* sequence. The non-obvious shape is the lint's two-pattern detection (body-part-as-subject + body-acting-verb + body-part-object).

> *The pseudo-code below illustrates the lint's intended detection shape and is directional guidance for review, not implementation specification.*

```text
const BODY_PART_TOKENS = [
  'shoulder', 'shoulders', 'arm', 'arms', 'leg', 'legs',
  'hip', 'hips', 'knee', 'knees', 'elbow', 'elbows',
  'wrist', 'wrists', 'platform', 'ribs', 'forehead',
  'forearm', 'forearms', 'posture', 'body', 'head',
  'chest', 'back', 'feet', 'ankle', 'ankles',
  'palm', 'palms', 'thumb', 'thumbs', 'finger', 'fingers',
  'hand', 'hands',
]

const BODY_ACTING_VERBS = [
  'point', 'square', 'aim', 'set', 'plant', 'hold',
  'tuck', 'lift', 'drop', 'bend', 'tilt', 'face',
  'turn', 'open', 'close', 'rotate', 'extend', 'pull',
  'push', 'press', 'lock', 'relax',
]

function cueLeadsWithBodyPart(cue: string): boolean {
  const firstWord = firstContentWord(cue)         // strips "Your"/"Keep" pre-modifiers
  const secondWord = secondContentWord(cue)
  if (BODY_PART_TOKENS.includes(firstWord.toLowerCase())) return true
  if (
    BODY_ACTING_VERBS.includes(firstWord.toLowerCase()) &&
    BODY_PART_TOKENS.includes(secondWord.toLowerCase())
  ) return true
  return false
}

// Lint
for (const drill of M001_CANDIDATES) {
  for (const variant of drill.variants) {
    if (variantHasCue0Exception(drill.id, variant.id)) continue
    expect(cueLeadsWithBodyPart(variant.coachingCues[0])).toBe(false)
  }
}
```

The `variantHasCue0Exception` helper scans `drills.ts` source as text for `// cue0-exception: <reason>` adjacent to the variant's `id`. This keeps the exception machinery self-contained in the test rather than requiring a schema field.

---

## Implementation Units

- U1. **Commit the in-progress 2026-05-10 sweep as the baseline**

**Goal:** Land the 2026-05-10 plan's U1–U6 work that already exists on disk as a clean baseline commit (or two commits — one for code, one for docs) so the second-pass diff is reviewable in isolation. No new code in this unit.

**Requirements:** R8.

**Dependencies:** None.

**Files:**
- Modify (already on disk): `.cursor/rules/courtside-copy.mdc`, `app/src/data/__tests__/drillCopyRegressions.test.ts`, `app/src/data/drills.ts`, `app/src/screens/RunScreen.tsx`, `app/src/screens/ReviewScreen.tsx`, `app/src/screens/TransitionScreen.tsx`, `app/src/screens/__tests__/RunScreen.coaching-cues-default.test.tsx`, `app/src/screens/__tests__/RunScreen.rationale-placement.test.tsx`, `app/src/screens/__tests__/RunScreen.run-face.test.tsx`, `app/src/components/PerDrillCapture.tsx`, `app/src/components/ui/index.ts`, `app/src/index.css`, `app/src/data/__tests__/drillCopyRegressions.test.ts`, `app/src/domain/__tests__/drillMetadata.test.ts`, `app/eslint-rules/no-inline-primitive-drift.js`, `app/eslint-rules/__tests__/no-inline-primitive-drift.test.js`, `docs/catalog.json`, `docs/brainstorms/2026-05-01-generated-plan-diagnostics-next-steps-requirements.md`, `docs/ideation/2026-04-28-what-to-add-next-ideation.md`, `docs/ideation/2026-05-01-generated-plan-diagnostics-next-steps-ideation.md`, `docs/status/m001-validation-overhang.md`
- Create (already on disk): `app/src/components/ui/GlossedText.tsx`, `app/src/components/ui/__tests__/GlossedText.test.tsx`, `app/src/domain/__tests__/glossedText.test.ts`, `app/src/domain/flaggedTerms.ts`, `app/src/domain/glossedText.ts`, `docs/brainstorms/2026-05-10-drill-first-time-runnability-requirements.md`, `docs/ideation/2026-05-10-drill-first-time-runnability-ideation.md`, `docs/plans/2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md`, `docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md`, `docs/solutions/2026-05-10-drill-first-time-runnability-system.md`

**Approach:**
- Run the existing M001 catalog test suite (`cd app && npx vitest run src/data/__tests__/`) to confirm the in-progress sweep is internally consistent and lints pass on the current catalog. If lints fail, the failures are the 2026-05-10 sweep's empirical evidence — the U2 lint must already be passing for the in-progress baseline; rule 12(b) lint is the new addition in U2 below.
- Stage and commit code changes: `feat(drills): land 2026-05-10 first-time-runnability sweep (rules 8-14 + cue render + drill copy)`.
- Stage and commit docs separately: `docs(drills): land 2026-05-10 first-time-runnability rubric + assessment + solutions doc`.
- Confirm `git status` is clean before proceeding to U2.

**Patterns to follow:**
- Existing commit-message style on this repo (see `git log --oneline -20`): `<type>(<scope>): <imperative present-tense subject>`.

**Test scenarios:**
- Test expectation: none — this unit is a commit-only landing pad. The 2026-05-10 plan owns the test scenarios for the work being committed.

**Verification:**
- `git status --short` is clean.
- `cd app && npx vitest run src/data/__tests__/drillCopyRegressions.test.ts` passes.
- `cd app && npx vitest run src/data/__tests__/catalogValidation.test.ts` passes.

---

- U2. **Body-part token lint for `coachingCues[0]`**

**Goal:** Add a focused mechanical lint in `drillCopyRegressions.test.ts` that fails when `coachingCues[0]` of any `m001Candidate: true` drill leads with a body-part token (subject form) or a body-acting verb + body-part object (imperative form). Exceptions are honored via `// cue0-exception: <reason>` inline comments adjacent to the variant in `drills.ts`.

**Requirements:** R1, R2, R3, R4.

**Dependencies:** U1 (baseline must be clean).

**Files:**
- Modify: `app/src/data/__tests__/drillCopyRegressions.test.ts`
- Test: same file (test is the artifact)

**Approach:**
- Add `BODY_PART_TOKENS` and `BODY_ACTING_VERBS` constants near the top of the test file (see High-Level Technical Design pseudo-code).
- Add a helper `firstContentWords(text: string, n: number): string[]` that strips leading possessives (`"Your"`, `"Our"`, `"My"`) and modal verbs (`"Keep"`, `"Make"`, `"Let"`) and returns the first `n` content words lower-cased and stripped of trailing punctuation.
- Add a helper `cueLeadsWithBodyPart(cue: string): { fails: boolean; reason: string }` implementing the two patterns described in Key Technical Decisions. Return a structured result so the test assertion message names the failing pattern (`"subject"` vs `"verb-object"`) and the offending tokens.
- Add a helper `variantHasCue0Exception(drillId: string, variantId: string, source: string): boolean` that scans the `drills.ts` source text for a comment matching `^\s*//\s*cue0-exception:` within ~10 lines above any line containing `id: '<variantId>'` for the given drill. Read the source via `readFileSync` of the relative path from the test (using `import.meta.url` -> `fileURLToPath`).
- Add the test inside the `'drill copy regressions'` describe block under a new nested describe: `describe('coachingCues[0] external-focus (rule 12b)', ...)`. Use `it.each` over the M001-candidate variants. Skip variants whose drill `skillFocus` is exclusively `recovery` or `warmup` (rule 12 governs skill drills).
- For each variant:
  - If `variantHasCue0Exception(drill.id, variant.id, source)` -> skip with a logged note.
  - Else: assert `cueLeadsWithBodyPart(coachingCues[0]).fails === false`, with a failure message naming drill, variant, the offending cue text, the matched pattern, and a pointer to rule 12(b).
- Tune the body-part token list and body-acting verb list during a first run if false positives surface. Document tuning notes inline in the test file as `// 2026-05-13 cue0 lint tuning: <token>: <decision>`.

**Execution note:** This lint will fail on multiple drills on first run — those failures are the empirical input to U3's audit. Do not try to make the lint green by shrinking the token list; the failures are the work U4 fixes.

**Patterns to follow:**
- Existing focused-regression-test style in `drillCopyRegressions.test.ts` (em-dash exclusion, skill-verb-first lint).
- Existing `it.each` shape over `activeCopySurfaces()` for per-variant iteration (this lint is per-variant; the `[0]` cue is variant-scoped).

**Test scenarios:**
- Covers R1. Happy path: a drill with `coachingCues[0] = "Pass to the set window"` passes (subject is "Pass" verb, no body-part).
- Covers R3. Error path: a drill with `coachingCues[0] = "Shoulders square to target"` fails the subject-pattern with a clear message naming "shoulders".
- Covers R4. Error path: a drill with `coachingCues[0] = "Point shoulders to target"` fails the verb-object pattern with a clear message naming "point" + "shoulders".
- Covers R2. Edge case: a drill with an inline comment `// cue0-exception: jump-float safety on shoulder cue` adjacent to its variant id passes regardless of the cue's body-part-led shape.
- Edge case: cues with leading possessive `"Your platform faces target"` are detected (`"platform"` is the body-part subject after stripping `"Your"`).
- Edge case: cues with leading modal `"Keep your platform stable"` are detected (`"platform"` after stripping `"Keep"` + `"your"`).
- Edge case: cues where body-part is the object inside a phrase (`"Send the ball past your partner's shoulder"`) pass — the subject is the implied "you" + "Send" verb, not the body-part.
- Integration: the lint produces N failure messages on first run (N = U3 audit count) and can be silenced exactly by U4's fixes.

**Verification:**
- The lint compiles and runs.
- On first run against the U1 baseline catalog, the lint produces a non-empty list of failures; capture the count and per-drill list as input to U3.
- After U4's fixes, the lint passes (zero failures or only `cue0-exception` skips).
- Existing tests in `drillCopyRegressions.test.ts` continue to pass.

---

- U3. **Audit current M001 cue[0] state and update assessment**

**Goal:** Run the U2 lint, capture the failure list, and extend `docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md` with a new `cue0-external` column and per-drill notes for the failures. Add a short "Cue[0] second pass (2026-05-13)" section near the bottom of the assessment that captures the audit method, lint output, and rewrite plan.

**Requirements:** R5.

**Dependencies:** U1 (baseline clean), U2 (lint output is the empirical input).

**Files:**
- Modify: `docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md`
- Read: `app/src/data/drills.ts` (current cue[0] for each variant), U2 lint output

**Approach:**
- Run `cd app && npx vitest run src/data/__tests__/drillCopyRegressions.test.ts -t "external-focus"` and capture the failure list. (Quote the test-name pattern according to the local shell escaping conventions.)
- For each failing variant, classify the fix shape:
  - **Reorder** — at least one cue in `coachingCues[1]`/`[2]` is already external (outcome / target / ball / sound / partner). Fix is to swap.
  - **Rewrite** — no existing cue is external; `[0]` needs new copy.
  - **Exception** — body-part is load-bearing for safety or beginner-stage pattern (rare).
- Add a `Cue[0] second pass (2026-05-13)` section to the assessment doc with:
  - Method: ran U2 lint; cross-checked against rule 12(b) flagged tokens.
  - Findings table: drill | variant | current `[0]` | failing pattern | classification (reorder / rewrite / exception) | proposed `[0]` (for rewrites).
  - Tally: count of reorders / rewrites / exceptions / passes.
  - Rationale for each exception, if any.
- Update the existing per-drill rows (R10–R15 reviewer-checklist matrix) with a new `cue0-external` column header. Mark each row ✓ or ✗ based on the lint result.

**Patterns to follow:**
- Existing assessment doc structure (see "Per-drill classification" table and "Reviewer-checklist matrix" table).
- Existing tally-row format at the bottom of the assessment.

**Test scenarios:**
- Test expectation: none — assessment is human-curated. Mechanical evidence comes from U2 lint output.

**Verification:**
- The assessment doc has a new `cue0-external` column on the reviewer-checklist matrix.
- The new "Cue[0] second pass (2026-05-13)" section is present and includes the lint findings and fix classifications.
- The findings table classifies every failing variant.
- `bash scripts/validate-agent-docs.sh` passes (no frontmatter or routing drift).

---

- U4. **Fix violating drills (d10 worked specimen + reorder/rewrite the rest)**

**Goal:** Fix all `cue0-external` ✗ failures in `app/src/data/drills.ts`. Reorder where possible; rewrite where not. d10-pair gets the worked-specimen rewrite documented in the assessment as the canonical pattern.

**Requirements:** R6, R7.

**Dependencies:** U2 (lint), U3 (audit + classification).

**Files:**
- Modify: `app/src/data/drills.ts`
- Modify: `docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md` (record final wording for d10 worked specimen)

**Approach:**
- For each variant classified **reorder** in U3: swap `coachingCues[]` so the existing external cue moves to `[0]`. Add a single inline comment on the variant: `// 2026-05-13 cue0 second pass: reorder external [N] -> [0]`.
- For each variant classified **rewrite** in U3: rewrite `coachingCues[0]` to name the outcome / target / ball flight / partner reach / landing. Use the existing rule 12(b) external pattern and keep wording short (≤ 12 words preferred). Add inline comment: `// 2026-05-13 cue0 second pass: rewrite [0] for external focus`.
- For d10-pair specifically (worked specimen):
  - Current: `coachingCues[0] = 'Point shoulders to target.'`
  - Proposed: `'Send every pass back to the set window — even from the wide tosses.'` (final wording chosen during this unit; alternatives: `'Pass into the set window from every spot.'`, `'Land each pass in the set window, wide tosses too.'`).
  - Existing `[1]` and `[2]` carry the body-mechanics refinement and the platform-feel cue; reorder so the new `[0]` leads, then keep `'Drop near shoulder, lift far shoulder on wide passes.'` and `'Feel your platform face the target before contact.'` as `[1]` and `[2]`.
  - Document the final wording in the U3 assessment doc's worked-specimen section.
- For each variant classified **exception** (if any): add the inline comment `// cue0-exception: <reason>` adjacent to the variant id.
- After all fixes: run `cd app && npx vitest run src/data/__tests__/drillCopyRegressions.test.ts` and confirm zero failures.

**Execution note:** Apply fixes drill-by-drill rather than batch-rewriting. Re-run the U2 lint after each drill (or each batch of 3 drills) so the green column grows incrementally and any new failure surface during a rewrite (e.g., a rewrite that introduces a different rule violation) is caught immediately.

**Patterns to follow:**
- Existing 2026-05-10 sweep comment style in `drills.ts` (`// 2026-05-10 first-time-runnability sweep: <what changed>`).
- Existing rule 12(b) external-focus exemplars in current catalog: `d05-solo` `"Pass high enough to be settable"`, `d18-pair` `"Play ball in front"`, `d22` `"Develop a serving routine"`, `d31`/`d33` target-named cues.
- `d07-pair` rewrite from the 2026-05-10 sweep (see drills.ts lines around 530) — `"Look at your partner's hand the moment your platform meets the ball"` is the gaze-target-first specimen; reuse shape for any perceptual drills where applicable.

**Test scenarios:**
- Covers R7. Happy path: `d10-pair` `coachingCues[0]` after rewrite passes the U2 cue0 lint and a manual rule 12(b) read (no body-part token at subject; outcome named).
- Covers R6. Happy path: each drill in U3's reorder list passes the U2 lint after the swap.
- Covers R6. Happy path: each drill in U3's rewrite list passes the U2 lint after the new wording lands.
- Covers R6. Happy path: each variant in U3's exception list passes the U2 lint via the inline comment escape.
- Integration: existing `drillCopyRegressions.test.ts` rules (em-dash exclusion, skill-verb-first, R9, R14, rule-2 extensions from the 2026-05-10 sweep) all continue to pass after the U4 edits — the cue0 fixes do not regress prior rule coverage.
- Integration: `catalogValidation.test.ts` continues to pass (no envelope drift).

**Verification:**
- All M001-candidate drills pass the U2 cue0 lint (zero failures).
- Existing copy lints and catalog validation all pass.
- `d10-pair` `coachingCues[0]` reads as a standalone outcome instruction the doer can self-check by watching the ball land.
- A spot-check on 3 P0 drills (`d10-pair`, `d22-pair`, `d33-pair-open`) confirms the strengthened cue0 reads correctly on a dev courtside session (via `npm run dev` if available; otherwise via the `RunScreen` test snapshot).

---

- U5. **Verify lints pass + triple-only spot-check + update assessment**

**Goal:** Run the full app test suite and the docs validation script. Update the assessment doc to reflect post-fix state. Spot-check 3 drills' triple-only readability (rule 13) to confirm cue0 fixes did not break the structural-sufficiency contract.

**Requirements:** R5, R6.

**Dependencies:** U4.

**Files:**
- Modify: `docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md` (final post-fix state)
- Read: `app/src/data/drills.ts`, lint output

**Approach:**
- Run `cd app && npm test` and confirm green.
- Run `bash scripts/validate-agent-docs.sh` and confirm green.
- Apply the rule 13 triple-only readability probe on 3 P0 drills (`d10-pair`, `d22-pair`, `d33-pair-open`):
  - Mentally delete `courtsideInstructions`. Read only `skillFocus` (eyebrow) + `successMetric.description` + `coachingCues[0]`. Can the reader execute the drill correctly?
  - Record the verdict in the assessment doc's worked-specimen section.
- Update the assessment doc's "Cue[0] second pass (2026-05-13)" section with the post-fix state: all rows now ✓; record any per-drill notes worth carrying forward (e.g., d10 worked specimen rationale).
- Update the assessment doc's tally rows to reflect the post-fix state.

**Patterns to follow:**
- Existing rule 13 triple-only probe described in `.cursor/rules/courtside-copy.mdc`.
- Existing assessment doc tally format.

**Test scenarios:**
- Test expectation: none — verification + doc update only. The mechanical proof is the U2 lint passing on the full M001 catalog.

**Verification:**
- `cd app && npm test` exits 0.
- `bash scripts/validate-agent-docs.sh` exits 0.
- The assessment doc's `cue0-external` column shows ✓ for every M001-candidate variant (or `cue0-exception` annotation for any documented exceptions).
- The triple-only probe on `d10-pair`, `d22-pair`, `d33-pair-open` passes with notes recorded.

---

## System-Wide Impact

- **Interaction graph:** No UI behavior change. The render path consuming `coachingCues[0]` is the same (`RunScreen` one-cue-default from the 2026-05-10 ship). Only the cue copy changes.
- **Error propagation:** No runtime error strategy change. Lint failures fail at test time, not runtime.
- **State lifecycle risks:** Existing saved plans snapshot drill copy at session-start. Updates affect newly generated sessions only. No Dexie schema migration.
- **API surface parity:** No public API or exported model contract changes. `coachingCues: string[]` shape is preserved.
- **Integration coverage:** New U2 lint + existing `drillCopyRegressions.test.ts` rules + existing `catalogValidation.test.ts` cover the change surface. Generated diagnostics report/triage runs surface any structural drift.
- **Unchanged invariants:** `workload`, `fatigueCap`, `participants`, `equipment`, `environmentFlags`, `skillFocus`, `m001Candidate`, progression-graph semantics, Dexie schema (v6), `coachingCues[]` count per variant, and all `successMetric` / `courtsideInstructions` / `objective` / `teachingPoints` text.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Body-part token list catches false positives (e.g., `"Hand the ball to partner"` -> "Hand" matches `hand`) | Distinguish verb-form vs noun-form via the second-word check: `"Hand"` followed by an article (`the`/`a`) is a verb; followed by `"to"` is a verb. Keep the lint conservative; tune in U3. Use the inline `cue0-exception` escape for legitimate edge cases. |
| Reorder breaks the narrative flow of the cue list (e.g., the original `[0]` was the natural setup cue and `[2]` was the outcome) | The strengthened rubric makes priority-order the contract, not narrative-order (rule 12 origin). Reordering is the right move. If a specific drill's reorder reads awkwardly mid-rep, escalate to rewrite. |
| d10-pair's rewritten cue feels less actionable than the original | The rewrite must survive the rule 13 triple-only probe. Test on the dev courtside session before committing. Carry alternative wordings in the assessment doc for future iteration. |
| The lint fires on cues using body-part tokens metaphorically (e.g., `"Have eyes for the ball"`) | Token list is conservative; `"eyes"` / `"vision"` / `"sight"` are not in the list. Add escape-comment guidance if a metaphor cue surfaces. |
| Rewriting cues introduces a new rule violation (e.g., em-dash, skill-verb-first miss, R14 overflow on the cue length) | Each fix runs the full `drillCopyRegressions.test.ts` suite. Other rules' lints catch cross-rule regressions. |
| Combined PR (2026-05-10 baseline + 2026-05-13 second pass) is hard to review | Commit per implementation unit (U1 = baseline, U2 = lint, U3 = audit doc, U4 = fixes, U5 = verification). Reviewers can read the diff commit-by-commit. PR description carries the chain. |
| Founder voice on d10's rewrite is wrong on first try | Rewrite is reversible; document alternatives in the assessment doc; treat the next D130 dogfeed as the falsification surface. |
| The 2026-05-10 sweep on disk has an unintended regression that surfaces in U1's commit | U1's verification step runs the full lint suite on the baseline before committing. If a regression surfaces, fix in U1 before proceeding. |

---

## Documentation / Operational Notes

- The assessment doc (`docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md`) carries the canonical cue0 worked specimen for d10 — future authors land here when looking for rule 12(b) examples.
- The 2026-05-10 plan and this plan ship together. After landing, mark both `status: complete` if applicable, or leave `active` if follow-up work remains (e.g., D101 3+ player support, Theme G schema additions, pacing-audio infra).
- The next D130 founder session is the falsification surface: re-run d10-pair (and any other rewritten drills) and confirm the body-part-introspection class does not surface again. If it does, the rule failed and gets revised, not the reader.
- The body-part token list is now mechanically enforced; future authors will see lint failures rather than silent drift.

---

## Sources & References

- **Origin plan:** [docs/plans/2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md](2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md)
- **Origin requirements:** [docs/brainstorms/2026-05-10-drill-first-time-runnability-requirements.md](../brainstorms/2026-05-10-drill-first-time-runnability-requirements.md)
- **Origin assessment:** [docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md](../reviews/2026-05-10-drill-first-time-runnability-assessment.md)
- **Origin solutions doc:** [docs/solutions/2026-05-10-drill-first-time-runnability-system.md](../solutions/2026-05-10-drill-first-time-runnability-system.md)
- **Canonical rule file:** `.cursor/rules/courtside-copy.mdc` (rule 12 + the cue ordering rule lives here)
- **Drill catalog:** `app/src/data/drills.ts`
- **Mechanical lints home:** `app/src/data/__tests__/drillCopyRegressions.test.ts`
- **External warrant:** Wulf (2013) *Attentional Focus and Motor Learning: A Review of 15 Years* — external-focus rubric for rule 12(b).
- **Founder dogfeed evidence (this plan's origin):** 2026-05-13 founder report on `d10-pair` `coachingCues[0]` "Point shoulders to target" — *"that's not really a good cue"*.
