import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RunControls } from '../RunControls'

/**
 * Phase F Unit 4 (2026-04-19): `RunControls` renders the Swap button
 * in both active and paused states when `onSwap` is provided, and
 * hides it when the prop is `undefined` (warmup / wrap blocks or
 * single-candidate pools). Tapping the button fires the prop.
 */

const baseProps = {
  isPaused: false,
  isRequired: true,
  onPause: vi.fn(),
  onResume: vi.fn(),
  onNext: vi.fn(),
  onSkip: vi.fn(),
  onShorten: vi.fn(),
  onEndSession: vi.fn(),
}

describe('RunControls Swap button (Phase F Unit 4)', () => {
  it('active state + onSwap provided: renders the Swap drill button', async () => {
    const onSwap = vi.fn()
    const user = userEvent.setup()
    render(<RunControls {...baseProps} isPaused={false} onSwap={onSwap} />)

    const swap = screen.getByRole('button', { name: /swap drill/i })
    expect(swap).toBeInTheDocument()
    await user.click(swap)
    expect(onSwap).toHaveBeenCalledTimes(1)
  })

  it('active state + onSwap undefined: Swap button is hidden', () => {
    render(<RunControls {...baseProps} isPaused={false} />)
    expect(screen.queryByRole('button', { name: /swap drill/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^swap$/i })).not.toBeInTheDocument()
  })

  it('paused state + onSwap provided: renders Swap alongside Shorten / Skip / End', async () => {
    const onSwap = vi.fn()
    const user = userEvent.setup()
    render(<RunControls {...baseProps} isPaused isRequired={false} onSwap={onSwap} />)

    // Paused row uses the compact "Swap" label, not "Swap drill".
    const swap = screen.getByRole('button', { name: /^swap$/i })
    expect(swap).toBeInTheDocument()
    await user.click(swap)
    expect(onSwap).toHaveBeenCalledTimes(1)

    // All four divergence affordances render in paused state.
    expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /shorten/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /skip block/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /end session/i })).toBeInTheDocument()
  })

  it('paused state + required block + onSwap undefined: Swap and Skip both hidden', () => {
    render(<RunControls {...baseProps} isPaused isRequired />)
    expect(screen.queryByRole('button', { name: /^swap$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /skip block/i })).not.toBeInTheDocument()
  })
})
