import type { Algorithm, GraphNode, GraphStep, NodeState } from '../engine/types';

// 1  def insert(root, x):
// 2      if root is None:
// 3          return Node(x)
// 4      node = root
// 5      while True:
// 6          if x < node.val:
// 7              if node.left is None:
// 8                  node.left = Node(x)
// 9                  break
// 10             node = node.left
// 11         else:
// 12             if node.right is None:
// 13                 node.right = Node(x)
// 14                 break
// 15             node = node.right
// 16     return root
const SOURCE = `def insert(root, x):
    if root is None:
        return Node(x)
    node = root
    while True:
        if x < node.val:
            if node.left is None:
                node.left = Node(x)
                break
            node = node.left
        else:
            if node.right is None:
                node.right = Node(x)
                break
            node = node.right
    return root`;

// Insertion order that builds a balanced demo tree. Node id = value.
const VALUES = [50, 30, 70, 20, 40, 60, 80];
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

function graphCurated(): GraphStep[] {
  const state: Record<number, NodeState> = {};
  const active: string[] = [];
  const steps: GraphStep[] = [];
  const left: Record<number, number> = {};
  const right: Record<number, number> = {};
  let root: number | null = null;
  const push = (line: number, vars: GraphStep['vars'], note: string) =>
    steps.push({ nodeState: { ...state }, activeEdges: [...active], line, vars, note });

  push(1, {}, `Cây rỗng. Ta sẽ chèn lần lượt các giá trị: ${VALUES.join(', ')}.`);
  for (const x of VALUES) {
    push(1, { x }, `Chèn giá trị ${x} vào cây.`);
    if (root === null) {
      root = x;
      state[x] = 'visited';
      push(3, { x }, `Cây đang rỗng nên ${x} trở thành gốc.`);
      continue;
    }
    let cur = root;
    while (true) {
      state[cur] = 'current';
      push(6, { x, dang_xet: cur }, `So sánh ${x} với nút ${cur}.`);
      state[cur] = 'visited';
      if (x < cur) {
        if (left[cur] === undefined) {
          left[cur] = x;
          state[x] = 'visited';
          active.push(`${cur}-${x}`);
          push(8, { x, dang_xet: cur }, `${x} < ${cur} và bên trái trống: đặt ${x} làm con trái của ${cur}.`);
          break;
        }
        push(10, { x, dang_xet: cur }, `${x} < ${cur}: đi xuống cây con trái.`);
        cur = left[cur];
      } else {
        if (right[cur] === undefined) {
          right[cur] = x;
          state[x] = 'visited';
          active.push(`${cur}-${x}`);
          push(13, { x, dang_xet: cur }, `${x} >= ${cur} và bên phải trống: đặt ${x} làm con phải của ${cur}.`);
          break;
        }
        push(15, { x, dang_xet: cur }, `${x} >= ${cur}: đi xuống cây con phải.`);
        cur = right[cur];
      }
    }
  }
  push(16, {}, `Đã chèn xong tất cả. Cây tìm kiếm nhị phân hoàn chỉnh: duyệt giữa cho ra dãy tăng dần.`);
  return steps;
}

