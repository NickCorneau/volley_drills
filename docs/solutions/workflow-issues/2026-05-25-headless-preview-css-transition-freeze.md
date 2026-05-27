---
id: headless-preview-css-transition-freeze-2026-05-25
status: active
stage: validation
type: solution
title: "Headless preview CSS transition freeze (Claude Preview MCP)"
date: 2026-05-25
category: workflow-issues
module: design-critique
problem_type: tooling_artifact
component: preview-tool
severity: medium
applies_when:
  - "Running design / a11y critique via `mcp__Claude_Preview__*` tools"
  - "`preview_inspect` returns surprising `getComputedStyle` values for an element that has `transition-colors` or any `transition-*` utility"
  - "An element's `className` includes a state-utility (e.g. `bg-warning-surface`) but the computed value is the *unselected* default"
  - "`preview_screenshot` intermittently times out for ~30 s after navigation while `preview_eval` keeps working"
  - "A `cloneNode(true)` of the surprising element renders correctly but the original does not"
tags:
  - preview-tool
  - css-transitions
  - design-critique
  - debugging
  - mcp
  - false-alarms
---

# Headless preview CSS transition freeze (Claude Preview MCP)

## Context

During the 2026-05-25 e2e design-critique pass, the selected pain-`Yes` chip on `SafetyCheckScreen` read as white background + gray text + a faint near-black border, even though its `className` correctly included `border-2 border-warning bg-warning-surface text-warning-strong`. The natural conclusion would have been: *"a systemic styling bug — the warning utilities aren't producing the expected colors, every destructive/safety chip in the app is broken."*

That conclusion would have been wrong. The same `className` rendered correctly on a `cloneNode(true)` of the element in the same parent, and on a minimal probe element with just those three classes. The real chip alone showed the stale computed values. The root cause was the **preview tool's headless renderer**, not the app's CSS.

The same root cause also explains the intermittent `preview_screenshot` timeouts I hit throughout the session: the paint pipeline was wedged, so neither in-flight CSS transitions nor screenshot capture could advance.

## Root cause

The `mcp__Claude_Preview__*` server runs Chromium in headless mode with a **throttled paint loop**. CSS transitions don't fire `transitionend` and don't advance their interpolated value when the tab isn't actively painting frames. `getComputedStyle()` returns the *currently-rendered* (animating-from) value, not the resolved target value. The element has 6 transitions running on it indefinitely (per the `transition-colors` Tailwind utility, which expands to `color`, `background-color`, `border-color`, `outline-color`, `text-decoration-color`, `fill`, `stroke`, and the three `--tw-gradient-*` custom properties).

In a real browser tab, the 150 ms transition completes immediately on the first repaint after the class swap and the visible chip shows the warning colors. In the headless preview, the chip stays painted at the unselected default forever — there's no repaint to advance the interpolation.

## Symptoms

Watch for any of these — they're all the same underlying artifact:

1. **`preview_inspect`** returns `getComputedStyle` values that contradict the element's `className`. Common signature: `bg-{state-token}` and `text-{state-token}` classes are present, but `background-color: rgb(255, 255, 255)` and `color: rgb(75, 85, 99)` come back (the "unselected default" before the transition started).
2. **`preview_screenshot`** times out after ~30 s, particularly right after a `preview_eval`-triggered navigation. The page is fully responsive (`preview_eval` still works), but the capture never resolves.
3. **`preview_snapshot`** (a11y tree) reports the correct semantic state — `aria-checked="true"`, the right `role`, etc. — even when `preview_inspect` reports the wrong visual styling. The a11y tree is read from the React-controlled attributes, not from paint state.
4. **`element.getAnimations()`** returns a list of `running` animations whose `playState === "running"` indefinitely (e.g., `6` transitions still running seconds after the class change).
5. A `cloneNode(true)` of the surprising element rendered correctly in the same parent, because the clone is created already-at-the-target-state — it has no *from* value to transition from, so the throttled paint loop doesn't matter.

## Diagnostic ladder

When `preview_inspect` returns surprising styles, climb this ladder before reporting as a product bug. Each step is cheap; the whole ladder runs in under a minute.

