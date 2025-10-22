// App.tsx
import React, { useRef, useState } from "react";
import { Toolbar } from "./components/Toolbar";
import { HeaderRow } from "./components/HeaderRow";
import { GanttGrid } from "./components/GanttGrid";
import { makeDemoTasks } from "./utils/taskGenerator";
import { startOfDay, addDays } from "./utils/dateHelpers";
import { WINDOW_DAYS } from "./utils/constants";

function App() {
  const [windowStart, setWindowStart] = useState(() => startOfDay(new Date()));
  const rowsScrollRef = useRef<HTMLDivElement | null>(null);
  const tasks = makeDemoTasks();

  const shiftWindow = (days: number) => setWindowStart((prev) => addDays(prev, days));

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
      {/* Toolbar */}
      <Toolbar windowStart={windowStart} shiftWindow={shiftWindow} setWindowStart={setWindowStart} />

      {/* Header Row */}
      <HeaderRow windowStart={windowStart} totalWidth={WINDOW_DAYS * 32} />

      {/* Gantt Grid */}
      <GanttGrid tasks={tasks} windowStart={windowStart} rowsScrollRef={rowsScrollRef} />
    </div>
  );
}

export default App;
