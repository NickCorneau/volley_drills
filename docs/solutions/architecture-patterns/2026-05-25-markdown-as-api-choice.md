---
id: markdown-as-api-choice-2026-05-25
status: active
stage: validation
type: solution
title: "Markdown as API: when to keep builders vs emit directly"
date: 2026-05-25
category: architecture-patterns
module: diagnostics/generated-plan-triage
problem_type: architecture_pattern
component: generated_diagnostics
severity: medium
applies_when:
  - "A diagnostic or report surface is primarily markdown for one human reader"
  - "Typed builders are growing faster than the decisions they support"
  - "A generator contract changed and old packet builders are now inert"
tags:
  - markdown-as-api
  - diagnostics
  - generated-plan
  - d130
---

# Markdown as API: when to keep builders vs emit directly

## Context

The generated-plan triage layer once carried rich TypeScript packet builders for the D47/D05/D01/D49 workflow. After the 2026-05-24 duration-honesty slice retired runtime redistribution, that workflow stopped being reachable from real v8 data. The code still had thousands of lines of markdown packet builders, while the actual founder-mode surface was the generated diagnostics report plus a compact triage workbench.

This is the architectural question: is markdown output a durable API that deserves typed builders, or is it an editorial artifact that should be emitted directly from a smaller diagnostic model?

## Guidance

1. **Keep TypeScript builders when the shape is reused by code.** If the same packet shape is consumed by tests, scripts, UI, or another diagnostic, a typed builder is justified.

2. **Emit markdown directly when the reader is the only consumer.** If the output exists for one scan-first human report and no other code path consumes the packet, keep the model narrow and render from it directly.

3. **Retire builders when their source signal disappears.** A builder whose triggering fingerprint cannot be produced by current data should not stay live just because it once encoded useful thought.

4. **Preserve archaeology with forward pointers.** Prefer `replacedBy` stubs over silent deletion when future agents may grep for the old concept.

5. **Regenerate reports after changing the renderer.** The markdown files are generated artifacts. The check/update pair is the contract.

## Why This Matters

- Keeps domain modules readable under D130 founder-use mode.
- Prevents packet-builder code from becoming a second source of truth.
- Makes report diffs reviewable by showing current decisions, not historical scaffolding.
- Gives future agents a quick rule for whether to build a typed packet or direct markdown emitter.

## When To Apply

Re-apply this pattern when a new diagnostic surface is being designed and the choice between TypeScript builders for markdown output vs direct markdown emission is open.

## Example

The CC1 retire-and-compound bundle replaced the unreachable D47/D05/D01/D49 packet builders in `app/src/domain/generatedPlanDiagnosticTriage.ts` with `replacedBy` stubs, while retaining the small `buildGeneratedPlanTriageWorkbenchMarkdown()` surface that the diagnostics report script still calls.
