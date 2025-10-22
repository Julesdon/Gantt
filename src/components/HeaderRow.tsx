import React, { RefObject } from "react";
import { GanttHeader } from "./GanttHeader";
import { LEFT_COL_WIDTH } from "../utils/constants";

interface HeaderRowProps {
  windowStart: Date;
  rightHeaderScrollRef: RefObject<HTMLDivElement>;
  totalWidth: number;
}

export const HeaderRow: React.FC<HeaderRowProps> = ({ windowStart, rightHeaderScrollRef, totalWidth }) => {
  return (
    <div style={{ display: "flex", position: "sticky", top: 0, zIndex: 10, background: "white" }}>
      <div style={{ width: LEFT_COL_WIDTH, borderRight: "1px solid #e5e7eb", padding: "8px" }}>Task</div>
      <div
        ref={rightHeaderScrollRef}
        style={{ flex: 1, overflowX: "auto", pointerEvents: "none" }}
      >
        <div style={{ width: totalWidth }}>
          <GanttHeader windowStart={windowStart} />
        </div>
      </div>
    </div>
  );
};