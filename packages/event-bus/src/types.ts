/**
 * Event Bus - 类型定义
 * Phase 8: Runtime Engine
 */

export interface Event {
  id: string;
  type: string;
  timestamp: number;
  payload: any;
  metadata?: Record<string, any>;
}

export type EventHandler = (event: Event) => void | Promise<void>;

export type EventHandlerOptions = {
  once?: boolean;
  priority?: number;
  filter?: (event: Event) => boolean;
};

export interface EventBusConfig {
  maxListeners?: number;
  enablePersistence?: boolean;
  enableIdempotency?: boolean;
}

export interface ListenerSubscription {
  id: string;
  eventType: string;
  unsubscribe: () => void;
}
