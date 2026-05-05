import { SESSION_ARCHETYPES } from './archetypes'
import { findCandidates, hasUnmodeledRequirements } from '../domain/sessionAssembly/candidates'
import { effectiveLevel } from '../domain/sessionAssembly/effectiveLevel'
import { effectiveSkillTags } from '../domain/sessionAssembly/effectiveFocus'
import { partitionByLevel } from '../domain/sessionAssembly/partitionByLevel'
import type {
  ArchetypeId,
  BlockSlot,
  PlayerLevel,
  SessionArchetype,
  SetupContext,
  SkillFocus,
  TimeProfile,
} from '../model'
import type { SkillLevel } from '../lib/skillLevel'

/**
 * Focus Coverage Audit.
 *
 * Pure diagnostic that walks the focus × player-mode × net/wall ×
 * time-profile × skill-level matrix and reports whether each cell
 * meets the practical depth floor defined in
 * `docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md`
 * (R6–R10):
 *
 * - **R6.** Each cell must have at least two eligible main-work
 *   drill families for the chosen focus.
 * - **R7.** Each cell must have at least one focus-reinforcing
 *   support option (technique or movement_proxy).
 * - **R8.** Each cell must have at least one pressure option for the
 *   chosen focus when pressure work is applicable (40-min layouts).
 * - **R9.** Each focus-controlled slot must have at least one same-
 *   focus swap alternative — implicitly satisfied when R6 / R8 pass.
 *
 * The audit is the test-backed implementation of the brainstorm's
 * deferred question ("Decide whether the audit should be a docs-only
 * table, a test-backed generated report, or both"). Choosing both:
 * `focusCoverageAudit.test.ts` snapshots the audit output so adding
 * or removing an eligible variant either keeps the snapshot green
 * (gap closed) or fails CI loudly (regression / new gap).
 *
 * **Counting rule (R5 / R15):** drill *families* are counted, not
 * variant rows. A family with multiple eligible variants for the
 * cell's configuration counts once.
 *
 * **Skill-level (R21):** the audit consumes onboarding skill level
 * via `effectiveLevel(onboarding)` exactly the way the live engine
 * does (from the 2026-05-04 skill-level mutability ship), so
 * skill-level coverage cannot pass on paper while generation
 * silently relaxes.
 *
 * **Support-reinforcing (R7):** for v1, "focus-reinforcing" means
 * the support drill's `skillFocus` includes the chosen focus tag
 * directly. Conservative — a future iteration can extend the
 * predicate to include source-backed adjacent tags (e.g., "movement"
 * for any focus). This conservative read is exactly what surfaces
 * the brainstorm's "long Serving session still has pass-flavored
 * support blocks" gap.
 */

export const FOCUS_LEVELS: readonly SkillLevel[] = [
  'foundations',
  'rally_builders',
  'side_out_builders',
  'competitive_pair',
] as const

const FOCUSES: readonly SkillFocus[] = ['pass', 'serve', 'set'] as const

const TIME_PROFILES: readonly TimeProfile[] = [15, 25, 40] as const

interface ConfigDef {
  readonly id: string
  readonly archetypeId: ArchetypeId
  readonly context: Pick<SetupContext, 'playerMode' | 'netAvailable' | 'wallAvailable'>
}

export const CONFIGS: readonly ConfigDef[] = [
  {
    id: 'solo_net',
    archetypeId: 'solo_net',
    context: { playerMode: 'solo', netAvailable: true, wallAvailable: false },
  },
  {
    id: 'solo_wall',
    archetypeId: 'solo_wall',
    context: { playerMode: 'solo', netAvailable: false, wallAvailable: true },
  },
  {
    id: 'solo_open',
    archetypeId: 'solo_open',
    context: { playerMode: 'solo', netAvailable: false, wallAvailable: false },
  },
  {
    id: 'pair_net',
    archetypeId: 'pair_net',
    context: { playerMode: 'pair', netAvailable: true, wallAvailable: false },
  },
  {
    id: 'pair_open',
    archetypeId: 'pair_open',
    context: { playerMode: 'pair', netAvailable: false, wallAvailable: false },
  },
] as const

export type CoverageStatus = 'covered' | 'failing' | 'not_applicable'

export type CoverageRiskBucket =
  | 'cannot_generate' // R6 main fails — engine cannot build a focused main_skill
  | 'off_focus_support' // R7 — no focus-reinforcing support drill in band
  | 'thin_pressure' // R8 — pressure slot present but no in-band pressure
  | 'no_same_focus_swap' // R9 — only 1 main family (swap would re-pick the same)
  | 'level_unhonored' // R21 — engine would relax level for this combination

