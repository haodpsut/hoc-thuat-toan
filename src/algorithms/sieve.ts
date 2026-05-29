import type { Algorithm, Step } from '../engine/types';

// 1  def sieve(n):
// 2      is_prime = [True] * (n + 1)
// 3      is_prime[0] = is_prime[1] = False
// 4      p = 2
// 5      while p * p <= n:
// 6          if is_prime[p]:
// 7              for m in range(p * p, n + 1, p):
// 8                  is_prime[m] = False
// 9          p = p + 1
// 10     return [i for i in range(2, n + 1) if is_prime[i]]
const SOURCE = `def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for m in range(p * p, n + 1, p):
                is_prime[m] = False
        p = p + 1
    return [i for i in range(2, n + 1) if is_prime[i]]`;

function curated(input: number[]): Step[] {
  const a = input.slice().sort((x, y) => x - y);
  const idx = new Map<number, number>();
  a.forEach((v, i) => idx.set(v, i));
  const N = a.length ? a[a.length - 1] : 0;
  const prime: number[] = [];
  const comp: number[] = [];
  const steps: Step[] = [];
  const push = (line: number, compare: number[], vars: Step['vars'], note: string) =>
    steps.push({ array: a.slice(), compare, swap: [], sorted: prime.slice(), excluded: comp.slice(), found: [], line, vars, note });

  push(4, [], {}, `Sàng Eratosthenes: lần lượt gạch bỏ các bội của từng số nguyên tố. Số nào không bị gạch chính là số nguyên tố.`);
  for (let i = 0; i < a.length; i++) {
    const p = a[i];
    if (p < 2) {
      comp.push(i);
      push(3, [], { p }, `${p} không phải số nguyên tố.`);
      continue;
    }
    if (comp.includes(i)) {
      push(5, [], { p }, `${p} đã bị gạch (là hợp số), bỏ qua.`);
      continue;
    }
    prime.push(i);
    push(6, [], { p }, `${p} chưa bị gạch nên là số nguyên tố. Bắt đầu gạch các bội của ${p}.`);
    for (let m = p * p; m <= N; m += p) {
      const mi = idx.get(m);
      if (mi !== undefined && !comp.includes(mi)) {
        comp.push(mi);
        push(8, [mi], { p, boi: m }, `Gạch ${m} = ${p} × ${m / p}, là bội của ${p}.`);
      }
    }
  }
  push(10, [], {}, `Hoàn tất. Các số nguyên tố: ${prime.map((i) => a[i]).join(', ')}.`);
  return steps;
}

export const sieve: Algorithm = {
  id: 'sieve',
  name: 'Sàng Eratosthenes',
  category: 'Mảng',
  viz: 'array',
  big: 'O(n log log n)',
  best: 'O(n log log n)',
  space: 'O(n)',
  defaultInput: '2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16',
  idea:
    'Khi cần tìm tất cả số nguyên tố tới một ngưỡng, sàng Eratosthenes nhanh hơn nhiều so với kiểm tra ' +
    'từng số riêng lẻ. Ý tưởng: bắt đầu coi mọi số là nguyên tố, rồi lần lượt lấy từng số nguyên tố p ' +
    'và gạch bỏ mọi bội của nó. Những số còn lại không bị gạch chính là số nguyên tố.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(sieve(30))`,
  curated,
  arrayLegend: [
    ['bar', 'chưa xét'],
    ['compare', 'đang gạch (bội)'],
    ['sorted', 'số nguyên tố'],
    ['excluded', 'hợp số (đã gạch)'],
  ],
  complexityNotes: [
    'Mỗi số nguyên tố p gạch khoảng n/p số. Tổng chi phí xấp xỉ n·(1/2 + 1/3 + 1/5 + ...) ≈ O(n log log n).',
    'Đây là một trong những cách nhanh nhất để liệt kê mọi số nguyên tố tới n.',
    'Tốn O(n) bộ nhớ cho mảng đánh dấu. Mẹo tối ưu: chỉ cần gạch bắt đầu từ p² vì các bội nhỏ hơn đã bị gạch bởi số nguyên tố nhỏ hơn.',
  ],
  problems: [
    {
      id: 'list',
      title: 'Liệt kê số nguyên tố tới n',
      level: 'Trung bình',
      statement: 'Cài đặt sieve(n) trả về danh sách mọi số nguyên tố từ 2 tới n (bao gồm n nếu là nguyên tố), dùng sàng Eratosthenes.',
      hint: 'Tạo mảng đánh dấu, gạch bội của từng số nguyên tố bắt đầu từ p². Cuối cùng thu các chỉ số còn được đánh dấu.',
      funcName: 'sieve',
      starter: `def sieve(n):
    return []`,
      solution: `def sieve(n):
    if n < 2:
        return []
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for m in range(p * p, n + 1, p):
                is_prime[m] = False
        p = p + 1
    return [i for i in range(2, n + 1) if is_prime[i]]`,
      cases: [
        { name: 'tới 10', args: [10], expected: [2, 3, 5, 7] },
        { name: 'tới 2', args: [2], expected: [2] },
        { name: 'tới 1', args: [1], expected: [] },
        { name: 'tới 20', args: [20], expected: [2, 3, 5, 7, 11, 13, 17, 19] },
      ],
    },
    {
      id: 'count',
      title: 'Đếm số nguyên tố tới n',
      level: 'Dễ',
      statement: 'Cài đặt count_primes_below(n) trả về số lượng số nguyên tố nhỏ hơn hoặc bằng n.',
      hint: 'Chạy sàng rồi đếm, hoặc tận dụng lại hàm sieve ở trên.',
      funcName: 'count_primes_below',
      starter: `def count_primes_below(n):
    return 0`,
      solution: `def count_primes_below(n):
    if n < 2:
        return 0
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for m in range(p * p, n + 1, p):
                is_prime[m] = False
        p = p + 1
    return sum(1 for i in range(2, n + 1) if is_prime[i])`,
      cases: [
        { name: 'tới 10', args: [10], expected: 4 },
        { name: 'tới 20', args: [20], expected: 8 },
        { name: 'tới 1', args: [1], expected: 0 },
        { name: 'tới 2', args: [2], expected: 1 },
      ],
    },
  ],
};
