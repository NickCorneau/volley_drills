---
title: "feat: Universalize the GlossedText affordance across SegmentList and PerDrillCapture"
type: feat
status: active
date: 2026-05-13
---

# feat: Universalize the GlossedText affordance across SegmentList and PerDrillCapture

## Summary

Refactor `<GlossedText>` into composable primitives (`useGloss` hook + `<GlossInline>` term row + `<GlossReveal>` definition line) so the dotted-underline / tappable-term / quiet-reveal affordance can be wired into `SegmentList` (live drill segment rows) and three sites in `PerDrillCapture` (the "You aimed for:" observable line and the count + streak drawer "Success rule:" lines), eliminating literal `(= …)` rendering in every user-facing prose surface.

---

## Problem Frame

Founder-use dogfood (2026-05-13) found two surfaces still rendering literal `(= …)` parens in courtside copy:

- The live **`SegmentList`** rows on Run (e.g. `Continuous: jog or A-skip (= skip forward …) around your sand box.`).
- The **`PerDrillCapture`** observable line on Drill Check (`You aimed for: Passes graded 2+ (= ball lands within 1 m of the set window with enough arc to be settable) across 24 tosses.`) and the parallel "Success rule:" lines inside the count and streak drawers.

These were **deliberately deferred** in the v1 GlossedText work (see JSDoc in `app/src/components/ui/GlossedText.tsx`) for two layout reasons:

1. SegmentList rows are a 3-column flex grid; the existing `<GlossedText>` wraps in `<div><p>…</p></div>`, which would break the row layout if dropped in.
2. PerDrillCapture renders the description inside a parent `<p>` with bold prefix/suffix; nesting another `<p>` (the existing reveal element) would emit invalid HTML.

The v1 component was tightly coupled to its paragraph-prose layout. Universalizing the affordance requires factoring the parser/state and the two visual atoms (the inline term button and the reveal line) apart, and then composing them in each surface's own structural shape.

---

## Requirements

- R1. The dotted-underline tappable term + 120 ms `↳ definition` reveal renders for every `(= …)` site in `SegmentList`, the `PerDrillCapture` observable line, the `PerDrillCapture` count drawer success-rule line, and the `PerDrillCapture` streak drawer success-rule line.
- R2. SegmentList preserves its existing 3-column grid layout (marker / label / duration) and the `aria-current="step"` + `aria-live` announcer behavior for the active row; the reveal does not push the duration cell out of position.
- R3. PerDrillCapture's parent `<p>` semantics stay valid (no `<p>` nested inside `<p>`).
- R4. The visual contract carries forward unchanged: dotted underline at `border-text-secondary/60`, term button inherits font/color/leading, reveal at `text-sm leading-snug text-text-secondary` with the `↳ ` glyph, 120 ms `gloss-def-reveal` fade, `motion-reduce:animate-none` honored.
- R5. Per-paragraph open scope: opening a term in one paragraph/row swaps any other open term in the same scope; opening a term in a different scope leaves the first one open. Each segment row is its own scope. The PerDrillCapture observable line and each drawer's success-rule line are independent scopes.
- R6. Existing `<GlossedText>` callers (TransitionScreen `courtsideInstructions`, RunScreen overflow `<details>`) keep their current observable behavior — their tests pass without modification.
- R7. The drift-prevention ESLint rule continues to fire on hand-rolled inline term spans outside the canonical primitive files; the rule's allow-list expands to include the new primitive files.
- R8. Plain-text fallback for screen reader / copy-paste round-trip parity holds at every site (textContent of an expanded reveal contains both term and definition).

---

## Scope Boundaries

