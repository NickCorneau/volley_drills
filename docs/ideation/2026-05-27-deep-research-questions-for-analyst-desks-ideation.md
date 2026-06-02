---
date: 2026-05-27
topic: deep-research-questions-for-analyst-desks
focus: which (if any) external analyst-brief topics would push Volleycraft forward, beyond what dogfood or near-term cohort evidence can resolve
mode: repo-grounded
---

# Ideation: Deep Research Questions Worth Commissioning to Analyst Desks

## Grounding Context

### Project state (2026-05-27)

- M001 (Solo Session Loop) **closed 2026-05-27** via founder executive call.
- M002 (Weekly Confidence Loop) is next milestone, draft/planning. Scope: visible carry-forward from Complete → Home → next session; shallow 2-6 session queue; minimal weekly receipt (planned vs completed + one load proxy + one skill proxy); deterministic 1-line "why this session changed" explanation.
- D130 founder-use window through 2026-07-20 (~8 weeks). Currently 2 users only: founder + Seb.
- D91 cohort retention gate **deferred, not dropped**. Cohort decision at 2026-07-20 based on M002 evidence.
- Phase 1.5 (multi-week planning, baseline tests, periodization expansion) is post-M002.

### Prior analyst briefs (2026-04-22, all returned)

Settled by literature synthesis from three vendors each, reconciled into curated notes under `docs/research/`:

1. **Cross-skill correlation** → per-skill vector design default (r ≈ 0.35–0.50).
2. **Baseline skill assessments** → serve baseline + partner-mode primary for pass/set; solo-no-wall is control, not baseline.
3. **Jump-float introduction protocols** → conservative 3×4=12 first-exposure + 8 do-not-ship-without-physio-input items.

Briefs live at `docs/research/briefs/` in self-contained vendor-facing format: no internal jargon, no decision IDs, no tier names, no plan references. Vendors get zero prior project context. See `docs/research/briefs/README.md` for conventions.

### Documented risk frames

- **"Research-velocity substitution failure mode"** (named in `docs/research/2026-04-22-research-sweep-meta-synthesis.md`): research-heavy periods with zero founder-use-ledger advance are warning signs. Every candidate below was filtered against the substitution-check question: *could 2-4 more weeks of dogfood, or the 2026-07-20 D91 cohort, resolve this just as well?*
- **"Conservative-wins-on-safety"** for safety-bearing specs.
- Generative AI excluded from critical path (P7).

### Open questions still alive (potential research targets)

- **O1**: Coach premium model (deferred to later phase).
- **O7**: Expert safety reviews needed before scaling beyond testers (8 do-not-ship items inherited from jump-float brief).
- **O11**: First-run screen count + copy (partly answered).
- **O12**: Min scored-contact threshold + self-scoring agreement for binary progression (partly answered; biphasic + outlier-anchoring mechanisms still open).
- **O17**: One-tap fit question.
- **O20**: Drill content as publishable artifact.
- **O21**: Per-skill user-level taxonomy. Sub-q (a) answered. Sub-q (b) state-establishment mechanism and (c) storage shape still open as Phase 1.5 decision points.
- **O22**: Per-session goal capture (BAB Coaches Guide Essay 3) for M002 — coach-pedagogy translation unclear.
- **O23**: Forward-looking outcome promise (BAB Essay 2) for M002 — paired with O22.

### Where briefs have landed value historically

1. Resolved a binary architectural decision the team was stuck on (skill correlation → per-skill vector).
2. Provided defensible safety parameters under regulatory / medical uncertainty (jump-float).
3. Ruled out a candidate cleanly (Lidor 2007 fatigue overlay dropped on null-result grounds).

### Where briefs would NOT land value (substitution failure)

- The question is fundamentally about a small set of users' lived behavior (dogfood territory).
- The answer would not change any decision currently in flight or near-term.

### Ideation method

Dispatched 6 parallel ideation sub-agents (pain & friction / inversion-removal-automation / assumption-breaking / leverage & compounding / cross-domain analogy / constraint-flipping) — each generated ~8 candidates with required `direct`/`external`/`reasoned` warrant tags, meeting-test, decision-unlocked, and substitution-check fields. Returned 40+ raw candidates plus a cross-domain summary. Orchestrator merged into 20+ thematic clusters, then critiqued each against the rejection criteria from `references/post-ideation-workflow.md`. Survivors below. Cross-frame convergence was treated as positive signal but not as automatic survivorship — each survivor independently passes warrant + meeting-test + substitution-check.

