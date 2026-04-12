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
  "AGENTS.md"
  "agent-manifest.json"
  "llms.txt"
  "docs/README.md"
  "docs/catalog.json"
  "docs/research/README.md"
  "docs/ops/agent-runtime.md"
  "docs/ops/agent-documentation-contract.md"
  "ops/agent/README.md"
)

required_sections=(
  "## Purpose"
  "## Use This File When"
  "## Not For"
  "## Update When"
  "## Machine Contract"
)

entry_docs=(
  "AGENTS.md"
  "docs/README.md"
  "docs/research/README.md"
  "docs/ops/agent-runtime.md"
  "docs/ops/agent-documentation-contract.md"
  "ops/agent/README.md"
)

catalog_entrypoints=(
  "AGENTS.md"
  "docs/catalog.json"
  "agent-manifest.json"
  "llms.txt"
  "docs/README.md"
  "docs/research/README.md"
  "docs/ops/agent-runtime.md"
  "docs/ops/agent-documentation-contract.md"
  "ops/agent/README.md"
)

require_path() {
  local rel_path="$1"
  if [[ ! -f "$REPO_ROOT/$rel_path" ]]; then
    errors+=("Missing required agent-doc path: $rel_path")
  fi
}

json_must_parse() {
  local rel_path="$1"
  local full_path="$REPO_ROOT/$rel_path"

  if [[ -f "$full_path" ]]; then
    if ! python3 -c "import json; json.load(open('$full_path', encoding='utf-8'))" 2>/dev/null; then
      errors+=("Invalid JSON: $rel_path")
    fi
  fi
}

require_heading() {
  local rel_path="$1"
  local heading="$2"
  local full_path="$REPO_ROOT/$rel_path"

  if [[ -f "$full_path" ]] && ! grep -qF "$heading" "$full_path"; then
    errors+=("$rel_path: missing required heading '$heading'")
  fi
}

require_literal() {
  local rel_path="$1"
  local literal="$2"
  local full_path="$REPO_ROOT/$rel_path"

  if [[ -f "$full_path" ]] && ! grep -qF "$literal" "$full_path"; then
    errors+=("$rel_path: missing required reference '$literal'")
  fi
}

catalog_must_include_entrypoint() {
  local rel_path="$1"
  local catalog_path="$REPO_ROOT/docs/catalog.json"

  if [[ -f "$catalog_path" ]]; then
    if ! python3 -c "
import json, sys
with open('$catalog_path', encoding='utf-8') as f:
    data = json.load(f)
paths = [item.get('path') for item in data.get('entrypoints', [])]
sys.exit(0 if '$rel_path' in paths else 1)
" 2>/dev/null; then
      errors+=("docs/catalog.json: missing entrypoint '$rel_path'")
    fi
  fi
}

manifest_must_match_machine_contract() {
  local key="$1"
  local expected_value="$2"
  local manifest_path="$REPO_ROOT/agent-manifest.json"

  if [[ -f "$manifest_path" ]]; then
    if ! python3 -c "
import json, sys
with open('$manifest_path', encoding='utf-8') as f:
    data = json.load(f)
actual = data.get('machine_contract', {}).get('$key')
sys.exit(0 if actual == '$expected_value' else 1)
" 2>/dev/null; then
      errors+=("agent-manifest.json: machine_contract.$key must equal '$expected_value'")
    fi
  fi
}

manifest_must_include_script() {
  local rel_path="$1"
  local manifest_path="$REPO_ROOT/agent-manifest.json"

  if [[ -f "$manifest_path" ]]; then
    if ! python3 -c "
import json, sys
with open('$manifest_path', encoding='utf-8') as f:
    data = json.load(f)
scripts = [item.get('path') for item in data.get('capabilities', {}).get('scripts', [])]
sys.exit(0 if '$rel_path' in scripts else 1)
" 2>/dev/null; then
      errors+=("agent-manifest.json: missing script capability '$rel_path'")
    fi
  fi
}

agents_frontmatter_must_be_valid() {
  local agents_path="$REPO_ROOT/AGENTS.md"

  if [[ -f "$agents_path" ]]; then
    local missing_keys
    missing_keys="$(python3 -c "
from pathlib import Path
import sys

path = Path(r'$agents_path')
lines = path.read_text(encoding='utf-8').splitlines()
required = {'id', 'title', 'status', 'stage', 'type', 'summary'}

if not lines or lines[0].strip() != '---':
    print('__missing_opening_frontmatter__')
    raise SystemExit(0)

closing_index = None
for idx, line in enumerate(lines[1:], start=1):
    if line.strip() == '---':
        closing_index = idx
        break

if closing_index is None:
    print('__missing_closing_frontmatter__')
    raise SystemExit(0)

keys = set()
for line in lines[1:closing_index]:
    stripped = line.strip()
    if not stripped or stripped.startswith('- '):
        continue
    if ':' not in stripped:
        continue
    key = stripped.split(':', 1)[0].strip()
    keys.add(key)

missing = sorted(required - keys)
if missing:
    print('\\n'.join(missing))
" 2>/dev/null)" || true

    while IFS= read -r item; do
      [[ -z "$item" ]] && continue
      case "$item" in
        "__missing_opening_frontmatter__")
          errors+=("AGENTS.md: missing opening YAML frontmatter delimiter '---'")
          ;;
        "__missing_closing_frontmatter__")
          errors+=("AGENTS.md: missing closing YAML frontmatter delimiter '---'")
          ;;
        *)
          errors+=("AGENTS.md: frontmatter missing required key '$item'")
          ;;
      esac
    done <<< "$missing_keys"
  fi
}

for rel_path in "${required_paths[@]}"; do
  require_path "$rel_path"
done

json_must_parse "docs/catalog.json"
json_must_parse "agent-manifest.json"

agents_frontmatter_must_be_valid

for rel_path in "${entry_docs[@]}"; do
  for heading in "${required_sections[@]}"; do
    require_heading "$rel_path" "$heading"
  done
done

for rel_path in "${catalog_entrypoints[@]}"; do
  catalog_must_include_entrypoint "$rel_path"
done

manifest_must_match_machine_contract "prose_repo_contract" "AGENTS.md"
manifest_must_match_machine_contract "exhaustive_machine_index" "docs/catalog.json"
manifest_must_match_machine_contract "compact_json_manifest" "agent-manifest.json"
manifest_must_match_machine_contract "lightweight_text_summary" "llms.txt"
manifest_must_match_machine_contract "docs_contract" "docs/ops/agent-documentation-contract.md"

manifest_must_include_script "scripts/validate-agent-docs.sh"
manifest_must_include_script "scripts/validate-agent-control-plane.sh"

require_literal "AGENTS.md" "scripts/validate-agent-docs.sh"
require_literal "ops/agent/README.md" "scripts/validate-agent-docs.sh"
require_literal "docs/ops/agent-documentation-contract.md" "validate-agent-docs.sh"
require_literal "llms.txt" "AGENTS.md"
require_literal "llms.txt" "docs/catalog.json"

if [[ ${#errors[@]} -gt 0 ]]; then
  echo "Agent-doc validation failed:" >&2
  for err in "${errors[@]}"; do
    echo "  - $err" >&2
  done
  exit 1
fi

echo "Agent doc validation passed."