- The `FLAGGED_TERMS` registry (`app/src/domain/flaggedTerms.ts`) and the parser contract (`app/src/domain/glossedText.ts`) are not changed.
- No catalog copy edits — this is a render-time refactor; `app/src/data/drills.ts` is not modified.
- No new design tokens — the existing dotted-underline, reveal styling, and `gloss-def-reveal` keyframe are reused verbatim.
- ReviewScreen drill-card prose is **not** in scope — current rendering does not include `(= …)` literals on that surface; if any are surfaced later, they'll come in via the same primitives.
- The Setup, Safety, Home, and Complete screens are **not** in scope — none of them render free-form drill copy with `(= …)`.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/components/ui/GlossedText.tsx` — current paragraph-prose component. JSDoc lines 33–55 enumerate the exact deferred contracts being unblocked here.
- `app/src/domain/glossedText.ts` — pure parser; reused unchanged.
- `app/src/domain/flaggedTerms.ts` — registry; reused unchanged.
- `app/src/components/run/SegmentList.tsx` — 3-col grid flex layout (`grid grid-cols-[1rem_1fr_auto] gap-x-3`); each row is a `<li>` with marker / label / duration children. The label sits at `<span className={labelClassForStatus(status)}>`.
- `app/src/components/PerDrillCapture.tsx` — observable line renders inside `<p className="text-sm text-text-secondary" data-testid="per-drill-observable">`; count + streak drawer success-rule lines render inside their own `<p>` with bold prefix/suffix spans (lines 146–153, 259–267, 313–318).
- `app/src/index.css` — `gloss-def-reveal` keyframe already exists and is reused.
- `app/eslint-rules/no-inline-primitive-drift.js` — `forbiddenInlineGlossedTerm` check; the allow-list currently exempts only `GlossedText.tsx` and `__tests__/`.

### Institutional Learnings

- The parser is canonical (rightmost-wins on registry ambiguity, fall-through to last-word); shape-pinned by `app/src/domain/__tests__/glossedText.test.ts`. Do not duplicate parsing in any surface.
- `<GlossedText>` open-state is per-paragraph, not global — that's the contract pinned by the existing RTL test "keeps both definitions open when terms live in different paragraphs". The new primitives must preserve the per-scope contract.
- The current visual contract (dotted at `border-text-secondary/60`, reveal at `text-sm text-text-secondary`, 120 ms fade) was locked in design iteration round 4 and is not up for re-design here.

### External References

- None — this is an internal refactor on top of the existing primitive contracts.

---

## Key Technical Decisions

- **Decompose into hook + two atoms, keep `<GlossedText>` as a thin paragraph-prose wrapper**: extract a `useGloss(text)` hook (returning `parts`, `openTerm`, `openDefinition`, `toggle`), a `<GlossInline>` component that renders only inline term buttons + surrounding text (no wrapper), and a `<GlossReveal>` component that renders the `↳ definition` line. `<GlossedText>` continues to compose these for the paragraph-prose default. Rationale: surfaces with non-paragraph layout (flex grid row, nested `<p>`) need to choose their own structural wrapping. Pulling the primitive apart is the smallest API surface change that fits both new surfaces.
- **SegmentList reveal placement**: render the reveal as a 4th grid item in the active `<li>` with `col-start-2 col-span-2`, sitting beneath the row's marker/label/duration line. Rationale: keeps the reveal within the same `<li>` (so the row has one open scope and the `aria-current="step"` row stays the unit of meaning), aligns the reveal under the label column (visually anchored to the term), and avoids pushing the duration cell or breaking the per-row 1rem marker indent.
- **PerDrillCapture reveal placement**: lift each gloss site into a small per-site React state scope, render the prose `<p>` with `<GlossInline>` inside it, and render `<GlossReveal>` as a sibling element AFTER the parent `<p>`. Rationale: avoids `<p>` inside `<p>` (HTML invariant), preserves the current `text-sm text-text-secondary` register on the description prose, lets the reveal share that register without nesting block elements illegally.
- **Per-row / per-site state, not lifted**: each `SegmentList` row owns its own `useGloss` state; each `PerDrillCapture` gloss site owns its own. Rationale: matches the existing per-paragraph open-scope contract — rows / sites do not interfere with each other's open terms.
- **Lint allow-list**: expand `forbiddenInlineGlossedTerm`'s file allow-list to include the new primitive files (`GlossInline.tsx`, `GlossReveal.tsx`) in addition to `GlossedText.tsx`. Rationale: the dotted-underline class is the canonical signal; the rule should fire on any other site that attempts to recreate the pattern, but must not fire on the canonical homes.

---

## Open Questions

### Resolved During Planning

- **Should the SegmentList reveal sit inside the `<li>` or as a separate row?** → Inside the `<li>` as a `col-start-2 col-span-2` cell. Keeps the active row as the unit of `aria-current` meaning and aligns the reveal under the label column.
- **Should PerDrillCapture's reveal use the same `text-sm text-text-secondary` register as the surrounding prose?** → Yes. The hierarchy that matters is "term-in-prose ↔ revealed-definition", not "secondary prose ↔ tertiary definition". The prose-already-secondary register is fine.
- **Do we keep `<GlossedText>` as the public name, or rename it?** → Keep. It's already exported, tested, used by Transition + Run; renaming buys nothing here.

### Deferred to Implementation

- **Whether `<GlossInline>` should accept a `className` for the inline-text spans** so a caller can override e.g. `text-base text-text-primary` per surface — punt until a real call site needs it. The default is "inherit ambient styling".

---

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```
domain/
  glossedText.ts          (unchanged — parser)
  flaggedTerms.ts         (unchanged — registry)

