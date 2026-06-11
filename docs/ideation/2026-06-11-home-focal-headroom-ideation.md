---
date: 2026-06-11
topic: home-focal-headroom
focus: "Home has no focal headroom left — how does Home scale under the M002 series (rung, score, goals, roster, attack, D151 readiness) without breaking the one-focal-zone design language?"
mode: repo-grounded
related:
  - docs/design/reviews/2026-06-11-red-team-design-language-review.md
  - docs/design/reviews/2026-06-11-design-language-deep-pass.md
  - docs/ideation/2026-06-11-what-to-build-next-ideation.md
  - docs/brainstorms/2026-06-03-m002-thin-spine-and-milestone-series-requirements.md
---

# Ideation: Home Focal Headroom — Scaling Home Under the M002 Series

> Run 2026-06-11 at founder request following the same-day red team (graded the one-focal-zone contract B−: "Home has focal competition") and the post-D152 fresh-eyes pass (the focal slot is now fully claimed by the last_complete plan card). 6 ideation frames → 48 raw candidates → 9 dedupe clusters → 7 survivors. **Founder selected the recommended composition's "covenant + ledger founder session" as the brainstorm seed on 2026-06-11.** Raw candidates scratch: `/tmp/compound-engineering/ce-ideate/d84452ef/`.

## Headline

The survivors are complementary **layers of one architecture**, not alternatives — and the design language already contained the answer. The tokonoma practice was only half-imported: a real tokonoma *rotates* its display seasonally and stores everything else in the kura (storehouse). Home adopted "one alcove" but never the rotation or the storage. The recommended composition (below) completes the practice: covenant (one alcove) + ranked occupancy (rotation, when needed) + quiet-dark periphery + kura (when earned), with the plan as the default mouthpiece throughout.

## Grounding Context

### Codebase Context

- **Home today** (`HomeScreen.tsx` / `useHomeScreenState.ts` / `domain/homePriority.ts`): header → UpdatePrompt → thin-spine cluster (optional `PlanForTodayLine` → ONE `HomePrimaryCard` → optional `CarryForwardCell`) → secondary rows (only when primary is `review_pending`/`draft`) → RecentSessionsList (last-3 + merged weekly receipt) → footer. Precedence: `resume > review_pending > draft > last_complete > new_user` — a closed, lifecycle-only TypeScript union, exhaustively covered by a 16-combination property test.
- **One-focal-zone canon** (`japanese-inspired-visual-direction.md` §4): "Borrow the `tokonoma` lesson structurally: every screen should have one obvious point of attention."
- **D152** made the last_complete card carry the plan (focal CTA "Start {focus} session" + "Then:" queue + tertiary links) — the slot is fully claimed. Card-interior creep already happened once (ended-early card "was a menu") and was caught by a manual pass six days later.
- **Structural gap found during this run:** steady-state Home has **no periphery tier** — secondary rows are precedence-locked and the plan line is suppressed under `last_complete`, so "demote it" currently means "invade the card or the Recent list."
- **M002 series pressure:** M002.2 rung position · M002.3 "1% better" score · M002.4 goals anchor · M002.5 roster · M002.6 attack/tactics · D151 deferred weekly readiness capture (its own decision text pins it "Home/receipt-side").
- **D154 is the shipped counter-example:** the stress substrate landed a flagship feature with *zero* new Home pixels — rung steering acts inside session assembly.

### Past Learnings (docs/solutions/)

Zero direct hits on Home/focal/card design (first-of-kind topic — capture the landing with `/ce-compound`). Adjacent: D137 collapse-don't-add precedent (Settings = home for non-daily capability markers); "vocabulary now, build later"; progress-signal honesty rules (behavioral-primary) already cap what score/goals may claim; drill-copy density lints as mechanical-enforcement precedent; contested Home-allocation forks go to the founder explicitly.

### External Context

