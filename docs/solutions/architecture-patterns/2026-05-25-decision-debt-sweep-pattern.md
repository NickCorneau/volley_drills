---
id: decision-debt-sweep-pattern-2026-05-25
status: active
stage: validation
type: solution
title: "Decision-debt sweep after mechanism retirement"
date: 2026-05-25
category: architecture-patterns
module: docs/decisions
problem_type: documentation_pattern
component: decision_log
severity: medium
applies_when:
  - "A code slice retires a mechanism authorized by a decision row"
  - "A decision still proposes work against a mechanism that no longer exists"
  - "A follow-up cleanup would force future readers to mentally annotate stale decisions"
tags:
  - decision-debt
  - docs-decisions
  - d137
  - d140
---

# Decision-debt sweep after mechanism retirement

## Context

D140 authorized a generator-policy proposal around capping optional-slot redistribution. The 2026-05-24 duration-honesty slice removed runtime redistribution instead. Once the mechanism disappeared, D140 became decision debt: accurate history, but stale as active guidance.

The D137 tune-today retirement is the local precedent. Preserve the historical decision, append supersession context, and keep the future reader from having to ask whether the old row still applies.

## Guidance

1. **Find decisions that authorize the retired mechanism.** Search by mechanism names, not just decision IDs.

2. **Preserve the original decision body.** Do not rewrite history. Add supersession context instead.

3. **Write a short eulogy.** Include birth date, retirement date, cause of death, what survives, and what is buried.

4. **Audit adjacent decisions lightly.** If a nearby decision may mention the mechanism, add a one-line drift-check note or leave it untouched if unrelated.

5. **Ship the decision sweep with the code retirement.** The same commit should retire the mechanism and mark the decision stale, so agents do not read contradictory sources.

## Why This Matters

- Keeps `docs/decisions.md` usable as the first stop for what is still decided.
- Avoids future branches re-authorizing dead mechanisms.
- Turns cleanup into institutional memory instead of archaeology.
- Compounds D137 into a reusable retirement pattern.

## When To Apply

Re-apply this pattern when a slice retires a mechanism that has decision-level authorization in `docs/decisions.md`. The slice is the right moment to retire the decision, not a later cleanup pass.

## Example

The CC1 bundle superseded D140 after the duration-honesty slice removed `runtimeRedistribution`. D138 got only a light drift-check because it governs `focusCoverageAudit` vs `focusReadiness`, not redistribution.
