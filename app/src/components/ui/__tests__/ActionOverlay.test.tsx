import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ActionOverlay } from '../ActionOverlay'

describe('ActionOverlay', () => {
  it('renders labelled modal dialog semantics with an optional description', () => {
    render(
      <ActionOverlay title="Skip review?" description="This session stays saved.">
        <button type="button">Never mind</button>
      </ActionOverlay>,
    )

    const dialog = screen.getByRole('dialog', { name: /skip review\?/i })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription(/this session stays saved/i)
  })

  it('marks background siblings inert while mounted and restores them on unmount', () => {
    const OverlayFixture = ({ open }: { open: boolean }) => (
      <>
        <button type="button" data-testid="background">
          Background action
        </button>
        {open ? (
          <ActionOverlay title="Skip review?">
            <button type="button">Never mind</button>
          </ActionOverlay>
        ) : null}
      </>
    )

    const { rerender } = render(<OverlayFixture open />)
    const background = screen.getByTestId('background')
    const backgroundRoot = background.parentElement as HTMLElement

    expect(backgroundRoot).toHaveAttribute('aria-hidden', 'true')
    expect(backgroundRoot).toHaveProperty('inert', true)

    rerender(<OverlayFixture open={false} />)
    expect(backgroundRoot).not.toHaveAttribute('aria-hidden')
    expect(backgroundRoot).toHaveProperty('inert', false)
  })

  it('uses the marked safe action for initial focus even when a close button appears first', () => {
    render(
      <ActionOverlay title="Finish review first?" onDismiss={() => {}} showCloseButton>
        <div className="flex flex-col gap-3">
          <button type="button" data-action-overlay-initial-focus="true">
            Finish review
          </button>
          <button type="button">Skip review and continue</button>
        </div>
      </ActionOverlay>,
    )

    expect(document.activeElement).toBe(screen.getByRole('button', { name: /finish review/i }))
  })

  it('calls onDismiss from the optional close button', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()

    render(
      <ActionOverlay title="Finish review first?" onDismiss={onDismiss} showCloseButton>
        <button type="button">Finish review</button>
      </ActionOverlay>,
    )

    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('traps Tab and Shift+Tab inside the overlay', async () => {
    const user = userEvent.setup()

    render(
      <ActionOverlay title="Skip review?">
        <div className="flex flex-col gap-3">
          <button type="button" data-action-overlay-initial-focus="true">
            Never mind
          </button>
          <button type="button">Yes, skip</button>
        </div>
      </ActionOverlay>,
    )

    const neverMind = screen.getByRole('button', { name: /never mind/i })
    const yesSkip = screen.getByRole('button', { name: /yes, skip/i })

    expect(document.activeElement).toBe(neverMind)
    await user.tab()
    expect(document.activeElement).toBe(yesSkip)
    await user.tab()
    expect(document.activeElement).toBe(neverMind)
    await user.tab({ shift: true })
    expect(document.activeElement).toBe(yesSkip)
  })

  it('dismisses on Escape when a dismiss handler is supplied', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()

    render(
      <ActionOverlay title="Skip review?" onDismiss={onDismiss}>
        <button type="button">Never mind</button>
      </ActionOverlay>,
    )

    await user.keyboard('{Escape}')
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('refocuses the marked safe action when the refocus key changes', () => {
    const OverlayFixture = ({ confirming }: { confirming: boolean }) => (
      <ActionOverlay title="Session in progress" refocusKey={confirming}>
        {confirming ? (
          <>
            <button type="button">Yes, discard session</button>
            <button type="button" data-action-overlay-initial-focus="true">
              Keep session
            </button>
          </>
        ) : (
          <>
            <button type="button" data-action-overlay-initial-focus="true">
              Reopen session
            </button>
            <button type="button">Discard</button>
          </>
        )}
      </ActionOverlay>
    )

    const { rerender } = render(<OverlayFixture confirming={false} />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /reopen session/i }))

    rerender(<OverlayFixture confirming />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /keep session/i }))
  })

  it('restores focus to the opener on unmount', () => {
    const OverlayFixture = ({ open }: { open: boolean }) => (
      <>
        <button type="button" data-testid="opener">
          Skip review
        </button>
        {open ? (
          <ActionOverlay title="Skip review?">
            <button type="button" data-action-overlay-initial-focus="true">
              Never mind
            </button>
          </ActionOverlay>
        ) : null}
      </>
    )

    const { rerender } = render(<OverlayFixture open={false} />)
    const opener = screen.getByTestId('opener')
    opener.focus()

    rerender(<OverlayFixture open />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /never mind/i }))

    rerender(<OverlayFixture open={false} />)
    expect(document.activeElement).toBe(opener)
  })
})
