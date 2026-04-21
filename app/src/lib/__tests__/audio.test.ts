import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  __resetAudioContextForTesting,
  playBlockEndBeep,
  playPrerollTick,
} from '../audio'

/**
 * Phase F Unit 3 (2026-04-19): foreground audio cues.
 *
 * The helper MUST be safe to call in every failure mode:
 * - SSR / environments without `AudioContext`: no-op
 * - Autoplay-blocked (context stuck in 'suspended'): resumes
 * - Construction throws: no-op, error logged once
 * - Oscillator throws: no-op, error logged once
 *
 * `playBlockEndBeep` and `playPrerollTick` must never throw - the
 * calling RunScreen block-complete path should proceed even if audio
 * fails.
 *
 * Global stubbing uses `vi.stubGlobal` rather than direct window
 * property assignment because jsdom defines properties non-
 * configurably in some environments; stubGlobal routes through the
 * Vitest lifecycle and guarantees the mock wins.
 */

interface FakeParam {
  setValueAtTime: ReturnType<typeof vi.fn>
  linearRampToValueAtTime: ReturnType<typeof vi.fn>
}
interface FakeGain {
  gain: FakeParam
  connect: ReturnType<typeof vi.fn>
}
interface FakeOscillator {
  type: OscillatorType
  frequency: FakeParam
  connect: ReturnType<typeof vi.fn>
  start: ReturnType<typeof vi.fn>
  stop: ReturnType<typeof vi.fn>
}
interface FakeContext {
  state: AudioContextState
  currentTime: number
  destination: object
  resume: ReturnType<typeof vi.fn>
  close: ReturnType<typeof vi.fn>
  createOscillator: ReturnType<typeof vi.fn>
  createGain: ReturnType<typeof vi.fn>
}

function makeFakeContext(overrides: Partial<FakeContext> = {}): FakeContext {
  const param = (): FakeParam => ({
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
  })
  const ctx: FakeContext = {
    state: 'running',
    currentTime: 0,
    destination: {},
    resume: vi.fn(() => Promise.resolve()),
    close: vi.fn(),
    createOscillator: vi.fn(() => {
      const osc: FakeOscillator = {
        type: 'sine',
        frequency: param(),
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }
      return osc
    }),
    createGain: vi.fn(() => {
      const gain: FakeGain = {
        gain: param(),
        connect: vi.fn(),
      }
      return gain
    }),
    ...overrides,
  }
  return ctx
}

/**
 * Build a `vi.fn` mock that is also callable with `new`. Arrow
 * functions aren't constructors; the module under test does `new
 * Ctor()`, so the mock must accept both call styles.
 */
function makeCtorMock(factory: () => FakeContext): ReturnType<typeof vi.fn> {
  // `function() {}` expression preserves the `[[Construct]]` internal
  // slot that `new` requires. `vi.fn` wraps it without stripping that.
  return vi.fn(function (this: unknown) {
    return factory()
  })
}

function stubAudioContextCtor(
  Ctor: ReturnType<typeof vi.fn> | undefined,
): void {
  vi.stubGlobal('AudioContext', Ctor)
  vi.stubGlobal('webkitAudioContext', undefined)
}

describe('lib/audio (Phase F Unit 3)', () => {
  beforeEach(() => {
    __resetAudioContextForTesting()
  })

  afterEach(() => {
    __resetAudioContextForTesting()
    vi.unstubAllGlobals()
  })

  it('playBlockEndBeep: safe to call when AudioContext is absent (SSR / older browsers)', () => {
    vi.stubGlobal('AudioContext', undefined)
    vi.stubGlobal('webkitAudioContext', undefined)

    expect(() => playBlockEndBeep()).not.toThrow()
  })

  it('playBlockEndBeep: instantiates the shared AudioContext on first call and reuses it thereafter', () => {
    const fake = makeFakeContext()
    const Ctor = makeCtorMock(() => fake)
    stubAudioContextCtor(Ctor)

    playBlockEndBeep()
    playBlockEndBeep()
    playBlockEndBeep()

    // Constructor called exactly once; the same context handles all
    // three plays (oscillator created three times on that context).
    expect(Ctor).toHaveBeenCalledTimes(1)
    expect(fake.createOscillator).toHaveBeenCalledTimes(3)
    expect(fake.createGain).toHaveBeenCalledTimes(3)
  })

  it('playBlockEndBeep: schedules a 1000 Hz tone with a short envelope', () => {
    const fake = makeFakeContext()
    const Ctor = makeCtorMock(() => fake)
    stubAudioContextCtor(Ctor)

    playBlockEndBeep()

    const oscCalls = fake.createOscillator.mock.results
    expect(oscCalls).toHaveLength(1)
    const osc = oscCalls[0].value as FakeOscillator
    expect(osc.start).toHaveBeenCalledTimes(1)
    expect(osc.stop).toHaveBeenCalledTimes(1)
    expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(1000, 0)
  })

  it('playPrerollTick: schedules an 800 Hz tone (distinct from block-end)', () => {
    const fake = makeFakeContext()
    const Ctor = makeCtorMock(() => fake)
    stubAudioContextCtor(Ctor)

    playPrerollTick()

    const osc = fake.createOscillator.mock.results[0].value as FakeOscillator
    expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(800, 0)
  })

  it('playBlockEndBeep: resumes a suspended AudioContext (autoplay-unblocked on gesture)', () => {
    const fake = makeFakeContext({ state: 'suspended' })
    const Ctor = makeCtorMock(() => fake)
    stubAudioContextCtor(Ctor)

    playBlockEndBeep()

    expect(fake.resume).toHaveBeenCalledTimes(1)
  })

  it('playBlockEndBeep: never throws when oscillator scheduling fails', () => {
    const fake = makeFakeContext()
    fake.createOscillator = vi.fn(() => {
      throw new Error('simulated oscillator failure')
    })
    const Ctor = makeCtorMock(() => fake)
    stubAudioContextCtor(Ctor)

    expect(() => playBlockEndBeep()).not.toThrow()
  })

  it('playBlockEndBeep: never throws when AudioContext construction fails', () => {
    const Ctor = vi.fn(function (this: unknown) {
      throw new Error('simulated construction failure')
    })
    stubAudioContextCtor(Ctor)

    expect(() => playBlockEndBeep()).not.toThrow()
    expect(Ctor).toHaveBeenCalledTimes(1)
  })

  it('playPrerollTick: safe to fire in rapid succession (three preroll ticks)', () => {
    const fake = makeFakeContext()
    const Ctor = makeCtorMock(() => fake)
    stubAudioContextCtor(Ctor)

    playPrerollTick()
    playPrerollTick()
    playPrerollTick()

    expect(Ctor).toHaveBeenCalledTimes(1) // shared context
    expect(fake.createOscillator).toHaveBeenCalledTimes(3)
  })

  it('falls back to webkitAudioContext when standard AudioContext is absent', () => {
    const fake = makeFakeContext()
    const WebkitCtor = makeCtorMock(() => fake)
    vi.stubGlobal('AudioContext', undefined)
    vi.stubGlobal('webkitAudioContext', WebkitCtor)

    playBlockEndBeep()
    expect(WebkitCtor).toHaveBeenCalledTimes(1)
  })
})
