import type { ReceiptOutput } from '../../domain/composeReceipt'
import type { FeltDifficultyBand } from '../../domain/feltDifficultyProxy'
import { SCOPED_FOCUSES, type ScopedFocus } from '../../domain/eligibleSessions'
import { focusLabel } from '../../domain/sessionFocus'

/**
 * M002.1 U7b — the behavioral weekly receipt, rendered as a frozen,
 * quiet soft-surface section BELOW the fold (D2 IA). Reflective, not a
 * dashboard: a single behavioral headline plus honest per-skill
 * felt-difficulty reads. No accent, no streak, no readiness number, no
 * deficit framing — the calm copy is produced upstream by
 * `composeReceipt` (F5); this component only lays it out.
 */

const BAND_PHRASE: Record<Exclude<FeltDifficultyBand, 'not_enough_yet'>, string> = {
  often_stretched: 'stretching you',
  mixed: 'a mix',
  mostly_comfortable: 'feeling comfortable',
}

function feltLines(felt: Record<ScopedFocus, FeltDifficultyBand>): string[] {
  const lines: string[] = []
  for (const focus of SCOPED_FOCUSES) {
    const band = felt[focus]
    if (band === 'not_enough_yet') continue
    lines.push(`${focusLabel(focus)}: ${BAND_PHRASE[band]}.`)
  }
  return lines
}

export function WeeklyReceiptSection({ receipt }: { receipt: ReceiptOutput }) {
  const felt = feltLines(receipt.feltDifficulty)

  return (
    <section
      role="region"
      aria-label="Your week"
      className="flex flex-col gap-3 rounded-base bg-bg-warm p-4"
    >
      <h2 className="text-sm font-semibold text-text-primary">Your week</h2>
      <p className="text-sm leading-5 text-text-secondary">{receipt.headline}</p>
      {felt.length > 0 && (
        <ul className="flex flex-col gap-1">
          {felt.map((line) => (
            <li key={line} className="text-sm leading-5 text-text-secondary">
              {line}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
