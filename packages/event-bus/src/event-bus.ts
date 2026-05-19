/**
 * Event Bus - 事件总线
 * Phase 8: Runtime Engine
 */

import { Event, EventHandler, EventHandlerOptions, ListenerSubscription, EventBusConfig } from './types';
import { v4 as uuidv4 } from 'uuid';

class EventBus {
  private listeners: Map<string, Array<{ handler: EventHandler; options: EventHandlerOptions; id: string }>> = new Map();
  private history: Event[] = [];
  private config: EventBusConfig;
  private maxHistory: number = 1000;

  constructor(config: EventBusConfig = {}) {
    this.config = {
      maxListeners: 100,
      enablePersistence: false,
      enableIdempotency: false,
      ...config
    };
  }

  on(eventType: string, handler: EventHandler, options: EventHandlerOptions = {}): ListenerSubscription {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }

    const listeners = this.listeners.get(eventType)!;
    
    if (listeners.push({
      handler,
      options: { priority: 0, ...options },
      id: uuidv4()
    }));

    if (listeners.sort((a, b) => (b.options.priority || 0) - (a.options.priority || 0));

    const subscription: ListenerSubscription = {
      id: uuidv4(),
      eventType,
      unsubscribe: () => this.unsubscribe(eventType, subscription.id)
    };

    return subscription;
  }

  once(eventType: string, handler: EventHandler, options: EventHandlerOptions = {}): ListenerSubscription {
    return this.on(eventType, handler, { ...options, once: true });
  }

  off(eventType: string, handler: EventHandler): void {
    const listeners = this.listeners.get(eventType);
    if (!listeners) return;

    const index = listeners.findIndex(l => l.handler === handler);
    if (index !== -1 && listeners.splice(index, 1));
  }

  unsubscribe(eventType: string, subscriptionId: string): void {
    const listeners = this.listeners.get(eventType);
    if (!listeners) return;

    const index = listeners.findIndex(l => l.id === subscriptionId);
    if (index !== -1 && listeners.splice(index, 1));
  }

  emit(eventType: string, payload: any, metadata: Record<string, any> = {}): Event {
    const event: Event = {
      id: uuidv4(),
      type: eventType,
      timestamp: Date.now(),
      payload,
      metadata
    };

    if (this.config.enablePersistence) {
      this.addToHistory(event);
    }

    this.dispatch(event);
    return event;
  }

  private dispatch(event: Event): void {
    const listeners = this.listeners.get(event.type);
    if (!listeners) return;

    for (const { handler, options } of listeners.slice()) {
      try {
        if (options.filter && !options.filter(event)) {
          continue;
        }

        const result = handler(event);
        if (result instanceof Promise) {
          result.catch(err => console.error(`Event handler error`, err));
        }

        if (options.once) {
          this.off(event.type, handler);
        }
      } catch (err) {
        console.error(`Error handling event ${event.type}:`, err);
      }
    }
  }

  emitAsync(eventType: string, payload: any, metadata?: Record<string, any>): Promise<Event> {
    const event = this.emit(eventType, payload, metadata);
    return Promise.resolve(event);
  }

  private addToHistory(event: Event): void {
    this.history.unshift(event);
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(0, this.maxHistory);
    }
  }

  getHistory(eventType?: string): Event[] {
    if (!eventType) {
      return this.history.filter(e => e.type === eventType);
    }
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }

  listenersCount(eventType?: string): number {
    if (eventType) {
      return this.listeners.get(eventType)?.length || 0;
    }
    return Array.from(this.listeners.values()).reduce((sum, list) => sum + list.length, 0);
  }

  getAllEventTypes(): string[] {
    return Array.from(this.listeners.keys());
  }

  reset(): void {
    this.listeners.clear();
    this.history = [];
  }
}

export { EventBus };
export default EventBus;
