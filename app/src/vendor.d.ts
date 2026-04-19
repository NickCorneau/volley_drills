// Ambient stubs for optional peer deps of dexie-react-hooks.
// These modules are only used by dexie-react-hooks' CRDT/Yjs integration
// which we don't use; the stubs prevent TS2307 when skipLibCheck is off.
declare module 'y-dexie' {
  const value: unknown
  export default value
  export type DexieYProvider = unknown
}

declare module 'yjs' {
  export class Doc {}
}

// Phase F9 (2026-04-19): Fontsource ships only CSS/woff2 with no
// TypeScript declarations. The side-effect import from `main.tsx`
// triggers TS2882 under this repo's strict `tsc -b` config unless the
// module has an ambient declaration. One empty declaration covers the
// default entry; the subset entries (`/wght`, `/standard`, etc.) are
// not imported from app code. See
// `docs/plans/2026-04-19-feat-phase-f9-inter-self-host-plan.md`.
declare module '@fontsource-variable/inter'

// Phase F10 (2026-04-19): same ambient-declaration workaround for the
// JetBrains Mono Variable display face used on BlockTimer + the
// RunScreen preroll countdown. See
// `docs/plans/2026-04-19-feat-phase-f10-timer-display-face-plan.md`.
declare module '@fontsource-variable/jetbrains-mono'
