import type {
  GeneratedPlanObservationCode,
  GeneratedPlanObservationGroup,
} from './generatedPlanDiagnostics'

export type GeneratedPlanTriageStatus = 'observed' | 'routed' | 'resolved' | 'superseded'

export type GeneratedPlanTriageRoute =
  | 'policy_allowance'
  | 'variant_cap_review'
  | 'block_split'
  | 'source_backed_content_depth'
  | 'generator_policy_investigation'
  | 'defer'

export type GeneratedPlanEnforcementStatus =
  | 'observation_only'
  | 'hard_fail_candidate'
  | 'hard_fail_enforced'

export type GeneratedPlanTriageIssueCode =
  | 'untriaged_group'
  | 'stale_fingerprint'
  | 'missing_required_field'
  | 'invalid_registry_entry'
  | 'duplicate_group_key'
  | 'source_depth_missing_evidence'
  | 'enforced_group_present'
  | 'superseded_group'
  | 'unknown_compression_lane'

export type GeneratedPlanDecisionDebtCompressionLane =
  | 'short_session_cooldown_minimum'
  | 'technique_under_min_review'
  | 'workload_envelope_review'
  | 'generator_redistribution_investigation'
  | 'source_backed_content_depth_candidate'
  | 'low_volume_watchlist'
  | 'unknown_unclassified'

export type GeneratedPlanDecisionDebtDisposition =
  | 'needs_human_decision'
  | 'no_implementation_action_yet'

export interface GeneratedPlanDecisionDebtRouteCount {
  readonly route: GeneratedPlanTriageRoute
  readonly count: number
}

export interface GeneratedPlanDecisionDebtPrompt {
  readonly lane: GeneratedPlanDecisionDebtCompressionLane
  readonly label: string
  readonly question: string
  readonly explanation: string
  readonly affectedGroupCount: number
  readonly totalAffectedCellCount: number
  readonly redistributionAffectedCellCount: number
  readonly nonRedistributionOverCapCellCount: number
  readonly routeCounts: readonly GeneratedPlanDecisionDebtRouteCount[]
  readonly groupKeys: readonly string[]
  readonly disposition: GeneratedPlanDecisionDebtDisposition
  readonly nextEvidenceNeeded: string
  readonly recommendedFollowUpUnit: string
  readonly guideAnchor?: string
  readonly candidateDispositions: readonly string[]
}

export interface GeneratedPlanTriageEntry {
  readonly groupKey: string
  readonly diagnosticFingerprint: string
  readonly triageStatus: GeneratedPlanTriageStatus
  readonly route: GeneratedPlanTriageRoute
  readonly enforcementStatus: GeneratedPlanEnforcementStatus
  readonly rationale: string
  readonly owner: string
  readonly reviewedReportId: string
  readonly affectedCellCount: number
  readonly likelyFixPaths: readonly string[]
  readonly evidence: readonly string[]
}

export interface GeneratedPlanTriageIssue {
  readonly code: GeneratedPlanTriageIssueCode
  readonly groupKey: string
  readonly severity: 'blocking' | 'warning'
  readonly message: string
}

export interface GeneratedPlanTriageValidation {
  readonly issues: readonly GeneratedPlanTriageIssue[]
  readonly blockingIssues: readonly GeneratedPlanTriageIssue[]
  readonly warningIssues: readonly GeneratedPlanTriageIssue[]
}

export const GENERATED_PLAN_TRIAGE_REPORT_ID = 'generated-plan-diagnostics-report-2026-05-01'

const TRIAGE_STATUSES: readonly GeneratedPlanTriageStatus[] = [
  'observed',
  'routed',
  'resolved',
  'superseded',
]

const TRIAGE_ROUTES: readonly GeneratedPlanTriageRoute[] = [
  'policy_allowance',
  'variant_cap_review',
  'block_split',
  'source_backed_content_depth',
  'generator_policy_investigation',
  'defer',
]

const ENFORCEMENT_STATUSES: readonly GeneratedPlanEnforcementStatus[] = [
  'observation_only',
  'hard_fail_candidate',
  'hard_fail_enforced',
]

const LOW_VOLUME_WATCHLIST_MAX_AFFECTED_CELLS = 3
const WORKLOAD_ENVELOPE_GUIDE_PATH = 'docs/ops/workload-envelope-authoring-guide.md'

