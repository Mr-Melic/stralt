# ACTION_IDs — 2026-09-24 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41 / FUT-54…59), [`docs/ENEMY_AI_EVOLUTION_2026-09-24.md`](../ENEMY_AI_EVOLUTION_2026-09-24.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010, AEE-2026-09-22-001…007, or AEE-2026-09-23-001…007. Those ids belong to PRs #351, #416, and #458.

Open production slices (do not duplicate in this docs PR):

- [#495](https://github.com/Mr-Melic/stralt/pull/495) — AI-SYS-34 apply `playerPositionRef`
- [#498](https://github.com/Mr-Melic/stralt/pull/498) — AI-SYS-45 boss kit aim is not a walk dest

## Still-open IDs (line numbers confirmed 2026-09-24; not re-filed)

| ACTION_ID | Live evidence (2026-09-24) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` `combatMath.ts` 36–52. Spawn WX **5823**. Family second roll WX **5865**. Gates WX **15507** / **15594**. |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715**. Ally heal WX **16648**. `enemyAI.ts` has **zero** `currentAp`/`currentMp`/`apCost` reads. Failed ally `targetId` uses this fallback (SYS-42). |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. |
| `AEE-2026-09-01-005` | Focus setter; `scoreTargets` unread; prepend 1682–1690. Shared ref SYS-44. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map()`. |
| `AEE-2026-09-02-002` | Summon occupied empty WX **15156**. |
| `AEE-2026-09-21-002` | Healer Chebyshev-only 1099–1100. |
| `AEE-2026-09-21-004` | `findKitSpell` assigned fallback 1741–1745. |
| `AEE-2026-09-22-002` | Apply `playerPosition` WX **16438** (open #495). |
| `AEE-2026-09-23-002` | `getEffectiveStat` is `getStatModifier` WX **16347–16348**. |
| `AEE-2026-09-23-003` | `decideHealer` `healAmount` 1095–1097. |

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21-002 / 004, 09-22-002 / 003, 09-23-001…005. Then this file’s 001–006. Do not start FUT-60/65 first.

---

ACTION_ID: AEE-2026-09-24-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Failed ally heal/buff `targetId` falls through to Crush / Fire Bolt the ward  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `decideHealer` 1103–1112 sets `targetId` to the wounded ally. Apply 16432–16439 resolves any non-player id and sets `isSummonTarget`. Heal apply requires `spellType === "heal" && spellRange === 0` (16648). Fallback 16704–16715 then Crush/`e-firebolt` via `enemyTakesDamage` on that ally when `nd <= 1`. Guardian shield 2136–2144 has the same shape. SYS-38 is the picker; this is the fallback.  
RECOMMENDED_ACTION: AI-SYS-42. Opponent-only fallback. Pair with AEE-2026-08-31-002 (delete `e-firebolt`).  
DEPENDENCIES: AEE-2026-08-31-002  
REGRESSION_RISK: HIGH if ally-targeted casts keep using the melee pool  
VALIDATION_REQUIRED: TS-ALLYFB  
STATUS: NEW

ACTION_ID: AEE-2026-09-24-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Dest-commit is clamp-only; enemies skip lava/ice/spikes/thorn the player pays  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `enemyDestToCommit` `battleSetup.ts` 394–406. WX 16421–16423 `updateCombatant`. Player thorn/rift `battleWalkHazardDamages` 317–329 / WX 9906. Player lava/ice/spikes WX 11424–11483. `filterHazardCandidates` only if HP < 50% (enemyAI.ts 425–441). Erratic dest 15590.  
RECOMMENDED_ACTION: AI-SYS-43. Shared walk-hazard helper; decide uses expected cost, not the HP roll.  
DEPENDENCIES: AEE-2026-08-31-002 (no Fire Bolt if they die on lava); SYS-15 path length  
REGRESSION_RISK: MEDIUM if ice Frozen is applied to the player instead of the walker  
VALIDATION_REQUIRED: TS-LAVAWALK  
STATUS: NEW

ACTION_ID: AEE-2026-09-24-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack and player-summon decide share `focusTargetRef`  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: WX 15190–15196 (summon) and 16352–16358 (pack). TEM-01 / SYS-08 will read this. `findHealerSummon` prepend 1682–1690 is not a reader.  
RECOMMENDED_ACTION: AI-SYS-44. Per-side blackboard before SYS-08 consumption.  
DEPENDENCIES: AEE-2026-09-01-005  
REGRESSION_RISK: MEDIUM if one side’s focus steals the other  
VALIDATION_REQUIRED: TS-FOCUSSIDE  
STATUS: NEW

ACTION_ID: AEE-2026-09-24-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Boss kit `targetX/Y` is used as a walk dest (teleport onto the player)  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `useBossAI.ts` kit casts set `targetX: player?.x` (179, 257, 329). Apply commits that tile onto the boss. `pickBossKitSpell` still `new Map()` (38–54, comment 34–36). Open PR #498 is the apply lock. `getWalkableMoves` hardcodes 16 (`WORLD_GRID_SIZE` is 16 today).  
RECOMMENDED_ACTION: AI-SYS-45. Aim ≠ walk. Do not copy #498 into a docs PR.  
DEPENDENCIES: AEE-2026-09-01-008; AEE-2026-09-02-004 (SYS-16)  
REGRESSION_RISK: HIGH if tagged Cavalier jump is blocked as a side effect  
VALIDATION_REQUIRED: TS-BOSSAIM  
STATUS: NEW

ACTION_ID: AEE-2026-09-24-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Boss `enemiesForBossAI` snapshot hardcodes `ap: 3, mp: 3, res: 0, sp: 0`  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 15444–15448. Player row copies live AP/MP (15415–15416). SYS-07 forbids silent budget 3. SYS-21 was minion spawn zeros.  
RECOMMENDED_ACTION: AI-SYS-46. Live visible stats from `getLiveCombatants`. Missing ⇒ 0, not 3.  
DEPENDENCIES: AEE-2026-09-01-004; AEE-2026-09-23-002  
REGRESSION_RISK: MEDIUM if dummy 3 was masking missing fields  
VALIDATION_REQUIRED: TS-BOSSAP  
STATUS: NEW

ACTION_ID: AEE-2026-09-24-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Apply range after dest-commit is Chebyshev only (no LoS)  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 16450–16456. Decide uses `enemyCastGeometryOk` / `aiCanCast` (`targeting.ts` 166–177, `enemyAI.ts` 320–332). `closes-in` 1618–1626 emits `kind: "cast"` from dest. Failed cast still Fire-Bolts (16710).  
RECOMMENDED_ACTION: AI-SYS-47. Re-check acting-side geometry from `{newX,newY}`. Pair with SYS-42.  
DEPENDENCIES: AEE-2026-09-02-001 (SYS-13 helper); AEE-2026-08-31-002  
REGRESSION_RISK: LOW if `lineOfSight === false` ids still skip LoS  
VALIDATION_REQUIRED: TS-APPLYLOS  
STATUS: NEW

ACTION_ID: AEE-2026-09-24-007  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: T6+ spread vs player bomber, visible bar CD, leftover AP, artillery range lock, buff hygiene, portal choke  
CATEGORY: combat-ai  
PRIORITY: P3  
CONFIDENCE: MEDIUM  
EVIDENCE: `AI_KAMIKAZE_BLAST_RADIUS` is pack-unsafe (FUT-58). Player bar CD is public; full book is not. `ENEMY_AI_TIER_GATES.chokepointCamp` unread (`gameConstants.ts` 205). Guardian recast comment 2121–2127. Generic adjacent melee 1583–1598.  
RECOMMENDED_ACTION: AI-FUT-60…65 after SYS-05 / SYS-42 / SYS-43 / SYS-44. Never `if (level >= X)` or `if (aiTier >= 3)`.  
DEPENDENCIES: AEE-2026-08-31-002; AEE-2026-09-24-001…006  
REGRESSION_RISK: HIGH if bomber radius leaks to pack Inferno; HIGH if bar scan reads the owned book  
VALIDATION_REQUIRED: TS-BLASTSPREAD, TS-BARCD, TS-LEFTAP, TS-ARTMELEE, TS-SHIELD2, TS-CHOKE  
STATUS: NEW
