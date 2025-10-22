import React from "react";
import { fmtDay } from "../utils/dateHelpers";
import { COL_WIDTH, WINDOW_DAYS } from "../utils/constants";

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
        zIndex: 1,
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