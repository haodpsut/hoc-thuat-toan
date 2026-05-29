import type { Algorithm, Step } from '../engine/types';

// Canonical Python source. Line numbers here MUST match the `line` values in
// the curated trace below, so the code panel highlights the right line.
//  1 def insertion_sort(a):
//  2     for i in range(1, len(a)):
//  3         key = a[i]
//  4         j = i - 1
//  5         while j >= 0 and a[j] > key:
//  6             a[j + 1] = a[j]
//  7             j = j - 1
//  8         a[j + 1] = key
//  9     return a
const SOURCE = `def insertion_sort(a):
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j = j - 1
        a[j + 1] = key
    return a`;

// Hand-authored, narrated trace for the polished "Visualize" view.
function curated(input: number[]): Step[] {
  const a = input.slice();
  const n = a.length;
  const sorted = [0];
  const steps: Step[] = [];
  const push = (
    line: number,
    compare: number[],
    swap: number[],
    vars: Step['vars'],
    note: string,
  ) =>
    steps.push({
      array: a.slice(),
      compare,
      swap,
      sorted: sorted.slice(),
      excluded: [],
      found: [],
      line,
      vars,
      note,
    });

  push(1, [], [], { n }, `Bắt đầu. Coi phần tử đầu tiên là đoạn đã sắp xếp.`);
  for (let i = 1; i < n; i++) {
    const key = a[i];
    push(3, [i], [], { i, key }, `Lấy key = a[${i}] = ${key} để chèn vào đoạn đã sắp bên trái.`);
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      push(5, [j, j + 1], [], { i, j, key }, `a[${j}] = ${a[j]} > key = ${key}, cần dịch sang phải.`);
      a[j + 1] = a[j];
      push(6, [], [j, j + 1], { i, j, key }, `Dịch ${a[j + 1]} sang vị trí ${j + 1}.`);
      j = j - 1;
    }
    if (j >= 0) {
      push(5, [j, j + 1], [], { i, j, key }, `a[${j}] = ${a[j]} không lớn hơn key = ${key}, dừng dịch.`);
    }
    a[j + 1] = key;
    sorted.push(i);
    push(8, [j + 1], [], { i, key }, `Đặt key = ${key} vào vị trí ${j + 1}. Đoạn 0..${i} đã sắp xong.`);
  }
  push(9, [], [], {}, `Hoàn tất. Mảng đã được sắp xếp tăng dần.`);
  return steps;
}

// Worst-case (reverse-sorted) comparison count, used for the empirical chart.
function worstCaseComparisons(n: number): number {
  const a = Array.from({ length: n }, (_, k) => n - k);
  let cmp = 0;
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0) {
      cmp++;
      if (a[j] > key) {
        a[j + 1] = a[j];
        j--;
      } else break;
    }
    a[j + 1] = key;
  }
  return cmp;
}

