/**
 * Broodmother first-spawn SHELL_ARMOR flag never commits.
 *
 * Advertised (`bossDefaults` lore, Enemy Register "keep killing larvae to
 * prevent Broodmother being shielded", Boss Guide "Boss gains armor while
 * larvae are alive", Admin "50% dmg while larvae alive"):
 *   applyShellArmor writes `shellArmorActive` when `larvae.length > 0`.
 *   `castHelpers` then halves Strike (`Math.max(1, floor(dmg / 2))`) when
 *   BOTH the flag and `larvae.length` are set.
 *
 * Live leftover — commit. `decideBroodmotherRookAction` (~757) computes
 * `isShellActive = bossState.larvae.length > 0` BEFORE `applyLarvaeSpawn`,
 * then stamps that pre-spawn boolean onto the spawn result:
 *   newBossState: { ...larvaeResult.newBossState, shellArmorActive }
 * `applyLarvaeSpawn` (~632) writes `newLarvae` + `larvae: [...old, larva]`
 * and never writes the flag. First spawn: post-spawn length is 1, live
 * flag stays false. WorldExploration already merges `res?.newBossState`
 * (~16079), so the false stamp lands. `castHelpers` (~347) then keeps
 * Strike 10. Adjacent `SHELL_ARMOR` apply (~827) is kit-shadowed
 * leftover of #1288 — not restored here.
 *
 * Sequence: LARVAE_SPAWN already decided (empty-kit path, or #1288
 * restack). First larva marker in `bossState.larvae`. Player Strike 10
 * vs the 480 HP rook (0 extra RES mods on the advertised packet).
 *
 * | | Expected (flag true) | Actual (live stamp false) |
 * |---|---|---|
 * | packet | 5 | 10 |
 * | rook HP 480 | 475 | 470 |
 *
 * 10 HP rook: advertised leaves 5 (still occupies); live Strike 10
 * kills and `shouldAwardVictory` fires. 6 HP rook: advertised leaves 1;
 * live kills.
 *
 * Unique leftover of **#1288** (kit-first Archer vs LARVAE_SPAWN decide
 * — once spawn is already decided). Unique vs **#1217** (5×3 contact
 * venom once a marker exists), **#1269** (kit Archer pack cap), **#920**
 * (occupancy snap), **#382** (shell kill tracking once the flag is
 * true), unread `newLarvae` combatants, kit `spell-iron-skin` RES ×1.3.
 * Subsequent spawn (pre-count already > 0) stamps true even live — this
 * sidecar is first spawn only. Do not add `hp` / `atk` / `ap` / `chc` /
 * `heal` / `roll` / `glass` / `glyph` / `venom` / `decide` / `sr` /
 * `dot` / `iron`.
 *
 * Export names stay unique vs `#1288` (`resolveBroodmotherLarvaeDecide`,
 * `broodmotherAdvertisedShellStrike`, `wxAppliesBroodmotherNewLarvaeAsCombatants`)
 * and `#1217` (`executeLarvaeExplodeWalk`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem /
 * occupancy / occupancyLarvaUnseal / castHelpers / spellEngine /
 * challengeCompletion / bossLarvaeSpawnDecideCommit /
 * bossLarvaeExplodeWalkExecute / bossKitSummonCap. Restack the spawn
 * `newBossState.shellArmorActive` stamp onto
 * `resolveBroodmotherFirstSpawnShellArmor` after those PRs land. Do not
 * undo kit-first decide (#1288), explode walk (#1217), occupancy snap
 * (#920), or ADD-vs-REPLACE (#433).
 */

export const BROODMOTHER_SHELL_COMMIT_ID = "broodmother_rook";

export const SHELL_ARMOR_COMMIT_ABILITY = "SHELL_ARMOR";

export const LARVAE_SPAWN_COMMIT_ABILITY = "LARVAE_SPAWN";

export const LARVAE_EXPLODE_COMMIT_ABILITY = "LARVAE_EXPLODE";

/** Phase-1 and phase-2 first kit id — decide leftover of #1288. */
export const BROODMOTHER_SHELL_KIT_FIRST_ID = "summon-archer";

/** Kit RES ×1.3 leftover — not this 50% DR flag. */
export const BROODMOTHER_IRON_SKIN_LEFTOVER_ID = "spell-iron-skin";

export const BROODMOTHER_SHELL_HP = 480;

/** Production `applyLarvaeSpawn` writes one adjacent 1 HP marker. */
export const FIRST_SPAWN_LARVA_COUNT = 1;

export const FIRST_SPAWN_LARVA_HP = 1;

/** Catalog Strike (`physical_attack`) — shell `max(1, floor(dmg / 2))`. */
export const BROODMOTHER_SHELL_STRIKE_DAMAGE = 10;

export const BROODMOTHER_SHELL_STRIKE_HALVED = 5;

export const SHELL_ARMOR_LOG_NEEDLE =
  "shell armor activates while larvae are alive";

export const SHELL_ARMOR_GUIDE_NEEDLE =
  "Boss gains armor while larvae are alive";

export const SHELL_ARMOR_REGISTER_NEEDLE = "prevent Broodmother being shielded";

export const SHELL_ARMOR_CAST_LOG_NEEDLE =
  "Shell Armor absorbs half the damage (larvae are alive)!";

