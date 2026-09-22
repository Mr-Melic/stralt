/**
 * ChatPanel composer / debug-mirror helpers.
 * Distinct from poll identity (PERF-063), width-drag rAF (PERF-064),
 * and battle-log virtualization (PERF-019).
 */

/** Focus the composer when the panel is open — not on poll / log identity churn. */
export function shouldFocusChatComposer(isFolded: boolean): boolean {
  return !isFolded;
}

/**
 * Click-trace React mirror is only needed while the Debug → Clicks sub-view
 * is visible. Log-tab debugEntries ticks must not setState a second list.
 */
export function shouldRefreshClickTraceMirror(
  activeChannel: string,
  debugSubView: string,
): boolean {
  return activeChannel === "debug" && debugSubView === "clicks";
}
