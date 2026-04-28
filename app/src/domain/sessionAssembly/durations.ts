import type { BlockSlot, BlockSlotType } from '../../types/session'

const DURATION_PRIORITY: readonly BlockSlotType[] = [
  'main_skill',
  'technique',
  'movement_proxy',
  'pressure',
  'warmup',
  'wrap',
]

export function allocateDurations(
  layout: readonly BlockSlot[],
  totalMinutes: number,
): number[] | null {
  const durations = layout.map((slot) => slot.durationMinMinutes)
  const minTotal = durations.reduce((sum, value) => sum + value, 0)
  const maxTotal = layout.reduce((sum, slot) => sum + slot.durationMaxMinutes, 0)

  if (totalMinutes < minTotal || totalMinutes > maxTotal) return null

  let remaining = totalMinutes - minTotal
  while (remaining > 0) {
    let progressed = false
    for (const slotType of DURATION_PRIORITY) {
      for (let i = 0; i < layout.length; i++) {
        const slot = layout[i]
        if (!slot) continue
        if (slot.type !== slotType) continue
        if (durations[i] >= slot.durationMaxMinutes) continue
        durations[i] += 1
        remaining -= 1
        progressed = true
        if (remaining === 0) return durations
      }
    }
    if (!progressed) return null
  }

  return durations
}

/**
 * Recovery-specific allocator. Warmup and wrap stay pinned at their
 * minimum; reclaimed minutes flow into technique/movement work.
 */
export function allocateRecoveryDurations(
  layout: readonly BlockSlot[],
  totalMinutes: number,
): number[] | null {
  const durations = layout.map((slot) => slot.durationMinMinutes)
  const minTotal = durations.reduce((a, b) => a + b, 0)
  if (totalMinutes < minTotal) return null

  const remaining = totalMinutes - minTotal
  if (remaining === 0) return durations

  const techIdx = layout.findIndex((slot) => slot.type === 'technique')
  const moveIdx = layout.findIndex((slot) => slot.type === 'movement_proxy')

  if (techIdx >= 0 && moveIdx >= 0) {
    const techShare = Math.ceil(remaining * 0.6)
    const moveShare = remaining - techShare
    durations[techIdx] += techShare
    durations[moveIdx] += moveShare
    return durations
  }

  if (techIdx >= 0) {
    durations[techIdx] += remaining
    return durations
  }

  if (moveIdx >= 0) {
    durations[moveIdx] += remaining
    return durations
  }

  return allocateDurations(layout, totalMinutes)
}
