import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deepNormalizeBigInts } from "../lib/normalizeBigInts";
import type {
  EnemyConfig,
  PlayerSpriteConfig,
  RegionConfig,
  SpellConfig,
} from "../types/gameTypes";
import { useActor } from "./useActor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = Record<string, any>;

/** Wraps a backend promise with a 10-second timeout so slow responses never hang UI */
function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Query timed out after ${ms}ms`)), ms),
    ),
  ]);
}

export function useGetSpellConfigs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SpellConfig[]>({
    queryKey: ["spellConfigs"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const raw: SpellConfig[] = await withTimeout(
          (actor as ActorAny).getSpellConfigs(),
        );
        return deepNormalizeBigInts(raw);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30000,
    gcTime: 120000,
  });
}

export function useAdminSetSpellConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: SpellConfig) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as ActorAny).adminSetSpellConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spellConfigs"] });
    },
  });
}

export function useAdminDeleteSpellConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as ActorAny).adminDeleteSpellConfig(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spellConfigs"] });
    },
  });
}

export function useGetEnemyConfigs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EnemyConfig[]>({
    queryKey: ["enemyConfigs"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const raw: EnemyConfig[] = await withTimeout(
          (actor as ActorAny).getEnemyConfigs(),
        );
        return deepNormalizeBigInts(raw);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30000,
    gcTime: 120000,
  });
}

export function useAdminSetEnemyConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: EnemyConfig) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as ActorAny).adminSetEnemyConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enemyConfigs"] });
    },
  });
}

export function useAdminDeleteEnemyConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as ActorAny).adminDeleteEnemyConfig(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enemyConfigs"] });
    },
  });
}

export function useGetRegionConfigs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RegionConfig[]>({
    queryKey: ["regionConfigs"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const raw: RegionConfig[] = await withTimeout(
          (actor as ActorAny).getRegionConfigs(),
        );
        return deepNormalizeBigInts(raw);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30000,
    gcTime: 120000,
  });
}

export function useAdminSetRegionConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: RegionConfig) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as ActorAny).adminSetRegionConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regionConfigs"] });
    },
  });
}

export function useAdminDeleteRegionConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as ActorAny).adminDeleteRegionConfig(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regionConfigs"] });
    },
  });
}

export function useGetPlayerSpriteConfigs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PlayerSpriteConfig[]>({
    queryKey: ["playerSpriteConfigs"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const raw: PlayerSpriteConfig[] = await withTimeout(
          (actor as ActorAny).getPlayerSpriteConfigs(),
        );
        return deepNormalizeBigInts(raw);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30000,
    gcTime: 120000,
  });
}

export function useAdminSetPlayerSpriteConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: PlayerSpriteConfig) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as ActorAny).adminSetPlayerSpriteConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playerSpriteConfigs"] });
    },
  });
}

export function useAdminDeletePlayerSpriteConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as ActorAny).adminDeletePlayerSpriteConfig(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playerSpriteConfigs"] });
    },
  });
}
