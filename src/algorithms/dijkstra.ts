import type { Algorithm, GraphStep, NodeState } from '../engine/types';

// Illustrative source (selection-based) whose line numbers match the trace.
// 1  def dijkstra(adj, start):
// 2      dist = [INF] * len(adj)
// 3      dist[start] = 0
// 4      visited = [False] * len(adj)
// 5      for _ in range(len(adj)):
// 6          u = closest_unvisited(dist, visited)
// 7          visited[u] = True
// 8          for v, w in adj[u]:
// 9              if dist[u] + w < dist[v]:
// 10                 dist[v] = dist[u] + w
// 11     return dist
const SOURCE = `def dijkstra(adj, start):
    dist = [INF] * len(adj)
    dist[start] = 0
    visited = [False] * len(adj)
    for _ in range(len(adj)):
        u = closest_unvisited(dist, visited)
        visited[u] = True
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    return dist`;

const NODES = [
  { id: 0, label: '0', x: 60, y: 70 },
  { id: 1, label: '1', x: 220, y: 40 },
  { id: 2, label: '2', x: 220, y: 180 },
  { id: 3, label: '3', x: 380, y: 40 },
  { id: 4, label: '4', x: 380, y: 180 },
  { id: 5, label: '5', x: 520, y: 110 },
];
const EDGES = [
  { from: 0, to: 1, weight: 4 },
  { from: 0, to: 2, weight: 1 },
  { from: 1, to: 2, weight: 2 },
  { from: 1, to: 3, weight: 5 },
  { from: 2, to: 4, weight: 8 },
  { from: 3, to: 5, weight: 3 },
  { from: 4, to: 5, weight: 2 },
  { from: 3, to: 4, weight: 1 },
];
// Adjacency with weights: adj[u] = [[v, w], ...]
const ADJ: number[][][] = [
  [[1, 4], [2, 1]],
  [[0, 4], [2, 2], [3, 5]],
  [[0, 1], [1, 2], [4, 8]],
  [[1, 5], [5, 3], [4, 1]],
  [[2, 8], [5, 2], [3, 1]],
  [[3, 3], [4, 2]],
];
const INF = Infinity;

function graphCurated(start = 0): GraphStep[] {
  const n = NODES.length;
  const dist = Array(n).fill(INF);
  const visited = Array(n).fill(false);
  const parent = Array(n).fill(-1);
  dist[start] = 0;
  const steps: GraphStep[] = [];

  const distLabels = () => {
    const d: Record<number, string> = {};
    for (let i = 0; i < n; i++) d[i] = dist[i] === INF ? '∞' : String(dist[i]);
    return d;
  };
  const states = () => {
    const st: Record<number, NodeState> = {};
    for (let i = 0; i < n; i++) st[i] = visited[i] ? 'visited' : dist[i] < INF ? 'frontier' : 'idle';
    return st;
  };
  const treeEdges = () => {
    const e: string[] = [];
    for (let v = 0; v < n; v++) if (parent[v] >= 0) e.push(`${parent[v]}-${v}`);
    return e;
  };
  const push = (line: number, override: Record<number, NodeState>, vars: GraphStep['vars'], note: string) =>
    steps.push({ nodeState: { ...states(), ...override }, activeEdges: treeEdges(), dist: distLabels(), line, vars, note });

  push(3, {}, { start }, `Khởi tạo: d[${start}] = 0, mọi đỉnh khác = vô cùng.`);
  for (let it = 0; it < n; it++) {
    let u = -1;
    let best = INF;
    for (let v = 0; v < n; v++) {
      if (!visited[v] && dist[v] < best) {
        best = dist[v];
        u = v;
      }
    }
    if (u === -1) break;
    visited[u] = true;
    push(6, { [u]: 'current' }, { u, 'd[u]': dist[u] }, `Chọn đỉnh chưa chốt có khoảng cách nhỏ nhất: ${u} (d = ${dist[u]}). Chốt nó.`);
    for (const [v, w] of ADJ[u]) {
      if (visited[v]) continue;
      const dv = dist[v] === INF ? '∞' : dist[v];
      push(8, { [u]: 'current' }, { u, v, w, 'd[v]': dv }, `Xét cạnh ${u}-${v} trọng số ${w}.`);
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        parent[v] = u;
        push(10, { [u]: 'current' }, { u, v, 'd[v]': dist[v] }, `Đường qua ${u} ngắn hơn: d[${v}] = ${dist[u]} + ${w} = ${dist[v]}.`);
      } else {
        push(9, { [u]: 'current' }, { u, v }, `Không ngắn hơn (${dist[u]} + ${w} >= ${dv}), giữ nguyên.`);
      }
    }
  }
  push(11, {}, {}, `Hoàn tất. Khoảng cách ngắn nhất từ ${start}: [${dist.join(', ')}].`);
  return steps;
}

