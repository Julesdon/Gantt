import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Gantt60DayPOC.tsx
 * ------------------------------------------------------------
 * A minimal, working proof‑of‑concept Gantt that:
 * - Shows a fixed 60‑day window from a chosen start date
 * - Navigates the window backward/forward (+/‑ 7 or 60 days)
 * - Virtualizes ROWS ONLY (thousands of tasks ok)
 * - Uses DOM + SVG (no canvas)
 * - Keeps header dates sticky; horizontal scroll is synced between header & body
 * - Avoids dual‑axis virtualization complexity
 *
 * Dependencies:
 *   npm i @tanstack/react-virtual
 *
 * Usage:
 *   import Gantt60DayPOC from "./Gantt60DayPOC";
 *   export default function App() { return <Gantt60DayPOC /> }
 * ------------------------------------------------------------
 */

// ====== Tunables ======
const ROW_HEIGHT = 36;           // px per task row
const COL_WIDTH = 32;            // px per day column
const WINDOW_DAYS = 60;          // fixed window size
const LEFT_COL_WIDTH = 280;      // px (task name column)

// ====== Date helpers ======
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};
const diffInDays = (a: Date, b: Date) => {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.round(ms / 86400000);
};
const fmtDay = (d: Date) => d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });

// ====== Demo task generator ======
export type Task = {
  id: number;
  name: string;
  start: Date; // inclusive
  end: Date;   // exclusive
};

function makeDemoTasks(count = 1500, anchor = startOfDay(new Date())): Task[] {
  const tasks: Task[] = [];
  for (let i = 0; i < count; i++) {
    const jitter = Math.floor(Math.random() * 240) - 120; // +/- 120 days around anchor
    const duration = Math.max(1, Math.floor(Math.random() * 20));
    const s = addDays(anchor, jitter);
    const e = addDays(s, duration);
    tasks.push({ id: i + 1, name: `Task ${i + 1}`, start: s, end: e });
  }
  return tasks;
}

