import type { NormalizedInputEvent } from './inputExecutor.js';

export interface ValidationResult {
  ok: boolean;
  reason?: string;
}

const ALLOWED_KEYS = new Set(['Backspace','Tab','Enter','Shift','Control','Alt','Meta','Escape','Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Delete','Home','End','PageUp','PageDown']);

function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function validateNormalizedInputEvent(value: unknown): ValidationResult {
  if (typeof value !== 'object' || value === null || !('type' in value)) return { ok: false, reason: 'input event must be an object' };
  const event = value as NormalizedInputEvent;
  if (!finite(event.at) || Math.abs(Date.now() - event.at) > 30000) return { ok: false, reason: 'input event timestamp is stale or invalid' };
  switch (event.type) {
    case 'pointer.move':
      if (!finite(event.x) || !finite(event.y) || !finite(event.viewportWidth) || !finite(event.viewportHeight)) return { ok: false, reason: 'invalid pointer coordinates' };
      if (event.viewportWidth <= 0 || event.viewportHeight <= 0) return { ok: false, reason: 'invalid viewport size' };
      if (event.x < 0 || event.y < 0 || event.x > event.viewportWidth || event.y > event.viewportHeight) return { ok: false, reason: 'pointer outside viewport' };
      return { ok: true };
    case 'pointer.button':
      if (!['left', 'right', 'middle'].includes(event.button) || !['down', 'up'].includes(event.action)) return { ok: false, reason: 'invalid pointer button action' };
      if (!finite(event.x) || !finite(event.y)) return { ok: false, reason: 'invalid pointer button coordinates' };
      return { ok: true };
    case 'pointer.wheel':
      if (!finite(event.deltaX) || !finite(event.deltaY) || Math.abs(event.deltaX) > 5000 || Math.abs(event.deltaY) > 5000) return { ok: false, reason: 'wheel delta out of range' };
      return { ok: true };
    case 'keyboard.key':
      if (!['down', 'up'].includes(event.action)) return { ok: false, reason: 'invalid key action' };
      if (event.key.length > 1 && !ALLOWED_KEYS.has(event.key)) return { ok: false, reason: 'key is not normalized' };
      if (event.code.length > 40) return { ok: false, reason: 'key code too long' };
      return { ok: true };
    default:
      return { ok: false, reason: 'unsupported input event type' };
  }
}
