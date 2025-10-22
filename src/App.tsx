// App.tsx
import React, { useMemo } from "react";
import Gantt60DayPOC from "./Gantt";

function App() {
  const memoizedGantt = useMemo(() => {
    return <Gantt60DayPOC key="gantt" />; // Add stable key prop
  }, []); // Memoize the Gantt component

  const containerStyle = useMemo(() => ({
    height: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0,
    overflow: "hidden",
  }), []); // Memoize the container style

  return (
    <div style={containerStyle}>
      {memoizedGantt}
    </div>
  );
}

export default React.memo(App);
