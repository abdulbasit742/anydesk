// CanvasHistory.js — Canvas layout, coordinate, and node positioning history
const MAX_HISTORY = 40;

export class CanvasHistory {
  constructor() {
    this.past = [];
    this.present = null;
    this.future = [];
  }

  snapshot(nodes, edges, viewport) {
    if (this.present) {
      this.past.push(this.present);
      if (this.past.length > MAX_HISTORY) this.past.shift();
    }
    this.present = {
      nodes: nodes.map(n => ({ ...n })),
      edges: edges.map(e => ({ ...e })),
      viewport: { ...viewport },
      ts: Date.now(),
    };
    this.future = [];
  }

  undo() {
    if (!this.past.length) return null;
    this.future.unshift(this.present);
    this.present = this.past.pop();
    return this.present;
  }

  redo() {
    if (!this.future.length) return null;
    this.past.push(this.present);
    this.present = this.future.shift();
    return this.present;
  }

  canUndo() { return this.past.length > 0; }
  canRedo() { return this.future.length > 0; }
  clear() { this.past = []; this.future = []; this.present = null; }

  getStats() {
    return {
      pastCount: this.past.length,
      futureCount: this.future.length,
      hasCurrent: !!this.present,
    };
  }
}
