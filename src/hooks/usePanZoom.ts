import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useViewport } from '../state/viewport';

export function usePanZoom(containerRef: RefObject<HTMLElement | null>) {
  const setScroll = useViewport((s) => s.setScroll);
  const setZoom = useViewport((s) => s.setZoom);
  const getState = useViewport.getState;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const { zoom } = getState();
        const step = Math.sign(-e.deltaY) * 0.25;
        setZoom(zoom + step);
      } else {
        // pan using wheel deltas
        const { scrollLeft, scrollTop } = getState();
        setScroll(scrollLeft + e.deltaX, scrollTop + e.deltaY);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [containerRef, setScroll, setZoom]);
}
