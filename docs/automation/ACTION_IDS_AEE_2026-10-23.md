# ACTION_IDs — 2026-10-23 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41 / FUT-54…59), [`docs/ENEMY_AI_EVOLUTION_2026-09-24.md`](../ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47 / FUT-60…65), [`docs/ENEMY_AI_EVOLUTION_2026-09-25.md`](../ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53 / FUT-66…71), [`docs/ENEMY_AI_EVOLUTION_2026-09-26.md`](../ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59 / FUT-72…77), [`docs/ENEMY_AI_EVOLUTION_2026-09-27.md`](../ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65 / FUT-78…83), [`docs/ENEMY_AI_EVOLUTION_2026-09-28.md`](../ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71 / FUT-84…89), [`docs/ENEMY_AI_EVOLUTION_2026-09-29.md`](../ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77 / FUT-90…95), [`docs/ENEMY_AI_EVOLUTION_2026-10-21.md`](../ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83 / FUT-96…101), [`docs/ENEMY_AI_EVOLUTION_2026-10-22.md`](../ENEMY_AI_EVOLUTION_2026-10-22.md) (open PR #874; SYS-84…89 / FUT-102…107), [`docs/ENEMY_AI_EVOLUTION_2026-10-23.md`](../ENEMY_AI_EVOLUTION_2026-10-23.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010, AEE-2026-09-22-001…007, AEE-2026-09-23-001…007, AEE-2026-09-24-001…007, AEE-2026-09-25-001…007, AEE-2026-09-26-001…006, AEE-2026-09-27-001…006, AEE-2026-09-28-001…006, AEE-2026-09-29-001…006, AEE-2026-10-21-001…006, or AEE-2026-10-22-001…006. Those ids belong to PRs #351, #416, #458, #506, #565, #633, #689, #723, #804, #821, and #874.

Open production slices (do not duplicate in this docs PR):

