import { create } from 'zustand';
import type { ViewMode } from '@dtea/three-engine';

/** View slice — mode presets (ADR-010), Esploso level, Ciclo state (ADR-011). */
interface ViewState {
  mode: ViewMode;
  explodeLevel: number; // 0–1
  crankAngle: number; // 0–720°
  crankRunning: boolean;
  setMode: (mode: ViewMode) => void;
  setExplodeLevel: (explodeLevel: number) => void;
  setCrankAngle: (crankAngle: number) => void;
  setCrankRunning: (crankRunning: boolean) => void;
}

export const useView = create<ViewState>((set) => ({
  mode: 'studio',
  explodeLevel: 0,
  crankAngle: 0,
  crankRunning: false,
  setMode: (mode) => set({ mode }),
  setExplodeLevel: (explodeLevel) => set({ explodeLevel }),
  setCrankAngle: (crankAngle) => set({ crankAngle }),
  setCrankRunning: (crankRunning) => set({ crankRunning }),
}));
