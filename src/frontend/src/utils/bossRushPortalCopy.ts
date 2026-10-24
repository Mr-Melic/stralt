/**
 * Boss Rush progression-portal nearby labels and unlock beat.
 * Display only — dungeon chain already draws canvas labels; Boss Rush does not.
 * Not wired into WorldExploration yet.
 */

export const BOSS_RUSH_UNLOCK_LOG =
  "✦ The way forward opens — walk into the glowing portal for the next room.";

/** Nearby canvas label while the progression portal is still sealed. */
export function bossRushSealedNearbyLabel(currentRoom1Based: number): string {
  const room = Math.max(1, Math.floor(Number(currentRoom1Based) || 1));
  return `🔒 Clear Room ${room} to open the way`;
}

/** Nearby canvas label after room clear, before the player steps through. */
export function bossRushAdvanceNearbyLabel(
  nextRoom1Based: number,
  totalRooms = 10,
): string {
  const next = Math.max(1, Math.floor(Number(nextRoom1Based) || 1));
  const total = Math.max(next, Math.floor(Number(totalRooms) || 10));
  return `⚔️ Next — Room ${next} / ${total}`;
}

/** Final-room clear: white sanctuary gateway. */
export const BOSS_RUSH_SANCTUARY_NEARBY = "🕊 Sanctuary gateway — step through";

/** Top HUD chip text (stone restyle is HUMAN / WorldExploration). */
export function bossRushHudChip(
  currentRoom1Based: number,
  totalRooms = 10,
): string {
  const room = Math.max(1, Math.floor(Number(currentRoom1Based) || 1));
  const total = Math.max(room, Math.floor(Number(totalRooms) || 10));
  return `Boss Rush — Room ${room} / ${total}`;
}
