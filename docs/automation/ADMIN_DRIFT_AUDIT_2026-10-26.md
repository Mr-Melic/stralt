# Admin Feature & Drift Audit — 2026-10-26

Compared Admin Dashboard to live game (`WorldExploration.tsx`), `src/backend/main.mo`, bindgen (`src/frontend/src/backend.ts`), `src/backend/types/admin.mo`, and current hooks. Documentation was not treated as truth.

HEAD at start: `0f5363f` (same as `origin/main` and the 2026-09-21–10-25 AFDA baselines).

## Tiny corrections in this run

Honesty lock only. No CRUD, persist, spawn, or combat changes.

- `adminSpellDmgGrowth.test.ts` locks `calcScaledDamage` at hardcoded `1.03 ** upgradeLevel` (AFDA-2026-10-26-044). Admin Settings persist `spellDmgGrowthPercent`; combat never reads it.

Did not restack AdminDashboard / WorldExploration / combatMath / spellEngine / adminContract / occupancy / gameTypes / progression / playerAchievements / victoryAchievements / useAdminQueries / useSpellQueries / useBossRush / useBossQueries / BuffShop / Motoko comments (queued #334…#1055).

## Visual fallback

Custom artwork is **not** mandatory. Enemies/bosses/players draw built-in pixel patterns when no custom URL is present. WorldExploration never calls `getEnemyConfigs` / `getPlayerSpriteConfigs` / `spriteUrl` / `frontUrl`. `src/` has no `ctx.drawImage`. New enemies/bosses function with generated/default pixel visual.

## Finite-level flags

Stralt has no player level cap. Remaining hard bands stay **011**:

- Region match uses `level <= levelMax` (`WorldExploration.tsx` 3702) then discards the match (023).
- Primary Death Realm zone is `maxLevel: 9999` (5439). Generation-failure fallbacks still use `maxLevel: 5` (13514, 13646).
- `pickEnemyLevelFromTiers` still caps tier index at `floor(999 / tierSize)` (`combatMath.ts` 58).
- Motoko `LevelUpConfig` comment still says fail reaches 0 at level 200 (`admin.mo` 148). Admin fail-chance help does not.
- Spell `minLevel` write gate is still `> 999` (`adminGuard.mo` 411).

Mocks still seed `levelMax: BigInt(5)` (`mocks/backend.ts` 69, 80) — mock data, not a product cap.

## Backend contract (re-verified)

- Live player shop is GameKey. Package CRUD leftover (004). Purchases is GameKey (005 FIXED).
- Boss configs still `pbv_boss_configs` (002). Canister boss CRUD unused by hooks.
- Enemy catalog unused by spawn (006). Enemy **names** ARE live.
- Challenges code-only (007).
- Boss Rush JSON unused including `_rewardMultiplier` (008).
- WX still reads `pbv_levelup_config`, never `getLevelUpConfig()` (003).
- `upgradeSpell` hardcodes `base * 2^level`; cost multiplier already labeled unused.
- `spellDmgGrowthPercent` persists and the Settings help still implies it applies — **044 NEW**.
- `leaderBoostPercent` ignored; death uses +0.25 (039). Ground Doka chance/base ARE live via `useGetGameConfig`.
- `effectParams` JSON unread (043 / #1055). Mechanic flags drop (018). No summon editor (022 / #564).
- Bindgen mixin leftovers `isCallerAdmin` / `assignCallerUserRole` / `getCallerUserRole` (020). Dashboard uses `assignUserRole`.
- `getEnemyHPForLevel` unused (041). Seeded non-empty spell catalog empties ENEMY_KITS (040).
- Victory `boss_defeated_*` cannot match the 15 known conditions (042).
- Ads `isActive` ignored; LandingPage renders on image URL (030).
- Palette dual-write; WALL_PALETTES unused by admin palette (010).
- Buff catalogs drift; Items shop is localStorage (037).
- Spell-id namespaces: Motoko defaultSpells vs spellData kits (038).
- Telemetry still unavailable (`longHorizonSim.ts` `telemetry.available: false`).

Full records: `docs/automation/ACTION_IDS_AFDA_2026-10-26.md`.
