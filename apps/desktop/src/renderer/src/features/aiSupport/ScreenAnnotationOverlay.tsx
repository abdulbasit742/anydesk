import React, { useState, useRef, useCallback } from "react";

interface Annotation {
  id: string;
  x: number;
  y: number;
  type: "circle" | "arrow" | "highlight" | "text";
  label: string;
  color: string;
}

interface ScreenAnnotationOverlayProps {
  visible: boolean;
  onClose: () => void;
  width?: number;
  height?: number;
}

const COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#6366f1", "#0ea5e9"];

export const ScreenAnnotationOverlay: React.FC<ScreenAnnotationOverlayProps> = ({
  visible,
  onClose,
  width = 800,
  height = 600
}) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeTool, setActiveTool] = useState<"circle" | "arrow" | "highlight" | "text">("circle");
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [labelInput, setLabelInput] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const annotation: Annotation = {
      id: `ann-${Date.now()}`,
      x,
      y,
      type: activeTool,
      label: labelInput || activeTool,
      color: activeColor
    };

    setAnnotations(prev => [...prev, annotation]);
  }, [activeTool, activeColor, labelInput]);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {/* Toolbar */}
      <div style={{
        display: "flex",
        gap: 8,
        padding: "8px 16px",
        background: "#1e293b",
        borderRadius: "10px 10px 0 0",
        alignItems: "center",
        width: width
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginRight: 8 }}>🖊️ Annotate Screen</span>
        {(["circle", "arrow", "highlight", "text"] as const).map(tool => (
          <button
            key={tool}
            onClick={() => setActiveTool(tool)}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              border: "none",
              background: activeTool === tool ? "#6366f1" : "#334155",
              color: "#fff",
              cursor: "pointer",
              fontSize: 12
            }}
          >
            {tool === "circle" ? "⭕ Circle" : tool === "arrow" ? "➡️ Arrow" : tool === "highlight" ? "🟡 Highlight" : "📝 Text"}
          </button>
        ))}
        <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
          {COLORS.map(c => (
            <div
              key={c}
              onClick={() => setActiveColor(c)}
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: c,
                cursor: "pointer",
                border: activeColor === c ? "2px solid #fff" : "2px solid transparent"
              }}
            />
          ))}
        </div>
        <input
          value={labelInput}
          onChange={e => setLabelInput(e.target.value)}
          placeholder="Label..."
          style={{ flex: 1, padding: "4px 8px", borderRadius: 6, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: 12 }}
        />
        <button
          onClick={() => setAnnotations([])}
          style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontSize: 12 }}
        >
          Clear
        </button>
        <button
          onClick={onClose}
          style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#334155", color: "#fff", cursor: "pointer", fontSize: 12 }}
        >
          ✕ Close
        </button>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ background: "rgba(15,23,42,0.85)", cursor: "crosshair" }}
        onClick={handleSvgClick}
      >
        {annotations.map(ann => {
          const cx = (ann.x / 100) * width;
          const cy = (ann.y / 100) * height;

          if (ann.type === "circle") {
            return (
              <g key={ann.id}>
                <circle cx={cx} cy={cy} r={30} fill="none" stroke={ann.color} strokeWidth={3} strokeDasharray="6 3" />
                <text x={cx} y={cy - 36} textAnchor="middle" fill={ann.color} fontSize={12} fontWeight="bold">{ann.label}</text>
                <circle cx={cx + 28} cy={cy - 28} r={8} fill="#ef4444" style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); removeAnnotation(ann.id); }} />
                <text x={cx + 28} y={cy - 24} textAnchor="middle" fill="#fff" fontSize={10} style={{ pointerEvents: "none" }}>✕</text>
              </g>
            );
          }

          if (ann.type === "arrow") {
            return (
              <g key={ann.id}>
                <defs>
                  <marker id={`arrow-${ann.id}`} markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill={ann.color} />
                  </marker>
                </defs>
                <line x1={cx - 50} y1={cy - 50} x2={cx} y2={cy} stroke={ann.color} strokeWidth={3} markerEnd={`url(#arrow-${ann.id})`} />
                <text x={cx - 50} y={cy - 56} fill={ann.color} fontSize={12} fontWeight="bold">{ann.label}</text>
              </g>
            );
          }

          if (ann.type === "highlight") {
            return (
              <g key={ann.id}>
                <rect x={cx - 60} y={cy - 20} width={120} height={40} fill={ann.color} fillOpacity={0.3} stroke={ann.color} strokeWidth={2} rx={4} />
                <text x={cx} y={cy + 5} textAnchor="middle" fill={ann.color} fontSize={12} fontWeight="bold">{ann.label}</text>
              </g>
            );
          }

          // text
          return (
            <g key={ann.id}>
              <rect x={cx - 4} y={cy - 16} width={ann.label.length * 8 + 8} height={22} fill="#1e293b" rx={4} />
              <text x={cx} y={cy} fill={ann.color} fontSize={13} fontWeight="bold">{ann.label}</text>
            </g>
          );
        })}
      </svg>

      <div style={{
        padding: "6px 16px",
        background: "#1e293b",
        borderRadius: "0 0 10px 10px",
        width: width,
        fontSize: 11,
        color: "#64748b"
      }}>
        Click anywhere on the screen to add a {activeTool} annotation. {annotations.length} annotation(s) placed.
      </div>
    </div>
  );
};

export default ScreenAnnotationOverlay;
