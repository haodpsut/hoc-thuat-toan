import type { CaseResult, RunResult, TestCase } from './types';

// Execution layer. Loads Pyodide (real CPython compiled to WebAssembly) once,
// lazily, and exposes two capabilities:
//   1. runWithTrace  -> run any Python and capture a line-by-line execution
//                       trace via sys.settrace (this powers Code Playback).
//   2. runTests      -> run a function against test cases (this powers the
//                       autograder).

const PYODIDE_VERSION = 'v0.26.4';
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    loadPyodide?: (cfg: { indexURL: string }) => Promise<any>;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodidePromise: Promise<any> | null = null;

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const el = document.createElement('script');
    el.src = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error('Không tải được Pyodide từ CDN.'));
    document.head.appendChild(el);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPyodide(): Promise<any> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await injectScript(`${INDEX_URL}pyodide.js`);
      if (!window.loadPyodide) throw new Error('window.loadPyodide không tồn tại.');
      return window.loadPyodide({ indexURL: INDEX_URL });
    })();
  }
  return pyodidePromise;
}

// Python harness: traces only frames whose filename is '<user>', capturing the
// executed line and a snapshot of JSON-friendly local variables at each step.
const TRACE_HARNESS = `
import sys, json, io, contextlib
_TRACE = []
_MAX = 4000
_trunc = [False]

def _cap(frame):
    out = {}
    for k, v in list(frame.f_locals.items()):
        if v is None or isinstance(v, (int, float, bool, str)):
            out[k] = v
        elif isinstance(v, list) and len(v) <= 64 and all((x is None or isinstance(x, (int, float, bool, str))) for x in v):
            out[k] = list(v)
    return out

def _tr(frame, event, arg):
    if frame.f_code.co_filename == '<user>':
        if event == 'line':
            if len(_TRACE) < _MAX:
                _TRACE.append({'line': frame.f_lineno, 'locals': _cap(frame)})
            else:
                _trunc[0] = True
        return _tr
    return None

_err = None
_out = io.StringIO()
try:
    _code = compile(USER_SRC, '<user>', 'exec')
    _g = {}
    with contextlib.redirect_stdout(_out):
        sys.settrace(_tr)
        try:
            exec(_code, _g)
        finally:
            sys.settrace(None)
except Exception:
    import traceback
    _err = traceback.format_exc(limit=3)

json.dumps({'trace': _TRACE, 'stdout': _out.getvalue(), 'error': _err, 'truncated': _trunc[0]})
`;

export async function runWithTrace(src: string): Promise<RunResult> {
  const py = await getPyodide();
  py.globals.set('USER_SRC', src);
  const raw: string = await py.runPythonAsync(TRACE_HARNESS);
  const data = JSON.parse(raw);
  return {
    trace: data.trace ?? [],
    result: null,
    stdout: data.stdout ?? '',
    error: data.error ?? null,
    truncated: data.truncated ?? false,
  };
}

// Autograder harness: define the user's code, then call the target function on
// each case (deep-copying args so user mutation cannot taint comparisons).
const TEST_HARNESS = `
import json, copy, traceback
_g = {}
_compile_err = None
try:
    exec(compile(USER_SRC, '<user>', 'exec'), _g)
except Exception:
    _compile_err = traceback.format_exc(limit=3)

_results = []
if _compile_err is None:
    _f = _g.get(FUNC_NAME)
    _cases = json.loads(CASES_JSON)
    if _f is None:
        _compile_err = "Không tìm thấy hàm '" + FUNC_NAME + "'."
    else:
        for _c in _cases:
            try:
                _args = [copy.deepcopy(a) for a in _c['args']]
                _got = _f(*_args)
                _results.append({'got': _got, 'error': None})
            except Exception:
                _results.append({'got': None, 'error': traceback.format_exc(limit=1)})

json.dumps({'compileError': _compile_err, 'results': _results})
`;

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((x, i) => deepEqual(x, b[i]));
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

export async function runTests(
  src: string,
  funcName: string,
  cases: TestCase[],
): Promise<{ compileError: string | null; results: CaseResult[] }> {
  const py = await getPyodide();
  py.globals.set('USER_SRC', src);
  py.globals.set('FUNC_NAME', funcName);
  py.globals.set('CASES_JSON', JSON.stringify(cases.map((c) => ({ args: c.args }))));
  const raw: string = await py.runPythonAsync(TEST_HARNESS);
  const data = JSON.parse(raw);
  if (data.compileError) {
    return { compileError: data.compileError, results: [] };
  }
  const results: CaseResult[] = cases.map((c, i) => {
    const r = data.results[i] ?? { got: null, error: 'no result' };
    return {
      name: c.name,
      passed: r.error === null && deepEqual(r.got, c.expected),
      got: r.error === null ? r.got : null,
      expected: c.expected,
      error: r.error,
    };
  });
  return { compileError: null, results };
}
