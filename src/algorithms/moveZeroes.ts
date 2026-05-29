import type { Algorithm, Step } from '../engine/types';

// 1 def move_zeroes(a):
// 2     w = 0
// 3     for i in range(len(a)):
// 4         if a[i] != 0:
// 5             a[w] = a[i]
// 6             w = w + 1
// 7     while w < len(a):
// 8         a[w] = 0
// 9         w = w + 1
// 10     return a
const SOURCE = `def move_zeroes(a):
    w = 0
    for i in range(len(a)):
        if a[i] != 0:
            a[w] = a[i]
            w = w + 1
    while w < len(a):
        a[w] = 0
        w = w + 1
    return a`;

function curated(input: number[]): Step[] {
  const a = input.slice();
  const n = a.length;
  const sorted: number[] = []; // positions already finalized at the front
  const steps: Step[] = [];
  const push = (line: number, compare: number[], swap: number[], vars: Step['vars'], note: string) =>
    steps.push({ array: a.slice(), compare, swap, sorted: sorted.slice(), excluded: [], found: [], line, vars, note });

  let w = 0;
  push(2, [], [], { w }, `Con trỏ ghi w = 0. Mọi phần tử khác 0 sẽ được dồn về đầu mảng.`);
  for (let i = 0; i < n; i++) {
    push(4, [i], [], { i, w }, `Đọc a[${i}] = ${a[i]}. Có khác 0 không?`);
    if (a[i] !== 0) {
      a[w] = a[i];
      push(5, [i], [w], { i, w }, `Khác 0. Ghi ${a[i]} vào vị trí w = ${w}.`);
      sorted.push(w);
      w = w + 1;
      push(6, [], [], { i, w }, `Con trỏ ghi tiến lên w = ${w}.`);
    }
  }
  while (w < n) {
    a[w] = 0;
    push(8, [], [w], { w }, `Lấp số 0 vào vị trí còn lại w = ${w}.`);
    sorted.push(w);
    w = w + 1;
  }
  push(10, [], [], { w }, `Xong. Các phần tử khác 0 giữ nguyên thứ tự ở đầu, số 0 dồn về cuối.`);
  return steps;
}

export const moveZeroes: Algorithm = {
  id: 'move-zeroes',
  name: 'Đưa số 0 về cuối',
  category: 'Hai con trỏ',
  viz: 'array',
  big: 'O(n)',
  best: 'O(n)',
  space: 'O(1)',
  defaultInput: '0, 1, 0, 3, 12, 0, 5',
  idea:
    'Bài toán dồn mọi số 0 về cuối mảng nhưng giữ nguyên thứ tự các phần tử khác 0. Ta dùng hai con trỏ ' +
    'chạy cùng chiều: con trỏ đọc i quét toàn mảng, còn con trỏ ghi w đánh dấu vị trí kế tiếp để đặt một ' +
    'phần tử khác 0. Mỗi khi i gặp phần tử khác 0, ta chép nó xuống vị trí w rồi tăng w. Cuối cùng lấp số ' +
    '0 vào phần còn lại từ w tới hết mảng.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(move_zeroes([0, 1, 0, 3, 12, 0, 5]))`,
  curated,
  arrayLegend: [
    ['bar', 'chưa xử lý'],
    ['compare', 'con trỏ đọc i'],
    ['swap', 'con trỏ ghi w'],
    ['sorted', 'đã chốt'],
  ],
  complexityNotes: [
    'Con trỏ đọc i quét mảng đúng một lượt và con trỏ ghi w cũng chỉ tiến tới, nên tổng số thao tác tỉ lệ với n, độ phức tạp O(n).',
    'Thuật toán ghi đè ngay trên mảng gốc, chỉ dùng vài biến chỉ số nên bộ nhớ phụ là O(1).',
    'Vì con trỏ ghi luôn đi sau hoặc bằng con trỏ đọc, các phần tử khác 0 được chép xuống mà không làm xáo trộn thứ tự tương đối của chúng.',
  ],
  problems: [
    {
      id: 'move',
      title: 'Dồn số 0 về cuối',
      level: 'Trung bình',
      statement: 'Cài đặt move_zeroes(a) trả về danh sách mới trong đó mọi số 0 nằm ở cuối, các phần tử khác 0 giữ nguyên thứ tự. Dùng con trỏ ghi w và con trỏ đọc i.',
      hint: 'Sao chép a, dùng w = 0. Duyệt i, gặp phần tử khác 0 thì ghi vào a[w] rồi tăng w. Sau cùng lấp 0 từ w tới hết.',
      funcName: 'move_zeroes',
      starter: `def move_zeroes(a):
    a = list(a)
    return a`,
      solution: `def move_zeroes(a):
    a = list(a)
    w = 0
    for i in range(len(a)):
        if a[i] != 0:
            a[w] = a[i]
            w = w + 1
    while w < len(a):
        a[w] = 0
        w = w + 1
    return a`,
      cases: [
        { name: 'xen kẽ', args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
        { name: 'không có 0', args: [[1, 2, 3]], expected: [1, 2, 3] },
        { name: 'toàn 0', args: [[0, 0, 0]], expected: [0, 0, 0] },
        { name: 'rỗng', args: [[]], expected: [] },
        { name: 'một phần tử', args: [[0]], expected: [0] },
        { name: 'có số âm', args: [[0, -1, 0, -2]], expected: [-1, -2, 0, 0] },
      ],
    },
    {
      id: 'count-nonzero',
      title: 'Đếm phần tử khác 0',
      level: 'Dễ',
      statement: 'Cài đặt count_nonzero(a) trả về số lượng phần tử khác 0 trong mảng a.',
      hint: 'Duyệt mảng, mỗi lần gặp phần tử khác 0 thì tăng biến đếm lên một.',
      funcName: 'count_nonzero',
      starter: `def count_nonzero(a):
    return 0`,
      solution: `def count_nonzero(a):
    c = 0
    for v in a:
        if v != 0:
            c = c + 1
    return c`,
      cases: [
        { name: 'xen kẽ', args: [[0, 1, 0, 3, 12]], expected: 3 },
        { name: 'toàn 0', args: [[0, 0, 0]], expected: 0 },
        { name: 'không có 0', args: [[5, 6, 7]], expected: 3 },
        { name: 'rỗng', args: [[]], expected: 0 },
        { name: 'có số âm', args: [[-1, 0, -2, 0]], expected: 2 },
      ],
    },
  ],
};
