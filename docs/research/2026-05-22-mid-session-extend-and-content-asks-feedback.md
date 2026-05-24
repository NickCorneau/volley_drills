---
id: 2026-05-22-mid-session-extend-and-content-asks-feedback
title: "Mid-Session Extend + Content Asks Feedback (founder + Seb, 2026-05-22 capture)"
status: active
stage: validation
type: research
authority: "Curated founder + partner chat / voice-memo capture delivered 2026-05-22 covering the most substantive friction (Seb's 2026-05-16 mid-session extend ask) plus four content / configuration asks (attack drill section, custom session time, 3+ player content, team play / tactics / blocking / positioning). Classifies each item per D135 source-validity rules and routes to existing canonical paths (D101 / D144 / Tier 3+ post-M001 / D135 feature-wish backlog) without authorizing implementation by itself."
summary: "Founder chat dump on 2026-05-22 covering a few more pair training sessions plus Seb's 2026-05-16 (Saturday) mid-session voice memo. One structurally novel item — Seb's mid-session 'extend the current session with a different focus instead of recreating a whole new one' ask — has not been captured in any existing trigger and is the load-bearing signal. Four other items (attack drills, custom session time, 3+ player content, team play / tactics / blocking / positioning) are second-hit signals on existing canonical paths (Tier 3+ post-M001, D135 feature-wish, D101, D144) and route as cross-session reflection input rather than fresh trigger fires."
last_updated: 2026-05-23
depends_on:
  - docs/research/founder-use-ledger.md
  - docs/decisions.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/status/post-m001-content-backlog.md
  - docs/research/2026-05-10-pair-net-serving-duration-feedback.md
  - docs/research/2026-05-04-pair-serving-session-feedback.md
related:
  - docs/research/practice-plan-authoring-synthesis.md
  - docs/research/bab-source-material.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
decision_refs:
  - D101
  - D124
  - D130
  - D135
  - D141
  - D144
---

# Mid-Session Extend + Content Asks Feedback

## Agent Quick Scan

- Capture date: 2026-05-22 (founder chat dump). Covers the Seb 2026-05-16 (Saturday) mid-session voice memo plus four content / configuration asks tied to "we've used it a few more times" since the 2026-05-10 export.
- One load-bearing new finding: **Seb's mid-session extend ask** (F1) — a structurally novel surface not currently captured in any trigger or backlog item. Real session, real build, named friction → first-class content-gap-evidence per `D135` clause 1.
- Four routing-only items (F2–F5) map to existing canonical paths and do not fire fresh triggers by themselves:
  - **F2 attack drill section** → Tier 3+ post-M001 attack chain (see `app/src/data/archetypes.ts` invariant 2 + BAB Plans 7-11 captured in `docs/research/bab-source-material.md`); content-gap-leaning under `D135`.
  - **F3 custom session time** → second hit on the 2026-05-09 feature-wish (90 min); still `D135` feature-wish class.
  - **F4 3+ player content (3s training)** → second hit on the 2026-05-09 3+ player content-gap reflection; reinforces post-M001 sequencing question (`D101` content track earlier vs `M002` first) without firing `D101` early.
  - **F5 team play / tactics / blocking / positioning** → BAB Game Play cluster (Plans 12-20) captured; `D144` settles `pair_game` archetype variant decision; remains Tier 3+ post-M001.
- This note does NOT authorize a new `feat:` plan, schema work, content authoring, or `D101` early activation. It captures the evidence and routes it.

## Source

Founder chat dump on 2026-05-22 in agent session. Five named items, in the order delivered:

