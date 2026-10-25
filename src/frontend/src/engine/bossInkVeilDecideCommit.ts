/**
 * Pale Archivist advertises INK_VEIL (`bossDefaults` phase-1 and phase-2
 * specialAbilities, useBossAI fallback after Pages / Scroll, Boss Guide
 * "Boss obscures vision with ink. Use area attacks or rely on memory of
 * tile positions.").
 *
 * Live leftover — decide. `decidePaleArchivistAction` calls
 * `pickBossKitSpell` with `new Map()`, so the first pool id
 * (`spell-cursed-wound` phase 1 / `spell-mark` phase 2) is decided
 * every turn. INK_VEIL sits *after* that return and *after* phase-2
 * even PAGES_OF_DOOM and odd-turn SCROLL_SUMMON. The only turn that
 * would reach the Ink branch if kit-first were absent is **phase-1
 * even** (`currentPhase === 1 && currentTurn % 2 === 0`). Advertised
 * 3–4 glyphed tiles (`turnsLeft: 2`) never plant, so the cover log
 * never fires.
 *
 * Unique vs:
 * - **#1089** `bossPagesOfDoomDecideCommit` — even phase-2
 *   PAGES_OF_DOOM. This sidecar does **not** steal even-turn Pages.
 * - **#1102** `bossScrollSummonDecideCommit` — odd-turn SCROLL_SUMMON.
 *   This sidecar does **not** steal odd-turn Scroll.
 * - **#925** occupancy INK_VEIL unseal — leftover-crumb snap of planted
 *   glyphs. This sidecar does **not** relocate dests.
 * - **#888** first-id execute *range* — that sidecar still *decides*
 *   the kit spell. Phase-1 Cursed Wound stays the live first-id.
 * - **#1058** Midnight Bishop MERGE blocked by kit Mirror.
 * - **#1094** Enthroned Void ANCHOR_TILES (also writes `glyphedTiles`,
 *   but plants 2 anchors and decrements existing — not 3–4 Ink glyphs).
 * - **#1100** leftover-walk lava/spikes soak. Glyph-trap 15 is a
 *   separate apply (`GLYPH_TRAP` is not in `decidePaleArchivistAction`).
 *
 * WX abilityResult still copies `newBossState` as-is — execute leftover
 * of a decide that never fires, not restored here.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancy, statusEffects, spellEngine, or challengeCompletion.
 * Restack `decidePaleArchivistAction` onto
 * `resolvePaleArchivistPhase1EvenDecide` after older combat PRs land.
 */

import { hpAfterIncomingDamage } from "./battleSetup.ts";

export const PALE_ARCHIVIST_ID = "pale_archivist";

export const INK_VEIL_ABILITY = "INK_VEIL";

export const PAGES_OF_DOOM_ABILITY = "PAGES_OF_DOOM";

export const SCROLL_SUMMON_ABILITY = "SCROLL_SUMMON";

export const GLYPH_TRAP_ABILITY = "GLYPH_TRAP";

export const MERGE_BISHOPS_ABILITY = "MERGE_BISHOPS";

export const ANCHOR_TILES_ABILITY = "ANCHOR_TILES";

/** Phase-1 first kit id (`bossKits` `phase1SpellIds[0]`). */
export const PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID = "spell-cursed-wound";

/** Phase-2 first kit id — even Pages leftover of #1089, not this sidecar. */
export const PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID = "spell-mark";

/** Midnight Bishop phase-2 first-id — #1058 leftover, not this sidecar. */
export const MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID = "spell-mirror";

/** Kit fourth-id — #910 leftover, not this sidecar. */
export const PALE_ARCHIVIST_KIT_SUMMON_ARCHER_ID = "summon-archer";

/** Production even-turn cadence (`currentTurn % 2 === 0`). */
export const INK_VEIL_EVEN_MOD = 2;

/** Production `applyInkVeil` `3 + Math.floor(Math.random() * 2)`. */
export const INK_VEIL_GLYPH_MIN = 3;

export const INK_VEIL_GLYPH_MAX = 4;

