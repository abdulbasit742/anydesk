// CanvasViewport.js — Canvas scaling transformations for smooth zooming
export class CanvasViewport {
  constructor(options = {}) {
    this.scale = options.initialScale || 1;
    this.offsetX = options.offsetX || 0;
    this.offsetY = options.offsetY || 0;
    this.minScale = options.minScale || 0.1;
    this.maxScale = options.maxScale || 4;
  }

  getTransform() {
    return `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
  }

  getMatrix() {
    return [this.scale, 0, 0, this.scale, this.offsetX, this.offsetY];
  }

  screenToCanvas(screenX, screenY) {
    return {
      x: (screenX - this.offsetX) / this.scale,
      y: (screenY - this.offsetY) / this.scale,
    };
  }

  canvasToScreen(canvasX, canvasY) {
    return {
      x: canvasX * this.scale + this.offsetX,
      y: canvasY * this.scale + this.offsetY,
    };
  }

  zoomAt(screenX, screenY, delta) {
    const factor = delta > 0 ? 1.1 : 0.9;
    const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * factor));
    const canvasPos = this.screenToCanvas(screenX, screenY);
    this.scale = newScale;
    this.offsetX = screenX - canvasPos.x * newScale;
    this.offsetY = screenY - canvasPos.y * newScale;
    return this;
  }

  pan(dx, dy) {
    this.offsetX += dx;
    this.offsetY += dy;
    return this;
  }

  fitToContent(nodes, viewWidth, viewHeight, padding = 60) {
    if (!nodes.length) return this;
    const xs = nodes.map(n => [n.x, n.x + (n.width || 160)]).flat();
    const ys = nodes.map(n => [n.y, n.y + (n.height || 60)]).flat();
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const contentW = maxX - minX + padding * 2;
    const contentH = maxY - minY + padding * 2;
    this.scale = Math.min(viewWidth / contentW, viewHeight / contentH, 1);
    this.offsetX = (viewWidth - contentW * this.scale) / 2 - (minX - padding) * this.scale;
    this.offsetY = (viewHeight - contentH * this.scale) / 2 - (minY - padding) * this.scale;
    return this;
  }

  reset() { this.scale = 1; this.offsetX = 0; this.offsetY = 0; return this; }
  serialize() { return { scale: this.scale, offsetX: this.offsetX, offsetY: this.offsetY }; }
  restore(data) { Object.assign(this, data); return this; }
}
