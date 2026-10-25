/**
 * Host half of the reasoning-effort slider bundle.
 *
 * The slider is a Client-only surface over the official per-session
 * model directory. It reads and writes that directory's existing
 * `session.selectModel` contract, so this Host half owns no tool, service,
 * or durable state and intentionally exports an empty apply.
 */
export function apply() {}
