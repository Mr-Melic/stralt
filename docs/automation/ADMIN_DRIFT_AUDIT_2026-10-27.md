# Admin Feature & Drift Audit — 2026-10-27

Compared Admin Dashboard to live game (`WorldExploration.tsx`), `src/backend/main.mo`, bindgen (`src/frontend/src/backend.ts`), `src/backend/types/admin.mo`, and current hooks. Documentation was not treated as truth.

HEAD at start: `0f5363f` (same as `origin/main` and the 2026-09-21–10-26 AFDA baselines).

## Tiny corrections in this run

Honesty lock only. No CRUD, persist, spawn, or combat changes.

- `adminLevelUpApMpKey.test.ts` locks AFDA-2026-10-27-045: admin Settings dual-writes `apMpLevelThreshold` into `pbv_levelup_config`, but `getPlayerBaseStats` only reads `apMpGrowthEveryNLevels` after the WX `{...DEFAULT,...parsed}` merge.

Did not restack AdminDashboard / WorldExploration / combatMath / spellEngine / adminContract / occupancy / gameTypes / progression / playerAchievements / victoryAchievements / useAdminQueries / useSpellQueries / useBossRush / useBossQueries / BuffShop (queued #334…#1055). Prior 044 honesty remains on open PR #1130.

## Admin tabs vs live consumers

| Tab | Writes | Live consumer | Verdict |
| --- | --- | --- | --- |
| Enemies | canister `adminSetEnemyConfig` / delete (`AdminDashboard.tsx` ~5992+; hooks) | Spawn uses `pickEnemyLevelFromTiers` + `getEnemyBaseStats`; WX never calls `getEnemyConfigs` | Catalog only (006); `spriteUrl` unused (013) |
| Regions | canister region CRUD | WX matches level band then discards into `_currentRegionEffects` (023); `backgroundColor` unread | Band match only; effects unused |
| Player Sprites | canister sprite CRUD | No WX/`engine` `getPlayerSpriteConfigs` / `frontUrl` reader | Catalog only (017); walk-frame adapter (009) |
| Spells | canister `adminSetSpellConfig` via adapter | Combat uses hydrated spells; `hitsMultiple` adapter (001); mechanic flags drop (018); no summon editor (022); `minLevel` ignored (014); `effectParams` unread (043); kits/ids (038/040) | Partial live |
| Map Modifiers | canister modifier CRUD + GameConfig on same tab | Portal roll consumes active mods; global/second fields not Candid (021); registry/legacy (016); last-live (032) | Partial live |
| Enemy Tiers | canister + `pbv_tier_spawn_config` | WX hydrates canister → LS (909–929); `pickEnemyLevelFromTiers` (5770); requires 100% on main (026); `threeOrMorePercent` leftover-filled; `levelVarianceChance` code-owned (036); AI bands (027) | Live weights; UI gate drift |
| Visuals | canister + dual LS keys | WX caches `getColorPalette` → `pbv_color_palette`; draw uses hardcoded `WALL_PALETTES` (5174) | Persist yes; paint no (010) |
| Settings | `assignUserRole` (019 FIXED); LevelUp canister + `pbv_levelup_config` | WX reads LS only for fail/range/statGrowth (003); AP/MP key mismatch **045 NEW**; `spellDmgGrowthPercent` unread (044); cost multiplier unused (003) | Partial |
| Purchases | GameKey admin APIs | Player redeem path | Live (005 FIXED) |
| Achievements | canister achievement CRUD | WX + AchievementsPanel `getAchievementConfigs` | Live catalog; last-live wipe (034); `boss_defeated_*` orphan (042) |
| Enemy Names | `addEnemyName` / delete | WX spawn name pool | Live (029); replace-on-add (035) |
| Bosses | `pbv_boss_configs` localStorage only | WX loads same LS key (~6486); canister boss CRUD unused | Browser-local (002); seed ids (025) |
| Ad Boxes | `adminSetAdBox` / clear | LandingPage `getAdBoxes`; renders on image URL, ignores `isActive` (030) | Live URLs; flag ignored |
| Shop | grant/ban principals | Wallet ops live; package CRUD leftover (004) | Ops live; packages retired |
| Boss Rush | canister JSON + LS `bossRushConfig` | Rooms from `BOSS_RUSH_ROOMS`; `_rewardMultiplier` unread; WX caches `pbv_boss_rush_config` (008) | JSON unused |

Absent admin surfaces (012/007/037): challenges (`DEFAULT_CHALLENGES`), buff catalog (`BUFF_CATALOG` / `BuffShop.BUFF_ITEMS`), telemetry (`longHorizonSim.ts` `telemetry.available: false`), audit log / rollbacks / version / changelog / portal assignments (Settings CatalogNote lists gaps).

## Visual fallback

Custom artwork is **not** mandatory. Enemies/bosses/players draw built-in pixel patterns when no custom URL is present. WorldExploration never calls `getEnemyConfigs` / `getPlayerSpriteConfigs` / `spriteUrl` / `frontUrl`. `src/` has no `ctx.drawImage` (only the comment in `adminVisualStatus.ts` 4–5). New enemies/bosses function with generated/default pixel visual.

## Finite-level flags still present

Stralt has no player level cap. Remaining hard bands stay **011**:

- Region match uses `level <= levelMax` then discards the match (023).
- Primary Death Realm zone is `maxLevel: 9999` (WX 5439). Generation-failure fallbacks still use `maxLevel: 5` (13514, 13646).
- `pickEnemyLevelFromTiers` still caps tier index at `floor(999 / tierSize)` (`combatMath.ts` 58).
- Motoko `LevelUpConfig` comment still says fail reaches 0 at level 200 (`types/admin.mo` 148).
- Spell `minLevel` write gate is still `> 999` (`adminGuard.mo` 411); discovery ignores `minLevel` (014).

## Backend / bindgen (re-verified)

- Mixin leftovers on bindgen, absent from `main.mo`: `isCallerAdmin`, `assignCallerUserRole`, `getCallerUserRole` (020). Live gate is `getUserRole` / `assignUserRole`. `useIsCallerAdmin` still calls the missing mixin (`useAdminQueries.ts` 65–73).
- Motoko `SpellConfig` has summon + cooldown + `effectParams`; admin editor still lacks summon controls (022) and drops frontend-only mechanic flags (018).
- MapModifier Candid lacks global/second roll fields (021).
- Boss bindgen/Motoko vs frontend `BossConfig` schema split remains under 002.

## New this run

- **AFDA-2026-10-27-045** — Admin `apMpLevelThreshold` LS key ignored by `getPlayerBaseStats` (`apMpGrowthEveryNLevels` only).

Not new: 001–044 including unread `_rewardMultiplier` / LS key split (008), leader +0.25 (039), ads `isActive` (030), `boss_defeated_*` (042), `effectParams` (043), `spellDmgGrowthPercent` (044).

Full records: `docs/automation/ACTION_IDS_AFDA_2026-10-27.md`.
