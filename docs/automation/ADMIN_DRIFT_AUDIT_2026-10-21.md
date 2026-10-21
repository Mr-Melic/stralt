# Admin Feature & Drift Audit — 2026-10-21

Compared Admin Dashboard to live game (`WorldExploration.tsx`), `src/backend/main.mo`, bindgen (`src/frontend/src/backend.ts`), `src/backend/types/admin.mo`, `adminGuard.mo`, hooks, `spellData.ts`, `BUFF_ITEMS`, and `BUFF_CATALOG`. Documentation was not treated as truth.

HEAD at start: `0f5363f` (same as `origin/main` and the 2026-09-21–29 AFDA baselines). First AFDA run since 2026-09-29 (#780). Main has not moved. Open-PR queue is 482 (highest #813).

## Tiny corrections in this run

Honesty comment only. No CRUD, persist, spawn, or combat changes.

- `useBossQueries.ts` now states live kits are `data/bossKits.ts` (spellData ids) while canister `defaultBossConfigs` still seed retired ids and stay unused until hooks call `setBossConfig`. Tracked as AFDA-2026-09-21-025 (comment) + AFDA-2026-10-21-038.

Did not restack AdminDashboard hunks queued on older PRs (#334, #341, #413, #415, #457, #470, #531, #539, #564, #585). Did not restack Motoko type comments (#620), leftover-alias docs (#681), `usePanelLayout.ts` JSDoc (#741), `combatMath.ts` levelVarianceChance comment (#780), last-live modifier/achievement guards (#626 / #650 / #703 / #733), summon editor (#564), or BuffShop / `useBossRush.ts` siblings.

Did not edit WorldExploration (Death Realm fallback `maxLevel: 5` remains).

## Visual fallback

Custom artwork is **not** mandatory. Enemies/bosses/players draw built-in pixel patterns when no custom URL is present. WorldExploration never calls `getEnemyConfigs` / `getPlayerSpriteConfigs` / `spriteUrl` / `frontUrl`. `src/` has no `ctx.drawImage`. New enemies/bosses function with generated/default pixel visual.

## Finite-level flags

Stralt has no player level cap. Remaining hard bands:

- Region match uses `level <= levelMax` (`WorldExploration.tsx` 3662–3664) then **discards** the match.
- Primary Death Realm zone is `maxLevel: 9999` (5439). Generation-failure fallbacks still use `maxLevel: 5` (13514, 13646).
- `pickEnemyLevelFromTiers` still caps tier index at `floor(999 / tierSize)` (`combatMath.ts` 58).
- `adminGuard` rejects spell `minLevel > 999` (411). Hydrate still ignores `minLevel`.
- Motoko `LevelUpConfig` comment still says fail reaches 0 at level 200 (`types/admin.mo` 148). Admin fail-chance help does not.
- `computeAITier` bands 10/30/60/100/150/250/400/600/900 then random 1–10.

## New this run

1. **Three buff catalogs** (AFDA-2026-10-21-037). Official Items shop is `BuffShop.BUFF_ITEMS` + localStorage (`tryPurchaseBuffItem`); it never calls `getBuffCatalog` / `purchaseBuff`. Canister `BUFF_CATALOG` uses `greater_potion` (not `greater_health_potion`) and different prices on elixir/boots/charm/fury. Mock `getBuffCatalog` is a third catalog (`atk_boost` / `def_shield`). Admin has no buff editor. Prefer #466 for the id-alias lock; do not restack BuffShop.

2. **Three spell-id namespaces** (AFDA-2026-10-21-038). Live innate bar + `ENEMY_KITS` + `bossKits.ts` use `data/spellData.ts` (`starter-frost`, `spell-inferno`, `physical_attack`). Admin Spells tab edits Motoko `defaultSpells()` (`shadow_strike`…`void_collapse`). Canister `defaultBossConfigs` still seed retired `fireball` / `cursed_gust` ids (025). Built-in delete guard is the Motoko six, not the innate spellData set.

3. **Boss Rush `rewardMultiplier` is unused** (008 evidence). `useBossRush.ts` 209–243 loads JSON into `_rewardMultiplier` which is never returned or applied to `dokaReward`/`xpReward`. CatalogNote on main still says the field “is read.” Prefer existing Boss Rush honesty on #415/#470 rather than a second AdminDashboard hunk.

Full records: `docs/automation/ACTION_IDS_AFDA_2026-10-21.md`.
