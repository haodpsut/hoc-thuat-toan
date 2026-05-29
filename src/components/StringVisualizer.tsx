import { useMemo, useState } from 'react';
import type { Algorithm, CharState } from '../engine/types';
import { usePlayer } from '../engine/usePlayer';
import { StringView } from './StringView';
import { CodePanel } from './CodePanel';
import { PlayerControls } from './PlayerControls';

const COLOR: Record<CharState, string> = {
  idle: 'var(--panel-2)',
  compare: 'var(--compare)',
  match: 'var(--sorted)',
  mismatch: 'var(--swap)',
  window: 'var(--accent)',
  found: 'var(--found)',
};

// Curated visualizer for string algorithms. Mirrors CuratedVisualizer but
// renders characters instead of bars.
export function StringVisualizer({ algo }: { algo: Algorithm }) {
  const [text, setText] = useState(algo.defaultString ?? 'racecar');
  const [str, setStr] = useState(algo.defaultString ?? 'racecar');
  const [patText, setPatText] = useState(algo.defaultPattern ?? 'cec');
  const [pattern, setPattern] = useState(algo.defaultPattern ?? 'cec');

  const trace = useMemo(
    () => (algo.stringCurated ? algo.stringCurated(str, pattern) : []),
    [algo, str, pattern],
  );
  const { cur, playing, speed, setSpeed, play, step, goto } = usePlayer(trace.length);
  const s = trace[Math.min(cur, Math.max(0, trace.length - 1))];

  const apply = () => {
    setStr(text.slice(0, 24));
    setPattern(patText.slice(0, 24));
  };

  return (
    <div className="grid2">
      <div className="card">
        <div className="row" style={{ marginBottom: 12 }}>
          <label>Chuỗi</label>
          <input
            type="text"
            value={text}
            style={{ width: 180 }}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
          />
          {algo.needsPattern && (
            <>
              <label>Mẫu</label>
              <input
                type="text"
                value={patText}
                style={{ width: 100 }}
                onChange={(e) => setPatText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && apply()}
              />
            </>
          )}
          <button onClick={apply}>Áp dụng</button>
        </div>

        {s && <StringView chars={s.chars} state={s.state} pointers={s.pointers} />}

        {algo.charLegend && (
          <div className="legend">
            {algo.charLegend.map(([st, label]) => (
              <span key={st}>
                <i className="dot" style={{ background: COLOR[st] }} /> {label}
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
