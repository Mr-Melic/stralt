# Admin Feature & Drift Audit — 2026-09-22

Compared Admin Dashboard to live game (`WorldExploration.tsx`), `src/backend/main.mo`, bindgen (`src/frontend/src/backend.ts`), `src/backend/types/admin.mo`, hooks, and spawn/AI. Documentation was not treated as truth.

HEAD at start: `0f5363f` (`origin/main`). Open PR #334 still had the 2026-09-21 Tiers leftover honesty; this run unions that `AdminDashboard.tsx` delta and adds unique copy. WorldExploration left untouched (older open PRs already overlap it).

## Tiny corrections in this run

Honesty copy / save-gate only. No CRUD, persist, spawn, or combat math changes.

- **Union #334:** Enemy Tiers hydrates `getTierSpawnConfig`; save no longer requires 100%; preview ±3+ uses leftover (matching `pickEnemyLevelFromTiers`). Settings CatalogNote: ban list is on Shop. Boss Rush CatalogNote: `rewardMultiplier` is unused state.
- **Unique:** Tiers CatalogNote names `computeAITier` bands and code-owned `ENEMY_KITS`. Settings names live Ground Doka / leaderBoost on Map Modifiers (`getGameConfig`). Bosses intro no longer claims “until a backend writer exists” — `setBossConfig` exists; hooks still write `pbv_boss_configs` with a schema mismatch. Achievements CatalogNote: canister rows are live.

## Visual fallback

Custom artwork is **not** mandatory. Enemies/bosses/players draw built-in pixel patterns when no custom URL is present. WorldExploration never calls `getEnemyConfigs` / `getPlayerSpriteConfigs` / `spriteUrl` / `frontUrl`. `src/` has no `ctx.drawImage`. New enemies/bosses function with generated/default pixel visual.

## Finite-level flags

Stralt has no player level cap. Remaining hard bands:

- Region match uses `level <= levelMax` then discards the match.
- Primary Death Realm zone is `maxLevel: 9999`. Generation-failure fallbacks still use `maxLevel: 5` (WX 13514, 13646) — not edited this run.
- `pickEnemyLevelFromTiers` still caps tier index at `floor(999 / tierSize)`.
- `computeAITier` bands at 10/30/60/100/150/250/400/600/900 (named in Tiers copy).
- Motoko `LevelUpConfig` comment still says fail reaches 0 at 200 (`admin.mo` 148). Admin fail-chance help does not.

## Backend contract (re-verified)

- Bindgen `SpellConfig` includes summon fields + `cooldown`. Mixin `isCallerAdmin` / `assignCallerUserRole` remain on Candid and are **not** in `src/backend/main.mo`. `useIsCallerAdmin` has no caller.
- Live IAP is GameKey. ShopPackage CRUD unused by UI — do not delete.
- Achievements canister map **is** consumed. Enemy/boss/sprite catalogs are not.
- `defaultBossConfigs` spell pools still name retired ids (025).

Full records: `docs/automation/ACTION_IDS_AFDA_2026-09-22.md`.
