import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { emitSchemaBlocked, resetSchemaBlockedForTesting } from '../../lib/schema-blocked'
import { SchemaBlockedOverlay } from '../SchemaBlockedOverlay'

describe('SchemaBlockedOverlay', () => {
  beforeEach(() => {
    resetSchemaBlockedForTesting()
  })

  it('is hidden by default', () => {
    render(<SchemaBlockedOverlay />)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Reload' })).not.toBeInTheDocument()
  })

  it('shows overlay after emitSchemaBlocked is called', () => {
    render(<SchemaBlockedOverlay />)
    act(() => {
      emitSchemaBlocked()
    })
    expect(screen.getByRole('alertdialog', { name: /reload to continue/i })).toBeInTheDocument()
    expect(screen.getByText(/close other tabs and reload/i)).toBeInTheDocument()
  })

  it('clicking Reload invokes onReload prop', async () => {
    const user = userEvent.setup()
    const onReload = vi.fn()
    render(<SchemaBlockedOverlay onReload={onReload} />)
    act(() => {
      emitSchemaBlocked()
    })
    await user.click(screen.getByRole('button', { name: 'Reload' }))
    expect(onReload).toHaveBeenCalledOnce()
  })

  it('autofocuses Reload as the only recovery action', () => {
    render(<SchemaBlockedOverlay onReload={() => {}} />)
    act(() => {
      emitSchemaBlocked()
    })

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Reload' }))
  })

  it('does not dismiss or reload on Escape', async () => {
    const user = userEvent.setup()
    const onReload = vi.fn()
    render(<SchemaBlockedOverlay onReload={onReload} />)
    act(() => {
      emitSchemaBlocked()
    })

    await user.keyboard('{Escape}')

    expect(screen.getByRole('alertdialog', { name: /reload to continue/i })).toBeInTheDocument()
    expect(onReload).not.toHaveBeenCalled()
  })

  it('shows overlay when emitSchemaBlocked fires BEFORE mount (sticky flag)', () => {
    // Red-team RT-1: db.on('blocked') can fire at module load before React
    // commits, or during a StrictMode remount. The sticky flag must survive
    // the subscribe/unsubscribe gap.
    act(() => {
      emitSchemaBlocked()
    })
    render(<SchemaBlockedOverlay />)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /reload to continue/i })).toBeInTheDocument()
  })
})
