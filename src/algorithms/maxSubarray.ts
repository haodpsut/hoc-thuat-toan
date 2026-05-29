import type { Algorithm, Step } from '../engine/types';

// 1 def max_subarray(a):
// 2     best = a[0]
// 3     cur = a[0]
// 4     start = 0
// 5     bs = 0
// 6     be = 0
// 7     for i in range(1, len(a)):
// 8         if cur + a[i] < a[i]:
// 9             cur = a[i]
// 10            start = i
// 11        else:
// 12            cur = cur + a[i]
// 13        if cur > best:
// 14            best = cur
// 15            bs = start
// 16            be = i
// 17    return best
const SOURCE = `def max_subarray(a):
    best = a[0]
    cur = a[0]
    start = 0
    bs = 0
    be = 0
    for i in range(1, len(a)):
        if cur + a[i] < a[i]:
            cur = a[i]
            start = i
        else:
            cur = cur + a[i]
        if cur > best:
            best = cur
            bs = start
            be = i
    return best`;

// Kadane's algorithm. We track `cur` (best sum of a subarray ending at i) and
// `best` (best sum seen so far). To visualize the answer, we also track the
// [bs, be] index window of the best subarray and paint it with `found` at the end.
function curated(input: number[]): Step[] {
  const a = input.slice();
  const steps: Step[] = [];
  if (a.length === 0) {
    steps.push({
      array: [],
      compare: [],
      swap: [],
      sorted: [],
      excluded: [],
      found: [],
      line: 1,
      vars: {},
      note: `Mảng rỗng, không có đoạn con nào.`,
    });
    return steps;
  }

  const push = (
    line: number,
    compare: number[],
    found: number[],
    vars: Step['vars'],
    note: string,
  ) =>
    steps.push({
      array: a.slice(),
      compare,
      swap: [],
      sorted: [],
      excluded: [],
      found,
      line,
      vars,
      note,
    });

  let best = a[0];
  let cur = a[0];
  let start = 0;
  let bs = 0;
  let be = 0;

  push(2, [0], [], { i: 0, cur, best }, `Khởi tạo cur = best = a[0] = ${a[0]}.`);

  for (let i = 1; i < a.length; i++) {
    push(7, [i], [], { i, cur, best }, `Xét a[${i}] = ${a[i]}.`);
    if (cur + a[i] < a[i]) {
      cur = a[i];
      start = i;
      push(
        9,
        [i],
        [],
        { i, cur, best },
        `Nối thêm sẽ kém hơn, bắt đầu đoạn con mới tại ${i}: cur = ${cur}.`,
      );
    } else {
      cur = cur + a[i];
      push(
        12,
        [i],
        [],
        { i, cur, best },
        `Nối a[${i}] vào đoạn con đang xét: cur = ${cur}.`,
      );
    }
    if (cur > best) {
      best = cur;
      bs = start;
      be = i;
      const window: number[] = [];
      for (let k = bs; k <= be; k++) window.push(k);
      push(
        14,
        [i],
        window,
        { i, cur, best },
        `cur tốt hơn best, cập nhật best = ${best} (đoạn từ ${bs} tới ${be}).`,
      );
    }
  }

  const window: number[] = [];
  for (let k = bs; k <= be; k++) window.push(k);
  push(
    17,
    [],
    window,
    { cur, best },
    `Hoàn tất. Tổng đoạn con lớn nhất là ${best}, đoạn được tô màu.`,
  );
  return steps;
}

