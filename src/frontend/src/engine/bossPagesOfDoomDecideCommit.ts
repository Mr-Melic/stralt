/**
 * Pale Archivist phase 2 advertises PAGES_OF_DOOM (`bossDefaults`
 * specialAbilities, useBossAI "stack pages of doom debuff every 2 turns").
 *
 * Live leftover — decide. `decidePaleArchivistAction` calls
 * `pickBossKitSpell` with `new Map()`, so the first phase-2 pool id
 * (`spell-mark`) is decided every turn. PAGES_OF_DOOM sits *after* that
 * return (`currentPhase === 2 && currentTurn % 2 === 0`). The advertised
 * "-20% damage for 3 turns" school tax never starts, so Strike
 * (`physical_attack`, 10) stays 10 even after #1065 maps `spell_physical`
 * onto `dmg` — that sidecar only honours a row that already fired.
 *
 * Unique vs:
 * - **#1065** `bossPagesOfDoomStatCommit` — execute leftover: WX copies
 *   `spell_physical` as-is. This sidecar does **not** remap stats.
 * - **#1058** Midnight Bishop MERGE_BISHOPS blocked by kit Mirror
 *   (`spell-mirror`). Pale Archivist phase-2 first-id is Mark.
 * - **#888** first-id execute *range* — that sidecar still *decides*
 *   the kit spell. Phase-1 Cursed Wound / INK_VEIL stay there.
 * - **#1040** CURSE_ON_HIT `all`. **#1035** Exsanguinated `healing`.
 *
 * Odd-turn SCROLL_SUMMON / INK_VEIL after kit fail are not restored
 * (second leftovers). After an even Pages turn, kit Mark still wins.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * statusEffects, spellEngine, or challengeCompletion. Restack
 * `decidePaleArchivistAction` onto `resolvePaleArchivistPhase2Decide`
 * after older combat PRs land.
 */

export const PALE_ARCHIVIST_ID = "pale_archivist";

export const PAGES_OF_DOOM_ABILITY = "PAGES_OF_DOOM";

export const SCROLL_SUMMON_ABILITY = "SCROLL_SUMMON";

export const INK_VEIL_ABILITY = "INK_VEIL";

export const MERGE_BISHOPS_ABILITY = "MERGE_BISHOPS";

/** Phase-2 first kit id (`bossKits` `phase2SpellIds[0]`). */
export const PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID = "spell-mark";

/** Phase-1 first kit id — Cursed Wound / INK_VEIL leftover, not this sidecar. */
export const PALE_ARCHIVIST_PHASE1_KIT_FIRST_ID = "spell-cursed-wound";

/** Midnight Bishop phase-2 first-id — #1058 leftover, not this sidecar. */
export const MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID = "spell-mirror";

export const PAGES_OF_DOOM_CADENCE = 2;

export const PAGES_OF_DOOM_MODIFIER = 0.8;

export const PAGES_OF_DOOM_LOG_NEEDLE = "curses your most-used spell school";

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

/** Production even-turn Pages cadence (`currentTurn % 2 === 0`). */
export function isPaleArchivistPagesOfDoomTurn(currentTurn: number): boolean {
  const turn = finiteNumber(currentTurn);
  if (turn == null) return false;
  return turn % PAGES_OF_DOOM_CADENCE === 0;
}

/**
 * Production `decidePaleArchivistAction` order: kit first-id, then
 * PAGES_OF_DOOM when phase 2 and `currentTurn % 2 === 0`.
 */
export function wxPaleArchivistPhase2Decide(
  opts: PaleArchivistDecideInput,
): PaleArchivistDecideAction {
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  if (
    opts.currentPhase === 2 &&
    isPaleArchivistPagesOfDoomTurn(opts.currentTurn)
  ) {
    return { type: "ability", ability: PAGES_OF_DOOM_ABILITY };
  }
  return { type: "skip" };
}

/**
 * Prefer PAGES_OF_DOOM on even phase-2 turns so the advertised school
 * tax can arm. Odd turns and phase 1 still let kit first-id win
 * (SCROLL_SUMMON / INK_VEIL leftovers).
 */
export function resolvePaleArchivistPhase2Decide(
  opts: PaleArchivistDecideInput,
): PaleArchivistDecideAction {
  if (
    opts.currentPhase === 2 &&
    isPaleArchivistPagesOfDoomTurn(opts.currentTurn)
  ) {
    return { type: "ability", ability: PAGES_OF_DOOM_ABILITY };
  }
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  return { type: "skip" };
}

/** True when live decide spends an even phase-2 Pages turn on kit Mark. */
export function wxPaleArchivistKitBlocksPages(
  opts: PaleArchivistDecideInput,
): boolean {
  const live = wxPaleArchivistPhase2Decide(opts);
  const next = resolvePaleArchivistPhase2Decide(opts);
  return live.type === "spell" && next.type === "ability";
}

/**
 * `computeDamage` outgoing arm when Pages never fired: modifier stays 1
 * so advertised Strike 10 is unchanged. #1065 owns honouring
 * `spell_physical` once a Pages row actually exists.
 */
export function playerOutgoingAfterDmgMod(
  baseDamage: number,
  dmgMod: number,
): number {
  const base = finiteNumber(baseDamage) ?? 0;
  const mod = finiteNumber(dmgMod);
  if (mod == null || mod === 1) return base;
  return Math.floor(base * mod);
}
