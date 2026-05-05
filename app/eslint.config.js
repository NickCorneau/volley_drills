import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import volleycraftRules from './eslint-rules/index.js'

// Plan U12 (2026-05-04): local Volleycraft ESLint plugin lives in
// `app/eslint-rules/`. Adds `volleycraft/no-inline-primitive-drift`
// which fails when patterns the consolidation just centralised get
// hand-rolled inline again. See the rule file for the list of checks.
export default defineConfig([
  globalIgnores(['dist', 'eslint-rules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      volleycraft: volleycraftRules,
    },
    rules: {
      'volleycraft/no-inline-primitive-drift': 'error',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.node,
    },
  },
])
