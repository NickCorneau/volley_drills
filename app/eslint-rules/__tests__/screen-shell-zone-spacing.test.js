import { RuleTester } from 'eslint'
import rule from '../screen-shell-zone-spacing.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
})

ruleTester.run('screen-shell-zone-spacing', rule, {
  valid: [
    {
      // Rhythm prop is the canonical channel for zone spacing.
      filename: '/repo/app/src/screens/RunScreen.tsx',
      code: `function Run() { return <ScreenShell.Body rhythm="cockpit">x</ScreenShell.Body>; }`,
    },
    {
      // Non-spacing layout classes on zones stay valid.
      filename: '/repo/app/src/screens/CompleteScreen.tsx',
      code: `function C() { return <ScreenShell.Body rhythm="celebration" className="items-center">x</ScreenShell.Body>; }`,
    },
    {
      // Typography on a footer stays valid.
      filename: '/repo/app/src/screens/HomeScreen.tsx',
      code: `function H() { return <ScreenShell.Footer rhythm="caption" className="text-xs text-text-secondary">x</ScreenShell.Footer>; }`,
    },
    {
      // gap-* on a Header arranges header content (brand row, title +
      // subtitle stack) — allowed; the zone's pt/pb still comes from rhythm.
      filename: '/repo/app/src/screens/ReviewScreen.tsx',
      code: `function R() { return <ScreenShell.Header className="flex flex-col items-center gap-1">x</ScreenShell.Header>; }`,
    },
    {
      // cx(...) call with non-spacing strings stays valid (pattern usage).
      filename: '/repo/app/src/components/patterns/RunFlowHeader.tsx',
      code: `function F({ className }) { return <ScreenShell.Header className={cx('grid grid-cols-3 items-center', className)}>x</ScreenShell.Header>; }`,
    },
    {
      // Spacing classes on non-zone elements are out of scope.
      filename: '/repo/app/src/screens/AnyScreen.tsx',
      code: `function A() { return <div className="pt-2 pb-3 gap-4">x</div>; }`,
    },
    {
      // Test fixtures may use the pattern (RuleTester / RTL fixtures).
      filename: '/repo/app/src/components/ui/__tests__/ScreenShell.test.tsx',
      code: `function Fixture() { return <ScreenShell.Footer className="pt-3">x</ScreenShell.Footer>; }`,
    },
    {
      // Negative-margin utilities on non-zone elements stay valid.
      filename: '/repo/app/src/screens/AnyScreen.tsx',
      code: `function A() { return <button className="-mt-2">x</button>; }`,
    },
  ],
  invalid: [
    {
      // The original drift class: hand-tuned footer top padding.
      filename: '/repo/app/src/screens/SetupScreen.tsx',
      code: `function S() { return <ScreenShell.Footer className="flex flex-col gap-2 pt-3">x</ScreenShell.Footer>; }`,
      errors: [{ messageId: 'zoneSpacing' }],
    },
    {
      // Stray horizontal inset (the Run px-1 case).
      filename: '/repo/app/src/screens/RunScreen.tsx',
      code: `function R() { return <ScreenShell.Footer className="px-1">x</ScreenShell.Footer>; }`,
      errors: [{ messageId: 'zoneSpacing' }],
    },
    {
      // Body gap drift.
      filename: '/repo/app/src/screens/SomeScreen.tsx',
      code: `function S() { return <ScreenShell.Body className="gap-5">x</ScreenShell.Body>; }`,
      errors: [{ messageId: 'zoneSpacing' }],
    },
    {
      // Body end-padding drift (the DrillCheck pt-2 case).
      filename: '/repo/app/src/screens/DrillCheckScreen.tsx',
      code: `function D() { return <ScreenShell.Body className="pt-2">x</ScreenShell.Body>; }`,
      errors: [{ messageId: 'zoneSpacing' }],
    },
    {
      // Header vertical padding bypassing HEADER_RHYTHM.
      filename: '/repo/app/src/screens/SomeScreen.tsx',
      code: `function S() { return <ScreenShell.Header className="pt-8 pb-4">x</ScreenShell.Header>; }`,
      errors: [{ messageId: 'zoneSpacing' }],
    },
    {
      // Spacing smuggled through a cx(...) string argument.
      filename: '/repo/app/src/components/patterns/ScreenHeader.tsx',
      code: `function F({ className }) { return <ScreenShell.Header className={cx('flex items-center pt-2 pb-3', className)}>x</ScreenShell.Header>; }`,
      errors: [{ messageId: 'zoneSpacing' }],
    },
    {
      // Arbitrary-value spacing is still spacing.
      filename: '/repo/app/src/screens/SomeScreen.tsx',
      code: `function S() { return <ScreenShell.Footer className="pb-[max(1rem,env(safe-area-inset-bottom))]">x</ScreenShell.Footer>; }`,
      errors: [{ messageId: 'zoneSpacing' }],
    },
  ],
})

console.log('screen-shell-zone-spacing: all rule cases passed.')
