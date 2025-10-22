import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Task } from "../utils/taskGenerator";
import { ROW_HEIGHT } from "../utils/constants";
import { TaskRow } from "./TaskRow";

interface GanttBodyProps {
  tasks: Task[];
  windowStart: Date;
  windowEnd: Date;
}

export const GanttBody: React.FC<GanttBodyProps> = ({ tasks, windowStart, windowEnd }) => {
  const rowsScrollRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => rowsScrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 6,
  });

  return (
    <div ref={rowsScrollRef} style={{ overflowY: "auto", height: "calc(100vh - 100px)" }}>
      <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const task = tasks[virtualRow.index];
          return (
            <div
              key={task.id}
              ref={(el) => {
                if (el) {
                  const height = el.offsetHeight || ROW_HEIGHT;
                  rowVirtualizer.measureElement(el);
                }
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <TaskRow task={task} windowStart={windowStart} windowEnd={windowEnd} />
            </div>
          );
        })}
      </div>
    </div>
  );
};