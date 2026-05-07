---
title: "D137: Retire /tune-today; canonical pre-run spine Setup → Safety"
date: 2026-05-07
category: architecture-patterns
module: app/pre-run-routing-and-setup
problem_type: architecture_pattern
component: development_workflow
severity: medium
applies_when:
  - "Retiring a standalone pre-run screen after the product spine moves (merge or simplification)"
  - "Bookmarks or deep links may still hit removed paths"
  - "Focus defaults and skill-level overrides are governed by separate decisions (D137 + skill-level mutability)"
tags:
  - d137
  - tune-today
  - pre-run-flow
  - first-open-gate
  - setup-screen
  - safety-check
---

# D137: Retire `/tune-today`; canonical pre-run spine Setup → Safety

## Context

After the 2026-05-05 merge of `feat/focus-coverage-readiness`, the live pre-run path became **Setup → Safety** (focus inline on Setup with **Recommended** defaulted), not Setup → Tune today → Safety. Decision **D137** (see `docs/decisions.md`) ratifies that shape and removes the orphaned **Tune today** surface and related plumbing so agents and users are not tempted to reason about routes the runtime no longer uses.

The friction being solved is **split brain**: an enumerated route table, session assembly, and onboarding gates must not reference a retired path as if it were still a first-class step. Skill level stays a **capability marker** adjusted from **Settings** (`/settings/skill-level`), not a daily “tune” stop.

## Guidance

1. **Single source of truth for live routes** — `routePaths` in `app/src/routes.ts` should list only supported paths. Do not keep `/tune-today` in the public route map once the screen is deleted.

2. **Compatibility at the gate, not in the spine** — treat stale `/tune-today` opens like any other retired entry: handle them in **first-open / boot routing** so bookmarks and PWA cold starts land on a supported route. In this codebase, `FirstOpenGate` continues to treat `/tune-today` as a **first-open entry path** alongside `/` and settings paths so onboarding can run before the user falls through to Home without skill level.

3. **Completed users vs in-progress onboarding** — for users who already have onboarding completion and skill level, the app shell should send a bare `/tune-today` navigation to **Home** (see `App` routing tests). For users still in onboarding, the gate sends stale `/tune-today` links into the onboarding continuation (see `FirstOpenGate` tests).

4. **Delete dead verticals together** — remove the screen module, its controller hook, and session helpers that only existed to serve that step (e.g. tune-specific regeneration). Consolidate focus readiness on **Setup** and the session assembly pipeline already used by the surviving flow.

5. **Contracts and tests** — update P12 screen contracts, RTL tests on `FirstOpenGate`/`App`, and Playwright specs that still navigated by the old path. Keep at least one test proving **stale `/tune-today`** does not mount a removed screen.

## Why This Matters

- One mental model for **where pre-run decisions happen** (Setup + Safety).
- Fewer stale strings and imports that confuse future refactors and e2e.
- Clear separation: **product routing** (`routePaths`) vs **compatibility redirects** (`FirstOpenGate`, shell-level fallbacks).

## When to Apply

- A decision formally retires a route (D137-style), not only hides it in the UI.
- You merge branches that **shorten** the pre-run chain and leave modules orphaned.
- You must preserve **deep-link** behavior for installed PWAs or shared URLs.

## Examples

**Route inventory (`routePaths`)** — no `/tune-today`; pre-run includes `setup` and `safety` only among the session start path:

```1:32:app/src/routes.ts
export const routePaths = {
  home: '/',
  setup: '/setup',
  safety: '/safety',
  run: '/run',
  // ... drillCheck, transition, review, complete, settings, onboarding ...
} as const
```

**First-open compatibility** — `/tune-today` remains only in the **gate’s** entry set so stale first opens still enter onboarding appropriately; comments document D137:

```34:72:app/src/components/FirstOpenGate.tsx
const FIRST_OPEN_ENTRY_PATHS = new Set(['/', '/tune-today', '/settings', '/settings/skill-level'])
// ...
        // D137: `/tune-today` is a retired pre-run route, but stale
        // first-open deep links should still enter onboarding instead
        // of falling through to Home before skill level is collected.
        if (FIRST_OPEN_ENTRY_PATHS.has(entryPath)) {
          navigate(target, { replace: true })
        }
```

**Completed user stale link** — Vitest proves `/tune-today` resolves to Home for onboarded users:

```28:50:app/src/App.test.tsx
  it('falls completed-user stale /tune-today links back to Home', async () => {
    await db.storageMeta.bulkPut([
      {
        key: 'onboarding.completedAt',
        value: 3,
        updatedAt: 3,
      },
      {
        key: 'onboarding.skillLevel',
        value: 'rally_builders',
        updatedAt: 3,
      },
    ])

    render(
      <MemoryRouter initialEntries={['/tune-today']}>
        <App />
        <LocationProbe />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: /volleycraft/i })).toBeInTheDocument()
    expect(screen.getByTestId('current-path')).toHaveTextContent('/')
  })
```

## Related

- Decision row **D137** in `docs/decisions.md`.
- Requirements and flows: `docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md`.
- Plan: `docs/plans/2026-05-06-001-refactor-d137-tune-today-routing-cleanup-plan.md` (when present in repo).
- Tangential workflow doc (founder-use **documentation** routing, not app routing): `docs/solutions/workflow-issues/route-founder-use-feedback-without-overfiring-scope-2026-05-04.md` — mentions “Tune today” only as historical field-evidence context; optional narrow refresh if that doc should explicitly note D137 retirement.
