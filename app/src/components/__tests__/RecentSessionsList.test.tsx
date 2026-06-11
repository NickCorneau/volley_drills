import { render, screen } from '@testing-library/react'
import { RecentSessionsList } from '../RecentSessionsList'
import type { ReceiptOutput } from '../../domain/composeReceipt'
import type { RecentSessionEntry } from '../../services/session'
import type { SessionPlan } from '../../model'

/**
 * Home-coherence: the weekly read is merged into the single "Recent
 * sessions" block. These pins guard that the merged header surfaces the
 * temporally-labeled consistency headline ("Last week: N sessions",
 * R6) and the felt-difficulty lines — never an unlabeled/low-history/
 * zero count that would contradict a session shown in the list (the
 * receipt is frozen on last week's close) or read as a deficit (F5).
 */

function planWith(drillName: string): SessionPlan {
  return {
    id: `plan-${drillName}`,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [
      {
        id: 'b1',
        type: 'main_skill',
        drillName,
        shortName: drillName,
        durationMinutes: 10,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: 0,
  }
}

function entry(drillName: string): RecentSessionEntry {
  return { execId: `e-${drillName}`, endedAt: 1_000, plan: planWith(drillName), completed: true }
}

function receipt(overrides: Partial<ReceiptOutput> = {}): ReceiptOutput {
  return {
    consistency: { kind: 'banded', count: 2, band: 'steady' },
    feltDifficulty: { pass: 'often_stretched', serve: 'not_enough_yet', set: 'not_enough_yet' },
    headline: '2 sessions this week.',
    ...overrides,
  }
}

const ROWS = [entry('Continuous Passing')]

describe('RecentSessionsList', () => {
  it('renders nothing when there are no entries', () => {
    const { container } = render(<RecentSessionsList entries={[]} receipt={receipt()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the rows and present felt-difficulty bands', () => {
    render(<RecentSessionsList entries={ROWS} receipt={receipt()} />)
    expect(screen.getByText('Recent sessions')).toBeInTheDocument()
    expect(screen.getByText('Passing: stretching you.')).toBeInTheDocument()
  })

  it('omits felt rows for not_enough_yet focuses', () => {
    render(<RecentSessionsList entries={ROWS} receipt={receipt()} />)
    expect(screen.queryByText(/Serving:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Setting:/)).not.toBeInTheDocument()
  })

  it('labels a strong week with the count AND the ahead-of-rhythm read', () => {
    render(
      <RecentSessionsList
        entries={ROWS}
        receipt={receipt({ consistency: { kind: 'banded', count: 4, band: 'strong' } })}
      />,
    )
    expect(
      screen.getByText('Last week: 4 sessions — ahead of your usual rhythm.'),
    ).toBeInTheDocument()
  })

  it('shows the temporally-labeled headline for a steady week (R6)', () => {
    render(<RecentSessionsList entries={ROWS} receipt={receipt()} />)
    expect(screen.getByText('Last week: 2 sessions.')).toBeInTheDocument()
  })

  it('singularizes a one-session week', () => {
    render(
      <RecentSessionsList
        entries={ROWS}
        receipt={receipt({ consistency: { kind: 'banded', count: 1, band: 'steady' } })}
      />,
    )
    expect(screen.getByText('Last week: 1 session.')).toBeInTheDocument()
  })

  it('renders no headline for a quiet (zero) week or a low-history (absolute) read', () => {
    const { rerender } = render(
      <RecentSessionsList
        entries={ROWS}
        receipt={receipt({ consistency: { kind: 'banded', count: 0, band: 'steady' } })}
      />,
    )
    expect(screen.queryByText(/last week/i)).not.toBeInTheDocument()

    rerender(
      <RecentSessionsList
        entries={ROWS}
        receipt={receipt({ consistency: { kind: 'absolute', count: 3 } })}
      />,
    )
    expect(screen.queryByText(/last week/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/rhythm/i)).not.toBeInTheDocument()
  })

  it('never shows a bare "this week" / "logged so far" count above the list', () => {
    const { container } = render(
      <RecentSessionsList
        entries={ROWS}
        receipt={receipt({
          consistency: { kind: 'absolute', count: 0 },
          headline: '0 sessions logged so far.',
        })}
      />,
    )
    const text = container.textContent ?? ''
    expect(text).not.toContain('this week')
    expect(text).not.toContain('logged so far')
    expect(text).not.toContain('0 sessions')
  })

  it('renders just the list when no receipt is provided', () => {
    render(<RecentSessionsList entries={ROWS} receipt={null} />)
    expect(screen.getByText('Recent sessions')).toBeInTheDocument()
    expect(screen.queryByText(/last week/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Passing:/)).not.toBeInTheDocument()
  })
})
