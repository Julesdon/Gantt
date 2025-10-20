import * as React from "react";
import { useViewport } from "../../state/viewport";
import { resizeCanvasToContainer, renderGrid } from "../../utils/renderer";
import GridController from "../../controllers/GridController";

interface GridViewProps {
  initialColumns?: number;
}

const GridLayer: React.FC<GridViewProps> = ({ 
  initialColumns = 60 
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const {
    scrollLeft,
    scrollTop,
    viewportWidth,
    viewportHeight,
    devicePixelRatio,
    totalRows,
    rowHeight,
    columnWidth,
    totalColumns,
    setScroll,
    setSize,
    setDevicePixelRatio,
    setGridProps,
  } = useViewport();

  const scrollBuffer = 200;

  // Initialize once
  React.useEffect(() => {
    setGridProps({
      totalRows: totalRows || 100,
      rowHeight: rowHeight || 32,
      columnWidth: columnWidth || 40,
      totalColumns: initialColumns,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalColumnsRef = React.useRef(totalColumns);

  const resizeCanvas = React.useCallback(() => {
    resizeCanvasToContainer(
      containerRef.current,
      canvasRef.current,
      offscreenCanvasRef,
      devicePixelRatio,
      setSize,
      setDevicePixelRatio
    );
  }, [devicePixelRatio, setSize, setDevicePixelRatio]);

  // Calculate visible range using viewport state, not direct DOM reads
  const calculateRange = React.useCallback(() => {
    return GridController.getVisibleRange({
      scrollTop,
      scrollLeft,
      viewportHeight,
      viewportWidth,
      totalRows,
      totalColumns,
      rowHeight,
      columnWidth,
    });
  }, [scrollTop, scrollLeft, viewportHeight, viewportWidth, totalRows, totalColumns, rowHeight, columnWidth]);

  // Render with double buffering
  const render = React.useCallback(() => {
    renderGrid(
      canvasRef.current,
      offscreenCanvasRef.current,
      calculateRange,
      scrollLeft,
      scrollTop,
      columnWidth,
      rowHeight,
      viewportWidth,
      viewportHeight
    );
  }, [calculateRange, scrollLeft, scrollTop, columnWidth, rowHeight, viewportWidth, viewportHeight]);

  const renderRef = React.useRef(render);
  renderRef.current = render;

  // RAF throttling
  const rafRef = React.useRef<number | null>(null);
  const scheduleRender = React.useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      renderRef.current();
    });
  }, []);

  // Throttled column expansion
  const lastCheckScrollLeft = React.useRef(0);
  const lastCheckTime = React.useRef(0);
  const isExpanding = React.useRef(false);

  const expandColumnsIfNeeded = React.useCallback(() => {
    if (isExpanding.current) return;

    const now = Date.now();
    if (now - lastCheckTime.current < 100 || 
        Math.abs(scrollLeft - lastCheckScrollLeft.current) < columnWidth * 3) {
      return;
    }

    lastCheckTime.current = now;
    lastCheckScrollLeft.current = scrollLeft;

    const currentTotalColumns = totalColumnsRef.current;
    const endCol = Math.ceil((scrollLeft + viewportWidth) / columnWidth);

    if (endCol >= currentTotalColumns - 20) {
      isExpanding.current = true;
      const newTotalColumns = currentTotalColumns + 50;
      setGridProps({ totalColumns: newTotalColumns });

      setTimeout(() => {
        isExpanding.current = false;
      }, 200);
    }
  }, [scrollLeft, viewportWidth, columnWidth, setGridProps]);

  const handleScroll = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    setScroll(container.scrollLeft, container.scrollTop);
    expandColumnsIfNeeded();
    scheduleRender();
  }, [setScroll, expandColumnsIfNeeded, scheduleRender]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      scheduleRender();
    });

    resizeObserver.observe(container);
    container.addEventListener('scroll', handleScroll, { passive: true });

    // Initial setup
    resizeCanvas();
    scheduleRender();

    // Handle DPR changes
    const mq = window.matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
    const dprListener = () => {
      resizeCanvas();
      scheduleRender();
    };
    mq.addEventListener?.("change", dprListener);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('scroll', handleScroll);
      mq.removeEventListener?.("change", dprListener);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [resizeCanvas, handleScroll, scheduleRender, devicePixelRatio]);

  // Re-render when columns change
  React.useEffect(() => {
    totalColumnsRef.current = totalColumns;
    scheduleRender();
  }, [totalColumns, scheduleRender]);

  return (
    <div
      ref={containerRef}
      style={{
        overflow: 'auto',
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: totalColumns * columnWidth + scrollBuffer,
          height: totalRows * rowHeight,
          position: 'relative',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            position: 'sticky',
            top: 0,
            left: 0,
            willChange: 'contents',
          }}
        />
      </div>
    </div>
  );
};

export default GridLayer;