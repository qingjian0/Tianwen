/**
 * Theme Store - 主题状态
 */

import { create } from 'zustand';

type ThemeMode = 'dark' | 'light';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'dark',
  setMode: (mode) => set({ mode }),
  toggleMode: () => set({ mode: get().mode === 'dark' ? 'light' : 'dark' }),
}));
