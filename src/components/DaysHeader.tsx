import React from "react";
import { addDays, fmtDay } from "../utils/dateHelpers";
import { HEADER_HEIGHT } from "../constants";

const DaysHeader = ({ windowStart, totalWidth, colWidth, windowDays }: {
  windowStart: Date;
  totalWidth: number;
  colWidth: number;
  windowDays: number;
}) => {
  const days = [] as JSX.Element[];
  for (let i = 0; i < windowDays; i++) {
    const d = addDays(windowStart, i);
    days.push(
      <div
        key={i}
        style={{
          width: colWidth,
          minWidth: colWidth,
          maxWidth: colWidth,
          height: HEADER_HEIGHT,
          boxSizing: "border-box",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: "#111827",
          flexShrink: 0,
        }}
      >
        {fmtDay(d)}
      </div>
    );
  }
  return (
    <div
      style={{
        position: "relative",
        width: totalWidth,
        height: HEADER_HEIGHT,
        display: "flex",
        alignItems: "stretch",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", height: "100%" }}>{days}</div>
    </div>
  );
};

export default DaysHeader;