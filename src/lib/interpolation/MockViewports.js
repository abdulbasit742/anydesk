// MockViewports.js — Emulates visual preview panels for successful broadcast runs
export function createViewportConfig(url, options = {}) {
  return {
    id: Math.random().toString(36).slice(2),
    url: url || 'http://localhost:3000',
    title: options.title || 'Preview',
    width: options.width || 1280,
    height: options.height || 720,
    scale: options.scale || 0.6,
    platform: options.platform || 'unknown',
    status: 'loading',
    refreshCount: 0,
    createdAt: Date.now(),
  };
}

export function simulateViewportLoad(viewport, onUpdate) {
  const steps = [
    { delay: 200, status: 'connecting', message: 'Connecting to preview server...' },
    { delay: 400, status: 'loading', message: 'Loading application...' },
    { delay: 600, status: 'rendering', message: 'Rendering components...' },
    { delay: 200, status: 'ready', message: 'Preview ready' },
  ];

  let elapsed = 0;
  steps.forEach(step => {
    elapsed += step.delay;
    setTimeout(() => onUpdate({ ...viewport, status: step.status, message: step.message }), elapsed);
  });

  return elapsed;
}

export function getViewportFrame(viewport) {
  const { width, height, scale } = viewport;
  return {
    containerWidth: Math.round(width * scale),
    containerHeight: Math.round(height * scale),
    iframeStyle: {
      width: `${width}px`,
      height: `${height}px`,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      border: 'none',
      borderRadius: 4,
    },
  };
}
