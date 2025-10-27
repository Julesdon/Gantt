import React, { useMemo, useRef, useState } from "react";
import { addDays, startOfDay, diffInDays, toDateInputValue } from "./utils/dateHelpers";
import { useVirtualizer } from "@tanstack/react-virtual";
import { makeDemoTasks } from "./utils/taskGenerator";
import type { Task } from "./utils/taskGenerator";

// Tunables
const ROW_HEIGHT = 36;           // px per task row
const COL_WIDTH = 32;            // px per day column
const WINDOW_DAYS = 60;          // fixed window size
const LEFT_COL_WIDTH = 280;      // px (task name column)

// Top navigation component
const TopNavigation: React.FC<{ windowStart: Date; shiftWindow: (days: number) => void; setWindowStart: (date: Date) => void }> = ({ windowStart, shiftWindow, setWindowStart }) => {
  return (
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
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              const [y, m, d] = val.split("-").map(Number);
              setWindowStart(new Date(y, (m || 1) - 1, d || 1));
            }
          }}
          style={styles.dateInput}
        />
      </div>
    </div>
  );
};

// Task list component
const TaskList: React.FC<{ tasks: Task[]; virtualItems: any[]; totalHeight: number }> = ({ tasks, virtualItems, totalHeight }) => {
  return (
    <div style={{ width: LEFT_COL_WIDTH, position: "sticky", left: 0, zIndex: 2, background: "white", borderRight: "1px solid #e5e7eb" }}>
      <div style={{ height: totalHeight, position: "relative" }}>
        {virtualItems.map((vi) => {
          const task = tasks[vi.index];
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
              }}
            >
              {task.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Task bars and calendar component
const TaskBarsAndCalendar: React.FC<{ tasks: Task[]; virtualItems: any[]; totalWidth: number; totalHeight: number; windowStart: Date; windowEnd: Date }> = ({ tasks, virtualItems, totalWidth, totalHeight, windowStart, windowEnd }) => {
  const computeBar = (task: Task) => {
    const clampedStart = task.start < windowStart ? windowStart : task.start;
    const clampedEnd = task.end > windowEnd ? windowEnd : task.end;
    const x = Math.max(0, diffInDays(clampedStart, windowStart) * COL_WIDTH);
    const w = Math.max(0, diffInDays(clampedEnd, clampedStart) * COL_WIDTH);
    return { x, w };
  };

  return (
    <div style={{ ...styles.rightBodyScroll, width: `calc(100% - ${LEFT_COL_WIDTH}px)` }}>
      <div style={{ width: totalWidth, height: totalHeight, position: "relative" }}>
        {virtualItems.map((vi) => {
          const task = tasks[vi.index];
          const { x, w } = computeBar(task);
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
              }}
            >
              <svg width={totalWidth} height={ROW_HEIGHT} style={{ position: "absolute", left: 0, top: 0 }}>
                {w > 0 && <rect x={x + 2} y={8} width={w - 4} height={ROW_HEIGHT - 16} rx={6} ry={6} fill="#3b82f6" />}
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Gantt component
export default function Gantt60DayPOC() {
  const [allTasks] = useState(() => makeDemoTasks());
  const [windowStart, setWindowStart] = useState(() => startOfDay(new Date()));
  const windowEnd = useMemo(() => addDays(windowStart, WINDOW_DAYS), [windowStart]);
  const totalWidth = WINDOW_DAYS * COL_WIDTH;

  const rowsScrollRef = useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer({
    count: allTasks.length,
    getScrollElement: () => rowsScrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 6,
  });

  const totalHeight = rowVirtualizer.getTotalSize();
  const virtualItems = rowVirtualizer.getVirtualItems();

  const shiftWindow = (days: number) => setWindowStart((s) => addDays(s, days));

  return (
    <div style={styles.appRoot}>
      <TopNavigation windowStart={windowStart} shiftWindow={shiftWindow} setWindowStart={setWindowStart} />
      <div style={styles.bodyScroll} ref={rowsScrollRef}>
        <TaskList tasks={allTasks} virtualItems={virtualItems} totalHeight={totalHeight} />
        <TaskBarsAndCalendar tasks={allTasks} virtualItems={virtualItems} totalWidth={totalWidth} totalHeight={totalHeight} windowStart={windowStart} windowEnd={windowEnd} />
      </div>
    </div>
  );
}

// Inline styles
const styles: Record<string, React.CSSProperties> = {
  appRoot: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    fontFamily: "Inter, ui-sans-serif, system-ui",
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
  bodyScroll: {
    display: "flex",
    overflow: "auto",
    height: "calc(100% - 48px)",
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
  rightBodyScroll: {
    overflowX: "auto",
    overflowY: "hidden",
  },
};
