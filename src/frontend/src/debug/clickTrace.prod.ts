/**
 * Production stub for `clickTrace.ts` (PERF-2026-10-21-137).
 *
 * Production click/export paths already skip recording (`import.meta.env.DEV`
 * at the WorldExploration call site). The Debug export reads these getters at
 * click time; empty buffers match current production behaviour (the ring is
 * never filled) without parsing the ~800-line recorder.
 *
 * Vite production build aliases `debug/clickTrace` here. Dev server and unit
 * tests keep the real module.
 */

const EMPTY_BUFFER: readonly unknown[] = Object.freeze([]);

export function getClickTraceBuffer(): readonly unknown[] {
  return EMPTY_BUFFER;
}

export function clearClickTraceBuffer(): void {
  // Production never records clicks.
}

export function recordClickTrace(input: unknown): unknown {
  void input;
  return undefined;
}

export function getGeometrySnapshot(input: unknown): unknown {
  void input;
  return undefined;
}
