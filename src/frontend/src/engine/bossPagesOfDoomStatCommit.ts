/**
 * Pale Archivist `PAGES_OF_DOOM` writes `stat: "spell_${mostUsed}"`
 * (`useBossSystem` `applyPagesOfDoom`). `spellSchoolUsageCounts` is never
 * incremented, so the empty-map path always picks `mostUsed = "physical"`
 * and the row is `spell_physical` / modifier 0.8 / duration 3 plus the log
 * "curses your most-used spell school (physical)! -20% damage for 3 turns!".
 *
 * Live WorldExploration copies `d.stat` as-is (~16048). `computeDamage`
 * then queries `getStatModifier("player", "dmg", effects)` (~3325). Exact
 * match fails, so Strike (`physical_attack`, advertised 10, `isPhysical`)
 * stays 10 instead of `floor(10 * 0.8) = 8`. Frost Bolt advertised 20 has
 * no school metadata and is not physical — it must stay 20.
 *
 * Unique extra vs:
 * - #1035 Exsanguinated `healing` → `healRecv` (Blood Mend only).
 * - #1040 CURSE_ON_HIT `all` → every multiplicative key (`dmg`/`res`/
 *   `healRecv`). That sidecar's tests **leave** `spell_physical`
 *   unmapped. Do **not** alias `"all"` here, and do **not** rewrite
 *   `spell_physical` onto stored `dmg` (that would shred Frost Bolt).
 * - #658 catalog `res_sp` matcher. Do **not** alias `spell_*` inside
 *   `getStatModifier` from this file; restack that one function onto
 *   `getStatModifierHonoringPagesOfDoom` after older combat PRs land.
 * - #915 kit Cursed Wound already-`healRecv` (Pale Archivist kit first
 *   ids still shadow this ability while `pickBossKitSpell` sees a
 *   cold pool — unique leftover of turn logic, not restored here).
 * - #692 Blood Mend advertised CHC. This sidecar only makes the
 *   existing `dmg` multiply fire for the matching school.
 *
 * AP / MP stay additive. Incoming `res` / Blood Mend `healRecv` stay 1
 * — this is a school tax, not Archbishop's Curse.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * statusEffects.ts, spellEngine.ts, or challengeCompletion.ts.
 * Restack `computeDamage`'s `dmg` query onto
 * `getStatModifierHonoringPagesOfDoom(..., pagesOfDoomOutgoingSchool({
 *   isPhysical: spell.isPhysical }))` after those PRs land.
 */

import { hpAfterHeal } from "./battleSetup.ts";
import {
  type StatModifiableEffect,
  getStatModifier,
  isAdditiveResourceStat,
} from "./statusEffects.ts";

export const PAGES_OF_DOOM_ABILITY = "PAGES_OF_DOOM";

/** Production `applyPagesOfDoom` empty-count default. */
export const PAGES_OF_DOOM_DEFAULT_SCHOOL = "physical";

export const PAGES_OF_DOOM_STAT_PREFIX = "spell_";

/** Production empty-count stat key. */
export const PAGES_OF_DOOM_STAT_LIVE = `${PAGES_OF_DOOM_STAT_PREFIX}${PAGES_OF_DOOM_DEFAULT_SCHOOL}`;

/** Production multiplier — advertised "-20% damage". */
export const PAGES_OF_DOOM_MODIFIER = 0.8;

export const PAGES_OF_DOOM_DURATION = 3;

export const PAGES_OF_DOOM_EFFECT_NAME_PREFIX = "Pages of Doom:";

export const PAGES_OF_DOOM_LOG_NEEDLE = "curses your most-used spell school";

export type BossPagesOfDoomDebuffLike = {
  stat?: string | null;
  modifier?: number | null;
  duration?: number | null;
  effectName?: string | null;
  iconEmoji?: string | null;
};

export type BossPagesOfDoomActionLike = {
  type?: string | null;
  ability?: string | null;
  abilityResult?: {
    damageToPlayer?: number | null;
    debuffsApplied?: BossPagesOfDoomDebuffLike[] | null;
    logMessages?: string[] | null;
    playerApModifier?: number | null;
  } | null;
};

export type CommittedPagesOfDoomEffect = {
  targetId: string;
  type: "debuff";
  stat: string;
  modifier: number;
  duration: number;
  effectName: string;
};

export type PagesOfDoomOutgoing = {
  isPhysical?: boolean | null;
  school?: string | null;
};

