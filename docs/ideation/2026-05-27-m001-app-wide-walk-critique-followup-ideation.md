---
id: m001-app-wide-walk-critique-followup-ideation-2026-05-27
title: M001 App-Wide Walk Critique Follow-Up Ideation
status: active
stage: validation
type: ideation
summary: "Ranked ideation pass on the 2026-05-27 end-to-end design critique. Seven survivors, biased toward leverage moves that retire whole classes of finding rather than patching individual surfaces."
date: 2026-05-27
topic: m001-app-wide-walk-critique-followup
focus: design improvements surfaced by the 2026-05-27 founder walk-through — between-drill moments, JustFinishedPill, Recommended-default surfacing, hierarchy, consistency, accessibility
mode: repo-grounded
depends_on:
  - docs/decisions.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/solutions/2026-05-10-drill-first-time-runnability-system.md
  - docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md
  - docs/solutions/workflow-issues/route-founder-use-feedback-without-overfiring-scope-2026-05-04.md
---

# Ideation: M001 App-Wide Walk Critique Follow-Up

## Grounding Context

### The critique (2026-05-27)

Founder walked the live PWA end-to-end (onboarding → setup → safety → run → transition → drill check → review → complete → settings → returning-user home) and surfaced 10 themes: JustFinishedPill renders flat; drill name appears multiple times on DrillCheck; returning-user Home shows resolved focus ("Serving") when user picked Recommended; engineer-shaped build identifier in Settings footer; three CTAs on Transition footer; 14px CTA text small for courtside; Setup Focus 2×2 grid treats Recommended as visually equal to skills; back-label inconsistency ("← Home" on Setup, "← Back" elsewhere); contradictory-reading "Counts not logged" copy on Review and Complete; ToggleChip selected uses the heaviest border weight in the app. The critique also named what works (Safety pre-disclosure copy, the 72px tabular-nums timer, the one-tap repeat on Home, the trust footer).

### Codebase context (verified)

- **Token contrast.** Page `bg-primary` = `#FFFFFF`; `bg-bg-warm` (used by `JustFinishedPill`) = `#F5F5F0`. ~5% lightness delta on a warm-paper page. The pill has fill but no border, shadow, or outline — the "renders flat" read is technically accurate at the system level, not a render artifact. Other tokens: `bg-success` = `#047857`, `bg-accent` = `#B45309` (terracotta), `bg-info-surface` = `#FEF3E8`, `--radius-base` = `12px`.
- **JustFinishedPill** lives at `app/src/components/patterns/JustFinishedPill.tsx` (root: `flex items-start gap-2.5 rounded-base bg-bg-warm p-3` + 24px success-green circle + drill name + Complete/Skipped subtitle). Used on `DrillCheckScreen` and `TransitionScreen`.
- **DrillCheck drill-name count: 2 visible.** The H1 was moved to `sr-only` on 2026-05-25 (a11y fix). Visible names = the pill + `PerDrillCapture`'s h2 (`How was *{drillName}*?`). Still one too many, but a different problem than the user read.
- **Transition footer layout: 1 primary + 1 side-by-side secondary row + 1 conditional ghost.** Not three stacked CTAs — Swap and Shorten share a row.
- **Home "last focus" leak: contract violation.** `inferSessionFocus()` in `app/src/domain/sessionFocus.ts` finds the `main_skill` block and reads `drill.skillFocus[0]` from the catalog. It completely ignores `context.sessionFocus`. A session the user started with Recommended whose main drill happens to be a serving drill returns "Serving". The user's intent is not carried into the display label at all.
- **Setup Focus row.** `FOCUS_OPTIONS = ['recommended', 'pass', 'serve', 'set']` rendered via `<ChoiceRow layout="grid-2">`. Recommended is one of four visually equal chips in a 2×2 grid; no `description` prop on the parent `ChoiceSection`. `D137` (2026-05-07) ratified the Setup → Safety spine and explicitly forbids splitting Recommended into a new step.
- **Button.** All CTA variants use literal `text-sm font-semibold` (14px / 600) in `app/src/components/ui/Button.tsx`. There is no typography token; the size is a Tailwind utility.
- **Safety pre-disclosure copy.** Lives in `SafetyCheckScreen.tsx` as the `description` prop of `ChoiceSection` (e.g. *"Today or First time means a shorter, lower-intensity start."*). The consequence-before-commit pattern is portable but used only there today.

