import type { Algorithm, Step } from '../engine/types';

// 1 def selection_sort(a):
// 2     n = len(a)
// 3     for i in range(n):
// 4         m = i
// 5         for j in range(i + 1, n):
// 6             if a[j] < a[m]:
// 7                 m = j
// 8         a[i], a[m] = a[m], a[i]
// 9     return a
const SOURCE = `def selection_sort(a):
    n = len(a)
    for i in range(n):
        m = i
        for j in range(i + 1, n):
            if a[j] < a[m]:
                m = j
        a[i], a[m] = a[m], a[i]
    return a`;

function curated(input: number[]): Step[] {
  const a = input.slice();
  const n = a.length;
  const sorted: number[] = [];
  const steps: Step[] = [];
  const push = (line: number, compare: number[], swap: number[], vars: Step['vars'], note: string) =>
    steps.push({ array: a.slice(), compare, swap, sorted: sorted.slice(), excluded: [], found: [], line, vars, note });

  push(2, [], [], { n }, `Bắt đầu. Mỗi vòng tìm phần tử nhỏ nhất còn lại rồi đưa lên đầu.`);
  for (let i = 0; i < n; i++) {
    let m = i;
    push(4, [i], [], { i, m }, `Vòng i = ${i}. Tạm coi a[${i}] = ${a[i]} là nhỏ nhất.`);
    for (let j = i + 1; j < n; j++) {
      push(6, [j, m], [], { i, j, m }, `So sánh a[${j}] = ${a[j]} với nhỏ nhất hiện tại a[${m}] = ${a[m]}.`);
      if (a[j] < a[m]) {
        m = j;
        push(7, [m], [], { i, j, m }, `Tìm thấy nhỏ hơn. Cập nhật m = ${m}.`);
      }
    }
    if (m !== i) push(8, [], [i, m], { i, m }, `Đưa ${a[m]} lên vị trí ${i}.`);
    [a[i], a[m]] = [a[m], a[i]];
    sorted.push(i);
    push(8, [], [], { i }, `Vị trí ${i} đã chốt với giá trị ${a[i]}.`);
  }
  push(9, [], [], {}, `Hoàn tất. Mảng đã được sắp xếp tăng dần.`);
  return steps;
}

export const selectionSort: Algorithm = {
  id: 'selection-sort',
  name: 'Sắp xếp chọn',
  category: 'Sắp xếp',
  viz: 'array',
  big: 'O(n²)',
  best: 'O(n²)',
  space: 'O(1)',
  idea:
    'Sắp xếp chọn chia mảng thành phần đã sắp ở đầu và phần chưa sắp. Mỗi vòng, ta quét toàn bộ phần ' +
    'chưa sắp để tìm phần tử nhỏ nhất rồi đổi nó lên đầu phần chưa sắp. Khác nổi bọt ở chỗ số lần hoán ' +
    'đổi rất ít, tối đa n lần.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(selection_sort([5, 2, 9, 1, 6, 3]))`,
  curated,
  complexityNotes: [
    'Luôn quét hết phần chưa sắp để tìm nhỏ nhất, nên số phép so sánh luôn xấp xỉ n(n-1)/2, tức O(n²) kể cả khi mảng đã sắp.',
    'Số lần hoán đổi chỉ tối đa n, ít hơn hẳn nổi bọt. Hữu ích khi việc ghi/đổi chỗ tốn kém.',
    'Sắp xếp tại chỗ, bộ nhớ phụ O(1).',
  ],
  opCount: (n) => (n * (n - 1)) / 2,
  opCountLabel: 'Số phép so sánh theo n (luôn xấp xỉ n²/2, không phụ thuộc dữ liệu).',
  problems: [
    {
      id: 'sort',
      title: 'Sắp xếp tăng dần',
      level: 'Dễ',
      statement: 'Cài đặt selection_sort(a) trả về danh sách mới sắp tăng dần, dùng tư tưởng chọn phần tử nhỏ nhất.',
      hint: 'Với mỗi i, tìm chỉ số m của phần tử nhỏ nhất trong a[i:], rồi đổi chỗ a[i] với a[m].',
      funcName: 'selection_sort',
      starter: `def selection_sort(a):
    a = list(a)
    return a`,
      solution: `def selection_sort(a):
    a = list(a)
    n = len(a)
    for i in range(n):
        m = i
        for j in range(i + 1, n):
            if a[j] < a[m]:
                m = j
        a[i], a[m] = a[m], a[i]
    return a`,
      cases: [
        { name: 'mảng thường', args: [[5, 2, 8, 1, 9, 3]], expected: [1, 2, 3, 5, 8, 9] },
        { name: 'rỗng', args: [[]], expected: [] },
        { name: 'sắp ngược', args: [[4, 3, 2, 1]], expected: [1, 2, 3, 4] },
        { name: 'trùng lặp', args: [[3, 1, 3, 2]], expected: [1, 2, 3, 3] },
        { name: 'số âm', args: [[2, -5, 0, -1]], expected: [-5, -1, 0, 2] },
      ],
    },
    {
      id: 'argmin',
      title: 'Vị trí phần tử nhỏ nhất',
      level: 'Dễ',
      statement: 'Cài đặt index_of_min(a) trả về chỉ số của phần tử nhỏ nhất trong a. Nếu có nhiều, trả chỉ số nhỏ nhất. Mảng rỗng trả -1.',
      hint: 'Duyệt một lượt, giữ lại chỉ số của giá trị nhỏ nhất gặp được.',
      funcName: 'index_of_min',
      starter: `def index_of_min(a):
    return -1`,
      solution: `def index_of_min(a):
    if not a:
        return -1
    m = 0
    for j in range(1, len(a)):
        if a[j] < a[m]:
            m = j
    return m`,
      cases: [
        { name: 'mảng thường', args: [[5, 2, 8, 1, 9]], expected: 3 },
        { name: 'nhỏ nhất ở đầu', args: [[1, 2, 3]], expected: 0 },
        { name: 'trùng nhỏ nhất', args: [[2, 1, 1, 3]], expected: 1 },
        { name: 'rỗng', args: [[]], expected: -1 },
      ],
    },
  ],
};
