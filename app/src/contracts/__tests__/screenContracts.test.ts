import { describe, expect, it } from 'vitest'
import { SCREEN_CONTRACTS, type RouteKey } from '../screenContracts'
import { routePaths } from '../../routes'

describe('screen contracts (P12)', () => {
  it('declares a contract for every route path', () => {
    const routeKeys = Object.keys(routePaths) as RouteKey[]
    const contractKeys = Object.keys(SCREEN_CONTRACTS).sort()
    expect(contractKeys).toEqual([...routeKeys].sort())
  })

  it('points each contract at the matching route path', () => {
    for (const key of Object.keys(SCREEN_CONTRACTS) as RouteKey[]) {
      expect(SCREEN_CONTRACTS[key].route).toBe(routePaths[key])
    }
  })

  it('keeps every non-exempt contract triple readable and non-empty', () => {
    for (const contract of Object.values(SCREEN_CONTRACTS)) {
      if (contract.exemption) continue
      expect(contract.action.trim().length).toBeGreaterThan(8)
      expect(contract.signal.trim().length).toBeGreaterThan(8)
      expect(contract.reason.trim().length).toBeGreaterThan(8)
    }
  })

  it('requires a written rationale for any exemption', () => {
    for (const contract of Object.values(SCREEN_CONTRACTS)) {
      if (!contract.exemption) continue
      expect(contract.exemption.rationale.trim().length).toBeGreaterThan(16)
    }
  })

  it('keeps exemptions rare (P12 is the default, not the escape hatch)', () => {
    const exempt = Object.values(SCREEN_CONTRACTS).filter((c) => c.exemption !== undefined)
    expect(exempt.length).toBeLessThanOrEqual(2)
  })
})
