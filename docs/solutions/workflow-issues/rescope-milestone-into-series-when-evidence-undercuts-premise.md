---
title: When fresh evidence undercuts a milestone's premise, revalidate then re-scope into a series with a hybrid spine
date: 2026-06-03
category: docs/solutions/workflow-issues
module: milestone-planning (M002) + ce-brainstorm + ce-doc-review
problem_type: workflow_issue
component: documentation
severity: medium
applies_when:
  - A research pass or field evidence undercuts the premise a milestone was named/scoped around
  - A single milestone's stated end-state is really a multi-milestone arc
  - The founder offers a compelling framework mid-brainstorm that you want to honor without over-building it now
  - You are tempted to either ship the contradicted framing unchanged or to rebuild/over-research in response
tags: [milestone-planning, ce-brainstorm, ce-doc-review, evidence, rescope, hybrid-spine, research-substitution, canon-hygiene]
---

# Re-scope a milestone into a series when evidence undercuts its premise

## Context

M002 was a single milestone named "Weekly Confidence Loop," with planning defaults that treated **weekly confidence as the skill-progress signal**. A four-topic research day then produced four independent syntheses that each undercut that exact premise (confidence measures felt readiness, not skill; the honest progress signal is behavioral). Separately, the founder's stated end-state ("train all core skills incl. attack/tactics; bring others in; *see the plan building up and making me better*; set goals; more content depth; progressive adaptation chains") was plainly a multi-milestone arc, not one surface. And mid-brainstorm the founder surfaced a compelling framework ("Stress" — layer contextual interference, end most dynamic) and asked whether it should drive the adaptation model.

Three failure modes were live: (1) **patch-and-ship** — quietly tweak the milestone doc and keep the contradicted name/defaults (the "inherited name keeps encoding a contradicted premise" trap); (2) **over-react** — rebuild everything or launch another research round; (3) **ignore the founder's framework** or, conversely, **over-build it** immediately.

## Guidance

When new evidence undercuts what a milestone was named or scoped around, run this sequence instead of editing the milestone in place:

1. **Revalidate before re-writing.** Red-team the *existing* direction against the new evidence (here: 5 `ce-doc-review` personas against the ideation + milestone with the syntheses injected). Record an explicit **validates vs challenges** verdict in a dated review doc. Don't let the milestone silently absorb the new framing.
2. **Separate identification from shape.** Milestone *identification* (which milestones exist) is usually solid — it's grounded in the end-state + evidence + field signal. What the evidence changes is *shape/framing*. **Re-scope, don't re-identify.**
3. **Re-scope a too-big milestone into a series.** When one milestone's end-state is actually an arc, split it into a **series** (a progression *spine* + attaching *tracks*) scoped at the *milestone level*, and plan each sub-milestone **one-by-one** after the roadmap order is locked — rather than cramming the arc into one milestone or fully planning all of it up front.
4. **Hybrid spine: "vocabulary now, build later."** When the founder offers a framework worth honoring (here: "Stress" = progressive contextual interference, already in canon as `D68`), adopt its *vocabulary* in v1 (forward-compatible — the v1 adaptation verdict says "a bit more / less stress next time") but build its *content* as a dedicated later milestone. This neither ignores it nor over-builds it.
5. **Keep canon honest in one pass.** Lock the re-scope in a decision row (`D149`); keep the milestone **ID and filename stable** to avoid cross-reference churn (rename in the title/body only); **annotate** superseded legacy sections rather than deleting them; and reconcile the live surfaces (`docs/roadmap.md`, `AGENTS.md`, `docs/status/current-state.md`, `docs/catalog.json`) in the same pass so no high-traffic surface keeps asserting the old premise.
6. **Resist research-substitution.** After a big research day, the disciplined next move is **build + instrument**, queueing at most one *just-in-time* brief for the specific mid-series shape that needs it (here: a "stress-rung taxonomy" brief, needed before M002.2, not before v1). The repo's own risk register names research-velocity substitution as a failure mode; all four syntheses agreed the decisive evidence is the product's own cohort, not more literature.

## Why This Matters

A milestone's name and planning defaults are read by implementers as instructions. If evidence undercuts the premise and you only patch around the edges, the stale premise keeps shipping (the inherited-name trap — second occurrence in this repo after the "weekly" cadence case). Re-scoping into a planned-one-by-one series keeps each sub-milestone right-sized (avoids the "M001 + a cadence" thinness *and* the over-built planner), keeps the founder's vision central (the series is literally their end-state), and stays evidence-aligned. The hybrid-spine device is the key unlock: it lets you say "yes, and" to a founder framework without betting v1 on un-built content. And bounding the follow-on research to one just-in-time brief prevents the research loop from becoming a substitute for shipping.

## When to Apply

- New research or field evidence contradicts the premise a milestone was named/scoped around.
- A single milestone's stated end-state spans several shippable slices (a spine + tracks).
- The founder hands you a framework you want to adopt without committing the current milestone to building it.

Do NOT apply when: the evidence merely *refines* a milestone (patch in place); the milestone is genuinely single-slice (no series needed); or the founder's framework is cheap enough to just build now (no hybrid deferral needed).

## Examples

- **The arc:** four 2026-06-02 syntheses + a `ce-doc-review` revalidation (`docs/reviews/2026-06-02-m002-ideation-revalidation.md`) → re-scope M002 from "Weekly Confidence Loop" into the **"Weekly Training Home" series** (spine M002.1→M002.2→M002.3 + goals/roster/attack tracks + Phase 1.5 handoff), ratified in `D149`.
- **Hybrid spine:** "Stress" adopted as v1 *vocabulary* (the adaptation verdict), with the full stress-ladder *content* deferred to M002.2.
- **Canon hygiene:** `M002` ID + `m002-weekly-confidence-loop.md` filename kept stable; legacy scope sections annotated "superseded by `D149`"; roadmap/AGENTS/current-state/catalog reconciled in the same pass.
- **Research discipline:** one just-in-time "stress-rung taxonomy" brief queued for M002.2; no further research before planning v1.

## Related

- `docs/solutions/workflow-issues/2026-05-27-strategic-shape-fork-as-resolve-before-planning.md` — sibling planning-workflow learning (surface contested forks rather than orchestrator-picking); this doc is the next step *after* a fork is resolved and new evidence lands.
- `docs/solutions/design-patterns/low-dose-self-coached-progress-signal-design.md` — the *content* rule (behavioral-primary, confidence-as-readiness) that this *process* re-scoped M002 around; names the inherited-name trap.
- `docs/research/2026-06-02-m002-evidence-meta-synthesis.md`, `docs/reviews/2026-06-02-m002-ideation-revalidation.md`, `docs/brainstorms/2026-06-03-m002-thin-spine-and-milestone-series-requirements.md`, `docs/decisions.md` `D149` — the artifacts produced by this pattern.
