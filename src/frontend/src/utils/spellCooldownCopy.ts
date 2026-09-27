/**
 * Display copy for configured spell cooldowns.
 * Inferno is the only gifted starter with a lock (`cooldown: 3`).
 * The burn duration is a different number in the same sentence until this clause.
 */

import { nextSpellCooldownTurns } from "./challengeCompletion.ts";

/** "3-turn cooldown" or empty when the spell has no lock. */
export function spellCardCooldownClause(cooldown: unknown): string {
  const turns = nextSpellCooldownTurns(cooldown);
  if (turns <= 0) return "";
  return `${turns}-turn cooldown`;
}

/**
 * Append the configured lock to a card description when it is missing.
 * Does not change AP, damage, or `cooldown` itself.
 */
export function spellCardDescriptionWithCooldown(
  baseDescription: string,
  cooldown: unknown,
): string {
  const clause = spellCardCooldownClause(cooldown);
  const base = String(baseDescription ?? "").trim();
  if (!clause) return base;
  if (new RegExp(`\\b${clause}\\b`, "i").test(base)) return base;
  return `${base.replace(/[.]+$/, "")}. ${clause}.`;
}

/** Gifted-book honesty: a live lock must be named before the first cast. */
export function giftedSpellNamesConfiguredCooldown(
  description: string,
  cooldown: unknown,
): boolean {
  const turns = nextSpellCooldownTurns(cooldown);
  if (turns <= 0) return true;
  return new RegExp(`${turns}-turn cooldown`, "i").test(
    String(description ?? ""),
  );
}
