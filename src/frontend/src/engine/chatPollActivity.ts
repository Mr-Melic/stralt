/**
 * General-chat getMessages polling must stay off the WorldExploration React
 * tree and must not restart when the player folds chat or switches channels.
 * Distinct from battle-log virtualization (PERF-019) and the 200-message cap
 * (PERF-020).
 */

export function shouldCountGeneralChatUnread(
  isFolded: boolean,
  activeChannel: string,
): boolean {
  return isFolded || activeChannel !== "general";
}

export function shouldTickChatPoll(
  isPaused: boolean,
  tabVisible: boolean,
): boolean {
  return !isPaused && tabVisible;
}
