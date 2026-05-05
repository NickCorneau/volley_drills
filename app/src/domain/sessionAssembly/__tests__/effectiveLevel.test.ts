import { describe, expect, it } from 'vitest'
import { effectiveLevel } from '../effectiveLevel'

describe('effectiveLevel', () => {
  describe('SkillLevel → PlayerLevel mapping', () => {
    it("maps 'foundations' to 'beginner'", () => {
      expect(effectiveLevel('foundations')).toBe('beginner')
    })

    it("maps 'rally_builders' to 'intermediate'", () => {
      expect(effectiveLevel('rally_builders')).toBe('intermediate')
    })

    it("maps 'side_out_builders' to 'intermediate'", () => {
      expect(effectiveLevel('side_out_builders')).toBe('intermediate')
    })

    it("maps 'competitive_pair' to 'advanced'", () => {
      expect(effectiveLevel('competitive_pair')).toBe('advanced')
    })

    it("maps 'unsure' to 'beginner' (KD8 — held post-engine-wiring)", () => {
      expect(effectiveLevel('unsure')).toBe('beginner')
    })
  })

  describe('defensive fallthrough to beginner', () => {
    it("returns 'beginner' for undefined", () => {
      expect(effectiveLevel(undefined)).toBe('beginner')
    })

    it("returns 'beginner' for null", () => {
      expect(effectiveLevel(null)).toBe('beginner')
    })

    it("returns 'beginner' for unknown string", () => {
      expect(effectiveLevel('expert')).toBe('beginner')
    })

    it("returns 'beginner' for non-string input", () => {
      expect(effectiveLevel(42)).toBe('beginner')
      expect(effectiveLevel({})).toBe('beginner')
      expect(effectiveLevel([])).toBe('beginner')
    })

    it("returns 'beginner' for empty string", () => {
      expect(effectiveLevel('')).toBe('beginner')
    })
  })
})
