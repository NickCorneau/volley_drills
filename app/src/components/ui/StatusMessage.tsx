import type { ReactNode } from 'react'

type StatusMessageProps =
  | { variant: 'loading'; message?: string }
  | { variant: 'error'; message: string }
  | { variant: 'empty'; message: string; action?: ReactNode }

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
        <p className="rounded-[12px] bg-warning-surface px-4 py-3 text-center text-sm font-medium text-warning">
          {props.message}
        </p>
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
