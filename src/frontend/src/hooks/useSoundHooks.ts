// Sound-ready hooks — no-op stubs ready for future sound library integration.
// Import playSound wherever a game event fires; drop in a real audio library later
// without touching any call sites.

export type SoundEvent =
  | "spell_cast"
  | "spell_hit"
  | "enemy_death"
  | "player_damage"
  | "doka_collected"
  | "map_transition"
  | "battle_start"
  | "battle_end"
  | "level_up"
  | "critical_hit"
  | "combo"
  | "leader_boost";

/**
 * Fire a sound event.
 * Currently a no-op that logs to debug — swap implementation here when ready.
 *
 * @param event  The type of game event
 * @param context Optional context string (e.g. spell name, enemy name)
 */
export function playSound(event: SoundEvent, context?: string): void {
  // To wire real audio, replace this body with your audio library call:
  //   audioEngine.play(event, { context });
  if (import.meta.env.DEV) {
    console.debug("[Sound]", event, context ?? "");
  }
}
