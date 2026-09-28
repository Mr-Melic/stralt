# Admin Feature & Drift Audit — 2026-09-28

Compared Admin Dashboard to live game (`WorldExploration.tsx`, `LandingPage.tsx`, `BuffShop.tsx`), `src/backend/main.mo`, bindgen (`src/frontend/src/backend.ts`), `src/backend/types/admin.mo`, hooks, spawn/AI (`combatMath.ts`, `spawnPolicy.ts`), map-modifier rolls (`engine/mapModifiers.ts`), and current configuration types. Documentation was not treated as truth.

HEAD at start: `0f5363f` (`origin/main`, same SHA as the 2026-09-22 through 2026-09-27 AFDA runs). Live game and AdminDashboard copy are unchanged from yesterday.

Open siblings that already edit `AdminDashboard.tsx` (oldest `createdAt` first): #413 (retired spells / boss leave), #415 (Tiers leftover / feats / boss schema / computeAITier / Settings ban pointer), #457 (Names live + Shop leftover ShopPackage), #470 (live name-pool / Boss Rush publish confirm), #531 (Visuals palette unused-by-renderer), #539 (live-publish confirms), #564 (summon editor), #585 (Ground Doka live + Ads live), #631 (shop busy-lock helpers). Motoko type-comment honesty is queued in #620. Last-live / last-seeded map-modifier guards are queued in #626 / #650 / #703. GameKey approve busy-lock is queued in #664. Last-live achievement catalog guard is queued in #733. This run **does not restack those hunks**.

Did not edit WorldExploration (Death Realm fallback `maxLevel: 5` remains; older open PRs overlap that file). Did not add a summon editor or wire bosses to the canister. Did not repeat #620’s `types/admin.mo` comments.

## Tiny corrections in this run

Stale `usePanelLayout.ts` JSDoc claimed generated bindgen still omitted `getUserUiLayout` / `saveUserUiLayout`. Both methods (and the five `adminRollback*` plus `getAdminAuditLog`) are already on `backend.ts`. The local `UiLayoutActor` extension is a no-op superset for mocks. Dashboard still has no rollback/audit UI (012).

No AdminDashboard honesty this run (already queued). Unique product findings: **AFDA-2026-09-28-032** (admin can empty the live portal-modifier pool; prefer #626 / #650 / #703) and **AFDA-2026-09-28-034** (admin can empty the achievement catalog when no progress exists; prefer #733).

## Visual fallback

Custom artwork is **not** mandatory. Enemies/bosses/players draw built-in pixel patterns when no custom URL is present. WorldExploration never calls `getEnemyConfigs` / `getPlayerSpriteConfigs` / `spriteUrl` / `frontUrl`. `src/` has no `ctx.drawImage` (comment-only mention in `adminVisualStatus.ts`). New enemies/bosses function with generated/default pixel visual.

## Finite-level flags

Stralt has no player level cap. Remaining hard bands (unchanged this run except extra evidence):

- Region match uses `level <= levelMax` then discards the match (WX 3702).
- Primary Death Realm zone is `maxLevel: 9999` (WX 5439). Generation-failure fallbacks still use `maxLevel: 5` (WX 13514, 13646).
- `pickEnemyLevelFromTiers` still caps tier index at `floor(999 / tierSize)` (`combatMath.ts` 58).
- Motoko `LevelUpConfig` comment on **main** still says fail “reaches 0 at level 200” (`types/admin.mo` 148). Fix is queued in #620.
- `adminGuard.validateSpellConfig` rejects `minLevel > 999` (`adminGuard.mo` 411). Frontend `adminSafety.validateSpellConfig` does not check `minLevel`. Game hydrate still ignores `minLevel` (014).
- `computeAITier` bands 10/30/60/100/150/250/400/600/900 then 30% re-roll 1–10.

## Bindgen vs actor

`SpellConfig` in `backend.ts` 118–152 includes `isSummon`, `summonAI`, `summonLifespan`, `summonUnitDef`, `cooldown`. `getAdminAuditLog`, `getUserUiLayout`, and `saveUserUiLayout` exist on the generated client. Remaining bindgen drift: mixin `isCallerAdmin` / `assignCallerUserRole` are not in `src/backend/main.mo`. App admin gate uses `getUserRole`. `useIsCallerAdmin` is defined and never called.

## GameKey vs shop packages

Live player shop is GameKey. Admin Purchases is `AdminGameKeyPurchases`. Canister `ShopPackage` CRUD, `initiatePurchase`, and `setShopPaymentLink` / `getShopPaymentLinks` remain unused by UI. Do not delete until a live DID prove-out. Shop leftover sentence is queued in #457.

Full records: `docs/automation/ACTION_IDS_AFDA_2026-09-28.md`.
