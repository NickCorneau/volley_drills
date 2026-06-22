---
id: plan-2026-06-22-t1-heading-button-redundancy
title: "refactor: T1 — delete headings/labels that restate their own button or value"
status: active
stage: build
type: plan
summary: "Fix theme T1 from the 2026-06-22 minimalism/shibui audit: 8 surfaces where a heading or label restates its own button or value. Consistent rule — drop the restating line, let the card lead with its meaningful value and the button carry the action. Copy/markup-only; no behavior, data, route, or assembly change. Each change is test-string-coupled."
origin: docs/design/reviews/2026-06-22-minimalism-shibui-audit.md
last_updated: 2026-06-22
depends_on:
  - docs/design/reviews/2026-06-22-minimalism-shibui-audit.md
  - docs/research/brand-ux-guidelines.md
  - .cursor/rules/courtside-copy.mdc
---

# refactor: T1 — heading/label restates its own button or value

## Summary

Theme T1 of the 2026-06-22 shibui audit: the most common waste in the app is a heading or label that restates its own button or value. Apply one consistent rule across 8 surfaces — **drop the restating line; let the card/section lead with its meaningful value, and let the button carry the action.** Accessible names already live on `aria-label`/`aria-labelledby`, so dropping the visible restatement costs no a11y.

Copy/markup-only. No behavior, Dexie, route, assembly, or domain change. Every change is coupled to a pinned test string, so each unit updates its tests in the same edit.

## Constraints honored

- Outdoor legibility floors (no font/contrast/tap-target shrink); accessibility (section `aria-label`s and `aria-labelledby` retained — they carry the dropped name for SR); data-honesty (SkipReviewModal's "still saved" consequence is preserved); D156 Home covenant (these are non-`last_complete` primaries; the render-budget test is untouched and line counts only drop); courtside-copy rules.

## Implementation Units

### U1 — ReviewPendingCard
- **File:** `app/src/components/home/ReviewPendingCard.tsx`
- **Change:** drop the `"Finish the quick review."` `<p>` (restates the "Finish review" button; "quick" is hedge ink). Lead with `{data.planName}` promoted to the semibold value line. Buttons unchanged. `aria-label="Review pending"` retained.
- **Tests:** `HomeScreen.test.tsx` pins `/^Finish the quick review\.$/` → update to assert the card by `aria-label`/planName.

### U2 — DraftCard
- **File:** `app/src/components/home/DraftCard.tsx`
- **Change:** drop `"Session ready."` (duplicates `aria-label="Session ready"` + implied by "Continue"). Lead with `{archetypeName}{ · N min}` as the semibold value line.
- **Tests:** `HomePrimaryCard.test.tsx` asserts "Session ready" → re-point to `aria-label` / archetype line.

### U3 — NewUserCard
- **File:** `app/src/components/home/NewUserCard.tsx`
- **Change:** drop `"Build your first beach session."` (restates "Start first session"). Lead with the expectation line `"3 min setup. About 15 min on sand."` as the semibold value line. `aria-label="Ready for your first session"` retained for warmth/SR.
- **Tests:** any pin on the headline → re-point to the expectation line / button.

### U4 — Settings: Export
- **File:** `app/src/screens/SettingsScreen.tsx` (Export card)
- **Change:** drop the description `<p>"Downloads your session history as a JSON file you can share."`; the `h2 "Export training records"` + `Export` button name the action.
- **Tests:** `SettingsScreen.test.tsx` if it pins the description → update.

### U5 — Settings: Skill level
- **File:** `app/src/screens/SettingsScreen.tsx` (skill-level section, set case)
- **Change:** drop the `"Your level: "` prefix; render the label alone (`<span className="font-medium text-text-primary">{label}</span>`). The `h2 "Skill level"` names the concept; the label is the value; `Change` is the action (fact was stated three times). Unset case unchanged (out of T1 scope).
- **Tests:** `SettingsScreen.test.tsx:~179` pins `/Your level/i` → update to assert the label text.

### U6 — CompleteScreen: recap label
- **File:** `app/src/screens/CompleteScreen.tsx`
- **Change:** drop the `<p>"Session recap"` label sitting on a self-describing `<dl>`; the `Card` keeps `aria-label="Session recap"` for SR and the `dt`/`dd` rows are self-labeled.
- **Tests:** `CompleteScreen.carry-forward.test.tsx` `findByText('Session recap')` → switch to `getByLabelText('Session recap')` (the Card's aria-label).

### U7 — DrillCheck question
- **Files:** `app/src/components/PerDrillCapture.tsx`, `app/src/screens/DrillCheckScreen.tsx` (+ caller), tests
- **Change:** the drill name appears twice within ~80px (the `JustFinishedPill` "{drill} · Complete" + the `"How was {drillName}?"` heading). Shorten the heading to `"How was that?"` (the pill keeps the name; the sr-only `h1 "Drill check · {drill}"` keeps SR context). If `drillName` becomes unused in `PerDrillCapture`, remove the prop from the interface + the `DrillCheckScreen` caller + `PerDrillCapture.test.tsx`; if it's still used elsewhere, keep the prop and only change the heading copy. (Confirm prop usage during work.)
- **Tests:** `PerDrillCapture.test.tsx` / `DrillCheckScreen.*` pin `"How was {drill}?"` → update to `"How was that?"`.

### U8 — SoftBlockModal + SkipReviewModal
- **Files:** `app/src/components/SoftBlockModal.tsx`, `app/src/components/SkipReviewModal.tsx`
- **Change:**
  - **SoftBlockModal:** title `"Finish your review first?"` stays; trim the description to the only non-button fact — `"You have a review pending for {planName}."` (drop `"Finish it first, or skip and continue?"`, which literally restates the two buttons).
  - **SkipReviewModal:** title `"Skip review?"` stays; the body carries a real *consequence* + data-honesty (not a button restatement), so apply only the filler trim `"The session is still saved to your history."` → `"Still saved to your history."` Keep the `{planName}` + "out of what comes next" consequence intact.
- **Tests:** any modal description pins → update.

## Verification

- `npx vitest run` (full suite green — many pinned strings touched) + `npx tsc --noEmit` + `npm run lint`.
- `npm run diagnostics:report:check` (must stay current — copy/markup-only proof).
- `bash scripts/validate-agent-docs.sh`.
- 390px mobile pass over Home (the three primary cards), Settings, Complete, Drill check, and the two modals — confirm each still reads clearly with the restatement gone.

## Out of scope

The other audit themes (T2–T8) and the founder-judgment calls (verdict-card line cut, SkillLevel default, run-face eyebrow/SafetyIcon, the em-dash bug — tracked separately). This unit is T1 only.