export interface CellCounts {
  readonly mainFamiliesInBand: number
  readonly mainFamiliesAnyBand: number
  readonly supportFamiliesInBand: number
  readonly pressureFamiliesInBand: number
  readonly pressureFamiliesAnyBand: number
  readonly pressureApplicable: boolean
}

export interface CoverageCell {
  readonly focus: SkillFocus
  readonly skillLevel: SkillLevel
  readonly playerLevel: PlayerLevel
  readonly configId: string
  readonly playerMode: 'solo' | 'pair'
  readonly netAvailable: boolean
  readonly wallAvailable: boolean
  readonly timeProfile: TimeProfile
  readonly status: CoverageStatus
  readonly risks: readonly CoverageRiskBucket[]
  readonly counts: CellCounts
}

export interface CoverageAuditResult {
  readonly cells: readonly CoverageCell[]
  readonly summary: CoverageAuditSummary
}

export interface CoverageAuditSummary {
  readonly totalCells: number
  readonly coveredCount: number
  readonly failingCount: number
  readonly notApplicableCount: number
  readonly riskBucketCounts: Record<CoverageRiskBucket, number>
}

function getArchetype(archetypeId: ArchetypeId): SessionArchetype | undefined {
  return SESSION_ARCHETYPES.find((a: SessionArchetype) => a.id === archetypeId)
}

function findSlot(
  archetype: SessionArchetype,
  timeProfile: TimeProfile,
  type: BlockSlot['type'],
): BlockSlot | undefined {
  const layout = archetype.layouts[timeProfile]
  return layout?.find((slot) => slot.type === type)
}

function countInBandFamilies(
  slot: BlockSlot | undefined,
  context: SetupContext,
  effectiveLevelValue: PlayerLevel,
): { inBand: number; total: number } {
  if (!slot) return { inBand: 0, total: 0 }
  const candidates = findCandidates(slot, context)
  const families = new Set(candidates.map((c) => c.drill.id))
  const { inBand } = partitionByLevel(candidates, effectiveLevelValue)
  const inBandFamilies = new Set(inBand.map((c) => c.drill.id))
  return { inBand: inBandFamilies.size, total: families.size }
}

/**
 * Count families of focus-reinforcing support drills (technique +
 * movement_proxy combined). A drill is focus-reinforcing if its
 * `skillFocus` includes the chosen focus tag directly.
 *
 * Conservative read — a future iteration can extend to source-backed
 * adjacent tags (e.g., movement work counts for any focus).
 */
function countInBandSupportFamilies(
  archetype: SessionArchetype,
  timeProfile: TimeProfile,
  context: SetupContext,
  focus: SkillFocus,
  effectiveLevelValue: PlayerLevel,
): number {
  const techniqueSlot = findSlot(archetype, timeProfile, 'technique')
  const movementSlot = findSlot(archetype, timeProfile, 'movement_proxy')
  const allCandidates = [
    ...(techniqueSlot ? findCandidates(techniqueSlot, context) : []),
    ...(movementSlot ? findCandidates(movementSlot, context) : []),
  ]
  // Only count drills whose skillFocus includes the chosen focus
  // directly — the strict R7 "focus-reinforcing" interpretation.
  const focusReinforcing = allCandidates.filter((c) => c.drill.skillFocus.includes(focus))
  const { inBand } = partitionByLevel(focusReinforcing, effectiveLevelValue)
  return new Set(inBand.map((c) => c.drill.id)).size
}

