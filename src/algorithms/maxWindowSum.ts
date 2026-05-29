import type { Algorithm, Step } from '../engine/types';

// 1 def max_window_sum(a, k):
// 2     if k <= 0 or k > len(a):
// 3         return 0
// 4     sum = 0
// 5     for i in range(k):
// 6         sum += a[i]
// 7     best = sum
// 8     for start in range(1, len(a) - k + 1):
// 9         sum += a[start + k - 1] - a[start - 1]
// 10        if sum > best:
// 11            best = sum
// 12    return best
const SOURCE = `def max_window_sum(a, k):
    if k <= 0 or k > len(a):
        return 0
    sum = 0
    for i in range(k):
        sum += a[i]
    best = sum
    for start in range(1, len(a) - k + 1):
        sum += a[start + k - 1] - a[start - 1]
        if sum > best:
            best = sum
    return best`;

// Build a hand-authored trace for the sliding window of width k (default k = 3).
// `compare` paints the indices inside the current window; `found` paints the best
// window at the final step. `start` is the index of the window's left edge.
function curated(input: number[], target?: number): Step[] {
  const a = input.slice();
  const n = a.length;
  // Window width k; fall back to 3 when the target is missing or invalid.
  let k = typeof target === 'number' && target > 0 ? Math.floor(target) : 3;
  if (k > n) k = 3;

  const steps: Step[] = [];
  const push = (
    line: number,
    compare: number[],
    found: number[],
    vars: Step['vars'],
    note: string,
  ) =>
    steps.push({ array: a.slice(), compare, swap: [], sorted: [], excluded: [], found, line, vars, note });

  // Indices that make up the window starting at a given left edge.
  const window = (start: number) => {
    const idx: number[] = [];
    for (let t = start; t < start + k; t++) idx.push(t);
    return idx;
  };

  if (k <= 0 || k > n) {
    push(2, [], [], { k }, `Cửa sổ k = ${k} không hợp lệ với mảng ${n} phần tử. Trả về 0.`);
    return steps;
  }

  push(1, [], [], { k }, `Dùng cửa sổ trượt rộng k = ${k} để tìm tổng k phần tử liên tiếp lớn nhất.`);

  let sum = 0;
  for (let i = 0; i < k; i++) {
    sum += a[i];
    push(6, window(0).slice(0, i + 1), [], { k, sum, i }, `Cộng dồn a[${i}] = ${a[i]} vào cửa sổ đầu. sum = ${sum}.`);
  }
  let best = sum;
  let bestStart = 0;
  push(7, window(0), [], { k, start: 0, sum, best }, `Tổng cửa sổ đầu [0..${k - 1}] = ${sum}. Tạm coi đây là tốt nhất.`);

  for (let start = 1; start <= n - k; start++) {
    sum += a[start + k - 1] - a[start - 1];
    push(
      9,
      window(start),
      [],
      { k, start, sum, best },
      `Trượt sang phải: cộng a[${start + k - 1}] = ${a[start + k - 1]}, trừ a[${start - 1}] = ${a[start - 1]}. sum = ${sum}.`,
    );
    if (sum > best) {
      best = sum;
      bestStart = start;
      push(11, window(start), [], { k, start, sum, best }, `Cửa sổ này lớn hơn. Cập nhật best = ${best}.`);
    }
  }

  push(12, [], window(bestStart), { k, best }, `Cửa sổ tốt nhất bắt đầu tại ${bestStart}, tổng lớn nhất = ${best}.`);
  return steps;
}

