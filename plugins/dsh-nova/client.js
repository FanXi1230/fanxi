/**
 * Client half of the reasoning-effort slider.
 *
 * The control lives inside the composer tool row (`conversation.input.right`),
 * next to the model selector, and is therefore rendered for both the blank
 * "hero" composer and every resident conversation. It reads the same
 * `ctx.modelDirectories` snapshot used by DSH's own model menu and submits
 * through the same `directory.select({ provider, model, reasoningEffort })`
 * operation, so it changes the real per-session reasoning parameter and both
 * surfaces stay in sync.
 */
window.__ModuleLoader__.load({
  id: 'dsh-nova',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'dsh-nova';
    const LEVEL_ORDER = ['off', 'low', 'high', 'max'];
    const LEVEL_NAMES = Object.freeze({ off: 'Off', low: 'Low', high: 'High', max: 'Max' });
    const DEFAULT_LABEL = '推理强度';

    function levelDisplayName(value) {
      const key = String(value ?? '').toLowerCase();
      if (LEVEL_NAMES[key]) return LEVEL_NAMES[key];
      return key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Off';
    }

    const STAR_COLORS = [
      'rgba(238, 252, 255, 0.96)',
      'rgba(156, 231, 255, 0.92)',
      'rgba(118, 174, 255, 0.92)',
      'rgba(168, 143, 255, 0.84)',
      'rgba(89, 119, 255, 0.8)',
      'rgba(255, 221, 155, 0.86)',
    ];

    const STAR_COLORS_HIGH = [
      'rgba(232, 248, 255, 0.96)',
      'rgba(146, 208, 255, 0.92)',
      'rgba(112, 152, 255, 0.9)',
      'rgba(154, 137, 255, 0.88)',
      'rgba(198, 142, 255, 0.8)',
      'rgba(255, 226, 170, 0.82)',
    ];

    const STAR_COLORS_MAX = [
      'rgba(238, 252, 255, 0.98)',
      'rgba(150, 236, 255, 0.94)',
      'rgba(112, 176, 255, 0.92)',
      'rgba(176, 143, 255, 0.9)',
      'rgba(86, 106, 255, 0.86)',
      'rgba(255, 221, 155, 0.9)',
    ];

    const STAR_PALETTES = {
      off: [STAR_COLORS[0], STAR_COLORS[1], STAR_COLORS[4]],
      low: [STAR_COLORS[0], STAR_COLORS[1], STAR_COLORS[2], STAR_COLORS[4]],
      high: STAR_COLORS_HIGH,
      max: STAR_COLORS_MAX,
    };

    const STAR_LEVELS = ['off', 'low', 'high', 'max'];
    const STAR_COUNTS = {
      off: { cosmos: 15, bar: 10 },
      low: { cosmos: 26, bar: 18 },
      high: { cosmos: 36, bar: 26 },
      max: { cosmos: 20, bar: 16 },
    };

    const MAX_COLOR_PUSH = ['#0047ff', '#00e5ff', '#00ff8a', '#ffb300', '#ff2d92', '#8a4dff'];
    const MAX_COLOR_GRADIENT =
      'linear-gradient(90deg, ' +
      MAX_COLOR_PUSH.concat(MAX_COLOR_PUSH, MAX_COLOR_PUSH[0]).join(', ') +
      ')';

    function makeStar(area, level, previous) {
      const bar = area === 'bar';
      const duration = previous ? previous.duration : 2.2 + Math.random() * 3.9;
      const delay = previous ? previous.delay : -Math.random() * 6;
      const palette = STAR_PALETTES[level] || STAR_COLORS;
      return {
        x: 4 + Math.random() * 92,
        y: bar ? 8 + Math.random() * 84 : 6 + Math.random() * 88,
        size: (bar ? 1.1 : 1.35) + Math.random() * (bar ? 1.5 : 2.0),
        duration,
        delay,
        color: palette[Math.floor(Math.random() * palette.length)],
      };
    }

    function EffortStar({ area, level }) {
      const [star, setStar] = React.useState(() => makeStar(area, level));
      return h('i', {
        className: 'dsh-effort__star',
        'aria-hidden': 'true',
        style: {
          left: star.x + '%',
          top: star.y + '%',
          width: star.size + 'px',
          height: star.size + 'px',
          background: star.color,
          boxShadow: '0 0 ' + (star.size * 2.5).toFixed(1) + 'px ' + star.color +
            ', 0 0 ' + (star.size * 5).toFixed(1) + 'px ' + star.color,
          animationDuration: star.duration + 's',
          animationDelay: star.delay + 's',
        },
        onAnimationIteration: () => setStar((prev) => makeStar(area, level, prev)),
      });
    }

    function EffortStarfield({ area, count, level }) {
      return h(
        React.Fragment,
        null,
        Array.from({ length: count }, (_, index) =>
          h(EffortStar, { key: index, area, level })
        )
      );
    }

    const CSS = `
.dsh-effort {
  --dsh-effort-ease: cubic-bezier(0.22, 0.82, 0.24, 1);
  --dsh-effort-accent: #c8d2dd;
  --dsh-effort-fill-color: #c2cbd6;
  --dsh-effort-glow: transparent;
  --dsh-effort-rail-color: color-mix(in srgb, var(--dsw-alias-label-secondary) 18%, var(--dsw-alias-bg-layer-2));
  --dsh-effort-flow-opacity: 0.18;
  --dsh-effort-sheen-opacity: 0.26;
  --dsh-effort-halo-opacity: 0.08;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  box-sizing: border-box;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: center;
  gap: 1px;
  width: 340px;
  width: clamp(240px, 38cqw, 400px);
  max-width: 100%;
  padding: 3px 12px 2px;
  border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l1) 86%, transparent);
  border-radius: 12px;
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--dsw-alias-bg-layer-1) 56%, transparent),
      color-mix(in srgb, var(--dsw-alias-bg-layer-1) 22%, transparent)
    );
  color: var(--dsw-alias-label-secondary);
  direction: ltr;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    border-color 460ms ease,
    box-shadow 460ms ease;
}

.dsh-effort[data-level="off"] {
  --dsh-effort-accent: #c8d2dd;
  --dsh-effort-fill-color: #c2cbd6;
  --dsh-effort-glow: transparent;
  --dsh-effort-rail-color: color-mix(in srgb, var(--dsw-alias-label-secondary) 58%, var(--dsw-alias-bg-layer-2));
  --dsh-effort-flow-opacity: 0.14;
  --dsh-effort-sheen-opacity: 0.22;
  --dsh-effort-halo-opacity: 0.06;
}

.dsh-effort[data-level="low"] {
  --dsh-effort-accent: #99d2ff;
  --dsh-effort-fill-color: #74bfff;
  --dsh-effort-glow: rgba(110, 194, 255, 0.46);
  --dsh-effort-rail-color: color-mix(in srgb, #5591cc 34%, var(--dsw-alias-bg-layer-2));
  --dsh-effort-flow-opacity: 0.44;
  --dsh-effort-sheen-opacity: 0.58;
  --dsh-effort-halo-opacity: 0.34;
}

.dsh-effort[data-level="high"] {
  --dsh-effort-accent: #7793ff;
  --dsh-effort-fill-color: #3e63ff;
  --dsh-effort-glow: rgba(76, 118, 255, 0.6);
  --dsh-effort-rail-color: color-mix(in srgb, #4657ad 40%, var(--dsw-alias-bg-layer-2));
  --dsh-effort-flow-opacity: 0.66;
  --dsh-effort-sheen-opacity: 0.82;
  --dsh-effort-halo-opacity: 0.52;
}

.dsh-effort[data-level="max"] {
  --dsh-effort-accent: #c5fbff;
  --dsh-effort-fill-color: #06152f;
  --dsh-effort-glow: rgba(94, 229, 255, 0.68);
  --dsh-effort-rail-color: color-mix(in srgb, var(--dsw-alias-label-secondary) 18%, var(--dsw-alias-bg-layer-2));
  --dsh-effort-flow-opacity: 0.5;
  --dsh-effort-sheen-opacity: 0.62;
  --dsh-effort-halo-opacity: 1;
  border-color: color-mix(in srgb, #8ff2ff 30%, var(--dsw-alias-border-l1));
}

.dsh-effort[data-error="true"] {
  border-color: var(--dsw-alias-state-error-primary);
}

.dsh-effort[data-busy="true"] .dsh-effort__track {
  cursor: progress;
}

/* Off is the lowest tier: a faint dusting of stars, one slow photon, and a
   barely-there cool highlight. No sweep, shimmer, or thumb pulse. */
.dsh-effort[data-level="off"] .dsh-effort__halo {
  display: none;
}
.dsh-effort[data-level="off"] .dsh-effort__fill::after,
.dsh-effort[data-level="off"] .dsh-effort__thumb::after {
  display: none;
}
.dsh-effort[data-level="off"] .dsh-effort__cosmos {
  opacity: 0.42;
}
.dsh-effort[data-level="off"] .dsh-effort__fill::before {
  --dsh-effort-flow-opacity: 0.12;
  animation-duration: 8.4s;
}

.dsh-effort__halo {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: -6px;
  right: -6px;
  height: 48px;
  border-radius: 999px;
  background: radial-gradient(ellipse at center, var(--dsh-effort-glow), transparent 70%);
  filter: blur(12px);
  opacity: var(--dsh-effort-halo-opacity);
  transform: translateY(-50%);
  transition: opacity 500ms ease, filter 500ms ease;
  pointer-events: none;
}

/* Nebula wash around the bar. The actual stars are React nodes below, so they
   can jump to new positions and change colour between twinkle cycles. */
.dsh-effort__cosmos {
  position: absolute;
  z-index: 0;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.9;
  transition: opacity 520ms ease;
  background:
    radial-gradient(ellipse at 72% 30%, rgba(75, 62, 170, 0.16), transparent 58%),
    radial-gradient(ellipse at 24% 76%, rgba(30, 96, 200, 0.2), transparent 62%),
    radial-gradient(ellipse at 50% 50%, rgba(12, 45, 120, 0.2), transparent 75%);
}

.dsh-effort__star-layer {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 520ms ease;
  pointer-events: none;
}

.dsh-effort[data-level="off"] .dsh-effort__star-layer[data-star-level="off"],
.dsh-effort[data-level="low"] .dsh-effort__star-layer[data-star-level="low"],
.dsh-effort[data-level="high"] .dsh-effort__star-layer[data-star-level="high"],
.dsh-effort[data-level="max"] .dsh-effort__star-layer[data-star-level="max"] {
  opacity: 1;
}

.dsh-effort__star {
  position: absolute;
  display: block;
  border-radius: 50%;
  opacity: 0;
  transform: translate(-50%, -50%);
  animation-name: dsh-effort-star-life;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  mix-blend-mode: screen;
  pointer-events: none;
}

/* A soft moving aurora veil behind the bar. It is wider than the 10px rail
   but still clipped by the module root. */
.dsh-effort__aura {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 4px;
  right: 4px;
  height: 30px;
  border-radius: 999px;
  opacity: 0;
  transform: translateY(-50%);
  filter: blur(9px);
  mix-blend-mode: screen;
  pointer-events: none;
  display: block;
  transition: opacity 520ms ease;
}

.dsh-effort[data-level="low"] .dsh-effort__aura {
  opacity: 0.5;
  background: linear-gradient(
    100deg,
    transparent 0%,
    rgba(77, 176, 255, 0.3) 28%,
    rgba(95, 116, 255, 0.32) 55%,
    transparent 90%
  );
  animation: dsh-effort-aura-wave 8.4s ease-in-out infinite;
}

.dsh-effort[data-level="high"] .dsh-effort__aura {
  opacity: 0.82;
  background: linear-gradient(
    100deg,
    transparent 0%,
    rgba(85, 208, 255, 0.38) 22%,
    rgba(115, 137, 255, 0.42) 48%,
    rgba(147, 91, 232, 0.3) 72%,
    transparent 95%
  );
  animation: dsh-effort-aura-wave 5.1s ease-in-out infinite;
}

.dsh-effort__track {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 20px;
  outline: none;
  cursor: pointer;
  touch-action: none;
}

.dsh-effort__rail {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background-color: var(--dsh-effort-rail-color);
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.34),
    inset 0 -1px 0 rgba(255, 255, 255, 0.06);
  transform: translateY(-50%);
  transition: background-color 480ms ease, box-shadow 480ms ease;
}

.dsh-effort__rail::before {
  content: "";
  position: absolute;
  z-index: 0;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--dsh-effort-accent) 16%, transparent) 44%,
    transparent 100%
  );
  background-size: 220% 100%;
  opacity: 0.56;
  animation: dsh-effort-rail-drift 6.2s linear infinite;
  transition: opacity 520ms ease;
  pointer-events: none;
}

.dsh-effort[data-level="off"] .dsh-effort__rail::before {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(170, 205, 240, 0.18) 42%,
    transparent 100%
  );
  background-size: 240% 100%;
  opacity: 0.42;
  animation-duration: 9.4s;
}

.dsh-effort[data-level="off"] .dsh-effort__rail::after {
  opacity: 0.14;
  animation: dsh-effort-level-wave 7.6s linear infinite;
}

.dsh-effort[data-level="off"] .dsh-effort__fill {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 0 6px rgba(168, 205, 240, 0.16);
}

.dsh-effort[data-level="off"] .dsh-effort__comet--a {
  width: 20px;
  height: 2px;
  opacity: 0.42;
  animation: dsh-effort-comet 9.4s linear infinite 1.8s;
}

/* Off and Low share one aurora family: Off is the same veil seen faintly. */
.dsh-effort[data-level="off"] .dsh-effort__aura {
  opacity: 0.26;
  background: linear-gradient(
    100deg,
    transparent 0%,
    rgba(88, 168, 246, 0.26) 30%,
    rgba(103, 132, 255, 0.26) 56%,
    transparent 92%
  );
  animation: dsh-effort-aura-wave 9.6s ease-in-out infinite;
}

.dsh-effort[data-level="off"] .dsh-effort__fill::before {
  filter: saturate(0.82);
}

.dsh-effort[data-level="low"] .dsh-effort__rail::before {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(87, 196, 255, 0.32) 28%,
    rgba(112, 142, 255, 0.24) 56%,
    transparent 100%
  );
  background-size: 240% 100%;
  opacity: 0.9;
  animation-duration: 7.4s;
}

.dsh-effort[data-level="high"] .dsh-effort__rail::before {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(104, 220, 255, 0.4) 22%,
    rgba(112, 130, 255, 0.38) 50%,
    rgba(150, 95, 235, 0.26) 74%,
    transparent 100%
  );
  background-size: 240% 100%;
  opacity: 1;
  animation-duration: 4.8s;
}

.dsh-effort__rail::after {
  content: "";
  position: absolute;
  z-index: 2;
  inset: 0;
  background: repeating-linear-gradient(
    112deg,
    transparent 0 18px,
    rgba(205, 245, 255, 0.18) 22px,
    transparent 30px 46px
  );
  mix-blend-mode: screen;
  opacity: 0;
  transition: opacity 520ms ease;
  pointer-events: none;
}

.dsh-effort[data-level="low"] .dsh-effort__rail::after {
  opacity: 0.3;
  animation: dsh-effort-level-wave 5.2s linear infinite;
}

.dsh-effort[data-level="high"] .dsh-effort__rail::after {
  opacity: 0.52;
  animation: dsh-effort-level-wave 3.1s linear infinite;
}

/* Twinkling stars are real DOM nodes inside this clipped layer. */
.dsh-effort__bar-stars {
  position: absolute;
  z-index: 2;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}

/* Low and High get progressively richer bar animation. Both layers are
   clipped by the rail; Off and Max leave them hidden. */
.dsh-effort__aurora,
.dsh-effort__comet,
.dsh-effort__energy {
  display: block;
  opacity: 0;
  transition: opacity 520ms ease;
  pointer-events: none;
}

.dsh-effort__aurora {
  position: absolute;
  z-index: 1;
  top: -80%;
  bottom: -80%;
  left: -35%;
  right: -35%;
  background:
    linear-gradient(
      100deg,
      transparent 6%,
      rgba(170, 242, 255, 0.42) 30%,
      rgba(80, 118, 255, 0.48) 50%,
      rgba(165, 112, 255, 0.3) 68%,
      transparent 90%
    ),
    repeating-linear-gradient(
      115deg,
      transparent 0 24px,
      rgba(205, 249, 255, 0.24) 27px,
      transparent 34px 52px
    );
  background-size: 240% 100%, 200% 100%;
  mix-blend-mode: screen;
  filter: blur(3px);
  opacity: 0;
}

.dsh-effort__aurora::before,
.dsh-effort__aurora::after {
  content: "";
  position: absolute;
  pointer-events: none;
  mix-blend-mode: screen;
}

.dsh-effort__aurora::before {
  top: -35%;
  bottom: -35%;
  left: -42%;
  width: 30%;
  background: linear-gradient(90deg, transparent, rgba(210, 250, 255, 0.7), transparent);
  filter: blur(2px);
  opacity: 0.55;
  animation: dsh-effort-level-sheen 6.2s linear infinite;
}

.dsh-effort__aurora::after {
  inset: -20% -25%;
  background: repeating-linear-gradient(
    105deg,
    transparent 0 20px,
    rgba(194, 242, 255, 0.2) 24px,
    transparent 32px 58px
  );
  opacity: 0.4;
  animation: dsh-effort-level-wave 4.8s linear infinite;
}

.dsh-effort[data-level="low"] .dsh-effort__aurora {
  opacity: 0.76;
  animation: dsh-effort-aurora 8s linear infinite;
}

.dsh-effort[data-level="low"] .dsh-effort__aurora::before {
  opacity: 0.42;
  animation-duration: 7.5s;
}

.dsh-effort[data-level="low"] .dsh-effort__aurora::after {
  opacity: 0.26;
  animation-duration: 6s;
}

.dsh-effort[data-level="high"] .dsh-effort__aurora {
  opacity: 0.96;
  animation: dsh-effort-aurora 5.2s linear infinite;
}

.dsh-effort[data-level="high"] .dsh-effort__aurora::before {
  opacity: 0.78;
  animation-duration: 4.2s;
}

.dsh-effort[data-level="high"] .dsh-effort__aurora::after {
  opacity: 0.58;
  animation-duration: 3.2s;
}

.dsh-effort__comet {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: -34%;
  width: 28px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, rgba(218, 252, 255, 0.92));
  filter: blur(0.35px);
  box-shadow: 0 0 8px rgba(150, 236, 255, 0.6);
  opacity: 0;
}

.dsh-effort[data-level="low"] .dsh-effort__comet--a {
  opacity: 0.75;
  animation: dsh-effort-comet 7.2s linear infinite 0.6s;
}

.dsh-effort[data-level="high"] .dsh-effort__comet--a {
  opacity: 0.92;
  animation: dsh-effort-comet 4.2s linear infinite;
}

.dsh-effort[data-level="high"] .dsh-effort__comet--b {
  top: 27%;
  width: 17px;
  opacity: 0.58;
  animation: dsh-effort-comet 5.4s linear infinite -2.2s;
}

.dsh-effort__energy {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: -38%;
  width: 24%;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, rgba(210, 251, 255, 0.9), transparent);
  filter: blur(1px);
  opacity: 0;
}

.dsh-effort[data-level="high"] .dsh-effort__energy {
  opacity: 0.8;
  animation: dsh-effort-energy 3.4s linear infinite;
}

.dsh-effort[data-level="low"] .dsh-effort__halo {
  animation: dsh-effort-halo-breathe 6.8s ease-in-out infinite;
}

.dsh-effort[data-level="high"] .dsh-effort__halo {
  animation: dsh-effort-halo-breathe 4.6s ease-in-out infinite;
}

.dsh-effort[data-level="low"] .dsh-effort__thumb::after {
  opacity: 0.3;
  animation: dsh-effort-thumb-pulse 3.4s ease-out infinite;
}

.dsh-effort[data-level="high"] .dsh-effort__thumb::after {
  opacity: 0.5;
  animation: dsh-effort-thumb-pulse 2.4s ease-out infinite;
}

.dsh-effort__fill {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0;
  overflow: hidden;
  border-radius: 999px;
  background-color: var(--dsh-effort-fill-color);
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.26),
    rgba(255, 255, 255, 0) 46%,
    rgba(0, 0, 0, 0.08)
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.34),
    0 0 10px var(--dsh-effort-glow),
    0 0 22px var(--dsh-effort-glow);
  transition:
    width 460ms var(--dsh-effort-ease),
    background-color 520ms var(--dsh-effort-ease),
    box-shadow 480ms ease;
}

.dsh-effort[data-level="low"] .dsh-effort__fill {
  background-color: #1d558c;
  background-image:
    radial-gradient(ellipse at 30% 30%, rgba(110, 218, 255, 0.74), transparent 60%),
    radial-gradient(ellipse at 78% 70%, rgba(98, 132, 255, 0.46), transparent 60%),
    linear-gradient(180deg, #3a80c4 0%, #14365e 100%);
  box-shadow:
    inset 0 1px 0 rgba(208, 248, 255, 0.3),
    0 0 10px rgba(83, 183, 255, 0.36),
    0 0 22px rgba(45, 120, 255, 0.18);
  animation: dsh-effort-fill-breathe 5.8s ease-in-out infinite;
}

.dsh-effort[data-level="high"] .dsh-effort__fill {
  background-color: #182768;
  background-image:
    radial-gradient(ellipse at 24% 25%, rgba(117, 143, 255, 0.76), transparent 60%),
    radial-gradient(ellipse at 76% 75%, rgba(146, 102, 240, 0.5), transparent 62%),
    linear-gradient(180deg, #2647a8 0%, #0b1836 100%);
  box-shadow:
    inset 0 1px 0 rgba(220, 251, 255, 0.34),
    0 0 12px rgba(92, 150, 255, 0.44),
    0 0 26px rgba(58, 94, 255, 0.22);
  animation: dsh-effort-fill-breathe 3.9s ease-in-out infinite;
}

/* Max is a deep-space bar: navy/indigo nebula plus cyan and violet accents.
   The gold flashes stay a separate accent, so this does not become a rainbow. */
.dsh-effort[data-level="max"] .dsh-effort__fill {
  background-color: #06152f;
  background-image:
    radial-gradient(ellipse at 18% 30%, rgba(53, 101, 255, 0.62), transparent 56%),
    radial-gradient(ellipse at 82% 72%, rgba(99, 63, 186, 0.44), transparent 60%),
    radial-gradient(ellipse at 52% 0%, rgba(100, 225, 255, 0.24), transparent 62%),
    linear-gradient(180deg, #0c2b5e 0%, #040e24 100%);
  box-shadow:
    inset 0 1px 0 rgba(196, 249, 255, 0.34),
    0 0 10px rgba(94, 229, 255, 0.38),
    0 0 22px rgba(42, 103, 255, 0.22);
}

.dsh-effort__fill::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 15%,
    rgba(129, 241, 255, 0.82) 29%,
    rgba(255, 255, 255, 0.94) 36%,
    rgba(123, 133, 255, 0.52) 48%,
    rgba(200, 139, 255, 0.34) 58%,
    transparent 72%,
    transparent 100%
  );
  background-size: 220% 100%;
  opacity: var(--dsh-effort-flow-opacity);
  mix-blend-mode: screen;
  animation: dsh-effort-iridescence 4.8s linear infinite;
  transition: opacity 480ms ease;
  pointer-events: none;
}

.dsh-effort__fill::after {
  content: "";
  position: absolute;
  top: -30%;
  bottom: -30%;
  left: -36%;
  width: 34%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.92), transparent);
  filter: blur(1.5px);
  opacity: var(--dsh-effort-sheen-opacity);
  mix-blend-mode: screen;
  animation: dsh-effort-sheen 3.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  transition: opacity 480ms ease;
  pointer-events: none;
}

/* Slow deep-space colour drift inside the Max fill: blue, cyan, violet and a
   restrained magenta, all kept inside the track. */
.dsh-effort__max-color {
  position: absolute;
  z-index: 1;
  inset: 0;
  overflow: hidden;
  border-radius: 999px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 520ms ease;
  mix-blend-mode: screen;
}

.dsh-effort__max-color-track {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  width: 200%;
  filter: blur(1.2px);
  animation: dsh-effort-max-color-push 12s linear infinite;
  will-change: transform;
}

.dsh-effort[data-level="max"] .dsh-effort__max-color {
  opacity: 0.78;
}

.dsh-effort__tick {
  position: absolute;
  z-index: 3;
  top: 50%;
  width: 1px;
  height: 4px;
  border-radius: 1px;
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 26%, transparent);
  transform: translate(-50%, -50%);
  opacity: 0.8;
  transition: background 420ms ease, opacity 420ms ease, box-shadow 420ms ease;
  pointer-events: none;
}

.dsh-effort__tick[data-active="true"] {
  background: color-mix(in srgb, var(--dsh-effort-accent) 68%, transparent);
  box-shadow: 0 0 6px var(--dsh-effort-glow);
}

.dsh-effort__thumb {
  position: absolute;
  z-index: 7;
  top: 50%;
  left: 0;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  border: 1.5px solid var(--dsh-effort-accent);
  border-radius: 50%;
  background: var(--dsw-alias-bg-layer-1);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--dsh-effort-accent) 11%, transparent),
    0 0 9px var(--dsh-effort-glow),
    0 2px 4px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
  transition:
    left 460ms var(--dsh-effort-ease),
    transform 150ms ease,
    border-color 480ms ease,
    box-shadow 480ms ease;
  cursor: grab;
}

.dsh-effort__thumb::before {
  content: "";
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: radial-gradient(circle at 36% 28%, #ffffff 0%, var(--dsh-effort-accent) 62%, rgba(255, 255, 255, 0.12) 100%);
  box-shadow: 0 0 6px var(--dsh-effort-glow);
}

.dsh-effort__thumb::after {
  content: "";
  position: absolute;
  inset: -4px;
  border: 1px solid rgba(171, 244, 255, 0.55);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 460ms ease;
  pointer-events: none;
}

.dsh-effort__track:hover .dsh-effort__thumb {
  transform: translate(-50%, -50%) scale(1.07);
}

.dsh-effort__track.is-dragging .dsh-effort__thumb {
  transform: translate(-50%, -50%) scale(1.1);
}

.dsh-effort__track.is-dragging .dsh-effort__fill {
  transition:
    background-color 520ms var(--dsh-effort-ease),
    box-shadow 480ms ease;
}

.dsh-effort__track.is-dragging .dsh-effort__thumb {
  transition:
    transform 150ms ease,
    border-color 480ms ease,
    box-shadow 480ms ease;
}

.dsh-effort__track:focus-visible .dsh-effort__rail {
  outline: 2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 76%, transparent);
  outline-offset: -2px;
}

.dsh-effort__labels {
  position: relative;
  z-index: 5;
  height: 11px;
  color: var(--dsw-alias-label-secondary);
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10px;
  font-weight: 500;
  line-height: 11px;
  letter-spacing: 0.02em;
}

.dsh-effort__label {
  position: absolute;
  top: 0;
  white-space: nowrap;
  opacity: 0.66;
  transition: color 420ms ease, opacity 420ms ease, text-shadow 420ms ease;
  pointer-events: none;
}

.dsh-effort__label.is-active {
  color: color-mix(in srgb, var(--dsh-effort-accent) 58%, var(--dsw-alias-label-primary));
  opacity: 1;
}

/* MAX-only electricity and shimmer. The wrapper may extend beyond the blue
   rail, but the module root clips everything to its rounded border, so no
   effect can reach outside the widget. The layer is always mounted and
   cross-fades, so a level change never snaps the effects in or out. */
.dsh-effort__max-fx {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: -16px;
  right: -16px;
  height: 48px;
  transform: translateY(-50%);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 420ms ease,
    visibility 0s linear 420ms;
  pointer-events: none;
}

.dsh-effort[data-level="max"] .dsh-effort__max-fx {
  opacity: 1;
  visibility: visible;
  transition:
    opacity 420ms ease,
    visibility 0s linear 0s;
}

.dsh-effort__max-fx * {
  animation-play-state: paused !important;
}

.dsh-effort[data-level="max"] .dsh-effort__max-fx * {
  animation-play-state: running !important;
}

.dsh-effort__max-bloom {
  position: absolute;
  inset: 0 16px;
  border-radius: 999px;
  background: radial-gradient(
    ellipse at center,
    rgba(161, 248, 255, 0.42),
    rgba(48, 122, 255, 0.14) 45%,
    transparent 72%
  );
  filter: blur(8px);
  opacity: 0.86;
}

/* A horizontal nebula ribbon replaces the old vertical streak field. It is
   built from layered gradients so it reads as flowing gas, not striped bars. */
.dsh-effort__max-aurora {
  position: absolute;
  top: 12px;
  bottom: 12px;
  left: 16px;
  right: 16px;
  border-radius: 999px;
  background:
    linear-gradient(
      100deg,
      transparent 4%,
      rgba(103, 236, 255, 0.3) 28%,
      rgba(101, 119, 255, 0.42) 50%,
      rgba(181, 95, 255, 0.28) 72%,
      transparent 96%
    ),
    radial-gradient(
      ellipse at 50% 50%,
      rgba(164, 233, 255, 0.24),
      transparent 68%
    );
  background-size: 220% 100%, 160% 100%;
  mix-blend-mode: screen;
  filter: blur(1.6px);
  opacity: 0.72;
  animation: dsh-effort-max-aurora 5.4s ease-in-out infinite alternate;
}

.dsh-effort__max-sparks {
  position: absolute;
  inset: 8px 16px;
  background-image:
    radial-gradient(circle at 20% 32%, rgba(255, 255, 255, 0.95) 0 1px, transparent 1.6px),
    radial-gradient(circle at 74% 68%, rgba(139, 242, 255, 0.9) 0 1.2px, transparent 1.8px),
    radial-gradient(circle at 48% 20%, rgba(255, 255, 255, 0.75) 0 0.8px, transparent 1.4px);
  background-repeat: repeat;
  background-size: 88px 100%, 143px 100%, 197px 100%;
  background-position: 0 0, 28px 0, 71px 0;
  mix-blend-mode: screen;
  opacity: 0.82;
  animation: dsh-effort-sparks 2.2s linear infinite;
}

.dsh-effort__max-bolts {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  filter:
    drop-shadow(0 1px 1px rgba(0, 8, 20, 0.9))
    drop-shadow(0 0 2px rgba(255, 255, 255, 0.95))
    drop-shadow(0 0 8px rgba(90, 225, 255, 0.9))
    drop-shadow(0 0 16px rgba(32, 100, 255, 0.5));
}

.dsh-effort__max-bolts path {
  fill: none;
  vector-effect: non-scaling-stroke;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dsh-effort__bolt-glow {
  stroke: rgba(194, 250, 255, 0.26);
  stroke-width: 3;
  filter: blur(2px);
}

.dsh-effort__bolt {
  stroke: url(#dsh-effort-bolt-gradient);
  stroke-width: 1.7;
  stroke-dasharray: 22 78;
  animation: dsh-effort-bolt 1.25s linear infinite;
}

.dsh-effort__bolt--b {
  opacity: 0.8;
  stroke-width: 1.35;
  stroke-dasharray: 9 91;
  animation-duration: 0.92s;
  animation-delay: -0.32s;
}

.dsh-effort__bolt--c {
  opacity: 0.68;
  stroke-width: 1.2;
  stroke-dasharray: 5 95;
  animation-duration: 0.72s;
  animation-delay: -0.16s;
}

/* Deep-space violet flashes, deliberately separate from the blue-white
   lightning so the two rhythms never read as one colour. */
.dsh-effort__max-flash {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  filter:
    drop-shadow(0 0 2px rgba(239, 225, 255, 0.96))
    drop-shadow(0 0 8px rgba(166, 98, 255, 0.9))
    drop-shadow(0 0 18px rgba(75, 35, 170, 0.55));
}

.dsh-effort__max-flash path {
  fill: none;
  vector-effect: non-scaling-stroke;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dsh-effort__flash {
  stroke: #dec4ff;
  stroke-width: 1.85;
  stroke-dasharray: 100 100;
  stroke-dashoffset: 100;
  opacity: 0;
  animation: dsh-effort-bolt-flash 3.6s linear infinite;
}

.dsh-effort__flash--b {
  stroke: #b98fff;
  stroke-width: 1.35;
  animation-delay: -1.8s;
}

.dsh-effort__max-sheen {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -36%;
  width: 34%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.88), transparent);
  filter: blur(2px);
  animation: dsh-effort-max-sheen 3.15s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.dsh-effort[data-level="max"] .dsh-effort__thumb {
  border-color: #e0fdff;
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 70%, #1a70ff);
  box-shadow:
    0 0 0 3px rgba(134, 240, 255, 0.14),
    0 0 10px rgba(104, 231, 255, 0.64),
    0 0 20px rgba(50, 117, 255, 0.38);
}

.dsh-effort[data-level="max"] .dsh-effort__thumb::after {
  opacity: 0.92;
  animation: dsh-effort-thumb-pulse 1.8s ease-out infinite;
}

.dsh-effort[data-level="max"] .dsh-effort__label.is-active {
  text-shadow: 0 0 9px rgba(127, 238, 255, 0.8);
}

@keyframes dsh-effort-rail-drift {
  from { background-position: 0% 0; }
  to { background-position: 220% 0; }
}

@keyframes dsh-effort-star-life {
  0%, 100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.35);
  }
  7% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  14% {
    opacity: 0.16;
    transform: translate(-50%, -50%) scale(0.7);
  }
  29% {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(0.92);
  }
  44% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.45);
  }
}

@keyframes dsh-effort-aurora {
  from { background-position: -140% 0, -100% 0; }
  to { background-position: 140% 0, 120% 0; }
}

@keyframes dsh-effort-aura-wave {
  0%, 100% { transform: translate(-5%, -50%) scaleX(0.94); }
  50% { transform: translate(5%, -50%) scaleX(1.08); }
}

@keyframes dsh-effort-level-sheen {
  0% { left: -42%; opacity: 0; }
  10% { opacity: 0.9; }
  76% { opacity: 0.72; }
  100% { left: 126%; opacity: 0; }
}

@keyframes dsh-effort-level-wave {
  from { background-position: 0 0; }
  to { background-position: 180px 0; }
}

@keyframes dsh-effort-fill-breathe {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.14); }
}

@keyframes dsh-effort-comet {
  0% { left: -34%; opacity: 0; }
  8% { opacity: 0.92; }
  55% { opacity: 0.7; }
  88% { opacity: 0; }
  100% { left: 110%; opacity: 0; }
}

@keyframes dsh-effort-energy {
  0% { left: -38%; opacity: 0; }
  12% { opacity: 0.9; }
  82% { opacity: 0.65; }
  100% { left: 116%; opacity: 0; }
}

@keyframes dsh-effort-halo-breathe {
  0%, 100% { transform: translateY(-50%) scaleX(0.96); filter: blur(12px); }
  50% { transform: translateY(-50%) scaleX(1.04); filter: blur(14px); }
}

@keyframes dsh-effort-iridescence {
  from { background-position: -140% 0; }
  to { background-position: 140% 0; }
}

@keyframes dsh-effort-sheen {
  0% { left: -36%; }
  100% { left: 104%; }
}

@keyframes dsh-effort-sparks {
  from { background-position: 0 0, 28px 0, 71px 0; }
  to { background-position: 88px 0, 171px 0, 268px 0; }
}

@keyframes dsh-effort-bolt {
  to { stroke-dashoffset: -100; }
}

@keyframes dsh-effort-bolt-flash {
  0%, 55% {
    stroke-dashoffset: 100;
    opacity: 0;
  }
  58% {
    stroke-dashoffset: 100;
    opacity: 0.92;
  }
  63% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  65% {
    stroke-dashoffset: 0;
    opacity: 0.35;
  }
  66.5% {
    stroke-dashoffset: 0;
    opacity: 0.9;
  }
  70%, 100% {
    stroke-dashoffset: 0;
    opacity: 0;
  }
}

@keyframes dsh-effort-max-color-push {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}

@keyframes dsh-effort-max-aurora {
  0% {
    background-position: -120% 0, -80% 0;
    opacity: 0.52;
    transform: scaleX(0.98);
  }
  50% {
    opacity: 0.86;
  }
  100% {
    background-position: 120% 0, 90% 0;
    opacity: 0.68;
    transform: scaleX(1.02);
  }
}

@keyframes dsh-effort-max-sheen {
  0% { left: -36%; opacity: 0; }
  8% { opacity: 0.9; }
  60% { opacity: 0.72; }
  76% { left: 104%; opacity: 0; }
  100% { left: 104%; opacity: 0; }
}

@keyframes dsh-effort-thumb-pulse {
  0% { transform: scale(0.8); opacity: 0.8; }
  74%, 100% { transform: scale(1.45); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .dsh-effort__rail::before,
  .dsh-effort__rail::after,
  .dsh-effort__fill,
  .dsh-effort__fill::before,
  .dsh-effort__fill::after,
  .dsh-effort__aurora,
  .dsh-effort__aurora::before,
  .dsh-effort__aurora::after,
  .dsh-effort__aura,
  .dsh-effort__comet,
  .dsh-effort__energy,
  .dsh-effort__halo,
  .dsh-effort__max-fx *,
  .dsh-effort__max-color-track,
  .dsh-effort__star,
  .dsh-effort[data-level="low"] .dsh-effort__thumb::after,
  .dsh-effort[data-level="high"] .dsh-effort__thumb::after,
  .dsh-effort[data-level="max"] .dsh-effort__thumb::after {
    animation: none !important;
  }
  .dsh-effort__fill,
  .dsh-effort__thumb,
  .dsh-effort__halo {
    transition: none;
  }
}

@media (max-width: 760px) {
  .dsh-effort {
    width: 250px;
    width: clamp(190px, 36cqw, 300px);
    padding-left: 10px;
    padding-right: 10px;
  }
  .dsh-effort__labels {
    font-size: 9px;
  }
}
`;

    const clamp01 = (value) => Math.min(1, Math.max(0, value));

    function findModel(groups, selection) {
      if (!selection || !Array.isArray(groups)) return null;
      for (const group of groups) {
        if (!group || group.id !== selection.provider || !Array.isArray(group.models)) continue;
        for (const model of group.models) {
          if (model && model.id === selection.model) return model;
        }
      }
      return null;
    }

    /** This control is for DeepSeek's four native levels; other models hide it. */
    function levelsOf(model) {
      const reasoning = model && model.reasoning;
      if (!reasoning || !Array.isArray(reasoning.efforts)) return null;
      const offered = new Set(
        reasoning.efforts
          .map((effort) => (effort && typeof effort.id === 'string' ? effort.id : null))
          .filter(Boolean)
      );
      if (!LEVEL_ORDER.every((level) => offered.has(level))) return null;
      return LEVEL_ORDER;
    }

    function indexRatio(index, count) {
      return count <= 1 ? 0 : index / (count - 1);
    }

    function nearestIndex(ratio, count) {
      if (count <= 1) return 0;
      return Math.max(0, Math.min(count - 1, Math.round(ratio * (count - 1))));
    }

    function crossedLevelIndex(ratio, count) {
      if (count <= 1) return 0;
      let index = 0;
      for (let candidate = 1; candidate < count; candidate += 1) {
        if (ratio >= indexRatio(candidate, count) - 1e-6) index = candidate;
        else break;
      }
      return index;
    }

    function SliderEntry(props) {
      if (!props.available || !props.directory) return null;
      return h(Slider, props);
    }

    function Slider(props) {
      const { directory, load, select, label } = props;

      const subscribe = React.useCallback(
        (onStoreChange) => directory.subscribe(onStoreChange),
        [directory]
      );
      const getSnapshot = React.useCallback(
        () => directory.getSnapshot(),
        [directory]
      );
      const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

      const [drag, setDrag] = React.useState(null);
      const [failure, setFailure] = React.useState(false);
      const dragRef = React.useRef(null);
      const trackRef = React.useRef(null);
      const pointerIdRef = React.useRef(null);
      const grabOffsetRef = React.useRef(0);

      React.useEffect(() => {
        if (snapshot.status !== 'idle' || typeof load !== 'function') return;
        try {
          load();
        } catch (error) {
          console.warn('[dsh-nova] could not load the model directory:', error);
        }
      }, [snapshot.status, load]);

      const current = snapshot.current;
      const model = findModel(snapshot.groups, current);
      const levels = levelsOf(model);

      const pending = snapshot.pending;
      const pendingForCurrent = Boolean(
        pending &&
        current &&
        pending.provider === current.provider &&
        pending.model === current.model
      );
      const preferredEffort = pendingForCurrent
        ? pending.reasoningEffort
        : current
          ? current.reasoningEffort
          : undefined;
      const effectiveEffort = preferredEffort !== undefined
        ? preferredEffort
        : model && model.reasoning
          ? model.reasoning.defaultEffort
          : undefined;
      const hasActive = Boolean(levels && effectiveEffort !== undefined && levels.includes(effectiveEffort));
      const activeIndex = hasActive ? levels.indexOf(effectiveEffort) : 0;
      const busy = snapshot.status === 'selecting' || pendingForCurrent;

      if (!current || !levels) return null;

      const displayIndex = drag ? drag.index : hasActive ? activeIndex : -1;
      const displayRatio = drag
        ? drag.ratio
        : hasActive
          ? indexRatio(activeIndex, levels.length)
          : 0;
      const displayLevel = displayIndex >= 0 ? levels[displayIndex] : 'off';
      const displayText = levelDisplayName(displayLevel);
      // While dragging, effects switch when the thumb crosses a stop, not when
      // it merely comes nearest to one and not only after release.
      const dragEffectIndex = drag ? crossedLevelIndex(drag.ratio, levels.length) : -1;
      const effectLevel = drag ? levels[dragEffectIndex] : displayLevel;
      const fillPercent = (displayRatio * 100).toFixed(4) + '%';
      const thumbPercent = (displayRatio * 100).toFixed(4) + '%';
      const activeLabelIndex = drag ? dragEffectIndex : hasActive ? activeIndex : -1;

      function beginDrag(event) {
        if (busy) return;
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        const node = trackRef.current;
        if (!node) return;

        event.preventDefault();
        setFailure(false);
        node.focus({ preventScroll: true });

        const rect = node.getBoundingClientRect();
        if (rect.width <= 0) return;

        const activeRatio = hasActive ? indexRatio(activeIndex, levels.length) : 0;
        const thumbX = rect.left + activeRatio * rect.width;
        const target = event.target;
        const grabbedThumb = target instanceof Element && Boolean(target.closest('[data-dsh-effort-thumb="true"]'));
        grabOffsetRef.current = grabbedThumb ? event.clientX - thumbX : 0;

        const ratio = clamp01((event.clientX - grabOffsetRef.current - rect.left) / rect.width);
        const nextDrag = {
          pointerId: event.pointerId,
          ratio,
          index: nearestIndex(ratio, levels.length),
        };
        dragRef.current = nextDrag;
        setDrag(nextDrag);
        pointerIdRef.current = event.pointerId;

        try {
          node.setPointerCapture(event.pointerId);
        } catch (error) {
          /* Pointer capture is an enhancement; dragging still works without it. */
        }
      }

      function moveDrag(event) {
        const activeDrag = dragRef.current;
        const node = trackRef.current;
        if (!activeDrag || !node || event.pointerId !== activeDrag.pointerId) return;

        event.preventDefault();
        const rect = node.getBoundingClientRect();
        if (rect.width <= 0) return;

        const ratio = clamp01((event.clientX - grabOffsetRef.current - rect.left) / rect.width);
        const nextDrag = {
          ...activeDrag,
          ratio,
          index: nearestIndex(ratio, levels.length),
        };
        dragRef.current = nextDrag;
        setDrag(nextDrag);
      }

      function choose(index) {
        if (busy || !current || index < 0 || index >= levels.length) return;
        const level = levels[index];
        if (hasActive && index === activeIndex) return;

        setFailure(false);
        let result;
        try {
          result = select({
            provider: current.provider,
            model: current.model,
            reasoningEffort: level,
          });
        } catch (error) {
          setFailure(true);
          console.warn('[dsh-nova] selection failed:', error);
          return;
        }

        Promise.resolve(result)
          .then((response) => {
            if (!response || response.ok !== true) {
              setFailure(true);
              console.warn('[dsh-nova] selection was rejected:', response);
            }
          })
          .catch((error) => {
            setFailure(true);
            console.warn('[dsh-nova] selection failed:', error);
          });
      }

      function releaseCapture() {
        const node = trackRef.current;
        const pointerId = pointerIdRef.current;
        pointerIdRef.current = null;
        if (!node || pointerId === null) return;
        try {
          if (node.hasPointerCapture(pointerId)) node.releasePointerCapture(pointerId);
        } catch (error) {
          /* The capture may already have been released. */
        }
      }

      function endDrag(commit) {
        const activeDrag = dragRef.current;
        if (!activeDrag) return;
        dragRef.current = null;
        setDrag(null);
        releaseCapture();
        if (commit) choose(activeDrag.index);
      }

      function handleKeyDown(event) {
        const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        if (busy) return;

        let next = hasActive ? activeIndex : 0;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = Math.max(0, next - 1);
        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = Math.min(levels.length - 1, next + 1);
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = levels.length - 1;
        choose(next);
      }

      return h(
        React.Fragment,
        null,
        h('style', { key: 'style' }, CSS),
        h(
          'div',
          {
            key: 'slider',
            className: 'dsh-effort',
            'data-level': effectLevel,
            'data-busy': busy ? 'true' : 'false',
            'data-error': failure ? 'true' : 'false',
          },
          h('span', { className: 'dsh-effort__halo', 'aria-hidden': 'true' }),
          h(
            'span',
            { className: 'dsh-effort__cosmos', 'aria-hidden': 'true' },
            STAR_LEVELS.map((level) =>
              h(
                'span',
                {
                  key: level,
                  className: 'dsh-effort__star-layer',
                  'data-star-level': level,
                  'aria-hidden': 'true',
                },
                h(EffortStarfield, {
                  area: 'cosmos',
                  level,
                  count: STAR_COUNTS[level].cosmos,
                })
              )
            )
          ),
          h('span', { className: 'dsh-effort__aura', 'aria-hidden': 'true' }),
          h(
            'div',
            {
              className: 'dsh-effort__track' + (drag ? ' is-dragging' : ''),
              ref: trackRef,
              role: 'slider',
              tabIndex: 0,
              'aria-label': label || DEFAULT_LABEL,
              'aria-valuemin': 0,
              'aria-valuemax': levels.length - 1,
              'aria-valuenow': hasActive ? activeIndex : 0,
              'aria-valuetext': displayText,
              'aria-busy': busy ? 'true' : undefined,
              'aria-disabled': busy ? 'true' : undefined,
              onPointerDown: beginDrag,
              onPointerMove: moveDrag,
              onPointerUp: () => endDrag(true),
              onPointerCancel: () => endDrag(false),
              onLostPointerCapture: () => {
                if (dragRef.current) endDrag(false);
              },
              onKeyDown: handleKeyDown,
            },
            h(
              'div',
              { className: 'dsh-effort__rail' },
              h('span', {
                className: 'dsh-effort__fill',
                style: { width: fillPercent },
              }),
              h(
                'span',
                { className: 'dsh-effort__max-color', 'aria-hidden': 'true' },
                h('span', {
                  className: 'dsh-effort__max-color-track',
                  'aria-hidden': 'true',
                  style: {
                    background: MAX_COLOR_GRADIENT,
                  },
                })
              ),
              levels.map((level, index) =>
                h('span', {
                  key: 'tick:' + level,
                  className: 'dsh-effort__tick',
                  'data-active': index === activeLabelIndex ? 'true' : 'false',
                  style: { left: (indexRatio(index, levels.length) * 100).toFixed(4) + '%' },
                })
              ),
              h(
                'span',
                { className: 'dsh-effort__bar-stars', 'aria-hidden': 'true' },
                STAR_LEVELS.map((level) =>
                  h(
                    'span',
                    {
                      key: level,
                      className: 'dsh-effort__star-layer',
                      'data-star-level': level,
                      'aria-hidden': 'true',
                    },
                    h(EffortStarfield, {
                      area: 'bar',
                      level,
                      count: STAR_COUNTS[level].bar,
                    })
                  )
                )
              ),
              h('span', { className: 'dsh-effort__aurora', 'aria-hidden': 'true' }),
              h('span', { className: 'dsh-effort__comet dsh-effort__comet--a', 'aria-hidden': 'true' }),
              h('span', { className: 'dsh-effort__comet dsh-effort__comet--b', 'aria-hidden': 'true' }),
              h('span', { className: 'dsh-effort__energy', 'aria-hidden': 'true' })
            ),
            h(
              'span',
              { className: 'dsh-effort__max-fx', 'aria-hidden': 'true' },
              h('span', { className: 'dsh-effort__max-bloom' }),
              h('span', { className: 'dsh-effort__max-aurora' }),
              h('span', { className: 'dsh-effort__max-sparks' }),
              h(
                'svg',
                {
                  className: 'dsh-effort__max-bolts',
                  viewBox: '0 0 420 48',
                  preserveAspectRatio: 'none',
                  focusable: 'false',
                  'aria-hidden': 'true',
                },
                h(
                  'defs',
                  null,
                  h(
                    'linearGradient',
                    {
                      id: 'dsh-effort-bolt-gradient',
                      x1: '0',
                      y1: '0',
                      x2: '420',
                      y2: '0',
                      gradientUnits: 'userSpaceOnUse',
                    },
                    h('stop', { offset: '0', stopColor: '#3a7bff', stopOpacity: '0' }),
                    h('stop', { offset: '0.14', stopColor: '#66ddff', stopOpacity: '0.7' }),
                    h('stop', { offset: '0.35', stopColor: '#ffffff', stopOpacity: '1' }),
                    h('stop', { offset: '0.52', stopColor: '#dcfdff', stopOpacity: '1' }),
                    h('stop', { offset: '0.72', stopColor: '#69e4ff', stopOpacity: '0.88' }),
                    h('stop', { offset: '0.9', stopColor: '#7e9cff', stopOpacity: '0.48' }),
                    h('stop', { offset: '1', stopColor: '#4d6bfe', stopOpacity: '0' })
                  )
                ),
                h('path', {
                  className: 'dsh-effort__bolt-glow',
                  d: 'M -10 25 L 22 18 L 41 30 L 68 14 L 94 28 L 121 20 L 143 34 L 172 12 L 195 27 L 223 17 L 247 31 L 275 13 L 301 26 L 330 16 L 355 30 L 383 19 L 410 27 L 430 21',
                }),
                h('path', {
                  className: 'dsh-effort__bolt',
                  pathLength: 100,
                  d: 'M -10 25 L 22 18 L 41 30 L 68 14 L 94 28 L 121 20 L 143 34 L 172 12 L 195 27 L 223 17 L 247 31 L 275 13 L 301 26 L 330 16 L 355 30 L 383 19 L 410 27 L 430 21',
                }),
                h('path', {
                  className: 'dsh-effort__bolt dsh-effort__bolt--b',
                  pathLength: 100,
                  d: 'M -10 35 L 18 28 L 44 38 L 76 24 L 104 34 L 133 26 L 160 40 L 188 23 L 215 33 L 242 25 L 269 37 L 298 22 L 326 33 L 352 25 L 380 36 L 408 27 L 430 33',
                }),
                h('path', {
                  className: 'dsh-effort__bolt dsh-effort__bolt--c',
                  pathLength: 100,
                  d: 'M -10 15 L 24 25 L 52 11 L 81 23 L 109 15 L 137 28 L 166 18 L 194 30 L 222 13 L 250 25 L 279 18 L 308 29 L 337 15 L 365 26 L 393 17 L 420 24',
                })
              ),
              h(
                'svg',
                {
                  className: 'dsh-effort__max-flash',
                  viewBox: '0 0 420 48',
                  preserveAspectRatio: 'none',
                  focusable: 'false',
                  'aria-hidden': 'true',
                },
                h('path', {
                  className: 'dsh-effort__flash',
                  pathLength: 100,
                  d: 'M -8 24 L 30 19 L 58 31 L 88 16 L 116 28 L 145 21 L 174 34 L 203 14 L 232 27 L 261 19 L 290 32 L 318 17 L 346 30 L 373 20 L 400 28 L 428 22',
                }),
                h('path', {
                  className: 'dsh-effort__flash dsh-effort__flash--b',
                  pathLength: 100,
                  d: 'M -8 34 L 26 27 L 55 38 L 85 23 L 113 35 L 142 26 L 170 40 L 198 24 L 227 34 L 255 26 L 284 37 L 312 22 L 340 34 L 368 25 L 396 36 L 428 30',
                })
              ),
              h('span', { className: 'dsh-effort__max-sheen' })
            ),
            h('span', {
              className: 'dsh-effort__thumb',
              'data-dsh-effort-thumb': 'true',
              style: { left: thumbPercent },
              'aria-hidden': 'true',
            })
          ),
          h(
            'div',
            { className: 'dsh-effort__labels', 'aria-hidden': 'true' },
            levels.map((level, index) => {
              const isFirst = index === 0;
              const isLast = index === levels.length - 1;
              return h(
                'span',
                {
                  key: level,
                  className: 'dsh-effort__label' + (index === activeLabelIndex ? ' is-active' : ''),
                  style: {
                    left: (indexRatio(index, levels.length) * 100).toFixed(4) + '%',
                    transform: isFirst ? 'none' : isLast ? 'translateX(-100%)' : 'translateX(-50%)',
                  },
                },
                levelDisplayName(level)
              );
            })
          )
        )
      );
    }

    const zh = { label: '推理强度' };
    const en = { label: 'Reasoning effort' };

    return {
      name: 'dsh-nova',
      inject: ['slots', 'sessions', 'remote', 'remote.session', 'modelDirectories', 'locale'],
      apply(ctx) {
        ctx.effect(
          () => ctx.locale.register(NS, 'zh', zh),
          'dsh-nova: zh dictionary'
        );
        ctx.effect(
          () => ctx.locale.register(NS, 'en', en),
          'dsh-nova: en dictionary'
        );

        let label = DEFAULT_LABEL;
        try {
          const t = ctx.locale.bind(NS);
          const translated = t('label');
          if (typeof translated === 'string' && translated) label = translated;
        } catch (error) {
          /* The screen-reader label falls back to Chinese if locale is unavailable. */
        }

        const models = ctx.modelDirectories;

        ctx.slots.inject('conversation.input.right', () =>
          ctx.slots.register(
            {
              name: 'conversation.input.right',
              id: 'dsh-nova',
              order: 0,
              inject: (sessionId) => {
                if (sessionId === undefined) return { available: false };
                try {
                  const directory = models.directoryFor(sessionId);
                  return {
                    available: true,
                    directory: directory.store,
                    label,
                    load: () => {
                      try {
                        directory.load().catch((error) => {
                          console.warn('[dsh-nova] directory load failed:', error);
                        });
                      } catch (error) {
                        console.warn('[dsh-nova] directory load failed:', error);
                      }
                    },
                    select: (selection) => directory.select(selection),
                  };
                } catch (error) {
                  console.warn('[dsh-nova] session directory unavailable:', error);
                  return { available: false };
                }
              },
            },
            SliderEntry
          )
        );
      },
    };
  },
});

