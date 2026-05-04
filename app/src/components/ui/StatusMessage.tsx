import type { ReactNode } from 'react'
import { Callout } from './Callout'

type StatusMessageProps =
  | { variant: 'loading'; message?: string }
  | { variant: 'error'; message: string }
  | { variant: 'empty'; message: string; action?: ReactNode }

/**
 * Page-state primitive: loading / error / empty. Distinct from `Callout`,
 * which is a tone-driven information surface. Plan U9 (2026-05-04): the
 * `error` variant's body markup now uses `Callout tone="warning" size="sm"
 * role="alert"` so the warning-surface styling lives once on `Callout`;
 * `StatusMessage` keeps the page-state semantic role.
 */
export function StatusMessage(props: StatusMessageProps) {
  switch (props.variant) {
    case 'loading':
      return (
        <div className="flex min-h-[60dvh] items-center justify-center">
          <p className="text-text-secondary">{props.message ?? 'Loading\u2026'}</p>
        </div>
      )
    case 'error':
      return (
        <Callout tone="warning" size="sm" role="alert">
          {props.message}
        </Callout>
      )
    case 'empty':
      return (
        <div className="mx-auto flex w-full max-w-[390px] flex-col items-center justify-center gap-4 py-12 text-center">
          <p className="text-text-primary">{props.message}</p>
          {props.action}
        </div>
      )
    default: {
      const _exhaustive: never = props
      return _exhaustive
    }
  }
}
