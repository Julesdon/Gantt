import React from "react";
import { GanttHeader } from "./GanttHeader";
import { LEFT_COL_WIDTH, COL_WIDTH, WINDOW_DAYS } from "../utils/constants";

/**
 * HeaderRow Component
 * -------------------
 * This component renders the header section of the Gantt chart.
 * It includes:
 * - A fixed left column for the "Task" label.
 * - A scrollable right section for the calendar header, displaying days.
 */
interface HeaderRowProps {
  windowStart: Date; // The start date of the visible window.
}

export const HeaderRow: React.FC<HeaderRowProps> = ({ windowStart }) => {
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
      {/* Left Column: Task Label */}
      <div style={{ borderRight: "1px solid #e5e7eb", padding: "8px" }}>Task</div>

      {/* Right Column: Calendar Header */}
      <div style={{ overflow: "hidden" }}>
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