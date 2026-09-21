# Dead-code / legacy-drift audit — 2026-09-21

**Automation:** cron `0 */48 * * *` (`d449111b-a487-11f1-a7d1-d6b4613131ce`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332 from Mr-Melic/cursor/report-findings-orchestration-8493`)  
**Prior pass:** `docs/automation/DEAD_CODE_AUDIT_2026-09-02.md`  
**Gameplay / RAF / mapGen / turn / damage math:** not modified.

This pass classifies candidates. Only **SAFE TO REMOVE** items with high confidence were deleted. Static “no callers” was not enough — each item was checked for dynamic `import()`, bindgen/dfx output, migrations, deployment wiring, tests, sibling open-PR overlap, and intentional docs/reference.

Open PRs at audit time (oldest `createdAt` first): **#327** Striker AoE, **#331** portal destack. Neither edits `index.css` or `docs/ARCHITECTURE.md`.

## Removed this run (SAFE TO REMOVE)

Orphan CSS left after the 2026-08-31 dungeon-editor deletion. The 2026-09-02 audit already deleted the class *definitions* and left these media-query selectors because older PR **#286** owned the same 768px hunk (`stone-modal-close` + 16px inputs). **#286 has merged**; live close buttons use `stone-modal-close`. Zero `className` / dynamic-class hits for `.dungeon-grid` or `.tool-button` in `src/frontend/src/**/*.ts(x)`.

| Item | Why high confidence |
| :--- | :--- |
| `@media (max-width: 768px) .dungeon-grid` | Editor gone; definition already deleted 2026-09-02; selector was a no-op. |
| `@media (min-width: 1280px) .dungeon-grid` | Same; three-column editor layout never mounts. |
| `.tool-button` on the 44px touch-target list | Companion of deleted `ObjectPalette` / editor toolbar. Live 44px targets remain: `stone-nav-btn`, `stone-touch-target`, `stone-battle-action`, `.stone-top-bar button`, `stone-modal-close`. |

**Doc correction (not a deletion):** `docs/ARCHITECTURE.md` still said root `mops.toml` had `check-limit = 4` and `.old` as an empty-canister baseline. Live values are `check-limit = 5` and `.old` = Caffeine’s 2026-08-31 deployed signature (PR #181 `f8aa05e`, no GameKey). Empty-canister genesis is `snapshots/empty-canister.most`, not `.old`.

## Left in place

### LEGACY BUT REQUIRED

| Item | Why keep |
| :--- | :--- |
| `src/backend/migrations/` + `.old/src/backend/dist/backend.most` | Live mops chain / `check-stable`. `.old` is Caffeine-owned (Aug-31 import, 42 stables, no GameKey). Gitignored but tracked. Do not blank or rewrite. |
| `src/backend/BaseToCore.mo` | Documented completed mo:base→mo:core marker (`AGENTS.md`). Not imported by `main.mo`. |
| `src/backend/lib/admin.mo`, `lib/adminGuard.mo`, `lib/gameKey.mo`, `types/admin.mo` | Imported by canonical `main.mo`. |
| `src/frontend/src/backend.ts` + `backend.d.ts` + `src/frontend/src/declarations/` | Canonical bindgen (`pnpm bindgen --actor-interface-file`). 12-field `CharacterStats` with `killCount`, no `wp`/`wr`/`scp`. In sync with `src/backend/dist/backend.did`. `ChatPanel` imports `ChatMessage` from `backend.d.ts` on purpose. |
| `src/frontend/src/utils/debugLogger.ts` | Re-export shim; engine/UI files still import it. |
| `src/frontend/src/hooks/useDungeonState.ts` | `getDungeonMultiplier` delegates to `portalRules.dungeonDokaMultiplierFor` and is tested. Stub `useDungeonState = () => ({})` kept for safe imports. |
| `src/frontend/src/components/InitiativeStrip.tsx` | Default UI unused, but `CombatantEntry` is the shared combatant type (14+ importers). |
| `src/backend/dist/backend.did` + `backend.most` | Canonical Candid / build artifact. Regen via bindgen; do not hand-edit. |
| `VITE_USE_MOCK` | Live local-dev flag (`useActor`). |
| `AI_*_ENABLED` constants | Live AI master toggles (all `true`), not leftover flags. |
| `calculateAndAwardDoka` | Unused public mint on the Candid surface. Must not be called from the official reward funnel. Keep the stub. |
| `engine/worldFeatures.ts` | Tests + `docs/WORLD_DYNAMICS.md` contract. |
| `utils/longHorizonSim.ts` | CLI/dev balance tool (test-imported). |
| `engine/mapGen.simulate.ts` | Solvability test helper. |
| GameKey / shop files | `dokaGameKey.ts`, `iapShopCopy.ts`, `itemShop.ts`, `legacyPurchaseCredit.ts`, `DokaGameKeyShop.tsx`, `AdminGameKeyPurchases.tsx` — live. |
| Modules added since 2026-09-02 | `challengeHudVisibility`, `enemyRegisterCopy`, `victoryAchievements`, `enemyWalkMp`, `battleWalkMp`, `playerCastPlan`, `canvasLoopActivity`, `spawnPolicy`, `shopDialogDismiss`, `startingChampionStats` — all have production callers or tests wired to live paths. |

### STALE GENERATED ARTIFACT

| Item | Notes |
| :--- | :--- |
| Root `declarations/backend/` | 14-field snapshot **with** `wp`/`wr`/`scp`, **no** `killCount`, ~13 methods. Not imported. Frontend tsconfig `declarations/*` maps to `src/frontend/../declarations` (`/workspace/src/declarations`, missing) — a footgun if anyone starts using the alias. Default dfx output location — do not delete without a human retarget of `dfx.json`. Bindgen source of truth is `src/backend/dist/backend.did`. |
| Untracked root `frontend/public/assets/` | If present locally: screenshots + duplicate sprites. Not git-tracked. Live assets are `src/frontend/public/`. |

### NEEDS HUMAN DECISION

| Item | Question |
| :--- | :--- |
| `backend_extended/` (15-field actor with `wp`/`wr`/`scp`, `migration.mo`, BaseToCore helpers) | Documented dfx-only leftover. **Do not delete** — upgrade/compat reference. `dfx.json` still points at **non-existent** `src/backend_extended/main.mo` (real folder is repo-root `backend_extended/`). Retarget `dfx.json` → `src/backend/main.mo` vs keep a broken path as a deploy guard. |
| `src/backend/mixins/*`, `lib/types.mo`, `types/common.mo`, `types/chat.mo` | Unused by `main.mo`. Unused combat `EnemyConfig` template / unused `ChatMessage` (inlined in `main.mo`). Could be a future mixin split. |
| Unused shadcn `components/ui/*` | Game UI uses `sonner` + `alert-dialog` (+ `button` transitively). `components.json` is the Caffeine/shadcn catalog. |
| Unused frontend deps with zero app imports | `@react-three/*`, `three`, `@tanstack/react-router`, `zustand`, `react-quill-new`, `motion`. Only `recharts` is pulled in by unused `ui/chart.tsx`. Do not prune the Caffeine template lockfile without a human. |
| `InitiativeStrip` UI vs type | Extract `CombatantEntry` then delete the unused strip UI. |
| `GameFlow` `dungeonData` + WX `dungeon` prop | Always `null` after dungeon-editor removal (`setDungeonData(null)` on back-to-selection only). WX binds it as `_dungeon`. Removing the prop is an interface change. |
| Duplicate camera / enemy-move constants | `gameConstants.ts` exports unused `_CAMERA_*` / `_ENEMY_MOVEMENT_*` / unused `CAMERA_SMOOTHING_FACTOR`; WX redeclares the live numbers next to the RAF camera. Do not touch WX camera locals. |
| `MAP_MODIFIER_*` in `gameConstants.ts` vs inline values in `mapModifiers.ts` | Catalog unused; engine copies the numbers locally (`THORNED_DAMAGE_PER_TILE`, `VOID_RIFT_TICK`, …). Wire imports vs delete catalog. |
| `ENEMY_AI_TIER_GATES` | Exported, zero importers. Comment in `enemyAI.ts` notes the table has no wounded-sacrifice entry. Planned gates vs dead scaffold. |
| `BoostToggle.tsx` + App → GameFlow `boostMode` / `onBoostToggle` | Component never mounted (zero importers). App still passes the props; GameFlow discards them (`_boostMode`). WX owns a separate `boostMode` (setter unused, so always `"xp"`). Wire the pill vs delete the feature UI. |
| `engine/summonAI.ts` (`runSummonAI`) | ~600-line pure dispatcher, never imported. Live summon turns use `enemyAI.decideSummonAction` / `summonExecutor`. Wire vs delete in a dedicated PR. |
| `utils/oneShotCredit.ts` | Test-only. Production pickups use `dokaPersist.ts`. |
| `utils/absoluteStatsClamp.ts` | Test-only. Intended guard before `saveBattleStats`; not wired. |
| `DEFAULT_GAME_CONFIG` | Unused named default. Same 10 / 40 / 5 fallbacks are inlined in `useAdminQueries`, Admin, WX, and mocks. |
| `hooks/useShopQueries.ts` | Entire React Query wrappers (`useGetShopPackages`, `useInitiatePurchase`, `useGetPurchaseRecords`) have **zero callers**. Live checkout is `shopPurchase.ts` + `DokaGameKeyShop`. Backend `ShopPackage` / `initiatePurchase` Candid is still live (`initiatePurchase` is a legacy `#err` stub). Drop wrappers vs keep as the official query API. |
| Unused barrel hook symbols | `useIsCallerAdmin`, `useAdminSetMapModifierChance`, `useSetBossPortalAssignment`, `useDokaAchievementTracker`, `useGetCharacter`, `useRenameCharacter`, `useBackendStatus`, `useSaveKillCount` — never invoked; wrap live Candid. App uses `useGetUserRole` instead of `useIsCallerAdmin`. |
| `src/backend/mops.toml` moc 1.9.0 vs root 1.11.2 | Documented stale nested pin. |
| Root `mops.toml` `[dependencies] ic = "4.2.0"` | No `mo:ic` import in backend `.mo` files. |
| `src/backend/system-idl/aaaaa-aa.did` | **Not** imported by current `main.mo`. Keep until Caffeine/mops toolchain need is proven. |
| `.dofus-panel` (without `-header`) | Zero className hits. `dofus-panel-header` is live on the WX inspect card. Design-kit parent vs leftover wrapper. |
| `.glow*` / `.animate-pulse-glow` / `.modal-backdrop` / `.cursor-grab*` / `.text-shadow` / unused `stone-pill-blue`/`purple` / unused `stone-stat-chip-orange`/`periwinkle`/`lightslate` / non-portal `.stone-popup` | Zero hits this pass, but they are generic design-kit utilities (portal StatPopup replaced the non-portal frame). Not deleted. |

## Not found

- Obsolete `FEATURE_*` / unused `VITE_*` / `ENABLE_*` env flags (besides live `VITE_USE_MOCK`).
- Stale frontend bindgen vs `src/backend/dist/backend.did` (12-field stats still agree; `killCount` present; no `wp`/`wr`/`scp`).
- Commented-out replacement implementations that were safe to strip as a block.
- New leftover `engine/` copies at repo root.
- Unused GameKey / item-shop / persist-lock modules added after 2026-09-02 (all live).
- Duplicate dungeon Doka multiplier tables (still a single `portalRules.dungeonDokaMultiplierFor`).

## Re-verified / corrected from 2026-09-02

`backend_extended/`, root `declarations/`, mixins / `types/common.mo` / `types/chat.mo`, shadcn kit, `InitiativeStrip` + `CombatantEntry`, dungeon prop, camera-constant duplicates, `summonAI.ts`, `BoostToggle`, unused `useShopQueries`.

**Correction:** orphan `.dungeon-grid` / `.tool-button` media-query selectors are no longer blocked by #286 and were removed this run.

**Doc correction:** `ARCHITECTURE.md` canonical-path row now matches live `check-limit = 5` and the Caffeine-owned `.old` (not empty-canister).

## Validation

After cleanup: `bash scripts/caffeine-import-gate.sh all` (`pnpm typecheck`, `pnpm check`, frontend `vite build`, `mops check`) and `bash scripts/open-pr-stack-compat.sh --self`.
