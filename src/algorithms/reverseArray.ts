import type { Algorithm, Step } from '../engine/types';

// 1 def reverse_array(a):
// 2     lo = 0
// 3     hi = len(a) - 1
// 4     while lo < hi:
// 5         a[lo], a[hi] = a[hi], a[lo]
// 6         lo = lo + 1
// 7         hi = hi - 1
// 8     return a
const SOURCE = `def reverse_array(a):
    lo = 0
    hi = len(a) - 1
    while lo < hi:
        a[lo], a[hi] = a[hi], a[lo]
        lo = lo + 1
        hi = hi - 1
    return a`;

function curated(input: number[]): Step[] {
  const a = input.slice();
  const n = a.length;
  const sorted: number[] = []; // here "sorted" marks pairs already reversed
  const steps: Step[] = [];
  const push = (line: number, compare: number[], swap: number[], vars: Step['vars'], note: string) =>
    steps.push({ array: a.slice(), compare, swap, sorted: sorted.slice(), excluded: [], found: [], line, vars, note });

  let lo = 0;
  let hi = n - 1;
  push(2, [], [], { lo, hi }, `Đặt con trỏ lo = 0 ở đầu và hi = ${hi} ở cuối.`);
  while (lo < hi) {
    push(4, [lo, hi], [], { lo, hi }, `Còn lo (${lo}) < hi (${hi}). Chuẩn bị đổi chỗ a[${lo}] và a[${hi}].`);
    push(5, [], [lo, hi], { lo, hi }, `Đổi chỗ a[${lo}] = ${a[lo]} với a[${hi}] = ${a[hi]}.`);
    [a[lo], a[hi]] = [a[hi], a[lo]];
    sorted.push(lo, hi);
    lo = lo + 1;
    hi = hi - 1;
    push(7, [], [], { lo, hi }, `Hai con trỏ tiến vào giữa: lo = ${lo}, hi = ${hi}.`);
  }
  // Mark the middle element (odd length) as done too.
  if (lo === hi) sorted.push(lo);
  push(8, [], [], { lo, hi }, `lo (${lo}) không còn nhỏ hơn hi (${hi}). Mảng đã được đảo ngược.`);
  return steps;
}

export const reverseArray: Algorithm = {
  id: 'reverse-array',
  name: 'Đảo ngược mảng',
  category: 'Hai con trỏ',
  viz: 'array',
  big: 'O(n)',
  best: 'O(n)',
  space: 'O(1)',
  defaultInput: '1, 2, 3, 4, 5, 6',
  idea:
    'Đảo ngược mảng tại chỗ bằng kỹ thuật hai con trỏ. Một con trỏ lo bắt đầu ở đầu mảng, một con trỏ ' +
    'hi bắt đầu ở cuối. Ta đổi chỗ hai phần tử mà chúng đang trỏ tới rồi cho lo tiến lên, hi lùi xuống. ' +
    'Khi hai con trỏ gặp nhau ở giữa thì toàn bộ mảng đã được lật ngược, chỉ tốn O(1) bộ nhớ phụ.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(reverse_array([1, 2, 3, 4, 5, 6]))`,
  curated,
  arrayLegend: [
    ['bar', 'chưa đảo'],
    ['compare', 'cặp đang xét'],
    ['swap', 'đang đổi chỗ'],
    ['sorted', 'đã đảo xong'],
  ],
  complexityNotes: [
    'Mỗi bước con trỏ lo tiến một bước, hi lùi một bước, nên vòng lặp chạy khoảng n/2 lần. Tổng số phép đổi chỗ là n/2, độ phức tạp thời gian O(n).',
    'Thuật toán làm việc ngay trên mảng gốc, chỉ cần vài biến chỉ số nên bộ nhớ phụ là O(1).',
    'So với cách tạo mảng mới rồi sao chép ngược, cách hai con trỏ tiết kiệm bộ nhớ và thường nhanh hơn vì ít cấp phát.',
  ],
  problems: [
    {
      id: 'reverse',
      title: 'Đảo ngược mảng',
      level: 'Dễ',
      statement: 'Cài đặt reverse_array(a) trả về một danh sách mới là a được đảo ngược thứ tự. Dùng hai con trỏ lo và hi.',
      hint: 'Sao chép a sang danh sách mới, đặt lo = 0, hi = len-1, đổi chỗ rồi cho lo tăng, hi giảm cho tới khi lo >= hi.',
      funcName: 'reverse_array',
      starter: `def reverse_array(a):
    a = list(a)
    return a`,
      solution: `def reverse_array(a):
    a = list(a)
    lo = 0
    hi = len(a) - 1
    while lo < hi:
        a[lo], a[hi] = a[hi], a[lo]
        lo = lo + 1
        hi = hi - 1
    return a`,
      cases: [
        { name: 'mảng thường', args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
        { name: 'số chẵn phần tử', args: [[1, 2, 3, 4]], expected: [4, 3, 2, 1] },
        { name: 'rỗng', args: [[]], expected: [] },
        { name: 'một phần tử', args: [[7]], expected: [7] },
        { name: 'có trùng và âm', args: [[-1, 2, 2, -3]], expected: [-3, 2, 2, -1] },
      ],
    },
    {
      id: 'palindrome',
      title: 'Kiểm tra đối xứng',
      level: 'Trung bình',
      statement: 'Cài đặt is_palindrome(a) trả về True nếu mảng đối xứng (đọc xuôi và đọc ngược giống nhau), ngược lại False. Dùng hai con trỏ.',
      hint: 'Đặt lo ở đầu, hi ở cuối. Nếu a[lo] khác a[hi] thì không đối xứng. Tiến vào giữa cho tới khi gặp nhau.',
      funcName: 'is_palindrome',
      starter: `def is_palindrome(a):
    return True`,
      solution: `def is_palindrome(a):
    lo = 0
    hi = len(a) - 1
    while lo < hi:
        if a[lo] != a[hi]:
            return False
        lo = lo + 1
        hi = hi - 1
    return True`,
      cases: [
        { name: 'đối xứng lẻ', args: [[1, 2, 3, 2, 1]], expected: true },
        { name: 'đối xứng chẵn', args: [[4, 5, 5, 4]], expected: true },
        { name: 'không đối xứng', args: [[1, 2, 3]], expected: false },
        { name: 'rỗng', args: [[]], expected: true },
        { name: 'một phần tử', args: [[9]], expected: true },
        { name: 'có số âm', args: [[-2, 0, -2]], expected: true },
      ],
    },
  ],
};
