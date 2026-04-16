import type { ExecutionLog, ExecutionStatus } from '../db'
import type { BlockSlotType } from '../types/session'

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatDuration(minutes: number): string {
  return minutes === 1 ? '1 min' : `${minutes} min`
}

export function formatDurationLine(log: ExecutionLog): string {
  const end = log.completedAt ?? log.pausedAt
  if (!end) return '\u2014'
  const mins = Math.max(1, Math.round((end - log.startedAt) / 60000))
  return `${mins} min`
}

export function formatInterruptedAgo(interruptedAt: number): string {
  const ms = Date.now() - interruptedAt
  const s = Math.floor(ms / 1000)
  if (s < 45) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return m === 1 ? 'about 1 min ago' : `about ${m} min ago`
  const h = Math.floor(m / 60)
  return h === 1 ? 'about 1 hr ago' : `about ${h} hr ago`
}

export function statusLabel(status: ExecutionStatus): string {
  switch (status) {
    case 'completed':
      return 'Complete'
    case 'ended_early':
      return 'Ended early'
    case 'in_progress':
      return 'In progress'
    case 'not_started':
      return 'Not started'
    case 'paused':
      return 'Paused'
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

export function effortLabel(rpe: number): string {
  if (rpe < 4) return 'Easy'
  if (rpe < 7) return 'Moderate'
  if (rpe < 10) return 'Hard'
  return 'Max'
}

export function phaseLabel(type: BlockSlotType): string {
  switch (type) {
    case 'warmup':
      return 'WARM UP'
    case 'wrap':
      return 'DOWNSHIFT'
    case 'technique':
    case 'movement_proxy':
    case 'main_skill':
    case 'pressure':
      return 'WORK'
    default: {
      const _exhaustive: never = type
      return _exhaustive
    }
  }
}
