import { useEffect, useRef } from 'react';

export function useRaf(callback: (dt: number) => void) {
  const cbRef = useRef(callback);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      if (lastRef.current == null) lastRef.current = t;
      const dt = t - lastRef.current;
      lastRef.current = t;
      cbRef.current(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
}
