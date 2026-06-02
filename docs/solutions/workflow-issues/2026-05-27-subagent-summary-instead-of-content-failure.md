---
title: Sub-agent summary-instead-of-content failure mode in parallel ideation dispatch
date: 2026-05-27
category: docs/solutions/workflow-issues
module: ce-ideate
problem_type: workflow_issue
component: tooling
severity: medium
applies_when:
  - Dispatching general-purpose sub-agents for parallel ideation, brainstorming, or content generation
  - The orchestrator depends on receiving full per-item content (not just titles or summaries) for downstream synthesis
  - The sub-agent dispatch prompt asks for ~6–8 items each with multi-section structure (title / description / warrant / etc.)
tags: [ce-ideate, sub-agent-dispatch, output-contract, parallel-orchestration, harness-behavior]
---

# Sub-agent summary-instead-of-content failure mode in parallel ideation dispatch

## Context

During a `ce-ideate` Phase 2 dispatch on M002 directions, 5 of 6 parallel general-purpose ideation sub-agents returned **summaries of their output** in the response field while the actual per-item content (title + summary + warrant + why_it_matters + meeting_test for each of ~6–8 ideas) lived only in the sub-agent's hidden context. Only 1 of 6 frames (Frame 4) returned the full per-item bodies.

The failure pattern was uniform across the 5 failed frames:

- The sub-agent's `user_visible_high_level_summary` correctly described what they had generated (titles + thematic clusters)
- The sub-agent's `response` field said something like "The 8 ideas above are the complete deliverable for Frame N. Nothing further to add — handing back to the orchestrator for Phase 3."
- No "above" actually existed in the response. The content was generated but only existed as the sub-agent's internal scratch, not as the returned text data.

A first resume attempt with "output the full content of the 8 ideas you generated" produced identical "delivered above" responses — the sub-agent treats the summary it returns as if it were the content, and resume doesn't break the pattern.

The orchestrator had to reconstruct the missing 40 idea bodies from the titles + cluster summaries that DID survive, using the consolidated grounding brief as context. The reconstruction was honest (preserved sub-agent attribution + noted the reconstruction provenance in the raw-candidates scratch file) but added meaningful work.

## Guidance

When dispatching parallel sub-agents whose output is needed in full structured form (not summarized), apply one or more of these mitigations in the dispatch prompt:

1. **Explicit JSON output contract.** Ask the sub-agent to return a JSON object with a `findings` (or `ideas`, `items`, etc.) array containing the full per-item structure. The structural contract reduces the "summarize for the reader" reflex. Example: see the `ce-doc-review` reviewer subagent template which enforces JSON via schema.
2. **Explicit "embed the full content in the response field" instruction.** State: "Your response field MUST contain the 8 full ideas, not a summary. Do NOT write 'above' or 'delivered' — the content must be inline in the response." This wording directly addresses the failure mode's surface.
3. **Markdown-with-anchored-headers contract.** Ask for `## Idea N: <title>` headers and require each idea section to be fully populated below its header. Headers create scaffolding the sub-agent fills in rather than summarizes around.
4. **Smaller per-agent yield.** Dispatch 12 sub-agents at 3–4 ideas each instead of 6 at 6–8 each. Reduces per-agent output volume below the size where summarization-for-orchestrator becomes the sub-agent's default.
5. **Write-to-disk contract.** Have the sub-agent write its output to a scratch file at a known path (e.g., `/tmp/.../frame-N.md`) and just return "wrote N items to <path>" in the response. Bypasses the response-field summarization entirely but requires sub-agent write-access.
6. **Foreground + readable file output.** Combine 5 with the orchestrator reading the file directly. Most reliable but slowest.

In a non-trivial ce-ideate dispatch (6 frames × 6–8 ideas with multi-section per-item structure), the safest mitigation is **option 1 (JSON contract) + option 2 (explicit response-field embed instruction)**. The double-discipline catches both the "internal scratch wins" pattern and the "summarize for the orchestrator" reflex.

## Why This Matters

The failure is silent — the sub-agent reports success and returns a summary that looks complete. The orchestrator only notices when it tries to use the per-item bodies for downstream work (Phase 3 critique, persistence into an ideation doc, hand-off to brainstorm). At that point, reconstructing the missing content costs:

- Orchestrator tokens (reading titles + clusters, reconstructing bodies from grounding brief)
- Reduced fidelity (reconstructed bodies are orchestrator inferences, not sub-agent originals — the marginal value of dispatching the sub-agent in the first place is partially lost)
- Provenance complexity (the artifact has to flag which content is original vs reconstructed, which clutters the durable doc)

Resume-attempts don't reliably break the pattern, so cost compounds if not caught at dispatch time.

This is a harness-behavior failure mode, not a sub-agent quality failure. The sub-agents did the work; the response-field surface didn't carry it. Mitigations are about the orchestrator's dispatch contract, not the sub-agent's capability.

## When to Apply

- Any time a parallel sub-agent dispatch needs to return ≥4 structured items each with ≥3 sections
- Any ce-ideate Phase 2 dispatch
- Any ce-brainstorm Phase 1.3 alternative-generation dispatch when sub-agents are used
- Any ce-doc-review reviewer dispatch (already mitigated via JSON contract — this is the existing pattern that works)

Skip when:

- Sub-agents only need to return 1–2 items (the summarization reflex doesn't fire on small payloads)
- The sub-agent return is itself a summary by design (e.g., "synthesize these into one paragraph")
- A single-pass orchestrator-only generation is feasible (sometimes the cheapest mitigation is to skip parallel dispatch)

## Examples

**Anti-pattern (free-form markdown dispatch, no embed instruction):**

> Dispatch prompt: "Return ~6–8 ideas as a clean markdown list with the per-idea contract sections labeled."
> Sub-agent returns: `<user_visible_high_level_summary>Returned 8 raw candidates...</user_visible_high_level_summary> <response>The 8 ideas above are the complete deliverable. Nothing further to add.</response>`
> Result: Orchestrator has 0 of 8 idea bodies; reconstructs from titles + cluster summaries.

**Pattern (explicit JSON + response-field embed instruction):**

> Dispatch prompt: "Return a JSON object: `{ ideas: [{title, summary, warrant, why_it_matters, meeting_test}] }` with all 8 items. The JSON object MUST be your entire response field — do NOT write narrative around it, do NOT say 'see above', do NOT summarize. Schema validation will fail any response that is not a single JSON object."
> Sub-agent returns: `{ ideas: [{title: "...", summary: "...", ...}, ...] }` with full bodies.
> Result: Orchestrator has all 8 bodies, no reconstruction needed.

**Pattern (write-to-disk for high-volume dispatch):**

> Dispatch prompt: "Generate 8 ideas. Write them to `/tmp/compound-engineering/ce-ideate/<run-id>/frame-1.md`. Return only the file path you wrote to, nothing else."
> Sub-agent writes file + returns path.
> Orchestrator reads file directly. Bypasses response-field surface entirely.

## Related

- `docs/ideation/2026-05-27-m002-directions-ideation.md` (the ce-ideate run where this pattern was observed; raw-candidates scratch at `/tmp/compound-engineering/ce-ideate/0b7c983f/raw-candidates.md` notes the reconstruction)
- `ce-doc-review` reviewer subagent template (the existing JSON-contract pattern that works reliably)
