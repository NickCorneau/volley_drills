import { useRef, useSyncExternalStore } from 'react'
import { isSchemaBlocked, subscribeSchemaBlocked } from '../lib/schema-blocked'
import { ActionOverlay, Button } from './ui'

export interface SchemaBlockedOverlayProps {
  onReload?: () => void
}

// `useSyncExternalStore` reads the sticky flag on every render (including the
// initial one), so the overlay renders correctly even if `emitSchemaBlocked()`
// fired before the component mounted - e.g., when `db.on('blocked', ...)`
// fires during Dexie's initial open before React's first commit, or during
// a StrictMode remount window.
export function SchemaBlockedOverlay({ onReload }: SchemaBlockedOverlayProps = {}) {
  const blocked = useSyncExternalStore(subscribeSchemaBlocked, isSchemaBlocked, isSchemaBlocked)
  // Plan U2 (2026-05-04): typed initial-focus seam. Hook order matters,
  // so the ref is created unconditionally even though the overlay only
  // renders when `blocked` is true.
  const reloadRef = useRef<HTMLButtonElement>(null)

  if (!blocked) return null

  const handleReload = onReload ?? (() => window.location.reload())

  return (
    <ActionOverlay
      role="alertdialog"
      title="Reload to continue"
      description="A different version of this app is open in another tab. Close other tabs and reload to continue."
      className="bg-black/50 px-4"
      panelClassName="max-w-[390px]"
      initialFocusRef={reloadRef}
    >
      <Button
        variant="primary"
        fullWidth
        onClick={handleReload}
        className="mt-4"
        ref={reloadRef}
      >
        Reload
      </Button>
    </ActionOverlay>
  )
}
