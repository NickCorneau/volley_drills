import type { ExecutionLog, SessionPlan, SessionReview, StorageMetaEntry } from '../db/types'
import { db } from '../db'

/**
 * V0B-15: raw training-record JSON export (Phase E Unit 2).
 *
 * Founder tooling. Dumps the tables that D91 adherence-dimensions
 * replay + D104 binary-score replay need, in a stable shape the
 * founder's replay scripts consume directly. Not intended for tester
 * consumption: there is no summary layer, no filter UI, no import
 * flow. The tester taps Export on SettingsScreen; founder collects the
 * JSON during weekly check-ins out-of-band.
 *
 * Shape decisions (see `docs/archive/plans/2026-04-17-feat-phase-e-content-tooling-plan.md`
 * Unit 2, Key Decisions):
 * - `sessionDrafts` excluded - transient pre-session state, deleted
 *   after session creation. Not historically interesting.
 * - `timerState` excluded - single-row runtime state. Not replay
 *   material.
 * - `storageMeta` included - tiny, surfaces onboarding-completion
 *   timing + A7 soft-block dismissal traces that help debug field
 *   issues.
 * - `storageHealthEvents` NOT a table (V0B-26 cut per H5). Nothing to
 *   export.
 */

export interface ExportPayload {
  schemaVersion: 4
  exportedAt: number
  sessionPlans: SessionPlan[]
  executionLogs: ExecutionLog[]
  sessionReviews: SessionReview[]
  storageMeta: StorageMetaEntry[]
}

/**
 * Read every included table and return a deep-cloned payload so the
 * caller (`downloadExport` or a test mutating the result) can't
 * accidentally mutate the live Dexie rows.
 */
export async function buildExportPayload(): Promise<ExportPayload> {
  const [sessionPlans, executionLogs, sessionReviews, storageMeta] = await Promise.all([
    db.sessionPlans.toArray(),
    db.executionLogs.toArray(),
    db.sessionReviews.toArray(),
    db.storageMeta.toArray(),
  ])
  // `structuredClone` isolates the returned payload from the backing
  // Dexie rows. Without it, mutating `payload.sessionPlans[0]` in
  // consumer code would silently leak into the next Dexie fetch.
  return structuredClone({
    schemaVersion: 4 as const,
    exportedAt: Date.now(),
    sessionPlans,
    executionLogs,
    sessionReviews,
    storageMeta,
  })
}

/**
 * Serialize the payload to JSON, wrap it in a Blob, and trigger a
 * browser download. Uses the classic anchor-click pattern rather than
 * any library so we don't ship FileSaver.js or similar just for one
 * download path. Works in every PWA display mode (standalone,
 * fullscreen, browser tab).
 *
 * Revokes the object URL on next microtask so the browser has a chance
 * to start the download before we free the handle.
 */
export async function downloadExport(): Promise<void> {
  const payload = await buildExportPayload()
  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const dateStamp = new Date().toISOString().slice(0, 10)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `volley-drills-export-${dateStamp}.json`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
