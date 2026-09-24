# Frontend dead-code audit — 2026-09-24

**HEAD inspected:** `0f5363f`  
**Canonical frontend:** `src/frontend/src`  
**Method:** import-graph orphans, named-export cross-refs, CSS string scan, constant duplicate scan, open-PR overlap (`gh pr list`). **Nothing deleted.**

Sibling Motoko/Candid/dfx audit on the same calendar day lives in `DEAD_CODE_AUDIT_2026-09-24.md` (do not overwrite).

---

## Verdict

Prior known items are **unchanged** at `0f5363f`. New orphan / test-only modules: `longHorizonSim.ts`, `worldFeatures.ts`, `mapGen.simulate.ts`. New unused CSS beyond the queued dungeon-editor leftovers. `CAMERA_SMOOTHING_FACTOR` in `gameConstants` joins the unused camera catalog (WX keeps a local). No obsolete `FEATURE_` / `VITE_` / `ENABLE_` flags that are dead; AI `*_ENABLED` toggles are live but always `true`.

---

## 1. Prior known items — status

| Item | Status @ `0f5363f` | Class | Open-PR note |
| :--- | :--- | :--- | :--- |
| `BoostToggle.tsx` zero importers; App→GameFlow boost props discarded; WX `boostMode` always `"xp"` | **Unchanged** | NEEDS HUMAN DECISION | **#335**, **#471** edit the unused component (a11y) — do not delete while queued |
| `engine/summonAI.ts` `runSummonAI` unused; live path `enemyAI.ts` | **Unchanged** (whole file orphan) | NEEDS HUMAN DECISION | — |
| `hooks/useShopQueries.ts` zero callers (barrel re-export only) | **Unchanged** | NEEDS HUMAN DECISION | — |
| `InitiativeStrip.tsx` owns `CombatantEntry` | **Unchanged** — keep file | LEGACY BUT REQUIRED | #471 touches a11y only |
| `useDungeonState` / dungeon always null | **Strengthened:** hook is stub `() => ({})` (L22); GameFlow `dungeonData` only `setDungeonData(null)` (L227); WX binds `dungeon: _dungeon` (L842) | NEEDS HUMAN DECISION | — |
| `oneShotCredit.ts`, `absoluteStatsClamp.ts` test-only | **Unchanged** | LEGACY BUT REQUIRED (test harness / future wire) | #466 extends clamp; #431 related one-shot HUD |
| `DEFAULT_GAME_CONFIG` unused named default | **Unchanged** (`gameTypes.ts` L359–363) | SAFE TO REMOVE (export only) | — |
| `ENEMY_AI_TIER_GATES` unused export | **Unchanged** (`gameConstants.ts` L200–209; comment-only hit in `enemyAI.ts`) | SAFE TO REMOVE (export only) | — |
| `MAP_MODIFIER_*` catalog unused vs `mapModifiers.ts` locals | **Unchanged** (`gameConstants.ts` L306–357 vs locals L124–148) | NEEDS HUMAN DECISION (dedupe vs keep catalog) | #443 touches `mapModifiers.ts` |
| `_CAMERA_*` / `_ENEMY_MOVEMENT_*` unused in `gameConstants`; WX locals | **Unchanged** + **NEW:** `CAMERA_SMOOTHING_FACTOR` also unused from catalog (WX L640 local) | SAFE TO REMOVE (catalog copies) | — |
| Unused barrel hooks (`useIsCallerAdmin`, `useAdminSetMapModifierChance`, `useSetBossPortalAssignment`, `useDokaAchievementTracker`, `useGetCharacter`, `useRenameCharacter`, `useBackendStatus`, `useSaveKillCount`) | **Unchanged** | SAFE TO REMOVE (exports) / keep if React Query surface desired | — |
| Unused shadcn `components/ui/*` except sonner + alert-dialog (+ `button` via alert-dialog) | **Unchanged** | NEEDS HUMAN DECISION (kit retention) | — |

---

## 2. NEW candidates (not in prior list)

### 2.1 Zero / test-only modules

