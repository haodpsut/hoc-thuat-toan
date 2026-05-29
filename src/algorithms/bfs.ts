import type { Algorithm, GraphStep, NodeState } from '../engine/types';

// 1 from collections import deque
// 2 def bfs(adj, start):
// 3     visited = [False] * len(adj)
// 4     order = []
// 5     q = deque([start])
// 6     visited[start] = True
// 7     while q:
// 8         u = q.popleft()
// 9         order.append(u)
// 10         for v in adj[u]:
// 11             if not visited[v]:
// 12                 visited[v] = True
// 13                 q.append(v)
// 14     return order
const SOURCE = `from collections import deque
def bfs(adj, start):
    visited = [False] * len(adj)
    order = []
    q = deque([start])
    visited[start] = True
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                q.append(v)
    return order`;

// Fixed example graph (6 nodes), positioned for a clear drawing.
const NODES = [
  { id: 0, label: '0', x: 60, y: 60 },
  { id: 1, label: '1', x: 210, y: 40 },
  { id: 2, label: '2', x: 210, y: 170 },
  { id: 3, label: '3', x: 360, y: 40 },
  { id: 4, label: '4', x: 360, y: 170 },
  { id: 5, label: '5', x: 500, y: 105 },
];
const EDGES = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 5 },
];
const ADJ: number[][] = [[1, 2], [0, 3], [0, 3, 4], [1, 2, 5], [2, 5], [3, 4]];

function graphCurated(start = 0): GraphStep[] {
  const state: Record<number, NodeState> = {};
  for (let i = 0; i < NODES.length; i++) state[i] = 'idle';
  const active: string[] = [];
  const steps: GraphStep[] = [];
  const q: number[] = [];
  const order: number[] = [];
  const push = (line: number, vars: GraphStep['vars'], note: string) =>
    steps.push({ nodeState: { ...state }, activeEdges: [...active], line, vars, note });

  push(5, { start, q: [...q], order: [...order] }, `Bắt đầu BFS từ đỉnh ${start}. Đưa ${start} vào hàng đợi.`);
  q.push(start);
  state[start] = 'frontier';
  push(6, { q: [...q], order: [...order] }, `Đánh dấu ${start} đã thăm. Hàng đợi giờ có ${start}.`);

  while (q.length) {
    const u = q.shift()!;
    state[u] = 'current';
    push(8, { u, q: [...q], order: [...order] }, `Lấy đỉnh ${u} ra khỏi đầu hàng đợi để xử lý.`);
    order.push(u);
    push(9, { u, q: [...q], order: [...order] }, `Thêm ${u} vào thứ tự duyệt.`);
    for (const v of ADJ[u]) {
      state[u] = 'current';
      push(11, { u, v, q: [...q], order: [...order] }, `Xét đỉnh kề ${v} của ${u}. Đã thăm chưa?`);
      if (state[v] === 'idle') {
        state[v] = 'frontier';
        active.push(`${u}-${v}`);
        q.push(v);
        push(13, { u, v, q: [...q], order: [...order] }, `${v} chưa thăm: đánh dấu thăm và đưa vào cuối hàng đợi.`);
      } else {
        push(11, { u, v, q: [...q], order: [...order] }, `${v} đã thăm rồi, bỏ qua.`);
      }
    }
    state[u] = 'visited';
    push(7, { u, q: [...q], order: [...order] }, `Xử lý xong ${u}. Quay lại kiểm tra hàng đợi.`);
  }
  push(14, { order: [...order] }, `Hàng đợi rỗng. BFS hoàn tất. Thứ tự duyệt: ${order.join(', ')}.`);
  return steps;
}

