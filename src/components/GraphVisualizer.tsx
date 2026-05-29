import { useMemo, useState } from 'react';
import type { Algorithm, NodeState } from '../engine/types';
import { usePlayer } from '../engine/usePlayer';
import { GraphView } from './GraphView';
import { CodePanel } from './CodePanel';
import { PlayerControls } from './PlayerControls';

const FILL: Record<NodeState, string> = {
  idle: 'var(--bar)',
  frontier: 'var(--accent)',
  current: 'var(--compare)',
  visited: 'var(--sorted)',
  path: 'var(--found)',
};

// Curated visualizer for graph and tree algorithms. Mirrors CuratedVisualizer
// but renders with GraphView instead of bars. Same player, same code panel.
export function GraphVisualizer({ algo }: { algo: Algorithm }) {
  const [start, setStart] = useState<number>(algo.starts?.[0] ?? 0);
  const trace = useMemo(
    () => (algo.graphCurated ? algo.graphCurated(start) : []),
    [algo, start],
  );
  const { cur, playing, speed, setSpeed, play, step, goto } = usePlayer(trace.length);
  const s = trace[Math.min(cur, Math.max(0, trace.length - 1))];

  return (
    <div className="grid2">
      <div className="card">
        {algo.starts && algo.starts.length > 0 && (
          <div className="row" style={{ marginBottom: 12 }}>
            <label>Đỉnh bắt đầu</label>
            <select
              value={start}
              onChange={(e) => setStart(parseInt(e.target.value, 10))}
              style={{
                background: 'var(--panel-2)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '7px 10px',
                fontFamily: 'var(--mono)',
              }}
            >
              {algo.starts.map((id) => {
                const node = algo.nodes?.find((n) => n.id === id);
                return (
                  <option key={id} value={id}>
                    {node?.label ?? id}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {s && (
          <GraphView
            nodes={algo.nodes ?? []}
            edges={algo.edges ?? []}
            nodeState={s.nodeState}
            activeEdges={s.activeEdges}
            dist={s.dist}
          />
        )}

        {algo.nodeLegend && (
          <div className="legend">
            {algo.nodeLegend.map(([st, label]) => (
              <span key={st}>
                <i className="dot" style={{ background: FILL[st] }} /> {label}
              </span>
            ))}
          </div>
        )}

        <PlayerControls
          cur={cur}
          length={trace.length}
          playing={playing}
          speed={speed}
          onPlay={play}
          onStep={step}
          onSeek={goto}
          onSpeed={setSpeed}
        />

        <div className="narration">{s?.note}</div>
        <div className="vars">
          {s &&
            Object.entries(s.vars).map(([k, v]) => (
              <span key={k}>
                <b>{k}</b> = {Array.isArray(v) ? `[${v.join(', ')}]` : String(v)}
              </span>
            ))}
        </div>
      </div>

      <div className="card">
        <CodePanel source={algo.source} activeLine={s?.line ?? 0} />
        <p className="note" style={{ marginTop: 14 }}>
          Dòng đang thực thi được tô sáng đồng bộ với từng bước bên trái.
        </p>
      </div>
    </div>
  );
}
