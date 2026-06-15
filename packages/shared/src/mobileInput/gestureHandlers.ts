import { TouchEventPayload } from './gestureTypes.js';

export interface GestureState {
  startX: number;
  startY: number;
  startTime: number;
  startDistance?: number;
  lastX: number;
  lastY: number;
  pointers: Map<number, { x: number; y: number }>;
}

export function createGestureState(): GestureState {
  return { startX: 0, startY: 0, startTime: 0, lastX: 0, lastY: 0, pointers: new Map() };
}

export function addPointer(s: GestureState, id: number, x: number, y: number): GestureState {
  const next = { ...s, pointers: new Map(s.pointers) };
  next.pointers.set(id, { x, y });
  if (next.pointers.size === 1) {
    next.startX = x; next.startY = y; next.startTime = Date.now(); next.lastX = x; next.lastY = y;
  }
  return next;
}

export function removePointer(s: GestureState, id: number): GestureState {
  const next = { ...s, pointers: new Map(s.pointers) };
  next.pointers.delete(id);
  return next;
}

export function updatePointer(s: GestureState, id: number, x: number, y: number): GestureState {
  const next = { ...s, pointers: new Map(s.pointers) };
  next.pointers.set(id, { x, y });
  next.lastX = x; next.lastY = y;
  return next;
}

export function computePanDelta(s: GestureState): { dx: number; dy: number } {
  return { dx: s.lastX - s.startX, dy: s.lastY - s.startY };
}

export function computePinchScale(s: GestureState): number | undefined {
  const pts = Array.from(s.pointers.values());
  if (pts.length < 2) return undefined;
  const d0 = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  return s.startDistance ? d0 / s.startDistance : undefined;
}

export function classifyGesture(
  s: GestureState,
  ended: boolean,
  maxTapDuration = 300,
  maxTapDistance = 10
): TouchEventPayload['action'] | null {
  if (!ended) return null;
  const dx = s.lastX - s.startX;
  const dy = s.lastY - s.startY;
  const dist = Math.hypot(dx, dy);
  const duration = Date.now() - s.startTime;
  if (duration < maxTapDuration && dist < maxTapDistance) return 'tap';
  if (duration >= 500 && dist < maxTapDistance) return 'long_press';
  if (s.pointers.size === 2 && s.startDistance && dist > 20) return 'scroll';
  if (dist > maxTapDistance) return 'pan';
  return null;
}


