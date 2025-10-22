// Date helper functions
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const diffInDays = (a: Date, b: Date) => {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.round(ms / 86400000);
};

export const fmtDay = (d: Date) => d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });

export const toDateInputValue = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; // Correct format for <input type="date">
};