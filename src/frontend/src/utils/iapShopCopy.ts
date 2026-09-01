/**
 * IAP modal copy. Items (BuffShop potions, Doka spend) is a different store.
 * The HUD cart next to the wallet opened a modal titled "Doka Shop" with no
 * real-money or review-delay line, so players treated it as the potion shop
 * and then hit KYC fields with no why (UX-SHOP-TWO-STORES / UX-IAP-KYC-SURPRISE).
 *
 * Display only. Does not change initiatePurchase args or required fields.
 */

export const IAP_SHOP_TITLE = "Buy Doka";

export const IAP_SHOP_PACKAGES_LEAD =
  "Real-money EUR credit for Doka — not the Items potion shop.";

export const IAP_SHOP_PACKAGES_DETAIL =
  "Doka is credited after the operator reviews the purchase. Use it to level spells and exchange for healing.";

export const IAP_SHOP_KYC_PREAMBLE =
  "This is a real-money purchase. Name, address, and a proof-of-address document go to the operator. Doka is credited after review.";

export const IAP_SHOP_CLOSE_LABEL = "Close Buy Doka";
