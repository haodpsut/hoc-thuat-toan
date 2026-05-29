import type { Algorithm, Step } from '../engine/types';

// 1  def binary_search(a, target):
// 2      lo, hi = 0, len(a) - 1
// 3      while lo <= hi:
// 4          mid = (lo + hi) // 2
// 5          if a[mid] == target:
// 6              return mid
// 7          elif a[mid] < target:
// 8              lo = mid + 1
// 9          else:
// 10             hi = mid - 1
// 11     return -1
const SOURCE = `def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        elif a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`;

function curated(input: number[], target = 0): Step[] {
  const a = input.slice().sort((x, y) => x - y); // binary search needs a sorted array
  const steps: Step[] = [];
  let lo = 0;
  let hi = a.length - 1;
  const excluded = () => {
    const e: number[] = [];
    for (let k = 0; k < a.length; k++) if (k < lo || k > hi) e.push(k);
    return e;
  };
  const push = (line: number, compare: number[], found: number[], vars: Step['vars'], note: string) =>
    steps.push({ array: a.slice(), compare, swap: [], sorted: [], excluded: excluded(), found, line, vars, note });

  push(2, [], [], { lo, hi, target }, `Mảng đã được sắp. Khoảng tìm kiếm: lo = ${lo}, hi = ${hi}.`);
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    push(4, [mid], [], { lo, hi, mid, target }, `mid = (${lo} + ${hi}) // 2 = ${mid}. a[${mid}] = ${a[mid]}.`);
    if (a[mid] === target) {
      push(6, [], [mid], { lo, hi, mid, target }, `a[${mid}] = ${target}. Tìm thấy tại vị trí ${mid}.`);
      return steps;
    } else if (a[mid] < target) {
      lo = mid + 1;
      push(8, [], [], { lo, hi, mid, target }, `a[${mid}] < ${target}, loại bỏ nửa trái. lo = ${lo}.`);
    } else {
      hi = mid - 1;
      push(10, [], [], { lo, hi, mid, target }, `a[${mid}] > ${target}, loại bỏ nửa phải. hi = ${hi}.`);
    }
  }
  push(11, [], [], { lo, hi, target }, `lo > hi, khoảng rỗng. Không có ${target}. Trả về -1.`);
  return steps;
}

export const binarySearch: Algorithm = {
  id: 'binary-search',
  name: 'Tìm kiếm nhị phân',
  category: 'Tìm kiếm',
  viz: 'array',
  big: 'O(log n)',
  best: 'O(1)',
  space: 'O(1)',
  needsTarget: true,
  defaultInput: '4, 8, 15, 16, 23, 42',
  defaultTarget: 23,
  idea:
    'Tìm kiếm nhị phân chỉ dùng được trên mảng đã sắp. Mỗi bước so sánh giá trị cần tìm với phần tử ở ' +
    'giữa khoảng đang xét, rồi loại bỏ hẳn một nửa khoảng. Vì mỗi bước cắt đôi phạm vi, số bước chỉ ' +
    'khoảng log n, nhanh hơn rất nhiều so với duyệt tuyến tính.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(binary_search([4, 8, 15, 16, 23, 42], 23))`,
  curated,
  arrayLegend: [
    ['bar', 'đang xét'],
    ['excluded', 'đã loại'],
    ['compare', 'phần tử giữa'],
    ['found', 'tìm thấy'],
  ],
  complexityNotes: [
    'Mỗi bước loại bỏ một nửa khoảng còn lại, nên số bước tối đa khoảng log₂(n), tức O(log n).',
    'Trường hợp tốt nhất là phần tử giữa đúng ngay lần đầu, O(1).',
    'Bắt buộc mảng đã sắp. Nếu mảng chưa sắp, chi phí sắp xếp trước là O(n log n).',
  ],
  problems: [
    {
      id: 'search',
      title: 'Tìm trong mảng đã sắp',
      level: 'Trung bình',
      statement: 'Cho mảng a đã sắp tăng dần, cài đặt binary_search(a, target) trả về chỉ số của target hoặc -1.',
      hint: 'Giữ hai biên lo và hi. Mỗi bước xét phần tử giữa rồi thu hẹp về nửa trái hoặc nửa phải.',
      funcName: 'binary_search',
      starter: `def binary_search(a, target):
    return -1`,
      solution: `def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        elif a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
      cases: [
        { name: 'có ở giữa', args: [[4, 8, 15, 16, 23, 42], 16], expected: 3 },
        { name: 'ở đầu', args: [[1, 2, 3, 4], 1], expected: 0 },
        { name: 'ở cuối', args: [[1, 2, 3, 4], 4], expected: 3 },
        { name: 'không có', args: [[1, 3, 5, 7], 4], expected: -1 },
        { name: 'rỗng', args: [[], 5], expected: -1 },
      ],
    },
    {
      id: 'count-steps',
      title: 'Đếm số bước',
      level: 'Khó',
      statement: 'Cài đặt search_steps(a, target) trả về số lần vòng lặp chạy (số lần tính mid) khi tìm nhị phân target trong mảng đã sắp a.',
      hint: 'Vẫn là tìm nhị phân, nhưng tăng một biến đếm mỗi lần vào thân vòng lặp, kể cả khi tìm thấy.',
      funcName: 'search_steps',
      starter: `def search_steps(a, target):
    return 0`,
      solution: `def search_steps(a, target):
    lo, hi = 0, len(a) - 1
    steps = 0
    while lo <= hi:
        steps += 1
        mid = (lo + hi) // 2
        if a[mid] == target:
            return steps
        elif a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return steps`,
      cases: [
        { name: 'giữa ngay', args: [[1, 2, 3], 2], expected: 1 },
        { name: 'cần hai bước', args: [[1, 2, 3, 4, 5, 6, 7], 1], expected: 3 },
        { name: 'không có', args: [[1, 2, 3, 4], 9], expected: 3 },
      ],
    },
  ],
};
