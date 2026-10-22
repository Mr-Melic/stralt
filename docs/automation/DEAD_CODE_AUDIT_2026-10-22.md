# Dead-code / legacy-drift audit — 2026-10-22

**Automation:** cron `0 */48 * * *` (`d449111b-a487-11f1-a7d1-d6b4613131ce`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332 from Mr-Melic/cursor/report-findings-orchestration-8493`) — same tree as the 2026-09-21 through 2026-10-21 passes.  
**Prior pass on `main`:** `docs/automation/DEAD_CODE_AUDIT_2026-09-02.md` (HEAD `58302bc`). Later dated reports live on still-open PRs #339 / #423 / #469 / #516 / #567 / #634 / #673 / #717 (CSS hunk), **#785** (docs-only 2026-09-29), and **#834** (docs-only 2026-10-21).  
**Gameplay / RAF / mapGen / turn / damage math:** not modified.

This pass classifies candidates. Only **SAFE TO REMOVE** items with high confidence are deleted. Static “no callers” was not enough — each item was checked for dynamic `import()`, `@/` aliases, bindgen/dfx output, migrations, deployment wiring, tests, sibling open-PR overlap, documented public helpers, debug overlay APIs, and intentional docs/reference.

## Removed this run (SAFE TO REMOVE)

**None.** Unique high-confidence leftover on `main` is still the post-#286 dungeon-editor CSS (`.dungeon-grid` rules at `src/frontend/src/index.css` 684–686 and 715–717, plus `.tool-button` in the 44px media-query list at 689). That exact hunk is already the unique delta of eight older still-open PRs:

| PR | createdAt | title |
| :--- | :--- | :--- |
| #339 | 2026-09-21 | chore: drop leftover dungeon-editor CSS after #286 |
| #423 | 2026-09-22 | same hunk |
| #469 | 2026-09-23 | same hunk |
| #516 | 2026-09-24 | same hunk (+ Motoko/Candid/dfx notes) |
| #567 | 2026-09-25 | same hunk |
| #634 | 2026-09-26 | same hunk |
| #673 | 2026-09-27 | same hunk |
| #717 | 2026-09-28 | same hunk |

Re-queuing it here would conflict with those older siblings on `index.css` / `docs/ARCHITECTURE.md` (oldest-`createdAt` merge order). Same-SHA subsumption is not useful as a ninth copy. Live 44px targets in that list (`.stone-nav-btn`, `.stone-touch-target`, `.stone-battle-action`, `.stone-top-bar button`, `.stone-modal-close`) stay; they have real `className` hits.

#785 and #834 already recorded the 2026-09-29 / 2026-10-21 classifications on this same HEAD. This run re-verified the tree independently (module graph with `@/` aliases, unused-export scan, CSS class scan, Motoko import closure, Candid/bindgen field compare, BoostToggle / summonAI / dfx path checks) and did not find a new high-confidence deletion that is free of older-PR overlap.

## Left in place

### LEGACY BUT REQUIRED

| Item | Why keep |
| :--- | :--- |
| `src/backend/migrations/` + `.old/src/backend/dist/backend.most` | Live mops EOP chain / `check-stable`. Caffeine-owned Aug-31 signature (42 stables, no GameKey). Never blank, never hand-write. |
| `src/backend/migrations/snapshots/deployed/*.most` + `empty-canister.most` + `unsupported/` | Gate baselines. Unsupported shapes must **fail** check-stable. |
| `src/backend/BaseToCore.mo` | Documented completed mo:base→mo:core marker (`AGENTS.md`). Not imported by `main.mo`. |
| `src/backend/lib/admin.mo`, `lib/adminGuard.mo`, `lib/gameKey.mo`, `types/admin.mo` | Imported by canonical `main.mo`. |
| `src/frontend/src/backend.ts` + `backend.d.ts` + `src/frontend/src/declarations/` | Canonical bindgen. 12-field `CharacterStats` with `killCount`, no `wp`/`wr`/`scp` (`backend.did.d.ts` 108–121). SpellConfig summon fields (`isSummon`, `summonAI`, `summonLifespan`) match `src/backend/dist/backend.did`. |
| `src/backend/dist/backend.did` + `backend.most` (+ tracked `backend.wasm`) | Canonical Candid / last mops emit. Regen via bindgen; do not hand-edit. |
| `src/frontend/src/utils/debugLogger.ts` | Re-export shim over `debug/debugLogger.ts`. Engine/UI still import the shim. |
| `src/frontend/src/debug/{clickTrace,debugExport,geometryOverlayState}.ts` | Live debug overlay (`ChatPanel`, `WorldExploration`). Must stay reachable during load/crash. `clearClickTraceBuffer` / `toggleGeometryOverlayEnabled` have zero callers this pass but are the overlay’s reset/toggle API. |
| `src/frontend/src/hooks/useDungeonState.ts` | `getDungeonMultiplier` delegates to `portalRules.dungeonDokaMultiplierFor` (tested). The `useDungeonState = () => ({})` stub still has **zero importers** this pass (only `getDungeonMultiplier` is imported, from the test file). Keep the stub as a documented safe-import compatibility export. |
| `src/frontend/src/components/InitiativeStrip.tsx` | Default UI never mounted (`<InitiativeStrip` has zero hits). Exported `CombatantEntry` is the shared combatant type (WX, BattleUIPanel, combatantStore, turnQueue, summons, tests). |
| `VITE_USE_MOCK` | Live local-dev flag (`useActor.ts` line 8). Only `VITE_*` env flag found. |
| `AI_*_ENABLED` constants in `gameConstants.ts` | Live AI master toggles consumed by `engine/enemyAI.ts` (all currently `true`: lethal lookahead, overkill spill, LoS reposition, backline protect, intent log). |
| `calculateAndAwardDoka` / `initiatePurchase` / `processPendingPurchases` | Candid surface. First two are stubs (`0` / always `#err`). Official Doka is `applyRewards` + GameKey. World remount still calls `processPendingPurchases` (no-op, returns `0`). Do not drop from bindgen. |
| `engine/worldFeatures.ts` | Tests + `docs/WORLD_DYNAMICS.md` contract. |
| `utils/longHorizonSim.ts` | CLI/dev balance tool (`node --experimental-strip-types …`). |
| `engine/mapGen.simulate.ts` | Solvability test helper. |
| `utils/applyRewardsResult.ts` / `legacyPurchaseCredit.ts` | Production imports (`rewardResolver`, `dokaPersist`, `shopPurchase`). |
| GameKey / item-shop files | `dokaGameKey.ts`, `iapShopCopy.ts`, `itemShop.ts`, `DokaGameKeyShop.tsx`, `AdminGameKeyPurchases.tsx` — live. |
| `hooks/useGetAllBossConfigs` | **Live.** `AdminDashboard.tsx` 7752. Not a dead React Query wrapper. |
| Root `mops.toml` `ic = "4.2.0"` | **Used.** `src/backend/main.mo` line 16 `import { ic } "mo:ic"` + `ic.raw_rand()` for GameKey. |
| `src/frontend/src/index.css` design-kit (`.glow` / `.glow-green` / `.glow-red` / `.glow-yellow` at 580–594 inside `@layer utilities`, `.animate-pulse-glow`, `.modal-backdrop`, `.cursor-grab*`, `.cursor-crosshair` at 740–742, `.text-shadow`, `.stone-pill-blue`/`purple`, unused `stone-stat-chip-orange`/`periwinkle`/`lightslate`, non-portal `.stone-popup`) | Independent CSS-class scan: among custom selectors, the only zero-hit names *outside* `index.css` + force-tracked `src/frontend/dist` are `.glow-green` / `.glow-red` / `.glow-yellow`. `.dungeon-grid` / `.tool-button` also have zero source `className` hits (they survive in the tracked dist CSS). `StatPopup` **does** build `stone-stat-chip-${STAT_COLORS[key]}` (`violet` / `blue` / `green` / `amber` / `gold` / `crimson`) — those variants are live. `SummonControlPanel` interpolates a Tailwind `glow` variable, not these kit classes. Do not expand `index.css` deletions: the file is already owned by the eight CSS PRs. |
| `.stone-pill-slate` | Used in `StatPopup.tsx` 232 with **no** matching CSS rule. HUMAN (add the rule vs rename the class), not a deletion. |

### STALE GENERATED ARTIFACT

| Item | Notes |
| :--- | :--- |
| Root `declarations/backend/` | **14-field** `CharacterStats` **with** `wp`/`wr`/`scp`, **no** `killCount` (`declarations/backend/backend.did` 8–24). Not imported by the app. Frontend tsconfig `"declarations/*": ["../declarations/*"]` resolves to missing `/workspace/src/declarations` — a footgun if anyone starts using the alias. Default dfx output location. Do not delete without retargeting `dfx.json`. Bindgen source of truth is `src/backend/dist/backend.did`. |
| Root `frontend/public/assets/` | Git-tracked Caffeine screenshots (three dated 2026-06-21 PNGs + `image-019f6864-…png`) plus a duplicate `generated/skateboard-sprite.png` (also live under `src/frontend/public/assets/generated/`). Live assets are `src/frontend/public/`. Do not delete. |
| `src/frontend/dist/` hashed bundles | Force-tracked despite `dist/` gitignore (`index-xlu0ZP3Q.js`, `index-BHoDwDa8.css`, `AdminDashboard-IkVDM-7K.js`). Do not commit a new vite hash set from this audit. |
| `src/backend/mops.toml` | Nested pin moc **1.9.0**, core 2.6.0, **no** migrations chain, **no** `ic`. Live build is root `mops.toml` (moc 1.11.2, `check-limit = 5`). |

### NEEDS HUMAN DECISION

| Item | Question |
| :--- | :--- |
| `backend_extended/` | Documented dfx leftover. Motoko `CharacterStats` is **14** fields (`hp, ap, mp, atk, res, evasion, init, sp, wr, sr, scp, wp, resilience, chc` — `backend_extended/main.mo` 46–61). Docs/README/AGENTS still say “15-field”. **Do not delete** — upgrade/compat reference. `dfx.json` points at **non-existent** `src/backend_extended/main.mo` (real folder is repo-root `backend_extended/`). Retarget `dfx.json` → `src/backend/main.mo` vs keep the broken path as a deploy guard. Root `mops.toml` `base = "0.16.0"` is only required while this tree exists (`mo:base` imports in `backend_extended/` only). Canonical `main.mo` uses `mo:core` + `mo:ic`. |
| `src/backend/mixins/*`, `lib/types.mo`, `types/common.mo`, `types/chat.mo` | Unused by `main.mo` (only `types/admin.mo` + `lib/admin.mo` / `adminGuard.mo` / `gameKey.mo` are in the import closure). No `include` of mixins. `ChatMessage` is inlined on the actor (`types/chat.mo` is a duplicate shape). `types/common.mo` `EnemyConfig` is the runtime combat template (different from admin/frontend spawn `EnemyConfig`). Could be a future mixin split. Do not `include` mixins into `main.mo` as-is (duplicate public funcs). |
| Unused shadcn `components/ui/*` | Module graph: game UI uses `sonner` + `alert-dialog` (+ `button` transitively). Unused kit files include accordion/avatar/calendar/carousel/chart/command/drawer/form/menubar/pagination/resizable/sidebar/table/… `dialog.tsx` is only reached from unused `command.tsx` on `main`; open a11y PR **#740** edits `dialog.tsx` / `LandingPage.tsx`. `ui-summary.json` / `components.json` are the Caffeine/shadcn catalog. |
| `InitiativeStrip` UI vs type | Extract `CombatantEntry` then delete the unused strip UI. |
| `GameFlow` `dungeonData` + WX `dungeon` prop | `setDungeonData` is only ever called with `null` (`GameFlow.tsx` 227). WX binds it as `_dungeon` (842). Removing the prop is an interface change. Live dungeon-chain state is separate refs, not this prop. |
| Duplicate camera / enemy-move constants | `gameConstants.ts` 12–14, 22–23 export unused `_CAMERA_*` / `_ENEMY_MOVEMENT_*` / unused-from-WX `CAMERA_SMOOTHING_FACTOR`. WX redeclares the live camera numbers next to the RAF loop (638–643) and **uses** the local `CAMERA_SMOOTHING_FACTOR` (5925–5929). **Do not touch WX camera locals.** |
| `MAP_MODIFIER_*` in `gameConstants.ts` vs inline values in `mapModifiers.ts` | Catalog unused as imports; engine copies the numbers locally. `getModifierDefinition` (`mapModifiers.ts` 499) has zero importers; Admin uses `listAdminModifierTypeOptions`. Wire imports vs delete catalog. |
| `ENEMY_AI_TIER_GATES` | Exported (`gameConstants.ts` 200), zero importers. `enemyAI.ts` comment notes the table has no wounded-sacrifice entry. Planned gates vs dead scaffold. |
| `BoostToggle.tsx` + App → GameFlow `boostMode` / `onBoostToggle` | Component never mounted (zero importers of the module). App still passes the props (`App.tsx` 498–499); GameFlow discards them (`_boostMode`, `_onBoostToggle`). WX owns a separate `boostMode` (setter `_setBoostMode` unused, so always `"xp"`) used in reward math (~12375 / 12657). Open a11y PRs **#335** (2026-09-21) and **#471** (2026-09-23) add 44px / `aria-*` on this UI — do not delete while queued. |
| `engine/summonAI.ts` (`runSummonAI`) | ~600-line pure dispatcher, never imported. Live summon turns use `enemyAI.decideSummonAction` / `summonExecutor`. Comment in `gameConstants.ts` 216 and `enemyAI.ts` 230 already records this. Wire vs delete in a dedicated PR. |
| `utils/oneShotCredit.ts` | Test-only. Production pickups use `dokaPersist.ts`. |
| `utils/absoluteStatsClamp.ts` | Test-only. Intended guard before `saveBattleStats`; not wired. |
| `DEFAULT_GAME_CONFIG` | Unused named default (`types/gameTypes.ts` 359). Same 10 / 40 / 5 fallbacks are inlined in `useAdminQueries`, Admin, WX, and mocks. |
| `hooks/useShopQueries.ts` | Entire React Query wrappers (`useGetShopPackages`, `useInitiatePurchase`, `useGetPurchaseRecords`) have **zero callers** (barrel re-export from `useQueries.ts` only). Live checkout is `shopPurchase.ts` + `DokaGameKeyShop`. Backend `ShopPackage` / `initiatePurchase` Candid is still live (stub). Drop wrappers vs keep as the official query API. |
| Unused barrel hook symbols | `useIsCallerAdmin`, `useAdminSetMapModifierChance`, `useSetBossPortalAssignment`, `useDokaAchievementTracker`, `useGetCharacter`, `useRenameCharacter`, `useBackendStatus`, `useSaveKillCount` — never invoked; wrap live Candid. App uses `useGetUserRole` instead of `useIsCallerAdmin`. Do not auto-delete Candid wrappers. |
| `src/backend/system-idl/aaaaa-aa.did` | **Not** imported by current `main.mo` (GameKey uses `mo:ic`). Keep until Caffeine/mops toolchain need is proven. |
| Orphan `.dungeon-grid` / `.tool-button` CSS | SAFE, but already queued (see table above). Also bundled with `ARCHITECTURE.md` table row still saying `check-limit = 4` while root `mops.toml` and the migrations section of the same file correctly say `5`; `.old` is Caffeine-owned, not an empty-canister baseline. |
| Docs “15-field” vs Motoko **14**-field `backend_extended` | README / ARCHITECTURE / AGENTS / TROUBLESHOOTING. Dedicated docs PR; those files are heavily overlapped (oldest still-open include #327 / #331 / #334 / #335 / #339 / #346). |
| `AGENTS.md` / ARCHITECTURE CharacterStats line cite `144–157` | Live type is `src/backend/main.mo` **147–160** (12 fields unchanged). Cite drift only. |
| Unused named helpers | See table below. Zero production/test callers, but several are documented contracts, debug APIs, or superseded persist guards in files owned by older open PRs. Do not auto-delete for static “no callers.” |

#### Unused named helpers (still HUMAN)

Not deleted. Superseded persist/shop helpers live in heavily overlapped files (`itemShop.ts`, `dokaPersist.ts`, `progressPersist.ts`, `deathPenalty.ts`, `xpCurve.ts`, `mapGen.ts`). Debug overlay APIs must stay reachable.

| Symbol | Location | Why not auto-deleted |
| :--- | :--- | :--- |
| `getBossKit` | `data/bossKits.ts` 758 | Catalog accessor. Live path uses `getBossPhase1SpellIds` / `getBossPhase2SpellIds` (`types/bossDefaults.ts`). |
| `syncExpiredSummonsFromTurnQueue` | `engine/summonIntegration.ts` 146 | Older turn-queue wrapper. Live WX calls `expireSummonsAtTurnStart`. |
| `sumDotTicks` | `engine/dotStacks.ts` 44 | Documented stacking API. Live tick path is `tickDotStacks`. |
| `pickLegalWhitePortalCell` | `engine/mapGen.ts` 1491 | Documented white-portal contract (`docs/ARCHITECTURE.md`). Live placement is `placeWhitePortalAtSpawn`. |
| `floodWalkable` | `engine/mapGen.ts` 1521 | Thin export over `floodFillReachable`. Possible solvability/test helper. |
| `clearClickTraceBuffer` | `debug/clickTrace.ts` | Documented “dev-only reset hook” for the overlay ring buffer. |
| `toggleGeometryOverlayEnabled` | `debug/geometryOverlayState.ts` | Overlay toggle; ChatPanel uses `setGeometryOverlayEnabled`. |
| `canAffordJackpotHeal`, `paidHealFromLiveWallet`, `shouldGrantBuffPurchase`, `shouldGrantDokaHeal`, `shouldWriteAbsoluteSpend` | `utils/itemShop.ts` | Superseded by `shouldStartDokaHeal` / `resolveOverworldHealSpend` (tested + used by WX). File is persist/shop overlapped. |
| `clampAbsoluteDokaWrite` / `clampAbsoluteXpWrite` | `utils/progressPersist.ts` | Aliases of `clampAbsoluteProgressWrite`. |
| `shouldReleaseOneShotAfterCredit` | `utils/dokaPersist.ts` | Older settle helper. Live path: `shouldReleaseOneShotDokaCredit` / `settleOneShotAfterCredit`. |
| `DEATH_PERSIST_RETRY_COUNT` | `utils/deathPenalty.ts` | Unused alias of `DEATH_PENALTY_PERSIST_ATTEMPTS`. |
| `cumulativeXpToReachLevel` | `utils/xpCurve.ts` | Unused; long-horizon sim has its own cumulative helper. HUD uses leftover-in-level (`xpHudProgress`). |

## Not found

- Obsolete `FEATURE_*` / unused `VITE_*` / `ENABLE_*` env flags (besides live `VITE_USE_MOCK`).
- Stale frontend bindgen vs `src/backend/dist/backend.did` (12-field stats and SpellConfig summon fields still agree; no `wp`/`wr`/`scp` on the canonical client).
- Commented-out replacement implementations that were safe to strip as a block (`@deprecated` / `TODO: remove` / `FIXME: unused` had zero hits under `src/`).
- New leftover `engine/` copies at repo root. No `*.bak` / `*.old` / `*.orig` source files.
- Unused GameKey / item-shop / debug / combat-juice / starfield / canvas-loop modules (all live or test-backed).
- New SAFE CSS leftovers outside the already-queued dungeon-editor hunk (remaining unused selectors are design-kit or dynamically assembled).
- New orphan production `.ts`/`.tsx` files beyond the prior BoostToggle / summonAI / unused shadcn set (module graph with `@/` aliases).
- Unused Motoko imports of mixins / `types/common` / `types/chat` / `lib/types` / `system-idl` from `main.mo`.

## Re-verified / this pass vs 2026-10-21

`backend_extended/` (count it as **14** Motoko fields, not 15), root `declarations/`, mixins / `types/common.mo` / `types/chat.mo`, shadcn kit, `InitiativeStrip` + `CombatantEntry`, dungeon prop, camera-constant duplicates, `summonAI.ts`, `BoostToggle`.

**Still true:** dungeon Doka multipliers are not triplicated. Single table in `portalRules.ts` (`dungeonDokaMultiplierFor`); `useDungeonState.getDungeonMultiplier` delegates; WX calls `dungeonDokaMultiplierFor` directly.

**Still true:** GameKey shop is live. Unused `useShopQueries` wrappers remain a human-decision item. `useGetAllBossConfigs` is **not** in that bucket (AdminDashboard calls it).

**Still true:** root `mops.toml` `[dependencies] ic = "4.2.0"` **is** required (`mo:ic` / `ic.raw_rand()`). Nested `src/backend/mops.toml` is the stale pin.

**Still true:** #286 has merged; leftover `.dungeon-grid` / `.tool-button` selectors are SAFE, but eight older open PRs already own that hunk. This run does not add a ninth copy.

**Still true:** #335 and #471 are still open and still block deleting `BoostToggle.tsx`.

**Sharper this pass:** `useDungeonState` stub has zero importers (only `getDungeonMultiplier` is imported). Independent CSS-class scan confirms no new SAFE kit leftovers outside the queued dungeon-editor hunk. Oldest still-open PRs remain #327 / #331 (2026-09-02), then the 2026-09-21 wave including #335 / #339.

## Validation

Frontend import gate (`pnpm typecheck`, `pnpm check`, duplicate-export scan, `vite build`) and `bash scripts/open-pr-stack-compat.sh --self`. Motoko/mops unchanged this run; `caffeine-import-gate.sh all` still run as the finish gate.
