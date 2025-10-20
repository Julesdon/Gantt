export class GridController {
  private viewport: Viewport;

  constructor(viewport: Viewport) {
    this.viewport = viewport;
  }

  getVisibleRows() {
    const { scrollTop, viewportHeight, totalRows, rowHeight } = this.viewport;
    const firstVisibleRow = Math.max(0, Math.floor(scrollTop / rowHeight));
    const lastVisibleRow = Math.min(
      totalRows - 1,
      Math.floor((scrollTop + viewportHeight) / rowHeight)
    );
    return { firstVisibleRow, lastVisibleRow };
  }

  getVisibleColumns() {
    const { scrollLeft, viewportWidth, columnWidth, totalColumns } = this.viewport;
    const firstVisibleColumn = Math.max(0, Math.floor(scrollLeft / columnWidth));
    const lastVisibleColumn = Math.min(
      (totalColumns ?? Infinity) - 1,
      Math.floor((scrollLeft + viewportWidth) / columnWidth)
    );
    return { firstVisibleColumn, lastVisibleColumn };
  }

  getBufferedColumnRange(bufferColumns: number) {
    const { firstVisibleColumn, lastVisibleColumn } = this.getVisibleColumns();
    const startIndex = Math.max(0, firstVisibleColumn - bufferColumns);
    const endIndex = Math.min(
      (this.viewport.totalColumns ?? 0) - 1,
      lastVisibleColumn + bufferColumns
    );
    const count = Math.max(0, endIndex - startIndex + 1);
    return { startIndex, endIndex, count, firstVisibleColumn, lastVisibleColumn };
  }

  generateTicks(startIndex: number, count: number) {
    const { columnWidth, zoom = 1, startDate = new Date() } = this.viewport;
    return Array.from({ length: count }, (_, i) => {
      const columnIndex = startIndex + i;
      const columnDate = new Date(
        startDate.getTime() + columnIndex * (1 / zoom) * 86400000
      );
      return {
        x: columnIndex * columnWidth,
        major: columnDate.getDate() === 1,
        date: columnDate,
        index: columnIndex,
      };
    });
  }

  shouldAddMoreColumns(bufferColumns: number): boolean {
    const { lastVisibleColumn } = this.getVisibleColumns();
    return lastVisibleColumn >= (this.viewport.totalColumns ?? 0) - bufferColumns;
  }

  getCanvasHeight() {
    return this.viewport.totalRows * this.viewport.rowHeight;
  }

  getCanvasWidth() {
    return (this.viewport.totalColumns ?? 0) * this.viewport.columnWidth;
  }

  updateViewport(newViewport: Partial<Viewport>) {
    this.viewport = { ...this.viewport, ...newViewport };
  }

  static getVisibleRange(viewport: Viewport) {
    const {
      scrollLeft,
      scrollTop,
      viewportWidth,
      viewportHeight,
      columnWidth,
      rowHeight,
      totalColumns = 0,
      totalRows,
    } = viewport;

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
}

export interface Viewport {
  scrollTop: number;
  scrollLeft: number;
  viewportHeight: number;
  viewportWidth: number;
  totalRows: number;
  totalColumns?: number; // Made optional to support infinite columns
  rowHeight: number;
  columnWidth: number;
  zoom?: number; // Optional zoom level for scaling
  startDate?: Date; // Optional start date for the grid
}

export default GridController;