export const bfs: Algorithm = {
  id: 'bfs',
  name: 'Duyệt theo chiều rộng (BFS)',
  category: 'Đồ thị',
  viz: 'graph',
  big: 'O(V + E)',
  best: 'O(V + E)',
  space: 'O(V)',
  idea:
    'BFS duyệt đồ thị theo từng lớp, lan ra như sóng nước từ đỉnh xuất phát. Nó dùng một hàng đợi: ' +
    'lấy đỉnh ở đầu hàng ra xử lý, rồi đưa các đỉnh kề chưa thăm vào cuối hàng. Nhờ vậy các đỉnh được ' +
    'thăm theo đúng thứ tự khoảng cách tăng dần tính theo số cạnh.',
  source: SOURCE,
  playback: `${SOURCE}\n\nadj = [[1, 2], [0, 3], [0, 3, 4], [1, 2, 5], [2, 5], [3, 4]]\nprint(bfs(adj, 0))`,
  nodes: NODES,
  edges: EDGES,
  starts: [0, 1, 2, 3, 4, 5],
  graphCurated,
  nodeLegend: [
    ['idle', 'chưa thăm'],
    ['frontier', 'trong hàng đợi'],
    ['current', 'đang xử lý'],
    ['visited', 'đã xử lý'],
  ],
  complexityNotes: [
    'Mỗi đỉnh được đưa vào và lấy ra khỏi hàng đợi đúng một lần, tốn O(V).',
    'Mỗi cạnh được xét đúng một lần (hoặc hai lần với đồ thị vô hướng), tốn O(E).',
    'Tổng cộng O(V + E). Bộ nhớ O(V) cho mảng đã thăm và hàng đợi.',
  ],
  problems: [
    {
      id: 'order',
      title: 'Thứ tự duyệt BFS',
      level: 'Trung bình',
      statement:
        'Cho đồ thị dạng danh sách kề adj (adj[u] là danh sách các đỉnh kề của u) và đỉnh start. ' +
        'Cài đặt bfs_order(adj, start) trả về danh sách các đỉnh theo đúng thứ tự BFS thăm chúng.',
      hint: 'Dùng một hàng đợi (deque). Đánh dấu đã thăm ngay khi đưa vào hàng đợi, không phải khi lấy ra.',
      funcName: 'bfs_order',
      starter: `from collections import deque

def bfs_order(adj, start):
    # Trả về danh sách đỉnh theo thứ tự BFS
    return []`,
      solution: `from collections import deque

def bfs_order(adj, start):
    visited = [False] * len(adj)
    order = []
    q = deque([start])
    visited[start] = True
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                q.append(v)
    return order`,
      cases: [
        { name: 'đồ thị 6 đỉnh', args: [[[1, 2], [0, 3], [0, 3, 4], [1, 2, 5], [2, 5], [3, 4]], 0], expected: [0, 1, 2, 3, 4, 5] },
        { name: 'đường thẳng', args: [[[1], [0, 2], [1, 3], [2]], 0], expected: [0, 1, 2, 3] },
        { name: 'một đỉnh', args: [[[]], 0], expected: [0] },
        { name: 'bắt đầu từ giữa', args: [[[1], [0, 2], [1]], 1], expected: [1, 0, 2] },
      ],
    },
    {
      id: 'reach',
      title: 'Đếm đỉnh tới được',
      level: 'Dễ',
      statement:
        'Cài đặt count_reachable(adj, start) trả về số đỉnh có thể tới được từ start (kể cả chính start).',
      hint: 'Chạy BFS hoặc DFS từ start rồi đếm số đỉnh đã thăm.',
      funcName: 'count_reachable',
      starter: `def count_reachable(adj, start):
    return 0`,
      solution: `def count_reachable(adj, start):
    seen = [False] * len(adj)
    seen[start] = True
    stack = [start]
    c = 0
    while stack:
        u = stack.pop()
        c += 1
        for v in adj[u]:
            if not seen[v]:
                seen[v] = True
                stack.append(v)
    return c`,
      cases: [
        { name: 'liên thông', args: [[[1, 2], [0, 3], [0, 3, 4], [1, 2, 5], [2, 5], [3, 4]], 0], expected: 6 },
        { name: 'có phần rời', args: [[[1], [0], [3], [2]], 0], expected: 2 },
        { name: 'một đỉnh', args: [[[]], 0], expected: 1 },
      ],
    },
  ],
};
