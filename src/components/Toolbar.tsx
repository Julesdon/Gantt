import React from "react";
import { addDays, fmtDay, startOfDay } from "../utils/dateHelpers";

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
    <div className="flex gap-8 items-center p-2 bg-gray-50">
      <button
        onClick={() => shiftWindow(-7)}
        className="w-8 h-8 rounded-full bg-blue-500 hover:bg-red-500 text-white font-bold border-2 border-black focus:outline-none"
      >
        -
      </button>
      <button
        onClick={() => setWindowStart(startOfDay(new Date()))}
        className="px-4 py-2 rounded bg-green-500 hover:bg-red-500 text-white font-bold border-2 border-black focus:outline-none"
      >
        Today
      </button>
      <button
        onClick={() => shiftWindow(7)}
        className="w-8 h-8 rounded-full bg-blue-500 hover:bg-red-500 text-white font-bold border-2 border-black focus:outline-none"
      >
        +
      </button>
      <label>Start date</label>
      <input
        type="date"
        value={windowStart.toISOString().split("T")[0]}
        onChange={onPickDate}
        className="border rounded px-2 py-1 appearance-none focus:outline-none"
      />
      <span>
        Window: {fmtDay(windowStart)} → {fmtDay(addDays(windowStart, 59))}
      </span>
    </div>
  );
};