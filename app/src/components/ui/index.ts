// Atomic UI primitives. App-shaped composites (ScreenHeader, RunFlowHeader,
// ConfirmModal, JustFinishedPill, BackButton) live in `../patterns/` —
// re-exported here for back-compat (plan U11).

export { ActionOverlay } from './ActionOverlay'
export { Button } from './Button'
export type { ButtonVariant } from './Button'
export { Callout } from './Callout'
export type { CalloutEmphasis, CalloutProps, CalloutSize, CalloutTone } from './Callout'
export { Card } from './Card'
export { ChoiceRow } from './ChoiceRow'
export type { ChoiceRowLayout, ChoiceRowOption, ChoiceRowProps } from './ChoiceRow'
export { ChoiceSection, ChoiceSubsection } from './ChoiceSection'
export type { ChoiceSectionProps, ChoiceSubsectionProps } from './ChoiceSection'
export { Disclosure } from './Disclosure'
export type { DisclosureProps } from './Disclosure'
export { Expander } from './Expander'
export type { ExpanderProps } from './Expander'
export { NumberCell } from './NumberCell'
export type { NumberCellProps } from './NumberCell'
export { ScreenShell } from './ScreenShell'
export { StatusMessage } from './StatusMessage'
export { ToggleChip } from './ToggleChip'
export type { ToggleChipProps, ToggleChipShape, ToggleChipSize, ToggleChipTone } from './ToggleChip'

// Back-compat re-exports of moved primitives. New code should import from
// `components/patterns` directly; these stay so call-sites that already
// import from `components/ui` keep working without churn.
export { BackButton, ConfirmModal, JustFinishedPill, RunFlowHeader, ScreenHeader } from '../patterns'
export type {
  ConfirmAction,
  ConfirmModalPlacement,
  ConfirmModalProps,
  JustFinishedPillProps,
  JustFinishedStatus,
  RunFlowHeaderProps,
  ScreenHeaderProps,
} from '../patterns'
