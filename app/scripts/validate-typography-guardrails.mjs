// @ts-check

import { existsSync, readFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(__dirname, '..')
const defaultSourceRoot = resolve(appRoot, 'src')

const sourceExtensions = new Set(['.ts', '.tsx'])
const ignoredDirectoryNames = new Set(['__tests__', 'test-utils'])
const ignoredFileFragments = ['.test.', '.spec.']

const arbitraryTextSizeAllowlist = [
  {
    path: 'components/BlockTimer.tsx',
    token: 'text-[56px]',
    requiredUtilities: ['font-mono', 'tabular-nums'],
    role: 'timer/instrument',
    surface: 'Run active timer',
    activeRunEligible: true,
    rationale: 'Live countdown digits keep the documented 56px arm-length timer scale.',
  },
  {
    path: 'screens/RunScreen.tsx',
    token: 'text-[72px]',
    requiredUtilities: ['font-mono', 'tabular-nums'],
    role: 'timer/instrument',
    surface: 'Run preroll countdown',
    activeRunEligible: true,
    rationale: 'Preroll digits keep the documented 72px countdown scale.',
  },
]

const uppercaseTrackingAllowlist = [
  {
    path: 'components/BlockTimer.tsx',
    requiredUtilities: ['uppercase', 'tracking-wide', 'text-accent'],
    role: 'state marker',
    surface: 'BlockTimer PAUSED state',
    activeRunEligible: true,
    rationale: 'The transient PAUSED marker is the only approved uppercase tracked state indicator.',
  },
]

const fontMonoAllowlist = [
  {
    path: 'components/BlockTimer.tsx',
    requiredUtilities: ['font-mono', 'tabular-nums'],
    role: 'timer/instrument',
    surface: 'Run active timer',
    activeRunEligible: true,
    rationale: 'Live timer digits use JetBrains Mono for instrument-grade numeric clarity.',
  },
  {
    path: 'screens/RunScreen.tsx',
    requiredUtilities: ['font-mono', 'tabular-nums'],
    role: 'timer/instrument',
    surface: 'Run preroll countdown',
    activeRunEligible: true,
    rationale: 'Preroll countdown digits use JetBrains Mono for exact numeric display.',
  },
]

function usage() {
  return `Usage: node scripts/validate-typography-guardrails.mjs [--root <path> | --root=<path>]

Checks high-signal Volleycraft typography drift:
- no body-like arbitrary text below 12px
- no arbitrary text sizes outside timer/display allowlist entries
- no uppercase tracked eyebrows outside the BlockTimer PAUSED state
- no decorative font-mono outside timer/instrument text
`
}

function parseArgs(argv) {
  let root = defaultSourceRoot

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      return { kind: 'help' }
    }

    if (arg === '--root') {
      const value = argv[index + 1]
      if (!value || value.startsWith('-')) {
        return { kind: 'usage-error', message: '--root requires a path value.' }
      }
      root = resolve(appRoot, value)
      index += 1
      continue
    }

    if (arg.startsWith('--root=')) {
      const value = arg.slice('--root='.length)
      if (!value) {
        return { kind: 'usage-error', message: '--root requires a path value.' }
      }
      root = resolve(appRoot, value)
      continue
    }

    return { kind: 'usage-error', message: `Unknown argument: ${arg}` }
  }

  return { kind: 'run', root }
}

