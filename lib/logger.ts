// ============================================================
// CENTRALIZED LOGGER
// Consistent error/info logging across the app.
// In production, this could be extended to send to Sentry/LogRocket.
// ============================================================

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: string;
}

function log(level: LogLevel, message: string, context?: string, data?: unknown) {
  const entry: LogEntry = {
    level,
    message,
    context,
    data,
    timestamp: new Date().toISOString(),
  };

  if (level === "error") {
    console.error(`[${entry.context || "app"}] ${entry.message}`, data || "");
  } else if (level === "warn") {
    console.warn(`[${entry.context || "app"}] ${entry.message}`, data || "");
  } else {
    console.log(`[${entry.context || "app"}] ${entry.message}`, data || "");
  }

  // Future: send to external service
  // if (level === "error" && process.env.NODE_ENV === "production") {
  //   sendToSentry(entry);
  // }
}

export const logger = {
  info: (message: string, context?: string, data?: unknown) => log("info", message, context, data),
  warn: (message: string, context?: string, data?: unknown) => log("warn", message, context, data),
  error: (message: string, context?: string, data?: unknown) => log("error", message, context, data),
};
