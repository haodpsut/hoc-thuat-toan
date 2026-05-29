import type { Algorithm, Step } from '../engine/types';

// 1 def max_from(a, i):
// 2     if i == len(a) - 1:
// 3         return a[i]
// 4     rest = max_from(a, i + 1)
// 5     return a[i] if a[i] > rest else rest
const SOURCE = `def max_from(a, i):
    if i == len(a) - 1:
        return a[i]
    rest = max_from(a, i + 1)
    return a[i] if a[i] > rest else rest`;

// Recursively find the maximum of a[i:]. The base case is the last element.
// We narrate going down (compare = [i], depth grows) and coming back up: at each
// return we mark the index of the current best candidate with `found`.
function curated(input: number[]): Step[] {
  const a = input.slice();
  const n = a.length;
  const steps: Step[] = [];
  let bestIdx = -1; // index of the current best candidate to highlight via `found`
  const push = (line: number, i: number, vars: Step['vars'], note: string) =>
    steps.push({
      array: a.slice(),
      compare: i >= 0 && i < n ? [i] : [],
      swap: [],
      sorted: [],
      excluded: [],
      found: bestIdx >= 0 ? [bestIdx] : [],
      line,
      vars,
      note,
    });

  // Recursive helper mirroring the Python source. Returns the value of the max
  // of a[i:] and updates bestIdx so the renderer can highlight it.
  function rec(i: number, depth: number): number {
    push(1, i, { i, depth, best: '?' }, `Đi xuống: gọi max_from(a, ${i}). Độ sâu đệ quy = ${depth}.`);
    push(2, i, { i, depth, best: '?' }, `Kiểm tra neo: i = ${i} có là phần tử cuối (chỉ số ${n - 1}) không?`);
    if (i === n - 1) {
      bestIdx = i;
      push(3, i, { i, depth, best: a[i] }, `Chạm đáy ở phần tử cuối. Lớn nhất của a[${i}:] là a[${i}] = ${a[i]}.`);
      return a[i];
    }
    push(4, i, { i, depth, best: '?' }, `Chưa tới đáy. Tìm lớn nhất của a[${i + 1}:] trước đã.`);
    const rest = rec(i + 1, depth + 1);
    const best = a[i] > rest ? a[i] : rest;
    bestIdx = a[i] > rest ? i : bestIdx; // if a[i] wins, the new best is index i
    push(
      5,
      i,
      { i, depth, best },
      `Quay lui ở i = ${i}: so a[${i}] = ${a[i]} với lớn nhất phía sau = ${rest}. Lớn nhất = ${best}.`,
    );
    return best;
  }

  push(1, 0, { i: 0, depth: 0, best: '?' }, `Bắt đầu tìm phần tử lớn nhất bằng max_from(a, 0).`);
  const result = rec(0, 0);
  push(5, bestIdx, { result }, `Hoàn tất. Phần tử lớn nhất của mảng là ${result}.`);
  return steps;
}

export const recursiveMax: Algorithm = {
  id: 'recursive-max',
  name: 'Tìm lớn nhất đệ quy',
  category: 'Đệ quy',
  viz: 'array',
  big: 'O(n)',
  best: 'O(n)',
  space: 'O(n)',
  defaultInput: '3, 7, 2, 8, 5',
  idea:
    'Phần tử lớn nhất của a[i:] có thể tính bằng đệ quy: nếu i đã là phần tử cuối thì lớn nhất chính ' +
    'là a[i]; ngược lại, lớn nhất là giá trị lớn hơn giữa a[i] và lớn nhất của phần còn lại a[i+1:]. ' +
    'Pha đi xuống lần lượt thu hẹp mảng cho tới phần tử cuối làm neo, rồi pha quay lui so từng phần tử ' +
    'với ứng viên lớn nhất tìm được phía sau.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(max_from([3, 7, 2, 8, 5], 0))`,
  curated,
  arrayLegend: [
    ['bar', 'chưa xét'],
    ['compare', 'đang xử lý (i)'],
    ['found', 'ứng viên lớn nhất'],
  ],
  complexityNotes: [
    'Mỗi phần tử được duyệt đúng một lần khi quay lui, nên thời gian là O(n).',
    'Đệ quy đi sâu n tầng, mỗi tầng một khung ngăn xếp, nên bộ nhớ là O(n).',
    'Cùng kết quả với một vòng lặp tìm max O(1) bộ nhớ; ở đây ta dùng đệ quy để minh hoạ tư duy chia bài toán.',
  ],
  problems: [
    {
      id: 'array-max',
      title: 'Lớn nhất bằng đệ quy',
      level: 'Dễ',
      statement:
        'Cài đặt array_max(a) trả về phần tử lớn nhất của a bằng đệ quy. Giả sử a không rỗng.',
      hint: 'Nếu a chỉ có một phần tử trả a[0]; ngược lại so a[0] với array_max(a[1:]).',
      funcName: 'array_max',
      starter: `def array_max(a):
    return a[0]`,
      solution: `def array_max(a):
    if len(a) == 1:
        return a[0]
    rest = array_max(a[1:])
    return a[0] if a[0] > rest else rest`,
      cases: [
        { name: 'mảng thường', args: [[3, 7, 2, 8, 5]], expected: 8 },
        { name: 'một phần tử', args: [[42]], expected: 42 },
        { name: 'lớn nhất ở đầu', args: [[9, 1, 4, 2]], expected: 9 },
        { name: 'toàn âm', args: [[-3, -7, -1, -5]], expected: -1 },
      ],
    },
    {
      id: 'array-min',
      title: 'Nhỏ nhất bằng đệ quy',
      level: 'Dễ',
      statement:
        'Cài đặt array_min(a) trả về phần tử nhỏ nhất của a bằng đệ quy. Giả sử a không rỗng.',
      hint: 'Nếu a chỉ có một phần tử trả a[0]; ngược lại so a[0] với array_min(a[1:]).',
      funcName: 'array_min',
      starter: `def array_min(a):
    return a[0]`,
      solution: `def array_min(a):
    if len(a) == 1:
        return a[0]
    rest = array_min(a[1:])
    return a[0] if a[0] < rest else rest`,
      cases: [
        { name: 'mảng thường', args: [[3, 7, 2, 8, 5]], expected: 2 },
        { name: 'một phần tử', args: [[42]], expected: 42 },
        { name: 'nhỏ nhất ở cuối', args: [[9, 4, 6, 1]], expected: 1 },
        { name: 'toàn âm', args: [[-3, -7, -1, -5]], expected: -7 },
      ],
    },
  ],
};
