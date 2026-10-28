/**
 * Boss kit damage/drain casts skip advertised player Spell Resistance (SR).
 *
 * Advertised (spellEngine / WX computeDamage comments):
 *   spells: finalDamage = base * (1 - SR/100) * (1 - RES/100)
 *   physical/DoT: finalDamage = base * (1 - RES/100)
 *
 * Live WorldExploration kit apply (~15859–15867):
 *   bRawDmg = Number(bossSpell.damage)
 *   playerTakesDamage(bRawDmg)  // RES only; never reads characterStats.sr
 *
 * `pickBossKitSpell` always receives `new Map()`, so Void Grandmaster /
 * Starborn Queen / Lord of Static / Mirror Sovereign phase 1 first-id
 * `starter-blast` (Chain Lightning 20) is decided every turn. Kit apply
 * skips the regular-enemy `inRange` gate (~16451) and the pack SP soak
 * (`plSpEff` at ~16475). Pack CAST using SP instead of SR is **#1257**.
 * Kit CHC / kit SP leftover is **#1104**. Kit bounce is **#868**. Kit
 * range as the primary defect is **#888**.
 *
 * Sequence: Void Grandmaster kit Chain Lightning raw 20 vs player SR 50 /
 * RES 0 / HP 100 at Chebyshev 3 → expected 10, live 20.
 * Starting champion SR 5 / RES 10: advertised SR×RES once = 17; kit live
 * RES only = 18; pack live (#1257) SP×RES then RES = 15.
 *
 * Unique vs **#1257** (pack SP soak + double RES), **#1104** (kit CHC /
 * kit SP leftover), **#868** (kit bounce), **#888** (kit range gate),
 * **#1252** (Glass pack melee), **#1160** (Glass Strike/incoming).
 * Do not add `chc` / `heal` / `roll` / `glass` / `bounces` /
 * `apDrainLastTurn`.
 *
 * Do not restack WorldExploration / spellEngine / useBossAI / enemyAI.
 * Restack the kit damage arm onto `executeBossKitSpellSrSoak` after
 * older combat PRs land, then write the returned `hpAfter` (do not feed
 * the soaked packet back through `playerTakesDamage` or RES doubles).
 * Do not undo pack SP soak, kit bounce, or kit range skip.
 */

export const BOSS_KIT_SPELL_SR_STAT = "sr";

/** Catalog Chain Lightning — Void Grandmaster / Starborn Queen / Static / Mirror first-id. */
export const BOSS_KIT_SPELL_SR_FIRE_SPELL_ID = "starter-blast";

export const BOSS_KIT_SPELL_SR_FIRE_DAMAGE = 20;

export const BOSS_KIT_SPELL_SR_FIRE_RANGE = 4;

export type BossKitSpellSrSoakExecute = {
  damage: number;
  hpAfter: number;
  playerDied: boolean;
};

export type BossKitSpellSrSoakArgs = {
  /** Catalog `damage` before player soak (`bRawDmg`). */
  rawDamage: number;
  playerSr: number;
  playerRes: number;
  currentHp: number;
  /** Kit summon short-circuit never reaches this arm. */
  targetIsPlayer: boolean;
  /**
   * Physical / melee soak is RES-only. Kit `physical_attack` first-ids
   * correctly skip SR — not this leftover.
   */
  isSpell: boolean;
  /** Chebyshev from boss to the aimed player tile. */
  chebyshev: number;
  /** Catalog `range`. Kit apply skips `inRange`; this sidecar uses it as the execute gate only. */
  range: number;
};

function finiteNonNeg(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

function finitePct(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

/**
 * Advertised single soak: SR × RES for spells; RES only for physical.
 * Floor at 1 when the packet is positive (matches WX / spellEngine).
 */
export function bossKitSpellAdvertisedSoak(
  rawDamage: number,
  playerSr: number,
  playerRes: number,
  isSpell: boolean,
): number {
  const raw = finiteNonNeg(rawDamage);
  if (raw <= 0) return 0;
  const resFactor = Math.max(0, 1 - finitePct(playerRes) / 100);
  if (!isSpell) {
    return Math.max(1, Math.round(raw * resFactor));
  }
  const srFactor = Math.max(0, 1 - finitePct(playerSr) / 100);
  return Math.max(1, Math.round(raw * srFactor * resFactor));
}

/**
 * Live WX kit damage arm: `playerTakesDamage(raw)` applies RES only.
 * Proven by the source scan in the test file.
 */
export function liveWxBossKitSpellSoak(
  rawDamage: number,
  playerRes: number,
): number {
  const raw = finiteNonNeg(rawDamage);
  if (raw <= 0) return 0;
  const resFactor = Math.max(0, 1 - finitePct(playerRes) / 100);
  return Math.max(1, Math.round(raw * resFactor));
}

export function liveWxBossKitSpellReadsSr(): boolean {
  return false;
}

export function liveWxBossKitSpellUsesPackSpSoak(): boolean {
  return false;
}

export function canExecuteBossKitSpellSrSoak(
  args: BossKitSpellSrSoakArgs,
): boolean {
  if (args.targetIsPlayer !== true) return false;
  if (args.isSpell !== true) return false;
  if (finiteNonNeg(args.chebyshev) > finiteNonNeg(args.range)) return false;
  return (
    bossKitSpellAdvertisedSoak(
      args.rawDamage,
      args.playerSr,
      args.playerRes,
      true,
    ) > 0
  );
}

/** Alias so decide and the cast restack cannot fork. */
export function shouldDecideBossKitSpellSrSoak(
  args: BossKitSpellSrSoakArgs,
): boolean {
  return canExecuteBossKitSpellSrSoak(args);
}

export function bossKitSpellSrSoakHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

export function executeBossKitSpellSrSoak(
  args: BossKitSpellSrSoakArgs,
): BossKitSpellSrSoakExecute | null {
  if (!canExecuteBossKitSpellSrSoak(args)) return null;
  const damage = bossKitSpellAdvertisedSoak(
    args.rawDamage,
    args.playerSr,
    args.playerRes,
    true,
  );
  const hp = finiteNonNeg(args.currentHp);
  const hpAfter = Math.max(0, hp - damage);
  return {
    damage,
    hpAfter,
    playerDied: hpAfter <= 0,
  };
}
