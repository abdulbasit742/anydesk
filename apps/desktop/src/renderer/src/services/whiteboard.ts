/**
 * Whiteboard / Annotation Overlay Service
 * Provides drawing tools on top of the remote desktop stream.
 * Annotations are shared via the data channel so both sides see them.
 */

export type WhiteboardTool = "pen" | "highlighter" | "arrow" | "rectangle" | "text" | "eraser";

export interface WhiteboardPoint {
  x: number; // 0-1 normalized
  y: number; // 0-1 normalized
}

export interface WhiteboardStroke {
  id: string;
  tool: WhiteboardTool;
  color: string;
  width: number;
  points: WhiteboardPoint[];
  text?: string;
  timestamp: number;
}

export interface WhiteboardMessage {
  kind: "whiteboard.stroke";
  stroke: WhiteboardStroke;
}

export interface WhiteboardClearMessage {
  kind: "whiteboard.clear";
}

export type WhiteboardChannelMessage = WhiteboardMessage | WhiteboardClearMessage;

export function isWhiteboardMessage(value: unknown): value is WhiteboardChannelMessage {
  if (typeof value !== "object" || value === null || !("kind" in value)) return false;
  const kind = String((value as { kind: unknown }).kind);
  return kind.startsWith("whiteboard.");
}

export class WhiteboardCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private strokes: WhiteboardStroke[] = [];
  private currentStroke: WhiteboardStroke | null = null;
  private isDrawing = false;
  private tool: WhiteboardTool = "pen";
  private color = "#ff0000";
  private lineWidth = 3;
  private onStrokeComplete?: (stroke: WhiteboardStroke) => void;
  private onClear?: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.setupEventListeners();
  }

  setTool(tool: WhiteboardTool): void {
    this.tool = tool;
  }

  setColor(color: string): void {
    this.color = color;
  }

  setLineWidth(width: number): void {
    this.lineWidth = width;
  }

  setOnStrokeComplete(callback: (stroke: WhiteboardStroke) => void): void {
    this.onStrokeComplete = callback;
  }

  setOnClear(callback: () => void): void {
    this.onClear = callback;
  }

  addRemoteStroke(stroke: WhiteboardStroke): void {
    this.strokes.push(stroke);
    this.redraw();
  }

  clear(): void {
    this.strokes = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.onClear?.();
  }

  clearAll(): void {
    this.strokes = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getStrokes(): WhiteboardStroke[] {
    return [...this.strokes];
  }

  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.redraw();
  }

  dispose(): void {
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener("pointerdown", this.handlePointerDown);
    this.canvas.addEventListener("pointermove", this.handlePointerMove);
    this.canvas.addEventListener("pointerup", this.handlePointerUp);
    this.canvas.addEventListener("pointerleave", this.handlePointerUp);
  }

  private handlePointerDown = (e: PointerEvent): void => {
    this.isDrawing = true;
    const point = this.normalizePoint(e);
    this.currentStroke = {
      id: `stroke_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      tool: this.tool,
      color: this.tool === "eraser" ? "rgba(0,0,0,0)" : this.color,
      width: this.tool === "highlighter" ? this.lineWidth * 3 : this.lineWidth,
      points: [point],
      timestamp: Date.now(),
    };
  };

  private handlePointerMove = (e: PointerEvent): void => {
    if (!this.isDrawing || !this.currentStroke) return;
    const point = this.normalizePoint(e);
    this.currentStroke.points.push(point);
    this.redraw();
    this.drawStroke(this.currentStroke);
  };

  private handlePointerUp = (): void => {
    if (!this.isDrawing || !this.currentStroke) return;
    this.isDrawing = false;
    this.strokes.push(this.currentStroke);
    this.onStrokeComplete?.(this.currentStroke);
    this.currentStroke = null;
    this.redraw();
  };

  private normalizePoint(e: PointerEvent): WhiteboardPoint {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }

  private redraw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const stroke of this.strokes) {
      this.drawStroke(stroke);
    }
  }

  private drawStroke(stroke: WhiteboardStroke): void {
    if (stroke.points.length < 2) return;
    const { width, height } = this.canvas;

    this.ctx.beginPath();
    this.ctx.strokeStyle = stroke.color;
    this.ctx.lineWidth = stroke.width;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    if (stroke.tool === "highlighter") {
      this.ctx.globalAlpha = 0.4;
    } else {
      this.ctx.globalAlpha = 1;
    }

    if (stroke.tool === "eraser") {
      this.ctx.globalCompositeOperation = "destination-out";
    } else {
      this.ctx.globalCompositeOperation = "source-over";
    }

    const first = stroke.points[0];
    this.ctx.moveTo(first.x * width, first.y * height);

    for (let i = 1; i < stroke.points.length; i++) {
      const p = stroke.points[i];
      this.ctx.lineTo(p.x * width, p.y * height);
    }

    this.ctx.stroke();
    this.ctx.globalAlpha = 1;
    this.ctx.globalCompositeOperation = "source-over";
  }
}
