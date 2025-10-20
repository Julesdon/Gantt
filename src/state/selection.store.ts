import { create } from 'zustand';

type SelectionState = {
  hoveredTaskId: string | null;
  focusedTaskId: string | null;
  setHovered: (id: string | null) => void;
  setFocused: (id: string | null) => void;
};

export const useSelectionStore = create<SelectionState>((set: any) => ({
  hoveredTaskId: null,
  focusedTaskId: null,
  setHovered: (id: string | null) => set(() => ({ hoveredTaskId: id })),
  setFocused: (id: string | null) => set(() => ({ focusedTaskId: id })),
}));
