import { formatBuildVersion } from '../buildInfo'

describe('formatBuildVersion', () => {
  describe('dev mode (preserves raw triage telemetry)', () => {
    it('returns the verbose inter-tag slug unchanged', () => {
      expect(
        formatBuildVersion('m001-validation-week5-catchup-2026-05-23-1-gbc6831d', 'dev'),
      ).toBe('m001-validation-week5-catchup-2026-05-23-1-gbc6831d')
    })

    it('returns a dirty-tree slug unchanged', () => {
      expect(formatBuildVersion('v0b-alpha.16-3-g1234567-dirty', 'dev')).toBe(
        'v0b-alpha.16-3-g1234567-dirty',
      )
    })

    it('returns a clean tag unchanged', () => {
      expect(formatBuildVersion('v0b-alpha.16', 'dev')).toBe('v0b-alpha.16')
    })
  })

  describe('prod mode (short form, stranger-cohort safe)', () => {
    it('truncates an inter-tag slug down to its g<sha> segment', () => {
      expect(
        formatBuildVersion('m001-validation-week5-catchup-2026-05-23-1-gbc6831d', 'prod'),
      ).toBe('bc6831d')
    })

    it('passes through a clean tag with no -N-gSHA suffix', () => {
      expect(formatBuildVersion('v0b-alpha.16', 'prod')).toBe('v0b-alpha.16')
    })

    it('preserves the -dirty suffix on inter-tag builds', () => {
      expect(formatBuildVersion('v0b-alpha.16-3-g1234567-dirty', 'prod')).toBe('1234567-dirty')
    })

    it('passes through a dirty clean tag unchanged (no g<sha> to truncate to)', () => {
      expect(formatBuildVersion('v0b-alpha.16-dirty', 'prod')).toBe('v0b-alpha.16-dirty')
    })

    it('passes through a bare short SHA when no tag exists', () => {
      expect(formatBuildVersion('bc6831d', 'prod')).toBe('bc6831d')
    })

    it('handles longer g<sha> values (>7 chars) by keeping the full hash', () => {
      expect(formatBuildVersion('v0b-alpha.16-3-g1234567890abcdef', 'prod')).toBe(
        '1234567890abcdef',
      )
    })
  })

  describe('case sensitivity', () => {
    it('matches the g<sha> segment case-insensitively', () => {
      expect(formatBuildVersion('FOO-1-gABCDEF1', 'prod')).toBe('ABCDEF1')
    })
  })
})
