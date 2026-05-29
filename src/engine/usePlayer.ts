import { useCallback, useEffect, useRef, useState } from 'react';

// Reusable playback engine. Drives any sequence of steps: play/pause, step
// forward/back, seek, and speed. Knows nothing about what a "step" contains,
// so it is shared by the curated visualizer and the Code Playback view.
export function usePlayer(length: number) {
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(520); // 60 (slow) .. 1200 (fast)
  const timer = useRef<number | null>(null);

  const clear = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const stop = useCallback(() => {
    setPlaying(false);
    clear();
  }, []);

  const goto = useCallback(
    (i: number) => {
      stop();
      setCur(Math.max(0, Math.min(length - 1, i)));
    },
    [length, stop],
  );

  const step = useCallback(
    (d: number) => {
      stop();
      setCur((c) => Math.max(0, Math.min(length - 1, c + d)));
    },
    [length, stop],
  );

  const play = useCallback(() => {
    if (length <= 1) return;
    setPlaying((p) => !p);
  }, [length]);

  // Reset when the underlying trace changes length (new run / new input).
  useEffect(() => {
    setCur(0);
    stop();
  }, [length, stop]);

  // Auto-advance loop while playing.
  useEffect(() => {
    if (!playing) return;
    if (cur >= length - 1) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(() => setCur((c) => c + 1), 1260 - speed);
    return clear;
  }, [playing, cur, length, speed]);

  return { cur, playing, speed, setSpeed, play, stop, step, goto };
}
