# Dead-code / unused-source audit — 2026-09-02

**Automation:** unused TypeScript/React (+ Motoko) reachability audit  
**HEAD inspected:** `58302bc` (`Merge pull request #258 from Mr-Melic/cursor/doka-gamekey-shop-46e6`)  
**Prior pass:** `docs/automation/DEAD_CODE_AUDIT_2026-09-01.md`  
**Method:** static + dynamic `import()` / `React.lazy` graph from `main.tsx`, `App.tsx`, all `*.test.ts(x)`, vite config, and package scripts. No files deleted.

Excluded from “unused module” candidates (as requested): `*.test.ts(x)`, generated `backend.ts` / `backend.d.ts` / `declarations/**`, and `main.tsx`.

---

## A) Files with ZERO importers (not even tests)

### App / engine (real dead modules)

| Path | Notes |
| :--- | :--- |
| `src/frontend/src/components/BoostToggle.tsx` | Zero static/dynamic importers. `App.tsx` still passes `boostMode` / `onBoostToggle` into `GameFlow`; `GameFlow` discards them (`_boostMode` / `_onBoostToggle`). Live reward math uses `WorldExploration`’s own `boostMode` (setter unused → always `"xp"`). **Human decision:** wire pill vs delete feature UI + App/GameFlow props. Not dynamic. |
| `src/frontend/src/engine/summonAI.ts` | Zero importers. Exports `runSummonAI` / `SummonAIKind`. Live summon turns use `enemyAI.ts` + `summonExecutor.ts`. Comments in `enemyAI.ts` / `summonIntegration.ts` / `gameConstants.ts` already mark this unused. **Human decision:** wire vs delete. Not dynamic. |

### Unused shadcn kit — zero importers

These are scaffold-only; catalogued in `src/frontend/src/ui-summary.json` / `src/frontend/components.json`. Not referenced by game UI.

- `src/frontend/src/components/ui/accordion.tsx`
- `src/frontend/src/components/ui/alert.tsx`
- `src/frontend/src/components/ui/aspect-ratio.tsx`
- `src/frontend/src/components/ui/avatar.tsx`
- `src/frontend/src/components/ui/badge.tsx`
- `src/frontend/src/components/ui/breadcrumb.tsx`
- `src/frontend/src/components/ui/calendar.tsx`
- `src/frontend/src/components/ui/card.tsx`
- `src/frontend/src/components/ui/carousel.tsx`
- `src/frontend/src/components/ui/chart.tsx`
- `src/frontend/src/components/ui/checkbox.tsx`
- `src/frontend/src/components/ui/collapsible.tsx`
- `src/frontend/src/components/ui/command.tsx`
- `src/frontend/src/components/ui/context-menu.tsx`
- `src/frontend/src/components/ui/drawer.tsx`
- `src/frontend/src/components/ui/dropdown-menu.tsx`
- `src/frontend/src/components/ui/form.tsx`
- `src/frontend/src/components/ui/hover-card.tsx`
- `src/frontend/src/components/ui/input-otp.tsx`
- `src/frontend/src/components/ui/menubar.tsx`
- `src/frontend/src/components/ui/navigation-menu.tsx`
- `src/frontend/src/components/ui/pagination.tsx`
- `src/frontend/src/components/ui/popover.tsx`
- `src/frontend/src/components/ui/progress.tsx`
- `src/frontend/src/components/ui/radio-group.tsx`
- `src/frontend/src/components/ui/resizable.tsx`
- `src/frontend/src/components/ui/scroll-area.tsx`
- `src/frontend/src/components/ui/select.tsx`
- `src/frontend/src/components/ui/sidebar.tsx` (only consumer of several peers below; itself never imported)
- `src/frontend/src/components/ui/slider.tsx`
- `src/frontend/src/components/ui/switch.tsx`
- `src/frontend/src/components/ui/table.tsx`
- `src/frontend/src/components/ui/tabs.tsx`
- `src/frontend/src/components/ui/textarea.tsx`
- `src/frontend/src/components/ui/toggle-group.tsx`

