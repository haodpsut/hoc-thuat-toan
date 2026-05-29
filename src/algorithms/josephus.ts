import type { Algorithm, Step } from '../engine/types';

// 1 def last_survivor(people, k):
// 2     queue = list(people)
// 3     while len(queue) > 1:
// 4         for _ in range(k - 1):
// 5             queue.append(queue.pop(0))
// 6         queue.pop(0)
// 7     return queue[0]
const SOURCE = `def last_survivor(people, k):
    queue = list(people)
    while len(queue) > 1:
        for _ in range(k - 1):
            queue.append(queue.pop(0))
        queue.pop(0)
    return queue[0]`;

// Circular queue simulation. The input array holds the people labels and stays in
// place on screen; we keep a queue of original indices and rotate through it. The
// person currently being counted is highlighted via `compare`, eliminated people
// via `excluded`, and the final survivor via `found`. The current queue (labels in
// front-to-back order) is shown in vars.queue.
function curated(input: number[], target = 3): Step[] {
  const a = input.slice();
  const n = a.length;
  const steps: Step[] = [];
  const excluded: number[] = []; // original indices already eliminated
  let k = target;
  if (k <= 0) k = 1; // guard: counting by 1 if k is non-positive

  // Queue holds original indices so highlighting maps back to the bars.
  let queue = a.map((_, idx) => idx);
  const labels = (q: number[]) => q.map((idx) => a[idx]);
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
      excluded: excluded.slice(),
      found: found.slice(),
      line,
      vars,
      note,
    });

  if (n === 0) {
    push(2, [], [], { k }, `Vòng tròn rỗng, không có ai để đếm.`);
    return steps;
  }

  push(2, [], [], { k, queue: labels(queue) }, `Có ${n} người đứng thành vòng tròn. Cứ đếm tới người thứ ${k} thì loại người đó.`);
  while (queue.length > 1) {
    // Rotate k-1 people from front to back: those survive this count round.
    for (let c = 0; c < k - 1; c++) {
      const idx = queue[0];
      push(5, [idx], [], { k, queue: labels(queue) }, `Đếm ${c + 1}: người ${a[idx]} an toàn lượt này, chuyển ra sau hàng.`);
      queue.push(queue.shift() as number);
    }
    // The person now at the front is the k-th, who gets eliminated.
    const out = queue[0];
    push(6, [out], [], { k, queue: labels(queue) }, `Đếm ${k}: loại người ${a[out]} khỏi vòng tròn.`);
    queue.shift();
    excluded.push(out);
    push(6, [], [], { k, queue: labels(queue) }, `Đã loại người ${a[out]}. Còn lại ${queue.length} người, đếm tiếp từ người kế.`);
  }
  const survivor = queue[0];
  push(7, [], [survivor], { k, queue: labels(queue) }, `Chỉ còn một người. Người ${a[survivor]} là người sống sót cuối cùng.`);
  return steps;
}

export const josephus: Algorithm = {
  id: 'josephus',
  name: 'Vòng đếm Josephus',
  category: 'Ngăn xếp & Hàng đợi',
  viz: 'array',
  big: 'O(nk)',
  best: 'O(nk)',
  space: 'O(n)',
  needsTarget: true,
  defaultInput: '1, 2, 3, 4, 5, 6, 7',
  defaultTarget: 3,
  targetLabel: 'k',
  idea:
    'Bài toán Josephus: n người đứng thành vòng tròn, bắt đầu đếm từ một người và cứ đến người thứ k thì ' +
    'loại người đó ra khỏi vòng, rồi tiếp tục đếm từ người kế tiếp. Quá trình lặp lại cho tới khi chỉ còn ' +
    'một người sống sót. Cách mô phỏng trực tiếp dùng một hàng đợi: lần lượt chuyển k-1 người từ đầu hàng ' +
    'xuống cuối hàng (họ an toàn lượt này), rồi loại người đang đứng đầu. Khi hàng đợi chỉ còn một người thì ' +
    'đó là đáp án.',
  source: SOURCE,
  playback: `${SOURCE}\n\nprint(last_survivor([1, 2, 3, 4, 5, 6, 7], 3))`,
  curated,
  arrayLegend: [
    ['bar', 'còn trong vòng'],
    ['compare', 'đang đếm'],
    ['excluded', 'đã bị loại'],
    ['found', 'người sống sót'],
  ],
  complexityNotes: [
    'Mỗi lần loại một người ta phải chuyển k-1 người ra sau hàng, nên cách mô phỏng này tốn khoảng O(n·k).',
    'Hàng đợi chứa tối đa n người nên bộ nhớ phụ là O(n).',
    'Có công thức truy hồi tính vị trí sống sót trong O(n) không cần mô phỏng, nhưng mô phỏng dễ hiểu và cho ra thứ tự loại.',
  ],
  problems: [
    {
      id: 'last-survivor',
      title: 'Người sống sót cuối cùng',
      level: 'Trung bình',
      statement:
        'Cài đặt last_survivor(people, k) mô phỏng vòng đếm Josephus: đếm tới người thứ k thì loại, lặp tới khi còn một người, trả về NHÃN (giá trị) của người sống sót cuối. Giả sử k >= 1 và people không rỗng.',
      hint: 'Dùng hàng đợi. Mỗi vòng chuyển k-1 người từ đầu xuống cuối rồi bỏ người đang ở đầu.',
      funcName: 'last_survivor',
      starter: `def last_survivor(people, k):
    return people[0]`,
      solution: `def last_survivor(people, k):
    queue = list(people)
    while len(queue) > 1:
        for _ in range(k - 1):
            queue.append(queue.pop(0))
        queue.pop(0)
    return queue[0]`,
      cases: [
        { name: '7 người, k=3', args: [[1, 2, 3, 4, 5, 6, 7], 3], expected: 4 },
        { name: '5 người, k=2', args: [[1, 2, 3, 4, 5], 2], expected: 3 },
        { name: 'k=1 loại từ đầu', args: [[1, 2, 3, 4], 1], expected: 4 },
        { name: 'một người', args: [[9], 5], expected: 9 },
        { name: 'nhãn tuỳ ý', args: [[10, 20, 30], 2], expected: 30 },
      ],
    },
    {
      id: 'elimination-order',
      title: 'Thứ tự bị loại',
      level: 'Trung bình',
      statement:
        'Cài đặt elimination_order(people, k) trả về danh sách NHÃN người theo đúng thứ tự họ bị loại khỏi vòng. Người sống sót cuối cùng KHÔNG nằm trong danh sách. Giả sử k >= 1 và people không rỗng.',
      hint: 'Vẫn mô phỏng hàng đợi, nhưng mỗi lần bỏ người ở đầu thì ghi nhãn của họ vào danh sách kết quả.',
      funcName: 'elimination_order',
      starter: `def elimination_order(people, k):
    return []`,
      solution: `def elimination_order(people, k):
    queue = list(people)
    order = []
    while len(queue) > 1:
        for _ in range(k - 1):
            queue.append(queue.pop(0))
        order.append(queue.pop(0))
    return order`,
      cases: [
        { name: '7 người, k=3', args: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [3, 6, 2, 7, 5, 1] },
        { name: '5 người, k=2', args: [[1, 2, 3, 4, 5], 2], expected: [2, 4, 1, 5] },
        { name: 'k=1', args: [[1, 2, 3, 4], 1], expected: [1, 2, 3] },
        { name: 'một người', args: [[9], 3], expected: [] },
        { name: 'nhãn tuỳ ý', args: [[10, 20, 30], 2], expected: [20, 10] },
      ],
    },
  ],
};
