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
  ],
})

console.log('no-inline-primitive-drift: all rule cases passed.')
