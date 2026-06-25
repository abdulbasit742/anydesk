// WorkflowCanvas.jsx — Visual workflow editor showing step nodes and connectors
import { StepNode } from './StepNode.jsx';
import { StepConnector } from './StepConnector.jsx';

export function WorkflowCanvas({ workflow, steps = [] }) {
  const NODE_W = 180, NODE_H = 72, H_GAP = 60, START_X = 40, START_Y = 80;

  const nodes = steps.map((step, i) => ({
    ...step,
    x: START_X + i * (NODE_W + H_GAP),
    y: START_Y,
    width: NODE_W,
    height: NODE_H,
  }));

  const totalWidth = nodes.length * (NODE_W + H_GAP) + START_X;

  return (
    <div style={{ background: '#0d1020', border: '1px solid #1e2340', borderRadius: 12, overflow: 'auto', fontFamily: 'monospace' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e2340', color: '#555', fontSize: 12 }}>
        {workflow?.icon} {workflow?.name} — CANVAS VIEW
      </div>
      <div style={{ position: 'relative', width: Math.max(totalWidth + START_X, 400), height: 200, padding: 20 }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
          {nodes.slice(0, -1).map((node, i) => (
            <StepConnector key={i} from={{ x: node.x + NODE_W, y: node.y + NODE_H / 2 }} to={{ x: nodes[i + 1].x, y: nodes[i + 1].y + NODE_H / 2 }} />
          ))}
        </svg>
        {nodes.map((node, i) => <StepNode key={node.id || i} node={node} index={i} />)}
      </div>
    </div>
  );
}
