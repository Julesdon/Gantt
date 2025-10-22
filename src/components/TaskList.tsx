import React from "react";
import { Task } from "../Gantt";
import { fmtDay, addDays } from "../utils/dateHelpers";

const TaskList = ({ virtualItems, allTasks, rowHeight }: {
  virtualItems: any[];
  allTasks: Task[];
  rowHeight: number;
}) => {
  return (
    <div style={{ height: virtualItems.length * rowHeight, position: "relative" }}>
      {virtualItems.map((vi) => {
        const task = allTasks[vi.index];
        return (
          <div
            key={vi.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: rowHeight,
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
  );
};

export default TaskList;