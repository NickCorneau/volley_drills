import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Expander } from '../Expander'

describe('Expander', () => {
  it('renders the trigger and starts collapsed', () => {
    render(
      <Expander trigger={<span>Heat &amp; safety tips</span>}>
        <p>tips body</p>
      </Expander>,
    )

    expect(screen.getByRole('button', { name: /heat & safety tips/i })).toBeInTheDocument()
    expect(screen.queryByText('tips body')).not.toBeInTheDocument()
  })

  it('toggles aria-expanded and reveals/hides children when clicked', async () => {
    const user = userEvent.setup()
    render(
      <Expander trigger={<span>Heat &amp; safety tips</span>}>
        <p>tips body</p>
      </Expander>,
    )

    const button = screen.getByRole('button', { name: /heat & safety tips/i })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('tips body')).toBeInTheDocument()

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('tips body')).not.toBeInTheDocument()
  })

  it('keeps the trigger visible after expanding (distinct from Disclosure)', async () => {
    const user = userEvent.setup()
    render(
      <Expander trigger={<span>tap me</span>}>
        <p>body</p>
      </Expander>,
    )

    await user.click(screen.getByRole('button', { name: 'tap me' }))
    // Trigger still rendered after expand:
    expect(screen.getByRole('button', { name: 'tap me' })).toBeInTheDocument()
    expect(screen.getByText('body')).toBeInTheDocument()
  })

  it('rotates the chevron when open (visual cue for expand state)', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Expander trigger={<span>x</span>}>
        <span>y</span>
      </Expander>,
    )

    let chevron = container.querySelector('[aria-hidden]')
    expect(chevron?.className).not.toContain('rotate-180')

    await user.click(screen.getByRole('button'))
    chevron = container.querySelector('[aria-hidden]')
    expect(chevron?.className).toContain('rotate-180')
  })
})
