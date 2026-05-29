import { useMemo } from 'react';
import type { Algorithm } from '../engine/types';

// Pillar 5: complexity analysis. Fully data-driven: the prose comes from
// algo.complexityNotes, and the empirical chart is shown only when the
// algorithm provides an opCount function. Works for any algorithm.
export function Complexity({ algo }: { algo: Algorithm }) {
  const sizes = [8, 16, 32, 48, 64, 96, 128, 192, 256];
  const data = useMemo(
    () => (algo.opCount ? sizes.map((n) => ({ n, c: algo.opCount!(n) })) : []),
    [algo],
  );

  return (
    <div className="grid2">
      <div className="card">
        <div className="complexity">
          <span>Trường hợp tốt nhất: <b>{algo.best}</b></span>
          <span>Trung bình / xấu nhất: <b>{algo.big}</b></span>
          <span>Bộ nhớ: <b>{algo.space}</b></span>
        </div>
        {algo.complexityNotes.map((note, i) => (
          <p key={i} className="note" style={{ marginTop: 12 }}>{note}</p>
        ))}
      </div>
      {data.length > 0 && <Chart data={data} label={algo.opCountLabel ?? ''} />}
    </div>
  );
}

function Chart({ data, label }: { data: { n: number; c: number }[]; label: string }) {
  const maxC = Math.max(...data.map((d) => d.c));
  const W = 460;
  const H = 200;
  const pad = 30;
  const x = (i: number) => pad + (i / (data.length - 1)) * (W - 2 * pad);
  const y = (c: number) => H - pad - (c / maxC) * (H - 2 * pad);
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.c)}`).join(' ');
  const ref = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y((d.n * d.n) / 2)}`).join(' ');

  return (
    <div className="card">
      {label && <p className="note" style={{ marginTop: 0 }}>{label}</p>}
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img">
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#2a2f3e" />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#2a2f3e" />
        <path d={ref} fill="none" stroke="#5f6b85" strokeDasharray="5 5" strokeWidth="1.5" />
        <path d={path} fill="none" stroke="#6ea8fe" strokeWidth="2.5" />
        {data.map((d, i) => (
          <g key={d.n}>
            <circle cx={x(i)} cy={y(d.c)} r="3.5" fill="#6ea8fe" />
            <text x={x(i)} y={H - pad + 16} fontSize="10" fill="#9aa3b2" textAnchor="middle">
              {d.n}
            </text>
          </g>
        ))}
        <text x={W - pad} y={H - pad + 26} fontSize="10" fill="#9aa3b2" textAnchor="end">
          n
        </text>
      </svg>
    </div>
  );
}