**Count:** 2 app/engine + 35 ui = **37** zero-importer modules.

### Related: imported only by unused UI (not in A, but entry-unreachable)

These have importers, but only from other unused `ui/*` (or dead `sidebar` / `command` / `toggle-group`). Unreachable from `main`/`App`:

| Path | Only imported by |
| :--- | :--- |
| `src/frontend/src/components/ui/dialog.tsx` | `command.tsx` |
| `src/frontend/src/components/ui/input.tsx` | `sidebar.tsx` |
| `src/frontend/src/components/ui/label.tsx` | `form.tsx` |
| `src/frontend/src/components/ui/separator.tsx` | `sidebar.tsx` |
| `src/frontend/src/components/ui/sheet.tsx` | `sidebar.tsx` |
| `src/frontend/src/components/ui/skeleton.tsx` | `sidebar.tsx` |
| `src/frontend/src/components/ui/toggle.tsx` | `toggle-group.tsx` |
| `src/frontend/src/components/ui/tooltip.tsx` | `sidebar.tsx` |

### Live shadcn (do not treat as unused)

| Path | Why live |
| :--- | :--- |
| `src/frontend/src/components/ui/sonner.tsx` | `App.tsx` → `<Toaster />` |
| `src/frontend/src/components/ui/alert-dialog.tsx` | `CharacterSelection.tsx`, `GameOverModal.tsx` |
| `src/frontend/src/components/ui/button.tsx` | Transitively via `alert-dialog` (`buttonVariants`) |
| `src/frontend/src/lib/utils.ts` | `cn()` used by live `button` / `alert-dialog` / `sonner` chain |

---

## B) Files imported only by their own tests

| Path | Test importer | Role / caveat |
| :--- | :--- | :--- |
| `src/frontend/src/hooks/useDungeonState.ts` | `hooks/useDungeonState.test.ts` | `getDungeonMultiplier` tested; `useDungeonState` is a stub `() => ({})`. Duplicated multiplier tables also live in `portalRules.ts` / `WorldExploration`. **Keep table or extract; do not delete without dedupe plan.** |
| `src/frontend/src/utils/oneShotCredit.ts` | `utils/oneShotCredit.test.ts` | Proposed one-shot claim helper. Production pickups use `utils/dokaPersist.ts` (`WorldExploration` imports dokaPersist). **Wire vs delete.** |
| `src/frontend/src/utils/absoluteStatsClamp.ts` | `utils/absoluteStatsClamp.test.ts` | Intended `clampSaveBattleStatsWrite` guard before `saveBattleStats`. Not wired in production path. **Wire vs delete.** |
| `src/frontend/src/utils/longHorizonSim.ts` | `utils/longHorizonSim.test.ts` | Balance / observation harness. File header documents CLI: `node --experimental-strip-types …/longHorizonSim.ts`. **Dev tool — keep.** |
| `src/frontend/src/engine/mapGen.simulate.ts` | `engine/mapGen.solvability.test.ts` | Solvability simulation helper for tests. **Keep.** |
| `src/frontend/src/engine/worldFeatures.ts` | `engine/worldFeatures.test.ts` | Contract covered by tests + `docs/WORLD_DYNAMICS.md`. **Keep.** |

---

## C) Component files never rendered (type-only / unused default)

| Path | Verdict |
| :--- | :--- |
| `src/frontend/src/components/InitiativeStrip.tsx` | **Default UI never mounted** (`<InitiativeStrip` JSX: none). File is still required: exports `CombatantEntry`, imported (mostly `import type`) by `BattleUIPanel`, `WorldExploration`, `castHelpers`, `combatantStore`, `mapModifiers`, `summonIntegration`, `summonSpawn`, `turnQueue`, plus tests. `castHelpers.ts` uses a value import of the type module. **Human decision:** extract `CombatantEntry` to `types/`, then delete strip UI. |
| `src/frontend/src/components/BoostToggle.tsx` | See **A** — never rendered, never imported. |

No other feature components were found imported-only-as-types with an unused default export.

### Special attention — live (not unused)

