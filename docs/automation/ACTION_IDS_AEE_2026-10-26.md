# ACTION_IDs — 2026-10-26 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41 / FUT-54…59), [`docs/ENEMY_AI_EVOLUTION_2026-09-24.md`](../ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47 / FUT-60…65), [`docs/ENEMY_AI_EVOLUTION_2026-09-25.md`](../ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53 / FUT-66…71), [`docs/ENEMY_AI_EVOLUTION_2026-09-26.md`](../ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59 / FUT-72…77), [`docs/ENEMY_AI_EVOLUTION_2026-09-27.md`](../ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65 / FUT-78…83), [`docs/ENEMY_AI_EVOLUTION_2026-09-28.md`](../ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71 / FUT-84…89), [`docs/ENEMY_AI_EVOLUTION_2026-09-29.md`](../ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77 / FUT-90…95), [`docs/ENEMY_AI_EVOLUTION_2026-10-21.md`](../ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83 / FUT-96…101), [`docs/ENEMY_AI_EVOLUTION_2026-10-22.md`](../ENEMY_AI_EVOLUTION_2026-10-22.md) (open PR #874; SYS-84…89 / FUT-102…107), [`docs/ENEMY_AI_EVOLUTION_2026-10-23.md`](../ENEMY_AI_EVOLUTION_2026-10-23.md) (open PR #958; SYS-90…95 / FUT-108…113), [`docs/ENEMY_AI_EVOLUTION_2026-10-24.md`](../ENEMY_AI_EVOLUTION_2026-10-24.md) (open PR #999; SYS-96…101 / FUT-114…119), [`docs/ENEMY_AI_EVOLUTION_2026-10-25.md`](../ENEMY_AI_EVOLUTION_2026-10-25.md) (open PR #1072; SYS-102…107 / FUT-120…125), [`docs/ENEMY_AI_EVOLUTION_2026-10-26.md`](../ENEMY_AI_EVOLUTION_2026-10-26.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010, AEE-2026-09-22-001…007, AEE-2026-09-23-001…007, AEE-2026-09-24-001…007, AEE-2026-09-25-001…007, AEE-2026-09-26-001…006, AEE-2026-09-27-001…006, AEE-2026-09-28-001…006, AEE-2026-09-29-001…006, AEE-2026-10-21-001…006, AEE-2026-10-22-001…006, AEE-2026-10-23-001…006, AEE-2026-10-24-001…006, or AEE-2026-10-25-001…006. Those ids belong to PRs #351, #416, #458, #506, #565, #633, #689, #723, #804, #821, #874, #958, #999, and #1072.

Open production slices (do not duplicate in this docs PR):

