/**
 * Hostile minion kit routing.
 *
 * spawnEnemySummonUnit used to strip summonAI down to chess pieceType and
 * never copy summonUnitDef.summonKit onto the unit. The WX enemy-phase
 * executor then required side === "player", so wolf / archer minions fell
 * through decideEnemyAction with empty spells and only melee/walked.
 *
 * Pack apply also requires upfront damage > 0 before it writes a DoT.
 * Venom / Poison / Inferno are catalogued as 0-damage DoTs, so even a
 * correct decideSummonAction cast was dropped and replaced by Crush.
 *
 * This sidecar is the restack seam: spawn attaches the kit, the fallthrough
 * decide call uses decideHostileCombatantAction, and the apply chain asks
 * shouldApplyEnemyCastDotOnly before fallback melee.
 */

import type { Enemy } from "../types/gameTypes.ts";
import {
  type DecideEnemyContext,
  type EnemyAction,
  decideEnemyAction,
  decideSummonAction,
} from "./enemyAI.ts";

type KitUnitDef = { summonKit?: string[]; pieceType?: string };

const SUMMON_AI_ALIASES: Record<string, string> = {
  hunter: "hunter",
  guardian: "guardian",
  archer: "archer",
  bomber: "bomber",
  healer: "healer",
  kiter: "archer",
  kamikaze: "bomber",
};

const PIECE_TO_SUMMON_AI: Record<string, string> = {
  wolf: "hunter",
  golem: "guardian",
  archer: "archer",
  bomber: "bomber",
  wisp: "healer",
};

export function shouldDecideSummonKitAction(combatant: {
  isSummon?: boolean;
}): boolean {
  return combatant.isSummon === true;
}

export function decideHostileCombatantAction(
  enemy: Enemy,
  ctx: DecideEnemyContext,
): EnemyAction {
  if (shouldDecideSummonKitAction(enemy)) {
    return decideSummonAction(enemy, ctx);
  }
  return decideEnemyAction(enemy, ctx);
}

export function normalizeSummonAI(raw: string | undefined): string | null {
  const key = (raw ?? "").trim().toLowerCase();
  if (!key) return null;
  return SUMMON_AI_ALIASES[key] ?? null;
}

export function summonAIFromPieceType(
  pieceType: string | undefined,
): string | null {
  const key = (pieceType ?? "").trim().toLowerCase();
  if (!key) return null;
  if (SUMMON_AI_ALIASES[key]) return SUMMON_AI_ALIASES[key];
  return PIECE_TO_SUMMON_AI[key] ?? null;
}

export function resolveEnemySummonAI(
  spell: { id?: string; summonAI?: string } | null | undefined,
  unitDef: { pieceType?: string } | undefined,
  catalog: ReadonlyArray<{ id: string; summonAI?: string }> = [],
): string {
  const fromSpell = normalizeSummonAI(spell?.summonAI);
  if (fromSpell) return fromSpell;
  if (spell?.id) {
    const fromCatalog = normalizeSummonAI(
      catalog.find((row) => row.id === spell.id)?.summonAI,
    );
    if (fromCatalog) return fromCatalog;
  }
  return summonAIFromPieceType(unitDef?.pieceType) ?? "hunter";
}

export function resolveSummonKitSpells<T extends { id: string }>(
  unitDef: KitUnitDef | undefined,
  catalog: ReadonlyArray<T>,
): T[] {
  const ids = unitDef?.summonKit ?? [];
  if (ids.length === 0) return [];
  const out: T[] = [];
  for (const id of ids) {
    const row = catalog.find((spell) => spell.id === id);
    if (row) out.push(row);
  }
  return out;
}

export function attachEnemySummonKit<T extends { id: string }>(
  summon: object,
  unitDef: KitUnitDef | undefined,
  catalog: ReadonlyArray<T>,
): T[] {
  const kit = resolveSummonKitSpells(unitDef, catalog);
  if (kit.length > 0) (summon as { spells: T[] }).spells = kit;
  return kit;
}

/** 0-damage catalog DoTs must apply as DoT, not Crush fallback melee. */
export function shouldApplyEnemyCastDotOnly(spell: {
  damage?: unknown;
  dotDamagePerTurn?: unknown;
  dotDamage?: unknown;
  dotDuration?: unknown;
}): boolean {
  const upfront = Number(spell.damage ?? 0);
  const tick = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  const duration = Number(spell.dotDuration ?? 0);
  return (
    Number.isFinite(upfront) &&
    upfront <= 0 &&
    Number.isFinite(tick) &&
    tick > 0 &&
    Number.isFinite(duration) &&
    duration > 0
  );
}
