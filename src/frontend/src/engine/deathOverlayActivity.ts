/**
 * Game Over overlay activity.
 *
 * PERF-2026-10-28-201: death calls `setInBattle(false)` before showing
 * Game Over, so GameFlow's `isPaused={isInBattle || isTransitioning}`
 * restarts ChatPanel's 2s `getMessages` poll under the still-mounted
 * world tree. GameOverModal sets this flag on mount; GameFlow ORs it
 * into `isPaused`. Distinct from PERF-177 (overworld / folded poll).
 */

type Listener = () => void;

const listeners = new Set<Listener>();
let deathOverlayActive = false;

export function setDeathOverlayActive(next: boolean): void {
  if (deathOverlayActive === next) return;
  deathOverlayActive = next;
  for (const listener of listeners) listener();
}

export function isDeathOverlayActive(): boolean {
  return deathOverlayActive;
}

export function subscribeDeathOverlayActive(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Chat `getMessages` should not run during battle, portal wipe, or Game Over. */
export function shouldPauseChatPoll(input: {
  inBattle: boolean;
  transitioning: boolean;
  deathOverlay: boolean;
}): boolean {
  return input.inBattle || input.transitioning || input.deathOverlay;
}
