/**
 * Canonical flagged-vocabulary registry mirroring `.cursor/rules/courtside-copy.mdc`
 * rule 2 (technique + movement + logistics vocabulary tables).
 *
 * The registry is the source of truth for term-span resolution in
 * `parseGlossedText`. When a term graduates onto the rule 2 table, add
 * it here in the same PR; when a term graduates off the table (rule 2's
 * "two consecutive walkthroughs without a flag" condition), remove it
 * here in the same PR.
 *
 * Inflection note: the registry enumerates singular and plural / verb-
 * conjugated forms explicitly. Regex-in-string is intentionally not
 * used — the rule 2 vocabulary table itself enumerates by literal
 * spelling, and the registry mirrors that contract verbatim.
 *
 * Punctuation note: `0–3 rubric` and `0–3 scale` use an en-dash (U+2013),
 * matching the literal spelling in `app/src/data/drills.ts`. The parser's
 * registry-match is byte-exact, so changing the dash form here will
 * silently un-gloss those sites until the catalog is resynced.
 */

export const FLAGGED_TERMS: ReadonlySet<string> = new Set<string>([
  // Technique — pass-grading scoring vocabulary
  'graded 2+',
  'grade 2+',
  'grade 3 pass',
  'good pass',
  'good-pass',
  '0–3 rubric',
  '0–3 scale',
  'in-system',
  'controlled set',

  // Technique — set / pass window vocabulary
  'set window',
  'pass window',

  // Technique — body-mechanics vocabulary
  'drop-step',
  'inside shoulder',
  'outside shoulder',
  'platform angle',
  'brake-step',

  // Technique — BAB shot vocabulary
  'sideout',
  'tomahawk',
  'pokey',
  'cut shot',
  'high line',

  // Movement — singular and plural forms enumerated explicitly
  'A-skip',
  'ankle hops',
  'lateral shuffles',
  'pivot-back start',
  'pivot-back starts',
  "runner's lunge",
  'half-kneel',
  'hip flexor stretch',
  'RDL',

  // Logistics — singular noun, verb infinitive, and conjugated forms
  'shagger',
  'shag',
  'shags',
])
