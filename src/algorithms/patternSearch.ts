import type { Algorithm, CharState, StringStep } from '../engine/types';

// 1  def find(s, p):
// 2      n = len(s)
// 3      m = len(p)
// 4      for i in range(n - m + 1):
// 5          k = 0
// 6          while k < m and s[i + k] == p[k]:
// 7              k = k + 1
// 8          if k == m:
// 9              return i
// 10     return -1
const SOURCE = `def find(s, p):
    n = len(s)
    m = len(p)
    for i in range(n - m + 1):
        k = 0
        while k < m and s[i + k] == p[k]:
            k = k + 1
        if k == m:
            return i
    return -1`;

function stringCurated(input: string, pat = ''): StringStep[] {
  const chars = input.split('');
  const p = (pat ?? '').split('');
  const n = chars.length;
  const m = p.length;
  const steps: StringStep[] = [];
  const push = (
    line: number,
    state: Record<number, CharState>,
    pointers: Record<number, string[]>,
    vars: StringStep['vars'],
    note: string,
  ) => steps.push({ chars: [...chars], state, pointers, line, vars, note });

  if (m === 0 || m > n) {
    push(4, {}, {}, { n, m }, `Mẫu rỗng hoặc dài hơn chuỗi, không có gì để khớp.`);
    return steps;
  }

  for (let i = 0; i <= n - m; i++) {
    const win: Record<number, CharState> = {};
    for (let t = 0; t < m; t++) win[i + t] = 'window';
    push(4, { ...win }, { [i]: ['i'] }, { i, k: 0, p: pat }, `Thử đặt mẫu bắt đầu tại vị trí ${i}.`);
    let k = 0;
    let mismatch = false;
    while (k < m) {
      push(
        6,
        { ...win, [i + k]: 'compare' },
        { [i + k]: ['i+k'] },
        { i, k, p: pat },
        `So sánh s[${i + k}] = '${chars[i + k]}' với p[${k}] = '${p[k]}'.`,
      );
      if (chars[i + k] !== p[k]) {
        push(
          6,
          { ...win, [i + k]: 'mismatch' },
          { [i + k]: ['i+k'] },
          { i, k, p: pat },
          `Lệch ('${chars[i + k]}' khác '${p[k]}'). Dịch cửa sổ sang phải.`,
        );
        mismatch = true;
        break;
      }
      k = k + 1;
    }
    if (!mismatch) {
      const found: Record<number, CharState> = {};
      for (let t = 0; t < m; t++) found[i + t] = 'found';
      push(9, found, { [i]: ['i'] }, { i, k, p: pat }, `Khớp toàn bộ mẫu tại vị trí ${i}. Trả về ${i}.`);
      return steps;
    }
  }
  push(10, {}, {}, { p: pat }, `Đã thử mọi vị trí mà không khớp. Trả về -1.`);
  return steps;
}

export const patternSearch: Algorithm = {
  id: 'pattern-search',
  name: 'Tìm mẫu trong chuỗi',
  category: 'Chuỗi',
  viz: 'string',
  big: 'O(n·m)',
  best: 'O(n)',
  space: 'O(1)',
  defaultString: 'abracadabra',
  defaultPattern: 'cad',
  needsPattern: true,
  idea:
    'Bài toán: tìm vị trí đầu tiên mà một mẫu p xuất hiện trong chuỗi s. Cách trực tiếp (naive) là ' +
    'thử đặt mẫu vào mọi vị trí bắt đầu có thể, rồi so sánh từng ký tự. Nếu lệch ở đâu thì dịch mẫu ' +
    'sang phải một bước và thử lại. Đơn giản nhưng có thể chậm khi nhiều ký tự trùng.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(find("abracadabra", "cad"))`,
  stringCurated,
  charLegend: [
    ['idle', 'ngoài cửa sổ'],
    ['window', 'cửa sổ đang thử'],
    ['compare', 'đang so sánh'],
    ['mismatch', 'lệch'],
    ['found', 'khớp toàn bộ'],
  ],
  complexityNotes: [
    'Có khoảng n - m + 1 vị trí bắt đầu, mỗi vị trí so sánh tối đa m ký tự, nên xấu nhất là O(n·m).',
    'Trường hợp tốt, mỗi vị trí lệch ngay ký tự đầu, gần như O(n).',
    'Các thuật toán nâng cao như KMP hay Rabin-Karp đạt O(n + m) bằng cách tránh so sánh lặp lại.',
  ],
  problems: [
    {
      id: 'find',
      title: 'Tìm vị trí mẫu',
      level: 'Trung bình',
      statement: 'Cài đặt find(s, p) trả về chỉ số bắt đầu của lần xuất hiện đầu tiên của mẫu p trong s, hoặc -1 nếu không có. Mẫu rỗng trả về 0.',
      hint: 'Thử mọi vị trí bắt đầu i từ 0 tới len(s)-len(p). Tại mỗi i, so khớp từng ký tự của p.',
      funcName: 'find',
      starter: `def find(s, p):
    return -1`,
      solution: `def find(s, p):
    n = len(s)
    m = len(p)
    for i in range(n - m + 1):
        k = 0
        while k < m and s[i + k] == p[k]:
            k += 1
        if k == m:
            return i
    return -1`,
      cases: [
        { name: 'có mẫu', args: ['abracadabra', 'cad'], expected: 4 },
        { name: 'ở đầu', args: ['hello', 'he'], expected: 0 },
        { name: 'không có', args: ['aaa', 'b'], expected: -1 },
        { name: 'mẫu rỗng', args: ['abc', ''], expected: 0 },
        { name: 'mẫu dài hơn', args: ['ab', 'abc'], expected: -1 },
      ],
    },
    {
      id: 'count',
      title: 'Đếm số lần xuất hiện',
      level: 'Trung bình',
      statement: 'Cài đặt count_occurrences(s, p) trả về số vị trí bắt đầu mà mẫu p (khác rỗng) xuất hiện trong s, cho phép chồng lấp.',
      hint: 'Giống find nhưng không dừng lại, đếm mọi vị trí khớp.',
      funcName: 'count_occurrences',
      starter: `def count_occurrences(s, p):
    return 0`,
      solution: `def count_occurrences(s, p):
    n = len(s)
    m = len(p)
    if m == 0:
        return 0
    c = 0
    for i in range(n - m + 1):
        if s[i:i + m] == p:
            c += 1
    return c`,
      cases: [
        { name: 'chồng lấp', args: ['aaaa', 'aa'], expected: 3 },
        { name: 'rời nhau', args: ['ababab', 'ab'], expected: 3 },
        { name: 'không có', args: ['abc', 'x'], expected: 0 },
        { name: 'mẫu rỗng', args: ['abc', ''], expected: 0 },
      ],
    },
  ],
};
