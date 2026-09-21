# Enemy & Boss Admin — 2026-09-21 re-audit

**Author:** Enemy & Boss Admin Content Designer  
**Automation:** `299b70f5-a498-11f1-a7d1-d6b4613131ce`  
**Verified against:** `origin/main` @ `0f5363f` (2026-09-21; merge of PR #332)  
**Prior contract:** [`ENEMY_BOSS_ADMIN_DESIGN_2026-08-31.md`](./ENEMY_BOSS_ADMIN_DESIGN_2026-08-31.md) (merged as [#146](https://github.com/Mr-Melic/stralt/pull/146))  
**Prior ledgers:** [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-08-31.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-08-31.md) (`EBA-2026-08-31-001` … `024`); [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-01.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-01.md) (`EBA-2026-09-01-001` … `006`); [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-02.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-02.md) (`EBA-2026-09-02-001` … `002`, already on `main`)  
**This run:** documentation only. No production, RAF, map generation, turn, or damage-math code.

Stralt has **no character level cap**. Do not add a final maximum level. Prefer relative offsets, probability curves, eligibility thresholds, and scalable formulas.

Open PRs targeting `main` at audit time (oldest `createdAt` first): [#327](https://github.com/Mr-Melic/stralt/pull/327), [#331](https://github.com/Mr-Melic/stralt/pull/331). Neither touches `docs/automation/*`. #331 restacks `EnemyRegister.tsx` / `enemyRegisterCopy.ts` — this run does not edit those files.

---

## 0. Verdict

The 2026-08-31 design is still the owner-studio contract. **None of EBA-2026-08-31-001–024 shipped as gameplay.** There is still no `EnemyDefinition` / `BossDefinition`, no draft→validate→preview→activate path, no authored AI, no variants, no kit/discovery chips, and no visual mode `none|asset|pool`.

09-01 and 09-02 EBA docs are on `main`. This run **does not re-file** `EBA-2026-08-31-*`, `EBA-2026-09-01-*`, `EBA-2026-09-02-*`, `SDA-*`, `VAL-*`, `AFDA-*`, `WDEAD-*`, `AEE-*`, or Enemy Elite / Formations IDs. New IDs are only for gaps that appeared after the 09-02 EBA SHA `58302bc`.

Honesty copy landed in more places (Enemy Register flavor lore; Enemies / Boss Rush CatalogNotes; unused `spriteUrl` status). That is not the studio.

One architectural gap is new: commit `7fd4013` extracted the live overworld roster into `engine/spawnPolicy.ts` **after** the 09-02 audit. EBA-001/007/008/022 still point at `generateEnemies` / files that do not exist. Implementers who only edit WorldExploration will leave the hardcoded family table live.

Consume, do not duplicate:

| Sibling | Consume for |
| :--- | :--- |
| SDA | CORE–SIGNATURE pools, `PLAYER_LEARNABLE`, observation, SpellConfig activate gate |
| VAL (`VAL-2026-09-01-001` copy IMPLEMENTED) | Asset / pool bind, `boss_large`, no gameplay invalidation; `enemyPixelPatterns.ts` is the default pixel table |
| AFDA-2026-08-31-002 | Same `pbv_boss_configs` split-brain as EBA-004 |
| AFDA-2026-08-31-011 (PARTIAL) | `levelMax` default 9999 workaround — **not** RelativeEligibility |
| WDEAD | Region `level <= levelMax` live ceiling; dungeon-depth tables; Death Realm `maxLevel: 5` HUD stamps; named `spawnPolicy.ts` as extract path **before** the file existed |
| AEE | `inferArchetype` / `computeAITier` / kit assign — authored AI is still EBA-009 |
| Enemy Elite Evolution | Family overlay still a 30% stat paint, not veteran/elite/champion documents |
| Enemy Formations / EBMA | Named packs — still design-only (`encounterFormations.ts` absent) |

---

## 1. What still drives live encounters

| Surface | Still true on `0f5363f` | Prior ID |
| :--- | :--- | :--- |
| Admin `EnemyConfig` CRUD | Canister write via `adminSetEnemyConfig` (`main.mo` 781–795) + `useGetEnemyConfigs`. `generateEnemies` (`WorldExploration.tsx` 5711–5872) never reads those rows. Enemies tab CatalogNote admits this (`AdminDashboard.tsx` 2117–2122). Save is still immediate (`setEnemyMut.mutate` 5989). | EBA-001, 005 |
| Spawn roster | Chess piece + `pickEnemyLevelFromTiers` + placeholder `level*8+20` HP (5831–5832) + `computeEnemyStats`, then `applyFamilyVariantsToRoster` (5864–5866). Policy tables now live in `spawnPolicy.ts` (see §2 and **new 09-21-001**). | EBA-001, 007, 008 |
| Closed level bands | `newEnemy()` / `newRegion()` default `levelMax` to **9999** (`AdminDashboard.tsx` 138–157). Editor still labeled Level Min/Max (799–813) with `ELIGIBILITY_BAND_HINT` (248–249). List chips still `Lv min–max` (2223–2224). `AdminGuard` still **requires** the closed band (`adminGuard.mo` 273–277, 297–301). Caffeine mock `sampleEnemyConfig` / `sampleRegionConfig` still seed `levelMax: BigInt(5)` (`mocks/backend.ts` 62–80) — sample content, not a product cap (consume AFDA-011). | EBA-002; EBA-2026-09-01-001; EBA-2026-09-02-001 |
| Hidden 999 cap | `combatMath.ts` 58: `maxTier = Math.floor(999 / ts)`. | EBA-003 |
| Boss source | `useBossQueries.ts` 1–21 and portal entry (`WorldExploration.tsx` 6486–6489) read `pbv_boss_configs`. `getAllBossConfigs` unused by gameplay. Hooks in `useAdminQueries.ts` 528–557 still write localStorage. | EBA-004; AFDA-002 (consume) |
| Boss catalogue | Editor maps `BOSS_IDS` only (`AdminDashboard.tsx` 7804; 19 ids in `bossTypes.ts` 390–410). Motoko seeds **12** (`admin.mo` 349–551, through `final_pawn`). WX still comments “Pick a random boss from the 12” while using `BOSS_IDS.length` (4899–4901). | EBA-014 |
| Boss scaling | Spawn `level + 5` and `Math.min(50, res/sp)` (`WorldExploration.tsx` 6537, 6559–6560). `getBossEffectiveStats` is Boss Guide + `longHorizonSim` only. | EBA-011 |
| Kit zone NaN | `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920). `levelZone` is still typed `any` and built as `{ name, minLevel, maxLevel }` (592, 4683). `Math.floor(object)` → zone-0 kits. Comment at 11915 still says “10 random spells.” | EBA-013 |
| AI inference | `inferArchetype` (`enemyAI.ts` 447–477): healer from heal flags, flanker from `pieceType === "knight"`, berserker from `family.includes("berserk")`, charger from melee-only kit. `inferSummonArchetype` still name-matches wolf/golem/wisp (202–225). | EBA-009; consume AEE |
| Boss Rush | `placeBossRushSpawns` / `applyFinalizedLayout` punch walkable cells (`WorldExploration.tsx` 5300–5315) but units are still 100-HP placeholders with `pieceType: roomDef.boss1Name` (5321–5343). Room 9 still `weeping_pawn_2` (`useBossRush.ts` 127). CatalogNote admits live rooms come from `BOSS_RUSH_ROOMS` (`AdminDashboard.tsx` 7141–7146). | EBA-015 |
| Portal assignments | Canister `setBossPortalAssignment` exists. Frontend `useSetBossPortalAssignment` is still a no-op invalidate (`useAdminQueries.ts` 559–574). World picks a random `BOSS_IDS` entry. | EBA-023 |
| Hard delete | `adminDeleteEnemyConfig` is still `Map.remove` (`main.mo` 798–805). Bosses tab holds unused `_deleteBossConfig` (`AdminDashboard.tsx` 7754) — no owner delete control. Canister `deleteBossConfig` still portal-assignment only (2988–3004). | EBA-021; EBA-2026-09-01-003 |
| Player catalog | `EnemyRegister.tsx` 28+ still hardcodes `MONSTERS` / `BOSSES`. Honesty chrome now lives in `utils/enemyRegisterCopy.ts` (not in `58302bc`). | EBA-024 copy **PARTIAL** |
| Engine extract | No `engine/enemyDefinition.ts`, `bossDefinition.ts`, `contentValidate.ts`, `encounterPreview.ts`, `spawnFormations.ts`, or `enemyKitResolve.ts`. `spawnPolicy.ts` **does** exist (new bind site). | EBA-022; **new 09-21-001** |
| Presets | `EnemyPresets` is still browser `localStorage` (`AdminDashboard.tsx` 555–584), max 10 snapshots, not canister clones. | EBA-018 |

Immediate Save is still live: Enemy editor `onSave` → `setEnemyMut.mutate`. Boss Save still writes localStorage.

---

## 2. Partial progress since 2026-09-02 (do not treat as EBA done)

| Change | What it is | What it is not |
| :--- | :--- | :--- |
| `engine/spawnPolicy.ts` (`7fd4013`, absent at `58302bc`) | Placement / family / dungeon-extra helpers extracted from `generateEnemies`. `dungeonScaledEnemyLevel` is relative (`base + boost * tierSize`). Tests lock the three distance metrics and “no MAX_ENEMIES cap” on pack size. | Not EnemyDefinition. `FAMILY_TYPES` / `FAMILY_VARIANT_CHANCE = 0.3` are still the live roster. `getEnemyConfigs` still unused. **New 09-21-001.** |
| `enemyRegisterCopy.ts` (`9e28cf9`) | Chip/banner: flavor lore, not live templates. | Not EBA-024. Arrays remain hardcoded. Open PR #331 also touches these files — do not restack copy here. |
| Enemies editor honesty (`AdminDashboard.tsx` 731–735) | States combat identity (damage/res/sp/sr/chc) is not on this form. | Not unifying the two `EnemyConfig` types. |
| `longHorizonSim` `bossGuideVsCombat` | Now maps **all** `STRESS_LEVELS` (includes 10_000 / 50_000); the `l <= 2500` filter present at `58302bc` is gone (509–520). | Still a private `buildEnemyKit` (54–79) and still `getBossEffectiveStats` vs combat `bossBase.hp`. **EBA-2026-09-01-004 still OPEN.** |
| `adminGuard` spriteUrl URL check (`validateEnemyConfig` 282–290) | Rejects unsafe URL schemes on the unused catalog field. | Not `visualMode none\|asset\|pool`. When EBA-017 lands, replace this with asset/pool validation — do not keep URL-only as the visual persist gate. |
| `adminSafety.validateSpellConfig` 638–640 | Same `summonUnitDef.level > 99` rail as Motoko (`adminGuard.mo` 441–442), also via flattened `summonLevel` (`useSpellQueries.ts` 77). Existed at `58302bc`; 09-02-002 SYSTEMS_AFFECTED omitted this file. `getSummonBaseStats` (`progression.ts` 218–244) scales from **spellLevel + hpScale**, not `unitDef.level`. | Not a career cap. Do not start reading `unitDef.level` as encounter combat level. Keep hpScale 0–10 anti-Inf. **EBA-2026-09-02-002 still OPEN.** |
| Boss toast (`AdminDashboard.tsx` 7780) | “draft saved in this browser only — not canister-live”. | Header 7837–7839 still calls the **live** `pbv_boss_configs` store a draft **and** says changes apply on the next encounter. **EBA-2026-09-01-002 still OPEN.** |
| Mixin `admin-api.mo` | Still dead. `main.mo` does not include it. `AdminLib.setEnemyConfig` (`admin.mo` 8–14) still writes with **no** `AdminGuard` and **no** audit. | **EBA-2026-09-01-005 still OPEN.** |

AP/MP ≤ 20 remains a **combat-budget** clamp. Keep that. Do not invent a character-level max beside it. HP 1–100000 on enemy/boss templates stays a document-size rail. `initStat > 100` (`adminGuard.mo` 272) is the same class.

Tiers tab preview is still `SAMPLE_LEVELS = [1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877) — consume WDEAD, do not re-file. EBA-019 still requires owner-typed 1 and 10000 on the **enemy/boss** preview once it exists.

Death Realm fallbacks still stamp `maxLevel: 5` (`WorldExploration.tsx` 13514, 13646) vs entry `9999` (5439). Consume WDEAD. Do not “fix” kit width by reading that object (EBA-013). HUD still prints `minLevel–maxLevel` with fallback 9999 (18624–18625).

`computeAITier` still bands through 900 then a flat tier 10 (`combatMath.ts` 36–47). Sophistication may plateau; **rolled enemy level must not** (EBA-003).

---

## 3. Status of prior EBA IDs

### EBA-2026-08-31-001 … 024

All remain **OPEN**. Evidence line numbers above replace the 08-31 / 09-01 / 09-02 citations where they drifted.

| ID | Priority | Status |
| :--- | :--- | :--- |
| 001 Unify EnemyDefinition + drive spawn | P0 | OPEN — bind site is now `spawnPolicy.ts` (09-21-001) |
| 002 Replace levelMin/levelMax with relative eligibility | P0 | OPEN — frontend still defaults 9999; Motoko still requires the closed band |
| 003 Remove `floor(999/ts)` | P0 | OPEN |
| 004 Boss configs backend-authoritative | P0 | OPEN |
| 005 Draft → validate → preview → activate | P0 | OPEN |
| 006 Identity: name, family, role, lifecycle | P1 | OPEN — spawn still writes `family: "boss"` (`WorldExploration.tsx` 6568) |
| 007 Variants base/veteran/elite/champion/rare | P1 | OPEN — `FAMILY_VARIANT_CHANCE` is still a 30% overlay |
| 008 Spawn weights, tags, formations, elite chance | P1 | OPEN |
| 009 Author AI profile / modules | P1 | OPEN — `inferArchetype` / name-based summon AI remain |
| 010 Formula stats + rewards via `applyRewards` | P1 | OPEN |
| 011 `levelOffset` + `getBossEffectiveStats` in combat | P0 | OPEN |
| 012 SDA kits + discovery chips | P1 | OPEN — summoner overlay still `summon-dire-wolf` / `summon-archer` (WX 11932–11942) |
| 013 Numeric kit zone (NaN fix) | P0 | OPEN |
| 014 Create/clone bosses; ability registry | P1 | OPEN |
| 015 Boss Rush as live documents | P1 | OPEN |
| 016 Mastery objectives | P2 | OPEN |
| 017 Visual mode NONE / asset / pool | P1 | OPEN — copy is honest (09-01-006 / VAL-09-01-001). Default pixel tables: `enemyPixelPatterns.ts`. |
| 018 Clone, compare, deactivate, rollback | P1 | OPEN — `idLocked` after create; presets are localStorage |
| 019 Unbounded preview + activate validation | P1 | OPEN |
| 020 Owner studio UI | P1 | OPEN |
| 021 Soft-retire; block hard delete | P0 | OPEN |
| 022 Extract helpers; do not grow WX | P0 | OPEN — spawnPolicy is a partial extract of **placement**, not the listed definition/validate/preview modules |
| 023 Honour portal assignments | P1 | OPEN |
| 024 EnemyRegister / Boss Guide from active defs | P2 | OPEN — copy PARTIAL (`enemyRegisterCopy.ts`) |

### EBA-2026-09-01-001 … 006

| ID | Priority | Status |
| :--- | :--- | :--- |
| 001 Replace adminGuard closed-band checks | P0 | OPEN — `adminGuard.mo` 273–277, 297–301 |
| 002 Stop calling live `pbv_boss_configs` a “draft” | P1 | OPEN — toast improved; header 7837–7839 still contradicts itself |
| 003 Wire boss set/delete to the canister | P0 | OPEN — hooks still localStorage; `_deleteBossConfig` unused |
| 004 Retire `longHorizonSim` private kit copy | P1 | OPEN |
| 005 Ban or guard unused `admin-api.mo` mixin | P1 | OPEN |
| 006 Do not label unused `spriteUrl` as live | P1 | **PARTIAL** — `adminVisualStatus.ts` still honest. Full controls remain EBA-017 + VAL |

### EBA-2026-09-02-001 … 002

| ID | Priority | Status |
| :--- | :--- | :--- |
| 001 Do not treat `levelMax = 9999` as unbounded | P0 | OPEN — `DEFAULT_ELIGIBILITY_LEVEL_MAX` / hint / chips unchanged |
| 002 `summonUnitDef.level ≤ 99` is a template-size rail | P1 | OPEN — Motoko 441–442 **and** `adminSafety.ts` 638–640. Combat HP does not read `unitDef.level` today (`getSummonBaseStats`). Do not raise 99 → 999. |

---

## 4. Owner studio still required (unchanged)

Identity, gameplay formulas, relative-level behaviour, rewards, authored AI, CORE–SIGNATURE pools with discovery chips, variants, spawn rules, boss phases/summons/arena/mastery, visual mode **NONE** by default, and **DRAFT → VALIDATE → PREVIEW → ACTIVATE**.

Validation before activate: required fields, AI/spell compatibility, SpellConfig, spawn rules, rewards, visual fallback, render profile, references, encounter compatibility.

Visuals must never change occupancy, pathing, range, or rewards. Bosses may use `boss_large`. Missing custom art falls back to the built-in pixel design the next frame (`enemyPixelPatterns.ts`).

Do not implement from this file. Consume the 08-31 contract.

---

## 5. New ACTION_IDs (this run only)

Full records: [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-21.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-21.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| EBA-2026-09-21-001 | Drive EnemyDefinition spawn through `spawnPolicy.ts`; do not re-inline the hardcoded roster | P0 |
