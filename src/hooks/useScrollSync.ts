import { useEffect } from "react";

/**
 * Custom hook to synchronize horizontal scrolling between two elements.
 * @param sourceRef - The source element whose scroll event drives synchronization.
 * @param targetRef - The target element to synchronize with the source.
 */
export function useScrollSync(sourceRef: React.RefObject<HTMLElement>, targetRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const source = sourceRef.current;
    const target = targetRef.current;
    if (!source || !target) return;

    const onScroll = () => {
      target.scrollLeft = source.scrollLeft;
    };

    source.addEventListener("scroll", onScroll, { passive: true });
    return () => source.removeEventListener("scroll", onScroll);
  }, [sourceRef, targetRef]);
}