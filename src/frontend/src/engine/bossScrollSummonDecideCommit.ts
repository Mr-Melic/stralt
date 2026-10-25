/**
 * Pale Archivist advertises SCROLL_SUMMON (`bossDefaults` phase-1
 * specialAbilities, useBossAI "Summon a scroll each turn", Boss Guide
 * "Summons scroll minions with ranged attacks. Prioritize scrolls if
 * they block your path.").
 *
 * Live leftover — decide. `decidePaleArchivistAction` calls
 * `pickBossKitSpell` with `new Map()`, so the first pool id
 * (`spell-cursed-wound` phase 1 / `spell-mark` phase 2) is decided
 * every turn. SCROLL_SUMMON sits *after* that return
 * (`currentTurn % 2 === 1`). Advertised 30 HP Ancient Scroll
 * guardians never spawn, so after the 350 HP boss dies
 * `shouldAwardVictory` fires immediately — a leftover 30 HP scroll
 * would still block it (Strike 10 leaves 20).
 *
 * Unique vs:
 * - **#1089** `bossPagesOfDoomDecideCommit` — even phase-2
 *   PAGES_OF_DOOM. This sidecar does **not** steal even-turn Pages.
 * - **#888** first-id execute *range* — that sidecar still *decides*
 *   the kit spell. Phase-1 even-turn INK_VEIL stays there.
 * - **#910** boss kit `summon-archer` execute range — kit fourth-id,
 *   not SCROLL_SUMMON.
 * - **#933** occupancyAdjacentSpawnUnseal — portal-crumb snap of
 *   planted scrolls. This sidecar does **not** relocate dests.
 * - **#1058** Midnight Bishop MERGE blocked by kit Mirror.
 * - **#1094** Enthroned Void ANCHOR_TILES.
 *
 * WX spawn commit still overwrites advertised hp 30 / atk 8 with the
 * init formula and stamps `enemyHpMap[id] = 20` — execute leftover,
 * not restored here. Even-turn INK_VEIL after kit fail is a second
 * leftover.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancy, statusEffects, spellEngine, or challengeCompletion.
 * Restack `decidePaleArchivistAction` onto
 * `resolvePaleArchivistOddTurnDecide` after older combat PRs land.
 */

import { hpAfterIncomingDamage, shouldAwardVictory } from "./battleSetup.ts";

export const PALE_ARCHIVIST_ID = "pale_archivist";

export const SCROLL_SUMMON_ABILITY = "SCROLL_SUMMON";

export const PAGES_OF_DOOM_ABILITY = "PAGES_OF_DOOM";

export const INK_VEIL_ABILITY = "INK_VEIL";

export const MERGE_BISHOPS_ABILITY = "MERGE_BISHOPS";

export const ANCHOR_TILES_ABILITY = "ANCHOR_TILES";

/** Phase-2 first kit id (`bossKits` `phase2SpellIds[0]`). */
export const PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID = "spell-mark";

/** Phase-1 first kit id — even-turn INK_VEIL leftover, not this sidecar. */
export const PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID = "spell-cursed-wound";

/** Midnight Bishop phase-2 first-id — #1058 leftover, not this sidecar. */
export const MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID = "spell-mirror";

/** Kit fourth-id — #910 leftover, not this sidecar. */
export const PALE_ARCHIVIST_KIT_SUMMON_ARCHER_ID = "summon-archer";

/** Production `currentTurn % 2 === 1`. */
export const SCROLL_SUMMON_ODD_MOD = 2;

/** Production `applyScrollSummon` guardian HP. */
export const SCROLL_SUMMON_HP = 30;

/** Production `applyScrollSummon` guardian atk. */
export const SCROLL_SUMMON_ATK = 8;

/** Production `applyScrollSummon` guardian AP. */
export const SCROLL_SUMMON_AP = 3;

/** Production `applyBossAbility` default when extra.summonCount is missing. */
export const SCROLL_SUMMON_DEFAULT_COUNT = 3;

/** Production `bossDefaults` phase-1 `summonCount`. */
export const SCROLL_SUMMON_PHASE1_COUNT = 3;

/** Production `bossDefaults` phase-2 `summonCount` (catalog omits the ability). */
export const SCROLL_SUMMON_PHASE2_COUNT = 2;

