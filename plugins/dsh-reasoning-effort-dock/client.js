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
  id: 'dsh-reasoning-effort-dock',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'dsh-reasoning-effort-dock';
    const LEVEL_ORDER = ['off', 'low', 'high', 'max'];
    const DEFAULT_LABEL = '推理强度';

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
  --dsh-effort-fill-color: #6db6ff;
  --dsh-effort-glow: rgba(102, 183, 255, 0.38);
  --dsh-effort-rail-color: color-mix(in srgb, var(--dsw-alias-label-secondary) 18%, var(--dsw-alias-bg-layer-2));
  --dsh-effort-flow-opacity: 0.44;
  --dsh-effort-sheen-opacity: 0.58;
  --dsh-effort-halo-opacity: 0.34;
}

.dsh-effort[data-level="high"] {
  --dsh-effort-accent: #7793ff;
  --dsh-effort-fill-color: #3657f4;
  --dsh-effort-glow: rgba(66, 107, 255, 0.52);
  --dsh-effort-rail-color: color-mix(in srgb, var(--dsw-alias-label-secondary) 18%, var(--dsw-alias-bg-layer-2));
  --dsh-effort-flow-opacity: 0.66;
  --dsh-effort-sheen-opacity: 0.82;
  --dsh-effort-halo-opacity: 0.52;
}

.dsh-effort[data-level="max"] {
  --dsh-effort-accent: #c5fbff;
  --dsh-effort-fill-color: #28c2ff;
  --dsh-effort-glow: rgba(94, 229, 255, 0.68);
  --dsh-effort-rail-color: color-mix(in srgb, var(--dsw-alias-label-secondary) 18%, var(--dsw-alias-bg-layer-2));
  --dsh-effort-flow-opacity: 0.98;
  --dsh-effort-sheen-opacity: 1;
  --dsh-effort-halo-opacity: 1;
  border-color: color-mix(in srgb, #8ff2ff 30%, var(--dsw-alias-border-l1));
}

.dsh-effort[data-error="true"] {
  border-color: var(--dsw-alias-state-error-primary);
}

.dsh-effort[data-busy="true"] .dsh-effort__track {
  cursor: progress;
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
  pointer-events: none;
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
  outline-offset: 4px;
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

/* MAX-only electricity. All non-lightning motion is clipped to the rail and
   fill; this wrapper is the only intentional overflow layer, so it contains
   lightning and nothing else. The layer is always mounted and cross-fades, so
   a level change never snaps the lightning in or out. */
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

/* Two sharp, full-bar flashes. The stroke is drawn across the whole track in a
   fraction of the cycle, then disappears again before the next pass. */
.dsh-effort__bolt--flash {
  stroke: #f2ffff;
  stroke-width: 1.85;
  stroke-dasharray: 100 100;
  stroke-dashoffset: 100;
  opacity: 0;
  filter: drop-shadow(0 0 4px rgba(225, 254, 255, 0.95));
  animation: dsh-effort-bolt-flash 3.6s linear infinite;
}

.dsh-effort__bolt--flash-b {
  stroke-width: 1.35;
  animation-delay: -1.8s;
  filter: drop-shadow(0 0 3px rgba(176, 248, 255, 0.8));
}

.dsh-effort[data-level="max"] .dsh-effort__thumb {
  border-color: #e0fdff;
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 70%, #1a70ff);
  box-shadow:
    0 0 0 3px rgba(134, 240, 255, 0.14),
    0 0 8px rgba(104, 231, 255, 0.56);
}

.dsh-effort[data-level="max"] .dsh-effort__label.is-active {
  text-shadow: 0 0 9px rgba(127, 238, 255, 0.8);
}

@keyframes dsh-effort-rail-drift {
  from { background-position: 0% 0; }
  to { background-position: 220% 0; }
}

@keyframes dsh-effort-iridescence {
  from { background-position: -140% 0; }
  to { background-position: 140% 0; }
}

@keyframes dsh-effort-sheen {
  0% { left: -36%; }
  100% { left: 104%; }
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

@media (prefers-reduced-motion: reduce) {
  .dsh-effort__rail::before,
  .dsh-effort__fill::before,
  .dsh-effort__fill::after,
  .dsh-effort__max-fx * {
    animation: none !important;
  }
  .dsh-effort__fill,
  .dsh-effort__thumb {
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
          console.warn('[dsh-reasoning-effort-dock] could not load the model directory:', error);
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
      const fillPercent = (displayRatio * 100).toFixed(4) + '%';
      const thumbPercent = (displayRatio * 100).toFixed(4) + '%';
      const activeLabelIndex = drag ? drag.index : hasActive ? activeIndex : -1;

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
          console.warn('[dsh-reasoning-effort-dock] selection failed:', error);
          return;
        }

        Promise.resolve(result)
          .then((response) => {
            if (!response || response.ok !== true) {
              setFailure(true);
              console.warn('[dsh-reasoning-effort-dock] selection was rejected:', response);
            }
          })
          .catch((error) => {
            setFailure(true);
            console.warn('[dsh-reasoning-effort-dock] selection failed:', error);
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
            'data-level': displayLevel,
            'data-busy': busy ? 'true' : 'false',
            'data-error': failure ? 'true' : 'false',
          },
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
              'aria-valuetext': displayLevel,
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
              levels.map((level, index) =>
                h('span', {
                  key: 'tick:' + level,
                  className: 'dsh-effort__tick',
                  'data-active': index === activeLabelIndex ? 'true' : 'false',
                  style: { left: (indexRatio(index, levels.length) * 100).toFixed(4) + '%' },
                })
              )
            ),
            h(
              'span',
              { className: 'dsh-effort__max-fx', 'aria-hidden': 'true' },
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
                }),
                h('path', {
                  className: 'dsh-effort__bolt dsh-effort__bolt--flash',
                  pathLength: 100,
                  d: 'M -8 24 L 30 19 L 58 31 L 88 16 L 116 28 L 145 21 L 174 34 L 203 14 L 232 27 L 261 19 L 290 32 L 318 17 L 346 30 L 373 20 L 400 28 L 428 22',
                }),
                h('path', {
                  className: 'dsh-effort__bolt dsh-effort__bolt--flash dsh-effort__bolt--flash-b',
                  pathLength: 100,
                  d: 'M -8 34 L 26 27 L 55 38 L 85 23 L 113 35 L 142 26 L 170 40 L 198 24 L 227 34 L 255 26 L 284 37 L 312 22 L 340 34 L 368 25 L 396 36 L 428 30',
                })
              )
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
                level
              );
            })
          )
        )
      );
    }

    const zh = { label: '推理强度' };
    const en = { label: 'Reasoning effort' };

    return {
      name: 'dsh-reasoning-effort-dock',
      inject: ['slots', 'sessions', 'remote', 'remote.session', 'modelDirectories', 'locale'],
      apply(ctx) {
        ctx.effect(
          () => ctx.locale.register(NS, 'zh', zh),
          'dsh-reasoning-effort-dock: zh dictionary'
        );
        ctx.effect(
          () => ctx.locale.register(NS, 'en', en),
          'dsh-reasoning-effort-dock: en dictionary'
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
              id: 'dsh-reasoning-effort-dock',
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
                          console.warn('[dsh-reasoning-effort-dock] directory load failed:', error);
                        });
                      } catch (error) {
                        console.warn('[dsh-reasoning-effort-dock] directory load failed:', error);
                      }
                    },
                    select: (selection) => directory.select(selection),
                  };
                } catch (error) {
                  console.warn('[dsh-reasoning-effort-dock] session directory unavailable:', error);
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

