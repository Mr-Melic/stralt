# Admin Feature & Drift Audit — 2026-09-29

Compared Admin Dashboard to live game (`WorldExploration.tsx`), `src/backend/main.mo`, bindgen (`src/frontend/src/backend.ts`), `src/backend/types/admin.mo`, `adminGuard.mo`, and current hooks. Documentation was not treated as truth.

HEAD at start: `0f5363f` (same as `origin/main` and the 2026-09-22–28 AFDA baselines).

## Tiny corrections in this run

Honesty comment only. No CRUD, persist, spawn, or combat changes.

- `pickEnemyLevelFromTiers` no longer comments `levelVarianceChance` as “admin-configurable” while Candid `TierSpawnConfig` and the Tiers tab omit the field (`combatMath.ts` 60–63). Tracked as AFDA-2026-09-29-036 (PARTIAL: comment only).

Did not restack AdminDashboard hunks queued on older PRs (#413, #415, #457, #470, #531, #539, #564, #585, #631). Did not restack last-live modifier/achievement guards (#626 / #650 / #703 / #733). Did not restack yesterday’s `usePanelLayout.ts` JSDoc (#741). Did not edit WorldExploration (Death Realm fallback `maxLevel: 5` remains).

## Visual fallback

Custom artwork is **not** mandatory. Enemies/bosses/players draw built-in pixel patterns when no custom URL is present. WorldExploration never calls `getEnemyConfigs` / `getPlayerSpriteConfigs` / `spriteUrl` / `frontUrl`. `src/` has no `ctx.drawImage`. New enemies/bosses function with generated/default pixel visual.

## Finite-level flags

Stralt has no player level cap. Remaining hard bands:

- Region match uses `level <= levelMax` (`WorldExploration.tsx` 3662–3664) then **discards** the match.
- Primary Death Realm zone is `maxLevel: 9999` (5439). Generation-failure fallbacks still use `maxLevel: 5` (13514, 13646).
- `pickEnemyLevelFromTiers` still caps tier index at `floor(999 / tierSize)`.
- `adminGuard` rejects spell `minLevel > 999`. Hydrate still ignores `minLevel`.
- Motoko `LevelUpConfig` comment still says fail reaches 0 at level 200 (`types/admin.mo` 148). Admin fail-chance help does not.
- `computeAITier` bands 10/30/60/100/150/250/400/600/900 then random 1–10.

## New this run

`getEnemyNames` returns a hardcoded default list when the stored pool is empty, so the Names tab never shows “Load Defaults.” Adding a single name persists a size-1 stored list and replaces the query-default catalog. Extra enemies on that map then spawn without a name instead of falling back to `DEFAULT_ANCIENT_NAMES` (AFDA-2026-09-29-035). Prefer a Names CatalogNote / Load Defaults visibility fix on #457 / #470 rather than a second AdminDashboard hunk.

Full records: `docs/automation/ACTION_IDS_AFDA_2026-09-29.md`.
