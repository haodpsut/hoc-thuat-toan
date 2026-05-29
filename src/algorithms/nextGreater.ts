import type { Algorithm, Step } from '../engine/types';

// 1 def next_greater(a):
// 2     n = len(a)
// 3     res = [-1] * n
// 4     stack = []
// 5     for i in range(n):
// 6         while stack and a[stack[-1]] < a[i]:
// 7             j = stack.pop()
// 8             res[j] = a[i]
// 9         stack.append(i)
// 10    return res
const SOURCE = `def next_greater(a):
    n = len(a)
    res = [-1] * n
    stack = []
    for i in range(n):
        while stack and a[stack[-1]] < a[i]:
            j = stack.pop()
            res[j] = a[i]
        stack.append(i)
    return res`;

// Monotonic stack: scan left to right keeping a stack of indices that are still
// waiting for a greater element. When a[i] beats the top, that index is resolved.
// We surface the current stack (as labels, not raw values) in vars.stack and mark
// just-resolved indices with `found`.
function curated(input: number[]): Step[] {
  const a = input.slice();
  const n = a.length;
  const steps: Step[] = [];
  const stack: number[] = []; // indices waiting for their next greater
  const resolved: number[] = []; // indices already resolved (accumulates)
  // Stack shown as the array values currently waiting, in bottom-to-top order.
  const stackVals = () => stack.map((idx) => a[idx]);
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
      found: found.slice(),
      line,
      vars,
      note,
    });

  push(4, [], [], { stack: [] }, `Bắt đầu với ngăn xếp rỗng. Ngăn xếp giữ các phần tử chưa tìm được phần tử lớn hơn bên phải.`);
  for (let i = 0; i < n; i++) {
    push(5, [i], resolved, { i, stack: stackVals() }, `Xét a[${i}] = ${a[i]}.`);
    while (stack.length > 0 && a[stack[stack.length - 1]] < a[i]) {
      const j = stack[stack.length - 1];
      push(
        6,
        [i, j],
        resolved,
        { i, j, stack: stackVals() },
        `Đỉnh ngăn xếp là a[${j}] = ${a[j]} nhỏ hơn a[${i}] = ${a[i]}. Vậy phần tử lớn hơn tiếp theo của a[${j}] là ${a[i]}.`,
      );
      stack.pop();
      resolved.push(j);
      push(
        8,
        [i],
        resolved,
        { i, j, stack: stackVals() },
        `Lấy a[${j}] ra khỏi ngăn xếp, đã giải quyết xong với kết quả ${a[i]}.`,
      );
    }
    stack.push(i);
    push(9, [i], resolved, { i, stack: stackVals() }, `Đưa a[${i}] = ${a[i]} vào ngăn xếp để chờ phần tử lớn hơn.`);
  }
  push(10, [], resolved, { stack: stackVals() }, `Hết mảng. Các phần tử còn lại trong ngăn xếp không có phần tử lớn hơn bên phải nên nhận -1.`);
  return steps;
}

