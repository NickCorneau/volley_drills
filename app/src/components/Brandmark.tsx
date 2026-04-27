/**
 * Brandmark: the inline SVG version of `public/icon.svg` (the
 * volleyball-in-rounded-square Volleycraft logo).
 *
 * Replaces the 🏐 emoji that shipped during prototype pass - emoji ties
 * the brand to the host OS's glyph, which varies wildly (Apple's is
 * very different from Google's or Microsoft's) and reads "placeholder"
 * next to the actual installed app icon. The SVG stays crisp at any
 * size, inherits the accent color, and matches exactly what testers
 * see on their home screen.
 *
 * Kept minimal on purpose: paths are copy-pasted from `icon.svg`. If
 * that source ever changes, re-run `npm run icons:generate` to update
 * the PNG raster set AND update this file by hand (no build-time
 * synthesis - the duplication keeps the component trivially
 * tree-shakable and renderable in SSR / RTL without an SVG loader).
 */

interface BrandmarkProps {
  /** Pixel size for both width and height. Default 32 (app-bar scale). */
  size?: number
  /** Optional Tailwind classes for wrapper sizing / spacing. */
  className?: string
}

export function Brandmark({ size = 32, className }: BrandmarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      role="img"
      aria-label="Volleycraft"
      className={className}
    >
      <rect width="512" height="512" rx="108" fill="#E8732A" />
      <g
        fill="none"
        stroke="#FFF8F0"
        strokeWidth="32"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M256 92c82 0 148 74 148 164s-66 164-148 164S108 346 108 256s66-164 148-164z" />
        <path d="M108 220c92 36 204 36 296 0" />
        <path d="M108 292c92-36 204-36 296 0" />
      </g>
    </svg>
  )
}