| Path | Lines | Prod importers | Tests | Dynamic? | Generated? | Open PR | Class |
| :--- | ---: | :--- | :--- | :--- | :--- | :--- | :--- |
| `src/frontend/src/utils/longHorizonSim.ts` | ~586 | **0** | `longHorizonSim.test.ts` | No | No | **#475** extends sim | LEGACY BUT REQUIRED (balance/docs harness) |
| `src/frontend/src/engine/worldFeatures.ts` | ~1913 | **0** | `worldFeatures.test.ts` | No | No | **#454**, **#503** grow catalog | LEGACY BUT REQUIRED (design catalog; not wired to mapGen yet) |
| `src/frontend/src/engine/mapGen.simulate.ts` | ~1146 | **0** | solvability + several mapGen tests | No | No | **#436/#444/#484/#486/#494/#500** | LEGACY BUT REQUIRED (map integrity test harness) |

All other `components/*.tsx`, `utils/*.ts`, `engine/*.ts`, `hooks/*.ts` non-test files have ≥1 production importer **except** the prior orphans `BoostToggle.tsx` and `summonAI.ts`.

### 2.2 Unused exports (new / noteworthy)

| Symbol | Path:lines | Notes | Class |
| :--- | :--- | :--- | :--- |
| `getModifierDefinition` | `engine/mapModifiers.ts` L499–503 | Registry + `listAdminModifierTypeOptions` are live; this helper has **zero** callers | SAFE TO REMOVE (export) |
| `syncExpiredSummonsFromTurnQueue` | `engine/summonIntegration.ts` L146–171 | WX imports `buildSpellContext` / `getPlayerSideTargets` / `resolveEnemyApMp` only; lifespan uses `expireSummonsAtTurnStart` | NEEDS HUMAN DECISION (dead path vs future) |
| `CAMERA_SMOOTHING_FACTOR` (catalog) | `data/gameConstants.ts` L14 | Never imported; WX L640 local is live | SAFE TO REMOVE (catalog) or wire WX to import |
| `decide*Action` named exports (19) | `hooks/useBossAI.ts` | **Used internally** by `useBossAI` → WX; unused as *external* exports | LEGACY BUT REQUIRED (keep; un-export optional) |
| Always-`true` AI toggles | `data/gameConstants.ts` L224–292 | `AI_LETHAL_LOOKAHEAD_ENABLED`, `AI_OVERKILL_SPILL_ENABLED`, `AI_LOS_REPOSITION_ENABLED`, `AI_BACKLINE_PROTECT_ENABLED`, `AI_INTENT_LOG_ENABLED` — consumed by `enemyAI.ts`, never flipped | NEEDS HUMAN DECISION (keep as tunables vs inline) |

### 2.3 Duplicate constants (same name, 2+ files)

| Name | Locations | Class |
| :--- | :--- | :--- |
| `_CAMERA_DEADZONE` / `_CAMERA_MAX_OFFSET` / `_ENEMY_MOVEMENT_*` | `gameConstants.ts` L12–23; WX L638–643 | Both unused (underscore locals); SAFE TO REMOVE |
| `CAMERA_SMOOTHING_FACTOR` | `gameConstants.ts` L14; WX L640 (**live**) | Deduplicate: import from catalog |
| `VOID_RIFT_TICK` | `battleSetup.ts` L288; `mapModifiers.ts` L127 | Both `3`; comment says must match `MAP_MODIFIER_VOID_RIFT_DAMAGE` | NEEDS HUMAN DECISION |
| `PLAYER_BASE_AP` / `PLAYER_BASE_MP` | `gameConstants.ts` L131–132; `adminSafety.ts` L258–259 | Mirror values | NEEDS HUMAN DECISION |
| `BOSS_CONFIG_KEY` | `useAdminQueries.ts` L508; `useBossQueries.ts` L12 | Same `"pbv_boss_configs"` | SAFE TO REMOVE (dedupe to one) |
| `STORAGE_PREFIX` | `DraggablePanel.tsx` L23; `usePanelLayout.ts` L5 | Same `"pbv_panel_layout_"` | SAFE TO REMOVE (dedupe) |

### 2.4 Feature flags

| Pattern | Finding |
| :--- | :--- |
| `FEATURE_*` / `ENABLE_*` / `DEBUG_*` app flags | **None** that are unused always-false/true app feature gates |
| `VITE_USE_MOCK` | Live (`hooks/useActor.ts` L8) |
| `import.meta.env.DEV` / `NODE_ENV === "development"` | Live debug gates in WX / combatantStore / etc. |
| `AI_*_ENABLED = true` | See §2.2 — not obsolete, but never false |

