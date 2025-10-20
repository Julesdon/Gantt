// Viewport shapes vary; keep viewport loose to allow renderer stubs to use store fields.
export interface Tick {
  x: number;
  label: string;
}

export interface DrawContext {
  ctx: CanvasRenderingContext2D;
  // we intentionally use any here because different modules declare slightly
  // different viewport shapes (store vs controller). Narrow later when ready.
  viewport: any;
}

export type LayerRenderFn = (draw: DrawContext) => void;
