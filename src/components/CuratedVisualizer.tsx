import { useMemo, useState } from 'react';
import type { Algorithm } from '../engine/types';
import { usePlayer } from '../engine/usePlayer';
import { BarVisualizer } from './BarVisualizer';
import { CodePanel } from './CodePanel';
import { PlayerControls } from './PlayerControls';

function parseArray(s: string): number[] {
  return s
    .split(/[,\s]+/)
    .map((x) => parseInt(x, 10))
    .filter((x) => !Number.isNaN(x))
    .slice(0, MAX_N);
}

// Trực quan hoá từng bước hợp với mảng nhỏ. Mảng lớn sinh ra rất nhiều bước và
// tốn bộ nhớ (số bước tăng theo n²), nên ta giới hạn ở đây; muốn hiểu hành vi
// với n lớn thì xem mục Phân tích độ phức tạp.
const MAX_N = 20;

const LEGEND: [string, string][] = [
  ['bar', 'chưa xét'],
  ['compare', 'đang so sánh'],
  ['swap', 'đang dịch chuyển'],
  ['sorted', 'đã đúng vị trí'],
];

// Swatch color for a legend entry by its highlight class.
function swatch(c: string): React.CSSProperties {
  if (c === 'bar') return { background: 'var(--bar)' };
  if (c === 'excluded') return { background: 'var(--bar)', opacity: 0.3 };
  return { background: `var(--${c})` };
}

// Pillar 1: the polished, narrated visualizer driven by a hand-authored trace.
export function CuratedVisualizer({ algo }: { algo: Algorithm }) {
  const initial = algo.defaultInput ?? '5, 2, 8, 1, 9, 3, 7';
  const legend = algo.arrayLegend ?? LEGEND;
  const [text, setText] = useState(initial);
  const [array, setArray] = useState<number[]>(() => parseArray(initial));
  const [targetText, setTargetText] = useState(String(algo.defaultTarget ?? 9));
  const [target, setTarget] = useState<number>(algo.defaultTarget ?? 9);

  const trace = useMemo(
    () => (algo.curated ? algo.curated(array, target) : []),
    [algo, array, target],
  );
  const maxVal = useMemo(
    () => Math.max(1, ...trace.flatMap((s) => s.array)),
    [trace],
  );
  const { cur, playing, speed, setSpeed, play, step, goto } = usePlayer(trace.length);
  const s = trace[Math.min(cur, trace.length - 1)];

  const apply = () => {
    setArray(parseArray(text));
    setTarget(parseInt(targetText, 10) || 0);
  };
  const randomize = () => {
    const base = [5, 2, 8, 1, 9, 3, 7, 4, 6];
    for (let k = base.length - 1; k > 0; k--) {
      const t = (k * 7 + 2) % (k + 1);
      [base[k], base[t]] = [base[t], base[k]];
    }
    const arr = base.slice(0, 7);
    setText(arr.join(', '));
    setArray(arr);
  };

  // Index-like variables shown as labels above the bars.
  const pointers: Record<number, string[]> = {};
  if (s) {
    for (const name of ['i', 'j', 'lo', 'hi', 'mid', 'm', 'd']) {
      const v = s.vars[name];
      if (typeof v === 'number' && v >= 0 && v < s.array.length) {
        (pointers[v] ||= []).push(name);
      }
    }
  }

  return (
    <div className="grid2">
      <div className="card">
        <div className="row" style={{ marginBottom: 14 }}>
          <label>Mảng</label>
          <input
            type="text"
            value={text}
            style={{ width: 200 }}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
          />
          {algo.needsTarget && (
            <>
              <label>Tìm giá trị</label>
              <input
                type="text"
                value={targetText}
                style={{ width: 64, textAlign: 'center' }}
                onChange={(e) => setTargetText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && apply()}
              />
            </>
          )}
          <button onClick={apply}>Áp dụng</button>
          <button onClick={randomize}>Ngẫu nhiên</button>
        </div>
        <p className="note" style={{ marginTop: 0, marginBottom: 10 }}>
          Tối đa {MAX_N} phần tử. Với mảng lớn hơn, xem mục Phân tích độ phức tạp.
        </p>

        {s && (
          <BarVisualizer
            array={s.array}
            compare={s.compare}
            swap={s.swap}
            sorted={s.sorted}
            excluded={s.excluded}
            found={s.found}
            pointers={pointers}
            maxVal={maxVal}
          />
        )}

        <div className="legend">
          {legend.map(([c, t]) => (
            <span key={c}>
              <i className="dot" style={swatch(c)} /> {t}
            </span>
          ))}
        </div>

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
                <b>{k}</b> = {String(v)}
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
