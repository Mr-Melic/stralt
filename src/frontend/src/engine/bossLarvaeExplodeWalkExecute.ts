/**
 * Broodmother Rook LARVAE_EXPLODE advertised contact venom vs live WX walk.
 *
 * Announce / lore / admin: larvae explode on contact (poison). Production
 * `applyLarvaeExplode` (`useBossSystem.ts` ~693) returns
 * `dotApplied: [{ damage: 5, duration: 3, type: "poison",
 * effectName: "Larva Venom" }]` when the player steps on a larva tile.
 * `applyBossAbility(LARVAE_EXPLODE, …)` is only reachable from the switch
 * case (~1607). `decideBroodmotherRookAction` never decides it — the
 * comment says phase-2 explode is "handled on player movement side".
 *
 * Live WorldExploration never mentions `larvae` / `LARVAE_EXPLODE` /
 * `Larva Venom`. `applyBattleWalkHazards` only taxes Thorned Ground and
 * Void Rift. The boss-turn `res.dotApplied` writer (~16064) would attach
 * the 5×3 DoT *if* an abilityResult carried it, but nothing produces a
 * LARVAE_EXPLODE result on walk.
 *
 * Sequence: Broodmother phase 2, larva at (5,5), player HP 100, walk onto
 * that tile.
 *
 * | | Expected | Actual (live WX) |
 * |---|---|---|
 * | DoT | Larva Venom 5/turn × 3 | none |
 * | Matched larva | consumed by explode | remains |
 *
 * Unique vs **#920** (LARVAE_SPAWN portal/crumb snap — placement, not
 * contact tax), kit-first `summon-archer` decide leftover (**#498** /
 * **#888** / **#861**), **#1216** Pale Archivist GLYPH_TRAP Strike 15
 * (different boss / trigger / number), **#1094** Enthroned Void ANCHOR
 * walk tax 20, leftover-walk lava/spikes (**#546** / **#1100** — map
 * hazard tiles, not `bossState.larvae`), **#728** summon landing,
 * **#1123** hunter Venom LoS, Shell Armor `larvae.length` halve in
 * `castHelpers` (RES, not explode DoT). `starter-poison` is 4/turn —
 * not this 5. Phase-1 spawn without LARVAE_EXPLODE must not tax.
 *
 * Do not restack WorldExploration, useBossAI, useBossSystem, castHelpers,
 * battleSetup walk hazards, occupancy, statusEffects, spellEngine, or
 * leftover-walk rAF. Restack the player-walk / leftover-walk dest onto
 * `executeLarvaeExplodeWalk` after older combat PRs land. Do not undo
 * LARVAE_SPAWN placement, Shell Armor, or the boss-turn `dotApplied`
 * writer.
 */

export const BROODMOTHER_ROOK_ID = "broodmother_rook";

export const LARVAE_EXPLODE_ABILITY = "LARVAE_EXPLODE";

export const LARVAE_SPAWN_ABILITY = "LARVAE_SPAWN";

export const SHELL_ARMOR_ABILITY = "SHELL_ARMOR";

export const GLYPH_TRAP_ABILITY = "GLYPH_TRAP";

/** Production `applyLarvaeExplode` poison DoT. */
export const LARVA_VENOM_DAMAGE_PER_TURN = 5;

export const LARVA_VENOM_DURATION = 3;

export const LARVA_VENOM_EFFECT_NAME = "Larva Venom";

export const LARVA_VENOM_ICON = "💚";

export const LARVA_VENOM_DOT_TYPE = "poison";

/** Catalog Poison Arrow — different id / 4 per turn. Not this execute. */
export const STARTER_POISON_DAMAGE_PER_TURN = 4;

/** Pale Archivist glyph Strike tax — different boss / trigger / number. */
export const GLYPH_TRAP_DAMAGE = 15;

/** Enthroned Void anchor-step tax — different boss / trigger / number. */
export const ENTHRONED_VOID_ANCHOR_STEP_DAMAGE = 20;

/** Source needle — `useBossSystem` stores the em-dash as the `\u2014` escape. */
export const LARVAE_EXPLODE_LOG_NEEDLE =
  "A larva explodes on contact! Venom applied \\u2014 5 damage/turn for 3 turns!";

export type LarvaTileLike = {
  x: number;
  y: number;
  id?: string;
  hp?: number;
  poisoned?: boolean;
};

