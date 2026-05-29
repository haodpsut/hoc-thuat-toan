import type { Algorithm, Step } from '../engine/types';

// 1 def linear_search(a, target):
// 2     for i in range(len(a)):
// 3         if a[i] == target:
// 4             return i
// 5     return -1
const SOURCE = `def linear_search(a, target):
    for i in range(len(a)):
        if a[i] == target:
            return i
    return -1`;

function curated(input: number[], target = 0): Step[] {
  const a = input.slice();
  const steps: Step[] = [];
  const push = (line: number, compare: number[], found: number[], vars: Step['vars'], note: string) =>
    steps.push({ array: a.slice(), compare, swap: [], sorted: [], excluded: [], found, line, vars, note });

  push(1, [], [], { target }, `Tìm giá trị ${target} bằng cách duyệt lần lượt từ trái sang phải.`);
  for (let i = 0; i < a.length; i++) {
    push(3, [i], [], { i, target }, `Xét a[${i}] = ${a[i]}. Có bằng ${target} không?`);
    if (a[i] === target) {
      push(4, [], [i], { i, target }, `Tìm thấy ${target} tại vị trí ${i}. Trả về ${i}.`);
      return steps;
    }
  }
  push(5, [], [], { target }, `Duyệt hết mà không thấy ${target}. Trả về -1.`);
  return steps;
}

export const linearSearch: Algorithm = {
  id: 'linear-search',
  name: 'Tìm kiếm tuyến tính',
  category: 'Tìm kiếm',
  viz: 'array',
  big: 'O(n)',
  best: 'O(1)',
  space: 'O(1)',
  needsTarget: true,
  defaultInput: '4, 8, 15, 16, 23, 42',
  defaultTarget: 16,
  idea:
    'Tìm kiếm tuyến tính là cách đơn giản nhất: duyệt lần lượt từng phần tử từ đầu mảng cho tới khi ' +
    'gặp giá trị cần tìm thì trả về vị trí, hoặc trả về -1 nếu đi hết mà không thấy. Không cần mảng đã sắp.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(linear_search([4, 8, 15, 16, 23, 42], 16))`,
  curated,
  arrayLegend: [
    ['bar', 'chưa xét'],
    ['compare', 'đang xét'],
    ['found', 'tìm thấy'],
  ],
  complexityNotes: [
    'Trường hợp xấu nhất phải duyệt hết mảng nên là O(n).',
    'Trường hợp tốt nhất là phần tử cần tìm nằm ngay đầu, chỉ một phép so sánh, O(1).',
    'Ưu điểm: không cần mảng đã sắp, cài đặt cực đơn giản. Với mảng lớn đã sắp thì tìm kiếm nhị phân nhanh hơn nhiều.',
  ],
  problems: [
    {
      id: 'search',
      title: 'Tìm vị trí',
      level: 'Dễ',
      statement: 'Cài đặt linear_search(a, target) trả về chỉ số đầu tiên có giá trị bằng target, hoặc -1 nếu không có.',
      hint: 'Duyệt từ trái sang, gặp phần tử bằng target thì trả về ngay chỉ số đó.',
      funcName: 'linear_search',
      starter: `def linear_search(a, target):
    return -1`,
      solution: `def linear_search(a, target):
    for i in range(len(a)):
        if a[i] == target:
            return i
    return -1`,
      cases: [
        { name: 'có ở giữa', args: [[4, 8, 15, 16, 23], 16], expected: 3 },
        { name: 'ở đầu', args: [[7, 1, 2], 7], expected: 0 },
        { name: 'không có', args: [[1, 2, 3], 9], expected: -1 },
        { name: 'rỗng', args: [[], 5], expected: -1 },
        { name: 'trùng, lấy đầu', args: [[5, 3, 5], 5], expected: 0 },
      ],
    },
    {
      id: 'contains',
      title: 'Có chứa hay không',
      level: 'Dễ',
      statement: 'Cài đặt contains(a, x) trả về True nếu x có trong a, ngược lại False.',
      hint: 'Duyệt mảng, gặp x thì trả True; hết mảng thì trả False.',
      funcName: 'contains',
      starter: `def contains(a, x):
    return False`,
      solution: `def contains(a, x):
    for v in a:
        if v == x:
            return True
    return False`,
      cases: [
        { name: 'có', args: [[1, 2, 3], 2], expected: true },
        { name: 'không', args: [[1, 2, 3], 9], expected: false },
        { name: 'rỗng', args: [[], 1], expected: false },
      ],
    },
  ],
};
