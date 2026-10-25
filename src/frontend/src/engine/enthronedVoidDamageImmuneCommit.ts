/**
 * Enthroned Void phase 1 advertises DAMAGE_IMMUNE + ANCHOR_TILES
 * (`bossDefaults` specialAbilities, Boss Guide "immune until anchor
 * tiles are destroyed", `applyAnchorTiles` "step on them to damage it"
 * for 20, phase 2 after 8).
 *
 * Live leftover A — decide. `decideEnthronedVoidAction` calls
 * `pickBossKitSpell` with `new Map()`, so the first phase-1 pool id
 * (`spell-swap`) is decided every turn. ANCHOR_TILES / PHANTOM_SPAWN
 * sit *after* that return. DAMAGE_IMMUNE is never even returned — it
 * is a passive `applyDamageImmune` comment says WorldExploration must
 * check. Unique vs **#888** (first-id execute *range*) and **#1058**
 * (Midnight Bishop MERGE / MAGIC_REFLECT). Occupancy of planted
 * anchors stays **#770**. Even-turn PHANTOM_SPAWN stays **#711**.
 *
 * Live leftover B — execute. `applyDamageToEnemy` `BossStateLike`
 * only lists `shellArmorActive` / `reflectShieldActive` / `larvae`.
 * WorldExploration never reads `DAMAGE_IMMUNE`, `anchorsDestroyed`,
 * or `glyphedTiles`. Frost Bolt 20 and Strike 10 both debit boss HP.
 * `enemyTakesDamage` floors at 1, so Attack Nearest / DoT still chip
 * even if the spell path later restacks. Unique vs **#1058** (Strike
 * is the MAGIC_REFLECT counterplay; here Strike is also immune) and
 * Pale Archivist GLYPH_TRAP (**#925** / **#1089**) which taxes the
 * player 15, not the boss 20.
 *
 * Live leftover C — counterplay. Player walk never matches
 * `glyphedTiles` for `enthroned_void`, so the advertised 20 never
 * commits and `anchorsDestroyed` stays 0. Without both B and C, zeroing
 * direct damage would freeze phase 1 (fix A caused bug B).
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * castHelpers, occupancy, or RAF. Restack `decideEnthronedVoidAction`
 * onto `resolveEnthronedVoidPhase1Decide`, `applyDamageToEnemy` /
 * `enemyTakesDamage` onto `resolveEnthronedVoidDirectDamage`, and
 * player step onto `resolveEnthronedVoidAnchorStep` after older
 * combat / occupancy PRs land.
 *
 * Does not steal Final Pawn `invincibleTurnsLeft` (unread sibling).
 * Does not change kit Swap after 8 anchors / phase 2.
 */

import { hpAfterIncomingDamage } from "./battleSetup.ts";

export const ENTHRONED_VOID_ID = "enthroned_void";

export const ANCHOR_TILES_ABILITY = "ANCHOR_TILES";

export const DAMAGE_IMMUNE_ABILITY = "DAMAGE_IMMUNE";

export const PHANTOM_SPAWN_ABILITY = "PHANTOM_SPAWN";

/** Phase-1 first kit id (`bossKits` `phase1SpellIds[0]`). */
export const ENTHRONED_VOID_PHASE1_KIT_FIRST_ID = "spell-swap";

/** Production `applyAnchorTiles` step tax. */
export const ANCHOR_STEP_DAMAGE = 20;

/** Production `applyAnchorTiles` phase-2 threshold. */
export const ANCHORS_TO_PHASE_2 = 8;

export const ANCHOR_SPAWN_LOG_NEEDLE = "The Enthroned Void spawns";

export const DAMAGE_IMMUNE_LOG_NEEDLE =
  "The Enthroned Void is immune to direct damage! Destroy the anchor tiles!";

export type EnthronedVoidPhase = 1 | 2;

export type EnthronedVoidDecideAction = {
  type: "spell" | "ability" | "summon" | "attack" | "move" | "skip";
  spellId?: string;
  ability?: string;
};

export type EnthronedVoidDecideInput = {
  currentPhase: EnthronedVoidPhase;
  currentTurn: number;
  kitSpellId: string | null;
  anchorsDestroyed?: number | null;
};

export type GlyphTile = { x: number; y: number; turnsLeft: number };

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

