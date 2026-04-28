import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resolveHomeSnapshot, useHomeScreenState } from '../useHomeScreenState'
import * as sessionService from '../../../services/session'
import type { ResumableSession } from '../../../services/session'

vi.mock('../../../services/session', () => ({
  expireStaleReviews: vi.fn(),
  findPendingReview: vi.fn(),
  findResumableSession: vi.fn(),
  getCurrentDraft: vi.fn(),
  getLastComplete: vi.fn(),
  getRecentSessions: vi.fn(),
}))

describe('useHomeScreenState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(sessionService.findResumableSession).mockResolvedValue(null)
    vi.mocked(sessionService.expireStaleReviews).mockResolvedValue(0)
    vi.mocked(sessionService.findPendingReview).mockResolvedValue(null)
    vi.mocked(sessionService.getCurrentDraft).mockResolvedValue(null)
    vi.mocked(sessionService.getLastComplete).mockResolvedValue(null)
    vi.mocked(sessionService.getRecentSessions).mockResolvedValue([])
  })

  it('resolves loading to ready flags', async () => {
    const { result } = renderHook(() => useHomeScreenState())

    expect(result.current.state.kind).toBe('loading')
    await waitFor(() => expect(result.current.state.kind).toBe('ready'))

    expect(sessionService.findResumableSession).toHaveBeenCalledTimes(1)
    expect(sessionService.expireStaleReviews).toHaveBeenCalledTimes(1)
    expect(result.current.state).toMatchObject({
      kind: 'ready',
      flags: {
        resume: null,
        reviewPending: null,
        draft: null,
        lastComplete: null,
        recentSessions: [],
      },
    })
  })

  it('short-circuits on resumable sessions before expiring reviews or bulk reads', async () => {
    const resume = {
      execution: {
        id: 'exec-resume',
        planId: 'plan-resume',
        status: 'in_progress',
        activeBlockIndex: 0,
        blockStatuses: [{ blockId: 'block-resume', status: 'in_progress' }],
        startedAt: Date.now() - 1_000,
      },
      plan: {
        id: 'plan-resume',
        presetId: 'solo_open',
        presetName: 'Solo + Open',
        playerCount: 1,
        blocks: [
          {
            id: 'block-resume',
            type: 'main_skill',
            drillName: 'Self-Toss Pass',
            shortName: 'Pass',
            durationMinutes: 3,
            coachingCue: 'Quiet platform.',
            courtsideInstructions: 'Pass to target.',
            required: true,
          },
        ],
        safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
        createdAt: Date.now() - 1_000,
      },
      interruptedAt: Date.now(),
    } satisfies ResumableSession
    vi.mocked(sessionService.findResumableSession).mockResolvedValueOnce(resume)

    const flags = await resolveHomeSnapshot()

    expect(flags.resume).toBe(resume)
    expect(flags.reviewPending).toBeNull()
    expect(flags.draft).toBeNull()
    expect(flags.lastComplete).toBeNull()
    expect(flags.recentSessions).toEqual([])
    expect(sessionService.expireStaleReviews).not.toHaveBeenCalled()
    expect(sessionService.findPendingReview).not.toHaveBeenCalled()
    expect(sessionService.getCurrentDraft).not.toHaveBeenCalled()
    expect(sessionService.getLastComplete).not.toHaveBeenCalled()
    expect(sessionService.getRecentSessions).not.toHaveBeenCalled()
  })

  it('expires stale reviews before resolving the consistent Home snapshot', async () => {
    await resolveHomeSnapshot()

    const expireOrder = vi.mocked(sessionService.expireStaleReviews).mock.invocationCallOrder[0]
    for (const reader of [
      sessionService.findPendingReview,
      sessionService.getCurrentDraft,
      sessionService.getLastComplete,
      sessionService.getRecentSessions,
    ]) {
      expect(expireOrder).toBeLessThan(vi.mocked(reader).mock.invocationCallOrder[0]!)
    }
    expect(sessionService.getRecentSessions).toHaveBeenCalledWith(3)
  })

  it('retry re-enters loading and resolves again', async () => {
    let resolveRetry!: (value: null) => void
    vi.mocked(sessionService.findResumableSession)
      .mockResolvedValueOnce(null)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveRetry = resolve
          }),
      )
    const { result } = renderHook(() => useHomeScreenState())
    await waitFor(() => expect(result.current.state.kind).toBe('ready'))

    await act(async () => {
      result.current.retry()
    })

    expect(result.current.state.kind).toBe('loading')
    resolveRetry(null)
    await waitFor(() => expect(result.current.state.kind).toBe('ready'))
    expect(sessionService.findResumableSession).toHaveBeenCalledTimes(2)
  })
})
