import { useCallback } from "react";

const STORAGE_PREFIX = "pbv_panel_layout_";

export interface PanelState {
  x: number;
  y: number;
  folded: boolean;
}

type LayoutMap = Record<string, PanelState>;

function getStorageKey(userId: string): string {
  return STORAGE_PREFIX + (userId || "guest");
}

function readLayout(userId: string): LayoutMap {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return {};
    return JSON.parse(raw) as LayoutMap;
  } catch {
    return {};
  }
}

function writeLayout(userId: string, layout: LayoutMap): void {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(layout));
  } catch {
    // ignore
  }
}

function getDefaultLayout(panelIds: string[]): Record<string, PanelState> {
  const result: Record<string, PanelState> = {};
  let xOffset = 10;
  for (const id of panelIds) {
    if (id === "stats") {
      result[id] = {
        x:
          typeof window !== "undefined"
            ? Math.max(0, window.innerWidth - 280)
            : 700,
        y: 80,
        folded: false,
      };
    } else {
      result[id] = { x: xOffset, y: 60, folded: true };
      xOffset += 160;
    }
  }
  return result;
}

function resolveOverlaps(panels: LayoutMap): LayoutMap {
  const result = { ...panels };
  const ids = Object.keys(result);
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = result[ids[i]];
      const b = result[ids[j]];
      const aw = (a as PanelState & { width?: number }).width ?? 200;
      const ah = (a as PanelState & { height?: number }).height ?? 150;
      const bw = (b as PanelState & { width?: number }).width ?? 200;
      const bh = (b as PanelState & { height?: number }).height ?? 150;
      const overlapX = Math.max(
        0,
        Math.min(a.x + aw, b.x + bw) - Math.max(a.x, b.x),
      );
      const overlapY = Math.max(
        0,
        Math.min(a.y + ah, b.y + bh) - Math.max(a.y, b.y),
      );
      if (overlapX > 0 && overlapY > 0) {
        if (overlapX < overlapY) {
          result[ids[j]] = { ...b, x: a.x + aw + 4 };
        } else {
          result[ids[j]] = { ...b, y: a.y + ah + 4 };
        }
      }
    }
  }
  return result;
}

export function usePanelLayout(userId: string, panelIds?: string[]) {
  const getOrInitLayout = useCallback((): LayoutMap => {
    const layout = readLayout(userId);
    if (Object.keys(layout).length === 0 && panelIds && panelIds.length > 0) {
      const defaults = getDefaultLayout(panelIds);
      writeLayout(userId, defaults);
      return defaults;
    }
    return layout;
  }, [userId, panelIds]);

  const getPanelState = useCallback(
    (panelId: string): PanelState | null => {
      const layout = getOrInitLayout();
      return layout[panelId] ?? null;
    },
    [getOrInitLayout],
  );

  const setPanelState = useCallback(
    (panelId: string, state: PanelState): void => {
      const layout = readLayout(userId);
      layout[panelId] = state;
      const resolved = resolveOverlaps(layout);
      writeLayout(userId, resolved);
    },
    [userId],
  );

  const savePanelState = useCallback(
    (panelId: string, partial: Partial<PanelState>): void => {
      const layout = readLayout(userId);
      const existing = layout[panelId] ?? { x: 0, y: 0, folded: false };
      layout[panelId] = { ...existing, ...partial };
      const resolved = resolveOverlaps(layout);
      writeLayout(userId, resolved);
    },
    [userId],
  );

  const removePanelState = useCallback(
    (panelId: string): void => {
      const layout = readLayout(userId);
      if (layout[panelId]) {
        delete layout[panelId];
        writeLayout(userId, layout);
      }
    },
    [userId],
  );

  return { getPanelState, setPanelState, savePanelState, removePanelState };
}
