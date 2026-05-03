---
date: 2026-05-02
topic: volleycraft-typography-system
---

# Volleycraft Typography System Requirements

## Problem Frame

Volleycraft's current font pairing is directionally right: `Inter Variable` makes the product feel calm, serious, and readable, while `JetBrains Mono Variable` gives the timer an instrument-grade precision. The problem is not "which new font should we use?" The problem is that typography choices are still mostly raw call-site classes, and the shipped app leans on compact `text-sm` support copy in places where courtside glare, distance, and trust-critical guidance may need stronger scale or hierarchy.

This requirements brief selects the typography-system direction from `docs/ideation/2026-05-02-volleycraft-typography-ideation.md`: keep the current font families, define semantic type roles, selectively retune courtside-critical text, and add guardrails so future UI changes preserve the calm brand posture without reopening the font debate.

In this brief, **typography pass** means the future implementation work, not this requirements document. **This brief** defines the product and scope contract; the later implementation plan chooses the smallest safe implementation substrate.

The typography pass has two lanes:

- **Ship-now lane:** role naming, documentation, guardrail/checklist work, browser screenshot review, and fixes for documented hard violations or active-run / safety-critical readability problems with a named athlete outcome.
- **Evidence-gated lane:** default scale changes outside those hard cases, broad `text-sm` migration, distance-mode behavior, and any claim that a new scale is field-validated. These need named founder/outdoor evidence, an updated `D127` decision, or an explicit field-test gate.

---

## Actors

- A1. Athlete: reads and taps Volleycraft courtside, often in bright light, with short attention windows and imperfect touch conditions.
- A2. Founder/tester: evaluates whether the app feels calm, trustworthy, and readable during founder-use and future field testing.
- A3. Implementing agent or developer: changes app typography without accidentally violating the design docs or outdoor readability floor.
- A4. Reviewing agent or developer: checks whether a typography change preserves product fit, readability, and scope boundaries.

---

## Key Flows

- F1. **Typography decision flow**
  - **Trigger:** A contributor touches screen styling, UI primitives, or run-facing copy.
  - **Actors:** A3, A4
  - **Steps:** Identify the text's role, choose the matching type role, check whether it is active-use or support-use copy, and verify the role is allowed on that surface.
  - **Outcome:** Styling follows the product role instead of ad hoc `text-sm` / `font-semibold` choices.
  - **Covered by:** R1, R2, R3, R4, R5, R6, R10

- F2. **Courtside scale validation flow**
  - **Trigger:** A typography pass proposes raising or lowering text on Run, Safety, Review, Home, Complete, or Settings.
  - **Actors:** A1, A2, A4
  - **Steps:** Compare the proposal against the outdoor brief, inspect at an iPhone-class viewport, and mark whether the change needs real-device field evidence before becoming default.
  - **Outcome:** Scale changes are tied to readability and product trust, not desktop aesthetic preference.
  - **Covered by:** R7, R8, R9, R10, R11, R18, R19, R20

- F3. **Active Run glance flow**
  - **Trigger:** The phone is held at arm's length or set down 1-3m away during a live block.
  - **Actors:** A1
  - **Steps:** Athlete glances at the dominant metric, phase/state, current cue, and primary controls without reading long support text.
  - **Outcome:** Run typography behaves like an instrument panel while preserving access to full instructions outside the immediate glance.
  - **Covered by:** R5, R6, R7, R8, R11, R13

---

## Requirements

**Font-family posture**

- R1. The pass must preserve `Inter Variable` as the default UI/body family and `JetBrains Mono Variable` as the timer/instrument family unless a future field test or design review documents a concrete failure that those families cannot solve.
- R2. JetBrains Mono must remain meaningful rather than decorative: use it for timer, countdown, and exact numeric/instrument surfaces only unless a future requirement explicitly expands that role.
- R3. The pass must not introduce a new external font dependency, remote font request, decorative display face, or broad brand-font replacement.

**Semantic type roles**

- R4. The pass must start from `docs/research/brand-ux-guidelines.md` and `app/src/index.css`; it must not create a parallel typography authority. Role work should begin as a decision checklist, not a mandatory app-wide abstraction.
- R5. The first-pass role checklist must cover the product buckets that drive the selected work: active-run glance, trust/safety support, ordinary support/metadata, action labels, timer/instrument text, and receipt/carry-forward text. Finer roles such as screen title, section title, run detail, state, or footer/trust copy may be added only when the current surface inventory shows a concrete consumer or drift risk.
- R6. Each selected role must specify intended surfaces, size/line-height posture, weight range, color role, active-run eligibility, and at least one current app example.
- R7. The role set must distinguish arm-length app reading from set-down active-run glancing by referencing the existing ladder in `docs/research/outdoor-courtside-ui-brief.md`: arm-length (`56-64px` primary numeral), bench at about 1m (`72-88px`), bench at about 2m (`112-144px`), and 3m edge (`metric-only`). If distance-mode behavior is not shipped, the implementation plan must preserve this as a referenced future ladder rather than inventing a duplicate one.

