#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT=""
WORKER="cursor"
POLL_SECONDS=60
ONCE=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-root)  REPO_ROOT="$2"; shift 2 ;;
    --worker)     WORKER="$2"; shift 2 ;;
    --poll)       POLL_SECONDS="$2"; shift 2 ;;
    --once)       ONCE=true; shift ;;
    --dry-run)    DRY_RUN=true; shift ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$REPO_ROOT" ]]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
fi

read_json() { cat "$1"; }
write_json() { printf '%s\n' "$2" > "$1"; }

json_get() {
  local file="$1" key="$2"
  python3 -c "import json,sys; d=json.load(open('$file')); print(d.get('$key',''))"
}

json_set() {
  local file="$1" key="$2" value="$3"
  python3 -c "
import json, sys
with open('$file') as f: d = json.load(f)
d['$key'] = '$value'
with open('$file','w') as f: json.dump(d, f, indent=2)
"
}

json_set_timestamp() {
  local file="$1" key="$2"
  python3 -c "
import json, datetime
with open('$file') as f: d = json.load(f)
d['$key'] = datetime.datetime.now().isoformat()
with open('$file','w') as f: json.dump(d, f, indent=2)
"
}

test_git_head() {
  git -C "$1" rev-parse --verify HEAD &>/dev/null
}

get_next_pending_task() {
  local queue_root="$1"
  for f in "$queue_root"/*.json; do
    [[ "$(basename "$f")" == "task-template.json" ]] && continue
    [[ ! -f "$f" ]] && continue
    local status
    status="$(json_get "$f" "status")"
    if [[ "$status" == "pending" ]]; then
      echo "$f"
      return 0
    fi
  done
  return 1
}

new_work_area() {
  local root="$1" task_id="$2"

  if ! test_git_head "$root"; then
    echo "$root|inplace-bootstrap|"
    return
  fi

  local worktree_root="$root/.worktrees"
  local branch="task/$task_id"
  local path="$worktree_root/$(echo "$task_id" | tr '[:upper:]' '[:lower:]')"

  mkdir -p "$worktree_root"

  if [[ ! -d "$path" ]]; then
    if git -C "$root" branch --list "$branch" | grep -q .; then
      git -C "$root" worktree add "$path" "$branch" >/dev/null
    else
      git -C "$root" worktree add "$path" -b "$branch" >/dev/null
    fi
  fi

  echo "$path|worktree|$branch"
}

clear_active_task() {
  local active_task_path="$1/ops/agent/state/active-task.json"
  [[ -f "$active_task_path" ]] && rm -f "$active_task_path"
}

QUEUE_ROOT="$REPO_ROOT/ops/agent/queue"
RUNS_ROOT="$REPO_ROOT/ops/agent/runs"
STATE_ROOT="$REPO_ROOT/ops/agent/state"

mkdir -p "$RUNS_ROOT" "$STATE_ROOT"

while true; do
  task_file=""
  task_file="$(get_next_pending_task "$QUEUE_ROOT")" || true

  if [[ -z "$task_file" ]]; then
    echo "No pending tasks found."
    $ONCE && exit 0
    sleep "$POLL_SECONDS"
    continue
  fi

  task_id="$(json_get "$task_file" "id")"
  has_head=false
  test_git_head "$REPO_ROOT" && has_head=true

  if $DRY_RUN; then
    if $has_head; then
      preview_mode="worktree"
      preview_path="$REPO_ROOT/.worktrees/$(echo "$task_id" | tr '[:upper:]' '[:lower:]')"
    else
      preview_mode="inplace-bootstrap"
      preview_path="$REPO_ROOT"
    fi

    echo "Dry run only."
    echo "Task: $task_id"
    echo "Task file: $task_file"
    echo "Planned worker: $WORKER"
    echo "Planned mode: $preview_mode"
    echo "Planned work area: $preview_path"

    $ONCE && exit 0
    sleep "$POLL_SECONDS"
    continue
  fi

  IFS='|' read -r wa_path wa_mode wa_branch <<< "$(new_work_area "$REPO_ROOT" "$task_id")"
  run_id="$(echo "$task_id" | tr '[:upper:]' '[:lower:]')-$(date +%Y%m%d-%H%M%S)"
  run_dir="$RUNS_ROOT/$run_id"

  mkdir -p "$run_dir"

  cat > "$run_dir/run-metadata.json" <<METADATA
{
  "run_id": "$run_id",
  "task_id": "$task_id",
  "task_file": "$task_file",
  "worker": "$WORKER",
  "worktree_mode": "$wa_mode",
  "worktree_path": "$wa_path",
  "branch": "$wa_branch",
  "created_at": "$(date -Iseconds)"
}
METADATA

  json_set "$task_file" "status" "claimed"
  json_set_timestamp "$task_file" "claimed_at"

  python3 -c "
import json
with open('$task_file') as f: d = json.load(f)
d['run_id'] = '$run_id'
d['worktree_mode'] = '$wa_mode'
d['worktree_path'] = '$wa_path'
with open('$task_file','w') as f: json.dump(d, f, indent=2)
"

  dispatch_ok=true
  "$REPO_ROOT/scripts/agent-dispatch.sh" \
    --repo-root "$REPO_ROOT" \
    --task-file "$task_file" \
    --run-dir "$run_dir" \
    --worktree-path "$wa_path" \
    --worker "$WORKER" || dispatch_ok=false

  if ! $dispatch_ok; then
    error_msg="Dispatch failed for task $task_id"
    json_set "$task_file" "status" "blocked"
    json_set_timestamp "$task_file" "blocked_at"
    echo "$error_msg" > "$run_dir/blocker.md"
    "$REPO_ROOT/scripts/agent-notify.sh" --status "blocked" --task-id "$task_id" --message "$error_msg" --run-dir "$run_dir"
    clear_active_task "$REPO_ROOT"
    $ONCE && exit 1
    sleep "$POLL_SECONDS"
    continue
  fi

  if [[ "$WORKER" == "claude" ]]; then
    verify_exit=0
    "$REPO_ROOT/scripts/agent-verify.sh" --task-file "$task_file" --run-dir "$run_dir" || verify_exit=$?

    if [[ $verify_exit -eq 0 ]]; then
      json_set "$task_file" "status" "done"
      json_set_timestamp "$task_file" "completed_at"
      "$REPO_ROOT/scripts/agent-notify.sh" --status "done" --task-id "$task_id" --message "Claude run completed and verification passed." --run-dir "$run_dir"
      clear_active_task "$REPO_ROOT"
    else
      json_set "$task_file" "status" "blocked"
      json_set_timestamp "$task_file" "blocked_at"
      "$REPO_ROOT/scripts/agent-notify.sh" --status "blocked" --task-id "$task_id" --message "Claude run finished but verification failed." --run-dir "$run_dir"
      clear_active_task "$REPO_ROOT"
    fi
  else
    "$REPO_ROOT/scripts/agent-notify.sh" --status "claimed" --task-id "$task_id" --message "Task prepared for interactive work in $WORKER." --run-dir "$run_dir"
  fi

  $ONCE && break
done
