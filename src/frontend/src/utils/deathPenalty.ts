/**
 * Death penalty: 20% XP and 40% Doka, floored, never below 0.
 *
 * applyRewards only accepts Nat and only adds, so negative deltas throw at
 * the Candid boundary and the penalty never reaches the canister. Persist
 * the already-reduced absolute XP/Doka through saveBattleStats instead.
 */

export const DEATH_XP_PENALTY_RATE = 0.2;
export const DEATH_DOKA_PENALTY_RATE = 0.4;

export type DeathPenaltyAmounts = {
  xpLost: number;
  dokaLost: number;
  newXp: number;
  newDoka: number;
};

export function computeDeathPenalty(
  exp: number,
  doka: number,
): DeathPenaltyAmounts {
  const safeExp = Math.max(0, Math.floor(Number(exp) || 0));
  const safeDoka = Math.max(0, Math.floor(Number(doka) || 0));
  const xpLost = Math.floor(safeExp * DEATH_XP_PENALTY_RATE);
  const dokaLost = Math.floor(safeDoka * DEATH_DOKA_PENALTY_RATE);
  return {
    xpLost,
    dokaLost,
    newXp: Math.max(0, safeExp - xpLost),
    newDoka: Math.max(0, safeDoka - dokaLost),
  };
}

/**
 * Optimistic death UI uses the live wallet/XP. A claim or applyRewards still
 * on the persist lock is not in that snapshot, so the immediate 40%/20% cut
 * is short. The queued saveBattleStats write penalizes the post-credit
 * committed values. hydrateWhenIdle then copies the lower UI over committed
 * and the next heal persists the under-count.
 *
 * After that write, raise UI to the persisted amount when it lagged.
 * applyRewards can also bump committed.level while the live hydrate is
 * skipped; raise UI level the same way so idle hydrate cannot persist a
 * downgrade through the next saveBattleStats.
 */
export function raiseUiAfterDeathPersist(
  uiValue: number,
  persistedValue: number,
): number {
  const ui = Math.max(0, Math.floor(Number(uiValue) || 0));
  const persisted = Math.max(0, Math.floor(Number(persistedValue) || 0));
  return Math.max(ui, persisted);
}

/**
 * After a victory level-up, leftover XP is on a new scale. max(old leftover,
 * persisted leftover) keeps the larger pre-level bar; idle hydrate then
 * refunds the death XP penalty on the next saveBattleStats.
 */
export function xpAfterDeathPersist(args: {
  uiXp: number;
  uiLevel: number;
  persistedXp: number;
  persistedLevel: number;
}): number {
  const uiLevel = Math.max(1, Math.floor(Number(args.uiLevel) || 1));
  const persistedLevel = Math.max(
    1,
    Math.floor(Number(args.persistedLevel) || 1),
  );
  if (persistedLevel > uiLevel) {
    return Math.max(0, Math.floor(Number(args.persistedXp) || 0));
  }
  return raiseUiAfterDeathPersist(args.uiXp, args.persistedXp);
}

/**
 * handleBattleEnd and portal XP both await applyRewards after the player can
 * walk. The recap overlay uses pointer-events: none, and a portal swap has
 * no overlay at all, so lava/spike death can land while that persist is still
 * in flight. Applying the post-await live hydrate then restores HP / replaces
 * XP with the unpenalized applyRewards snapshot. raiseUiAfterDeathPersist
 * keeps the higher UI; a later idle hydrate copies it over committed and
 * refunds the death penalty.
 */
export function shouldApplyVictoryLiveHydrate(
  deathTriggered: boolean,
  deathEpochAtPersistStart?: number,
  deathEpochNow?: number,
): boolean {
  if (deathTriggered) return false;
  if (
    deathEpochAtPersistStart !== undefined &&
    deathEpochNow !== undefined &&
    deathEpochAtPersistStart !== deathEpochNow
  ) {
    return false;
  }
  return true;
}

/**
 * 50% of the level-scaled max HP (`100 * (1 + (level-1) * 0.05)`).
 *
 * Must match handleRespawn / Death Realm UI. persistDeathPenalty used to
 * write `(50 + level) * 10 * 0.5` (255 at level 1) — a reload then hydrated
 * the player far above max HP.
 */
export function respawnHpAfterDeath(level: number): number {
  const safeLevel = Math.max(1, Math.floor(Number(level) || 1));
  return Math.max(1, Math.floor(100 * (1 + (safeLevel - 1) * 0.05) * 0.5));
}

