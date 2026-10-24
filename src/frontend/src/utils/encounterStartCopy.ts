/**
 * Encounter-start feedback. Display only — not wired into WorldExploration.tsx.
 *
 * UX-ENCOUNTER-NO-BANNER: bosses get a fixed purple banner; normal pack fights
 * only append "Battle started!" to the battle log (easy to miss under Chat).
 */

export const ENCOUNTER_BANNER = (enemyCount: number): string =>
  enemyCount <= 1
    ? "⚔ Encounter — fight starts"
    : `⚔ Encounter — ${enemyCount} foes`;

export const ENCOUNTER_YOUR_TURN =
  "Your turn — Walk spends MP, Attack spends AP";

export const ENCOUNTER_FIRST_MAP_HINT =
  "Walk onto a hostile piece to start a fight. Portals advance the realm.";
