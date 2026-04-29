import { vi, type Mock } from 'vitest'
import type {
  ExecutionLog,
  ExecutionLogBlockStatus,
  SessionPlan,
  SessionPlanBlock,
} from '../db/types'
import type { useSessionRunner } from '../hooks/useSessionRunner'
import type { BlockSlotType, SetupContext } from '../types/session'

type RunnerReturn = ReturnType<typeof useSessionRunner>

export type RunnerBlockOverrides = Partial<SessionPlanBlock> & {
  id?: string
  type?: BlockSlotType
}

const defaultContext: SetupContext = {
  playerMode: 'solo',
  timeProfile: 25,
  netAvailable: true,
  wallAvailable: false,
}

const defaultBlocks: SessionPlanBlock[] = [
  {
    id: 'b-warmup',
    type: 'warmup',
    drillName: 'Warm up',
    shortName: 'Warm up',
    durationMinutes: 3,
    coachingCue: 'Wake up.',
    courtsideInstructions: 'Move easy.',
    required: true,
  },
  {
    id: 'b-main',
    type: 'main_skill',
    drillName: 'Self-Toss Pass',
    shortName: 'Pass',
    durationMinutes: 5,
    coachingCue: 'Quiet platform.',
    courtsideInstructions: 'Pass to target.',
    required: false,
  },
  {
    id: 'b-pressure',
    type: 'pressure',
    drillName: 'Target Pressure',
    shortName: 'Pressure',
    durationMinutes: 4,
    coachingCue: 'Breathe first.',
    courtsideInstructions: 'Score three clean reps.',
    required: false,
  },
]

function fillBlock(overrides: RunnerBlockOverrides, fallback: SessionPlanBlock): SessionPlanBlock {
  return {
    id: overrides.id ?? fallback.id,
    type: overrides.type ?? fallback.type,
    drillId: overrides.drillId ?? fallback.drillId,
    variantId: overrides.variantId ?? fallback.variantId,
    drillName: overrides.drillName ?? fallback.drillName,
    shortName: overrides.shortName ?? fallback.shortName,
    durationMinutes: overrides.durationMinutes ?? fallback.durationMinutes,
    coachingCue: overrides.coachingCue ?? fallback.coachingCue,
    courtsideInstructions: overrides.courtsideInstructions ?? fallback.courtsideInstructions,
    courtsideInstructionsBonus:
      overrides.courtsideInstructionsBonus ?? fallback.courtsideInstructionsBonus,
    required: overrides.required ?? fallback.required,
    rationale: overrides.rationale ?? fallback.rationale,
    subBlockIntervalSeconds: overrides.subBlockIntervalSeconds ?? fallback.subBlockIntervalSeconds,
    segments: overrides.segments ?? fallback.segments,
  }
}

export interface RunnerFixtureOptions {
  executionId?: string
  planId?: string
  presetId?: string
  presetName?: string
  playerCount?: 1 | 2
  context?: Partial<SetupContext>
  blocks?: RunnerBlockOverrides[]
  /** Index into the resolved blocks list. Defaults to 0. */
  activeBlockIndex?: number
  status?: ExecutionLog['status']
  startedAt?: number
}

export interface RunnerFixture {
  runner: RunnerReturn
  /** Sentinel mocks that callers can program with `mockResolvedValueOnce` etc. */
  mocks: {
    startBlock: Mock<RunnerReturn['startBlock']>
    pauseBlock: Mock<RunnerReturn['pauseBlock']>
    resumeBlock: Mock<RunnerReturn['resumeBlock']>
    completeBlock: Mock<RunnerReturn['completeBlock']>
    skipBlock: Mock<RunnerReturn['skipBlock']>
    swapBlock: Mock<RunnerReturn['swapBlock']>
    endSession: Mock<RunnerReturn['endSession']>
    flushTimer: Mock<RunnerReturn['flushTimer']>
    recoverTimerState: Mock<RunnerReturn['recoverTimerState']>
  }
}

/**
 * Build a runner-shaped fixture suitable for `vi.mocked(useSessionRunner).mockReturnValue(...)`.
 * Defaults to a 3-block solo plan (warmup → main_skill → pressure) so the caller can test
 * non-terminal vs terminal routing without authoring inline plans.
 */
