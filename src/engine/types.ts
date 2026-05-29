// Core trace model shared by every algorithm and visualizer.
// Both hand-authored traces and Pyodide-generated traces emit this shape,
// so the player and renderers never need to know which algorithm produced them.

export type Vars = Record<string, number | string | boolean | null | number[]>;

// One frame of an execution: the array state plus which indices are highlighted
// and how, the source line to highlight, the visible variables, and a note.
export interface Step {
  array: number[];
  compare: number[];
  swap: number[];
  sorted: number[];
  excluded: number[];
  found: number[];
  line: number; // 1-based line in the algorithm source
  vars: Vars;
  note: string;
}

// A generic Code Playback step coming from Pyodide + sys.settrace:
// any Python code produces a list of these (line executed + local variables).
export interface TraceStep {
  line: number;
  locals: Vars;
}

export interface RunResult {
  trace: TraceStep[];
  result: unknown;
  stdout: string;
  error: string | null;
  truncated: boolean;
}

export interface TestCase {
  name: string;
  args: unknown[];
  expected: unknown;
}

export interface CaseResult {
  name: string;
  passed: boolean;
  got: unknown;
  expected: unknown;
  error: string | null;
}

export interface Problem {
  id: string;
  title: string;
  level: 'Dễ' | 'Trung bình' | 'Khó';
  statement: string;
  hint: string;
  funcName: string;
  starter: string;
  solution: string;
  cases: TestCase[];
}

export interface CodeLineToken {
  cls: string;
  text: string;
}

// ---- Graph / tree visualization model ----
// A node positioned in 2D, an edge between two nodes, and a per-step snapshot of
// node/edge highlight states. Both graph algorithms (BFS) and tree algorithms
// (BST) use this same model and the same GraphView renderer.
export type NodeState = 'idle' | 'frontier' | 'current' | 'visited' | 'path';

export interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: number;
  to: number;
}

export interface GraphStep {
  nodeState: Record<number, NodeState>;
  activeEdges: string[]; // edge keys `${from}-${to}` (undirected: both orders accepted)
  line: number;
  vars: Vars;
  note: string;
}

export type VizKind = 'array' | 'graph';

export interface Algorithm {
  id: string;
  name: string;
  category: string;
  viz: VizKind;
  big: string;
  best: string;
  space: string;
  idea: string;
  source: string; // canonical Python source (line numbers match curated trace)
  playback?: string; // full runnable Python (incl. a call) for Code Playback
  complexityNotes: string[]; // per-algorithm prose for the complexity section
  opCount?: (n: number) => number; // optional empirical op-count for the chart
  opCountLabel?: string;
  problems: Problem[];

  // Array visualization (sorting/searching/traversal):
  curated?: (a: number[], target?: number) => Step[];
  arrayLegend?: [string, string][]; // legend [highlightClass, label] for the bar view
  defaultInput?: string; // default array text for the input box
  needsTarget?: boolean; // show a numeric input box and pass it to curated
  defaultTarget?: number;
  targetLabel?: string; // label for that input (default "Tìm giá trị")

  // Graph / tree visualization:
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  starts?: number[]; // selectable start nodes (BFS); omit for tree build
  graphCurated?: (start?: number) => GraphStep[];
  nodeLegend?: [NodeState, string][]; // legend labels for the graph view
}
