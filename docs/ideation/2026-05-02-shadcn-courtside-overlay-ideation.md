---
id: shadcn-courtside-overlay-ideation-2026-05-02
title: "Ideation: shadcn-informed courtside overlays"
type: ideation
status: active
stage: validation
summary: "Ranked shadcn + frontend-design ideation for using shadcn patterns in Volleycraft without broad design-system churn. Selects a local ActionOverlay primitive inspired by shadcn Dialog/Drawer discipline as the immediate implementation slice."
authority: "Ranked ideation for shadcn-informed UI improvements; does not authorize wholesale shadcn adoption, theme replacement, or new runtime routes."
last_updated: 2026-05-02
depends_on:
  - docs/ideation/2026-05-02-calm-courtside-ux-style-ideation.md
  - docs/design/README.md
  - app/README.md
  - .cursor/rules/component-patterns.mdc
---

# Ideation: shadcn-informed courtside overlays

## Grounding Context

Volleycraft already has a product-specific UI system: local primitives in `app/src/components/ui`, warm surfaces, large tap targets, and a calm mobile-first training posture. `npx shadcn@latest info --json` found a Vite/Tailwind v4 app with no `components.json` and no installed shadcn components. The shadcn registry is still useful as a pattern reference, especially for Dialog/Drawer/AlertDialog structure, but a broad install would add dependencies and token pressure before the app needs a full imported component set.

The strongest external pattern is hybrid: keep local visual primitives, and use headless/shadcn/Radix-style discipline for hard interaction primitives such as overlays. The design-iterator pass recommended treating this as a field-tool interruption layer: safe default focus, short consequence-first copy, no generic modal chrome, no design-system migration.

## Ranked Ideas

### 1. Local ActionOverlay primitive inspired by shadcn Dialog/AlertDialog

**Description:** Extract a local overlay primitive for blocking confirmation surfaces. It keeps Volleycraft styling while centralizing dialog roles, labels, focus trap, focus restore, Escape handling, and safe-default initial focus.

**Rationale:** Existing overlays already repeat the same shape, and `SkipReviewModal` has stronger focus behavior than nearby modals. A shared primitive gives shadcn-level interaction discipline without importing a new visual system.

**Downsides:** Adds a local abstraction. Keep it narrow to blocking action decisions only.

**Confidence:** 94%

**Complexity:** Low-Medium

**Status:** Selected for plan/work

### 2. Capture By Exception disclosure pattern

**Description:** Use shadcn Collapsible/Drawer ideas to make `/run/check` feel like quick capture first, optional detail second.

**Rationale:** Post-block attention is scarce. Disclosure structure could reduce form feeling while preserving data quality.

**Downsides:** Higher behavior risk than overlay extraction because capture eligibility and metric details are domain-shaped.

**Confidence:** 86%

**Complexity:** Medium

**Status:** Unexplored

### 3. Post-session receipt pattern

**Description:** Use shadcn Alert/Card/Collapsible patterns as references for a local receipt surface: saved locally, honest summary, optional details.

**Rationale:** Complete should make an athlete feel finished, not forced into analysis.

**Downsides:** Needs copy and hierarchy work across Review/Complete, not just a component extraction.

**Confidence:** 82%

**Complexity:** Medium

**Status:** Unexplored

### 4. Consequence-first decision blocks

**Description:** Standardize decision surfaces so each choice states the consequence in one line, borrowing AlertDialog information architecture rather than visual defaults.

**Rationale:** Safety, skip review, soft-block review, and Tune Today all ask users to choose a path under attention constraints.

**Downsides:** Mostly a copy/system pass unless anchored to one component now.

**Confidence:** 80%

**Complexity:** Low-Medium

**Status:** Unexplored

### 5. Tune Today intent dial

**Description:** Refine Tune Today with small consequence copy per focus choice, using existing `ToggleChip` rather than shadcn ToggleGroup.

**Rationale:** The pre-run choice can feel like a calm focusing ritual.

**Downsides:** Less directly shadcn-backed and less urgent than overlay safety.

**Confidence:** 74%

**Complexity:** Low-Medium

**Status:** Unexplored

### 6. Local-first trust cue primitive

**Description:** Extract a small `Saved on this device` / `Ready offline` trust cue for Complete, Settings, and Home.

**Rationale:** Local-first trust should be visible before anxiety appears.

**Downsides:** Easy to over-repeat and create clutter.

**Confidence:** 72%

**Complexity:** Low

**Status:** Unexplored

## Rejection Summary

| #   | Idea                                                   | Reason Rejected                                                                                                                  |
| --- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Install shadcn Dialog, Drawer, and AlertDialog broadly | No `components.json`; adds dependencies and a second component idiom before a concrete need justifies it.                        |
| 2   | Replace local Button/Card with shadcn primitives       | Violates the existing product-specific visual system and risks generic SaaS styling.                                             |
| 3   | Build a full responsive drawer/dialog system now       | Useful later, but current confirmations are centered blocking decisions; bottom sheets should wait for active-run quick actions. |
| 4   | Adopt a shadcn preset/theme                            | Too broad and not aligned with the app's shibui design direction.                                                                |
| 5   | Convert all modals in one pass                         | Good destination, but first prove the primitive on the two Home confirmation surfaces.                                           |

## Handoff

Proceed to a focused plan for **ActionOverlay primitive v1**: refactor `SkipReviewModal` and `SoftBlockModal` onto a local shared primitive, preserving existing copy and visuals while improving focus/keyboard consistency.
