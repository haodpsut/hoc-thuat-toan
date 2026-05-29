import type { Algorithm, Step } from '../engine/types';

// 1 def is_prime(n):
// 2     if n < 2:
// 3         return False
// 4     d = 2
// 5     while d * d <= n:
// 6         if n % d == 0:
// 7             return False
// 8         d = d + 1
// 9     return True
const SOURCE = `def is_prime(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d = d + 1
    return True`;

// Traverse the array; for each element run trial division and color it as prime
// (green) or not prime (dim). Reuses the bar renderer with different semantics.
function curated(input: number[]): Step[] {
  const a = input.slice();
  const steps: Step[] = [];
  const prime: number[] = []; // indices found prime
  const notPrime: number[] = []; // indices found composite/not prime
  const push = (line: number, i: number, vars: Step['vars'], note: string) =>
    steps.push({
      array: a.slice(),
      compare: [i],
      swap: [],
      sorted: prime.slice(),
      excluded: notPrime.slice(),
      found: [],
      line,
      vars,
      note,
    });

  for (let i = 0; i < a.length; i++) {
    const n = a[i];
    push(1, i, { i, n }, `Xét a[${i}] = ${n}. Kiểm tra xem có phải số nguyên tố không.`);
    if (n < 2) {
      push(3, i, { i, n }, `${n} < 2 nên không phải số nguyên tố.`);
      notPrime.push(i);
      push(3, i, { i, n }, `Đánh dấu ${n} không nguyên tố.`);
      continue;
    }
    let d = 2;
    let isP = true;
    push(4, i, { i, n, d }, `Bắt đầu thử chia từ d = 2.`);
    while (d * d <= n) {
      push(5, i, { i, n, d }, `d*d = ${d * d} <= ${n}? Còn phải thử ước d = ${d}.`);
      if (n % d === 0) {
        push(7, i, { i, n, d }, `${n} chia hết cho ${d} nên ${n} không nguyên tố.`);
        isP = false;
        break;
      }
      push(8, i, { i, n, d }, `${n} không chia hết cho ${d}, tăng d.`);
      d = d + 1;
    }
    if (isP) {
      push(9, i, { i, n }, `Không có ước nào, ${n} là số nguyên tố.`);
      prime.push(i);
    } else {
      notPrime.push(i);
    }
    push(isP ? 9 : 3, i, { i, n }, isP ? `Đánh dấu ${n} là số nguyên tố.` : `Đánh dấu ${n} không nguyên tố.`);
  }
  steps.push({
    array: a.slice(),
    compare: [],
    swap: [],
    sorted: prime.slice(),
    excluded: notPrime.slice(),
    found: [],
    line: 9,
    vars: {},
    note: `Hoàn tất. Các ô xanh là số nguyên tố, các ô mờ thì không.`,
  });
  return steps;
}

export const primeCheck: Algorithm = {
  id: 'prime-check',
  name: 'Kiểm tra số nguyên tố',
  category: 'Mảng',
  viz: 'array',
  big: 'O(√v)',
  best: 'O(1)',
  space: 'O(1)',
  defaultInput: '7, 10, 13, 4, 9, 17, 1, 6',
  idea:
    'Số nguyên tố là số tự nhiên lớn hơn 1 và chỉ chia hết cho 1 và chính nó. Để kiểm tra một số v, ' +
    'ta thử chia v cho các số d từ 2 trở lên; chỉ cần thử tới khi d*d vượt quá v, vì nếu v có ước lớn ' +
    'hơn căn bậc hai thì nó cũng có một ước nhỏ hơn căn bậc hai. Đây là một ví dụ duyệt mảng: với mỗi ' +
    'phần tử, ta chạy phép kiểm tra này.',
  source: SOURCE,
  playback: `${SOURCE}\n\na = [7, 10, 13, 4, 9, 17, 1, 6]\nprint([is_prime(x) for x in a])`,
  curated,
  arrayLegend: [
    ['bar', 'chưa xét'],
    ['compare', 'đang kiểm tra'],
    ['sorted', 'số nguyên tố'],
    ['excluded', 'không nguyên tố'],
  ],
  complexityNotes: [
    'Với mỗi số v, ta chỉ thử các ước tới căn bậc hai của v, nên kiểm tra một số tốn khoảng O(√v).',
    'Kiểm tra cả mảng n phần tử tốn khoảng O(n·√v) với v là giá trị lớn nhất.',
    'Nếu cần xét mọi số tới một ngưỡng N, sàng Eratosthenes nhanh hơn nhiều, đạt khoảng O(N log log N).',
  ],
  problems: [
    {
      id: 'is-prime',
      title: 'Hàm kiểm tra nguyên tố',
      level: 'Dễ',
      statement: 'Cài đặt is_prime(n) trả về True nếu n là số nguyên tố, ngược lại False.',
      hint: 'Số nhỏ hơn 2 không phải nguyên tố. Thử chia cho d từ 2 tới khi d*d > n.',
      funcName: 'is_prime',
      starter: `def is_prime(n):
    return False`,
      solution: `def is_prime(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d = d + 1
    return True`,
      cases: [
        { name: 'số 2', args: [2], expected: true },
        { name: 'số 1', args: [1], expected: false },
        { name: 'số 0', args: [0], expected: false },
        { name: 'số 17', args: [17], expected: true },
        { name: 'số 9', args: [9], expected: false },
        { name: 'số 97', args: [97], expected: true },
        { name: 'số âm', args: [-3], expected: false },
      ],
    },
    {
      id: 'count',
      title: 'Đếm số nguyên tố trong mảng',
      level: 'Dễ',
      statement: 'Cài đặt count_primes(a) trả về số lượng phần tử của a là số nguyên tố.',
      hint: 'Duyệt mảng, với mỗi phần tử gọi is_prime và cộng dồn nếu đúng.',
      funcName: 'count_primes',
      starter: `def count_primes(a):
    return 0`,
      solution: `def count_primes(a):
    def is_prime(n):
        if n < 2:
            return False
        d = 2
        while d * d <= n:
            if n % d == 0:
                return False
            d = d + 1
        return True
    return sum(1 for x in a if is_prime(x))`,
      cases: [
        { name: 'mảng thường', args: [[7, 10, 13, 4, 9, 17]], expected: 3 },
        { name: 'không có', args: [[1, 4, 6, 8, 9]], expected: 0 },
        { name: 'toàn nguyên tố', args: [[2, 3, 5, 7]], expected: 4 },
        { name: 'rỗng', args: [[]], expected: 0 },
      ],
    },
  ],
};
