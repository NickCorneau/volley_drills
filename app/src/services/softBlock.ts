import type { Transaction } from 'dexie'
import { db } from '../db'
import type { StorageMetaEntry } from '../db'
import { getStorageMeta, setStorageMeta } from './storageMeta'

/**
 * A7 (approved red-team fix plan v3 §A7): per-instance dismissal state
 * for the D-C1 Home soft-block review modal. Keyed by `executionId` so
 * the modal fires at most once per pending-review instance.
 *
 * Cleanup note: terminal-review writers (`submitReview`, `expireReview`,
 * `skipReview`) delete the key inside their A3 transaction so
 * `storageMeta` stays bounded - each key lives at most one cap window
 * before its review is finalized.
 *
 * Read-then-write atomicity for the modal itself (C-4) is the caller's
 * responsibility per C-0 Key Decision #5: they open their own
 * `db.transaction('rw', db.storageMeta, async () => { ... })` rather
 * than relying on a generic primitive in `storageMeta.ts`.
 */

const key = (execId: string): string => `ux.softBlockDismissed.${execId}`

const isTrueValue = (v: unknown): v is true => v === true

/**
 * Returns true iff the soft-block modal has been dismissed for this
 * execId (for example by tapping "Skip review and continue" on D-C1).
 */
export async function readSoftBlockDismissed(execId: string): Promise<boolean> {
  const value = await getStorageMeta(key(execId), isTrueValue)
  return value === true
}

/** Persist that the user dismissed the modal for this execId. */
export async function markSoftBlockDismissed(execId: string): Promise<void> {
  await setStorageMeta(key(execId), true)
}

/**
 * Delete the dismissal key for this execId. Terminal-review writers pass
 * their own `tx` so the delete lands inside the same A3 transaction as
 * the terminal-review write; the C-4 modal calls this without a `tx`
 * when it cleans up after an interactive dismiss/resolve cycle.
 */
export async function clearSoftBlockDismissed(execId: string, tx?: Transaction): Promise<void> {
  if (tx) {
    const table = tx.table<StorageMetaEntry, string>('storageMeta')
    await table.delete(key(execId))
    return
  }
  await db.storageMeta.delete(key(execId))
}
