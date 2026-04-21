#!/usr/bin/env bash
# scripts/dream.sh — assemble a populated Day-Dreaming Loop (DDL) prompt
# from live repo state and write it to .cursor/state/dreams/.
#
# What this script is:
#   An alarm clock. It gathers recent episodes (git log), the tail of
#   the founder-use ledger, stale-doc candidates under docs/research/
#   and docs/plans/, and any open red-team or review flags, then
#   assembles a pre-registered DDL prompt the next agent session will
#   execute.
#
# What this script is NOT:
#   An LLM caller. There is deliberately no network call. Synchronous
#   LLM dreaming is the opposite of offline consolidation — the whole
#   point of the dream pass is that it happens async to authoring, not
#   inline. The agent runs the dream when convenient; the prompt
#   persists until it does.
#
# Cadence: run once per Monday as the first step of the
# adversarial-memo weekly ritual. See
# docs/plans/2026-04-20-m001-adversarial-memo.md § "Dream-pass
# cadence and amendments (2026-04-20)" for rationale.
#
# Output: .cursor/state/dreams/dream-YYYY-MM-DD.md (idempotent per day;
# re-running on the same day overwrites with fresh chunks).
#
# Post-conditions for the agent that reads the emitted prompt:
#   1. Execute the DDL (recombination -> noise injection -> pruning).
#   2. Append the surviving Dream Fragments to the memo's Weekly Log
#      under the current Monday's entry. The pruning output lands
#      first; authoring budget for the week is gated on it.
#   3. Delete the prompt file so stale prompts do not accumulate. The
#      memo Weekly Log becomes the durable record; the prompt is
#      ephemeral scaffolding.

set -euo pipefail

# -- Locate repo root ---------------------------------------------------------

if ! repo_root="$(git rev-parse --show-toplevel 2>/dev/null)"; then
  echo "dream.sh: not inside a git repo; aborting." >&2
  exit 1
fi
cd "$repo_root"

# -- Paths --------------------------------------------------------------------

today="$(date +%Y-%m-%d)"
dreams_dir=".cursor/state/dreams"
prompt_path="$dreams_dir/dream-${today}.md"

mkdir -p "$dreams_dir"

# -- Collect memory chunks ---------------------------------------------------

# 1. Recent commits (last 14 days, one line each). Episodic memory.
recent_commits="$(git log --since='14 days ago' --pretty=format:'- %h %ad %s' --date=short 2>/dev/null || true)"
if [[ -z "$recent_commits" ]]; then
  recent_commits="(no commits in the last 14 days)"
fi

# 2. Current uncommitted churn (files changed). Present-moment attention.
uncommitted="$(git status --short 2>/dev/null | head -n 40 || true)"
if [[ -z "$uncommitted" ]]; then
  uncommitted="(working tree clean)"
fi

# 3. Tail of the founder-use ledger Sessions table. Behavioral signal.
ledger_path="docs/research/founder-use-ledger.md"
if [[ -f "$ledger_path" ]]; then
  # Grab the last ~15 lines of the Sessions table. The table is the
  # region between "## Sessions" and "## Week rollups"; tailing is
  # cheaper than parsing markdown properly.
  ledger_tail="$(awk '
    /^## Sessions/ { in_sessions = 1; next }
    /^## Week rollups/ { in_sessions = 0 }
    in_sessions { print }
  ' "$ledger_path" | tail -n 15)"
else
  ledger_tail="(ledger file not found at $ledger_path)"
fi

# 4. Stale-doc candidates. Anything under docs/research/ or docs/plans/
#    not touched in the last 21 days. These are the first pruning
#    candidates for the dream pass to consider.
stale_docs="$(git log --since='21 days ago' --name-only --pretty=format: \
             -- 'docs/research/*.md' 'docs/plans/*.md' 2>/dev/null \
             | sort -u > /tmp/dream-recent-docs.$$ 2>/dev/null || true

git ls-files 'docs/research/*.md' 'docs/plans/*.md' 2>/dev/null \
  | sort -u > /tmp/dream-all-docs.$$ 2>/dev/null || true

comm -23 /tmp/dream-all-docs.$$ /tmp/dream-recent-docs.$$ 2>/dev/null | head -n 20 || true

rm -f /tmp/dream-recent-docs.$$ /tmp/dream-all-docs.$$)"

if [[ -z "$stale_docs" ]]; then
  stale_docs="(no stale docs identified; repo churn is uniform across the last 21 days)"
fi

# 5. Open red-team / review flags. Any line in docs/reviews/ or the
#    memo containing "P0" or "P1" so the dream has fresh adversarial
#    material to recombine against.
red_flags="$(grep -rn --include='*.md' -E '\bP0\b|\bP1\b' docs/reviews/ docs/plans/2026-04-20-m001-adversarial-memo.md 2>/dev/null | head -n 10 || true)"
if [[ -z "$red_flags" ]]; then
  red_flags="(no P0/P1 flags found in review or memo surfaces)"
fi

# 6. Days since the founder last read the memo (A3 ligament check).
#    Looks for the most recent "read-through:" log line in the memo's
#    Weekly Log. Best-effort; absence is itself a signal.
memo_path="docs/plans/2026-04-20-m001-adversarial-memo.md"
last_read_line="$(grep -E 'read-through: *[0-9]{4}-[0-9]{2}-[0-9]{2}' "$memo_path" 2>/dev/null | tail -n 1 || true)"
if [[ -n "$last_read_line" ]]; then
  ligament_status="Last logged memo read-through: $last_read_line"
