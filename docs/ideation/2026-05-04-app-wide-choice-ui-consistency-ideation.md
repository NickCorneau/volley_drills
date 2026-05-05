---
id: ideation-2026-05-04-app-wide-choice-ui-consistency
title: App-wide choice-row UI consistency ideation
status: active
stage: ideation
type: ideation
summary: "Survey of choice-row drift across SetupScreen, TuneTodayScreen, SafetyCheckScreen, ReviewScreen, and SettingsScreen, with ranked ideas for closing it via a shared primitive."
last_updated: 2026-05-04
---

# App-wide choice-row UI consistency ideation

Date: 2026-05-04
Focus hint: "do one more pass like SetupScreen across the app — make every choice section visually the same, with a reusable component so this doesn't keep happening"

## Grounding

### Codebase context

- `app/src/components/ui/ToggleChip.tsx` — `lg`/`sm` sizes, `rounded`/`pill` shapes, `fill` default true.
- `app/src/components/ui/SetupChoiceSection.tsx` — newly added shared component for SetupScreen with `SetupChoiceSection` (h2 + chip row + optional footnote) and `SetupNestedChoiceBlock` (h3 + warm-tinted panel for follow-ups).
- Pattern is already canonical in SetupScreen and (mostly) TuneTodayScreen.
- Drift survives in SafetyCheckScreen layoff-bucket follow-up (`text-xs` subtitle + `size="sm"` chips inside `bg-bg-warm/60 p-3` panel) — direct visual twin of the Wall block we just fixed in SetupScreen.

### Past learnings

- `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` (recent) — generalize-once-after-second-instance pattern.
- The SetupScreen polish was the first instance; SafetyCheck is the second — generalization is now warranted.

### Pain and friction

- Every screen reinvents the same h2-and-chip-row scaffolding inline; small drift compounds (font size, gap, panel chrome).
- Nested follow-ups (Wall after Solo+No net; layoff buckets after `2+` recency) are a recurring shape with no shared component; both shipped with `text-xs` + `size="sm"` and had to be manually upsized.
- New screens have no obvious primitive to reach for; the path of least resistance is copy-paste.

## Candidates

### Generalize SetupChoiceSection → ChoiceSection (one shared primitive)

- Rename / promote `SetupChoiceSection` to `ChoiceSection` and give it three optional slots:
  - `description?: ReactNode` — subhead beneath h2 (renders as `text-sm text-text-secondary`); covers SafetyCheck Pain + Recency intros.
  - `footerNote?: string` — already exists; covers SetupScreen Time clarifier.
  - `optional?: boolean` — toggles the `(optional)` italic suffix on the heading; covers Focus + Review's Short note.
- Promote `SetupNestedChoiceBlock` to `ChoiceSubsection` with the same `description` slot for the nested-question prompt and default `lg` chips inside.
- Refactor SetupScreen, SafetyCheckScreen (Recency + layoff buckets + Pain), and TuneTodayScreen Focus onto the shared primitive.
- Outcome: every choice row in the pre-run flow renders from one component, drift is structurally impossible.

### Cluster choice-row primitives under a single index export

- Group `ChoiceSection`, `ChoiceSubsection`, `ToggleChip` under a clearly-named export cluster (e.g. `ui/choice/`) so future screens have an obvious "for choice rows, look here" pointer.
- Lower yield than candidate #1 alone — only useful if combined.

### Add lint or test guardrail

- Codify: any `<h2>` followed by a `role="radiogroup"` chip row in a screen file is a violation; fail on `text-xs` immediate sibling of `radiogroup`.
- Higher carrying cost (custom rule + maintenance) for marginal added safety beyond having one ergonomic primitive.

### Visual snapshot test for setup-style rows

- A single Playwright spec that visits Setup, TuneToday, Safety and asserts h2/chip/spacing parity via accessible name and computed styles.
- Defers drift detection to CI rather than preventing it. Lower leverage than primitive consolidation.

## Survivors (ranked)

1. **Generalize SetupChoiceSection → ChoiceSection with description / footerNote / optional slots, refactor 3 screens.**
   - Highest direct impact: kills drift in two additional surfaces (SafetyCheck Recency follow-up and Pain section) using the same atom we already validated in Setup.
   - Smallest carrying cost: one component, one rename, three screen edits.
   - Compounds: makes the component the obvious reach for any future choice row, including Settings sub-sections.

## Out

- Lint guardrail and visual snapshot test — defer; ergonomic primitive plus normal code review covers this case at lower cost.
- Cluster export reorganization — defer; single primitive in `ui/` is enough until the surface grows.

## Recommendation

Move the survivor (#1) into `ce-brainstorm` to lock the API of the generalized `ChoiceSection` and decide which screens are in this PR's blast radius.