## Ranked Ideas

### 1. The keystone weekly-receipt metric for M002

**Description:** A vendor memo synthesizing competitive-app evaluations, HCI / quantified-self literature, and adjacent skill-sport / language-learning / habit-app retention research on **which single self-tracked metric** — surfaced weekly — most reliably co-predicts both (a) 8-12 week adherence and (b) measurable improvement at amateur skill-sport low-volume (1-3x/week). Ranked candidates (session count, perceived effort, perceived confidence, technical self-rating, weekly variance, drill-completion rate, weakest-skill contact count, sRPE-week-sum, planned-vs-completed ratio, etc.) with documented over-instrumentation failure modes. Distinguishes endurance/strength evidence (rich) from amateur skill-sport (thin).

**Warrant:** `direct:` M002 in-scope item is "minimal weekly receipt (planned vs completed + one load proxy + one skill proxy)" per `docs/milestones/m002-weekly-confidence-loop.md`. The "what single metric predicts adherence + improvement" question is explicitly named as an under-explored area. The receipt picks are load-bearing — every future analytics, progress, or notification surface inherits them. **4-frame convergence** (pain, inversion, leverage, constraint-flip).

**Rationale:** Picking sRPE-week-sum or session-count by intuition, when (say) drill-completion-rate has stronger amateur-adherence-predictive validity, would mean the weekly receipt is metric noise instead of behavior-change leverage. Resolving this once compounds into M002 receipt + Phase 1.5 dashboards + cohort-gating success criteria + every future copy / notification decision.

**Downsides:** Risk that the literature on amateur skill-sport apps is thin enough that the answer comes back "literature is absent" — though that itself is a useful finding for justifying which proxy to ship as the team's bet under uncertainty. Also: there's a real risk this becomes the kind of brief that surfaces a "best" metric the team disagrees with on aesthetic grounds, so the deliverable spec should require a ranked menu with decision-criteria rather than a single recommendation.

**Confidence:** 85%
**Complexity:** Medium
**Status:** Unexplored
**Decision unlocked:** M002 load-proxy + skill-proxy picks; downstream all analytics/progress surfaces; D91 cohort instrumentation criteria.

---

### 2. Subjective skill-confidence measurement validity for amateur athletes

**Description:** A vendor memo on the psychometric / sport-psychology literature for self-rated skill confidence and self-efficacy in adult amateur athletes — what scales exist, what reliability/validity floors have been demonstrated, what response formats (Likert, VAS, descriptive anchors) hold up under repeated weekly self-administration, which framings collapse under low-stakes self-tracking. Distinguishes state-confidence (today) from trait-confidence (general) and surfaces known failure modes (recency, mood, soreness, last-session-outcome confounds, Dunning-Kruger-style novice overestimation, plateau-blindness in mid-experience players).

**Warrant:** `direct:` O21 sub-q (b) state-establishment mechanism is open and gates the per-skill user-level taxonomy storage shape (`docs/decisions.md` O21); O23 (forward-looking outcome promise) asks whether to ship a "by end of practice you should feel more confident" promise — only pair-able with a receipt if confidence is a defensible weekly readout, not noise. M002's "one skill proxy" pick (`docs/milestones/m002-weekly-confidence-loop.md`) requires this. The Mabe & West 1982 athletics self-scoring anchor (r ≈ 0.47) is already cited in `docs/research/baseline-skill-assessments-amateur-beach.md` but covers *performance* self-scoring, not *confidence* self-rating — a different psychometric question. **3-frame convergence** (pain, inversion, leverage).

**Rationale:** If weekly self-confidence is dominated by mood/recency, M002's "one skill proxy" must be a *behavioral* metric (e.g., weakest-skill session count, adherence to recommended drills) rather than a confidence Likert. If it has reasonable construct validity with specific framing, it's the cheapest and most user-meaningful weekly readout and pairs cleanly with O23's outcome-promise frame. The whole roadmap is leaning toward subjective rollups (M002 → Phase 1.5 baseline-test rollups → all future review surfaces) — getting the measurement primitive right *once* is the highest-leverage single decision in the measurement layer.

