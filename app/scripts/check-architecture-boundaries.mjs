// @ts-check

import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import ts from 'typescript'

const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultRoot = resolve(__dirname, '..')

const sourceExtensions = new Set(['.ts', '.tsx'])
const ignoredDirectoryNames = new Set(['__tests__', 'test-utils'])
const ignoredFileFragments = ['.test.', '.spec.']
const hardLevels = new Set(['error'])

const platformOwnedRuntimeFiles = new Set(['lib/audio.ts', 'lib/screenWakeLock.ts'])

const rules = {
  domainForbiddenImport: {
    level: 'error',
    message: 'Domain modules must not import db, services, platform, or React.',
  },
  modelForbiddenImport: {
    level: 'error',
    message: 'Model modules must not import db, services, platform, React, or Dexie.',
  },
  platformForbiddenImport: {
    level: 'error',
    message: 'Platform modules must not import product layers.',
  },
  dataForbiddenImport: {
    level: 'error',
    message: 'Data modules must not import React, Dexie, or services.',
  },
  pureLayerTsx: {
    level: 'error',
    message: 'Pure data/model/domain/platform modules should not be TSX files.',
  },
  screenComponentDbImport: {
    level: 'error',
    message: 'Screens and components should import product types from model, not db.',
  },
  screenComponentServiceImport: {
    level: 'advisory',
    message: 'Screen/component service imports are report-only until controller debt is triaged.',
  },
  browserRuntimeDirect: {
    level: 'error',
    message: 'Vibration and wake-lock runtime calls should stay behind platform.',
  },
}

function toPosix(path) {
  return path.split(sep).join('/')
}

function isUnder(path, prefix) {
  return path === prefix || path.startsWith(`${prefix}/`)
}

function isControllerFile(path) {
  return /^screens\/[^/]+\/use[A-Z][^/]*Controller\.ts$/.test(path)
}

function isAllowedBoundaryEdge(filePath, importInfo) {
  return filePath === 'platform/index.ts' && importTargets(importInfo, 'hooks/useWakeLock')
}

function shouldScanFile(path) {
  const normalized = toPosix(path)
  return (
    sourceExtensions.has(extname(path)) &&
    !normalized.split('/').some((part) => ignoredDirectoryNames.has(part)) &&
    !ignoredFileFragments.some((fragment) => normalized.includes(fragment))
  )
}

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries.toSorted((a, b) => a.name.localeCompare(b.name))) {
    const entryPath = join(directory, entry.name)
    if (entry.isDirectory()) {
      if (!ignoredDirectoryNames.has(entry.name)) {
        files.push(...(await collectSourceFiles(entryPath)))
      }
      continue
    }

    if (entry.isFile() && shouldScanFile(entryPath)) {
      files.push(entryPath)
    }
  }

  return files
}

function resolveImport(sourceFile, specifier, sourceRoot) {
  if (specifier.startsWith('@/')) {
    return normalizeSourceImport(resolve(sourceRoot, specifier.slice(2)), sourceRoot)
  }

  if (specifier.startsWith('.')) {
    return normalizeSourceImport(resolve(dirname(sourceFile), specifier), sourceRoot)
  }

  return { kind: 'package', value: specifier }
}

function normalizeSourceImport(candidatePath, sourceRoot) {
  const relativePath = toPosix(relative(sourceRoot, candidatePath))
  if (!relativePath.startsWith('..')) {
    return { kind: 'source', value: relativePath }
  }

  return { kind: 'unknown', value: relativePath }
}

function parseModuleSpecifiers(content) {
  const specifiers = []
  const sourceFile = ts.createSourceFile(
    'boundary-check.tsx',
    content,
    ts.ScriptTarget.Latest,
    true,
  )

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      specifiers.push({ specifier: statement.moduleSpecifier.text, syntax: 'import' })
    }

    if (
      ts.isExportDeclaration(statement) &&
      statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      specifiers.push({ specifier: statement.moduleSpecifier.text, syntax: 'export' })
    }
  }

  return specifiers
}

function stripCommentsAndStrings(content) {
  return content.replace(
    /\/\*[\s\S]*?\*\/|\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g,
    '',
  )
}

function addFinding(findings, ruleId, filePath, evidence) {
  findings.push({
    ruleId,
    level: rules[ruleId].level,
    filePath,
    evidence,
    message: rules[ruleId].message,
  })
}

function importTargets(importInfo, prefix) {
  return importInfo.kind === 'source' && isUnder(importInfo.value, prefix)
}

