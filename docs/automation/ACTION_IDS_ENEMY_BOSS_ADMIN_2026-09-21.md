# ACTION_IDs — 2026-09-21 Enemy & Boss Admin Content Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Enemy & Boss Admin Content Designer.  
Prior contract: [`ENEMY_BOSS_ADMIN_DESIGN_2026-08-31.md`](./ENEMY_BOSS_ADMIN_DESIGN_2026-08-31.md).  
Re-audit: [`ENEMY_BOSS_ADMIN_REAUDIT_2026-09-21.md`](./ENEMY_BOSS_ADMIN_REAUDIT_2026-09-21.md).  
Verified against `origin/main` @ `0f5363f`.

**Do not re-file** `EBA-2026-08-31-001` … `024`, `EBA-2026-09-01-001` … `006`, or `EBA-2026-09-02-001` … `002`. Those remain OPEN (09-01-006 copy is PARTIAL; 09-02 IDs are on `main`). This file is **new gaps only**.  
Do not implement gameplay from this file unless a later human or orchestrator picks an ID. This run ships **docs only**.

Sibling IDs to consume, not duplicate: `SDA-*`, `VAL-*`, `AFDA-2026-08-31-002` / `011`, `WDEAD-*` (including the spawnPolicy extract path), `AEE-*`, Enemy Elite Evolution, Enemy Formations / EBMA.

---

ACTION_ID: EBA-2026-09-21-001  
SOURCE_AUTOMATION: Enemy & Boss Admin Content Designer  
TITLE: Drive EnemyDefinition spawn through spawnPolicy.ts — do not re-inline the hardcoded roster into WorldExploration  
CATEGORY: schema-spawn  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: The 2026-09-02 EBA re-audit verified `origin/main` @ `58302bc`, where `src/frontend/src/engine/spawnPolicy.ts` did not exist (`generateEnemies` still owned family 30% / dungeon extras inline). Commit `7fd4013` (2026-09-02 00:15 UTC, after that SHA) extracted the live roster into `spawnPolicy.ts`: `FAMILY_TYPES` (49–57), `FAMILY_VARIANT_CHANCE = 0.3` (35), `FAMILY_STAT_MULTS` (69–129; comment 64–65: catalog `ap`/`mp` unused), `DUNGEON_EXTRA_ENEMIES` / `DUNGEON_TIER_BOOST` / `DUNGEON_SPAWN_DEPTH_CAP = 5` (26–29), `dungeonSpawnExtras` `Math.min(dungeonDepth, DUNGEON_SPAWN_DEPTH_CAP)` (140–148), `rollOverworldEnemyCount` (155–160), `dungeonScaledEnemyLevel` (162–169), `applyFamilyVariantsToRoster` (289–297). `generateEnemies` (`WorldExploration.tsx` 5711–5872) now calls those helpers, then `pickEnemyLevelFromTiers` (5770–5772) — it still never reads `getEnemyConfigs`. `spawnPolicy.test.ts` 63–85 locks “depth 99 clamps to depth 5 extras”; 109–117 tests `dungeonScaledEnemyLevel` as a relative add (`12 + 2*10 = 32`). WDEAD named `engine/spawnPolicy.ts` as an extract path before the file existed; the extract landed as **hardcoded families**, not admin-driven packs. EBA-2026-08-31-001 / 007 / 008 / 022 still list `generateEnemies` / `spawnFormations.ts` / `enemyDefinition.ts` and do not name this module. Product rule: Stralt has no character level cap. `DUNGEON_SPAWN_DEPTH_CAP` is dungeon-chain length (AGENTS.md extras `[0,2,3,4,4,5]`), not a career ceiling. `dungeonScaledEnemyLevel` is already relative — keep it. Visual scale 0.6–1.4 (`generateEnemyScaleFactors` 227–256) is draw-only (VAL-008).  
SYSTEMS_AFFECTED: `src/frontend/src/engine/spawnPolicy.ts` (+ `spawnPolicy.test.ts`); `WorldExploration.tsx` `generateEnemies` call sites only; future `engine/enemyDefinition.ts` eligibility → spawnPolicy; Admin EnemyDefinition activate path (EBA-001/005). Do not retune `pickEnemyLevelFromTiers` here (EBA-003). Do not retune region `levelMax` (WDEAD).  
RECOMMENDED_ACTION: When EBA-2026-08-31-001 lands, load **active** `EnemyDefinition` rows through `spawnPolicy` (eligibility, family/role, variant weights, dungeon/overworld/Boss-Rush tags, formation ids, elite chance). Keep today’s chess + 30% family overlay as the explicit empty-active fallback (logged once per map). Do not copy `FAMILY_TYPES` / `FAMILY_VARIANT_CHANCE` back into WorldExploration. Do not treat `DUNGEON_SPAWN_DEPTH_CAP = 5` as a player or enemy level max; do not raise it to “unbounded.” Keep `dungeonScaledEnemyLevel` as offset = `boost * tierSize`. Preview/validate owner-typed player levels 1, 80, 800, 8000, 10000 against the policy, not against `levelMin`/`levelMax`. Occupancy / keep-clear metrics stay as documented in the file header (do not merge Manhattan 2 / Chebyshev 3 / Chebyshev 4). Consume WDEAD for world-event packs; this ID is the enemy/boss definition bind.  
AUTONOMY: HUMAN_APPROVE — persist shape + spawn wiring. Extract-only refactors that keep the hardcoded tables are already done (`7fd4013`); do not ship a second copy.  
DEPENDENCIES: EBA-2026-08-31-001; EBA-2026-08-31-002; EBA-2026-08-31-007; EBA-2026-08-31-008; EBA-2026-08-31-022; EBA-2026-09-02-001 (do not keep `levelMax = 9999` as eligibility); WDEAD spawnPolicy extract path (consume)  
REGRESSION_RISK: HIGH if empty active set is treated as zero enemies (silent empty maps). HIGH if implementers edit only `generateEnemies` and leave `FAMILY_VARIANT_CHANCE` live. MEDIUM if dungeon depth 5 is copied onto RelativeEligibility as a fake character cap.  
VALIDATION_REQUIRED: With zero active definitions, a new overworld map still spawns 1–8 chess enemies and the 30% family overlay. After activating one overworld-tagged definition, spawn logs that id and `FAMILY_TYPES` is not the only roster. `dungeonScaledEnemyLevel` at player/enemy level 10000 is still `base + boost * tierSize` with no 999/9999 clamp in this module. `spawnPolicy.test.ts` still distinguishes the three distance metrics. `pnpm typecheck`; do not edit RAF / mapGen / damage math.  
STATUS: NEW  
