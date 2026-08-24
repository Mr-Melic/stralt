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
    0n,
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