const COMPRESSION_LANE_ORDER: readonly GeneratedPlanDecisionDebtCompressionLane[] = [
  'short_session_cooldown_minimum',
  'technique_under_min_review',
  'workload_envelope_review',
  'generator_redistribution_investigation',
  'source_backed_content_depth_candidate',
  'low_volume_watchlist',
  'unknown_unclassified',
]

const COMPRESSION_LANE_DETAILS: Record<
  GeneratedPlanDecisionDebtCompressionLane,
  Pick<
    GeneratedPlanDecisionDebtPrompt,
    | 'label'
    | 'question'
    | 'explanation'
    | 'disposition'
    | 'nextEvidenceNeeded'
    | 'recommendedFollowUpUnit'
    | 'guideAnchor'
    | 'candidateDispositions'
  >
> = {
  short_session_cooldown_minimum: {
    label: 'Short-session cooldown minimum',
    question: 'Is the short wrap envelope acceptable, or does this need cap/block/content follow-up?',
    explanation: 'Wrap under-min groups are likely cooldown policy questions before they are catalog gaps.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded: 'Review cooldown minimum policy and decide whether U7 workload guidance should encode it.',
    recommendedFollowUpUnit: 'U7 workload envelope guidance',
    guideAnchor: 'short-session-cooldown-minimum',
    candidateDispositions: [
      'accepted_policy_allowance',
      'metadata_review_needed',
      'block_shape_review_needed',
    ],
  },
  technique_under_min_review: {
    label: 'Technique under-min review',
    question: 'Are technique slots intentionally below authored minimums, or should catalog depth/block shape change?',
    explanation: 'Technique under-min groups need human review before source-backed content or block-split work.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded: 'Review whether these technique slots are acceptable short-form drills or content-depth candidates.',
    recommendedFollowUpUnit: 'U7 workload envelope guidance',
    guideAnchor: 'technique-under-min-review',
    candidateDispositions: [
      'accepted_policy_allowance',
      'metadata_review_needed',
      'block_shape_review_needed',
      'source_depth_candidate',
    ],
  },
  workload_envelope_review: {
    label: 'Workload envelope review',
    question: 'Are duration and fatigue envelopes correct for these generated allocations?',
    explanation: 'Over/under envelope pressure is a workload-policy question before catalog edits.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded: 'Review cap policy and block split thresholds for the affected main-skill groups.',
    recommendedFollowUpUnit: 'U7 workload envelope guidance',
    guideAnchor: 'workload-envelope-review',
    candidateDispositions: [
      'metadata_review_needed',
      'block_shape_review_needed',
      'requires_U6_preview',
      'no_implementation_action_yet',
    ],
  },
  generator_redistribution_investigation: {
    label: 'Generator redistribution investigation',
    question: 'Would these over-cap groups still exist without optional-slot redistribution?',
    explanation: 'Redistribution evidence means generator policy should be investigated before catalog changes.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded: 'Compare redistribution-affected cells against non-redistribution over-cap cells.',
    recommendedFollowUpUnit: 'U8 redistribution comparison',
    candidateDispositions: ['route_to_U8'],
  },
  source_backed_content_depth_candidate: {
    label: 'Source-backed content-depth candidate',
    question: 'Is there enough evidence to write a source-backed gap card?',
    explanation: 'Content-depth candidates require source-backed evidence before catalog activation.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded: 'Attach a gap card, source reference, activation path, or explicit no-action decision.',
    recommendedFollowUpUnit: 'Pause until a concrete gap card exists',
    candidateDispositions: ['source_depth_candidate'],
  },
  low_volume_watchlist: {
    label: 'Low-volume watchlist',
    question: 'Should these small groups stay watched without implementation action?',
    explanation: 'Low-volume groups with no stronger lane match should not drive immediate catalog or generator work.',
    disposition: 'no_implementation_action_yet',
    nextEvidenceNeeded: 'Revisit only if the affected-cell count grows or the pattern repeats in a stronger lane.',
    recommendedFollowUpUnit: 'Pause',
    candidateDispositions: ['no_implementation_action_yet'],
  },
  unknown_unclassified: {
    label: 'Unknown or unclassified',
    question: 'What decision lane should this unexpected pattern use?',
    explanation: 'Unknown patterns must stay visible instead of disappearing into the watchlist.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded: 'Classify the pattern or add an explicit compression lane before proceeding.',
    recommendedFollowUpUnit: 'Pause',
    candidateDispositions: ['no_implementation_action_yet'],
  },
}