1. **Re-read the element's `className` and `outerHTML`** via `preview_eval`. Confirm the state-utility classes are actually on the element. If the class isn't there, the bug *is* real (component logic isn't applying the class). If the class is there, continue.
2. **Read the `--color-*` CSS variables** at the document root: `getComputedStyle(document.documentElement).getPropertyValue('--color-warning-surface')`. If the variable is undefined, the Tailwind `@theme` token isn't loaded. If it resolves correctly, continue.
3. **Probe the utility directly** by creating a fresh `<div className="bg-warning-surface text-warning-strong border-2 border-warning">` and reading its computed styles. If the probe renders correctly, the rule is generated and resolves — the bug is element-specific, not utility-wide. Continue.
4. **Clone the surprising element** with `cloneNode(true)` into the same parent and read its computed styles. If the clone renders correctly (and the original doesn't), the issue is mid-flight transition or stale paint — not the element's class composition. Continue.
5. **Force `transition: none` on the original** and trigger a reflow: `el.style.transition = 'none'; void el.offsetWidth;` then re-read computed styles. If the values now snap to the target, the transition was frozen — the root cause is the headless paint throttle.
6. **Check `el.getAnimations()`** if step 5 isn't decisive. Six perpetually-running animations on an element that should have a 150 ms transition is the giveaway.

Once steps 3 and 4 both render correctly and step 5 snaps to the target, the original element's CSS is fine — the artifact is the preview environment. Report nothing as a product bug.

## Resolution / what to do instead

- **Trust the source code + the probe**, not the surprising `preview_inspect` value.
- For finalised state assertions, use a probe element (`cloneNode` or a freshly-constructed div with the target classes). The probe is the ground truth for what real browsers will paint.
- For screenshot timeouts: a `preview_resize` (any change, even by 1 px) tends to unwedge the capture pipeline. Resize to mobile preset and back, or change height by 1 px and immediately retry the screenshot.
- For end-to-end visual verification, use the production-build pathway (Playwright + `vite preview` from the `e2e/` suite) rather than the dev-server preview. The Playwright Chromium instance paints normally.

## What NOT to do

- **Do not report "the selected state is invisible / styling is broken" as a product finding** until the full diagnostic ladder confirms the issue isn't the preview environment. The 2026-05-24 production-build review (Playwright + axe) is the durable visual-state authority; if it passed there, the dev-server preview's contradicting read is almost always environmental.
- **Do not "fix" the app's CSS** to compensate for the artifact (e.g., removing `transition-colors`, hard-coding non-animated state). Real browsers handle the transition correctly; the fix would degrade the polished feel in the real product.
- **Do not retry screenshots in a tight loop** — the pipeline takes ~30 s to time out each retry. One `preview_resize` is faster than three retries.

## Worked example: the safety pain-Yes chip (2026-05-25 e2e pass)

```js
// Step 1: className confirms the warning classes are applied.
yes.className
// → "... border-2 border-warning bg-warning-surface text-warning-strong ..."

// Step 2: tokens resolve at :root.
getComputedStyle(document.documentElement).getPropertyValue('--color-warning-surface').trim()
// → "#fee2e2" ✓

// Step 3: probe with the same classes renders correctly.
const p = document.createElement('div')
p.className = 'bg-warning-surface text-warning-strong border-2 border-warning'
yes.parentElement.appendChild(p)
getComputedStyle(p).backgroundColor
// → "rgb(254, 226, 226)" = #fee2e2 ✓ (correct)
p.remove()

// Step 4: clone of the real element renders correctly too.
const c = yes.cloneNode(true)
yes.parentElement.appendChild(c)
getComputedStyle(c).backgroundColor
// → "rgb(254, 226, 226)" ✓
c.remove()

// Step 5: force-disable transition on the real element.
yes.style.transition = 'none'
void yes.offsetWidth
getComputedStyle(yes).backgroundColor
// → "rgb(254, 226, 226)" — snaps to target ✓
// Before step 5, returned "rgb(255, 255, 255)" (the from-state).

// Step 6: confirms the artifact.
yes.getAnimations().length
// → 6  (six perpetually-running CSS transitions)
```

Conclusion at step 5: the warning treatment is **correctly wired in code**. The white/gray read was the headless paint throttle freezing the transition at its start value. No product fix was needed; the M1/M2 warning-strong contrast wiring shipped on 2026-05-24 is intact.

## Related

- The 2026-05-25 design-critique pass (delivered in-session, not catalogued as a separate review) used this ladder to retract a near-miss false-alarm finding.
- `docs/plans/2026-05-25-005-polish-design-critique-residuals-plan.md` references this verification class in its method note.
- The screenshot timeouts I hit during the same pass have the same root cause — both transitions and capture stall when the paint loop is throttled.

## For agents

- Use this ladder **before** spinning up a Playwright-based production-build run. The ladder is cheap; the production run is expensive.
- Trust the probe + the source. The preview tool is for navigation and structural assertions (`preview_snapshot`, route checks); it is **not** authoritative for transitioning visual state.
- Production-build axe coverage in `e2e/accessibility.spec.ts` is the durable visual-state authority for shipped behavior.
