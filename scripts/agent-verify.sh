#!/usr/bin/env bash
set -euo pipefail

TASK_FILE=""
RUN_DIR=""
CONTINUE_ON_ERROR=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --task-file)          TASK_FILE="$2"; shift 2 ;;
    --run-dir)            RUN_DIR="$2"; shift 2 ;;
    --continue-on-error)  CONTINUE_ON_ERROR=true; shift ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

[[ -z "$TASK_FILE" ]] && { echo "--task-file required" >&2; exit 1; }
[[ -z "$RUN_DIR" ]] && { echo "--run-dir required" >&2; exit 1; }

mkdir -p "$RUN_DIR"

task_id="$(python3 -c "import json; print(json.load(open('$TASK_FILE'))['id'])")"
task_title="$(python3 -c "import json; print(json.load(open('$TASK_FILE'))['title'])")"

mapfile -t commands < <(python3 -c "import json; [print(c) for c in json.load(open('$TASK_FILE')).get('verification',{}).get('commands',[])]")
mapfile -t acceptance < <(python3 -c "import json; [print(a) for a in json.load(open('$TASK_FILE')).get('verification',{}).get('acceptance',[])]")

if [[ ${#commands[@]} -eq 0 ]]; then
  echo "Task verification.commands is empty." >&2
  exit 1
fi

has_failures=false
results_json="["
verified_at="$(date -Iseconds)"
first=true

for cmd in "${commands[@]}"; do
  [[ -z "$cmd" ]] && continue
  exit_code=0
  output="$(bash -c "$cmd" 2>&1)" || exit_code=$?

  if ! $first; then results_json+=","; fi
  first=false

  output_escaped="$(python3 -c "import json,sys; print(json.dumps(sys.stdin.read()))" <<< "$output")"
  cmd_escaped="$(python3 -c "import json,sys; print(json.dumps(sys.stdin.read().strip()))" <<< "$cmd")"
  results_json+="$(printf '{"command":%s,"exit_code":%d,"output":%s}' "$cmd_escaped" "$exit_code" "$output_escaped")"

  if [[ $exit_code -ne 0 ]]; then
    has_failures=true
    $CONTINUE_ON_ERROR || break
  fi
done

results_json+="]"

acceptance_json="$(python3 -c "import json; print(json.dumps(json.load(open('$TASK_FILE')).get('verification',{}).get('acceptance',[])))")"

cat > "$RUN_DIR/verification.json" <<VJSON
{
  "task_id": "$task_id",
  "task_title": "$task_title",
  "verified_at": "$verified_at",
  "passed": $( $has_failures && echo "false" || echo "true" ),
  "commands": $results_json,
  "acceptance": $acceptance_json
}
VJSON

{
  echo "# Verification"
  echo ""
  echo "Task: $task_id - $task_title"
  echo "Verified at: $verified_at"
  echo "Passed: $( $has_failures && echo "false" || echo "true" )"
  echo ""
  echo "## Acceptance"
  echo ""
  for criterion in "${acceptance[@]}"; do
    [[ -n "$criterion" ]] && echo "- $criterion"
  done
  echo ""
  echo "## Commands"
  echo ""
  for cmd in "${commands[@]}"; do
    [[ -n "$cmd" ]] && echo "- $cmd"
  done
} > "$RUN_DIR/verification.md"

if $has_failures; then
  exit 1
fi

echo "Verification passed for $task_id."
