---
id: test-skip-discipline-2026-05-25
status: active
stage: validation
type: solution
title: "Test skip discipline: classify, smoke, migrate, or delete"
date: 2026-05-25
category: workflow-issues
module: test-workflow
problem_type: workflow_pattern
component: tests
severity: medium
applies_when:
  - "A cluster of skipped tests shares one explanatory marker"
  - "Skipped tests preserve a retired workflow rather than a temporarily failing behavior"
  - "A green test suite is hiding aspirational preservation"
tags:
  - skipped-tests
  - test-discipline
  - diagnostics
  - cc1
---

# Test skip discipline: classify, smoke, migrate, or delete

## Context

The duration-honesty slice left 44 skipped tests in `generatedPlanDiagnosticTriage.test.ts`. They were not flaky tests and not short-term failures. They represented a retired workflow whose triggering group keys no longer existed under v8.

A large `.skip` cluster is not neutral. It adds noise to every test run, tells future agents that code might still matter, and creates false confidence that the old behavior is recoverable.

## Guidance

1. **Treat a shared skip marker as a contract-shift signal.** More than a handful of skips with one explanation usually means the underlying behavior changed, not that tests need temporary shelter.

2. **Classify each skipped test.** Use three categories:
   - **Cat A:** plausible future shape. Keep as a smoke test against a replacement/stub contract.
   - **Cat B:** useful primitive. Move the primitive to its new home and migrate the test.
   - **Cat C:** inert workflow. Delete the test.

3. **Make zero skips the default end state.** A skip can be temporary, but a retirement pass should either unskip, migrate, or delete.

4. **Keep the marker short after the pass.** Once every test has a fate, the file-level comment should point to the plan, not carry a long historical explanation.

5. **Record uncategorizable tests explicitly.** If a test cannot be assigned A/B/C, surface it as follow-up work rather than leaving it skipped.

## Why This Matters

- Keeps green CI honest.
- Reduces context tax for future agents and reviewers.
- Separates preservation from wishful thinking.
- Makes test deletion a reviewed decision, not ambient cleanup.

## When To Apply

Re-apply this pattern when a `.skip` cluster larger than about five tests accumulates with a shared explanatory marker. The cluster is evidence that a contract changed and needs explicit triage.

## Example

The CC1 bundle graded the 44 skipped generated-plan triage tests after the v8 duration-honesty change. Tests tied only to unreachable packet workflows were deleted; any preserved behavior had to justify itself as a Cat A smoke test or Cat B primitive migration.