1. **Attack drill section.** "would be nice to have an attack drill section."
2. **Custom time.** "would be nice ot be able to set a custom time."
3. **Seb's mid-session feedback from 2026-05-16 (Saturday).** Voice-memo transcription: "Mid-session feedback note after the latest update, it was May 16th and Saturday. … if we choose that we want to, like, add another type of practice session, instead of, like, going through the cool down, add a new session, and then keeping the warm up and everything. Maybe after the last drill of a session, it could say, like, do you want to extend or add a different type of practice to your current session? And then it can just pack on those other drills at the end of that session, instead of, like, recreating a whole new one, and skipping parts of that session. Just because, like, at the end of the current block, it asked me, like, why did I shorten the session? What, you know, what would be with my feedback about it? And I just had to write, like, because we wanted to practice serving now. So, just, could be something to add."
4. **3s training.** "would be quite useful to have 3s since we dont know how to trian 3s."
5. **Team play / tactics / blocking / positioning.** "a section on team play /.tactics etc would also be useful since we dunno how to best train that, and maybe blocking practice inthere too? and positioning? idk so far its good these are just areasa we are struggling with and facing on the court you know."

Cadence framing: "weve used it a few more times (data with seb and in voice memos)" — qualitative co-use claim consistent with the 2026-05-10 ledger addendum (`docs/research/founder-use-ledger.md` §"Cross-session reflections (captured 2026-05-10)" item 1) of ≥2 pair sessions per week with Seb. The ledger does not log routine pair sessions as individual rows under the 30-second / 24h memory discipline; this note is the artifact-reconstructed capture for the substantive feedback that emerged during those sessions.

## Findings

### F1 — Mid-session extend with different focus is a real workflow friction (Seb, 2026-05-16)

**Classification under `D135`.** First-class content-gap-evidence per clause 1 (real session, real build, real observation, source-validity gated). Seb describes a concrete in-session moment: at the end of the current session block, the app asked why the session was shortened; Seb wrote "because we wanted to practice serving now." The shortening was the courtside workaround for the missing surface.

**The friction.** When a pair wants to switch focus (e.g., from passing to serving) mid-session, the only available path is to end the current session and start a new one. Starting a new session re-runs warmup + setup chrome and re-ends with cool-down. The user perceives this as redundant — the warm-up is already paid for, the cool-down has not been earned yet, and the new focus's drills are what they actually wanted to add.

**Seb's proposed surface.** "After the last drill of a session, it could say, like, do you want to extend or add a different type of practice to your current session? And then it can just pack on those other drills at the end of that session, instead of, like, recreating a whole new one, and skipping parts of that session."

Mechanically, this maps to: after the final main_skill / pressure drill (or before the wrap), offer an "Extend with a different focus" CTA that appends a focus-specific main_skill / pressure block (and optionally a short technique primer) to the current session plan, deferring the wrap until the extended block completes. The user keeps one warmup and one wrap per outing.

**Why this is structurally novel.** None of the currently-reserved Tier 1b slots, post-M001 backlog items, or open decisions describe this surface:

- Not `t1b-pair-opening-block` (long warmup for pair) — that's a warmup variant, not a mid-session extension.
- Not `t1b-rep-counter`, `t1b-stretch-demo`, `t1b-pair-role-swap-cue` — different surfaces.
- Not Tier 1c focus toggle (shipped 2026-04-28) — Tier 1c added focus selection at Setup; the extend ask is mid-session after Setup is done.
- Not the 2026-05-09 90-min custom-time wish — custom time pre-commits to a longer block at Setup; the extend ask is reactive ("at the end of what I already did, let me add a serving block").
- Not the `pair_game` archetype variant (`D144`) — that's a slot-4-skipped tournament-prep layout, not a mid-session focus-switch surface.

It is also structurally distinct from the `M001` single-skill-chain generation constraint (`D141`): a session can keep its single-chain main_skill block today, and the extension would be a *new* single-chain block in a different focus appended at the end. The constraint is unchanged per-block; the session as a whole gains a second focused block.

**Adjacent canon — relevant invariants for any future plan.**

- `app/src/data/archetypes.ts` §"Wrap slot preference (D105)": the wrap is framed as transition and comfort, *not* recovery or injury prevention. A delayed wrap (after the extended block) is therefore consistent with the wrap's stated purpose; this surface does not violate the wrap's authoring contract.
- `app/src/data/archetypes.ts` §"M001 single-skill-chain generation constraint (D141)": preserved if each appended block remains single-chain.
- `docs/decisions.md` `D141`: "M001 keeps a single-skill-chain generation constraint; product focus is not permanently skill-isolation-only." Multi-focus *sessions* (built as concatenated single-focus blocks) are not forbidden by the constraint; the constraint is per-generator-pass.