**Selective scale and hierarchy**

- R8. Active-use and trust-critical text should be evaluated for a selective raise toward `16-18px` before any whole-app body-scale migration is considered, but shipped call-site scale changes must stay inside the ship-now lane unless `D127` is updated.
- R9. The first selective-retune candidates are Run labels/cues, Safety consequence copy, Review blocking/helper copy, and local-first save/trust lines.
- R10. Compact secondary text may remain compact when it is not active-use, trust-critical, or needed at a distance, but it must not fall below the existing design floor: `docs/research/outdoor-courtside-ui-brief.md` sets `16px` as the body minimum and `18px` as the preferred run-label size, while `docs/research/brand-ux-guidelines.md` reserves `text-xs` for explicit footnotes or decorative captions inside large tap targets.
- R11. Timer typography must keep a clear scale break from surrounding text, and the pass must define how to evaluate larger timer states for bench/set-down posture without shipping distance-mode behavior by default.

**Copy and rhythm**

- R12. Support copy touched by this typography pass must have a stated job: consequence, next action, trust, evidence, recovery, or carry-forward/investment. Copy that does not serve one of those jobs should be removed, shortened, or moved behind an existing disclosure pattern rather than made smaller. New disclosure surfaces are out of scope unless a later plan selects them explicitly.
- R13. Typography must reinforce the brand through rhythm, not decoration: calm title, dominant metric where relevant, quiet receipt, single amber action, sentence case, restrained weights, and one primary typographic focal point per screen. Active Run may use an instrument hierarchy with one dominant metric plus subordinate glance targets for phase/state, current cue, and primary controls.
- R14. The pass must preserve the "well-kept notebook" and "instrument panel" balance: human text stays calm and plain; exact numeric/time surfaces may feel more technical.

**Guardrails and verification**

- R15. The pass must identify the smallest useful guardrails for typography drift. Default enforcement is a documented review checklist plus at most one narrow existing-test-style invariant; validation scripts require explicit justification in the implementation plan.
- R16. Guardrails must focus on durable invariants only: forbidden tiny body/support copy, uppercase tracked eyebrow drift, arbitrary text sizes outside approved cases, and run-facing hierarchy regressions.
- R17. Any guardrail or checklist must define an exception model: allowed role, allowed surfaces, active-run eligibility, required rationale, contrast/tap-target constraints, and where the allowlist or review note lives.
- R18. The pass must include browser visual verification at an iPhone-class viewport and note which questions still require real-device outdoor field testing.
- R19. Browser verification must use a screenshot matrix that includes at least: Run active, Safety consequence, Review blocked/helper, Home trust or resume, Complete receipt, and one error/recovery or blocked state.
- R20. Accessibility/readability review must record minimum contrast posture, line-height floor for body/support copy, 200% zoom/no-clipping expectation for touched surfaces, and whether any touched role uses reduced opacity.
- R21. Any updated design decision must be reflected in the owning design docs and registered in `docs/catalog.json` if it creates or changes an active routing surface.

---

## First-Pass Coverage

The implementation plan must start with a surface inventory before choosing any abstraction. Use this table as the minimum coverage contract.

| Surface / route family | Screen job | First-pass posture |
| --- | --- | --- |
| Run (`/run`) | Active timer, cue, phase/state, primary controls | Apply-now for active-run glance roles and screenshot verification |
| Safety (`/safety`) | Consequence and safe-to-train confirmation | Apply-now for trust/safety support and consequence copy touched by the pass |
| Review (`/review`, `/run/check`) | End-session and drill-grain capture without lying | Apply-now for blocker/helper copy touched by the pass; inspect capture states |
| Home (`/`) | Resume, review-pending, repeat, local trust cues | Inspect trust/resume roles; apply only documented hard violations |
| Complete (`/complete`) | Receipt, saved state, carry-forward | Inspect receipt/carry-forward roles; apply only documented hard violations |
| Setup / Tune Today / onboarding | Prep choices and recommendation controls | Inspect-only unless a touched support line is active-use or trust-critical |
| Transition (`/run/transition`) | Between-block handoff | Inspect active-run-adjacent state; defer behavior changes |
| Modals / overlays / prompts | Recovery, blocked, confirm, resume, update | Inspect state-role consistency; apply only hard violations |
| Settings (`/settings`) | Export and local storage explanation | Inspect trust/support roles; defer broad scale changes |

## State Coverage

The pass must check typography roles in non-happy paths, not only default screens. At minimum, review these states where they exist on touched surfaces:

