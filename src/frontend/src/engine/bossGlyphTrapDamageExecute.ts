/**
 * Pale Archivist GLYPH_TRAP advertised 15 damage vs live WX / strike path.
 *
 * Announce / guide: invisible glyph traps punish the wrong tile.
 * Production `applyGlyphTrap` (useBossSystem ~1223) returns
 * `damageToPlayer: 15` and removes the matched `glyphedTiles` entry when
 * `targetX/Y` hits a glyph. `applyBossAbility(GLYPH_TRAP, …)` is only
 * reachable from the switch case (~1669) — no `useBossAI` decide and no
 * player Strike / Attack Nearest / castHelpers path ever calls it.
 *
 * Live WorldExploration never reads `bossState.glyphedTiles` on a player
 * cast (only unrelated star-glyph draw / portal colour). The boss-turn
 * `res.damageToPlayer` writer (~16025) would debit 15 *if* an abilityResult
 * carried it, but nothing produces a GLYPH_TRAP result on strike.
 *
 * Unique leftover of **#1212** / mis-attributed in **#1094** to **#925** /
 * **#1089** (those are INK_VEIL occupancy and Pages-of-Doom decide — not
 * the 15-damage execute). Distinct from:
 * - **#925** INK_VEIL portal/crumb snap (placement, not tax)
 * - **#1105** kit-first Cursed Wound vs Ink Veil (decide places glyphs)
 * - **#1094** Enthroned Void ANCHOR walk tax 20 / DAMAGE_IMMUNE
 * - **#1113** / **#1152** WX spawn HP stamp 20 (minion HP, not player tax)
 * - **#948** Twin Monarchs Dawn `damageToPlayer: -10` heal
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem, castHelpers,
 * occupancy, statusEffects, spellEngine, or challengeCompletion. Restack
 * the player-strike / Attack Nearest path onto
 * `executeGlyphTrapStrikeDamage` after older combat PRs land. Do not undo
 * INK_VEIL placement or the boss-turn `damageToPlayer` writer.
 */

export const PALE_ARCHIVIST_ID = "pale_archivist";

export const GLYPH_TRAP_ABILITY = "GLYPH_TRAP";

export const INK_VEIL_ABILITY = "INK_VEIL";

export const ANCHOR_TILES_ABILITY = "ANCHOR_TILES";

/** Production `applyGlyphTrap` `damageToPlayer`. */
export const GLYPH_TRAP_DAMAGE = 15;

/** Enthroned Void anchor-step tax — different boss / trigger / number. */
export const ENTHRONED_VOID_ANCHOR_STEP_DAMAGE = 20;

export const GLYPH_TRAP_LOG_NEEDLE =
  "Glyph Trap! You struck the wrong tile and take 15 damage!";

export type GlyphTileLike = {
  x: number;
  y: number;
  turnsLeft?: number;
};

export type GlyphTrapStrikeInput = {
  /** Live `bossState.glyphedTiles` (INK_VEIL / ANCHOR share the field). */
  glyphedTiles: ReadonlyArray<GlyphTileLike>;
  /** Tile the player Strike / spell / Attack Nearest targeted. */
  targetX: number;
  targetY: number;
  /** Pre-debit player HP. */
  playerHp: number;
  /** Optional Shield Charm absorb before the tax. */
  shieldHp?: number;
  /** When false, never tax (modifier / battle gate). Default true. */
  trapArmed?: boolean;
};

export type GlyphTrapStrikeResult = {
  triggered: boolean;
  damageToPlayer: number;
  absorbed: number;
  finalDamage: number;
  newPlayerHp: number;
  remainingGlyphs: GlyphTileLike[];
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

export function isGlyphTrapAbility(ability: string | null | undefined): boolean {
  return ability === GLYPH_TRAP_ABILITY;
}

/** True when the strike tile matches a live glyphed entry. */
export function isGlyphTrapTile(
  glyphedTiles: ReadonlyArray<GlyphTileLike>,
  targetX: number,
  targetY: number,
): boolean {
  const tx = finiteNumber(targetX);
  const ty = finiteNumber(targetY);
  if (tx == null || ty == null) return false;
  return glyphedTiles.some((g) => g.x === tx && g.y === ty);
}

/**
 * Advertised Pale Archivist tax: 15 on a matched glyph tile, else 0.
 * Does not apply Enthroned Void anchor-step 20.
 */
export function advertisedGlyphTrapDamage(opts: {
  glyphedTiles: ReadonlyArray<GlyphTileLike>;
  targetX: number;
  targetY: number;
  trapArmed?: boolean;
}): number {
  if (opts.trapArmed === false) return 0;
  if (!isGlyphTrapTile(opts.glyphedTiles, opts.targetX, opts.targetY)) {
    return 0;
  }
  return GLYPH_TRAP_DAMAGE;
}

export function shouldDecideGlyphTrapStrikeDamage(opts: {
  glyphedTiles: ReadonlyArray<GlyphTileLike>;
  targetX: number;
  targetY: number;
  trapArmed?: boolean;
}): boolean {
  return advertisedGlyphTrapDamage(opts) > 0;
}

export function canExecuteGlyphTrapStrikeDamage(opts: {
  glyphedTiles: ReadonlyArray<GlyphTileLike>;
  targetX: number;
  targetY: number;
  trapArmed?: boolean;
  playerHp: number;
}): boolean {
  if (!shouldDecideGlyphTrapStrikeDamage(opts)) return false;
  const hp = finiteNumber(opts.playerHp);
  return hp != null && hp > 0;
}

/**
 * Commit advertised GLYPH_TRAP 15 onto player HP and drop the matched glyph.
 * Mirror of production `applyGlyphTrap` + WX `res.damageToPlayer` absorb path.
 */
export function executeGlyphTrapStrikeDamage(
  opts: GlyphTrapStrikeInput,
): GlyphTrapStrikeResult {
  const tiles = [...opts.glyphedTiles];
  const matchIdx = tiles.findIndex(
    (g) => g.x === opts.targetX && g.y === opts.targetY,
  );
  const hp = finiteNumber(opts.playerHp) ?? 0;
  if (
    opts.trapArmed === false ||
    matchIdx === -1 ||
    !canExecuteGlyphTrapStrikeDamage({
      glyphedTiles: opts.glyphedTiles,
      targetX: opts.targetX,
      targetY: opts.targetY,
      trapArmed: opts.trapArmed,
      playerHp: hp,
    })
  ) {
    return {
      triggered: false,
      damageToPlayer: 0,
      absorbed: 0,
      finalDamage: 0,
      newPlayerHp: Math.max(0, hp),
      remainingGlyphs: tiles,
    };
  }

  const remainingGlyphs = tiles.filter((_, idx) => idx !== matchIdx);
  const raw = GLYPH_TRAP_DAMAGE;
  const shield = Math.max(0, finiteNumber(opts.shieldHp) ?? 0);
  const absorbed = Math.min(shield, raw);
  const finalDamage = raw - absorbed;
  return {
    triggered: true,
    damageToPlayer: raw,
    absorbed,
    finalDamage,
    newPlayerHp: Math.max(0, hp - finalDamage),
    remainingGlyphs,
  };
}

/** Live leftover: strike never consults glyphedTiles, so HP is unchanged. */
export function liveWxGlyphTrapStrikeHp(opts: {
  playerHp: number;
}): number {
  return Math.max(0, finiteNumber(opts.playerHp) ?? 0);
}