components/ui/
  useGloss.ts             (NEW — hook)
  GlossInline.tsx         (NEW — inline term row, no wrapper)
  GlossReveal.tsx         (NEW — ↳ definition line)
  GlossedText.tsx         (refactored — paragraph wrapper that composes the above)
  index.ts                (export the new primitives)

components/
  PerDrillCapture.tsx     (use useGloss + GlossInline + GlossReveal at three sites)
  run/SegmentList.tsx     (use useGloss + GlossInline + GlossReveal per row)

eslint-rules/
  no-inline-primitive-drift.js   (allow-list extended to new primitive files)
```

Per-surface composition shape (illustrative only, not implementation):

```
SegmentList row:
  <li class="grid grid-cols-[1rem_1fr_auto] gap-x-3 ...">
    <span>{marker}</span>
    <span class={labelClassForStatus(...)}>
      <GlossInline parts onToggle isOpen />
      {eachSide && " (each side)"}
    </span>
    <span>{durationSec}s</span>
    {openDef && (
      <GlossReveal definition={openDef}
                   className="col-start-2 col-span-2 mt-1.5 text-sm text-text-secondary" />
    )}
  </li>

PerDrillCapture observable:
  <div data-testid="per-drill-observable">
    <p class="text-sm text-text-secondary">
      You aimed for: <GlossInline parts onToggle isOpen />
    </p>
    {openDef && <GlossReveal definition={openDef} />}
  </div>
