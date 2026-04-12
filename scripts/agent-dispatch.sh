#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT=""
TASK_FILE=""
RUN_DIR=""
WORKTREE_PATH=""
WORKER="cursor"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-root)      REPO_ROOT="$2"; shift 2 ;;
    --task-file)      TASK_FILE="$2"; shift 2 ;;
    --run-dir)        RUN_DIR="$2"; shift 2 ;;
    --worktree-path)  WORKTREE_PATH="$2"; shift 2 ;;
    --worker)         WORKER="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

[[ -z "$REPO_ROOT" ]] && { echo "--repo-root required" >&2; exit 1; }
[[ -z "$TASK_FILE" ]] && { echo "--task-file required" >&2; exit 1; }
[[ -z "$RUN_DIR" ]] && { echo "--run-dir required" >&2; exit 1; }
[[ -z "$WORKTREE_PATH" ]] && { echo "--worktree-path required" >&2; exit 1; }

json_get() { python3 -c "import json; d=json.load(open('$1')); print(d.get('$2',''))" ; }
json_get_array() { python3 -c "import json; d=json.load(open('$1')); print('\n'.join(d.get('$2',[]) if isinstance(d.get('$2'), list) else d.get('$2',{}).get('$3',[])))" ; }
json_get_nested() { python3 -c "import json; d=json.load(open('$1')); print('\n'.join(d.get('$2',{}).get('$3',[])))" ; }

mkdir -p "$RUN_DIR"

TASK_FILE="$(realpath "$TASK_FILE")"
RUN_DIR="$(realpath "$RUN_DIR")"
WORKTREE_PATH="$(realpath "$WORKTREE_PATH")"

task_id="$(json_get "$TASK_FILE" "id")"
task_title="$(json_get "$TASK_FILE" "title")"
task_milestone="$(json_get "$TASK_FILE" "milestone")"
task_summary="$(json_get "$TASK_FILE" "summary")"

must_read=("AGENTS.md" "docs/README.md" "docs/ops/autonomous-milestone-system.md" "docs/ops/agent-runtime.md")
while IFS= read -r line; do
  [[ -n "$line" ]] && must_read+=("$line")
done < <(python3 -c "
import json
d = json.load(open('$TASK_FILE'))
for f in d.get('handoff',{}).get('must_read',[]):
    print(f)
")

mapfile -t scope_files < <(json_get_nested "$TASK_FILE" "scope" "files")
mapfile -t out_of_scope < <(json_get_nested "$TASK_FILE" "scope" "out_of_scope")
mapfile -t verify_commands < <(json_get_nested "$TASK_FILE" "verification" "commands")
mapfile -t escalate_if < <(python3 -c "import json; d=json.load(open('$TASK_FILE')); [print(x) for x in d.get('escalate_if',[])]")

fmt_list() {
  local arr=("$@")
  if [[ ${#arr[@]} -eq 0 ]]; then
    echo "- None specified."
  else
    for item in "${arr[@]}"; do
      [[ -n "$item" ]] && echo "- $item"
    done
  fi
}

prompt_path="$RUN_DIR/worker-prompt.md"
launch_path="$RUN_DIR/launch-instructions.md"
active_state_path="$REPO_ROOT/ops/agent/state/active-task.json"

cat > "$prompt_path" <<PROMPT
# Worker Brief

Task: $task_id - $task_title
Milestone: $task_milestone
Run directory: $RUN_DIR
Work area: $WORKTREE_PATH

## Outcome

$task_summary

## Required reads

$(fmt_list "${must_read[@]}")

## Scope

In scope:
$(fmt_list "${scope_files[@]}")

Out of scope:
$(fmt_list "${out_of_scope[@]}")

## Verification

$(fmt_list "${verify_commands[@]}")

## Escalate if

$(fmt_list "${escalate_if[@]}")

## Runtime rules

- Work only on this task.
- Do not widen milestone scope.
- If you become blocked, write a concise blocker note to $RUN_DIR/blocker.md and stop.
- When you believe the task is complete, run the verification commands before claiming success.
- Use terminal states done, blocked, failed, or budget_exhausted.
PROMPT

cat > "$launch_path" <<LAUNCH
Worker: $WORKER
Task file: $TASK_FILE
Prompt file: $prompt_path
Work area: $WORKTREE_PATH
Run directory: $RUN_DIR
LAUNCH

mkdir -p "$(dirname "$active_state_path")"
cat > "$active_state_path" <<STATE
{
  "task_id": "$task_id",
  "task_file": "$TASK_FILE",
  "run_dir": "$RUN_DIR",
  "worktree_path": "$WORKTREE_PATH",
  "updated_at": "$(date -Iseconds)"
}
STATE

export VOLLEY_AGENT_TASK_ID="$task_id"
export VOLLEY_AGENT_TASK_FILE="$TASK_FILE"
export VOLLEY_AGENT_RUN_DIR="$RUN_DIR"
export VOLLEY_AGENT_WORKTREE_PATH="$WORKTREE_PATH"

case "$WORKER" in
  cursor)
    if command -v cursor &>/dev/null; then
      cursor "$WORKTREE_PATH" &
      echo "Opened Cursor for task $task_id. Prompt written to $prompt_path."
    else
      echo "Cursor CLI not found. Prompt written to $prompt_path." >&2
    fi
    ;;
  claude)
    if ! command -v claude &>/dev/null; then
      echo "Claude CLI not found on PATH." >&2
      exit 1
    fi
    cd "$WORKTREE_PATH"
    claude -p --permission-mode acceptEdits --allowedTools "Read,Edit,Bash" --output-format json < "$prompt_path" > "$RUN_DIR/claude-output.json" 2>&1
    echo "Claude run completed for task $task_id."
    ;;
  none)
    echo "Prompt written to $prompt_path."
    ;;
esac
