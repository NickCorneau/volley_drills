---
id: m001-validation-overhang
title: M001 Validation Overhang
status: active
stage: build-complete-validating
type: status
summary: "Single-page scoreboard of M001 validation gates: D130 falsification conditions, D130 early re-eval triggers, D134 Phase 2A streak gate, and the calendar-dated reads (2026-05-12 / 2026-05-21 / 2026-07-20). Build phase complete; this doc tracks what closes M001."
authority: read-only scoreboard for M001 validation gates; cites authoritative sources, does not restate them
last_updated: 2026-05-10
depends_on:
  - docs/decisions.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/research/founder-use-ledger.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/status/current-state.md
decision_refs:
  - D91
  - D130
  - D134
  - D135
  - D141
---

# M001 Validation Overhang

## Agent Quick Scan

- M001 build phase is **complete** (2026-05-08, see `docs/status/current-state.md` Recent Shipped History). Validation phase is **active** through the 2026-07-20 `D130` re-eval (or earlier if an early-re-eval trigger fires).
- This doc enumerates what's left to close M001. It is a **read-only scoreboard** — it cites the source-of-truth doc and decision ID for every gate; it does not restate definitions, falsification criteria, or trigger conditions.
- Read this doc to answer: "what am I waiting on for M001, and when do I check next?"
- Read this doc **before** suggesting M001 work; the answer is almost always "wait for evidence on a gate already listed here, not new code."
- Periodic read-out cadence is owned by the weekly Monday adversarial-memo review (`docs/plans/2026-04-20-m001-adversarial-memo.md` Weekly trigger-review ritual). This scoreboard is the **what**; the memo is the **when**.
- **Monday ritual is mandatory and discoverable here** (added 2026-05-10 after weeks 2 and 3 were silently missed; see `docs/plans/2026-04-20-m001-adversarial-memo.md` `## 2026-05-11 (week 4 of 13)` entry's "Missed weeks" sub-section). Three consecutive missed Mondays trigger an early `D130` re-eval at the next weekly slot per memo line 154. Run `bash scripts/dream.sh` first, then append the weekly-log entry to the memo. See Calendar-Dated Reads table below for the recurring weekly slot and the A3 ligament check.

## Purpose

Make every M001 validation gate scannable in under 30 seconds without opening the adversarial memo, decisions doc, or founder-use ledger. The build phase has shipped; this doc carries the remaining overhang in one place so future-self and future-agents can orient instantly.

## Use This File When

- checking whether a proposed M001 task is actually open work or already gated on evidence
- planning the weekly Monday adversarial-memo review
- preparing for a calendar-dated read-out (2026-05-12, 2026-05-21, 2026-07-20)
- deciding whether an `M001` reference in another doc is still meaningful or has been superseded by a closed gate

## Not For

- defining or revising D130, D134, or any falsification criterion (those live in `docs/decisions.md` and `docs/plans/2026-04-20-m001-adversarial-memo.md`)
- recording read-out outcomes (those land in `docs/research/founder-use-ledger.md`, the adversarial memo's Weekly Log + Amendment Log, and `docs/status/current-state.md` Recent Shipped History)
- listing trigger-gated content adds (those live in `docs/status/post-m001-content-backlog.md`)
- M002 scope (`docs/milestones/m002-weekly-confidence-loop.md`)

## Update When

- a calendar gate fires and is read out (move the entry to a "closed" subsection or remove it once the M001 milestone closes)
- a `D130` early-re-eval trigger fires (note the firing date and link to the entry it triggered)
- the milestone itself closes (mark the doc `status: superseded` and point to `docs/status/current-state.md`)

## Phase Posture

**Build:** complete as of 2026-05-08 — all BAB-derived agent-actionable items have shipped (`A1` source-backed reroute registry refactor `fb631dd`; `D141` resolves `O24`; `D142`/`D143`/`D144` resolve T9/T6/slot-4). All Tier 1a, Tier 1b Layer A, and Tier 1c work is in production. See `docs/milestones/m001-solo-session-loop.md` "Current remaining M001 routing" and `docs/status/current-state.md` Recent Shipped History.

**Validation:** active through 2026-07-20 (`D130`). The five sections below enumerate the gates.

**Polish (Tier 2):** deferred. Tier 2 surfaces — "See why this session was chosen" modal, richer summary copy, full session history screen, recommendation-first onboarding polish — start only if the 2026-05-21 `D130` Condition 3 read-out passes. If it fails, Tier 2 repoints per the adversarial memo's Condition 3 consequence (see `docs/plans/2026-04-20-m001-adversarial-memo.md`).

## Calendar-Dated Reads

| Date | Gate | Source | Reads from |
| --- | --- | --- | --- |
| Every Monday | Adversarial-memo Weekly trigger-review ritual + dream pass | `docs/plans/2026-04-20-m001-adversarial-memo.md` lines 126-164 (Weekly trigger-review ritual + recognized behavioral-evidence channels) + `scripts/dream.sh` (alarm-clock script) | Founder-use ledger Sessions table + recent commits + A3 ligament status. **Three consecutive missed Mondays = early `D130` re-eval at the next weekly slot** (memo line 154). Last entry: see most recent `## YYYY-MM-DD (week N of 13)` block in memo. Step 1: `bash scripts/dream.sh`. Step 2: hand-execute DDL. Step 3: append weekly-log entry. Step 4: delete dream prompt file. |
| Every >50-line plan or research edit (continuous) | A3 ligament — founder memo re-read within preceding 7 days | `docs/plans/2026-04-20-m001-adversarial-memo.md` lines 214-222 (`A3 — Beach Prep Three for the founder`) | Most recent `A3 re-read YYYY-MM-DD — <n> min` line in the memo's Weekly Log. Agents authoring on the founder's behalf must surface the check before proposing a new plan/research file. **Currently overdue** as of 2026-05-10 (no logged read-through; chronic gap named in 2026-04-24 addendum and 2026-05-11 week-4 entry). |
| 2026-05-12 | `D134` Phase 2A optional-streak falsification gate read-out | `docs/research/founder-use-ledger.md` "Bounded D130 exceptions and falsification gates" section | Founder/partner sessions where a `streak` drill ran (`d38-pair`, `d01-pair`, `d41-pair` at `main_skill` / `pressure`); ledger rows mentioning `streak`, `metricCapture`, `d38-pair`, or "longest" in the note field |
| 2026-05-21 | `D130` Condition 3 final read-out (partner unprompted-open within 30 days of Tier 1a walkthrough) | `docs/plans/2026-04-20-m001-adversarial-memo.md` Condition 3 + the 2026-04-22 Amendment Log entry | Partner (Seb) device-export evidence; current state is **provisional pass, strengthened** per the 2026-04-22 / 2026-04-23 polish-pass landings (see `docs/milestones/m001-solo-session-loop.md` Agent Quick Scan) |
| 2026-07-20 | `D130` founder-use mode scheduled re-evaluation | `docs/decisions.md` `D130` + `docs/plans/2026-04-20-m001-adversarial-memo.md` Decision Rule | Founder-use ledger row count + channel-mix evidence (chat / voice memo / partner walkthrough / Dexie exports) per the five-channel list in the adversarial memo |

**Decision rule at 2026-07-20** (per `docs/plans/2026-04-20-m001-adversarial-memo.md` and `docs/milestones/m001-solo-session-loop.md` lines ~286): when all three Falsification Conditions pass and Tier 1a + Tier 2 have shipped, the default move is **option (a) friends-of-friends cohort** — one expansion stage before full `D91` stranger-launch. Continuing founder-only is **not** a default-available outcome; it requires a written falsifiable justification co-signed by a named non-founder reader, pasted into the adversarial memo's Amendment Log. Resuming `D91` preparation is always available as an opt-in alternative.

## D130 Falsification Conditions

Read at the 2026-07-20 re-eval (or earlier if an early-re-eval trigger fires). Authoritative definitions in `docs/plans/2026-04-20-m001-adversarial-memo.md` Falsification Conditions section.

- **Condition 1 — solo / set focus usage.** ≥40% solo-share + ≥3 set-focused sessions across the founder-use window. Evidence channel: founder-use ledger rows (`docs/research/founder-use-ledger.md`) + the four other channels per `D135` (chat / voice memo / partner walkthrough / Dexie export). Current state: evidence-pending, no fabricated read.
- **Condition 2 — zero outside-app planning.** Founder did not plan sessions outside the app during the window. Evidence channel: founder self-report, weekly Monday review attestation. Current state: evidence-pending, no fabricated read.
- **Condition 3 — partner unprompted-open within 30 days of Tier 1a walkthrough.** Evidence channel: partner Dexie export + partner unprompted-open observation. Current state: **provisional pass, strengthened** per the 2026-04-22 (T+1-day message-only) and 2026-04-23 (T+2-day Dexie-instrumented) observations. Final read-out 2026-05-21.

## D130 Early Re-eval Triggers

Authoritative definitions in `docs/plans/2026-04-20-m001-adversarial-memo.md` Early re-evaluation triggers section. Any one trigger firing accelerates the 2026-07-20 re-eval.

- **(a) Low cadence** — fewer than 5 logged sessions across any 45-day rolling window during the founder-use window.
- **(b) Long silence** — ≥3 consecutive weeks with no founder app open.
- **(c) Scope leak** — the founder invites an external user (non-founder, non-Seb) to use the app before the 2026-07-20 re-eval.
- **(d) UP trigger** — Tier 1a shipped + ≥10 founder sessions logged + no open partner-walkthrough P0 findings (added 2026-04-25, see adversarial memo).
- **(e) Agent-asymmetry** — repo / agent conversation is being used as a substitute for the app itself (researched-velocity-as-substitute, per `docs/roadmap.md` Risks-and-mitigations).

Current state (2026-05-10 week-4 read): no early triggers fired. (e) is closest to firing — agent-assisted opens are heavy in the last 14 days; agent-free check holds via 2026-05-04 pair session + 2026-05-09 founder content-gap report under the 2026-04-24 addendum's reframed posture. Read at every Monday review.

## D134 Phase 2A Streak Gate

Authoritative definition in `docs/research/founder-use-ledger.md` "Bounded D130 exceptions and falsification gates" section + `docs/decisions.md` `D134`.

`D134` (2026-04-28) authorized the `streak`-shape per-drill capture drawer on `/run/check` without waiting for the standard ≥2-founder-ledger trigger. The bounded exception falsifies on either of two conditions, both read by 2026-05-12:

- **Negative-evidence gate.** ≥2 founder/partner sessions where (a) a `streak` drill ran, (b) the user did not enter a `longest` value, and (c) post-session the user reports the streak felt important enough to log but the surface was missed → Phase 2B paused.
- **Contamination gate.** ≥2 founder/partner sessions where the user *did* enter a streak and later reported the value as "guessed / inflated / pattern-matched on the previous session" → Phase 2B paused.

Either gate triggers a freeze on `points-to-target` / `pass-grade-avg` / `composite` shape work until the standard founder-trigger conditions are met cleanly.

Current state: evidence-pending, no fabricated read. 2026-05-12 read-out is the firing date.

## What Closes M001

M001 closes cleanly when **either**:

1. The 2026-07-20 `D130` re-eval reads all three Falsification Conditions as passing, Tier 1a + Tier 2 have shipped, and the friends-of-friends cohort move (or `D91` resumption) is initiated. The milestone doc and this scoreboard flip to `status: superseded` pointing at the next-active milestone.
2. An early-re-eval trigger fires before 2026-07-20, the founder + adversarial memo run the early read, and the same conditional closure logic applies.

If the 2026-07-20 read **fails**, M001 reopens for Tier 2 repoint per the adversarial memo's Condition 3 / Condition 1 consequences. The milestone does **not** silently roll forward into M002 in that case.

## Sources & References

- `docs/decisions.md` — `D91`, `D130`, `D134`, `D135`, `D141`
- `docs/plans/2026-04-20-m001-adversarial-memo.md` — falsification conditions, early re-eval triggers, weekly review ritual, decision rule
- `docs/research/founder-use-ledger.md` — D130 evidence channel; D134 falsification gate inline definition
- `docs/milestones/m001-solo-session-loop.md` — milestone scope, Tier breakdown, decision-rule prose at lines ~286
- `docs/status/current-state.md` — live posture, Recent Shipped History
- `docs/status/post-m001-content-backlog.md` — trigger-gated content adds (separate from validation gates)
