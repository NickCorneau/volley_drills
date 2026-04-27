## id: founder-use-ledger
title: "Founder-Use Ledger (Dated append-only log during D130 window)"
type: research
status: active
stage: validation
authority: "Append-only dated log of founder sessions during the D130 founder-use window (2026-04-20 → 2026-07-20). Captures the behavioral signal that the founder-use mode assumes exists, in a form that is legible at the 2026-07-20 re-eval without depending on any in-app surface."
summary: "One line per founder session: date, playerMode, focus, duration, completed Y/N, RPE, one-sentence note. Designed to be appended in under 30 seconds right after a session. Read at every weekly adversarial-memo review and at the 2026-07-20 D130 re-eval."
last_updated: 2026-04-27
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

**This ledger is one behavioral-evidence channel, not the only one.** It captures founder personal-use sessions that the founder actually sits down to log; it does not capture partner (Seb) usage, partner-walkthrough observations, Condition 3 unprompted-open signals, or founder chat/voice-memo feedback delivered to the repo via the agent. Per the 2026-04-22-c founder correction recorded in `docs/research/2026-04-22-research-sweep-meta-synthesis.md` and expanded in the 2026-04-24 addendum, personal-ledger logging should not be treated as a prerequisite for canon work, research synthesis, or Tier 1b / Tier 2 progression — Seb's ongoing usage, the partner-walkthrough reconciliation (including joint founder+partner sessions), the Condition 3 tracker, and chat/voice-memo feedback that drives canon edits are all first-class evidence alongside rows in this file.

**The ledger-behavior gap is real.** As of 2026-04-24 the founder has run ≥1 solo + ≥1 pair session on 2026-04-21 (joint-session reframe in `docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md`), and delivered substantial feedback to the repo via chat and voice memo across 2026-04-22 / -23 / -24 — none of which lands here as ledger rows. The sessions actually happened; the ledger being empty reflects the 30-second logging discipline having not yet been adopted, not the absence of behavior. The 2026-04-22-c correction anticipated this; the 2026-04-24 expansion in `docs/plans/2026-04-20-m001-adversarial-memo.md` Weekly Log + channel-mix list names it explicitly so the 2026-07-20 re-eval reads the full channel mix rather than treating the ledger's row count as an isolated gate.

**Research-velocity substitution** is still a real failure mode (see `docs/roadmap.md` Risks-and-mitigations), but it is the research-vs-**any-behavioral-evidence** ratio that matters, not the research-vs-founder-ledger ratio specifically. The weekly Monday adversarial-memo review reads ledger count alongside Seb's open cadence, partner-walkthrough output, joint-session activity, and chat/voice-memo feedback density — per the five-channel list in the adversarial memo's Weekly trigger-review ritual section — rather than reading ledger count alone.

**Backfill posture.** This ledger's "never backfilled from memory more than 24h later" rule is about memory reliability, not about refusing to record evidence that exists in artifacts. If a past session is reconstructable from a voice memo, a Dexie export, a chat transcript, or the partner-walkthrough ledger's joint-session-reframe, the founder may add a row with a `provenance:` note in the note field (e.g., `reconstructed from 2026-04-21 voice memo + Seb device export + 2026-04-24 chat`) and the row counts. The 24h rule stays binding on pure memory; artifact-reconstructed rows are explicitly OK.

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


| date       | playerMode | focus | duration_min | completed | rpe | note                                                                                                                                                                                                                                                                                                     |
| ---------- | ---------- | ----- | ------------ | --------- | --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-26 | pair       | pass  | 25           | Y         |     | Pair pass session with Seb. Drills run: `d11 One-Arm Passing Drill`, `d03 Continuous Passing`, `d10 The 6-Legged Monster`. Founder note: "the progression is nice and time just flew." **Two content findings**: (1) **Tier 1b P2-3 trigger fired** — Good/Total post-session capture felt fake; founder reported it as "too hard to track and fill out post workout" on a `pass-rate-good` session, satisfying the explicit single-session unlock condition recorded in `2026-04-22-all-passes-reconciled.md` §"Tier 1b — gated by founder-session trigger" (`In-session running rep counter` and `Full drill-metadata-driven capture UI` items). Pathway captured in `docs/research/2026-04-26-pair-rep-capture-options.md` and `docs/plans/2026-04-26-pair-rep-capture-tier1b.md`. (2) **Cooldown stretch wording unclear to partner** — `d26 Lower-body Stretch Micro-sequence` `courtsideInstructions` use clinical jargon (`hip flexor`, `half-kneel`, `tuck pelvis`) that the founder could parse from prior knowledge but the partner could not; rewrite scoped under the existing `2026-04-26-pre-d91-editorial-polish.md` editorial bundle. RPE not captured live; no founder backfill from memory. Provenance: 2026-04-26 founder chat report. |
| 2026-04-21 | pair       | pass  | 15           | Y         | 4   | Pass 2 on grass, joint with Seb (Seb device-export shows 25 min; founder's 15 is the perceived training time, not Seb's planned timer). Focus was not user-selected — the current UI does not expose focus-picking; builder defaulted to pass on `pair_open`. Content gaps surfaced — see bullet list below. Provenance: 2026-04-21 voice memo + Seb Dexie export `volley-drills-export-2026-04-21.json` + 2026-04-24 chat. |
| 2026-04-21 | solo       | pass  | 15           | Y         | 3   | Joint walkthrough alongside Seb Pass 1, founder's own device. Focus was not user-selected — the current UI does not expose focus-picking; builder defaulted to pass on `solo_open`. Content gaps surfaced — see bullet list below. Provenance: 2026-04-21 voice memo + 2026-04-24 chat.                                                                            |