### 2.5 Large commented-out implementations

No multi-line `//`-commented dead implementations found outside noise. Large `/* */` blocks are **file headers / JSDoc** (`summonIntegration`, `targeting`, `progression`, `debug/*`, etc.), not commented-out code.

WX L12797–12809 is a **prose comment** on Boss Rush persist ordering, not disabled code.

### 2.6 Unused CSS (`src/frontend/src/index.css`)

Dynamic: `StatPopup` builds `stone-stat-chip-${STAT_COLORS[key]}` with keys `violet|blue|green|amber|gold|crimson` (L12–18, L178). Hardcoded `stone-stat-chip-crimson` (L191). **Keep** those variants.

| Selector | Lines | Outside refs | Class |
| :--- | :--- | :--- | :--- |
| `.dungeon-grid` | L684–686, L715–717 | **0** (post-#286 editor delete) | SAFE TO REMOVE — queued **#339**, **#423**, **#469** |
| `.tool-button` (in media query) | L689 | **0** as className (sibling selectors still used) | SAFE TO REMOVE selector only — same PRs |
| `.animate-pulse-glow` | L627–629 | **0** | SAFE TO REMOVE |
| `.modal-backdrop` | L678–680 | **0** | SAFE TO REMOVE |
| `.glow-green` / `.glow-red` / `.glow-yellow` | L584–595 | **0** | SAFE TO REMOVE |
| `.text-shadow` | L576–578 | **0** | SAFE TO REMOVE |
| `.stone-pill-blue` / `.stone-pill-purple` | L565–570 | **0** (crimson/gold/green used) | SAFE TO REMOVE |
| `.stone-popup-animate` | L911+ | **0** | SAFE TO REMOVE |
| `.cursor-grab` / `.cursor-grabbing` / `.cursor-crosshair` | L730–740 | **0** as classNames (may be intentional utilities) | NEEDS HUMAN DECISION |
| `.stone-stat-chip-orange` / `-periwinkle` / `-lightslate` | L1021–1036 | **0** (not in `STAT_COLORS`) | SAFE TO REMOVE |

**Related bug/smell (not unused):** `StatPopup.tsx` L118/L232 uses `stone-pill-slate` but **no** `.stone-pill-slate` rule exists in `index.css`.

### 2.7 Root `frontend/` vs `src/frontend/`

| Path | Role | Class |
| :--- | :--- | :--- |
| `src/frontend/` | Live Vite package (`pnpm-workspace` `src/**/*`) | Required |
| Root `frontend/public/assets/` | 5 git-tracked Caffeine screenshot/generated PNGs | STALE GENERATED — do not delete without human asset decision |

### 2.8 Tracked `src/frontend/dist/`

Force-tracked hashed bundles (`git ls-files -v` → `H` assume-unchanged): e.g. `assets/index-xlu0ZP3Q.js`, `index-BHoDwDa8.css`, `AdminDashboard-IkVDM-7K.js`, fonts, JPEGs. `dist/` is gitignored but these paths remain indexed.

**Class:** STALE GENERATED — do not commit a new vite hash set; refresh only via intentional deploy artifact policy.

---

## 3. Components scan (`components/*.tsx`)

**Zero importers:** only `BoostToggle.tsx` (prior). All other top-level components are imported from `App` / `GameFlow` / WX / admin / each other.

---

## 4. Recommended human queue (no deletes this run)

1. Land or drop CSS cleanup PRs **#339 / #423 / #469** (same `.dungeon-grid` / `.tool-button` hunk); then consider §2.6 extras in a follow-up.
2. Wire vs drop: `BoostToggle` (blocked by #335/#471), `summonAI.ts`, `useShopQueries`, always-null `dungeon` prop + `useDungeonState` stub.
3. Wire vs keep-as-harness: `oneShotCredit`, `absoluteStatsClamp`, `worldFeatures` (await mapGen integration), `longHorizonSim`.
4. Dedupe camera constants: delete unused catalog `_CAMERA_*` / `_ENEMY_MOVEMENT_*` and import `CAMERA_SMOOTHING_FACTOR` into WX.
5. Do not delete shadcn kit or `src/frontend/dist` / root `frontend/public/assets` without an explicit policy PR.
