/**
 * ProfileSetup account-name chrome. Display only — not wired into ProfileSetup.tsx.
 *
 * UX-PROFILE-BOARD-NAME-MISLEAD: helper claims the account name is "shown on the
 * board", but getLeaderboard uses the highest-level *champion* name.
 * UX-ACCOUNT-VS-CHAMPION-NAME: players next forge a champion name with no map of
 * which name appears where.
 */

export const PROFILE_NAME_LABEL = "Your account name";

export const PROFILE_NAME_HINT =
  "2–50 characters. Used in chat and the lobby welcome. Your champion name (next step) is what the Board and realm HUD show.";

export const PROFILE_SUBMIT_LABEL = "Save name — forge a champion next";

export const CHAMPION_NAME_HINT =
  "This champion name appears on the realm HUD and the Board. Your account name stays for chat.";
