/**
 * Event Bus - 事件总线实现
 */

import { Event, EventHandler, EventHandlerOptions, ListenerSubscription } from './types';

interface Listener {
  handler: EventHandler;
  options: EventHandlerOptions;
  id: string;
}

export class EventBus {
  private listeners: Map<string, Listener[]> = new Map();
  private eventHistory: Event[] = [];
  private maxHistorySize: number = 1000;

  on(
    eventType: string,
    handler: EventHandler,
    options: EventHandlerOptions = {}
  ): ListenerSubscription {
    const listener: Listener = {
      handler,
      options,
      id: this.generateId()
    };

    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }

    const listeners = this.listeners.get(eventType)!;
    listeners.push(listener);

    // 按优先级排序
    listeners.sort((a, b) => (b.options.priority || 0) - (a.options.priority || 0));

    return {
      unsubscribe: () => this.off(eventType, listener.id)
    };
  }

  once(
    eventType: string,
    handler: EventHandler,
    options: EventHandlerOptions = {}
  ): ListenerSubscription {
    return this.on(eventType, handler, { ...options, once: true });
  }

  emit(eventType: string, payload: any, metadata?: Record<string, any>): Event {
    const event: Event = {
      id: this.generateId(),
      type: eventType,
      timestamp: Date.now(),
      payload,
      metadata
    };

    this.recordEvent(event);
    this.dispatch(event);

    return event;
  }

  private async dispatch(event: Event): Promise<void> {
    const listeners = this.listeners.get(event.type) || [];
    const onceListeners: string[] = [];

    for (const listener of listeners) {
      // 应用过滤
      if (listener.options.filter && !listener.options.filter(event)) {
        continue;
      }

      try {
        await listener.handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${event.type}:`, error);
      }

      // 标记一次性监听器
      if (listener.options.once) {
        onceListeners.push(listener.id);
      }
    }

    // 清理一次性监听器
    for (const id of onceListeners) {
      this.off(event.type, id);
    }
  }

  private off(eventType: string, listenerId: string): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.findIndex(l => l.id === listenerId);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  offAll(eventType?: string): void {
    if (eventType) {
      this.listeners.delete(eventType);
    } else {
      this.listeners.clear();
    }
  }

  getEventHistory(eventType?: string, limit: number = 100): Event[] {
    let history = this.eventHistory;
    if (eventType) {
      history = history.filter(e => e.type === eventType);
    }
    return history.slice(-limit);
  }

  private recordEvent(event: Event): void {
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  setMaxHistorySize(size: number): void {
    this.maxHistorySize = size;
  }

  clearHistory(): void {
    this.eventHistory = [];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
