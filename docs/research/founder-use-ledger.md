## id: founder-use-ledger
title: "Founder-Use Ledger (Dated append-only log during D130 window)"
type: research
status: active
stage: validation
authority: "Append-only dated log of founder sessions during the D130 founder-use window (2026-04-20 → 2026-07-20). Captures the behavioral signal that the founder-use mode assumes exists, in a form that is legible at the 2026-07-20 re-eval without depending on any in-app surface."
summary: "One line per founder session: date, playerMode, focus, duration, completed Y/N, RPE, one-sentence note. Designed to be appended in under 30 seconds right after a session. Read at every weekly adversarial-memo review and at the 2026-07-20 D130 re-eval."
last_updated: 2026-04-20
depends_on:
  - docs/decisions.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/milestones/m001-solo-session-loop.md
related:
  - docs/research/partner-walkthrough-script.md
  - docs/research/d91-retention-gate-evidence.md
decision_refs:
  - D91
  - D130

# Founder-Use Ledger

## Agent Quick Scan

- This is the founder's personal session log during the `D130` founder-use window. One row per session, appended right after the session ends, never backfilled from memory more than 24h later.
- Authoritative for: the behavioral evidence that feeds the `docs/plans/2026-04-20-m001-adversarial-memo.md` weekly trigger review and the 2026-07-20 D130 re-eval decision.
- Not authoritative for: partner walkthrough findings (those go in `docs/research/partner-walkthrough-results/`), Tier 1a scope (`docs/plans/2026-04-20-m001-tier1-implementation.md`), or any D91 numerical threshold (that's a stranger-launch concern).
- This file is deliberately low-effort to append to. If it becomes high-effort, it stops being honest. Do not over-instrument it.

## Why this file exists

`D130` asserts that founder-use mode is valid in place of the D91 stranger-cohort gate because the founder has personal conviction for the product. The `docs/reviews/2026-04-20-m001-red-team.md` red-team flagged that "personal conviction" is not observable and not falsifiable. This ledger converts conviction into a behavior log: which sessions happened, which did not, what focus the founder actually chose, and whether the founder finished what they started.

---

The ledger exists so the 2026-07-20 re-eval can be informed by data, not by the founder's recollection of enthusiasm. Absence of data at the re-eval is itself a signal; the adversarial memo's Condition 1 and Condition 2 both read directly from this file.

**This ledger is one behavioral-evidence channel, not the only one.** It captures founder personal-use sessions; it does not capture partner (Seb) usage, partner-walkthrough observations, or Condition 3 unprompted-open signals. Per the 2026-04-22-c founder correction recorded in `docs/research/2026-04-22-research-sweep-meta-synthesis.md`, personal-ledger logging should not be treated as a prerequisite for canon work, research synthesis, or Tier 1b / Tier 2 progression — Seb's ongoing usage, the partner-walkthrough reconciliation, and the founder's planned post-injury resumption of personal use are first-class evidence alongside rows in this file. Research-velocity substitution is still a real failure mode (see `docs/roadmap.md` Risks-and-mitigations), but it is the research-vs-**any-behavioral-evidence** ratio that matters, not the research-vs-founder-ledger ratio specifically. The weekly Monday adversarial-memo review should read ledger count alongside Seb's open cadence, partner-walkthrough output, and any other observable behavior channel, rather than reading ledger count alone.

## How to use this ledger

**Append-only.** Add new rows at the top of the *Sessions* table, newest first. Do not re-order old rows. Do not edit old rows except to correct a factual typo (note the correction inline).

**Time budget.** 30 seconds per row, tops. Paste the row template, fill the seven fields, save. If a row feels like it needs more fields, the ledger is getting over-engineered — stop and discuss before adding columns.

**Granularity.** One row per session that the founder actually *started*, regardless of whether it completed. If the app was opened and a session was assembled but no drills were done, that is a logged session (completed: `N`, note: "assembled, didn't run"). If the app was never opened on a planned training day, that is NOT a row — it's a skipped day, which falls under the adversarial memo's trigger (b) (3-week silence) and does not need its own row.

**Weekly review.** Every Monday, the adversarial-memo ritual reads this ledger to produce the weekly log block. No action required here; just keep the rows honest.

## Schema


| Field          | Values                             | Notes                                                                                                                                                                                                                         |
| -------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `date`         | YYYY-MM-DD                         | Session start date in founder's local time. If a session straddles midnight, use the start date.                                                                                                                              |
| `playerMode`   | `solo` | `pair`                    | If pair, capture the partner's first name in the note field.                                                                                                                                                                  |
| `focus`        | `pass` | `serve` | `set` | `mixed` | What the founder was actually trying to train. `mixed` is legitimate but should be rare; recurring `mixed` entries suggest the single-focus invariant is being ignored and should be noted in the weekly review.              |
| `duration_min` | integer                            | Actual training minutes (not the timer's planned minutes if the session ended early or ran long).                                                                                                                             |
| `completed`    | `Y` | `N` | `partial`              | `Y` = ran every block intended to be run. `N` = abandoned before any real skill block. `partial` = ran the warmup + main skill but cut pressure or wrap.                                                                      |
| `rpe`          | 1–10 or blank                      | Self-reported session RPE right after the session. Blank if not captured.                                                                                                                                                     |
| `note`         | one short sentence                 | What made the session worth logging, what drill was swapped, what annoyed, what surprised. Include partner name if `playerMode: pair`. Include "outside-app planning" if any planning happened outside the app (Condition 2). |


## Sessions

Newest first. The first real row lands after the first founder session on the Tier 1a build. The template below is a paste-and-fill row.

**Row template (copy this, fill, paste at the top of the table below):**

```
| YYYY-MM-DD | solo/pair | pass/serve/set/mixed | 15 | Y/N/partial | 6 | one short sentence |
```


| date                                            | playerMode | focus | duration_min | completed | rpe | note                                                                                                                                                   |
| ----------------------------------------------- | ---------- | ----- | ------------ | --------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| *example row, delete when first real row lands* | solo       | pass  | 15           | Y         | 6   | Tier 1a smoke test. Beach Prep Three surfaced correctly; d28 four-component copy read clearly; main_skill rolled d1 Corner Pass. No Swap this session. |


## Week rollups

At the start of each Monday's adversarial-memo review, append a one-line roll-up here for the week just completed. This is a convenience view, not an authoritative one — the authoritative log is the Sessions table above.


| week start (Monday)                         | total sessions | solo n | pair n | pass n | serve n | set n | mixed n | outside-app planning events |
| ------------------------------------------- | -------------- | ------ | ------ | ------ | ------- | ----- | ------- | --------------------------- |
| *template row, delete on first real rollup* | 2026-04-20     | 0      | 0      | 0      | 0       | 0     | 0       | 0                           |


## Interpreting this ledger at the re-eval

When 2026-07-20 arrives (or an early trigger fires), this file is read with three specific queries in mind:

1. **Condition 1 (solo-first).** Count rows with `playerMode: solo` / total rows. ≥40%? Count rows with `focus: set`. ≥3? If either fails → Tier 2 re-sequences per the adversarial memo.
2. **Condition 2 (trust surfaces deferred).** Scan note fields for "outside-app planning" flags. Any occurrence → Tier 2 repoints per the adversarial memo.
3. **Condition 3 (partner return).** This one is *not* in this ledger — it's tracked in the partner walkthrough results file. But cross-reference: if any pair sessions in this ledger are noted as "partner opened the app first and invited me," that's a strong positive signal worth surfacing in the re-eval memo.

Additional context this ledger cannot answer directly but makes legible:

- **Cadence.** Sessions per week. <1/week across 3+ weeks hits trigger (b).
- **RPE distribution.** Clustering at 3–4 → sessions are too easy. Clustering at 8–10 → sessions are too hard or load is being pushed past adaptation. A reasonable mix for Train-to-Train phase work is 5–7 on most sessions, 7–8 on the occasional pressure day.
- **Completion rate.** `Y` share. <70% → sessions are being abandoned mid-flow, which is a Tier 1a P0.

## For agents

- **Authoritative for**: founder session behavioral data during the D130 window.
- **Edit when**: a founder session has just ended (append a new row at the top of the Sessions table). On Mondays during the adversarial-memo ritual (append a week rollup). Do not edit old rows except to correct factual typos inline.
- **Belongs elsewhere**: partner walkthrough findings (`docs/research/partner-walkthrough-results/`), adversarial memo itself (`docs/plans/2026-04-20-m001-adversarial-memo.md`), Tier 1a scope (`docs/plans/2026-04-20-m001-tier1-implementation.md`).
- **Outranked by**: nothing. This is a raw behavioral log; it is the source, not a derivation.
- **Key pattern**: an append-only dated log. Do not re-organize, re-bucket, or add columns without discussion; the whole point is that it stays cheap to append.

