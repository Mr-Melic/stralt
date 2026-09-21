/**
 * Presentation-only BuffShop IMPACT. Matches `handleUseItem` restore
 * amounts and resource copy. Does not change potion math or shop prices.
 */

export function buffItemHealAmount(
  itemType: string,
  maxHp: number,
): number | null {
  const cap = Math.max(0, Math.floor(Number(maxHp) || 0));
  if (itemType === "health_potion") return Math.floor(cap * 0.3);
  if (itemType === "greater_health_potion") return Math.floor(cap * 0.7);
  return null;
}

export function buffItemResourceFloat(
  itemType: string,
): { text: string; color: string } | null {
  switch (itemType) {
    case "battle_elixir":
      return { text: "+3 AP", color: "#60a5fa" };
    case "swift_boots":
      return { text: "+2 MP", color: "#34d399" };
    case "shield_charm":
      return { text: "+20 Shield", color: "#818cf8" };
    case "fury_potion":
      return { text: "+25% Dmg", color: "#f97316" };
    default:
      return null;
  }
}