function packageIs(importInfo, ...packages) {
  return importInfo.kind === 'package' && packages.includes(importInfo.value)
}

function analyzeFile({ absolutePath, sourceRoot }) {
  const filePath = toPosix(relative(sourceRoot, absolutePath))
  const content = readFileSync(absolutePath, 'utf8')
  const findings = []

  for (const { specifier, syntax } of parseModuleSpecifiers(content)) {
    const importInfo = resolveImport(absolutePath, specifier, sourceRoot)
    const evidence = `${syntax} "${specifier}"`

    if (
      isUnder(filePath, 'domain') &&
      (importTargets(importInfo, 'db') ||
        importTargets(importInfo, 'services') ||
        importTargets(importInfo, 'platform') ||
        packageIs(importInfo, 'react'))
    ) {
      addFinding(findings, 'domainForbiddenImport', filePath, evidence)
    }

    if (
      isUnder(filePath, 'model') &&
      (importTargets(importInfo, 'db') ||
        importTargets(importInfo, 'services') ||
        importTargets(importInfo, 'platform') ||
        packageIs(importInfo, 'react', 'dexie'))
    ) {
      addFinding(findings, 'modelForbiddenImport', filePath, evidence)
    }

    if (
      isUnder(filePath, 'platform') &&
      !isAllowedBoundaryEdge(filePath, importInfo) &&
      (importTargets(importInfo, 'domain') ||
        importTargets(importInfo, 'db') ||
        importTargets(importInfo, 'data') ||
        importTargets(importInfo, 'hooks') ||
        importTargets(importInfo, 'services') ||
        importTargets(importInfo, 'model'))
    ) {
      addFinding(findings, 'platformForbiddenImport', filePath, evidence)
    }

    if (
      isUnder(filePath, 'data') &&
      (importTargets(importInfo, 'services') || packageIs(importInfo, 'react', 'dexie'))
    ) {
      addFinding(findings, 'dataForbiddenImport', filePath, evidence)
    }

    if (
      (isUnder(filePath, 'screens') || isUnder(filePath, 'components')) &&
      importTargets(importInfo, 'db')
    ) {
      addFinding(findings, 'screenComponentDbImport', filePath, evidence)
    }

    if (
      (isUnder(filePath, 'screens') || isUnder(filePath, 'components')) &&
      !isControllerFile(filePath) &&
      importTargets(importInfo, 'services')
    ) {
      addFinding(findings, 'screenComponentServiceImport', filePath, evidence)
    }
  }

  if (
    extname(filePath) === '.tsx' &&
    (isUnder(filePath, 'data') ||
      isUnder(filePath, 'model') ||
      isUnder(filePath, 'domain') ||
      isUnder(filePath, 'platform'))
  ) {
    addFinding(findings, 'pureLayerTsx', filePath, 'file extension ".tsx"')
  }

  const executableContent = stripCommentsAndStrings(content)
  if (
    /navigator\.(?:vibrate|wakeLock)\b/.test(executableContent) &&
    !isUnder(filePath, 'platform') &&
    !platformOwnedRuntimeFiles.has(filePath)
  ) {
    addFinding(findings, 'browserRuntimeDirect', filePath, 'navigator.vibrate/navigator.wakeLock')
  }

  return findings
}

async function analyzeProject(root = defaultRoot) {
  const sourceRoot = resolve(root, 'src')
  const files = await collectSourceFiles(sourceRoot)
  return files.flatMap((absolutePath) => analyzeFile({ absolutePath, sourceRoot }))
}

function formatReport(findings) {
  if (findings.length === 0) {
    return 'Architecture boundary report: no findings.'
  }

  const lines = ['Architecture boundary report:']
  const sortedFindings = sortFindings(findings)
  const grouped = new Map()

  for (const finding of sortedFindings) {
    const key = `${finding.level}:${finding.ruleId}`
    grouped.set(key, [...(grouped.get(key) ?? []), finding])
  }

  for (const [groupKey, groupFindings] of grouped.entries()) {
    const [level, ruleId] = groupKey.split(':')
    lines.push('', `${level.toUpperCase()} ${ruleId} (${groupFindings.length})`)
    lines.push(`  ${rules[ruleId].message}`)
    for (const finding of groupFindings) {
      lines.push(`  - ${finding.filePath}: ${finding.evidence}`)
    }
  }

  return lines.join('\n')
}

