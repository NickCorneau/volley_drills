---
date: 2026-05-02
topic: volleycraft-typography
focus: "Typography, font choice, type scale, styling, brand fit, and courtside readability"
mode: repo-grounded
---

# Ideation: Volleycraft Typography

## Grounding Context

### Codebase context

Volleycraft is a Vite + React + TypeScript PWA for self-coached amateur beach volleyball. The design surface is not greenfield: `docs/design/README.md` routes typography work through `docs/research/brand-ux-guidelines.md`, `docs/research/outdoor-courtside-ui-brief.md`, and `docs/research/japanese-inspired-visual-direction.md`.

The current type stack is deliberate:

- `Inter Variable` is self-hosted via Fontsource and used for body, UI, headings, labels, and buttons.
- `JetBrains Mono Variable` is self-hosted via Fontsource and used for the timer and preroll countdown.
- `app/src/index.css` defines `--font-sans`, `--font-mono`, warm off-white surfaces, near-black text, amber accent, and reserved `--text-body` / `--text-body-secondary` tokens.
- `docs/decisions.md` `D127` explicitly defers a broad body-scale shift pending field evidence.

The strongest existing tension is scale, not family choice. The outdoor brief says body text should never drop below `16px` and run labels should prefer `18px`; the shipped UI still uses many `text-sm` labels and support lines. Browser audit found the current typefaces product-fit positive but called out Safety, Review, Settings, onboarding, and setup support copy as slightly underpowered for outdoor use.

### Past learnings

No `docs/solutions/` learning entries exist yet. Relevant institutional memory lives in the design docs and the archived Phase F typography plans referenced by `docs/research/brand-ux-guidelines.md`.

### External context

External research aligned with the repo direction:

- Outdoor and timer UIs favor large stable numerals, high contrast, short labels, and real-device testing over decorative typography.
- Accessibility guidance supports `16px+` body text, stronger contrast than minimum WCAG for harsh environments, and avoiding light/thin weights outdoors.
- PWA font best practices support self-hosted WOFF2, variable fonts, small font payloads, and explicit fallback behavior.
- Athletic product systems tend to split neutral UI legibility from expressive brand moments rather than using one decorative face everywhere.

### Browser and product review

The browser pass at 390 x 844 found the app’s Inter + JetBrains Mono pairing practical, sober, and local-first. Run was the strongest typography surface; Home and Complete had the best hierarchy. Onboarding/setup and Safety were legible but more form-like than the more composed Home/Complete surfaces.

The product-lens review reached the same conclusion: changing fonts now would probably hurt adoption more than help. The better product move is to tune scale, hierarchy, brand rhythm, and field validation.

## Ranked Ideas

### 1. Keep Inter + JetBrains, Change Behavior Before Family

**Description:** Preserve `Inter Variable` as the human UI/body face and `JetBrains Mono Variable` as the timer/instrument face. Do not add a new display or brand font unless field evidence exposes a specific failure that current fonts cannot solve.

**Rationale:** Current fonts support the product thesis: calm, serious, local-first, and readable. A new expressive font could make screenshots feel more branded, but it risks making the product less dependable courtside.

**Downsides:** Inter can read generic if every brand moment is quiet. The app must earn distinctiveness through rhythm, scale, state, copy, and restraint.

**Confidence:** 90%

**Complexity:** Low

**Status:** Explored

### 2. Semantic Type-Role System

**Description:** Convert repeated raw class choices into named typography roles such as `screenTitle`, `sectionTitle`, `supportCopy`, `runCue`, `timer`, `state`, `action`, and `receipt`. The role names should map to the existing design docs and can be implemented through tokens, utility classes, primitives, or a small style map during planning.

**Rationale:** Future UI work should choose intent, not pixel size. Role naming makes design drift easier to catch and lets the team retune active surfaces without auditing every call-site from scratch.

**Downsides:** If over-abstracted, a role system could add ceremony around simple Tailwind usage. Keep the first pass small and tied to surfaces that actually repeat.

**Confidence:** 84%

**Complexity:** Medium

**Status:** Explored

### 3. Run Distance Ladder

**Description:** Define dormant or testable type states for active Run use: arm-length, bench-1m, bench-2m, and metric-only. Each state should specify timer size, cue size, secondary-copy visibility, and control density.

