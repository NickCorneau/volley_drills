// Posture-sensitive save copy for three local-storage durability states (D118).
// See docs/specs/m001-home-and-sync-notes.md "Three-state save copy (per D118)"
// and docs/research/local-first-pwa-constraints.md for the evidence base
// (research cites Safari/WebKit; user-facing strings stay browser-neutral).
//
// State A: browser tab, not installed — data can be evicted under inactivity,
//          quota pressure, or manual clear (details vary by browser/OS).
// State B: installed PWA, persisted() === false — local install, still best-effort
//          under storage reclaim or app-data clear.
// State C: installed PWA, persisted() === true — strongest durability the
//          browser exposes for this origin. Still not a backup.
//
// Installed states intentionally share the same primary line; only the
// secondary line changes. The headline stays "Saved on this device" for State
// B and State C so the user is not asked to chase a heuristic persistence flag.

export type InstallPosture = 'browser-tab' | 'installed-not-persisted' | 'installed-persisted'

export interface StorageCopy {
  primary: string
  secondary: string
}

export const STORAGE_COPY: Record<InstallPosture, StorageCopy> = {
  'browser-tab': {
    primary: 'Saved in this browser on this device',
    secondary:
      'Works offline. Your browser may remove this site\'s data after long inactivity, under storage pressure, or if you clear browsing data.',
  },
  'installed-not-persisted': {
    primary: 'Saved on this device',
    secondary:
      'Stored locally in the installed app. Not backed up. Your device or browser may still remove local data when storage is reclaimed or if you clear app data.',
  },
  'installed-persisted': {
    primary: 'Saved on this device',
    secondary:
      'Uses the strongest local durability this browser exposes. Still not a backup - use export or sync to move between devices.',
  },
}

export function getStorageCopy(posture: InstallPosture): StorageCopy {
  return STORAGE_COPY[posture]
}
