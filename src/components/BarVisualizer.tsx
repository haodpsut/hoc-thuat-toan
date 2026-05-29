interface Props {
  array: number[];
  compare?: number[];
  swap?: number[];
  sorted?: number[];
  excluded?: number[];
  found?: number[];
  pointers?: Record<number, string[]>; // index -> labels (e.g. {2: ['i'], 0: ['j']})
  maxVal: number;
}

// Renders an array as a row of bars with semantic colors and optional pointer
// labels above each bar. Used by both the curated view and Code Playback.
export function BarVisualizer({
  array,
  compare = [],
  swap = [],
  sorted = [],
  excluded = [],
  found = [],
  pointers = {},
  maxVal,
}: Props) {
  const safeMax = maxVal > 0 ? maxVal : 1;
  // Bars shrink as the array grows so the row never overflows horizontally.
  const n = array.length;
  const barW = n <= 12 ? 40 : n <= 20 ? 28 : Math.max(14, Math.floor(440 / n));
  const fontSize = barW < 22 ? 10 : 13;
  return (
    <div className="viz">
      {array.map((v, idx) => {
        const cls = ['bar'];
        if (excluded.includes(idx)) cls.push('excluded');
        if (compare.includes(idx)) cls.push('compare');
        if (swap.includes(idx)) cls.push('swap');
        if (sorted.includes(idx)) cls.push('sorted');
        if (found.includes(idx)) cls.push('found');
        const labels = pointers[idx];
        return (
          <div
            key={idx}
            className={cls.join(' ')}
            style={{ height: `${28 + 250 * (v / safeMax)}px`, width: `${barW}px`, fontSize }}
          >
            {labels && labels.length > 0 && <span className="ptr">{labels.join(',')}</span>}
            {v}
          </div>
        );
      })}
    </div>
  );
}
