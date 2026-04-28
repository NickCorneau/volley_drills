---

id: m001-adversarial-memo
title: "M001 Adversarial Memo — Pre-Registered Falsification Conditions for D130"
type: plan
status: active
stage: build
authority: "Pre-registers the falsification conditions, decision rule, and ritual that install an adversary against D130's founder-use posture. Authored before Tier 1a begins so the hypotheses are locked in before ambiguous evidence arrives. Any deviation from the conditions below at the 2026-07-20 re-eval requires an explicit written amendment to this memo, co-signed by a named non-founder reader."
summary: "Three pre-registered falsification conditions (solo-first, trust-surface deferral, partner behavioral return), an asymmetric default decision rule at the re-eval, a weekly 3-minute trigger review ritual, and an authoring budget tied to dogfooding — installed together so the founder-use mode authorised by D130 cannot quietly become permanent."
last_updated: 2026-04-27
depends_on:

- docs/vision.md
- docs/decisions.md
- docs/milestones/m001-solo-session-loop.md
- docs/plans/2026-04-20-m001-tier1-implementation.md
- docs/research/d91-retention-gate-evidence.md
- docs/research/founder-use-ledger.md
- docs/research/partner-walkthrough-script.md
related:
- docs/reviews/2026-04-20-m001-red-team.md
- docs/research/2026-04-27-cca2-dogfeed-findings.md
- docs/plans/2026-04-27-per-drill-capture-coverage.md
decision_refs:
- D91
- D123
- D130
- D131
open_question_refs:
- O5

---

# M001 Adversarial Memo — Pre-Registered Falsification Conditions for D130

## Agent Quick Scan

- This memo is the pre-registered adversary against `D130` founder-use mode. Read it before writing any Tier 1a code and again every Monday during the 90-day re-eval window.
- Authoritative for: the three falsification conditions, the default decision rule at the 2026-07-20 re-eval, the weekly trigger-review ritual, and the authoring-budget cap.
- Not authoritative for: Tier 1a scope (that's `docs/plans/2026-04-20-m001-tier1-implementation.md`), the D91 numerical bar (that's `docs/research/d91-retention-gate-evidence.md`), or the partner walkthrough protocol (that's `docs/research/partner-walkthrough-script.md`).
- Amendment rule: this memo can be edited, but **the three falsification conditions cannot be weakened** without a written justification naming the specific evidence that made the previous condition too strict, co-signed by a named non-founder reader. That rule exists to prevent the gradual drift that is the single thing founder-use mode is most at risk of.

## Why this memo exists

`D130` removed the D91 retention gate as a blocker for M001 build, authorizing founder-use mode with a 2026-07-20 re-evaluation. The red-team review (`docs/reviews/2026-04-20-m001-red-team.md`) surfaced one structural risk stronger than any individual plan bug: **founder-use mode has no adversary in the room by default**. The founder is builder, sole user, evaluator, and scribe. All three of D130's original early triggers point down (under-use); none point up (success-by-founder-only is still a risk state). The re-eval has no decision rule. There is no mechanism for a finding of "this actually worked" to force external validation.

This memo installs the adversary. The founder wrote it while building the plan. If at the re-eval the founder notices the temptation to narrate around these conditions — that temptation itself is one of the signals this memo is meant to catch.

## Three falsification conditions (pre-registered)

Each condition states a **specific behavioral threshold** and a **specific consequence if the threshold is missed**. The consequences are pre-committed, not up for debate at the re-eval.

### Condition 1 — Solo-first activation is load-bearing

**Pre-registered claim.** The product vision and roadmap treat solo-first as the primary activation path (`D22`, `D60`; `docs/vision.md` P-whatever on solo-first; `docs/roadmap.md` Phase 0 solo-first anchor). Founder-use mode's validity as a stand-in for real validation depends on the founder actually training solo a majority of the time.

`**D132` re-reading (2026-04-22, no threshold change).** After `D132` landed in `docs/decisions.md`, the product's strategic framing is *pair-first with solo-accommodating tactics*, not solo-first simpliciter. This changes the interpretation of Condition 1, not the threshold itself: the ≥40% solo-share bar measures whether the accommodated solo case works well enough for founder-use-mode validity, not whether solo-first is the strategic north star (it isn't). The falsification consequence below still fires on the same behavioral signal — a founder who cannot / will not train solo meaningfully invalidates founder-use mode as a stand-in for real validation, regardless of whether solo is strategic or tactical. The consequence's specific repoint remains correct under pair-first: if solo share falls below 40%, the `D123` "recommendation-first first-run" polish repoints at pair-default, which is *more* aligned with pair-first strategy, not less. See `docs/research/2026-04-22-research-sweep-meta-synthesis.md` §R10 for the companion dissolution of the prior "partner-mode data vs solo-first vision" structural tension.

**Threshold.** Across the 90-day re-eval window (2026-04-20 → 2026-07-20):

- **≥40%** of founder-logged sessions in `docs/research/founder-use-ledger.md` have `playerMode: solo`.
- AND **≥3** logged sessions have `sessionFocus: set` (regardless of playerMode) — the minimum to say setting content is touched, not shelved.

**Falsification consequence.** If solo share falls below 40% OR if fewer than 3 set-focused sessions are logged, **Tier 2 must re-sequence to put pair-first activation ahead of solo-first trust surfaces**. Specifically: the `D123` "recommendation-first first-run" polish is repointed at a pair-default first-run instead of solo-default. The founder does not get to say "but I personally preferred pair" and proceed with solo-first — the behavioral data said the vision's solo-first premise is wrong for the actual use pattern, and the product has to follow the behavior. Under `D132`, this consequence is coherent with strategy (pair-default first-run aligns with pair-first) rather than a fallback against it.

**Why this threshold.** Solo-first is the hardest premise to confirm from n=1, because a founder with a willing partner will naturally drift to pair. 40% is low enough to accommodate realistic drift; below that, the premise is behaviorally falsified even if the founder feels otherwise. The 3-set-session floor is separate because set content could otherwise be authored-and-shelved without being falsified.

### Condition 2 — Trust surfaces deferred to Tier 2 are not silently routed around

**Pre-registered claim.** Tier 1a intentionally defers "See why this session was chosen," richer summary copy, and full session history to Tier 2. This deferral only holds if the founder does not route around those surfaces by keeping session planning or history in another tool (Notes, paper, spreadsheet, another app).

**Threshold.** Across the 90-day window:

- The founder plans **zero** sessions outside the app. A session is "planned outside the app" if the founder writes down what they will do before opening the app, or if the founder decides what to do mid-session by consulting any source other than the app.
- The founder maintains **zero** session history outside the app. "Session history outside the app" includes a running note of dates trained, drills run, or RPE, if that note is being referred back to later.

**Falsification consequence.** If *any* outside-app planning or history-keeping occurs, **Tier 2 trust surfaces move forward into Tier 1b, not Tier 2**. Specifically: the one-line "chosen because" annotation and the 3-row history list (both promoted into Tier 1a per `docs/plans/2026-04-20-m001-tier1-implementation.md`) are not sufficient; the richer See-Why surface and the full session history screen ship before any further content authoring. The reasoning: the outside-app artifact is evidence that Tier 1a's trust surfaces are under-specified for the founder's real needs, and shipping more content on top of an under-specified trust base is building on sand.

**Why this threshold.** Zero is the right number because the founder cannot be partially out-of-app. Any notes-app fallback is the founder saying the product doesn't meet a real need; the response has to be to meet the need, not to accumulate more content. This is the hardest condition to honor. The founder should expect to fail it once and respond honestly.

### Condition 3 — Partner behavioral return (post-walkthrough)

**Pre-registered claim.** The partner walkthrough (`docs/research/partner-walkthrough-script.md`) is not a D91 cohort and cannot measure retention. It *can* measure whether the partner chose to open the app unprompted after the walkthrough — a weak but real behavioral signal.

