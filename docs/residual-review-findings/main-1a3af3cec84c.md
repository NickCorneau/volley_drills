---
id: residual-review-findings-main-1a3af3cec84c
title: Residual review findings — cue[0] external-focus second pass
type: review-residual
status: active
stage: validation
date: 2026-05-13
last_updated: 2026-05-13
related_commits:
  - fc27ddb
  - 8b0e5fa
  - 1a3af3c
plan_ref: docs/plans/2026-05-13-003-feat-cue-zero-external-focus-second-pass-plan.md
---

# Residual Review Findings

Source: `ce-code-review` autofix run on commits `fc27ddb` (cue[0] external-focus second pass + d10 worked specimen), `8b0e5fa` (assessment doc cue[0] section), `1a3af3c` (autofix). The autofix commit applied the safe_auto findings from 5 persona reviewers (`ce-correctness`, `ce-testing`, `ce-maintainability`, `ce-project-standards`, `ce-kieran-typescript`); this file records the residual `gated_auto` and `manual` findings that need follow-up but were intentionally not auto-applied.

No open PR exists for this branch (`main`, single-branch flow per `AGENTS.md`); this file is the durable record per the LFG residual-handoff fallback.

## Findings

- **[P1] [gated_auto -> downstream-resolver] `app/src/data/__tests__/drillCopyRegressions.test.ts` — `BODY_ACTING_VERBS` missing `hold` and `push` (plan named both)** (ce-testing-reviewer, confidence 75)
  - **Why it matters:** The plan's `R4` body-acting verb seed list named `hold` and `push` but the implementation omitted them. Cues like `"Hold platform first"` (which appears today on `d07-pair`'s `coachingCues[1]`, not [0] — but plausibly leaks into [0] on a future drill) would silently pass the lint. Suggests adding both tokens to the verb table.
  - **Suggested fix:** Add `'hold'` and `'push'` to `BODY_ACTING_VERBS`. Re-run lint; verify no new false positives surface.

- **[P2] [gated_auto -> downstream-resolver] `app/src/data/__tests__/drillCopyRegressions.test.ts` — Verb + possessive + body-part pattern silently passes** (ce-correctness-reviewer + ce-testing-reviewer, confidence 75 — cross-reviewer corroborated)
  - **Why it matters:** `evaluateCue0`'s verb-object pattern only checks the immediate next content word after the body-acting verb. Cues like `"Aim your arm angle toward the target."` (currently shipping on `d05-solo` `coachingCues[0]`) escape detection because `your` separates `aim` from `arm`. The founder is the surface that exposed the original `d10-pair` bug and `d05-solo` is currently in the same shape; closing this gap before the next D130 session reduces re-surface risk.
  - **Suggested fix:** Strip leading possessives from the second-word position too (mirror the `LEADING_STOPWORDS` strip applied to the first word). Then update `d05-solo`'s `coachingCues[0]` to lead with the outcome (e.g., `"Aim every pass at the target."`).

- **[P3] [gated_auto -> downstream-resolver] `app/src/data/__tests__/drillCopyRegressions.test.ts` — Subject pattern only inspects first content word; body-state cues without body-part nouns slip through** (ce-correctness-reviewer, confidence 75)
  - **Why it matters:** `"Ready posture."` (d01-solo) and `"Contact above the forehead."` (d39-solo) escape detection because `ready` and `contact` aren't in `BODY_PART_TOKENS` or `BODY_ACTING_VERBS`, even though both cues are body-state introspection per Wulf 2013. Lint scope is intentionally narrow (rule 12b is about body-part naming) but worth surfacing as a known gap.
  - **Suggested fix:** Either accept the gap and document it explicitly in the lint's docstring (preferred — keeps the lint conservative), or extend with a `BODY_STATE_TOKENS` set (`ready`, `posture`, `contact`, `stance`, etc.) under a separate sub-rule so the gap closes deliberately rather than by lint widening.

