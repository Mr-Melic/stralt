/**
 * Enthroned Void advertises PHANTOM_SPAWN (`bossDefaults` phase-1
 * specialAbilities, useBossAI "spawn phantoms", Boss Guide "Spawns
 * phantoms that distract and deal damage. Clear phantoms or ignore
 * them and focus the boss.").
 *
 * Live leftover — decide. `decideEnthronedVoidAction` calls
 * `pickBossKitSpell` with `new Map()`, so the first phase-1 pool id
 * (`spell-swap`) is decided every turn. PHANTOM_SPAWN sits *after*
 * that return (`currentTurn % 2 === 0`). Advertised 1 HP phantom
 * pawns never spawn, so after the 280 HP Void dies
 * `shouldAwardVictory` fires immediately — a leftover 1 HP phantom
 * would still occupy the fight graph (Strike 10 kills it; WX stamp
 * 20 leftover of **#1152** would leave 10).
 *
 * Unique leftover of **#1152** `bossPhantomSpawnHpCommit` (pawn HP
 * 1 vs stamp 20 once a spawn already decided). Unique vs:
 * - **#1094** `enthronedVoidDamageImmuneCommit` — odd-turn
 *   ANCHOR_TILES + unread DAMAGE_IMMUNE. This sidecar does **not**
 *   steal odd-turn anchors, immunity, or the 20 step tax.
 * - **#1089** even phase-2 PAGES_OF_DOOM / **#1102** odd-turn
 *   SCROLL_SUMMON / **#1105** phase-1 even INK_VEIL. Those stay on
 *   Pale Archivist.
 * - **#888** first-id execute *range* — that sidecar still *decides*
 *   the kit spell. Kit `summon-dire-wolf` is third-id, not this.
 * - **#933** occupancyAdjacentSpawnUnseal — portal-crumb snap of
 *   planted dests. This sidecar does **not** relocate dests.
 * - **#1058** Midnight Bishop MERGE blocked by kit Mirror.
 * - SPAWN_MINIONS / GHOST_SUMMON king 1 / SPLIT_ROOKS half-HP stamp
 *   leftovers, advertised atk 5 / ap 2 vs WX `damage` 35 / `atk: 0`.
 *
 * WX spawn commit still overwrites advertised hp 1 / atk 5 with the
 * init formula and stamps `enemyHpMap[id] = 20` — execute leftover
 * of **#1152**, not restored here. Odd-turn ANCHOR_TILES after kit
 * fail stays **#1094**. Phase-2 AP_DRAIN_PASSIVE is a second leftover.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancy, statusEffects, spellEngine, challengeCompletion,
 * bossPhantomSpawnHpCommit, or enthronedVoidDamageImmuneCommit.
 * Restack `decideEnthronedVoidAction` onto
 * `resolveEnthronedVoidEvenTurnDecide` after older combat PRs land.
 */

import { hpAfterIncomingDamage, shouldAwardVictory } from "./battleSetup.ts";

export const ENTHRONED_VOID_ID = "enthroned_void";

export const PHANTOM_SPAWN_ABILITY = "PHANTOM_SPAWN";

export const ANCHOR_TILES_ABILITY = "ANCHOR_TILES";

export const DAMAGE_IMMUNE_ABILITY = "DAMAGE_IMMUNE";

export const AP_DRAIN_PASSIVE_ABILITY = "AP_DRAIN_PASSIVE";

export const SCROLL_SUMMON_ABILITY = "SCROLL_SUMMON";

export const PAGES_OF_DOOM_ABILITY = "PAGES_OF_DOOM";

export const INK_VEIL_ABILITY = "INK_VEIL";

export const MERGE_BISHOPS_ABILITY = "MERGE_BISHOPS";

export const GHOST_SUMMON_ABILITY = "GHOST_SUMMON";

export const SPLIT_ROOKS_ABILITY = "SPLIT_ROOKS";

/** Phase-1 first kit id (`bossKits` `phase1SpellIds[0]`). */
export const ENTHRONED_VOID_PHASE1_KIT_FIRST_ID = "spell-swap";

/** Phase-2 first kit id — AP_DRAIN leftover, not this sidecar. */
export const ENTHRONED_VOID_PHASE2_KIT_FIRST_ID = "spell-swap";

/** Pale Archivist phase-2 first-id — #1102 leftover, not this sidecar. */
export const PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID = "spell-mark";

/** Pale Archivist phase-1 first-id — #1105 leftover, not this sidecar. */
export const PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID = "spell-cursed-wound";

/** Midnight Bishop phase-2 first-id — #1058 leftover, not this sidecar. */
export const MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID = "spell-mirror";

/** Kit third-id — #910-class leftover, not this decide. */
export const ENTHRONED_VOID_KIT_SUMMON_DIRE_WOLF_ID = "summon-dire-wolf";

/** Production `currentTurn % 2 === 0`. */
export const PHANTOM_SPAWN_EVEN_MOD = 2;