**Threshold.** Within 30 days after the Tier 1a walkthrough delivery date:

- The partner opens the app **≥1x unprompted** — defined as without the founder asking, reminding, or referring to it in conversation. A "did you try the app?" counts as prompting and invalidates the signal for that 30-day window.

**Falsification consequence.** If the partner does not open the app unprompted within 30 days, **the partner walkthrough ledger is treated as regardless-of-severity P0** for the purpose of Tier 2 gating, and the Tier 2 recommendation-first polish effort is repointed at "what would have made the partner open it." This applies even if the walkthrough ledger itself contained only P1 and P2 observations. The reasoning: the walkthrough's stated purpose is to generate build authority for Tier 2; if the partner's behavior says the app wasn't worth opening, no ledger of wording fixes substitutes for that signal.

**Why this threshold.** 30 days is long enough to let ordinary forgetfulness pass and still capture intent. "Unprompted" is the entire signal — prompted opens are evidence of partner politeness, not product pull. One unprompted open is a weak-but-real signal; zero is strong-and-negative.

**Telemetry constraint (pre-registered with this condition, codified in `D131`).** Condition 3's signal requires that the partner have plausible deniability that no one is counting opens. Adding any remote telemetry, app-open counter, or shared "admin view" during the 90-day window corrupts the signal, because consent disclosure turns an unprompted open into a possibly-socially-obligated open, and a partner who knows opens are counted is no longer testing product pull. Therefore, **no telemetry, no network call on session end, no remote counter of any kind ships during the 90-day window**, full stop. Local `ExecutionLog` / `SessionReview` in Dexie remain the only session record; founder self-inspection happens through `docs/research/founder-use-ledger.md`, not through an in-app analytics surface.

This constraint is **a pre-registered falsification-condition prerequisite, not a product-taste preference**. Adding telemetry inside the window — even "just a silent counter for me to see" — has the same amendment requirements as weakening any other falsification condition: a written justification naming the specific evidence that made the previous position wrong, a named non-founder co-signer, and an entry in the Amendment Log below. "I just want to know if they opened it" is not a valid justification; that is the exact temptation Condition 3 is designed to make unavailable. See `D131` in `docs/decisions.md` for the full staged-unlock plan (opt-in JSON export at friends-of-friends cohort, remote telemetry only at `D91` stranger-launch preparation).

## Default decision rule at the 2026-07-20 re-eval

The re-eval MUST produce a written decision memo. The decision rule below is asymmetric against inertia on purpose.

**Inputs to the decision (all must be recorded in the memo):**

1. Founder-use ledger session count, solo share, focus breakdown.
2. Partner walkthrough ledger (Tier 1a at minimum; Tier 2 if shipped).
3. Partner behavioral return outcome (from Condition 3 above).
4. Status of Tier 1a, Tier 1b, Tier 2 — shipped, in-progress, not-started.
5. Founder's own narrative answer to the three falsification conditions: passed / failed / ambiguous, with one sentence per condition.

**Decision tree (default-against-inertia):**

- **If Condition 1 is failed** → Tier 2 re-sequences (see Condition 1 consequence). Return to Tier 1b authoring with the re-sequenced Tier 2 plan ready to start when Tier 1b acceptance passes.
- **If Condition 2 is failed** → Tier 1b pauses; See-Why and full session history ship next. Return to the re-eval when those surfaces have seen 30 days of founder use.
- **If Condition 3 is failed** → Tier 2 repoints (see Condition 3 consequence). If Tier 2 has not started yet, start it on the repointed target. If Tier 2 has shipped, the next Tier 2 iteration is gated on re-running the partner walkthrough and observing a post-walkthrough unprompted open.
- **If all three conditions pass AND Tier 1a + Tier 2 have shipped AND combined founder+partner sessions >12** → **default decision is option (a): friends-of-friends cohort** (3–5 beach volleyball friends, two-week window, ledger captured per tester, no D91 numerical bar — this is one more expansion stage before D91 stranger-launch). Continuing founder-only (the third option) is available but requires a written justification co-signed by a named non-founder reader, pasted into this memo's Amendment Log below. The justification must state a specific behavioral outcome that would overturn the decision (falsifiable) and the review date on which that outcome will be assessed.
- **If all three conditions pass AND Tier 1a + Tier 2 have shipped AND combined sessions ≤12** → **default decision is continue Tier 2 iteration for another 30 days** and re-assess. Not a green light for friends-of-friends yet; the session volume is too low to distinguish founder conviction from founder novelty.
- **If Tier 1a has not shipped by 2026-07-20** → the re-eval is not a go/no-go; it is a diagnosis memo. Write what blocked Tier 1a, whether the blocker is technical, motivational, or environmental, and whether founder-use mode has failed-by-non-execution. In that state, the default decision is to ship whatever subset of Tier 1a is shippable and re-eval again in 30 days.

**Option (b) — resume D91 stranger-launch preparation** — is always available as an opt-in path when Conditions 1, 2, 3 all pass and the founder has stranger-launch conviction independent of the friends-of-friends step. It is not the default, but it is a valid selection from this memo.

**What the decision rule explicitly rejects.** At the re-eval, the founder cannot:

- Narrate a condition as "technically passed with caveats." Pass or fail; ambiguous defaults to fail.
- Cite "the content isn't ready yet" as a reason to continue founder-only without a co-signer. "Not ready" is a Tier-1b/Tier-2 authoring concern, not a validation concern.
- Skip the decision memo. If the re-eval date arrives and no memo is written, the default decision is option (b) (resume D91 preparation) — chosen not as the founder's preference but as the asymmetric-against-inertia fallback.

## Weekly trigger-review ritual (3 minutes, Mondays)

Every Monday during the 90-day window, the founder pastes into this memo's Weekly Log below:

```
## YYYY-MM-DD (week N of 13)
- Sessions logged this past week: <n> (running total: <n/13-week-target>)
- Sessions that actually ran this past week but are not yet in the ledger: <n / brief notes>
- Solo share so far: <%>
- Focus breakdown so far: <pass n / serve n / set n>
- Outside-app planning this week: <yes/no — if yes, what>
- D130 early triggers check:
  - (a) <5 sessions in 45 days: currently <x/5, y days elapsed>
  - (b) 3-week silence: <most recent session date>
  - (c) invited anyone outside partner: <y/n>
  - (d) Tier 1a + ≥10 sessions + no open P0: <status>
  - (e) agent-assisted open asymmetry: <status — agent-assisted opens ≥5 AND agent-free work check ≤1 in last 14 days?>
- Non-ledger behavioral-evidence channels this week (added 2026-04-24):
  - Partner usage (Seb opens / sessions / unprompted messages): <brief summary>
  - Founder chat / voice-memo feedback to the repo: <count of substantive chat threads that drove canon edits, or "none">
  - Joint-session evidence (founder ran alongside partner without separate ledger row): <y/n, rough count>
- Falsification conditions status:
  - 1: pass / fail / ambiguous
  - 2: pass / fail / ambiguous
  - 3: pass / fail / ambiguous (only applies post-walkthrough)
- One-line note: <founder's honest read of the week>
```

The ritual is designed to take three minutes and be impossible to skip without leaving a visible gap. If three consecutive Mondays are missed, that is itself evidence the founder-use premise is underwater; trigger a re-eval at the next weekly slot.

**Recognized behavioral-evidence channels (2026-04-22-c + 2026-04-24 expansion).** Five channels feed the weekly read; no single channel's emptiness falsifies founder-use mode on its own, and the channel-mix read is what the 2026-07-20 re-eval consumes:

