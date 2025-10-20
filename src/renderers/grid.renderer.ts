import type { DrawContext } from '../types/renderer';

export function drawGrid({ ctx, viewport }: DrawContext) {
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.fillRect(viewport.scrollLeft, viewport.scrollTop, viewport.viewportWidth, viewport.viewportHeight);
  ctx.strokeStyle = '#eee';
  for (let y = 0; y < viewport.totalRows * viewport.rowHeight; y += viewport.rowHeight) {
    ctx.beginPath();
    ctx.moveTo(viewport.scrollLeft, y);
    ctx.lineTo(viewport.scrollLeft + viewport.viewportWidth, y);
    ctx.stroke();
  }
  ctx.restore();
}
