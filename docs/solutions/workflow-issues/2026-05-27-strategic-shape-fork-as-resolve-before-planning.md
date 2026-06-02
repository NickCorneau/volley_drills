---
title: Surface strategic-shape forks as Resolve Before Planning, not orchestrator-picked
date: 2026-05-27
category: docs/solutions/workflow-issues
module: ce-brainstorm + ce-doc-review
problem_type: workflow_issue
component: documentation
severity: medium
applies_when:
  - A ce-brainstorm session produces a requirements doc whose shape is contested across personas during ce-doc-review
  - Founder says "wdyt?" or "go for it" mid-brainstorm and the orchestrator faces an under-determined product-shape call
  - The brainstorm scope expanded then contracted under user pressure and the orchestrator landed on a middle-ground that no persona fully endorses
tags: [ce-brainstorm, ce-doc-review, agent-asymmetry, scope, requirements-discipline]
---

# Surface strategic-shape forks as Resolve Before Planning, not orchestrator-picked

## Context

During a ce-brainstorm pass on M002 (Weekly Confidence Loop) receipt scope, the orchestrator (1) anchored on the CC-1 ideation seed framing, (2) negotiated scope down under founder pushback against new capture friction, (3) landed on a "training-only receipt + optional `BlockFocus` + 3–5 rule suggestion + Settings → Receipts list" middle-ground, and (4) wrote a v1 requirements doc reflecting that shape.

Round-1 ce-doc-review then revealed the shape was contested **from both directions**: scope-guardian argued for max-cut (drop `BlockFocus`, drop the suggestion layer, drop Settings list, ship one Home cell with raw data only); product-lens argued for re-pivot up (the parked plan-and-adaptation seed is the founder's real vision; training-only ships safe-not-valuable). Neither direction was a strawman — both had real evidence and real reviewer confidence.

The orchestrator's failure mode was already underway: agent-asymmetry. The orchestrator had picked the middle-ground in conversation under founder decision fatigue ("wdyt?", "go for it"), and the requirements doc captured that pick as if it were settled. The doc had to either be re-picked in chat (which would compound the asymmetry), defended without real defense, or rewritten under whichever alternative round 2 made loudest.

## Guidance

When a ce-brainstorm produces a requirements doc whose shape is meaningfully contested across legitimate alternatives, **surface the fork as an explicit `Resolve Before Planning` outstanding question in the doc** rather than orchestrator-picking. Specifically:

1. **Name each alternative concretely** — title + 1–3 paragraphs each. Include the alternative's strongest argument, not a strawman. If the alternatives came from review personas, cite which persona surfaced each.
2. **Be honest about the orchestrator's lean if any** — note "current shape" as the alternative the doc is currently written against, mark it as one option among several, and either include a "recommended path" sentence OR explicitly state the orchestrator declines to recommend.
3. **Cross-reference the supporting review synthesis** — the doc reader needs to read the review reasoning to make the choice, not just the alternative summaries.
4. **Re-balance detail across alternatives** — if v1 of the doc is written in detail for one alternative and the others get one paragraph each, the asymmetry pre-loads the founder via sunk-cost momentum. Either expand the alternatives to comparable detail, OR use a comparison table with axes (scope, capture cost, schema cost, evidence coverage, alignment to stated vision) so trade-offs are scannable instead of buried in prose.
5. **Treat the founder's pick as a prerequisite for `ce-plan`**, not a planning-time question. If alt #1 is picked, planning proceeds against the current doc. If alt #2 or #3 is picked, the doc gets rewritten or replaced before planning.

The pattern composes with `ce-doc-review` cleanly: if round 1 surfaces a contested-shape pattern, round 2's job is to verify the fork-framing itself is fair, not to re-litigate the choice.

## Why This Matters

Orchestrator-picking under decision fatigue is the agent-asymmetry trigger named in `docs/research/founder-use-ledger.md` and several adversarial memos: "repo / agent conversation is being used as a substitute for the app itself." When the orchestrator picks a load-bearing product-shape decision in conversation, the picked shape becomes structurally committed (data model, surface inventory, copy register) and the founder loses real choice — every later "re-pick" requires un-doing v2's structural investment. The sunk-cost momentum is real and asymmetric.

Surfacing the fork as a `Resolve Before Planning` item:

- Preserves real founder optionality (the doc names the trade-offs, the founder picks)
- Cuts re-work cost (no v2 structural commitment to un-do if alt #2 or #3 wins)
- Honors the multi-persona reviewer signal (contested shapes are caught by review for a reason)
- Avoids the failure mode where the orchestrator picks the middle-ground that no persona endorses but neither pushes hard against, then defends it weakly when the next round catches it

## When to Apply

- A ce-brainstorm session produces a requirements doc and a ce-doc-review reveals the shape is contested by ≥2 personas from different directions (not just "more or less detail" but genuinely different products)
- The founder shows decision fatigue mid-brainstorm and explicitly delegates ("wdyt?", "go for it", "you choose")
- The orchestrator's pick is a middle-ground that doesn't fully match any persona's recommendation
- The brainstorm scope expanded then contracted under user pressure and the landed shape is partly inherited from each pressure direction

Do NOT apply when:

- The shape is genuinely settled by the brainstorm dialogue (founder made the call explicitly with full context)
- Reviews converge on a single direction (no fork exists)
- The contested shape is implementation-detail-level, not product-shape-level (defer to ce-plan)

## Examples

**Anti-pattern (orchestrator picks in conversation):**

> Founder: "wdyt? any skills to help think this through?"
> Orchestrator: "Going with Path A — small rule set in v1 + AI in parked plan-system." [Writes requirements doc reflecting Path A as settled.]
> Round 1 ce-doc-review: scope-guardian argues max-cut; product-lens argues plan-system slice; both at HIGH confidence with concrete arguments.
> Result: orchestrator wrote v2 to address the convergent concerns but kept Path A structurally, leaving real founder-level questions unresolved.

**Pattern (surface the fork):**

> Orchestrator (after dialogue): "Three honest paths emerged. Before writing the doc, I want to surface the fork — your call: Option A (current shape) / Option B (max-cut) / Option C (plan-system slice). My read is A is defensible but B and C are both real. Want me to write the doc against A with B and C as parked alternatives, or pick differently first?"
> Founder: [Picks, or asks orchestrator to surface in the doc itself.]
> Orchestrator: writes the doc with `Resolve Before Planning §1` enumerating the three alternatives with reviewer arguments distilled and a balanced comparison.

## Related

- `docs/brainstorms/2026-05-27-m002-receipt-training-only-requirements.md` (the doc where this pattern was applied retroactively in v2)
- `docs/reviews/2026-05-27-m002-receipt-doc-review-synthesis.md` (the review synthesis that drove the pattern)
- `docs/ideation/2026-05-27-m002-directions-ideation.md` (the upstream ideation pass)
- `docs/ideation/2026-05-27-plan-and-adaptation-system-seed.md` (the parked alternative that lives outside this milestone)
