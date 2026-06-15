export interface PinchZoomState {
  scale: number;
  offsetX: number;
  offsetY: number;
  minScale: number;
  maxScale: number;
}

export function createPinchZoomState(
  minScale = 0.5,
  maxScale = 3
): PinchZoomState {
  return { scale: 1, offsetX: 0, offsetY: 0, minScale, maxScale };
}

export function applyPinch(
  state: PinchZoomState,
  newScale: number,
  centerX: number,
  centerY: number
): PinchZoomState {
  const clamped = Math.max(state.minScale, Math.min(state.maxScale, newScale));
  const ratio = clamped / state.scale;
  const next = {
    scale: clamped,
    offsetX: state.offsetX + (centerX - state.offsetX) * (1 - ratio),
    offsetY: state.offsetY + (centerY - state.offsetY) * (1 - ratio),
    minScale: state.minScale,
    maxScale: state.maxScale,
  };
  return next;
}

export function applyPan(
  state: PinchZoomState,
  dx: number,
  dy: number
): PinchZoomState {
  return { ...state, offsetX: state.offsetX + dx, offsetY: state.offsetY + dy };
}

export function resetZoom(state: PinchZoomState): PinchZoomState {
  return { ...state, scale: 1, offsetX: 0, offsetY: 0 };
}


