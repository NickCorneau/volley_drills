import { RuleTester } from 'eslint'
import rule from '../no-inline-primitive-drift.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
})

ruleTester.run('no-inline-primitive-drift', rule, {
  valid: [
    {
      filename: '/repo/app/src/components/ui/ChoiceRow.tsx',
      code: `function ChoiceRow() { return <div role="radiogroup">x</div>; }`,
    },
    {
      filename: '/repo/app/src/components/ui/__tests__/ChoiceRow.test.tsx',
      code: `function Fixture() { return <div role="radiogroup">x</div>; }`,
    },
    {
      filename: '/repo/app/src/components/Anything.tsx',
      code: `function X() { return <div role="dialog">x</div>; }`,
    },
    {
      filename: '/repo/app/src/screens/Home.tsx',
      code: `function Home() { return <div className="x">y</div>; }`,
    },
    {
      filename: '/repo/app/src/components/ui/GlossedText.tsx',
      code: `function GlossedText() { return <button className="border-b border-dotted border-text-secondary/60 pb-[2px]">term</button>; }`,
    },
    {
      filename: '/repo/app/src/components/ui/__tests__/GlossedText.test.tsx',
      code: `function Fixture() { return <button className="border-b border-dotted border-text-secondary/60 pb-[2px]">term</button>; }`,
    },
    {
      // Other dotted-border variants stay valid (false-positive guard).
      filename: '/repo/app/src/screens/Other.tsx',
      code: `function Other() { return <div className="border-dotted border-text-secondary/40">x</div>; }`,
    },
  ],
  invalid: [
    {
      filename: '/repo/app/src/screens/SetupScreen.tsx',
      code: `function Setup() { return <div role="radiogroup">chips</div>; }`,
      errors: [{ messageId: 'forbiddenRadiogroup' }],
    },
    {
      filename: '/repo/app/src/components/Custom.tsx',
      code: `function Custom() { return <div role="radiogroup">x</div>; }`,
      errors: [{ messageId: 'forbiddenRadiogroup' }],
    },
    {
      filename: '/repo/app/src/components/SomeModal.tsx',
      code: `function M() { return <button data-action-overlay-initial-focus="true">go</button>; }`,
      errors: [{ messageId: 'forbiddenFocusAttr' }],
    },
    {
      filename: '/repo/app/src/components/ui/__tests__/ActionOverlay.test.tsx',
      code: `function F() { return <button data-action-overlay-initial-focus="true">go</button>; }`,
      errors: [{ messageId: 'forbiddenFocusAttr' }],
    },
    {
      // Hand-rolled dotted-underline term outside GlossedText.tsx fails.
      filename: '/repo/app/src/screens/SomeScreen.tsx',
      code: `function S() { return <button className="border-b border-dotted border-text-secondary/60 pb-[2px]">term</button>; }`,
      errors: [{ messageId: 'forbiddenInlineGlossedTerm' }],
    },
    {
      filename: '/repo/app/src/components/Custom.tsx',
      code: `function C() { return <span className="text-base border-dotted border-text-secondary/60">x</span>; }`,
      errors: [{ messageId: 'forbiddenInlineGlossedTerm' }],
    },
  ],
})

console.log('no-inline-primitive-drift: all rule cases passed.')
