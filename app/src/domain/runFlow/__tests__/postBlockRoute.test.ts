import { describe, expect, it } from 'vitest'
import { postBlockRoute } from '../postBlockRoute'
import { routes } from '../../../routes'

describe('postBlockRoute', () => {
  it('routes to review with replace when the just-finished block was last', () => {
    const result = postBlockRoute('exec-1', true)
    expect(result.path).toBe(routes.review('exec-1'))
    expect(result.replace).toBe(true)
  })

  it('routes to drill check (push) when more blocks remain', () => {
    const result = postBlockRoute('exec-2', false)
    expect(result.path).toBe(routes.drillCheck('exec-2'))
    expect(result.replace).toBe(false)
  })

  it('encodes execution log ids defensively via routes()', () => {
    const result = postBlockRoute('exec id with spaces', false)
    expect(result.path).toContain('exec%20id%20with%20spaces')
  })

  it('returns the same descriptor for repeated calls (pure policy)', () => {
    const a = postBlockRoute('exec-3', true)
    const b = postBlockRoute('exec-3', true)
    expect(a).toEqual(b)
  })
})
