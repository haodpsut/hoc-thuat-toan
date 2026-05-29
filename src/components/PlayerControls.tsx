interface Props {
  cur: number;
  length: number;
  playing: boolean;
  speed: number;
  onPlay: () => void;
  onStep: (d: number) => void;
  onSeek: (i: number) => void;
  onSpeed: (s: number) => void;
}

// Shared transport controls: to start, back, play/pause, forward, scrub, speed.
export function PlayerControls({ cur, length, playing, speed, onPlay, onStep, onSeek, onSpeed }: Props) {
  return (
    <>
      <div className="playbar">
        <button onClick={() => onSeek(0)} title="Về đầu">⏮</button>
        <button onClick={() => onStep(-1)} title="Lùi một bước">◀</button>
        <button className="primary" onClick={onPlay} disabled={length <= 1}>
          {playing ? '⏸ Dừng' : '▶ Chạy'}
        </button>
        <button onClick={() => onStep(1)} title="Tiến một bước">▶|</button>
        <div className="progress">
          <input
            type="range"
            min={0}
            max={Math.max(0, length - 1)}
            value={cur}
            onChange={(e) => onSeek(parseInt(e.target.value, 10))}
          />
        </div>
        <span className="step-label">{length ? cur + 1 : 0} / {length}</span>
      </div>
      <div className="playbar">
        <label>Tốc độ</label>
        <input
          type="range"
          min={60}
          max={1200}
          value={speed}
          onChange={(e) => onSpeed(parseInt(e.target.value, 10))}
        />
        <span className="step-label">chậm → nhanh</span>
      </div>
    </>
  );
}
