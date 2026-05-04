import { useRef } from 'react'
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

  it('uses initialFocusRef for initial focus even when a close button appears first', () => {
    function CloseButtonFixture() {
      const safeRef = useRef<HTMLButtonElement>(null)
      return (
        <ActionOverlay
          title="Finish review first?"
          onDismiss={() => {}}
          showCloseButton
          initialFocusRef={safeRef}
        >
          <div className="flex flex-col gap-3">
            <button type="button" ref={safeRef}>
              Finish review
            </button>
            <button type="button">Skip review and continue</button>
          </div>
        </ActionOverlay>
      )
    }

    render(<CloseButtonFixture />)
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

    function TrapFixture() {
      const safeRef = useRef<HTMLButtonElement>(null)
      return (
        <ActionOverlay title="Skip review?" initialFocusRef={safeRef}>
          <div className="flex flex-col gap-3">
            <button type="button" ref={safeRef}>
              Never mind
            </button>
            <button type="button">Yes, skip</button>
          </div>
        </ActionOverlay>
      )
    }

    render(<TrapFixture />)

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

  // Plan U2 (2026-05-04): typed `initialFocusRef` regression coverage.
  // The legacy `[data-action-overlay-initial-focus="true"]` string-attribute
  // path was removed at the end of U2 (no callers left); these tests cover
  // the new canonical ref-based seam.

  it('falls back to first focusable when initialFocusRef.current is null at mount', () => {
    function NullRefFixture() {
      const unattachedRef = useRef<HTMLButtonElement>(null)
      return (
        <ActionOverlay title="Skip review?" initialFocusRef={unattachedRef}>
          <div className="flex flex-col gap-3">
            <button type="button">Never mind</button>
            <button type="button">Yes, skip</button>
          </div>
        </ActionOverlay>
      )
    }

    render(<NullRefFixture />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /never mind/i }))
  })

  it('refocusKey re-runs focus through the active initialFocusRef target on each change', () => {
    function TwoStateFixture({ confirming }: { confirming: boolean }) {
      const reopenRef = useRef<HTMLButtonElement>(null)
      const keepRef = useRef<HTMLButtonElement>(null)
      return (
        <ActionOverlay
          title="Session in progress"
          refocusKey={confirming}
          initialFocusRef={confirming ? keepRef : reopenRef}
        >
          {confirming ? (
            <>
              <button type="button">Yes, discard session</button>
              <button type="button" ref={keepRef}>
                Keep session
              </button>
            </>
          ) : (
            <>
              <button type="button" ref={reopenRef}>
                Reopen session
              </button>
              <button type="button">Discard</button>
            </>
          )}
        </ActionOverlay>
      )
    }

    const { rerender } = render(<TwoStateFixture confirming={false} />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /reopen session/i }))

    rerender(<TwoStateFixture confirming />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /keep session/i }))
  })

  it('restores focus to the opener on unmount', () => {
    function OpenerFixture({ open }: { open: boolean }) {
      const safeRef = useRef<HTMLButtonElement>(null)
      return (
        <>
          <button type="button" data-testid="opener">
            Skip review
          </button>
          {open ? (
            <ActionOverlay title="Skip review?" initialFocusRef={safeRef}>
              <button type="button" ref={safeRef}>
                Never mind
              </button>
            </ActionOverlay>
          ) : null}
        </>
      )
    }

    const { rerender } = render(<OpenerFixture open={false} />)
    const opener = screen.getByTestId('opener')
    opener.focus()

    rerender(<OpenerFixture open />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /never mind/i }))

    rerender(<OpenerFixture open={false} />)
    expect(document.activeElement).toBe(opener)
  })
})
