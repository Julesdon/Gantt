import { create } from "zustand";

export interface ViewportState {
  // camera
  scrollLeft: number;
  scrollTop: number;
  zoom: number; // px per day (for GridView)
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;

  // grid properties
  totalRows: number;
  rowHeight: number;
  columnWidth: number;
  startDate: Date;
  totalColumns: number;

  // actions
  setScroll: (x: number, y: number) => void;
  setZoom: (z: number) => void;
  setSize: (w: number, h: number) => void;
  setDevicePixelRatio: (dpr: number) => void;
  setGridProps: (props: Partial<Pick<ViewportState, "totalRows"|"rowHeight"|"columnWidth"|"startDate"|"totalColumns">>) => void;
}

export const useViewport = create<ViewportState>((set) => ({
  scrollLeft: 0,
  scrollTop: 0,
  zoom: 1,
  viewportWidth: 0,
  viewportHeight: 0,
  devicePixelRatio: typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,

  // grid defaults
  totalRows: 100,
  rowHeight: 32,
  columnWidth: 40,
  startDate: new Date(new Date().setHours(0, 0, 0, 0)),
  totalColumns: 60,

  setScroll: (x, y) => set({ scrollLeft: Math.max(0, x), scrollTop: Math.max(0, y) }),
  setZoom: (z) => set({ zoom: Math.max(0.25, Math.min(256, z)) }),
  setSize: (w, h) => set({ viewportWidth: Math.max(0, w), viewportHeight: Math.max(0, h) }),
  setDevicePixelRatio: (dpr) => set({ devicePixelRatio: Math.max(1, dpr) }),
  setGridProps: (props) => set({ ...props }),
}));

// --------- Utilities (DPR sizing, transforms, observers) --------------------

/** Size canvas to CSS viewport while scaling backing store for DPR */
export function sizeCanvasToViewport(
  canvas: HTMLCanvasElement,
  cssW: number,
  cssH: number,
  dpr: number
) {
  const w = Math.max(1, Math.floor(cssW * dpr));
  const h = Math.max(1, Math.floor(cssH * dpr));
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const s = canvas.style;
  s.width = `${cssW}px`;
  s.height = `${cssH}px`;
}

/** Apply world-space transform: DPR scale + camera pan */
export function applyViewportTransform(
  ctx: CanvasRenderingContext2D,
  {
    devicePixelRatio,
    scrollLeft,
    scrollTop,
  }: Pick<ViewportState, "devicePixelRatio" | "scrollLeft" | "scrollTop">
) {
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, -scrollLeft, -scrollTop);
}

/** Observe element size and update viewport */
export function observeViewportSize(
  el: HTMLElement,
  setSize: (w: number, h: number) => void
): () => void {
  const ro = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width, height } = entry.contentRect;
    setSize(Math.floor(width), Math.floor(height));
  });
  ro.observe(el);
  return () => ro.disconnect();
}

/** Zoom handler (Ctrl + Wheel) adjusting px/day */
export function handleZoomWheel(
  e: WheelEvent,
  currentZoom: number,
  setZoom: (z: number) => void
) {
  if (!e.ctrlKey) return;
  e.preventDefault();
  const step = Math.sign(-e.deltaY) * 0.25;
  setZoom(currentZoom + step);
}
