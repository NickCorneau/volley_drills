---
id: M002
title: Weekly Confidence Loop
status: draft
stage: planning
type: milestone
authority: post-M001 self-coached follow-on scope, weekly confidence surfaces, and main-tool evidence bar
summary: "First post-M001 self-coached layer: visible carry-forward, shallow weekly planning, and minimal accumulation that make the app feel worth returning to. Parks the 2026-05-27 design-critique-walk ideation as carry-forward backlog (most survivors are M001-tier; only survivor #1 is M002-direction)."
last_updated: 2026-05-27
depends_on:
  - docs/vision.md
  - docs/prd-foundation.md
  - docs/roadmap.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/decisions.md
  - docs/ideation/2026-05-27-m001-app-wide-walk-critique-followup-ideation.md
decision_refs:
  - D15
  - D22
  - D26
  - D74
  - D123
  - D124
  - D130
  - D137
  - D146
  - D147
open_question_refs:
  - O2
  - O22
  - O23
  - O24
---

# M002: Weekly Confidence Loop

## Agent Quick Scan

- Use this doc for the first post-M001 self-coached milestone: the smallest layer that makes the app feel like a weekly training home rather than a one-session helper.
- This milestone comes **after** `M001` proves the runner loop and **before** any coach-connected build begins.
- In scope: visible carry-forward, shallow next-N planning, minimal weekly receipt, and lightweight accumulation.
- Not for: coach clipboard, full calendar planning, team identity, or rich analytics.

## Why this milestone exists

If `M001` proves that a self-coached user can get through one believable courtside loop, the next risk is not "can they finish a session?" but "does the product become their main training tool?"

A runner can be credible and still fail this bar. If the app ends each session like a dead-end timer, hides too much of its reasoning, or never lets the user feel what is accumulating over time, it will stay useful-but-optional.

This milestone exists to close that gap without turning the product into a dashboard, a spreadsheet, or a coach console.

## Milestone goal

Define the smallest self-coached follow-on that lets a returning user:

1. understand what happened this session
2. understand what the next step is
3. see the smallest useful weekly shape
4. feel that something is in the book
5. keep using the app as their training home without extra admin

## User and workflow target

- Primary user: self-coached amateur beach player who has already completed at least one session
- Core workflow: `Complete -> Home -> next session`
- Success posture: the app feels calm, trustworthy, and worth returning to weekly

## In scope

- A visible carry-forward from `Complete` and `Home` into the next session recommendation
- One bounded deterministic explanation for why the next session stayed the same, got lighter, or got harder
- Shallow next `2-6` session queue inside the existing flow, not a separate week planner or calendar surface
- Minimal weekly receipt: planned-vs-completed sessions, one load proxy, one skill proxy
- Lightweight accumulation surfaces that make "something is in the book" legible without becoming analytics-heavy
- Reuse existing session and review records to power carry-forward and the weekly receipt. **No standalone history surface in this milestone's core scope** — M002 layers carry-forward and the next-`N` queue directly on `ExecutionLog` records, with no prior-history-list precondition. (Note: the original M002 doc text claimed the standalone history list was owned by M001 Tier 2; M001 closed 2026-05-27 by founder executive call without Tier 2 having shipped — see `D147`. The full session history screen carries forward into M002 as a discretionary post-M002-core polish item per the M001 Carry-Forward section below, NOT as a prerequisite for M002's start.)
- Recommendation-first posture preserved: no new profiling gate that delays a believable next session

## Minimal surface contract

- `Complete` owns the immediate payoff: verdict, bounded reason, and next-step cue.
- `Home` owns the default next action: resume today's recommendation or continue from the carry-forward.
- `Queue` owns the shallow next `2-6` sessions view. It is secondary to `Home`, not a new planning destination.
- `Weekly receipt` owns the "something is in the book" readout: planned vs completed, one load proxy, one skill proxy.

This milestone does **not** add a standalone history route, a calendar planner, or a generalized planning surface as part of its core scope. The full session history screen carries forward from M001 Tier 2 (unshipped at M001 closure) as a discretionary post-M002-core polish item per the M001 Carry-Forward section below; M002 plan does not begin work on it until at least one M002 core surface has shipped.

## M001 Carry-Forward (post-2026-05-27 executive closure per D147)

**Authority.** Cross-references `D147` in `docs/decisions.md`. M001 closed 2026-05-27 by founder executive call ahead of the pre-registered 2026-07-20 D130 re-eval. The closure absorbs M001's open obligations into M002's discretionary post-M002-core follow-on scope (Group A below) and preserves others under their existing routing (Group B below). **M002 core scope (weekly receipt + next-`N` queue + carry-forward + bounded explanation per `D124`) is unchanged.** M002 plan does NOT begin work on any Group A item until at least one M002 core surface has shipped — this discipline protects M002 from becoming "M001 leftovers + a weekly receipt."