**Downsides:** Overlaps with #1 on the M002 skill-proxy question — they could be commissioned as a single brief with two questions, but the literatures are distinct (HCI/quantified-self vs sport psychometrics) and combining risks shallow treatment of both. Better as two separate briefs that coordinate on which proxy ships.

**Confidence:** 80%
**Complexity:** Medium
**Status:** Unexplored
**Decision unlocked:** M002 skill-proxy field choice; O21(b) state-establishment direction; O21(c) storage-shape hints; downstream all review surfaces.

---

### 3. Coach-pedagogy translation to self-coached / app-mediated practice (O22 + O23)

**Description:** A vendor memo on the empirical pedagogy evidence (sport coaching, education psychology, behavior change, adjacent self-coaching products) for whether two specific coach-presence techniques retain their behavioral effect when delivered self-administered through an app, or whether the effect is dominated by coach presence / interpersonal accountability: (a) athlete-set per-session goal aligned to the practice focus, and (b) coach-stated forward-looking outcome promise ("by the end of practice you should feel more confident in this skill"). If they translate, what framings have shown durable effect; if they don't, what self-administered analogues have replaced them in successful self-coached programs.

**Warrant:** `direct:` O22 and O23 are both alive in `docs/decisions.md`, both gating M002 surface decisions, and both currently underdetermined on the question "does the coach pedagogy translate or not?". The BAB Coaches Guide is the team's canonical pedagogy reference but is coach-frame, not self-coached frame. The source-archive note explicitly says these BAB items were captured for "a post-M001 weekly-confidence surface" — they are *now* in scope. **2-frame convergence** (pain, leverage).

**Rationale:** Both O22 and O23 ship/cut decisions hinge on whether the underlying mechanism is coach-presence-dependent (in which case the app should not pretend to replicate them) or translatable (in which case the team needs the empirically successful framings to avoid shipping a hollow imitation). Conflicts with P11 ("recommend before you interrogate") and M002's "core quick-start loop must remain intact" make it expensive to ship and then walk back. The memo also compounds into all future review-surface design and any Phase 2 coach-clipboard work.

**Downsides:** Pedagogy literature is dense and vendor synthesis quality varies more than for sports-medicine briefs — deliverable spec must require named studies with effect sizes, not opinion summaries. Also: this is the most "translatable across motor-skill domains" of the survivors, so vendor risk is lower — most adjacent domains (music, language) have published self-coaching translation work.

**Confidence:** 80%
**Complexity:** Medium
**Status:** Unexplored
**Decision unlocked:** O22 (ship per-session goal capture y/n, and where); O23 (ship outcome-promise pair y/n, and where); downstream all M002 reflection surfaces + Phase 2 coach-clipboard hypothesis grounding.

---

### 4. Carry-forward and main-tool-conversion patterns in self-coached training apps

**Description:** A vendor memo synthesizing competitive UX evidence, published cohort analyses, app-store retention reports, founder retrospectives, and academic HCI literature on (a) continuity-across-sessions patterns in solo training/health apps that achieved "main-tool" status (i.e., users self-report replacing notes, spreadsheets, paper logs), (b) which behavior-change intervention surfaces — outcome prediction, weekly review, streak-with-recovery, intention-implementation prompts, calendar commitment — actually move adherence in self-directed adult amateur 1-3x/week populations vs which look helpful but don't, and (c) what early-cohort behavioral signature predicts main-tool conversion. Distinguishes vanity metrics from leading indicators; surfaces documented post-mortems where streaks reduced retention after a miss or where "weekly receipt" patterns felt paternalistic.

**Warrant:** `direct:` M002 explicit scope includes "visible carry-forward from Complete → Home → next session" (`docs/milestones/m002-weekly-confidence-loop.md`); D91 retention gate's success criterion is "users report the product replaced or meaningfully reduced notes/PDFs/memory" — a literal main-tool-conversion question; M002 post-build validation includes "at least one user reports the product replaced or meaningfully reduced notes, PDFs, or memory as their training workaround." Listed as an under-explored gap in grounding. **2-3 frame convergence** (pain, leverage, cross-domain).