| Path | Status |
| :--- | :--- |
| `src/frontend/src/components/DokaGameKeyShop.tsx` | **Live.** Imported and rendered by `WorldExploration.tsx`. |
| `src/frontend/src/components/AdminGameKeyPurchases.tsx` | **Live.** Imported and rendered by `AdminDashboard.tsx` (`tab === "purchases"`). |
| Dynamic entry | Only `React.lazy(() => import("./components/AdminDashboard"))` in `App.tsx`. No other lazy/dynamic component graph edges. |

### Already removed leftovers (absent from tree)

| Name | Status |
| :--- | :--- |
| `SpellFooter.tsx` | Removed in 2026-09-01 audit. No source file; docs-only mentions. |
| `StatMeters.tsx` | Removed in 2026-08-31 audit. Absent. |
| `SmallScreenWarning.tsx` | Removed; `App.tsx` inlines `SmallScreenGuard` + `pbv_small_screen_continue`. |
| Dungeon editor | Absent. `GameFlow` still passes `dungeon={dungeonData}` (always null-ish after editor removal); WX binds `_dungeon`. Interface leftover, not a file. |

---

## D) Hooks never called

### File-level

| Path | Verdict |
| :--- | :--- |
| `src/frontend/src/hooks/useDungeonState.ts` | **Only tests** (see B). Hook export is a stub. |
| `src/frontend/src/hooks/useBossSystem.ts` | **Live — not unused.** No `useBossSystem()` hook remains; WX / `useBossAI` call named exports (`initBossState`, `checkPhaseTransition`, `applyBossAbility`, `cleanupBossState`). |
| `src/frontend/src/hooks/use-mobile.tsx` | **Live.** `useIsMobile` + `readSafeAreaInsetTopPx` called from `WorldExploration`. Also imported by unused `ui/sidebar.tsx`. |

### Symbol-level (file is imported via barrel / peers; symbol never invoked)

Barrel: `hooks/useQueries.ts` re-exports admin/character/shop/boss/leaderboard hooks. Several exports are never called anywhere (including Admin / WX):

From `useAdminQueries.ts` (re-exported, never called):

- `useIsCallerAdmin`
- `useAdminSetMapModifierChance`
- `useSetBossPortalAssignment`
- `useDokaAchievementTracker`

From `useCharacterQueries.ts`:

- `useGetCharacter`
- `useRenameCharacter`
- `useBackendStatus`

From `useShopQueries.ts`:

- `useGetShopPackages`
- `useInitiatePurchase`
- `useGetPurchaseRecords`

From `useLeaderboardQueries.ts`:

- `useSaveKillCount`

From `usePanelLayout.ts`:

- `usePanelLayout` **function** never called; `DraggablePanel` imports types/constants (`UiLayoutActor`, `BACKEND_SAVE_DEBOUNCE_MS`) only. File is live for those symbols.

---

## E) Engine files never imported

| Path | Class |
| :--- | :--- |
| `src/frontend/src/engine/summonAI.ts` | **Zero importers** (see A) |
| `src/frontend/src/engine/mapGen.simulate.ts` | **Tests only** (see B) |
| `src/frontend/src/engine/worldFeatures.ts` | **Tests only** (see B) |

All other `engine/*.ts` modules are reachable from entry and/or production importers.

---

## Motoko — not imported by `main.mo` (or migration chain)

Reachability: `src/backend/main.mo` + `src/backend/migrations/*.mo`.

### Unreachable from `main.mo` / migrations

| Path | Notes |
| :--- | :--- |
| `src/backend/mixins/admin-api.mo` | Scaffold mixin; not `include`d by live actor. Imports `lib/admin` + `types/admin`. **Future split / human decision.** |
| `src/backend/mixins/types-api.mo` | Scaffold; pulls `types/common` + `lib/types`. Unused by live actor. |
| `src/backend/lib/types.mo` | Only imported by unused `mixins/types-api.mo`. Re-exports `types/common`. |
| `src/backend/types/common.mo` | Combat `EnemyConfig` template. Live `main.mo` inlines its own `EnemyConfig`. Only reached via unused lib/mixin chain. **Do not delete without confirming no dfx/docs dependency.** |
| `src/backend/types/chat.mo` | `ChatMessage` module. **Zero Motoko importers.** `main.mo` and migrations inline `ChatMessage`. |
| `src/backend/BaseToCore.mo` | Completed mo:base→mo:core marker (`AGENTS.md`). Not imported. **Keep as docs/migration marker.** |
| `src/backend/system-idl/aaaaa-aa.did` | Not Motoko; not imported by current `main.mo`. Keep until Caffeine/mops need proven. |