export function buildRunnerFixture(options: RunnerFixtureOptions = {}): RunnerFixture {
  const executionId = options.executionId ?? 'exec-fixture'
  const planId = options.planId ?? 'plan-fixture'
  const presetId = options.presetId ?? 'solo_open'
  const presetName = options.presetName ?? 'Solo + Open'
  const playerCount = options.playerCount ?? 1
  const startedAt = options.startedAt ?? Date.now() - 1_000

  const blocks: SessionPlanBlock[] = (options.blocks ?? defaultBlocks).map((override, index) =>
    fillBlock(override, defaultBlocks[index] ?? defaultBlocks[defaultBlocks.length - 1]!),
  )

  if (blocks.length === 0) {
    throw new Error('buildRunnerFixture: at least one block is required')
  }

  const requestedIndex = options.activeBlockIndex ?? 0
  if (requestedIndex < 0 || requestedIndex >= blocks.length) {
    throw new Error(
      `buildRunnerFixture: activeBlockIndex ${requestedIndex} is out of range for ${blocks.length} blocks`,
    )
  }
  const activeBlockIndex = requestedIndex
  const status = options.status ?? 'in_progress'

  const plan: SessionPlan = {
    id: planId,
    presetId,
    presetName,
    playerCount,
    blocks,
    context: {
      ...defaultContext,
      ...options.context,
    },
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: startedAt - 1_000,
  }

  const blockStatuses: ExecutionLogBlockStatus[] = blocks.map((block, index) => {
    let blockStatus: ExecutionLogBlockStatus['status']
    if (index < activeBlockIndex) {
      blockStatus = 'completed'
    } else if (index === activeBlockIndex) {
      blockStatus =
        status === 'completed'
          ? 'completed'
          : status === 'in_progress' || status === 'paused' || status === 'ended_early'
            ? 'in_progress'
            : 'planned'
    } else {
      blockStatus = 'planned'
    }
    return {
      blockId: block.id,
      status: blockStatus,
      startedAt: index <= activeBlockIndex ? startedAt : undefined,
      completedAt: index < activeBlockIndex ? startedAt + 1_000 : undefined,
    }
  })

  const execution: ExecutionLog = {
    id: executionId,
    planId,
    status,
    activeBlockIndex,
    blockStatuses,
    startedAt,
  }

  // All boolean-returning action mocks default to `false` so a test that forgets
  // to program a "success" path takes the safe / no-op branch rather than
  // silently exercising terminal routing or a fake successful swap. Tests that
  // want the success path MUST opt in with `mockResolvedValueOnce(true)`:
  //   completeBlock / skipBlock → false  → controller treats as "block remains"
  //                                        and routes to Drill Check
  //   swapBlock                  → false  → controller surfaces "no alternates"
  //   endSession                  → undefined (no return-value semantics)
  // Mirror this `false`-by-default convention when adding new boolean actions.
  const startBlock = vi.fn(async () => undefined)
  const pauseBlock = vi.fn(async () => undefined)
  const resumeBlock = vi.fn(async () => undefined)
  const completeBlock = vi.fn(async () => false)
  const skipBlock = vi.fn(async () => false)
  const swapBlock = vi.fn(async () => false)
  const endSession = vi.fn(async () => undefined)
  const flushTimer = vi.fn(async () => undefined)
  const recoverTimerState = vi.fn(async () => null)

  const runner: RunnerReturn = {
    plan,
    execution,
    loaded: true,
    currentBlock: blocks[activeBlockIndex] ?? null,
    currentBlockIndex: activeBlockIndex,
    totalBlocks: blocks.length,
    isPaused: status === 'paused',
    startBlock,
    pauseBlock,
    resumeBlock,
    completeBlock,
    skipBlock,
    swapBlock,
    endSession,
    flushTimer,
    recoverTimerState,
  }

  return {
    runner,
    mocks: {
      startBlock,
      pauseBlock,
      resumeBlock,
      completeBlock,
      skipBlock,
      swapBlock,
      endSession,
      flushTimer,
      recoverTimerState,
    },
  }
}