- [#495](https://github.com/Mr-Melic/stralt/pull/495) — AI-SYS-34 apply `playerPositionRef`
- [#498](https://github.com/Mr-Melic/stralt/pull/498) — AI-SYS-45 boss kit aim is not a walk dest
- [#487](https://github.com/Mr-Melic/stralt/pull/487) — betrayal death pipeline (spectacle, not a tactic)
- [#644](https://github.com/Mr-Melic/stralt/pull/644) — player drain-as-lifesteal (not an AI module)
- [#647](https://github.com/Mr-Melic/stralt/pull/647) — Soul Rend apply
- [#649](https://github.com/Mr-Melic/stralt/pull/649) — Trap tile legality
- [#654](https://github.com/Mr-Melic/stralt/pull/654) — void-hole live gate
- [#658](https://github.com/Mr-Melic/stralt/pull/658) — catalog RES/SP shreds in `getStatModifier`
- [#659](https://github.com/Mr-Melic/stralt/pull/659) — Shield RES on melee (distinct from SYS-63 / SYS-66 / SYS-68)
- [#700](https://github.com/Mr-Melic/stralt/pull/700) — player auto-summon kit metadata
- [#709](https://github.com/Mr-Melic/stralt/pull/709) — Sentinel Shield on clicked ally (player, not pack SYS-05)
- [#821](https://github.com/Mr-Melic/stralt/pull/821) — 2026-10-21 design increment (SYS-78…83)
- [#842](https://github.com/Mr-Melic/stralt/pull/842) — hostile summon kit + `decideSummonAction` (SYS-88 writer / SYS-55 routing). **Do not re-implement.**
- [#861](https://github.com/Mr-Melic/stralt/pull/861) — player auto-summon empty kit (not pack SYS-90)
- [#874](https://github.com/Mr-Melic/stralt/pull/874) — 2026-10-22 design increment (SYS-84…89)
- [#911](https://github.com/Mr-Melic/stralt/pull/911) — pack kit starter fallback when Motoko catalog misses ids (SYS-90 writer). **Do not re-implement.**
- [#924](https://github.com/Mr-Melic/stralt/pull/924) — WX enemy heal execute advertised CHC (SYS-95 writer). **Do not re-implement.** Sidecar only.

## Still-open IDs (line numbers confirmed 2026-10-23; not re-filed)

| ACTION_ID | Live evidence (2026-10-23) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` `combatMath.ts` 36–52. Spawn WX **5823**. Family second roll WX **5865**. Gates WX **15507** / **15594**. |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715** (`e-firebolt` at **16712**). Ally heal WX **16648**. `enemyAI.ts` has **zero** `currentAp`/`currentMp`/`apCost` reads. Fallback also uses `level/5` (**16716–16720**) — SYS-72. Empty Motoko kits (SYS-90) currently *only* hit this path. |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. Comment still “10 random spells” (**11915**). Id lookup is SYS-90. |
| `AEE-2026-09-01-005` | Focus setter; `scoreTargets` unread. |
| `AEE-2026-09-01-007` | Summoner chance WX **11932–11943**; skip **1857–1887**. Skip-brain is AEE-2026-10-22-006. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map<string, number>()` (`useBossAI.ts` 169–173). |
| `AEE-2026-09-02-002` | Summon occupied empty WX **15156**. |
| `AEE-2026-09-21-002` | Healer Chebyshev-only 1099–1100. Self-vs-ally is AEE-2026-10-23-002. |
| `AEE-2026-09-21-004` | `findKitSpell` assigned fallback 1737–1745. |
| `AEE-2026-09-22-002` | Apply `playerPosition` WX **16436–16438** (open #495). |
| `AEE-2026-09-24-001` | Ally `targetId` fallback Crush/Fire Bolt 16704–16715. |
| `AEE-2026-09-26-001` | Strip / `resolveEnemyApMp` AP=`level` WX **17402–17411**. |
| `AEE-2026-09-26-002` | Hostile summons skip executor (still SYS-55). #842 routes decide only. |
| `AEE-2026-09-27-006` | FUT-83 pack healer `pickBestAlly` — still `allies.find(!isSummon)` at **1142**. Do not re-file. |
| `AEE-2026-09-28-001` | SYS-66 double RES + shield on pack→player spells. |
| `AEE-2026-09-28-002` | SYS-67 `enemyTakesDamage` return vs store. |
| `AEE-2026-09-28-003` | SYS-68 melee private write. |
| `AEE-2026-09-29-001` | SYS-72 kit vs Crush/`level/5` formulas. |
| `AEE-2026-09-29-002` | SYS-73 spawn `maxTier` from 999 (`combatMath.ts` 54–58). |
| `AEE-2026-09-29-005` | SYS-76 pack leftover `maxHp`. Scorer still ignores maxHp — AEE-2026-10-22-001. |
| `AEE-2026-10-21-001` | SYS-78 pack vs summon player maxHp snapshot fork. |
| `AEE-2026-10-21-002` | SYS-79 `pickBestDamageSpell` origin-range. Frost live range is **4** (`spellData.ts` 131). |
| `AEE-2026-10-21-003` | SYS-80 pack `scoreTargets(..., null)` Crush ranking. |
| `AEE-2026-10-21-004` | SYS-81 spill Crush stamp. Geometry of retarget is AEE-2026-10-22-002. |
| `AEE-2026-10-21-005` | SYS-82 apply `enemy.chc` vs strip `chc: 2`. |
| `AEE-2026-10-21-006` | SYS-83 raw `allyCount` includes player summons. |
| `AEE-2026-10-22-001` | SYS-84 `wLowHp` `effectiveHp ?? hp` (`enemyAI.ts` 341–342, 540). |
| `AEE-2026-10-22-002` | SYS-85 lookahead/spill skip `aiCanCast`. |
| `AEE-2026-10-22-003` | SYS-86 summoner midpoint; wolf range 2. |
| `AEE-2026-10-22-004` | SYS-87 `stepFlank` tackle = all adjacent. |
| `AEE-2026-10-22-005` | SYS-88 hostile `summonAI = pieceType` (open #842). |
| `AEE-2026-10-22-006` | SYS-89 `isSummoner` skip eats the piece kit. |

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21…10-22 honesty. Then this file’s 001–006. Do not start FUT-108 first. Do not implement SYS-59’s “pack immunity.” Do not add `enemy.level` into `calcScaledDamage` as an AI slice. Do not copy #842 / #911 / #924. Do not re-file FUT-83. Do not emit Motoko `shadow_strike` as bishop frost.

---

ACTION_ID: AEE-2026-10-23-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack kit ids miss Motoko `defaultSpells`; bishops ship `spells: []` then Fire Bolt  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `assignEnemySpells` WX **11919–11923** looks up `buildEnemyKit` ids only in `normalizedSpellPool`. Pool is Motoko catalog when `filteredBackendSpells.length > 0` (WX **2688–2701**). `AdminLib.defaultSpells()` (`admin.mo` **168–191**) has no `starter-frost` / `physical_attack` / `starter-heal`. Empty kit → generic decide → WX **16712** `e-firebolt`. SYS-09 is the NaN zone floor, not the missing id. Open **#911** is the writer — do not re-implement. Do not substitute `shadow_strike` (`diagonal` / `minRange` / `lineOfSight: false`).  
RECOMMENDED_ACTION: AI-SYS-90 + FUT-109. Union starter/kit registry with the live catalog. Prefer merge/follow #911.  
DEPENDENCIES: AEE-2026-08-31-002 (no bolt on empty kit); AEE-2026-09-01-003 (SYS-09 zone key still separate)  
REGRESSION_RISK: HIGH if Motoko extras are emitted as kit substitutes before SYS-13  
VALIDATION_REQUIRED: TS-KITPOOL, TS-KITBOLT, TS-SHADOW, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-23-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Blood Mend is `targetType: "self"` range 0; healer decide targets other allies  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `starter-heal` `spellData.ts` **85–101** (`self`, range 0, heal 12 + CHC). `allies` exclude the acting unit (`enemyAI.ts` **1674–1676**). `decideHealer` **1092–1112** requires Chebyshev ≤ 0 to a *different* ally. Queen heal-first (SYS-04) never self-heals; falls through to `decideCaster` **1166–1168**. Wisp `decideSummonHealer` **2481–2519** is the same. Apply self-heal WX **16648** never runs. Rallying Cry is also self range 0 and `usableByEnemy: false` (SYS-41). FUT-83 is the idle ward; FUT-55 is idle-vs-caster.  
RECOMMENDED_ACTION: AI-SYS-91 + FUT-108. Self spells target the caster. Ally-heal ids (none today) stay FUT-83 / SYS-05.  
DEPENDENCIES: AEE-2026-08-31-002 (no bolt on failed ally dest); SYS-04 (queen role)  
REGRESSION_RISK: MEDIUM if range-0 is widened to allies (rebalance vs player Blood Mend)  
VALIDATION_REQUIRED: TS-SELFHEAL, TS-WISPSELF, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-23-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `stepToward` / `stepFlank` / legal-cast dests never call `filterHazardCandidates`  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `filterHazardCandidates` (`enemyAI.ts` **425–441**) is used only by `stepAway` (**630**). `stepToward` **579–611**, `stepFlank` **643–679**, `findNearestLegalCastTile` **787–824**, `repositionForLOS` **749–768** dest-commit onto lava. Caster `closes-in` **1005–1047** is the live move-then-cast path. SYS-43 is apply paying dest hazards; POS-04 is the 50% gate.  
RECOMMENDED_ACTION: AI-SYS-92 + FUT-110. Run the public hazard filter on every walker dest. Prefer floor.  
DEPENDENCIES: SYS-43 (apply still bills dest); SYS-58 (occupancy); SYS-05 (no bolt on lava Chebyshev 1)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-HVAPPR  
STATUS: NEW

ACTION_ID: AEE-2026-10-23-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Caster retreat uses `opponents[0]` (snapshot order / wisp prepend), not nearest threat  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `decideCaster` **928–944** `nearest = opponents[0]` before `scoreTargets`. Pack snapshot pushes player last (WX **16274–16302**). SYS-30 prepends wisp (**1682–1690**). `stepAway` from a backline summon can walk onto the adjacent player → SYS-05 Fire Bolt. Flanker/generic retreat uses scored[0], still not nearest-in-melee.  
RECOMMENDED_ACTION: AI-SYS-93 + FUT-111. Retreat threat = min Chebyshev living opponent. `kind: "move"`. No prepend axis.  
DEPENDENCIES: POS-02 / FUT-41 (`kind` skip); SYS-05; SYS-30 (delete prepend, do not reuse for retreat)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-RETNEAR, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-23-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Archer kite uses magic `MIN_KITE_RANGE = 3`; poison live range is 4  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `decideSummonArcher` **2324–2331**. `starter-poison` range **4** (`spellData.ts` **56**); `spell-slow` range **3** (**360**). Too-close band ignores `enemySpellRange` / `minRange`. `enemyCastGeometryOk` already uses `enemySpellRange`. FUT-54 is strafe; FUT-100 is Attack-Nearest.  
RECOMMENDED_ACTION: AI-SYS-94 + FUT-112. Kite band from assigned spell metadata. Delete the constant. Not `if (level >= X)`.  
DEPENDENCIES: SYS-02 (profile); SYS-39 (poison EV still 0 until DoT scoring)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-KITE4, TS-KITE2  
STATUS: NEW

ACTION_ID: AEE-2026-10-23-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Range-0 heal apply drops advertised `buffStat` CHC (Blood Mend / Rally)  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Blood Mend `buffStat: "chc"` 0.15 / 2 (`spellData.ts` **96–98**); Rallying Cry **428–430**. WX **16648–16670** `hpAfterHeal` then return. Decide never emits self-heal today (002). Open **#924** sidecar `wxEnemyHealBuffExecute` — do not re-implement; do not restack WX. Scoring must not add CHC EV until apply writes it.  
RECOMMENDED_ACTION: AI-SYS-95 + FUT-113. Prefer merge/follow #924. Then SYS-10 snapshot for FUT-64 recast hygiene.  
DEPENDENCIES: AEE-2026-10-23-002 (decide must emit self-heal); SYS-05 apply honesty  
REGRESSION_RISK: MEDIUM if CHC is treated as a heal-crit roll (SYS-82) instead of `buffStat`  
VALIDATION_REQUIRED: TS-HEALCHC  
STATUS: NEW
