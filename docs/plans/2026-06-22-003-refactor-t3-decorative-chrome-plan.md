---
id: plan-2026-06-22-t3-decorative-chrome
title: "refactor: T3 — remove decorative chrome that duplicates meaning the tone already carries"
status: active
stage: build
type: plan
summary: "Fix theme T3 from the 2026-06-22 minimalism/shibui audit: 6 surfaces carrying decorative icons, marks, separators, or card chrome that restate meaning the tone, affordance, or ScreenShell gap already carries. Pure subtraction — remove the warning-triangle SVG, heat-flame SVG, CarryForward bullet, Review/Transition hairlines, CompleteScreen VerdictGlyph, and the bordered chip panel + warm ChoiceSubsection panel. No behavior, data, route, copy, or assembly change; a11y semantics already live on tone/heading/aria."
origin: docs/design/reviews/2026-06-22-minimalism-shibui-audit.md
last_updated: 2026-06-22
depends_on:
  - docs/design/reviews/2026-06-22-minimalism-shibui-audit.md
  - docs/research/brand-ux-guidelines.md
  - .cursor/rules/component-patterns.mdc
---

# refactor: T3 — decorative chrome that duplicates meaning the tone already carries

## Summary

Theme T3 of the 2026-06-22 shibui audit: six surfaces carry a decorative icon, mark, separator, or card chrome whose meaning is already carried by something else on the surface — the `Callout` tone, the chevron affordance, the `ScreenShell` gap, or the verdict word. Apply one rule: **remove the redundant decoration; let the existing signal stand alone.** Pure subtraction.

No behavior, Dexie, route, copy, assembly, or domain change. The removed elements are all `aria-hidden` decoration (SVGs, bullets, separator divs) or non-semantic wrapper chrome (border/background/padding) — so their removal costs no accessibility: tone color, heading text, `aria-label`s, and `aria-live` regions already carry the meaning. The visible *text* on every surface is unchanged, so the test strings these surfaces pin stay green.

## Constraints honored

- **Outdoor legibility floors** — no font, contrast, or tap-target shrink. The Expander trigger keeps its `min-h-[54px]`; the PainOverrideCard `Callout tone="warning"` keeps its surface color and the `text-warning-strong` AA-cleared copy; only the decorative triangle/flame/dot/glyph and the non-semantic panel chrome go.
- **D86** — the CompleteScreen verdict is a neutral steady-state surface (no warning iconography, no red). Removing `VerdictGlyph` strengthens that; the verdict word (`aria-live="polite"`) remains the meaning carrier.
- **D156 Home covenant** — `CarryForwardCell` is a peripheral, lifecycle-gated cell, not the focal slot; removing its decorative bullet is pure subtraction (an element leaves, none arrive). The render-budget test seeds a dark periphery where the cell does not render, so it is unaffected; the cell's `aria-label` region is retained.
- **Accessibility** — `PerDrillCapture` keeps `aria-labelledby="per-drill-heading"`; `ChoiceSubsection` keeps its `aria-labelledby` heading id; `CarryForwardCell` keeps its region `aria-label`; Review keeps its `Card`/section structure. Only visual chrome is removed.
- **component-patterns.mdc** — removing the bordered chip panel and the warm subsection panel moves these surfaces *toward* the calm-body intent, not away from a primitive. No new hand-rolled card chrome is introduced (this is the inverse of T7 drift).

## Implementation Units

### U1 — PainOverrideCard warning-triangle SVG

- **File:** `app/src/components/PainOverrideCard.tsx`
- **Change:** delete the inline warning-triangle `<svg>` (the `<path d="M12 3 2 21h20L12 3z" />` block) and its `flex items-start gap-3` wrapper. The card is already a `Callout tone="warning"`, so the tone surface signals "warning" without a triangle restating it. Collapse the wrapper so the `<h3>` "Switched to a lighter session" + the lighter-session `<p>` lead the card directly. Keep the F12-rationale comment trimmed to a one-line note that the tone now carries the warning signal (drop the emoji-replacement history that no longer applies).
- **Test expectation:** none — no test asserts the SVG; the heading/copy strings are unchanged. Verify the existing `SafetyCheckScreen.*` suites stay green (they render `PainOverrideCard` on `painFlag === true`).

### U2 — Safety heat-expander flame SVG

- **File:** `app/src/screens/SafetyCheckScreen.tsx`
- **Change:** delete the flame `<svg>` (the `<path d="M12 3c0 4-4 5-4 9…" />` block) from the heat `Expander` `trigger`. Pass the trigger as the plain `"Heat & safety tips"` label; the chevron `Expander` appends is the disclosure affordance, so the flame is decorative duplication. Trim the F12 emoji-replacement comment to a one-liner. Leave the `onOpenChange`/`heatExpanded`/`heatCta` wiring untouched.
- **Test expectation:** none new — `heatCta` capture behavior is unchanged. Verify `SafetyCheckScreen.*` suites stay green; the trigger's accessible name still contains "Heat & safety tips".

### U3 — CarryForwardCell decorative bullet dot

