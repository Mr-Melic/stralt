# Enemy & Boss Admin — 2026-09-22 re-audit

**Author:** Enemy & Boss Admin Content Designer  
**Automation:** `299b70f5-a498-11f1-a7d1-d6b4613131ce`  
**Verified against:** `origin/main` @ `0f5363f` (merge of PR #332; **same SHA as the 2026-09-21 EBA re-audit**)  
**Prior contract:** [`ENEMY_BOSS_ADMIN_DESIGN_2026-08-31.md`](./ENEMY_BOSS_ADMIN_DESIGN_2026-08-31.md) (merged as [#146](https://github.com/Mr-Melic/stralt/pull/146))  
**Prior ledgers on `main`:** [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-08-31.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-08-31.md) (`EBA-2026-08-31-001` … `024`); [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-01.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-01.md) (`EBA-2026-09-01-001` … `006`); [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-02.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-02.md) (`EBA-2026-09-02-001` … `002`)  
**Prior ledger not yet on `main`:** [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-21.md`](https://github.com/Mr-Melic/stralt/pull/360) (`EBA-2026-09-21-001`) on open draft PR [#360](https://github.com/Mr-Melic/stralt/pull/360)  
**This run:** documentation only. No production, RAF, map generation, turn, or damage-math code. This PR does **not** edit the 08-31 contract file (PR #360 owns that 09-21 pointer).

Stralt has **no character level cap**. Do not add a final maximum level. Prefer relative offsets, probability curves, eligibility thresholds, and scalable formulas. Do not raise `9999` → `99999` or `99` → `999`.

---

## 0. Verdict

`origin/main` has not moved since the 2026-09-21 EBA re-audit (`0f5363f`). Every live spawn/admin site cited there still matches. The 2026-08-31 design remains the owner-studio contract.

**None of EBA-2026-08-31-001–024 shipped as gameplay.** There is still no `EnemyDefinition` / `BossDefinition`, no draft→validate→preview→activate path, no authored AI, no variants, no kit/discovery chips, and no visual mode `none|asset|pool`.

**No new ACTION_IDs this run.** Do not re-file `EBA-2026-08-31-*`, `EBA-2026-09-01-*`, `EBA-2026-09-02-*`, or `EBA-2026-09-21-001` (still covered by open PR #360). Consume `SDA-*`, `VAL-*`, `AFDA-002` / `011`, `WDEAD-*`, `AEE-*`, Enemy Elite Evolution, Enemy Formations / EBMA.

Open-PR queue at audit time (oldest `createdAt` first, truncated): [#327](https://github.com/Mr-Melic/stralt/pull/327), [#331](https://github.com/Mr-Melic/stralt/pull/331), then the 2026-09-21 automation wave [#333](https://github.com/Mr-Melic/stralt/pull/333)–[#391](https://github.com/Mr-Melic/stralt/pull/391), plus [#392](https://github.com/Mr-Melic/stralt/pull/392) (perf docs, 2026-09-22). This run adds unique `docs/automation/*2026-09-22*` files only so it stays merge-clean after older siblings, including #360.

---

## 1. What still drives live encounters (re-verified)

| Surface | Still true on `0f5363f` | Prior ID |
| :--- | :--- | :--- |
| Admin `EnemyConfig` CRUD | `adminSetEnemyConfig` (`main.mo` 781–795) + `useGetEnemyConfigs`. `generateEnemies` (`WorldExploration.tsx` 5711–5872) never reads those rows. Enemies tab CatalogNote admits this (`AdminDashboard.tsx` 2117–2122). Save is still immediate. | EBA-001, 005 |
| Spawn roster | Chess piece + `pickEnemyLevelFromTiers` + placeholder `level*8+20` HP (5831–5832) + `computeEnemyStats`, then `applyFamilyVariantsToRoster` (5864–5866). Tables live in `spawnPolicy.ts`. | EBA-001, 007, 008; **EBA-2026-09-21-001** (PR #360) |
| Closed level bands | `newEnemy()` / `newRegion()` default `levelMax` to **9999** (`AdminDashboard.tsx` 138–157). Editor Level Min/Max (799–813) with `ELIGIBILITY_BAND_HINT` (248–249). List chips `Lv min–max` (2223–2224). `AdminGuard` **requires** the closed band (`adminGuard.mo` 273–277, 297–301). Caffeine mock still seeds `levelMax: BigInt(5)` (`mocks/backend.ts` 62–80) — sample content, not a product cap. | EBA-002; 09-01-001; 09-02-001 |
| Hidden 999 cap | `combatMath.ts` 58: `maxTier = Math.floor(999 / ts)`. | EBA-003 |
| Boss source | `useBossQueries.ts` 1–21 and portal entry (`WorldExploration.tsx` 6486–6489) read `pbv_boss_configs`. `getAllBossConfigs` unused by gameplay. `useSetBossConfig` / `useDeleteBossConfig` (`useAdminQueries.ts` 528–557) still write localStorage. | EBA-004; AFDA-002 |
| Boss catalogue | Editor filters `BOSS_IDS` only (`AdminDashboard.tsx` 7804; 19 ids in `bossTypes.ts` 390–410). Motoko seeds **12** (`admin.mo` 349–551). WX still comments “Pick a random boss from the 12” while using `BOSS_IDS.length` (4899–4901). | EBA-014 |
| Boss scaling | Spawn `level + 5` and `Math.min(50, res/sp)` (`WorldExploration.tsx` 6537, 6559–6560). `getBossEffectiveStats` is Boss Guide + `longHorizonSim` only. | EBA-011 |
| Kit zone NaN | `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920). `levelZone` is `{ name, minLevel, maxLevel }` (592, 4683–4687). `Math.floor(object)` → zone-0 kits. Comment at 11915 still says “10 random spells.” | EBA-013 |
| AI inference | `inferArchetype` (`enemyAI.ts` 447–477): healer from heal flags, flanker from `pieceType === "knight"`, berserker from `family.includes("berserk")`. `inferSummonArchetype` name-matches wolf/golem/wisp (202–225). | EBA-009; consume AEE |
| Boss Rush | `placeBossRushSpawns` / `applyFinalizedLayout` (5300–5315) then 100-HP placeholders with `pieceType: roomDef.boss1Name` (5321–5343). Room 9 still `weeping_pawn_2` (`useBossRush.ts` 127). CatalogNote admits live rooms come from `BOSS_RUSH_ROOMS` (`AdminDashboard.tsx` 7141–7146). | EBA-015 |
| Portal assignments | Canister `setBossPortalAssignment` exists. Frontend `useSetBossPortalAssignment` is a no-op invalidate (`useAdminQueries.ts` 559–574). World picks a random `BOSS_IDS` entry. | EBA-023 |
| Hard delete | `adminDeleteEnemyConfig` is `Map.remove` (`main.mo` 798–805). Bosses tab holds unused `_deleteBossConfig` (`AdminDashboard.tsx` 7754). Canister `deleteBossConfig` still portal-assignment only (2988–3004). | EBA-021; 09-01-003 |
| Player catalog | `EnemyRegister.tsx` 28+ still hardcodes `MONSTERS` / `BOSSES`. Honesty chrome: `utils/enemyRegisterCopy.ts`. | EBA-024 copy **PARTIAL** |
| Engine extract | No `engine/enemyDefinition.ts`, `bossDefinition.ts`, `contentValidate.ts`, `encounterPreview.ts`, `spawnFormations.ts`, or `enemyKitResolve.ts`. `spawnPolicy.ts` exists (09-21-001 bind site). | EBA-022; 09-21-001 |
| Presets | `EnemyPresets` is browser `localStorage` (`AdminDashboard.tsx` 555–584), max 10 snapshots, not canister clones. | EBA-018 |

Immediate Save is still live. Boss Save still writes localStorage. Toast at 7780 is honest; header 7837–7839 still says a “draft” **and** that changes apply on this browser’s next encounter (**09-01-002 OPEN**).

---

## 2. Additional evidence (not a new ID)

`generateEnemies` `tryPlaceEnemy` still calls `computeEnemyStats(enemyLevel, pieceType, …)` (`WorldExploration.tsx` 5834–5838) where `pieceType` is the **player** chess piece (`character?.pieceType || "king"` at 3694; hook deps at 5871). The spawned unit stores `pieceType: randomPieceType` (5812). Battle start reseeds with `e.pieceType` (11873). `getEnemyBaseStats` returns only `{ sp, sr, init, res, chc }` (`progression.ts` 148–155), so overworld init/res/sp/chc follow the **player** piece until combat. When EBA-001 / 09-21-001 bind `EnemyDefinition.pieceType` through `spawnPolicy`, pass the **unit** piece — do not keep the WorldExploration player closure. Do not retune damage math. This is implementer evidence for EBA-001 / EBA-022, not a new ACTION_ID.

`DUNGEON_SPAWN_DEPTH_CAP = 5` (`spawnPolicy.ts` 29, `dungeonSpawnExtras` 140–148) is dungeon-chain length. `dungeonScaledEnemyLevel` (162–169) is already a relative add. Do not copy the depth cap onto `RelativeEligibility`. Visual scale 0.6–1.4 (`generateEnemyScaleFactors` 227–256) is draw-only (VAL-008).

AP/MP ≤ 20 remains a **combat-budget** clamp (`adminGuard.mo` 270–271). `initStat > 100` (272) and enemy HP 1–100000 (267–268) are document-size rails. `summonUnitDef.level > 99` is Motoko `adminGuard.mo` 441–442 **and** `adminSafety.ts` 638–640; `getSummonBaseStats` (`progression.ts` 218–244) scales from spellLevel + hpScale, not `unitDef.level` (**09-02-002 OPEN**). Do not raise 99 → 999.

Tiers tab `SAMPLE_LEVELS = [1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877) — consume WDEAD. Death Realm fallbacks still stamp `maxLevel: 5` (`WorldExploration.tsx` 13514, 13646) vs entry `9999` (5439). HUD prints `minLevel–maxLevel` with fallback 9999 (18624–18625). Consume WDEAD; do not “fix” kit width by reading that object (EBA-013).

`computeAITier` still bands through 900 then a flat tier 10 (`combatMath.ts` 36–47). Sophistication may plateau; **rolled enemy level must not** (EBA-003). Mixin `admin-api.mo` is still dead; `AdminLib.setEnemyConfig` (`admin.mo` 8–14) still writes with no `AdminGuard` (**09-01-005 OPEN**). `longHorizonSim` still has a private `buildEnemyKit` (54–79) (**09-01-004 OPEN**).

---

## 3. Status of prior EBA IDs

### EBA-2026-08-31-001 … 024 — all **OPEN**

| ID | Priority | Status |
| :--- | :--- | :--- |
| 001 Unify EnemyDefinition + drive spawn | P0 | OPEN — bind site is `spawnPolicy.ts` (09-21-001) |
| 002 Replace levelMin/levelMax with relative eligibility | P0 | OPEN |
| 003 Remove `floor(999/ts)` | P0 | OPEN |
| 004 Boss configs backend-authoritative | P0 | OPEN |
| 005 Draft → validate → preview → activate | P0 | OPEN |
| 006 Identity: name, family, role, lifecycle | P1 | OPEN — spawn still writes `family: "boss"` (WX 6568) / `"default"` then family overlay |
| 007 Variants base/veteran/elite/champion/rare | P1 | OPEN — `FAMILY_VARIANT_CHANCE = 0.3` |
| 008 Spawn weights, tags, formations, elite chance | P1 | OPEN — quadrant placement still inline in WX |
| 009 Author AI profile / modules | P1 | OPEN |
| 010 Formula stats + rewards via `applyRewards` | P1 | OPEN |
| 011 `levelOffset` + `getBossEffectiveStats` in combat | P0 | OPEN |
| 012 SDA kits + discovery chips | P1 | OPEN — summoner overlay still `summon-dire-wolf` / `summon-archer` (WX 11932–11942) |
| 013 Numeric kit zone (NaN fix) | P0 | OPEN |
| 014 Create/clone bosses; ability registry | P1 | OPEN |
| 015 Boss Rush as live documents | P1 | OPEN |
| 016 Mastery objectives | P2 | OPEN |
| 017 Visual mode NONE / asset / pool | P1 | OPEN — copy honest (`adminVisualStatus.ts`). Default pixels: `enemyPixelPatterns.ts`. |
| 018 Clone, compare, deactivate, rollback | P1 | OPEN |
| 019 Unbounded preview + activate validation | P1 | OPEN |
| 020 Owner studio UI | P1 | OPEN |
| 021 Soft-retire; block hard delete | P0 | OPEN |
| 022 Extract helpers; do not grow WX | P0 | OPEN — spawnPolicy is placement extract only |
| 023 Honour portal assignments | P1 | OPEN |
| 024 EnemyRegister / Boss Guide from active defs | P2 | OPEN — copy PARTIAL |

### EBA-2026-09-01-001 … 006

| ID | Status |
| :--- | :--- |
| 001 Replace adminGuard closed-band checks | OPEN — `adminGuard.mo` 273–277, 297–301 |
| 002 Stop calling live `pbv_boss_configs` a “draft” | OPEN — toast 7780 vs header 7837–7839 |
| 003 Wire boss set/delete to the canister | OPEN |
| 004 Retire `longHorizonSim` private kit copy | OPEN |
| 005 Ban or guard unused `admin-api.mo` mixin | OPEN |
| 006 Do not label unused `spriteUrl` as live | **PARTIAL** — `adminVisualStatus.ts`. Full controls remain EBA-017 + VAL |

### EBA-2026-09-02-001 … 002

| ID | Status |
| :--- | :--- |
| 001 Do not treat `levelMax = 9999` as unbounded | OPEN |
| 002 `summonUnitDef.level ≤ 99` is a template-size rail | OPEN — Motoko 441–442 **and** `adminSafety.ts` 638–640 |

### EBA-2026-09-21-001

| ID | Status |
| :--- | :--- |
| 001 Drive EnemyDefinition spawn through `spawnPolicy.ts` | OPEN — **not on `main`**; covered by [PR #360](https://github.com/Mr-Melic/stralt/pull/360). Do not re-file. |

---

## 4. Owner studio still required (unchanged)

Identity (name, family, role, active/inactive), gameplay formulas, relative-level behaviour, rewards through `applyRewards`, authored AI (profile / sophistication / tactical modules), CORE–SIGNATURE pools with discovery chips (player learnable / observation / acquisition — consume SDA), variants (base / veteran / elite / champion / rare), spawn rules (relative eligibility, rarity, weights, environment / dungeon / Boss Rush / formations / elite chance), boss phases / summons / arena mechanic ids / mastery / rewards, visual mode **NONE** by default (Use Default Pixel Visual / Select Uploaded Visual / Select Visual Pool / Preview / Manage Assets; category spec beside controls; bosses may use `boss_large`), and **DRAFT → VALIDATE → PREVIEW → ACTIVATE**. Support cloning, comparison, deactivation, and rollback.

Validation before activate: required fields, AI/spell compatibility, SpellConfig, spawn rules, rewards, visual fallback, render profile, references, encounter compatibility.

Visuals must never change occupancy, pathing, range, or rewards. Missing custom art falls back to the built-in pixel design the next frame.

Do not implement from this file. Consume the 08-31 contract.

---

## 5. New ACTION_IDs (this run)

**None.** Ledger: [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-22.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-22.md).
