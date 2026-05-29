import type { Algorithm, Step } from '../engine/types';

// 1 def two_sum(a, target):
// 2     lo = 0
// 3     hi = len(a) - 1
// 4     while lo < hi:
// 5         s = a[lo] + a[hi]
// 6         if s == target:
// 7             return [lo, hi]
// 8         if s < target:
// 9             lo = lo + 1
// 10         else:
// 11             hi = hi - 1
// 12     return [-1, -1]
const SOURCE = `def two_sum(a, target):
    lo = 0
    hi = len(a) - 1
    while lo < hi:
        s = a[lo] + a[hi]
        if s == target:
            return [lo, hi]
        if s < target:
            lo = lo + 1
        else:
            hi = hi - 1
    return [-1, -1]`;

function curated(input: number[], target = 0): Step[] {
  const a = input.slice().sort((x, y) => x - y); // two-pointer needs a sorted array
  const n = a.length;
  const steps: Step[] = [];
  const push = (line: number, compare: number[], found: number[], vars: Step['vars'], note: string) =>
    steps.push({ array: a.slice(), compare, swap: [], sorted: [], excluded: [], found, line, vars, note });

  let lo = 0;
  let hi = n - 1;
  push(2, [], [], { lo, hi, target }, `Mảng đã sắp tăng dần. Đặt lo = 0 ở đầu, hi = ${hi} ở cuối. Cần tổng ${target}.`);
  while (lo < hi) {
    const s = a[lo] + a[hi];
    push(5, [lo, hi], [], { lo, hi, target }, `Tổng a[${lo}] + a[${hi}] = ${a[lo]} + ${a[hi]} = ${s}.`);
    if (s === target) {
      push(7, [], [lo, hi], { lo, hi, target }, `Đúng bằng ${target}. Tìm thấy cặp tại vị trí ${lo} và ${hi}.`);
      return steps;
    }
    if (s < target) {
      lo = lo + 1;
      push(9, [], [], { lo, hi, target }, `Tổng ${s} nhỏ hơn ${target}. Cần lớn hơn nên dời lo lên: lo = ${lo}.`);
    } else {
      hi = hi - 1;
      push(11, [], [], { lo, hi, target }, `Tổng ${s} lớn hơn ${target}. Cần nhỏ hơn nên dời hi xuống: hi = ${hi}.`);
    }
  }
  push(12, [], [], { lo, hi, target }, `Hai con trỏ gặp nhau mà không có cặp nào. Trả về [-1, -1].`);
  return steps;
}

export const twoSumSorted: Algorithm = {
  id: 'two-sum-sorted',
  name: 'Tổng hai số (mảng đã sắp)',
  category: 'Hai con trỏ',
  viz: 'array',
  big: 'O(n)',
  best: 'O(1)',
  space: 'O(1)',
  needsTarget: true,
  defaultInput: '2, 4, 7, 9, 11, 15',
  defaultTarget: 17,
  targetLabel: 'tổng cần tìm',
  idea:
    'Cho một mảng đã sắp tăng dần, tìm hai phần tử có tổng bằng giá trị cho trước. Ta đặt một con trỏ lo ' +
    'ở đầu và một con trỏ hi ở cuối rồi xét tổng a[lo] + a[hi]. Nếu tổng đúng bằng đích thì xong. Nếu tổng ' +
    'nhỏ quá, dời lo lên để tăng tổng. Nếu tổng lớn quá, dời hi xuống để giảm tổng. Nhờ mảng đã sắp, mỗi ' +
    'bước loại được một đầu nên chỉ cần một lượt duyệt.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(two_sum([2, 4, 7, 9, 11, 15], 17))`,
  curated,
  arrayLegend: [
    ['bar', 'chưa xét'],
    ['compare', 'cặp lo và hi'],
    ['found', 'cặp cần tìm'],
  ],
  complexityNotes: [
    'Mỗi vòng lặp hoặc tăng lo, hoặc giảm hi, nên khoảng cách giữa hai con trỏ luôn thu hẹp. Tổng số vòng lặp không quá n, độ phức tạp O(n).',
    'Chỉ dùng vài biến chỉ số, bộ nhớ phụ O(1). Lưu ý mảng phải được sắp trước; nếu chưa sắp thì chi phí sắp xếp là O(n log n).',
    'So với cách thử mọi cặp O(n²), kỹ thuật hai con trỏ tận dụng tính đã sắp để loại bớt lựa chọn ở mỗi bước, nhanh hơn hẳn với mảng lớn.',
  ],
  problems: [
    {
      id: 'two-sum',
      title: 'Tìm cặp có tổng bằng đích',
      level: 'Trung bình',
      statement: 'Cho mảng a đã sắp tăng dần và một số target. Cài đặt two_sum(a, target) trả về [i, j] với i < j sao cho a[i] + a[j] == target. Nếu không có, trả về [-1, -1]. Dùng hai con trỏ.',
      hint: 'Đặt lo = 0, hi = len-1. Xét tổng a[lo] + a[hi]: bằng target thì trả [lo, hi]; nhỏ hơn thì lo tăng; lớn hơn thì hi giảm.',
      funcName: 'two_sum',
      starter: `def two_sum(a, target):
    return [-1, -1]`,
      solution: `def two_sum(a, target):
    lo = 0
    hi = len(a) - 1
    while lo < hi:
        s = a[lo] + a[hi]
        if s == target:
            return [lo, hi]
        if s < target:
            lo = lo + 1
        else:
            hi = hi - 1
    return [-1, -1]`,
      cases: [
        { name: 'có cặp', args: [[2, 4, 7, 9, 11, 15], 17], expected: [0, 5] },
        { name: 'cặp ở giữa', args: [[1, 2, 3, 4, 6], 7], expected: [0, 4] },
        { name: 'không có', args: [[1, 2, 3], 100], expected: [-1, -1] },
        { name: 'rỗng', args: [[], 5], expected: [-1, -1] },
        { name: 'một phần tử', args: [[5], 5], expected: [-1, -1] },
        { name: 'có số âm', args: [[-3, -1, 0, 2, 4], 1], expected: [0, 4] },
      ],
    },
    {
      id: 'has-pair',
      title: 'Có tồn tại cặp tổng',
      level: 'Dễ',
      statement: 'Cho mảng a đã sắp tăng dần và số target. Cài đặt has_pair_sum(a, target) trả về True nếu tồn tại hai phần tử khác vị trí có tổng bằng target, ngược lại False.',
      hint: 'Dùng hai con trỏ như two_sum nhưng chỉ cần trả True ngay khi tìm thấy tổng đúng, hết vòng thì trả False.',
      funcName: 'has_pair_sum',
      starter: `def has_pair_sum(a, target):
    return False`,
      solution: `def has_pair_sum(a, target):
    lo = 0
    hi = len(a) - 1
    while lo < hi:
        s = a[lo] + a[hi]
        if s == target:
            return True
        if s < target:
            lo = lo + 1
        else:
            hi = hi - 1
    return False`,
      cases: [
        { name: 'có cặp', args: [[2, 4, 7, 9, 11, 15], 17], expected: true },
        { name: 'không có', args: [[1, 2, 3], 100], expected: false },
        { name: 'rỗng', args: [[], 0], expected: false },
        { name: 'một phần tử', args: [[5], 10], expected: false },
        { name: 'có số âm', args: [[-3, -1, 0, 2, 4], 1], expected: true },
      ],
    },
  ],
};
