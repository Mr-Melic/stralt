/**
 * useBossQueries.ts — React Query hooks for the boss system.
 * Configs are localStorage-backed (no backend endpoint yet).
 * Do NOT import from useQueries.ts here (circular dependency rule E4).
 */

import { useQuery } from "@tanstack/react-query";
import { DEFAULT_BOSS_CONFIGS } from "../types/bossDefaults";
import type { BossConfig } from "../types/bossTypes";

const BOSS_CONFIG_KEY = "pbv_boss_configs";

function loadBossConfigs(): BossConfig[] {
  try {
    const raw = localStorage.getItem(BOSS_CONFIG_KEY);
    if (raw) return JSON.parse(raw) as BossConfig[];
  } catch {
    /* ignore */
  }
  return DEFAULT_BOSS_CONFIGS;
}

export function useGetAllBossConfigs() {
  return useQuery<BossConfig[]>({
    queryKey: ["bossConfigs"],
    queryFn: () => loadBossConfigs(),
    staleTime: 30000,
    gcTime: 120000,
  });
}

export function useGetBossConfig(id: string) {
  return useQuery<BossConfig | null>({
    queryKey: ["bossConfig", id],
    queryFn: () => {
      const all = loadBossConfigs();
      return all.find((b) => b.id === id) ?? null;
    },
    staleTime: 30000,
    gcTime: 120000,
    enabled: !!id,
  });
}
