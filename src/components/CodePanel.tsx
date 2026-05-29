import { Fragment } from 'react';

const KEYWORDS = new Set([
  'def', 'return', 'for', 'while', 'if', 'elif', 'else', 'in', 'and', 'or',
  'not', 'len', 'range', 'list', 'None', 'True', 'False', 'break', 'continue',
  'import', 'from', 'append',
]);

// Lightweight Python token highlighter, line by line. Good enough for the
// short snippets shown in the lecture; not a full parser.
function highlightLine(line: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  // split keeping delimiters: words, numbers, strings, comments, other
  const regex = /(#.*$)|("[^"]*"|'[^']*')|(\b\d+\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_]+)/g;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(line)) !== null) {
    const [tok, comment, str, num, word, ws] = m;
    if (comment) out.push(<span key={key++} className="tok-cm">{tok}</span>);
    else if (str) out.push(<span key={key++} className="tok-str">{tok}</span>);
    else if (num) out.push(<span key={key++} className="tok-num">{tok}</span>);
    else if (word) {
      if (KEYWORDS.has(word)) out.push(<span key={key++} className="tok-kw">{tok}</span>);
      else out.push(<Fragment key={key++}>{tok}</Fragment>);
    } else if (ws) out.push(<Fragment key={key++}>{tok}</Fragment>);
    else out.push(<Fragment key={key++}>{tok}</Fragment>);
  }
  return out;
}

export function CodePanel({ source, activeLine }: { source: string; activeLine: number }) {
  const lines = source.split('\n');
  return (
    <pre className="code">
      {lines.map((line, i) => (
        <span key={i} className={`ln ${i + 1 === activeLine ? 'active' : ''}`}>
          <span className="num">{i + 1}</span>
          {highlightLine(line)}
        </span>
      ))}
    </pre>
  );
}
