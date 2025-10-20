export interface Viewport {
  offsetX: number;
  offsetY: number;
  zoom: number; // scale factor
  startDate: string; // ISO date at left edge
  columnWidth: number;
  rowHeight: number;
}

export interface ZoomState {
  zoom: number;
  min: number;
  max: number;
}

export interface TimeScale {
  pixelsPerDay: number;
  startDate: string; // ISO date for column 0
}
