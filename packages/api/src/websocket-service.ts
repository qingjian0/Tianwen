/**
 * WebSocket 服务 - 实时推送
 */

import { EventEmitter } from 'events';

export interface WebSocketMessage {
  type: 'prediction' | 'progress' | 'error' | 'notification';
  payload: any;
  timestamp: string;
  requestId: string;
}

export interface ProgressUpdate {
  stage: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
}

export class WebSocketService extends EventEmitter {
  private clients: Map<string, any>;
  private subscriptions: Map<string, Set<string>>;

  constructor() {
    super();
    this.clients = new Map();
    this.subscriptions = new Map();
  }

  addClient(clientId: string, socket: any): void {
    this.clients.set(clientId, socket);
    this.subscriptions.set(clientId, new Set());

    socket.on('close', () => {
      this.removeClient(clientId);
    });

    socket.on('error', (error: Error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
    });

    this.sendToClient(clientId, {
      type: 'notification',
      payload: {
        message: 'Connected to Tianwen WebSocket Server',
        clientId
      },
      timestamp: new Date().toISOString(),
      requestId: clientId
    });
  }

  removeClient(clientId: string): void {
    this.clients.delete(clientId);
    this.subscriptions.delete(clientId);
  }

  subscribe(clientId: string, channel: string): void {
    const subscriptions = this.subscriptions.get(clientId);
    if (subscriptions) {
      subscriptions.add(channel);
    }
  }

  unsubscribe(clientId: string, channel: string): void {
    const subscriptions = this.subscriptions.get(clientId);
    if (subscriptions) {
      subscriptions.delete(channel);
    }
  }

  sendToClient(clientId: string, message: WebSocketMessage): void {
    const socket = this.clients.get(clientId);
    if (socket && socket.readyState === 1) {
      socket.send(JSON.stringify(message));
    }
  }

  broadcast(channel: string, message: WebSocketMessage): void {
    for (const [clientId, subscriptions] of this.subscriptions.entries()) {
      if (subscriptions.has(channel)) {
        this.sendToClient(clientId, message);
      }
    }
  }

  broadcastToAll(message: WebSocketMessage): void {
    for (const clientId of this.clients.keys()) {
      this.sendToClient(clientId, message);
    }
  }

  sendPredictionProgress(requestId: string, update: ProgressUpdate): void {
    const message: WebSocketMessage = {
      type: 'progress',
      payload: update,
      timestamp: new Date().toISOString(),
      requestId
    };

    this.broadcast('predictions', message);
    this.sendToClient(requestId, message);
  }

  sendPredictionResult(requestId: string, result: any): void {
    const message: WebSocketMessage = {
      type: 'prediction',
      payload: result,
      timestamp: new Date().toISOString(),
      requestId
    };

    this.broadcast('predictions', message);
    this.sendToClient(requestId, message);
  }

  sendError(requestId: string, error: string): void {
    const message: WebSocketMessage = {
      type: 'error',
      payload: { error },
      timestamp: new Date().toISOString(),
      requestId
    };

    this.sendToClient(requestId, message);
  }

  sendNotification(title: string, content: string): void {
    const message: WebSocketMessage = {
      type: 'notification',
      payload: { title, content },
      timestamp: new Date().toISOString(),
      requestId: 'system'
    };

    this.broadcastToAll(message);
  }

  getConnectedClients(): number {
    return this.clients.size;
  }

  getChannels(): string[] {
    return ['predictions', 'rules', 'system'];
  }
}

export const webSocketService = new WebSocketService();
