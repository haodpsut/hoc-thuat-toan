import { useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import type { Algorithm, TraceStep } from '../engine/types';
import { runWithTrace } from '../engine/pyodide';
import { usePlayer } from '../engine/usePlayer';
import { BarVisualizer } from './BarVisualizer';
import { CodePanel } from './CodePanel';
import { PlayerControls } from './PlayerControls';

function funcNameOf(source: string): string {
  const m = source.match(/def\s+(\w+)\s*\(/);
  return m ? m[1] : 'main';
}

// Pick the variable to chart: the name that is most often a list across the
// trace, breaking ties by the longest list seen.
function chooseListVar(trace: TraceStep[]): string | null {
  const score = new Map<string, number>();
  for (const step of trace) {
    for (const [k, v] of Object.entries(step.locals)) {
      // Only chart lists of numbers; skip boolean lists (e.g. a visited flag
      // array) since drawing them as bars is not meaningful.
      if (Array.isArray(v) && v.every((x) => typeof x === 'number')) {
        score.set(k, Math.max(score.get(k) ?? 0, v.length));
      }
    }
  }
  let best: string | null = null;
  let bestLen = 0;
  for (const [k, len] of score) {
    if (len > bestLen) {
      best = k;
      bestLen = len;
    }
  }
  return best;
}

// Pillar 2: run ANY Python and replay its execution line by line. The trace
// comes from real CPython via Pyodide + sys.settrace, not a hand-written script.
export function CodePlayback({ algo }: { algo: Algorithm }) {
  const fn = funcNameOf(algo.source);
  // Prefer a ready-to-run script when the algorithm provides one (graph/tree
  // code needs setup that the illustrative source alone cannot run).
  const initial = algo.playback ?? `${algo.source}\n\nprint(${fn}([5, 2, 9, 1, 6, 3]))`;
  const [src, setSrc] = useState(initial);
  const [ranSource, setRanSource] = useState('');
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [stdout, setStdout] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const { cur, playing, speed, setSpeed, play, step, goto } = usePlayer(trace.length);
  const s = trace[Math.min(cur, Math.max(0, trace.length - 1))];

  const listVar = useMemo(() => chooseListVar(trace), [trace]);
  const maxVal = useMemo(() => {
    let m = 1;
    for (const step of trace) {
      const v = listVar ? step.locals[listVar] : null;
      if (Array.isArray(v)) for (const x of v) if (typeof x === 'number' && x > m) m = x;
    }
    return m;
  }, [trace, listVar]);

  const run = async () => {
    setLoading(true);
    setError(null);
    setStatus('Đang nạp Python (Pyodide)...');
    try {
      const res = await runWithTrace(src);
      setRanSource(src);
      setTrace(res.trace);
      setStdout(res.stdout);
      setError(res.error);
      setTruncated(res.truncated);
      goto(0);
      setStatus('');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  const curArray = listVar && s && Array.isArray(s.locals[listVar]) ? (s.locals[listVar] as number[]) : [];
  const pointers: Record<number, string[]> = {};
  if (s && curArray.length) {
    for (const [k, v] of Object.entries(s.locals)) {
      if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < curArray.length && k !== listVar) {
        (pointers[v] ||= []).push(k);
      }
    }
  }

  return (
    <div className="grid2">
      <div className="card">
        <p className="note" style={{ marginTop: 0 }}>
          Sửa code Python tuỳ ý rồi bấm <b>Chạy</b>. Trình duyệt chạy CPython thật và ghi lại từng dòng
          thực thi để bạn tua lại.
        </p>
        <div className="cm-wrap">
          <CodeMirror
            value={src}
            height="240px"
            theme="dark"
            extensions={[python()]}
            onChange={(v) => setSrc(v)}
          />
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <button className="primary" onClick={run} disabled={loading}>
            {loading ? 'Đang chạy...' : '▶ Chạy'}
          </button>
          <button onClick={() => { setSrc(initial); }} disabled={loading}>Khôi phục mẫu</button>
          {loading && <span className="step-label"><span className="spin" /> {status}</span>}
        </div>
        {error && <div className="stdout err" style={{ marginTop: 10 }}>{error}</div>}
        {stdout && <div className="stdout">{stdout}</div>}
        {truncated && <p className="note">Trace đã bị cắt bớt vì quá dài. Hãy thử dữ liệu nhỏ hơn.</p>}
      </div>

      <div className="card">
        {trace.length === 0 ? (
          <p className="note" style={{ marginTop: 0 }}>
            Bấm <b>Chạy</b> để xem việc thực thi được tua từng bước, kèm bảng biến thay đổi theo thời gian thực.
          </p>
        ) : (
          <>
            {curArray.length > 0 && (
              <BarVisualizer array={curArray} pointers={pointers} maxVal={maxVal} />
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
            <div className="vars">
              {s &&
                Object.entries(s.locals)
                  .filter(([k]) => k !== listVar)
                  .map(([k, v]) => (
                    <span key={k}>
                      <b>{k}</b> = {Array.isArray(v) ? `[${v.join(', ')}]` : String(v)}
                    </span>
                  ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <CodePanel source={ranSource} activeLine={s?.line ?? 0} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