else
  ligament_status="No logged memo read-through in the Weekly Log. A3 ligament is overdue; read before editing any plan or research file."
fi

# -- Assemble the prompt -----------------------------------------------------

cat > "$prompt_path" <<PROMPT
# Dream prompt — ${today}

Assembled by \`scripts/dream.sh\` on ${today}. Ephemeral scaffolding: once
the agent has run the DDL and appended Dream Fragments to the memo's
Weekly Log, delete this file. Its purpose is to be consumed, not archived.

## [SYSTEM]

You are a Creative Synthesizer and Critical Editor performing "cognitive
dreaming" on the live repo state of the Volleycraft beach-volleyball
training app. The dreaming function here is not additive recombination
alone — it is also **pruning** (net-subtractive consolidation). A dream
pass that only generates is the displacement-activity failure mode the
2026-04-20 red-team review named.

Ground rules inherited from the adversarial memo
(\`docs/plans/2026-04-20-m001-adversarial-memo.md\`):

- Recommend before interrogate (P11); the dream output proposes, it does
  not formify.
- Additions that strengthen the memo are welcome; edits that weaken any
  of the three falsification conditions require a co-signer.
- Content-authoring is displacement activity unless a logged session gap
  justifies it. The pruning section below exists specifically to keep
  this honest.

## [INPUT DATA — live repo state as of ${today}]

### A. Ligament status (A3 pre-authoring check)

${ligament_status}

If the last read-through is older than 7 days, the dream pass's first
output MUST be a reminder to re-read the memo before anything else lands.

### B. Recent episodes (git log, last 14 days)

${recent_commits}

### C. Present-moment attention (uncommitted working tree)

\`\`\`
${uncommitted}
\`\`\`

### D. Behavioral signal (founder-use ledger tail)

\`\`\`
${ledger_tail}
\`\`\`

### E. Stale-doc candidates (no git activity in the last 21 days)

These are the first pruning targets. Not all stale docs should be
archived — some are canonical (vision.md, decisions.md). Filter by
whether the doc is referenced from active plans or has been overtaken
by later decisions.

\`\`\`
${stale_docs}
\`\`\`

### F. Open adversarial material (P0 / P1 flags in reviews and memo)

\`\`\`
${red_flags}
\`\`\`

## [INSTRUCTIONS]

Run the DDL in order. Do not skip steps.

1. **RECOMBINATION.** Pick 3 pairs of distant chunks from A-F above and
   generate one novel, non-obvious association per pair. Do not
   summarize the chunks; create a new hypothesis, metaphor, or
   operational rule that merges their underlying concepts. Prefer pairs
   that cross a layer boundary (code ↔ planning, safety ↔ validation,
   product ↔ meta-process).

2. **NOISE INJECTION.** Pick one of the three associations and push it
   to a contradiction, edge case, or "what if the founder is the product
   and also the user" scenario. The fragment that survives noise
   injection is usually the sharpest one.

3. **PRUNING (net-subtractive; the sleep function the original DDL
   template omitted).** From the Stale-doc candidates in E:
   - List up to 3 docs that could be archived (moved to
     \`archive/\`) or consolidated into another active doc.
   - For each, name the specific evidence that justifies the prune:
     canonicality overtaken by decision D-N, topic covered more tightly
     in doc Y, or never referenced from any active plan.
   - If zero docs meet the pruning bar, say so explicitly. "Nothing to
     prune this week" is a valid output only when justified; it is the
     single most common failure mode of a dream pass.

4. **EVALUATION.** Discard any generated fragment that is:
   - trivially restating a red-team finding already in F;
   - a rhetorical parallel without a concrete new constraint or action;
   - something the founder would be doing anyway without the dream.

5. **OUTPUT.** Append the surviving Dream Fragments and the Pruning
   output to the Weekly Log of the adversarial memo
   (\`docs/plans/2026-04-20-m001-adversarial-memo.md\`) under the
   current Monday's entry. If no Monday entry exists yet for this week,
   create it using the template at the top of the Weekly Log section.

   Then delete this prompt file (\`${prompt_path}\`).

## [OUTPUT FORMAT to append to the memo's Weekly Log]

\`\`\`
## ${today} — dream pass

### Dream Fragments kept
- Fragment 1: [1-3 sentence description + concrete next action]
- Fragment 2: [...]
- Fragment N: [...]

### Noise-injected fragment
- [which fragment; what contradiction; what the sharpened version says]

### Pruning proposals
- Archive candidate 1: [path] — [one-line justification]
- Archive candidate 2: [path] — [one-line justification]
- Archive candidate 3: [path] — [one-line justification]
OR
- Nothing meets the prune bar this week because [specific justification].

### Discarded fragments (one line each, no detail needed)
- [fragment] — [reason for discard]

### A3 ligament status
- Last memo read-through: [date] ([N days ago])
- Re-read required before next plan/research edit: yes / no
\`\`\`
PROMPT

# -- Report -----------------------------------------------------------------

echo "dream.sh: wrote prompt to $prompt_path"
echo
echo "Next step: open the prompt in the next agent session and execute"
echo "the DDL. The agent appends Dream Fragments to the memo's Weekly"
echo "Log and deletes the prompt file once consumed."
