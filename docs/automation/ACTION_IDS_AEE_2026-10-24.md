# ACTION_IDs — 2026-10-24 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41 / FUT-54…59), [`docs/ENEMY_AI_EVOLUTION_2026-09-24.md`](../ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47 / FUT-60…65), [`docs/ENEMY_AI_EVOLUTION_2026-09-25.md`](../ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53 / FUT-66…71), [`docs/ENEMY_AI_EVOLUTION_2026-09-26.md`](../ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59 / FUT-72…77), [`docs/ENEMY_AI_EVOLUTION_2026-09-27.md`](../ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65 / FUT-78…83), [`docs/ENEMY_AI_EVOLUTION_2026-09-28.md`](../ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71 / FUT-84…89), [`docs/ENEMY_AI_EVOLUTION_2026-09-29.md`](../ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77 / FUT-90…95), [`docs/ENEMY_AI_EVOLUTION_2026-10-21.md`](../ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83 / FUT-96…101), [`docs/ENEMY_AI_EVOLUTION_2026-10-22.md`](../ENEMY_AI_EVOLUTION_2026-10-22.md) (open PR #874; SYS-84…89 / FUT-102…107), [`docs/ENEMY_AI_EVOLUTION_2026-10-23.md`](../ENEMY_AI_EVOLUTION_2026-10-23.md) (open PR #958; SYS-90…95 / FUT-108…113), [`docs/ENEMY_AI_EVOLUTION_2026-10-24.md`](../ENEMY_AI_EVOLUTION_2026-10-24.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010, AEE-2026-09-22-001…007, AEE-2026-09-23-001…007, AEE-2026-09-24-001…007, AEE-2026-09-25-001…007, AEE-2026-09-26-001…006, AEE-2026-09-27-001…006, AEE-2026-09-28-001…006, AEE-2026-09-29-001…006, AEE-2026-10-21-001…006, AEE-2026-10-22-001…006, or AEE-2026-10-23-001…006. Those ids belong to PRs #351, #416, #458, #506, #565, #633, #689, #723, #804, #821, #874, and #958.

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
- [#958](https://github.com/Mr-Melic/stralt/pull/958) — 2026-10-23 design increment (SYS-90…95)

## Still-open IDs (line numbers confirmed 2026-10-24; not re-filed)

| ACTION_ID | Live evidence (2026-10-24) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` `combatMath.ts` 36–52. Spawn WX **5823**. Family second roll WX **5865**. Gates WX **15507** / **15594**. |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715** (`e-firebolt` at **16712**). Ally heal WX **16648**. `enemyAI.ts` has **zero** `currentAp`/`currentMp`/`apCost` reads. Failed damage-0 DoTs currently *also* hit this path — SYS-96. |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. Comment still “10 random spells” (**11915**). Id lookup is SYS-90. |
| `AEE-2026-09-01-005` | Focus setter; `scoreTargets` unread. |
| `AEE-2026-09-01-007` | Summoner chance WX **11932–11943**; skip **1857–1887**. Skip-brain is AEE-2026-10-22-006. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map<string, number>()` (`useBossAI.ts` 169–173). |
| `AEE-2026-09-02-002` | Summon occupied empty WX **15156**. |
| `AEE-2026-09-21-002` | Healer Chebyshev-only 1099–1100. Self-vs-ally is AEE-2026-10-23-002. |
| `AEE-2026-09-21-004` | `findKitSpell` assigned fallback 1737–1745. Wisp Rally still found that way — AEE-2026-10-24-004. |
| `AEE-2026-09-22-002` | Apply `playerPosition` WX **16436–16438** (open #495). |
| `AEE-2026-09-24-001` | Ally `targetId` fallback Crush/Fire Bolt 16704–16715. |
| `AEE-2026-09-26-001` | Strip / `resolveEnemyApMp` AP=`level` WX **17402–17411**. |
| `AEE-2026-09-26-002` | Hostile summons skip executor (still SYS-55). #842 routes decide only. Pack hunter/archer/bomber therefore hit SYS-96. |
| `AEE-2026-09-27-006` | FUT-83 pack healer `pickBestAlly` — still `allies.find(!isSummon)` at **1142**. Do not re-file. SYS-100 is the threat next to that ward. |
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
| `AEE-2026-10-23-002` | SYS-91 Blood Mend self range 0; healer decide targets allies. Wisp Rally is AEE-2026-10-24-004, not a re-file. |
| `AEE-2026-10-23-003` | SYS-92 `stepToward` never calls `filterHazardCandidates`. SYS-97 is the Set-order fallback, not the hazard filter. |
| `AEE-2026-10-23-004` | SYS-93 caster retreat `opponents[0]`. Interpose sites are AEE-2026-10-24-005. |
| `AEE-2026-10-23-005` | SYS-94 archer `MIN_KITE_RANGE = 3` vs poison range 4. |
| `AEE-2026-10-23-006` | SYS-95 range-0 heal drops advertised CHC (open #924). |

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21…10-23 honesty. Then this file’s 001–006. Do not start FUT-114 first. Do not implement SYS-59’s “pack immunity.” Do not add `enemy.level` into `calcScaledDamage` as an AI slice. Do not copy #842 / #911 / #924 / #958. Do not re-file FUT-83, SYS-04, SYS-39, SYS-91, or SYS-93. Do not emit Motoko `thunder_clap` as a bomber blast.

---

ACTION_ID: AEE-2026-10-24-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack apply DoT writer is nested under `damage > 0`; hunter/archer/bomber emit poison/venom/Inferno then Fire-Bolt  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: WX **16459–16462** gates the DoT writer (**16610–16625**) on `Number(chosenSpell.damage) > 0`. `starter-poison` (`spellData.ts` **49–66**), `spell-venom-strike` (**394–409**), and `spell-inferno` (**502–522**) all have `damage: BigInt(0)` and `dotDamagePerTurn` set. Hunter **1940–1957**, archer **2253–2269**, and bomber **2410–2425** emit those ids via `findKitSpell` (not `pickBestDamageSpell` / SYS-39). The no-damage arm (**16671–16700**) requires `debuffStat` (Slow can land; poison cannot). `!didAct` + Chebyshev 1 → `e-firebolt` (**16712**). Hostile summons skip `executeSummonAction` (SYS-55 / #842 decide-only). 10-23 §5 called 16609–16625 “a pack DoT writer” without the nest. Bomber `AI_KAMIKAZE_BLAST_RADIUS` (**2387–2393**) is not Inferno’s `areaRadius: 0`.  
RECOMMENDED_ACTION: AI-SYS-96 + FUT-114. Lift the DoT arm out of `spellDmg > 0`. Reject or skip — never bolt. Do not invent hidden splash. Prefer a sidecar if WX is contested.  
DEPENDENCIES: AEE-2026-08-31-002 (no bolt on failed cast); AEE-2026-09-26-002 (hostiles still skip executor)  
REGRESSION_RISK: HIGH if Inferno is given radius-2 splash that the card does not have  
VALIDATION_REQUIRED: TS-DOT0, TS-VEN0, TS-INF0, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-24-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `stepToward` fallback iterates reachable Set insertion order and can walk away from the intent cell  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `stepToward` preferred candidates **590–603**; fallback **604–609** `for (const k of reachable)` skipping only origin. `computeReachable` dirs are `+x, −x, +y, −y` (**369–374**), so the first inserted neighbor is east. West approach with the west tile occupied dest-commits east while still logging `closes-in`. SYS-92 is hazards on `stepAway` only. SYS-15 is the dead diagonal candidate (**595–596**). SYS-87 flank fallback calls this helper (**679**).  
RECOMMENDED_ACTION: AI-SYS-97 + FUT-115. `arg min Chebyshev(dest, target)` among reachable free tiles; hold if all increase distance.  
DEPENDENCIES: SYS-15 (no diagonal outside reachable); SYS-92 (hazard filter on the shortlist); SYS-05 (no bolt)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-WALKAWAY, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-24-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Guardian Iron Skin self-cast runs before any walk to the ward  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `decideSummonGuardian` Shield-in-range **2128–2146**, then Iron Skin on `summon.id` whenever the kit id is ready (**2148–2166**), *then* `backlineGuardCell` / `stepToward` (**2167–2205**). `spell-iron-skin` is `targetType: "ally"` range 3, `damage: 0`, `buffStat: "res"` (`spellData.ts` **294–311**). No effects snapshot (SYS-10) so CD-ready is treated as unshielded every turn. Pack apply has no ally-buff arm. FUT-64 is recast hygiene; this is that approach never runs.  
RECOMMENDED_ACTION: AI-SYS-98 + FUT-116. Walk when Shield is ready but out of range. Self Iron Skin only if no ward or Shield on CD, and only once apply can write it.  
DEPENDENCIES: SYS-10 (public RES); SYS-55 (hostile executor); SYS-05 (no bolt on failed buff)  
REGRESSION_RISK: MEDIUM if self Iron Skin is deleted entirely (golem should still self-buff when that is the legal leftover)  
VALIDATION_REQUIRED: TS-IRONPRE, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-24-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Wisp Rallying Cry is self / range 0 / `usableByEnemy: false` but decide targets a ward  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `SUMMON_KIT.healer` **146** includes `spell-rallying-cry`. Card `spellData.ts` **417–435**: `targetType: "self"`, range 0, heal 20 + CHC, `usableByEnemy: false`. `decideSummonHealer` **2521–2543** casts on `pickBestAlly` when `dist <= enemySpellRange` (0). `findKitSpell` assigned fallback **1737–1745** (SYS-32) can return it. Summon ctx does not cooldown-filter / usableByEnemy-filter (WX **15172–15173**, SYS-14). SYS-91 is Blood Mend. SYS-41 is pack king Rally.  
RECOMMENDED_ACTION: AI-SYS-99 + FUT-117. Self spells target the caster. Do not emit Rally until `usableByEnemy` is true and the card matches.  
DEPENDENCIES: AEE-2026-10-23-002 (SYS-91 self-heal shape); AEE-2026-09-21-004 (assigned fallback); SYS-05  
REGRESSION_RISK: MEDIUM if range 0 is widened to allies (rebalance vs player Rally)  
VALIDATION_REQUIRED: TS-RALLYSELF, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-24-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Healer / guardian / wisp interpose uses `opponents[0]` (snapshot order), not the nearest attacker of the ward  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Pack healer **1143**, guardian **2169**, wisp **2547**. SYS-93 covered caster *retreat* **928–944** only. Snapshot pushes player-side summons first, player last (WX **16274–16302**). Healers skip SYS-30 prepend (**1683**). `backlineGuardCell` **835–861** steps from the ward toward that threat. FUT-83 is the *ward* picker at **1142** (`allies.find(!isSummon)`); do not re-file.  
RECOMMENDED_ACTION: AI-SYS-100 + FUT-118. Shared nearest-threat helper with SYS-93; argument is the ward cell. `kind: "move"`.  
DEPENDENCIES: AEE-2026-10-23-004 (SYS-93 retreat helper); FUT-83 (ward, do not re-file); SYS-05  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-GUARDNEAR, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-24-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `inferArchetype` counts range>1 buffs/DoTs as ranged attacks, flipping rook+Iron Skin and pawn+venom to caster  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: After heal-first (SYS-04, **447–452**), caster test is `enemySpellRange > 1` majority (**453–461**). `ENEMY_KITS.rook` zone≥1 is Strike + `spell-iron-skin` (**173–174**, range 3, `damage: 0`). Pawn zone≥1 is Strike + `spell-venom-strike` (**165–166**, range 2, `damage: 0`). `pickBestDamageSpell` **561–568** requires `damage > 0`, so those ids never cast; `closes-in` then adjacent Fire-Bolt (SYS-05). Parent principle 5 already forbids heal-first; this is the **next** heuristic. SYS-04 is not this id.  
RECOMMENDED_ACTION: AI-SYS-101 + FUT-119. Filter to profiled damage/drain before the range count. Prefer authored `Enemy.role`.  
DEPENDENCIES: AEE-2026-08-31-003 (SYS-04 heal-first, separate); SYS-02 / SYS-39 (unscored ids); SYS-05  
REGRESSION_RISK: MEDIUM if bishops lose caster routing (frost range 4 must still count as a ranged *attack*)  
VALIDATION_REQUIRED: TS-ROOKROLE, TS-PAWNROLE, TS-BOLT3  
STATUS: NEW