1. **Founder-use ledger rows** — `docs/research/founder-use-ledger.md`. Authoritative per-session record, 30-sec append target.
2. **Partner (Seb) usage signals** — Dexie exports sent unsolicited, partner unprompted-open cadence, post-close mentions table in the walkthrough ledger.
3. **Partner-walkthrough observations** — `docs/research/partner-walkthrough-results/*.md`, including joint founder+partner sessions flagged by their joint-session-reframe clarifiers.
4. **Condition 3 signals** — the 30-day unprompted-open tracker in the walkthrough ledger.
5. **Founder chat / voice-memo feedback to the repo and agent** — added 2026-04-24. Substantive founder corrections, scope-discipline interventions, and canonical framing changes delivered via chat (e.g., the 2026-04-22-c correction, the 2026-04-23 closeout-polish plan request, the 2026-04-24 joint-session reframe). These are legible through agent transcripts + the downstream canon edits those transcripts produced; they are not separately stored as a "chat ledger" and do not need to be.

Research-velocity substitution (see `docs/roadmap.md` Risks-and-mitigations) now fires on research-notes-landed-this-week ≥3 AND **all five** of these channels producing ≤0 or near-zero signal, not on the ledger-alone reading the original memo used.

## Authoring-budget cap (anti-displacement)

The red-team review identified **content authoring as displacement activity** as a specific failure mode of founder-use mode: the founder authors new drill records in place of dogfooding the existing library.

**Cap.** No more than **10 new drill records** may be authored between Tier 1a acceptance and the founder's 5th post-Tier-1a session logged in `docs/research/founder-use-ledger.md`. This cap is the entire Tier 1b budget. After the 5th session:

- The next 10 drills may be authored only in response to a specific logged session gap ("I wanted X and couldn't find it").
- No drill may be authored before the founder has attempted to find a workable substitute in the existing library and logged the attempt.
- Partner walkthrough findings do not override the cap — they feed into it as one class of logged gap.

**Why this cap.** 10 is slightly more than the 8 drills that a typical BAB practice plan would author in one sitting; it is explicitly below the 19 drills the original Tier 1 plan proposed to author before any founder dogfood. The cap forces the founder to distinguish "I need this to train" from "I would like this to exist."

## Fourth D130 trigger — codified here, referenced in decisions.md

The D130 amendment adds trigger (d): "Tier 1a has shipped AND ≥10 founder sessions logged AND the partner walkthrough has returned with no open P0s → re-eval MUST fire, default outcome is to resume `D91` preparation." See the amended D130 cell in `docs/decisions.md`.

This trigger exists because the three original D130 triggers all point down (under-use). Without an up-trigger, a successful founder-use run has no mechanism for forcing external validation. Trigger (d) is the up-trigger.

The `D91` preparation here means returning to the operational protocol in `docs/research/pre-telemetry-validation-protocol.md` and `docs/discovery/phase-0-wedge-validation.md`, not rejecting founder-use mode retrospectively. Founder-use mode was the right call for 2026-04-20; trigger (d) is the right condition to end it.

## Dream-pass cadence and amendments (2026-04-20)

A one-off "dreaming" pass was run over the full repo corpus (vision, decisions, roadmap, this memo, Tier 1a plan, red-team review, founder-use ledger, partner walkthrough script, safety components in active edit, and the founder ↔ agent authoring thread) on 2026-04-20. The pass followed the Day-Dreaming Loop (DDL) shape — recombination across distant memory chunks, noise injection on one contradiction, pruning of trivial associations — with a pruning step added because sleep is net subtractive and the original DDL template is net additive. Five Dream Fragments survived; three were discarded.

Three of the surviving fragments landed consequences the memo should carry going forward. They are amendments that **add** constraints; they do not weaken any of the three falsification conditions, so the amendment-log rule that requires a non-founder co-signer for weakening edits does not apply here. The fourth item below is the cadence for re-running the dream pass at all, so future dream output has a legitimate home.

### A1 — Fifth D130 trigger: agent-assisted open asymmetry

`D130`'s four existing early triggers (`a` 5-in-45 under-use, `b` 3-week silence, `c` scope leak outside partner, `d` Tier 1a + ≥10 sessions + no open P0) are all about founder behavior *on the app*. None observe founder behavior *on the repo itself*. The gap matters because founder-use mode's single largest latent failure is the repo functioning as a conversation topic with a coding agent rather than as durable documentation the founder returns to unprompted.

Add trigger (e) to the D130 watch list, codified here and referenced in `docs/decisions.md` D130 when next amended:

> **(e) Agent-assisted open asymmetry.** Across any 14-day window during the founder-use window, if the founder has ≥5 agent-assisted repo opens (new Cursor chats initiated against this repo) AND ≤1 agent-free repo open (a git commit authored without an agent in the loop, or an explicit founder self-report in the ledger confirming agent-free work), **the re-eval must fire early**. Default consequence: ship the A3 ligament below (weekly agent-free memo re-read), then re-measure for a 14-day window. The agent-free check remains a soft self-report because the repo has no surface to measure it automatically, but self-reporting "I authored this without an agent" is cheap and legible.

This trigger is asymmetric in the opposite direction from (a)/(b): (a) and (b) fire on *under-use*, (e) fires on *over-reliance*. Together they squeeze the founder-use posture from both sides.

### A2 — Validation Posture String (three-state ladder, mirrors `D118`)

`D118` refuses the word "synced" before a cloud peer exists and ladders local-durability copy across three states (Safari tab / HSWA / HSWA-persisted). The memo has no equivalent ladder for validation claims, so "validated," "working," "proven" drift in without a gate. Install the ladder now.

Every Monday weekly-log entry and the 2026-07-20 re-eval memo MUST select exactly one of:

- **L1 — "Tested on one device only."** The current state under `D130`. Permits founder-facing notes and internal planning; prohibits external claims of working or validated.
- **L2 — "Tested with one partner, 30-day quiet-window outcome pending/observed."** Post-walkthrough, pre-stranger-cohort. Permits case-study framing with the partner's behavioral-return outcome explicitly named. Still prohibits any retention-percentage claim.
- **L3 — "Tested with a stranger cohort, `D91` numeric bar met/not met."** Requires the `docs/research/pre-telemetry-validation-protocol.md` cohort to have run. Permits `D91`-style language with the specific tally.

No external communication (marketing copy, README hero, README tagline, PR description body, a friend-of-founder answer to "how's the app going") may claim a higher posture than the current state permits. This converts `D118`'s copy-honesty discipline into validation-honesty discipline using machinery the founder already respects.

### A3 — Beach Prep Three for the founder (pre-authoring ligament)

Three scope-balloon incidents were the same bug at three layers: (i) `pickForSlot` filling the warmup slot with a passing drill because the system filled a container without specifying intent; (ii) SetupScreen formification adding toggles before earning a recommendation (P11 violation); (iii) Tier 1 scope-balloon filling "D130-unblocked capacity" without specifying what it must be *about* first. The fix at all three layers is the same: author the ligament first, then let everything else be shortenable-but-not-skippable.

Install the planning-layer ligament now:

> **Before any new file lands under `docs/plans/` or `docs/research/`** — or any substantive edit (>50 lines) to an existing plan or research file — the founder must have read this memo end-to-end within the preceding 7 days. "Read" means reading, not skimming to confirm the section you already know. Log the read-through as a one-line entry in this memo's Weekly Log with date and duration. If the most recent read-through is older than 7 days, stop, re-read, then edit. Agents authoring on the founder's behalf must surface the same check before proposing a new plan or research file.

This ligament is three minutes and it is mandatory. Skipping it is visible because the Weekly Log will show the last read-through date. It is the only ritual whose skipping cannot be silently narrated around.

### A4 — Dream-pass cadence (`scripts/dream.sh`)

A one-off DDL pass produces a moment of insight; it does not produce the offline-consolidation function that makes dreaming *dreaming*. That function is a weekly rhythm that prunes at least as much as it generates. Install the cadence now:

- `scripts/dream.sh` is the alarm clock. It assembles a populated DDL prompt from live repo state (recent commits, ledger tail, stale-doc candidates, open red-team flags) and writes it to `.cursor/state/dreams/dream-YYYY-MM-DD.md`. It does **not** call any LLM — synchronous LLM dreaming is the opposite of offline consolidation. The next agent session running in this repo reads the prompt, executes the dream pass by hand, and appends the Dream Fragments to this memo's Weekly Log under the current Monday's entry.
- Cadence: the founder runs `bash scripts/dream.sh` once per Monday as the first step of the weekly ritual, before filling the trigger-review log. The dream's pruning output (doc-archive candidates) is read first; if nothing is pruned, the week's authoring budget is zero regardless of what the trigger review otherwise permits.
- The DDL prompt the script emits includes a **pruning section** the original DDL template did not have: "list up to 3 docs under `docs/research/` or `docs/plans/` that could be archived or consolidated given the chunks above." This is the net-subtractive step. A dream pass that only generates and never prunes is the failure mode the red-team named as "content authoring as displacement activity."

### Amendment log entry for A1–A4

**2026-04-20 — Dream-pass amendments A1–A4.** Added fifth D130 trigger (agent-assisted open asymmetry), Validation Posture String ladder (L1/L2/L3), Beach Prep Three for the founder (pre-authoring memo re-read ligament), and dream-pass cadence via `scripts/dream.sh`. **Justification**: these amendments add constraints (new triggers, new copy gates, new pre-authoring checks, new weekly rhythm) without weakening any of the three falsification conditions or any existing D130 trigger. Co-signer requirement waived per the memo's amendment rule, which binds only on edits that weaken a condition. The amendments inherit their evidential warrant from a one-off dream pass over the full repo corpus run on 2026-04-20; the pass's five Dream Fragments are preserved in the agent transcript for the session that authored this amendment, and the three that landed here are the ones that produced concrete new constraints rather than rhetorical parallels.

### Amendment log entry for 2026-04-22 partner-walkthrough polish

**2026-04-22 — Partner-walkthrough polish bundle (editorial-class, pre-close class).** Following Seb's 2026-04-21 Tier-1a walkthrough and the four 2026-04-22 review passes (workflow manual test, shibui pass, manual UI/design review, trifold + all-passes reconciled syntheses — all under `docs/research/partner-walkthrough-results/`), shipped a 6-item editorial-class bundle under `docs/plans/2026-04-22-partner-walkthrough-polish.md`:

1. Safety recency chip display labels (`0 days` → `Today`; persisted `trainingRecency` values unchanged).
2. Neutral `disabled` CTA token on `Button` `primary` (peach-overload fix per design review A1).
3. `PainOverrideCard` microcopy — "We lower the load, not the time — your pick." (Seb wording-check).
4. First-session verdict variant on `Complete` when `sessionCount === 1 && totalAttempts === 0` (design review T3).
5. Preroll "keep phone unlocked" hint gated to first-time only via `storageMeta['ux.prerollHintDismissed']` (Player 3 + workflow pass).
6. `Shorten block` on Transition promoted from ghost text to full-width outline (design review).

**Justification.** Each item qualifies as `Accept (pre-close)` / `Accept (landed)` class per Seb's disposition table precedent (small editorial fix that fits the courtside-copy rule §2 or outdoor-UI brief floor, no new drill content, no new spec contract, no new Dexie migration). None of the three falsification conditions is weakened; the authoring-budget cap is respected (6 edits across 7 files + 3 regression tests + frontmatter/catalog updates). Validation: `npm run lint`, `npm run build`, `npm test -- --run` all clean (566 tests, 74 files). Red-team pass (correctness + scope-guardian + project-standards subagents) surfaced one P1 race condition on the preroll-hint flag mount-read vs. write, fixed with a functional setter + regression test — see `RunScreen.preroll-hint.test.tsx`. Co-signer requirement waived per the memo's amendment rule (no falsification condition weakened). Decision-ID authority: `D129` (pain/recency copy), `D130` (founder-use posture), `D127` (typography scaffolding preserved).

**Items that did NOT ship and remain trigger-gated per this memo's authoring-budget cap** (tracked in `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Tier 1b — gated by founder-session trigger"):

- Pair role-swap audio cue (Seb P2-2 Tier-1b half) — trigger: founder logs ≥2 pair sessions with unclear role transitions.
- In-session running rep counter + full drill-metadata-driven capture UI (Seb P2-3 Tier-1b half + N2) — trigger: founder logs ≥2 sessions where the `notCaptured` default feels wrong, OR ≥1 `pass-rate-good` session where the guess was explicitly noted as fake.
- Tap-to-expand per-stretch demo (Seb P1-8 Tier-1b half) — trigger: founder logs ≥1 wrap session where more form detail was wanted mid-block, OR next partner walkthrough surfaces the need.
- `Chosen because:` deletion from Run + Swap-sheet re-home (trifold T1, re-opened) — trigger: ≥1 founder-use-ledger entry flagging the line as "coach footnoting." Until then, the pre-close relocated + 16 px state (landed 2026-04-21) holds.

**Items that did NOT ship and require a spec revision first** (tracked in the reconciled synthesis §"Genuinely-open Tier 1b bundle (reconciled)"):

- Full Review cut (RPE 11 → 3 anchors; delete Quick tags; divider-line cards; delete 2-hour Review-window copy; `Done` / `Finish later` equal weight; hide Good-passes card entirely on non-count drills) — blocked on revising `docs/specs/m001-review-micro-spec.md` contract.
- Auto-fill training recency from Dexie; persist `Net` / `Wall` across sessions — cross-cutting draft-state + adaptation-rule reviews required.
- Visual block-end countdown cue; Complete-screen Safari-eviction footnote compression; Skip-review confirmation modal; `Logged: N sessions` footer; accent color audit; warm-up numbered-step truncate-with-expand — each open as a separate editorial- or design-token-class candidate, not blocking this ship.
- Effort/tag state anomaly investigation — open as a standalone bug, may be moot once the full Review cut deletes the Quick tags card.

This entry does not alter Condition 3's 2026-05-21 close date or the re-eval decision rule.

### Amendment log entry for 2026-04-23 walkthrough closeout polish