export type BossPagesOfDoomStatCommit = {
  effects: CommittedPagesOfDoomEffect[];
  school: string;
  dmgPhysical: number;
  dmgUnschooled: number;
  dmgForRowSchool: number;
  res: number;
  healRecv: number;
  ap: number;
  mp: number;
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

function schoolFromStat(stat: string): string {
  if (!stat.startsWith(PAGES_OF_DOOM_STAT_PREFIX)) return "";
  return stat.slice(PAGES_OF_DOOM_STAT_PREFIX.length);
}

export function pagesOfDoomStatForSchool(school: string): string {
  return `${PAGES_OF_DOOM_STAT_PREFIX}${school}`;
}

/**
 * Live leftover identity: boss wrote `spell_*` with the advertised
 * 0.8 / 3 Pages payload. Exsanguinated `healing`, CURSE_ON_HIT `all`,
 * and catalog `res_sp` stay off this matcher.
 */
export function isBossPagesOfDoomSpellStatRow(
  row: BossPagesOfDoomDebuffLike,
): boolean {
  const stat = row.stat;
  if (!stat || !stat.startsWith(PAGES_OF_DOOM_STAT_PREFIX)) return false;
  if (!schoolFromStat(stat)) return false;
  const modifier = finiteNumber(row.modifier);
  if (modifier == null || modifier !== PAGES_OF_DOOM_MODIFIER) return false;
  const duration = finiteNumber(row.duration);
  if (duration == null || duration < 1) return false;
  if (
    row.effectName &&
    !row.effectName.startsWith(PAGES_OF_DOOM_EFFECT_NAME_PREFIX)
  ) {
    return false;
  }
  return true;
}

function isPagesOfDoomAbilityAction(
  action: BossPagesOfDoomActionLike,
): boolean {
  if (
    action.type === "attack" ||
    action.type === "spell" ||
    action.type === "move"
  ) {
    return false;
  }
  if (action.ability === PAGES_OF_DOOM_ABILITY) return true;
  const logs = action.abilityResult?.logMessages ?? [];
  return logs.some((line) => line.includes(PAGES_OF_DOOM_LOG_NEEDLE));
}

/**
 * Advertised Pages rows that still carry `spell_*`. Kit Cursed Wound
 * (`type: "spell"` / `healRecv`) and Exsanguinated (`healing`) return null.
 */
export function bossPagesOfDoomRowsFromAction(
  action: BossPagesOfDoomActionLike,
): BossPagesOfDoomDebuffLike[] | null {
  if (!isPagesOfDoomAbilityAction(action)) return null;
  const rows = action.abilityResult?.debuffsApplied ?? [];
  const hits = rows.filter(isBossPagesOfDoomSpellStatRow);
  return hits.length > 0 ? hits : null;
}

/**
 * Strike is `isPhysical`. Frost Bolt / Blood Mend have no school field —
 * do not name-heuristic them. Empty school means "do not honour
 * `spell_physical`".
 */
export function pagesOfDoomOutgoingSchool(
  outgoing: PagesOfDoomOutgoing = {},
): string {
  const named = outgoing.school?.trim() ?? "";
  if (named) return named;
  if (outgoing.isPhysical === true) return PAGES_OF_DOOM_DEFAULT_SCHOOL;
  return "";
}

/**
 * `spell_${school}` matches outgoing `dmg` for that school only.
 * Additive AP/MP and incoming `res` / `healRecv` must not pick it up.
 */
export function effectStatMatchesPagesOfDoom(
  effectStat: string,
  queryStat: string,
  outgoingSchool: string,
): boolean {
  if (effectStat === queryStat) return true;
  if (queryStat !== "dmg") return false;
  if (isAdditiveResourceStat(queryStat)) return false;
  if (!outgoingSchool) return false;
  return effectStat === pagesOfDoomStatForSchool(outgoingSchool);
}

/**
 * Same product/sum as `getStatModifier`, plus `spell_${school}` on
 * outgoing `dmg` for that school. Does not rewrite the stored stat.
 */
export function getStatModifierHonoringPagesOfDoom(
  targetId: string,
  stat: string,
  effects: readonly StatModifiableEffect[],
  outgoingSchool: string,
): number {
  let value = getStatModifier(targetId, stat, effects);
  if (stat !== "dmg" || !outgoingSchool) return value;
  const key = pagesOfDoomStatForSchool(outgoingSchool);
  for (const eff of effects) {
    if (eff.targetId !== targetId || eff.stat !== key) continue;
    if (eff.type === "buff" || eff.type === "debuff") {
      value *= eff.modifier ?? 1;
    }
  }
  return value;
}

function commitPagesRows(
  action: BossPagesOfDoomActionLike,
): CommittedPagesOfDoomEffect[] {
  const rows = action.abilityResult?.debuffsApplied ?? [];
  const out: CommittedPagesOfDoomEffect[] = [];
  for (const row of rows) {
    const stat = row.stat;
    if (!stat) continue;
    const modifier = finiteNumber(row.modifier);
    const duration = finiteNumber(row.duration);
    if (modifier == null || duration == null || duration < 1) continue;
    out.push({
      targetId: "player",
      type: "debuff",
      stat,
      modifier,
      duration: Math.max(1, Math.floor(duration)),
      effectName:
        row.effectName ??
        `${PAGES_OF_DOOM_EFFECT_NAME_PREFIX} ${PAGES_OF_DOOM_DEFAULT_SCHOOL}`,
    });
  }
  return out;
}

function schoolFromEffects(
  effects: readonly CommittedPagesOfDoomEffect[],
): string {
  for (const effect of effects) {
    if (isBossPagesOfDoomSpellStatRow(effect)) {
      return schoolFromStat(effect.stat);
    }
  }
  return "";
}

function modsFromEffects(
  effects: readonly CommittedPagesOfDoomEffect[],
  honorSchool: boolean,
): Omit<BossPagesOfDoomStatCommit, "effects" | "school"> {
  const school = schoolFromEffects(effects);
  const read = (stat: string, outgoingSchool: string) =>
    honorSchool
      ? getStatModifierHonoringPagesOfDoom(
          "player",
          stat,
          effects,
          outgoingSchool,
        )
      : getStatModifier("player", stat, effects);
  return {
    dmgPhysical: read("dmg", PAGES_OF_DOOM_DEFAULT_SCHOOL),
    dmgUnschooled: read("dmg", ""),
    dmgForRowSchool: read("dmg", school),
    res: read("res", school),
    healRecv: read("healRecv", school),
    ap: read("ap", school),
    mp: read("mp", school),
  };
}

/**
 * Production WX (~16048 / ~3325): copy `d.stat` as-is through stock
 * `getStatModifier`. Strike `dmg` stays 1.
 */
export function wxBossPagesOfDoomCommitWithoutSchoolDmg(opts: {
  action: BossPagesOfDoomActionLike;
}): BossPagesOfDoomStatCommit {
  const effects = commitPagesRows(opts.action);
  return {
    effects,
    school: schoolFromEffects(effects),
    ...modsFromEffects(effects, false),
  };
}

/**
 * Honour `spell_${school}` onto outgoing `dmg` for that school. Does
 * **not** rewrite the stored stat to `dmg`, and does **not** shred
 * `res` / `healRecv` / AP / MP.
 */
export function resolveBossPagesOfDoomStatCommit(opts: {
  action: BossPagesOfDoomActionLike;
}): BossPagesOfDoomStatCommit {
  const effects = commitPagesRows(opts.action);
  return {
    effects,
    school: schoolFromEffects(effects),
    ...modsFromEffects(effects, true),
  };
}

/** True when live WX would leave advertised physical Strike shred on the floor. */
export function wxBossPagesOfDoomDroppedPhysicalDmg(opts: {
  action: BossPagesOfDoomActionLike;
}): boolean {
  const live = wxBossPagesOfDoomCommitWithoutSchoolDmg(opts);
  const fixed = resolveBossPagesOfDoomStatCommit(opts);
  return live.dmgPhysical !== fixed.dmgPhysical;
}

/**
 * `computeDamage` outgoing arm: multiply only when the modifier is not 1.
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

export function playerHealAmountAfterHealRecv(
  baseHeal: number,
  healRecvMod: number,
): number {
  const base = finiteNumber(baseHeal) ?? 0;
  const mod = finiteNumber(healRecvMod);
  if (mod == null || mod === 1) return base;
  return Math.round(base * mod);
}

export function playerHpAfterBloodMend(opts: {
  hp: number;
  maxHp: number;
  baseHeal: number;
  healRecv: number;
}): number {
  const restored = playerHealAmountAfterHealRecv(opts.baseHeal, opts.healRecv);
  return hpAfterHeal(opts.hp, opts.maxHp, restored);
}