```

---

## Implementation Units

- U1. **Extract `useGloss` hook**

**Goal:** Pure hook that owns parsed parts, the single-open-term-per-scope state, and the toggle/derived-definition helpers. Used by every consumer.

**Requirements:** R5, R6

**Dependencies:** None

**Files:**
- Create: `app/src/components/ui/useGloss.ts`
- Test: `app/src/components/ui/__tests__/useGloss.test.tsx`

**Approach:**
- Parse text with `parseGlossedText` (reuse, do not re-implement).
- `useState<string | null>` for the open term (one per scope).
- Return `{ parts, openTerm, openDefinition, toggle }`. `openDefinition` is the gloss part's `definition` for the currently open term, or `null`.
- Memoize the parsed parts on `text` so the parser only runs when the input changes.

**Patterns to follow:**
- Existing per-paragraph open-state shape inside `GlossedText.tsx` lines 77–90.

**Test scenarios:**
- Happy path: returns parsed parts and a `null` initial open term.
- Happy path: `toggle('graded 2+')` sets `openTerm` to `'graded 2+'`; `openDefinition` matches the parsed gloss's definition.
- Happy path: `toggle` on an already-open term flips it back to `null`.
- Happy path: `toggle` on a different term swaps the open term.
- Edge case: `useGloss('')` returns `parts=[]`, `openTerm=null`, `openDefinition=null`.
- Edge case: `toggle('term-not-in-text')` sets `openTerm` but `openDefinition` resolves to `null` (defensive — the renderer just won't show a reveal).

**Verification:**
- `npm run typecheck` passes.
- New unit tests green under `vitest run`.

- U2. **Add `<GlossInline>` and `<GlossReveal>` primitives**

**Goal:** Two layout-agnostic atoms — `<GlossInline>` renders the parsed parts as inline text + dotted-underline term `<button>`s (no wrapper element), `<GlossReveal>` renders the `↳ definition` reveal line with optional `className` for surface-specific positioning.

**Requirements:** R4, R5, R7, R8

**Dependencies:** U1

**Files:**
- Create: `app/src/components/ui/GlossInline.tsx`
- Create: `app/src/components/ui/GlossReveal.tsx`
- Test: `app/src/components/ui/__tests__/GlossInline.test.tsx`
- Test: `app/src/components/ui/__tests__/GlossReveal.test.tsx`

**Approach:**
- `<GlossInline parts isOpen onToggle />`: renders a fragment of `<span>` and `<button>` children. The button uses the exact same className stack as today's `GlossedText.tsx` button (lines 130–149) to preserve the visual contract and keep the lint rule's tells intact.
- `<GlossReveal definition className?: string />`: renders a `<p class="mt-1.5 animate-[gloss-def-reveal_120ms_ease-out] text-sm leading-snug text-text-secondary motion-reduce:animate-none {className}">` with the `↳ ` glyph (`aria-hidden`). The `className` prop appends to the defaults so SegmentList can pass `col-start-2 col-span-2`.
- Both primitives are pure presentational; state lives in `useGloss`.

**Patterns to follow:**
- The existing button className stack and reveal `<p>` styling in `GlossedText.tsx` lines 130–164. Copy verbatim into `GlossInline` / `GlossReveal` so the visual contract carries forward unchanged.

**Test scenarios:**
- `<GlossInline>`:
  - Happy path: renders term as `<button>` with dotted-underline classes and `aria-expanded` reflecting the `isOpen` predicate.
  - Happy path: clicking the button calls `onToggle(term)`.
  - Happy path: surrounding text renders as `<span>` siblings; output contains no wrapper `<div>` or `<p>` (composability invariant).
  - Edge case: empty `parts` array renders nothing.
- `<GlossReveal>`:
  - Happy path: renders the `↳ ` glyph (`aria-hidden`) and the definition.
  - Happy path: appends caller's `className` to the default styling stack.
  - Happy path: definition text appears in textContent (screen-reader / copy-paste parity).

**Verification:**
- `npm run typecheck` and `npm run lint` clean.
- Component-level RTL tests green.

- U3. **Refactor `<GlossedText>` to compose the new primitives**

**Goal:** `<GlossedText>` keeps its current public API (`text` prop, paragraph-prose layout, per-paragraph open scope) and observable behavior, but its internals delegate to `useGloss` + `<GlossInline>` + `<GlossReveal>`.

**Requirements:** R5, R6

**Dependencies:** U1, U2

**Files:**
- Modify: `app/src/components/ui/GlossedText.tsx`
- Modify: `app/src/components/ui/index.ts` (export the new primitives + the hook alongside `GlossedText`)

**Approach:**
- Split prose at `\n\n` into paragraphs as today, then per-paragraph: `useGloss` state, render `<p class="...">` containing `<GlossInline>`, then `<GlossReveal>` if a term is open.
- Drop the duplicate state/render machinery now that the atoms own it.
- Update the JSDoc to remove the "deferred" caveats and describe the new composable API. Add a one-paragraph note about when callers should reach for `<GlossedText>` (paragraph prose) vs. compose `useGloss` + the atoms manually (non-paragraph layouts).

**Patterns to follow:**
- The current paragraph-splitting logic in `GlossedText.tsx` lines 95–111 — preserve verbatim, just hand each paragraph to `useGloss` + `<GlossInline>` + `<GlossReveal>`.

**Test scenarios:**
- All existing `app/src/components/ui/__tests__/GlossedText.test.tsx` tests must pass without modification (R6). No new test scenarios are required at this unit — refactor preserves observable behavior.

**Verification:**
- `npm run typecheck`, `npm run lint`, full `vitest run` green; existing GlossedText test file unchanged and passing.

- U4. **Wire `SegmentList` to glossed segment labels**

**Goal:** Each segment row tappable for any flagged term in its label, with the reveal occupying the row's `col-start-2 col-span-2` slot beneath the row.

**Requirements:** R1, R2, R5, R7

**Dependencies:** U2 (atoms), U3 not strictly required but lands first as a cleaner ordering.

**Files:**
- Modify: `app/src/components/run/SegmentList.tsx`
- Test: `app/src/components/run/__tests__/SegmentList.gloss.test.tsx` (new file)

**Approach:**
- Extract a small `<SegmentRow>` subcomponent inside the file (or in-line as a `.map`-bound JSX block) that owns its own `useGloss` for that segment's label. Each row is its own scope.
- Inside the `<li>`, render the marker and duration cells unchanged; replace the label cell's plain `{segment.label}` with `<GlossInline parts isOpen onToggle />`. Append `(each side)` after the inline parts if `segment.eachSide` is set.
- After the duration cell, render `{openDefinition && <GlossReveal definition={openDefinition} className="col-start-2 col-span-2" />}`. The grid auto-flows the reveal beneath the row. The default `mt-1.5` already comes from `<GlossReveal>`.
- Preserve the `aria-current` and `aria-live` announcer behavior verbatim.

**Patterns to follow:**
- The existing `labelClassForStatus(status)` styling stays on the label `<span>`; `<GlossInline>` inherits it.
- Surrounding test patterns in `app/src/screens/__tests__/RunScreen.segments.test.tsx` for segment-row test scaffolding shape.

**Test scenarios:**
- Happy path: a segment whose label contains `A-skip (= …)` renders the term as a `<button>` with `aria-expanded="false"`; clicking it reveals the definition with the `↳` glyph and sets `aria-expanded="true"`.
- Happy path: the duration cell stays in column 3 of the row when the reveal opens (layout invariant — assert via snapshot or DOM-shape — no `class` mutation; the reveal is a sibling, not pushing siblings around).
- Happy path: opening a term in row 1 does not affect the open state of row 2 (per-row scope).
- Happy path: opening a second term in the **same** row swaps the open definition (per-paragraph contract).
- Happy path: a segment whose label contains no `(= …)` renders unchanged (no buttons, no reveal slot).
- Edge case: a segment with `eachSide: true` shows `(each side)` after the inline parts even when a gloss reveal is open.
- Integration: `aria-current="step"` still fires on the active row; the `aria-live` announcer text continues to read the active label (the announcer's textContent already contains the literal `(= …)` form via the parts' raw text — verify it still reads naturally).

**Verification:**
- `npm run typecheck`, `npm run lint`, full `vitest run` green including the new `SegmentList.gloss.test.tsx`.

- U5. **Wire `PerDrillCapture` to gloss the observable + drawer success-rule lines**

**Goal:** Each of the three `successRuleDescription` rendering sites (observable line, count drawer, streak drawer) renders glossed term buttons inline with the reveal as a sibling element after the parent `<p>`.

**Requirements:** R1, R3, R4, R5

**Dependencies:** U2

**Files:**
- Modify: `app/src/components/PerDrillCapture.tsx`
- Modify: `app/src/components/__tests__/PerDrillCapture.test.tsx` (extend existing tests; no test deletion)

**Approach:**
- Introduce a small file-internal `<GlossedDescription>` component that takes `text` and a `prose` render-prop (or a `prefix`/`suffix` pair) and:
  1. Calls `useGloss(text)`.
  2. Renders a `<p>` containing the prefix + `<GlossInline>` + suffix.
  3. Renders `<GlossReveal>` as a sibling after the `<p>` when `openDefinition` is set.
- Replace each of the three success-rule rendering blocks with the new internal component. Parent prose styling and bold prefix/suffix spans stay verbatim — they pass through.
- Keep all existing `data-testid` attributes (`per-drill-observable`, `per-drill-success-rule`) on the parent `<p>` so existing tests still resolve.

**Patterns to follow:**
- The existing observable / count-drawer / streak-drawer prose structure in `PerDrillCapture.tsx` lines 146–153, 259–267, 313–318 — preserve the prefix/suffix bold spans and the testid wiring.

**Test scenarios:**
- Happy path: observable line `You aimed for: Passes graded 2+ (= …) across 24 tosses.` renders `graded 2+` as a `<button>`; tapping reveals the definition.
- Happy path: count-drawer success rule with `graded 2+ (= …)` renders the term as a `<button>`; tapping reveals the definition; the anti-generosity nudge `If unsure, don't count it as Good.` still appears after the description (existing assertion).
- Happy path: streak-drawer success rule renders glossed term buttons; the anti-generosity nudge is still absent (existing D134 contract).
- Integration: `data-testid="per-drill-observable"` and `data-testid="per-drill-success-rule"` still resolve to their canonical elements (existing test selectors keep working).
- Edge case: undefined `successRuleDescription` keeps the line/drawer-rule from rendering at all (existing defensive default test).
- Edge case: a description with no `(= …)` parses to a single text part and renders identically to plain text (no button, no reveal).
- Integration: opening a term in the observable line does not open or close anything in the drawers (per-site scope).

