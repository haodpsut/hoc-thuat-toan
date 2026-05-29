import type { Algorithm, GraphStep, NodeState } from '../engine/types';

// 1 def dfs(adj, start):
// 2     visited = [False] * len(adj)
// 3     order = []
// 4     def visit(u):
// 5         visited[u] = True
// 6         order.append(u)
// 7         for v in adj[u]:
// 8             if not visited[v]:
// 9                 visit(v)
// 10     visit(start)
// 11     return order
const SOURCE = `def dfs(adj, start):
    visited = [False] * len(adj)
    order = []
    def visit(u):
        visited[u] = True
        order.append(u)
        for v in adj[u]:
            if not visited[v]:
                visit(v)
    visit(start)
    return order`;

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
  const order: number[] = [];
  const stack: number[] = [];
  const push = (line: number, vars: GraphStep['vars'], note: string) =>
    steps.push({ nodeState: { ...state }, activeEdges: [...active], line, vars, note });

  push(10, { start, order: [...order] }, `Bắt đầu DFS từ đỉnh ${start}. DFS đi sâu hết một nhánh rồi mới quay lại.`);

  const visit = (u: number, parent: number | null) => {
    state[u] = 'current';
    stack.push(u);
    if (parent !== null) active.push(`${parent}-${u}`);
    push(5, { u, stack: [...stack], order: [...order] }, `Thăm ${u}, đánh dấu đã thăm. Ngăn xếp đệ quy: [${stack.join(', ')}].`);
    order.push(u);
    push(6, { u, stack: [...stack], order: [...order] }, `Thêm ${u} vào thứ tự duyệt.`);
    for (const v of ADJ[u]) {
      push(7, { u, v, stack: [...stack], order: [...order] }, `Xét đỉnh kề ${v} của ${u}.`);
      if (state[v] === 'idle') {
        push(8, { u, v, stack: [...stack], order: [...order] }, `${v} chưa thăm: đi sâu vào ${v}.`);
        visit(v, u);
        state[u] = 'current';
        push(7, { u, v, stack: [...stack], order: [...order] }, `Quay lại ${u} sau khi xong nhánh ${v}.`);
      } else {
        push(7, { u, v, stack: [...stack], order: [...order] }, `${v} đã thăm, bỏ qua.`);
      }
    }
    state[u] = 'visited';
    stack.pop();
    push(4, { u, stack: [...stack], order: [...order] }, `Xong ${u}, lùi khỏi ngăn xếp.`);
  };

  visit(start, null);
  push(11, { order: [...order] }, `DFS hoàn tất. Thứ tự duyệt: ${order.join(', ')}.`);
  return steps;
}

export const dfs: Algorithm = {
  id: 'dfs',
  name: 'Duyệt theo chiều sâu (DFS)',
  category: 'Đồ thị',
  viz: 'graph',
  big: 'O(V + E)',
  best: 'O(V + E)',
  space: 'O(V)',
  idea:
    'DFS duyệt đồ thị bằng cách đi sâu hết mức theo một nhánh rồi mới quay lui để thử nhánh khác. ' +
    'Nó dùng đệ quy (hoặc một ngăn xếp). DFS là nền tảng cho dò đường, phát hiện chu trình, sắp xếp ' +
    'tô-pô và nhiều bài toán khác.',
  source: SOURCE,
  playback: `${SOURCE}\n\nadj = [[1, 2], [0, 3], [0, 3, 4], [1, 2, 5], [2, 5], [3, 4]]\nprint(dfs(adj, 0))`,
  nodes: NODES,
  edges: EDGES,
  starts: [0, 1, 2, 3, 4, 5],
  graphCurated,
  nodeLegend: [
    ['idle', 'chưa thăm'],
    ['current', 'đang trong ngăn xếp'],
    ['visited', 'đã xong'],
  ],
  complexityNotes: [
    'Mỗi đỉnh được thăm đúng một lần, mỗi cạnh được xét một lần (hai lần với đồ thị vô hướng).',
    'Tổng cộng O(V + E), giống BFS. Bộ nhớ O(V) cho mảng đã thăm và ngăn xếp đệ quy.',
    'Khác BFS ở thứ tự duyệt: DFS đi sâu trước, BFS lan rộng theo lớp.',
  ],
  problems: [
    {
      id: 'order',
      title: 'Thứ tự duyệt DFS',
      level: 'Trung bình',
      statement: 'Cho danh sách kề adj và đỉnh start, cài đặt dfs_order(adj, start) trả về thứ tự các đỉnh DFS thăm.',
      hint: 'Dùng một hàm đệ quy visit(u): đánh dấu thăm, thêm vào kết quả, rồi gọi visit cho từng đỉnh kề chưa thăm.',
      funcName: 'dfs_order',
      starter: `def dfs_order(adj, start):
    return []`,
      solution: `def dfs_order(adj, start):
    visited = [False] * len(adj)
    order = []
    def visit(u):
        visited[u] = True
        order.append(u)
        for v in adj[u]:
            if not visited[v]:
                visit(v)
    visit(start)
    return order`,
      cases: [
        { name: 'đồ thị 6 đỉnh', args: [[[1, 2], [0, 3], [0, 3, 4], [1, 2, 5], [2, 5], [3, 4]], 0], expected: [0, 1, 3, 2, 4, 5] },
        { name: 'đường thẳng', args: [[[1], [0, 2], [1, 3], [2]], 0], expected: [0, 1, 2, 3] },
        { name: 'một đỉnh', args: [[[]], 0], expected: [0] },
      ],
    },
    {
      id: 'path',
      title: 'Có đường đi không',
      level: 'Trung bình',
      statement: 'Cài đặt has_path(adj, s, t) trả về True nếu có đường đi từ s tới t, ngược lại False.',
      hint: 'Chạy DFS từ s, nếu trong quá trình thăm gặp t thì có đường đi.',
      funcName: 'has_path',
      starter: `def has_path(adj, s, t):
    return False`,
      solution: `def has_path(adj, s, t):
    visited = [False] * len(adj)
    def visit(u):
        if u == t:
            return True
        visited[u] = True
        for v in adj[u]:
            if not visited[v] and visit(v):
                return True
        return False
    return visit(s)`,
      cases: [
        { name: 'có đường', args: [[[1, 2], [0, 3], [0, 3, 4], [1, 2, 5], [2, 5], [3, 4]], 0, 5], expected: true },
        { name: 'không đường', args: [[[1], [0], [3], [2]], 0, 3], expected: false },
        { name: 's bằng t', args: [[[1], [0]], 1, 1], expected: true },
      ],
    },
  ],
};
