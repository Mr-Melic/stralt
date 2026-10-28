/**
 * Pale Archivist SCROLL_SUMMON advertised atk 8 never commits.
 *
 * Advertised (`applyScrollSummon`, useBossSystem ~1171–1218):
 *   pieceType bishop, hp 30, ap 3, atk 8, res 0, init 6
 *   id `scroll_${bossId}_${Date.now()}_${i}`
 *
 * Live WorldExploration spawn commit (~16104–16189):
 *   level = max(1, boss.init - 2)           // Pale Archivist init 10 → 8
 *   hp/maxHp formula then enemyHpMap stamp 20  // leftover of #1113
 *   damage = max(1, round((init-2)*2+3))    // 19 — unused by melee
 *   atk: 0, ap: 0                           // advertised 8 / 3 discarded
 *
 * Live pack fallback melee (~16704) never reads enemy.atk / enemy.damage.
 * Adjacent minion Crush (`e-crush` 12) * max(1, level/5) = 19
 * (Fire Bolt 8 * same scale = 13). Scrolls spawn on adjacent free tiles
 * then act; occupancy blocks Chebyshev 0, so the hit is adjacent melee
 * (or Fire Bolt from the same pool). Bishop kit Frost/Poison is never
 * assigned (`family: ""`, no ENEMY_KITS write on res.spawns).
 *
 * Sequence: Pale Archivist scroll bishop adjacent, Crush vs player
 * 100 HP / 0 RES.
 *
 * | | Expected | Actual (live WX) |
 * |---|---|---|
 * | packet | 8 | Crush 19 (unused damage field 19) |
 * | player HP | 92 | 81 |
 *
 * 19 HP player: advertised 8 leaves 11; live Crush 19 kills.
 *
 * Unique vs **#1113** (scroll bishop HP stamp 20; this sidecar does not
 * restore HP 30 or ap 3), **#1102** (kit-first Mark / Cursed Wound still
 * shadows the odd-turn decide), **#1264** (Final Pawn ghost king atk 5;
 * Crush 12 from init 4), **#1259** (Enthroned Void phantom pawn contact
 * atk 5; Crush 38 from init 18), **#1271** (Fetid split-rook atk 25),
 * **#1231** (split-rook half-HP), **#1252** (Glass Realm pack melee ×2),
 * **#1107** (Crush CHC). Do not add `hp` / `ap` / `chc` / `heal` /
 * `roll` / `glass` / `glyph` / `venom` / `decide`.
 *
 * Export names stay unique vs `#1113` (`SCROLL_SUMMON_ATK`,
 * `resolveScrollSummonCommittedHp`, `isScrollSummonSpawn`,
 * `wxBossMinionFormulaDamage`, `PALE_ARCHIVIST_INIT`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem / enemyAI.
 * Restack spawn mapping onto `resolveScrollSummonCommittedAtk` and the
 * player-target melee HP write onto `executeScrollSummonAtk` after those
 * PRs land. Do not undo ADD-vs-REPLACE (`#433`), the skeleton-20 stamp,
 * kit-first Cursed Wound (`#1102`), or the scroll HP stamp (`#1113`).
 */

export const SCROLL_SUMMON_ATK_PACKET = 8;

export const SCROLL_SUMMON_ATK_ID_PREFIX = "scroll_";

export const SCROLL_SUMMON_ATK_PIECE = "bishop";

export const SCROLL_SUMMON_ATK_BOSS_ID = "pale_archivist";

/** Catalog Pale Archivist `baseStats.init`. */
export const SCROLL_SUMMON_ATK_BOSS_INIT = 10;

/** Advertised AP — leftover, not restored here. */
export const SCROLL_SUMMON_ATK_AP_LEFTOVER = 3;

export const SCROLL_SUMMON_ATK_CRUSH_ID = "e-crush";

export const SCROLL_SUMMON_ATK_CRUSH_DAMAGE = 12;

export const SCROLL_SUMMON_ATK_FIRE_BOLT_DAMAGE = 8;

