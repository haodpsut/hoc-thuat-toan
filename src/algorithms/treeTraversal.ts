import type { Algorithm, GraphNode, GraphStep, NodeState } from '../engine/types';

// 1 def inorder(node, out):
// 2     if node is None:
// 3         return
// 4     inorder(node.left, out)
// 5     out.append(node.val)
// 6     inorder(node.right, out)
const SOURCE = `def inorder(node, out):
    if node is None:
        return
    inorder(node.left, out)
    out.append(node.val)
    inorder(node.right, out)`;

// Same fixed tree as the binary search tree lesson.
const NODES: GraphNode[] = [
  { id: 50, label: '50', x: 270, y: 50 },
  { id: 30, label: '30', x: 130, y: 130 },
  { id: 70, label: '70', x: 410, y: 130 },
  { id: 20, label: '20', x: 60, y: 210 },
  { id: 40, label: '40', x: 200, y: 210 },
  { id: 60, label: '60', x: 340, y: 210 },
  { id: 80, label: '80', x: 480, y: 210 },
];
const EDGES = [
  { from: 50, to: 30 },
  { from: 50, to: 70 },
  { from: 30, to: 20 },
  { from: 30, to: 40 },
  { from: 70, to: 60 },
  { from: 70, to: 80 },
];
const LEFT: Record<number, number> = { 50: 30, 30: 20, 70: 60 };
const RIGHT: Record<number, number> = { 50: 70, 30: 40, 70: 80 };

function graphCurated(): GraphStep[] {
  const state: Record<number, NodeState> = {};
  for (const n of NODES) state[n.id] = 'idle'; // all nodes visible from the start
  const steps: GraphStep[] = [];
  const out: number[] = [];
  const push = (line: number, vars: GraphStep['vars'], note: string) =>
    steps.push({ nodeState: { ...state }, activeEdges: [], line, vars, note });

  const go = (u: number | undefined) => {
    if (u === undefined) {
      push(3, { out: [...out] }, `Nhánh rỗng, quay lui.`);
      return;
    }
    state[u] = 'current';
    push(4, { out: [...out] }, `Tại nút ${u}: duyệt cây con trái trước.`);
    go(LEFT[u]);
    state[u] = 'visited';
    out.push(u);
    push(5, { out: [...out] }, `Đã xong bên trái của ${u}: ghi ${u} vào kết quả. out = [${out.join(', ')}].`);
    push(6, { out: [...out] }, `Tiếp tục duyệt cây con phải của ${u}.`);
    go(RIGHT[u]);
  };

  push(1, { out: [...out] }, `Duyệt giữa (in-order): trái, gốc, phải. Bắt đầu từ gốc 50.`);
  go(50);
  push(1, { out: [...out] }, `Hoàn tất. Thứ tự duyệt giữa: ${out.join(', ')} (chính là dãy tăng dần).`);
  return steps;
}

