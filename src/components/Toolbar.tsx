import React from "react";
import { fmtDay, addDays, startOfDay } from "../utils/dateHelpers";

interface ToolbarProps {
  windowStart: Date;
  shiftWindow: (days: number) => void;
  setWindowStart: (date: Date) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ windowStart, shiftWindow, setWindowStart }) => {
  const onPickDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // yyyy-mm-dd
    if (!val) return;
    const [y, m, d] = val.split("-").map(Number);
    setWindowStart(new Date(y, (m || 1) - 1, d || 1));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 8, background: "#f9fafb" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => shiftWindow(-60)}>◀︎ 60d</button>
        <button onClick={() => shiftWindow(-7)}>◀︎ 7d</button>
        <button onClick={() => setWindowStart(startOfDay(new Date()))}>Today</button>
        <button onClick={() => shiftWindow(7)}>7d ▶︎</button>
        <button onClick={() => shiftWindow(60)}>60d ▶︎</button>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label>Start date</label>
        <input type="date" value={windowStart.toISOString().split("T")[0]} onChange={onPickDate} />
        <span>
          Window: {fmtDay(windowStart)} → {fmtDay(addDays(windowStart, 59))}
        </span>
      </div>
    </div>
  );
};