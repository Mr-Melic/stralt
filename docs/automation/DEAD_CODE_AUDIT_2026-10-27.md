# Dead-code / legacy-drift audit — 2026-10-27

**Automation:** cron `0 */48 * * *` (`d449111b-a487-11f1-a7d1-d6b4613131ce`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332 from Mr-Melic/cursor/report-findings-orchestration-8493`) — same tree as the 2026-09-21 through 2026-10-26 passes.  
**Prior pass on `main`:** `docs/automation/DEAD_CODE_AUDIT_2026-09-02.md` (HEAD `58302bc`). Later dated reports live on still-open PRs #339 / #423 / #469 / #516 / #567 / #634 / #673 / #717 (CSS hunk), **#785** (docs-only 2026-09-29), **#834** (docs-only 2026-10-21), **#882** (docs-only 2026-10-22), **#939** (docs-only 2026-10-23), **#1000** (docs-only 2026-10-24), **#1057** (docs-only 2026-10-25), and **#1119** (docs-only 2026-10-26).  
**Gameplay / RAF / mapGen / turn / damage math:** not modified.

This pass classifies candidates. Only **SAFE TO REMOVE** items with high confidence are deleted. Static “no callers” was not enough — each item was checked for dynamic `import()`, `@/` aliases, bindgen/dfx output, migrations, deployment wiring, tests, sibling open-PR overlap, documented public helpers, debug overlay APIs, and intentional docs/reference.

## Method (independent of #1119)

- Frontend module graph: resolve `from` / `import()` / side-effect imports with `@/` aliases; treat tests, `main.tsx` / `App.tsx` / bindgen, and `*.simulate.ts` as roots. **288** `src/frontend/src` `.ts`/`.tsx` modules; **45** orphans (see below). Same orphan set as 2026-10-26.
- Motoko import closure from `src/backend/main.mo` (plus mixins / `types/*` / `lib/*` / `system-idl` / `backend_extended/`). Live local imports: `types/admin`, `lib/admin`, `lib/adminGuard`, `lib/gameKey`. `include MixinAuthorization` (line 46) and `include Expose` (line 3498) only — no mixin files.
- Candid/bindgen field compare: `src/backend/dist/backend.did` vs `src/frontend/src/backend.ts` vs root `declarations/backend/backend.did` vs `backend_extended/main.mo`. Canonical CharacterStats is 12 fields with `killCount`, no `wp`/`wr`/`scp` (`src/backend/main.mo` **147–160**; bindgen `backend.ts` **247–260**). `backend.did.d.ts` exposes **137** `ActorMethod`s.
- CSS class scan of `src/frontend/src/index.css` against `src/frontend/src/**/*.{ts,tsx,html}` (excluding force-tracked `dist/`). **83** unique dotted tokens; **22** zero substring hits outside `index.css` plus `.glow` (comment-word false-positive — unused as a `className`). Several other zero-literal names are dynamically assembled.
- Flag scan: `FEATURE_*` / `VITE_*` / `ENABLE_*`.
- Comment scan: `@deprecated` / `TODO: remove` / `FIXME: unused` / commented-out `export`/`function` blocks — **zero** commented-out replacement implementations under `src/`.
- Open-PR overlap (`gh pr list` / search, `createdAt` ascending): **838** still-open PRs targeting `main` at stack-compat time (was **776** / stack-compat **778** on 2026-10-26; search count was **831** earlier this run). Newest observed: **#1169**. Do not re-queue a hunk already owned by an older sibling.

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

A ninth `index.css` owner is **#745** (2026-09-28, `perf: pause infinite HUD CSS while the tab is hidden`) — different hunk (`main.tsx` + hidden-tab CSS), but it still makes any extra `index.css` edit a stack-compat merge. Re-queuing the dungeon-editor selectors here would conflict with those older siblings on `index.css` / `docs/ARCHITECTURE.md` (oldest-`createdAt` merge order). Same-SHA subsumption is not useful as a tenth copy. Live 44px targets in that list (`.stone-nav-btn`, `.stone-touch-target`, `.stone-battle-action`, `.stone-top-bar button`, `.stone-modal-close`) stay; they have real `className` hits.

#785 / #834 / #882 / #939 / #1000 / #1057 / #1119 already recorded the 2026-09-29 / 10-21 / 10-22 / 10-23 / 10-24 / 10-25 / 10-26 classifications on this same HEAD. This run re-verified the tree independently (module graph, Motoko closure, Candid field lists, CSS literals vs dynamic templates, open-PR overlap through #1162) and did not find a new high-confidence deletion that is free of older-PR overlap.

## Left in place

### LEGACY BUT REQUIRED

| Item | Why keep |
| :--- | :--- |
| `src/backend/migrations/` + `.old/src/backend/dist/backend.most` | Live mops EOP chain / `check-stable`. Caffeine-owned Aug-31 signature (42 stables, no GameKey). Never blank, never hand-write. |
| `src/backend/migrations/snapshots/deployed/*.most` + `empty-canister.most` + `unsupported/` | Gate baselines. Unsupported shapes must **fail** check-stable. |
| `src/backend/BaseToCore.mo` | Documented completed mo:base→mo:core marker (`AGENTS.md`). Not imported by `main.mo`. |
| `src/backend/lib/admin.mo`, `lib/adminGuard.mo`, `lib/gameKey.mo`, `types/admin.mo` | Imported by canonical `main.mo` (lines 8–10, 17). |
| `src/frontend/src/backend.ts` + `backend.d.ts` + `src/frontend/src/declarations/` | Canonical bindgen. 12-field `CharacterStats` with `killCount`, no `wp`/`wr`/`scp` (`backend.ts` 247–260). Matches `src/backend/dist/backend.did` CharacterStats. SpellConfig summon fields (`isSummon`, `summonAI`, `summonLifespan`, `summonUnitDef`) present on did + bindgen. `backend.did.d.ts` exposes **137** `ActorMethod`s. |
| `src/backend/dist/backend.did` + `backend.most` (+ tracked `backend.wasm`) | Canonical Candid / last mops emit. Regen via bindgen; do not hand-edit. |
| `src/frontend/src/utils/debugLogger.ts` | Re-export shim over `debug/debugLogger.ts`. Engine/UI still import the shim. |
| `src/frontend/src/debug/{clickTrace,debugExport,geometryOverlayState}.ts` | Live debug overlay (`ChatPanel`, `WorldExploration`). Must stay reachable during load/crash. `clearClickTraceBuffer` / `toggleGeometryOverlayEnabled` have zero callers this pass but are the overlay’s reset/toggle API. |
| `src/frontend/src/hooks/useDungeonState.ts` | `getDungeonMultiplier` (lines 17–18) delegates to `portalRules.dungeonDokaMultiplierFor` (tested from `useDungeonState.test.ts`). The `useDungeonState = () => ({})` stub (line 22) still has **zero production importers** this pass (the test file imports `getDungeonMultiplier` only). Keep the stub as a documented safe-import compatibility export. |
| `src/frontend/src/hooks/use-mobile.tsx` | **Live.** `WorldExploration.tsx` imports `useIsMobile` / `readSafeAreaInsetTopPx`. Also imported by unused `components/ui/sidebar.tsx` — do not treat the hook as catalog-only. |
| `src/frontend/src/components/InitiativeStrip.tsx` | Default UI never mounted (`<InitiativeStrip` has zero hits). Exported `CombatantEntry` (lines 5–44) is the shared combatant type (WX, BattleUIPanel, combatantStore, turnQueue, summons, tests). |
| `VITE_USE_MOCK` | Live local-dev flag (`useActor.ts` line 8). Only `VITE_*` env flag found. |
| `AI_*_ENABLED` constants in `gameConstants.ts` | Live AI master toggles consumed by `engine/enemyAI.ts` (all currently `true`: lethal lookahead, overkill spill, LoS reposition, backline protect, intent log). |
| `calculateAndAwardDoka` / `initiatePurchase` / `processPendingPurchases` | Candid surface. First two are stubs (`0` / always `#err`). Official Doka is `applyRewards` + GameKey. World remount still calls `processPendingPurchases` (no-op, returns `0`). Do not drop from bindgen. |
| `engine/worldFeatures.ts` | Tests + `docs/WORLD_DYNAMICS.md` contract. |
| `utils/longHorizonSim.ts` | CLI/dev balance tool (`node --experimental-strip-types …`). |
| `engine/mapGen.simulate.ts` | Solvability test helper. |
| `utils/applyRewardsResult.ts` / `legacyPurchaseCredit.ts` | Production imports (`rewardResolver`, `dokaPersist`, `shopPurchase`). |
| GameKey / item-shop files | `dokaGameKey.ts`, `iapShopCopy.ts`, `itemShop.ts`, `DokaGameKeyShop.tsx`, `AdminGameKeyPurchases.tsx` — live. |
| `hooks/useGetAllBossConfigs` | **Live.** `AdminDashboard.tsx`. Not a dead React Query wrapper. |
| Root `mops.toml` `ic = "4.2.0"` | **Used.** `src/backend/main.mo` line 16 `import { ic } "mo:ic"` + `ic.raw_rand()` for GameKey. |
| `src/frontend/src/index.css` design-kit (`.glow` / `.glow-green` / `.glow-red` / `.glow-yellow` inside `@layer utilities`, `.animate-pulse-glow`, `.modal-backdrop`, `.cursor-grab*` / `.cursor-crosshair`, `.text-shadow`, `.stone-pill-blue`/`purple`, unused `stone-stat-chip-orange`/`periwinkle`/`lightslate`, `.stone-popup-animate`) | Independent CSS-class scan: among custom selectors, zero-literal-hit names *outside* `index.css` + force-tracked `src/frontend/dist` are the design-kit list above plus `.dungeon-grid` / `.tool-button`. `.glow` itself matches the word “glow” in comments (LandingPage / CharacterCreation / pieceArt / WX) — unused as a class. `StatPopup` **does** build `stone-stat-chip-${STAT_COLORS[key]}` (`violet` / `blue` / `green` / `amber` / `gold` / `crimson` via FAIL) plus a literal `stone-stat-chip-crimson` — those variants are live. `orange` / `periwinkle` / `lightslate` chip variants are unused even via `STAT_COLORS`. Do not expand `index.css` deletions: the file is already owned by the eight CSS PRs plus #745. |
| `.stone-pill-slate` | Used in `StatPopup.tsx` 232 with **no** matching CSS rule. HUMAN (add the rule vs rename the class), not a deletion. |

### STALE GENERATED ARTIFACT

| Item | Notes |
| :--- | :--- |
| Root `declarations/backend/` | **14-field** `CharacterStats` **with** `wp`/`wr`/`scp`, **no** `killCount` (`declarations/backend/backend.did` 8–24). Not imported by the app. Frontend tsconfig `"declarations/*": ["../declarations/*"]` resolves to missing `/workspace/src/declarations` — a footgun if anyone starts using the alias. Default dfx output location. Do not delete without retargeting `dfx.json`. Bindgen source of truth is `src/backend/dist/backend.did`. |
| Root `frontend/public/assets/` | Git-tracked Caffeine screenshots (three dated 2026-06-21 PNGs + `image-019f6864-…png`) plus a duplicate `generated/skateboard-sprite.png` (also live under `src/frontend/public/assets/generated/`). Live assets are `src/frontend/public/`. Do not delete. |
| `src/frontend/dist/` hashed bundles | Force-tracked despite `dist/` gitignore (`index-xlu0ZP3Q.js`, `index-BHoDwDa8.css`, `AdminDashboard-IkVDM-7K.js`). `dfx.json` `source: ["src/frontend/dist"]`. Do not commit a new vite hash set from this audit. |
| `src/backend/mops.toml` | Nested pin moc **1.9.0**, core 2.6.0, **no** migrations chain, **no** `ic`. Live build is root `mops.toml` (moc 1.11.2, `check-limit = 5`). |
| `src/backend/dist/{backend.did,backend.most,backend.wasm}` | Force-tracked last mops emit. Keep / refresh on Motoko change; do not delete. |

### NEEDS HUMAN DECISION

| Item | Question |
| :--- | :--- |
| `backend_extended/` | Documented dfx leftover. Motoko `CharacterStats` is **14** fields (`hp, ap, mp, atk, res, evasion, init, sp, wr, sr, scp, wp, resilience, chc` — `backend_extended/main.mo` 46–61). Docs/README/AGENTS still say “15-field”. **Do not delete** — upgrade/compat reference. `dfx.json` points at **non-existent** `src/backend_extended/main.mo` (real folder is repo-root `backend_extended/`). Retarget `dfx.json` → `src/backend/main.mo` vs keep the broken path as a deploy guard. Root `mops.toml` `base = "0.16.0"` is only required while this tree exists (`mo:base` imports in `backend_extended/` only). Canonical `main.mo` uses `mo:core` + `mo:ic`. |
| `src/backend/mixins/*`, `lib/types.mo`, `types/common.mo`, `types/chat.mo` | Unused by `main.mo` (only `types/admin.mo` + `lib/admin.mo` / `adminGuard.mo` / `gameKey.mo` are in the import closure). `include` hits are `MixinAuthorization` (line 46) and `Expose` (OQL, line 3498) only — no mixin files. `ChatMessage` is inlined on the actor; `types/chat.mo` is a duplicate shape. `types/common.mo` `EnemyConfig` is the runtime combat template (damage/res/sp/…; different from admin/frontend spawn `EnemyConfig`). `lib/types.mo` is a re-export barrel over `common.mo`. Could be a future mixin split. Do not `include` mixins into `main.mo` as-is (duplicate public funcs). |
| Unused shadcn `components/ui/*` | Module graph: game UI uses `sonner` + `alert-dialog` (+ `button` transitively). **`alert.tsx` is not live** (catalog-only). 46 kit files total; 43 are unreachable from app/tests; 35 of those have zero TS importers even from other kit files; 8 are only reached from unused kit (`command`→`dialog`, `form`→`label`, `sidebar`→`input`/`separator`/`sheet`/`skeleton`/`tooltip`, `toggle-group`→`toggle`). Open a11y/perf PRs still edit this catalog: **#643** (sonner), **#693** (alert-dialog), **#740** / **#822** (dialog/sheet), **#853** (alert-dialog), **#895** (button/carousel/pagination), **#1010** (accordion/command/menubar/navigation-menu/toggle), **#1068** (breadcrumb/drawer/resizable/toggle-group), **#1125** (2026-10-26, collapsible/popover/scroll-area/sidebar/table). `ui-summary.json` / `components.json` are the Caffeine/shadcn catalog. Do not delete while queued. |
| `InitiativeStrip` UI vs type | Extract `CombatantEntry` then delete the unused strip UI. Open a11y PR **#471** also edits this file. |
| `GameFlow` `dungeonData` + WX `dungeon` prop | `setDungeonData` is only ever called with `null` (GameFlow 227). WX binds it as `_dungeon` (842). Removing the prop is an interface change. Live dungeon-chain state is separate refs, not this prop. |
| Duplicate camera / enemy-move constants | `gameConstants.ts` 12–14, 22–23 export unused `_CAMERA_*` / `_ENEMY_MOVEMENT_*` / unused-from-WX `CAMERA_SMOOTHING_FACTOR`. WX redeclares the live camera numbers next to the RAF loop (638–643) and **uses** the local `CAMERA_SMOOTHING_FACTOR`. `ENEMY_MOVE_INTERVAL_MIN` / `_MAX` **are** imported from `gameConstants` into WX. **Do not touch WX camera locals.** |
| `MAP_MODIFIER_*` in `gameConstants.ts` vs inline values in `mapModifiers.ts` | Catalog at `gameConstants.ts` 306–357 has **zero importers**. Engine copies the numbers locally. `getModifierDefinition` (`mapModifiers.ts` 499) has zero importers; Admin uses `listAdminModifierTypeOptions`. Wire imports vs delete catalog. |
| `ENEMY_AI_TIER_GATES` | Exported (`gameConstants.ts` 200), zero importers. `enemyAI.ts` 1422 comment notes the table has no wounded-sacrifice entry. Planned gates vs dead scaffold. |
| `BoostToggle.tsx` + App → GameFlow `boostMode` / `onBoostToggle` | Component never mounted (module-graph orphan; only self-export). App still holds state and passes the props; GameFlow discards them (`_boostMode`, `_onBoostToggle`). WX owns a separate `boostMode` (setter unused, so always `"xp"`) used in reward math. Open a11y PRs **#335** (2026-09-21) and **#471** (2026-09-23) add 44px / `aria-*` on this UI — do not delete while queued. |
| `engine/summonAI.ts` (`runSummonAI`) | ~600-line pure dispatcher, never imported (module-graph orphan, `runSummonAI` at line 508). Live summon turns use `enemyAI.decideSummonAction` / `summonExecutor`. Comment in `gameConstants.ts` 216 and `enemyAI.ts` 230 already records this. No open PR edits this file. Wire vs delete in a dedicated PR. |
| `utils/oneShotCredit.ts` | Test-only (`oneShotCredit.test.ts`). Production pickups use `dokaPersist.ts`. |
| `utils/absoluteStatsClamp.ts` | Test-only (`absoluteStatsClamp.test.ts`). Intended guard before `saveBattleStats`; not wired. |
| `DEFAULT_GAME_CONFIG` | Unused named default (`types/gameTypes.ts`). Same 10 / 40 / 5 fallbacks are inlined in `useAdminQueries`, Admin, WX, and mocks. |
| `hooks/useShopQueries.ts` | Entire React Query wrappers (`useGetShopPackages`, `useInitiatePurchase`, `useGetPurchaseRecords`) have **zero callers** (barrel re-export from `useQueries.ts` line 10 only). Live checkout is `shopPurchase.ts` + `DokaGameKeyShop`. Backend `ShopPackage` / `initiatePurchase` Candid is still live (stub). Open perf PR **#889** edits this file — do not delete while queued. Drop wrappers vs keep as the official query API. |
| Unused barrel hook symbols | `useIsCallerAdmin`, `useAdminSetMapModifierChance`, `useSetBossPortalAssignment`, `useDokaAchievementTracker`, `useGetCharacter`, `useRenameCharacter`, `useBackendStatus`, `useSaveKillCount` — never invoked; wrap live Candid. App uses `useGetUserRole` instead of `useIsCallerAdmin`. `useGetCharacterSlots` **is** live (`CharacterSelection.tsx`). Do not auto-delete Candid wrappers. |
| `src/backend/system-idl/aaaaa-aa.did` | **Not** imported by current `main.mo` (GameKey uses `mo:ic`). Keep until Caffeine/mops toolchain need is proven. |
| Orphan `.dungeon-grid` / `.tool-button` CSS | SAFE, but already queued (see table above). Also bundled with `ARCHITECTURE.md` table row still saying `check-limit = 4` (line 28) while root `mops.toml` and the migrations section of the same file (line 452) correctly say `5`; `.old` is Caffeine-owned, not an empty-canister baseline. |
| Docs “15-field” vs Motoko **14**-field `backend_extended` | README / ARCHITECTURE / AGENTS / TROUBLESHOOTING. Dedicated docs PR; those files are heavily overlapped (oldest still-open include #327 / #331 / #334 / #335 / #339 / #346). |
| `AGENTS.md` / ARCHITECTURE CharacterStats line cite `144–157` | Live type is `src/backend/main.mo` **147–160** (12 fields unchanged). Cite drift only. |
| Unused named helpers | See table below. Zero production/test callers, but several are documented contracts, debug APIs, or superseded persist guards in files owned by older open PRs. Do not auto-delete for static “no callers.” |

#### Unused named helpers (still HUMAN)

Not deleted. Superseded persist/shop helpers live in heavily overlapped files (`itemShop.ts`, `dokaPersist.ts`, `progressPersist.ts`, `deathPenalty.ts`, `xpCurve.ts`, `mapGen.ts`). Debug overlay APIs must stay reachable.

| Symbol | Location | Why not auto-deleted |
| :--- | :--- | :--- |
| `getBossKit` | `data/bossKits.ts` | Catalog accessor. Live path uses `getBossPhase1SpellIds` / `getBossPhase2SpellIds` (`types/bossDefaults.ts`). |
| `syncExpiredSummonsFromTurnQueue` | `engine/summonIntegration.ts` | Older turn-queue wrapper. Live WX calls `expireSummonsAtTurnStart`. |
| `sumDotTicks` | `engine/dotStacks.ts` | Documented stacking API (`docs/ENEMY_AI_EVOLUTION_2026-09-02.md`, ACTION_IDS). Live tick path is `tickDotStacks`. |
| `pickLegalWhitePortalCell` | `engine/mapGen.ts` | Documented white-portal contract (`docs/ARCHITECTURE.md`, `docs/TROUBLESHOOTING.md`). Live placement is `placeWhitePortalAtSpawn`. |
| `floodWalkable` | `engine/mapGen.ts` | Thin export over `floodFillReachable`. Possible solvability/test helper. |
| `clearClickTraceBuffer` | `debug/clickTrace.ts` | Documented “dev-only reset hook” for the overlay ring buffer. |
| `toggleGeometryOverlayEnabled` | `debug/geometryOverlayState.ts` | Overlay toggle; ChatPanel uses `setGeometryOverlayEnabled`. |
| `canAffordJackpotHeal`, `paidHealFromLiveWallet`, `shouldGrantBuffPurchase`, `shouldGrantDokaHeal`, `shouldWriteAbsoluteSpend` | `utils/itemShop.ts` | Superseded by `shouldStartDokaHeal` / `resolveOverworldHealSpend` (tested + used by WX). File is persist/shop overlapped. |
| `clampAbsoluteDokaWrite` / `clampAbsoluteXpWrite` | `utils/progressPersist.ts` | Aliases of `clampAbsoluteProgressWrite`. |
| `shouldReleaseOneShotAfterCredit` | `utils/dokaPersist.ts` | Older settle helper. Live path: `shouldReleaseOneShotDokaCredit` / `settleOneShotAfterCredit`. |
| `DEATH_PERSIST_RETRY_COUNT` | `utils/deathPenalty.ts` | Unused alias of `DEATH_PENALTY_PERSIST_ATTEMPTS`. |
| `cumulativeXpToReachLevel` | `utils/xpCurve.ts` | Unused; long-horizon sim has its own cumulative helper. HUD uses leftover-in-level (`xpHudProgress`). |

Same-file-only exports (`pickAttackNearestTile`, `legalizePlayerSpawn`, `sealUnreachableWalkable`, `collectOccupiedCells`, `SPELL_ID_CATALOG`, `getCreaturePattern`, `resolveSummonControlClickTarget`, `confirmAndClearPendingDeathPenalty`) are **not** unused — they are consumed inside the defining module (and, for the death-penalty helper, via the `Anywhere` wrapper WX calls).

## Not found

- Obsolete `FEATURE_*` / unused `VITE_*` / `ENABLE_*` env flags (besides live `VITE_USE_MOCK`). `FEATURE_BY_ID` in `worldFeatures.ts` is a live lookup map, not a kill-switch. `LEGACY_MODIFIER_TYPES` in `AdminDashboard.tsx` is a live admin-type union.
- Stale frontend bindgen vs `src/backend/dist/backend.did` (12-field stats and SpellConfig summon fields still agree; 137 `ActorMethod`s on the declarations client; no `wp`/`wr`/`scp` on the canonical client).
- Commented-out replacement implementations that were safe to strip as a block (`@deprecated` / `TODO: remove` / `FIXME: unused` / commented-out `export`/`function` had zero hits under `src/`).
- New leftover `engine/` copies at repo root. No `*.bak` / `*.old` / `*.orig` source files.
- Unused GameKey / item-shop / debug / combat-juice / starfield / canvas-loop modules (all live or test-backed).
- New SAFE CSS leftovers outside the already-queued dungeon-editor hunk (remaining unused selectors are design-kit or dynamically assembled).
- New orphan production `.ts`/`.tsx` files beyond the prior BoostToggle / summonAI / unused shadcn set (module graph with `@/` aliases: 45 orphans = `BoostToggle.tsx` + `engine/summonAI.ts` + 43 unused kit files).
- Unused Motoko imports of mixins / `types/common` / `types/chat` / `lib/types` / `system-idl` from `main.mo`.

## Re-verified / this pass vs 2026-10-26

`backend_extended/` (count it as **14** Motoko fields, not 15), root `declarations/`, mixins / `types/common.mo` / `types/chat.mo`, shadcn kit, `InitiativeStrip` + `CombatantEntry`, dungeon prop, camera-constant duplicates, `summonAI.ts`, `BoostToggle`.

**Still true:** dungeon Doka multipliers are not triplicated. Single table in `portalRules.ts` (`dungeonDokaMultiplierFor`); `useDungeonState.getDungeonMultiplier` delegates; WX calls `dungeonDokaMultiplierFor` directly.

**Still true:** GameKey shop is live. Unused `useShopQueries` wrappers remain a human-decision item. `useGetAllBossConfigs` is **not** in that bucket (AdminDashboard calls it).

**Still true:** root `mops.toml` `[dependencies] ic = "4.2.0"` **is** required (`mo:ic` / `ic.raw_rand()`). Nested `src/backend/mops.toml` is the stale pin.

**Still true:** #286 has merged; leftover `.dungeon-grid` / `.tool-button` selectors are SAFE, but eight older open PRs already own that hunk. This run does not add a ninth copy. #745 is an additional `index.css` owner (hidden-tab CSS).

**Still true:** #335 and #471 are still open and still block deleting `BoostToggle.tsx`.

**Sharper this pass:** open-PR queue grew to **838** at stack-compat (was 776 / 778 on 10-26). Same HEAD. New open PRs after #1119 include `#1120`–`#1169`; **#1125** (2026-10-26) is a new unused-shadcn overlap (`collapsible` / `popover` / `scroll-area` / `sidebar` / `table`). None of those new PRs edit `index.css`, `BoostToggle.tsx`, `useShopQueries.ts`, `InitiativeStrip.tsx`, or `engine/summonAI.ts`. Independent CSS-class scan still shows the same unused design-kit set; `.glow` is unused as a className (comment-word “glow” is the only extra substring hit vs a naïve token list). Live shadcn remains `sonner` + `alert-dialog` + `button`; `alert.tsx` is catalog-only. Unused shadcn kit and `useShopQueries.ts` remain overlapped by later a11y/perf PRs (#643 / #693 / #740 / #822 / #853 / #889 / #895 / **#1010** / **#1068** / **#1125**). `useDungeonState` stub still has zero production importers. `use-mobile.tsx` is live from WorldExploration. Oldest still-open PRs remain #327 / #331 (2026-09-02), then the 2026-09-21 wave including #335 / #339.

## Validation

- `bash scripts/caffeine-import-gate.sh frontend` — duplicate-export scan; `pnpm typecheck`; Biome `pnpm check`; `vite build`. Hashed `src/frontend/dist/` artifacts restored to the tracked set and not committed.
- `bash scripts/caffeine-import-gate.sh backend -- --locked` — EOP stables / `mops check` vs `.old` and deployed snapshots. Motoko/migrations/`.old` were not changed.
- `bash scripts/open-pr-stack-compat.sh --self` — clean vs `origin/main` and as the next oldest-first queue item. Unique file does not overlap older siblings.
