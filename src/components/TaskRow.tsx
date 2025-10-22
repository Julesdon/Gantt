import React from "react";
import { Task } from "../utils/taskGenerator";
import { COL_WIDTH, LEFT_COL_WIDTH } from "../utils/constants";

interface TaskRowProps {
  task: Task;
  windowStart: Date;
  windowEnd: Date;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, windowStart, windowEnd }) => {
  const taskStartOffset = Math.max(0, (task.start.getTime() - windowStart.getTime()) / 86400000);
  const taskEndOffset = Math.min(
    (task.end.getTime() - windowStart.getTime()) / 86400000,
    (windowEnd.getTime() - windowStart.getTime()) / 86400000
  );

  const taskWidth = Math.max(0, taskEndOffset - taskStartOffset) * COL_WIDTH;
  const taskLeft = taskStartOffset * COL_WIDTH;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ width: LEFT_COL_WIDTH, padding: "0 8px", border: "1px solid #ddd" }}>{task.name}</div>
      <div style={{ position: "relative", flex: 1, height: "100%" }}>
        <div
          style={{
            position: "absolute",
            left: taskLeft,
            width: taskWidth,
            height: "50%",
            backgroundColor: "#007bff",
            borderRadius: "4px",
          }}
        />
      </div>
    </div>
  );
};