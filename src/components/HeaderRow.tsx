import React, { RefObject } from "react";
import { GanttHeader } from "./GanttHeader";
import { LEFT_COL_WIDTH, COL_WIDTH, WINDOW_DAYS } from "../utils/constants";

interface HeaderRowProps {
  windowStart: Date;
  totalWidth: number;
}

export const HeaderRow: React.FC<HeaderRowProps> = ({ windowStart, totalWidth }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${LEFT_COL_WIDTH}px auto`,
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "white",
      }}
    >
      {/* Task Header */}
      <div style={{ borderRight: "1px solid #e5e7eb", padding: "8px" }}>Task</div>

      {/* Days Header */}
      <div style={{ overflowX: "auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${WINDOW_DAYS}, ${COL_WIDTH}px)`,
          }}
        >
          <GanttHeader windowStart={windowStart} />
        </div>
      </div>
    </div>
  );
};