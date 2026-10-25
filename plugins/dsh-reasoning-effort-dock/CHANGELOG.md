# Changelog

All notable changes to this plugin are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
semantic versioning.

## [1.2.0] - 2026-10-25

### Changed

- Restored the MAX lateral white sweep, vertical streak flow, drifting sparks,
  ambient halo, and thumb pulse ring.
- Moved the clipping boundary from the rail to the module root. Effects may
  cross the blue rail, but the rounded widget border is now the hard limit.
- Aligned the vertical streak and spark fields to the rail's horizontal bounds.

### Added

- A quiet blue/cyan starfield around the bar and a few star specks inside it.
- A separate warm-gold starlight flash crosses the full rail twice per cycle;
  it is deliberately distinct from the blue-white lightning.

## [1.1.0] - 2026-10-25

### Changed

- Kept every non-lightning animated layer inside the track: removed the
  outside-the-rail white sweep, bloom, vertical streaks, spark layer, ambient
  halo, and thumb pulse ring.
- Raised the continuous lightning contrast with a dark outline glow and slightly
  thicker white-blue strokes so it remains legible over the bright MAX fill.

### Added

- Two full-bar lightning flashes per 3.6 s cycle. Each pass draws quickly across
  the track, blinks twice, and disappears before the next pass.

## [1.0.0] - 2026-10-24

### Added

- A four-stop reasoning-effort slider in the composer model row, rendered in
  both blank new sessions and resident conversations.
- Pointer dragging, track clicks, and keyboard control with snapping to
  `off`, `low`, `high`, and `max`.
- Real per-session model-selection binding through DSH's official
  `modelDirectories` service, with two-way sync against the native model menu.
- Continuous iridescent flow for every level and a MAX-only white/blue
  lightning layer that can visually overflow the track.
- Responsive layout, theme-token-based styling, reduced-motion handling, and
  accessible slider semantics.
