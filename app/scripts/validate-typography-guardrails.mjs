// @ts-check

import { readdir } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(__dirname, '..')
const defaultSourceRoot = resolve(appRoot, 'src')

const sourceRoot = resolve(process.argv.find((arg) => arg.startsWith('--root='))?.slice(7) ?? defaultSourceRoot)

const sourceExtensions = new Set(['.ts', '.tsx'])
const ignoredDirectoryNames = new Set(['__tests__', 'test-utils'])
const ignoredFileFragments = ['.test.', '.spec.']

const allowedArbitraryTextSizes = new Map([
  ['components/BlockTimer.tsx', new Set([56])],
  ['screens/RunScreen.tsx', new Set([72])],
])

const allowedUppercaseTrackingFiles = new Set(['components/BlockTimer.tsx'])
const allowedFontMonoFiles = new Set(['components/BlockTimer.tsx', 'screens/RunScreen.tsx'])

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
    literals.push(match[2])
  }

  return literals
}

function hasToken(literal, token) {
  return literal.split(/\s+/).includes(token)
}

function hasTrackingToken(literal) {
  return /\btracking-(?:wide|wider|widest)\b/.test(literal)
}

function validateLiteral(literal, relativePath, violations) {
  for (const match of literal.matchAll(/\btext-\[(\d+(?:\.\d+)?)px\]/g)) {
    const size = Number(match[1])
    const allowedSizes = allowedArbitraryTextSizes.get(relativePath)

    if (size < 12) {
      violations.push({
        relativePath,
        message: `Arbitrary text size ${match[0]} is below the 12px support-copy floor.`,
      })
      continue
    }

    if (!allowedSizes?.has(size)) {
      violations.push({
        relativePath,
        message: `Arbitrary text size ${match[0]} is not in the timer/display allowlist.`,
      })
    }
  }

  if (hasToken(literal, 'uppercase') && hasTrackingToken(literal) && !allowedUppercaseTrackingFiles.has(relativePath)) {
    violations.push({
      relativePath,
      message: 'Uppercase tracked eyebrow styling is only allowed for the BlockTimer PAUSED state.',
    })
  }

  if (hasToken(literal, 'font-mono') && !allowedFontMonoFiles.has(relativePath)) {
    violations.push({
      relativePath,
      message: 'font-mono is reserved for timer/instrument text surfaces.',
    })
  }
}

async function main() {
  const files = await collectSourceFiles(sourceRoot)
  const violations = []

  for (const file of files) {
    const relativePath = toPosix(relative(sourceRoot, file))
    const content = readFileSync(file, 'utf8')

    for (const literal of extractStringLiterals(content)) {
      validateLiteral(literal, relativePath, violations)
    }
  }

  if (violations.length === 0) {
    console.log('Typography guardrails passed.')
    return
  }

  console.error(`Typography guardrails found ${violations.length} violation(s):`)
  for (const violation of violations) {
    console.error(`- ${violation.relativePath}: ${violation.message}`)
  }
  process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
