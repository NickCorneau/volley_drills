#!/usr/bin/env node
/**
 * V0B-06: rasterize `public/icon.svg` into the four PNG variants the PWA
 * manifest + apple-touch-icon declare.
 *
 * Outputs (all written to `app/public/`):
 *   - icon-192.png          (192×192, purpose: 'any')   — home-screen icon
 *   - icon-512.png          (512×512, purpose: 'any')   — splash / large tile
 *   - icon-512-maskable.png (512×512, purpose: 'maskable') — Android safe-zone-padded
 *   - apple-touch-icon-180.png (180×180)                — iOS home-screen
 *
 * The maskable variant derives from the same SVG with `rx="108"` rewritten
 * to `rx="0"`: maskable icons must be full-bleed (Android applies its own
 * circular / squircle mask), so any rounded corners on the source canvas
 * would clip oddly. The volleyball artwork is centered with ~148px radius
 * on a 512 canvas, well inside the ~205px safe-zone radius — no repositioning
 * needed.
 *
 * Run via: `npm run icons:generate` (or `node scripts/generate-icons.mjs`).
 * Commit both the script AND the PNG outputs so any tester build has the
 * assets available without a regeneration step. Re-run whenever
 * `public/icon.svg` changes.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC = path.resolve(__dirname, '..', 'public')
const SOURCE_SVG = path.join(PUBLIC, 'icon.svg')

async function rasterize(svgBuffer, outPath, size) {
  await sharp(svgBuffer, { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(outPath)
  console.log(`  wrote ${path.relative(PUBLIC, outPath)} (${size}×${size})`)
}

async function main() {
  const svg = await readFile(SOURCE_SVG, 'utf8')
  console.log(`Rasterizing ${path.relative(process.cwd(), SOURCE_SVG)} …`)

  // `purpose: 'any'` variants use the source SVG as-is — the 108-radius
  // rounded corners render cleanly on iOS home screens and in any PWA
  // slot that doesn't apply its own mask.
  const anyBuffer = Buffer.from(svg, 'utf8')
  await rasterize(anyBuffer, path.join(PUBLIC, 'icon-192.png'), 192)
  await rasterize(anyBuffer, path.join(PUBLIC, 'icon-512.png'), 512)
  await rasterize(anyBuffer, path.join(PUBLIC, 'apple-touch-icon-180.png'), 180)

  // Maskable variant: drop the rounded corner so Android's mask gets a
  // flush square to work with. String-replace on the single rx attribute
  // is fine — the source SVG has exactly one. A brittle match is better
  // than a lenient one here; if the source structure changes, this line
  // throws loudly rather than silently emitting a misaligned icon.
  if (!svg.includes('rx="108"')) {
    throw new Error('icon.svg no longer contains rx="108"; update generate-icons.mjs')
  }
  const maskableSvg = svg.replace('rx="108"', 'rx="0"')
  const maskableBuffer = Buffer.from(maskableSvg, 'utf8')
  await rasterize(maskableBuffer, path.join(PUBLIC, 'icon-512-maskable.png'), 512)

  // Also write the intermediate maskable SVG alongside the PNGs so a
  // future regeneration doesn't silently diverge from what shipped.
  await writeFile(path.join(PUBLIC, 'icon-maskable.svg'), maskableSvg)
  console.log('  wrote icon-maskable.svg (source for maskable PNG)')

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
