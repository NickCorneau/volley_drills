import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useGloss } from '../useGloss'

/**
 * Hook-level unit coverage for `useGloss`. The parser contract is
 * proven at the domain tier (`domain/__tests__/glossedText.test.ts`);
 * this file pins the state-machine + derived-definition contract that
 * the inline atoms and `<GlossedText>` rely on.
 */

describe('useGloss', () => {
  it('returns parsed parts and a null initial open term', () => {
    const { result } = renderHook(() =>
      useGloss('Passes graded 2+ (= ball lands within 1 m of the set window).'),
    )

    expect(result.current.parts).toEqual([
      { type: 'text', text: 'Passes ' },
      {
        type: 'gloss',
        term: 'graded 2+',
        definition: 'ball lands within 1 m of the set window',
      },
      { type: 'text', text: '.' },
    ])
    expect(result.current.openTerm).toBeNull()
    expect(result.current.openDefinition).toBeNull()
    expect(result.current.isOpen('graded 2+')).toBe(false)
  })

  it('toggle(term) opens the term and resolves its definition', () => {
    const { result } = renderHook(() =>
      useGloss('Passes graded 2+ (= settable arc).'),
    )

    act(() => {
      result.current.toggle('graded 2+')
    })

    expect(result.current.openTerm).toBe('graded 2+')
    expect(result.current.openDefinition).toBe('settable arc')
    expect(result.current.isOpen('graded 2+')).toBe(true)
  })

  it('toggle on the open term collapses it back to null', () => {
    const { result } = renderHook(() =>
      useGloss('Passes graded 2+ (= settable arc).'),
    )

    act(() => {
      result.current.toggle('graded 2+')
    })
    act(() => {
      result.current.toggle('graded 2+')
    })

    expect(result.current.openTerm).toBeNull()
    expect(result.current.openDefinition).toBeNull()
    expect(result.current.isOpen('graded 2+')).toBe(false)
  })

  it('toggle on a different term swaps the open scope (single-open contract)', () => {
    const { result } = renderHook(() =>
      useGloss('Continuous: ankle hops (= small two-foot hops) then lateral shuffles (= sideways shuffle steps).'),
    )

    act(() => {
      result.current.toggle('ankle hops')
    })
    expect(result.current.openTerm).toBe('ankle hops')
    expect(result.current.openDefinition).toBe('small two-foot hops')

    act(() => {
      result.current.toggle('lateral shuffles')
    })
    expect(result.current.openTerm).toBe('lateral shuffles')
    expect(result.current.openDefinition).toBe('sideways shuffle steps')
    expect(result.current.isOpen('ankle hops')).toBe(false)
    expect(result.current.isOpen('lateral shuffles')).toBe(true)
  })

  it('returns parts=[] and null open scope on empty input', () => {
    const { result } = renderHook(() => useGloss(''))

    expect(result.current.parts).toEqual([])
    expect(result.current.openTerm).toBeNull()
    expect(result.current.openDefinition).toBeNull()
  })

  it('toggle on a term not in the parsed parts sets openTerm but openDefinition stays null (defensive)', () => {
    const { result } = renderHook(() =>
      useGloss('Plain prose with no glosses.'),
    )

    act(() => {
      result.current.toggle('graded 2+')
    })

    expect(result.current.openTerm).toBe('graded 2+')
    expect(result.current.openDefinition).toBeNull()
  })
})