### Group A — Absorbed into M002 scope (discretionary post-M002-core follow-on)

- **Tier 2 polish surfaces** — `See why this session was chosen` modal, richer summary copy on `Complete`, recommendation-first onboarding polish to the `D123` posture. Gate unlocked 2026-05-23 (Condition 3 PASS) but zero of 4 surfaces shipped before M001 closed. The full session history screen lives here too but **M002 does NOT depend on it as a prerequisite** — M002 layers carry-forward + next-`N` queue directly on `ExecutionLog` records per the In-scope section above.
- **Friends-of-friends cohort question** — deferred from M001's 2026-07-20 re-eval. M002 may pick up the question if M002's own evidence supports cohort expansion. The 2026-07-20 D130 re-eval still fires per the adversarial memo's schedule with reframed scope (D130 founder-use window close + cohort decision on M002 evidence).
- **Attack-content track shape question** — deferred from the 2026-05-27 attack-track action-stack requirements doc (Step 1 canonical-drill probe / FIVB 5.1 Stand and Spike) per Root B feasibility blockers. F1 first-class content-gap-evidence (per `docs/research/2026-05-27-attack-content-and-solo-friction-feedback.md`) carries forward as input to M002's content-priority decisions. M002 owns the decision *whether* to author a future attack-chain decision packet (D148-shape) — the schema work itself (adding `attack` to `SkillFocus`, `chain-attack` constant, `sessionFocus` extension) requires its own decision packet under D143's authorization boundary and is NOT inside M002's scope.

### Group B — Preserved under existing routing (M002 does NOT absorb ownership)

- **Conditional Phase 2B per-drill capture shapes** (`points-to-target`, `pass-grade-avg`, `composite`) — continues to be owned by `docs/status/post-m001-content-backlog.md` with original founder-trigger conditions. Phase 2A streak gate cleared 2026-05-23; M001 closure does not change Phase 2B routing.
- **Tier 1b reserved-slot kill-or-author contract** — continues to be owned by `docs/status/post-m001-content-backlog.md` (6 reserved slots, hard expiry 2026-07-20). Cap discipline binds at 2026-07-20 **independent of M001 status** — M001 closure does NOT dissolve the contract. `cap_status_must_be_consistent` validator behavior in `scripts/validate-agent-docs.sh` is unchanged.

## Explicitly out of scope

- Coach clipboard or any coach-facing UI
- Full periodized calendar planning
- Durable `Team` object or persistent pair identity
- Rich analytics, benchmarking, or dashboards
- Open-ended AI coach chat
- Marketplace, academy, or roster tooling

## Planning defaults and assumptions

- Keep the surface calm. This milestone should deepen the product without making it feel heavier.
- Weekly confidence matters more than rich history. Show only the smallest layer that changes what the user does next.
- For M002, the planning metaphor is a shallow next `2-6` session queue. Broader week-shape or planner work stays in Phase 1.5 / `O2`.
- A weekly receipt is a confidence and investment surface, not an analytics destination.
- Deterministic reasoning should stay one-line and useful. Do not ship explanation density for its own sake.
- Use only already-captured session and review data for the weekly receipt and carry-forward. No new baseline-test flow, skill-assessment intake, or PoST framing in this milestone.
- The core quick-start loop must remain intact. If a new longitudinal surface slows session start or adds setup friction, it failed the milestone.

## Planning readiness

This milestone is ready to hand to implementation planning when:

- a returning user can see what to do next without rebuilding from scratch
- the next-step explanation is specific enough to trust and small enough not to feel like homework
- the queue and weekly receipt each have one clear job and do not require a new planner or history surface
- the coach clipboard is still clearly downstream of this self-coached layer, not competing with it

## Post-build validation

After implementation, this milestone is working if:

- the extra longitudinal layer does not degrade quick-start speed or review completion
- the weekly surface feels useful without turning into a dashboard
- users reuse the suggested next-step path rather than rebuilding from scratch
- users actually open and use the queue / weekly receipt rather than ignoring it
- at least one user reports the product replaced or meaningfully reduced notes, PDFs, or memory as their training workaround

## Likely design artifacts

Before implementation planning, this milestone likely needs:

- a shallow planning / weekly confidence spec
- a minimal weekly receipt / accumulation spec
- a home / complete carry-forward spec that covers next-step reasoning

Whether those live as one spec or a small cluster depends on how much the surfaces share state and copy.

## Review questions

- What is the smallest accumulation layer that makes the app feel like a training home?
- Which part of the weekly view actually changes behavior, and which part is dashboard noise?
- How much explanation is enough to build trust without slowing the loop down?
- What should remain hidden until the user asks for more detail?

