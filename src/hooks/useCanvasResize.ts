import { useEffect, useRef } from 'react';

export function useCanvasResize<T extends HTMLCanvasElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = el.getBoundingClientRect();
      el.width = Math.max(1, Math.floor(rect.width * dpr));
      el.height = Math.max(1, Math.floor(rect.height * dpr));
      el.style.width = `${rect.width}px`;
      el.style.height = `${rect.height}px`;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return ref;
}
