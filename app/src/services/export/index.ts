/**
 * Export adapters barrel.
 *
 * - `buildExportSession` (U6 of the architecture pass) is the
 *   per-session, public-facing adapter that transforms a pure model
 *   tuple into a Phase-1.5-ready JSON payload. No Dexie. No services.
 * - The legacy founder export at `services/export.ts` (V0B-15) dumps
 *   raw tables for replay scripts; that surface lives at the parent
 *   `services/export.ts` path and is deliberately not re-exported
 *   here so callers don't accidentally swap a per-session adapter for
 *   a whole-database dump.
 */
export {
  buildExportSession,
  type BuildExportSessionInput,
  type ExportSessionPayload,
  type ExportedBlock,
  type ExportedCapture,
  type ExportedReview,
  type ExportedSession,
} from './sessionExport'