**Trigger-fire reading.** One session, one finding. **Does NOT formally fire a `D135` clause-2 partner-walkthrough ≥P1 OR a clause-1 founder-evidence trigger sized to ship now** — this is single-source first-time evidence. The right next move is to surface this for the 2026-07-20 `D130` re-eval reading and watch for a second independent hit (founder ledger row, second partner session) before any plan authoring.

**If a second hit lands**, the natural home is either (a) a Tier 1c-class layered surface unlock (focus selection is already shipped; extend is a one-line CTA + a "append focus block" code path), OR (b) a fresh decision packet that authorizes the surface explicitly. Either way, this is post-`D130` re-eval territory under current process; do not author a plan now.

### F2 — Attack drill section ask (founder, 2026-05-22)

**Classification under `D135`.** Content-gap-leaning. Founder is using the app and recognizes a missing skill chain ("would be nice to have an attack drill section"). Distinguishing this from feature-wish: no specific session friction is named, but the founder is mid-cadence-use; the phrasing reads as "tried to find / wanted to do, didn't see it" more than "I think we should add X."

**Existing canon (no authoring authorized).**

- `app/src/data/archetypes.ts` invariant 2: "All of the drills under the Serving header can be easily converted into attack drills" — captured serve drills are pre-shaped for attack-chain re-use via feed-type swap (live-serve → coach-toss / self-toss into the same zone grid).
- BAB Practice Plans 7-11 (`docs/research/bab-source-material.md`) are the captured attacking cluster at source-detail level. Tier 3+/post-M001 candidate per multiple shipped-history entries.
- `D143` settled the T6 attack-zone-convention default (FIVB 5-zone for chain-wide numbered-zone attack drills; BAB Plan 7 accuracy-boxes for per-shot drills). Schema groundwork is settled; content authoring is not.

**Trigger-fire reading.** This is **second-class signal** for an attack-chain content drop, not a trigger by itself. The attack chain is Tier 3+ / post-M001 and remains so. Founder content-gap reports tied to real use accumulate against the 2026-07-20 `D130` re-eval and the post-M001 sequencing question.

### F3 — Custom session time ask (founder, 2026-05-22)

**Classification under `D135`.** **Feature-wish.** "Would be nice to be able to set a custom time" is the same shape as the 2026-05-09 reflection item 2 ("90 min for longer sessions") — wishful, not tied to a named friction in this dump.

**Second hit on the same wish.** The 2026-05-09 reflection captured the 90-min wish; this dump repeats it without naming a specific duration. Per `D135` feature-wishes are input to founder reasoning, not trigger evidence. Two hits on the same wish strengthens the signal at re-eval but does not flip its classification.

**Caveat — possible adjacency to F1.** Seb's 2026-05-16 mid-session friction (F1) emerged because the pair wanted *more* training than the chosen profile allotted. The mechanism Seb proposed — "extend the current session" — is a different solution than custom time at Setup. F3 still routes as feature-wish; F1 is the more concrete signal. If both surfaces ship eventually, they answer the same underlying need at different lifecycle points (pre-commit vs reactive).

**Pre-registered constraint.** The 2026-04-30 `docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md` R4 + Out-of-scope, the `docs/reviews/2026-04-30-focus-coverage-readiness-audit.md`, and the `docs/archive/plans/2026-05-01-001-feat-generated-plan-diagnostics-plan.md` all explicitly defer custom durations as future work after the fixed 15/25/40 profile readiness is trustworthy. The 2026-05-10 export's "too many minutes for drills" finding (`docs/research/2026-05-10-pair-net-serving-duration-feedback.md` F4) argues that the 40-minute profile is *not yet* trustworthy at pair-net duration budgets; custom time is therefore not unblocked.

### F4 — 3+ player content (3s training) (founder, 2026-05-22)

