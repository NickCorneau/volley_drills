import { describe, expect, it } from 'vitest'
import {
  type FocusReadinessCellInput,
  PLAYER_LEVELS,
  READINESS_CONFIGURATIONS,
  READINESS_DURATIONS,
  VISIBLE_FOCUSES,
  buildFocusReadinessAudit,
  canTransitionReadinessStatus,
  evaluateFocusReadinessCell,
  isReadinessRiskBucket,
  isReadinessStatus,
  validateActivationBatchManifest,
  validateFocusReadinessGapCard,
  type ActivationBatchManifest,
  type FocusReadinessGapCard,
} from '../focusReadiness'
import { buildDraft } from '../../sessionBuilder'
import type { SetupContext } from '../../../model'

const activationReadyGapCard: FocusReadinessGapCard = {
  id: 'gap-serve-pair-open-beginner-40-main',
  focus: 'serve',
  configuration: 'pair_open',
  level: 'beginner',
  duration: 40,
  missingSlotType: 'main_skill',
  status: 'source_candidate',
  riskBucket: 'cannot_generate',
  candidateSourceMaterial: ['BAB serving chapter'],
  exactSourceReference: 'Better at Beach drill book, Serving: Around the World',
  adaptationDelta: 'Pair-open cadence uses partner shagging; target promise stays serving mechanics.',
  eligibilityRationale: 'One ball, two players, no net requirement, no cones or lines.',
  sourceFaithfulnessRationale: 'Preserves target-zone serve intent without claiming net clearance.',
  affectedCatalogIds: [{ drillId: 'd33', variantId: 'd33-pair' }],
}

const activationManifest: ActivationBatchManifest = {
  id: 'activate-serving-pair-open-floor',
  gapCardIds: [activationReadyGapCard.id],
  changedCatalogIds: [{ drillId: 'd33', variantId: 'd33-pair' }],
  capDelta: 0,
  verification: 'focus readiness audit and catalog validation pass',
  checkpointCriteria: 'No additional serving records activate before this batch is verified.',
}

function contextForCell(cell: FocusReadinessCellInput): SetupContext {
  const configuration = READINESS_CONFIGURATIONS.find((candidate) => candidate.id === cell.configuration)
  if (!configuration) throw new Error(`Unknown readiness configuration ${cell.configuration}`)
  return {
    ...configuration.context,
    timeProfile: cell.duration,
    sessionFocus: cell.focus,
    playerLevel: cell.level,
  }
}

function repeatedFocusControlledDrillIds(cell: FocusReadinessCellInput): string[] {
  const draft = buildDraft(contextForCell(cell), {
    assemblySeed: `${cell.focus}-${cell.configuration}-${cell.level}-${cell.duration}-no-repeat`,
    playerLevel: cell.level,
  })
  if (!draft) return ['cannot-build']
  const totalMinutes = draft.blocks.reduce((sum, block) => sum + block.durationMinutes, 0)
  if (totalMinutes !== cell.duration) return [`duration-${totalMinutes}`]
  const focusedDrillIds = draft.blocks
    .filter((block) =>
      ['technique', 'movement_proxy', 'main_skill', 'pressure'].includes(block.type),
    )
    .map((block) => block.drillId)
  return focusedDrillIds.filter(
    (drillId, index) => focusedDrillIds.indexOf(drillId) !== index,
  )
}

describe('focus readiness model', () => {
  it('validates an activation-ready source-backed gap card', () => {
    expect(validateFocusReadinessGapCard(activationReadyGapCard)).toEqual([])
  })

  it('requires activation cards to identify affected catalog ids or declare a new id', () => {
    const issues = validateFocusReadinessGapCard({
      ...activationReadyGapCard,
      affectedCatalogIds: [],
      requiresNewCatalogId: false,
    })

    expect(issues).toContain(
      'Activation-ready gap cards must list affected drill/variant ids or declare that a new catalog id is required.',
    )
  })

  it('requires an unblock note before blocked statuses can move forward', () => {
    expect(canTransitionReadinessStatus('blocked_by_source', 'verified')).toBe(false)
    expect(
      canTransitionReadinessStatus('blocked_by_source', 'source_candidate', {
        unblockNote: 'FIVB source page located and adaptation reviewed.',
      }),
    ).toBe(true)
  })

  it('validates activation batch manifests for cap override checkpoints', () => {
    expect(validateActivationBatchManifest(activationManifest)).toEqual([])
    expect(
      validateActivationBatchManifest({
        ...activationManifest,
        capDelta: undefined,
      }),
    ).toContain('Activation manifests must record the drill-record cap delta.')
  })

  it('guards readiness statuses and risk buckets', () => {
    expect(isReadinessStatus('verified')).toBe(true)
    expect(isReadinessStatus('done')).toBe(false)
    expect(isReadinessRiskBucket('no_same_focus_swap')).toBe(true)
    expect(isReadinessRiskBucket('missing_swap')).toBe(false)
  })
})

