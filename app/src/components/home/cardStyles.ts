import { FOCAL_SURFACE_CLASS } from '../ui/Card'

/**
 * Shared focal-zone surface for the four HomePrimaryCard variants so
 * they read as "the one thing on screen to attend to."
 *
 * `FOCAL_SURFACE_CLASS` (border + shadow + rounded + bg) is the repo-wide
 * focal surface token; layered on top is the `gap-5 p-6` internal rhythm
 * specific to these cards, plus `active:bg-text-primary/10` for tactile
 * press feedback on descendant buttons (Phase F6 / F9).
 */
export const PRIMARY_CARD_CLASS = `flex flex-col gap-5 p-6 ${FOCAL_SURFACE_CLASS} transition-colors active:bg-text-primary/10`

/**
 * `-mt-2` nudge applied to a tertiary link Button that sits directly
 * below the primary CTA. The link variant has a 44 px hit target that
 * adds ~12 px of invisible padding above its visible text; without this
 * offset the VISIBLE gap between primary CTA and link would exceed the
 * gap between the meta text block and the primary CTA above it. The
 * 44 px tap target is unchanged.
 */
export const LINK_BELOW_PRIMARY_CLASS = '-mt-2'
