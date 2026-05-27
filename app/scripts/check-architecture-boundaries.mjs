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
  saveExecutionRunnerOnly: {
    level: 'advisory',
    message: '`saveExecution` should only be imported by hooks/useSessionRunner.ts.',
  },
  libNewTopLevelFile: {
    level: 'advisory',
    message: 'Net-new top-level files in app/src/lib/ should land in an existing layer; update the allowlist explicitly to override.',
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

function parseImportBindings(statement) {
  const bindings = []
  const clause = statement.importClause
  if (!clause) return bindings

  if (clause.name) {
    bindings.push({ kind: 'default', imported: 'default', local: clause.name.text })
  }

  if (clause.namedBindings) {
    if (ts.isNamespaceImport(clause.namedBindings)) {
      bindings.push({ kind: 'namespace', imported: '*', local: clause.namedBindings.name.text })
    }

    if (ts.isNamedImports(clause.namedBindings)) {
      for (const element of clause.namedBindings.elements) {
        bindings.push({
          kind: 'named',
          imported: element.propertyName?.text ?? element.name.text,
          local: element.name.text,
        })
      }
    }
  }

  return bindings
}

function parseExportBindings(statement) {
  if (!statement.exportClause) {
    return [{ kind: 'namespace', imported: '*', local: '*' }]
  }

  if (ts.isNamespaceExport(statement.exportClause)) {
    return [{ kind: 'namespace', imported: '*', local: statement.exportClause.name.text }]
  }

  if (ts.isNamedExports(statement.exportClause)) {
    return statement.exportClause.elements.map((element) => ({
      kind: 'named',
      imported: element.propertyName?.text ?? element.name.text,
      local: element.name.text,
    }))
  }

  return []
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
      specifiers.push({
        specifier: statement.moduleSpecifier.text,
        syntax: 'import',
        bindings: parseImportBindings(statement),
      })
    }

    if (
      ts.isExportDeclaration(statement) &&
      statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      specifiers.push({
        specifier: statement.moduleSpecifier.text,
        syntax: 'export',
        bindings: parseExportBindings(statement),
      })
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

function referencesSaveExecution(bindings) {
  return bindings.some(
    (binding) => binding.imported === 'saveExecution' || binding.kind === 'namespace',
  )
}

function packageIs(importInfo, ...packages) {
  return importInfo.kind === 'package' && packages.includes(importInfo.value)
}

function analyzeFile({ absolutePath, sourceRoot }) {
  const filePath = toPosix(relative(sourceRoot, absolutePath))
  const content = readFileSync(absolutePath, 'utf8')
  const findings = []

  for (const { specifier, syntax, bindings } of parseModuleSpecifiers(content)) {
    const importInfo = resolveImport(absolutePath, specifier, sourceRoot)
    const bindingEvidence = bindings.length
      ? ` {${bindings.map((binding) => binding.local).join(', ')}}`
      : ''
    const evidence = `${syntax} "${specifier}"${bindingEvidence}`

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

    if (
      filePath !== 'hooks/useSessionRunner.ts' &&
      filePath !== 'services/session/index.ts' &&
      importTargets(importInfo, 'services/session') &&
      referencesSaveExecution(bindings)
    ) {
      addFinding(findings, 'saveExecutionRunnerOnly', filePath, evidence)
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

function loadLibAllowlist(root) {
  const allowlistPath = resolve(root, 'scripts/architecture-check-lib-allowlist.json')
  if (!existsSync(allowlistPath)) return new Set()

  const parsed = JSON.parse(readFileSync(allowlistPath, 'utf8'))
  if (!Array.isArray(parsed.top_level)) {
    throw new Error(`Invalid lib allowlist: ${allowlistPath}`)
  }
  return new Set(parsed.top_level)
}

function analyzeLibAllowlist({ root, files, sourceRoot }) {
  const allowlist = loadLibAllowlist(root)
  const findings = []

  for (const absolutePath of files) {
    const filePath = toPosix(relative(sourceRoot, absolutePath))
    if (!isUnder(filePath, 'lib')) continue
    const rest = filePath.slice('lib/'.length)
    if (!rest || rest.includes('/')) continue
    if (!allowlist.has(rest)) {
      addFinding(findings, 'libNewTopLevelFile', filePath, `${rest} not in lib allowlist`)
    }
  }

  return findings
}

async function analyzeProject(root = defaultRoot) {
  const sourceRoot = resolve(root, 'src')
  const files = await collectSourceFiles(sourceRoot)
  return [
    ...files.flatMap((absolutePath) => analyzeFile({ absolutePath, sourceRoot })),
    ...analyzeLibAllowlist({ root, files, sourceRoot }),
  ]
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
    mkdirSync(join(root, 'scripts'), { recursive: true })
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
    writeFileSync(
      join(root, 'scripts/architecture-check-lib-allowlist.json'),
      JSON.stringify({ top_level: ['allowed.ts', 'screenWakeLock.ts'] }),
    )
    writeFileSync(join(root, 'src/services/index.ts'), 'export const serviceThing = true\n')
    writeFileSync(join(root, 'src/services/session.ts'), 'export function saveExecution() {}\n')
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
      join(root, 'src/components/BadSaveExecution.tsx'),
      "import { saveExecution } from '../services/session'\n",
    )
    writeFileSync(
      join(root, 'src/components/BadSaveExecutionAlias.tsx'),
      "import { saveExecution as persistExecution } from '../services/session'\n",
    )
    writeFileSync(
      join(root, 'src/components/BadSaveExecutionNamespace.tsx'),
      "import * as session from '../services/session'\n",
    )
    writeFileSync(
      join(root, 'src/components/BadSaveExecutionExport.tsx'),
      "export { saveExecution } from '../services/session'\n",
    )

    writeFileSync(
      join(root, 'src/components/BadSaveExecutionExportStar.tsx'),
      "export * from '../services/session'\n",
    )
    writeFileSync(
      join(root, 'src/components/BadSaveExecutionExportNamespace.tsx'),
      "export * as session from '../services/session'\n",
    )
    writeFileSync(
      join(root, 'src/hooks/useSessionRunner.ts'),
      "import { saveExecution } from '../services/session'\n",
    )
    writeFileSync(
      join(root, 'src/components/StringOnly.tsx'),
      '// navigator.vibrate belongs in platform\nconst note = "navigator.wakeLock"\n',
    )
    writeFileSync(
      join(root, 'src/domain/CommentedImport.ts'),
      "/* import { serviceThing } from '../services' */\nconst note = \"import x from '../db'\"\n",
    )
    writeFileSync(join(root, 'src/lib/allowed.ts'), 'export const allowed = true\n')
    writeFileSync(join(root, 'src/lib/screenWakeLock.ts'), 'navigator.wakeLock?.request?.()\n')
    writeFileSync(join(root, 'src/lib/junk.ts'), 'export const junk = true\n')
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
      hasFinding('saveExecutionRunnerOnly', 'components/BadSaveExecution.tsx', 'advisory'),
      true,
      'named saveExecution import should be flagged',
    )
    assert.equal(
      hasFinding('saveExecutionRunnerOnly', 'components/BadSaveExecutionAlias.tsx', 'advisory'),
      true,
      'aliased saveExecution import should be flagged',
    )
    assert.equal(
      hasFinding('saveExecutionRunnerOnly', 'components/BadSaveExecutionNamespace.tsx', 'advisory'),
      true,
      'namespace session import should be flagged',
    )
    assert.equal(
      hasFinding('saveExecutionRunnerOnly', 'components/BadSaveExecutionExport.tsx', 'advisory'),
      true,
      'named saveExecution re-export should be flagged',
    )
    assert.equal(
      hasFinding('saveExecutionRunnerOnly', 'components/BadSaveExecutionExportStar.tsx', 'advisory'),
      true,
      'export-star session re-export should be flagged',
    )
    assert.equal(
      hasFinding(
        'saveExecutionRunnerOnly',
        'components/BadSaveExecutionExportNamespace.tsx',
        'advisory',
      ),
      true,
      'namespace session re-export should be flagged',
    )
    assert.equal(
      findings.some(
        (finding) =>
          finding.ruleId === 'saveExecutionRunnerOnly' &&
          finding.filePath === 'hooks/useSessionRunner.ts',
      ),
      false,
    )
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
    assert.equal(
      findings.some((finding) => finding.filePath === 'lib/allowed.ts'),
      false,
    )
    assert.equal(hasFinding('libNewTopLevelFile', 'lib/junk.ts', 'advisory'), true)
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
