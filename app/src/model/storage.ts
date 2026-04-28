/**
 * Generic key-value cell shape used by `services/storageMeta` for
 * cohort sentinels, schema-block markers, and other small bookkeeping
 * values. Persistence-internal: not a product concept on its own.
 */
export interface StorageMetaEntry {
  key: string
  value: unknown
  updatedAt: number
}
