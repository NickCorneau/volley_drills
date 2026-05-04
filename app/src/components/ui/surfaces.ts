/**
 * Surface tokens used across calm-pass focal cards and elevated overlays.
 *
 * Relocated 2026-05-04 from `components/ui/Card.tsx` so non-Card consumers
 * (option rows on `SkillLevelScreen`, the panel inside `ActionOverlay`,
 * `home/cardStyles.ts` `PRIMARY_CARD_CLASS`) don't have to import from a
 * Card module to reach a class string. `Card.tsx` continues to re-export
 * both constants for back-compat. See
 * `docs/plans/2026-05-04-008-feat-ui-primitive-consolidation-plan.md` U1.
 */

/**
 * Phase F2 (2026-04-19): shared focal-card surface token.
 *
 * Canonical calm-pass surface used across the app's primary content
 * blocks: white surface on the body background, hairline
 * `border-text-primary/10` plus `shadow-sm` only (no `ring`: ring and
 * shadow both paint via `box-shadow` and stack badly at large radii,
 * producing grey corner wedges in WebKit / Chrome). Consumers add
 * their own padding / flex /
 * gap because usages differ (the Home secondary list, for example,
 * owns its own padding via `divide-y` child rows; a content card adds
 * `p-6 flex flex-col gap-4`).
 *
 * Originally introduced in Phase F1 on `HomePrimaryCard`; extracted
 * to a Card-local constant in Phase F2 so every "focal card" across
 * the app draws from the same source of truth and the Japanese-inspired
 * visual direction can't drift surface-by-surface. Promoted to the
 * present surfaces module 2026-05-04 (plan U1) so non-Card consumers
 * can import without a misleading "reach for Card" coupling.
 *
 * Do NOT apply to `RunScreen` or `TransitionScreen`: the outdoor
 * readability contract in `docs/research/outdoor-courtside-ui-brief.md`
 * requires hard contrast and large, unambiguous controls on active
 * blocks; subtle shadows + hairline rings are correct for calm review /
 * settings / onboarding surfaces but wrong for glare-readable run mode.
 */
export const FOCAL_SURFACE_CLASS =
  'rounded-[16px] bg-bg-primary border border-text-primary/10 shadow-sm'

/**
 * Elevated white panel for modals, bottom sheets, and blocking overlays.
 * Same hairline border as `FOCAL_SURFACE_CLASS`, stronger `shadow-lg`.
 * Compose with width / max-width / padding / radius at each call site.
 * Do not add `ring-*` here — see pitfall note on `FOCAL_SURFACE_CLASS`.
 */
export const ELEVATED_PANEL_SURFACE = 'bg-bg-primary border border-text-primary/10 shadow-lg'
