/**
 * Sonner toaster sits in the game tree (App.tsx) and is used for death,
 * sanctuary, and spell-bar copy. Keep it below the 44px + notch HUD without
 * changing the default right inset (a single --offset would also pad the
 * right edge by the HUD height).
 */

export const TOAST_BELOW_HUD_CLASS =
  "data-[y-position=top]:!top-[calc(var(--app-top-hud-height,44px)+8px)]";

/** Action / close floors. Current death/sanctuary toasts are copy-only. */
export const TOAST_ACTION_TARGET_CLASS = "min-h-[44px] min-w-[44px]";

export const TOAST_OVERSCROLL_CLASS = "overscroll-contain touch-manipulation";
