/**
 * Promise.race against setTimeout must clear the timer when the actor
 * wins. Otherwise every successful call leaves a dangling timer until `ms`.
 * Chat getMessages polls every 2s with a 5s race (PERF-2026-09-26-114).
 * Query-hook copies of the same pattern are PERF-2026-09-23-101.
 */

export function raceWithTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message = `timed out after ${ms}ms`,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(message));
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  });
}
