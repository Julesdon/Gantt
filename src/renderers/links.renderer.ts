import type { DrawContext } from '../types/renderer';

export function drawLinks(draw: DrawContext, routes: { points: { x: number; y: number }[] }[]) {
  const { ctx } = draw;
  ctx.save();
  ctx.strokeStyle = '#6b7280';
  ctx.lineWidth = 2;
  routes.forEach((r) => {
    const pts = r.points;
    if (pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  });
  ctx.restore();
}
