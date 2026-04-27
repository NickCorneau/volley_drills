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
  "README.md"
  "CLAUDE.md"
  "llms.txt"
  "agent-manifest.json"
  "docs/README.md"
  "docs/catalog.json"
  "docs/design/README.md"
  "docs/decisions.md"
  "docs/roadmap.md"
  "docs/prd-foundation.md"
  "docs/milestones/m001-solo-session-loop.md"
  "docs/plans/2026-04-20-m001-adversarial-memo.md"
  "docs/research/README.md"
  "docs/ops/agent-operations.md"
  "docs/ops/agent-documentation-contract.md"
)

entry_docs=(
  "AGENTS.md"
  "docs/README.md"
  "docs/research/README.md"
  "docs/ops/agent-operations.md"
  "docs/ops/agent-documentation-contract.md"
)

required_sections=(
  "## Purpose"
  "## Use This File When"
  "## Not For"
  "## Update When"
  "## Machine Contract"
)

catalog_entrypoints=(
  "AGENTS.md"
  "README.md"
  "docs/catalog.json"
  "docs/README.md"
  "docs/research/README.md"
  "docs/design/README.md"
  "docs/ops/agent-operations.md"
  "docs/ops/agent-documentation-contract.md"
  "CLAUDE.md"
  "llms.txt"
  "agent-manifest.json"
)

canonical_frontmatter_docs=(
  "docs/decisions.md"
  "docs/roadmap.md"
  "docs/prd-foundation.md"
  "docs/milestones/m001-solo-session-loop.md"
  "docs/plans/2026-04-20-m001-adversarial-memo.md"
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

agents_frontmatter_must_be_valid() {
  local agents_path="$REPO_ROOT/AGENTS.md"

  if [[ -f "$agents_path" ]]; then
    local missing_keys
    missing_keys="$(python3 -c "
from pathlib import Path

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
    keys.add(stripped.split(':', 1)[0].strip())

missing = sorted(required - keys)
if missing:
    print('\n'.join(missing))
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

  return 0
}

canonical_frontmatter_must_be_valid() {
  local rel_path="$1"
  local full_path="$REPO_ROOT/$rel_path"

  if [[ -f "$full_path" ]]; then
    local findings
    findings="$(python3 -c "
from pathlib import Path

path = Path(r'$full_path')
lines = path.read_text(encoding='utf-8').splitlines()
required = {'id', 'title', 'status', 'stage', 'type', 'summary', 'authority', 'last_updated', 'depends_on'}

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
for line_number, line in enumerate(lines[1:closing_index], start=2):
    stripped = line.strip()
    if not stripped or stripped.startswith('- '):
        continue
    if stripped.startswith('##'):
        print(f'__pseudo_frontmatter__:{line_number}:{stripped}')
        continue
    if line[:1].isspace():
        continue
    if ':' not in stripped:
        continue
    keys.add(stripped.split(':', 1)[0].strip())

for key in sorted(required - keys):
    print(f'__missing_key__:{key}')
" 2>/dev/null)" || true

    while IFS= read -r item; do
      [[ -z "$item" ]] && continue
      case "$item" in
        "__missing_opening_frontmatter__")
          errors+=("$rel_path: missing opening YAML frontmatter delimiter '---'")
          ;;
        "__missing_closing_frontmatter__")
          errors+=("$rel_path: missing closing YAML frontmatter delimiter '---'")
          ;;
        "__pseudo_frontmatter__:"*)
          errors+=("$rel_path: frontmatter contains markdown-styled pseudo-frontmatter '${item#*:*:}'")
          ;;
        "__missing_key__:"*)
          errors+=("$rel_path: frontmatter missing required key '${item#__missing_key__:}'")
          ;;
      esac
    done <<< "$findings"
  fi

  return 0
}

manifest_must_point_to_canonical_surfaces() {
  local manifest_path="$REPO_ROOT/agent-manifest.json"

  if [[ -f "$manifest_path" ]]; then
    if ! python3 -c "
import json, sys
with open('$manifest_path', encoding='utf-8') as f:
    data = json.load(f)
entrypoints = data.get('entrypoints', {})
compatibility = entrypoints.get('compatibility', [])
ok = (
    entrypoints.get('prose') == 'AGENTS.md'
    and entrypoints.get('machine') == 'docs/catalog.json'
    and entrypoints.get('hub') == 'README.md'
    and 'CLAUDE.md' in compatibility
    and 'llms.txt' in compatibility
)
sys.exit(0 if ok else 1)
" 2>/dev/null; then
      errors+=("agent-manifest.json: entrypoints must point to AGENTS.md, docs/catalog.json, README.md, CLAUDE.md, and llms.txt")
    fi
  fi
}

catalog_must_have_keys() {
  local catalog_path="$REPO_ROOT/docs/catalog.json"

  if [[ -f "$catalog_path" ]]; then
    local missing_keys
    missing_keys="$(python3 -c "
import json
d = json.load(open('$catalog_path', encoding='utf-8'))
required = ['schema_version', 'repo_state', 'entrypoints', 'read_packs', 'source_of_truth_order', 'docs', 'update_routing', 'research_routing', 'status_vocabularies', 'doc_conventions']
missing = [k for k in required if k not in d]
if missing:
    print('\n'.join(missing))
" 2>/dev/null)" || true

    while IFS= read -r key; do
      [[ -n "$key" ]] && errors+=("docs/catalog.json: missing required key '$key'")
    done <<< "$missing_keys"
  fi

  return 0
}

for rel_path in "${required_paths[@]}"; do
  require_path "$rel_path"
done

json_must_parse "docs/catalog.json"
json_must_parse "agent-manifest.json"
agents_frontmatter_must_be_valid
manifest_must_point_to_canonical_surfaces
catalog_must_have_keys

for rel_path in "${canonical_frontmatter_docs[@]}"; do
  canonical_frontmatter_must_be_valid "$rel_path"
done

for rel_path in "${entry_docs[@]}"; do
  for heading in "${required_sections[@]}"; do
    require_heading "$rel_path" "$heading"
  done
done

for rel_path in "${catalog_entrypoints[@]}"; do
  catalog_must_include_entrypoint "$rel_path"
done

require_literal "CLAUDE.md" "AGENTS.md"
require_literal "CLAUDE.md" "docs/catalog.json"
require_literal "llms.txt" "AGENTS.md"
require_literal "llms.txt" "docs/catalog.json"
require_literal "AGENTS.md" "scripts/validate-agent-docs.sh"

if [[ ${#errors[@]} -gt 0 ]]; then
  echo "Agent-doc validation failed:" >&2
  for err in "${errors[@]}"; do
    echo "  - $err" >&2
  done
  exit 1
fi

echo "Agent doc validation passed."