export const dijkstra: Algorithm = {
  id: 'dijkstra',
  name: 'Đường đi ngắn nhất (Dijkstra)',
  category: 'Đồ thị có trọng số',
  viz: 'graph',
  big: 'O((V + E) log V)',
  best: 'O((V + E) log V)',
  space: 'O(V)',
  idea:
    'Dijkstra tìm khoảng cách ngắn nhất từ một đỉnh nguồn tới mọi đỉnh khác trên đồ thị có trọng số ' +
    'không âm. Ý tưởng tham lam: luôn chọn đỉnh chưa chốt có khoảng cách tạm nhỏ nhất, coi nó đã ' +
    'tối ưu, rồi dùng nó để cập nhật (nới lỏng) khoảng cách của các đỉnh kề.',
  source: SOURCE,
  playback: `import heapq

def dijkstra(adj, start):
    dist = [float('inf')] * len(adj)
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist

adj = [[(1, 4), (2, 1)], [(0, 4), (2, 2), (3, 5)], [(0, 1), (1, 2), (4, 8)], [(1, 5), (5, 3), (4, 1)], [(2, 8), (5, 2), (3, 1)], [(3, 3), (4, 2)]]
print(dijkstra(adj, 0))`,
  nodes: NODES,
  edges: EDGES,
  starts: [0, 1, 2, 3, 4, 5],
  graphCurated,
  nodeLegend: [
    ['idle', 'chưa tới được (∞)'],
    ['frontier', 'có khoảng cách tạm'],
    ['current', 'vừa được chốt'],
    ['visited', 'đã chốt'],
  ],
  complexityNotes: [
    'Dùng hàng đợi ưu tiên (heap), mỗi cạnh có thể đẩy một lần vào heap, mỗi thao tác heap tốn log V, nên tổng cộng O((V + E) log V).',
    'Bản chọn tuyến tính (quét tìm đỉnh nhỏ nhất) đơn giản hơn nhưng tốn O(V²), phù hợp đồ thị dày.',
    'Quan trọng: Dijkstra chỉ đúng khi mọi trọng số không âm. Có cạnh âm thì phải dùng Bellman-Ford.',
  ],
  problems: [
    {
      id: 'dist',
      title: 'Khoảng cách ngắn nhất',
      level: 'Khó',
      statement:
        'Cho đồ thị có trọng số không âm dạng danh sách kề adj (adj[u] là danh sách các cặp [v, w]) và ' +
        'đỉnh start, cài đặt dijkstra(adj, start) trả về danh sách khoảng cách ngắn nhất từ start tới mọi đỉnh. ' +
        'Giả sử mọi đỉnh đều tới được.',
      hint: 'Dùng hàng đợi ưu tiên heapq. Lấy ra đỉnh có d nhỏ nhất, rồi nới lỏng các cạnh kề.',
      funcName: 'dijkstra',
      starter: `import heapq

def dijkstra(adj, start):
    # Trả về danh sách khoảng cách ngắn nhất từ start
    return []`,
      solution: `import heapq

def dijkstra(adj, start):
    dist = [float('inf')] * len(adj)
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist`,
      cases: [
        {
          name: 'đồ thị 6 đỉnh',
          args: [[[[1, 4], [2, 1]], [[0, 4], [2, 2], [3, 5]], [[0, 1], [1, 2], [4, 8]], [[1, 5], [5, 3], [4, 1]], [[2, 8], [5, 2], [3, 1]], [[3, 3], [4, 2]]], 0],
          expected: [0, 3, 1, 8, 9, 11],
        },
        { name: 'đường thẳng', args: [[[[1, 2]], [[0, 2], [2, 3]], [[1, 3]]], 0], expected: [0, 2, 5] },
        { name: 'một đỉnh', args: [[[]], 0], expected: [0] },
      ],
    },
    {
      id: 'to-target',
      title: 'Khoảng cách tới một đỉnh',
      level: 'Trung bình',
      statement: 'Cài đặt shortest_dist(adj, start, target) trả về khoảng cách ngắn nhất từ start tới target.',
      hint: 'Chạy Dijkstra rồi lấy phần tử thứ target của mảng khoảng cách.',
      funcName: 'shortest_dist',
      starter: `import heapq

def shortest_dist(adj, start, target):
    return 0`,
      solution: `import heapq

def shortest_dist(adj, start, target):
    dist = [float('inf')] * len(adj)
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist[target]`,
      cases: [
        {
          name: 'tới đỉnh 5',
          args: [[[[1, 4], [2, 1]], [[0, 4], [2, 2], [3, 5]], [[0, 1], [1, 2], [4, 8]], [[1, 5], [5, 3], [4, 1]], [[2, 8], [5, 2], [3, 1]], [[3, 3], [4, 2]]], 0, 5],
          expected: 11,
        },
        { name: 'tới đỉnh 2', args: [[[[1, 2]], [[0, 2], [2, 3]], [[1, 3]]], 0, 2], expected: 5 },
      ],
    },
  ],
};
