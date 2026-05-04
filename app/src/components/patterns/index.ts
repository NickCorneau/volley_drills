// Volleycraft-shaped composite primitives. Distinct from `components/ui/`
// (atomic primitives) — these compose ui/ primitives into app-specific
// patterns: courtside-flow headers, the run-flow finished-pill, the
// confirm-modal shell over ActionOverlay, the back-button affordance
// the pre-run/settings flow always wraps.
//
// New code should import from this folder directly. The
// `components/ui/index.ts` barrel continues to re-export the same
// symbols for back-compat during the migration (plan U11).

export { BackButton } from './BackButton'
export { ConfirmModal } from './ConfirmModal'
export type { ConfirmAction, ConfirmModalPlacement, ConfirmModalProps } from './ConfirmModal'
export { JustFinishedPill } from './JustFinishedPill'
export type { JustFinishedPillProps, JustFinishedStatus } from './JustFinishedPill'
export { RunFlowHeader } from './RunFlowHeader'
export type { RunFlowHeaderProps } from './RunFlowHeader'
export { ScreenHeader } from './ScreenHeader'
export type { ScreenHeaderProps } from './ScreenHeader'
