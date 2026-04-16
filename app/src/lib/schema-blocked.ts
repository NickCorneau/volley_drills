type Listener = () => void

const listeners = new Set<Listener>()

let blocked = false

export function subscribeSchemaBlocked(fn: Listener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function emitSchemaBlocked(): void {
  blocked = true
  for (const fn of listeners) {
    try {
      fn()
    } catch (error) {
      console.warn('schema-blocked listener failed', error)
    }
  }
}

// Exposes the sticky blocked flag so screen-level error handlers can avoid
// rendering their own error state when the overlay is already taking over the
// UI. See the Phase B reliability review: `db.close()` fires in-flight write
// rejections that otherwise land in catch → setState('error') paths.
export function isSchemaBlocked(): boolean {
  return blocked
}

// Test-only: reset the sticky flag and clear listeners between test cases.
// Production code must not call this.
export function resetSchemaBlockedForTesting(): void {
  blocked = false
  listeners.clear()
}