### Content gaps surfaced on the 2026-04-21 sessions (captured 2026-04-24)

Named explicitly so the Tier 1b trigger's "specific content gap" half reads legibly without forcing the single-cell `note` field to carry multi-point content:

1. **Can't pick focus in the UI** — "we dont get to pick focuses as far as i can tell." The founder wanted to steer toward serving (see gap 3) and could not find a surface that lets them. This is the **first behavioral signal against the Tier 1c trigger** in `docs/plans/2026-04-20-m001-tier1-implementation.md` lines 291–295 (Swap-Focus button on the draft screen; `sessionFocus: 'pass' | 'serve' | 'set'` context field with override through `pickForSlot` / `findSwapAlternatives`). One session is not yet the ≥8-session-note-indicating-intent-mismatch threshold the Tier 1c architecture prerequisite targets, but it is a first concrete data point that the focus-routing gap is user-felt, not only partner-walkthrough-inferred.
2. **Serving drills are not reachable via Swap on `solo_open`** — "not being able to do serving drills etc yet or at least couldnt find it by swapping." This **directly corroborates Seb P1-3** (`docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md`), which was dispositioned *"Accept (script-side) · Wontfix (app-side)"* with the justification that the 13-swap frustration was script-induced. The founder's independent experience says the gap is app-felt, not just script-artifact, and the Wontfix-app-side disposition was premature. This is the **partner-walkthrough ≥P1 OR founder-logged content-gap** half of the Tier 1b trigger — combined with gap 3's session-variety signal, the trigger is now formally met. The existing Tier 1b candidate pool in `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` has `d31 Self Toss Target Practice` (solo serving) as the first-ladder unlock specifically for this — Tier 1b sequencing should put serving content ahead of setting content.
3. **Session variety is already a concern on day 1 of Tier 1a use** — "session variety already being a bit of a concern." This reinforces gap 2 and is the general-form signal the Tier 1b content-expansion plan exists to address. Combined with gap 2's serving-specific ask, the strongest Tier 1b read is *"ship the serving ladder first, setting second."*
4. **Timer-end anxiety / screen-off worry** — "it was around the timer at the end of the sessions; not being sure if the screen is still on and being worried that it turned off since we dont hear the timer." This is a **new P1-class finding not currently tracked** on either the Tier 1b or Tier 1c candidate lists. It is adjacent to the already-landed 2026-04-22 polish-pass item 5 (preroll "keep phone unlocked" hint, now gated first-time-only so dismissed users no longer see it) and to the still-open reconciled Tier 1b item #8 (visual block-end countdown cue — thicker progress bar + "0:47 left" chip) but solves a different concern: if the screen *turns off*, iOS Safari PWA suspends audio and the block-end beep will not fire reliably. The structural mitigation is a **Screen Wake Lock** request on session start (supported on iOS Safari 16.4+), now requested from the Safety Continue tap where possible; it can prevent automatic dim/lock when the browser honors it, but it cannot make an iPhone PWA keep running audibly after the user manually locks the device. The visual block-end countdown only complements it. Flagged for capture in `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Genuinely-open Tier 1b bundle (reconciled)" as a new item.

Implication for Tier 1b authoring: the founder-session half of the Tier 1b trigger (`docs/plans/2026-04-20-m001-tier1-implementation.md` lines 272–276) is formally met as of 2026-04-24. The serving-first sequencing is supported by founder-session evidence (gaps 2 + 3). Tier 1b content authoring may begin per the scope in `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md`. **§R7 exit-3 decision discharged 2026-04-26:** founder chose exit-3 — `d36 Jump Float Introduction` is removed from Tier 1b entirely and re-enters under `O7` track 2 (sports-medicine / PT review). **2026-04-27 source red-team correction:** `d43 Triangle Setting` is also deferred to `D101` 3+ player support because the BAB source geometry is 3-player. Current Layer A ships 4 drills (`d31`, `d33`, `d40`, `d42`); cap consumption is 4/10, not 6/10. The freed slots stay open and are not auto-backfilled. No founder-cadence threshold or evidence-channel weighting is changed by this decision — only the Tier 1b drill-count arithmetic.

### Operating notes (courtside / device audio)

- **iOS hardware silent mode (mute switch).** The physical ring/silent switch can suppress audible Web Audio beeps and ticks in Safari/PWA—including block-end cues—even when the app, Screen Wake Lock, and first-interaction audio priming are working as intended. That behavior respects user hardware intent; it is not an app bug. The founder confirmed this as the root cause after debugging "no beeps on phone" (see reconciled Tier 1b item #17 and the wake-lock / audio-context work tied to content-gap item 4 above).
- **Manual lock remains a hard platform boundary.** Pressing the iPhone lock button still suspends the PWA timer/audio loop. The timer catches up from elapsed wall-clock time on unlock, so a block-end BEEP can fire immediately after reopening; that does not mean the app ran audibly behind the lock screen. The 2026-04-24 follow-up binds Screen Wake Lock to the Safety Continue tap and adds a Run warning when no wake lock is active, but the reliable courtside posture remains screen-up, awake, and visible.


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

