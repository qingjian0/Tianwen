/**
 * Event Bus - 类型定义
 */

export interface Event {
  id: string;
  type: string;
  timestamp: number;
  payload: any;
  metadata?: Record<string, any>;
}

export type EventHandler = (event: Event) => void | Promise<void>;

export interface EventHandlerOptions {
  priority?: number;
  once?: boolean;
  filter?: (event: Event) => boolean;
}

export interface ListenerSubscription {
  unsubscribe: () => void;
}