**Rationale:** Carry-forward is one of the two highest-friction M002 UX decisions and the surface most likely to feel paternalistic or arbitrary if mis-designed. A memo lets the team pick a carry-forward pattern with prior-art warrant *before* D91 cohort exposure, rather than learning what doesn't work from a one-shot cohort. Also turns the aspirational "feels like training home" success bar into a measurable target — informs cohort-gate threshold definition at 2026-07-20.

**Downsides:** Broad scope — combines two related but distinct questions (UX patterns vs intervention efficacy). Deliverable spec should require explicit separation between "what patterns earned main-tool status" (descriptive evidence) and "which interventions causally moved adherence" (mechanism evidence). Risk of becoming a kitchen-sink memo if scoped poorly. Partial substitution: the 2026-07-20 cohort will validate one chosen pattern, but cannot survey alternatives.

**Confidence:** 75%
**Complexity:** Medium-High
**Status:** Unexplored
**Decision unlocked:** M002 carry-forward UX shape; D91 retention-gate predictions and pre-registered "main-tool" success-criterion operationalization; informs cohort-decision criteria at 2026-07-20.

---

### 5. Pair-coupling effects on adherence and retention in recreational adult skill-sport

**Description:** A vendor memo synthesizing behavioral-health, sport-sociology, and exercise-adherence evidence on how *pair coupling* (shared partner, joint scheduling, paired practice obligations) affects adherence and dropout in recreational team-sport and dyadic-sport adults. Cross-domain inputs: doubles tennis/badminton/pickleball, climbing partners, partner dance, partner-yoga, two-up motorsport, paired exercise programs. Specifically: does pair-coupling raise adherence relative to solo by how much; what are the dominant failure modes (partner unavailability, asymmetric commitment, partner skill divergence, breakup); what design moves in adjacent apps documented buffering of those failure modes; what is the prevalence of stable training dyads vs rotating partners vs "pair-of-the-day" in amateur scenes.

**Warrant:** `direct:` Volleycraft identity is pair-first (P13 in `docs/vision.md`) — load-bearing claim. Most existing fitness-app retention literature the team has implicitly imported is solo-frame; the product is not. `docs/research/persistent-team-identity.md` already covers tooling for dyad identity but does NOT cover *adherence dynamics* of dyads. Under-explored area named in grounding. **5-frame convergence** (pain, inversion, assumption, leverage, constraint-flip) — the highest cross-frame signal in the candidate set, alongside periodization.

**Rationale:** If pair-coupling materially raises adherence in adjacent dyadic sports, M002's weekly receipt and Phase 1.5 planner should both prioritize pair-mode artifacts (joint planned-vs-completed, partner-acknowledged carry-forward). If pair fragility (partner unavailability, asymmetric engagement) is the dominant retention risk instead, the design needs explicit solo-resilience for partner-absence weeks. If pair stability in amateur scenes is genuinely low (<4 weeks median), the strategic frame may shift from "build for the dyad" to "build for an individual whose partner is variable" — which would inform M002 default mode, D91 cohort design, and the entire pair-first frame defensibility.

**Downsides:** Frame-inversion findings are politically expensive even when correct — a brief that comes back saying "pair-first may be wrong frame for amateur scene" forces a strategic conversation the team may not have appetite for inside D130. Mitigation: scope deliverable to "evidence per question" rather than "recommend a frame." This is also the most ambitious of the survivors — the literature is genuinely cross-domain and synthesis quality will vary.

**Confidence:** 75% (would land value; 60% on a clean answer)
**Complexity:** High
**Status:** Unexplored
**Decision unlocked:** Pair-mode feature prioritization in Phase 1.5; whether M002 weekly receipt earns a pair-aware variant; D91 cohort design (pair cohort or paired-solo cohort); P13 frame defensibility.

---

### 6. Periodization signal at 1-3 sessions/week for amateur skill-sport (or "below noise floor")

**Description:** A vendor memo on the sport-science / applied-coaching literature for block-, concurrent-, or contextual-interference-style periodization specifically at the 1-3 sessions/week amateur cadence in skill-dominant sports (volleyball, racquet sports, climbing, martial arts, golf, dance). The session-level sRPE work is settled in `docs/research/srpe-load-adaptation-rules.md`; the open question is whether classical periodization carries *measurable* effect at this volume, what minimum-viable block structure applies, and whether the rich endurance/strength periodization literature translates or actively misleads at this regime. Explicit treatment of the gap where elite/sub-elite evidence dominates and the amateur low-frequency slice is buried in applied-coaching gray literature.

