/**
 * Map-effects HUD copy. Display only — does not change roll chance or hooks.
 * Parent already filtered to this visit's rolled types.
 */

export const MAP_MODIFIERS_PANEL_TITLE = "Map Effects";

export const MAP_MODIFIERS_PANEL_WHY =
  "These rules apply to the whole map this visit.";

export function shouldShowMapModifiersPanel(
  modifiers: readonly unknown[],
): boolean {
  return modifiers.length > 0;
}