**Verification:**
- `npm run typecheck`, `npm run lint`, full `vitest run` green.

- U6. **Update the lint allow-list and the JSDoc rationale**

**Goal:** Drift-prevention rule still fires on hand-rolled inline term spans outside the canonical primitive files; the deferred-rationale comments in the JSDoc are removed now that those deferrals are unblocked.

**Requirements:** R7

**Dependencies:** U2 (the new files exist), U3, U4, U5 (all surfaces wired so the rule has nothing to flag)

**Files:**
- Modify: `app/eslint-rules/no-inline-primitive-drift.js`
- Modify: `app/eslint-rules/__tests__/no-inline-primitive-drift.test.js`
- Modify: `app/src/components/ui/GlossedText.tsx` (JSDoc only)

**Approach:**
- Extend the file allow-list inside `no-inline-primitive-drift.js`'s `forbiddenInlineGlossedTerm` check from `GlossedText.tsx` to also include `GlossInline.tsx` and `GlossReveal.tsx` by suffix-match (mirror the existing `endsWith('/components/ui/GlossedText.tsx')` shape).
- Add RuleTester cases that prove the rule still fires on a sample inline use outside the allow-list, and does not fire on the new primitive files.
- In `GlossedText.tsx` JSDoc, replace the "Multi-paragraph caveat" / "Prose-styling caveat" deferred-rationale paragraphs with a brief note pointing callers to `useGloss` + `<GlossInline>` + `<GlossReveal>` for non-paragraph layouts. Reference SegmentList and PerDrillCapture as canonical compose-it-yourself examples.

