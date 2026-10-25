<p align="center">
  <img src="icon.svg" width="96" alt="Nova icon">
</p>

<h1 align="center">Nova</h1>

<p align="center">
  A cosmic reasoning-effort slider for the DeepSeek Harness composer.
  <br>
  <a href="README.zh.md">中文说明</a>
</p>

<p align="center">
  <a href="https://github.com/FanXi1230/fanxi/actions/workflows/dsh-nova.yml"><img alt="CI" src="https://github.com/FanXi1230/fanxi/actions/workflows/dsh-nova.yml/badge.svg"></a>
  <img alt="DSH 0.2.1-rc.2" src="https://img.shields.io/badge/DSH-0.2.1--rc.2-4d6bfe">
  <a href="LICENSE"><img alt="MIT" src="https://img.shields.io/badge/license-MIT-2ea44f"></a>
</p>

![Nova at Max effort](assets/screenshots/max.png)

## A small cosmos in the composer

Nova replaces the normal reasoning-effort menu with a draggable four-stop
slider and a different cosmic scene at every level:

| Stop | Scene |
| --- | --- |
| `Off` | A quiet dusting of stars with the faintest drifting light |
| `Low` | A slow blue aurora waking up around the track |
| `High` | Denser indigo/violet aurora, a second comet, and an energy streak |
| `Max` | A deep-space field with a moving six-colour nebula band, stars, blue-white lightning, violet flashes, and a slow white sweep |

The levels are not hard cuts. As the thumb crosses a stop, the old scene fades
out while the new one fades in; stars, aurora, glow, and fill colours blend
through the transition. While dragging, the scene changes when the thumb
actually crosses the next stop, not just because it is near one.

## What it does

- Drag the thumb, click the track, or use the arrow keys; the thumb snaps to
  `Off`, `Low`, `High`, or `Max`.
- The native model menu and Nova share one source of truth, so changing the
  level in either place updates the other.
- The selected level is written through DSH's own
  `session.selectModel({ provider, model, reasoningEffort })` path. It is the
  real reasoning parameter used by the next request, not a display-only value.
- Blank new sessions and resident conversations both render the control because
  it is registered in `conversation.input.right`.
- The whole widget is the clipping boundary: effects may cross the blue rail,
  but they never paint outside the rounded module.
- The component follows the active DSH theme tokens and respects
  `prefers-reduced-motion`.

## Requirements

- DeepSeek Harness Web UI `0.2.1-rc.2` or another build in the `0.2.1` line.
- The stock `ui-conversation` and `ui-model-selection` plugins enabled, as they
  are in the default Web profile.
- A model whose catalog advertises all four effort ids. The current DeepSeek
  account and API-key routes do; the control hides itself on other models.

## Install

### From the plugin market

Nova is submitted to the DSH plugin market / Discover catalog. Install it from
there when the listing is visible.

### From the GitHub release

```sh
dsh plugin --profile web add \
  https://github.com/FanXi1230/fanxi/releases/latest/download/dsh-nova.tgz
```

Restart `dsh web` if the plugin does not appear immediately.

### From this repository during development

```sh
git clone https://github.com/FanXi1230/fanxi.git
cd fanxi/plugins/dsh-nova
node scripts/validate.mjs
```

Then add the local package directory with the DSH plugin manager, or install it
into a profile with `dsh plugin --profile <profile> add <package-directory>`.

## How it works

Nova is a standard DSH bundle with an empty Host half. Its Client half reads the
existing `ctx.modelDirectories.directoryFor(sessionId)` directory and calls the
same `directory.select(...)` operation as DSH's model menu. It owns no session
state, makes no network calls, and stores no credentials.

The cosmic layers are CSS and SVG. Stars are real React nodes that reposition
themselves and change colour between twinkle cycles. Each level keeps its own
star layer, so level changes cross-fade instead of popping. The module root clips
every layer to the rounded widget border.

## Validation

The repository ships a dependency-free validation script:

```sh
node scripts/validate.mjs
```

It checks the bundle manifest, patch insert, module identifier, locale JSON,
screenshots, license, and JavaScript syntax. The same command runs in GitHub
Actions for changes in this plugin's directory.

## License

This plugin is released under the [MIT License](LICENSE).

The enclosing `fanxi` repository has its own AGPL-3.0 license; this plugin lives
in its own package directory with a separate MIT license.
