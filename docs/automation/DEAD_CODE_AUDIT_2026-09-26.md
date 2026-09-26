# Dead-code audit — 2026-09-26

**HEAD:** `0f5363f` (unchanged since 2026-09-21…09-25 audits)  
**Scope:** static `import` / `import()` / `@/` under `src/frontend/src`  
**Gameplay / RAF / mapGen / turn / damage:** not modified.

## Zero production importers (candidates)

| Path | Barrel? | Tests? | Dynamic / guess |
| :--- | :--- | :--- | :--- |
| `components/BoostToggle.tsx` | no | no | App→GameFlow still passes `onBoostToggle` / boost props; component never mounted. Keep (open PRs #335/#471). |
| `engine/summonAI.ts` | no | no | `runSummonAI` never called; live summons use `enemyAI` / `summonExecutor`. Field name `summonAI` is live Candid/metadata. |
| `engine/worldFeatures.ts` | no | yes | Catalog for World Dynamics; docs contract; not wired into WX. |
| `hooks/useDungeonState.ts` | no | yes | Stub `useDungeonState`; only `getDungeonMultiplier` tested; WX uses `portalRules.dungeonDokaMultiplierFor`. |
| `utils/oneShotCredit.ts` | no | yes | Parallel to live `dokaPersist.ts` one-shot helpers; not wired. |
| `utils/absoluteStatsClamp.ts` | no | yes | Intended `saveBattleStats` mint clamp; not wired. |
| `utils/longHorizonSim.ts` | no | yes | CLI balance sim (`node --experimental-strip-types …`). |
| `engine/mapGen.simulate.ts` | no | yes | Solvability harness only (`mapGen.solvability.test.ts`). |
| `components/ui/*` (orphans) | no | no | shadcn kit. Keep. Live UI: `sonner`, `alert-dialog` (+ transitive `button`). |

## Named confirm list (non-test importers?)

| Module | Non-test importers? |
| :--- | :--- |
| `engine/battleWalkMp.ts` | **yes** — WX, `walkRejectCopy` |
| `engine/canvasLoopActivity.ts` | **yes** — BloodParticles, LandingPage |
| `engine/enemyWalkMp.ts` | **yes** — WX, enemyAI |
| `engine/playerCastPlan.ts` | **yes** — WX |
| `engine/spawnPolicy.ts` | **yes** — WX |
| `utils/challengeHudVisibility.ts` | **yes** — ChallengePanel |
| `utils/enemyRegisterCopy.ts` | **yes** — EnemyRegister |
| `utils/legacyPurchaseCredit.ts` | **yes** — shopPurchase |
| `utils/shopDialogDismiss.ts` | **yes** — DokaGameKeyShop |
| `utils/startingChampionStats.ts` | **yes** — CharacterCreation |
| `utils/victoryAchievements.ts` | **yes** — WX |
| `utils/oneShotCredit.ts` | **no** (tests only) |
| `utils/absoluteStatsClamp.ts` | **no** (tests only) |
| `engine/worldFeatures.ts` | **no** (tests only) |
| `utils/longHorizonSim.ts` | **no** (tests only) |
| `engine/mapGen.simulate.ts` | **no** (tests only) |
| `utils/debugLogger.ts` | **yes** — re-export shim; many engine/UI sites |
| `hooks/useDungeonState.ts` | **no** (tests only) |
| `components/InitiativeStrip.tsx` | **yes** — type-only (`CombatantEntry`); default UI never mounted |
| `components/CharacterCreation.tsx` | **yes** — GameFlow |
| `components/BoostToggle.tsx` | **no** |
| `engine/summonAI.ts` | **no** |

## Unused named exports (barrel / catalog)

Re-exported via `hooks/useQueries.ts` (`export *`) with **zero** call sites outside defining file:

- Shop: `useGetShopPackages`, `useInitiatePurchase`, `useGetPurchaseRecords`
- Character: `useGetCharacter`, `useRenameCharacter`, `useBackendStatus`
- Admin: `useIsCallerAdmin`, `useAdminSetMapModifierChance`, `useSetBossPortalAssignment`, `useDokaAchievementTracker`, `CheckAchievementFn`
- Leaderboard: `useSaveKillCount`, `LeaderboardEntry` (type)

No `engine/index.ts` barrel. Other zero-callsite named exports (not via barrel): `DEFAULT_GAME_CONFIG`, `ENEMY_AI_TIER_GATES` (comment-only hits), `getModifierDefinition`, camera/`_ENEMY_MOVEMENT_*` catalog in `gameConstants` (WX redeclares locals), `MAP_MODIFIER_*` catalog constants.

## Feature flags

| Flag | Status |
| :--- | :--- |
| `VITE_USE_MOCK` | **Live** — `hooks/useActor.ts` |
| `import.meta.env.DEV` / `NODE_ENV === "development"` | **Live** — debug gates |
| `FEATURE_*` env flags | **None** (only `FEATURE_BY_ID` map in unused `worldFeatures.ts`) |
| `ENABLE_*` env flags | **None** |
| Other unused `VITE_*` | **None** found |
| `AI_*_ENABLED` constants | **Live** master toggles (all `true`) in `gameConstants` → `enemyAI` |

## Do-not-delete (confirmed zero prod importers)

- `BoostToggle.tsx` — zero importers; keep
- `summonAI.ts` — zero importers; keep
- `components/ui/*` orphans — keep shadcn kit
