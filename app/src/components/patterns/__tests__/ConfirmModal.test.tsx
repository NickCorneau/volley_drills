import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ConfirmModal } from '../ConfirmModal'

describe('ConfirmModal', () => {
  it('focuses the safe-primary action on mount regardless of DOM order', () => {
    render(
      <ConfirmModal
        title="Skip review?"
        description="This session stays saved."
        safeAction={{ label: 'Never mind', onClick: () => {} }}
        destructiveAction={{ label: 'Yes, skip', onClick: () => {} }}
        onDismiss={() => {}}
      />,
    )

    expect(document.activeElement).toBe(screen.getByRole('button', { name: /never mind/i }))
  })

  it('forwards safeAction.onClick when the safe button is clicked', async () => {
    const user = userEvent.setup()
    const onSafe = vi.fn()
    render(
      <ConfirmModal
        title="x"
        safeAction={{ label: 'safe', onClick: onSafe }}
        onDismiss={() => {}}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'safe' }))
    expect(onSafe).toHaveBeenCalledTimes(1)
  })

  it('renders only the safe-primary when destructiveAction is omitted', () => {
    render(
      <ConfirmModal
        title="x"
        safeAction={{ label: 'safe', onClick: () => {} }}
        onDismiss={() => {}}
      />,
    )

    expect(screen.getByRole('button', { name: 'safe' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /destructive/i })).not.toBeInTheDocument()
  })

  it('renders the destructive action with the danger variant by default', () => {
    render(
      <ConfirmModal
        title="x"
        safeAction={{ label: 'safe', onClick: () => {} }}
        destructiveAction={{ label: 'danger', onClick: () => {} }}
        onDismiss={() => {}}
      />,
    )

    const danger = screen.getByRole('button', { name: 'danger' })
    expect(danger.className).toMatch(/border-warning/)
    expect(danger.className).toMatch(/text-warning/)
  })

  it('respects an explicit destructive variant override (outline)', () => {
    render(
      <ConfirmModal
        title="x"
        safeAction={{ label: 'safe', onClick: () => {} }}
        destructiveAction={{ label: 'skip', onClick: () => {}, variant: 'outline' }}
        onDismiss={() => {}}
      />,
    )

    const skip = screen.getByRole('button', { name: 'skip' })
    // Outline variant uses a tertiary text-secondary border treatment, not warning colors.
    expect(skip.className).not.toMatch(/text-warning/)
    expect(skip.className).toContain('border-2')
  })

  it('uses the centered placement classes by default (no bottom-sheet positioning)', () => {
    render(
      <ConfirmModal
        title="x"
        safeAction={{ label: 'safe', onClick: () => {} }}
        onDismiss={() => {}}
      />,
    )

    // ActionOverlay's outer div carries role="dialog" AND the positioning
    // classes (the panel is its first child). Default placement is centered.
    const overlay = screen.getByRole('dialog')
    expect(overlay.className).not.toContain('items-end')
    expect(overlay.className).not.toContain('pb-8')
  })

  it('applies the bottom-sheet placement classes when requested', () => {
    render(
      <ConfirmModal
        title="x"
        safeAction={{ label: 'safe', onClick: () => {} }}
        destructiveAction={{ label: 'end', onClick: () => {} }}
        placement="bottom-sheet"
        onDismiss={() => {}}
      />,
    )

    const overlay = screen.getByRole('dialog')
    expect(overlay.className).toContain('items-end')
    expect(overlay.className).toContain('pb-8')

    const panel = overlay.firstElementChild as HTMLElement
    expect(panel.className).toContain('max-w-[390px]')
    expect(panel.className).toContain('rounded-[16px]')
  })

  it('disables both buttons when their `disabled` flag is set', () => {
    render(
      <ConfirmModal
        title="x"
        safeAction={{ label: 'safe', onClick: () => {}, disabled: true }}
        destructiveAction={{ label: 'danger', onClick: () => {}, disabled: true }}
        onDismiss={() => {}}
      />,
    )

    expect(screen.getByRole('button', { name: 'safe' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'danger' })).toBeDisabled()
  })

  it('forwards onDismiss when ESC is pressed', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <ConfirmModal
        title="x"
        safeAction={{ label: 'safe', onClick: () => {} }}
        onDismiss={onDismiss}
      />,
    )

    await user.keyboard('{Escape}')
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('renders the role as alertdialog when requested', () => {
    render(
      <ConfirmModal
        title="x"
        safeAction={{ label: 'safe', onClick: () => {} }}
        onDismiss={() => {}}
        role="alertdialog"
      />,
    )

    expect(screen.getByRole('alertdialog', { name: 'x' })).toBeInTheDocument()
  })
})
