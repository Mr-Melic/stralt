# Admin Feature & Drift Audit — 2026-10-24

Compared Admin Dashboard to live game (`WorldExploration.tsx`), `src/backend/main.mo`, bindgen (`src/frontend/src/backend.ts`), `src/backend/types/admin.mo`, `adminGuard.mo`, hooks, `spellData.ts`, `victoryAchievements.ts`, `playerAchievements.ts`, `castHelpers.ts`, `spawnPolicy.ts`, `longHorizonSim.ts`, and `LandingPage.tsx`. Documentation was not treated as truth.

HEAD at start: `0f5363f` (same as `origin/main` and the 2026-09-21–10-23 AFDA baselines). Main has not moved. Open AFDA siblings still include #887 (039 / `gameTypes.ts`), #934 (040–041 / `progression.ts`), #818 (037/038), and AdminDashboard honesty queue (#334…#585).

## Tiny correction in this run

Honesty comment only. No CRUD, persist, spawn, or combat changes.

- `playerAchievements.ts`: victory emits `boss_defeated_${bossId}` but that condition can never match the admin catalog or `knownAchievementCondition` (AFDA-2026-10-24-042). Did not restack `victoryAchievements.ts` (#904).

## NEW this run

**AFDA-2026-10-24-042** — `clientTrustedVictoryAchievementConditions` pushes `boss_defeated_${bossId}` (`victoryAchievements.ts` 41–44). `checkAndFireAchievement` (WX 2218–2223) looks up `achievementConfigs` by exact `condition`. `defaultAchievements()` (`lib/admin.mo` 309–326) has no `boss_defeated_*` rows. `KNOWN_ACHIEVEMENT_CONDITIONS` / `adminGuard.knownAchievementCondition` (adminSafety 306–322; adminGuard 515–531) reject unknown strings, so admin cannot add them. The push is a permanent no-op.

## Still true (not restacked)

- **040** Motoko/admin spell catalog REPLACE empty kit bars on seeded canister; prefer #911; WX unwired.
- **041** `getEnemyHPForLevel` unused; live HP is WX `calcEnemyMaxHp` / localStorage growth.
- **039** `leaderBoostPercent` persists; `castHelpers` aliases `_leaderBoostPercent` unread.
- **002** Bosses still `pbv_boss_configs`; WorldExploration never calls `getEnemyConfigs` / `getPlayerSpriteConfigs`; no `ctx.drawImage`.
- **003** WX still reads `pbv_levelup_config`, not `getLevelUpConfig`.
- **011** Death Realm generation-failure fallbacks still `maxLevel: 5`.
- Ads: LandingPage renders `getAdBoxes` image/link; ignores tuple `isActive` but `adminClearAdBox` blanks URLs.
- Changelog: `App.tsx` uses local `APP_VERSION` / `CHANGELOG_ITEMS`; canister `setAppVersion` / `setChangelog` have no admin UI.
- Telemetry: `longHorizonSim.ts` `telemetry.available: false`.
- Custom art not mandatory (013).

Full records: `docs/automation/ACTION_IDS_AFDA_2026-10-24.md`.