export const GENERATED_PLAN_TRIAGE_REGISTRY: readonly GeneratedPlanTriageEntry[] = []

export function isGeneratedPlanTriageStatus(value: unknown): value is GeneratedPlanTriageStatus {
  return typeof value === 'string' && (TRIAGE_STATUSES as readonly string[]).includes(value)
}

export function isGeneratedPlanTriageRoute(value: unknown): value is GeneratedPlanTriageRoute {
  return typeof value === 'string' && (TRIAGE_ROUTES as readonly string[]).includes(value)
}

export function isGeneratedPlanEnforcementStatus(
  value: unknown,
): value is GeneratedPlanEnforcementStatus {
  return typeof value === 'string' && (ENFORCEMENT_STATUSES as readonly string[]).includes(value)
}

function hasText(value: string): boolean {
  return value.trim().length > 0
}

function entryMissingRequiredField(entry: GeneratedPlanTriageEntry): boolean {
  return (
    !hasText(entry.groupKey) ||
    !hasText(entry.diagnosticFingerprint) ||
    !hasText(entry.rationale) ||
    !hasText(entry.owner) ||
    !hasText(entry.reviewedReportId) ||
    entry.affectedCellCount <= 0 ||
    entry.likelyFixPaths.length === 0
  )
}

function entryHasInvalidRuntimeShape(entry: GeneratedPlanTriageEntry): boolean {
  return (
    !isGeneratedPlanTriageStatus(entry.triageStatus) ||
    !isGeneratedPlanTriageRoute(entry.route) ||
    !isGeneratedPlanEnforcementStatus(entry.enforcementStatus) ||
    !Array.isArray(entry.likelyFixPaths) ||
    !Array.isArray(entry.evidence)
  )
}

function triageIssue(
  code: GeneratedPlanTriageIssueCode,
  groupKey: string,
  severity: 'blocking' | 'warning',
  message: string,
): GeneratedPlanTriageIssue {
  return { code, groupKey, severity, message }
}

function groupHasObservationCode(
  group: GeneratedPlanObservationGroup,
  code: GeneratedPlanObservationCode,
): boolean {
  return group.observationCodes.includes(code)
}

function affectedCellHasObservationCode(
  cell: GeneratedPlanObservationGroup['affectedCells'][number],
  code: GeneratedPlanObservationCode,
): boolean {
  return cell.observationCodes.includes(code)
}

function hasOverCapPressure(group: GeneratedPlanObservationGroup): boolean {
  return (
    groupHasObservationCode(group, 'over_authored_max') ||
    groupHasObservationCode(group, 'over_fatigue_cap')
  )
}

export function compressionLaneForGeneratedPlanTriageItem(
  group: GeneratedPlanObservationGroup,
  entry: GeneratedPlanTriageEntry,
): GeneratedPlanDecisionDebtCompressionLane {
  if (
    group.blockType === 'wrap' &&
    groupHasObservationCode(group, 'under_authored_min')
  ) {
    return 'short_session_cooldown_minimum'
  }

  if (groupHasObservationCode(group, 'optional_slot_redistribution')) {
    return 'generator_redistribution_investigation'
  }

  if (entry.route === 'source_backed_content_depth') {
    return 'source_backed_content_depth_candidate'
  }

  if (hasOverCapPressure(group)) {
    return 'workload_envelope_review'
  }

  if (
    group.blockType === 'technique' &&
    groupHasObservationCode(group, 'under_authored_min')
  ) {
    return 'technique_under_min_review'
  }

  if (group.blockType === 'main_skill' && groupHasObservationCode(group, 'under_authored_min')) {
    return 'workload_envelope_review'
  }

  if (group.affectedCellCount <= LOW_VOLUME_WATCHLIST_MAX_AFFECTED_CELLS) {
    return 'low_volume_watchlist'
  }

  return 'unknown_unclassified'
}

function redistributionAffectedCellCount(group: GeneratedPlanObservationGroup): number {
  return group.affectedCells.filter(
    (cell) =>
      cell.redistribution !== undefined ||
      affectedCellHasObservationCode(cell, 'optional_slot_redistribution'),
  ).length
}

