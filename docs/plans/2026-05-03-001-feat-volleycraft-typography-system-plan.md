---
title: "feat: Add Volleycraft typography system guardrails"
type: feat
status: active
date: 2026-05-03
origin: docs/brainstorms/2026-05-02-volleycraft-typography-system-requirements.md
---

# feat: Add Volleycraft typography system guardrails

## Overview

Implement the narrow typography-system pass selected by the requirements doc: preserve the existing `Inter Variable` + `JetBrains Mono Variable` font stack, document a first-pass semantic role checklist, add a route/state/evidence inventory for the current app, and add one targeted guardrail so future UI work does not drift into tiny body/support copy, decorative mono, or dashboard eyebrow patterns.

This plan intentionally does **not** ship a broad type-scale migration, distance mode, a new font, or a new typography abstraction layer. It creates the smallest useful implementation substrate: canonical docs plus one focused validation script wired into the app workspace.

---

## Problem Frame

Volleycraft already has a strong visual direction: light-only, high contrast, warm off-white surfaces, restrained weights, sentence case, `Inter Variable` for human UI, and `JetBrains Mono Variable` for timer/instrument text. The current risk is not the font family. The risk is that typography decisions still happen as raw call-site utility classes, making it easy for future work to drift away from the outdoor readability floor or reopen the font debate.

The origin requirements split work into a ship-now lane and an evidence-gated lane. This plan stays in the ship-now lane: role naming, docs, guardrail/checklist work, and browser verification scaffolding. It does not claim field validation for glare, sweat, sunglasses, or 1-3m set-down use.

---

## Requirements Trace

- R1-R3. Preserve `Inter Variable` + `JetBrains Mono Variable`; no new font dependency, remote font request, decorative display face, or broad brand-font replacement.
- R4-R7. Start from `docs/research/brand-ux-guidelines.md` and `app/src/index.css`; define a first-pass role checklist with examples and reference the existing outdoor distance ladder.
- R8-R11. Evaluate selective scale and timer hierarchy without shipping default scale changes outside the ship-now lane.
- R12-R14. Keep touched support copy job-driven and preserve the well-kept-notebook / instrument-panel balance.
- R15-R17. Add the smallest useful guardrails, with explicit exceptions and no broad lint framework.
- R18-R20. Provide browser verification expectations and accessibility/readability checks.
- R21. Keep routing docs and catalog entries current when active routing surfaces change.

**Origin actors:** A1 Athlete, A2 Founder/tester, A3 Implementing agent or developer, A4 Reviewing agent or developer.

**Origin flows:** F1 Typography decision flow, F2 Courtside scale validation flow, F3 Active Run glance flow.

**Origin acceptance examples:** AE1 font-swap rejection, AE2 selective Safety scale eligibility, AE3 Run distance ladder preservation, AE4 support-copy job check, AE5 guardrail catch, AE6 browser-vs-field validation distinction.

---

## Scope Boundaries

- Do not replace `Inter Variable` or `JetBrains Mono Variable`.
- Do not introduce any new font package, remote font request, component library, or broad theme replacement.
- Do not change `--text-body` / `--text-body-secondary` values or globally migrate `text-sm` call-sites.
- Do not add a user-facing typography setting, distance-mode toggle, new route, or new disclosure surface.
- Do not change session generation, timer mechanics, data model, drill catalog, routing, or review persistence behavior.
- Do not create an exhaustive Tailwind class-name policing framework.

### Deferred to Follow-Up Work

- Field validation of glare, sunglasses, sweat, and 1-3m set-down readability remains a founder/outdoor evidence task.
- Any `D127` update or broad type-scale migration requires a separate decision-backed plan.
- Distance-mode behavior remains future work; this plan only references the existing ladder.

---

## Context & Research

### Relevant Code and Patterns

- `docs/research/brand-ux-guidelines.md` already owns concrete typography roles, font families, weights, casing, color, and screen posture.
- `docs/research/outdoor-courtside-ui-brief.md` owns readability floors and the arm-length / 1m / 2m / 3m distance ladder.
- `docs/research/japanese-inspired-visual-direction.md` owns the structural shibui direction and explicitly yields to outdoor readability.
- `app/src/index.css` owns Tailwind v4 `@theme` font and text tokens, including reserved `--text-body` scaffolding under `D127`.
- `app/src/main.tsx` imports the self-hosted Fontsource families.
- Existing class-sensitive tests such as `app/src/screens/__tests__/RunScreen.rationale-placement.test.tsx` already prove a narrow typography invariant without snapshotting the whole UI.

