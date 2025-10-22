import { addDays, startOfDay } from "./dateHelpers";

export type Task = {
  id: number;
  name: string;
  start: Date; // inclusive
  end: Date;   // exclusive
};

export function makeDemoTasks(count = 1500, anchor = startOfDay(new Date())): Task[] {
  const tasks: Task[] = [];
  for (let i = 0; i < count; i++) {
    const jitter = Math.floor(Math.random() * 240) - 120; // +/- 120 days around anchor
    const duration = Math.max(1, Math.floor(Math.random() * 20));
    const s = addDays(anchor, jitter);
    const e = addDays(s, duration);
    tasks.push({ id: i + 1, name: `Task ${i + 1}`, start: s, end: e });
  }
  return tasks;
}