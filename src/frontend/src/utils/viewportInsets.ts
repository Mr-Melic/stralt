/**
 * Overlay padding that keeps chrome off the notch / home indicator.
 * Same contract as App.tsx changelog and SmallScreenGuard. Display only.
 *
 * Filename sorts after recapUnlocks so PostBattleRecap import order
 * 3-way-merges with PR #354 (featsCopy then recapUnlocks).
 */

export function overlaySafeAreaPadding(minPx = 16): string {
  const min = Math.max(0, Math.floor(Number(minPx) || 0));
  const box = `${min}px`;
  return `max(${box}, env(safe-area-inset-top, 0px)) max(${box}, env(safe-area-inset-right, 0px)) max(${box}, env(safe-area-inset-bottom, 0px)) max(${box}, env(safe-area-inset-left, 0px))`;
}

/**
 * Inner recap card. `padding: 0` is a shorthand — it must be declared
 * *before* paddingBottom so the home-indicator inset is not wiped.
 */
export function recapCardPaddingStyle(): {
  padding: number;
  paddingBottom: string;
} {
  return {
    padding: 0,
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
  };
}

/**
 * Recap dismiss keys. Space/Enter on the focused overflow panel must not
 * close the dialog, or long recaps cannot scroll with the keyboard.
 */
export function shouldDismissRecapOnKey(key: string): boolean {
  return key === "Escape";
}