### Institutional Learnings

- No `docs/solutions/` entries exist yet. Relevant institutional memory is in the design docs and archived Phase F typography plans referenced from `docs/research/brand-ux-guidelines.md`.
- After implementation, consider capturing a short `docs/solutions/` note if the guardrail pattern proves useful for future design-system drift prevention.

### External References

- No new external research is required for this implementation. The existing requirements and design docs already incorporate outdoor readability, PWA font-delivery, and timer prior art.

---

## Key Technical Decisions

- **Use docs + one narrow validator as the substrate:** The first pass does not add component props, a TypeScript typography map, or global utility classes. It extends existing docs and adds one app-local validation script.
- **Guardrail scope:** The validator catches only high-signal drift: new sub-`text-xs` arbitrary text sizes, new uppercase tracked eyebrow patterns outside known exceptions, new arbitrary text sizes outside an allowlist, and decorative `font-mono` outside timer/instrument contexts.
- **Evidence labels stay documentary:** The plan records ship-now vs evidence-gated posture in docs. It does not create runtime feature flags or user-facing modes.
- **Verification separates browser and field evidence:** Browser screenshots can prove hierarchy and obvious layout regressions; they do not prove outdoor glare or set-down readability.

---

## Open Questions

### Resolved During Planning

- **Smallest implementation substrate:** Use existing docs plus one targeted app-local validator. Do not create a new abstraction layer.
- **First guardrail form:** Use a script rather than broad lint integration first, because the rules are repo-specific and should be easy to tune.
- **Route coverage shape:** Use a route/state/evidence matrix in the design docs and reference it from the validator allowlist.

### Deferred to Implementation

- **Exact validator allowlist:** The implementer should derive the final allowlist from current source usage and keep comments next to each exception.
- **Exact screenshot artifact paths:** The implementer can follow the existing Playwright screenshot attachment pattern and choose stable names during implementation.
- **Whether one or two existing tests need updates:** Depends on whether any touched class names change during selective hard-violation fixes.

---

## Implementation Units

- [x] U1. **Document first-pass type roles and evidence lanes**

**Goal:** Update the canonical design contract with the first-pass typography role checklist, ship-now vs evidence-gated lanes, and distance-ladder reference.

**Requirements:** R1-R14, R21; F1, F2, F3; AE1-AE4.

**Dependencies:** None.

**Files:**
- Modify: `docs/research/brand-ux-guidelines.md`
- Modify: `docs/design/README.md`
- Modify: `docs/catalog.json`

**Approach:**
- Add a compact typography-pass section to `docs/research/brand-ux-guidelines.md` that makes the current font stack non-negotiable for this pass.
- Add a first-pass role checklist with role bucket, intended surfaces, current examples, active-run eligibility, and evidence lane.
- Reference the existing outdoor ladder in `docs/research/outdoor-courtside-ui-brief.md`; do not duplicate it as a new authority.
- Update `docs/design/README.md` only if needed to point agents at the new typography-pass subsection.
- Update `docs/catalog.json` if the canonical summary for `brand-ux-guidelines` changes materially.

**Patterns to follow:**
- Existing type-system section in `docs/research/brand-ux-guidelines.md`.
- Design hub routing language in `docs/design/README.md`.
- Machine-readable catalog style in `docs/catalog.json`.

**Test scenarios:**
- Documentation: the role checklist includes active-run glance, trust/safety support, ordinary support/metadata, action labels, timer/instrument text, and receipt/carry-forward text.
- Documentation: the ship-now lane excludes broad `text-sm` migration and any distance-mode behavior.
- Documentation: every distance posture points back to `docs/research/outdoor-courtside-ui-brief.md` instead of creating a duplicate ladder.

**Verification:**
- A future implementer can decide whether a text surface is docs-only, ship-now, browser-verified only, or field-validation-needed without rereading the full requirements doc.

---

- [x] U2. **Add route and state typography inventory**

**Goal:** Make first-pass surface coverage explicit so implementation does not over-apply typography globally or miss active-run-adjacent states.

**Requirements:** R4-R13, R18-R20; F1, F2, F3; AE2-AE6.

**Dependencies:** U1.

**Files:**
- Modify: `docs/research/brand-ux-guidelines.md`

**Approach:**
- Add a route/state/evidence matrix covering `/`, `/setup`, `/tune-today`, `/safety`, `/run`, `/run/check`, `/run/transition`, `/review`, `/complete`, `/settings`, `/onboarding/skill-level`, `/onboarding/todays-setup`, and global overlays/prompts.
- For each row, record screen job, relevant role buckets, apply-now / inspect-only / deferred posture, and evidence lane.
- Define trust-critical copy narrowly: safety consequence, save/local durability, recovery/error action, blocked continuation, active-run expectation setting, and carry-forward receipt.

