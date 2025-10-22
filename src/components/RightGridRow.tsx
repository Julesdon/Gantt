import React from "react";
import { Task } from "../Gantt";

const RightGridRow = ({ task, computeBar, totalWidth, rowHeight }: {
  task: Task;
  computeBar: (task: Task) => { x: number; w: number };
  totalWidth: number;
  rowHeight: number;
}) => {
  const { x, w } = computeBar(task);
  return (
    <div style={{ position: "relative", width: totalWidth, height: rowHeight }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(90deg, #fafafa, #fafafa ${32 - 1}px, #eee ${32 - 1}px, #eee ${32}px)`,
        }}
      />
      <svg width={totalWidth} height={rowHeight} style={{ position: "absolute", left: 0, top: 0 }}>
        {w > 0 && (
          <g>
            <rect x={x + 2} y={8} width={w - 4} height={rowHeight - 16} rx={6} ry={6} fill="#3b82f6" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default RightGridRow;