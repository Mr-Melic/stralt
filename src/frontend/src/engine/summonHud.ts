/**
 * Initiative-strip / boss-AI helpers for summons.
 *
 * Kept out of summonIntegration.ts so tests can import them without
 * pulling debugLogger / SpellContext (node --test cannot resolve those
 * extensionless imports).
 */

export function getPlayerSideTargets<
  T extends { side?: string; isPlayer?: boolean },
>(enemies: T[]): T[] {
  return enemies.filter((e) => e.side === "player" || e.isPlayer === true);
}

/**
 * Resolve the AP/MP to display for a turn-order combatant. Player-side
 * summons carry their own currentAp/currentMp budget (seeded in
 * spawnSummonUnit and refreshed each turn in handleSummonTurn); regular
 * enemies derive AP/MP from their level. Falls back to the combatant's
 * existing level when the enemy record is missing.
 *
 * Using the enemy-level formula for a summon made a 2-AP Archer look
 * like it still had leftover AP after Poison Arrow, so the initiative
 * strip disagreed with SummonControlPanel.
 */
export function resolveEnemyApMp(
  enemy:
    | {
        isSummon?: boolean;
        currentAp?: number;
        currentMp?: number;
        level?: number;
      }
    | undefined,
  fallbackLevel: number,
): { ap: number; mp: number } {
  if (!enemy) return { ap: fallbackLevel, mp: 1 };
  if (enemy.isSummon) {
    return {
      ap: enemy.currentAp ?? enemy.level ?? fallbackLevel,
      mp: enemy.currentMp ?? Math.max(1, Math.floor((enemy.level ?? 1) / 2)),
    };
  }
  return {
    ap: enemy.level ?? fallbackLevel,
    mp: Math.max(1, Math.floor(Number(enemy.level) / 2)),
  };
}
