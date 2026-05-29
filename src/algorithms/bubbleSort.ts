import type { Algorithm, Step } from '../engine/types';

// 1 def bubble_sort(a):
// 2     n = len(a)
// 3     for i in range(n):
// 4         for j in range(0, n - i - 1):
// 5             if a[j] > a[j + 1]:
// 6                 a[j], a[j + 1] = a[j + 1], a[j]
// 7     return a
const SOURCE = `def bubble_sort(a):
    n = len(a)
    for i in range(n):
        for j in range(0, n - i - 1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a`;

function curated(input: number[]): Step[] {
  const a = input.slice();
  const n = a.length;
  const sorted: number[] = [];
  const steps: Step[] = [];
  const push = (line: number, compare: number[], swap: number[], vars: Step['vars'], note: string) =>
    steps.push({ array: a.slice(), compare, swap, sorted: sorted.slice(), excluded: [], found: [], line, vars, note });

  push(2, [], [], { n }, `Bắt đầu. Mỗi vòng sẽ đẩy phần tử lớn nhất còn lại "nổi" về cuối.`);
  for (let i = 0; i < n; i++) {
    push(3, [], [], { i }, `Vòng ngoài i = ${i}.`);
    for (let j = 0; j < n - i - 1; j++) {
      push(5, [j, j + 1], [], { i, j }, `So sánh a[${j}] = ${a[j]} với a[${j + 1}] = ${a[j + 1]}.`);
      if (a[j] > a[j + 1]) {
        push(6, [], [j, j + 1], { i, j }, `${a[j]} > ${a[j + 1]} nên hoán đổi hai phần tử.`);
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        push(6, [], [j, j + 1], { i, j }, `Đã hoán đổi xong.`);
      }
    }
    sorted.unshift(n - i - 1);
    push(3, [], [], { i }, `Phần tử ở vị trí ${n - i - 1} đã đúng chỗ.`);
  }
  push(7, [], [], {}, `Hoàn tất. Mảng đã được sắp xếp tăng dần.`);
  return steps;
}

export const bubbleSort: Algorithm = {
  id: 'bubble-sort',
  name: 'Sắp xếp nổi bọt',
  category: 'Sắp xếp',
  viz: 'array',
  big: 'O(n²)',
  best: 'O(n)',
  space: 'O(1)',
  idea:
    'Sắp xếp nổi bọt lặp đi lặp lại việc so sánh hai phần tử cạnh nhau và đổi chỗ nếu chúng sai thứ tự. ' +
    'Sau mỗi vòng, phần tử lớn nhất trong phần chưa sắp sẽ "nổi" dần về cuối, giống bọt khí nổi lên mặt nước.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(bubble_sort([5, 2, 9, 1, 6, 3]))`,
  curated,
  complexityNotes: [
    'Mỗi vòng ngoài quét gần hết mảng, có hai vòng lồng nhau nên số phép so sánh xấp xỉ n(n-1)/2, tức O(n²).',
    'Nếu thêm cờ kiểm tra "có hoán đổi nào không" và dừng sớm khi mảng đã sắp, trường hợp tốt nhất đạt O(n).',
    'Sắp xếp tại chỗ, bộ nhớ phụ O(1). Đây là thuật toán dễ hiểu nhưng chậm, ít dùng trong thực tế.',
  ],
  opCount: (n) => (n * (n - 1)) / 2,
  opCountLabel: 'Số phép so sánh theo kích thước mảng n (xấp xỉ n²/2).',
  problems: [
    {
      id: 'sort',
      title: 'Sắp xếp tăng dần',
      level: 'Dễ',
      statement: 'Cài đặt bubble_sort(a) trả về danh sách mới gồm các phần tử của a sắp tăng dần, dùng tư tưởng nổi bọt.',
      hint: 'Hai vòng lồng nhau. Vòng trong so sánh a[j] với a[j+1], nếu sai thứ tự thì đổi chỗ.',
      funcName: 'bubble_sort',
      starter: `def bubble_sort(a):
    a = list(a)
    # Viết phần nổi bọt của bạn ở đây
    return a`,
      solution: `def bubble_sort(a):
    a = list(a)
    n = len(a)
    for i in range(n):
        for j in range(0, n - i - 1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
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
      id: 'swaps',
      title: 'Đếm số lần hoán đổi',
      level: 'Trung bình',
      statement: 'Cài đặt count_swaps(a) trả về số lần hoán đổi mà sắp xếp nổi bọt thực hiện để sắp a tăng dần.',
      hint: 'Vẫn chạy nổi bọt như thường, nhưng mỗi lần đổi chỗ thì tăng một biến đếm.',
      funcName: 'count_swaps',
      starter: `def count_swaps(a):
    a = list(a)
    return 0`,
      solution: `def count_swaps(a):
    a = list(a)
    n = len(a)
    c = 0
    for i in range(n):
        for j in range(0, n - i - 1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                c += 1
    return c`,
      cases: [
        { name: 'đã sắp', args: [[1, 2, 3]], expected: 0 },
        { name: 'một cặp', args: [[2, 1]], expected: 1 },
        { name: 'sắp ngược 3', args: [[3, 2, 1]], expected: 3 },
        { name: 'sắp ngược 4', args: [[4, 3, 2, 1]], expected: 6 },
        { name: 'rỗng', args: [[]], expected: 0 },
      ],
    },
  ],
};