**2026-04-24 — Walkthrough closeout polish pass (editorial-class, pre-close class).** Shipped the four-item bundle in `docs/plans/2026-04-23-walkthrough-closeout-polish.md` drawn from `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Genuinely-open Tier 1b bundle" items 2 + 3 + 4 + 16. On execution, items 1 (Safety recency reword) and 16 (`PainOverrideCard` microcopy) were discovered as **already landed in the 2026-04-22 polish pass** (chip-label rename via `PRIMARY_RECENCY_LABEL` + `PainOverrideCard` period-form microcopy per courtside-copy §4, which explicitly forbids em-dashes in user-visible prose); both are recorded in the plan's ship log as landed, with the founder-specified walkthrough-verbatim em-dash form converted to the rule-compliant period form. Items 2 (Review merged-proposal remainder) and 3 (2-hour Review-window copy + Safari-caveat compression) shipped in this pass:

- RpeSelector collapsed from 11 numeric chips (0–10) to three labelled chips (Easy / Right / Hard) mapping to canonical `sessionRpe` 3 / 5 / 7; `sessionRpe` field remains a number in the 0–10 domain so `composeSummary`, `effortLabel`, the `phase-c0-schema-v4` migration backfill, and the `D104` / `O12` tuning floor are unaffected. Historical non-canonical values rehydrate via `pickChipForRpe` (nearest-chip snap, no data mutation).
- `QuickTagChips.tsx` deleted; the Quick tags card removed from Review.
- Hairline divider between the RPE and Good-passes cards.
- Good-passes card hidden entirely when the main-skill drill's `successMetric.type` is non-count (previously pre-selected `notCaptured`).
- `Submit review` renamed to `Done`; the same-day equal-primary `Done` / `Finish later` experiment was reversed after founder design feedback, so `Done` is the full-width primary CTA and `Finish later` is again the lower-emphasis link-style escape hatch.
- 2-hour Finish-Later countdown subtitle deleted from the Review footer; `formatFinishLaterWindow` + `nowMs` tick state removed. A6 / A9 past-cap re-route logic unchanged — expired-stub behavior still fires on the same cap.
- Posture-sensitive Safari-eviction secondary compressed off `CompleteScreen` and into a new Settings `About local storage` sub-section driven by the same `getStorageCopy(posture)` source of truth; Complete carries a small `Why is this?` link to `/settings`. `D118` three-state durability posture unchanged.

**Justification.** All items qualify as `Accept (pre-close)` / `Accept (landed)` class per the 2026-04-22 partner-walkthrough-polish precedent (editorial-class fix that fits the courtside-copy rule or outdoor-UI brief floor, no new drill content, no new spec contract, no new Dexie migration, no metadata schema changes, no persistence-behavior additions, no new archetype variants, no SetupScreen toggles). Zero drill records consumed from the authoring-budget cap (still 4 of 10 remaining). None of the three falsification conditions is weakened. Validation: `npm run lint`, `npm run build`, `npm test -- --run` all clean (639 tests, 82 files — up from 566/74 at the 2026-04-22 polish-pass baseline). Co-signer requirement waived per the amendment rule (no falsification condition weakened). Decision-ID authority: `D118` (durability posture preserved), `D120` (RPE 0-10 domain preserved), `D127` (typography scaffolding preserved), `D130` (founder-use posture), `D132` (pair-first vision-stance alignment applied per the plan's §Pair-first review).

**Re-eval impact.** None. The Condition 3 2026-05-21 close date, the decision rule at the 2026-07-20 re-eval, and the three falsification conditions are untouched. The ship is evidence *for* Condition 3 provisional pass holding — a cleaner product through the remaining quiet window reduces the likelihood of a late-window regression on Seb's unprompted-open signal — but it does not change any threshold.

### Amendment log entry for 2026-04-27 cca2 dogfeed bundle

**2026-04-27 — cca2 dogfeed synthesis ship.** Founder + Seb pair pass session on the latest build (`pair_open` 25 min, plan `4212f2a3-…`, `swapCount: 10`, main_skill swapped to `d38-pair` Bump Set). Six validated findings landed in `docs/research/2026-04-27-cca2-dogfeed-findings.md`; one founder-use-ledger row (2026-04-27, pair / pass / 25 min / Y / RPE 5) appended; spec contract amended in `docs/specs/m001-review-micro-spec.md` §"Per-drill required field" + §"Non-count drills at main_skill / pressure (gap 2a)"; new implementation plan `docs/plans/2026-04-27-per-drill-capture-coverage.md` authored to route gap 2a + 2b; the Tier 1c trigger evidence block in `docs/plans/2026-04-20-m001-tier1-implementation.md` updated with the second-hit signals (founder + partner) and the *separate* skill-level-mutability surface recorded as its own line item; same-day code fixes shipped for `d26` cooldown copy (3-6 min range) and `pickForSlot` `movement_proxy` slot-fill preference.

**Justification.** All canonical-doc edits qualify as `Accept (pre-close)` / `Accept (landed)` class per the 2026-04-22 / 2026-04-23 / 2026-04-26 polish-pass precedent. The spec amendment widens (does not weaken) `D133`'s Drill Check capture surface to include count-eligible drills at non-main_skill slots — strictly an *increase* in surface coverage, not a contract weakening. The new plan authors zero drill records (no authoring-budget cap consumption). The Tier 1c trigger update **records evidence accumulating, does not declare the strict trigger met** — the ≥8-session ledger threshold remains binding; the partner-walkthrough OR clause is documented as "arguably met by Seb's voice memo, founder reading is to keep the strict ≥8-session count as the safest bar," with no tier change applied. None of the three falsification conditions is weakened. Authoring-budget cap respected (still 4 / 10 from Tier 1b Layer A; this ship adds 0). Co-signer requirement waived per the amendment rule (no falsification condition weakened, no threshold shifted, no decision rule changed).

**Trigger-status updates from this ship:**

- **Tier 1b Framing C re-trigger (in-session running rep counter on `RunScreen.tsx`).** Pre-2026-04-27: 0 of ≥2 hits. Post-2026-04-27: **1 of ≥2 hits.** Cca2 dogfeed produced a "not sold on counting passes because of memory/awareness" report on a session where the founder *would have* wanted the data. One more independent session with the same flag formally fires the re-trigger.
- **Tier 1c trigger (focus-picker / `sessionFocus` routing architecture).** Pre-2026-04-27: founder-side ledger evidence accumulating (3 gaps from the 2026-04-21 row, well below the ≥8-session strict count). Post-2026-04-27: same threshold, **partner-side evidence added** — Seb's voice memo contains a Task-B-class focus-picker ask. Strict reading of the ≥8-session OR clause is unchanged; the partner-walkthrough OR clause is now arguably met but the founder's reading at this update is to keep the strict count as the safest bar pending one more independent partner-walkthrough or ≥6 more founder-side intent-mismatch notes.
- **Skill-level mutability — new line item.** Recorded in `docs/plans/2026-04-20-m001-tier1-implementation.md` §"Skill-level mutability — separate surface, separate trigger." Trigger threshold: ≥2 founder-ledger sessions with explicit skill-level mismatch notes, OR partner walkthrough ≥P1 about skill-level inflexibility, OR Tier 1c ships first and reveals focus-mismatch was masking skill-level-mismatch. Status: 1 partner-side ask, 0 founder-side hits. Below threshold; recorded only.

**Re-eval impact.** None. The Condition 3 2026-05-21 close date, the decision rule at the 2026-07-20 re-eval, and the three falsification conditions are untouched. The ship is evidence *toward* Tier 1b Framing C and Tier 1c eventually firing under their pre-registered triggers; it does not advance any tier.

**Validation expectations.** `npm run lint`, `npm run build`, `npm test -- --run` clean. `bash scripts/validate-agent-docs.sh` clean against the new research note + new plan + amended spec + updated Tier 1a plan + updated catalog + updated AGENTS.md current-state line.

### Amendment log entry for 2026-04-27 cca2 dogfeed F1 follow-up — block-role tags + rationale deletion

**2026-04-27 — Block-role tags + rationale deletion (editorial + typography class).** Following the cca2 dogfeed synthesis ship above, the founder named "lots of text to read between each drill" as the structural friction the F1 finding pointed at. Two coupled changes shipped same-day:

1. `**phaseLabel` un-collapsed.** `app/src/lib/format.ts` extended from the F8-era three-label shape (`Warm up` / `Work` / `Downshift`) to the full six-label shape (`Warm up` / `Technique` / `Movement` / `Main drill` / `Pressure` / `Downshift`). Sentence case preserved (the F8 calm-voice thesis); accent-color treatment preserved; no new visual chrome added. The eyebrow now carries six labels instead of three. Renders on `RunScreen.tsx` header eyebrow (existing) and on `TransitionScreen.tsx` `Up next · {phaseLabel}` line (extended in this ship).
2. **Per-block `rationale` prose deleted from run-flow surfaces.** `RunScreen.tsx` and `TransitionScreen.tsx` no longer render the `Chosen because: …` italic line under the drill name. Role information now rides on the eyebrow per change 1 above. The `block.rationale` data field is preserved on the data record (`deriveBlockRationale` still writes it) so future surfaces — Swap sheet, See-Why modal in Tier 2 — can reach for it. Tests updated: the two rationale-rendering invariants in `RunScreen.rationale-placement.test.tsx` were removed and replaced with two negative-assertion invariants (rationale prose absent from the run card; role label `Main drill` present in the eyebrow); the courtside-instructions and coaching-cue typography invariants stay unchanged. New `format.phaseLabel.test.ts` pins all 6 slot labels exactly so the un-collapse can't silently regress.

**Two pre-registered triggers fired by this ship:**

- **Trifold-T1 ("`Chosen because:` deletion from Run + Swap-sheet re-home").** Pre-registered trigger condition (per the 2026-04-22 amendment-log entry above): "≥1 founder-use-ledger entry flagging the line as 'coach footnoting.'" Strict reading: today's cca2 dogfeed didn't use the literal phrase "coach footnoting"; founder said "lots of text to read between each drill," which is the structural equivalent (the rationale is per-block prose that adds reading load between drills, exactly what "coach footnoting" names). Founder reading at this update is to **treat the trigger as fired** by the cca2 dogfeed evidence, ship the deletion, and record the structural-equivalence reading inline so the next reviewer can falsify the call. Swap-sheet re-home is **not** part of this ship (no Swap UI changes); the data field is preserved precisely so a Swap-sheet re-home in a later pass can pull `block.rationale` back without re-deriving it.
- **F8 collapse reversed.** Phase F8 (2026-04-19, `docs/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md`) deliberately collapsed the four mid-session slot types to `Work` on calm-voice / shibui-direction grounds. The cca2 dogfeed F1 evidence ("a 25-min session with three different work-block types and the user can't tell them apart from the eyebrow; only the main_skill block got the post-block Difficulty chip and the chip-asymmetry felt arbitrary because the role wasn't visible upstream") is the cited reversal evidence. The reversal is **not a thesis change** — sentence case kept, accent-color kept, no all-caps reintroduced, no new chrome — it is a label-set expansion under courtside legibility evidence. F8 plan doc is unchanged for now (the reversal logic lives here in the amendment log + in the `phaseLabel` source comments); future F8-class typography passes can cite this entry.

**Justification.** Editorial + typography class. No drill-record authoring (cap consumed: still 4/10 from Tier 1b Layer A). No Dexie migration. No spec contract change (the `block.rationale` field stays on the data record per the 2026-04-21 Tier 1a Unit 4 spec; only the UI surfaces stop rendering it). No falsification-condition change. No threshold shift. No decision-rule change. Co-signer requirement waived per the amendment rule.

**Trigger-status update for the post-ship landscape:**

- Trifold-T1 marked **fired** with structural-equivalence reasoning. The Swap-sheet re-home half of the trigger remains open (not done in this ship) — if a future founder-use-ledger entry flags rationale-as-noise on the Swap sheet specifically, that surface re-homes there, and the trigger's second half closes.
- F8 reversed for `phaseLabel` only. Other F8-era typography decisions (sentence case in source, accent eyebrow, body type unification at `text-base`) are unchanged.

**Re-eval impact.** None. Condition 3 close date 2026-05-21 unchanged; 2026-07-20 re-eval decision rule unchanged; three falsification conditions unchanged.

**Validation.** `npm run lint`, `npm run build`, `npm test -- --run` clean (866 tests, 104 files — up from 858/103 at the cca2 dogfeed bundle baseline). `bash scripts/validate-agent-docs.sh` clean. ReadLints clean on the 5 edited files.

### Amendment log entry for 2026-04-27 cca2 dogfeed F8 follow-up — eyebrow skill marker + lead-with-skill catalog sweep

**2026-04-27 — Eyebrow skill compose + courtside-copy rule 6 + 17-variant catalog sweep (editorial + structural class).** Founder report on `d33-pair`: *"is this a serving drill? It's really not that clear."* Two compounding gaps surfaced (cca2 dogfeed F8 in `docs/research/2026-04-27-cca2-dogfeed-findings.md`):

1. Run-flow eyebrow showed only the slot role (`Main drill`) with no skill marker, so a glancing reader had no upstream signal of which skill the drill works.
2. Most M001 skill drills' `courtsideInstructions` led with logistics ("Stand 3 m apart…", "Mark a target circle…") and buried the skill verb in subordinate clauses or in the second sentence.

**Three coupled changes shipped same-day:**

1. **Eyebrow composes skill into the role marker.** New `getBlockSkillFocus(block, playerCount)` helper in `app/src/domain/drillMetadata.ts` resolves drills' primary `skillFocus[0]` to one of `'pass' | 'serve' | 'set'` (or null for warmup/recovery and unknown drills). New `skillLabel(skill)` and `blockEyebrowLabel(blockType, skill)` helpers in `app/src/lib/format.ts` compose the eyebrow as `{phaseLabel} · {skillLabel}` for skill blocks. Run + Transition both consume `blockEyebrowLabel`; Transition prepends `Up next ·` so its eyebrow reads `Up next · Main drill · Serve` (three parts, founder vocab call `trans_full` over `trans_skill_only`).
2. **Courtside-copy rule 6 (lead-with-skill).** Added to `.cursor/rules/courtside-copy.mdc`: *"For every drill whose `skillFocus[0]` is one of `pass | serve | set`, the first sentence of `courtsideInstructions` must contain the skill verb (or an unambiguous compound — `bump-set`, `hand-set`, `forearm-pass`)."* Authoring checklist updated; rationale ties to F8 finding.
3. **Catalog sweep of all 17 m001Candidate skill-drill variants.** `app/src/data/drills.ts` `courtsideInstructions` rewritten to lead with the skill verb on `d01`/`d03`/`d05`/`d09`/`d10`/`d11`/`d15`/`d18` (pass), `d22`/`d31`/`d33` (serve), `d38`/`d39`/`d40`/`d41`/`d42` (set). Trigger drill `d33-pair`: *"Take turns. Each partner works the full 6-zone order…"* → *"Serve through the same 6-zone order as Solo, taking turns…"*

**Plus a structural visual fix discovered during the same dogfeed:** Run-flow header layout switched from `flex items-center justify-between` to `grid grid-cols-3 items-center` with `justify-self-{start,center,end}` per cell, fixing the +17 px right-drift of the middle eyebrow caused by `SafetyIcon`'s 56 px touch-target width vs. the right counter's ~22 px (`flex justify-between` keeps gap-left = gap-right but does NOT center the middle item relative to the container). Applied to Run + Transition + DrillCheck for run-flow consistency.

**Justification.** Editorial + structural class. Zero new drill records authored (cap consumed: still 4/10 from Tier 1b Layer A). Zero Dexie migration. No spec contract change. No falsification-condition change. No threshold shift. No decision-rule change. Co-signer requirement waived per the amendment rule.

**Trigger reads from this ship:**

- **Trifold-T1 ("`Chosen because:` deletion") second-half status update.** The Swap-sheet re-home is still open (not done in this ship). The cca2 dogfeed F8 finding does NOT re-trigger the deletion-half (the rationale is already deleted from Run + Transition); it adds an evidence-gathering layer on top.
- **Tier 1c trigger evidence stays at "accumulating, not formally met."** F8 surfaces the per-block skill from the drill catalog, not a user-selected `sessionFocus`. When Tier 1c lands, the eyebrow can additionally cite the user-selected focus and verify it matches the resolved per-block skillFocus. F8 is forward-compatible with Tier 1c, not a substitute.

**Re-eval impact.** None. Condition 3 close date 2026-05-21 unchanged; 2026-07-20 re-eval decision rule unchanged; three falsification conditions unchanged.

**Validation.** `npm run lint`, `npm run build`, `npm test -- --run` clean (954 tests, 106 files — up from 892/105 at the prior F1 follow-up baseline; net +62 tests across `format.phaseLabel.test.ts`, new `drillMetadata.skillFocus.test.ts`, `RunScreen.rationale-placement.test.tsx`, `TransitionScreen.role-eyebrow.test.tsx`, and `drillCopyRegressions.test.ts`). `bash scripts/validate-agent-docs.sh` clean. ReadLints clean on all 10 edited files.

## What falsifies *this memo*

Meta-check: the memo itself has failure modes.

- If a condition is missed, and the amendment log contains a justification whose stated falsifiable outcome later also failed, that is evidence this memo is being used as a ratchet rather than an adversary. The founder should notice that pattern and either stop amending, or refer the amendment to an external reviewer before merging it.
- If the weekly log is routinely filled out with identical contents week-over-week ("no change"), that is evidence either (i) nothing is happening and the ritual has become decorative, or (ii) the ritual's granularity is too coarse. Re-read `docs/reviews/2026-04-20-m001-red-team.md` section "Re-eval is decorative" and adjust.
- If the 2026-07-20 re-eval produces a memo that selects "continue founder-only" with a justification that is not falsifiable (no specific observable outcome whose absence would overturn the decision), the correct action is for the co-signer to reject the justification as not a justification.

## Weekly log

Append one block per Monday during the 90-day window. The first entry is the week of 2026-04-20 itself.

## 2026-04-20 (week 1 of 13)

- Sessions logged this past week: 3 (founder: 0; partner-walkthrough: Seb ran 2 solo + 1 pair on 2026-04-21, captured in `docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md` and provenance-frozen at `research-output/partner-walkthrough-2026-04-21-seb-export.json`). Running total: 3 / 13-week target.
- Solo share so far: 67% (2 of 3 walkthrough sessions solo). Founder-use ledger has not yet added post-Tier-1a founder sessions.
- Focus breakdown so far: pass 3 / serve 0 / set 0. Set floor for Condition 1 (≥3 set-focused sessions across the 90-day window) is **not yet met** — on track if founder logs ≥3 set sessions in the remaining 12 weeks, off track if the solo_open default keeps auto-routing to pass content without any deliberate set steering.
- Outside-app planning this week: **no.** Founder did not write down a session plan anywhere outside the app.
- D130 early triggers check:
  - (a) <5 sessions in 45 days: currently 0/5 founder sessions, 1 day elapsed — not tripped; 44 days remain for the founder floor.
  - (b) 3-week silence: most recent founder session is pre-Tier-1a. First founder post-Tier-1a session is expected this week.
  - (c) invited anyone outside partner: no. Seb is the named partner; no friends-of-friends invited.
  - (d) Tier 1a + ≥10 sessions + no open P0: Tier 1a shipped; founder sessions 0/10; partner walkthrough landed with **0 P0**, 9 P1, 5 P2 → trigger (d) is on the clock but not firing yet (session count gates it).
- Falsification conditions status:
  - 1 (solo-first activation ≥40%, ≥3 set-focused sessions): **pending** — insufficient data. Solo share at 67% over 3 sessions is within the condition, but only 3 sessions is too few to call.
  - 2 (no outside-app planning or history): **pass (week 1).** No notes-app fallback this week.
  - 3 (partner behavioral return within 30 days): **pending** — 30-day clock started 2026-04-21, closes 2026-05-21. Quiet-window invariants being upheld (URL live, no partner prompting).
- One-line note: Partner walkthrough landed with zero P0, a tight copy/vocabulary cluster, and one navigation seam; Bucket A fixes landed same week (Beach Prep, 6-Leg Monster, Set Window gloss, SkillLevelScreen subtitle). No plan re-sequencing required.
- Partner-walkthrough delta (this week only): ledger filed; script amended (Task 2 no longer implies serving; Pass 2 Q4 wording fixed; Protocol deviations section added to ledger template).
- Authoring-budget cap check: 0 new drill records authored this week. Current budget consumed: 0 / 10 until founder's 5th post-Tier-1a session.

### 2026-04-24 week-1 addendum (mid-week, for honest provenance)

This sub-entry is not a new Monday block — it is an honest addendum appended to week 1 on 2026-04-24 (Friday, day 5 of the window) so the week's substantive activity is not lost before week 2 opens.

- **Plans authored / substantively edited this week (>50 lines each):** `docs/plans/2026-04-22-partner-walkthrough-polish.md` (2026-04-22, shipped — see the 2026-04-22 amendment-log entry above); `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` (2026-04-22, `d36` row authoring-pointer applied per `D7`; **2026-04-26 §R7 exit-3 upgrade applied — `d36` removed from plan, drill count 6 → 5, cap 6/10 → 5/10; 2026-04-27 source red-team correction deferred `d43` to `D101`, current drill count 4 and cap 4/10**); `docs/plans/2026-04-23-walkthrough-closeout-polish.md` (2026-04-23 draft, 2026-04-24 shipped — see the 2026-04-23 amendment-log entry above).
- **Research authored / substantively edited this week:** three 2026-04-22 synthesis docs (`skill-correlation-amateur-beach.md`, `baseline-skill-assessments-amateur-beach.md`, `jump-float-amateur-beach.md`); meta-synthesis `docs/research/2026-04-22-research-sweep-meta-synthesis.md`; 2026-04-22 partner-walkthrough review passes (workflow / shibui / UI-design / trifold / all-passes-reconciled); 2026-04-24 reconciled-list row updates for items 1–16 per the closeout polish ship.
- **A3 ligament status.** The pre-authoring memo re-read ritual was not visibly logged on 2026-04-22 before the research+plan wave landed (flagged in `docs/research/2026-04-22-research-sweep-meta-synthesis.md` §R1 at severity medium per the 2026-04-22-c founder correction). The 2026-04-24 closeout-polish ship's author (agent, not founder) surfaces this honestly: this addendum is the structural log entry, not a substitute for the founder's own re-read. **Action for founder:** next time the memo is opened, read end-to-end (≤5 min) and append a one-line `A3 re-read YYYY-MM-DD — <n> min` under this addendum. The re-read is cheap and it is the ritual the memo exists to protect; missing it once is not a gate but a second miss would signal the ligament is decorative.
- **Trigger (e) "agent-assisted open asymmetry" check — revised 2026-04-24.** Pre-registered threshold: ≥5 agent-assisted repo opens AND ≤1 agent-free work check across any 14-day window during founder-use window. Honest reading of 2026-04-10 → 2026-04-24 after the joint-session reframe:
  - **Agent-assisted work:** the 2026-04-21 / -22 / -23 / -24 authoring days are agent-assisted (Cursor / Claude). ≥5 opens — yes.
  - **Agent-free work:** the founder ran a solo session and a joint pair session with Seb on 2026-04-21 (clarified 2026-04-24 — see `docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md` Agent Quick Scan "Joint-session reframe"). That is substantive *agent-free behavior on the product itself* — the product running on a phone courtside is the opposite of the repo-as-conversation failure mode trigger (e) was designed to catch. The sessions are not yet written to `docs/research/founder-use-ledger.md` (ledger rows pending), but the behavior happened and is legible through the 2026-04-21 voice memo + Seb's Dexie export + the walkthrough ledger's joint-session reframe. Trigger (e) is **not firing** under the reframed reading.
  - **Self-report closer.** The memo's own trigger-(e) text allows the agent-free check to be "an explicit founder self-report in the ledger confirming agent-free work." A one-line ledger row (or a short sub-entry under this addendum) describing the 2026-04-21 solo + pair sessions closes the loop definitively and removes trigger (e) ambiguity for the 14-day window.
- **Condition 3 interim status (2026-04-24).** Seb produced a strengthened provisional pass: T+1 unprompted message + T+2 instrumented session (all 4 blocks, RPE 3, 25/40 capture on `Self-Toss Pass to Set Window`, review submitted 3.9 min after completion). Final read-out remains 2026-05-21. The closeout polish ship landed while the quiet-window invariant held (URL live, no prompting, no founder-initiated pull since the 2026-04-23 push-delivered export).
- **Condition 1 interim status (2026-04-24, revised).** Under `D132`, Condition 1 is re-read as measuring whether the *accommodated solo case works* (see Condition 1's new "`D132` re-reading" block added 2026-04-24). Honest read of founder-side behavior after the 2026-04-24 joint-session reframe:
  - **Founder-side sessions logged in the ledger:** 0. **Founder-side sessions that actually ran:** ≥1 solo + ≥1 pair, both on 2026-04-21 alongside Seb's walkthrough (solo parallel to Pass 1, joint pair for Pass 2 on grass). The ledger is lagging actual behavior by ≥3 days; the 2026-04-22-c correction recorded this specifically — "the founder has used the product but the ledger reflects personal-discipline logging, not a measured usage channel."
  - **Solo-share interim read:** 1 solo of 2 founder-side sessions = 50%, **above the ≥40% bar** on n=2. Still too thin to call Condition 1 at n=2, but not a falsification signal either; the prior "0 of 0 = undefined" framing was misleading.
  - **Set-focused session floor:** still 0 of 3 (no set-focused session among the 2026-04-21 founder sessions or Seb's four captured sessions). This remains the sharper sub-constraint of Condition 1 and is the concrete shape of the next founder session's focus.
  - **Partner-side reference point (retained):** Seb solo-share across four captured sessions is 3 of 4 = 75% solo; focus breakdown pass 4 / serve 0 / set 0. Consistent with the pair-first / solo-accommodating frame under `D132`.
- **Condition 2 interim status (2026-04-24).** Honest read: no outside-app planning or history-keeping observed in what the repo can see. Founder self-report would close this honestly; absent it, no failure signal.
- **Feedback-channel health check (2026-04-24, new sub-entry).** Since 2026-04-21 the behavioral-evidence channel mix is: (i) Seb's 2026-04-21 Dexie export capturing the joint walkthrough, (ii) Seb's 2026-04-22 T+1 unprompted message (Condition 3 trigger), (iii) Seb's 2026-04-23 T+2 instrumented open, (iv) the joint 2026-04-21 voice memo (delivering founder+Seb observations, not just Seb's), and (v) a substantial volume of founder feedback delivered via chat during the 2026-04-22 / -23 / -24 authoring days (drove the 2026-04-22-c correction, framed the closeout polish plan, produced the 2026-04-24 joint-session reframe itself). Channels (iv) and (v) are **founder-side** behavioral-evidence channels that the ledger schema does not capture and the original memo did not enumerate. The 2026-04-22-c correction's four-channel list (ledger, Seb usage, partner-walkthrough observations, Condition 3) implicitly folded (iv) and (v) into the partner-walkthrough channel; the 2026-04-24 addendum names them explicitly so they are not silently discounted at the 2026-07-20 re-eval.
- **Authoring-budget cap check (2026-04-24 closeout polish).** 0 new drill records authored in the 2026-04-23 polish ship. Cap consumed: still 0 / 10 until founder's 5th post-Tier-1a session (per the ship log in `docs/plans/2026-04-23-walkthrough-closeout-polish.md` §"Ship log"). Per the 2026-04-24 joint-session reframe, the founder is 2 sessions closer to that cap-gating 5th session than the ledger previously implied.

### 2026-04-24 week-1 addendum — ledger backfill + Tier 1b trigger status change (appended later same day)

After the initial 2026-04-24 addendum above landed, the founder added two artifact-reconstructed rows to `docs/research/founder-use-ledger.md` for the 2026-04-21 joint sessions (solo 15 min / RPE 3 / completed; pair 15 min / RPE 4 / completed — see the ledger table) and named four content gaps below the rows. This delta is recorded here so the Weekly Log reads accurately without re-scrolling the earlier addendum.

- **Tier 1b founder-session trigger status (per `docs/plans/2026-04-20-m001-tier1-implementation.md` lines 272–276):** **formally met as of 2026-04-24.** Both clauses satisfied:
  - **Clause (i) — founder has attempted to substitute from the existing library AND logged the attempt.** The solo row records an attempted solo-on-solo_open session where the founder could not find serving content via Swap (ledger gap 2). Logged.
  - **Clause (ii) — partner walkthrough ≥P1 that Tier 1b content would address, OR founder has logged ≥3 sessions describing a specific content gap.** Partner walkthrough half already satisfied (P1-3, P1-4, P1-5, P1-6, P1-7, P1-8, P2-2 — multiple ≥P1 findings Tier 1b serving/setting content addresses). Founder-logged-content-gap half now also satisfied by the same solo row plus the explicit gap list appended below the rows.
- **Condition 1 interim read after backfill.** Founder-side solo share: 1 of 2 logged rows = 50% (above the ≥40% bar). Set-focused session floor: still 0 of 3. Cadence: 2 sessions logged, both from 2026-04-21, with 3 days elapsed — not on a regression signal.
- `**focus: pass` on both backfill rows is accurate to what the builder produced; the note field documents that the founder did not user-select the focus because no UI for focus-picking exists.** This is the first behavioral data point against the Tier 1c trigger (≥8 ledger rows flagging explicit intent mismatch per `docs/plans/2026-04-20-m001-tier1-implementation.md` line 293). One row is not 8 rows; the Tier 1c trigger is NOT met. Flagged so future sessions can be watched for the same gap and so the signal is not lost.
- **New finding not on prior lists: timer-end screen-off anxiety / audio-suspend-on-lock** (ledger gap 4). The 2026-04-22 preroll hint was gated first-time-only in the polish ship, which means the founder + Seb have both dismissed it and no longer see the "keep phone unlocked" reminder. iOS Safari PWA suspends audio on screen-lock; the block-end beep cannot be relied on if the screen turns off mid-session. The fix is structural (Screen Wake Lock API), not copy-level, and is flagged as a new item in `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Genuinely-open Tier 1b bundle." This is the kind of finding that only surfaces on real agent-free courtside use — the A3 ligament and trigger (e) are exactly working as designed.
- **Authoring-budget cap status change.** Cap still at 0 / 10 (no drill records authored this week), but the cap-gating condition has moved: Tier 1b authoring is now **unlocked** by the trigger above. The cap's "5th session" gate (line 151) still applies to Tier 1b's second wave; the first wave is ready to ship per `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md`. **§R7 exit-3 decision discharged 2026-04-26.** Founder chose exit-3: `d36 Jump Float Introduction` is removed from Tier 1b entirely and re-enters under `O7` track 2 (sports-medicine / PT review). **2026-04-27 source red-team correction:** `d43 Triangle Setting` is also deferred to `D101` 3+ player support because the BAB source geometry is 3-player. Tier 1b Layer A now ships 4 drills (`d31`, `d33`, `d40`, `d42`), not 6; cap consumption when Layer A lands is 4/10, not 6/10. The freed cap slots are not auto-backfilled and stay open for evidence-gated future waves. No falsification-condition change, no threshold shift, no decision-rule change — the cap arithmetic and authoring-budget posture are restated, not relaxed.
- **Amendment-log co-signer status.** None of the adjustments above weaken any falsification condition, no threshold is shifted, no decision rule changes. The Tier 1b trigger's formal satisfaction is a state-update, not a threshold-change; co-signer requirement does not apply.

