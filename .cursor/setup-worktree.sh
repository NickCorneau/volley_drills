#!/usr/bin/env bash
set -euo pipefail

required_files=(
  "AGENTS.md"
  "docs/README.md"
  "docs/vision.md"
  "docs/prd-foundation.md"
  "docs/roadmap.md"
  "docs/decisions.md"
)

for path in "${required_files[@]}"; do
  if [[ ! -f "$path" ]]; then
    echo "Missing required docs-first file in worktree setup: $path" >&2
    exit 1
  fi
done

echo "Docs-first worktree setup complete."
