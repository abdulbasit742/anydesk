export interface ViewportScale {
  remoteWidth: number;
  remoteHeight: number;
  localWidth: number;
  localHeight: number;
  scaleX: number;
  scaleY: number;
}

export function computeViewportScale(
  remote: { width: number; height: number },
  local: { width: number; height: number },
  fit: 'contain' | 'cover' | 'stretch' = 'contain'
): ViewportScale {
  const sx = local.width / remote.width;
  const sy = local.height / remote.height;
  let scaleX = sx;
  let scaleY = sy;
  if (fit === 'contain') {
    const s = Math.min(sx, sy);
    scaleX = s; scaleY = s;
  } else if (fit === 'cover') {
    const s = Math.max(sx, sy);
    scaleX = s; scaleY = s;
  }
  return { remoteWidth: remote.width, remoteHeight: remote.height, localWidth: local.width, localHeight: local.height, scaleX, scaleY };
}

export function localToRemote(v: ViewportScale, x: number, y: number): { x: number; y: number } {
  return { x: x / v.scaleX, y: y / v.scaleY };
}

export function remoteToLocal(v: ViewportScale, x: number, y: number): { x: number; y: number } {
  return { x: x * v.scaleX, y: y * v.scaleY };
}


