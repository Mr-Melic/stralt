/**
 * Pack/regular enemy cast soak uses player Spell Power (SP) instead of
 * advertised Spell Resistance (SR), then `playerTakesDamage` re-applies RES.
 *
 * Advertised (spellEngine / WX computeDamage comments):
 *   spells: finalDamage = base * (1 - SR/100) * (1 - RES/100)
 *   physical/DoT: finalDamage = base * (1 - RES/100)
 *
 * Live WorldExploration pack cast arm (~16474–16568):
 *   plSpEff = characterStats.sp * getStatModifier("player", "sp", …)
 *   dmg = dmgAC * (1 - plSpEff/100) * (1 - plResEff/100)
 *   playerTakesDamage(dmg)  // applies RES again
 *
 * Starting champion has SP 8 and SR 5 as distinct fields
 * (`startingChampionStats`). HUD labels SR separately. Pack fallback
 * melee (~16704) correctly uses RES only via a raw HP write — leave it.
 * Boss kit damage (~15864) skips SR and goes through `playerTakesDamage`
 * only — leftover of **#1104** ("kit SP"); leave.
 *
 * Sequence: pack cast Chain Lightning raw 20 vs player SR 50 / SP 0 /
 * RES 0 / HP 100 → expected 10, live 20.
 *
 * Unique vs **#1104** (boss kit CHC / kit SP leftover), **#1107**
 * (Crush/Fire Bolt CHC), **#1252** (Glass Realm pack melee), **#1160**
 * (Glass Strike/incoming), **#659** (Shield RES), **#921** (player Life
 * Drain SP as offensive buff). Do not add `chc` / `heal` / `roll` /
 * `glass` / `apDrainLastTurn`.
 *
 * Do not restack WorldExploration / spellEngine / enemyAI / useBossAI.
 * Restack the pack cast soak onto `executePackEnemySpellSrSoak` after
 * older combat PRs land, then write the returned `hpAfter` (do not feed
 * the soaked packet back through `playerTakesDamage` or RES doubles).
 */

export const PACK_ENEMY_SPELL_SR_STAT = "sr";

export const PACK_ENEMY_SPELL_SP_STAT_LIVE = "sp";

/** Catalog Chain Lightning — common pack/boss damage packet. */
export const PACK_ENEMY_SPELL_SR_FIRE_SPELL_ID = "starter-blast";

export const PACK_ENEMY_SPELL_SR_FIRE_DAMAGE = 20;

export type PackEnemySpellSrSoakExecute = {
  damage: number;
  hpAfter: number;
  playerDied: boolean;
};

export type PackEnemySpellSrSoakArgs = {
  /** Post-scale / post-crit packet before player soak (`dmgAC`). */
  rawDamage: number;
  playerSr: number;
  playerRes: number;
  /** Live WX wrongly reads this for spell soak. */
  playerSp: number;
  currentHp: number;
  /** Summon-target cast routes through `enemyTakesDamage` (RES only). */
  targetIsPlayer: boolean;
  /**
   * Physical / DoT packets skip SR. Pack cast arm only runs this soak for
   * damage/drain spells (`spellType === "damage" | "drain"`, damage > 0).
   */
  isSpell: boolean;
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
export function packEnemySpellAdvertisedSoak(
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
 * Live WX pack cast soak: uses SP (not SR), then `playerTakesDamage`
 * multiplies RES again. Proven by the source scan in the test file.
 */
export function liveWxPackEnemySpellSoak(
  rawDamage: number,
  playerSp: number,
  playerRes: number,
): number {
  const raw = finiteNonNeg(rawDamage);
  if (raw <= 0) return 0;
  const spFactor = Math.max(0, 1 - finitePct(playerSp) / 100);
  const resFactor = Math.max(0, 1 - finitePct(playerRes) / 100);
  const afterPack = Math.max(1, Math.round(raw * spFactor * resFactor));
  // playerTakesDamage re-applies RES only.
  return Math.max(1, Math.round(afterPack * resFactor));
}

export function liveWxPackEnemySpellUsesSpNotSr(): boolean {
  return true;
}

export function liveWxPackEnemySpellDoubleAppliesRes(): boolean {
  return true;
}

export function canExecutePackEnemySpellSrSoak(
  args: PackEnemySpellSrSoakArgs,
): boolean {
  if (args.targetIsPlayer !== true) return false;
  if (args.isSpell !== true) return false;
  return (
    packEnemySpellAdvertisedSoak(
      args.rawDamage,
      args.playerSr,
      args.playerRes,
      true,
    ) > 0
  );
}

/** Alias so decide and the cast restack cannot fork. */
export function shouldDecidePackEnemySpellSrSoak(
  args: PackEnemySpellSrSoakArgs,
): boolean {
  return canExecutePackEnemySpellSrSoak(args);
}

export function packEnemySpellSrSoakHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

export function executePackEnemySpellSrSoak(
  args: PackEnemySpellSrSoakArgs,
): PackEnemySpellSrSoakExecute | null {
  if (!canExecutePackEnemySpellSrSoak(args)) return null;
  const damage = packEnemySpellAdvertisedSoak(
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