export const insertionSort: Algorithm = {
  id: 'insertion-sort',
  name: 'Sắp xếp chèn',
  category: 'Sắp xếp',
  viz: 'array',
  big: 'O(n²)',
  best: 'O(n)',
  space: 'O(1)',
  idea:
    'Coi phần đầu của mảng là một đoạn đã được sắp xếp. Lần lượt lấy từng phần tử kế tiếp, gọi là key, ' +
    'rồi chèn nó vào đúng vị trí trong đoạn đã sắp bằng cách dịch các phần tử lớn hơn key sang phải. ' +
    'Cách làm này giống như khi ta sắp xếp một bộ bài trên tay.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(insertion_sort([5, 2, 9, 1, 6, 3]))`,
  curated,
  complexityNotes: [
    'Trường hợp tốt nhất là khi mảng đã gần được sắp: mỗi phần tử chỉ cần một phép so sánh, nên tổng cộng khoảng n phép, tức O(n).',
    'Trường hợp xấu nhất là khi mảng được sắp ngược: phần tử thứ i phải so sánh và dịch qua toàn bộ i phần tử bên trái. Tổng số phép xấp xỉ 1 + 2 + ... + (n-1) = n(n-1)/2, tức O(n²).',
    'Bộ nhớ phụ là O(1) vì thuật toán sắp xếp tại chỗ, chỉ cần vài biến phụ như key và j.',
  ],
  opCount: worstCaseComparisons,
  opCountLabel: 'Số phép so sánh ở trường hợp xấu nhất theo kích thước mảng n. Đường nét đứt là tham chiếu n²/2.',
  problems: [
    {
      id: 'asc',
      title: 'Sắp xếp tăng dần',
      level: 'Dễ',
      statement:
        'Cài đặt hàm sort_asc(a) trả về một danh sách mới gồm các phần tử của a được sắp tăng dần. ' +
        'Hãy tự cài bằng tư tưởng sắp xếp chèn, không dùng sorted() có sẵn.',
      hint:
        'Sao chép a ra danh sách mới rồi áp dụng đúng vòng lặp sắp xếp chèn: với mỗi i, lấy key = a[i] ' +
        'và dịch các phần tử lớn hơn key sang phải.',
      funcName: 'sort_asc',
      starter: `def sort_asc(a):
    a = list(a)
    # Viết phần sắp xếp chèn của bạn ở đây
    return a`,
      solution: `def sort_asc(a):
    a = list(a)
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a`,
      cases: [
        { name: 'mảng thường', args: [[5, 2, 8, 1, 9, 3]], expected: [1, 2, 3, 5, 8, 9] },
        { name: 'mảng rỗng', args: [[]], expected: [] },
        { name: 'một phần tử', args: [[7]], expected: [7] },
        { name: 'đã sắp sẵn', args: [[1, 2, 3, 4]], expected: [1, 2, 3, 4] },
        { name: 'sắp ngược', args: [[4, 3, 2, 1]], expected: [1, 2, 3, 4] },
        { name: 'có trùng lặp', args: [[3, 1, 3, 2, 1]], expected: [1, 1, 2, 3, 3] },
        { name: 'có số âm', args: [[2, -5, 0, -1, 3]], expected: [-5, -1, 0, 2, 3] },
        {
          name: 'mảng lớn 300 phần tử sắp ngược',
          args: [Array.from({ length: 300 }, (_, k) => 300 - k)],
          expected: Array.from({ length: 300 }, (_, k) => k + 1),
        },
      ],
    },
    {
      id: 'desc',
      title: 'Sắp xếp giảm dần',
      level: 'Dễ',
      statement:
        'Cài đặt hàm sort_desc(a) trả về một danh sách mới gồm các phần tử của a được sắp giảm dần.',
      hint: 'Giống sắp xếp tăng dần, chỉ cần đổi điều kiện so sánh từ a[j] > key thành a[j] < key.',
      funcName: 'sort_desc',
      starter: `def sort_desc(a):
    a = list(a)
    # Sắp xếp giảm dần ở đây
    return a`,
      solution: `def sort_desc(a):
    a = list(a)
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] < key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a`,
      cases: [
        { name: 'mảng thường', args: [[5, 2, 8, 1, 9, 3]], expected: [9, 8, 5, 3, 2, 1] },
        { name: 'mảng rỗng', args: [[]], expected: [] },
        { name: 'sắp ngược', args: [[1, 2, 3, 4]], expected: [4, 3, 2, 1] },
        { name: 'có trùng lặp', args: [[3, 1, 3, 2]], expected: [3, 3, 2, 1] },
      ],
    },
    {
      id: 'insert',
      title: 'Chèn vào mảng đã sắp',
      level: 'Trung bình',
      statement:
        'Cho danh sách a đã được sắp tăng dần và một số x. Cài đặt insert_sorted(a, x) trả về một danh sách ' +
        'mới gồm các phần tử của a cộng thêm x, vẫn giữ thứ tự tăng dần. Đây chính là một bước của sắp xếp chèn.',
      hint:
        'Duyệt từ cuối mảng về đầu, dịch các phần tử lớn hơn x sang phải, rồi đặt x vào chỗ trống. ' +
        'Không cần sắp xếp lại toàn bộ.',
      funcName: 'insert_sorted',
      starter: `def insert_sorted(a, x):
    a = list(a)
    a.append(None)  # tạo một ô trống ở cuối
    # Dịch các phần tử lớn hơn x sang phải, rồi đặt x vào
    return a`,
      solution: `def insert_sorted(a, x):
    a = list(a)
    a.append(x)
    j = len(a) - 2
    while j >= 0 and a[j] > x:
        a[j + 1] = a[j]
        j -= 1
    a[j + 1] = x
    return a`,
      cases: [
        { name: 'chèn giữa', args: [[1, 3, 5, 7], 4], expected: [1, 3, 4, 5, 7] },
        { name: 'chèn đầu', args: [[2, 4, 6], 1], expected: [1, 2, 4, 6] },
        { name: 'chèn cuối', args: [[2, 4, 6], 9], expected: [2, 4, 6, 9] },
        { name: 'mảng rỗng', args: [[], 5], expected: [5] },
        { name: 'trùng giá trị', args: [[1, 2, 2, 3], 2], expected: [1, 2, 2, 2, 3] },
      ],
    },
  ],
};