Calm products converge on the same shape: Oura "one big thing" Today slot (occupant rotates, slot count never grows, detail flees to drill-down); Headspace Today/Explore bifurcation (choice-heavy Today scored 0% findability); Whoop prescriptive focal; Apple Smart Stack relevance-ranked single slot; NYT pooling→ranking→pinning with already-seen suppression; calm-tech periphery↔center movement (the return trip is the part products drop); Boeing quiet-dark cockpit; broadcast score-bug discipline; museum/kura curation. Named failures: Strava card-creep (features stacked above the core surface, permanent comparative cards), browse-burden homes, additive defaults with no eviction.

## Topic Axes

1. focal-slot-allocation — who wins the single primary slot and when
2. demotion-periphery — the non-focal layers and how features ride them quietly
3. structural-splits — destinations beyond Home that absorb pressure
4. feature-claim-discipline — shrinking what features may claim on Home
5. enforcement-governance — keeping the rule held as the series ships

## Ranked Ideas

### 1. Plan as the mouthpiece — the series' default integration contract

**Description:** M002 features integrate by becoming `composePlan` inputs — changing what the focal card *says and launches* — never by adding pixels. Goal-as-lens is the M002.4 instance: the goal selects/re-keys the plan rather than sitting beside it. Optional single concession: a quiet "Why this session?" disclosure (omakase ticket) satisfying periphery→center-on-demand for all features at once. Pixels require their own decision row.
**Axis:** feature-claim-discipline
**Basis:** `direct:` D150 ("plan is an always-regenerable projection… pure formatters over typed records") + D154 (rung-steered assembly shipped with zero Home chrome) + the "vocabulary now, build later" learning.
**Rationale:** Inverts the default question from "where does my feature go on Home?" to "how does my feature change what the plan says?" — the only integration channel whose capacity is unlimited at constant pixels. Accumulation deepens the focal card instead of diluting the screen.
**Downsides:** Milestones ship with no visible Home artifact; needs founder buy-in that invisible ≠ unshipped.
**Confidence:** 90% **Complexity:** Low
**Status:** Explored *(brainstorm seed 2026-06-11, as part of the covenant + ledger session)*

### 2. The focal slot becomes ranked occupancy — rotation in time, not space

**Description:** Extract the precedence cascade from `useHomeScreenState` into a pure `composeFocalOccupant()` in `domain/` (the `postBlockRoute` move). Slot count frozen at one forever; the occupant rotates by relevance/schedule with eviction-by-clock. First scheduled tenant: D151's weekly readiness check-in — claims the slot at most once a week at its research-correct moment, then yields.
**Axis:** focal-slot-allocation
**Basis:** `direct:` D151's seam is pinned "Home/receipt-side" by its own decision text, and the shipped precedence chain already rotates (review_pending evicts last_complete today without anyone calling it a violation). `external:` Apple Smart Stack; Oura Today.
**Rationale:** Converts "no headroom" into "headroom exists in time, not space." Every future "who wins Home" fight becomes a pure unit test in one file.
**Downsides:** An unowned rotation is slow-motion card stacking — entry/eviction rules need explicit governance before the second tenant.
**Confidence:** 75% **Complexity:** Medium
**Status:** Unexplored (build when D151 ships)

### 3. One peripheral line — quiet-dark, decaying

**Description:** Collapse `PlanForTodayLine` + `CarryForwardCell` into exactly one ranked quiet line below the focal card. Every peripheral signal must define its *dark state* — the condition under which it renders nothing (no dark state, no slot). Already-seen decay: once glanced/acted, the signal recedes, so nothing becomes wallpaper.
**Axis:** demotion-periphery
**Basis:** `direct:` steady-state Home currently has no periphery tier at all (`selectSecondaryRows` gating + `showPlanLine` suppression under last_complete) — verifiable in the selector code today. `external:` Boeing quiet-dark cockpit (illumination means act); NYT already-seen suppression; calm-tech's return trip.
**Rationale:** Demotion is only a viable governance answer if a demoted tier exists; without it, "demote" silently means "invade the card or Recent" — the two surfaces under the most pressure. Quiet-creep (four harmless lines, one per milestone) is the realistic failure mode, and a one-line cap makes it structurally impossible.
**Downsides:** Sometimes a feature's signal simply doesn't show — a trade to ratify, not discover. Deletes two shipped elements in favor of a shared mechanism (a D137-tradition collapse warranting an explicit call).
**Confidence:** 70% **Complexity:** Medium
**Status:** Unexplored (implement when a third peripheral claimant appears; the *principle* rides in the covenant now)

