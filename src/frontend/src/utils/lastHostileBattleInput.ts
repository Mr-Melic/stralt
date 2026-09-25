/**
 * Last-hostile death is observed in `recheckVictory` before the
 * `[inBattle, enemies]` victory useEffect runs handleBattleEnd.
 *
 * Recap / `victoryPersistPending` stay false in that window, so HUD and
 * canvas still look live. A leftover MP walk is #546 (rAF abort). This
 * gate is the *new* click / Use / Attack Nearest in the same window:
 *
 * - Canvas walk onto lava/spikes sets `deathTriggered` and
 *   `shouldAwardVictory` refuses — `persistDeathPenalty` instead of
 *   `applyRewards`.
 * - BuffShop Use of a health potion flips `challengeHealUsedRef` after
 *   the last kill, so handleBattleEnd then fails a completed no-heal
 *   contract.
 *
 * After `setInBattle(false)` the player must still walk to the portal.
 */

export function shouldIgnoreBattleInputAfterLastHostile(opts: {
  inBattle: boolean;
  hostilesRemaining: number;
}): boolean {
  return opts.inBattle === true && opts.hostilesRemaining === 0;
}
