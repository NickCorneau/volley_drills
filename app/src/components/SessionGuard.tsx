import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type SessionGuardProps = {
  loaded: boolean
  hasData: boolean
  children: ReactNode
}

export function SessionGuard({ loaded, hasData, children }: SessionGuardProps) {
  if (!loaded) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-text-secondary">Loading…</p>
      </div>
    )
  }

  if (!hasData) {
    return (
      <div className="mx-auto flex w-full max-w-[390px] flex-col items-center justify-center gap-4 py-12 text-center">
        <p className="text-text-primary">Session not found.</p>
        <Link
          to="/"
          className="min-h-[54px] inline-flex items-center px-4 font-semibold text-accent underline-offset-2 hover:underline"
        >
          Back to start
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
