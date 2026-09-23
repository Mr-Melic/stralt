# Admin Feature & Drift Audit — 2026-09-23

Compared Admin Dashboard to live game (`WorldExploration.tsx`), `src/backend/main.mo`, bindgen (`src/frontend/src/backend.ts`), `src/backend/types/admin.mo`, and current hooks. Documentation was not treated as truth.

HEAD at start: `0f5363f` (`origin/main`).

Open siblings that already edit `AdminDashboard.tsx` (oldest `createdAt` first): #334 (Tiers leftover), #341 / #413 (built-in spell Retire), #415 (computeAITier / Ground Doka / live feats / boss schema). This run **does not restack those hunks** — union means keep one implementation per name and do not overwrite a sibling’s delta. Unique honesty here is Names + leftover ShopPackage copy.

## Tiny corrections in this run

Honesty copy only. No CRUD, persist, spawn, or combat changes.

- Enemy Names CatalogNote: the pool is **live** (`getEnemyNames` → unique per-map labels). It is not the unused Enemies catalog.
- Shop CatalogNote: leftover `ShopPackage` CRUD / `initiatePurchase` stay on the canister until a deployed DID prove-out.

## Visual fallback

Custom artwork is **not** mandatory. Enemies/bosses/players draw built-in pixel patterns when no custom URL is present. WorldExploration never calls `getEnemyConfigs` / `getPlayerSpriteConfigs` / `spriteUrl` / `frontUrl`. `src/` has no `ctx.drawImage`. New enemies/bosses function with generated/default pixel visual.

## Finite-level flags

Stralt has no player level cap. Remaining hard bands (unchanged this run; WorldExploration stacked under older PRs):

- Region match uses `level <= levelMax` then discards the match.
- Primary Death Realm zone is `maxLevel: 9999`. Generation-failure fallbacks still use `maxLevel: 5` (WX ~13514, ~13646).
- `pickEnemyLevelFromTiers` still caps tier index at `floor(999 / tierSize)`.
- Motoko `LevelUpConfig` comment still says fail reaches 0 at level 200 (`admin.mo` 148).
- `computeAITier` bands 10/30/60/100/150/250/400/600/900 then 30% re-roll 1–10.

## Bindgen vs actor

`SpellConfig` in `backend.ts` includes `isSummon`, `summonAI`, `summonLifespan`, `summonUnitDef`, `cooldown`. `getAdminAuditLog` exists on the generated client. Remaining bindgen drift: mixin `isCallerAdmin` / `assignCallerUserRole` are not in `src/backend/main.mo`. App admin gate uses `getUserRole`. `useIsCallerAdmin` is defined and never called.

## GameKey vs shop packages

Live player shop is GameKey. Admin Purchases is `AdminGameKeyPurchases`. Canister `ShopPackage` CRUD and `initiatePurchase` remain unused by UI. Do not delete until a live DID prove-out.

Full records: `docs/automation/ACTION_IDS_AFDA_2026-09-23.md`.
