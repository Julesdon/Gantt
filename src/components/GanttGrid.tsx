import type { RefObject } from "react";
import React from "react";
import { COL_WIDTH, LEFT_COL_WIDTH, ROW_HEIGHT, WINDOW_DAYS } from "../utils/constants";
import { addDays } from "../utils/dateHelpers";
import type { Task } from "../utils/taskGenerator";
import { TaskRow } from "./TaskRow";

interface GanttGridProps {
  tasks: Task[];
  windowStart: Date;
  rowsScrollRef: RefObject<HTMLDivElement>;
}

export const GanttGrid: React.FC<GanttGridProps> = ({ tasks, windowStart, rowsScrollRef }) => {
  const days = Array.from({ length: WINDOW_DAYS }, (_, i) => addDays(windowStart, i));

  return (
    <div style={{ display: "grid", gridTemplateColumns: `${LEFT_COL_WIDTH}px auto`, flex: 1 }}>
      {/* Task Names */}
      <div
        style={{
          position: "sticky",
          left: 0,
          zIndex: 2,
          background: "white",
          borderRight: "1px solid #e5e7eb",
        }}
      >
        <div style={{ height: ROW_HEIGHT * tasks.length, position: "relative" }}>
          {tasks.map((task, index) => (
            <div
              key={task.id}
              style={{
                height: ROW_HEIGHT,
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                borderBottom: "1px solid #f3f4f6",
                background: index % 2 === 0 ? "#ffffff" : "#fcfcfc",
              }}
            >
              {task.name}
            </div>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      <div ref={rowsScrollRef} style={{ overflowX: "auto" }}>
        <svg
          style={{ display: "block" }}
          width={WINDOW_DAYS * COL_WIDTH}
          height={ROW_HEIGHT * tasks.length}
        >
          {/* Grid Lines */}
          {days.map((_, dayIndex) => (
            <line
              key={`day-${dayIndex}`}
              x1={dayIndex * COL_WIDTH}
              y1={0}
              x2={dayIndex * COL_WIDTH}
              y2={ROW_HEIGHT * tasks.length}
              stroke="#e5e7eb"
            />
          ))}
          {tasks.map((_, taskIndex) => (
            <line
              key={`task-${taskIndex}`}
              x1={0}
              y1={taskIndex * ROW_HEIGHT}
              x2={WINDOW_DAYS * COL_WIDTH}
              y2={taskIndex * ROW_HEIGHT}
              stroke="#e5e7eb"
            />
          ))}

          {/* Task Bars */}
          {tasks.map((task, taskIndex) => (
            <TaskRow
              key={task.id}
              task={task}
              windowStart={windowStart}
              windowEnd={addDays(windowStart, WINDOW_DAYS)}
              rowIndex={taskIndex}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};