export type ScrollSummonAtkExecute = {
  damage: number;
  hpAfter: number;
  playerDied: boolean;
};

export type ScrollSummonAtkArgs = {
  minionId: string;
  advertisedAtk: number;
  currentHp: number;
  playerRes: number;
  /** Summon-target melee already routes through `enemyTakesDamage`. */
  targetIsPlayer: boolean;
  /** Occupancy blocks Chebyshev 0; the hit is adjacent melee. */
  adjacent: boolean;
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

export function isScrollSummonAtkMinionId(minionId: string): boolean {
  return minionId.startsWith(SCROLL_SUMMON_ATK_ID_PREFIX);
}

/** Live WX spawn `level = max(1, boss.init - 2)`. */
export function liveWxScrollSummonMappedLevel(bossInit: number): number {
  return Math.max(1, finiteNonNeg(bossInit) - 2);
}

/**
 * Live WX spawn `damage` field. Unused by pack fallback melee; proven
 * leftover of the formula that also writes `atk: 0`.
 */
export function liveWxScrollSummonMappedDamage(bossInit: number): number {
  const level = liveWxScrollSummonMappedLevel(bossInit);
  return Math.max(1, Math.round(level * 2 + 3));
}

export function liveWxScrollSummonMappedAtk(): number {
  return 0;
}

/** Live pack fallback melee: Crush 12 / Fire Bolt 8 × max(1, level/5). */
export function liveWxScrollSummonMeleeFallback(
  catalogDamage: number,
  level: number,
  enrageMultiplier = 1,
): number {
  const raw = finiteNonNeg(catalogDamage);
  if (raw <= 0) return 0;
  return Math.max(
    1,
    Math.round(
      raw *
        Math.max(1, finiteNonNeg(level) / 5) *
        finiteNonNeg(enrageMultiplier),
    ),
  );
}

/** Advertised physical soak: RES only (scroll atk is not a spell). */
export function scrollSummonAdvertisedAtkSoak(
  advertisedAtk: number,
  playerRes: number,
): number {
  const raw = finiteNonNeg(advertisedAtk);
  if (raw <= 0) return 0;
  const resFactor = Math.max(0, 1 - finitePct(playerRes) / 100);
  return Math.max(1, Math.round(raw * resFactor));
}

export function canExecuteScrollSummonAtk(args: ScrollSummonAtkArgs): boolean {
  if (args.targetIsPlayer !== true) return false;
  if (args.adjacent !== true) return false;
  if (!isScrollSummonAtkMinionId(args.minionId)) return false;
  return scrollSummonAdvertisedAtkSoak(args.advertisedAtk, args.playerRes) > 0;
}

/** Alias so decide and the melee restack cannot fork. */
export function shouldDecideScrollSummonAtk(
  args: ScrollSummonAtkArgs,
): boolean {
  return canExecuteScrollSummonAtk(args);
}

export function scrollSummonAtkHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Spawn-mapping restack: keep advertised atk 8 on `scroll_` bishop rows.
 * Ghost / phantom / split-rook / skeleton rows return null (siblings).
 */
export function resolveScrollSummonCommittedAtk(args: {
  minionId: string;
  advertisedAtk: number;
}): number | null {
  if (!isScrollSummonAtkMinionId(args.minionId)) return null;
  const atk = finiteNonNeg(args.advertisedAtk);
  if (atk <= 0) return null;
  return atk;
}

export function executeScrollSummonAtk(
  args: ScrollSummonAtkArgs,
): ScrollSummonAtkExecute | null {
  if (!canExecuteScrollSummonAtk(args)) return null;
  const damage = scrollSummonAdvertisedAtkSoak(
    args.advertisedAtk,
    args.playerRes,
  );
  const hp = finiteNonNeg(args.currentHp);
  const hpAfter = Math.max(0, hp - damage);
  return {
    damage,
    hpAfter,
    playerDied: hpAfter <= 0,
  };
}