## Carry-Forward Ideation Backlog

Parked here so the 2026-05-27 design-critique-walk ideation pass is not lost. **Authority caveat:** this section is a parking lot, not an authoritative scope claim — most survivors are M001-tier (D130 founder-use window, polish, or design-system architecture) and should be re-triaged into M001 polish / `docs/status/m001-validation-overhang.md` or `docs/status/post-m001-content-backlog.md` when picked up. Only survivor #1 is genuinely M002-direction-level. The full ideation doc is the source of truth: `docs/ideation/2026-05-27-m001-app-wide-walk-critique-followup-ideation.md`.

### Upstream source

2026-05-27 end-to-end walk-through critique (onboarding → setup → safety → run → transition → drill check → review → complete → settings → returning-user home). The critique surfaced 10 themes. The ideation pass dispatched 6 frames + grounding agents and filtered 46 raw candidates to 7 survivors. The critique also named what works (Safety pre-disclosure copy, the 72px tabular-nums timer, the one-tap repeat on Home, the trust footer); those wins are inputs to the survivors below.

### Survivor triage

| # | Title | Confidence | Complexity | Belongs in |
|---|-------|-----------:|------------|------------|
| 1 | Collapse the Between-Drill Region (continuous run-flow; demote `JustFinishedPill` to a row-level marker; ambient capture) | 75% as direction / 30% as ship-this-quarter | High | **M002** (architectural direction); needs its own brainstorm + would re-open V0B Layer-A |
| 2 | Recommended Is a Posture, Not a Focus Value (typed-boundary fix in `inferSessionFocus`; `ChoiceRow prominence="recommended"` primitive) | 88% | Medium | **M001 polish** (ships within D137 spine); intersects 2026-05-04 setup-screen-default-path-polish ideation |
| 3 | Named Surface Tokens + Demote the Pill to a Status Dot (Material-3-style surface roles + `volleycraft/no-inline-primitive-drift` rule) | 85% | Medium-High | **M001 design-system architecture**; disagrees with the user's first-priority "restore pill styling" |
| 4 | Pre-Disclosure System Slot + Editorial Voice Lint (promote Safety's `ChoiceSection description` pattern + content lint) | 80% | Medium | **M001 polish** + system-leverage |
| 5 | Founder-Use Mode Means Diagnostics Are Product (invert build-ID finding; structured spine label + inline D130 condition status) | 65% | Low → Medium | **M001 / D130 window** (until 2026-07-20); auto-hides after re-eval |
| 6 | Still-Learning Chip Is the Honest-Answer Attractor (audit DrillCheck middle-bias; founder ledger shows three pair drills with zero streak captures) | 70% | Low → Medium | **M001 validation-integrity** (measurement read at the source of D134 / D130 Condition reads) |
| 7 | When Does DrillCheck Appear? (skip when no streak metric / capture target; tactical landing for #1) | 80% | Low-Medium | **M001 ships this week** (the tactical landing that buys time for #1's brainstorm) |

### Sequencing read

- **#7 → #1** is the smart sequence: #7 ships this week as the tactical landing inside M001 polish; #1 is the M002 architectural direction. Doing #7 well buys time to brainstorm #1 properly.
- **#2 + #3** share infrastructure intent (typed-boundary fix + named-token primitive). Can ship in parallel inside M001 but their tests and lints will brush against each other; coordinate timing.
- **#4 + #5** are voice/posture moves that make implicit project values (consequence-before-commit voice; D130 founder posture) load-bearing in code rather than discretionary in copy.
- **The 2026-05-04 setup-screen-default-path-polish ideation** is partially superseded by survivor #2 — its "Optional Focus Cue" and "Default Confidence Line" should be marked `Superseded` if #2 advances.

### Re-triage trigger

When this section is picked up, the first move is **not** "implement these as M002 work." It is:

1. Move survivors #2 / #3 / #4 / #5 / #6 / #7 into `docs/status/post-m001-content-backlog.md` (or their respective M001 polish surfaces) and remove them from this section.
2. Keep survivor #1 here as the M002 direction-level seed; pair with `ce-brainstorm` against the existing M002 in-scope list (carry-forward, queue, weekly receipt) to check whether collapsing the between-drill region changes the carry-forward shape.
3. Re-read the rejection summary in the ideation doc — at least one rejected candidate (`ScreenFooter typed action manifest`) becomes a survivor if/when #1 is taken seriously.

### Cross-references

- `docs/research/founder-use-ledger.md` — measurement evidence behind survivor #6
- `docs/solutions/2026-05-10-drill-first-time-runnability-system.md` — READ-DO/DO-CONFIRM frame; intersects survivors #1 and #7
- `docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md` — survivor #2 must respect this spine; survivor #1 explicitly does not
