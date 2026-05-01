import type { LastCompleteBundle } from '../../services/session'
import { Button } from '../ui'
import { LINK_BELOW_PRIMARY_CLASS, PRIMARY_CARD_CLASS } from './cardStyles'

export interface LastCompleteCardProps {
  data: LastCompleteBundle
  onRepeat: () => void
  /**
   * Routes to fresh `/setup` (no pre-fill, no banner). Phase F Unit 1
   * replaces the pre-Phase-F `Edit` + `Same as last time` pair.
   */
  onStartDifferent: () => void
  /**
   * Only passed when `data.log.status === 'ended_early'` AND at least
   * one block completed. Caller hides the button via `undefined` for
   * the normal-case last_complete.
   */
  onRepeatWhatYouDid?: () => void
  actionDisabled?: boolean
}

export function LastCompleteCard({
  data,
  onRepeat,
  onStartDifferent,
  onRepeatWhatYouDid,
  actionDisabled = false,
}: LastCompleteCardProps) {
  const plannedTotalMinutes = data.plan.blocks.reduce((sum, b) => sum + b.durationMinutes, 0)
  const daysAgo = formatDaysAgo(data.log.completedAt ?? data.log.startedAt)
  const isEndedEarly = data.log.status === 'ended_early'
  // "Repeat what you did" label shows actually-completed minutes so
  // the label and the rebuilt draft always agree (C-5 Unit 3 risk row).
  const completedMinutes = isEndedEarly
    ? data.plan.blocks.reduce((sum, block, idx) => {
        const status = data.log.blockStatuses[idx]
        return status?.status === 'completed' ? sum + block.durationMinutes : sum
      }, 0)
    : 0
  const canRepeatSubset = isEndedEarly && completedMinutes > 0 && onRepeatWhatYouDid !== undefined

  return (
    <section role="region" aria-label="Your last session" className={PRIMARY_CARD_CLASS}>
      <div>
        <p className="text-sm font-medium text-text-secondary">Your last session</p>
        <p className="mt-1 text-sm font-medium text-text-primary">{data.plan.presetName}</p>
        <p className="mt-0.5 text-sm text-text-secondary">
          {plannedTotalMinutes > 0 ? `${plannedTotalMinutes} min` : ''}
          {plannedTotalMinutes > 0 && daysAgo ? ' \u00b7 ' : ''}
          {daysAgo}
          {isEndedEarly && ' \u00b7 ended early'}
        </p>
      </div>
      {isEndedEarly ? (
        <>
          <Button variant="primary" fullWidth disabled={actionDisabled} onClick={onRepeat}>
            Repeat full {plannedTotalMinutes}-min plan
          </Button>
          {canRepeatSubset && (
            <Button variant="outline" fullWidth disabled={actionDisabled} onClick={onRepeatWhatYouDid}>
              Repeat what you did ({completedMinutes} min)
            </Button>
          )}
        </>
      ) : (
        <Button variant="primary" fullWidth disabled={actionDisabled} onClick={onRepeat}>
          Repeat this session
        </Button>
      )}
      <Button
        variant="link"
        disabled={actionDisabled}
        onClick={onStartDifferent}
        className={LINK_BELOW_PRIMARY_CLASS}
      >
        Start a different session
      </Button>
    </section>
  )
}

function formatDaysAgo(completedAt: number, now: number = Date.now()): string {
  const diffMs = now - completedAt
  if (diffMs < 0) return ''
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}
