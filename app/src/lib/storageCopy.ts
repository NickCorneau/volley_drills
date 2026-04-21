// Posture-sensitive save copy for the three iPhone durability states in D118.
// See docs/specs/m001-home-and-sync-notes.md "Three-state save copy (per D118)"
// and docs/research/local-first-pwa-constraints.md for the evidence base.
//
// State A: browser tab, not installed - seven-day-risky under Safari ITP.
// State B: installed Home Screen web app, persisted() === false - exempt from
//          the ITP timer but still best-effort under quota/pressure eviction.
// State C: installed Home Screen web app, persisted() === true - the strongest
//          local-only durability state WebKit publicly exposes. Still not a
//          backup.
//
// Installed states intentionally share the same primary line; only the
// secondary line changes. The headline stays "Saved on this device" for State
// B and State C so the user is not asked to chase a heuristic WebKit state.

export type InstallPosture =
  | 'browser-tab'
  | 'installed-not-persisted'
  | 'installed-persisted'

export interface StorageCopy {
  primary: string
  secondary: string
}

export const STORAGE_COPY: Record<InstallPosture, StorageCopy> = {
  'browser-tab': {
    primary: 'Saved in this browser on this device',
    secondary:
      'Available offline here, but iPhone Safari may remove browser data if the site is not used for a while or if browser data is cleared.',
  },
  'installed-not-persisted': {
    primary: 'Saved on this device',
    secondary:
      'Stored locally in the installed app. Not backed up unless you enable sync or export. iOS can still remove local data if site/app data is cleared, device storage is reclaimed, or a browser bug occurs.',
  },
  'installed-persisted': {
    primary: 'Saved on this device',
    secondary:
      'Stored locally with the strongest storage durability this browser currently exposes. Still not a backup. Use sync or export for recovery and moving to another device.',
  },
}

export function getStorageCopy(posture: InstallPosture): StorageCopy {
  return STORAGE_COPY[posture]
}