**Patterns to follow:**
- Per-screen posture table in `docs/research/brand-ux-guidelines.md`.
- Route list in `app/README.md`.

**Test scenarios:**
- Documentation: `/run/check` is first-class rather than hidden under generic Review.
- Documentation: `/run/transition` is active-run-adjacent and inspect-only unless touched.
- Documentation: overlays/prompts include blocked, recovery, confirm, resume, update, and schema-blocked states.

**Verification:**
- The matrix names each current route family and at least one non-happy state cluster.

---

- [x] U3. **Implement a narrow typography guardrail script**

**Goal:** Add one targeted guardrail that catches high-signal typography drift without becoming a broad visual lint framework.

**Requirements:** R15-R17, R21; AE5.

**Dependencies:** U1, U2.

**Files:**
- Create: `app/scripts/validate-typography-guardrails.mjs`
- Modify: `app/package.json`
- Test: `app/scripts/validate-typography-guardrails.mjs`

**Approach:**
- Add a Node script that scans `app/src/**/*.{tsx,ts}` and reports:
  - arbitrary `text-[Npx]` below `12px`
  - arbitrary `text-[Npx]` not in an explicit allowlist
  - uppercase + tracking eyebrow class combinations outside an explicit allowlist
  - `font-mono` outside approved timer/instrument files
- Keep the allowlist local to the script with comments naming the approved role and surface.
- Add an npm script such as `typography:guardrails:check`.
- Do not wire it into every app test command yet unless implementation reveals it is stable enough; the plan's default is opt-in verification.

**Execution note:** Implement script behavior test-first by creating small in-script fixtures or a self-test path if practical; otherwise keep the script simple and verify against the current repo.

**Patterns to follow:**
- Existing Node validation scripts in `app/scripts/`.
- Existing package script naming patterns such as `diagnostics:*:check`.

**Test scenarios:**
- Happy path: current approved timer text sizes and `font-mono` timer usage pass.
- Edge case: a sample class with `text-[11px]` body-like text fails.
- Edge case: a sample uppercase tracked eyebrow outside the paused-state exception fails.
- Edge case: `font-mono` in a non-approved component fails.
- Error path: script reports all violations with file paths and actionable messages, not just a raw count.

**Verification:**
- Running the typography guardrail check on the current workspace reports no violations or only intentionally documented baseline findings that are fixed in U4.

---

- [x] U4. **Fix documented hard-violation typography drift only**

**Goal:** Make only the smallest source edits needed for the guardrail to pass and for hard violations to stop conflicting with the canonical typography contract.

**Requirements:** R8-R12, R15-R17; AE2, AE4, AE5.

**Dependencies:** U3.

**Files:**
- Modify: `app/src/screens/SettingsScreen.tsx` if it contains body-like `text-[11px]`
- Modify: other `app/src/**/*.tsx` files only if the new guardrail identifies hard violations
- Test: existing component or screen tests only if class changes break them

**Approach:**
- Treat current source as mostly valid; do not use this unit to broadly retune sizes.
- Fix below-floor body/support text by moving it to `text-xs` or the documented role, unless it is a true decorative caption covered by the allowlist.
- Fix any new or existing uppercase tracked eyebrow drift by converting to sentence-case role styling, except the approved `BlockTimer` paused state.
- Do not change Run density, timer size, or broad support text scale unless the violation is documented and ship-now eligible.

**Patterns to follow:**
- `app/src/components/ResumePrompt.tsx` comment documenting prior removal of uppercase dashboard-eyebrow voice.
- `app/src/screens/__tests__/RunScreen.rationale-placement.test.tsx` for preserving Run hierarchy.

**Test scenarios:**
- Regression: existing screen/component tests still pass after class-only fixes.
- Guardrail: typography guardrail check passes after source fixes.

**Verification:**
- The diff contains no broad `text-sm` migration and no font-family changes.

---

- [x] U5. **Add browser screenshot verification coverage**

**Goal:** Provide browser-verifiable evidence for changed first-pass surfaces while clearly labeling field-only questions as unresolved.

**Requirements:** R18-R20; F2, F3; AE3, AE6.

**Dependencies:** U1-U4.

**Files:**
- Modify: `app/e2e/run-face.spec.ts` or create a narrow `app/e2e/typography-guardrails.spec.ts`
- Modify: docs if screenshot artifact paths are documented in the plan result

