/**
 * Death / flee / defeat-recap penalty copy.
 * Display only — persist math stays in deathPenalty.ts (20% leftover XP, 40% Doka).
 * Not wired into BattleUIPanel / GameOverModal / PostBattleRecap yet.
 */

/** Short hover / title for the Flee control. */
export const FLEE_TITLE =
  "Flee — you die, lose 20% leftover XP and 40% Doka, then enter the Death Realm";

/** Native confirm body for free-exploration flee (run-themed confirm is separate). */
export const FLEE_CONFIRM =
  "Flee this fight? You will die, lose 20% leftover XP and 40% Doka, and wake in the Death Realm.";

/** Game Over / defeat line for the XP cut. Pass the floored amount already shown. */
export function deathXpLostLine(xpLost: number): string {
  const n = Math.max(0, Math.floor(Number(xpLost) || 0));
  return `−${n} leftover XP (20% of this level)`;
}

/** Game Over / defeat line for the Doka cut. */
export function deathDokaLostLine(dokaLost: number): string {
  const n = Math.max(0, Math.floor(Number(dokaLost) || 0));
  return `−${n} Doka (40% penalty)`;
}

/** Subline under defeat-recap XP loss — basis only. */
export const DEFEAT_XP_BASIS = "20% of leftover XP this level · level kept";

/** Shared footer under Game Over amounts. */
export const DEATH_LEVEL_KEPT =
  "Your level is kept. You revive at half health.";
