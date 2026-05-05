import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ResumePrompt } from '../ResumePrompt'

const defaultProps = {
  sessionName: 'Solo + Open',
  blockDrillName: 'Partner Passing',
  blockPositionLabel: 'Block 2 of 4',
  interruptedAgo: '12 min ago',
  onResume: vi.fn(),
  onDiscard: vi.fn(),
}

function renderResumePrompt(overrides: Partial<typeof defaultProps> = {}) {
  const props = { ...defaultProps, ...overrides }
  return render(<ResumePrompt {...props} />)
}

describe('ResumePrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders as a labelled dialog with the paused session context', () => {
    renderResumePrompt()

    expect(screen.getByRole('dialog', { name: /session in progress/i })).toHaveAttribute(
      'aria-modal',
      'true',
    )
    expect(screen.getByText(/solo \+ open/i)).toBeInTheDocument()
    expect(screen.getByText(/partner passing/i)).toBeInTheDocument()
  })

  it('autofocuses Reopen session as the safe default action', () => {
    renderResumePrompt()

    expect(document.activeElement).toBe(screen.getByRole('button', { name: /reopen session/i }))
  })

  it('keeps focus trapped inside the initial resume dialog', async () => {
    const user = userEvent.setup()
    renderResumePrompt()

    const reopen = screen.getByRole('button', { name: /reopen session/i })
    const discard = screen.getByRole('button', { name: /^discard$/i })

    expect(document.activeElement).toBe(reopen)
    await user.tab()
    expect(document.activeElement).toBe(discard)
    await user.tab()
    expect(document.activeElement).toBe(reopen)
  })

  it('enters discard confirmation without calling onDiscard, then focuses Keep session', async () => {
    const user = userEvent.setup()
    const onDiscard = vi.fn()
    const onResume = vi.fn()
    renderResumePrompt({ onDiscard, onResume })

    await user.click(screen.getByRole('button', { name: /^discard$/i }))

    expect(onDiscard).not.toHaveBeenCalled()
    expect(
      screen.getByText(/progress is saved to history but can.t be resumed/i),
    ).toBeInTheDocument()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /keep session/i }))

    await user.click(screen.getByRole('button', { name: /keep session/i }))
    expect(screen.getByRole('button', { name: /reopen session/i })).toBeInTheDocument()
    expect(onDiscard).not.toHaveBeenCalled()
    expect(onResume).not.toHaveBeenCalled()
  })

  it('keeps focus trapped inside the discard confirmation state', async () => {
    const user = userEvent.setup()
    renderResumePrompt()

    await user.click(screen.getByRole('button', { name: /^discard$/i }))

    const yesDiscard = screen.getByRole('button', { name: /yes, discard session/i })
    const keepSession = screen.getByRole('button', { name: /keep session/i })

    expect(document.activeElement).toBe(keepSession)
    await user.tab()
    expect(document.activeElement).toBe(yesDiscard)
    await user.tab()
    expect(document.activeElement).toBe(keepSession)
  })

  it('runs the safe and destructive callbacks from their respective actions', async () => {
    const user = userEvent.setup()
    const onResume = vi.fn()
    const onDiscard = vi.fn()

    renderResumePrompt({ onResume, onDiscard })

    await user.click(screen.getByRole('button', { name: /reopen session/i }))
    expect(onResume).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: /^discard$/i }))
    await user.click(screen.getByRole('button', { name: /yes, discard session/i }))
    expect(onDiscard).toHaveBeenCalledTimes(1)
  })

  it('restores focus to the opener on unmount', () => {
    const Fixture = ({ open }: { open: boolean }) => (
      <>
        <button type="button" data-testid="opener">
          Resume
        </button>
        {open ? <ResumePrompt {...defaultProps} /> : null}
      </>
    )

    const { rerender } = render(<Fixture open={false} />)
    const opener = screen.getByTestId('opener')
    opener.focus()

    rerender(<Fixture open />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /reopen session/i }))

    rerender(<Fixture open={false} />)
    expect(document.activeElement).toBe(opener)
  })
})
