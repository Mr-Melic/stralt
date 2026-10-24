# Admin Feature & Drift Audit — 2026-10-24

Compared Admin Dashboard to live game (`WorldExploration.tsx`), `src/backend/main.mo`, bindgen (`src/frontend/src/backend.ts`), `src/backend/types/admin.mo`, `adminGuard.mo`, `lib/admin.mo`, hooks, `spellData.ts`, `victoryAchievements.ts`, `playerAchievements.ts`, `castHelpers.ts`, `spawnPolicy.ts`, `longHorizonSim.ts`, `LandingPage.tsx`, and `adminVisualStatus.ts`. Documentation was not treated as truth.

HEAD at start: `0f5363f` (same as `origin/main` and the 2026-09-21–10-23 AFDA baselines). Main has not moved. Open AFDA siblings still include #887 (039 / `gameTypes.ts`), #934 (040–041 / `progression.ts`), #818 (037/038), and the AdminDashboard honesty queue (#334…#585).

## Tiny corrections in this run

Honesty + lock test only. No CRUD, persist, spawn, or combat changes.

- `playerAchievements.ts`: victory emits `boss_defeated_${bossId}` but that condition can never match the admin catalog or `knownAchievementCondition` (AFDA-2026-10-24-042). Did not restack `victoryAchievements.ts` (#904).
- `playerAchievements.test.ts`: asserts `knownAchievementCondition("boss_defeated_starved_pawn") === false` and that no `KNOWN_ACHIEVEMENT_CONDITIONS` entry starts with `boss_defeated_`.

## Visual fallback

Custom artwork is **not** mandatory. `src/` has no `ctx.drawImage`. WorldExploration never calls `getEnemyConfigs` / `getPlayerSpriteConfigs` / `spriteUrl` / `frontUrl`. Empty URLs keep Default Pixel Visual (`adminVisualStatus.ts`). New enemies/bosses still function with generated chess-piece pixels.

## Finite-level flags

Stralt has no player level cap. Remaining hard bands are still 011: Death Realm generation-failure fallbacks `maxLevel: 5` (WX 13514, 13646); `pickEnemyLevelFromTiers` caps at `floor(999 / tierSize)`; Motoko fail-chance comment still says 0 at 200. `level_10` is a feat condition, not a career ceiling. Admin new-enemy/region `levelMax` still defaults to 9999.

## NEW this run

**AFDA-2026-10-24-042** — `clientTrustedVictoryAchievementConditions` pushes `boss_defeated_${bossId}` (`victoryAchievements.ts` 41–44). `checkAndFireAchievement` (WX 2218–2223) looks up `achievementConfigs` by exact `condition`. `defaultAchievements()` (`lib/admin.mo` 309–326) has no `boss_defeated_*` rows. `KNOWN_ACHIEVEMENT_CONDITIONS` / `adminGuard.knownAchievementCondition` reject unknown strings, so admin Feats CRUD cannot add them. The push is a permanent no-op. Distinct from 028 (missing CatalogNote on a live catalog).

Not new IDs: unread `_rewardMultiplier` and `bossRushConfig` vs `pbv_boss_rush_config` stay **008**; leader-death `+0.25` hardcode stays **039**; LandingPage ignoring ad-tuple `isActive` (renders on image URL) stays **030**.

## Highest-value unfixed (reconfirmed)

- **040** Motoko/admin spell catalog REPLACE empty kit bars on seeded canister; prefer #911; WX unwired.
- **039** `leaderBoostPercent` persists; `castHelpers` aliases `_leaderBoostPercent` unread; death boost is hardcoded `+0.25`.
- **002** Bosses still `pbv_boss_configs`; canister CRUD unused.
- **008** Boss Rush JSON unused including `_rewardMultiplier`.
- **006** Admin enemy configs unused by spawn; names ARE live.
- **038 / 037** Spell-id namespaces; three buff catalogs.
- **003** WX still reads `pbv_levelup_config`, not `getLevelUpConfig`.
- **022** No summon editor on main (#564 queued).
- **021** Modifier extra roll fields not Candid.
- **011** Death Realm fallback maxLevel 5.
- **020** Bindgen mixin leftovers (`isCallerAdmin` / `assignCallerUserRole` / `getCallerUserRole`).

Challenges remain code-only (007). Telemetry: `longHorizonSim.ts` `telemetry.available: false`. Changelog: `App.tsx` uses local `APP_VERSION`; canister `setAppVersion` / `setChangelog` have no admin UI (012). Player shop is GameKey (004/005). `upgradeSpell` still charges `baseCost * 2^level` and ignores `spellLevelingCostMultiplier` (003).

Full records: `docs/automation/ACTION_IDS_AFDA_2026-10-24.md`.
