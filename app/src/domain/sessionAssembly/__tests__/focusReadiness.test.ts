import { describe, expect, it } from 'vitest'
import {
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

    expect(audit.cells).toHaveLength(
      VISIBLE_FOCUSES.length *
        READINESS_CONFIGURATIONS.length *
        PLAYER_LEVELS.length *
        READINESS_DURATIONS.length,
    )
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

  it('flags the current pair open serving long-session cell as failing instead of paper-covered', () => {
    const cell = evaluateFocusReadinessCell({
      focus: 'serve',
      configuration: 'pair_open',
      level: 'beginner',
      duration: 40,
    })

    expect(cell.status).toBe('failing')
    expect(cell.riskBuckets.length).toBeGreaterThan(0)
  })
})