export const maxSubarray: Algorithm = {
  id: 'max-subarray',
  name: 'Tổng đoạn con lớn nhất',
  category: 'Quy hoạch động',
  viz: 'array',
  big: 'O(n)',
  best: 'O(n)',
  space: 'O(1)',
  defaultInput: '-2, 1, -3, 4, -1, 2, 1, -5, 4',
  idea:
    'Bài toán tìm tổng lớn nhất của một đoạn con liên tiếp. Thuật toán Kadane là một dạng quy hoạch ' +
    'động: gọi cur là tổng lớn nhất của đoạn con kết thúc tại vị trí i. Khi sang phần tử mới a[i], ta ' +
    'có hai lựa chọn: nối a[i] vào đoạn con trước đó, hoặc bắt đầu một đoạn con mới chỉ gồm a[i]. Ta ' +
    'chọn phương án cho tổng lớn hơn, tức cur = max(a[i], cur + a[i]). Trong khi duyệt, ta luôn ghi ' +
    'lại best là tổng lớn nhất từng gặp.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))`,
  curated,
  arrayLegend: [
    ['bar', 'chưa xét'],
    ['compare', 'vị trí i hiện tại'],
    ['found', 'đoạn con tốt nhất'],
  ],
  complexityNotes: [
    'Mỗi phần tử chỉ được xét đúng một lần với vài phép so sánh, nên tổng thời gian là O(n) tuyến tính theo độ dài mảng.',
    'Chỉ cần vài biến cur, best và vài chỉ số để ghi lại đoạn con, không cần mảng phụ, nên bộ nhớ là O(1).',
    'Cách làm ngây thơ duyệt mọi cặp đầu cuối tốn O(n²); ý tưởng quy hoạch động của Kadane gộp các đoạn con kết thúc tại i lại nên rút xuống còn O(n).',
  ],
  problems: [
    {
      id: 'max-sum',
      title: 'Tổng đoạn con lớn nhất',
      level: 'Trung bình',
      statement:
        'Cài đặt max_subarray_sum(a) trả về tổng lớn nhất của một đoạn con liên tiếp khác rỗng. ' +
        'Mảng rỗng trả về 0. Khi mọi phần tử đều âm thì trả về phần tử lớn nhất.',
      hint:
        'Dùng Kadane: giữ cur là tổng đoạn con kết thúc tại i, cur = max(a[i], cur + a[i]); ' +
        'cập nhật best = max(best, cur). Khởi tạo cur = best = a[0].',
      funcName: 'max_subarray_sum',
      starter: `def max_subarray_sum(a):
    return 0`,
      solution: `def max_subarray_sum(a):
    if not a:
        return 0
    best = a[0]
    cur = a[0]
    for i in range(1, len(a)):
        cur = max(a[i], cur + a[i])
        best = max(best, cur)
    return best`,
      cases: [
        { name: 'có số âm', args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
        { name: 'rỗng', args: [[]], expected: 0 },
        { name: 'toàn âm', args: [[-3, -1, -4, -2]], expected: -1 },
        { name: 'một phần tử', args: [[7]], expected: 7 },
        { name: 'toàn dương', args: [[1, 2, 3, 4]], expected: 10 },
      ],
    },
    {
      id: 'min-sum',
      title: 'Tổng đoạn con nhỏ nhất',
      level: 'Trung bình',
      statement:
        'Cài đặt min_subarray_sum(a) trả về tổng nhỏ nhất của một đoạn con liên tiếp khác rỗng. ' +
        'Mảng rỗng trả về 0.',
      hint:
        'Tương tự Kadane nhưng đổi max thành min: cur = min(a[i], cur + a[i]); ' +
        'worst = min(worst, cur).',
      funcName: 'min_subarray_sum',
      starter: `def min_subarray_sum(a):
    return 0`,
      solution: `def min_subarray_sum(a):
    if not a:
        return 0
    worst = a[0]
    cur = a[0]
    for i in range(1, len(a)):
        cur = min(a[i], cur + a[i])
        worst = min(worst, cur)
    return worst`,
      cases: [
        { name: 'có số âm', args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: -5 },
        { name: 'rỗng', args: [[]], expected: 0 },
        { name: 'toàn dương', args: [[3, 1, 4, 2]], expected: 1 },
        { name: 'một phần tử', args: [[-7]], expected: -7 },
        { name: 'đoạn âm liên tiếp', args: [[2, -1, -3, -2, 5]], expected: -6 },
      ],
    },
  ],
};