/** Production `applyPhantomSpawn` phantom HP. */
export const PHANTOM_SPAWN_HP = 1;

/** Production `applyPhantomSpawn` contact atk — damage leftover, not this. */
export const PHANTOM_SPAWN_ATK = 5;

/** Production `applyPhantomSpawn` AP — AP leftover, not this. */
export const PHANTOM_SPAWN_AP = 2;

/** Production `applyPhantomSpawn` `pieceType`. */
export const PHANTOM_SPAWN_PIECE = "pawn";

export const PHANTOM_SPAWN_LOG_NEEDLE =
  "Phantom chess pieces materialize from the void!";

export type EnthronedVoidPhase = 1 | 2;

export type EnthronedVoidDecideAction = {
  type: "spell" | "ability" | "summon" | "attack" | "move" | "skip";
  spellId?: string;
  ability?: string;
};

export type EnthronedVoidEvenTurnDecideInput = {
  currentPhase: EnthronedVoidPhase;
  currentTurn: number;
  kitSpellId: string | null;
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

/** Production even-turn Phantom cadence (`currentTurn % 2 === 0`). */
export function isEnthronedVoidPhantomSpawnTurn(currentTurn: number): boolean {
  const turn = finiteNumber(currentTurn);
  if (turn == null) return false;
  return turn % PHANTOM_SPAWN_EVEN_MOD === 0;
}

/**
 * Production `decideEnthronedVoidAction` order: kit first-id, then
 * even-turn PHANTOM_SPAWN / odd-turn ANCHOR_TILES in phase 1.
 * This leftover only models the kit-vs-even-Phantom fork — odd
 * anchors stay **#1094**.
 */
export function wxEnthronedVoidEvenTurnDecide(
  opts: EnthronedVoidEvenTurnDecideInput,
): EnthronedVoidDecideAction {
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  if (
    opts.currentPhase === 1 &&
    isEnthronedVoidPhantomSpawnTurn(opts.currentTurn)
  ) {
    return { type: "summon", ability: PHANTOM_SPAWN_ABILITY };
  }
  return { type: "skip" };
}

/**
 * Prefer PHANTOM_SPAWN on even phase-1 turns so advertised 1 HP
 * phantom pawns can spawn. Odd turns still let kit first-id win
 * (ANCHOR_TILES **#1094**). Phase 2 still lets kit win (AP_DRAIN
 * leftover).
 */
export function resolveEnthronedVoidEvenTurnDecide(
  opts: EnthronedVoidEvenTurnDecideInput,
): EnthronedVoidDecideAction {
  if (
    opts.currentPhase === 1 &&
    isEnthronedVoidPhantomSpawnTurn(opts.currentTurn)
  ) {
    return { type: "summon", ability: PHANTOM_SPAWN_ABILITY };
  }
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  return { type: "skip" };
}

/** True when live decide spends an even-turn Phantom plant on kit first-id. */
export function wxEnthronedVoidKitBlocksPhantom(
  opts: EnthronedVoidEvenTurnDecideInput,
): boolean {
  const live = wxEnthronedVoidEvenTurnDecide(opts);
  const next = resolveEnthronedVoidEvenTurnDecide(opts);
  return live.type === "spell" && next.type === "summon";
}

/** Advertised Strike vs a 1 HP phantom — WX formula overwrite is **#1152**. */
export function phantomHpAfterStrike(opts: {
  phantomHp: number;
  strikeDamage: number;
}): number {
  return hpAfterIncomingDamage(opts.phantomHp, opts.strikeDamage).newHp;
}

/**
 * Living Enthroned Void + leftover phantom. Enemy-side non-summon
 * pawns (`applyPhantomSpawn` does not set `isSummon`) stay hostile,
 * so a leftover 1 HP phantom blocks `shouldAwardVictory` once the
 * 280 HP boss is already dead.
 */
export function enthronedVoidHostilesRemaining(opts: {
  bossHp: number;
  phantomHp: number;
}): number {
  const boss = finiteNumber(opts.bossHp) ?? 0;
  const phantom = finiteNumber(opts.phantomHp) ?? 0;
  return (boss > 0 ? 1 : 0) + (phantom > 0 ? 1 : 0);
}

export function leftoverPhantomBlocksVictory(opts: {
  inBattle: boolean;
  deathTriggered: boolean;
  battleStartIdsSize: number;
  bossHp: number;
  phantomHp: number;
}): boolean {
  const hostilesRemaining = enthronedVoidHostilesRemaining({
    bossHp: opts.bossHp,
    phantomHp: opts.phantomHp,
  });
  return (
    opts.phantomHp > 0 &&
    opts.bossHp <= 0 &&
    !shouldAwardVictory({
      inBattle: opts.inBattle,
      deathTriggered: opts.deathTriggered,
      battleStartIdsSize: opts.battleStartIdsSize,
      hostilesRemaining,
    })
  );
}
