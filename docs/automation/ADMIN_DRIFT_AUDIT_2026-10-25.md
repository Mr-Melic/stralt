# Admin Feature & Drift Audit — 2026-10-25

Compared Admin Dashboard to live game (`WorldExploration.tsx`), `src/backend/main.mo`, bindgen (`src/frontend/src/backend.ts`), `src/backend/types/admin.mo`, `adminGuard.mo`, `lib/admin.mo`, hooks, `spellData.ts`, `occupancy.ts`, `spellEngine.ts`, `adminContract.ts`, `LandingPage.tsx`, and `adminVisualStatus.ts`. Documentation was not treated as truth.

HEAD at start: `0f5363f` (same as `origin/main` and the 2026-09-21–10-24 AFDA baselines). Main has not moved. Open AFDA siblings still include #996 (042 / `playerAchievements.ts`), #934 (040–041 / `progression.ts`), #887 (039 / `gameTypes.ts`), #818 (037/038), and the AdminDashboard honesty queue (#334…#585).

## Tiny corrections in this run

Honesty + lock test only. No CRUD, persist, spawn, or combat changes.

- `adminContract.ts`: Candid `effectParams` round-trips; combat never JSON.parses `pushDistance` / `attractDistance` / `teleportMode` (AFDA-2026-10-25-043). Distinct from 018. Did not restack AdminDashboard, `spellEngine.ts`, or `occupancy.ts`.
- `adminContract.test.ts`: round-trips Motoko `void_collapse` seed JSON `{"attractDistance":2,"attractAll":true}`.

## Visual fallback

Custom artwork is **not** mandatory. `src/` has no `ctx.drawImage`. WorldExploration never calls `getEnemyConfigs` / `getPlayerSpriteConfigs` / `spriteUrl` / `frontUrl`. Empty URLs keep Default Pixel Visual (`adminVisualStatus.ts`). New enemies/bosses still function with generated chess-piece pixels.

## Finite-level flags

Stralt has no player level cap. Remaining hard bands are still 011: Death Realm generation-failure fallbacks `maxLevel: 5` (WX 13514, 13646); `pickEnemyLevelFromTiers` caps at `floor(999 / tierSize)`; Motoko fail-chance comment still says 0 at 200. `level_10` is a feat condition, not a career ceiling. Admin new-enemy/region `levelMax` still defaults to 9999.

## NEW this run

**AFDA-2026-10-25-043** — Admin Spells textarea persists `effectParams` JSON. Motoko documents `pushDistance` / `attractDistance` / `teleportMode`. `void_collapse` is seeded with attract JSON. Combat has no parser. occupancy `applyPushback` / `applyAttract` exist but have no WorldExploration caller. Distinct from 018 (mechanic flags never reach Candid).

Not new IDs: unread `_rewardMultiplier` and `bossRushConfig` vs `pbv_boss_rush_config` stay **008**; leader-death `+0.25` hardcode stays **039**; LandingPage ignoring ad-tuple `isActive` stays **030**; victory `boss_defeated_*` stays **042**.

## Highest-value unfixed (reconfirmed)

- **040** Motoko/admin spell catalog REPLACE empty kit bars on seeded canister; prefer #911; WX unwired.
- **039** `leaderBoostPercent` persists; `castHelpers` aliases `_leaderBoostPercent` unread; death boost is hardcoded `+0.25`.
- **043** `effectParams` JSON persists unused; occupancy push/attract unwired.
- **002** Bosses still `pbv_boss_configs`; canister CRUD unused.
- **008** Boss Rush JSON unused including `_rewardMultiplier`.
- **006** Admin enemy configs unused by spawn; names ARE live.
- **038 / 037** Spell-id namespaces; three buff catalogs.
- **003** WX still reads `pbv_levelup_config`, not `getLevelUpConfig`.
- **022** No summon editor on main (#564 queued).
- **021** Modifier extra roll fields not Candid.
- **018** Mechanic flags drop on reload; 043 blocks the “stash them in effectParams” shortcut.
- **011** Death Realm fallback maxLevel 5.
- **020** Bindgen mixin leftovers (`isCallerAdmin` / `assignCallerUserRole` / `getCallerUserRole`).
- **042** Victory `boss_defeated_*` never matches the catalog (#996).

Challenges remain code-only (007). Telemetry: `longHorizonSim.ts` `telemetry.available: false`. Changelog: `App.tsx` uses local `APP_VERSION`; canister `setAppVersion` / `setChangelog` have no admin UI (012). Player shop is GameKey (004/005). `upgradeSpell` still charges `baseCost * 2^level` and ignores `spellLevelingCostMultiplier` (003).

Full records: `docs/automation/ACTION_IDS_AFDA_2026-10-25.md`.
