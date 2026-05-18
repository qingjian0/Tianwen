/**
 * Timeline Store - 时间轴状态
 */

import { create } from 'zustand';

interface TimelineEvent {
  id: string;
  timestamp: Date;
  title: string;
  description?: string;
  type: 'prediction' | 'milestone' | 'note';
}

interface TimelineState {
  events: TimelineEvent[];
  addEvent: (event: TimelineEvent) => void;
  removeEvent: (id: string) => void;
  clearEvents: () => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  events: [],
  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
  removeEvent: (id) => set((state) => ({ 
    events: state.events.filter((e) => e.id !== id) 
  })),
  clearEvents: () => set({ events: [] }),
}));