**Patterns to follow:**
- The existing rule structure in `no-inline-primitive-drift.js` (allow-list by `endsWith`).

**Test scenarios:**
- Happy path: the rule fires on a synthetic file with `<button className="border-dotted border-text-secondary/60">` outside the allow-list.
- Happy path: the rule does not fire when the same className appears in `GlossInline.tsx` or `GlossReveal.tsx`.
- Happy path: the rule continues to not fire in `GlossedText.tsx` (existing exemption preserved).

**Verification:**
- `node app/eslint-rules/__tests__/no-inline-primitive-drift.test.js` exits 0.
- `npm run lint` clean across the full app.

---

## System-Wide Impact

- **Interaction graph:** No new entry points; the change is internal to UI primitives + two consumer surfaces. No effect on the run controller, persistence, telemetry, or session lifecycle.
- **Error propagation:** N/A — no new failure modes.
- **State lifecycle risks:** Per-row / per-site React state lives only as long as the host component is mounted. A drill-check session that re-mounts on navigation will reset open terms, which is correct behavior (no hidden persistence).
- **API surface parity:** `<GlossedText>`'s public prop API is unchanged. New exports (`useGloss`, `<GlossInline>`, `<GlossReveal>`) are additive.
- **Integration coverage:** Cross-component integration is exercised by the new `SegmentList.gloss.test.tsx` and the extended `PerDrillCapture.test.tsx`. Existing `RunScreen.segments.test.tsx` and `RunScreen.rationale-placement.test.tsx` continue to assert the surrounding screen contracts.
- **Unchanged invariants:** `parseGlossedText`, `FLAGGED_TERMS`, `gloss-def-reveal` keyframe, the dotted-underline visual contract, all existing `<GlossedText>` consumers' observable behavior.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| The SegmentList grid reveal might shift the duration cell or the marker dot when a row opens | The reveal is rendered as a 4th grid cell with `col-start-2 col-span-2`, so the original 3 columns and the row's height anchors stay in place. New layout assertion in `SegmentList.gloss.test.tsx` plus a manual courtside dogfood pass before commit. |
| `<p>` nested inside `<p>` HTML invariant violation in PerDrillCapture | The reveal is rendered as a sibling element AFTER the parent `<p>`, never inside it. The internal `<GlossedDescription>` enforces this by construction. |
| Accidentally renumbering or breaking existing GlossedText tests during the U3 refactor | U3's only contract is that `app/src/components/ui/__tests__/GlossedText.test.tsx` passes unchanged. CI catches any regression at the existing assertion granularity. |
| Lint allow-list miss — the new primitive files trip the rule and the build fails | U6's RuleTester cases prove the allow-list is correct for both new files; `npm run lint` is part of the verification gate. |

---

## Documentation / Operational Notes

- Update `app/src/components/ui/GlossedText.tsx` JSDoc to remove the "deferred for SegmentList / PerDrillCapture" caveats and document the new composable primitives.
- No `docs/solutions/` entry needed — this is an unblocking refactor, not a new pattern. The existing pattern note already lives in the JSDoc.
- No `docs/catalog.json` change — no canonical doc routing surfaces are added or moved.

---

## Sources & References

- Component JSDoc enumerating the deferred contracts: `app/src/components/ui/GlossedText.tsx` lines 33–55
- Surfaces in scope: `app/src/components/run/SegmentList.tsx`, `app/src/components/PerDrillCapture.tsx`
- Related rules: `app/eslint-rules/no-inline-primitive-drift.js`
- Style register: `app/src/index.css` (`gloss-def-reveal` keyframe)
- Canonical copy rule: `.cursor/rules/courtside-copy.mdc` rule 2 (flagged-vocabulary table) and rule 13 (DO-CONFIRM consumption mode for live-run surfaces)