**Rationale:** The outdoor brief already names 1-3m posture as a real use case. Treating distance as a type state avoids vague debates like "make the timer bigger" and gives field testing something concrete to compare.

**Downsides:** Distance mode can become scope creep if it ships as a user-facing control too early. The first move should be design/test scaffolding, not a broad settings system.

**Confidence:** 78%

**Complexity:** Medium

**Status:** Unexplored

### 4. Selective Courtside Scale Retune

**Description:** Raise only active-use and trust-critical copy toward `16-18px` first: Run labels, current cue, Safety consequence copy, Review submit blockers, and local-first save/trust lines. Keep dense secondary UI compact unless testing shows it fails.

**Rationale:** This honors the outdoor brief without ignoring `D127`. It also avoids the blunt move of globally replacing `text-sm`, which could make calm screens feel heavy and less composed.

**Downsides:** Requires careful surface selection. A selective retune can look inconsistent if the roles are not named and documented.

**Confidence:** 82%

**Complexity:** Medium

**Status:** Explored

### 5. Support Copy Job and Budget

**Description:** Pair type roles with copy-length budgets. Support copy should either explain a consequence, build trust, guide the next action, or move behind disclosure. Text that does none of those should disappear rather than shrink.

**Rationale:** Many typography problems are copy-density problems in disguise. The app should not solve crowded support text by making it smaller.

**Downsides:** Requires editorial judgment and may uncover copy decisions beyond typography.

**Confidence:** 80%

**Complexity:** Low-Medium

**Status:** Explored

### 6. Typography Guardrails

**Description:** Add lightweight regression protection for typography drift: forbidden sub-`text-xs` body copy, uppercase tracked eyebrows except the allowed paused state, arbitrary text sizes outside approved timer/display cases, and run-facing hierarchy regressions.

**Rationale:** Existing tests already guard the Run cue size. Expanding that approach selectively would make the design contract agent-friendly and reduce accidental drift during unrelated feature work.

**Downsides:** Tests can become brittle if they assert raw class names too broadly. Guard only canonical invariants, not every presentation detail.

**Confidence:** 76%

**Complexity:** Medium

**Status:** Unexplored

### 7. Brand by Rhythm

**Description:** Make Volleycraft feel owned through repeated typography rhythm rather than new fonts: calm title, one large metric, quiet receipt, single amber action, restrained weights, sentence-case labels, and mono only where exactness matters.

**Rationale:** This strengthens distinctiveness while preserving the "well-kept notebook" and "instrument panel" qualities. It also fits the shibui direction better than a decorative brand face.

**Downsides:** Rhythm is harder to enforce than a single visual token. It needs examples in docs and maybe a few screenshot baselines.

**Confidence:** 74%

**Complexity:** Low-Medium

**Status:** Explored

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| 1 | Replace Inter with a more expressive athletic face | Current font stack is product-fit positive; a font swap is higher risk than scale and hierarchy tuning. |
| 2 | Add a decorative display face for brand moments | Would increase font payload and brand complexity before proving a concrete need. |
| 3 | Broad whole-app `text-sm` to `text-base` migration now | Conflicts with `D127`'s field-evidence posture and risks making compact screens heavier. |
| 4 | Use JetBrains Mono as a general brand texture | Mono is strongest when reserved for exact timer/numeric/instrument information. |
| 5 | Automatic copy compression on run surfaces | Interesting but behaviorally complex; better handled after copy-role requirements exist. |
| 6 | One-size screen grammar | Useful as a critique exercise, too restrictive for real prep, review, and run screens. |
| 7 | Broad shadcn/theme replacement | Existing local design system already owns the brand posture; replacing it would create churn. |
| 8 | Full distance-mode UI setting now | Premature as shipped behavior; keep as testable typography ladder first. |
| 9 | Lower-contrast softer shibui palette | Violates the outdoor readability authority; calm cannot mean beige softness. |
| 10 | More brand styling during active Run | Active training moments should behave like tools, not brand showcases. |

## Selected Brainstorm Target

The selected target is a **Volleycraft typography system pass**: keep the current font families, define semantic type roles, selectively retune courtside-critical scale, and create guardrails so future UI work does not reopen the font debate or drift into small form UI.
