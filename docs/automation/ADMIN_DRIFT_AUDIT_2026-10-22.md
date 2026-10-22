# Admin Feature & Drift Audit — 2026-10-22

Compared Admin Dashboard to live game (`WorldExploration.tsx`), `src/backend/main.mo`, bindgen (`src/frontend/src/backend.ts`), `src/backend/types/admin.mo`, `adminGuard.mo`, hooks, `spellData.ts`, `BUFF_ITEMS`, `BUFF_CATALOG`, `castHelpers.ts`, and `deathPipeline.ts`. Documentation was not treated as truth.

HEAD at start: `0f5363f` (same as `origin/main` and the 2026-09-21–10-21 AFDA baselines). Main has not moved. Yesterday’s AFDA PR #818 is still open (draft). #585 still labels Ground Doka **and** `leaderBoostPercent` as live — that second claim is false.

## Tiny corrections in this run

Honesty comments only. No CRUD, persist, spawn, or combat changes. Did not restack AdminDashboard.

- `gameTypes.ts` `AdminGameConfig.leaderBoostPercent`: persisted; combat ignores it (AFDA-2026-10-22-039). Did not restack `useAdminQueries.ts` (#626/#650/#703/#733) or `useSpellQueries.ts` (#568).

Did not restack AdminDashboard hunks queued on older PRs (#334, #341, #413, #415, #457, #470, #531, #539, #564, #585). Did not restack Motoko type comments (#620), leftover-alias docs (#681), `usePanelLayout.ts` JSDoc (#741), `combatMath.ts` levelVarianceChance comment (#780), last-live modifier/achievement guards (#626 / #650 / #703 / #733), summon editor (#564), BuffShop, `useBossRush.ts`, or yesterday’s `useBossQueries.ts` comment (#818).

Did not edit WorldExploration (Death Realm fallback `maxLevel: 5` remains).

## Visual fallback

Custom artwork is **not** mandatory. Enemies/bosses/players draw built-in pixel patterns when no custom URL is present. WorldExploration never calls `getEnemyConfigs` / `getPlayerSpriteConfigs` / `spriteUrl` / `frontUrl`. `src/` has no `ctx.drawImage`. New enemies/bosses function with generated/default pixel visual. `validateEnemyConfig` / `validatePlayerSpriteConfig` treat URLs as optional.

## Finite-level flags

Stralt has no player level cap. Remaining hard bands:

- Region match uses `level <= levelMax` (`WorldExploration.tsx` 3662–3664) then **discards** the match.
- Primary Death Realm zone is `maxLevel: 9999` (5439). Generation-failure fallbacks still use `maxLevel: 5` (13514, 13646).
- `pickEnemyLevelFromTiers` still caps tier index at `floor(999 / tierSize)` (`combatMath.ts` 58).
- `adminGuard` rejects spell `minLevel > 999` (411). Hydrate still ignores `minLevel`.
- Motoko `LevelUpConfig` comment still says fail reaches 0 at level 200 (`types/admin.mo` 148). Admin fail-chance help does not.
- `computeAITier` bands 10/30/60/100/150/250/400/600/900 then random 1–10.
- Dungeon spawn depth cap 5 (`spawnPolicy.ts`) is a dungeon band, not a player career ceiling.

## New this run

1. **`leaderBoostPercent` is ignored** (AFDA-2026-10-22-039). Admin Ground Doka “Leader Boost per Death (%)” writes a real Candid field. WX hydrates it and passes it into `applyDamageToEnemy`, which aliases it `_leaderBoostPercent` and never reads it. `applyLeaderDeathBoost` writes hardcoded `+0.25` into unread `_leaderBoostMultiplier`. Live leader-death effect is erratic AI via `leaderDiedRef`. #585 still says the percent is live — do not restack that CatalogNote here.

Confirmed still true (no main delta since 10-21): 002 bosses localStorage, 008 unused `_rewardMultiplier`, 006 unused enemy configs, 038 three spell-id namespaces, 037 three buff catalogs (`BUFF_CATALOG` is also `transient let` — not persistable without a new stable), 035 name-pool replace-on-add, 032 last-live modifier pool, 034 last-live achievement catalog, 021 extra modifier rolls not Candid, 022 no summon editor on main, 003 WX still `pbv_levelup_config`, 011 Death Realm fallback maxLevel 5.

Full records: `docs/automation/ACTION_IDS_AFDA_2026-10-22.md`.
