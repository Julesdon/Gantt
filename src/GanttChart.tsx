import { useEffect, useMemo, useRef, useState } from 'react';
import mockTasksData from './data/mockTasks.json';
import TaskLinks from './TaskLinks';

interface TaskJson {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  dependencies: number[];
}

type Task = {
  id: number;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies: number[];
};

const transformTasks = (jsonTasks: TaskJson[]): Task[] =>
  jsonTasks.map(t => ({
    id: t.id,
    name: t.name,
    start: new Date(t.startDate),
    end: new Date(t.endDate),
    progress: Math.floor(Math.random() * 100),
    dependencies: t.dependencies,
  }));

const ROW_HEIGHT = 50;
const LEFT_WIDTH = 700;

const GanttChart = () => {
  const [tasks] = useState<Task[]>(() => transformTasks(mockTasksData));

  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  // --- Scroll Synchronization ---
  useEffect(() => {
    const left = leftScrollRef.current;
    const right = rightScrollRef.current;
    if (!left || !right) return;

    let syncingLeft = false;
    let syncingRight = false;
    let animationFrameId: number | null = null;

    const handleLeftScroll = () => {
      if (syncingRight) return;
      syncingLeft = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        right.scrollTop = left.scrollTop;
        syncingLeft = false;
      });
    };

    const handleRightScroll = () => {
      if (syncingLeft) return;
      syncingRight = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        left.scrollTop = right.scrollTop;
        syncingRight = false;
      });
    };

    left.addEventListener('scroll', handleLeftScroll);
    right.addEventListener('scroll', handleRightScroll);

    return () => {
      left.removeEventListener('scroll', handleLeftScroll);
      right.removeEventListener('scroll', handleRightScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --- Timeline setup ---
  const allStart = tasks.map(t => t.start.getTime());
  const allEnd = tasks.map(t => t.end.getTime());
  const minDate = new Date(Math.min(...allStart));
  const maxDate = new Date(Math.max(...allEnd));

  const timelineStart = new Date(minDate);
  timelineStart.setDate(timelineStart.getDate() - 7);
  const timelineEnd = new Date(maxDate);
  timelineEnd.setDate(timelineEnd.getDate() + 7);

  const totalDays = Math.ceil(
    (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  const [dayWidth, setDayWidth] = useState(10);
  useEffect(() => {
    const el = rightScrollRef.current;
    if (!el) return;

    const updateWidth = () => {
      const usable = el.clientWidth - 8;
      setDayWidth(Math.max(1, Math.floor(usable / totalDays)));
    };

    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    window.addEventListener('resize', updateWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, [totalDays]);

  // --- Month headers ---
  const months = useMemo(() => {
    const arr: { label: string; days: number }[] = [];
    let cur = new Date(timelineStart.getFullYear(), timelineStart.getMonth(), 1);
    const end = new Date(timelineEnd.getFullYear(), timelineEnd.getMonth(), 1);
    end.setMonth(end.getMonth() + 1);
    while (cur < end) {
      const monthStart = new Date(cur.getFullYear(), cur.getMonth(), 1);
      const monthEnd = new Date(cur.getFullYear(), cur.getMonth() + 1, 0);
      const startClamped = new Date(Math.max(monthStart.getTime(), timelineStart.getTime()));
      const endClamped = new Date(Math.min(monthEnd.getTime(), timelineEnd.getTime()));
      const days = Math.ceil((endClamped.getTime() - startClamped.getTime() + 1) / 86400000);
      arr.push({
        label: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        days,
      });
      cur.setMonth(cur.getMonth() + 1);
    }
    return arr;
  }, [timelineStart, timelineEnd]);

  // --- Bars ---
  const bars = useMemo(() => {
    return tasks.map(t => {
      const startOffset = Math.max(0, (t.start.getTime() - timelineStart.getTime()) / 86400000);
      const duration = Math.max(1, (t.end.getTime() - t.start.getTime()) / 86400000);
      return {
        left: startOffset * dayWidth,
        width: duration * dayWidth,
      };
    });
  }, [tasks, timelineStart, dayWidth]);

  const totalHeight = tasks.length * ROW_HEIGHT;

  // --- Visible task detection ---
  const [visibleTaskIds, setVisibleTaskIds] = useState<Set<number>>(new Set());
  useEffect(() => {
    const right = rightScrollRef.current;
    if (!right) return;

    const updateVisible = () => {
      const top = right.scrollTop;
      const bottom = top + right.clientHeight;
      const ids = new Set<number>();
      tasks.forEach((t, i) => {
        const yTop = i * ROW_HEIGHT;
        const yBottom = yTop + ROW_HEIGHT;
        if (yBottom > top && yTop < bottom) ids.add(t.id);
      });
      setVisibleTaskIds(ids);
    };

    right.addEventListener('scroll', updateVisible);
    updateVisible();
    return () => right.removeEventListener('scroll', updateVisible);
  }, [tasks]);

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex bg-white border-b border-gray-200 shadow-sm">
        <div className="border-r border-gray-200 px-4 py-3" style={{ width: LEFT_WIDTH }}>
          <div className="flex gap-3 font-semibold text-sm text-gray-700">
            <span className="w-16">ID</span>
            <span className="flex-1 min-w-[360px]">Task Name</span>
            <span className="w-32">Start</span>
            <span className="w-32">End</span>
          </div>
        </div>
        <div className="flex-1 px-1 py-3">
          <div className="flex">
            {months.map((m, idx) => (
              <div
                key={idx}
                className="text-center text-sm font-semibold text-gray-700 bg-gray-50 border-r border-gray-200"
                style={{ width: m.days * dayWidth }}
              >
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Pane (scrollable) */}
        <div
          ref={leftScrollRef}
          className="bg-white border-r border-gray-200 overflow-y-scroll"
          style={{ width: LEFT_WIDTH }}
        >
          {tasks.map(t => (
            <div
              key={t.id}
              className="flex items-center h-[50px] px-4 gap-3 border-b border-gray-200"
            >
              <span className="w-16 text-xs text-gray-600">{t.id}</span>
              <div className="flex-1 min-w-[360px] text-sm truncate">{t.name}</div>
              <span className="w-32 text-xs text-gray-600">{t.start.toLocaleDateString()}</span>
              <span className="w-32 text-xs text-gray-600">{t.end.toLocaleDateString()}</span>
            </div>
          ))}
        </div>

        {/* Right Pane (scrollable) */}
        <div ref={rightScrollRef} className="flex-1 bg-gray-50 overflow-y-scroll relative">
          <div className="relative" style={{ height: totalHeight }}>
            {/* Month grid lines */}
            {months.map((_, i) => {
              const left = months.slice(0, i).reduce((sum, m) => sum + m.days * dayWidth, 0);
              return (
                <div
                  key={`grid-${i}`}
                  className="absolute top-0 border-l border-gray-300"
                  style={{ left, height: totalHeight }}
                />
              );
            })}

            {/* Bars */}
            {tasks.map((t, i) => {
              const bar = bars[i];
              return (
                <div
                  key={`bar-${t.id}`}
                  className="absolute left-0 right-0 border-b border-gray-200"
                  style={{ top: i * ROW_HEIGHT, height: ROW_HEIGHT }}
                >
                  <div
                    className="absolute h-6 bg-blue-500 rounded shadow-sm text-white text-xs flex items-center"
                    style={{
                      left: bar.left,
                      width: bar.width,
                      top: 12,
                      minWidth: 20,
                    }}
                  >
                    <div
                      className="absolute left-0 top-0 h-full bg-blue-700 rounded-l"
                      style={{ width: `${t.progress}%` }}
                    />
                    <span className="relative z-10 px-2 whitespace-nowrap">{t.progress}%</span>
                  </div>
                </div>
              );
            })}

            {/* Task links overlay */}
            <TaskLinks
              tasks={tasks.map((t, i) => ({
                id: t.id,
                dependencies: t.dependencies,
                left: bars[i].left,
                top: i * ROW_HEIGHT,
                width: bars[i].width,
                height: ROW_HEIGHT,
              }))}
              visibleTaskIds={visibleTaskIds}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 text-sm text-gray-600">
        {tasks.length.toLocaleString()} tasks • Both panes scrollable and synced vertically.
      </div>
    </div>
  );
};

export default GanttChart;
