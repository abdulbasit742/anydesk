// AutoLayout.js — Horizontal pipelines, vertical cascades, zig-zag matrix layouts
const DEFAULT_SPACING = { x: 220, y: 100 };

export function layoutHorizontalPipeline(nodes, startX = 60, startY = 200, spacing = DEFAULT_SPACING) {
  return nodes.map((node, i) => ({
    ...node,
    x: startX + i * (spacing.x + (node.width || 160)),
    y: startY,
  }));
}

export function layoutVerticalCascade(nodes, startX = 200, startY = 60, spacing = DEFAULT_SPACING) {
  return nodes.map((node, i) => ({
    ...node,
    x: startX,
    y: startY + i * (spacing.y + (node.height || 60)),
  }));
}

export function layoutZigZagMatrix(nodes, cols = 3, startX = 60, startY = 60, spacing = DEFAULT_SPACING) {
  return nodes.map((node, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const xOffset = row % 2 === 1 ? spacing.x / 2 : 0;
    return {
      ...node,
      x: startX + col * (spacing.x + (node.width || 160)) + xOffset,
      y: startY + row * (spacing.y + (node.height || 60)),
    };
  });
}

export function layoutGrid(nodes, cols = 4, startX = 60, startY = 60, spacing = DEFAULT_SPACING) {
  return nodes.map((node, i) => ({
    ...node,
    x: startX + (i % cols) * (spacing.x + (node.width || 160)),
    y: startY + Math.floor(i / cols) * (spacing.y + (node.height || 60)),
  }));
}

export function layoutRadial(nodes, centerX = 500, centerY = 400, radius = 250) {
  return nodes.map((node, i) => {
    const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...node,
      x: centerX + Math.cos(angle) * radius - (node.width || 160) / 2,
      y: centerY + Math.sin(angle) * radius - (node.height || 60) / 2,
    };
  });
}

export const AUTO_LAYOUTS = {
  pipeline: layoutHorizontalPipeline,
  cascade: layoutVerticalCascade,
  zigzag: layoutZigZagMatrix,
  grid: layoutGrid,
  radial: layoutRadial,
};
