// GridPainter.js — Dark-themed dot-matrix backdrop with adaptive zooming
export function paintDotGrid(ctx, options = {}) {
  const {
    width, height,
    offsetX = 0, offsetY = 0,
    scale = 1,
    dotColor = 'rgba(255,255,255,0.12)',
    dotRadius = 1.5,
    spacing = 30,
  } = options;

  ctx.clearRect(0, 0, width, height);

  const scaledSpacing = spacing * scale;
  const startX = ((offsetX % scaledSpacing) + scaledSpacing) % scaledSpacing;
  const startY = ((offsetY % scaledSpacing) + scaledSpacing) % scaledSpacing;

  ctx.fillStyle = dotColor;

  for (let x = startX; x < width; x += scaledSpacing) {
    for (let y = startY; y < height; y += scaledSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, dotRadius * Math.min(scale, 1.5), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function paintLineGrid(ctx, options = {}) {
  const {
    width, height,
    offsetX = 0, offsetY = 0,
    scale = 1,
    lineColor = 'rgba(255,255,255,0.05)',
    spacing = 40,
  } = options;

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;

  const scaledSpacing = spacing * scale;
  const startX = ((offsetX % scaledSpacing) + scaledSpacing) % scaledSpacing;
  const startY = ((offsetY % scaledSpacing) + scaledSpacing) % scaledSpacing;

  for (let x = startX; x < width; x += scaledSpacing) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = startY; y < height; y += scaledSpacing) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }
}

export function getAdaptiveSpacing(scale) {
  if (scale < 0.3) return 120;
  if (scale < 0.6) return 60;
  if (scale < 1.2) return 30;
  return 20;
}