describe('focus readiness audit engine', () => {
  it('covers every focus, current configuration, level, and fixed duration cell', () => {
    const audit = buildFocusReadinessAudit()

    expect(VISIBLE_FOCUSES).toEqual(['pass', 'serve', 'set'])
    expect(PLAYER_LEVELS).toEqual(['beginner', 'intermediate', 'advanced'])
    expect(READINESS_CONFIGURATIONS.map((configuration) => configuration.id)).toEqual([
      'solo_net',
      'solo_wall',
      'solo_open',
      'pair_net',
      'pair_open',
    ])
    expect(READINESS_DURATIONS).toEqual([15, 25, 40])
    expect(audit.cells).toHaveLength(135)
    for (const focus of VISIBLE_FOCUSES) {
      expect(audit.cells.filter((cell) => cell.focus === focus)).toHaveLength(45)
    }
    expect(
      audit.cells.some(
        (cell) =>
          cell.focus === 'serve' &&
          cell.configuration === 'pair_open' &&
          cell.level === 'beginner' &&
          cell.duration === 40,
      ),
    ).toBe(true)
  })

  it('verifies every visible focus cell against the readiness floor', () => {
    const audit = buildFocusReadinessAudit()

    expect(audit.cells.filter((cell) => cell.status !== 'verified')).toEqual([])
    expect(audit.cells.filter((cell) => cell.riskBuckets.length > 0)).toEqual([])
  })

  it('verified cells can build focus-controlled work without repeated drills', () => {
    const audit = buildFocusReadinessAudit()

    expect(
      audit.cells
        .filter((cell) => cell.status === 'verified')
        .map((cell) => ({
          cell,
          repeatedDrillIds: repeatedFocusControlledDrillIds(cell),
        }))
        .filter((result) => result.repeatedDrillIds.length > 0),
    ).toEqual([])
  })

  it('uses the current fixed profiles and treats 40 as the long-session readiness target', () => {
    expect(READINESS_DURATIONS).toEqual([15, 25, 40])
  })

  it('records pressure as not applicable when the generated layout has no pressure slot', () => {
    const cell = evaluateFocusReadinessCell({
      focus: 'pass',
      configuration: 'pair_net',
      level: 'beginner',
      duration: 15,
    })

    expect(cell.coverage.pressure.status).toBe('not_applicable')
    expect(cell.coverage.pressure.reason).toBe('layout_has_no_pressure_slot')
  })

  it('verifies advanced pair open serving long-session coverage with source-backed d22 and d33 depth', () => {
    const cell = evaluateFocusReadinessCell({
      focus: 'serve',
      configuration: 'pair_open',
      level: 'advanced',
      duration: 40,
    })

    expect(cell.status).toBe('verified')
    expect(cell.coverage.main.eligibleDrillFamilies).toEqual(expect.arrayContaining(['d22', 'd33']))
  })

  it('verifies intermediate solo open serving long-session coverage with no-net scoring depth', () => {
    const cell = evaluateFocusReadinessCell({
      focus: 'serve',
      configuration: 'solo_open',
      level: 'intermediate',
      duration: 40,
    })

    expect(cell.status).toBe('verified')
    expect(cell.coverage.main.eligibleDrillFamilies).toEqual(expect.arrayContaining(['d22', 'd33']))
  })

  it('applies player level when counting eligible drill families', () => {
    const beginner = evaluateFocusReadinessCell({
      focus: 'serve',
      configuration: 'solo_open',
      level: 'beginner',
      duration: 40,
    })
    const advanced = evaluateFocusReadinessCell({
      focus: 'serve',
      configuration: 'solo_open',
      level: 'advanced',
      duration: 40,
    })

    expect(beginner.coverage.main.eligibleDrillFamilies).toContain('d31')
    expect(advanced.coverage.main.eligibleDrillFamilies).not.toContain('d31')
  })

  it('applies player level when counting focus-reinforcing support families', () => {
    const advancedSetting = evaluateFocusReadinessCell({
      focus: 'set',
      configuration: 'pair_open',
      level: 'advanced',
      duration: 40,
    })

    expect(advancedSetting.coverage.support.eligibleDrillFamilies).toEqual(
      expect.arrayContaining(['d47', 'd48']),
    )
    for (const beginnerOrIntermediateOnly of ['d38', 'd39', 'd40', 'd42']) {
      expect(advancedSetting.coverage.support.eligibleDrillFamilies).not.toContain(
        beginnerOrIntermediateOnly,
      )
    }
  })

  it('verifies beginner setting in pair open long sessions once support slots follow focus', () => {
    const cell = evaluateFocusReadinessCell({
      focus: 'set',
      configuration: 'pair_open',
      level: 'beginner',
      duration: 40,
    })

    expect(cell.status).toBe('verified')
    expect(cell.coverage.support.eligibleDrillFamilies).toEqual(
      expect.arrayContaining(['d38', 'd39', 'd40']),
    )
  })

  it('verifies beginner serving in pair open long sessions with no-net serving variants', () => {
    const cell = evaluateFocusReadinessCell({
      focus: 'serve',
      configuration: 'pair_open',
      level: 'beginner',
      duration: 40,
    })

    expect(cell.status).toBe('verified')
    expect(cell.coverage.main.eligibleDrillFamilies).toEqual(expect.arrayContaining(['d31', 'd33']))
    expect(cell.coverage.support.eligibleDrillFamilies).toEqual(
      expect.arrayContaining(['d31', 'd33']),
    )
  })
})
