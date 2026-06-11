/**
 * Session-grain clock calibration (KTD5/KTD6) — load the derived
 * overhead ratio.
 *
 * Thin Dexie read over `executionLogs` + `sessionPlans`; the fold
 * itself is pure domain (`deriveSessionCalibration`). One computation,
 * two reads: session assembly callers (plan launch, Setup builds) and
 * the founder export both resolve the calibration through this seam,
 * so the steering input and the diagnostic read can never diverge
 * (D150, mirroring `loadStressPositions`).
 */
import { db } from '../db'
import type { ExecutionLog, SessionPlan } from '../model'
import {
  deriveSessionCalibration,
  type SessionCalibration,
} from '../domain/calibration/sessionCalibration'

/**
 * `prefetched` lets a caller that already holds the row snapshots (the
 * founder export) derive the calibration from those exact rows instead
 * of a second Dexie read, keeping the payload internally consistent.
 * Assembly callers omit it.
 */
export async function loadSessionCalibration(prefetched?: {
  readonly executionLogs: readonly ExecutionLog[]
  readonly sessionPlans: readonly SessionPlan[]
}): Promise<SessionCalibration> {
  const [logs, plans] = await Promise.all([
    prefetched?.executionLogs ?? db.executionLogs.toArray(),
    prefetched?.sessionPlans ?? db.sessionPlans.toArray(),
  ])
  return deriveSessionCalibration(logs, plans)
}
