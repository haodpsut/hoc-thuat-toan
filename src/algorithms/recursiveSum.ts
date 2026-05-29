import type { Algorithm, Step } from '../engine/types';

// 1 def sum(a, i):
// 2     if i == len(a):
// 3         return 0
// 4     rest = sum(a, i + 1)
// 5     return a[i] + rest
const SOURCE = `def sum(a, i):
    if i == len(a):
        return 0
    rest = sum(a, i + 1)
    return a[i] + rest`;

// Recursively sum a[i:] = a[i] + sum(a[i+1:]). We narrate the two phases of the
// recursion: going down (drilling to the base case, depth grows, compare = [i])
// and coming back up (folding each element into the running total, marking the
// elements already merged into the result with `sorted`).
function curated(input: number[]): Step[] {
  const a = input.slice();
  const n = a.length;
  const merged: number[] = []; // indices already folded into the partial sum
  const steps: Step[] = [];
  const push = (line: number, i: number, vars: Step['vars'], note: string) =>
    steps.push({
      array: a.slice(),
      compare: i >= 0 && i < n ? [i] : [],
      swap: [],
      sorted: merged.slice(),
      excluded: [],
      found: [],
      line,
      vars,
      note,
    });

  // Recursive helper mirroring the Python source; emits a step at each line.
  function rec(i: number, depth: number, partial: number): number {
    push(1, i, { i, depth, partial }, `Đi xuống: gọi sum(a, ${i}). Độ sâu đệ quy = ${depth}.`);
    push(2, i, { i, depth, partial }, `Kiểm tra neo: i = ${i} có bằng len(a) = ${n} không?`);
    if (i === n) {
      push(3, i, { i, depth, partial }, `Đã chạm đáy. Trả về 0 cho mảng rỗng a[${n}:].`);
      return 0;
    }
    push(4, i, { i, depth, partial }, `Chưa tới đáy. Gọi tiếp sum(a, ${i + 1}) rồi mới cộng a[${i}].`);
    const rest = rec(i + 1, depth + 1, partial);
    const total = a[i] + rest;
    merged.unshift(i);
    push(
      5,
      i,
      { i, depth, partial: total },
      `Quay lui ở i = ${i}: a[${i}] + sum(a, ${i + 1}) = ${a[i]} + ${rest} = ${total}.`,
    );
    return total;
  }

  push(1, 0, { i: 0, depth: 0, partial: 0 }, `Bắt đầu tính tổng cả mảng bằng sum(a, 0).`);
  const result = rec(0, 0, 0);
  push(5, -1, { result }, `Hoàn tất. Tổng toàn mảng là ${result}.`);
  return steps;
}

export const recursiveSum: Algorithm = {
  id: 'recursive-sum',
  name: 'Tổng mảng đệ quy',
  category: 'Đệ quy',
  viz: 'array',
  big: 'O(n)',
  best: 'O(n)',
  space: 'O(n)',
  defaultInput: '3, 1, 4, 1, 5, 9',
  idea:
    'Tổng của một mảng có thể định nghĩa bằng chính nó nhỏ hơn: tổng của a[i:] bằng a[i] cộng với ' +
    'tổng của a[i+1:]. Khi i chạm tới cuối mảng, phần còn lại rỗng nên tổng bằng 0; đó là neo (base ' +
    'case) để đệ quy dừng. Quá trình gồm hai pha: pha đi xuống lần lượt gọi sum cho hậu tố ngắn dần ' +
    'cho tới khi chạm đáy, rồi pha quay lui cộng dồn từng phần tử từ cuối về đầu.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(sum([3, 1, 4, 1, 5, 9], 0))`,
  curated,
  arrayLegend: [
    ['bar', 'chưa gộp'],
    ['compare', 'đang xử lý (i)'],
    ['sorted', 'đã gộp vào tổng'],
  ],
  complexityNotes: [
    'Mỗi phần tử được gọi đúng một lần, nên thời gian là O(n).',
    'Đệ quy đi sâu n tầng trước khi quay lui, mỗi tầng chiếm một khung ngăn xếp, nên bộ nhớ là O(n).',
    'Cùng độ phức tạp thời gian với vòng lặp, nhưng tốn thêm bộ nhớ ngăn xếp; có thể khử đệ quy đuôi để về O(1) bộ nhớ.',
  ],
  problems: [
    {
      id: 'array-sum',
      title: 'Tổng mảng bằng đệ quy',
      level: 'Dễ',
      statement:
        'Cài đặt array_sum(a) trả về tổng các phần tử của a bằng đệ quy. Mảng rỗng trả về 0.',
      hint: 'Nếu a rỗng trả 0; ngược lại trả a[0] cộng array_sum(a[1:]).',
      funcName: 'array_sum',
      starter: `def array_sum(a):
    return 0`,
      solution: `def array_sum(a):
    if not a:
        return 0
    return a[0] + array_sum(a[1:])`,
      cases: [
        { name: 'mảng thường', args: [[3, 1, 4, 1, 5, 9]], expected: 23 },
        { name: 'rỗng', args: [[]], expected: 0 },
        { name: 'một phần tử', args: [[7]], expected: 7 },
        { name: 'có số âm', args: [[5, -2, -3, 10]], expected: 10 },
      ],
    },
    {
      id: 'count-positive',
      title: 'Đếm phần tử dương bằng đệ quy',
      level: 'Trung bình',
      statement:
        'Cài đặt count_positive(a) trả về số phần tử lớn hơn 0 trong a, dùng đệ quy. Mảng rỗng trả về 0.',
      hint: 'Nếu a rỗng trả 0; ngược lại cộng 1 nếu a[0] > 0 rồi cộng count_positive(a[1:]).',
      funcName: 'count_positive',
      starter: `def count_positive(a):
    return 0`,
      solution: `def count_positive(a):
    if not a:
        return 0
    first = 1 if a[0] > 0 else 0
    return first + count_positive(a[1:])`,
      cases: [
        { name: 'mảng thường', args: [[3, -1, 4, 0, -5, 9]], expected: 3 },
        { name: 'rỗng', args: [[]], expected: 0 },
        { name: 'toàn dương', args: [[2, 5, 1]], expected: 3 },
        { name: 'không có dương', args: [[0, -2, -7]], expected: 0 },
      ],
    },
  ],
};
