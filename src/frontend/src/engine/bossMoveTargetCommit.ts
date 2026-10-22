/**
 * Boss `type: "move"` dest (`WorldExploration` ~16022 / ~16226).
 *
 * `useBossAI` Countess LAVA_TRAIL, Static SHOCK_TILES, and every bare
 * `moveToward` return `{ type: "move", targetX, targetY }` with either no
 * `abilityResult` or an abilityResult that plants hazards at the origin.
 * `applyLavaTrail` / `applyShockTiles` never set `newBossPosition`.
 * TELEPORT_ADJACENT / ADVANCE_PER_TURN / KNIGHT_JUMP_IGNORE_WALLS do.
 *
 * Live WorldExploration then:
 *   `const newBossX = res?.newBossPosition?.x ?? enemy.x`
 * so a walk with no `newBossPosition` stays on the origin. Countess plants
 * lava under herself and never rushes; Static plants shock and never hops;
 * Pale Archbishop / Fetid Rook / any kit-empty or kit-on-cooldown fallback
 * never closes. Adjacent melee (`type: "attack"`) is a different leftover.
 *
 * Unique extra vs:
 * - #498 `bossKitSpellPositionToCommit`: kit `{ type: "spell", targetX:
 *   player }` must **not** walk onto the player. This helper only walks
 *   `type === "move"`.
 * - #763 `wxBossAbilityCommitWithoutLanding`: taxes TELEPORT / ADVANCE /
 *   knight dest from `newBossPosition`. Those abilities already move. This
 *   is the dest **source** when `newBossPosition` is missing.
 * - #859 `legalizeMoveTowardLanding`: snaps a greedy `floor||portal` dest
 *   off the gate. This helper commits the dest as-is; portal landings stay
 *   #859's leftover.
 * - #855 `occupancyLavaUnseal`: legalizes the lava **plant** at origin, not
 *   the hop dest.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancyMoveTowardUnseal, or bossAbilityLandingHazard.
 */

export type BossMoveTile = { x: number; y: number };

export type BossMoveActionLike = {
  type?: string | null;
  targetX?: number;
  targetY?: number;
  abilityResult?: {
    newBossPosition?: BossMoveTile | null;
  } | null;
};

function finiteTile(x: unknown, y: unknown): BossMoveTile | null {
  const nx = Number(x);
  const ny = Number(y);
  if (!Number.isFinite(nx) || !Number.isFinite(ny)) return null;
  return { x: nx, y: ny };
}

export function sameBossMoveTile(a: BossMoveTile, b: BossMoveTile): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Production WX (~16022 / ~16226): `newBossPosition ?? origin`.
 * Drops Countess / Static / bare `moveToward` dests.
 */
export function wxBossMoveCommitWithoutTarget(opts: {
  origin: BossMoveTile;
  action: BossMoveActionLike;
}): BossMoveTile {
  const pos = opts.action.abilityResult?.newBossPosition;
  return finiteTile(pos?.x, pos?.y) ?? { x: opts.origin.x, y: opts.origin.y };
}

/**
 * Walk dest advertised on the AI action. Kit spells and melee attacks
 * carry `targetX/Y` aimed at the player — those types must stay put.
 */
export function bossMoveTargetFromAction(
  action: BossMoveActionLike,
): BossMoveTile | null {
  if (action.type !== "move") return null;
  return finiteTile(action.targetX, action.targetY);
}

/**
 * Commit dest for a boss AI action.
 * 1. `abilityResult.newBossPosition` wins (TELEPORT / ADVANCE / knight).
 * 2. Else `type === "move"` `targetX/Y` (LAVA_TRAIL / SHOCK / moveToward).
 * 3. Else origin (kit spell, attack, skip, missing dest).
 */
export function resolveBossMoveCommit(opts: {
  origin: BossMoveTile;
  action: BossMoveActionLike;
}): BossMoveTile {
  const fromAbility = finiteTile(
    opts.action.abilityResult?.newBossPosition?.x,
    opts.action.abilityResult?.newBossPosition?.y,
  );
  if (fromAbility) return fromAbility;
  return (
    bossMoveTargetFromAction(opts.action) ?? {
      x: opts.origin.x,
      y: opts.origin.y,
    }
  );
}

/** True when live WX would leave a `type: "move"` dest on the floor. */
export function wxBossMoveDroppedTarget(opts: {
  origin: BossMoveTile;
  action: BossMoveActionLike;
}): boolean {
  return !sameBossMoveTile(
    resolveBossMoveCommit(opts),
    wxBossMoveCommitWithoutTarget(opts),
  );
}
