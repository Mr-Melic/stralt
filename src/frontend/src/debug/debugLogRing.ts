/**
 * Fixed-capacity debug log ring. Push is O(1) and does not allocate.
 *
 * PERF-2026-09-25-108: the previous Array.push + slice(-cap) path allocated a
 * fresh 2000-entry array on every log once the buffer was full. Combat / AI /
 * spell paths call logDebugInfo frequently, so a long session paid that copy
 * on the main thread under the live canvas. Snapshot (oldest-first) is only
 * taken when Debug export / the Debug tab reads the buffer.
 */

export const DEBUG_BUFFER_CAP = 2000;

export type DebugLogRing<T> = {
  slots: Array<T | undefined>;
  start: number;
  size: number;
  cap: number;
};

export function createDebugLogRing<T>(cap = DEBUG_BUFFER_CAP): DebugLogRing<T> {
  return {
    slots: new Array<T | undefined>(cap),
    start: 0,
    size: 0,
    cap,
  };
}

export function pushDebugLogEntry<T>(ring: DebugLogRing<T>, entry: T): void {
  if (ring.cap <= 0) return;
  if (ring.size < ring.cap) {
    ring.slots[ring.size] = entry;
    ring.size += 1;
    return;
  }
  ring.slots[ring.start] = entry;
  ring.start = (ring.start + 1) % ring.cap;
}

export function snapshotDebugLogRing<T>(ring: DebugLogRing<T>): T[] {
  const out: T[] = [];
  for (let i = 0; i < ring.size; i++) {
    const entry = ring.slots[(ring.start + i) % ring.cap];
    if (entry !== undefined) out.push(entry);
  }
  return out;
}

export function clearDebugLogRing<T>(ring: DebugLogRing<T>): void {
  ring.slots.fill(undefined);
  ring.start = 0;
  ring.size = 0;
}