export const SCROLL_SUMMON_LOG_NEEDLE = "The Pale Archivist summons";

export const SCROLL_SUMMON_FULL_LOG_NEEDLE = "battlefield is full";

export type PaleArchivistPhase = 1 | 2;

export type PaleArchivistDecideAction = {
  type: "spell" | "ability" | "summon" | "attack" | "move" | "skip";
  spellId?: string;
  ability?: string;
};

export type PaleArchivistDecideInput = {
  currentPhase: PaleArchivistPhase;
  currentTurn: number;
  kitSpellId: string | null;
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

/** Production odd-turn Scroll cadence (`currentTurn % 2 === 1`). */
export function isPaleArchivistScrollSummonTurn(currentTurn: number): boolean {
  const turn = finiteNumber(currentTurn);
  if (turn == null) return false;
  return turn % SCROLL_SUMMON_ODD_MOD === 1;
}

/**
 * Production `decidePaleArchivistAction` order: kit first-id, then
 * PAGES_OF_DOOM on even phase 2, then SCROLL_SUMMON on odd turns.
 * This leftover only models the kit-vs-odd-Scroll fork — even Pages
 * stays **#1089**.
 */
export function wxPaleArchivistOddTurnDecide(
  opts: PaleArchivistDecideInput,
): PaleArchivistDecideAction {
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  if (isPaleArchivistScrollSummonTurn(opts.currentTurn)) {
    return { type: "summon", ability: SCROLL_SUMMON_ABILITY };
  }
  return { type: "skip" };
}

/**
 * Prefer SCROLL_SUMMON on odd turns so advertised Ancient Scroll
 * guardians can spawn. Even turns still let kit first-id win
 * (PAGES_OF_DOOM **#1089** / INK_VEIL leftover).
 */
export function resolvePaleArchivistOddTurnDecide(
  opts: PaleArchivistDecideInput,
): PaleArchivistDecideAction {
  if (isPaleArchivistScrollSummonTurn(opts.currentTurn)) {
    return { type: "summon", ability: SCROLL_SUMMON_ABILITY };
  }
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  return { type: "skip" };
}

/** True when live decide spends an odd-turn Scroll plant on kit first-id. */
export function wxPaleArchivistKitBlocksScroll(
  opts: PaleArchivistDecideInput,
): boolean {
  const live = wxPaleArchivistOddTurnDecide(opts);
  const next = resolvePaleArchivistOddTurnDecide(opts);
  return live.type === "spell" && next.type === "summon";
}

/** Advertised Strike vs a 30 HP scroll — WX formula overwrite is not this. */
export function scrollHpAfterStrike(opts: {
  scrollHp: number;
  strikeDamage: number;
}): number {
  return hpAfterIncomingDamage(opts.scrollHp, opts.strikeDamage).newHp;
}

/**
 * Living Pale Archivist + leftover Ancient Scrolls. Enemy-side
 * non-summon scrolls (`applyScrollSummon` does not set `isSummon`)
 * stay hostile, so a leftover 20 HP guardian after Strike 10 blocks
 * `shouldAwardVictory` once the 350 HP boss is already dead.
 */
export function paleArchivistHostilesRemaining(opts: {
  bossHp: number;
  scrollHp: number;
}): number {
  const boss = finiteNumber(opts.bossHp) ?? 0;
  const scroll = finiteNumber(opts.scrollHp) ?? 0;
  return (boss > 0 ? 1 : 0) + (scroll > 0 ? 1 : 0);
}

export function leftoverScrollBlocksVictory(opts: {
  inBattle: boolean;
  deathTriggered: boolean;
  battleStartIdsSize: number;
  bossHp: number;
  scrollHp: number;
}): boolean {
  const hostilesRemaining = paleArchivistHostilesRemaining({
    bossHp: opts.bossHp,
    scrollHp: opts.scrollHp,
  });
  return (
    opts.scrollHp > 0 &&
    opts.bossHp <= 0 &&
    !shouldAwardVictory({
      inBattle: opts.inBattle,
      deathTriggered: opts.deathTriggered,
      battleStartIdsSize: opts.battleStartIdsSize,
      hostilesRemaining,
    })
  );
}