**Warrant:** `direct:` `docs/research/periodization-post-framework.md` is an explicit Phase 1.5 stub awaiting grounding; O2 ("How opinionated should early multi-week planning be?") is alive in `docs/decisions.md`; M002 carry-forward queue UX implicitly assumes a continuity model that block periodization would inform. **5-frame convergence** (pain, inversion, assumption, leverage, constraint-flip) — tied for highest cross-frame signal.

**Rationale:** A "below noise floor" finding *kills* a major Phase 1.5 candidate (multi-week planner) and reclaims that complexity budget — which is a high-leverage finding even if uncomfortable. A "yes but only via mechanism X" finding tells the team what to actually build instead of generic blocks. Either way, the answer compounds into Phase 1.5 plan-builder shape + M002 carry-forward queue framing + downstream all multi-week visualization decisions + future "what stage are we in" copy.

**Downsides:** Timing risk — Phase 1.5 is post-M002 and may be 3-6 months away. Commissioning now risks the memo being stale by use-time, OR being used as research-as-procrastination on M002 ("we need to wait for periodization before scoping carry-forward queue"). Mitigation: explicit scope-constraint in deliverable that the memo informs Phase 1.5, not M002.

**Confidence:** 80%
**Complexity:** Medium-High
**Status:** Unexplored
**Decision unlocked:** Phase 1.5 multi-week planner go/no-go; O2 (how opinionated multi-week planning is); M002 carry-forward queue continuity framing; informs whether catalog/scope work should anticipate multi-week structure.

---

## Waitlist (commission-when-pressure-rises)

### 7. Self-scoring agreement floors + bias-correction mechanisms (O12 follow-up)

**Description:** Direct continuation of `docs/research/baseline-skill-assessments-amateur-beach.md`, which flagged biphasic (vendor 2 mechanism) and outlier-anchoring / best-moment (vendor 3 / Guenther 2015) as candidate open questions against monotonic bias correction, and which noted "no volleyball-specific self-scoring evidence exists." Memo would synthesize inter-rater / intra-rater reliability literature in amateur self-scored skill performance, the minimum trials needed before binary judgments stabilize, and which mechanisms (paired scoring, biphasic scoring, outlier-anchoring, calibrated examples, retrospective re-scoring) have demonstrably narrowed disagreement bands in adult non-experts.

**Warrant:** `direct:` O12 in `docs/decisions.md` lists "min scored-contact threshold + self-scoring agreement" as open; baseline-assessments brief explicitly parked biphasic + outlier-anchoring as follow-up questions; D104 currently uses a placeholder. **2-frame convergence** (assumption, leverage).

**Rationale:** Resolves O12 directly; format mirrors the successful prior-brief continuation pattern; would settle the binary-progression-rule scoring spec.

**Downsides:** Lower urgency than M002-direct candidates — D104's placeholder is functional. Partial substitution: founder/Seb pair-mode dogfood gives one paired-rater data point. Lower confidence the answer would clearly change current spec.

**Confidence:** 70%
**Complexity:** Medium
**Decision unlocked:** O12; D104 placeholder replacement.

---

### 8. Adult recreational beach VB injury epidemiology + 3-tier risk catalog (O7 follow-up)

**Description:** Sports-medicine synthesis producing a tiered risk catalog for amateur beach volleyball technical elements: (a) routine teachable risk, (b) requires explicit safety scaffolding but self-coachable, (c) do-not-ship-without-physio-input. Cites injury-epidemiology data for beach volleyball amateurs (jump-related, shoulder, ankle, lumbar) and conservative defaults for first-exposure protocols. Format mirrors successful jump-float brief.

**Warrant:** `direct:` O7 currently has 8 do-not-ship-without-physio-input items inherited from the jump-float brief; conservative-wins-on-safety principle is explicit. **2-frame convergence** (inversion, assumption).

**Rationale:** Removes a recurring per-skill safety debate from the team's future; defends scaling beyond testers under D91-deferred posture; format-match to prior brief.

**Downsides:** O7 is parked behind D91 (scaling beyond testers), and the team has the 8 jump-float items as a working framework. Not urgent. Premature to fire before D130 window closes — the brief may sit unconsumed until scaling pressure resumes.

