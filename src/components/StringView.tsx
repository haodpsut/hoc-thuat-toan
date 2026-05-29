import type { CharState } from '../engine/types';

const CLS: Record<CharState, string> = {
  idle: 'cell',
  compare: 'cell compare',
  match: 'cell match',
  mismatch: 'cell mismatch',
  window: 'cell window',
  found: 'cell found',
};

// Renders a string as a row of character cells, each with a highlight state and
// optional pointer labels above it. Used by string algorithms.
export function StringView({
  chars,
  state,
  pointers,
}: {
  chars: string[];
  state: Record<number, CharState>;
  pointers: Record<number, string[]>;
}) {
  return (
    <div className="strview">
      {chars.map((c, i) => {
        const labels = pointers[i];
        return (
          <div key={i} className={CLS[state[i] ?? 'idle']}>
            {labels && labels.length > 0 && <span className="ptr">{labels.join(',')}</span>}
            <span className="ch">{c === ' ' ? '␣' : c}</span>
            <span className="idx">{i}</span>
          </div>
        );
      })}
    </div>
  );
}