- **[P3] [manual -> downstream-resolver] `app/src/data/__tests__/drillCopyRegressions.test.ts` — Plural body-part forms (`Eyes`, `Hands`) cannot act as verbs in disambiguation** (ce-kieran-typescript-reviewer, confidence 50)
  - **Why it matters:** `BODY_PART_VERB_FORMS` contains only singular forms (`hand`, `eye`, `back`, `head`, `palm`). A future cue like `"Eyes on ball"` (plural) would fail the subject pattern even though `eyes on` is a metaphorical external-focus cue. Today's catalog has no such cue, so this is theoretical until it surfaces.
  - **Suggested fix:** Add plural forms to `BODY_PART_VERB_FORMS` only when a real catalog cue surfaces using the pattern, OR extend `VERB_FOLLOWERS` disambiguation to handle plural-noun-led cues that read as "X on Y" (preposition-led metaphor).

- **[P3] [manual -> downstream-resolver] `app/src/data/__tests__/drillCopyRegressions.test.ts` — Coverage assertion is a soft floor; pin to exact M001 count to detect scope drift** (ce-testing-reviewer + ce-project-standards-reviewer + ce-kieran-typescript-reviewer, confidence 75 — cross-reviewer corroborated)
  - **Why it matters:** `expect(cue0Cases.length).toBeGreaterThan(20)` confirms the lint is iterating over a non-trivial set but would not detect a regression that silently halves the M001-candidate skill-drill set (e.g., an accidental `m001Candidate` flip or a broken `skillFocus` filter). Today's count is in the low 40s.
  - **Suggested fix:** Replace `> 20` floor with `expect(cue0Cases.length).toBe(<actual count>)`, or add a separate test that pins per-skill counts (`pass`, `serve`, `set`).

- **[P3] [manual -> human] `docs/catalog.json` — New 2026-05-13-003 plan not registered in catalog (matches sibling-plan precedent, but routing rule says register)** (ce-project-standards-reviewer, confidence 50)
  - **Why it matters:** `.cursor/rules/machine-scannable-docs.mdc` says "When adding or renaming canonical docs, update `docs/catalog.json` in the same pass." `docs/plans/2026-05-13-003-...` is not in the catalog, but neither are the two sibling 2026-05-13-001/002 plans created the same day, so the gap matches established repo precedent for tactical plans. If tactical plans should be agent-discoverable via the catalog, register all three sibling 2026-05-13 plans in the same sweep.
  - **Suggested fix:** Decide as a sweep, not a one-off: either accept tactical plans as not-canonical (current de-facto policy) and document in the catalog README, or register all three.

- **[advisory -> human] `docs/plans/2026-05-13-003-feat-cue-zero-external-focus-second-pass-plan.md` — Plan frontmatter is minimal (`id`, `stage`, `summary` absent)** (ce-project-standards-reviewer, advisory)
  - **Why it matters:** `.cursor/rules/machine-scannable-docs.mdc` says durable docs should keep `id`, `title`, `status`, `stage`, `type`, and `summary`. The new plan only carries `title`, `type`, `status`, `date`, `origin`. Same minimal pattern is used by every plan in `docs/plans/` since at least 2026-05-09, including the two sibling 2026-05-13-001/002 plans created the same day. `scripts/validate-agent-docs.sh` does not enforce frontmatter on `docs/plans/*` (only on a small named set under `canonical_frontmatter_docs`).
  - **Suggested fix:** Frontmatter standardization sweep across `docs/plans/` rather than a one-off on the new plan.

## Routing notes

- All 7 findings were intentionally NOT auto-applied in the autofix commit `1a3af3c`. Reasons:
  - 5 of 7 are `gated_auto` or `manual` with judgment / scope-change / sweep-shape considerations beyond the per-finding fix.
  - The 2 non-gated `manual` findings (catalog routing + frontmatter sweep) are policy decisions about doc conventions, not localized code fixes.
- Cross-reviewer corroboration: 2 findings hit by 2+ reviewers (verb + possessive gap, coverage soft-floor) — these have the strongest signal.
- The verb + possessive gap (P2) is the highest-priority follow-up because it exposes a real-world cue (`d05-solo`) shipping the same bug shape that the founder originally flagged on `d10-pair`. Recommend addressing before the next D130 session.

## How to act on this file

- Open as a new ce-plan: `/ce-plan` with `docs/residual-review-findings/main-1a3af3cec84c.md` as the input. Plan a focused second-pass-pass that addresses the verb + possessive gap and decides on the coverage assertion shape.
- Or convert specific findings into Linear tickets / GitHub issues if the project tracker comes online.
- Do NOT delete this file when findings are addressed; mark them resolved in-place and let the file stand as the historical record of the cue[0] second-pass review.
