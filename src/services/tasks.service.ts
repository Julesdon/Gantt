import type { Task } from '../types/domain';

export function normalizeTasks(tasks: Task[]) {
  return tasks.map((t, i) => ({
    ...t,
    id: t.id ?? i,
    start: new Date(t.start).toISOString(),
    end: new Date(t.end).toISOString(),
    row: t.row ?? i,
  }));
}