**Classification under `D135`.** First-class content-gap-evidence per clause 1, second hit. The 2026-05-09 ledger reflection item 1 already captured "a 3-person team and a 4-person team" as named friction with "this app is basically useless in those cases." Today's 2026-05-22 hit ("would be quite useful to have 3s since we dont know how to train 3s") reinforces the same gap from a different angle: the founder names not just inapplicability but *content-quality uncertainty* ("we dont know how to train 3s"), arguing that even a 3+ player content track would itself need to teach the founder what 3+ training should look like.

**Existing canon (no early activation authorized).**

- `D101` (3+ player session assembly and drill selection) is a tracked future requirement, not M001/v0b scope.
- `D124` sequences `M002` Weekly Confidence Loop before `D101` 3+ player work.
- `docs/status/post-m001-content-backlog.md` already routes `d43 Triangle Setting` as waiting on `D101`.
- `docs/milestones/m001-solo-session-loop.md` §"Post-M001 sequencing inputs" already records the 2026-05-09 founder content-gap signal as input to the 2026-07-20 re-eval sequencing question.

**Trigger-fire reading.** Does NOT fire `D101` early. Per the 2026-05-09 entry: "`D101` is sequenced post-M001 / `M002` per `D124`, not gated on a founder-evidence trigger." Today's second hit adds weight to the same scale; the founder's "we dont know how to train 3s" framing is a content-quality concern that compounds the structural inapplicability concern. **Sequencing implication recorded**, not implementation authorization.

### F5 — Team play / tactics / blocking / positioning (founder, 2026-05-22)

**Classification under `D135`.** Content-gap-leaning. Direct quote: "these are just areas we are struggling with and facing on the court." Named friction is "struggling with on the court" — a real-use signal — but the content scope is broad (tactics, blocking, positioning) rather than a single surface.

**Existing canon (no authoring authorized).**

- BAB Practice Plans 12-16 (defensive cluster, including blocking-related read drills like Plan 14 Shuffle to HL/CS Dig and Plan 16 Threat or No Threat) and Plans 17-20 (Game Play cluster) are captured at source-detail level in `docs/research/bab-source-material.md`. The captured set is structurally complete (~140 drill slots across 20 plans).
- `D144` (2026-05-08) settled the architectural shape: a new `pair_game` archetype variant with a slot-4-skipped layout, peer of `pair_net` and `pair_open`. Implementation gated behind partner-walkthrough ≥P1 / founder-ledger tournament-prep / `D101` triggers.
- Positioning specifically maps to read drills (BAB three-axis taxonomy from Plan 14 — `readerRole` × `deceiverRole` × `cueSource`) and to Game Play slot ordering. Read-drill schema is gated on the 2026-05-04 BAB ideation Bucket C5 `compatibleFocuses` axis discussion, not authored.
- Blocking specifically maps to BAB Plan 16 (Threat or No Threat) and Plan 11 (Beat the Blocker). Solo blocking practice is structurally awkward without a wall + net; pair blocking is a viable surface but most BAB blocking drills are 3+ player.

**Trigger-fire reading.** Does NOT fire `D144` implementation early — the architectural shape is settled, the trigger gates (partner-walkthrough ≥P1 / founder-ledger tournament-prep / `D101`) remain. Today's signal is *one* hit on a tournament-prep / game-play asking, which is **first-class** founder content-gap-evidence input to that trigger but not yet two-hit threshold. **Records as one signal toward `D144` activation triggers.**

## Non-Findings

- This capture does **not** prove any specific number of pair sessions occurred between 2026-05-10 and 2026-05-22. "We've used it a few more times" is cadence-consistent with the 2026-05-10 ledger addendum's 2×/week claim; the ledger schema's 30-second / 24h memory rule means individual undated sessions are NOT backfilled as dated rows. The 2026-05-16 Seb session is the only specifically-dated session and is captured below as a single ledger row under artifact-reconstructed provenance.
- This capture does **not** fire `D101` early. F4 is the second hit on the same gap; the gap remains routed to `D124` post-M001 / `M002` sequencing.
- This capture does **not** fire `D144` implementation. F5 is one of multiple required signals.
- This capture does **not** fire a fresh Tier 1b slot consumption. F1's "extend session" surface is not drill-record-shaped; it is a controller / route / UI surface. The Tier 1b cap (4/10 authored, 6 reserved) is unchanged.
- This capture does **not** authorize a 40-minute-profile change. The 2026-05-10 duration-budget finding remains the load-bearing pacing read.
- This capture does **not** demote any prior shipped surface. Tier 1c focus toggle, `D133` per-drill capture, `D134` Phase 2A streak capture, and the per-move pacing indicator V1–V4 are not disturbed.

