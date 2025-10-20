import type { Task } from '../types/domain';

export function mapTasksToRows(tasks: Task[]) {
  // simple mapping: group by row property
  const rows: Record<number, Task[]> = {};
  tasks.forEach((t) => {
    const r = t.row ?? 0;
    if (!rows[r]) rows[r] = [];
    rows[r].push(t);
  });
  return rows;
}
