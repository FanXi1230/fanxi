<p align="center">
  <img src="icon.svg" width="96" alt="Reasoning Effort Dock icon">
</p>

<h1 align="center">Reasoning Effort Dock</h1>

<p align="center">
  A draggable four-stop reasoning-effort slider for the DeepSeek Harness composer model row.
  <br>
  <a href="README.zh.md">中文说明</a>
</p>

<p align="center">
  <a href="https://github.com/FanXi1230/fanxi/actions/workflows/dsh-reasoning-effort-dock.yml"><img alt="CI" src="https://github.com/FanXi1230/fanxi/actions/workflows/dsh-reasoning-effort-dock.yml/badge.svg"></a>
  <img alt="DSH 0.2.1-rc.2" src="https://img.shields.io/badge/DSH-0.2.1--rc.2-4d6bfe">
  <a href="LICENSE"><img alt="MIT" src="https://img.shields.io/badge/license-MIT-2ea44f"></a>
</p>

![Reasoning Effort Dock at Max effort](assets/screenshots/max.png)

## What it does

Reasoning Effort Dock adds a compact slider to the composer's model-control row,
immediately to the left of the model selector. It represents DeepSeek's four
native reasoning levels as a snap slider rather than a menu:

| Stop | Meaning |
| --- | --- |
| `Off` | No reasoning effort |
| `Low` | Light reasoning |
| `High` | High reasoning |
| `Max` | Maximum reasoning effort |

- Drag the thumb, click the track, or use the arrow keys; the thumb always
  snaps to one of the four fixed levels.
- The right-hand model menu and this slider are two views of one source of
  truth. Changing the level in either place updates the other.
- The selected level is written to the current session through DSH's own
  `session.selectModel({ provider, model, reasoningEffort })` path. It is the
  real reasoning parameter used by the next request, not a display-only value.
- Blank new sessions and existing conversations both render the control,
  because it is registered in `conversation.input.right` in the composer row.
- Only `Max` adds the blue-white electric layer plus a soft lateral white
  sweep, fine vertical streak flow, drifting sparks, ambient halo, and thumb
  pulse. `Off`, `Low`, and `High` cross-fade through their own fill colors while
  a subtle iridescent highlight keeps the bar visually continuous.
- The widget border is the clipping boundary: effects may cross the blue rail,
  but nothing can paint outside the rounded module.
- On `Max`, two short warm-gold starlight flashes cross the full rail per cycle;
  they are intentionally a different colour from the blue-white lightning.
- A quiet blue/cyan starfield around the bar, plus a few star specks in the
  track, echo the cosmic theme without turning the control into a rainbow.
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

Reasoning Effort Dock is listed in
[awesome-dsh-plugin](https://awesome-dsh-plugin.com/p/FanXi1230/fanxi--plugins-dsh-reasoning-effort-dock/).
Install it from the DSH plugin market / Discover page, or use the release
command below.

### From the GitHub release tarball

```sh
dsh plugin --profile web add \
  https://github.com/FanXi1230/fanxi/releases/latest/download/dsh-reasoning-effort-dock.tgz
```

Restart `dsh web` if the plugin does not appear immediately.

### From this repository during development

```sh
git clone https://github.com/FanXi1230/fanxi.git
cd fanxi/plugins/dsh-reasoning-effort-dock
node scripts/validate.mjs
```

Then add the local package directory with the DSH plugin manager, or install it
into a profile with `dsh plugin --profile <profile> add <package-directory>`.

## Usage

1. Start a new conversation or open an existing one.
2. Move the slider to `Off`, `Low`, `High`, or `Max`.
3. Send the next message. The selected level is the reasoning effort used for
   the request; the native model menu shows the same level.

The model's native four-level effort metadata is the only source of stops. If a
model does not advertise all four, the slider is hidden instead of sending an
unsupported value.

## How it works

The plugin is a standard DSH bundle with an empty Host half. Its Client half
reads the existing `ctx.modelDirectories.directoryFor(sessionId)` directory and
calls the same `directory.select(...)` operation as DSH's model menu. It owns no
session state, does not call the network, and does not store credentials.

The MAX effects are pure CSS/SVG, are always mounted, and cross-fade by
opacity; their animations are paused while another level is active. That is what
makes level changes smooth rather than switching a display on and off. The
moving fill, sweep, streak, spark, halo, and thumb pulse can extend beyond the
blue rail, but the module root clips every layer to the rounded widget border,
so nothing can leak into the surrounding composer row.

## Validation

The repository ships a dependency-free validation script:

```sh
node scripts/validate.mjs
```

It checks the bundle manifest, patch insert, module identifier, locale JSON,
screenshots, license, and JavaScript syntax. The same command runs in GitHub
Actions for changes in this plugin's directory.

The plugin was also exercised in the running DSH Web UI against
`0.2.1-rc.2`:

- a new blank session renders the 400 × 38 control;
- switching to an existing session keeps it rendered;
- a pointer-driven move to `High` changes the native model-selection state to
  `High`, and moving back to `Max` restores `Max`.

## License

This plugin is released under the [MIT License](LICENSE).

The enclosing `fanxi` repository has its own AGPL-3.0 license; this plugin lives
in its own package directory with a separate MIT license.
