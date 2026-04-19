import { db } from '../db'

/**
 * Key-value storage helper for the Dexie v4 `storageMeta` table (C-0 Unit
 * 3).
 *
 * `value` is typed as `unknown` at the schema level (C-0 Key Decision #4);
 * callers pass a type guard on read so the unsafety stays at the read
 * boundary and the rest of the app sees a concrete type.
 *
 * Atomicity (C-0 Key Decision #5):
 *
 * - `setStorageMeta` (single-key) is atomic via IDB's per-operation
 *   transaction semantics. No explicit wrap needed.
 * - `setStorageMetaMany` explicitly wraps in `db.transaction('rw',
 *   db.storageMeta, ...)` so all keys land together or none do.
 * - Callers that need **read-then-write** atomicity (for example the A7
 *   check-and-set on `ux.softBlockDismissed.{execId}` in C-1 / C-4) MUST
 *   open their own `db.transaction('rw', db.storageMeta, async () => {
 *   ... })`. This module intentionally does NOT expose a generic
 *   read-then-write primitive.
 */

/**
 * Read a typed value from `storageMeta`.
 *
 * Returns `undefined` if the key is absent OR if the stored value fails
 * the supplied type guard. Callers should treat `undefined` as "no usable
 * value" and fall back to their default.
 */
export async function getStorageMeta<T>(
  key: string,
  guard: (v: unknown) => v is T,
): Promise<T | undefined> {
  const entry = await db.storageMeta.get(key)
  if (!entry) return undefined
  if (!guard(entry.value)) return undefined
  return entry.value
}

/**
 * Write (or overwrite) a single `storageMeta` key. Single-key writes are
 * atomic via IDB per-operation transaction semantics.
 */
export async function setStorageMeta(
  key: string,
  value: unknown,
): Promise<void> {
  const now = Date.now()
  await db.storageMeta.put({ key, value, updatedAt: now })
}

/**
 * Write multiple `storageMeta` keys atomically: all keys land together, or
 * none do if the transaction fails.
 *
 * An empty entries object is a no-op (resolves without opening a
 * transaction).
 */
export async function setStorageMetaMany(
  entries: Record<string, unknown>,
): Promise<void> {
  const keys = Object.keys(entries)
  if (keys.length === 0) return
  const now = Date.now()
  await db.transaction('rw', db.storageMeta, async () => {
    for (const key of keys) {
      await db.storageMeta.put({ key, value: entries[key], updatedAt: now })
    }
  })
}
