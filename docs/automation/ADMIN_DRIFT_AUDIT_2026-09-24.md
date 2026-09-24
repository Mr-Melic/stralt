# Admin Feature & Drift Audit — 2026-09-24

Compared Admin Dashboard to live game (`WorldExploration.tsx`), `src/backend/main.mo`, bindgen (`src/frontend/src/backend.ts`), `src/backend/types/admin.mo`, and current hooks. Documentation was not treated as truth.

HEAD at start: `0f5363f` (`origin/main`).

Open siblings that already edit `AdminDashboard.tsx` (oldest `createdAt` first): #334 (Tiers leftover), #341 / #413 / #470 (built-in spell Retire), #415 (computeAITier / Ground Doka / live feats / boss schema), #457 (Names live + Shop leftover ShopPackage). This run **does not restack those hunks**. Unique honesty here is Visuals palette unused-by-renderer.

Did not edit WorldExploration (Death Realm fallback `maxLevel: 5` remains; older open PRs overlap that file). Did not add a summon editor or wire bosses to the canister.

## Tiny corrections in this run

Honesty copy only. No CRUD, persist, spawn, or combat changes.

- Visuals intro no longer claims it paints the paper-vertex landscape.
- Visuals CatalogNote: save dual-writes `paperVertexPalette` + `pbv_color_palette`; world hydrate caches only; map walls still use hardcoded `WALL_PALETTES`.
- Unchecked-slot help no longer promises “true random colors” in play.

## Visual fallback

Custom artwork is **not** mandatory. Enemies/bosses/players draw built-in pixel patterns when no custom URL is present. WorldExploration never calls `getEnemyConfigs` / `getPlayerSpriteConfigs` / `spriteUrl` / `frontUrl`. `src/` has no `ctx.drawImage`. New enemies/bosses function with generated/default pixel visual.

## Finite-level flags

Stralt has no player level cap. Remaining hard bands (unchanged this run; WorldExploration stacked under older PRs):

- Region match uses `level <= levelMax` then discards the match.
- Primary Death Realm zone is `maxLevel: 9999`. Generation-failure fallbacks still use `maxLevel: 5` (WX ~13514, ~13646).
- `pickEnemyLevelFromTiers` still caps tier index at `floor(999 / tierSize)`.
- Motoko `LevelUpConfig` comment still says fail reaches 0 at level 200 (`types/admin.mo` 148).
- `computeAITier` bands 10/30/60/100/150/250/400/600/900 then 30% re-roll 1–10.

## Bindgen vs actor

`SpellConfig` in `backend.ts` includes `isSummon`, `summonAI`, `summonLifespan`, `summonUnitDef`, `cooldown`. `getAdminAuditLog` exists on the generated client. Remaining bindgen drift: mixin `isCallerAdmin` / `assignCallerUserRole` are not in `src/backend/main.mo`. App admin gate uses `getUserRole`. `useIsCallerAdmin` is defined and never called.

## GameKey vs shop packages

Live player shop is GameKey. Admin Purchases is `AdminGameKeyPurchases`. Canister `ShopPackage` CRUD and `initiatePurchase` remain unused by UI. Do not delete until a live DID prove-out. Shop leftover sentence is queued in #457.

Full records: `docs/automation/ACTION_IDS_AFDA_2026-09-24.md`.
