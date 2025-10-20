export interface GridViewport {
  scrollLeft: number;
  scrollTop: number;
  viewportWidth: number;   // CSS px (world coords)
  viewportHeight: number;  // CSS px (world coords)
  zoom: number;            // px/day
  rowHeight: number;       // px per row
  columnWidth: number;     // px per column
  totalRows: number;       // world rows count
}

/** Tick used for vertical grid lines */
export interface Tick {
  x: number;
  major?: boolean;
  date: Date; // Represents the date associated with the tick
}

/** Clear the visible world rect (after transform applied) */
function clearVisible(ctx: CanvasRenderingContext2D) {
  console.log(`Clearing canvas: width=${ctx.canvas.width}, height=${ctx.canvas.height}`);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the entire canvas
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  v: GridViewport,
  ticks: Tick[],
  theme?: {
    minorColor?: string;
    majorColor?: string;
    rowColor?: string;
    weekendFill?: string;
  }
) {
  const minorColor = theme?.minorColor ?? "#eef2f7";
  const majorColor = theme?.majorColor ?? "#e0e6ef";
  const rowColor = theme?.rowColor ?? "#e5e7eb";
  const weekendFill = theme?.weekendFill ?? "#f5f5f5";

  clearVisible(ctx);

  const headerHeight = 44; // 22px for month, 22px for day

  // Adjust scrollTop to exclude header height
  const gridScrollTop = Math.max(0, v.scrollTop - headerHeight);

  const firstRow = Math.max(0, Math.floor(gridScrollTop / v.rowHeight));
  const lastRow = Math.min(
    v.totalRows - 1,
    Math.floor((gridScrollTop + v.viewportHeight - headerHeight) / v.rowHeight)
  );

  // Draw weekend column backgrounds
  ctx.fillStyle = weekendFill;
  for (const t of ticks) {
    const dayOfWeek = t.date.getDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      const x = t.x - v.scrollLeft;
      ctx.fillRect(x, headerHeight, v.columnWidth, v.viewportHeight - headerHeight);
    }
  }

  // Vertical ticks
  ctx.beginPath();
  for (const t of ticks) {
    const x = Math.round(t.x - v.scrollLeft) + 0.5;
    ctx.moveTo(x, headerHeight);
    ctx.lineTo(x, v.viewportHeight);
    ctx.strokeStyle = t.major ? majorColor : minorColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.closePath();

  // Horizontal row lines (start below header)
  ctx.beginPath();
  for (let row = firstRow; row <= lastRow; row++) {
    // Top of this row, always >= headerHeight
    const y = Math.round((row - firstRow) * v.rowHeight + headerHeight) + 0.5;
    ctx.moveTo(0, y);
    ctx.lineTo(v.viewportWidth, y);
    ctx.strokeStyle = rowColor;
    ctx.stroke();
  }
  ctx.closePath();

  // Draw column date labels with two rows: months and days
  ctx.font = "12px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";

  // First pass: Draw month labels (only once per month)
  const monthsDrawn = new Set<string>();
  for (let i = 0; i < ticks.length; i++) {
    const t = ticks[i];
    const monthYear = `${t.date.toLocaleString('en-GB', { month: 'long' })} ${t.date.getFullYear()}`;
    
    if (!monthsDrawn.has(monthYear)) {
      monthsDrawn.add(monthYear);
      
      // Find the range of this month in the visible ticks
      const monthStart = i;
      let monthEnd = i;
      const currentMonth = t.date.getMonth();
      const currentYear = t.date.getFullYear();
      
      // Find where this month ends in the visible ticks
      for (let j = i + 1; j < ticks.length; j++) {
        if (ticks[j].date.getMonth() === currentMonth && ticks[j].date.getFullYear() === currentYear) {
          monthEnd = j;
        } else {
          break;
        }
      }
      
      // Calculate the center position for the month label
      const startX = ticks[monthStart].x - v.scrollLeft;
      const endX = monthEnd < ticks.length - 1 
        ? ticks[monthEnd].x - v.scrollLeft + v.columnWidth
        : ticks[monthEnd].x - v.scrollLeft + v.columnWidth;
      const centerX = (startX + endX) / 2;
      
      // Draw month label in the first row
      ctx.save();
      ctx.font = "bold 13px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(monthYear, centerX, 14);
      ctx.restore();
    }
  }

  // Draw a separator line between month and day rows
  ctx.beginPath();
  ctx.moveTo(0, 22);
  ctx.lineTo(v.viewportWidth, 22);
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.closePath();

  // Second pass: Draw day labels for each column
  for (const t of ticks) {
    const x = Math.round(t.x - v.scrollLeft + v.columnWidth / 2); // Center in the column
    const day = t.date.getDate().toString();
    ctx.fillText(day, x, 36); // Display only the day number
  }
}

