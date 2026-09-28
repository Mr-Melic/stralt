/**
 * Items inventory Use chrome. Display only.
 *
 * Potions debit inventoryRef on the player battle turn only. Overworld HP
 * recovery is the HUD Doka-to-HP button (`stats.heal_with_doka_button`).
 * BuffShop titles “Only usable in battle” and never names that HUD heal, so
 * a player who bought a potion on the overworld has no next step.
 *
 * This helper is locked, not wired — BuffShop is in older open PRs (#372 /
 * #490 / #526). Wire buffShopUseTitle / BUFF_SHOP_OVERWORLD_HINT after those
 * land. Do not change tryConsumeBuffItem or overworld heal math.
 */

export const BUFF_SHOP_OVERWORLD_HINT =
  "Potions are for your battle turn. Outside a fight, heal with the Doka button on the HUD.";

export function buffShopUseTitle(opts: {
  inBattle: boolean;
  isPlayerTurn: boolean;
}): string {
  if (!opts.inBattle) {
    return "Only usable in battle — overworld heal is the Doka button on the HUD";
  }
  if (!opts.isPlayerTurn) return "Wait for your turn";
  return "Use item";
}
