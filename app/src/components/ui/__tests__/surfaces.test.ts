import { ELEVATED_PANEL_SURFACE, FOCAL_SURFACE_CLASS } from '../surfaces'

describe('surfaces', () => {
  it('FOCAL_SURFACE_CLASS encodes the canonical calm-pass focal card chrome', () => {
    expect(FOCAL_SURFACE_CLASS).toBe(
      'rounded-[16px] bg-bg-primary border border-text-primary/10 shadow-sm',
    )
  })

  it('ELEVATED_PANEL_SURFACE encodes the canonical modal / bottom-sheet panel chrome', () => {
    expect(ELEVATED_PANEL_SURFACE).toBe(
      'bg-bg-primary border border-text-primary/10 shadow-lg',
    )
  })

  it('FOCAL_SURFACE_CLASS does not include `ring-*` (banned per WebKit corner-wedge note)', () => {
    expect(FOCAL_SURFACE_CLASS).not.toMatch(/\bring(-|$)/)
  })

  it('ELEVATED_PANEL_SURFACE does not include `ring-*` (banned per WebKit corner-wedge note)', () => {
    expect(ELEVATED_PANEL_SURFACE).not.toMatch(/\bring(-|$)/)
  })

  it('both surfaces share the hairline border so focal/elevated read as one family', () => {
    expect(FOCAL_SURFACE_CLASS).toContain('border border-text-primary/10')
    expect(ELEVATED_PANEL_SURFACE).toContain('border border-text-primary/10')
  })
})
