import type { Task } from '../types/domain';

export type Bar = {
  id: string | number;
  x: number;
  y: number;
  width: number;
  height: number;
  task: Task;
};

export class BarsController {
  tasks: Task[];
  rowHeight: number;
  columnWidth: number;

  constructor(tasks: Task[], rowHeight = 32, columnWidth = 40) {
    this.tasks = tasks;
    this.rowHeight = rowHeight;
    this.columnWidth = columnWidth;
  }

  computeBars() {
    return this.tasks.map((t, i) => {
      const start = new Date(t.start).getTime();
      const end = new Date(t.end).getTime();
      const days = Math.max(1, Math.round((end - start) / 86400000));
      const x = i * 10; // placeholder mapping
      const y = (t.row ?? i) * this.rowHeight;
      return {
        id: t.id,
        x,
        y,
        width: days * this.columnWidth,
        height: this.rowHeight - 6,
        task: t,
      } as Bar;
    });
  }
}