### 4. The coach-moment map — features claim moments in the session loop, not Home pixels

**Description:** A coach opens practice with one sentence; everything else is delivered at the moment it's load-bearing. Map each M002 feature to its native moment: readiness capture → Setup arrival; ladder rung → Transition/Complete; score reveal and goal movement → Complete/Review (the underused high-attention reflective surface); roster → Setup. Home only ever says the opening sentence.
**Axis:** structural-splits
**Basis:** `direct:` D152's receipt merge already made this move once; the session spine exists as the delivery surface. `reasoned:` the focal-scarcity problem exists only because all features default to claiming the same moment (app-open); Complete/Review is a second high-attention moment ~2×/week with near-zero competition. (D151's contamination warning binds *capture* at review, not *display* of behavioral facts.)
**Rationale:** Dissolves rather than wins the allocation fight — two or three of the queued claimants may never need Home real estate at all.
**Downsides:** Signals seen only ~2×/week at session end — exactly what founder-use evidence in the D130 window can test.
**Confidence:** 80% **Complexity:** Low-Medium
**Status:** Explored *(brainstorm seed 2026-06-11, as part of the covenant + ledger session)*

### 5. The kura — build one Progress destination, once, when earned

**Description:** A single drill-down storehouse (reachable from the Recent header or footer, not a tab bar) absorbing longitudinal detail: ladder map, score history, goals, attack depth. Curatorial tone, not analytic — archive + rotation, no live comparative numbers. Home keeps one-line residues linking there.
**Axis:** structural-splits
**Basis:** `external:` Oura's drill-down tabs; Strava's You-tab (structurally right, tonally wrong — the correction is the curatorial framing); museum rotation practice. `direct:` "full surface ships later as separate destination" — this names the destination once instead of five times.
**Rationale:** Five milestones each implying "full surface later" will otherwise produce five destinations or one dashboard. One pre-decided landing zone drops each feature's marginal cost to "add a section."
**Downsides:** The biggest structural commitment in the space. **Do not pre-build** — an empty storehouse violates the repo's smallest-MVP discipline. Ratify it as the designated destination; build when two-plus longitudinal surfaces actually exist.
**Confidence:** 65% **Complexity:** High
**Status:** Unexplored (designated, deferred)

### 6. The Home covenant, ratified as a decision row

