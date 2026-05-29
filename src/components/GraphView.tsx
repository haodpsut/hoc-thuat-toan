import type { GraphEdge, GraphNode, NodeState } from '../engine/types';

const FILL: Record<NodeState, string> = {
  idle: 'var(--bar)',
  frontier: 'var(--accent)',
  current: 'var(--compare)',
  visited: 'var(--sorted)',
  path: 'var(--found)',
};

function edgeKey(a: number, b: number) {
  return `${a}-${b}`;
}

// Renders a graph or tree as SVG nodes + edges. A node absent from `nodeState`
// is treated as not-yet-present (hidden) so a tree can grow as nodes are
// inserted. Edges show only when both endpoints are visible, and highlight when
// their key appears in `activeEdges` (either orientation).
export function GraphView({
  nodes,
  edges,
  nodeState,
  activeEdges,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeState: Record<number, NodeState>;
  activeEdges: string[];
}) {
  const R = 19;
  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs) - R - 8;
  const minY = Math.min(...ys) - R - 22;
  const W = Math.max(...xs) - minX + R + 8;
  const H = Math.max(...ys) - minY + R + 8;
  const visible = (id: number) => nodeState[id] !== undefined;
  const active = new Set(activeEdges);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="viz" style={{ height: 'auto', alignItems: 'center', paddingTop: 12 }}>
      <svg width="100%" viewBox={`${minX} ${minY} ${W} ${H}`} style={{ maxHeight: 340 }} role="img">
        {edges.map((e, i) => {
          if (!visible(e.from) || !visible(e.to)) return null;
          const a = byId[e.from];
          const b = byId[e.to];
          const on = active.has(edgeKey(e.from, e.to)) || active.has(edgeKey(e.to, e.from));
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={on ? 'var(--accent)' : 'var(--border)'}
              strokeWidth={on ? 3.5 : 2}
            />
          );
        })}
        {nodes.map((n) => {
          if (!visible(n.id)) return null;
          const st = nodeState[n.id];
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={R} fill={FILL[st]} stroke="#0b1020" strokeWidth="1.5" />
              <text
                x={n.x}
                y={n.y + 4}
                fontSize="13"
                fontWeight="700"
                fill={st === 'idle' || st === 'frontier' ? '#0b1020' : '#0b1020'}
                textAnchor="middle"
                fontFamily="var(--mono)"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