## Routing

| Item | Class (per `D135`) | Canonical home | Action now |
|------|--------------------|----------------|------------|
| F1 mid-session extend | Content-gap, first-class (single source) | New — closest neighbors are Tier 1c shipped 2026-04-28 + `D141` per-block constraint | Surface to 2026-07-20 re-eval reading; watch for second hit before any plan authoring |
| F2 attack drill section | Content-gap-leaning, second-class signal | Tier 3+ post-M001 attack chain; BAB Plans 7-11 captured; `D143` zone convention settled | Cross-session reflection input to re-eval; no authoring |
| F3 custom session time | Feature-wish, second hit | `D135` feature-wish backlog; 2026-04-30 R4 out-of-scope; gated on fixed-profile readiness | No action beyond logging here |
| F4 3+ player (3s) content | Content-gap, second hit | `D101` post-M001 / `M002` sequencing per `D124`; `docs/status/post-m001-content-backlog.md` for `d43` | Adds to post-M001 sequencing scale, no early `D101` activation |
| F5 team play / tactics / blocking / positioning | Content-gap-leaning, first signal toward `D144` triggers | `D144` `pair_game` variant; BAB Plans 12-20 captured; `D101` for 3+ player needs | One of multiple required signals; record only |

**Founder-use ledger update.** A cross-session reflection block (captured 2026-05-22) is appended to `docs/research/founder-use-ledger.md` covering all five items plus a single dated row for the 2026-05-16 Seb mid-session session. Provenance: 2026-05-22 founder chat dump + Seb 2026-05-16 voice memo transcribed inside it. The cross-session reflection lives under the existing 2026-05-09 / 2026-05-10 pattern; no schema, scope, or sequencing change is authorized.

**Catalog update.** This doc is registered in `docs/catalog.json` under `docs[]` and `research_routing[]`.

## Addendum (captured 2026-05-23)

Same-day follow-up from the 2026-05-23 founder chat reply to the routing surface above, attached as an addendum rather than a new dated note because it lands in the same conversational thread. Three substantive signals.

a. **3+ player content-gap is now three-hit, with the third hit carrying observed displacement-of-use (sharpens F4).** Founder: "we have been using it 2x weekly still, although last week was just once because we did a 3s session on the second day and there is no 3s setup here." The cadence dropped from the 2026-05-10 addendum's 2×/week baseline to 1×/week for the week immediately following because the founder's second practice of the week was a 3s session that the app could not host. This is the **third hit** on 3+ player content-gap-evidence (2026-05-09 reflection item 1 + 2026-05-22 F4 above + today). The qualitatively new dimension is **observed behavioral displacement**: prior hits were stated friction ("basically useless in those cases") and stated content-gap ("we dont know how to train 3s"); today's hit is an actual session that *did not* run through the app because the content gap blocked it. **Trigger-fire reading:** does NOT fire `D101` early (`D101` is sequenced post-M001 / `M002` per `D124`, not gated on founder-evidence triggers) and does NOT fire `D130` trigger (a) low cadence (5+ sessions / 45-day window well-met). Three early-re-eval triggers are unaffected. But this is the **strongest founder-evidence to date on the post-M001 sequencing question** recorded in `docs/milestones/m001-solo-session-loop.md` §"Post-M001 sequencing inputs" — the question of whether `D101` 3+ player content should sequence earlier than `M002` Weekly Confidence Loop now has displacement-of-use as direct evidence at the 2026-07-20 re-eval, not just stated content-gap. Recorded as input, not as authorization to re-sequence now.

