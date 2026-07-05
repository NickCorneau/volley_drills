import type { SessionPlanBlock } from '../model'

/**
 * Minimal ladder-resolution block fixture shared by the
 * `domain/__tests__/drillMetadata.*.test.ts` family (skillFocus,
 * rungIntent, blockOpening, liveCue, reflection) — previously five
 * verbatim copies. Content-empty by default so each test names only
 * what it exercises (usually `drillId` / `variantId` / `drillName` /
 * `type`). Distinct from `runnerFixture.ts` (full runner harness) and
 * from `drillMetadata.test.ts`'s local catalog-loaded fixture, which
 * deliberately defaults to a real d31 block.
 */
export function makeBlock(overrides: Partial<SessionPlanBlock>): SessionPlanBlock {
  return {
    id: 'b-test',
    type: 'main_skill',
    drillName: '',
    shortName: '',
    durationMinutes: 5,
    coachingCue: '',
    courtsideInstructions: '',
    required: true,
    ...overrides,
  }
}