### Past learnings active in this surface

- `docs/solutions/2026-05-10-drill-first-time-runnability-system.md` — READ-DO / DO-CONFIRM frame, observe-before-grade DrillCheck rule, triple-only probe. Active doctrine on the between-drill region.
- `docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md` — Setup → Safety is the canonical pre-run spine; Recommended is defaulted inline. Changes must respect the spine, not extend it.
- `docs/solutions/workflow-issues/route-founder-use-feedback-without-overfiring-scope-2026-05-04.md` — meta-pattern: classify each finding (validation / friction / wish / bug) before authoring scope; peel the `JustFinishedPill` flat render off as a bug-track investigation rather than lumping it with design-decision themes.

### External context

- **Serious training apps (Hevy, Strong, TrainerRoad, Wahoo SYSTM, Apple Fitness+, Zwift)** converge on: the transition surface is functional, not celebratory. Completion is row-level. TrainerRoad pointedly hides "Up next" by default to keep the athlete in the current effort. User vocabulary directly contrasts Hevy ("too much going on") vs Strong ("just gets out of the way") as a competitive axis.
- **Headspace** signals session completion through a 1000ms animation with a subtle 1.02 overshoot on `cubic-bezier(0.16, 1, 0.3, 1)` — described in its public design analysis as *"a gentle 'well done' in motion, not the high-energy emphasis of confetti or a badge popup."* Express completion through TIMING, not color or weight.
- **Carbon Design System** explicitly splits *callout* (pre-action guidance) from *inline notification* (post-action success). Maps cleanly onto Transition (briefing) vs DrillCheck (rating-what-just-happened). Carbon ships low-contrast and high-contrast inline-notification variants.
- **Apple HIG (iOS 26 Liquid Glass)** is explicit: *do not nest glass.* "Putting `.glassEffect()` on a view that is already sitting on a glass surface doubles the blur and produces muddy results." For an emphasized element on a paper-tinted page, use `.borderedProminent` or a contrasting solid — never a second paper layer.
- **Material 3** replaced opacity-based elevation with named surface tokens (`surfaceContainerLowest` … `surfaceContainerHighest`). Makes own-bg-vs-page-bg a discrete role choice, not a custom contrast hack.
- **Linear, Nord** treat completion as a small status dot or status pill, never a hero card.
- **GitHub branch protection** deliberately ships NO "recommended preset" toggle — serious-developer tooling does not badge defaults.
- **Apple Maps "Suggested Places" (iOS 26.5)** anchors at top, caps at 2 items, uses the plain label "Suggested Places," no badge.
- **Zwift "Next Up"** makes the recommendation the primary action with a `Start Ride` CTA; alternatives live behind a `Tune` disclosure (2 shorter + DEFAULT + 2 longer). The Zwift Companion mobile app shows only the default.
- **Stripe Checkout** promotes payment methods by position + overflow menu. No "Recommended" label.

## Ranked Ideas

### 1. Collapse the Between-Drill Region

**Description:** Treat the inter-drill space as a continuous run-flow rather than three named screens (`/run` → `/run/check` → `/run/transition` → `/run`). The transition becomes a brief in-place rest with the next drill's setup visible, and DrillCheck capture happens ambiently rather than as a dedicated screen the user must transit. JustFinishedPill becomes a row-level marker (a 6px dot in the eyebrow, Linear-style), not a content panel. The "two drill name echoes on DrillCheck" and the "three CTAs on Transition" findings disappear by deletion, not by adjustment.

