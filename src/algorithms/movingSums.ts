import type { Algorithm, Step } from '../engine/types';

// 1 def moving_sums(a, k):
// 2     if k <= 0 or k > len(a):
// 3         return []
// 4     sum = 0
// 5     for i in range(k):
// 6         sum += a[i]
// 7     res = [sum]
// 8     for start in range(1, len(a) - k + 1):
// 9         sum += a[start + k - 1] - a[start - 1]
// 10        res.append(sum)
// 11    return res
const SOURCE = `def moving_sums(a, k):
    if k <= 0 or k > len(a):
        return []
    sum = 0
    for i in range(k):
        sum += a[i]
    res = [sum]
    for start in range(1, len(a) - k + 1):
        sum += a[start + k - 1] - a[start - 1]
        res.append(sum)
    return res`;

// Build a hand-authored trace that emits the sum of every window of width k
// (default k = 3) as the window slides left to right. `compare` paints the
// indices in the current window; `start` is the index of the window's left edge.
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
    push(2, [], [], { k }, `Cửa sổ k = ${k} không hợp lệ với mảng ${n} phần tử. Trả về danh sách rỗng.`);
    return steps;
  }

  push(1, [], [], { k }, `Tính tổng của mọi cửa sổ liên tiếp rộng k = ${k}. Có ${n - k + 1} cửa sổ.`);

  let sum = 0;
  for (let i = 0; i < k; i++) {
    sum += a[i];
    push(6, window(0).slice(0, i + 1), [], { k, sum, i }, `Cộng dồn a[${i}] = ${a[i]} cho cửa sổ đầu. sum = ${sum}.`);
  }
  const res: number[] = [sum];
  push(7, window(0), [], { k, start: 0, sum }, `Tổng cửa sổ đầu [0..${k - 1}] = ${sum}. Ghi vào kết quả.`);

  for (let start = 1; start <= n - k; start++) {
    sum += a[start + k - 1] - a[start - 1];
    push(
      9,
      window(start),
      [],
      { k, start, sum },
      `Trượt sang phải: cộng a[${start + k - 1}] = ${a[start + k - 1]}, trừ a[${start - 1}] = ${a[start - 1]}. sum = ${sum}.`,
    );
    res.push(sum);
    push(10, window(start), [], { k, start, sum }, `Ghi tổng cửa sổ thứ ${res.length} = ${sum} vào kết quả.`);
  }

  push(11, [], window(n - k), { k }, `Đã có đủ ${res.length} tổng cửa sổ. Trả về danh sách [${res.join(', ')}].`);
  return steps;
}

export const movingSums: Algorithm = {
  id: 'moving-sums',
  name: 'Tổng trượt cửa sổ k',
  category: 'Cửa sổ trượt',
  viz: 'array',
  big: 'O(n)',
  best: 'O(n)',
  space: 'O(n)',
  needsTarget: true,
  defaultInput: '2, 1, 5, 1, 3, 2',
  defaultTarget: 3,
  targetLabel: 'k',
  idea:
    'Thay vì chỉ giữ lại một tổng tốt nhất, ở đây ta ghi lại tổng của tất cả các cửa sổ liên tiếp rộng k. ' +
    'Mảng n phần tử có đúng n - k + 1 cửa sổ như vậy. Vẫn dùng kỹ thuật cửa sổ trượt: tính tổng cửa sổ đầu, ' +
    'rồi mỗi lần trượt thì cộng phần tử mới và trừ phần tử cũ, ghi tổng hiện tại vào danh sách kết quả.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(moving_sums([2, 1, 5, 1, 3, 2], 3))`,
  curated,
  arrayLegend: [
    ['bar', 'ngoài cửa sổ'],
    ['compare', 'cửa sổ hiện tại'],
    ['found', 'cửa sổ cuối'],
  ],
  complexityNotes: [
    'Cách ngây thơ cộng lại k phần tử cho từng cửa sổ tốn O(n·k). Cửa sổ trượt cập nhật tổng trong O(1) mỗi bước nên tổng thời gian là O(n).',
    'Có n - k + 1 cửa sổ, ta lưu mọi tổng vào danh sách kết quả nên bộ nhớ phụ là O(n).',
    'Đây là tiền đề cho nhiều bài toán dãy con liên tiếp: trung bình trượt, phát hiện đoạn vượt ngưỡng, làm mượt tín hiệu.',
  ],
  problems: [
    {
      id: 'moving-sums',
      title: 'Danh sách tổng trượt',
      level: 'Trung bình',
      statement:
        'Cài đặt moving_sums(a, k) trả về danh sách tổng của mọi cửa sổ liên tiếp rộng k trong a. ' +
        'Nếu k > len(a) hoặc k <= 0 thì trả về [].',
      hint: 'Tính tổng cửa sổ đầu, ghi vào kết quả, rồi mỗi lần trượt thì cộng phần tử mới, trừ phần tử cũ và ghi tổng mới.',
      funcName: 'moving_sums',
      starter: `def moving_sums(a, k):
    return []`,
      solution: `def moving_sums(a, k):
    if k <= 0 or k > len(a):
        return []
    s = sum(a[:k])
    res = [s]
    for start in range(1, len(a) - k + 1):
        s += a[start + k - 1] - a[start - 1]
        res.append(s)
    return res`,
      cases: [
        { name: 'mảng thường', args: [[2, 1, 5, 1, 3, 2], 3], expected: [8, 7, 9, 6] },
        { name: 'k bằng độ dài', args: [[4, 2, 1], 3], expected: [7] },
        { name: 'k = 1', args: [[3, 7, 2], 1], expected: [3, 7, 2] },
        { name: 'có số âm', args: [[-1, -2, -3, -4], 2], expected: [-3, -5, -7] },
        { name: 'k quá lớn', args: [[1, 2], 5], expected: [] },
        { name: 'k không hợp lệ', args: [[1, 2, 3], 0], expected: [] },
      ],
    },
    {
      id: 'count-windows',
      title: 'Số cửa sổ',
      level: 'Dễ',
      statement:
        'Cài đặt count_windows(a, k) trả về số cửa sổ liên tiếp rộng k trong a, bằng max(0, len(a) - k + 1).',
      hint: 'Số cửa sổ là len(a) - k + 1, nhưng không bao giờ nhỏ hơn 0.',
      funcName: 'count_windows',
      starter: `def count_windows(a, k):
    return 0`,
      solution: `def count_windows(a, k):
    return max(0, len(a) - k + 1)`,
      cases: [
        { name: 'mảng thường', args: [[2, 1, 5, 1, 3, 2], 3], expected: 4 },
        { name: 'k bằng độ dài', args: [[4, 2, 1], 3], expected: 1 },
        { name: 'k = 1', args: [[3, 7, 2], 1], expected: 3 },
        { name: 'k quá lớn', args: [[1, 2], 5], expected: 0 },
        { name: 'rỗng', args: [[], 2], expected: 0 },
      ],
    },
  ],
};
