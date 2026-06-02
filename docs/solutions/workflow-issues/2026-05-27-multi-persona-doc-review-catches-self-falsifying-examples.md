---
title: Multi-persona ce-doc-review catches self-falsifying acceptance examples that single-persona review misses
date: 2026-05-27
category: docs/solutions/workflow-issues
module: ce-doc-review
problem_type: workflow_issue
component: development_workflow
severity: medium
applies_when:
  - A requirements doc contains anti-pattern rules + acceptance examples that demonstrate them
  - A requirements doc has a "copy contract" R-ID + AEs whose example sentences must conform to the contract
  - Reviewing a doc that defines its own constraints and then provides illustrative examples
tags: [ce-doc-review, acceptance-examples, self-falsification, multi-persona, requirements-discipline]
---

# Multi-persona ce-doc-review catches self-falsifying acceptance examples that single-persona review misses

## Context

During round 2 of `ce-doc-review` on `docs/brainstorms/2026-05-27-m002-receipt-training-only-requirements.md` (v2), three personas (adversarial, coherence, design-lens) independently flagged that AE1's example sentence — "Set is the longest gap — worth a set-focused session if you train this week." — violates R13b, the receipt-specific copy anti-pattern list it is supposed to demonstrate compliance with. AE2 had a parallel violation against R13b item 5 (goal-vs-actual framing).

Round 1 of `ce-doc-review` (which used the same personas individually but did not converge on this specific intersection) did NOT catch the self-falsification, even though all three personas reviewed the same v1 doc with similar example/rule pairings.

The pattern is structural: each persona reading the doc sees R13b (a constraint) and AE1 (an example) but treats them as independent items in their lens. Adversarial reads R13b for premises to challenge and AE1 for failure-mode probing; coherence reads R13b for internal consistency and AE1 for back-reference correctness; design-lens reads R13b for design completeness and AE1 for interaction-state coverage. Only when at least 2–3 personas converge on the **specific** R-AE pairing — checking the example against its own rule — does the self-falsification become loud enough to surface.

R13b said "No comparative adverbs (better/worse/more/less)" but AE1 used "longest" (a superlative, not technically a comparative adverb — design-lens caught the rule-incompleteness; coherence caught the spirit-violation; adversarial caught that the doc lints its own examples and fails). Each persona's framing was partial; the convergence made the finding actionable.

## Guidance

When a requirements doc contains **a contract + an illustrative example of the contract**, intentionally route multi-persona review to verify the example conforms to its own contract. Specifically:

1. **Identify contract/example pairs at doc-write time.** Anti-pattern lists + AEs, copy registers + AE strings, schema invariants + AE field values, threshold rules + AE numeric values are all examples. Tag them so reviewers know to check the pairing.
2. **Dispatch at least 3 personas with at least 2 of {coherence, design-lens, adversarial}.** These three converge on the example/rule intersection most reliably:
    - Coherence checks AE Covers-references vs R-ID semantics
    - Design-lens checks AE copy/UI against design rules
    - Adversarial checks AE for failure-mode probing
3. **Add an explicit "doc lints its own examples" check to the round-2 verification prompt.** Once a contract + example pair is identified in v1, round-2 dispatch should call it out directly: "Verify AE1 conforms to R13b. Verify AE2 conforms to R13b." Don't rely on personas to find the intersection independently.
4. **When a self-falsification is found, fix BOTH the example AND the contract.** The example may have been written first and the contract retrofitted, leaving rules incomplete. Or the contract may be correct and the example sloppy. Round-2 findings should classify which.

## Why This Matters

Self-falsifying examples are high-cost downstream. They:

- Mislead implementers about what conformance to the contract looks like (the AE is the implementer's primary reference for "what good looks like")
- Indicate the contract itself is incomplete (if the author who wrote both R13b and AE1 missed the violation, the rule list is missing a category)
- Erode trust in the doc — once a reader notices the contradiction, every other example becomes suspect
- Compound at implementation: planners build from AEs, implementers test against AEs, and the AE becomes load-bearing for verification while silently contradicting the rule it's supposed to satisfy

Single-persona review misses this pattern because each persona's lens is partial. The pairing only becomes visible at the persona-intersection. Multi-persona review is structurally designed to catch convergent issues — applying it to self-falsifying examples is a high-leverage use of the parallelism.

## When to Apply

- Reviewing a requirements doc with `Acceptance Examples` that demonstrate `Requirements` constraints
- Reviewing a brainstorm doc with a copy contract / anti-pattern list and example sentences
- Reviewing a plan doc with code snippet examples and explicit code-style rules
- Any doc with a "rules" section + an "examples" section that purport to demonstrate the rules
- Round-2 verification passes on v2 docs that added a contract in round 1 (round-1 may have missed retroactive AE non-conformance)

Skip when:

- The doc has no formal contracts (pure prose narrative)
- The doc has contracts but no illustrative examples
- The examples are explicitly non-prescriptive ("for illustration only, not contract")

## Examples

**Anti-pattern (self-falsifying AE, single-persona review):**

> R13b: "No comparative adverbs (better/worse/more/less)"
> AE1: "Set is the **longest** gap — worth a set-focused session if you train this week."
>
> Round-1 single-persona reviewers: Each persona reads R13b OR AE1 in their lens, doesn't cross-check.
> Result: Self-falsification ships in v1 → caught only in round 2 multi-persona convergence.

**Pattern (multi-persona round-2 dispatch explicitly checks contract-example pairs):**

> Round-2 dispatch prompt to coherence: "Verify AE1 conforms to R13b. Verify AE2 conforms to R13b. Specifically check 'longest' against R13b's anti-pattern list."
> Round-2 dispatch prompt to design-lens: "AE1's example sentence is the highest-priority check — if 'longest' is a comparative, that's a P0/100 finding."
> Result: Both personas surface the finding at confidence 100; orchestrator applies `safe_auto` rewrite to AE1 + adds "no superlatives" to R13b in a single round.

## Related

- `docs/reviews/2026-05-27-m002-receipt-doc-review-synthesis.md` (the review where this pattern was observed)
- `docs/brainstorms/2026-05-27-m002-receipt-training-only-requirements.md` (the v2.1 doc where the fix landed)
