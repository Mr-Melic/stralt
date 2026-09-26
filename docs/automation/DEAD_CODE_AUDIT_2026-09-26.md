# Dead-code / legacy-drift audit — 2026-09-26

**Automation:** cron `0 */48 * * *` (`d449111b-a487-11f1-a7d1-d6b4613131ce`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332 from Mr-Melic/cursor/report-findings-orchestration-8493`)  
**Prior pass:** `docs/automation/DEAD_CODE_AUDIT_2026-09-25.md` (queued on open **#567**; 2026-09-24 is **#516**; 2026-09-23 is **#469**; 2026-09-22 is **#423**; 2026-09-21 is **#339**)  
**Gameplay / RAF / mapGen / turn / damage math:** not modified.

This pass classifies candidates. Only **SAFE TO REMOVE** items with high confidence were deleted. Static “no callers” was not enough — each item was checked for dynamic `import()`, bindgen/dfx output, migrations, deployment wiring, tests, sibling open-PR overlap, and intentional docs/reference.

`main` has not moved since the 2026-09-21 / 09-22 / 09-23 / 09-24 / 09-25 audits (`0f5363f`). This run independently re-scans that baseline, unions the still-queued #339 / #423 / #469 / #516 / #567 CSS/docs hunk (so the cleanup lands even if those drafts close), and records newer sibling-PR context (**294+** open PRs targeting `main` through **#630** at stack-compat time).

Unused named exports, Candid React Query wrappers, unused design-kit CSS, unused Motoko scaffolds, and unused shadcn kit files stay **NEEDS HUMAN DECISION**. Zero callers is not proof they are safe to delete.

Open PRs that overlap this change (oldest `createdAt` first):

| PR | Overlap | Union rule |
| :--- | :--- | :--- |
| **#339** (2026-09-21 dead-code audit) | `index.css` + `ARCHITECTURE.md` check-limit row | Same hunks as this PR. After #339 merges, those files are already applied. |
| **#346** | `ARCHITECTURE.md` (same check-limit row + other docs) | Keep the identical one-line table fix; do not overwrite #346’s other hunks. |
| **#335** | `BoostToggle.tsx` a11y (`stone-touch-target`, `aria-*`) | Do **not** delete BoostToggle. #335 is wiring the unused pill for touch targets. |
| **#369** / **#420** / **#427** / **#468** / **#477** / **#513** / **#587** / **#611** | `ARCHITECTURE.md` other rows | Do not touch those hunks; this PR only changes the check-limit table cell. |
| **#423** (2026-09-22 dead-code audit) | Same CSS + check-limit row as #339 | Identical hunks; after either lands, this PR’s copy is a no-op. |
| **#425** | Mentions the 768px 44px list (`stone-btn-crimson` HUMAN) | Does **not** edit `index.css`. Do not add `stone-btn-*` to the 44px list here. |
| **#469** (2026-09-23 dead-code audit) | Same CSS + check-limit row | Identical hunks. |
| **#471** | `BoostToggle.tsx` + `InitiativeStrip.tsx` a11y | Do **not** delete either file while queued. |
| **#516** (2026-09-24 Motoko/Candid/dfx drift audit) | Same CSS + check-limit row | Identical hunks. |
| **#526** | Shop/forge 44px a11y | Does **not** edit `index.css` or BoostToggle. Do not enlarge the 44px selector list here. |
| **#567** (2026-09-25 dead-code audit) | Same CSS + check-limit row | Identical hunks. |

No other still-open PR besides #339 / #423 / #469 / #516 / #567 edits `src/frontend/src/index.css`.

## Removed this run (SAFE TO REMOVE)

Orphan CSS left after the 2026-08-31 dungeon-editor deletion. The 2026-09-02 audit already deleted the class *definitions* and left these media-query selectors because older PR **#286** owned the same 768px hunk (`stone-modal-close` + 16px inputs). **#286 has merged**; live close buttons use `stone-modal-close` (`BuffShop`, `BossGuideModal`, `AchievementsPanel`, `GameFlow`, `EnemyRegister`, `StatPopup`, `SpellbookModal`). Zero `className` / dynamic-class hits for `.dungeon-grid` or `.tool-button` in `src/frontend/src/**/*.ts(x)`.

| Item | Why high confidence |
| :--- | :--- |
| `@media (max-width: 768px) .dungeon-grid` | Editor gone; definition already deleted 2026-09-02; selector was a no-op. |
| `@media (min-width: 1280px) .dungeon-grid` | Same; three-column editor layout never mounts. |
| `.tool-button` on the 44px touch-target list | Companion of deleted `ObjectPalette` / editor toolbar. Live 44px targets remain: `stone-nav-btn`, `stone-touch-target`, `stone-battle-action`, `.stone-top-bar button`, `stone-modal-close`. |

**Doc correction (not a deletion):** `docs/ARCHITECTURE.md` still said root `mops.toml` had `check-limit = 4` and `.old` as an empty-canister baseline. Live values are `check-limit = 5` and `.old` = Caffeine’s 2026-08-31 deployed signature (PR #181 `f8aa05e`, no GameKey). Empty-canister genesis is `snapshots/empty-canister.most`, not `.old`. Same one-line fix as #339 / #346 / #423 / #469 / #516 / #567.

No new high-confidence dead *files* since 2026-09-25. Independent zero-importer scan (plus `@/` aliases, `import()`, tests, and barrels) still finds only `BoostToggle.tsx`, unused shadcn `components/ui/*` (except `sonner` / `alert-dialog` / transitive `button`), and `engine/summonAI.ts`. Eleven production files added after 2026-09-02 (`battleWalkMp`, `canvasLoopActivity`, `enemyWalkMp`, `playerCastPlan`, `spawnPolicy`, `challengeHudVisibility`, `enemyRegisterCopy`, `legacyPurchaseCredit`, `shopDialogDismiss`, `startingChampionStats`, `victoryAchievements`) all have non-test importers.

Design-kit CSS with zero className hits (`.glow*`, `.animate-pulse-glow`, `.modal-backdrop`, `.cursor-grab*`, `.text-shadow`, bare `.dofus-panel`, non-portal `.stone-popup*`, unused pill/chip color variants) stays **NEEDS HUMAN DECISION**. They are generic kit utilities, not leftovers of a deleted feature. `SummonControlPanel` interpolates a Tailwind `glow` string, not the `.glow` class. `StatPopup` builds `stone-stat-chip-${STAT_COLORS[key]}`.

Blank lines at `src/backend/main.mo` 29–43 are cosmetic leftover import spacing. **Not removed** — Motoko / Caffeine import-gate risk for no runtime gain.

## Left in place

### LEGACY BUT REQUIRED

| Item | Why keep |
| :--- | :--- |
| `src/backend/migrations/` + `.old/src/backend/dist/backend.most` | Live mops chain / `check-stable`. `.old` is Caffeine-owned (Aug-31 import, 42 stables, no GameKey). Do not blank or rewrite. |
| `src/backend/BaseToCore.mo` | Documented completed mo:base→mo:core marker (`AGENTS.md`). Not imported by `main.mo`. |
| `src/backend/lib/admin.mo`, `lib/adminGuard.mo`, `lib/gameKey.mo`, `types/admin.mo` | Imported by canonical `main.mo`. |
| `src/frontend/src/backend.ts` + `backend.d.ts` + `src/frontend/src/declarations/` | Canonical bindgen. 12-field `CharacterStats` with `killCount`, no `wp`/`wr`/`scp`. In sync with `src/backend/dist/backend.did`. Live import is `./declarations/`, not the Vite `declarations` alias. |
| Root `mops.toml` `[dependencies] ic = "4.2.0"` | **Used.** `main.mo` `import { ic } "mo:ic"`; `ic.raw_rand()` for GameKey entropy. |
| `src/frontend/src/utils/debugLogger.ts` | Re-export shim; engine/UI files still import it. |
| `src/frontend/src/hooks/useDungeonState.ts` | `getDungeonMultiplier` delegates to `portalRules.dungeonDokaMultiplierFor` and is tested. Stub `useDungeonState = () => ({})` kept for safe imports. |
| `src/frontend/src/components/InitiativeStrip.tsx` | Default UI unused, but `CombatantEntry` is the shared combatant type (14+ importers). |
| `src/frontend/src/components/CharacterCreation.tsx` | Live — `GameFlow` imports and renders it. |
| `src/backend/dist/backend.did` + `backend.most` (+ tracked `backend.wasm`) | Canonical Candid / build artifact. Regen via bindgen / mops; do not hand-edit. |
| `VITE_USE_MOCK` | Live local-dev flag (`useActor` → `mocks/backend.ts`). |
| `AI_*_ENABLED` constants | Live AI master toggles (all `true`), consumed by `enemyAI.ts`. Not leftover flags. |
| `calculateAndAwardDoka` | Unused public mint on the Candid surface (bindgen + mock only). Must not be called from the official reward funnel. Keep the stub. |
| `initiatePurchase` / `processPendingPurchases` | Legacy Candid stubs (`#err` / `0`). Signature kept. World remount still calls the no-op. |
| `engine/worldFeatures.ts` | Tests + `docs/WORLD_DYNAMICS.md` contract. Open world-mechanics PRs grow the catalog. |
| `utils/longHorizonSim.ts` | CLI/dev balance tool (test-imported). |
| `engine/mapGen.simulate.ts` | Solvability test helper. Several open map-integrity PRs import it. |
| GameKey / shop files | `dokaGameKey.ts`, `iapShopCopy.ts`, `itemShop.ts`, `legacyPurchaseCredit.ts`, `DokaGameKeyShop.tsx`, `AdminGameKeyPurchases.tsx` — live. |
| `StatPopup` `stone-stat-chip-{violet,blue,green,amber,gold,crimson}` | **Dynamically referenced** via `STAT_COLORS` (`stone-stat-chip-${STAT_COLORS[key]}`). Not dead CSS. |
| `utils/oneShotCredit.ts` / `absoluteStatsClamp.ts` | Test harnesses / intended guards. Open persist PRs extend related paths. Do not delete as “unused production.” |

### STALE GENERATED ARTIFACT

| Item | Notes |
| :--- | :--- |
| Root `declarations/backend/` | 14-field snapshot **with** `wp`/`wr`/`scp`, **no** `killCount`, ~14 methods vs ~250 live. Not imported. Frontend tsconfig / Vite `declarations/*` maps to `src/frontend/../declarations` (`/workspace/src/declarations`, **missing**) — a footgun if anyone starts using the alias (root folder is `/workspace/declarations`). Default dfx output location — do not delete without a human retarget of `dfx.json`. Bindgen source of truth is `src/backend/dist/backend.did`. |
| Root `frontend/public/assets/` | **Git-tracked.** Five Caffeine screenshot / generated files (~2.8M): three `screenshot_2026-06-21_*` PNGs, `image-019f6864-…png`, `generated/skateboard-sprite.png`. Zero app / Vite references. Live assets are `src/frontend/public/`. Do not delete — Caffeine blob/screenshot IDs. |
| Git-tracked `src/frontend/dist/` (14 files) | Root `.gitignore` lists `dist/`, but these hashed bundles are force-tracked (`git ls-files -v` → `H`: `index-xlu0ZP3Q.js`, `index-BHoDwDa8.css`, `AdminDashboard-IkVDM-7K.js`, fonts, three `IMG_1336*.jpeg`, `env.json`, `favicon.ico`, `index.html`). A local `pnpm build` replaces the hashes and dirties git. Caffeine frontend `[build] out = dist`. Do not delete or commit a new hash set without a human. |

### NEEDS HUMAN DECISION

| Item | Question |
| :--- | :--- |
| `backend_extended/` | Documented dfx leftover. Motoko `CharacterStats` is **14 fields** (`hp`/`ap`/`mp`/`atk`/`res`/`evasion`/`init`/`sp`/`wr`/`sr`/`scp`/`wp`/`resilience`/`chc` — `wp`/`wr`/`scp`, no `killCount` at `backend_extended/main.mo` 46–61). Project docs / `AGENTS.md` still call it the “15-field actor.” **Do not delete** — upgrade/compat reference. `dfx.json` still points at **non-existent** `src/backend_extended/main.mo` (real folder is repo-root `backend_extended/`). Retarget `dfx.json` → `src/backend/main.mo` vs keep a broken path as a deploy guard. |
| Root `declarations/backend/` | Delete after dfx retarget, or leave as footgun. |
| `src/backend/mixins/*`, `lib/types.mo`, `types/common.mo`, `types/chat.mo` | Unused by `main.mo`. Combat `EnemyConfig` in `types/common.mo` is the unused runtime template; live spawn template is inlined in `main.mo` + `types/admin.mo`. `ChatMessage` is inlined in `main.mo`. `mixins/admin-api.mo` wraps unguarded `AdminLib` CRUD — never `include` without `AdminGuard`. Could be a future mixin split. |
| Unused shadcn `components/ui/*` | Game UI uses `sonner` + `alert-dialog` (+ `button` transitively). Dead-chain only (imported only by unreachable UI): `dialog`, `input`, `label`, `separator`, `sheet`, `skeleton`, `toggle`, `tooltip`. `components.json` is the Caffeine/shadcn catalog. |
| Unused frontend deps with zero app imports | `@react-three/*`, `three`, `@tanstack/react-router`, `zustand`, `react-quill-new`, `motion`. Only `recharts` is pulled in by unused `ui/chart.tsx`. Do not prune the Caffeine template lockfile without a human. |
| `InitiativeStrip` UI vs type | Extract `CombatantEntry` then delete the unused strip UI. Blocked while **#471** edits the file. |
| `GameFlow` `dungeonData` + WX `dungeon` prop | Always `null` after dungeon-editor removal. WX binds it as `_dungeon`. Hook is stub `() => ({})`. Removing the prop is an interface change. |
| Duplicate camera / enemy-move constants | `data/gameConstants.ts` exports unused `_CAMERA_*` / `_ENEMY_MOVEMENT_*` / unused `CAMERA_SMOOTHING_FACTOR`; WX redeclares the live numbers next to the RAF camera. Do not touch WX camera locals. |
| `MAP_MODIFIER_*` in `gameConstants.ts` vs inline values in `mapModifiers.ts` | Catalog unused; engine copies the numbers locally. Open **#443** edits `mapModifiers.ts`. Wire imports vs delete catalog. |
| `getModifierDefinition` | `mapModifiers.ts`. Registry + `listAdminModifierTypeOptions` are live; this helper has zero callers. Tiny lookup next to a live map — drop vs keep as the public registry API. |
| `ENEMY_AI_TIER_GATES` | Exported, zero importers. Comment in `enemyAI.ts` notes the table has no wounded-sacrifice entry. Planned gates vs dead scaffold. |
| `BoostToggle.tsx` + App → GameFlow `boostMode` / `onBoostToggle` | Component never mounted on `main` (zero importers). App still passes the props; GameFlow discards them (`_onBoostToggle`). WX owns a separate `boostMode` (setter unused, so always `"xp"`). **#335** and **#471** add 44px / `aria-*` to the same file — wire vs drop is an a11y+product decision, not a delete. |
| `engine/summonAI.ts` (`runSummonAI`) | ~600-line pure dispatcher, never imported. Live summon turns use `enemyAI.decideSummonAction` / `summonExecutor`. Wire vs delete in a dedicated PR. |
| `syncExpiredSummonsFromTurnQueue` | `summonIntegration.ts` 146–171. Zero callers; WX uses `expireSummonsAtTurnStart` directly. Dead path vs future turn-queue helper. |
| `DEFAULT_GAME_CONFIG` | Unused named default. Same 10 / 40 / 5 fallbacks are inlined in `useAdminQueries`, Admin, WX, and mocks. |
| `hooks/useShopQueries.ts` | Entire React Query wrappers have **zero callers** (re-exported by `useQueries.ts`). Live checkout is `shopPurchase.ts` + GameKey shop. Backend `ShopPackage` / `initiatePurchase` Candid is still live (`initiatePurchase` is a legacy `#err` stub). Drop wrappers vs keep as the official query API. |
| Unused barrel hook symbols | `useIsCallerAdmin`, `useAdminSetMapModifierChance`, `useSetBossPortalAssignment`, `useDokaAchievementTracker`, `useGetCharacter`, `useRenameCharacter`, `useBackendStatus`, `useSaveKillCount` — never invoked; wrap live Candid. App uses `useGetUserRole` instead of `useIsCallerAdmin`. |
| Duplicate string constants | `BOSS_CONFIG_KEY` (`"pbv_boss_configs"`) in `useAdminQueries.ts` / `useBossQueries.ts`; `STORAGE_PREFIX` (`"pbv_panel_layout_"`) in `DraggablePanel.tsx` / `usePanelLayout.ts`; `PLAYER_BASE_AP`/`MP` in `gameConstants.ts` / `adminSafety.ts`; `VOID_RIFT_TICK` in `battleSetup.ts` / `mapModifiers.ts`. Deduplicate vs leave colocated. |
| `src/backend/mops.toml` moc 1.9.0 vs root 1.11.2 | Documented stale nested pin. |
| Root `mops.toml` `base = "0.16.0"` | No `mo:base` under `src/backend/`. Only `backend_extended/` imports `mo:base`. Keep until that leftover actor is retired, or drop after a local `backend_extended` build is proven unused. |
| `src/backend/system-idl/aaaaa-aa.did` | **Not** imported by current `main.mo` (live path uses `mo:ic`). Keep until Caffeine/mops toolchain need is proven. |
| Unused OQL value imports on `main.mo` | `TextValue` / `NatValue` / `BoolValue` / `IntValue` / `FloatValue` appear import-only. `OQL` / `Expose` / `Entity` are used. Do not strip without a Caffeine OQL compile proof. |
| Doc “15-field” wording | On-disk Motoko/Candid for `backend_extended` / root `declarations` is **14 fields**. Canonical actor is **12 fields** at `src/backend/main.mo` 147–160. `AGENTS.md`, `README.md`, `ARCHITECTURE.md`, `TROUBLESHOOTING.md` still say “15-field.” Correct in a dedicated docs PR (those files are heavily overlapped). This pass does not change that table cell. |
| `.dofus-panel` (without `-header`) | Zero className hits. `dofus-panel-header` is live on the WX inspect card. Tailwind also names a `dofus-panel` box-shadow. Design-kit parent vs leftover wrapper. |
| Unused chip/pill variants | `stone-stat-chip-orange` / `periwinkle` / `lightslate`; `stone-pill-blue` / `purple`. Live chips use STAT_COLORS (violet/blue/green/amber/gold/crimson). Generic kit — not deleted. Smell: `StatPopup` uses `stone-pill-slate` with **no** matching CSS rule. |
| `.glow*` / `.animate-pulse-glow` / `.modal-backdrop` / `.cursor-grab*` / `.text-shadow` / non-portal `.stone-popup` | Zero hits this pass, but they are generic design-kit utilities. `SummonControlPanel` interpolates a Tailwind `glow` variable — not these classes. Not deleted. |

## Not found

- Obsolete `FEATURE_*` / unused `VITE_*` / `ENABLE_*` env flags (besides live `VITE_USE_MOCK`). `FEATURE_BY_ID` in `worldFeatures.ts` is a live catalog map, not a product flag.
- Stale frontend bindgen vs `src/backend/dist/backend.did` (12-field stats still agree; `killCount` present; no `wp`/`wr`/`scp`).
- Commented-out replacement implementations that were safe to strip as a block. The `spellEngine.ts` Barrier section is live code with explanatory comments.
- New leftover `engine/` copies at repo root.
- Unused GameKey / item-shop / persist-lock modules (all live).
- Duplicate dungeon Doka multiplier tables (still a single `portalRules.dungeonDokaMultiplierFor`).
- New high-confidence dead files since 2026-09-25. The only non-test, non-entry `.ts/.tsx` with zero importers remains `BoostToggle.tsx` (plus the unused shadcn kit and `summonAI.ts`).

## Re-verified / corrected from 2026-09-25

`backend_extended/`, root `declarations/`, mixins / `types/common.mo` / `types/chat.mo`, shadcn kit, `InitiativeStrip` + `CombatantEntry`, dungeon prop, camera-constant duplicates, `summonAI.ts`, unused `useShopQueries`.

**Confirmed:** `backend_extended/main.mo` `CharacterStats` is **14** Motoko fields (`wp`/`wr`/`scp`, no `killCount`) at lines 46–61. Canonical is 12 fields at `src/backend/main.mo` 147–160. Docs that say “15-field” are off by one.

**Confirmed:** root `mops.toml` `ic = "4.2.0"` is live. Nested `src/backend/mops.toml` still pins moc 1.9.0. `check-limit = 5`.

**Re-verified:** `StatPopup` builds `stone-stat-chip-${STAT_COLORS[key]}` so violet/blue/green/amber/gold/crimson chips are live. A class-name grep that ignores template strings falsely marks them unused.

**Sibling-PR lock:** do not delete `BoostToggle.tsx` while **#335** / **#471** edit it. Do not enlarge the 44px selector list with `stone-btn-crimson` / `stone-btn-slate` (**#425** MAA-2026-09-22-004, HUMAN). Do not delete `getModifierDefinition` while **#443** owns `mapModifiers.ts`. Do not expand this `index.css` hunk beyond the dungeon-editor leftovers already queued on #339 / #423 / #469 / #516 / #567.

## Validation

After cleanup: `bash scripts/caffeine-import-gate.sh all` (`pnpm typecheck`, `pnpm check`, frontend `vite build`, `mops check` when the toolchain is present) and `bash scripts/open-pr-stack-compat.sh --self`.