export type BroodmotherFirstSpawnShellArgs = {
  /** True when LARVAE_SPAWN was decided this turn (#1288 restack / empty kit). */
  spawnDecided: boolean;
  /** False when the battlefield is full / no adjacent tile. */
  spawnWroteLarva: boolean;
  /** `bossState.larvae.length` before applyLarvaeSpawn. */
  preSpawnLarvaeCount: number;
  /** Length after concatenating the new marker. */
  postSpawnLarvaeCount: number;
};

export type BroodmotherShellSoakArgs = {
  targetIsBroodmother: boolean;
  strikeDamage: number;
  currentHp: number;
  larvaeCount: number;
  shellArmorActive: boolean;
  /** Frost Bolt / SR stacking is a leftover; this sidecar is Strike DR. */
  isPhysical: boolean;
};

export type BroodmotherShellSoakExecute = {
  damage: number;
  hpAfter: number;
  rookDied: boolean;
};

function finiteNonNeg(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

export function isBroodmotherShellCommitBoss(
  bossId: string | undefined,
): boolean {
  return bossId == null || bossId === BROODMOTHER_SHELL_COMMIT_ID;
}

/** Live leftover: stamp `shellArmorActive` from pre-spawn length. */
export function liveWxFirstSpawnShellArmorActive(
  args: BroodmotherFirstSpawnShellArgs,
): boolean {
  if (args.spawnDecided !== true) return false;
  return finiteNonNeg(args.preSpawnLarvaeCount) > 0;
}

/**
 * Advertised first-spawn flag: post-spawn larvae already live, so the
 * stamp must be true. Empty / blocked spawn stays false.
 */
export function advertisedFirstSpawnShellArmorActive(
  args: BroodmotherFirstSpawnShellArgs,
): boolean {
  if (args.spawnDecided !== true) return false;
  if (args.spawnWroteLarva !== true) return false;
  return finiteNonNeg(args.postSpawnLarvaeCount) > 0;
}

/**
 * Spawn-mapping restack: keep advertised `shellArmorActive` on a
 * Broodmother first spawn. Non-Broodmother / kit-blocked / empty spawn
 * return null (siblings).
 */
export function resolveBroodmotherFirstSpawnShellArmor(
  args: {
    bossId?: string;
  } & BroodmotherFirstSpawnShellArgs,
): boolean | null {
  if (!isBroodmotherShellCommitBoss(args.bossId)) return null;
  if (args.spawnDecided !== true) return null;
  if (args.spawnWroteLarva !== true) return null;
  if (!(finiteNonNeg(args.postSpawnLarvaeCount) > 0)) return null;
  return true;
}

/** Production `castHelpers` Shell Armor: flag AND larvae live. */
export function broodmotherFirstSpawnShellStrike(opts: {
  strikeDamage: number;
  larvaeCount: number;
  shellArmorActive: boolean;
}): number {
  const raw = finiteNonNeg(opts.strikeDamage);
  if (raw <= 0) return 0;
  if (opts.shellArmorActive !== true) return raw;
  if (!(finiteNonNeg(opts.larvaeCount) > 0)) return raw;
  return Math.max(1, Math.floor(raw / 2));
}

export function canExecuteBroodmotherShellArmorSoak(
  args: BroodmotherShellSoakArgs,
): boolean {
  if (args.targetIsBroodmother !== true) return false;
  if (args.isPhysical !== true) return false;
  return finiteNonNeg(args.strikeDamage) > 0;
}

/** Alias so decide and the Strike restack cannot fork. */
export function shouldDecideBroodmotherShellArmorSoak(
  args: BroodmotherShellSoakArgs,
): boolean {
  return canExecuteBroodmotherShellArmorSoak(args);
}

export function broodmotherShellHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

export function executeBroodmotherShellArmorSoak(
  args: BroodmotherShellSoakArgs,
): BroodmotherShellSoakExecute | null {
  if (!canExecuteBroodmotherShellArmorSoak(args)) return null;
  const damage = broodmotherFirstSpawnShellStrike({
    strikeDamage: args.strikeDamage,
    larvaeCount: args.larvaeCount,
    shellArmorActive: args.shellArmorActive,
  });
  const hp = finiteNonNeg(args.currentHp);
  const hpAfter = Math.max(0, hp - damage);
  return {
    damage,
    hpAfter,
    rookDied: hpAfter <= 0,
  };
}

/** Live leftover: decide copies pre-spawn `larvae.length`, not post-spawn. */
export function wxStampsFirstSpawnShellFromPreSpawnLength(): boolean {
  return true;
}

/** `applyLarvaeSpawn` never writes `shellArmorActive`. */
export function applyLarvaeSpawnWritesShellArmorFlag(): boolean {
  return false;
}

/**
 * WX already writes `res?.newBossState` when the ability is decided.
 * This leftover is the false first-spawn flag inside that merge.
 */
export function wxAppliesBroodmotherShellNewBossState(): boolean {
  return true;
}

/** WX never maps `res.newLarvae` onto `addCombatant`. Occupancy leftover. */
export function wxFirstSpawnNewLarvaeBecomeCombatants(): boolean {
  return false;
}
