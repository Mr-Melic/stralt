/**
 * Last-hostile death is observed in the live store (`removeCombatant` /
 * `recheckVictory`) before the `[inBattle, enemies]` victory useEffect
 * runs `handleBattleEnd`.
 *
 * Recap / `victoryPersistPending` stay false in that window, so
 * BattleUIPanel Flee is still shown. Its `window.confirm()` is
 * synchronous and blocks that useEffect. Confirming then calls
 * `_handlePlayerDeath`: `deathTriggered` makes `shouldAwardVictory`
 * refuse — `persistDeathPenalty` (20% XP / 40% Doka) instead of
 * `applyRewards`.
 *
 * `handleBattleEnd` sets `battleEndedRef` before `setInBattle(false)`.
 * A Flee click in that frame must also no-op or it stacks a death
 * penalty on the in-flight victory credit.
 *
 * Not #606 (canvas / Use / Attack Nearest). A 0-hostile fight that
 * cannot award victory (`battleStartIdsSize === 0`) must still allow
 * Flee so the player is not trapped.
 */

export function shouldIgnoreFleeAfterLastHostile(opts: {
  inBattle: boolean;
  hostilesRemaining: number;
  battleStartIdsSize: number;
  battleEnded?: boolean;
}): boolean {
  if (opts.battleEnded === true) return true;
  return (
    opts.inBattle === true &&
    opts.hostilesRemaining === 0 &&
    opts.battleStartIdsSize > 0
  );
}
