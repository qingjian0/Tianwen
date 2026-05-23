/**
 * 统一日志工具
 */

export interface LogEntry {
  timestamp: Date;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  metadata?: Record<string, any>;
}

class TianwenLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  info(message: string, metadata?: Record<string, any>) {
    this.log("info", message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log("warn", message, metadata);
  }

  error(message: string, metadata?: Record<string, any>) {
    this.log("error", message, metadata);
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log("debug", message, metadata);
  }

  private log(
    level: LogEntry["level"],
    message: string,
    metadata?: Record<string, any>,
  ) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      metadata,
    };

    this.logs.push(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.print(entry);
  }

  private print(entry: LogEntry) {
    const prefix = `[${entry.timestamp.toISOString()}] [${entry.level.toUpperCase()}]`;

    if (entry.level === "error") {
      console.error(prefix, entry.message, entry.metadata || "");
    } else if (entry.level === "warn") {
      console.warn(prefix, entry.message, entry.metadata || "");
    } else {
      console.log(prefix, entry.message, entry.metadata || "");
    }
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }
}

export const logger = new TianwenLogger();
