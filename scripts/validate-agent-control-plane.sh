#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT=""
if [[ $# -gt 0 ]]; then
  REPO_ROOT="$1"
fi

if [[ -z "$REPO_ROOT" ]]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
fi

errors=()

required_paths=(
  ".gitignore"
  "README.md"
  "AGENTS.md"
  "agent-manifest.json"
  "CLAUDE.md"
  "llms.txt"
  "docs/README.md"
  "docs/catalog.json"
  "docs/research/README.md"
  "docs/ops/autonomous-milestone-system.md"
  "docs/ops/agent-runtime.md"
  "docs/ops/agent-documentation-contract.md"
  ".cursor/hooks.json"
  ".cursor/worktrees.json"
  ".cursor/rules/repo-operating-model.mdc"
  ".cursor/rules/docs-editorial-workflow.mdc"
  ".cursor/rules/machine-scannable-docs.mdc"
  ".cursor/hooks/session-start.sh"
  ".cursor/hooks/guard-shell.sh"
  ".cursor/hooks/write-stop-summary.sh"
  ".cursor/setup-worktree.sh"
  "ops/agent/README.md"
  "ops/agent/queue/task-template.json"
  "ops/agent/schemas/task.schema.json"
  "ops/agent/schemas/status-enums.json"
  "ops/agent/handoffs/HANDOFF_TEMPLATE.md"
  "ops/agent/runs/README.md"
  "scripts/agent-supervisor.sh"
  "scripts/agent-dispatch.sh"
  "scripts/agent-verify.sh"
  "scripts/agent-notify.sh"
  "scripts/validate-agent-docs.sh"
)

for rel_path in "${required_paths[@]}"; do
  if [[ ! -f "$REPO_ROOT/$rel_path" ]]; then
    errors+=("Missing required path: $rel_path")
  fi
done

json_files=(
  ".cursor/hooks.json"
  ".cursor/worktrees.json"
  "docs/catalog.json"
  "agent-manifest.json"
  "ops/agent/queue/task-template.json"
  "ops/agent/schemas/task.schema.json"
  "ops/agent/schemas/status-enums.json"
)

for rel_path in "${json_files[@]}"; do
  full_path="$REPO_ROOT/$rel_path"
  if [[ -f "$full_path" ]]; then
    if ! python3 -c "import json; json.load(open('$full_path'))" 2>/dev/null; then
      errors+=("Invalid JSON: $rel_path")
    fi
  fi
done

catalog_path="$REPO_ROOT/docs/catalog.json"
if [[ -f "$catalog_path" ]]; then
  missing_keys="$(python3 -c "
import json, sys
d = json.load(open('$catalog_path'))
required = ['schema_version','repo_state','entrypoints','source_of_truth_order','docs','status_vocabularies','doc_conventions','documents']
missing = [k for k in required if k not in d]
if missing:
    print('\n'.join(missing))
" 2>/dev/null)" || true
  while IFS= read -r key; do
    [[ -n "$key" ]] && errors+=("docs/catalog.json: missing required key '$key'")
  done <<< "$missing_keys"
fi

agent_docs_validator="$REPO_ROOT/scripts/validate-agent-docs.sh"
if [[ -f "$agent_docs_validator" ]]; then
  if ! agent_doc_output="$(bash "$agent_docs_validator" "$REPO_ROOT" 2>&1)"; then
    while IFS= read -r line; do
      [[ -n "$line" ]] && errors+=("validate-agent-docs.sh: $line")
    done <<< "$agent_doc_output"
  fi
fi

gitignore_path="$REPO_ROOT/.gitignore"
required_patterns=(
  ".worktrees/"
  "ops/agent/state/"
  "ops/agent/runs/*"
  ".cursor/hooks/state/"
  ".cursor/plans/"
)

if [[ -f "$gitignore_path" ]]; then
  gitignore_text="$(cat "$gitignore_path")"
  for pattern in "${required_patterns[@]}"; do
    if ! grep -qF "$pattern" <<< "$gitignore_text"; then
      errors+=("Missing .gitignore pattern: $pattern")
    fi
  done
fi

if [[ ${#errors[@]} -gt 0 ]]; then
  echo "Validation failed:" >&2
  for err in "${errors[@]}"; do
    echo "  - $err" >&2
  done
  exit 1
fi

echo "Agent control plane validation passed."
