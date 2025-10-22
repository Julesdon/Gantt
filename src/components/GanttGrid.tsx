import React, { RefObject } from "react";
import { Task } from "../utils/taskGenerator";
import { TaskRow } from "./TaskRow";
import { ROW_HEIGHT, COL_WIDTH, WINDOW_DAYS } from "../utils/constants";
import { addDays } from "../utils/dateHelpers";

interface GanttGridProps {
  tasks: Task[];
  windowStart: Date;
  rowsScrollRef: RefObject<HTMLDivElement>;
}

export const GanttGrid: React.FC<GanttGridProps> = ({ tasks, windowStart, rowsScrollRef }) => {
  const days = Array.from({ length: WINDOW_DAYS }, (_, i) => addDays(windowStart, i));

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Days Header */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${WINDOW_DAYS}, ${COL_WIDTH}px)` }}>
        {days.map((day, index) => (
          <div
            key={index}
            style={{
              width: COL_WIDTH,
              height: ROW_HEIGHT,
              borderRight: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#111827",
            }}
          >
            {day.toLocaleDateString(undefined, { day: "2-digit", month: "short" })}
          </div>
        ))}
      </div>

      {/* Task Rows */}
      <div ref={rowsScrollRef} style={{ overflowY: "auto", flex: 1 }}>
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} windowStart={windowStart} windowEnd={addDays(windowStart, WINDOW_DAYS)} />
        ))}
      </div>
    </div>
  );
};