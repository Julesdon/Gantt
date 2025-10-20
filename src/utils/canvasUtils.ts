// canvasUtils.ts
// Utility functions for managing canvas layers

/**
 * Resizes the canvas and offscreen canvas to match the container dimensions.
 * Scales the canvas for the device pixel ratio (DPR).
 */
export function resizeCanvasToContainer(
  container: HTMLDivElement | null,
  canvas: HTMLCanvasElement | null,
  offscreenCanvas: HTMLCanvasElement | null,
  devicePixelRatio: number,
  setSize: (width: number, height: number) => void,
  setDevicePixelRatio: (dpr: number) => void
) {
  if (!container || !canvas) return;

  const dpr = devicePixelRatio;
  const { clientWidth, clientHeight } = container;

  // Resize visible canvas
  canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
  canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
  canvas.style.width = `${clientWidth}px`;
  canvas.style.height = `${clientHeight}px`;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  // Create/resize offscreen canvas
  if (offscreenCanvas) {
    offscreenCanvas.width = Math.max(1, Math.floor(clientWidth * dpr));
    offscreenCanvas.height = Math.max(1, Math.floor(clientHeight * dpr));

    const offCtx = offscreenCanvas.getContext('2d');
    if (offCtx) {
      offCtx.setTransform(1, 0, 0, 1, 0, 0);
      offCtx.scale(dpr, dpr);
    }
  }

  setSize(clientWidth, clientHeight);
  setDevicePixelRatio(dpr);
}

/**
 * Calculates the visible range of rows and columns based on scroll position and viewport dimensions.
 */
export function calculateVisibleRange(
  scrollLeft: number,
  scrollTop: number,
  viewportWidth: number,
  viewportHeight: number,
  columnWidth: number,
  rowHeight: number,
  totalColumns: number,
  totalRows: number
) {
  const startCol = Math.floor(scrollLeft / columnWidth);
  const endCol = Math.min(
    Math.ceil((scrollLeft + viewportWidth) / columnWidth),
    totalColumns
  );

  const startRow = Math.floor(scrollTop / rowHeight);
  const endRow = Math.min(
    Math.ceil((scrollTop + viewportHeight) / rowHeight),
    totalRows
  );

  return { startRow, endRow, startCol, endCol };
}

/**
 * Schedules a render using requestAnimationFrame to throttle rendering.
 */
export function scheduleRender(
  rafRef: React.MutableRefObject<number | null>,
  renderCallback: () => void
) {
  if (rafRef.current != null) return;
  rafRef.current = requestAnimationFrame(() => {
    rafRef.current = null;
    renderCallback();
  });
}

/**
 * Dynamically expands columns when scrolling near the edge.
 */
export function expandColumnsIfNeeded(
  scrollLeft: number,
  viewportWidth: number,
  columnWidth: number,
  totalColumns: number,
  setGridProps: (props: { totalColumns: number }) => void
) {
  const endCol = Math.ceil((scrollLeft + viewportWidth) / columnWidth);

  if (endCol >= totalColumns - 20) {
    const newTotalColumns = totalColumns + 50;
    setGridProps({ totalColumns: newTotalColumns });
  }
}