import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import {
  getStorageMeta,
  setStorageMeta,
  setStorageMetaMany,
} from '../storageMeta'

beforeEach(async () => {
  await db.storageMeta.clear()
})

const isString = (v: unknown): v is string => typeof v === 'string'
const isNumber = (v: unknown): v is number => typeof v === 'number'
const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean'

describe('setStorageMeta / getStorageMeta round-trip', () => {
  it('persists and reads back a string value', async () => {
    await setStorageMeta('example.string', 'hello')
    const value = await getStorageMeta('example.string', isString)
    expect(value).toBe('hello')
  })

  it('persists and reads back a number value', async () => {
    await setStorageMeta('example.number', 1_700_000_000)
    const value = await getStorageMeta('example.number', isNumber)
    expect(value).toBe(1_700_000_000)
  })

  it('persists and reads back a boolean value', async () => {
    await setStorageMeta('example.bool', true)
    const value = await getStorageMeta('example.bool', isBoolean)
    expect(value).toBe(true)
  })

  it('returns undefined for an absent key', async () => {
    const value = await getStorageMeta('missing.key', isString)
    expect(value).toBeUndefined()
  })

  it('returns undefined when the type guard rejects the stored value', async () => {
    await setStorageMeta('example.number', 42)
    const value = await getStorageMeta('example.number', isString)
    expect(value).toBeUndefined()
  })

  it('updates updatedAt on each write', async () => {
    await setStorageMeta('example.string', 'first')
    const first = await db.storageMeta.get('example.string')
    expect(first?.updatedAt).toBeTypeOf('number')

    // Advance wall clock by at least 1 ms.
    await new Promise((r) => setTimeout(r, 2))
    await setStorageMeta('example.string', 'second')
    const second = await db.storageMeta.get('example.string')

    expect(second?.value).toBe('second')
    expect(second?.updatedAt).toBeGreaterThan(first!.updatedAt)
  })
})

describe('setStorageMetaMany', () => {
  it('writes multiple keys in one call', async () => {
    await setStorageMetaMany({
      'example.a': 1,
      'example.b': 2,
      'example.c': 'three',
    })

    const a = await getStorageMeta('example.a', isNumber)
    const b = await getStorageMeta('example.b', isNumber)
    const c = await getStorageMeta('example.c', isString)

    expect(a).toBe(1)
    expect(b).toBe(2)
    expect(c).toBe('three')
  })

  it('resolves with no writes when the entries object is empty', async () => {
    await expect(setStorageMetaMany({})).resolves.toBeUndefined()

    const count = await db.storageMeta.count()
    expect(count).toBe(0)
  })

  it('overwrites existing keys', async () => {
    await setStorageMeta('example.a', 'old')
    await setStorageMetaMany({
      'example.a': 'new',
      'example.b': 'fresh',
    })

    const a = await getStorageMeta('example.a', isString)
    const b = await getStorageMeta('example.b', isString)
    expect(a).toBe('new')
    expect(b).toBe('fresh')
  })
})
