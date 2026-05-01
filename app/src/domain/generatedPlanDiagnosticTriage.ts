import type { GeneratedPlanObservationGroup } from './generatedPlanDiagnostics'

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

export function validateGeneratedPlanTriageCoverage(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[] = GENERATED_PLAN_TRIAGE_REGISTRY,
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
