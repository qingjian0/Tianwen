/**
 * UI Store - 界面状态
 */

import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  currentView: "home" | "prediction" | "timeline" | "settings";
  loading: boolean;

  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: UIState["currentView"]) => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  currentView: "home",
  loading: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentView: (view) => set({ currentView: view }),
  setLoading: (loading) => set({ loading }),
}));