function sortFindings(findings) {
  return [...findings].sort((a, b) =>
    [a.level, a.ruleId, a.filePath, a.evidence]
      .join('\0')
      .localeCompare([b.level, b.ruleId, b.filePath, b.evidence].join('\0')),
  )
}

function formatJsonReport({ findings, root, strict }) {
  const sortedFindings = sortFindings(findings)
  return JSON.stringify(
    {
      root,
      strict,
      hardFindingCount: sortedFindings.filter((finding) => hardLevels.has(finding.level)).length,
      advisoryFindingCount: sortedFindings.filter((finding) => finding.level === 'advisory').length,
      findings: sortedFindings,
    },
    null,
    2,
  )
}

function hasHardFindings(findings) {
  return findings.some((finding) => hardLevels.has(finding.level))
}

function usage() {
  return `Usage: node scripts/check-architecture-boundaries.mjs [options]

Options:
  --root <path>        App workspace root containing src/ (default: current app)
  --strict            Exit 1 when hard boundary findings exist
  --format text|json  Output format (default: text)
  --self-test         Run built-in checker self-test
  -h, --help          Show this help

Examples:
  npm run architecture:check
  npm run architecture:check -- --strict
  npm run architecture:check -- --format json
  node scripts/check-architecture-boundaries.mjs --root ../app --strict

Exit codes:
  0  Report completed, or self-test passed
  1  --strict found hard boundary findings, or self-test failed
  2  CLI usage/input error`
}

function parseArgs(argv) {
  const options = {
    root: defaultRoot,
    strict: false,
    selfTest: false,
    format: 'text',
    help: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    switch (arg) {
      case '--root': {
        const value = argv[index + 1]
        if (!value || value.startsWith('--')) {
          throw new Error('Missing value for --root. Example: --root ./app')
        }
        options.root = resolve(value)
        index += 1
        break
      }
      case '--strict':
        options.strict = true
        break
      case '--self-test':
        options.selfTest = true
        break
      case '--format': {
        const value = argv[index + 1]
        if (value !== 'text' && value !== 'json') {
          throw new Error('Invalid --format value. Use --format text or --format json.')
        }
        options.format = value
        index += 1
        break
      }
      case '-h':
      case '--help':
        options.help = true
        break
      default:
        throw new Error(`Unknown option: ${arg}`)
    }
  }

  return options
}

function validateRoot(root) {
  if (!existsSync(root)) {
    throw new Error(`Root does not exist: ${root}`)
  }

  const sourceRoot = resolve(root, 'src')
  if (!existsSync(sourceRoot)) {
    throw new Error(`Root must contain a src/ directory: ${root}`)
  }
}