- [#495](https://github.com/Mr-Melic/stralt/pull/495) — AI-SYS-34 apply `playerPositionRef`
- [#498](https://github.com/Mr-Melic/stralt/pull/498) — AI-SYS-45 boss kit aim is not a walk dest
- [#487](https://github.com/Mr-Melic/stralt/pull/487) — betrayal death pipeline (spectacle, not a tactic)
- [#644](https://github.com/Mr-Melic/stralt/pull/644) — player drain-as-lifesteal (not pack SYS-113)
- [#647](https://github.com/Mr-Melic/stralt/pull/647) — Soul Rend apply
- [#649](https://github.com/Mr-Melic/stralt/pull/649) — Trap tile legality
- [#654](https://github.com/Mr-Melic/stralt/pull/654) — void-hole live gate
- [#658](https://github.com/Mr-Melic/stralt/pull/658) — catalog RES/SP shreds in `getStatModifier`
- [#659](https://github.com/Mr-Melic/stralt/pull/659) — Shield RES on melee (distinct from SYS-63 / SYS-66 / SYS-68 / SYS-108)
- [#700](https://github.com/Mr-Melic/stralt/pull/700) — player auto-summon kit metadata
- [#709](https://github.com/Mr-Melic/stralt/pull/709) — Sentinel Shield on clicked ally (player, not pack SYS-05)
- [#821](https://github.com/Mr-Melic/stralt/pull/821) — 2026-10-21 design increment (SYS-78…83)
- [#842](https://github.com/Mr-Melic/stralt/pull/842) — hostile summon kit + `decideSummonAction` (SYS-88 writer / SYS-55 routing). **Do not re-implement.**
- [#861](https://github.com/Mr-Melic/stralt/pull/861) — player auto-summon empty kit (not pack SYS-90)
- [#874](https://github.com/Mr-Melic/stralt/pull/874) — 2026-10-22 design increment (SYS-84…89)
- [#911](https://github.com/Mr-Melic/stralt/pull/911) — pack kit starter fallback when Motoko catalog misses ids (SYS-90 writer). **Do not re-implement.**
- [#924](https://github.com/Mr-Melic/stralt/pull/924) — WX enemy heal execute advertised CHC (SYS-95 writer). **Do not re-implement.**
- [#947](https://github.com/Mr-Melic/stralt/pull/947) — WX enemy DoT execute advertised ticks (complements SYS-96)
- [#967](https://github.com/Mr-Melic/stralt/pull/967) — pack DoT decide vs `pickBestDamageSpell` (not hunter LoS SYS-111)
- [#972](https://github.com/Mr-Melic/stralt/pull/972) — Inferno cooldown outside `damage > 0`
- [#974](https://github.com/Mr-Melic/stralt/pull/974) — pack buff execute advertised `buffStat`
- [#978](https://github.com/Mr-Melic/stralt/pull/978) — pack buff decide vs `pickBestDamageSpell`
- [#985](https://github.com/Mr-Melic/stralt/pull/985) — pack self-heal when no wounded ally (SYS-107 writer). **Do not re-implement.** SYS-110 is the wisp twin.
- [#989](https://github.com/Mr-Melic/stralt/pull/989) — empty-damage heal picker once `decideCaster` is reached (not SYS-113)
- [#958](https://github.com/Mr-Melic/stralt/pull/958) — 2026-10-23 design increment (SYS-90…95)
- [#999](https://github.com/Mr-Melic/stralt/pull/999) — 2026-10-24 design increment (SYS-96…101)
- [#1026](https://github.com/Mr-Melic/stralt/pull/1026) — healer approach vs Frost leftover detector (SYS-102). Sidecar only; **do not copy no-LoS/no-AP policy.**
- [#1033](https://github.com/Mr-Melic/stralt/pull/1033) — healer approach vs Inferno leftover detector (SYS-103)
- [#1034](https://github.com/Mr-Melic/stralt/pull/1034) — healer backline-guard vs Frost leftover detector (SYS-104)
- [#1039](https://github.com/Mr-Melic/stralt/pull/1039) — healer backline-guard vs Inferno leftover detector (SYS-105)
- [#1072](https://github.com/Mr-Melic/stralt/pull/1072) — 2026-10-25 design increment (SYS-102…107)

## Still-open IDs (line numbers confirmed 2026-10-26; not re-filed)

| ACTION_ID | Live evidence (2026-10-26) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` `combatMath.ts` 36–52. Spawn WX **5823**. Family second roll WX **5865**. Gates WX **15507** / **15594**. |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715** (`e-firebolt` at **16712**). Ally heal WX **16648**. `enemyAI.ts` has **zero** `currentAp`/`currentMp`/`apCost` reads. Failed Strike / venom / wisp approach / drain-on-ally currently *also* hit this path — SYS-108…113. |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. Comment still “10 random spells” (**11915**). Id lookup is SYS-90. |
| `AEE-2026-09-01-005` | Focus setter; `scoreTargets` unread. |
| `AEE-2026-09-01-007` | Summoner chance WX **11932–11943**; skip **1857–1887**. Skip-brain is AEE-2026-10-22-006. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map<string, number>()` (`useBossAI.ts` 169–173). |
| `AEE-2026-09-02-002` | Summon occupied empty WX **15156**. |
| `AEE-2026-09-21-002` | Healer Chebyshev-only 1099–1100. Self-vs-ally is AEE-2026-10-23-002. Approach leftover is AEE-2026-10-25-001. Wisp approach is AEE-2026-10-26-003. |
| `AEE-2026-09-21-004` | `findKitSpell` assigned fallback 1737–1745. |
| `AEE-2026-09-22-002` | Apply `playerPosition` WX **16436–16438** (open #495). |
| `AEE-2026-09-24-001` | Ally `targetId` fallback Crush/Fire Bolt 16704–16715. |
| `AEE-2026-09-26-001` | Strip / `resolveEnemyApMp` AP=`level` WX **17402–17411**. |
| `AEE-2026-09-26-002` | Hostile summons skip executor (still SYS-55). #842 routes decide only. |
| `AEE-2026-09-27-006` | FUT-83 pack healer `pickBestAlly` — still `allies.find(!isSummon)` at **1142**. Do not re-file. |
| `AEE-2026-09-28-001` | SYS-66 double RES + shield on pack→player **spells**. SYS-108 is that kit Strike currently uses this arm. |
| `AEE-2026-09-28-003` | SYS-68 melee private write. SYS-108 is that kit Strike never reaches it. |
| `AEE-2026-09-29-001` | SYS-72 kit vs Crush/`level/5` formulas. |
| `AEE-2026-09-29-002` | SYS-73 spawn `maxTier` from 999 (`combatMath.ts` 54–58). |
| `AEE-2026-10-21-002` | SYS-79 `pickBestDamageSpell` origin-range. Frost live range is **4**; Strike range is **1**. |
| `AEE-2026-10-21-006` | SYS-83 raw `allyCount` includes player summons; still unread by decide. |
| `AEE-2026-10-22-001` | SYS-84 `wLowHp` `effectiveHp ?? hp` (`enemyAI.ts` 341–342, 540). |
| `AEE-2026-10-22-002` | SYS-85 lookahead/spill skip `aiCanCast`. |
| `AEE-2026-10-22-005` | SYS-88 hostile `summonAI = pieceType` (open #842). |
| `AEE-2026-10-22-006` | SYS-89 `isSummoner` skip eats the piece kit. |
| `AEE-2026-10-23-001` | SYS-90 Motoko catalog drops starter kit ids (open #911). |
| `AEE-2026-10-23-002` | SYS-91 Blood Mend self range 0; pack healer decide targets allies. Wisp twin is AEE-2026-10-26-003. |
| `AEE-2026-10-23-004` | SYS-93 caster retreat `opponents[0]`. Do not re-file as SYS-108. |
| `AEE-2026-10-23-006` | SYS-95 range-0 heal drops advertised CHC (open #924). |
| `AEE-2026-10-24-001` | SYS-96 pack DoT writer nested under `damage > 0`. |
| `AEE-2026-10-24-003` | SYS-98 guardian Iron Skin preempts Shield approach. Executor still writes through a wall until AEE-2026-10-26-005. |
| `AEE-2026-10-24-004` | SYS-99 wisp Rally self vs ally. SYS-110 is Blood Mend *approach*, not Rally. |
| `AEE-2026-10-24-006` | SYS-101 range>1 buff/DoT → caster. Rook Strike-as-cast still SYS-108. |
| `AEE-2026-10-25-001` | SYS-102 pack healer approach vs Frost. |
| `AEE-2026-10-25-006` | SYS-107 pack `allies` exclude self (open #985). Wisp list is AEE-2026-10-26-003. |

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21…10-25 honesty. Then this file’s 001–006. Do not start FUT-126 first. Do not implement SYS-59’s “pack immunity.” Do not add `enemy.level` into `calcScaledDamage` as an AI slice. Do not copy #842 / #911 / #924 / #985 / #989 / #999 / #1026 / #1033 / #1034 / #1039 / #1072. Do not re-file FUT-83, SYS-04, SYS-23, SYS-66, SYS-68, SYS-91, SYS-99, SYS-102, or SYS-107. Do not emit Motoko `thunder_clap` as a bomber blast. Do not bless #1026’s no-LoS/no-AP detector as shipped policy. Do not put player SP on Strike to “match Frost,” and do not delete SP from Frost to “match Strike.”

---

ACTION_ID: AEE-2026-10-26-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Kit Strike (`isPhysical`) is emitted as `kind: "cast"` and takes the pack spell SP×RES arm instead of melee RES-only  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `physical_attack` `isPhysical: true`, range 1, damage 10 (`spellData.ts` **9–25**). Player `computeDamage` RES-only when physical (WX **3351–3354**); SP/SR only when `!isPhysical` (**3318–3363**). Charger adjacent **1197–1213**, flanker **1337–1356**, berserker **1428–1448**, generic **1533–1551** return `kind: "cast"` when `pickBestDamageSpell` finds Strike. Pack apply **16459–16537** uses `characterStats.sp` as `plSpEff` (**16475–16482**) × RES then `playerTakesDamage` (SYS-66). SYS-68 melee **16722–16728** never runs (`didAct` true). Hunter adjacent `kind: "melee"` **1961–1974** is the honesty template. Pack apply never reads `isPhysical`.  
RECOMMENDED_ACTION: AI-SYS-108 + FUT-126. Emit `kind: "melee"` or apply-fork `isPhysical` onto SYS-68. Do not change Frost’s SP arm. Never bolt.  
DEPENDENCIES: AEE-2026-08-31-002 (no bolt); AEE-2026-09-28-001 (SYS-66 spell pipeline); AEE-2026-09-28-003 (SYS-68 melee pipeline)  
REGRESSION_RISK: HIGH if Frost is forced onto melee RES-only; HIGH if Strike keeps paying player SP  
VALIDATION_REQUIRED: TS-STRIKEPHYS, TS-FROSTSP, TS-HUNTMELEE, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-26-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `scoreAlly` raw `summonAI` table lookup misses wisp/guardian weights that `threatValue()` already has  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Section 5 comment **2004–2008** claims reuse of `threatValue`. `threatValue` **511–521** maps `healer`/`wisp` → wisp 1.0. `scoreAlly` **2033–2036** uses `ENEMY_THREAT_VALUES[summonAI \|\| "default"]`. Live wisp `summonAI === "healer"` → **0.8**. `"guardian"` missing → **default 0.3** (`gameConstants.ts` **192–197**). Pack healer still `allies.find(!isSummon)` **1142** (FUT-83, do not re-file).  
RECOMMENDED_ACTION: AI-SYS-109 + FUT-127. Call `threatValue(ally)`. Do not name-parse.  
DEPENDENCIES: AEE-2026-09-27-006 (FUT-83 ward pin, separate); AEE-2026-09-21 SYS-17 (no name heuristics)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-ALLYTHREAT, TS-GUARDDEF  
STATUS: NEW

ACTION_ID: AEE-2026-10-26-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Wisp Blood Mend never sees self; `decideSummonHealer` approach-ally walks toward an unhealable ward  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Summon allies omit self **1772–1774**. Wounded filter **2481–2484**. `starter-heal` self / range 0 (`spellData.ts` **85–101**). Approach-ally **2501–2519** returns `kind: "move"` even if dest === origin. Rally-on-ward is SYS-99 (**2521–2543**), not this id. Pack twins SYS-102 / SYS-107 / #985 are pack-only. Hostile wisps skip executor (SYS-55) and can Fire-Bolt after dest-commit (WX **16712**).  
RECOMMENDED_ACTION: AI-SYS-110 + FUT-128. Include caster in self-heal set; drop illegal ally approach. Do not copy #985. Do not widen range 0.  
DEPENDENCIES: AEE-2026-10-23-002 (SYS-91); AEE-2026-10-25-006 (pack SYS-107, do not merge files); AEE-2026-08-31-002  
REGRESSION_RISK: MEDIUM if Blood Mend range 0 is widened to allies  
VALIDATION_REQUIRED: TS-WISPSELF, TS-WISPWALK, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-26-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Hunter venom in Chebyshev range with LoS blocked walks in; caster/archer already sidestep  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `decideSummonHunter` **1939–1958** casts only when `aiCanCast`; no `repositionForLOS`. Fallthrough melee **1961–1974** or `stepToward` **1976–1993**. Caster sidestep **972–995**. Archer sidestep **2271–2292**. Venom range 2, `damage: 0` (`spellData.ts` **395–415**). SYS-23 is healer/guardian *cast* without LoS, not this missing sidestep. SYS-96 still required to write ticks.  
RECOMMENDED_ACTION: AI-SYS-111 + FUT-129. Reuse `repositionForLOS`. Never through-wall venom. Never bolt.  
DEPENDENCIES: AEE-2026-09-21-002 (SYS-23, distinct); AEE-2026-10-24-001 (SYS-96 write); AEE-2026-08-31-002  
REGRESSION_RISK: HIGH if LoS is skipped to “land venom”  
VALIDATION_REQUIRED: TS-HUNTLOS, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-26-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Summon `applyCast` never re-checks range, LoS, or `targetType`  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `summonExecutor.ts` **153–209** checks AP then damage/heal/`applyEffect`. Pack apply at least Chebyshev-checks WX **16450–16456**. Guardian Shield through a wall (SYS-23, **2131–2133** Chebyshev only) still writes. Rally-on-ward (SYS-99) still writes if decide emitted it. Leftover-AP `reevaluate` **249–254** is **not** a new SYS (10-23…10-25). Hostile summons skip this executor (SYS-55).  
RECOMMENDED_ACTION: AI-SYS-112 + FUT-130. Executor calls SYS-13 / SYS-26 helper. Do not re-file `reevaluate`. Self range-0 Mend must still pass.  
DEPENDENCIES: AEE-2026-09-02-001 (SYS-13); AEE-2026-09-21 SYS-26; AEE-2026-09-26-002 (SYS-55 hostiles)  
REGRESSION_RISK: MEDIUM if self range-0 heals are rejected by a copied `minRange ?? 1`  
VALIDATION_REQUIRED: TS-EXECLOS, TS-WISPSELF  
STATUS: NEW

ACTION_ID: AEE-2026-10-26-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `decideHealer` healSpell picker treats drain `healAmount` as an ally heal and apply then damages the ally  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Picker **1095–1097** `spellType === "heal" || (healAmount ?? 0) > 0`. `starter-drain` healAmount 5 (`spellData.ts` **103–122**). `spell-drain-courage` healAmount 9, `spellType: "drain"`, `targetType: "enemy"`, `usableByEnemy: true` (`spellData.ts` **438–457**). SYS-04 already routes those kits to `decideHealer`. In-range drain hits the wounded **ally** via apply drain arm **16459–16638**. SYS-91 is Blood Mend dest. SYS-102 is Blood Mend approach. #989 is the picker *after* `decideCaster`. #644 is player drain.  
RECOMMENDED_ACTION: AI-SYS-113 + FUT-131. Heal category requires heal `spellType`/`targetType`. Drain enumerates opponents only. Do not wait for Motoko `vampire_bite`. Never bolt.  
DEPENDENCIES: AEE-2026-08-31-003 (SYS-04 routing, separate delete); AEE-2026-10-23-002 (SYS-91); AEE-2026-08-31-002  
REGRESSION_RISK: HIGH if drain is rewritten to heal allies; HIGH if Blood Mend is dropped from the heal picker  
VALIDATION_REQUIRED: TS-DRAINALLY, TS-BOLT3  
STATUS: NEW