function toPosix(path) {
  return path.split(sep).join('/')
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

function stripComments(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

function extractStringLiterals(content) {
  const literals = []
  const withoutComments = stripComments(content)
  const stringRegex = /(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g
  let match

  while ((match = stringRegex.exec(withoutComments))) {
    const [, quote, literal] = match
    literals.push(literal)

    if (quote === '`') {
      literals.push(...extractStringLiterals(literal))
    }
  }

  return literals
}

function normalizeToken(token) {
  return token.replace(/^[!{(?:"'`]+|[}),;:?"'`]+$/g, '')
}

function utilityName(token) {
  const normalized = normalizeToken(token)
  const parts = normalized.split(':')
  return parts[parts.length - 1]
}

function tokenUtilities(literal) {
  return literal
    .split(/\s+/)
    .map(utilityName)
    .filter(Boolean)
}

function hasUtility(utilities, utility) {
  return utilities.includes(utility)
}

function hasTrackingUtility(utilities) {
  return utilities.some((utility) => /^tracking-(?:wide|wider|widest)$/.test(utility))
}

function matchesRequiredUtilities(literal, requiredUtilities) {
  const utilities = tokenUtilities(literal)
  return requiredUtilities.every((utility) => hasUtility(utilities, utility))
}

function isAllowedByEntry(literal, relativePath, entry) {
  return relativePath === entry.path && matchesRequiredUtilities(literal, entry.requiredUtilities)
}

function isAllowedArbitraryTextSize(literal, relativePath, token) {
  return arbitraryTextSizeAllowlist.some(
    (entry) => entry.path === relativePath && entry.token === token && isAllowedByEntry(literal, relativePath, entry),
  )
}

function isAllowedUppercaseTracking(literal, relativePath) {
  return uppercaseTrackingAllowlist.some((entry) => isAllowedByEntry(literal, relativePath, entry))
}

function isAllowedFontMono(literal, relativePath) {
  return fontMonoAllowlist.some((entry) => isAllowedByEntry(literal, relativePath, entry))
}

function lineForOffset(content, offset) {
  return content.slice(0, offset).split('\n').length
}

function validateLiteral(literal, relativePath, violations) {
  for (const match of literal.matchAll(/\b(?:[a-z0-9_-]+:)*text-\[(\d+(?:\.\d+)?)px\]/gi)) {
    const token = utilityName(match[0])
    const size = Number(match[1])

    if (size < 12) {
      violations.push({
        relativePath,
        message: `Arbitrary text size ${token} is below the 12px support-copy floor.`,
      })
      continue
    }

    if (!isAllowedArbitraryTextSize(literal, relativePath, token)) {
      violations.push({
        relativePath,
        message: `Arbitrary text size ${token} is not in the timer/display allowlist.`,
      })
    }
  }

  const utilities = tokenUtilities(literal)

  if (hasUtility(utilities, 'uppercase') && hasTrackingUtility(utilities) && !isAllowedUppercaseTracking(literal, relativePath)) {
    violations.push({
      relativePath,
      message: 'Uppercase tracked eyebrow styling is only allowed for the BlockTimer PAUSED state.',
    })
  }

  if (hasUtility(utilities, 'font-mono') && !isAllowedFontMono(literal, relativePath)) {
    violations.push({
      relativePath,
      message: 'font-mono is reserved for timer/instrument text surfaces.',
    })
  }
}

function sourceRelativePath(file, scanRoot) {
  const fromDefaultRoot = toPosix(relative(defaultSourceRoot, file))
  if (!fromDefaultRoot.startsWith('..')) {
    return fromDefaultRoot
  }

  return toPosix(relative(scanRoot, file))
}

function validateFile(file, scanRoot) {
  const content = readFileSync(file, 'utf8')
  const relativePath = sourceRelativePath(file, scanRoot)
  const violations = []
  const literals = extractStringLiterals(content)

  for (const literal of literals) {
    const beforeCount = violations.length
    validateLiteral(literal, relativePath, violations)

    if (violations.length > beforeCount) {
      const offset = content.indexOf(literal)
      const line = offset >= 0 ? lineForOffset(content, offset) : undefined
      for (const violation of violations.slice(beforeCount)) {
        violation.line = line
      }
    }
  }

  return violations
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.kind === 'help') {
    console.log(usage())
    return
  }

  if (args.kind === 'usage-error') {
    console.error(args.message)
    console.error(usage())
    process.exitCode = 2
    return
  }

  const scanRoot = args.root
  if (!existsSync(scanRoot)) {
    console.error(`Cannot scan root ${scanRoot}: path does not exist.`)
    console.error('Example: npm run typography:guardrails:check -- --root=src')
    process.exitCode = 2
    return
  }

  const files = await collectSourceFiles(scanRoot)
  const violations = files.flatMap((file) => validateFile(file, scanRoot))

  if (violations.length === 0) {
    console.log('Typography guardrails passed.')
    return
  }

  console.error(`Typography guardrails found ${violations.length} violation(s):`)
  for (const violation of violations) {
    const location = violation.line ? `${violation.relativePath}:${violation.line}` : violation.relativePath
    console.error(`- ${location}: ${violation.message}`)
  }
  process.exitCode = 1
}

main().catch((error) => {
  console.error(`Cannot run typography guardrails: ${error instanceof Error ? error.message : String(error)}`)
  console.error('Example: npm run typography:guardrails:check -- --root=src')
  process.exitCode = 2
})
