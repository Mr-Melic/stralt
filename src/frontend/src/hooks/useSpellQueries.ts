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
        return deepNormalizeBigInts(raw).map((s) => ({
          ...s,
          hitsMultiple: s.hitsMultiple ?? s.multiTarget ?? false,
          multiTarget: s.multiTarget ?? s.hitsMultiple ?? false,
        }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30000,
    gcTime: 120000,
  });
}

/** Map admin/runtime SpellConfig onto the bindgen Candid record. */
function toBackendSpellConfig(config: SpellConfig) {
  const multiTarget = Boolean(config.multiTarget ?? config.hitsMultiple);
  const hitTiles = (config.hitTiles ?? []).map(([dx, dy]) => [
    BigInt(dx),
    BigInt(dy),
  ]);
  return {
    id: config.id,
    name: config.name,
    description: config.description,
    iconEmoji: config.iconEmoji,
    apCost: BigInt(config.apCost ?? 0),
    mpCost: BigInt(config.mpCost ?? 0),
    damage: BigInt(config.damage ?? 0),
    healAmount: BigInt(config.healAmount ?? 0),
    effectType: config.effectType,
    spellType: config.spellType ?? "damage",
    isPhysical: Boolean(config.isPhysical),
    range: BigInt(config.range ?? 0),
    minRange: BigInt(config.minRange ?? 0),
    maxRange: BigInt(config.maxRange ?? config.range ?? 0),
    modifiableRange: Boolean(config.modifiableRange),
    lineOfSight: config.lineOfSight !== false,
    linear: Boolean(config.linear),
    diagonal: Boolean(config.diagonal),
    freeCells: Boolean(config.freeCells),
    aoe: Boolean(config.aoe),
    multiTarget,
    hitsAllies: Boolean(config.hitsAllies),
    hitTiles,
    effectCategory: config.effectCategory ?? "damage",
    usableByPlayer: config.usableByPlayer !== false,
    usableByEnemy: Boolean(config.usableByEnemy),
    minLevel: BigInt(config.minLevel ?? 1),
    effectParams: config.effectParams ?? null,
    cooldown: BigInt(config.cooldown ?? 0),
  };
}

export function useAdminSetSpellConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: SpellConfig) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as ActorAny).adminSetSpellConfig(
        toBackendSpellConfig(config),
      );
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
        return deepNormalizeBigInts(raw).map((s) => {
          const row = s as PlayerSpriteConfig & {
            frontWalkFrames?: string[];
            rightWalkFrames?: string[];
            leftWalkFrames?: string[];
            backWalkFrames?: string[];
            frontUrl?: string | [] | [string];
            rightUrl?: string | [] | [string];
            leftUrl?: string | [] | [string];
            backUrl?: string | [] | [string];
          };
          const asOpt = (
            v: string | [] | [string] | undefined,
          ): [] | [string] => (Array.isArray(v) ? v : v ? [v] : []);
          return {
            ...row,
            frontUrl: asOpt(row.frontUrl),
            rightUrl: asOpt(row.rightUrl),
            leftUrl: asOpt(row.leftUrl),
            backUrl: asOpt(row.backUrl),
            walkFramesFront: row.walkFramesFront ?? row.frontWalkFrames ?? [],
            walkFramesRight: row.walkFramesRight ?? row.rightWalkFrames ?? [],
            walkFramesLeft: row.walkFramesLeft ?? row.leftWalkFrames ?? [],
            walkFramesBack: row.walkFramesBack ?? row.backWalkFrames ?? [],
          };
        });
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
      return (actor as ActorAny).adminSetPlayerSpriteConfig({
        ...config,
        frontUrl: Array.isArray(config.frontUrl)
          ? config.frontUrl[0]
          : config.frontUrl,
        rightUrl: Array.isArray(config.rightUrl)
          ? config.rightUrl[0]
          : config.rightUrl,
        leftUrl: Array.isArray(config.leftUrl)
          ? config.leftUrl[0]
          : config.leftUrl,
        backUrl: Array.isArray(config.backUrl)
          ? config.backUrl[0]
          : config.backUrl,
        frontWalkFrames:
          (config as { frontWalkFrames?: string[] }).frontWalkFrames ??
          config.walkFramesFront ??
          [],
        rightWalkFrames:
          (config as { rightWalkFrames?: string[] }).rightWalkFrames ??
          config.walkFramesRight ??
          [],
        leftWalkFrames:
          (config as { leftWalkFrames?: string[] }).leftWalkFrames ??
          config.walkFramesLeft ??
          [],
        backWalkFrames:
          (config as { backWalkFrames?: string[] }).backWalkFrames ??
          config.walkFramesBack ??
          [],
      });
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
