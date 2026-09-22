/**
 * Shared UserProfile.uiLayout fetch. World entry mounts several
 * DraggablePanels; each used to call getUserUiLayout in parallel
 * (PERF-2026-09-22-082). In-flight only — remount after settle may fetch
 * again. Snap math and save debounce stay in DraggablePanel.
 */

export interface PanelLayoutEntry {
  x: number;
  y: number;
  folded: boolean;
}

export type PanelLayoutMap = Record<string, PanelLayoutEntry>;

export type LayoutFetchActor = {
  getUserUiLayout(): Promise<string>;
};

const inFlightUserUiLayout = new Map<string, Promise<PanelLayoutMap | null>>();

export function layoutFetchCacheKey(userId: string): string {
  return userId || "guest";
}

/** Test hook: drop in-flight entries so cases do not leak across files. */
export function resetUserUiLayoutInflightForTests(): void {
  inFlightUserUiLayout.clear();
}

/**
 * Parse a compact JSON layout blob. Returns null if empty or invalid so the
 * caller keeps the localStorage paint-first cache.
 */
export function parseBackendLayout(blob: string): PanelLayoutMap | null {
  if (!blob) return null;
  try {
    const parsed = JSON.parse(blob) as unknown;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return null;
    }
    const result: PanelLayoutMap = {};
    for (const [id, entry] of Object.entries(
      parsed as Record<string, unknown>,
    )) {
      if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
        continue;
      }
      const e = entry as Record<string, unknown>;
      if (
        typeof e.x !== "number" ||
        typeof e.y !== "number" ||
        typeof e.folded !== "boolean"
      ) {
        continue;
      }
      result[id] = { x: e.x, y: e.y, folded: e.folded };
    }
    return Object.keys(result).length > 0 ? result : null;
  } catch {
    return null;
  }
}

/**
 * One shared getUserUiLayout per userId while a fetch is already running.
 * Transport / parse failures return null (localStorage stays).
 */
export function loadUserUiLayoutOnce(
  actor: LayoutFetchActor,
  userId: string,
): Promise<PanelLayoutMap | null> {
  const key = layoutFetchCacheKey(userId);
  const existing = inFlightUserUiLayout.get(key);
  if (existing) return existing;

  const pending = actor
    .getUserUiLayout()
    .then((blob) => parseBackendLayout(blob))
    .catch((err: unknown) => {
      console.warn(
        "uiLayoutActivity: getUserUiLayout failed, falling back to localStorage",
        err,
      );
      return null;
    })
    .finally(() => {
      if (inFlightUserUiLayout.get(key) === pending) {
        inFlightUserUiLayout.delete(key);
      }
    });
  inFlightUserUiLayout.set(key, pending);
  return pending;
}
