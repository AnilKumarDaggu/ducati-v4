import { create } from 'zustand';
import type { ScenePart } from '@dtea/three-engine';

/**
 * Selection slice (ARCH-002 §2): the single seam between the 3D layer and UI.
 * Holds the selected/hovered ids, the loaded scene's part list (drives the
 * navigator for native models), and the load progress for the loading screen.
 */
interface SelectionState {
  selectedId: string | null;
  selectedLabel: string | null;
  hoveredId: string | null;
  parts: ScenePart[];
  loadProgress: number; // 0–1
  setSelected: (id: string | null, label?: string | null) => void;
  setHovered: (id: string | null) => void;
  setParts: (parts: ScenePart[]) => void;
  setLoadProgress: (p: number) => void;
}

export const useSelection = create<SelectionState>((set) => ({
  selectedId: null,
  selectedLabel: null,
  hoveredId: null,
  parts: [],
  loadProgress: 0,
  setSelected: (selectedId, selectedLabel = null) => set({ selectedId, selectedLabel }),
  setHovered: (hoveredId) => set({ hoveredId }),
  setParts: (parts) => set({ parts }),
  setLoadProgress: (loadProgress) => set({ loadProgress }),
}));
