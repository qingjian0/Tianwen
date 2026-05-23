/**
 * Prediction Store - 推演状态
 */

import { create } from "zustand";
import type { PredictionResult, PredictionInput } from "@tianwen/shared";

interface PredictionState {
  history: PredictionResult[];
  current: PredictionResult | null;
  loading: boolean;
  error: string | null;

  setCurrent: (result: PredictionResult | null) => void;
  addToHistory: (result: PredictionResult) => void;
  clearHistory: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePredictionStore = create<PredictionState>((set) => ({
  history: [],
  current: null,
  loading: false,
  error: null,

  setCurrent: (current) => set({ current }),
  addToHistory: (result) =>
    set((state) => ({
      history: [result, ...state.history.slice(0, 49)], // 最多50条
    })),
  clearHistory: () => set({ history: [] }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
