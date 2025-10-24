// App.tsx
import type { RefObject } from "react";
import { useRef, useState } from "react";
import { GanttGrid } from "./components/GanttGrid";
import { HeaderRow } from "./components/HeaderRow";
import { Toolbar } from "./components/Toolbar";
import { WINDOW_DAYS } from "./utils/constants";
import { addDays, startOfDay } from "./utils/dateHelpers";
import { makeDemoTasks } from "./utils/taskGenerator";

import type { Task } from "./utils/taskGenerator";

interface GanttGridProps {
  tasks: Task[];
  windowStart: Date;
  rowsScrollRef: RefObject<HTMLDivElement>;
}

function App() {
  const [windowStart, setWindowStart] = useState(() => startOfDay(new Date()));
  const rowsScrollRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
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