- **File:** `app/src/components/home/CarryForwardCell.tsx`
- **Change:** delete the `aria-hidden` bullet `<span>` (`mt-1.5 h-1.5 w-1.5 … rounded-full bg-text-secondary/40`). The cell becomes the region `aria-label` + the single quiet `<p>` line; the `ScreenShell` gap above it already separates it from the primary card, so the dot is decoration. Simplify the `<section>` layout if the `flex items-start gap-2` no longer needs the gap (a single child).
- **Tests:** `app/src/components/home/__tests__/m002Surfaces.test.tsx` asserts the region role + line text only (not the bullet) → no change needed. `HomeScreen.render-budget.test.tsx` seeds a dark periphery (cell absent) → unaffected.

### U4 — Review + Transition hairline separators

- **Files:** `app/src/screens/ReviewScreen.tsx`, `app/src/screens/TransitionScreen.tsx`
- **Change:**
  - **Review:** delete the `<div className="h-px w-full bg-text-secondary/15" role="presentation" aria-hidden="true" />` separator above the metrics card (and the now-redundant fragment wrapper if it only existed to host the hairline + card). The `ScreenShell.Body` gap already separates the RPE card from the metrics card.
  - **Transition:** delete the `<div className="border-t border-text-secondary/10" />` between the just-finished receipt line and the "Up next" block. The body gap separates them.
- **Tests:** `TransitionScreen.quietReceipt.test.tsx` pins the receipt *line* presentation, not the hairline → no change. `ReviewScreen.*` suites assert cards/copy, not the separator → verify green.

### U5 — CompleteScreen VerdictGlyph

- **File:** `app/src/screens/CompleteScreen.tsx`
- **Change:** delete the `VerdictGlyph` function component and its `<VerdictGlyph />` usage in the verdict hero. It is `aria-hidden` (SR-skipped) and decorative — the giant verdict word `<h2>` (`aria-live="polite"`) is the focal meaning carrier, and D86 forbids warning iconography, so a neutral two-bar mark earns nothing. The hero `section` keeps `verdict word → reason → optional carry-forward`. Trim the now-orphaned VerdictGlyph rationale comments in the hero.
- **Tests:** no test references `verdict-glyph` / `VerdictGlyph` (confirmed by grep). `CompleteScreen.summary.test.tsx` asserts the verdict word + `aria-live` + eyebrow rules, not the glyph → verify green.

### U6 — PerDrillCapture bordered chip panel

- **File:** `app/src/components/PerDrillCapture.tsx`
- **Change:** drop the card chrome from the outer `<section>` — remove `rounded-base border border-text-secondary/15 bg-bg-primary p-4`, leaving `flex flex-col gap-3` so the capture surface reads as a calm body inside the otherwise-empty `DrillCheckScreen.Body`, not a re-introduced form panel. Keep `aria-labelledby="per-drill-heading"` and `data-testid="per-drill-capture"`. The required difficulty chips, optional drawers, and gloss behavior are untouched.
- **Tests:** `PerDrillCapture.test.tsx` and `DrillCheckScreen.perDrillCapture.test.tsx` assert chip/drawer/gloss *behavior* and testids, not the border/bg classes → verify green. (Confirm during work that no assertion does `.toContain('border')` on the section className.)

### U7 — ChoiceSubsection warm panel

- **File:** `app/src/components/ui/ChoiceSection.tsx`
- **Change:** in `ChoiceSubsection`, drop the warm card chrome from the wrapper — remove `rounded-base bg-bg-warm/60 p-3`, keeping `flex flex-col gap-3` and the `animate-[choice-subsection-reveal_180ms_ease-out] motion-reduce:animate-none` reveal (the reveal animates opacity/translateY and is the nesting affordance; it does not depend on the background). The nested follow-up (Safety layoff buckets, Setup wall/fence) then reads as a calm body, not a tinted panel inside the calm pre-run flow. The heading id / `headingVariant` / description contract is unchanged.
- **Tests:** `ChoiceSection.test.tsx` asserts heading-variant classes and the heading id / children, not the panel background → verify green.

## Verification

- `npx vitest run` (full suite green — these surfaces pin many strings, but T3 removes only decoration so no string changes are expected) + `npx tsc --noEmit` + `npm run lint`.
- `npm run diagnostics:report:check` must stay current (markup-only proof, no generated-plan impact).
- `bash scripts/validate-agent-docs.sh` (this plan is a new cataloged doc).
- 390px mobile dogfood pass over: Safety (pain-override card + heat tips trigger + layoff-bucket subsection), Drill check (capture body), Review (RPE → metrics spacing), Transition (receipt → up-next spacing), Complete (verdict hero), Home (carry-forward cell, when armed) — confirm each still reads clearly and calmly with the decoration gone.

## Out of scope

- The other audit themes (T1 shipped separately; T2, T4–T8) and the founder-judgment calls (verdict-card line cut, SkillLevel default, run-face eyebrow/SafetyIcon, the em-dash bug) — tracked separately. This plan is T3 only.
- The `Card`/`Callout` primitives themselves are not changed; only the call sites that introduced redundant decoration are subtracted. No new primitive variant is added.
