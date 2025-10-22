import React from "react";
import { fmtDay, addDays, startOfDay, toDateInputValue } from "../utils/dateHelpers";

const Toolbar = ({
  windowStart,
  shiftWindow,
  setWindowStart,
  windowDays,
}: {
  windowStart: Date;
  shiftWindow: (days: number) => void;
  setWindowStart: (date: Date) => void;
  windowDays: number;
}) => {
  const onPickDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // yyyy-mm-dd
    if (!val) return;
    const [y, m, d] = val.split("-").map(Number);
    setWindowStart(new Date(y, (m || 1) - 1, d || 1));
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid #e5e7eb" }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => shiftWindow(-60)}>◀︎ 60d</button>
        <button onClick={() => shiftWindow(-7)}>◀︎ 7d</button>
        <button onClick={() => setWindowStart(startOfDay(new Date()))}>Today</button>
        <button onClick={() => shiftWindow(7)}>7d ▶︎</button>
        <button onClick={() => shiftWindow(60)}>60d ▶︎</button>
      </div>
      <div>
        <input
          type="date"
          value={toDateInputValue(windowStart)} // Use the correct formatting function
          onChange={onPickDate}
        />
        <span>
          Window: {fmtDay(windowStart)} → {fmtDay(addDays(windowStart, windowDays - 1))}
        </span>
      </div>
    </div>
  );
};

export default Toolbar;