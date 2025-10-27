import { useVirtualizer } from "@tanstack/react-virtual";
import React, { type RefObject } from "react";
import { LEFT_COL_WIDTH, ROW_HEIGHT } from "../utils/constants";
import type { Task } from "../utils/taskGenerator";

interface TaskListProps {
  tasks: Task[];
  rowsScrollRef: RefObject<HTMLDivElement>;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, rowsScrollRef }) => {
  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => rowsScrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 6,
  });

  const totalHeight = rowVirtualizer.getTotalSize();
  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <div
        style={{
          width: LEFT_COL_WIDTH,
          position: "sticky",
          left: 0,
          zIndex: 2,
          background: "rgb(179, 190, 211)",
          borderRight: "1px solidrgb(119, 133, 161)",
        }}
      >
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
                  fontSize: 13,
                  color: "#111827",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={`${task.name}`}
              >
                {task.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};