function evaluateCell(
  focus: SkillFocus,
  skillLevel: SkillLevel,
  config: ConfigDef,
  timeProfile: TimeProfile,
): CoverageCell {
  const playerLevel = effectiveLevel(skillLevel)
  // sessionFocus is restricted to the user-pickable subset
  // (`pass | serve | set`); the audit only iterates over those values
  // so this cast is type-safe by construction.
  const context: SetupContext = {
    ...config.context,
    timeProfile,
    sessionFocus: focus as SetupContext['sessionFocus'],
  }

  const archetype = getArchetype(config.archetypeId)
  if (!archetype || !archetype.layouts[timeProfile]) {
    return {
      focus,
      skillLevel,
      playerLevel,
      configId: config.id,
      playerMode: config.context.playerMode,
      netAvailable: config.context.netAvailable,
      wallAvailable: config.context.wallAvailable,
      timeProfile,
      status: 'not_applicable',
      risks: [],
      counts: {
        mainFamiliesInBand: 0,
        mainFamiliesAnyBand: 0,
        supportFamiliesInBand: 0,
        pressureFamiliesInBand: 0,
        pressureFamiliesAnyBand: 0,
        pressureApplicable: false,
      },
    }
  }

  // Apply effective focus to the slots before counting (mirrors the
  // engine's actual narrowing behavior at runtime).
  const mainSlot = findSlot(archetype, timeProfile, 'main_skill')
  const pressureSlot = findSlot(archetype, timeProfile, 'pressure')
  const mainSlotWithFocus: BlockSlot | undefined = mainSlot
    ? { ...mainSlot, skillTags: effectiveSkillTags('main_skill', context, mainSlot.skillTags) }
    : undefined
  const pressureSlotWithFocus: BlockSlot | undefined = pressureSlot
    ? {
        ...pressureSlot,
        skillTags: effectiveSkillTags('pressure', context, pressureSlot.skillTags),
      }
    : undefined

  const main = countInBandFamilies(mainSlotWithFocus, context, playerLevel)
  const pressure = countInBandFamilies(pressureSlotWithFocus, context, playerLevel)
  const supportInBand = countInBandSupportFamilies(
    archetype,
    timeProfile,
    context,
    focus,
    playerLevel,
  )

  const pressureApplicable = pressureSlot !== undefined

  const risks: CoverageRiskBucket[] = []
  if (main.inBand < 2) {
    if (main.total === 0) risks.push('cannot_generate')
    else if (main.inBand === 0) risks.push('level_unhonored')
    else risks.push('no_same_focus_swap')
  }
  if (supportInBand < 1) risks.push('off_focus_support')
  if (pressureApplicable && pressure.inBand < 1) risks.push('thin_pressure')

  const status: CoverageStatus = risks.length > 0 ? 'failing' : 'covered'

  return {
    focus,
    skillLevel,
    playerLevel,
    configId: config.id,
    playerMode: config.context.playerMode,
    netAvailable: config.context.netAvailable,
    wallAvailable: config.context.wallAvailable,
    timeProfile,
    status,
    risks,
    counts: {
      mainFamiliesInBand: main.inBand,
      mainFamiliesAnyBand: main.total,
      supportFamiliesInBand: supportInBand,
      pressureFamiliesInBand: pressure.inBand,
      pressureFamiliesAnyBand: pressure.total,
      pressureApplicable,
    },
  }
}

export function runFocusCoverageAudit(): CoverageAuditResult {
  const cells: CoverageCell[] = []
  for (const focus of FOCUSES) {
    for (const skillLevel of FOCUS_LEVELS) {
      for (const config of CONFIGS) {
        for (const timeProfile of TIME_PROFILES) {
          cells.push(evaluateCell(focus, skillLevel, config, timeProfile))
        }
      }
    }
  }

  const summary: CoverageAuditSummary = {
    totalCells: cells.length,
    coveredCount: cells.filter((c) => c.status === 'covered').length,
    failingCount: cells.filter((c) => c.status === 'failing').length,
    notApplicableCount: cells.filter((c) => c.status === 'not_applicable').length,
    riskBucketCounts: {
      cannot_generate: 0,
      off_focus_support: 0,
      thin_pressure: 0,
      no_same_focus_swap: 0,
      level_unhonored: 0,
    },
  }
  for (const cell of cells) {
    for (const risk of cell.risks) {
      summary.riskBucketCounts[risk]++
    }
  }

  return { cells, summary }
}

/**
 * Compact, snapshot-friendly summary keyed by `(focus, skillLevel,
 * configId, timeProfile)`. Each entry is `'covered'`,
 * `'not_applicable'`, or a sorted joined risk-bucket string for
 * `'failing'` cells. Snapshot diffs are scan-friendly: a closed gap
 * flips from `'cannot_generate'` to `'covered'`; a new gap appears
 * as a new key.
 */
export function summarizeCoverageForSnapshot(
  result: CoverageAuditResult,
): Record<string, string> {
  const snapshot: Record<string, string> = {}
  for (const cell of result.cells) {
    const key = `${cell.focus}|${cell.skillLevel}|${cell.configId}|${cell.timeProfile}`
    if (cell.status === 'covered') {
      snapshot[key] = 'covered'
    } else if (cell.status === 'not_applicable') {
      snapshot[key] = 'not_applicable'
    } else {
      snapshot[key] = [...cell.risks].sort().join(',')
    }
  }
  return snapshot
}

// Re-export for the audit script that writes the markdown report.
export { hasUnmodeledRequirements }
