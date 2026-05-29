import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Client-only wrapper for every interactive widget. The widgets use Pyodide
// and CodeMirror, which touch `window`/`document`, so they must not run during
// server-side rendering. BrowserOnly defers them to the browser, and the
// require() calls keep those modules out of the server bundle entirely.
type Kind = 'visualizer' | 'playback' | 'complexity' | 'practice';

export default function Algo({ kind, algo }: { kind: Kind; algo: string }) {
  return (
    <div className="algo-ui">
      <BrowserOnly fallback={<div className="note">Đang tải widget tương tác...</div>}>
        {() => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { ALGORITHMS } = require('../algorithms');
          const a = ALGORITHMS[algo];
          let Comp: React.ComponentType<{ algo: unknown }>;
          if (kind === 'visualizer') {
            // Route the visualizer by data-structure type: array / graph / string.
            if (a.viz === 'graph') Comp = require('../components/GraphVisualizer').GraphVisualizer;
            else if (a.viz === 'string') Comp = require('../components/StringVisualizer').StringVisualizer;
            else Comp = require('../components/CuratedVisualizer').CuratedVisualizer;
          } else if (kind === 'playback') Comp = require('../components/CodePlayback').CodePlayback;
          else if (kind === 'complexity') Comp = require('../components/Complexity').Complexity;
          else Comp = require('../components/Playground').Playground;
          return <Comp algo={a} />;
        }}
      </BrowserOnly>
    </div>
  );
}
