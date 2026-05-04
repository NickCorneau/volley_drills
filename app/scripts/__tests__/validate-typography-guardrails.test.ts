import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { afterEach, describe, expect, it } from 'vitest'

const scriptPath = resolve('scripts/validate-typography-guardrails.mjs')
const tempRoots: string[] = []

function makeFixtureRoot(source: string) {
  const root = mkdtempSync(join(tmpdir(), 'typography-guardrails-'))
  tempRoots.push(root)
  writeFileSync(join(root, 'Fixture.tsx'), source)
  return root
}

function runGuardrail(args: string[] = []) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: resolve('.'),
    encoding: 'utf8',
  })
}

afterEach(() => {
  while (tempRoots.length > 0) {
    rmSync(tempRoots.pop()!, { force: true, recursive: true })
  }
})

describe('validate-typography-guardrails', () => {
  it('passes the current full source tree with the documented default command', () => {
    const result = runGuardrail()

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Typography guardrails passed.')
  })

  it('passes the current component allowlist when run from a focused root', () => {
    const result = runGuardrail(['--root', 'src/components'])

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Typography guardrails passed.')
  })

  it('passes the current screen allowlist when run from a focused root', () => {
    const result = runGuardrail(['--root', 'src/screens'])

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Typography guardrails passed.')
  })

  it('fails arbitrary body-like text below the support-copy floor', () => {
    const root = makeFixtureRoot('<p className="text-[11px] text-text-secondary">Tiny</p>')
    const result = runGuardrail(['--root', root])

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('text-[11px] is below the 12px support-copy floor')
  })

  it('fails variant-prefixed uppercase tracked eyebrow styling', () => {
    const root = makeFixtureRoot('<p className="md:uppercase md:tracking-wide">Eyebrow</p>')
    const result = runGuardrail(['--root', root])

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Uppercase tracked eyebrow styling')
  })

  it('fails decorative variant-prefixed font-mono usage', () => {
    const root = makeFixtureRoot('<p className="sm:font-mono">Decorative mono</p>')
    const result = runGuardrail(['--root', root])

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('font-mono is reserved for timer/instrument text')
  })

  it('rejects unknown arguments as usage errors', () => {
    const result = runGuardrail(['--roots=src'])

    expect(result.status).toBe(2)
    expect(result.stderr).toContain('Unknown argument: --roots=src')
    expect(result.stderr).toContain('Usage:')
  })
})
