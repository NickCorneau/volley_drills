# Reference-only sources — secondary PDFs, not canonical

PDFs kept for citation traceability or future cross-checking, but **not** treated as
primary sources for any current research note. Synthesized findings, where any exist,
live in `docs/research/`. New product claims should **not** cite these files unless
there is a specific gap that a primary source in `docs/research/sources/` does not cover.

## Status vs. `docs/research/sources/`

`docs/research/sources/` holds **primary-source PDFs that back the synthesis** in the
active research notes and specs. This `reference-only/` subfolder is the honest
catch-all for PDFs that were evaluated and judged **not** to earn a primary slot,
usually because they are indoor-biased, duplicative of stronger beach-specific
sources, or out-of-scope for the solo-first beach product.

Do not move a file into `docs/research/sources/` unless a specific claim in a curated
research note is rewritten to depend on it.

## Files

- `FIVB-Level-1-Coaches-Manual-2013.pdf` — FIVB Level I Coaches Manual. Indoor-focused
  (6v6 team formations, rotations, libero role, match management). Genuine transferable
  content is concentrated in Chapter VII ("Practice and Drills Design" by Bill Neville,
  drawing on Carl McGown's motor-learning work) and Chapter XII ("Medical Aspects" by
  Reeser and Bahr). Evaluated 2026-04-20; mined findings live in
  `docs/research/fivb-coaches-manual-crosscheck.md`.
- `2016_FIVB_DEV_Coaches_Manual_Level_II.pdf` — FIVB Level II Coaches Manual.
  Indoor-focused. Genuine transferable content is concentrated in Chapter I (Theory of
  Training, LTAD stages, Yakovlev model), Chapter II (Physical Training, injury
  distribution), and Chapter III (Player Development Model — Fitts & Posner motor
  learning stages, feedback principles, skill-progression guidance). Evaluated
  2026-04-20; mined findings live in `docs/research/fivb-coaches-manual-crosscheck.md`.

## Provenance

Added 2026-04-20. Originals downloaded from public FIVB distribution; filenames match
the original downloads byte-for-byte so future citations resolve. If a file is ever
promoted into `docs/research/sources/`, update that folder's README and the citing
research note in the same pass.