**Warrant:** `external:` Hevy, Strong, and TrainerRoad — three of the most respected serious-training apps — converge on this pattern. TrainerRoad pointedly hides "Up next" during a workout to keep the athlete in the current effort (multi-year open feature request that the team has chosen not to ship). Hevy and Strong put completion at the set-row level with auto-rest-timer. Apple Fitness+'s Audio Hints accessibility feature explicitly enumerates transitions as *functional cues*, not celebrations. Headspace expresses completion through TIMING (1000ms + 1.02 overshoot) rather than color or weight, framed as "a gentle 'well done' in motion, not the high-energy emphasis of confetti or a badge popup." Plus `direct:` — the current `TransitionScreen` mixes a `JustFinishedPill` (post-action retrospective) and an Up-Next briefing (pre-action callout) on the same surface, which Carbon Design System explicitly says are different patterns that should look different.

**Rationale:** Six of the six ideation frames independently arrived at some version of this move (pain/friction: counter discontinuity; inversion: delete Transition route, delete JustFinishedPill, skip DrillCheck for no-streak drills; assumption-breaking: "There Is No Between Drills" with ambient capture; leverage: `CurrentDrillCard` surface; cross-domain: Chef's Pass choreography, knitting row counter; constraint-flip: silence Transition copy, session-as-score strip). The convergence is not coincidence — it reflects a real architectural pressure between the D137 spine (which is right for pre-run) and the run-flow (which is currently structured like a chain of named events rather than a continuous experience). The single-move payoff: it absorbs critique findings 1 (pill flat), 2 (drill-name 2×), 5 (Transition 3 CTAs), 6 (CTA 14px is mostly a problem on Transition footer), 8 (back-label inconsistency only matters on screens that exist), and most of 10 (ToggleChip border-2 loudest is mostly a Transition / DrillCheck stress).

**Downsides:** Large move. Would invalidate the D137 run-flow shape (not the pre-run spine, which is the explicit D137 scope) and require a brainstorm pass before any implementation. Risks breaking the per-drill capture contract that lives on `/run/check` (the user's plan-grammar work depends on this surface). Could not ship in M001 without re-opening V0B Layer-A decisions. Best treated as the architectural direction for M002 + a small, immediate "demote the pill to a status dot" tactical landing in the meantime.

**Confidence:** 75% as direction, 30% as ship-this-quarter

**Complexity:** High

**Status:** Unexplored

### 2. Recommended Is a Posture, Not a Focus Value

**Description:** Fix the contract violation in `inferSessionFocus()` at the type-system level, not just the display layer. `SessionFocus` becomes a discriminated union (`Recommended | Skill`), so a session created from a Recommended choice persists Recommended-as-Recommended forever. Home's `LastCompleteCard` / `RecentSessionsList` reads from the persisted posture, not the resolved drill instance. On Setup, anchor Recommended as the primary action (full-width, terracotta CTA-styled) with the three skill chips behind a one-line "Pick a focus" disclosure — the Zwift "Next Up" / Apple Maps "Suggested Places" idiom, landed in code as a new `ChoiceRow prominence="recommended"` variant.

**Warrant:** `direct:` `inferSessionFocus` in `app/src/domain/sessionFocus.ts` reads `drill.skillFocus[0]` and *completely ignores `context.sessionFocus`*. This is a typed contract violation: the user picked "Recommended" because they wanted the app to choose, and Home re-deriving the label from the resolved drill breaks that intent invisibly. Plus `external:` GitHub branch protection (no preset toggle); Apple Maps Suggested Places (anchored, capped, no badge); Zwift Next Up (recommendation IS the primary action, "Tune" disclosure for override, companion mobile shows only the default); Stripe Checkout (position + overflow, no "Recommended" label). Serious-tool convention is unanimous: defaults are promoted by position and primacy, not by badging.

**Rationale:** Five frames converged on the same move from different angles (inversion: invert Recommended, no chip; assumption: Recommended is a posture not a focus value; leverage: `useSessionContext()` selector hook + `ChoiceRow prominence="recommended"`; cross-domain: NYC Subway diamond/circle service-pattern shapes; constraint-flip: single Recommended focus). The leverage-frame proposal is the system-primitive landing site that makes the assumption-frame's typed-boundary fix expressible, and the cross-domain analogy ratifies that "shape encodes service identity better than label can." Eats critique findings 3 (Home shows Serving when picked Recommended) and 7 (Setup Focus 2×2 equal), plus retires a class of future Home / Settings / Review surfaces that would otherwise leak resolved focus.

**Downsides:** Touches `sessionFocus.ts`, `SessionDraft` types, `SetupScreen` Focus row, `HomeScreen` / `LastCompleteCard` / `RecentSessionsList`, and the still-existing `inferSessionFocus` callers across Settings. Mid-size refactor. The `ChoiceRow prominence="recommended"` variant needs its own a11y pass. Risk: founder may prefer the resolved-drill display for at-a-glance recall ("oh right, I served") — would need to validate against the founder-ledger before flipping. Possible compromise: persist Recommended and show BOTH ("Recommended → Around the World Serving").

**Confidence:** 88%

**Complexity:** Medium

**Status:** Unexplored

### 3. Named Surface Tokens + Demote the Pill to a Status Dot

**Description:** Introduce a Material-3-style named surface token set (`surfaceContainerLowest` / `Low` / `Medium` / `High` / `Highest` mapped to the warm-paper palette), making the bg-vs-page contrast a discrete role choice rather than a custom-tone-pairing hack. Then demote `JustFinishedPill` from a panel to a row-level marker — a 6px terracotta-or-success status dot in the eyebrow row, paired with the drill name in plain weight, no chip surface. Add a custom ESLint rule under `volleycraft/no-inline-primitive-drift` that fails when a non-token color sits directly on `bg-primary` without a named surface role (turning the current paper-on-paper bug class into a compile-time error).

**Warrant:** `direct:` `bg-primary` = `#FFFFFF` and `bg-bg-warm` = `#F5F5F0` is a ~5% lightness delta on the same hue; `JustFinishedPill` has fill but no border / shadow / outline. The user's "renders flat" finding is a system-level truth, not a screenshot artifact. Plus `external:` Material 3 named surface tokens, Apple HIG "do not nest glass" rule, Linear's published vocabulary ("subtle dark-surface layering, borders fine, shadows restrained, corners subtle" — completion = small status dot), Headspace's timing-based completion (1000ms + 1.02 overshoot) as the alternative to color/weight emphasis. Apple HIG is the clinching piece: on a paper-tinted page, an emphasized element should use `.borderedProminent` or a contrasting solid, *never* a second paper layer — which is exactly what `JustFinishedPill` does today.

**Rationale:** Three frames converged on the same diagnosis (leverage: named surface-container tokens; inversion: delete pill / replace with 6px dot eyebrow; cross-domain: knitting row counter and Linear status dot). The leverage-frame insight is critical: raising the pill's visual weight is the wrong fix because the system has no vocabulary for "this surface is one role-level above the page." Tokens give the system that vocabulary; demoting the pill admits the row-level marker is sufficient. Together they retire findings 1 (pill flat) and 10 (ToggleChip border-2 loudest) and prevent the next ten paper-on-paper bugs from shipping at all. The ESLint rule pattern (`no-inline-primitive-drift`) already exists in `app/eslint-rules/` and has precedent for catching exactly this class.

**Downsides:** Mid-large refactor. Every existing `bg-bg-warm` usage needs to be re-mapped to a named role token. The pill demotion has a meeting-test moment of its own (the user may prefer the panel as the explicit completion affordance even if it's contrast-poor). Headspace-style timing-based completion needs a motion system Volleycraft doesn't have yet (no animation primitives in `components/ui/`). The ESLint rule has a non-trivial AST-walk cost.

**Confidence:** 85%

**Complexity:** Medium-High

**Status:** Unexplored

### 4. Pre-Disclosure System Slot + Editorial Voice Lint

**Description:** Promote the Safety screen's `ChoiceSection description` consequence-before-commit pattern from a SafetyCheckScreen one-off to a first-class system slot. Every `ChoiceSection` that asks the user to commit to a meaningful change gets a required `description` prop with consequence copy in the Safety voice. Add a content lint that fires when a `ChoiceSection` ships without a description on a route that mutates session shape, and a paired lint that catches the contradictory-adjacent-paragraph anti-pattern surfaced on Review/Complete ("Captured between blocks on 1 drill. Counts not logged for any drill.") — collapsing the two related ideas onto one line is enforceable.

**Warrant:** `direct:` the user singled out *"Today or First time means a shorter, lower-intensity start"* as rare and excellent voice, and the codebase has it living in exactly one file (`SafetyCheckScreen.tsx`) as the `description` prop of `ChoiceSection`. The Focus section in `SetupScreen.tsx` lines 381–394 has only `title="Focus"` — no description explaining what Recommended actually does. Plus `external:` Carbon Design System's explicit *callout* (pre-action info) vs *inline notification* (post-action success) split — Carbon names this as a system-level convention; Volleycraft has the right ingredient and is using it as a single recipe. The Wingspan player-aid cross-domain analogy is the same pattern in physical media: every consequential action gets a one-line "what this means" alongside.

**Rationale:** Four frames converged here (leverage: pre-disclosure system slot + content lint; cross-domain: museum wall text, Wingspan player aid; pain/friction: in-flight verb fragmentation; constraint-flip overlaps with the museum-wall-text approach to didactic copy). The doubled win is system-leverage + a specific finding retirement: the lint kills finding 9 (contradictory Counts-not-logged copy), generalizes the Safety voice win, and prevents the next dozen consequence-vague choice surfaces from shipping. The drift-guardrail pattern is already established (`volleycraft/no-inline-primitive-drift`); adding a content-shape rule is in-character.

**Downsides:** Pre-disclosure copy is voice-heavy work — the lint can catch absence but cannot catch quality. Risk of cargo-culting "lower-intensity start" phrasing onto choices where it doesn't fit. The Counts-not-logged copy fix may not be just a one-line collapse; the two paragraphs may reflect a real two-shape distinction (per-drill capture vs session-level counts) that needs disentangling before re-voicing.

**Confidence:** 80%

**Complexity:** Medium

**Status:** Unexplored

### 5. Founder-Use Mode Means Diagnostics Are Product

**Description:** Invert the build-identifier finding from "shorten or stow" to "this is the founder-mode contract surfaced honestly." Treat the M001 → 2026-07-20 founder-use window as a state where diagnostic visibility IS the product — the build identifier becomes a structured, glanceable spine label (library-call-number style: `M001 · v6 · 2026-05-23 · g7989ee0`) sitting in a dedicated Settings section, not as a wrapped string in a footer. Pair with a small inline `D130 condition status` row so the founder can see at a glance what state the validation ledger is in without leaving the app. After 2026-07-20 (or D91 retention gate re-engagement), the section auto-hides or moves behind a long-press.

**Warrant:** `direct:` `m001-validation-week5-catchup-2026-05-23-37-g7989ee0-dirty` is engineer-shaped because it IS engineer information — the founder is the engineer for the duration of `D130`. Hiding it in a 14px wrapping footer makes the actual user experience worse than restructuring it as a first-class founder-mode surface. Plus `external:` library spine call-number information design (where structured provenance is a feature, not noise) and Linear's vocabulary of small-but-present provenance markers. Plus `reasoned:` if D130 means *the founder is also the validating user through 2026-07-20*, then in-app diagnostic visibility is part of the validation contract — the founder cannot validate gates they cannot see.

**Rationale:** Three frames converged here (assumption: founder-use mode means diagnostics are product; constraint-flip: build-ID as Settings hero; cross-domain: library spine call number). The assumption-breaking move is the load-bearing one: the user labeled this 🟢 Minor because they read it as a polish item, but the convergence suggests it's actually a posture question. Inverting it lets the validation gates surface in-app and reduces the founder-vs-user context-switching cost that D130 already imposes. After D130 ends, the surface either auto-hides or graduates to a "real-user diagnostics" pattern that downstream features (M002, post-D91) can reuse.

**Downsides:** Risks normalizing developer-shaped UI in a calm-shibui app. May not survive the 2026-07-20 D130 re-evaluation and end up as code-debt. The validation-ledger inline rendering needs `D130` Conditions 1/2/3 as machine-readable state, which they aren't today (live in `docs/research/founder-use-ledger.md` as prose). Could be done as a smaller scope first (just restructure the build identifier; defer the ledger inline) at lower payoff.

**Confidence:** 65%

**Complexity:** Low (structured build-ID) → Medium (with ledger inline)

**Status:** Unexplored

### 6. Still-Learning Chip Is the Honest-Answer Attractor

**Description:** Audit the three-chip "How was that drill?" DrillCheck rating UX for middle-bias. The current chip order positions "still learning" as the honest-answer attractor (middle anchor + matches the founder's actual ledger pattern of capturing nothing for streak metrics). Fix by either (a) removing the middle option entirely and forcing a binary good/hard split per drill, (b) randomizing chip order per drill so anchor bias washes out across sessions, or (c) reframing the chips around an observable rather than self-report ("got most of them" / "split" / "few landed").

**Warrant:** `direct:` the founder ledger evidence already cited in `docs/research/founder-use-ledger.md` shows three pair drills with zero streak metrics captured — the rating IS being captured but the actionable per-drill metric is being skipped. Plus `external:` survey-design research on middle-bias (where a 3-option middle attracts the modal answer regardless of question content), and the drill-first-time-runnability system's observe-before-grade rule (which already addresses part of this concern at the first-time-runnable level but does not extend to ongoing capture).

**Rationale:** This is the only survivor that came from a single frame (pain/friction) but resisted absorption into any cluster because it is fundamentally a measurement-integrity finding, not a design-aesthetic one. If the rating UI is biased toward an answer that masks the actual signal (streak metric capture), the validation reads downstream are corrupted at the source. The user's critique doesn't name this directly but it sits underneath findings 9 (Counts not logged) and the unstated finding that the per-drill capture intent is not actually capturing useful per-drill data in pair sessions.

**Downsides:** Requires a small founder-data audit to confirm middle-bias is the cause rather than UI affordance discovery. The "observable rather than self-report" reframe (option c) overlaps with the drill-first-time-runnability READ-DO/DO-CONFIRM frame and may need to be coordinated with that doctrine. Option (a) reduces information granularity; option (b) is annoying.

**Confidence:** 70%

**Complexity:** Low (option a/b) → Medium (option c)

**Status:** Unexplored

### 7. When Does DrillCheck Appear?

**Description:** Make DrillCheck appearance contingent on whether the drill has a streak metric to capture or a per-drill signal worth gating-with-confirmation. For drills with no `successMetric` and no per-drill capture target, skip DrillCheck entirely and let the user transition straight to Up Next. For drills that DO have a capture target, keep DrillCheck but cut the redundant H2 question and the JustFinishedPill drill-name echo (the eyebrow already names the drill).

**Warrant:** `direct:` `domain/capture/eligibility.ts` already owns `resolveDrillCheckCaptureEligibility` for the per-drill capture decision; the route exists at `/run/check` regardless and renders even when the eligibility result is "nothing to capture." Plus `external:` Hevy and Strong handle this at the set-row level — completion + auto-rest, no separate "rate that set" screen. Plus the past learning at `docs/solutions/2026-05-10-drill-first-time-runnability-system.md` (observe-before-grade rule), which argues that asking for a rating on a drill the system cannot meaningfully consume the rating from is friction.

**Rationale:** Adjacent to (and a smaller scope than) survivor #1 — this one ships TODAY without re-opening the D137 / V0B Layer-A boundary. It's the smallest move that addresses the user's "drill name 2× on DrillCheck" finding by making DrillCheck not appear for those drills at all, plus retires a chunk of finding 9 (Counts not logged for any drill — because for those drills DrillCheck didn't run). Worth surfacing as its own survivor because the M001 validation window benefits from a ship-this-week move, not just a brainstorm-direction.

**Downsides:** Has to be co-designed with the per-drill capture eligibility decision (`domain/capture/eligibility.ts`) so the DrillCheck-skip and the capture-eligibility logic don't get out of sync. The user may prefer DrillCheck-always for consistency even when capture is nothing-to-capture (founder validation question, not a design question). Could undermine survivor #1 by making the smaller fix "good enough" and parking the structural move indefinitely.

**Confidence:** 80%

**Complexity:** Low-Medium

**Status:** Unexplored

## Cross-Cutting Notes

- **Survivors #1 and #7 are sequenced.** #7 is the ship-this-week tactical landing; #1 is the architectural direction for M002. Doing #7 well buys the team time to brainstorm #1 properly rather than rushing it.
- **Survivors #2 and #3 share infrastructure intent** (typed-boundary fix + named-token-as-system primitive). They can ship in parallel but their tests and lints will brush against each other; coordinate timing.
- **Survivors #4 and #5 are voice / posture moves.** Both are about making implicit project values (consequence-before-commit voice; D130 founder posture) load-bearing in code rather than discretionary in copy.
- **The 2026-05-04 prior ideation on setup-screen-default-path-polish** intersects survivor #2 — that doc proposed "Optional Focus Cue" and "Default Confidence Line" as small in-place fixes; survivor #2 supersedes those with the typed-boundary + `prominence="recommended"` move. Mark those prior ideas as `Superseded` if survivor #2 advances.

## Rejection Summary

| # | Idea | Reason rejected |
|---|------|-----------------|
| 1 | Bump CTA text from 14px to 16px | Tactical typo fix the user already named; subsumed under survivor #3 (typography role tokens) when those land. |
| 2 | Shorten the build identifier to `g7989ee0 · 2026-05-27` | Tactical fix; survivor #5 inverts the framing — shortening is the wrong move under D130. |
| 3 | Drop "← Home" from Setup; use "← Back" everywhere | Tactical fix; the leverage move (`RouteMeta` for back-labels) is real but folds more naturally into a separate "navigation grammar" pass than a survivor here. |
| 4 | Collapse Counts-not-logged copy to one line | Tactical; survivor #4 generalizes this into a content lint that catches the next twenty instances. |
| 5 | Drop ToggleChip selected to 1px border | Tactical; survivor #3 (named surface tokens) makes the right border weight derivable from a role, not a hand-pick. |
| 6 | Move Swap / Shorten into an overflow "Adjust" sheet | Real but small; subsumed under survivor #1 (collapse the between-drill region — overflow only matters if the region keeps its three CTAs). |
| 7 | Add an explicit "Recommended" badge to the Setup chip | External research is unanimous: serious-developer tools do not badge defaults. Survivor #2 supersedes with the position+primacy idiom. |
| 8 | Show both Recommended and the resolved drill ("Recommended → Around the World Serving") on Home | Possible compromise variant of survivor #2; surfaced in #2's Downsides as a fallback rather than as its own survivor. |
| 9 | Restore JustFinishedPill styling (border + bg-info-surface + rounded-full) | The user's first-priority recommendation, but external research (Linear, Headspace, Apple HIG do-not-nest-glass) argues the opposite — raising the pill's weight is the wrong fix. Survivor #3 disagrees with the user honestly. |
| 10 | Disabled-primary CTA fails silently — add toast or shake | Real but should be addressed at the disabled-state-affordance pattern level, not per-screen. Worth a follow-up `ce-compound` pattern doc once survivor #4's editorial lint lands. |
| 11 | "Skipped" pill voices user judgment as system audit | Marginal alone; folds into survivor #4 (editorial voice system slot) when "Skipped" copy gets a one-line rewrite per the voice rule. |
| 12 | Swap is a leap of faith with no undo (preview before commit) | Founder-ledger evidence supports this but the implementation is heavy (modal preview, swap state machine). Hold for separate brainstorm — not blocked by ideation. |
| 13 | In-flight verb fragmentation across primary CTAs (`Building…` / `Starting session…` / `Saving…`) | Marginal alone; folds into survivor #4 once the editorial-voice lint exists. |
| 14 | "Paused" subtitle bandages three causes with one band-aid | Real but smaller-scope; surfaces in survivor #1 if and when the Transition / Pause states get re-thought together. |
| 15 | Counter discontinuity across run-flow micro-pair (`Last: 3/6` → `Next: 4/6` → `4/6`) | Folds into survivor #1 (eyebrow grammar consistency is a side effect of collapsing the region). |
| 16 | System pre-commits the session; user vetoes inline via Adjust sheet | Conflicts with D137 spine unless framed very carefully; better as a brainstorm seed than a survivor. |
| 17 | Auto-set rest length from drill metadata; remove Transition footer | Subsumed under survivor #1. |
| 18 | Delete Home's last-focus surface entirely | Subsumed under survivor #2 (the contract fix makes the surface honest rather than requiring deletion). |
| 19 | Session-as-score strip (full session always visible as music score) | Provocative constraint-flip that informs survivor #1's brainstorm; not a standalone survivor. |
| 20 | No-button tap-anywhere on Transition (gesture-only advance) | Inputs survivor #1's brainstorm; not standalone — gesture affordances need separate a11y design. |
| 21 | Single Recommended focus (remove pass/serve/set from Setup entirely) | Subject-stretching constraint-flip — informs survivor #2 but ships as `prominence="recommended"`, not as remove-the-alternatives. |
| 22 | No-scroll viewport contract (every state fits 390×844; if it overflows, the screen is wrong) | Worth ratifying as a `ScreenShell` invariant, but more a design-principle decision than an ideation survivor. |
| 23 | Forced 5-second meditation pad between drills | Provocative but founder-walkthrough evidence suggests urgency-to-next-block matters more than meditative pause. Hold for M002 brainstorm. |
| 24 | Voice-only pocket mode | Subject-stretching for M001 (no audio cue surface beyond at-block-start vibrate). Strong M002 / post-D91 direction. |
| 25 | Success-rule re-read tax (collapsible after session N) | Real friction but folds under survivor #7 (when DrillCheck appears determines whether the rule is re-read). |
| 26 | `ScreenFooter` typed action manifest | Real leverage move; folds into survivor #1 when the Transition footer gets re-thought, or stands alone as a separate routing-grammar brainstorm. |
| 27 | Promote `ChoiceSubsection` to a system-level conditional reveal primitive | Already exists per `.cursor/rules/component-patterns.mdc`; would be re-architecture, not new. |
| 28 | Convert Settings build-identifier into a long-press reveal | Subsumed under survivor #5's auto-hide-after-D130 fallback. |
| 29 | Settings sectioning by validation gate (D130/D134/D137) | Implementation tactic of survivor #5; not standalone. |
| 30 | Add design-time screenshot tooling so "JustFinishedPill renders flat" gets caught in CI | Real and useful but a test-infrastructure proposal rather than a design move. Worth a follow-up `ce-compound` once survivor #3's named-token lint exists. |
| 31-46 | Various tactical typo/copy fixes the user already named | Tactical; below ambition floor in non-tactical mode. |