// Utility function to resize the canvas to fit its container
export const resizeCanvasToContainer = (
  container: HTMLDivElement | null,
  canvas: HTMLCanvasElement | null,
  offscreenCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  devicePixelRatio: number,
  setSize: (width: number, height: number) => void,
  setDevicePixelRatio: (dpr: number) => void
) => {
  if (!container || !canvas) return;

  const dpr = devicePixelRatio;
  const { clientWidth, clientHeight } = container;

  // Resize visible canvas
  canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
  canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
  canvas.style.width = `${clientWidth}px`;
  canvas.style.height = `${clientHeight}px`;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  // Create/resize offscreen canvas
  if (!offscreenCanvasRef.current) {
    offscreenCanvasRef.current = document.createElement("canvas");
  }
  const offCanvas = offscreenCanvasRef.current;
  offCanvas.width = Math.max(1, Math.floor(clientWidth * dpr));
  offCanvas.height = Math.max(1, Math.floor(clientHeight * dpr));

  const offCtx = offCanvas.getContext("2d");
  if (offCtx) {
    offCtx.setTransform(1, 0, 0, 1, 0, 0);
    offCtx.scale(dpr, dpr);
  }

  setSize(clientWidth, clientHeight);
  setDevicePixelRatio(dpr);
};

// Utility function to calculate the visible range of rows and columns
export const calculateVisibleRange = (
  scrollLeft: number,
  scrollTop: number,
  viewportWidth: number,
  viewportHeight: number,
  columnWidth: number,
  rowHeight: number,
  totalColumns: number,
  totalRows: number
) => {
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
};

// Utility function to render the grid using double buffering
export const renderGrid = (
  canvas: HTMLCanvasElement | null,
  offscreenCanvas: HTMLCanvasElement | null,
  calculateVisibleRange: () => {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
  },
  scrollLeft: number,
  scrollTop: number,
  columnWidth: number,
  rowHeight: number,
  viewportWidth: number,
  viewportHeight: number
) => {
  if (!canvas || !offscreenCanvas) return;

  const ctx = canvas.getContext("2d");
  const offCtx = offscreenCanvas.getContext("2d");
  if (!ctx || !offCtx) return;

  const { startRow, endRow, startCol, endCol } = calculateVisibleRange();

  // Clear offscreen canvas (CSS pixels)
  offCtx.clearRect(0, 0, viewportWidth, viewportHeight);

  // Draw background
  offCtx.fillStyle = "#fff";
  offCtx.fillRect(0, 0, viewportWidth, viewportHeight);

  // Render visible cells
  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      const x = col * columnWidth - scrollLeft;
      const y = row * rowHeight - scrollTop;

      offCtx.strokeStyle = "#ccc";
      offCtx.strokeRect(x, y, columnWidth, rowHeight);

      offCtx.fillStyle = "#000";
      offCtx.font = "12px sans-serif";
      offCtx.fillText(`R${row}C${col}`, x + 5, y + 15);
    }
  }

  // Copy to visible canvas
  ctx.clearRect(0, 0, viewportWidth, viewportHeight);
  ctx.drawImage(offscreenCanvas, 0, 0);
};