// ====== Core component ======
export default function Gantt60DayPOC() {
  const [allTasks] = useState(() => makeDemoTasks());
  const [windowStart, setWindowStart] = useState(() => startOfDay(new Date()));
  const windowEnd = useMemo(() => addDays(windowStart, WINDOW_DAYS), [windowStart]);
  const totalWidth = WINDOW_DAYS * COL_WIDTH;

  // --- layout refs ---
  const rowsScrollRef = useRef<HTMLDivElement | null>(null); // vertical scroll container
  const rightBodyScrollRef = useRef<HTMLDivElement | null>(null); // horizontal scroll source
  const rightHeaderScrollRef = useRef<HTMLDivElement | null>(null); // horizontal mirror of header

  // --- virtualization (rows only) ---
  const rowVirtualizer = useVirtualizer({
    count: allTasks.length,
    getScrollElement: () => rowsScrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 6,
  });

  // --- horizontal scroll sync: body -> header ---
  useEffect(() => {
    const body = rightBodyScrollRef.current;
    const header = rightHeaderScrollRef.current;
    if (!body || !header) return;

    const onScroll = () => {
      header.scrollLeft = body.scrollLeft;
    };
    body.addEventListener("scroll", onScroll, { passive: true });
    return () => body.removeEventListener("scroll", onScroll);
  }, []);

  // --- navigation helpers ---
  const shiftWindow = (days: number) => setWindowStart((s: Date) => addDays(s, days));
  const onPickDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // yyyy-mm-dd
    if (!val) return;
    const [y, m, d] = val.split("-").map(Number);
    setWindowStart(new Date(y, (m || 1) - 1, d || 1));
  };

  // --- bar positioning (clipped to 60-day window) ---
  const computeBar = (task: Task) => {
    // Clip to window
    const clampedStart = task.start < windowStart ? windowStart : task.start;
    const clampedEnd = task.end > windowEnd ? windowEnd : task.end;
    const x = Math.max(0, diffInDays(clampedStart, windowStart) * COL_WIDTH);
    const w = Math.max(0, diffInDays(clampedEnd, clampedStart) * COL_WIDTH);
    return { x, w };
  };

  // --- render helpers ---
  const DaysHeader = () => {
    const days: React.ReactNode[] = [];
    for (let i = 0; i < WINDOW_DAYS; i++) {
      const d = addDays(windowStart, i);
      days.push(
        <div key={i} style={{
          width: COL_WIDTH,
          minWidth: COL_WIDTH,
          maxWidth: COL_WIDTH,
          height: 28,
          boxSizing: "border-box",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: "#111827",
        }}>
          {fmtDay(d)}
        </div>
      );
    }
    return (
      <div style={{ position: "relative", width: totalWidth }}>
        <div style={{ display: "flex" }}>{days}</div>
        {/* Vertical month separators (optional) */}
      </div>
    );
  };

  // ====== RENDER ======
  const totalHeight = rowVirtualizer.getTotalSize();
  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div style={styles.appRoot}>
      {/* Controls */}
      <div style={styles.toolbar}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={styles.btn} onClick={() => shiftWindow(-60)}>◀︎ 60d</button>
          <button style={styles.btn} onClick={() => shiftWindow(-7)}>◀︎ 7d</button>
          <button style={styles.btn} onClick={() => setWindowStart(startOfDay(new Date()))}>Today</button>
          <button style={styles.btn} onClick={() => shiftWindow(7)}>7d ▶︎</button>
          <button style={styles.btn} onClick={() => shiftWindow(60)}>60d ▶︎</button>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ fontSize: 12, color: "#374151" }}>Start date</label>
          <input
            type="date"
            value={toDateInputValue(windowStart)}
            onChange={onPickDate}
            style={styles.dateInput}
          />
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Window: {fmtDay(windowStart)} → {fmtDay(addDays(windowStart, WINDOW_DAYS - 1))}
          </span>
        </div>
      </div>

      {/* Header row */}
      <div style={styles.headerRow}>
        <div style={{ ...styles.leftHeader, width: LEFT_COL_WIDTH }}>Task</div>
        <div
          ref={rightHeaderScrollRef}
          style={{ ...styles.rightHeader, width: `calc(100% - ${LEFT_COL_WIDTH}px)`, pointerEvents: "none", overflowX: "auto" }}
        >
          <div style={{ width: totalWidth }}>
            <DaysHeader />
          </div>
        </div>
      </div>

      {/* Body: vertical scroll container */}
      <div ref={rowsScrollRef} style={styles.bodyScroll}>
        <div style={{ display: "flex", position: "relative" }}>
          {/* Left: virtualized task names */}
          <div style={{ width: LEFT_COL_WIDTH, position: "sticky", left: 0, zIndex: 2, background: "white", borderRight: "1px solid #e5e7eb" }}>
            <div style={{ height: totalHeight, position: "relative" }}>
              {virtualItems.map(vi => {
                const task = allTasks[vi.index];
                return (
                  <div
                    key={vi.key}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: ROW_HEIGHT,
                      transform: `translateY(${vi.start}px)`,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 12px",
                      boxSizing: "border-box",
                      borderBottom: "1px solid #f3f4f6",
                      background: vi.index % 2 === 0 ? "#ffffff" : "#fcfcfc",
                      fontSize: 13,
                      color: "#111827",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={`${task.name} — ${fmtDay(task.start)} to ${fmtDay(addDays(task.end, -1))}`}
                  >
                    {task.name}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: timeline (horizontal scroll source) */}
          <div
            ref={rightBodyScrollRef}
            style={{ ...styles.rightBodyScroll, width: `calc(100% - ${LEFT_COL_WIDTH}px)` }}
          >
            <div style={{ width: totalWidth, height: totalHeight, position: "relative" }}>
              {virtualItems.map(vi => {
                const task = allTasks[vi.index];
                const { x, w } = computeBar(task); // Calculate x and w for the task
                return (
                  <div
                    key={vi.key}
                    style={{
                      position: "absolute",
                      top: vi.start,
                      left: 0,
                      height: ROW_HEIGHT,
                      width: totalWidth,
                      boxSizing: "border-box",
                      borderBottom: "1px solid #f3f4f6",
                      background: vi.index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.01)",
                    }}
                  >
                    {/* SVG bar, clipped to the window */}
                    <svg width={totalWidth} height={ROW_HEIGHT} style={{ position: "absolute", left: 0, top: 0 }}>
                      {w > 0 && (
                        <g>
                          <rect x={x + 2} y={8} width={w - 4} height={ROW_HEIGHT - 16} rx={6} ry={6} fill="#3b82f6" />
                          {/* progress or handle elements could go here */}
                        </g>
                      )}
                    </svg>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Little style block for demo neatness */}
      <style>{`
        * { box-sizing: border-box; }
        html, body, #root { height: 100%; }
      `}</style>
    </div>
  );
}

// ====== Utilities ======
function toDateInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ====== Inline styles ======
const styles: Record<string, React.CSSProperties> = {
  appRoot: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, \"Apple Color Emoji\", \"Segoe UI Emoji\"",
    color: "#111827",
    background: "#ffffff",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    background: "white",
    zIndex: 3,
  },
  btn: {
    border: "1px solid #d1d5db",
    background: "#fff",
    padding: "6px 10px",
    borderRadius: 8,
    fontSize: 12,
    cursor: "pointer",
  },
  dateInput: {
    border: "1px solid #d1d5db",
    padding: "6px 8px",
    borderRadius: 6,
    fontSize: 12,
  },
  headerRow: {
    display: "flex",
    alignItems: "stretch",
    borderBottom: "1px solid #e5e7eb",
    background: "white",
    position: "sticky",
    top: 48, // below toolbar
    zIndex: 2,
  },
  leftHeader: {
    padding: "6px 12px",
    fontSize: 12,
    color: "#374151",
    borderRight: "1px solid #e5e7eb",
    background: "white",
  },
  rightHeader: {
    height: 28,
    overflowX: "hidden",
    borderLeft: "1px solid #f3f4f6",
  },
  bodyScroll: {
    position: "relative",
    overflow: "auto",
    height: "calc(100% - 48px - 28px)", // total minus toolbar and header
  },
  rightBodyScroll: {
    overflowX: "auto",
    overflowY: "hidden",
  },
};