/** Production `applyInkVeil` glyph `turnsLeft`. */
export const INK_VEIL_TURNS_LEFT = 2;

/** Production `applyAnchorTiles` plant count — #1094 leftover, not this. */
export const ANCHOR_TILES_PLANT_COUNT = 2;

/** Production `applyGlyphTrap` `damageToPlayer` — not in decide. */
export const GLYPH_TRAP_DAMAGE = 15;

export const INK_VEIL_LOG_NEEDLE = "The Pale Archivist covers";

export const INK_VEIL_GUIDE_NEEDLE = "obscures vision with ink";

export const GLYPH_TRAP_LOG_NEEDLE = "Glyph Trap! You struck the wrong tile";

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

/** Production even-turn cadence (`currentTurn % 2 === 0`). */
export function isPaleArchivistEvenTurn(currentTurn: number): boolean {
  const turn = finiteNumber(currentTurn);
  if (turn == null) return false;
  return turn % INK_VEIL_EVEN_MOD === 0;
}

/**
 * Production Ink fallback: kit-first absent, not phase-2 even Pages
 * (#1089), not odd-turn Scroll (#1102) → phase-1 even only.
 */
export function isPaleArchivistInkVeilTurn(
  currentPhase: PaleArchivistPhase,
  currentTurn: number,
): boolean {
  return currentPhase === 1 && isPaleArchivistEvenTurn(currentTurn);
}

/**
 * Production `decidePaleArchivistAction` order: kit first-id, then
 * PAGES_OF_DOOM on even phase 2, then SCROLL_SUMMON on odd turns, then
 * INK_VEIL. This leftover only models the kit-vs-phase-1-even-Ink fork
 * — even Pages stays **#1089**, odd Scroll stays **#1102**.
 */
export function wxPaleArchivistPhase1EvenDecide(
  opts: PaleArchivistDecideInput,
): PaleArchivistDecideAction {
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  if (isPaleArchivistInkVeilTurn(opts.currentPhase, opts.currentTurn)) {
    return { type: "ability", ability: INK_VEIL_ABILITY };
  }
  return { type: "skip" };
}

/**
 * Prefer INK_VEIL on phase-1 even turns so advertised 3–4 glyphed tiles
 * can plant. Phase-2 even still lets kit first-id win (PAGES_OF_DOOM
 * **#1089**). Odd turns still let kit first-id win (SCROLL_SUMMON
 * **#1102**).
 */
export function resolvePaleArchivistPhase1EvenDecide(
  opts: PaleArchivistDecideInput,
): PaleArchivistDecideAction {
  if (isPaleArchivistInkVeilTurn(opts.currentPhase, opts.currentTurn)) {
    return { type: "ability", ability: INK_VEIL_ABILITY };
  }
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  return { type: "skip" };
}

/** True when live decide spends a phase-1 even Ink plant on kit first-id. */
export function wxPaleArchivistKitBlocksInk(
  opts: PaleArchivistDecideInput,
): boolean {
  const live = wxPaleArchivistPhase1EvenDecide(opts);
  const next = resolvePaleArchivistPhase1EvenDecide(opts);
  return live.type === "spell" && next.type === "ability";
}

/**
 * Advertised Ink plant size. Live `applyInkVeil` rolls 3 or 4; this
 * leftover never plants, so glyphedTiles stay empty. Anchor-tile plants
 * of 2 stay **#1094**.
 */
export function inkVeilGlyphCountInRange(count: number): boolean {
  const n = finiteNumber(count);
  if (n == null) return false;
  return n >= INK_VEIL_GLYPH_MIN && n <= INK_VEIL_GLYPH_MAX;
}

/** Advertised Strike vs a Glyph Trap 15 — GLYPH_TRAP is not this decide. */
export function playerHpAfterGlyphTrap(opts: {
  currentHp: number;
  trapArmed: boolean;
}): number {
  if (!opts.trapArmed) {
    const hp = finiteNumber(opts.currentHp) ?? 0;
    return Math.max(0, hp);
  }
  return hpAfterIncomingDamage(opts.currentHp, GLYPH_TRAP_DAMAGE).newHp;
}
