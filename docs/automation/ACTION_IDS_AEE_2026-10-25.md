# ACTION_IDs — 2026-10-25 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41 / FUT-54…59), [`docs/ENEMY_AI_EVOLUTION_2026-09-24.md`](../ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47 / FUT-60…65), [`docs/ENEMY_AI_EVOLUTION_2026-09-25.md`](../ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53 / FUT-66…71), [`docs/ENEMY_AI_EVOLUTION_2026-09-26.md`](../ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59 / FUT-72…77), [`docs/ENEMY_AI_EVOLUTION_2026-09-27.md`](../ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65 / FUT-78…83), [`docs/ENEMY_AI_EVOLUTION_2026-09-28.md`](../ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71 / FUT-84…89), [`docs/ENEMY_AI_EVOLUTION_2026-09-29.md`](../ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77 / FUT-90…95), [`docs/ENEMY_AI_EVOLUTION_2026-10-21.md`](../ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83 / FUT-96…101), [`docs/ENEMY_AI_EVOLUTION_2026-10-22.md`](../ENEMY_AI_EVOLUTION_2026-10-22.md) (open PR #874; SYS-84…89 / FUT-102…107), [`docs/ENEMY_AI_EVOLUTION_2026-10-23.md`](../ENEMY_AI_EVOLUTION_2026-10-23.md) (open PR #958; SYS-90…95 / FUT-108…113), [`docs/ENEMY_AI_EVOLUTION_2026-10-24.md`](../ENEMY_AI_EVOLUTION_2026-10-24.md) (open PR #999; SYS-96…101 / FUT-114…119), [`docs/ENEMY_AI_EVOLUTION_2026-10-25.md`](../ENEMY_AI_EVOLUTION_2026-10-25.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010, AEE-2026-09-22-001…007, AEE-2026-09-23-001…007, AEE-2026-09-24-001…007, AEE-2026-09-25-001…007, AEE-2026-09-26-001…006, AEE-2026-09-27-001…006, AEE-2026-09-28-001…006, AEE-2026-09-29-001…006, AEE-2026-10-21-001…006, AEE-2026-10-22-001…006, AEE-2026-10-23-001…006, or AEE-2026-10-24-001…006. Those ids belong to PRs #351, #416, #458, #506, #565, #633, #689, #723, #804, #821, #874, #958, and #999.

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
- [#947](https://github.com/Mr-Melic/stralt/pull/947) — WX enemy DoT execute advertised ticks (complements SYS-96)
- [#967](https://github.com/Mr-Melic/stralt/pull/967) — pack DoT decide vs `pickBestDamageSpell` (not healer approach SYS-103)
- [#972](https://github.com/Mr-Melic/stralt/pull/972) — Inferno cooldown outside `damage > 0`
- [#974](https://github.com/Mr-Melic/stralt/pull/974) — pack buff execute advertised `buffStat`
- [#978](https://github.com/Mr-Melic/stralt/pull/978) — pack buff decide vs `pickBestDamageSpell` (Iron Skin leftover)
- [#985](https://github.com/Mr-Melic/stralt/pull/985) — pack self-heal when no wounded ally (SYS-107 writer). **Do not re-implement.**
- [#989](https://github.com/Mr-Melic/stralt/pull/989) — empty-damage heal picker once `decideCaster` is reached (not SYS-102)
- [#958](https://github.com/Mr-Melic/stralt/pull/958) — 2026-10-23 design increment (SYS-90…95)
- [#999](https://github.com/Mr-Melic/stralt/pull/999) — 2026-10-24 design increment (SYS-96…101)
- [#1026](https://github.com/Mr-Melic/stralt/pull/1026) — healer approach vs Frost leftover detector (SYS-102). Sidecar only; **do not copy no-LoS/no-AP policy.**
- [#1033](https://github.com/Mr-Melic/stralt/pull/1033) — healer approach vs Inferno leftover detector (SYS-103)
- [#1034](https://github.com/Mr-Melic/stralt/pull/1034) — healer backline-guard vs Frost leftover detector (SYS-104)
- [#1039](https://github.com/Mr-Melic/stralt/pull/1039) — healer backline-guard vs Inferno leftover detector (SYS-105)

## Still-open IDs (line numbers confirmed 2026-10-25; not re-filed)

| ACTION_ID | Live evidence (2026-10-25) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` `combatMath.ts` 36–52. Spawn WX **5823**. Family second roll WX **5865**. Gates WX **15507** / **15594**. |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715** (`e-firebolt` at **16712**). Ally heal WX **16648**. `enemyAI.ts` has **zero** `currentAp`/`currentMp`/`apCost` reads. Healer approach / idle guard / failed Inferno currently *also* hit this path — SYS-102…105. |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. Comment still “10 random spells” (**11915**). Id lookup is SYS-90. |
| `AEE-2026-09-01-005` | Focus setter; `scoreTargets` unread. |
| `AEE-2026-09-01-007` | Summoner chance WX **11932–11943**; skip **1857–1887**. Skip-brain is AEE-2026-10-22-006. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map<string, number>()` (`useBossAI.ts` 169–173). |
| `AEE-2026-09-02-002` | Summon occupied empty WX **15156**. |
| `AEE-2026-09-21-002` | Healer Chebyshev-only 1099–1100. Self-vs-ally is AEE-2026-10-23-002. Approach leftover is AEE-2026-10-25-001. |
| `AEE-2026-09-21-004` | `findKitSpell` assigned fallback 1737–1745. |
| `AEE-2026-09-22-002` | Apply `playerPosition` WX **16436–16438** (open #495). |
| `AEE-2026-09-24-001` | Ally `targetId` fallback Crush/Fire Bolt 16704–16715. |
| `AEE-2026-09-26-001` | Strip / `resolveEnemyApMp` AP=`level` WX **17402–17411**. |
| `AEE-2026-09-26-002` | Hostile summons skip executor (still SYS-55). #842 routes decide only. Bomber therefore hits SYS-106 on the pack apply path. |
| `AEE-2026-09-27-006` | FUT-83 pack healer `pickBestAlly` — still `allies.find(!isSummon)` at **1142**. Do not re-file. SYS-104 is the *branch order* vs `decideCaster`. |
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
| `AEE-2026-10-22-004` | SYS-87 `stepFlank` tackle = all adjacent. Fallback `stepToward` inherits SYS-97. |
| `AEE-2026-10-22-005` | SYS-88 hostile `summonAI = pieceType` (open #842). |
| `AEE-2026-10-22-006` | SYS-89 `isSummoner` skip eats the piece kit. |
| `AEE-2026-10-23-001` | SYS-90 Motoko catalog drops starter kit ids (open #911). |
| `AEE-2026-10-23-002` | SYS-91 Blood Mend self range 0; healer decide targets allies. Approach swallowing Frost is AEE-2026-10-25-001, not a re-file. Self missing from `allies` is AEE-2026-10-25-006. |
| `AEE-2026-10-23-003` | SYS-92 `stepToward` never calls `filterHazardCandidates`. |
| `AEE-2026-10-23-004` | SYS-93 caster retreat `opponents[0]`. Interpose sites are AEE-2026-10-24-005. |
| `AEE-2026-10-23-005` | SYS-94 archer `MIN_KITE_RANGE = 3` vs poison range 4. |
| `AEE-2026-10-23-006` | SYS-95 range-0 heal drops advertised CHC (open #924). |
| `AEE-2026-10-24-001` | SYS-96 pack DoT writer nested under `damage > 0`. Queen/bomber Inferno still needs this write *and* SYS-103/105/106 decide. |
| `AEE-2026-10-24-002` | SYS-97 `stepToward` Set-order fallback. Healer approach inherits it. |
| `AEE-2026-10-24-003` | SYS-98 guardian Iron Skin preempts Shield approach. |
| `AEE-2026-10-24-004` | SYS-99 wisp Rally self vs ally. |
| `AEE-2026-10-24-005` | SYS-100 interpose `opponents[0]`. SYS-104 is branch order vs nuke, not this picker. |
| `AEE-2026-10-24-006` | SYS-101 range>1 buff/DoT → caster. Queen is healer from SYS-04, not this branch. |

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21…10-24 honesty. Then this file’s 001–006. Do not start FUT-120 first. Do not implement SYS-59’s “pack immunity.” Do not add `enemy.level` into `calcScaledDamage` as an AI slice. Do not copy #842 / #911 / #924 / #985 / #989 / #999 / #1026 / #1033 / #1034 / #1039. Do not re-file FUT-83, SYS-04, SYS-39, SYS-91, SYS-93, SYS-96, SYS-100, or SYS-101. Do not emit Motoko `thunder_clap` as a bomber blast. Do not bless #1026’s no-LoS/no-AP detector as shipped policy.

---

ACTION_ID: AEE-2026-10-25-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Heal-first queen `decideHealer` approach-ally swallows in-range Frost, then dest-commit Fire-Bolts  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `inferArchetype` heal-first **447–452** (SYS-04). Queen z≥1 kit `[starter-frost, starter-heal]` **176–179**. `decideHealer` wounded *other* ally **1092–1097**; Chebyshev ≤ `enemySpellRange` **1099–1100**. Blood Mend `range: 0` / `targetType: "self"` (`spellData.ts` **85–101**). Approach-ally **1114–1132** returns `kind: "move"` even if dest === origin and never reaches `decideCaster` **1165–1168**. Frost `damage: 20` range 4 (`spellData.ts` **124–140**) would win `pickBestDamageSpell`. Adjacent `!didAct` → `e-firebolt` WX **16712**. Open #1026 sidecar detects this leftover with no LoS / no AP to match live WX. SYS-91 is the in-range wrong dest, not this walk.  
RECOMMENDED_ACTION: AI-SYS-102 + FUT-120. Prefer merge/follow #1026 leftover detection; restack `decideHealer` with `aiCanCast` + SYS-05 debit. Do not walk toward an unhealable Blood Mend dest. Never bolt.  
DEPENDENCIES: AEE-2026-08-31-002 (no bolt); AEE-2026-10-23-002 (SYS-91 self vs ally); AEE-2026-08-31-003 (SYS-04 heal-first, separate)  
REGRESSION_RISK: HIGH if Blood Mend range 0 is widened to allies (rebalance vs player Mend); HIGH if Frost skips LoS  
VALIDATION_REQUIRED: TS-HEALFROST, TS-WALKALLY, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-25-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Heal-first queen approach-ally swallows Inferno (`damage: 0`) into a Fire Bolt  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Queen z≥2 kit `[spell-inferno, starter-heal]` **176–179**. Inferno `damage: BigInt(0)`, `areaRadius: 0`, `dotDamagePerTurn: 8` (`spellData.ts` **502–522**). Approach **1114–1132** never reaches `pickBestDamageSpell`, which would drop Inferno anyway (SYS-02 / SYS-39). SYS-96 apply nest still drops it. Adjacent Fire Bolt WX **16712**. Open #1033 sidecar. Distinct from #967 pack DoT *decide* for hunter/archer. 10-24 SYS-96 deferred healer-kit Inferno *choose*.  
RECOMMENDED_ACTION: AI-SYS-103 + FUT-121. After SYS-96 writes public burn, emit Inferno instead of approach. Until then skip — never bolt, never radius-2 splash (`AI_KAMIKAZE_BLAST_RADIUS` is SYS-106). Prefer follow #1033.  
DEPENDENCIES: AEE-2026-10-24-001 (SYS-96 apply write); AEE-2026-10-25-001 (same approach branch); AEE-2026-08-31-002  
REGRESSION_RISK: HIGH if Inferno is given radius-2 splash the card does not have  
VALIDATION_REQUIRED: TS-HEALINF, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-25-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack healer backline-guard runs before `decideCaster` and preempts in-range Frost  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `decideHealer` idle block **1134–1164** `backlineGuardCell` then **1165–1168** `decideCaster`. Guard dest `kind: "move"` skips Frost. Ward picker **1142** is FUT-83 (do not re-file). Threat `opponents[0]` **1143** is SYS-100 (do not re-file). King assigned Rally (`usableByEnemy: false`) still heal-first from `assignedSpells` (SYS-04 / SYS-41) and hits this branch when `healSpell` is missing. Open #1034 sidecar.  
RECOMMENDED_ACTION: AI-SYS-104 + FUT-122. Legal Frost (`aiCanCast` + SYS-05) outranks idle interpose. Prefer follow #1034.  
DEPENDENCIES: AEE-2026-10-24-005 (SYS-100 threat helper); AEE-2026-10-25-001 (approach is a different block); AEE-2026-08-31-002  
REGRESSION_RISK: MEDIUM if true healers lose idle guard when no nuke is in the kit  
VALIDATION_REQUIRED: TS-GUARDFROST, TS-KINGRALLY, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-25-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack healer backline-guard preempts Inferno into a dest-commit Fire Bolt  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same branch order as AEE-2026-10-25-003; kit nuke is Inferno `damage: 0`. Guard + `spell: null` → WX dest-commit **16416–16423** → `!didAct` Chebyshev 1 → `e-firebolt` **16712**. Inferno cooldown 3 (`spellData.ts` **518**). Open #1039 sidecar. SYS-96 still required to write ticks.  
RECOMMENDED_ACTION: AI-SYS-105 + FUT-121. Legal profiled Inferno outranks idle guard; otherwise skip/hold, never bolt. Prefer follow #1039 / #972 (CD).  
DEPENDENCIES: AEE-2026-10-24-001 (SYS-96); AEE-2026-10-25-003 (Frost twin); AEE-2026-08-31-002  
REGRESSION_RISK: HIGH if a rejected Inferno still Fire-Bolts  
VALIDATION_REQUIRED: TS-GUARDINF, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-25-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Bomber detonate uses private Chebyshev-2 radius and never suicides on Inferno (`damage: 0`)  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `decideSummonBomber` **2387–2393** `AI_KAMIKAZE_BLAST_RADIUS = 2` (`gameConstants.ts` **285**) because Inferno `areaRadius` is 0; emits single `targetId` **2410–2425**. `countTargetsInBlast` **869–878** therefore gates on a blast apply will not deal. Paid executor `hp = 0` only inside `damage > 0` (`summonExecutor.ts` **164–180**); Inferno falls through to `applyEffect` `"dot"` **191–208**. Hostiles skip executor (SYS-55). 10-24 SYS-96 explicitly deferred splash / self-kill.  
RECOMMENDED_ACTION: AI-SYS-106 + FUT-123. Cluster count from profiled `areaRadius` (0 ⇒ one dest). Self-destruct is a profiled flag or tagged ability. Until a real AoE id exists: single-target burn or skip, never bolt, never Motoko `thunder_clap`.  
DEPENDENCIES: AEE-2026-10-24-001 (SYS-96 write); AEE-2026-09-26-002 (hostiles skip executor); AEE-2026-08-31-002  
REGRESSION_RISK: HIGH if Inferno gains hidden radius-2 splash or a silent suicide  
VALIDATION_REQUIRED: TS-KAMI0, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-25-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack `allies` exclude self so Blood Mend never sees the only legal dest  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `decideEnemyAction` allies = `side === "enemy" && id !== enemy.id` **1674–1676**. `decideHealer` wounded filter **1092–1094** therefore omits the caster. Blood Mend is self / range 0 (`spellData.ts` **85–101**). No other wounded ally → skip heal, go guard/`decideCaster` (still no self-cast). Other wounded ally → SYS-102 walk. SYS-91 is targeting others *when a heal is emitted*. Open #985 sidecar for the no-other-wounded-ally case. Apply range-0 self-heal already exists WX **16648–16670** (CHC still SYS-95 / #924).  
RECOMMENDED_ACTION: AI-SYS-107 + FUT-125. Include the caster in the self-heal candidate set. Prefer merge/follow #985. Do not widen range 0 to allies.  
DEPENDENCIES: AEE-2026-10-23-002 (SYS-91); AEE-2026-10-23-006 (SYS-95 CHC); AEE-2026-10-25-001 (approach when another ally is wounded)  
REGRESSION_RISK: MEDIUM if self-heal always beats a lethal Frost (FUT-120 / FUT-125 weights)  
VALIDATION_REQUIRED: TS-SELFHEAL, TS-BOLT3  
STATUS: NEW