**Approach:**
- Reuse existing Playwright patterns rather than introducing a visual-test framework.
- Capture or assert coverage for the required matrix where surfaces changed: Run active, Safety consequence, Review blocked/helper or `/run/check`, Home trust/resume, Complete receipt, and one blocked/recovery state.
- Mark results as browser verification only. Do not claim outdoor field validation.
- Keep the test resilient: focus on route reachability, key text presence, and screenshot artifacts rather than pixel-perfect assertions.

**Patterns to follow:**
- Existing `app/e2e/run-face.spec.ts`.
- E2E command and screenshot conventions already used in the app workspace.

**Test scenarios:**
- Covers AE6. Browser verification distinguishes browser-verified hierarchy from field-validation-needed distance/glare claims.
- Happy path: Run active screenshot includes timer, phase/state, current cue, and controls.
- Happy path: Safety and Review/Drill Check screenshots include trust-critical helper/blocking text.
- Recovery path: one blocked/recovery/interrupted surface is captured or asserted.

**Verification:**
- Browser verification produces artifacts or test output that a reviewer can inspect without treating it as field evidence.

---

- [x] U6. **Synchronize documentation and validation commands**

**Goal:** Make the new typography pass discoverable and verify all changed docs and app checks.

**Requirements:** R17-R21; all success criteria.

**Dependencies:** U1-U5.

**Files:**
- Modify: `docs/catalog.json`
- Modify: `app/README.md` if the new typography guardrail command should be documented there
- Modify: `docs/design/README.md` if routing changed in U1

**Approach:**
- Register any new active routing surfaces in `docs/catalog.json`.
- Document the guardrail command only where future agents will reasonably look for app verification.
- Preserve `AGENTS.md` and compatibility surfaces unless routing rules change materially.

**Patterns to follow:**
- Existing app verification command section in `app/README.md`.
- Existing design hub update pattern in `docs/design/README.md`.

**Test scenarios:**
- Documentation: catalog entries remain valid after new/changed routing surfaces.
- Verification: app README does not imply the guardrail replaces browser or field validation.

**Verification:**
- Agent docs validation passes.
- App guardrail check passes.
- Focused app tests and browser verification for touched surfaces pass.

---

## System-Wide Impact

- **Interaction graph:** No runtime interaction flow changes are intended. This is docs, validation, class hygiene, and browser evidence only.
- **Error propagation:** The new guardrail script should fail with actionable file-path messages; it must not mutate files.
- **State lifecycle risks:** None for persisted app state. Verification must include non-happy visual states because typography often fails there.
- **API surface parity:** Add only an npm script in the app workspace. No public API, route, Dexie, or export contract changes.
- **Integration coverage:** Browser verification covers route reachability and key typography surfaces; it does not prove outdoor field readability.
- **Unchanged invariants:** Font family, local-first font loading, `D127` body-scale gate, timer mechanics, session data model, and route structure remain unchanged.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| The role checklist becomes a parallel design system | Keep it inside `docs/research/brand-ux-guidelines.md` and explicitly start from existing tokens/docs. |
| Guardrail script becomes brittle class-name policing | Limit to high-signal invariants and explicit allowlist comments. |
| Implementation sneaks in broad scale changes | Require evidence labels and keep all default scale changes outside hard violations out of scope. |
| Browser screenshots are mistaken for outdoor proof | Label artifacts as browser-verified and field-validation-needed separately. |
| Existing dirty tree makes verification noisy | Touch only typography-pass files and report unrelated failures separately. |

---

## Documentation / Operational Notes

- If implementation changes only docs and validation scripts, no `docs/decisions.md` update is required.
- If implementation changes the body scale, distance ladder, or `D127` posture, stop and update the decision path before proceeding.
- Browser verification should be captured at iPhone-class dimensions consistent with prior design reviews.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-02-volleycraft-typography-system-requirements.md](../brainstorms/2026-05-02-volleycraft-typography-system-requirements.md)
- **Ideation:** [docs/ideation/2026-05-02-volleycraft-typography-ideation.md](../ideation/2026-05-02-volleycraft-typography-ideation.md)
- **Design contract:** [docs/research/brand-ux-guidelines.md](../research/brand-ux-guidelines.md)
- **Outdoor readability:** [docs/research/outdoor-courtside-ui-brief.md](../research/outdoor-courtside-ui-brief.md)
- **Visual direction:** [docs/research/japanese-inspired-visual-direction.md](../research/japanese-inspired-visual-direction.md)
- **App status and commands:** [app/README.md](../../app/README.md)
