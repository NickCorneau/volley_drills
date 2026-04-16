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
