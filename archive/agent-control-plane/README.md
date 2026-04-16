---
id: archived-agent-control-plane
title: Archived Agent Control Plane
status: complete
stage: archive
type: archive
summary: "Historical note for the retired queued-task control plane and unattended worker scaffolding."
authority: archive note for removed control-plane surfaces
last_updated: 2026-04-15
depends_on:
  - docs/ops/agent-operations.md
---

# Archived Agent Control Plane

This repo previously carried a richer queued-task control plane for bounded unattended work. It included:

- `ops/agent/queue/`
- `ops/agent/schemas/`
- `ops/agent/handoffs/`
- `ops/agent/runs/`
- `scripts/agent-supervisor.sh`
- `scripts/agent-dispatch.sh`
- `scripts/agent-verify.sh`
- `scripts/agent-notify.sh`
- `scripts/validate-agent-control-plane.sh`

That system was retired from the active tree because it added maintenance overhead and duplicated the repo's real workflow, which remains interactive, Cursor-first, and WSL/bash-friendly.

If the project later needs a queue-based worker model again, recover the prior implementation from git history and reintroduce only the parts that solve a real current problem.
