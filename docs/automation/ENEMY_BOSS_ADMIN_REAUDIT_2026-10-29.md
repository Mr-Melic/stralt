# Enemy & Boss Admin — 2026-10-29 re-audit

**Author:** Enemy & Boss Admin Content Designer  
**Automation:** `299b70f5-a498-11f1-a7d1-d6b4613131ce`  
**Verified against:** `origin/main` @ `0f5363f` (merge of PR #332, 2026-09-03; **same SHA as the 2026-09-21 through 2026-10-28 EBA re-audits**)  
**Prior contract:** [`ENEMY_BOSS_ADMIN_DESIGN_2026-08-31.md`](./ENEMY_BOSS_ADMIN_DESIGN_2026-08-31.md) (merged as [#146](https://github.com/Mr-Melic/stralt/pull/146))  
**Prior ledgers on `main`:** [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-08-31.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-08-31.md) (`EBA-2026-08-31-001` … `024`); [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-01.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-01.md) (`EBA-2026-09-01-001` … `006`); [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-02.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-02.md) (`EBA-2026-09-02-001` … `002`)  
**Prior ledgers not yet on `main`:** [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-09-21.md`](https://github.com/Mr-Melic/stralt/pull/360) (`EBA-2026-09-21-001`) on open draft PR [#360](https://github.com/Mr-Melic/stralt/pull/360); zero-ID ledgers on [#404](https://github.com/Mr-Melic/stralt/pull/404) (09-22), [#449](https://github.com/Mr-Melic/stralt/pull/449) (09-23), [#507](https://github.com/Mr-Melic/stralt/pull/507) (09-24), [#561](https://github.com/Mr-Melic/stralt/pull/561) (09-25), [#621](https://github.com/Mr-Melic/stralt/pull/621) (09-26), [#660](https://github.com/Mr-Melic/stralt/pull/660) (09-27), [#746](https://github.com/Mr-Melic/stralt/pull/746) (09-28), [#792](https://github.com/Mr-Melic/stralt/pull/792) (09-29), [#817](https://github.com/Mr-Melic/stralt/pull/817) (10-21), [#876](https://github.com/Mr-Melic/stralt/pull/876) (10-22), [#929](https://github.com/Mr-Melic/stralt/pull/929) (10-23), [#980](https://github.com/Mr-Melic/stralt/pull/980) (10-24), [#1044](https://github.com/Mr-Melic/stralt/pull/1044) (10-25), [#1111](https://github.com/Mr-Melic/stralt/pull/1111) (10-26), [#1163](https://github.com/Mr-Melic/stralt/pull/1163) (10-27), and [#1218](https://github.com/Mr-Melic/stralt/pull/1218) (10-28)  
**This run:** documentation only. No production, RAF, map generation, turn, or damage-math code. This PR does **not** edit the 08-31 contract file (PR #360 owns that 09-21 pointer). Unique `*2026-10-29*` filenames only.

Stralt has **no character level cap**. Do not add a final maximum level. Prefer relative offsets, probability curves, eligibility thresholds, and scalable formulas. Do not raise `9999` → `99999` or `99` → `999`.

---

## 0. Verdict

`origin/main` has not moved since the 2026-09-21 EBA re-audit (`0f5363f`). Independent spot-checks on 2026-10-29 match the 09-21 through 10-28 evidence. No citation drift vs the 10-28 ledger: the unused battle-start comment still saying “10 random spells” is `WorldExploration.tsx` **11915**; unused `_enemyUsableSpells` is 11916; `buildEnemyKit(..., currentMap.levelZone)` remains at 11920. The 2026-08-31 design remains the owner-studio contract.

No later EBA docs PRs exist between 2026-09-30 and 2026-10-20. This run does **not** backfill empty ledgers for those dates. PR #817 recorded the 2026-10-21 zero-ID pass; #876 the 10-22 pass; #929 the 10-23 pass; #980 the 10-24 pass; #1044 the 10-25 pass; #1111 the 10-26 pass; #1163 the 10-27 pass; #1218 the 10-28 pass. All eight are still open at this SHA (#1163 is not draft; the rest of that set are drafts except as GitHub currently shows).

**None of EBA-2026-08-31-001–024 shipped as gameplay.** Grep on `src/` for `EnemyDefinition`, `BossDefinition`, `visualMode`, `contentValidate`, `encounterPreview`, `spawnFormations`, and `enemyKitResolve` returns **zero** matches. There is still no draft→validate→preview→activate path, no authored AI, no variants, no kit/discovery chips, and no visual mode `none|asset|pool`. `adminRollbackEnemyConfig` / `adminRollbackBossConfig` still do not exist.

**No new ACTION_IDs this run.** Do not re-file `EBA-2026-08-31-*`, `EBA-2026-09-01-*`, `EBA-2026-09-02-*`, `EBA-2026-09-21-001` (still covered by open PR #360), or the zero-ID 09-22 / 09-23 / 09-24 / 09-25 / 09-26 / 09-27 / 09-28 / 09-29 / 10-21 / 10-22 / 10-23 / 10-24 / 10-25 / 10-26 / 10-27 / 10-28 ledgers (PRs #404 / #449 / #507 / #561 / #621 / #660 / #746 / #792 / #817 / #876 / #929 / #980 / #1044 / #1111 / #1163 / #1218). Consume `SDA-*`, `VAL-*`, `AFDA-002` / `011`, `WDEAD-*`, `AEE-*`, Enemy Elite Evolution, Enemy Formations / EBMA.

Open-PR queue at audit time: **945** still-open PRs targeting `main` (886 on 2026-10-28). Oldest `createdAt` first: [#327](https://github.com/Mr-Melic/stralt/pull/327), [#331](https://github.com/Mr-Melic/stralt/pull/331), then the 2026-09-21 wave starting at [#333](https://github.com/Mr-Melic/stralt/pull/333). EBA siblings already in that queue: [#360](https://github.com/Mr-Melic/stralt/pull/360), [#404](https://github.com/Mr-Melic/stralt/pull/404), [#449](https://github.com/Mr-Melic/stralt/pull/449), [#507](https://github.com/Mr-Melic/stralt/pull/507), [#561](https://github.com/Mr-Melic/stralt/pull/561), [#621](https://github.com/Mr-Melic/stralt/pull/621), [#660](https://github.com/Mr-Melic/stralt/pull/660), [#746](https://github.com/Mr-Melic/stralt/pull/746), [#792](https://github.com/Mr-Melic/stralt/pull/792), [#817](https://github.com/Mr-Melic/stralt/pull/817), [#876](https://github.com/Mr-Melic/stralt/pull/876), [#929](https://github.com/Mr-Melic/stralt/pull/929), [#980](https://github.com/Mr-Melic/stralt/pull/980), [#1044](https://github.com/Mr-Melic/stralt/pull/1044), [#1111](https://github.com/Mr-Melic/stralt/pull/1111), [#1163](https://github.com/Mr-Melic/stralt/pull/1163), [#1218](https://github.com/Mr-Melic/stralt/pull/1218). This run adds unique `docs/automation/*2026-10-29*` files so it stays merge-clean after those older siblings. Main SHA is unchanged; the queue grew from other automations, not from enemy/boss gameplay.

---

## 1. What still drives live encounters (re-verified 2026-10-29)

| Surface | Still true on `0f5363f` | Prior ID |
| :--- | :--- | :--- |
| Admin `EnemyConfig` CRUD | Immediate canister write via `adminSetEnemyConfig` (`main.mo` 781–795) + `useGetEnemyConfigs`. Template is still `id/name/hp/ap/mp/initStat/levelMin/levelMax/regions/spriteUrl` (`gameTypes.ts` 108–119) — **no** family, role, lifecycle, scaling formula, AI, pools, or variants. `generateEnemies` (`WorldExploration.tsx` 5711–5872) never reads those rows (`getEnemyConfigs` / `useGetEnemyConfigs` have **zero** hits in WX). Enemies tab CatalogNote admits this (`AdminDashboard.tsx` 2117–2122). | EBA-001, 005, 006 |
| Spawn roster | Chess piece + `pickEnemyLevelFromTiers` + placeholder `level*8+20` HP (WX 5831–5832), then `applyFamilyVariantsToRoster` (5864–5866). Tables live in `spawnPolicy.ts` (`FAMILY_VARIANT_CHANCE = 0.3` at 35; `DUNGEON_SPAWN_DEPTH_CAP = 5` at 29). | EBA-001, 007, 008; **EBA-2026-09-21-001** (PR #360) |
| Closed level bands | `newEnemy()` / `newRegion()` default `levelMax` to **9999** (`AdminDashboard.tsx` 137–157). Editor Level Min/Max with `ELIGIBILITY_BAND_HINT` (248–249, rendered at 813): “New drafts default max to 9999 so high-level play still matches.” List chips still print `Lv min–max` (2224). `AdminGuard` **requires** the closed band (`adminGuard.mo` 273–277, 297–301). Live region match is still `level <= Number(r.levelMax)` (WX 3702). | EBA-002; 09-01-001; 09-02-001; consume WDEAD |
| Hidden 999 cap | `engine/combatMath.ts` 58: `maxTier = Math.floor(999 / ts)`. Comment: “cap for reasonable range.” | EBA-003 |
| Boss source | `useBossQueries.ts` and portal entry (`WorldExploration.tsx` 6486) read `pbv_boss_configs`. `getAllBossConfigs` unused by gameplay. `useSetBossConfig` / `useDeleteBossConfig` (`useAdminQueries.ts` 528–556) still write localStorage. | EBA-004; AFDA-002 |
| Boss catalogue | Editor filters `BOSS_IDS` only (`AdminDashboard.tsx` 7804). Motoko seeds **12** (`admin.mo` 349–350; last id `final_pawn` at 551). WX still comments “Pick a random boss from the 12” (4899) while using `BOSS_IDS.length` (4900–4901). Frontend catalogue is **19** ids (`bossTypes.ts` 390–410). | EBA-014 |
| Boss scaling | Spawn `level + 5` (WX 6537) and `Math.min(50, res/sp)` (6559–6560). `getBossEffectiveStats` is Boss Guide (`progression.ts` 308) + `longHorizonSim` (511) only — **not** combat spawn. | EBA-011 |
| Kit zone NaN | `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (WX 11920). `levelZone` is `{ name, minLevel, maxLevel }`. `Math.floor(object)` → zone-0 kits. Comment at **11915** still says “10 random spells.” Unused `_enemyUsableSpells` filter sits at 11916. | EBA-013 |
| AI inference | `inferArchetype` (`enemyAI.ts` 447–477): healer from heal flags, flanker from `pieceType === "knight"` (465), berserker from `family.includes("berserk")` (469). | EBA-009; consume AEE |
| Boss Rush | `placeBossRushSpawns` / `applyFinalizedLayout` then 100-HP placeholders (WX 5321–5372; `hp: 100` at 5331 and 5356). Room 9 still `weeping_pawn_2` (`useBossRush.ts` 127). CatalogNote admits live rooms come from `BOSS_RUSH_ROOMS` (`AdminDashboard.tsx` 7141–7146). Canister `adminRollbackBossRushConfig` exists — flavour JSON rollback, not `BossDefinition`. | EBA-015, 018 |
| Portal assignments | Canister `setBossPortalAssignment` exists (`main.mo` 3022). Frontend `useSetBossPortalAssignment` (`useAdminQueries.ts` 559–575) is a no-op invalidate. World picks a random `BOSS_IDS` entry. | EBA-023 |
| Hard delete | `adminDeleteEnemyConfig` is `Map.remove` (`main.mo` 798–805). No `adminRollbackEnemyConfig` / `adminRollbackBossConfig`. Bosses tab holds unused `_deleteBossConfig` (`AdminDashboard.tsx` 7754). | EBA-021; 09-01-003; 018 |
| Player catalog | `EnemyRegister.tsx` still hardcodes `MONSTERS` / `BOSSES` (28, 91). Honesty chrome: `utils/enemyRegisterCopy.ts`. | EBA-024 copy **PARTIAL** |
| Engine extract | No `engine/enemyDefinition.ts`, `bossDefinition.ts`, `contentValidate.ts`, `encounterPreview.ts`, `spawnFormations.ts`, or `enemyKitResolve.ts`. `spawnPolicy.ts` exists (09-21-001 bind site). | EBA-022; 09-21-001 |
| Presets | `EnemyPresets` is browser `localStorage` (`AdminDashboard.tsx` 555–584), max 10 snapshots, not canister clones. | EBA-018 |
| Visuals | `adminVisualStatus.ts`: empty URL = Default Pixel Visual; filled URL = **Stored URL — not rendered**. No Use Default / Select Uploaded / Select Pool / Preview / Manage Assets. No `visualMode`. | EBA-017; 09-01-006 PARTIAL; consume VAL |

Immediate Save is still live (`setEnemyMut.mutate` at `AdminDashboard.tsx` 5989). Boss Save still writes localStorage. Boss Editor header (`AdminDashboard.tsx` 7836–7839) still contradicts itself: it calls `pbv_boss_configs` a browser-local draft that is “not the live encounter until a backend writer exists,” then says “Changes apply on this browser's next boss encounter” — which is true because world portal entry **does** read that key (**09-01-002 OPEN**).

---

## 2. Additional evidence (not a new ID)

Same as 09-21 through 10-28, still true on this SHA:

- `generateEnemies` `tryPlaceEnemy` still calls `computeEnemyStats(enemyLevel, pieceType, …)` (WX 5834–5838) where `pieceType` is the **player** chess piece (callback deps at 5871). The spawned unit stores `pieceType: randomPieceType`. Battle start reseeds with `e.pieceType` (WX 11873). When EBA-001 / 09-21-001 bind `EnemyDefinition.pieceType` through `spawnPolicy`, pass the **unit** piece. Do not retune damage math.
- `DUNGEON_SPAWN_DEPTH_CAP = 5` is dungeon-chain length (`spawnPolicy.ts` 26–29). WX comment at 5719 still says “depth 1-5 = escalating dungeon difficulty.” Do not copy the depth cap onto `RelativeEligibility`. Visual scale 0.6–1.4 is draw-only (VAL-008). Occupancy metrics stay Manhattan ≤ 2 / Chebyshev ≤ 3 / Chebyshev ≥ 4 (`spawnPolicy.ts` 9–12).
- AP/MP ≤ 20 remains a **combat-budget** clamp (`adminGuard.mo` 270–271). `initStat > 100` (272) and enemy HP 1–100000 (267–268) are document-size rails. `summonUnitDef.level > 99` is Motoko (`adminGuard.mo` 441–442) **and** `adminSafety.ts` (638–640, including the `summonLevel` alias). Do not raise 99 → 999.
- Tiers tab `SAMPLE_LEVELS = [1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877) — consume WDEAD. Death Realm fallbacks still stamp `maxLevel: 5` (WX 13514, 13646). Consume WDEAD; do not “fix” kit width by reading that object (EBA-013).
- `computeAITier` still bands through 900 then a flat tier 10 (`combatMath.ts` 36–47). Sophistication may plateau; **rolled enemy level must not** (EBA-003). Mixin `admin-api.mo` still writes via `AdminLib.setEnemyConfig` with **no** `AdminGuard` and **no** audit (`admin-api.mo` 18–25); grep of `src/` finds **no** `include` of the mixin (`main.mo` includes `MixinAuthorization` only — **09-01-005 OPEN**). `utils/longHorizonSim.ts` still has a private `buildEnemyKit` (54–79) (**09-01-004 OPEN**).
- Owner rollback exists for GameConfig / TierSpawn / ColorPalette / BossRush / LevelUp and **does not** exist for enemy or boss definition rows. That is EBA-018, not a new ACTION_ID. Summoner overlay still hardcodes `summon-dire-wolf` / `summon-archer` (WX 11935–11941) — EBA-012.
- Boss Rush units stamp `family: "boss"` (WX 5343, 5368); boss-portal spawn does the same (6568). Identity still has no authored role / lifecycle (EBA-006).
- Frontend mock enemy/region rows still stamp `levelMax: BigInt(5)` (`mocks/backend.ts` 69, 80). That is leftover sample content, not a career cap — consume AFDA-011; do not “fix” by raising the mock to 9999.

Citation check this run (not a new gap): 10-28 listed the “10 random spells” comment at WX **11915**. Independently re-read on 2026-10-29: 11914 is `// Build initiative-sorted turn order`; 11915 is `// 4b: Assign 10 random spells per enemy from usableByEnemy pool`; 11916 is `const _enemyUsableSpells = normalizedSpellPool.filter(…)`. The NaN kit call at 11920 is unchanged (EBA-013). Boss Rush 100-HP block independently spans 5321–5372. Live region eligibility independently re-read at WX **3702** (`level >= Number(r.levelMin) && level <= Number(r.levelMax)`). Do not file a new ID for the unused filter or the region-match citation.

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
| 006 Identity: name, family, role, lifecycle | P1 | OPEN — `EnemyConfig` still has none of family/role/active |
| 007 Variants base/veteran/elite/champion/rare | P1 | OPEN — `FAMILY_VARIANT_CHANCE = 0.3` |
| 008 Spawn weights, tags, formations, elite chance | P1 | OPEN — quadrant placement still inline in WX |
| 009 Author AI profile / modules | P1 | OPEN |
| 010 Formula stats + rewards via `applyRewards` | P1 | OPEN |
| 011 `levelOffset` + `getBossEffectiveStats` in combat | P0 | OPEN |
| 012 SDA kits + discovery chips | P1 | OPEN — summoner overlay still wolf/archer |
| 013 Numeric kit zone (NaN fix) | P0 | OPEN — comment at WX **11915** |
| 014 Create/clone bosses; ability registry | P1 | OPEN |
| 015 Boss Rush as live documents | P1 | OPEN |
| 016 Mastery objectives | P2 | OPEN |
| 017 Visual mode NONE / asset / pool | P1 | OPEN — copy honest (`adminVisualStatus.ts`) |
| 018 Clone, compare, deactivate, rollback | P1 | OPEN — no enemy/boss rollback methods |
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
| 002 Stop calling live `pbv_boss_configs` a “draft” | OPEN — header 7836–7839 contradicts live localStorage read |
| 003 Wire boss set/delete to the canister | OPEN |
| 004 Retire `longHorizonSim` private kit copy | OPEN |
| 005 Ban or guard unused `admin-api.mo` mixin | OPEN |
| 006 Do not label unused `spriteUrl` as live | **PARTIAL** — `adminVisualStatus.ts`. Full controls remain EBA-017 + VAL |

### EBA-2026-09-02-001 … 002

| ID | Status |
| :--- | :--- |
| 001 Do not treat `levelMax = 9999` as unbounded | OPEN — hint still teaches 9999 as “high-level play still matches” |
| 002 `summonUnitDef.level ≤ 99` is a template-size rail | OPEN — Motoko 441–442 **and** `adminSafety.ts` 638–640. Do not raise 99 → 999. |

### EBA-2026-09-21-001

| ID | Status |
| :--- | :--- |
| 001 Drive EnemyDefinition spawn through `spawnPolicy.ts` | OPEN — **not on `main`**; covered by [PR #360](https://github.com/Mr-Melic/stralt/pull/360). Do not re-file. |

### EBA-2026-09-22 / 09-23 / 09-24 / 09-25 / 09-26 / 09-27 / 09-28 / 09-29 / 10-21 / 10-22 / 10-23 / 10-24 / 10-25 / 10-26 / 10-27 / 10-28

No IDs. Ledgers on [PR #404](https://github.com/Mr-Melic/stralt/pull/404), [PR #449](https://github.com/Mr-Melic/stralt/pull/449), [PR #507](https://github.com/Mr-Melic/stralt/pull/507), [PR #561](https://github.com/Mr-Melic/stralt/pull/561), [PR #621](https://github.com/Mr-Melic/stralt/pull/621), [PR #660](https://github.com/Mr-Melic/stralt/pull/660), [PR #746](https://github.com/Mr-Melic/stralt/pull/746), [PR #792](https://github.com/Mr-Melic/stralt/pull/792), [PR #817](https://github.com/Mr-Melic/stralt/pull/817), [PR #876](https://github.com/Mr-Melic/stralt/pull/876), [PR #929](https://github.com/Mr-Melic/stralt/pull/929), [PR #980](https://github.com/Mr-Melic/stralt/pull/980), [PR #1044](https://github.com/Mr-Melic/stralt/pull/1044), [PR #1111](https://github.com/Mr-Melic/stralt/pull/1111), [PR #1163](https://github.com/Mr-Melic/stralt/pull/1163), and [PR #1218](https://github.com/Mr-Melic/stralt/pull/1218). Do not re-file empty records for those dates. Do not invent 09-30 … 10-20 ledgers for the silent gap.

---

## 4. Owner studio still required (unchanged)

The 2026-08-31 contract is still the owner studio. Do not implement it from this file.

**Enemy management**

| Area | Required fields / behaviour |
| :--- | :--- |
| Identity | name, family, role, active/inactive |
| Gameplay | base stats, scaling formulas, relative-level behaviour, rewards through `applyRewards` |
| AI | authored profile, sophistication, tactical modules — no name / piece / family heuristics |
| Spell pools | CORE / ADVANCED / RARE / ELITE / SIGNATURE (consume SDA) |
| Spell discovery | player learnable? observation required? acquisition sources? |
| Variants | base / veteran / elite / champion / rare / future |
| Spawning | relative-level eligibility, rarity, probability weighting, environment / dungeon / Boss Rush, formations, elite chance |

Prefer relative offsets, probability curves, eligibility thresholds, and scalable formulas over finite maximum-level ranges.

**Boss management** (where applicable): identity, scaling (`levelOffset` + `getBossEffectiveStats` in combat), authored AI, phases, spells, summons, arena mechanic ids, discoverable spells, mastery objectives, rewards.

**Visual configuration** (never invalidates gameplay)

- DEFAULT VISUAL = built-in / generated pixel design.
- CUSTOM VISUAL = `none` / specific asset / asset pool. Default **NONE** → default pixel visual.
- Controls: Use Default Pixel Visual / Select Uploaded Visual / Select Visual Pool / Preview / Manage Assets.
- Category-specific upload specification beside the controls.
- Bosses may use `boss_large`. Missing custom art falls back to the built-in pixel design the next frame.
- Occupancy, pathing, range, and rewards stay tile-based (consume VAL).

**Lifecycle:** DRAFT → VALIDATE → PREVIEW → ACTIVATE. Support cloning, comparison, deactivation, and rollback. Soft-retire; do not hard-delete live ids.

Validation before activate: required fields, AI/spell compatibility, SpellConfig, spawn rules, rewards, visual fallback, render profile, references, encounter compatibility. Preview/validate owner-typed player levels 1, 80, 800, 8000, 10000 — never a career cap.

Consume the 08-31 contract.

---

## 5. New ACTION_IDs (this run)

**None.** Ledger: [`ACTION_IDS_ENEMY_BOSS_ADMIN_2026-10-29.md`](./ACTION_IDS_ENEMY_BOSS_ADMIN_2026-10-29.md).