function nonRedistributionOverCapCellCount(group: GeneratedPlanObservationGroup): number {
  return group.affectedCells.filter(
    (cell) =>
      cell.redistribution === undefined &&
      !affectedCellHasObservationCode(cell, 'optional_slot_redistribution') &&
      (affectedCellHasObservationCode(cell, 'over_authored_max') ||
        affectedCellHasObservationCode(cell, 'over_fatigue_cap')),
  ).length
}

function routeCountsForEntries(
  entries: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanDecisionDebtRouteCount[] {
  const counts = new Map<GeneratedPlanTriageRoute, number>()
  for (const entry of entries) counts.set(entry.route, (counts.get(entry.route) ?? 0) + 1)
  return TRIAGE_ROUTES.filter((route) => counts.has(route)).map((route) => ({
    route,
    count: counts.get(route) ?? 0,
  }))
}

export function validateGeneratedPlanTriageCoverage(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanTriageValidation {
  const currentGroupsByKey = new Map(groups.map((group) => [group.groupKey, group] as const))
  const issues: GeneratedPlanTriageIssue[] = []
  const seenEntryKeys = new Set<string>()
  const duplicateEntryKeys = new Set<string>()

  for (const entry of registry) {
    if (seenEntryKeys.has(entry.groupKey)) duplicateEntryKeys.add(entry.groupKey)
    seenEntryKeys.add(entry.groupKey)
    if (entryHasInvalidRuntimeShape(entry)) {
      issues.push(
        triageIssue(
          'invalid_registry_entry',
          entry.groupKey,
          'blocking',
          'Triage registry entry has invalid status, route, enforcement, or array fields.',
        ),
      )
    }
  }

  for (const groupKey of duplicateEntryKeys) {
    issues.push(
      triageIssue(
        'duplicate_group_key',
        groupKey,
        'blocking',
        'Triage registry contains duplicate entries for this group key.',
      ),
    )
  }

  const entriesByKey = new Map(registry.map((entry) => [entry.groupKey, entry] as const))

  for (const group of groups) {
    const entry = entriesByKey.get(group.groupKey)
    if (!entry) {
      issues.push(
        triageIssue(
          'untriaged_group',
          group.groupKey,
          'blocking',
          'Current generated-plan observation group has no triage registry entry.',
        ),
      )
      continue
    }

    if (entryMissingRequiredField(entry)) {
      issues.push(
        triageIssue(
          'missing_required_field',
          group.groupKey,
          'blocking',
          'Triage registry entry is missing required decision metadata.',
        ),
      )
    }

    if (entry.diagnosticFingerprint !== group.diagnosticFingerprint) {
      issues.push(
        triageIssue(
          'stale_fingerprint',
          group.groupKey,
          'blocking',
          'Triage registry entry fingerprint no longer matches current diagnostic facts.',
        ),
      )
    }

    if (
      entry.route === 'source_backed_content_depth' &&
      entry.triageStatus === 'resolved' &&
      entry.evidence.length === 0
    ) {
      issues.push(
        triageIssue(
          'source_depth_missing_evidence',
          group.groupKey,
          'blocking',
          'Source-backed content routes cannot resolve without evidence links.',
        ),
      )
    }

    if (entry.enforcementStatus === 'hard_fail_enforced') {
      issues.push(
        triageIssue(
          'enforced_group_present',
          group.groupKey,
          'blocking',
          'A hard-fail-enforced observation group is still present.',
        ),
      )
    }

    if (compressionLaneForGeneratedPlanTriageItem(group, entry) === 'unknown_unclassified') {
      issues.push(
        triageIssue(
          'unknown_compression_lane',
          group.groupKey,
          'blocking',
          'Generated-plan observation group does not match a known decision-debt compression lane.',
        ),
      )
    }
  }

  for (const entry of registry) {
    if (!currentGroupsByKey.has(entry.groupKey)) {
      issues.push(
        triageIssue(
          'superseded_group',
          entry.groupKey,
          'warning',
          'Triage registry entry no longer maps to a current generated-plan observation group.',
        ),
      )
    }
  }

  const blockingIssues = issues.filter((issue) => issue.severity === 'blocking')
  const warningIssues = issues.filter((issue) => issue.severity === 'warning')
  return { issues, blockingIssues, warningIssues }
}

export function buildGeneratedPlanDecisionDebtPrompts(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanDecisionDebtPrompt[] {
  const entriesByKey = new Map(registry.map((entry) => [entry.groupKey, entry] as const))
  const items = groups
    .map((group) => ({ group, entry: entriesByKey.get(group.groupKey) }))
    .filter(
      (
        item,
      ): item is { group: GeneratedPlanObservationGroup; entry: GeneratedPlanTriageEntry } =>
        item.entry !== undefined &&
        item.entry.triageStatus !== 'resolved' &&
        item.entry.triageStatus !== 'superseded',
    )

  const prompts: GeneratedPlanDecisionDebtPrompt[] = []

  for (const lane of COMPRESSION_LANE_ORDER) {
    const laneItems = items.filter(
      ({ group, entry }) => compressionLaneForGeneratedPlanTriageItem(group, entry) === lane,
    )
    if (laneItems.length === 0) continue
    const detail = COMPRESSION_LANE_DETAILS[lane]
    prompts.push({
      lane,
      ...detail,
      affectedGroupCount: laneItems.length,
      totalAffectedCellCount: laneItems.reduce(
        (sum, { group }) => sum + group.affectedCellCount,
        0,
      ),
      redistributionAffectedCellCount: laneItems.reduce(
        (sum, { group }) => sum + redistributionAffectedCellCount(group),
        0,
      ),
      nonRedistributionOverCapCellCount: laneItems.reduce(
        (sum, { group }) => sum + nonRedistributionOverCapCellCount(group),
        0,
      ),
      routeCounts: routeCountsForEntries(laneItems.map(({ entry }) => entry)),
      groupKeys: laneItems.map(({ group }) => group.groupKey),
    })
  }

  return prompts
}

export function conservativeRouteForGeneratedPlanGroup(
  group: GeneratedPlanObservationGroup,
): GeneratedPlanTriageRoute {
  if (group.observationCodes.includes('optional_slot_redistribution')) {
    return 'generator_policy_investigation'
  }
  return 'defer'
}

export function buildInitialGeneratedPlanTriageRegistry(
  groups: readonly GeneratedPlanObservationGroup[],
): GeneratedPlanTriageEntry[] {
  return groups.map((group) => {
    const route = conservativeRouteForGeneratedPlanGroup(group)
    return {
      groupKey: group.groupKey,
      diagnosticFingerprint: group.diagnosticFingerprint,
      triageStatus: route === 'generator_policy_investigation' ? 'routed' : 'observed',
      route,
      enforcementStatus: 'observation_only',
      rationale:
        route === 'generator_policy_investigation'
          ? 'Redistribution evidence is present, so generator policy should be investigated before catalog changes.'
          : 'Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.',
      owner: 'agent',
      reviewedReportId: GENERATED_PLAN_TRIAGE_REPORT_ID,
      affectedCellCount: group.affectedCellCount,
      likelyFixPaths: group.likelyFixPaths,
      evidence: [],
    }
  })
}

export function buildGeneratedPlanTriageWorkbenchMarkdown(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): string {
  const validation = validateGeneratedPlanTriageCoverage(groups, registry)
  const entriesByKey = new Map(registry.map((entry) => [entry.groupKey, entry] as const))
  const currentEntries = groups
    .map((group) => ({ group, entry: entriesByKey.get(group.groupKey) }))
    .filter((item): item is { group: GeneratedPlanObservationGroup; entry: GeneratedPlanTriageEntry } =>
      item.entry !== undefined,
    )

  const routeCounts = new Map<GeneratedPlanTriageRoute, number>()
  for (const { entry } of currentEntries) {
    routeCounts.set(entry.route, (routeCounts.get(entry.route) ?? 0) + 1)
  }
  const decisionDebtPrompts = buildGeneratedPlanDecisionDebtPrompts(groups, registry)
  const decisionDebtLines =
    decisionDebtPrompts.length === 0
      ? ['- None.']
      : decisionDebtPrompts.flatMap((prompt) => {
          const guideLine = prompt.guideAnchor
            ? [
                `- Guide: \`${WORKLOAD_ENVELOPE_GUIDE_PATH}#${prompt.guideAnchor}\``,
              ]
            : []
          return [
            `### ${prompt.label}`,
            '',
            `- Lane: \`${prompt.lane}\``,
            `- Question: ${prompt.question}`,
            `- Why this lane: ${prompt.explanation}`,
            `- Groups: ${prompt.affectedGroupCount}; total affected cells: ${prompt.totalAffectedCellCount}`,
            `- Redistribution-affected cells: ${prompt.redistributionAffectedCellCount}`,
            `- Non-redistribution over-cap cells: ${prompt.nonRedistributionOverCapCellCount}`,
            `- Route mix: ${prompt.routeCounts.map(({ route, count }) => `\`${route}\` ${count}`).join(', ')}`,
            `- Disposition: \`${prompt.disposition}\``,
            `- Candidate dispositions: ${prompt.candidateDispositions.map((disposition) => `\`${disposition}\``).join(', ')}`,
            `- Recommended follow-up: ${prompt.recommendedFollowUpUnit}`,
            ...guideLine,
            `- Next evidence needed: ${prompt.nextEvidenceNeeded}`,
            `- Group keys: ${prompt.groupKeys.map((key) => `\`${key}\``).join(', ')}`,
            '',
          ]
        })

  const lines = [
    '## Triage Summary',
    '',
    `- Current routeable groups: ${groups.length}`,
    `- Registry entries: ${registry.length}`,
    `- Blocking validation issues: ${validation.blockingIssues.length}`,
    `- Warning validation issues: ${validation.warningIssues.length}`,
    '',
    '## Route Counts',
    '',
    ...[...routeCounts.entries()].map(([route, count]) => `- \`${route}\`: ${count}`),
    '',
    '## Decision-Debt Compression',
    '',
    ...decisionDebtLines,
    '',
    '## New / Untriaged Blockers',
    '',
    ...validation.issues
      .filter((issue) => issue.code === 'untriaged_group')
      .map((issue) => `- \`${issue.groupKey}\`: ${issue.message}`),
    validation.issues.some((issue) => issue.code === 'untriaged_group') ? '' : '- None.',
    '',
    '## Stale Fingerprint Review',
    '',
    ...validation.issues
      .filter((issue) => issue.code === 'stale_fingerprint')
      .map((issue) => `- \`${issue.groupKey}\`: ${issue.message}`),
    validation.issues.some((issue) => issue.code === 'stale_fingerprint') ? '' : '- None.',
    '',
    '## Other Blocking Validation Issues',
    '',
    ...validation.issues
      .filter(
        (issue) =>
          issue.severity === 'blocking' &&
          !['untriaged_group', 'stale_fingerprint'].includes(issue.code),
      )
      .map((issue) => `- \`${issue.groupKey}\` (\`${issue.code}\`): ${issue.message}`),
    validation.issues.some(
      (issue) =>
        issue.severity === 'blocking' &&
        !['untriaged_group', 'stale_fingerprint'].includes(issue.code),
    )
      ? ''
      : '- None.',
    '',
    '## Resolved / Superseded Cleanup',
    '',
    ...validation.issues
      .filter((issue) => issue.code === 'superseded_group')
      .map((issue) => `- \`${issue.groupKey}\`: ${issue.message}`),
    validation.issues.some((issue) => issue.code === 'superseded_group') ? '' : '- None.',
    '',
    '## Evidence-Required Routes',
    '',
    ...currentEntries
      .filter(({ entry }) => entry.route === 'source_backed_content_depth')
      .map(({ group, entry }) => `- \`${entry.groupKey}\` (${group.affectedCellCount} cells)`),
    currentEntries.some(({ entry }) => entry.route === 'source_backed_content_depth') ? '' : '- None.',
    '',
    '## Needs Human Review',
    '',
    ...currentEntries
      .filter(({ entry }) => entry.route === 'defer')
      .map(
        ({ group, entry }) =>
          `- \`${entry.groupKey}\` (${group.affectedCellCount} cells): ${entry.rationale}`,
      ),
    currentEntries.some(({ entry }) => entry.route === 'defer') ? '' : '- None.',
    '',
    '## Generator Policy Investigation',
    '',
    ...currentEntries
      .filter(({ entry }) => entry.route === 'generator_policy_investigation')
      .map(
        ({ group, entry }) =>
          `- \`${entry.groupKey}\` (${group.affectedCellCount} cells): ${entry.rationale}`,
      ),
    currentEntries.some(({ entry }) => entry.route === 'generator_policy_investigation')
      ? ''
      : '- None.',
    '',
    '## Top Affected Groups',
    '',
    ...currentEntries
      .map(
        ({ group, entry }) =>
          `- \`${entry.groupKey}\` (${group.affectedCellCount} cells, route: \`${entry.route}\`)`,
      ),
  ]

  return `${lines.join('\n')}\n`
}
