import type { DrawContext } from '../types/renderer';

export function drawBars(draw: DrawContext, bars: { x: number; y: number; width: number; height: number }[]) {
  const { ctx } = draw;
  ctx.save();
  ctx.fillStyle = '#3b82f6';
  bars.forEach((b) => {
    ctx.fillRect(b.x, b.y + 3, b.width, b.height);
  });
  ctx.restore();
}