- normal/default
- loading or missing data
- error/recovery
- blocked or schema-blocked
- interrupted/resume
- skipped/partial/incomplete
- success/saved/receipt

## Verification Matrix

Browser verification must produce before/after or current-state screenshots for the first-pass surfaces that changed. At minimum, include:

- Run active
- Safety consequence
- Review blocked/helper
- Home trust or resume
- Complete receipt
- one error, recovery, blocked, or interrupted state

Mark each screenshot as `browser-verified`. Mark any glare, sunglasses, sweat, or 1-3m set-down claim as `field-validation-needed` unless real-device evidence was collected.

---

## Acceptance Examples

- AE1. **Covers R1, R2, R3.** Given the typography pass is underway, when a contributor suggests a new athletic display font, the proposal is rejected unless it names a concrete Inter/JetBrains failure and the evidence source that proves it.
- AE2. **Covers R4, R5, R6, R8, R9.** Given a Safety helper paragraph is currently compact, when the pass evaluates it as consequence or trust-critical copy, it is eligible for a selective scale/contrast raise only if it stays inside the ship-now lane or records the needed field evidence.
- AE3. **Covers R7, R11, R18.** Given Run is inspected at 390 x 844, when the timer is readable at arm's length but questionable at bench distance, the pass records a distance-ladder requirement or test variant instead of silently increasing every screen's text.
- AE4. **Covers R12, R13.** Given a touched screen has several support lines, when one line does not explain a consequence, next action, trust point, evidence, recovery path, or carry-forward cue, it is removed or hidden behind an existing disclosure before shrinking the text.
- AE5. **Covers R15, R16, R17.** Given a future PR introduces `text-[11px]` body-like copy or a new uppercase tracked eyebrow, the guardrail catches it or the reviewer checklist explicitly flags it against the typography contract.
- AE6. **Covers R18, R19, R20.** Given a typography PR claims readability improved, when verification is reviewed, the evidence distinguishes browser-verified hierarchy from field-validated outdoor readability.

---

## Success Criteria

- The typography recommendation is clear: keep Inter + JetBrains Mono unless evidence proves a failure.
- A downstream planner can tell which type roles need to exist and which surfaces are first candidates for selective scale retuning.
- Active-run typography is evaluated as a distance/glanceability problem, not a generic app text-size problem.
- On iPhone-class Run, Safety, Review, Home, and Complete surfaces, the athlete can identify the next action, critical consequence, and trust/save state without reading dense support copy.
- The pass improves courtside trust and readability without making the whole app feel heavier, louder, or more like a dashboard.
- Future agents have a concrete way to avoid typography drift during unrelated UI work.

---

## Scope Boundaries

- Do not replace the current font families in this pass.
- Do not install a broad component library or theme replacement to solve typography.
- Do not globally migrate every `text-sm` call-site without field evidence.
- Do not add a user-facing typography settings screen or distance-mode toggle unless a later plan selects it explicitly.
- Do not change session generation, timer mechanics, data model, drill catalog, or routes.
- Do not lower contrast or shrink text in the name of shibui restraint.
- Do not turn guardrails into exhaustive snapshot tests for every class name; protect durable invariants only.

---

## Key Decisions

- **Font decision:** Keep `Inter Variable` and `JetBrains Mono Variable` as the current product-fit default.
- **Primary problem framing:** Treat typography work as role, scale, rhythm, and evidence work, not font shopping.
- **Scale posture:** Use selective courtside retuning before any whole-app body-scale migration.
- **Run posture:** Treat active Run as an instrument-panel surface, especially when the phone is set down.
- **Brand posture:** Make the app feel owned through repeated rhythm and state behavior, not decorative typography.

---

## Dependencies / Assumptions

- `docs/vision.md` remains the product-principle authority.
- `docs/research/outdoor-courtside-ui-brief.md` remains the readability authority.
- `docs/research/brand-ux-guidelines.md` remains the concrete type/color/copy contract until this pass updates it.
- `docs/decisions.md` `D127` remains in force: broad body-scale shift needs field evidence.
- Browser inspection is useful for hierarchy and visual rhythm, but real-device outdoor testing is still needed for glare and set-down distance.

---

## Outstanding Questions

### Resolve Before Planning

- None.

### Deferred to Planning

- [Affects R4-R7][Technical] What is the smallest implementation substrate for the role checklist: docs-only, Tailwind theme tokens, CSS utility classes, component props, TypeScript constants, or a hybrid?
- [Affects R11, R18-R20][Needs research] What is the cheapest way to compare arm-length and bench-distance Run typography during founder-use without adding user-facing settings?
- [Affects R15-R17][Technical] Which guardrails belong in the review checklist versus the single allowed narrow test-style invariant?

---

## Next Steps

-> `/ce-plan` for structured implementation planning.
