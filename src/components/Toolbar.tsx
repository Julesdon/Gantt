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
        className="inline-flex border font-medium font-sans text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm rounded-md py-2 px-4 bg-transparent border-transparent text-slate-800 hover:bg-slate-800/5 hover:border-slate-800/5 shadow-none hover:shadow-none"
      >
        -
      </button>
      <button
        onClick={() => setWindowStart(startOfDay(new Date()))}
        className="inline-flex border font-medium font-sans text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm rounded-md py-2 px-4 bg-transparent border-transparent text-slate-800 hover:bg-slate-800/5 hover:border-slate-800/5 shadow-none hover:shadow-none"
      >
        Today
      </button>
      <button
        onClick={() => shiftWindow(7)}
        className="inline-flex border font-medium font-sans text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm rounded-md py-2 px-4 bg-transparent border-transparent text-slate-800 hover:bg-slate-800/5 hover:border-slate-800/5 shadow-none hover:shadow-none"
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