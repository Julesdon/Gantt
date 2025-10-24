import React from "react";
import { COL_WIDTH, ROW_HEIGHT } from "../utils/constants";
import type { Task } from "../utils/taskGenerator";

interface TaskRowProps {
  task: Task;
  windowStart: Date;
  windowEnd: Date;
  rowIndex: number;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, windowStart, windowEnd, rowIndex }) => {
  const taskStartOffset = Math.max(0, (task.start.getTime() - windowStart.getTime()) / 86400000);
  const taskEndOffset = Math.min(
    (task.end.getTime() - windowStart.getTime()) / 86400000,
    (windowEnd.getTime() - windowStart.getTime()) / 86400000
  );

  const taskWidth = Math.max(0, taskEndOffset - taskStartOffset) * COL_WIDTH;
  const taskLeft = taskStartOffset * COL_WIDTH;

  return (
    <rect
      x={taskLeft}
      y={rowIndex * ROW_HEIGHT + (ROW_HEIGHT - 16) / 2} // Simplified vertical centering
      width={taskWidth}
      height={16} // Task bar height
      fill="#007bff"
      rx={4} // Rounded corners
    />
  );
};