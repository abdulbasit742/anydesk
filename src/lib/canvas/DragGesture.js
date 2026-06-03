// DragGesture.js — Physics-based drag and scroll handler for flowchart panning
export class DragGesture {
  constructor(container, options = {}) {
    this.container = container;
    this.options = { friction: 0.88, minVelocity: 0.5, ...options };
    this.isPanning = false;
    this.origin = { x: 0, y: 0 };
    this.offset = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.lastPos = { x: 0, y: 0 };
    this.animFrame = null;
    this.listeners = [];
    this._bind();
  }

  _bind() {
    const el = this.container;
    el.addEventListener('mousedown', this._onMouseDown);
    el.addEventListener('touchstart', this._onTouchStart, { passive: false });
    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup', this._onMouseUp);
    window.addEventListener('touchmove', this._onTouchMove, { passive: false });
    window.addEventListener('touchend', this._onMouseUp);
  }

  _onMouseDown = (e) => {
    if (e.button !== 1 && !e.spaceKey && !this.options.alwaysPan) return;
    this._startPan(e.clientX, e.clientY);
    e.preventDefault();
  };

  _onTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    this._startPan(e.touches[0].clientX, e.touches[0].clientY);
  };

  _startPan(x, y) {
    this.isPanning = true;
    this.origin = { x, y };
    this.lastPos = { x, y };
    this.velocity = { x: 0, y: 0 };
    cancelAnimationFrame(this.animFrame);
    this.options.onStart?.(this.offset);
  }

  _onMouseMove = (e) => this._movePan(e.clientX, e.clientY);
  _onTouchMove = (e) => {
    if (!this.isPanning) return;
    e.preventDefault();
    this._movePan(e.touches[0].clientX, e.touches[0].clientY);
  };

  _movePan(x, y) {
    if (!this.isPanning) return;
    const dx = x - this.lastPos.x;
    const dy = y - this.lastPos.y;
    this.velocity = { x: dx, y: dy };
    this.lastPos = { x, y };
    this.offset = { x: this.offset.x + dx, y: this.offset.y + dy };
    this.options.onMove?.(this.offset);
  }

  _onMouseUp = () => {
    if (!this.isPanning) return;
    this.isPanning = false;
    this._applyMomentum();
    this.options.onEnd?.(this.offset);
  };

  _applyMomentum() {
    const step = () => {
      this.velocity.x *= this.options.friction;
      this.velocity.y *= this.options.friction;
      if (Math.abs(this.velocity.x) < this.options.minVelocity && Math.abs(this.velocity.y) < this.options.minVelocity) return;
      this.offset.x += this.velocity.x;
      this.offset.y += this.velocity.y;
      this.options.onMove?.(this.offset);
      this.animFrame = requestAnimationFrame(step);
    };
    this.animFrame = requestAnimationFrame(step);
  }

  destroy() {
    const el = this.container;
    el.removeEventListener('mousedown', this._onMouseDown);
    el.removeEventListener('touchstart', this._onTouchStart);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);
    window.removeEventListener('touchmove', this._onTouchMove);
    window.removeEventListener('touchend', this._onMouseUp);
    cancelAnimationFrame(this.animFrame);
  }
}
