export function visibleRows(scrollTop: number, rowHeight: number, viewportHeight: number, buffer = 3) {
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
  const end = Math.ceil((scrollTop + viewportHeight) / rowHeight) + buffer;
  return { start, end };
}
