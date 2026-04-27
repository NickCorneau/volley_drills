let sentinel: WakeLockSentinel | null = null
let wantsWakeLock = false
let requestInFlight: Promise<boolean> | null = null
let requestEpoch = 0

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function hasWakeLockApi(): boolean {
  return 'wakeLock' in navigator
}

function handleRelease() {
  sentinel?.removeEventListener('release', handleRelease)
  sentinel = null
  emit()
}

export function hasActiveScreenWakeLock(): boolean {
  return Boolean(sentinel && !sentinel.released)
}

export function shouldHoldScreenWakeLock(): boolean {
  return wantsWakeLock
}

export async function requestScreenWakeLock(): Promise<boolean> {
  wantsWakeLock = true

  if (!hasWakeLockApi()) {
    emit()
    return false
  }
  if (document.visibilityState !== 'visible') {
    emit()
    return false
  }
  if (hasActiveScreenWakeLock()) {
    emit()
    return true
  }
  if (requestInFlight) {
    return requestInFlight
  }

  const epoch = ++requestEpoch
  requestInFlight = (async () => {
    try {
      const nextSentinel = await navigator.wakeLock.request('screen')
      if (!wantsWakeLock || epoch !== requestEpoch) {
        await nextSentinel.release()
        return false
      }
      sentinel?.removeEventListener('release', handleRelease)
      sentinel = nextSentinel
      sentinel.addEventListener('release', handleRelease)
      emit()
      return true
    } catch {
      emit()
      return false
    } finally {
      requestInFlight = null
    }
  })()

  return requestInFlight
}

export function primeScreenWakeLockForGesture(): void {
  void requestScreenWakeLock()
}

export async function releaseScreenWakeLock(): Promise<void> {
  wantsWakeLock = false
  requestInFlight = null
  requestEpoch += 1
  const currentSentinel = sentinel
  sentinel = null
  currentSentinel?.removeEventListener('release', handleRelease)
  emit()

  try {
    await currentSentinel?.release()
  } catch {
    /* Already released */
  }
}

export function subscribeScreenWakeLock(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function __resetScreenWakeLockForTesting(): void {
  wantsWakeLock = false
  requestInFlight = null
  requestEpoch = 0
  sentinel?.removeEventListener('release', handleRelease)
  sentinel = null
  listeners.clear()
}
