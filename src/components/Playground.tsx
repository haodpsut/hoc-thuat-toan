import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import type { Algorithm, CaseResult, Problem } from '../engine/types';
import { runTests } from '../engine/pyodide';

function fmt(v: unknown): string {
  if (Array.isArray(v)) return `[${v.join(', ')}]`;
  return String(v);
}

const LEVEL_COLOR: Record<Problem['level'], string> = {
  'Dễ': 'var(--ok)',
  'Trung bình': 'var(--compare)',
  'Khó': 'var(--bad)',
};

// Pillars 3 + 4: a bank of problems (statement, hint, multiple-ready solutions)
// wired to an embedded editor and an autograder that runs the learner's code
// against test cases, including edge cases.
export function Playground({ algo }: { algo: Algorithm }) {
  const [activeId, setActiveId] = useState(algo.problems[0].id);
  const [codeMap, setCodeMap] = useState<Record<string, string>>(
    () => Object.fromEntries(algo.problems.map((p) => [p.id, p.starter])),
  );
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [results, setResults] = useState<CaseResult[] | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const problem = algo.problems.find((p) => p.id === activeId)!;
  const code = codeMap[activeId];

  const selectProblem = (id: string) => {
    setActiveId(id);
    setShowHint(false);
    setShowSolution(false);
    setResults(null);
    setCompileError(null);
  };

  const setCode = (v: string) => setCodeMap((m) => ({ ...m, [activeId]: v }));

  const grade = async () => {
    setLoading(true);
    setResults(null);
    setCompileError(null);
    try {
      const { compileError: err, results: r } = await runTests(code, problem.funcName, problem.cases);
      setCompileError(err);
      setResults(r);
    } catch (e) {
      setCompileError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const passed = results?.filter((r) => r.passed).length ?? 0;
  const total = problem.cases.length;
  const allPass = results !== null && passed === total;

  return (
    <div className="card">
      <div className="prob-tabs">
        {algo.problems.map((p) => (
          <button
            key={p.id}
            className={`prob-tab ${p.id === activeId ? 'active' : ''}`}
            onClick={() => selectProblem(p.id)}
          >
            {p.title}
            <span className="level" style={{ color: LEVEL_COLOR[p.level] }}>{p.level}</span>
          </button>
        ))}
      </div>

      <p style={{ marginTop: 0 }}>{problem.statement}</p>

      <div className="row" style={{ marginBottom: 12 }}>
        <button onClick={() => setShowHint((h) => !h)}>{showHint ? 'Ẩn gợi ý' : '💡 Gợi ý'}</button>
        <button onClick={() => setShowSolution((s) => !s)}>
          {showSolution ? 'Ẩn lời giải' : 'Xem lời giải'}
        </button>
        <button onClick={() => { setCode(problem.starter); setResults(null); }}>Đặt lại code</button>
      </div>
      {showHint && <div className="banner">💡 {problem.hint}</div>}

      <div className="cm-wrap">
        <CodeMirror value={code} height="220px" theme="dark" extensions={[python()]} onChange={setCode} />
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <button className="primary" onClick={grade} disabled={loading}>
          {loading ? 'Đang chấm...' : '✓ Chấm bài'}
        </button>
        {loading && <span className="step-label"><span className="spin" /> đang chạy test...</span>}
      </div>

      {compileError && <div className="stdout err">{compileError}</div>}

      {results && (
        <>
          <div className={`summary ${allPass ? 'ok' : 'bad'}`}>
            {allPass ? `Đạt toàn bộ ${total} ca kiểm thử. Tốt lắm!` : `Đạt ${passed} / ${total} ca kiểm thử.`}
          </div>
          <div className="results">
            {results.map((r, i) => (
              <div key={i} className={`case ${r.passed ? 'pass' : 'fail'}`}>
                <span className="mark">{r.passed ? '✓' : '✗'}</span>
                <span>{r.name}</span>
                <code>
                  {problem.funcName}({(problem.cases[i].args as unknown[]).map(fmt).join(', ')}) →{' '}
                  {r.error ? 'lỗi' : fmt(r.got)}
                  {!r.passed && !r.error && ` (mong đợi ${fmt(r.expected)})`}
                </code>
              </div>
            ))}
          </div>
        </>
      )}

      {showSolution && (
        <div style={{ marginTop: 14 }}>
          <p className="note">Một lời giải tham khảo:</p>
          <CodeMirror value={problem.solution} height="auto" theme="dark" editable={false} extensions={[python()]} />
        </div>
      )}
    </div>
  );
}
