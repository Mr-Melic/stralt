# Admin Feature & Drift Audit — 2026-09-26

Compared Admin Dashboard to live game (`WorldExploration.tsx`, `LandingPage.tsx`), `src/backend/main.mo`, bindgen (`src/frontend/src/backend.ts`), `src/backend/types/admin.mo`, hooks, spawn/AI, and current configuration types. Documentation was not treated as truth.

HEAD at start: `0f5363f` (`origin/main`, same SHA as the 2026-09-22 through 2026-09-25 AFDA runs). Live game and AdminDashboard copy are unchanged from yesterday.

Open siblings that already edit `AdminDashboard.tsx` (oldest `createdAt` first): #413 (retired spells / boss leave), #415 (Tiers leftover / feats / boss schema / computeAITier / Settings ban pointer), #457 (Names live + Shop leftover ShopPackage), #470 (live name-pool / Boss Rush publish confirm), #531 (Visuals palette unused-by-renderer), #539 (live system-config confirms), #564 (summon editor), #585 (Ground Doka live + Ads live). This run **does not restack those hunks**.

Did not edit WorldExploration (Death Realm fallback `maxLevel: 5` remains; older open PRs overlap that file). Did not add a summon editor or wire bosses to the canister.

## Tiny corrections in this run

Honesty comments only, in `src/backend/types/admin.mo` (no AdminDashboard restack, no CRUD, persist, spawn, or combat changes).

- `LevelUpConfig.spellFailReductionPerLevel` no longer claims fail chance “reaches 0 at level 200”. Fail floors at 0%; that is not a career cap.
- `MapModifierConfig.modifierType` is documented as free Text matching the live 22-id registry, not a two-value enum. Default seed remains slime_flood / paper_windstorm. Notes that global/second-roll fields are not on Candid.

## Visual fallback

Custom artwork is **not** mandatory. Enemies/bosses/players draw built-in pixel patterns when no custom URL is present. WorldExploration never calls `getEnemyConfigs` / `getPlayerSpriteConfigs` / `spriteUrl` / `frontUrl`. `src/` has no `ctx.drawImage` (comment-only mention in `adminVisualStatus.ts`). New enemies/bosses function with generated/default pixel visual.

## Finite-level flags

Stralt has no player level cap. Remaining hard bands (unchanged this run; WorldExploration stacked under older PRs):

- Region match uses `level <= levelMax` then discards the match (WX 3699–3706).
- Primary Death Realm zone is `maxLevel: 9999` (WX 5439). Generation-failure fallbacks still use `maxLevel: 5` (WX 13514, 13646).
- `pickEnemyLevelFromTiers` still caps tier index at `floor(999 / tierSize)` (`combatMath.ts` 58).
- Motoko `LevelUpConfig` comment no longer treats 200 as a ceiling (`types/admin.mo`). Admin fail-chance help already says there is no career cap (`AdminDashboard.tsx` 4561–4564).
- `computeAITier` bands 10/30/60/100/150/250/400/600/900 then 30% re-roll 1–10.

## Bindgen vs actor

`SpellConfig` in `backend.ts` 118–152 includes `isSummon`, `summonAI`, `summonLifespan`, `summonUnitDef`, `cooldown`. `getAdminAuditLog` exists on the generated client. Remaining bindgen drift: mixin `isCallerAdmin` / `assignCallerUserRole` are not in `src/backend/main.mo`. App admin gate uses `getUserRole`. `useIsCallerAdmin` is defined and never called.

## GameKey vs shop packages

Live player shop is GameKey. Admin Purchases is `AdminGameKeyPurchases`. Canister `ShopPackage` CRUD, `initiatePurchase`, and `setShopPaymentLink` / `getShopPaymentLinks` remain unused by UI. Do not delete until a live DID prove-out. Shop leftover sentence is queued in #457.

Full records: `docs/automation/ACTION_IDS_AFDA_2026-09-26.md`.