b. **Recent session "a few days ago" with data on Seb's device (export pending).** Founder self-report of a session in approximately the 2026-05-20 window (±2 days from 2026-05-23). Session data is on Seb's device and has not yet been exported to the founder. **No dated ledger row appended** because (i) the date is approximate, (ii) the duration / focus / RPE / drills are unknown until the export lands, and (iii) the ledger's 30-second / 24h memory discipline binds. The session is real and counts as cadence behavior; structural specifics wait for the export. If the export lands later, the row can be backfilled with `provenance: reconstructed from Seb device export YYYY-MM-DD` per the founder-use ledger's "Backfill posture" rule.

c. **`GlossedText` affordance landed and was positively received by the partner.** Founder: "the new underline words were a hit though. seb said its hard to see at first but once he noticed it it was very obvious (i think thats fine as a design, only notice when needed)." The affordance shipped 2026-05-13 (commit `0d01803` `feat(gloss): universalize GlossedText affordance to SegmentList + PerDrillCapture`) on top of the 2026-05-10 first-time-runnability sweep (`ba270d4`). This closes the loop on the 2026-05-04 partner session's F8/F9 wishlist (clickable glossary for technical terms like "set window") with positive partner signal on the latest build. The founder's design-stance attestation — "only notice when needed" is fine as a design — is recorded so future polish work does not interpret "hard to see at first" as a signal to strengthen the affordance. Subtle-by-default is the founder's intended design. **Trigger-fire reading:** positive Tier 1c-class polish evidence; does not fire a fresh trigger but supports the Tier 2 polish gate at the 2026-05-21 read-out.

**No schema, scope, or sequencing change** is authorized by this addendum. The three signals reinforce existing canonical paths (post-M001 `D101` sequencing scale; ledger backfill posture; Tier 1c-class polish positive evidence) and route to the same canonical homes as the parent note.

**Same-day Condition 2 + trigger (e) attestation (2026-05-23, late-afternoon chat reply).** Recorded in `docs/research/founder-use-ledger.md` cross-session reflections (captured 2026-05-22) addendum items (d) and (e). Two parts that affect this note's routing:

d. **Condition 2 strict reading: PASS for 2-player scope; 3s/4s outside-app planning happened, was forced by `D101` content gap.** Compounds addendum (a)'s observed session-level displacement: founder's response to the 3+ player content-gap is now documented across three behavioral channels (stated friction → observed session displacement → outside-app planning to compensate). Strongest founder-evidence to date on the `D101` post-M001 sequencing question; does NOT fire `D101` early.

e. **F2/F5 sharpened by near-displacement leading indicator.** Founder verbatim: "was thinking about [outside-app planning] since we want to do more attack / tactics sorts of drills." F2 (attack drill section) and F5 (team play / tactics / blocking / positioning) move from "wishful content-gap" toward "founder considering working around the app to fill the gap." No actual outside-app planning for 2-player attack/tactics yet, so the parent F2/F5 classifications stand — but the Tier 3+ attack chain and `D144` `pair_game` archetype variant activation triggers should weight today's near-displacement caveat alongside their standard partner-walkthrough / founder-ledger thresholds at the 2026-07-20 re-eval reading.

Trigger (e) agent-asymmetry attestation: clean per founder direct attestation ("dozen or more sessions for training, all Seb feedback from field experience"). Recorded in ledger addendum (e).

## For Agents

- **Authoritative for**: the 2026-05-22 founder chat capture, the Seb 2026-05-16 mid-session voice-memo content, and the routing classification for the five items above per `D135`.
- **Edit when**: a follow-up session reproduces F1's mid-session extend friction (second hit unlocks the natural Tier 1c-class layered surface discussion); a partner walkthrough produces an explicit ≥P1 on any of F2/F4/F5; the 2026-07-20 `D130` re-eval reads this note as input.
- **Belongs elsewhere**: the cross-session reflection block (`docs/research/founder-use-ledger.md`) is the lightweight ledger home; this doc is the curated capture and routing; the post-M001 backlog (`docs/status/post-m001-content-backlog.md`) and the M001 milestone doc are the authority on sequencing.
- **Outranked by**: `docs/vision.md`, `docs/decisions.md` (`D101`, `D124`, `D135`, `D141`, `D144`), `docs/milestones/m001-solo-session-loop.md`. This note is curated field evidence, not canon promotion.