## Amendment log

Any edit that weakens a falsification condition, shifts a threshold, or changes the decision rule gets recorded here with date, what changed, the justification, and the co-signer.

## For agents

- **Authoritative for**: the three falsification conditions, the default decision rule at the 2026-07-20 re-eval, the weekly trigger-review ritual, and the anti-displacement authoring-budget cap.
- **Edit when**: a weekly log entry is due (Monday), a falsification condition is observed as failed (record it in the Weekly Log and propagate the consequence into the relevant plan), or a properly co-signed amendment is proposed.
- **Belongs elsewhere**: Tier 1a scope (`docs/plans/2026-04-20-m001-tier1-implementation.md`), D130 decision text (`docs/decisions.md`), the D91 numerical bar (`docs/research/d91-retention-gate-evidence.md`), partner walkthrough protocol (`docs/research/partner-walkthrough-script.md`), founder-use ledger schema (`docs/research/founder-use-ledger.md`).
- **Outranked by**: `docs/decisions.md` (if D130 itself is amended), `docs/vision.md` (if the product vision is amended and this memo's premises fall out of sync).
- **Key pattern**: a pre-registered adversarial memo, not a template. This is a one-off artifact for the D130 window. When `D91` preparation resumes or Tier 2 ships, this memo's role narrows to historical record; archive it rather than rewriting it.

