/**
 * WebSocket 服务 - 实时推送
 * 根据天问系统 API 设计文档 v1.0
 */

import { EventEmitter } from "events";
import {
  WebSocketMessage,
  ProgressUpdate,
  CompletedUpdate,
  SystemStatus,
  WebSocketError,
} from "./types";

export class WebSocketService extends EventEmitter {
  private clients: Map<string, any>;
  private subscriptions: Map<string, Set<string>>;
  private systemStatusInterval: ReturnType<typeof setInterval> | null;

  constructor() {
    super();
    this.clients = new Map();
    this.subscriptions = new Map();
    this.systemStatusInterval = null;
    this.startSystemStatusLoop();
  }

  addClient(clientId: string, socket: any): void {
    this.clients.set(clientId, socket);
    this.subscriptions.set(clientId, new Set(["system"]));

    socket.on("close", () => {
      this.removeClient(clientId);
    });

    socket.on("error", (error: Error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
    });

    socket.on("message", (message: string) => {
      this.handleClientMessage(clientId, message);
    });

    this.sendToClient(clientId, {
      channel: "system",
      event: "connected",
      data: {
        message: "Connected to Tianwen WebSocket Server",
        clientId,
        channels: this.getChannels(),
      },
      timestamp: new Date().toISOString(),
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

  sendPredictionProgress(
    id: string,
    stage: string,
    progress: number,
    message?: string,
  ): void {
    const update: ProgressUpdate = { id, stage, progress, message };
    const messageObj: WebSocketMessage = {
      channel: "predictions",
      event: "progress",
      data: update,
      timestamp: new Date().toISOString(),
    };

    this.broadcast("predictions", messageObj);
  }

  sendPredictionCompleted(id: string, status: "completed" | "failed"): void {
    const update: CompletedUpdate = {
      id,
      status,
      outputUrl: `/api/predictions/${id}`,
    };
    const messageObj: WebSocketMessage = {
      channel: "predictions",
      event: "completed",
      data: update,
      timestamp: new Date().toISOString(),
    };

    this.broadcast("predictions", messageObj);
  }

  sendSystemStatus(): void {
    const status: SystemStatus = {
      cpuUsage: Math.floor(Math.random() * 30) + 20,
      memoryUsage: Math.floor(Math.random() * 20) + 60,
      activeConnections: this.clients.size,
      totalPredictions: 0,
    };

    const messageObj: WebSocketMessage = {
      channel: "system",
      event: "status",
      data: status,
      timestamp: new Date().toISOString(),
    };

    this.broadcast("system", messageObj);
  }

  sendError(clientId: string, code: number, message: string): void {
    const error: WebSocketError = { code, message };
    const messageObj: WebSocketMessage = {
      channel: "system",
      event: "error",
      data: error,
      timestamp: new Date().toISOString(),
    };

    this.sendToClient(clientId, messageObj);
  }

  sendNotification(title: string, content: string): void {
    const messageObj: WebSocketMessage = {
      channel: "system",
      event: "notification",
      data: { title, content },
      timestamp: new Date().toISOString(),
    };

    this.broadcastToAll(messageObj);
  }

  sendRuleUpdate(): void {
    const messageObj: WebSocketMessage = {
      channel: "rules",
      event: "updated",
      data: { timestamp: new Date().toISOString() },
      timestamp: new Date().toISOString(),
    };

    this.broadcast("rules", messageObj);
  }

  getConnectedClients(): number {
    return this.clients.size;
  }

  getChannels(): string[] {
    return ["predictions", "rules", "system"];
  }

  private handleClientMessage(clientId: string, message: string): void {
    try {
      const data = JSON.parse(message);

      if (data.action === "subscribe") {
        this.subscribe(clientId, data.channel);
      } else if (data.action === "unsubscribe") {
        this.unsubscribe(clientId, data.channel);
      }
    } catch (error) {
      console.error("Invalid WebSocket message:", error);
    }
  }

  private startSystemStatusLoop(): void {
    this.systemStatusInterval = setInterval(() => {
      this.sendSystemStatus();
    }, 10000);
  }

  shutdown(): void {
    if (this.systemStatusInterval) {
      clearInterval(this.systemStatusInterval);
    }
    this.clients.forEach((socket) => {
      socket.close();
    });
    this.clients.clear();
    this.subscriptions.clear();
  }
}

export const webSocketService = new WebSocketService();