**Confidence:** 75%
**Complexity:** Medium
**Decision unlocked:** O7 scope; future catalog-expansion safety workflow.

---

## Rejection Summary

| # | Candidate | Reason Rejected |
|---|-----------|-----------------|
| R1 | Indoor → beach volleyball skill transfer matrix | Value depends on Volleycraft having a significant indoor-cohort entry path, which is currently unconfirmed. Could become a follow-up if indoor cohort emerges; fold into a future O21 brief if needed. |
| R2 | Coach-gradient prevalence in adult amateur beach VB | Substitution check too weak — informal scene survey via founder/Seb networks or D91 cohort sampling can address segmentation question; doesn't need analyst-desk synthesis. |
| R3 | Local-first vs cloud-first feature-ceiling prior art | Premature — no immediate feature pressure forces this architectural question; M002 doesn't trigger it. Revisit when pair-sync or AI-explainer becomes urgent. |
| R4 | Catalog-size dose-response (~50 vs 10 vs 500) | Premature — Phase 1.5 catalog growth is not yet active; current ~50 is functional. Revisit when catalog growth pressure resumes. |
| R5 | AI explainer / critic wiring in non-critical path | Without active feature pressure forcing the question, this risks becoming a Pandora's-box brief that introduces complexity without unlocking a needed decision. Conflicts with the substitution-failure posture in a different way: research-as-feature-creation. P7 is already a defensible stance; the burden is on a triggering feature to commission this, not on principle-revisitation. |
| R6 | Minimum expert-touch protocols (async coach lane) | Premature — O1 is deferred to later phase; D130 re-evaluation at 2026-07-20 doesn't depend on this. Revisit when O1 becomes active. |
| R7 | Pre-session / post-session reflection mode vs courtside | Too specific UX question for analyst brief; partially dogfoodable; fold into #4 if M002 reflection-surface pain emerges. |
| R8 | Amateur progression milestones over 6-18 months | Phase 1.5 baseline-test prep timing; fold into #6 (periodization) which already includes "what does good progression look like at this volume." |
| R9 | Drill self-selection bias / weakest-skill avoidance in amateurs | Partially dogfoodable from a small cohort; can fold into #4 on the intervention-efficacy side; not standalone-worthy. |
| R10 | Intra-session practice-design (blocked vs random vs constraint-led) | Fold into #6 (periodization) on the practice-structure dimension; not standalone-worthy. |
| R11 | Habit formation + cue architecture for low-frequency practice | Distinct angle but folds into #4 (carry-forward / main-tool conversion + adherence-intervention efficacy) on the cadence-and-cue side. |
| R12 | Sparse-data confidence narratives (golf-analytics analogy) | Fold into #4 (UX) or #2 (measurement validity). Not standalone-worthy. |
| R13 | Non-streak wellness receipts (calm-shibui receipt shapes) | Fold into #4 (UX patterns) — specific format question better answered as part of broader main-tool-conversion synthesis than as standalone brief. |

## Method note

Dispatched 6 parallel ideation sub-agents on the inherited model, each working from a different frame (pain & friction / inversion-removal-automation / assumption-breaking / leverage & compounding / cross-domain analogy / constraint-flipping). Each was passed the consolidated grounding above plus a structured per-idea contract requiring tagged warrant (`direct:` / `external:` / `reasoned:`), meeting-test, decision-unlocked, and substitution-check fields. 40+ raw candidates returned (cross-domain agent's full list was lost in transit but its summary covered the same conceptual territory already touched by the other five frames). Orchestrator clustered candidates into 20+ themes, then applied the rejection criteria from `references/post-ideation-workflow.md` plus the project-specific "research-velocity substitution" filter from `docs/research/2026-04-22-research-sweep-meta-synthesis.md`. Cross-frame convergence was treated as positive signal but not as automatic survivorship — each survivor independently passes warrant + meeting-test + substitution-check.

Survivor count (6 top + 2 waitlist) is at the upper end of the skill's 5-7 target. The strict-pass option would cut #5 and #6 (the most ambitious and Phase-1.5-horizon candidates) to land at 4 top + 2 waitlist; the honest read is that all 6 top survivors pass independently and the choice to commission fewer is appetite-driven, not warrant-driven.
