/**
 * Gated debug logger utility.
 * - In development: logs to console AND pushes to the debug-overlay buffer.
 * - In production: silently no-ops so output stays clean.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogCategory =
  | "MAP"
  | "BATTLE"
  | "SPELLS"
  | "RENDER"
  | "BACKEND"
  | "ERROR"
  | "CHALLENGE"
  | "BOSS"
  | "UI"
  | "GENERAL"
  | "SUMMON"
  | "TURN";

const IS_DEV =
  typeof process !== "undefined" && process.env.NODE_ENV === "development";

export interface DebugLogEntry {
  ts: number;
  category: LogCategory;
  level: LogLevel;
  message: string;
  data?: unknown;
}

/** In-memory ring buffer for the debug overlay (last 200 entries). */
let _buffer: DebugLogEntry[] = [];

/** Subscribers that want to be notified when a new log arrives. */
const _subscribers: Array<(entry: DebugLogEntry) => void> = [];

export function logDebug(
  category: LogCategory,
  level: LogLevel,
  message: string,
  data?: unknown,
): void {
  const entry: DebugLogEntry = {
    ts: performance.now(),
    category,
    level,
    message,
    data,
  };

  // Always keep the buffer so the overlay can show history even in prod
  _buffer.push(entry);
  if (_buffer.length > 200) _buffer = _buffer.slice(-200);

  // Notify overlay subscribers
  for (const sub of _subscribers) {
    try {
      sub(entry);
    } catch {
      /* ignore subscriber errors */
    }
  }

  // Console output only in development
  if (!IS_DEV) return;

  const prefix = `[${category}] ${level.toUpperCase()}:`;
  if (data !== undefined) {
    // eslint-disable-next-line no-console
    console[level](prefix, message, data);
  } else {
    // eslint-disable-next-line no-console
    console[level](prefix, message);
  }
}

/** Convenience wrappers so callers don't have to pass level every time. */
export function logDebugInfo(
  category: LogCategory,
  message: string,
  data?: unknown,
): void {
  logDebug(category, "info", message, data);
}
export function logDebugWarn(
  category: LogCategory,
  message: string,
  data?: unknown,
): void {
  logDebug(category, "warn", message, data);
}
export function logDebugError(
  category: LogCategory,
  message: string,
  data?: unknown,
): void {
  logDebug(category, "error", message, data);
}

/** Subscribe to new log entries (used by the debug overlay). */
export function subscribeDebugLogs(
  callback: (entry: DebugLogEntry) => void,
): () => void {
  _subscribers.push(callback);
  return () => {
    const idx = _subscribers.indexOf(callback);
    if (idx !== -1) _subscribers.splice(idx, 1);
  };
}

/** Get the current buffer snapshot. */
export function getDebugLogBuffer(): readonly DebugLogEntry[] {
  return _buffer;
}

/** Clear the buffer. */
export function clearDebugLogBuffer(): void {
  _buffer = [];
}