export type LarvaeExplodeWalkInput = {
  /** Live `bossState.larvae` markers (occupancy does not see these). */
  larvae: ReadonlyArray<LarvaTileLike>;
  /** Tile the player walk / leftover-walk dest landed on. */
  destX: number;
  destY: number;
  /** Pre-contact player HP (DoT does not debit HP this tick). */
  playerHp: number;
  /**
   * Phase-2 contact gate. Phase 1 specials are spawn + shell only.
   * Default true so a restacked walk path can pass the armed flag.
   */
  explodeArmed?: boolean;
};

export type LarvaVenomDot = {
  damage: number;
  duration: number;
  type: typeof LARVA_VENOM_DOT_TYPE;
  effectName: string;
  iconEmoji: string;
};

export type LarvaeExplodeWalkResult = {
  triggered: boolean;
  dotApplied: LarvaVenomDot[];
  newPlayerHp: number;
  remainingLarvae: LarvaTileLike[];
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

export function isLarvaeExplodeAbility(
  ability: string | null | undefined,
): boolean {
  return ability === LARVAE_EXPLODE_ABILITY;
}

/** True when the walk dest matches a live larva marker. */
export function isLarvaContactTile(
  larvae: ReadonlyArray<LarvaTileLike>,
  destX: number,
  destY: number,
): boolean {
  const x = finiteNumber(destX);
  const y = finiteNumber(destY);
  if (x == null || y == null) return false;
  return larvae.some((larva) => larva.x === x && larva.y === y);
}

export function advertisedLarvaVenomDot(opts: {
  larvae: ReadonlyArray<LarvaTileLike>;
  destX: number;
  destY: number;
  explodeArmed?: boolean;
}): LarvaVenomDot | null {
  if (opts.explodeArmed === false) return null;
  if (!isLarvaContactTile(opts.larvae, opts.destX, opts.destY)) return null;
  return {
    damage: LARVA_VENOM_DAMAGE_PER_TURN,
    duration: LARVA_VENOM_DURATION,
    type: LARVA_VENOM_DOT_TYPE,
    effectName: LARVA_VENOM_EFFECT_NAME,
    iconEmoji: LARVA_VENOM_ICON,
  };
}

export function shouldDecideLarvaeExplodeWalk(opts: {
  larvae: ReadonlyArray<LarvaTileLike>;
  destX: number;
  destY: number;
  explodeArmed?: boolean;
}): boolean {
  return advertisedLarvaVenomDot(opts) !== null;
}

export function canExecuteLarvaeExplodeWalk(opts: {
  larvae: ReadonlyArray<LarvaTileLike>;
  destX: number;
  destY: number;
  explodeArmed?: boolean;
  playerHp: number;
}): boolean {
  if (!shouldDecideLarvaeExplodeWalk(opts)) return false;
  const hp = finiteNumber(opts.playerHp);
  return hp != null && hp > 0;
}

/**
 * Commit advertised contact venom onto the player and consume the matched
 * larva. Instant HP is unchanged this tick (DoT ticks later). Mirror of
 * production `applyLarvaeExplode` + WX `res.dotApplied` (consume is the
 * explode; apply currently omits `newBossState.larvae` — restack both).
 */
export function executeLarvaeExplodeWalk(
  opts: LarvaeExplodeWalkInput,
): LarvaeExplodeWalkResult {
  const larvae = [...opts.larvae];
  const matchIdx = larvae.findIndex(
    (larva) => larva.x === opts.destX && larva.y === opts.destY,
  );
  const hp = finiteNumber(opts.playerHp) ?? 0;
  if (
    opts.explodeArmed === false ||
    matchIdx === -1 ||
    !canExecuteLarvaeExplodeWalk({
      larvae: opts.larvae,
      destX: opts.destX,
      destY: opts.destY,
      explodeArmed: opts.explodeArmed,
      playerHp: hp,
    })
  ) {
    return {
      triggered: false,
      dotApplied: [],
      newPlayerHp: Math.max(0, hp),
      remainingLarvae: larvae,
    };
  }

  const remainingLarvae = larvae.filter((_, idx) => idx !== matchIdx);
  const dot = advertisedLarvaVenomDot({
    larvae: opts.larvae,
    destX: opts.destX,
    destY: opts.destY,
    explodeArmed: true,
  });
  return {
    triggered: true,
    dotApplied: dot ? [dot] : [],
    newPlayerHp: Math.max(0, hp),
    remainingLarvae,
  };
}

/** Live leftover: walk never consults `bossState.larvae`, so no DoT. */
export function liveWxLarvaeExplodeWalkDots(): LarvaVenomDot[] {
  return [];
}
