---
title: "fix: Setup resolved line reads focus from the preview build (atomic segments)"
type: fix
status: complete
date: 2026-06-12
origin: ce-code-review run 20260612-155203-19af225a, finding #10 (correctness + adversarial, validated)
---

# fix: Setup resolved line reads focus from the preview build (atomic segments)

## Summary

Close the one advisory left open by the D158 post-review sweep: the Setup focal resolved line (`{archetype} · {minutes} min · {focus} focus`) derives its focus segment from live chip state (`sessionFocus`) while archetype/minutes come from `previewDraft`, which rebuilds in a `useEffect` one commit after a chip tap. For one painted frame the line can pair the NEW focus label with the PREVIOUS build's archetype/minutes — a torn read on a screen whose stated contract (duration-honesty, D158) is that its statements never disagree. Fix by sourcing all three segments from the preview build: `previewDraft.context.sessionFocus ?? 'recommended'`.

## Requirements

| ID | Requirement |
|---|---|
| R1 | The resolved line's focus label derives from `previewDraft.context`, not live chip state, so archetype, minutes, and focus always describe the same build. |
| R2 | Behavior after effects settle is unchanged: an explicit focus chip tap still updates the line to the new focus label (existing `waitFor` test keeps passing). |
| R3 | Post-focus-change minutes agreement (resolved line vs footer Callout) gains a test pin — the review flagged this as unpinned (testing gap). |

## Implementation Units

### U1. Atomic focus derivation

`app/src/screens/SetupScreen.tsx` `resolvedLine` memo: replace the `sessionFocus` read with `previewDraft.context.sessionFocus ?? 'recommended'` (the context stamps `sessionFocus` only when not `'recommended'`, per `previewContext` construction); drop `sessionFocus` from the memo deps.

### U2. Test pin

`app/src/screens/__tests__/SetupScreen.test.tsx`: extend the existing "tracks an explicit focus chip change" case to also assert the resolved line's minutes equal the footer Callout's minutes after the change (closes the post-change agreement gap).

## Verification

- `npx vitest run src/screens/__tests__/SetupScreen.test.tsx`
- `npx tsc -b`, `npm run lint`
- Browser spot-check of `/setup` focus toggling (pipeline browser step)
