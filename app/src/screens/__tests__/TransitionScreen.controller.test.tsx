import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TransitionScreen } from '../TransitionScreen'
import { useSessionRunner } from '../../hooks/useSessionRunner'
import { findSwapAlternatives } from '../../domain/sessionBuilder'
import { buildRunnerFixture, type RunnerFixture } from '../../test-utils/runnerFixture'

vi.mock('../../hooks/useSessionRunner', () => ({
  useSessionRunner: vi.fn(),
}))

vi.mock('../../domain/sessionBuilder', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../domain/sessionBuilder')>()
  return {
    ...actual,
    findSwapAlternatives: vi.fn(),
  }
})

let fixture: RunnerFixture

function setActiveBlockIndex(target: RunnerFixture, index: number) {
  if (!target.runner.plan || !target.runner.execution) return
  target.runner.execution.activeBlockIndex = index
  target.runner.currentBlock = target.runner.plan.blocks[index] ?? null
  target.runner.currentBlockIndex = index
}

function renderTransition() {
  return render(
    <MemoryRouter initialEntries={['/run/transition?id=exec-transition']}>
      <Routes>
        <Route path="/run/transition" element={<TransitionScreen />} />
        <Route path="/review" element={<div>Review route</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('TransitionScreen controller outcomes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fixture = buildRunnerFixture({
      executionId: 'exec-transition',
      planId: 'plan-transition',
      activeBlockIndex: 1,
    })
    vi.mocked(useSessionRunner).mockImplementation(() => fixture.runner)
    if (!fixture.runner.plan) throw new Error('test fixture expected a plan')
    vi.mocked(findSwapAlternatives).mockReturnValue([fixture.runner.plan.blocks[1]!])
  })

  it('routes to Review when skipping the last block', async () => {
    fixture.mocks.skipBlock.mockResolvedValueOnce(true)
    const user = userEvent.setup()
    renderTransition()

    await user.click(await screen.findByRole('button', { name: /skip block/i }))

    expect(await screen.findByText('Review route')).toBeInTheDocument()
  })

  it('stays on Transition when skipping a non-terminal block', async () => {
    fixture.mocks.skipBlock.mockImplementationOnce(async () => {
      setActiveBlockIndex(fixture, 2)
      return false
    })
    const user = userEvent.setup()
    renderTransition()

    await user.click(await screen.findByRole('button', { name: /skip block/i }))

    expect(screen.queryByText('Review route')).not.toBeInTheDocument()
    expect(screen.getByText('Transition')).toBeInTheDocument()
    expect(await screen.findByText('Target Pressure')).toBeInTheDocument()
  })

  it('shows a retryable error when skip fails', async () => {
    fixture.mocks.skipBlock.mockRejectedValueOnce(new Error('write failed'))
    const user = userEvent.setup()
    renderTransition()

    await user.click(await screen.findByRole('button', { name: /skip block/i }))

    expect(await screen.findByText('Something went wrong. Try again.')).toBeInTheDocument()
    expect(screen.getByText('Self-Toss Pass')).toBeInTheDocument()
  })

  it('shows a no-alternates error when pre-start swap returns false', async () => {
    fixture.mocks.swapBlock.mockResolvedValueOnce(false)
    const user = userEvent.setup()
    renderTransition()

    await user.click(await screen.findByRole('button', { name: /swap drill/i }))

    expect(await screen.findByText('No alternate drills available for this block.')).toBeInTheDocument()
    expect(screen.getByText('Self-Toss Pass')).toBeInTheDocument()
  })

  it('shows a retryable error when pre-start swap rejects', async () => {
    fixture.mocks.swapBlock.mockRejectedValueOnce(new Error('write failed'))
    const user = userEvent.setup()
    renderTransition()

    await user.click(await screen.findByRole('button', { name: /swap drill/i }))

    expect(await screen.findByText('Something went wrong. Try again.')).toBeInTheDocument()
    expect(screen.getByText('Self-Toss Pass')).toBeInTheDocument()
  })
})
