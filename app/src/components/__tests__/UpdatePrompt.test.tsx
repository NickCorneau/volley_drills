import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { UpdatePrompt } from '../UpdatePrompt'

describe('UpdatePrompt', () => {
  it('renders nothing when needRefresh is false', () => {
    const { container } = render(<UpdatePrompt needRefresh={false} onUpdate={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByText(/update/i)).not.toBeInTheDocument()
  })

  it('renders update message and button when needRefresh is true', () => {
    render(<UpdatePrompt needRefresh={true} onUpdate={vi.fn()} />)
    expect(screen.getByText('Update available')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument()
  })

  it('invokes onUpdate when the button is clicked', async () => {
    const handler = vi.fn()
    render(<UpdatePrompt needRefresh={true} onUpdate={handler} />)
    await userEvent.click(screen.getByRole('button', { name: 'Update' }))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('exposes status role and polite live region for accessibility', () => {
    render(<UpdatePrompt needRefresh={true} onUpdate={vi.fn()} />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
  })
})