export const bst: Algorithm = {
  id: 'binary-search-tree',
  name: 'Cây tìm kiếm nhị phân',
  category: 'Cây',
  viz: 'graph',
  big: 'O(h)',
  best: 'O(log n)',
  space: 'O(n)',
  idea:
    'Cây tìm kiếm nhị phân là cây mà với mỗi nút, mọi giá trị bên trái nhỏ hơn nút, mọi giá trị bên ' +
    'phải lớn hơn hoặc bằng nút. Nhờ tính chất này, khi chèn hay tìm một giá trị, ở mỗi nút ta chỉ cần ' +
    'so sánh rồi rẽ trái hoặc phải, bỏ qua hẳn một nửa cây còn lại.',
  source: SOURCE,
  playback: `# Bản chạy được: dựng cây bằng dict rồi duyệt giữa
def bst_sort(values):
    tree = {}
    root = None
    for x in values:
        if root is None:
            root = x
            tree[x] = [None, None]
            continue
        node = root
        while True:
            if x < node:
                if tree[node][0] is None:
                    tree[node][0] = x
                    tree[x] = [None, None]
                    break
                node = tree[node][0]
            else:
                if tree[node][1] is None:
                    tree[node][1] = x
                    tree[x] = [None, None]
                    break
                node = tree[node][1]
    out = []
    def inorder(n):
        if n is None:
            return
        inorder(tree[n][0])
        out.append(n)
        inorder(tree[n][1])
    inorder(root)
    return out

print(bst_sort([50, 30, 70, 20, 40, 60, 80]))`,
  nodes: NODES,
  edges: EDGES,
  graphCurated,
  nodeLegend: [
    ['idle', 'chưa chèn'],
    ['current', 'đang so sánh'],
    ['visited', 'đã có trong cây'],
  ],
  complexityNotes: [
    'Mỗi thao tác chèn hoặc tìm đi từ gốc xuống, tốn số bước bằng chiều cao cây h, tức O(h).',
    'Khi cây cân bằng, chiều cao chỉ khoảng log n nên thao tác là O(log n), rất nhanh.',
    'Khi dữ liệu vào theo thứ tự đã sắp, cây bị suy biến thành một đường thẳng, chiều cao bằng n, lúc đó thao tác là O(n). Đây là lý do cần các cây cân bằng như AVL hay đỏ đen.',
  ],
  problems: [
    {
      id: 'sort',
      title: 'Sắp xếp bằng cây',
      level: 'Trung bình',
      statement:
        'Cài đặt bst_sort(values) trả về danh sách các giá trị được sắp tăng dần, bằng cách chèn tất cả ' +
        'vào một cây tìm kiếm nhị phân rồi duyệt giữa (in-order). Giả sử các giá trị đôi một khác nhau.',
      hint: 'Chèn lần lượt từng giá trị. Duyệt giữa: duyệt cây con trái, thăm nút, duyệt cây con phải sẽ cho dãy tăng dần.',
      funcName: 'bst_sort',
      starter: `def bst_sort(values):
    # Chèn vào BST rồi duyệt giữa
    return []`,
      solution: `def bst_sort(values):
    tree = {}   # val -> [left, right]
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
    def inorder(n):
        if n is None:
            return
        inorder(tree[n][0]); out.append(n); inorder(tree[n][1])
    inorder(root)
    return out`,
      cases: [
        { name: 'mảng thường', args: [[50, 30, 70, 20, 40]], expected: [20, 30, 40, 50, 70] },
        { name: 'đã sắp', args: [[1, 2, 3]], expected: [1, 2, 3] },
        { name: 'sắp ngược', args: [[3, 2, 1]], expected: [1, 2, 3] },
        { name: 'rỗng', args: [[]], expected: [] },
        { name: 'một phần tử', args: [[5]], expected: [5] },
      ],
    },
    {
      id: 'search',
      title: 'Tìm trong cây',
      level: 'Dễ',
      statement:
        'Cài đặt bst_search(values, target) dựng cây tìm kiếm nhị phân từ values rồi trả về True nếu ' +
        'target có trong cây, ngược lại False.',
      hint: 'Sau khi dựng cây, đi từ gốc: bằng thì trả True, nhỏ hơn thì sang trái, lớn hơn thì sang phải.',
      funcName: 'bst_search',
      starter: `def bst_search(values, target):
    return False`,
      solution: `def bst_search(values, target):
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
    node = root
    while node is not None:
        if target == node:
            return True
        node = tree[node][0] if target < node else tree[node][1]
    return False`,
      cases: [
        { name: 'có target', args: [[50, 30, 70, 20], 30], expected: true },
        { name: 'không có', args: [[50, 30, 70, 20], 99], expected: false },
        { name: 'tìm gốc', args: [[50, 30, 70], 50], expected: true },
        { name: 'cây rỗng', args: [[], 5], expected: false },
      ],
    },
  ],
};
