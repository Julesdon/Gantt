export type ID = string | number;

export type ViewMode = 'day' | 'week' | 'month' | 'quarter';

export interface Task {
  id: ID;
  name: string;
  start: string; // ISO date
  end: string; // ISO date
  progress?: number; // 0-100
  dependencies?: ID[];
  row?: number; // row index
}

export interface Link {
  id: ID;
  from: ID;
  to: ID;
  type?: 'FS' | 'SS' | 'FF' | 'SF';
}

export interface CalendarScale {
  viewMode: ViewMode;
}