/** Post-battle HP/AP/MP floor. Uses the pre-hydrate level, matching the live setState. */
export function victoryResourceFloor(level: number): {
  hp: number;
  mp: number;
  ap: number;
} {
  const safeLevel = Math.max(1, Math.floor(Number(level) || 1));
  return {
    hp: 50 + safeLevel * 10,
    mp: 5 + Math.floor(safeLevel / 10),
    ap: 6 + Math.floor(safeLevel / 20),
  };
}

export type VictoryLiveHydratePrev = {
  exp: number;
  level: number;
  hp: number;
  mp: number;
  ap: number;
  expToNext: number;
};

export type VictoryLiveHydrateRecap = {
  newXp?: number | null;
  currentLevel: number;
};

/**
 * applyRewards hydrates XP/level only. The recap overlay's outer wrapper is
 * pointer-events: none, so a Doka heal is live once inBattle is false —
 * before this persist await returns. Replacing HP with the post-battle floor
 * undoes that paid heal; the player then heals again and is charged twice.
 *
 * Keep leftover combat HP (or a recap heal) when it is already above the
 * floor; still raise up to the floor when combat ended lower.
 */
export function mergeVictoryRewardLiveStats<T extends VictoryLiveHydratePrev>(
  prev: T,
  recap: VictoryLiveHydrateRecap,
): T {
  const level = recap.currentLevel || prev.level;
  const floor = victoryResourceFloor(prev.level);
  return {
    ...prev,
    exp: recap.newXp ?? prev.exp,
    level,
    hp: Math.max(prev.hp, floor.hp),
    mp: Math.max(prev.mp, floor.mp),
    ap: Math.max(prev.ap, floor.ap),
    expToNext: Math.floor(100 * 2 ** (level - 1)),
  };
}

function toNat(n: number): bigint {
  return BigInt(Math.max(0, Math.floor(Number(n) || 0)));
}

export type DeathPenaltyPersistActor = {
  saveBattleStats: (
    slot: bigint,
    level: bigint,
    xp: bigint,
    hp: bigint,
    maxHp: bigint,
    ap: bigint,
    maxAp: bigint,
    mp: bigint,
    maxMp: bigint,
    attack: bigint,
    defense: bigint,
    initiative: bigint,
    dokaBalance: bigint,
    spellLevelKeys: string[],
    spellLevelValues: bigint[],
  ) => Promise<
    | { __kind__: "ok"; ok: null }
    | { __kind__: "err"; err: string }
    | { ok?: unknown; err?: string }
    | undefined
  >;
};

export type DeathPenaltyPersistInput = {
  slot: number;
  level: number;
  hp: number;
  maxHp: number;
  ap: number;
  maxAp: number;
  mp: number;
  maxMp: number;
  /** Persisted as CharacterStats.atk. Must be the current stored value. */
  attack: number;
  defense: number;
  initiative: number;
  newXp: number;
  newDoka: number;
  spellLevels: Record<string, number>;
};

export async function persistDeathPenalty(
  // Actor is Record<string, any> at call sites; keep this loose so persist
  // stays callable from WorldExploration without a cast.
  actor:
    | {
        saveBattleStats?: DeathPenaltyPersistActor["saveBattleStats"];
        [key: string]: unknown;
      }
    | null
    | undefined,
  input: DeathPenaltyPersistInput,
): Promise<void> {
  if (!actor?.saveBattleStats) return;
  const keys = Object.keys(input.spellLevels);
  const result = await actor.saveBattleStats(
    toNat(input.slot),
    toNat(input.level),
    toNat(input.newXp),
    toNat(input.hp),
    toNat(input.maxHp),
    toNat(input.ap),
    toNat(input.maxAp),
    toNat(input.mp),
    toNat(input.maxMp),
    toNat(input.attack),
    toNat(input.defense),
    toNat(input.initiative),
    toNat(input.newDoka),
    keys,
    keys.map((k) => toNat(input.spellLevels[k] ?? 0)),
  );
  if (
    result &&
    typeof result === "object" &&
    (("__kind__" in result && result.__kind__ === "err") ||
      ("err" in result && result.err))
  ) {
    const err =
      "err" in result && result.err
        ? String(result.err)
        : "saveBattleStats failed";
    throw new Error(err);
  }
}
