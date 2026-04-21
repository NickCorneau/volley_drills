import { useSyncExternalStore } from 'react'
import { isSchemaBlocked, subscribeSchemaBlocked } from '../lib/schema-blocked'
import { Button } from './ui'

export interface SchemaBlockedOverlayProps {
  onReload?: () => void
}

// `useSyncExternalStore` reads the sticky flag on every render (including the
// initial one), so the overlay renders correctly even if `emitSchemaBlocked()`
// fired before the component mounted - e.g., when `db.on('blocked', ...)`
// fires during Dexie's initial open before React's first commit, or during
// a StrictMode remount window.
export function SchemaBlockedOverlay({ onReload }: SchemaBlockedOverlayProps = {}) {
  const blocked = useSyncExternalStore(
    subscribeSchemaBlocked,
    isSchemaBlocked,
    isSchemaBlocked,
  )

  if (!blocked) return null

  const handleReload = onReload ?? (() => window.location.reload())

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="schema-blocked-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <div className="mx-auto flex w-full max-w-[390px] flex-col gap-4 rounded-lg bg-bg-primary p-6 shadow-lg">
        <h2
          id="schema-blocked-title"
          className="text-lg font-bold text-text-primary"
        >
          Reload to continue
        </h2>
        <p className="text-sm text-text-secondary">
          A different version of this app is open in another tab. Close other
          tabs and reload to continue.
        </p>
        <Button variant="primary" fullWidth onClick={handleReload}>
          Reload
        </Button>
      </div>
    </div>
  )
}
