---
id: catalog-gap-closure-ideation-2026-05-02
title: "Ideation: Catalog Gap Closure"
status: active
stage: validation
type: ideation
summary: "Ranked ideation for selecting minimal catalog/config gap-closure moves, extended with an exercise-copy quality continuation."
date: 2026-05-02
topic: catalog-gap-closure
focus: current generated-plan catalog/config gap closure
mode: repo-grounded
---

# Ideation: Catalog Gap Closure

## Grounding Context

Current generated diagnostics show no hard failures, so the next move should not be a reflexive drill edit. The repo already has source-backed activation rules, workload-envelope guidance, D47/D01 diagnostic receipts, and generated triage output. The open problem is selecting the next minimal, high-quality gap closure artifact from observation-only evidence.

External analogies reinforce the same shape: curriculum gap analysis distinguishes missing/partial coverage before remediation [Watermark: Conducting a curriculum gap analysis](https://www.watermarkinsights.com/resources/blog/conducting-a-curriculum-gap-analysis/), content catalogs rely on approval/versioning to prevent unverified assets from entering production [Autodesk Content Catalog](https://www.autodesk.com/products/autodesk-docs/features/content-catalog), and evidence quality frameworks caution against acting on weak evidence without explicit confidence boundaries [Healthcare team-effectiveness systematic review](https://pmc.ncbi.nlm.nih.gov/articles/PMC6950792/).

Sources:

- [Watermark: Conducting a curriculum gap analysis](https://www.watermarkinsights.com/resources/blog/conducting-a-curriculum-gap-analysis/)
- [Autodesk Content Catalog](https://www.autodesk.com/products/autodesk-docs/features/content-catalog)
- [Healthcare team-effectiveness systematic review](https://pmc.ncbi.nlm.nih.gov/articles/PMC6950792/)

## Ranked Ideas

### 1. Gap Closure Selection Workbench

**Description:** Add a generated workbench section that synthesizes current D01/D47 state, top alternatives, evidence readiness, and a recommended next artifact.

**Rationale:** Highest leverage because it turns the whole diagnostic-to-fill loop into one repeatable selection surface. It aligns with the user's goal: close current config gaps minimally and with high quality.

**Downsides:** It is still diagnostic/planning machinery before a visible catalog edit. The implementation must stay small and avoid becoming a broad scoring system.

**Confidence:** 92%

**Complexity:** Medium

**Status:** Explored

### 2. D47 Reentry Selection Packet

**Description:** Make the post-D01 next step explicit by deciding whether D47, D05, D25, D33, or D46 is the next high-quality artifact.

**Rationale:** Smallest direct continuation of the current workflow. D01 is held, and D47 is the largest concrete mixed-pressure reentry candidate after that hold.

**Downsides:** Narrower than a reusable workbench if implemented as D47-only.

**Confidence:** 90%

**Complexity:** Low-Medium

**Status:** Unexplored

### 3. Observation-to-Artifact Router

**Description:** Output a concrete next artifact type for routeable groups instead of a broad likely-fix list.

**Rationale:** Agents and maintainers need "what artifact next" more than a grab bag of possible fixes.

**Downsides:** Applying this globally now could over-formalize unresolved groups.

**Confidence:** 84%

**Complexity:** Medium

**Status:** Unexplored

### 4. D25 Cooldown Policy Receipt

**Description:** Convert the largest affected group into an explicit policy allowance or metadata-review decision.

**Rationale:** High count, low risk, and likely prevents future false catalog urgency around cooldown content.

**Downsides:** Less connected to the user's catalog goal because the likely answer is policy, not content.

**Confidence:** 80%

**Complexity:** Low

**Status:** Unexplored

### 5. Evidence Payload Types

**Description:** Define complete payload shapes for catalog, cap, block-shape, generator-policy, and no-change paths.

**Rationale:** Creates durable rigor across future gap closure work.

**Downsides:** Abstract if not anchored to one immediate candidate.

**Confidence:** 78%

**Complexity:** Medium

**Status:** Unexplored

### 6. No-Edit Default Gate

**Description:** Default every candidate to `not_authorized` until a complete evidence payload exists.

**Rationale:** Strong guardrail against premature `app/src/data/drills.ts` or generator changes.

**Downsides:** Mostly defensive; less satisfying as product progress by itself.

**Confidence:** 76%

**Complexity:** Low

**Status:** Unexplored

## Rejection Summary

- D33 Technique Under-Min Sweep: plausible, but less clearly urgent than D47/D25 and risks localizing too early.
- D47 No-Change Burden Checklist: useful subcomponent, weaker standalone artifact.
- Accepted Debt Ledger: strong pattern, but should be part of the selected workbench rather than first artifact.
- Delete the "Catalog" Word Until Source Evidence Exists: good copy hygiene, too small alone.
- Product-Quality Score Over Affected-Count Rank: good rubric, should support selection rather than become a separate scoring system.
- One-Gap Closure Contract: useful rule, included implicitly in the selected workbench.
- Comparator-First Reentry: good sub-shape of D47 reentry, not broad enough alone.
- Reassessment Receipt Template: important later, after a fill exists.
- Curriculum Standards Map: too large for current scope.
- Medical Evidence Grade: helpful analogy, too much process if literalized.
- Full Catalog Fill Sprint: too broad and source-risky.
- Manual Founder Dogfood First: useful later but blocks repo-native progress.

## Recommended Handoff

Proceed to a focused brainstorm for **Gap Closure Selection Workbench**, with D47 reentry as the first concrete target-selection case.

## Continuation: Exercise Explainer And Instruction Quality

The catalog-gap thread also exposed a lower-level quality surface: the existing drill catalog can pass structural diagnostics while still being hard to read courtside. The next visible catalog-improvement move should derive a reusable writing contract from the current exercises, then apply it to active exercise explainers and instructions without using copy polish to smuggle in new drill content or unsupported training claims.

### 1. Drill Copy Contract

**Description:** Review every active exercise text surface through a stable mental order: why this drill matters, setup, what to do now, how success or stopping works, the one cue to carry, and how to scale the drill.

**Rationale:** This absorbs the strongest survivor ideas from the copy-quality pass. It makes all exercise text easier to scan on a sunny phone, gives future drill authors a durable standard, and stays compatible with existing fields such as objectives, courtside instructions, success metrics, cues, and progression/regression descriptions.

**Downsides:** The first pass is still manual and judgment-heavy. Over-automating the principles too early could turn good writing into brittle string tests.

**Confidence:** 94%

**Complexity:** Medium

**Status:** Explored

### 2. Envelope Honesty Checklist

**Description:** Review instructions against each variant's participants, equipment, feed type, workload, fatigue cap, and timed segments so the text never promises a setup, cadence, or training claim the metadata does not support.

**Rationale:** This keeps the copy-quality pass aligned with the existing catalog-gap posture: diagnostics and text review are evidence, not automatic authorization for broader catalog changes.

**Downsides:** Some issues may turn out to be metadata or source-depth problems rather than copy edits, which means the implementation must be willing to leave larger fixes deferred.

**Confidence:** 90%

**Complexity:** Medium

**Status:** Explored

### 3. Success Rule Grammar

**Description:** Make success metric descriptions and instruction text state the action, count or time window, threshold, and reset/failure condition in consistent courtside language.

**Rationale:** Self-coached players need to know what counts before they can self-correct. This is the bridge between exercise instructions and review/capture trust.

**Downsides:** Some metric types are inherently different, so the grammar should be a checklist rather than a rigid template.

**Confidence:** 88%

**Complexity:** Low-Medium

**Status:** Explored

### 4. Cue Outcome Reframe

**Description:** Prefer cues that point to observable outcomes such as ball flight, target, arc, landing zone, partner reach, or reset timing; keep each cue to one physical idea.

**Rationale:** External-focus cues are easier to use under fatigue than stacked body-mechanics instructions, and the run face already favors one primary cue at a time.

**Downsides:** Some safety or beginner technique cues still need body-language glosses; the rule should not delete necessary instruction.

**Confidence:** 84%

**Complexity:** Low-Medium

**Status:** Unexplored

### 5. Principles-To-Tests Bridge

**Description:** Translate only the durable, automatable writing principles into catalog tests, and leave subjective principles as a human review checklist.

**Rationale:** The strongest future leverage is preventing drift without making prose quality depend on taste or brittle snapshots.

**Downsides:** Tests can enforce skill-verb openings, punctuation, length ceilings, or obvious jargon, but they cannot prove that an instruction is genuinely good.

**Confidence:** 82%

**Complexity:** Medium

**Status:** Unexplored

### Continuation Rejection Summary

- Full drill-card preview UI: useful later, but too much surface before the writing contract lands.
- Pure read-aloud sweep: helpful as a review tactic, but too ephemeral as the primary artifact.
- Source-traceability expansion: already covered by source-backed catalog activation work; include only where copy makes unsupported claims.
- Heavy automated quality gate: promising after principles stabilize, but premature as the first move.