function destroyedCount(n: unknown): number {
  const v = finiteNumber(n);
  if (v == null || v < 0) return 0;
  return Math.floor(v);
}

/**
 * Production `decideEnthronedVoidAction` order: kit first-id, then
 * even-turn PHANTOM_SPAWN / odd-turn ANCHOR_TILES in phase 1.
 */
export function wxEnthronedVoidPhase1Decide(
  opts: EnthronedVoidDecideInput,
): EnthronedVoidDecideAction {
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  if (opts.currentPhase === 1) {
    if (opts.currentTurn % 2 === 0) {
      return { type: "summon", ability: PHANTOM_SPAWN_ABILITY };
    }
    return { type: "ability", ability: ANCHOR_TILES_ABILITY };
  }
  return { type: "skip" };
}

/**
 * Prefer ANCHOR_TILES on the live odd-turn plant so immunity has
 * counterplay. Even-turn PHANTOM_SPAWN stays **#711**. After 8
 * anchors, kit first-id still wins (phase 2 leftover).
 */
export function resolveEnthronedVoidPhase1Decide(
  opts: EnthronedVoidDecideInput,
): EnthronedVoidDecideAction {
  if (
    opts.currentPhase === 1 &&
    destroyedCount(opts.anchorsDestroyed) < ANCHORS_TO_PHASE_2 &&
    opts.currentTurn % 2 !== 0
  ) {
    return { type: "ability", ability: ANCHOR_TILES_ABILITY };
  }
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  if (opts.currentPhase === 1) {
    if (opts.currentTurn % 2 === 0) {
      return { type: "summon", ability: PHANTOM_SPAWN_ABILITY };
    }
    return { type: "ability", ability: ANCHOR_TILES_ABILITY };
  }
  return { type: "skip" };
}

/** True when live decide spends the odd-turn plant on kit Swap. */
export function wxEnthronedVoidKitBlocksAnchor(
  opts: EnthronedVoidDecideInput,
): boolean {
  const live = wxEnthronedVoidPhase1Decide(opts);
  const next = resolveEnthronedVoidPhase1Decide(opts);
  return live.type === "spell" && next.type === "ability";
}

export type EnthronedVoidDirectHitInput = {
  bossId?: string | null;
  currentPhase?: EnthronedVoidPhase | null;
  incomingDamage?: number | null;
  /** `anchor-step` is the advertised counterplay and must not be zeroed. */
  source?: "direct" | "anchor-step" | "dot" | "melee" | null;
  /** Live Void Mirror path — do not steal that 25% arm. */
  family?: string | null;
  /** Live Countess Reflect Shield path — do not steal that 30% arm. */
  reflectShieldActive?: boolean | null;
  /** Live Midnight Bishop MAGIC_REFLECT — do not steal **#1058**. */
  magicReflectActive?: boolean | null;
};

/**
 * Live `applyDamageToEnemy`: `BossStateLike` has no phase / DAMAGE_IMMUNE,
 * so immunity is unread. Void Mirror / Reflect Shield / MAGIC_REFLECT
 * stay on their own arms.
 */
export function wxEnthronedVoidDirectDamage(
  opts: EnthronedVoidDirectHitInput,
): number {
  const incoming = finiteNumber(opts.incomingDamage);
  if (incoming == null || incoming <= 0) return 0;
  return incoming;
}

/**
 * Phase-1 Enthroned Void zeros non-anchor sources. Anchor-step commits
 * the advertised 20. Other bosses pass through. Non-finite / empty
 * incoming fail-closed.
 */
export function resolveEnthronedVoidDirectDamage(
  opts: EnthronedVoidDirectHitInput,
): number {
  if (opts.bossId !== ENTHRONED_VOID_ID) {
    if (opts.source === "anchor-step") return 0;
    const incoming = finiteNumber(opts.incomingDamage);
    if (incoming == null || incoming <= 0) return 0;
    return incoming;
  }
  if (opts.source === "anchor-step") return ANCHOR_STEP_DAMAGE;
  const incoming = finiteNumber(opts.incomingDamage);
  if (incoming == null || incoming <= 0) return 0;
  if (opts.currentPhase === 1) return 0;
  return incoming;
}

export function wxEnthronedVoidDirectDamageDroppedHit(
  opts: EnthronedVoidDirectHitInput,
): boolean {
  return (
    resolveEnthronedVoidDirectDamage(opts) < wxEnthronedVoidDirectDamage(opts)
  );
}

