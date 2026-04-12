---
task_id: T000
title: Replace with the bounded task title
milestone: M000
kind: docs
worker_surface: cursor
status: pending
decision_refs: []
open_question_refs: []
context_budget:
  required_reads:
    - AGENTS.md
    - docs/catalog.json
  optional_reads: []
  estimated_input_lines: 0
output_artifacts: []
---

# Handoff: T000

## Outcome

Describe the exact outcome the worker should reach in one sentence.

## Context

### Required reads

- `AGENTS.md`
- `docs/catalog.json`

### Decision constraints

None.

### Open questions that may block

None.

## Scope

### In scope

- (list files and areas the worker should touch)

### Out of scope

- (list explicit boundaries)

## Verification

### Commands

```bash
bash scripts/validate-agent-control-plane.sh
```

### Acceptance criteria

- The scoped files are updated.
- The verification commands pass.
- No blocker or budget condition was hit.

## Escalation triggers

- Product direction changes
- Scope expands beyond the queued task
- Verification cannot be made trustworthy
- A blocking open question (O*) is discovered

## Run notes

- **Worker surface**: cursor
- **Work area**:
- **Next explicit step**:
- **Terminal state**: (done | blocked | failed | budget_exhausted)
