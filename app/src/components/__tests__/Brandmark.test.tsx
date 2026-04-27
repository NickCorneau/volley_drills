import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Brandmark } from '../Brandmark'

describe('Brandmark', () => {
  it('renders an SVG with an accessible label', () => {
    render(<Brandmark />)
    const mark = screen.getByRole('img', { name: /volleycraft/i })
    expect(mark).toBeInTheDocument()
  })

  it('defaults to 32px and accepts a custom size', () => {
    const { rerender } = render(<Brandmark />)
    expect(screen.getByRole('img')).toHaveAttribute('width', '32')
    expect(screen.getByRole('img')).toHaveAttribute('height', '32')

    rerender(<Brandmark size={64} />)
    expect(screen.getByRole('img')).toHaveAttribute('width', '64')
    expect(screen.getByRole('img')).toHaveAttribute('height', '64')
  })

  it('forwards className for Tailwind wrapper styling', () => {
    render(<Brandmark className="opacity-90" />)
    expect(screen.getByRole('img')).toHaveClass('opacity-90')
  })
})
