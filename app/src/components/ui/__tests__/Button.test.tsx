import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('defaults to type="button"', () => {
    render(<Button>Test</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('fires onClick handler', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Press</Button>)
    await userEvent.click(screen.getByText('Press'))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('does not fire onClick when disabled', async () => {
    const handler = vi.fn()
    render(
      <Button onClick={handler} disabled>
        Disabled
      </Button>,
    )
    await userEvent.click(screen.getByText('Disabled'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('applies primary variant styles by default', () => {
    render(<Button>Primary</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-accent')
    expect(btn.className).toContain('text-white')
  })

  it('applies outline variant styles', () => {
    render(<Button variant="outline">Outline</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('border-2')
    expect(btn.className).toContain('text-text-primary')
  })

  it('applies fullWidth class when set', () => {
    render(<Button fullWidth>Full</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('w-full')
  })

  it('merges custom className', () => {
    render(<Button className="flex-1">Custom</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('flex-1')
    expect(btn.className).toContain('bg-accent')
  })

  // Partner-walkthrough polish 2026-04-22 (design review A1): a disabled
  // primary CTA must read as neutral gray, not as a peach-tinted accent.
  // Keep the disabled treatment conditional in the component instead of
  // Tailwind `disabled:` variants so enabled buttons never inherit the
  // neutral disabled color in browser stacks that preserve nested CSS.
  it('disabled primary renders as neutral gray, not peach-tinted accent', () => {
    render(<Button disabled>Disabled primary</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-text-secondary/10')
    expect(btn.className).toContain('text-text-secondary/70')
    expect(btn.className).toContain('cursor-not-allowed')
    // The prior opacity-only disabled treatment is explicitly replaced.
    expect(btn.className).not.toContain('disabled:')
  })
})
