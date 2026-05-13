import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GlossInline } from '../GlossInline'
import type { GlossedString } from '../../../domain/glossedText'

/**
 * RTL coverage for the layout-agnostic inline term atom. Pins the
 * dotted-underline visual class (load-bearing for the lint rule),
 * the controlled `aria-expanded` + `onToggle` wiring, and the
 * "no wrapper element" composability invariant.
 */

const SAMPLE_PARTS: GlossedString = [
  { type: 'text', text: 'Passes ' },
  { type: 'gloss', term: 'graded 2+', definition: 'settable arc' },
  { type: 'text', text: '.' },
]

describe('<GlossInline>', () => {
  it('renders the term as a button with the dotted-underline class and aria-expanded reflecting isOpen', () => {
    render(
      <GlossInline parts={SAMPLE_PARTS} isOpen={() => false} onToggle={() => {}} />,
    )

    const term = screen.getByRole('button', { name: 'graded 2+' })
    expect(term).toBeInTheDocument()
    expect(term.className).toContain('border-dotted')
    expect(term.className).toContain('border-text-secondary/60')
    expect(term).toHaveAttribute('aria-expanded', 'false')
  })

  it('reflects an open scope via aria-expanded=true when isOpen returns true', () => {
    render(
      <GlossInline
        parts={SAMPLE_PARTS}
        isOpen={(term) => term === 'graded 2+'}
        onToggle={() => {}}
      />,
    )

    const term = screen.getByRole('button', { name: 'graded 2+' })
    expect(term).toHaveAttribute('aria-expanded', 'true')
  })

  it('calls onToggle with the clicked term', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(
      <GlossInline parts={SAMPLE_PARTS} isOpen={() => false} onToggle={onToggle} />,
    )

    await user.click(screen.getByRole('button', { name: 'graded 2+' }))
    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith('graded 2+')
  })

  it('emits no wrapper element — only inline span/button siblings (composability invariant)', () => {
    const { container } = render(
      <GlossInline parts={SAMPLE_PARTS} isOpen={() => false} onToggle={() => {}} />,
    )

    // Two text spans + one button + (the surrounding host has no wrapper).
    expect(container.children).toHaveLength(3)
    expect(container.querySelectorAll('div')).toHaveLength(0)
    expect(container.querySelectorAll('p')).toHaveLength(0)
  })

  it('renders nothing when parts is empty', () => {
    const { container } = render(
      <GlossInline parts={[]} isOpen={() => false} onToggle={() => {}} />,
    )
    expect(container.firstChild).toBeNull()
  })
})
