import type { Algorithm, CharState, StringStep } from '../engine/types';

// 1 def is_palindrome(s):
// 2     i = 0
// 3     j = len(s) - 1
// 4     while i < j:
// 5         if s[i] != s[j]:
// 6             return False
// 7         i = i + 1
// 8         j = j - 1
// 9     return True
const SOURCE = `def is_palindrome(s):
    i = 0
    j = len(s) - 1
    while i < j:
        if s[i] != s[j]:
            return False
        i = i + 1
        j = j - 1
    return True`;

function stringCurated(input: string): StringStep[] {
  const chars = input.split('');
  const steps: StringStep[] = [];
  const matched: number[] = [];
  const push = (
    line: number,
    extra: Record<number, CharState>,
    pointers: Record<number, string[]>,
    vars: StringStep['vars'],
    note: string,
  ) => {
    const state: Record<number, CharState> = {};
    for (const k of matched) state[k] = 'match';
    Object.assign(state, extra);
    steps.push({ chars: [...chars], state, pointers, line, vars, note });
  };

  let i = 0;
  let j = chars.length - 1;
  push(2, {}, { 0: ['i'], [chars.length - 1]: ['j'] }, { i, j }, `So sánh từ hai đầu vào giữa.`);
  while (i < j) {
    push(
      5,
      { [i]: 'compare', [j]: 'compare' },
      { [i]: ['i'], [j]: ['j'] },
      { i, j },
      `So sánh s[${i}] = '${chars[i]}' với s[${j}] = '${chars[j]}'.`,
    );
    if (chars[i] !== chars[j]) {
      push(
        6,
        { [i]: 'mismatch', [j]: 'mismatch' },
        { [i]: ['i'], [j]: ['j'] },
        { i, j },
        `'${chars[i]}' khác '${chars[j]}', không đối xứng. Trả về False.`,
      );
      return steps;
    }
    matched.push(i, j);
    push(7, {}, { [i]: ['i'], [j]: ['j'] }, { i, j }, `Khớp. Thu hai con trỏ vào trong.`);
    i = i + 1;
    j = j - 1;
  }
  push(9, {}, {}, { i, j }, `Hai con trỏ gặp nhau, mọi cặp đều khớp. Chuỗi đối xứng, trả về True.`);
  return steps;
}

export const stringPalindrome: Algorithm = {
  id: 'palindrome',
  name: 'Chuỗi đối xứng',
  category: 'Chuỗi',
  viz: 'string',
  big: 'O(n)',
  best: 'O(1)',
  space: 'O(1)',
  defaultString: 'racecar',
  idea:
    'Một chuỗi đối xứng (palindrome) là chuỗi đọc xuôi hay ngược đều như nhau, ví dụ "racecar". ' +
    'Cách kiểm tra gọn nhất là dùng hai con trỏ: một ở đầu, một ở cuối, so sánh rồi cùng tiến vào ' +
    'giữa. Chỉ cần một cặp khác nhau là kết luận không đối xứng.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(is_palindrome("racecar"))`,
  stringCurated,
  charLegend: [
    ['idle', 'chưa xét'],
    ['compare', 'đang so sánh'],
    ['match', 'đã khớp'],
    ['mismatch', 'khác nhau'],
  ],
  complexityNotes: [
    'Mỗi cặp ký tự được so sánh một lần, hai con trỏ đi tổng cộng qua n vị trí, nên độ phức tạp là O(n).',
    'Bộ nhớ phụ chỉ là vài biến chỉ số, tức O(1).',
    'Có thể dừng sớm ngay khi gặp cặp ký tự khác nhau đầu tiên.',
  ],
  problems: [
    {
      id: 'check',
      title: 'Kiểm tra đối xứng',
      level: 'Dễ',
      statement: 'Cài đặt is_palindrome(s) trả về True nếu chuỗi s đối xứng, ngược lại False. Chuỗi rỗng coi là đối xứng.',
      hint: 'Dùng hai con trỏ ở hai đầu, so sánh rồi cùng tiến vào giữa.',
      funcName: 'is_palindrome',
      starter: `def is_palindrome(s):
    return False`,
      solution: `def is_palindrome(s):
    i = 0
    j = len(s) - 1
    while i < j:
        if s[i] != s[j]:
            return False
        i += 1
        j -= 1
    return True`,
      cases: [
        { name: 'đối xứng lẻ', args: ['racecar'], expected: true },
        { name: 'đối xứng chẵn', args: ['abba'], expected: true },
        { name: 'không đối xứng', args: ['hello'], expected: false },
        { name: 'một ký tự', args: ['a'], expected: true },
        { name: 'rỗng', args: [''], expected: true },
      ],
    },
    {
      id: 'reverse',
      title: 'Đảo ngược chuỗi',
      level: 'Dễ',
      statement: 'Cài đặt reverse_string(s) trả về chuỗi s viết theo thứ tự ngược lại.',
      hint: 'Có thể dùng lát cắt s[::-1], hoặc ghép từng ký tự từ cuối về đầu.',
      funcName: 'reverse_string',
      starter: `def reverse_string(s):
    return s`,
      solution: `def reverse_string(s):
    return s[::-1]`,
      cases: [
        { name: 'thường', args: ['hello'], expected: 'olleh' },
        { name: 'một ký tự', args: ['a'], expected: 'a' },
        { name: 'rỗng', args: [''], expected: '' },
        { name: 'đối xứng', args: ['abba'], expected: 'abba' },
      ],
    },
  ],
};