export const treeTraversal: Algorithm = {
  id: 'tree-traversal',
  name: 'Duyệt cây nhị phân',
  category: 'Cây',
  viz: 'graph',
  big: 'O(n)',
  best: 'O(n)',
  space: 'O(h)',
  idea:
    'Duyệt cây là thăm lần lượt mọi nút theo một quy tắc. Duyệt giữa (in-order) thăm cây con trái, ' +
    'rồi gốc, rồi cây con phải. Với cây tìm kiếm nhị phân, duyệt giữa cho ra đúng dãy tăng dần. ' +
    'Còn duyệt trước (pre-order) thăm gốc trước, hữu ích khi cần sao chép cây.',
  source: SOURCE,
  playback: `def inorder_values(values):
    tree = {}
    root = None
    for x in values:
        if root is None:
            root = x; tree[x] = [None, None]; continue
        node = root
        while True:
            if x < node:
                if tree[node][0] is None:
                    tree[node][0] = x; tree[x] = [None, None]; break
                node = tree[node][0]
            else:
                if tree[node][1] is None:
                    tree[node][1] = x; tree[x] = [None, None]; break
                node = tree[node][1]
    out = []
    def go(n):
        if n is None:
            return
        go(tree[n][0]); out.append(n); go(tree[n][1])
    go(root)
    return out

print(inorder_values([50, 30, 70, 20, 40, 60, 80]))`,
  nodes: NODES,
  edges: EDGES,
  graphCurated,
  nodeLegend: [
    ['idle', 'chưa thăm'],
    ['current', 'đang duyệt cây con'],
    ['visited', 'đã ghi vào kết quả'],
  ],
  complexityNotes: [
    'Mỗi nút được thăm đúng một lần nên duyệt cây là O(n) với n là số nút.',
    'Bộ nhớ phụ là O(h) cho ngăn xếp đệ quy, với h là chiều cao cây.',
    'Đổi thứ tự ba thao tác (trái, gốc, phải) sẽ cho các kiểu duyệt khác: trước, giữa, sau.',
  ],
  problems: [
    {
      id: 'inorder',
      title: 'Duyệt giữa',
      level: 'Trung bình',
      statement: 'Cho danh sách values, dựng cây tìm kiếm nhị phân rồi cài inorder_values(values) trả về kết quả duyệt giữa.',
      hint: 'Duyệt giữa: đệ quy cây con trái, ghi nút hiện tại, rồi đệ quy cây con phải.',
      funcName: 'inorder_values',
      starter: `def inorder_values(values):
    return []`,
      solution: `def inorder_values(values):
    tree = {}
    root = None
    for x in values:
        if root is None:
            root = x; tree[x] = [None, None]; continue
        node = root
        while True:
            if x < node:
                if tree[node][0] is None:
                    tree[node][0] = x; tree[x] = [None, None]; break
                node = tree[node][0]
            else:
                if tree[node][1] is None:
                    tree[node][1] = x; tree[x] = [None, None]; break
                node = tree[node][1]
    out = []
    def go(n):
        if n is None:
            return
        go(tree[n][0]); out.append(n); go(tree[n][1])
    go(root)
    return out`,
      cases: [
        { name: 'cây 7 nút', args: [[50, 30, 70, 20, 40, 60, 80]], expected: [20, 30, 40, 50, 60, 70, 80] },
        { name: 'ba nút', args: [[5, 3, 8]], expected: [3, 5, 8] },
        { name: 'rỗng', args: [[]], expected: [] },
      ],
    },
    {
      id: 'preorder',
      title: 'Duyệt trước',
      level: 'Trung bình',
      statement: 'Cài preorder_values(values): dựng cây tìm kiếm nhị phân rồi duyệt trước (gốc, trái, phải).',
      hint: 'Duyệt trước: ghi nút hiện tại trước, rồi đệ quy trái, rồi phải.',
      funcName: 'preorder_values',
      starter: `def preorder_values(values):
    return []`,
      solution: `def preorder_values(values):
    tree = {}
    root = None
    for x in values:
        if root is None:
            root = x; tree[x] = [None, None]; continue
        node = root
        while True:
            if x < node:
                if tree[node][0] is None:
                    tree[node][0] = x; tree[x] = [None, None]; break
                node = tree[node][0]
            else:
                if tree[node][1] is None:
                    tree[node][1] = x; tree[x] = [None, None]; break
                node = tree[node][1]
    out = []
    def go(n):
        if n is None:
            return
        out.append(n); go(tree[n][0]); go(tree[n][1])
    go(root)
    return out`,
      cases: [
        { name: 'cây 7 nút', args: [[50, 30, 70, 20, 40, 60, 80]], expected: [50, 30, 20, 40, 70, 60, 80] },
        { name: 'ba nút', args: [[5, 3, 8]], expected: [5, 3, 8] },
        { name: 'rỗng', args: [[]], expected: [] },
      ],
    },
  ],
};
