import React from "react";
import { COL_WIDTH, WINDOW_DAYS } from "../utils/constants";
import { fmtDay } from "../utils/dateHelpers";

interface GanttHeaderProps {
  windowStart: Date;
}

export const GanttHeader: React.FC<GanttHeaderProps> = ({ windowStart }) => {
  const days = Array.from({ length: WINDOW_DAYS }, (_, i) => new Date(windowStart.getTime() + i * 86400000));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${WINDOW_DAYS}, ${COL_WIDTH}px)`,
        position: "sticky",
        top: 0,
        background: "white",
        zIndex: 1
        // Removed width and overflow styles to restore all cells
      }}
    >
      {days.map((day, index) => (
        <div key={index} style={{ textAlign: "center", border: "1px solid #ddd" }}>
          {fmtDay(day)}
        </div>
      ))}
    </div>
  );
};