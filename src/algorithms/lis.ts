import type { Algorithm, Step } from '../engine/types';

// 1 def lis(a):
// 2     n = len(a)
// 3     dp = [1] * n
// 4     prev = [-1] * n
// 5     for i in range(n):
// 6         for j in range(i):
// 7             if a[j] < a[i] and dp[j] + 1 > dp[i]:
// 8                 dp[i] = dp[j] + 1
// 9                 prev[i] = j
// 10    return max(dp) if dp else 0
const SOURCE = `def lis(a):
    n = len(a)
    dp = [1] * n
    prev = [-1] * n
    for i in range(n):
        for j in range(i):
            if a[j] < a[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                prev[i] = j
    return max(dp) if dp else 0`;

// O(n^2) dynamic programming. dp[i] = length of the longest strictly increasing
// subsequence ENDING at i. dp[i] = 1 + max(dp[j]) over j < i with a[j] < a[i].
// We keep `prev` to reconstruct one optimal subsequence and paint it with `found`.
function curated(input: number[]): Step[] {
  const a = input.slice();
  const n = a.length;
  const steps: Step[] = [];
  if (n === 0) {
    steps.push({
      array: [],
      compare: [],
      swap: [],
      sorted: [],
      excluded: [],
      found: [],
      line: 1,
      vars: {},
      note: `Mảng rỗng, độ dài dãy con tăng dài nhất là 0.`,
    });
    return steps;
  }

  const dp = new Array(n).fill(1);
  const prev = new Array(n).fill(-1);
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

  for (let i = 0; i < n; i++) {
    push(5, [i], [], { i, dp: dp[i] }, `Xét i = ${i}, a[${i}] = ${a[i]}. Tạm coi dp[${i}] = 1.`);
    for (let j = 0; j < i; j++) {
      push(
        7,
        [i, j],
        [],
        { i, j, dp: dp[i] },
        `So sánh a[${j}] = ${a[j]} với a[${i}] = ${a[i]} (dp[${j}] = ${dp[j]}).`,
      );
      if (a[j] < a[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        prev[i] = j;
        push(
          8,
          [i, j],
          [],
          { i, j, dp: dp[i] },
          `a[${j}] < a[${i}] và nối được dài hơn, cập nhật dp[${i}] = ${dp[i]}.`,
        );
      }
    }
  }

  // Find the end of an optimal subsequence and reconstruct it.
  let bestLen = 0;
  let bestEnd = 0;
  for (let i = 0; i < n; i++) {
    if (dp[i] > bestLen) {
      bestLen = dp[i];
      bestEnd = i;
    }
  }
  const chain: number[] = [];
  for (let k = bestEnd; k !== -1; k = prev[k]) chain.push(k);
  chain.reverse();

  push(
    10,
    [],
    chain,
    { dp: bestLen },
    `Hoàn tất. Dãy con tăng dài nhất có độ dài ${bestLen}, các phần tử được tô màu.`,
  );
  return steps;
}

export const lis: Algorithm = {
  id: 'lis',
  name: 'Dãy con tăng dài nhất',
  category: 'Quy hoạch động',
  viz: 'array',
  big: 'O(n²)',
  best: 'O(n²)',
  space: 'O(n)',
  defaultInput: '3, 1, 4, 1, 5, 9, 2, 6',
  idea:
    'Dãy con tăng dài nhất (LIS) là dãy con giữ nguyên thứ tự, không cần liên tiếp, sao cho các phần ' +
    'tử tăng ngặt và có nhiều phần tử nhất. Ta dùng quy hoạch động: gọi dp[i] là độ dài dãy con tăng ' +
    'dài nhất kết thúc tại i. Khi đó dp[i] = 1 + max(dp[j]) với mọi j đứng trước i mà a[j] < a[i]; nếu ' +
    'không có j như vậy thì dp[i] = 1. Đáp số là giá trị lớn nhất trong mảng dp.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(lis([3, 1, 4, 1, 5, 9, 2, 6]))`,
  curated,
  arrayLegend: [
    ['bar', 'chưa xét'],
    ['compare', 'đang so sánh i và j'],
    ['found', 'một dãy con tăng dài nhất'],
  ],
  opCount: (n) => (n * (n - 1)) / 2,
  opCountLabel: 'Số cặp (i, j) phải xét theo n, xấp xỉ n²/2.',
  complexityNotes: [
    'Với mỗi i ta duyệt mọi j đứng trước, nên tổng số cặp xét là 1 + 2 + ... + (n-1) = n(n-1)/2, tức O(n²).',
    'Cần một mảng dp độ dài n (và một mảng prev để truy vết), nên bộ nhớ là O(n).',
    'Có thuật toán nhanh hơn dùng tìm kiếm nhị phân trên mảng đuôi nhỏ nhất, đạt O(n log n); bản quy hoạch động O(n²) ở đây dễ hiểu và dễ truy vết dãy con hơn.',
  ],
  problems: [
    {
      id: 'length-lis',
      title: 'Độ dài dãy con tăng dài nhất',
      level: 'Trung bình',
      statement:
        'Cài đặt length_of_lis(a) trả về độ dài của dãy con tăng ngặt dài nhất (không cần liên tiếp). ' +
        'Mảng rỗng trả về 0.',
      hint:
        'Dùng dp[i] = độ dài LIS kết thúc tại i. Với mỗi i, xét mọi j < i: nếu a[j] < a[i] thì ' +
        'dp[i] = max(dp[i], dp[j] + 1). Đáp số là max(dp).',
      funcName: 'length_of_lis',
      starter: `def length_of_lis(a):
    return 0`,
      solution: `def length_of_lis(a):
    n = len(a)
    if n == 0:
        return 0
    dp = [1] * n
    for i in range(n):
        for j in range(i):
            if a[j] < a[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
    return max(dp)`,
      cases: [
        { name: 'mảng thường', args: [[3, 1, 4, 1, 5, 9, 2, 6]], expected: 4 },
        { name: 'rỗng', args: [[]], expected: 0 },
        { name: 'tăng dần', args: [[1, 2, 3, 4, 5]], expected: 5 },
        { name: 'giảm dần', args: [[5, 4, 3, 2, 1]], expected: 1 },
        { name: 'có trùng', args: [[2, 2, 2]], expected: 1 },
      ],
    },
    {
      id: 'is-increasing',
      title: 'Kiểm tra tăng ngặt',
      level: 'Dễ',
      statement:
        'Cài đặt is_increasing(a) trả về True nếu mảng tăng ngặt từ trái sang phải (mỗi phần tử lớn ' +
        'hơn hẳn phần tử ngay trước), ngược lại False. Mảng rỗng hoặc một phần tử coi như tăng ngặt.',
      hint: 'Duyệt từ phần tử thứ hai, nếu gặp a[i] <= a[i-1] thì trả về False.',
      funcName: 'is_increasing',
      starter: `def is_increasing(a):
    return True`,
      solution: `def is_increasing(a):
    for i in range(1, len(a)):
        if a[i] <= a[i - 1]:
            return False
    return True`,
      cases: [
        { name: 'tăng ngặt', args: [[1, 3, 5, 7]], expected: true },
        { name: 'có bằng nhau', args: [[1, 2, 2, 3]], expected: false },
        { name: 'giảm', args: [[5, 4, 3]], expected: false },
        { name: 'rỗng', args: [[]], expected: true },
        { name: 'một phần tử', args: [[9]], expected: true },
      ],
    },
  ],
};