### Reachable (for contrast)

- `src/backend/main.mo`
- `src/backend/types/admin.mo`
- `src/backend/lib/admin.mo`
- `src/backend/lib/adminGuard.mo`
- `src/backend/lib/gameKey.mo`
- `src/backend/migrations/20260826_000000.mo`
- `src/backend/migrations/20260827_000000.mo`
- `src/backend/migrations/20260831_000000.mo`

### Outside `src/backend` (deployment leftover — not deleted)

- Repo-root `backend_extended/` (stale 15-field actor). `dfx.json` still points at missing `src/backend_extended/main.mo`. Canonical actor: `src/backend/main.mo`.

---

## Attention checklist (requested names)

| Item | Result |
| :--- | :--- |
| `BoostToggle.tsx` | **A — zero importers.** App→GameFlow props discarded. |
| `InitiativeStrip.tsx` | **C — never rendered;** keep for `CombatantEntry`. |
| `summonAI.ts` | **A / E — zero importers.** Live path = `enemyAI`. |
| `oneShotCredit.ts` | **B — tests only.** Prod = `dokaPersist.ts`. |
| `absoluteStatsClamp.ts` | **B — tests only.** Not wired to `saveBattleStats`. |
| `useBossSystem.ts` | **Live** named functions; no unused hook wrapper. |
| `useDungeonState.ts` | **B — tests only** (+ stub hook). |
| `use-mobile.tsx` | **Live** in WX. |
| `components/ui/*` | **35 zero-importer + 8 entry-unreachable peers;** live: `sonner`, `alert-dialog`, `button`. |
| `DokaGameKeyShop` / `AdminGameKeyPurchases` | **Live** (new GameKey shop). |
| SpellFooter / StatMeters / SmallScreenWarning / dungeon editor | **Already gone** as files; SmallScreen inlined; dungeon prop always unused. |

---

## Dynamic / generated / migration / docs flags

| Kind | Items |
| :--- | :--- |
| Dynamic `import()` / lazy | Only `AdminDashboard` lazy in `App.tsx`. No hidden refs to BoostToggle / summonAI / oneShotCredit. |
| Generated | `backend.ts`, `backend.d.ts`, `src/frontend/src/declarations/**` — excluded. |
| Migrations | `src/backend/migrations/*` — required; not unused. |
| Docs / markers | `BaseToCore.mo`, `worldFeatures.ts` + WORLD_DYNAMICS, prior audit docs mentioning SpellFooter. |
| Dev / CLI | `longHorizonSim.ts`, `mapGen.simulate.ts`. |
| Deployment | `system-idl/aaaaa-aa.did`, root `backend_extended/`, `dfx.json` mis-path. |
| shadcn catalog | `src/frontend/src/ui-summary.json`, `src/frontend/components.json` — intentional unused kit. |

---

## Not recommended to delete without a human decision

1. `InitiativeStrip.tsx` (owns `CombatantEntry`)
2. `useDungeonState.ts` / multiplier table (dedupe first)
3. `summonAI.ts`, `BoostToggle.tsx` (wire-vs-drop)
4. `oneShotCredit.ts`, `absoluteStatsClamp.ts` (wire-vs-drop)
5. Unused shadcn kit (catalog / Caffeine)
6. Motoko mixins / `types/common.mo` / `types/chat.mo` / `BaseToCore.mo` / `system-idl`
7. `backend_extended/` + dfx retarget
8. Test-only helpers `mapGen.simulate.ts`, `worldFeatures.ts`, `longHorizonSim.ts`