async function runSelfTest() {
  const root = mkdtempSync(join(tmpdir(), 'volley-architecture-boundaries-'))

  try {
    mkdirSync(join(root, 'src/domain'), { recursive: true })
    mkdirSync(join(root, 'src/model'), { recursive: true })
    mkdirSync(join(root, 'src/components'), { recursive: true })
    mkdirSync(join(root, 'src/components/__tests__'), { recursive: true })
    mkdirSync(join(root, 'src/data'), { recursive: true })
    mkdirSync(join(root, 'src/lib'), { recursive: true })
    mkdirSync(join(root, 'src/screens'), { recursive: true })
    mkdirSync(join(root, 'src/screens/run'), { recursive: true })
    mkdirSync(join(root, 'src/services'), { recursive: true })
    mkdirSync(join(root, 'src/platform'), { recursive: true })
    mkdirSync(join(root, 'src/db'), { recursive: true })
    mkdirSync(join(root, 'src/hooks'), { recursive: true })
    writeFileSync(join(root, 'src/model/index.ts'), 'export type ModelThing = { id: string }\n')
    writeFileSync(join(root, 'src/services/index.ts'), 'export const serviceThing = true\n')
    writeFileSync(join(root, 'src/db/index.ts'), 'export type DbThing = { id: string }\n')
    writeFileSync(join(root, 'src/domain/good.ts'), "import type { ModelThing } from '../model'\n")
    writeFileSync(join(root, 'src/domain/bad.ts'), "import { serviceThing } from '../services'\n")
    writeFileSync(
      join(root, 'src/domain/badBarrel.ts'),
      "export { serviceThing } from '../services'\n",
    )
    writeFileSync(join(root, 'src/model/badView.tsx'), 'export const BadView = <div />\n')
    writeFileSync(join(root, 'src/data/bad.ts'), "import React from 'react'\n")
    writeFileSync(join(root, 'src/platform/badDb.ts'), "import type { DbThing } from '../db'\n")
    writeFileSync(
      join(root, 'src/platform/badHook.ts'),
      "import { useWakeLock } from '../hooks/useWakeLock'\n",
    )
    writeFileSync(
      join(root, 'src/platform/index.ts'),
      "export { useWakeLock } from '../hooks/useWakeLock'\n",
    )
    writeFileSync(join(root, 'src/hooks/useWakeLock.ts'), 'export function useWakeLock() {}\n')
    writeFileSync(
      join(root, 'src/components/BadCard.tsx'),
      "import type { DbThing } from '../db'\n",
    )
    writeFileSync(
      join(root, 'src/screens/Advisory.tsx'),
      "import { serviceThing } from '../services'\n",
    )
    writeFileSync(
      join(root, 'src/screens/run/useRunController.ts'),
      "import { serviceThing } from '../../services'\n",
    )
    writeFileSync(
      join(root, 'src/components/RuntimeBad.tsx'),
      'export function RuntimeBad() { navigator.vibrate?.(10); return null }\n',
    )
    writeFileSync(
      join(root, 'src/components/StringOnly.tsx'),
      '// navigator.vibrate belongs in platform\nconst note = "navigator.wakeLock"\n',
    )
    writeFileSync(
      join(root, 'src/domain/CommentedImport.ts'),
      "/* import { serviceThing } from '../services' */\nconst note = \"import x from '../db'\"\n",
    )
    writeFileSync(join(root, 'src/lib/screenWakeLock.ts'), 'navigator.wakeLock?.request?.()\n')
    writeFileSync(join(root, 'src/platform/vibration.ts'), 'navigator.vibrate?.(10)\n')
    writeFileSync(
      join(root, 'src/components/__tests__/fixture.test.tsx'),
      "import { db } from '../../db'\n",
    )

    const findings = await analyzeProject(root)
    const hasFinding = (ruleId, filePath, level) =>
      findings.some(
        (finding) =>
          finding.ruleId === ruleId && finding.filePath === filePath && finding.level === level,
      )

    assert.equal(hasFinding('domainForbiddenImport', 'domain/bad.ts', 'error'), true)
    assert.equal(hasFinding('domainForbiddenImport', 'domain/badBarrel.ts', 'error'), true)
    assert.equal(hasFinding('pureLayerTsx', 'model/badView.tsx', 'error'), true)
    assert.equal(hasFinding('dataForbiddenImport', 'data/bad.ts', 'error'), true)
    assert.equal(hasFinding('platformForbiddenImport', 'platform/badDb.ts', 'error'), true)
    assert.equal(hasFinding('platformForbiddenImport', 'platform/badHook.ts', 'error'), true)
    assert.equal(
      findings.some((finding) => finding.filePath === 'platform/index.ts'),
      false,
    )
    assert.equal(hasFinding('screenComponentDbImport', 'components/BadCard.tsx', 'error'), true)
    assert.equal(
      hasFinding('screenComponentServiceImport', 'screens/Advisory.tsx', 'advisory'),
      true,
    )
    assert.equal(
      hasFinding('screenComponentServiceImport', 'screens/run/useRunController.ts', 'advisory'),
      false,
    )
    assert.equal(hasFinding('browserRuntimeDirect', 'components/RuntimeBad.tsx', 'error'), true)
    assert.equal(
      findings.some((finding) => finding.filePath === 'domain/good.ts'),
      false,
    )
    assert.equal(
      findings.some((finding) => finding.filePath.includes('__tests__')),
      false,
    )
    assert.equal(
      findings.some((finding) => finding.filePath === 'components/StringOnly.tsx'),
      false,
    )
    assert.equal(
      findings.some((finding) => finding.filePath === 'domain/CommentedImport.ts'),
      false,
    )
    assert.equal(
      findings.some((finding) => finding.filePath === 'lib/screenWakeLock.ts'),
      false,
    )
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

try {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    console.log(usage())
  } else if (options.selfTest) {
    await runSelfTest()
    console.log('Architecture boundary self-test passed.')
  } else {
    validateRoot(options.root)
    const findings = await analyzeProject(options.root)
    console.log(
      options.format === 'json'
        ? formatJsonReport({ findings, root: options.root, strict: options.strict })
        : formatReport(findings),
    )
    if (options.strict && hasHardFindings(findings)) {
      process.exitCode = 1
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  console.error('')
  console.error(usage())
  process.exitCode = 2
}