/**
 * Live `enemyTakesDamage` floors at 1 (`Math.max(1, round(...))`), so a
 * restack that only zeros `applyDamageToEnemy` still chips via Attack
 * Nearest / DoT. Callers must skip the write when resolved damage is 0.
 */
export function wxEnemyTakesDamageFloor(incoming: number): number {
  const n = finiteNumber(incoming);
  if (n == null) return 0;
  return Math.max(1, Math.round(n));
}

export function resolveEnthronedVoidEnemyTakesDamage(
  opts: EnthronedVoidDirectHitInput,
): number {
  const resolved = resolveEnthronedVoidDirectDamage(opts);
  if (resolved <= 0) return 0;
  return Math.max(1, Math.round(resolved));
}

export function bossHpAfterDirectHit(opts: {
  hp: number;
  damage: number;
}): number {
  return hpAfterIncomingDamage(
    opts.hp,
    Math.max(0, finiteNumber(opts.damage) ?? 0),
  ).newHp;
}

export type EnthronedVoidAnchorStepInput = {
  bossId?: string | null;
  currentPhase?: EnthronedVoidPhase | null;
  anchorsDestroyed?: number | null;
  glyphedTiles?: GlyphTile[] | null;
  dest?: { x: number; y: number } | null;
};

export type EnthronedVoidAnchorStepResult = {
  damage: number;
  matched: boolean;
  anchorsDestroyed: number;
  currentPhase: EnthronedVoidPhase;
  glyphedTiles: GlyphTile[];
};

function copyGlyphs(tiles: GlyphTile[] | null | undefined): GlyphTile[] {
  if (!tiles) return [];
  return tiles.map((t) => ({ x: t.x, y: t.y, turnsLeft: t.turnsLeft }));
}

/**
 * Live WorldExploration never matches player dest against Enthroned
 * Void `glyphedTiles`, so the step tax is 0.
 */
export function wxEnthronedVoidAnchorStep(
  opts: EnthronedVoidAnchorStepInput,
): EnthronedVoidAnchorStepResult {
  return {
    damage: 0,
    matched: false,
    anchorsDestroyed: destroyedCount(opts.anchorsDestroyed),
    currentPhase: opts.currentPhase === 2 ? 2 : 1,
    glyphedTiles: copyGlyphs(opts.glyphedTiles),
  };
}

/**
 * Production `applyAnchorTiles` counterplay: stepping a live glyph
 * deals 20, removes that marker, and trips phase 2 at 8. Does not
 * relocate leftover-crumb dests (**#770**). Pale Archivist glyphs
 * (`bossId !== enthroned_void`) are not this tax (**#925**).
 */
export function resolveEnthronedVoidAnchorStep(
  opts: EnthronedVoidAnchorStepInput,
): EnthronedVoidAnchorStepResult {
  const glyphs = copyGlyphs(opts.glyphedTiles);
  const destroyed = destroyedCount(opts.anchorsDestroyed);
  const phase: EnthronedVoidPhase = opts.currentPhase === 2 ? 2 : 1;
  const live = {
    damage: 0,
    matched: false,
    anchorsDestroyed: destroyed,
    currentPhase: phase,
    glyphedTiles: glyphs,
  };
  if (opts.bossId !== ENTHRONED_VOID_ID) return live;
  if (phase !== 1) return live;
  const dest = opts.dest;
  if (!dest) return live;
  const idx = glyphs.findIndex(
    (g) => g.x === dest.x && g.y === dest.y && g.turnsLeft > 0,
  );
  if (idx < 0) return live;
  const nextDestroyed = destroyed + 1;
  const nextGlyphs = glyphs.filter((_, i) => i !== idx);
  return {
    damage: ANCHOR_STEP_DAMAGE,
    matched: true,
    anchorsDestroyed: nextDestroyed,
    currentPhase: nextDestroyed >= ANCHORS_TO_PHASE_2 ? 2 : 1,
    glyphedTiles: nextGlyphs,
  };
}

export function wxEnthronedVoidAnchorStepDropped(
  opts: EnthronedVoidAnchorStepInput,
): boolean {
  return (
    resolveEnthronedVoidAnchorStep(opts).damage >
    wxEnthronedVoidAnchorStep(opts).damage
  );
}
