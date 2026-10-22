/**
 * Pack `ENEMY_KITS` resolve vs the live backend-only spell pool.
 *
 * Battle start (`WorldExploration.tsx` ~11919) does:
 *   kitIds = buildEnemyKit(pieceType, currentMap.levelZone)
 *   kitIds.map(id => normalizedSpellPool.find(s => s.id === id))
 *
 * When `filteredBackendSpells.length > 0` the pool is **backend-only**
 * (not `starterSpells`). Motoko `AdminLib.defaultSpells` ids are
 * shadow_strike / soul_rend / vampire_bite / reflect_barrier /
 * thunder_clap / void_collapse — none of the kit ids (starter-frost,
 * physical_attack, starter-poison, spell-venom-strike, spell-iron-skin,
 * spell-inferno, starter-heal, spell-rallying-cry). `physical_attack`
 * is also in `OLD_SPELL_NAMES_SET` and stripped from backend. Result:
 * every pack enemy gets `spells: []`.
 *
 * Enemy apply (~16268) then filters `usableByEnemy !== false` on that
 * empty list. `pickBestDamageSpell` on empty `availableSpells` returns
 * null → walk / adjacent Crush only. Bishop / queen / king never cast
 * advertised Frost Bolt (range 4, 20 dmg, MP −1).
 *
 * Mock / empty-catalog sibling: pool IS starterSpells, find succeeds,
 * but normalize defaults `usableByEnemy: false` then spreads the row.
 * Catalog Frost Bolt does not set the flag, so the default sticks and
 * apply drops every zone-0 caster kit id. Comment at ~11917 says
 * undefined/null = allowed — normalize contradicts that.
 *
 * This module is the assign gate. Catalog row wins when it is
 * present **and** `usableByEnemy !== false`. Otherwise the starter
 * registry fills the kit id (so WX `normalizedSpellPool` — which
 * defaults `usableByEnemy: false` before `...s` — can be passed as
 * catalogPool on restack). Retired `physical_attack` stays
 * Crush-fallback (do not revive OLD ids). Starter rows with explicit
 * `usableByEnemy: false` (Rallying Cry) stay skipped. Unset flags
 * are allowed and written `true` so apply cannot drop them.
 *
 * Unique vs #842 (hostile summon routing), #861 (auto-summon empty
 * spells at spawn), #905 (player Frost Bolt MP), #888/#910 (boss
 * first-id range/summon). WorldExploration / enemyAI / spellData /
 * targeting left untouched so older open PRs stay merge-clean.
 * Restack `assignEnemySpells` onto `assignPackEnemyKitSpells` after
 * those PRs land. Do not change Crush math, pickBestDamageSpell, or
 * zone numbering.
 */

import type { ChessPieceType, SpellConfig } from "../types/gameTypes.ts";
import { buildEnemyKit } from "./enemyAI.ts";

export type PackEnemyKitSpell = Pick<SpellConfig, "id"> &
  Partial<SpellConfig> & {
    usableByEnemy?: boolean;
  };

/** Motoko `AdminLib.defaultSpells` ids. None are pack kit ids. */
export const MOTOKO_DEFAULT_SPELL_IDS = [
  "shadow_strike",
  "soul_rend",
  "vampire_bite",
  "reflect_barrier",
  "thunder_clap",
  "void_collapse",
] as const;

/**
 * Kit ids that live `OLD_SPELL_NAMES_SET` strips from the backend pool.
 * Pawn / knight / rook zone-0 stay Crush; do not revive Strike as a
 * spell row.
 */
export const PACK_ENEMY_KIT_RETIRED_IDS: ReadonlySet<string> = new Set([
  "physical_attack",
]);

export function isPackEnemyKitRetiredId(id: string): boolean {
  return PACK_ENEMY_KIT_RETIRED_IDS.has(id);
}

/**
 * Same defaults WX `normalizedSpellPool` writes before `...s`.
 * Unset `usableByEnemy` stays false — that is the mock-catalog hole.
 */
export function normalizeSpellPoolForPackAssign<T extends object>(
  pool: readonly T[],
): Array<T & { usableByEnemy: boolean; usableByPlayer: boolean }> {
  return pool.map((s) => ({
    cooldown: 0,
    aoe: false,
    usableByPlayer: true,
    usableByEnemy: false,
    ...s,
  }));
}

function findById<T extends { id: string }>(
  pool: readonly T[],
  id: string,
): T | undefined {
  return pool.find((s) => s.id === id);
}

function packEnemyKitAllowsUsable(row: PackEnemyKitSpell): boolean {
  return row.usableByEnemy !== false;
}

/**
 * Live WX assign: kit ids resolved only against the (backend) pool.
 * No starter fallback, no usableByEnemy coerce.
 */
export function liveAssignPackEnemyKitFromCatalogOnly(
  pieceType: ChessPieceType,
  levelZone: number,
  catalogPool: readonly PackEnemyKitSpell[],
): PackEnemyKitSpell[] {
  return buildEnemyKit(pieceType, levelZone)
    .map((id) => findById(catalogPool, id))
    .filter((s): s is PackEnemyKitSpell => Boolean(s));
}

export function packEnemyKitAvailableSpells(
  assigned: readonly PackEnemyKitSpell[],
  cooldownMap: ReadonlyMap<string, number> = new Map(),
): PackEnemyKitSpell[] {
  return assigned.filter(
    (s) => (cooldownMap.get(s.id) ?? 0) <= 0 && packEnemyKitAllowsUsable(s),
  );
}

/**
 * Intended assign: allowed catalog row wins; otherwise starter fills
 * the kit id. Retired OLD ids are skipped. Starter `usableByEnemy:
 * false` is skipped. Unset flags become `true` so apply `!== false`
 * cannot drop Frost Bolt.
 */
export function assignPackEnemyKitSpells(args: {
  pieceType: ChessPieceType;
  levelZone: number;
  catalogPool: readonly PackEnemyKitSpell[];
  starterRegistry: readonly PackEnemyKitSpell[];
  retiredIds?: ReadonlySet<string>;
}): Array<PackEnemyKitSpell & { usableByEnemy: true }> {
  const retired = args.retiredIds ?? PACK_ENEMY_KIT_RETIRED_IDS;
  const assigned: Array<PackEnemyKitSpell & { usableByEnemy: true }> = [];
  for (const id of buildEnemyKit(args.pieceType, args.levelZone)) {
    if (retired.has(id)) continue;
    const catalogRow = findById(args.catalogPool, id);
    const starterRow = findById(args.starterRegistry, id);
    let row: PackEnemyKitSpell | undefined;
    if (catalogRow && packEnemyKitAllowsUsable(catalogRow)) {
      row = catalogRow;
    } else if (starterRow && packEnemyKitAllowsUsable(starterRow)) {
      row = starterRow;
    }
    if (!row) continue;
    assigned.push({ ...row, usableByEnemy: true });
  }
  return assigned;
}

/** Alias so battle-start assign and apply availableSpells cannot fork. */
export function shouldAssignPackEnemyKitSpells(
  args: Parameters<typeof assignPackEnemyKitSpells>[0],
): Array<PackEnemyKitSpell & { usableByEnemy: true }> {
  return assignPackEnemyKitSpells(args);
}

export function packEnemyKitAssignedIds(
  assigned: readonly PackEnemyKitSpell[],
): string[] {
  return assigned.map((s) => s.id);
}

export function packEnemyKitHasDamageCast(
  assigned: readonly PackEnemyKitSpell[],
): boolean {
  return packEnemyKitAvailableSpells(assigned).some(
    (s) => Number(s.damage ?? 0) > 0,
  );
}
