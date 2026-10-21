/**
 * Production click-trace shipping policy (PERF-2026-10-21-137).
 *
 * `clickTrace.ts` is documented as never shipping to players, but WorldExploration
 * and ChatPanel static-import it. Vite therefore parses ~800 lines of geometry
 * recorder in the world chunk. Call sites already no-op when `import.meta.env.DEV`
 * is false, so production only needs a tiny stub for the live getters.
 *
 * The Vite production build aliases `debug/clickTrace` → `clickTrace.prod.ts`.
 * `vite` serve / tests keep the real recorder. Keep this predicate in sync with
 * `src/frontend/vite.config.js`.
 */

export function shouldStubClickTraceRecorder(input: {
  command: string;
  mode: string;
}): boolean {
  return input.command === "build" && input.mode === "production";
}

export function isClickTraceRecorderImport(source: string): boolean {
  if (source.includes("clickTrace.prod")) return false;
  if (source.includes("clickTraceBundle")) return false;
  return (
    source === "../debug/clickTrace" ||
    source === "./clickTrace" ||
    source.endsWith("/debug/clickTrace") ||
    source.endsWith("/debug/clickTrace.ts")
  );
}