export const nextGreater: Algorithm = {
  id: 'next-greater',
  name: 'Phần tử lớn hơn tiếp theo',
  category: 'Ngăn xếp & Hàng đợi',
  viz: 'array',
  big: 'O(n)',
  best: 'O(n)',
  space: 'O(n)',
  defaultInput: '2, 1, 3, 5, 4, 7',
  idea:
    'Với mỗi phần tử, ta muốn tìm phần tử đầu tiên ở bên phải lớn hơn nó. Cách ngây thơ duyệt hai vòng ' +
    'tốn O(n²). Mẹo ngăn xếp đơn điệu giúp giải trong O(n): duyệt mảng từ trái sang phải và giữ một ngăn ' +
    'xếp các chỉ số đang chờ. Khi gặp một giá trị lớn hơn phần tử ở đỉnh ngăn xếp, chính giá trị đó là ' +
    'phần tử lớn hơn tiếp theo của phần tử ở đỉnh, ta lấy đỉnh ra và lặp lại. Mỗi chỉ số chỉ vào và ra ngăn ' +
    'xếp đúng một lần.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(next_greater([2, 1, 3, 5, 4, 7]))`,
  curated,
  arrayLegend: [
    ['bar', 'chưa xét'],
    ['compare', 'đang xét'],
    ['found', 'đã giải quyết'],
  ],
  complexityNotes: [
    'Mỗi chỉ số được đẩy vào ngăn xếp đúng một lần và lấy ra tối đa một lần, nên tổng số thao tác là O(n).',
    'Ngăn xếp có thể chứa tới n chỉ số (mảng giảm dần), nên bộ nhớ phụ là O(n).',
    'Nhanh hơn hẳn cách duyệt hai vòng lồng nhau O(n²), nhất là với mảng lớn.',
  ],
  problems: [
    {
      id: 'next-greater',
      title: 'Phần tử lớn hơn tiếp theo bên phải',
      level: 'Trung bình',
      statement:
        'Cài đặt next_greater(a) trả về danh sách cùng độ dài với a, phần tử thứ i là giá trị đầu tiên ở bên phải a[i] mà lớn hơn a[i], hoặc -1 nếu không có.',
      hint: 'Dùng ngăn xếp các chỉ số chờ. Khi a[i] lớn hơn giá trị ở đỉnh ngăn xếp thì gán kết quả cho đỉnh và lấy đỉnh ra.',
      funcName: 'next_greater',
      starter: `def next_greater(a):
    return []`,
      solution: `def next_greater(a):
    n = len(a)
    res = [-1] * n
    stack = []
    for i in range(n):
        while stack and a[stack[-1]] < a[i]:
            j = stack.pop()
            res[j] = a[i]
        stack.append(i)
    return res`,
      cases: [
        { name: 'mảng thường', args: [[2, 1, 3, 5, 4, 7]], expected: [3, 3, 5, 7, 7, -1] },
        { name: 'giảm dần', args: [[5, 4, 3, 2]], expected: [-1, -1, -1, -1] },
        { name: 'tăng dần', args: [[1, 2, 3, 4]], expected: [2, 3, 4, -1] },
        { name: 'rỗng', args: [[]], expected: [] },
        { name: 'một phần tử', args: [[9]], expected: [-1] },
        { name: 'có trùng', args: [[2, 2, 3]], expected: [3, 3, -1] },
      ],
    },
    {
      id: 'next-smaller',
      title: 'Phần tử nhỏ hơn tiếp theo bên phải',
      level: 'Trung bình',
      statement:
        'Cài đặt next_smaller(a) trả về danh sách cùng độ dài với a, phần tử thứ i là giá trị đầu tiên ở bên phải a[i] mà nhỏ hơn a[i], hoặc -1 nếu không có.',
      hint: 'Vẫn dùng ngăn xếp đơn điệu, chỉ đổi điều kiện: lấy đỉnh ra khi a[i] nhỏ hơn giá trị ở đỉnh.',
      funcName: 'next_smaller',
      starter: `def next_smaller(a):
    return []`,
      solution: `def next_smaller(a):
    n = len(a)
    res = [-1] * n
    stack = []
    for i in range(n):
        while stack and a[stack[-1]] > a[i]:
            j = stack.pop()
            res[j] = a[i]
        stack.append(i)
    return res`,
      cases: [
        { name: 'mảng thường', args: [[4, 5, 2, 10, 8]], expected: [2, 2, -1, 8, -1] },
        { name: 'tăng dần', args: [[1, 2, 3, 4]], expected: [-1, -1, -1, -1] },
        { name: 'giảm dần', args: [[4, 3, 2, 1]], expected: [3, 2, 1, -1] },
        { name: 'rỗng', args: [[]], expected: [] },
        { name: 'một phần tử', args: [[7]], expected: [-1] },
        { name: 'có trùng', args: [[3, 3, 1]], expected: [1, 1, -1] },
      ],
    },
  ],
};