**Description:** One founder session, doc-only. Ratify: (a) the focal slot is **session-lifecycle-only** — naming what the `PrimaryVariant` union already enforces — with one scheduled-exception class (D151-style weekly tenancy); (b) default M002 integration is plan inputs (idea 1); (c) the **genkan test** — Home is a threshold, so any feature whose value requires dwelling fails by category regardless of footprint; (d) periphery contract: at most one quiet line, quiet-dark default (idea 3's principle). In the same session, allocate all six known claimants in a ledger (rung → plan input + Transition/Complete · score → Complete, kura later · goals → plan lens + Review · roster → Setup · attack → plan vocabulary · D151 readiness → scheduled focal tenant) so each milestone inherits its Home answer instead of negotiating at ship time. Open note: whether the rule is =1 or ≤1 focal (the empty-tokonoma question).
**Axis:** feature-claim-discipline / enforcement-governance
**Basis:** `direct:` `homePriority.ts` union is lifecycle-only today, protected by TypeScript rather than stated law; repo learning that contested Home forks go to the founder explicitly; the ship-it-all-tomorrow flip batches six ambushes into one decision pass. `external:` genkan typology (entrance-pressure solved by making the entrance functionally transitional).
**Rationale:** Footprint rules can be gamed by shrinking; a purpose test catches the small-footprint claim that still changes what Home is *for*. Pre-deciding six fights costs one paragraph each while they're still cheap to lose.
**Downsides:** A standing "no" to most Home pixel requests for the whole series — consent before M002.2 design starts, not after.
**Confidence:** 85% **Complexity:** Low
**Status:** Explored *(brainstorm seed 2026-06-11 — founder selected this as the entry point)*

### 7. Mechanical render budget + eviction rule

**Description:** Encode the budget as a mechanical check: per-precedence-state caps on rendered lines / tap targets / fold height (390×844), **including a card-interior line budget** — interior creep evades zone-counting and already happened once (caught manually six days post-D152). Additions must name evictions. A flag-count cap keeps the `homePriority` property test exhaustive. Minimal v1: one ~30-line RTL test on settled-state Home; full CI ledger machinery only if the test starts getting fought with.
**Axis:** enforcement-governance
**Basis:** `direct:` third instantiation of an existing repo mechanism — drill-copy rule-14's 45-word lint ceiling, typography guardrails in CI, `volleycraft/no-inline-primitive-drift`. `external:` every named prior-art failure (Strava card-creep, additive defaults) happened through schedule pressure, not intent.
**Rationale:** Governance that must survive many agent-shipped milestones has to be mechanical; the design language held in 2026 because humans kept re-walking the screens, which won't scale.
**Downsides:** Deliberate friction on all future Home work; the budget numbers are themselves a design ruling.
**Confidence:** 80% **Complexity:** Medium (Low for the minimal v1 test)
**Status:** Unexplored (minimal v1 is near-term; full machinery on demand)

## Recommended Composition (founder-reviewed 2026-06-11)

Layered by *when*, not bolted together:

- **Now (doc-only founder session):** idea 6 — the covenant + six-claimant ledger, folding in idea 1 (plan-as-mouthpiece) and idea 4 (coach-moment map) as ratified rules and idea 3's quiet-dark principle as the periphery contract. → **Selected as brainstorm seed.**
- **Cheap insurance now:** idea 7's minimal v1 render test.
- **On demand:** idea 2 when D151 ships (first real rotation tenant); idea 3's implementation at the third peripheral claimant; idea 5 when two-plus longitudinal surfaces exist.
- **Dropped:** router/launch inversions (anti-calm, anti-genkan); typed claim registry (heavier than ledger + test).

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| 1 | Router-not-room / precedence-picks-a-screen | Reverses calm arrival — auto-routing into work surfaces is the anti-genkan; reworks shipped D152 IA for speculative gain |
| 2 | PWA manifest-shortcut launch path | iOS support uncertainty; relieves a duty Home performs fine; doesn't answer where signals live |
| 3 | Empty Tokonoma (zero-focal default) | Head-on collision with week-old D152 "the card IS the plan"; preserved as the ≤1-vs-=1 open note in idea 6 |
| 4 | Read-Only Home (one verb) | D152 tertiary links shipped deliberately; folded as a candidate covenant clause, not a standalone teardown |
| 5 | Goal-as-lens (standalone) | Strong, but absorbed into idea 1 as the M002.4 instance |
| 6 | Typed `homeClaims.ts` claim registry | Duplicates the composition of ideas 2 + 7 with heavier machinery than ledger + budget test |
| 7 | Score-bug strip / Second Sentence / quiet-dark / presence-decays (as separates) | Merged into idea 3 — same mechanism, four framings |
| 8 | Corridor stations / progress-hub-at-Complete / ignition key / native-moments routing | Merged into idea 4 — same relocation move |
| 9 | Niwaki pruning calendar / one-fold budget / card line budget / one-in-one-out / flag freeze / allocation-ledger CI | Merged into idea 7 (mechanics) and idea 6 (the ledger) |
| 10 | Temporal multiplexing by week-phase | Merged into idea 2's rotation mechanics |
| 11 | Cap the Recent trailer | Covered by ideas 3 + 7 budgets |
| 12 | Tokonoma rotation calendar / kura (as separates) | Split across ideas 2 (rotation) and 5 (storehouse) |

Axis coverage: all five axes hold survivors (allocation: 2 · periphery: 3 · splits: 4, 5 · claim-discipline: 1, 6 · governance: 6, 7).
