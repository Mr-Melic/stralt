/**
 * Midnight Bishop phase 2 advertises MERGE_BISHOPS + MAGIC_REFLECT
 * (`bossDefaults` specialAbilities, Boss Guide "Use physical attacks").
 *
 * Live leftover A — decide. `decideMidnightBishopAction` calls
 * `pickBossKitSpell` with `new Map()`, so the first phase-2 pool id
 * (`spell-mirror`) is decided every turn. MERGE_BISHOPS sits *after*
 * that return. `bishopsMerged` / `magicReflectActive` never arm.
 * Unique vs **#888** (first-id Cursed Wound / Mirror execute *range* —
 * that sidecar still *decides* the kit spell) and **#852** (kit Mirror
 * `isMirror` consume once the kit branch actually runs).
 *
 * Live leftover B — execute. Even if MERGE later restacks and WX
 * copies `newBossState.magicReflectActive`, `applyDamageToEnemy`
 * `BossStateLike` only lists `shellArmorActive` / `reflectShieldActive`
 * / `larvae`. Player Frost Bolt 20 therefore reflects 0. Unique vs
 * Void Mirror 25% of `preCritDmgBM`, Countess Reflect Shield 30% of
 * `finalDmg`, **#973** Life Drain heal after those live reflects, and
 * **#852** one-shot kit Mirror.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * castHelpers, or spellEngine. Restack `decideMidnightBishopAction`
 * onto `resolveMidnightBishopPhase2Decide` and `applyDamageToEnemy`
 * onto `resolveBossMagicReflect` after older combat PRs land.
 *
 * Does not steal phase-1 TWIN_FLANK blocked by Cursed Wound (same kit
 * first-id class as #888). Does not change kit Mirror after merge.
 */

import { hpAfterIncomingDamage } from "./battleSetup.ts";

export const MIDNIGHT_BISHOP_ID = "midnight_bishop";

export const MERGE_BISHOPS_ABILITY = "MERGE_BISHOPS";

export const MAGIC_REFLECT_ABILITY = "MAGIC_REFLECT";

/** Phase-2 first kit id (`bossKits` `phase2SpellIds[0]`). */
export const MIDNIGHT_BISHOP_PHASE2_KIT_FIRST_ID = "spell-mirror";

/** Phase-1 first kit id — TWIN_FLANK leftover, not this sidecar. */
export const MIDNIGHT_BISHOP_PHASE1_KIT_FIRST_ID = "spell-cursed-wound";

/** Production `applyMagicReflect` factor. */
export const MAGIC_REFLECT_FACTOR = 1.0;

export const MERGE_BISHOPS_LOG_NEEDLE =
  "The two bishops MERGE into one unstoppable form! Magic damage reflects!";

export type MidnightBishopPhase = 1 | 2;

export type MidnightBishopDecideAction = {
  type: "spell" | "merge" | "ability" | "attack" | "move" | "skip";
  spellId?: string;
  ability?: string;
};

export type MidnightBishopDecideInput = {
  currentPhase: MidnightBishopPhase;
  bishopsMerged: boolean;
  kitSpellId: string | null;
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

/**
 * Production `decideMidnightBishopAction` order: kit first-id, then
 * MERGE_BISHOPS when phase 2 and not yet merged.
 */
export function wxMidnightBishopPhase2Decide(
  opts: MidnightBishopDecideInput,
): MidnightBishopDecideAction {
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  if (opts.currentPhase === 2 && opts.bishopsMerged !== true) {
    return { type: "merge", ability: MERGE_BISHOPS_ABILITY };
  }
  return { type: "skip" };
}

/**
 * Prefer MERGE_BISHOPS once before kit Mirror so `magicReflectActive`
 * can arm. After merge, kit first-id still wins (#852 / #888 leftover).
 */
export function resolveMidnightBishopPhase2Decide(
  opts: MidnightBishopDecideInput,
): MidnightBishopDecideAction {
  if (opts.currentPhase === 2 && opts.bishopsMerged !== true) {
    return { type: "merge", ability: MERGE_BISHOPS_ABILITY };
  }
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  return { type: "skip" };
}

/** True when live decide spends the merge turn on kit Mirror. */
export function wxMidnightBishopKitBlocksMerge(
  opts: MidnightBishopDecideInput,
): boolean {
  const live = wxMidnightBishopPhase2Decide(opts);
  const next = resolveMidnightBishopPhase2Decide(opts);
  return live.type === "spell" && next.type === "merge";
}

export type MagicReflectHitInput = {
  magicReflectActive?: boolean | null;
  isPhysical?: boolean | null;
  incomingDamage?: number | null;
  /** Live Void Mirror path — do not steal that 25% arm. */
  family?: string | null;
  /** Live Countess Reflect Shield path — do not steal that 30% arm. */
  reflectShieldActive?: boolean | null;
};

/**
 * Live `applyDamageToEnemy`: `BossStateLike` has no `magicReflectActive`,
 * so the flag is unread. Void Mirror / Reflect Shield stay on their
 * own arms.
 */
export function wxBossMagicReflectCommitWithoutFlag(
  _opts: MagicReflectHitInput,
): number {
  return 0;
}

/**
 * Production `applyMagicReflect`: `floor(incoming * 1.0)` on non-physical
 * hits while the merge flag is on. Physical Strike is the advertised
 * counterplay. Non-finite / empty incoming fail-closed.
 */
export function resolveBossMagicReflect(opts: MagicReflectHitInput): number {
  if (opts.magicReflectActive !== true) return 0;
  if (opts.isPhysical === true) return 0;
  const incoming = finiteNumber(opts.incomingDamage);
  if (incoming == null || incoming <= 0) return 0;
  return Math.floor(incoming * MAGIC_REFLECT_FACTOR);
}

export function wxBossMagicReflectDroppedHit(
  opts: MagicReflectHitInput,
): boolean {
  return (
    resolveBossMagicReflect(opts) > wxBossMagicReflectCommitWithoutFlag(opts)
  );
}

export function playerHpAfterMagicReflect(opts: {
  hp: number;
  reflected: number;
}): number {
  return hpAfterIncomingDamage(
    opts.hp,
    Math.max(0, finiteNumber(opts.reflected) ?? 0),
  ).newHp;
}