export const maxWindowSum: Algorithm = {
  id: 'max-window-sum',
  name: 'Tổng cửa sổ k lớn nhất',
  category: 'Cửa sổ trượt',
  viz: 'array',
  big: 'O(n)',
  best: 'O(n)',
  space: 'O(1)',
  needsTarget: true,
  defaultInput: '2, 1, 5, 1, 3, 2',
  defaultTarget: 3,
  targetLabel: 'k',
  idea:
    'Cửa sổ trượt giúp tính nhanh tổng của mọi đoạn k phần tử liên tiếp mà không cần cộng lại từ đầu ' +
    'mỗi lần. Ta tính tổng k phần tử đầu, rồi mỗi khi trượt cửa sổ sang phải một bước thì cộng thêm ' +
    'phần tử mới vào bên phải và trừ đi phần tử cũ rơi ra bên trái. Nhờ vậy mỗi bước chỉ tốn vài phép ' +
    'tính, toàn bộ chạy trong O(n).',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(max_window_sum([2, 1, 5, 1, 3, 2], 3))`,
  curated,
  arrayLegend: [
    ['bar', 'ngoài cửa sổ'],
    ['compare', 'cửa sổ hiện tại'],
    ['found', 'cửa sổ tốt nhất'],
  ],
  complexityNotes: [
    'Cách ngây thơ là với mỗi vị trí lại cộng lại k phần tử, tốn O(n·k). Cửa sổ trượt tái sử dụng tổng cũ nên mỗi bước chỉ O(1).',
    'Tính tổng cửa sổ đầu mất O(k), sau đó trượt qua các cửa sổ còn lại mất O(n). Tổng cộng là O(n).',
    'Chỉ cần vài biến phụ là sum và best nên bộ nhớ phụ là O(1).',
  ],
  problems: [
    {
      id: 'max-window-sum',
      title: 'Tổng cửa sổ lớn nhất',
      level: 'Trung bình',
      statement:
        'Cài đặt max_window_sum(a, k) trả về tổng lớn nhất của k phần tử liên tiếp trong a. ' +
        'Nếu k > len(a) hoặc k <= 0 thì trả về 0.',
      hint: 'Tính tổng k phần tử đầu, rồi trượt cửa sổ: cộng phần tử mới, trừ phần tử cũ, giữ lại tổng lớn nhất.',
      funcName: 'max_window_sum',
      starter: `def max_window_sum(a, k):
    return 0`,
      solution: `def max_window_sum(a, k):
    if k <= 0 or k > len(a):
        return 0
    s = sum(a[:k])
    best = s
    for start in range(1, len(a) - k + 1):
        s += a[start + k - 1] - a[start - 1]
        if s > best:
            best = s
    return best`,
      cases: [
        { name: 'mảng thường', args: [[2, 1, 5, 1, 3, 2], 3], expected: 9 },
        { name: 'k bằng độ dài', args: [[4, 2, 1], 3], expected: 7 },
        { name: 'k = 1', args: [[3, 7, 2, 9], 1], expected: 9 },
        { name: 'có số âm', args: [[-1, -2, -3, -4], 2], expected: -3 },
        { name: 'k quá lớn', args: [[1, 2], 5], expected: 0 },
        { name: 'k không hợp lệ', args: [[1, 2, 3], 0], expected: 0 },
      ],
    },
    {
      id: 'min-window-sum',
      title: 'Tổng cửa sổ nhỏ nhất',
      level: 'Trung bình',
      statement:
        'Cài đặt min_window_sum(a, k) trả về tổng nhỏ nhất của k phần tử liên tiếp trong a. ' +
        'Nếu k > len(a) hoặc k <= 0 thì trả về 0.',
      hint: 'Giống tổng lớn nhất nhưng giữ lại tổng nhỏ nhất khi trượt cửa sổ.',
      funcName: 'min_window_sum',
      starter: `def min_window_sum(a, k):
    return 0`,
      solution: `def min_window_sum(a, k):
    if k <= 0 or k > len(a):
        return 0
    s = sum(a[:k])
    best = s
    for start in range(1, len(a) - k + 1):
        s += a[start + k - 1] - a[start - 1]
        if s < best:
            best = s
    return best`,
      cases: [
        { name: 'mảng thường', args: [[2, 1, 5, 1, 3, 2], 3], expected: 6 },
        { name: 'k bằng độ dài', args: [[4, 2, 1], 3], expected: 7 },
        { name: 'k = 1', args: [[3, 7, 2, 9], 1], expected: 2 },
        { name: 'có số âm', args: [[-1, -2, -3, -4], 2], expected: -7 },
        { name: 'k quá lớn', args: [[1, 2], 5], expected: 0 },
        { name: 'k không hợp lệ', args: [[1, 2, 3], -1], expected: 0 },
      ],
    },
  ],
};
