export function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function range(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}
