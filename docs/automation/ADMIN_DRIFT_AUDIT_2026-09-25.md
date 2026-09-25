# Admin Feature & Drift Audit — 2026-09-25

Compared Admin Dashboard to live game (`WorldExploration.tsx`, `LandingPage.tsx`), `src/backend/main.mo`, bindgen (`src/frontend/src/backend.ts`), `src/backend/types/admin.mo`, and current hooks. Documentation was not treated as truth.

HEAD at start: `0f5363f` (`origin/main`, same SHA as the 2026-09-22/23/24 AFDA runs).

Open siblings that already edit `AdminDashboard.tsx` (oldest `createdAt` first): #413 (retired spells / boss leave), #415 (Tiers leftover / feats / boss schema / computeAITier), #457 (Names live + Shop leftover ShopPackage), #470 (live name-pool / Boss Rush publish confirm), #531 (Visuals palette unused-by-renderer), #539 (live system-config confirms), #564 (summon editor). This run **does not restack those hunks**. Unique honesty: Ground Doka is live; Ads slots are live.

Did not edit WorldExploration (Death Realm fallback `maxLevel: 5` remains; older open PRs overlap that file). Did not add a summon editor or wire bosses to the canister.

## Tiny corrections in this run

Honesty copy only. No CRUD, persist, spawn, or combat changes.

- Ground Doka / leaderBoost panel now states WorldExploration hydrates `getGameConfig` and that save is live (`AdminDashboard.tsx` ~6212–6217).
- Ads tab now states LandingPage reads `getAdBoxes` (`AdminDashboard.tsx` ~6890–6894). Custom ad art is optional.

## Visual fallback

Custom artwork is **not** mandatory. Enemies/bosses/players draw built-in pixel patterns when no custom URL is present. WorldExploration never calls `getEnemyConfigs` / `getPlayerSpriteConfigs` / `spriteUrl` / `frontUrl`. `src/` has no `ctx.drawImage` (comment-only mention in `adminVisualStatus.ts`). New enemies/bosses function with generated/default pixel visual.

## Finite-level flags

Stralt has no player level cap. Remaining hard bands (unchanged this run; WorldExploration stacked under older PRs):

- Region match uses `level <= levelMax` then discards the match (WX 3699–3706).
- Primary Death Realm zone is `maxLevel: 9999` (WX 5439). Generation-failure fallbacks still use `maxLevel: 5` (WX 13514, 13646).
- `pickEnemyLevelFromTiers` still caps tier index at `floor(999 / tierSize)` (`combatMath.ts` 58).
- Motoko `LevelUpConfig` comment still says fail reaches 0 at level 200 (`types/admin.mo` 148). Admin fail-chance help does not.
- `computeAITier` bands 10/30/60/100/150/250/400/600/900 then 30% re-roll 1–10.

## Bindgen vs actor

`SpellConfig` in `backend.ts` 118–152 includes `isSummon`, `summonAI`, `summonLifespan`, `summonUnitDef`, `cooldown`. `getAdminAuditLog` exists on the generated client. Remaining bindgen drift: mixin `isCallerAdmin` / `assignCallerUserRole` are not in `src/backend/main.mo`. App admin gate uses `getUserRole`. `useIsCallerAdmin` is defined and never called.

## GameKey vs shop packages

Live player shop is GameKey. Admin Purchases is `AdminGameKeyPurchases`. Canister `ShopPackage` CRUD, `initiatePurchase`, and `setShopPaymentLink` / `getShopPaymentLinks` remain unused by UI. Do not delete until a live DID prove-out. Shop leftover sentence is queued in #457.

Full records: `docs/automation/ACTION_IDS_AFDA_2026-09-25.md`.
