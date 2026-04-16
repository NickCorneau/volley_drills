import { describe, expect, it, vi } from 'vitest'
import { emitSchemaBlocked, subscribeSchemaBlocked } from './schema-blocked'

describe('schema-blocked event bus', () => {
  it('fires subscribers on emit', () => {
    const fn = vi.fn()
    const unsub = subscribeSchemaBlocked(fn)
    emitSchemaBlocked()
    expect(fn).toHaveBeenCalledTimes(1)
    unsub()
  })

  it('unsubscribe stops firing', () => {
    const fn = vi.fn()
    const unsub = subscribeSchemaBlocked(fn)
    unsub()
    emitSchemaBlocked()
    expect(fn).not.toHaveBeenCalled()
  })

  it('multiple subscribers each fire independently', () => {
    const a = vi.fn()
    const b = vi.fn()
    const ua = subscribeSchemaBlocked(a)
    const ub = subscribeSchemaBlocked(b)
    emitSchemaBlocked()
    expect(a).toHaveBeenCalledTimes(1)
    expect(b).toHaveBeenCalledTimes(1)
    ua()
    ub()
  })
})
