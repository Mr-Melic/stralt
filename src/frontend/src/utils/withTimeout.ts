/**
 * Race a backend promise against a timeout, then clear the timer.
 *
 * PERF-2026-09-23-101: the previous Promise.race copies in the query hooks
 * never cleared `setTimeout`, so every catalog/profile fetch left a 10s
 * timer that later rejected a dangling promise (`unhandledrejection`) after
 * the actor already won. Hung replica calls must still time out.
 */
export function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Query timed out after ${ms}ms`));
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  });
}
