# ACTION_IDs — 2026-10-27 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41 / FUT-54…59), [`docs/ENEMY_AI_EVOLUTION_2026-09-24.md`](../ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47 / FUT-60…65), [`docs/ENEMY_AI_EVOLUTION_2026-09-25.md`](../ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53 / FUT-66…71), [`docs/ENEMY_AI_EVOLUTION_2026-09-26.md`](../ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59 / FUT-72…77), [`docs/ENEMY_AI_EVOLUTION_2026-09-27.md`](../ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65 / FUT-78…83), [`docs/ENEMY_AI_EVOLUTION_2026-09-28.md`](../ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71 / FUT-84…89), [`docs/ENEMY_AI_EVOLUTION_2026-09-29.md`](../ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77 / FUT-90…95), [`docs/ENEMY_AI_EVOLUTION_2026-10-21.md`](../ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83 / FUT-96…101), [`docs/ENEMY_AI_EVOLUTION_2026-10-22.md`](../ENEMY_AI_EVOLUTION_2026-10-22.md) (open PR #874; SYS-84…89 / FUT-102…107), [`docs/ENEMY_AI_EVOLUTION_2026-10-23.md`](../ENEMY_AI_EVOLUTION_2026-10-23.md) (open PR #958; SYS-90…95 / FUT-108…113), [`docs/ENEMY_AI_EVOLUTION_2026-10-24.md`](../ENEMY_AI_EVOLUTION_2026-10-24.md) (open PR #999; SYS-96…101 / FUT-114…119), [`docs/ENEMY_AI_EVOLUTION_2026-10-25.md`](../ENEMY_AI_EVOLUTION_2026-10-25.md) (open PR #1072; SYS-102…107 / FUT-120…125), [`docs/ENEMY_AI_EVOLUTION_2026-10-26.md`](../ENEMY_AI_EVOLUTION_2026-10-26.md) (open PR #1135; SYS-108…113 / FUT-126…131), [`docs/ENEMY_AI_EVOLUTION_2026-10-27.md`](../ENEMY_AI_EVOLUTION_2026-10-27.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010, AEE-2026-09-22-001…007, AEE-2026-09-23-001…007, AEE-2026-09-24-001…007, AEE-2026-09-25-001…007, AEE-2026-09-26-001…006, AEE-2026-09-27-001…006, AEE-2026-09-28-001…006, AEE-2026-09-29-001…006, AEE-2026-10-21-001…006, AEE-2026-10-22-001…006, AEE-2026-10-23-001…006, AEE-2026-10-24-001…006, AEE-2026-10-25-001…006, or AEE-2026-10-26-001…006. Those ids belong to PRs #351, #416, #458, #506, #565, #633, #689, #723, #804, #821, #874, #958, #999, #1072, and #1135.

Open production slices (do not duplicate in this docs PR):

- [#495](https://github.com/Mr-Melic/stralt/pull/495) — AI-SYS-34 apply `playerPositionRef`
- [#498](https://github.com/Mr-Melic/stralt/pull/498) — AI-SYS-45 boss kit aim is not a walk dest. SYS-118 is the non-spell move/attack path.
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
- [#911](https://github.com/Mr-Melic/stralt/pull/911) — pack kit starter fallback when Motoko catalog misses ids (SYS-90 writer). **Do not re-implement.** SYS-119 is the boss `starterSpells.find` twin.
- [#924](https://github.com/Mr-Melic/stralt/pull/924) — WX enemy heal execute advertised CHC (SYS-95 writer). **Do not re-implement.**
- [#947](https://github.com/Mr-Melic/stralt/pull/947) — WX enemy DoT execute advertised ticks (complements SYS-96)
- [#967](https://github.com/Mr-Melic/stralt/pull/967) — pack DoT decide vs `pickBestDamageSpell` (not hunter LoS SYS-111)
- [#972](https://github.com/Mr-Melic/stralt/pull/972) — Inferno cooldown outside `damage > 0`
- [#974](https://github.com/Mr-Melic/stralt/pull/974) — pack buff execute advertised `buffStat`
- [#978](https://github.com/Mr-Melic/stralt/pull/978) — pack buff decide vs `pickBestDamageSpell`
- [#985](https://github.com/Mr-Melic/stralt/pull/985) — pack self-heal when no wounded ally (SYS-107 writer). **Do not re-implement.**
- [#989](https://github.com/Mr-Melic/stralt/pull/989) — empty-damage heal picker once `decideCaster` is reached (not SYS-113)
- [#958](https://github.com/Mr-Melic/stralt/pull/958) — 2026-10-23 design increment (SYS-90…95)
- [#999](https://github.com/Mr-Melic/stralt/pull/999) — 2026-10-24 design increment (SYS-96…101)
- [#1026](https://github.com/Mr-Melic/stralt/pull/1026) — healer approach vs Frost leftover detector (SYS-102). Sidecar only; **do not copy no-LoS/no-AP policy.**
- [#1033](https://github.com/Mr-Melic/stralt/pull/1033) — healer approach vs Inferno leftover detector (SYS-103)
- [#1034](https://github.com/Mr-Melic/stralt/pull/1034) — healer backline-guard vs Frost leftover detector (SYS-104)
- [#1039](https://github.com/Mr-Melic/stralt/pull/1039) — healer backline-guard vs Inferno leftover detector (SYS-105)
- [#1072](https://github.com/Mr-Melic/stralt/pull/1072) — 2026-10-25 design increment (SYS-102…107)
- [#1104](https://github.com/Mr-Melic/stralt/pull/1104) — boss kit damage execute advertised CHC (complements SYS-115; not range/LoS/AP/SP)
- [#1123](https://github.com/Mr-Melic/stralt/pull/1123) — summon-hunter LoS-blocked Venom (SYS-111 writer). **Do not re-implement.**
- [#1135](https://github.com/Mr-Melic/stralt/pull/1135) — 2026-10-26 design increment (SYS-108…113)
- [#1150](https://github.com/Mr-Melic/stralt/pull/1150) — summon-bomber Inferno CD vs `findKitSpell` available (complements SYS-114)
- [#1158](https://github.com/Mr-Melic/stralt/pull/1158) — WX summon `availableSpells` pack CD filter (SYS-114 writer). **Do not re-implement.**

## Still-open IDs (line numbers confirmed 2026-10-27; not re-filed)

| ACTION_ID | Live evidence (2026-10-27) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` `combatMath.ts` 36–52. Spawn WX **5823**. Family second roll WX **5865**. Gates WX **15507** / **15594**. |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715** (`e-firebolt` at **16712**). Ally heal WX **16648**. `enemyAI.ts` has **zero** `currentAp`/`currentMp`/`apCost` reads. Failed summon CD / failed boss geometry / failed charger wait / failed summoner dest currently *also* hit this path — SYS-114…119. |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. Comment still “10 random spells” (**11915**). `_enemyUsableSpells` **11916–11918** unused. Id lookup is SYS-90. |
| `AEE-2026-09-01-005` | Focus setter; `scoreTargets` unread. |
| `AEE-2026-09-01-007` | Summoner chance WX **11932–11943**; skip **1857–1887**. Skip-brain is AEE-2026-10-22-006. Placement dest is AEE-2026-10-27-004. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map<string, number>()` (`useBossAI.ts` 169–173). SYS-115 is the apply cheat that fires because this always returns an id. |
| `AEE-2026-09-02-002` | Summon occupied empty WX **15156**. SYS-114 is the spell list on that same ctx. |
| `AEE-2026-09-21-002` | Healer Chebyshev-only 1099–1100. |
| `AEE-2026-09-21-004` | `findKitSpell` assigned fallback 1737–1745. Survives SYS-114 unless deleted in the same slice. |
| `AEE-2026-09-22-002` | Apply `playerPosition` WX **16436–16438** (open #495). |
| `AEE-2026-09-24-001` | Ally `targetId` fallback Crush/Fire Bolt 16704–16715. |
| `AEE-2026-09-26-001` | Strip / `resolveEnemyApMp` AP=`level` WX **17402–17411**. |
| `AEE-2026-09-26-002` | Hostile summons skip executor (still SYS-55). #842 routes decide only. |
| `AEE-2026-09-27-006` | FUT-83 pack healer `pickBestAlly` — still `allies.find(!isSummon)` at **1142**. Do not re-file. |
| `AEE-2026-09-28-001` | SYS-66 double RES + shield on pack→player **spells**. Boss kit skips SP (SYS-115). |
| `AEE-2026-09-28-003` | SYS-68 melee private write. SYS-108 is that kit Strike never reaches it. SYS-118 boss melee must use this, not Fire Bolt. |
| `AEE-2026-09-29-001` | SYS-72 kit vs Crush/`level/5` formulas. |
| `AEE-2026-09-29-002` | SYS-73 spawn `maxTier` from 999 (`combatMath.ts` 54–58). |
| `AEE-2026-10-21-002` | SYS-79 `pickBestDamageSpell` origin-range. Frost live range is **4**; Strike range is **1**. |
| `AEE-2026-10-21-006` | SYS-83 raw `allyCount` includes player summons; still unread by decide. |
| `AEE-2026-10-22-001` | SYS-84 `wLowHp` `effectiveHp ?? hp` (`enemyAI.ts` 341–342, 540). |
| `AEE-2026-10-22-002` | SYS-85 lookahead/spill skip `aiCanCast`. |
| `AEE-2026-10-22-005` | SYS-88 hostile `summonAI = pieceType` (open #842). |
| `AEE-2026-10-22-006` | SYS-89 `isSummoner` skip eats the piece kit. Failed SYS-117 dest must fall through here, not bolt. |
| `AEE-2026-10-23-001` | SYS-90 Motoko catalog drops starter kit ids (open #911). SYS-119 is boss `starterSpells.find`. |
| `AEE-2026-10-23-002` | SYS-91 Blood Mend self range 0; pack healer decide targets allies. |
| `AEE-2026-10-23-004` | SYS-93 caster retreat `opponents[0]`. |
| `AEE-2026-10-23-006` | SYS-95 range-0 heal drops advertised CHC (open #924). |
| `AEE-2026-10-24-001` | SYS-96 pack DoT writer nested under `damage > 0`. |
| `AEE-2026-10-24-003` | SYS-98 guardian Iron Skin preempts Shield approach. |
| `AEE-2026-10-24-004` | SYS-99 wisp Rally self vs ally. |
| `AEE-2026-10-24-006` | SYS-101 range>1 buff/DoT → caster. |
| `AEE-2026-10-25-001` | SYS-102 pack healer approach vs Frost. |
| `AEE-2026-10-25-006` | SYS-107 pack `allies` exclude self (open #985). |
| `AEE-2026-10-26-001` | SYS-108 kit Strike as `kind: "cast"` (charger test **124–130** still expects cast). |
| `AEE-2026-10-26-002` | SYS-109 `scoreAlly` raw table. |
| `AEE-2026-10-26-003` | SYS-110 wisp self omitted; approach-ally. |
| `AEE-2026-10-26-004` | SYS-111 hunter venom no sidestep (open #1123). |
| `AEE-2026-10-26-005` | SYS-112 summon `applyCast` no geometry. |
| `AEE-2026-10-26-006` | SYS-113 healer picker `healAmount > 0` as ally heal. |

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21…10-26 honesty. Then this file’s 001–006. Do not start FUT-132 first. Do not implement SYS-59’s “pack immunity.” Do not add `enemy.level` into `calcScaledDamage` as an AI slice. Do not copy #842 / #911 / #924 / #985 / #989 / #1026 / #1033 / #1034 / #1039 / #1072 / #1104 / #1123 / #1135 / #1150 / #1158. Do not re-file FUT-83, SYS-04, SYS-23, SYS-45, SYS-66, SYS-68, SYS-86, SYS-88, SYS-89, SYS-90, SYS-91, SYS-99, SYS-102, SYS-107, SYS-108, SYS-111, or SYS-112. Do not emit Motoko `thunder_clap` as a bomber blast. Do not bless #1026’s no-LoS/no-AP detector as shipped policy. Do not revive `engine/summonAI.ts`. Do not put player SP on Strike to “match Frost,” and do not delete SP from Frost to “match Strike.” Do not delete SP from boss Frost to “match pack melee.”

---

ACTION_ID: AEE-2026-10-27-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Player-summon `availableSpells` is the raw kit — no cooldown or usability filter  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Pack filter WX **16268–16270** (`CD <= 0 && usableByEnemy !== false`). Summon ctx WX **15172–15173** sets `availableSpells` and `assignedSpells` to `summonEnemy.spells ?? []`. `findKitSpell` prefers available (**1741–1742**), so Inferno `cooldown: 3` (`spellData.ts` **518**) never drops. Occupied-empty on the same ctx is SYS-14 (WX **15156**), not this id. Assigned fallback 1737–1745 is AEE-2026-09-21-004. Open #1158 is the sidecar writer; #1150 is bomber-only.  
RECOMMENDED_ACTION: AI-SYS-114 + FUT-132. Share the pack filter; then delete the assigned fallback. Never bolt.  
DEPENDENCIES: AEE-2026-08-31-002 (no bolt); AEE-2026-09-21-004 (`findKitSpell` fallback); AEE-2026-09-02-002 (SYS-14 occupancy, separate)  
REGRESSION_RISK: MEDIUM if player-wisp Rallying Cry (`usableByEnemy: false`) is stripped; HIGH if Inferno CD is skipped to “keep detonating”  
VALIDATION_REQUIRED: TS-SUMCD, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-27-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Boss kit-spell apply ignores range, LoS, AP, and SP — raw `spell.damage` into `playerTakesDamage`  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Decide always returns the first pool id with `new Map()` (`useBossAI.ts` **169–173**, AEE-2026-09-01-008). Apply WX **15860–15867** `playerTakesDamage(Math.max(1, round(Number(bossSpell.damage))))` with no Chebyshev, no LoS, no `apCost`, no SP. `playerTakesDamage` applies RES only (**3427–3432**). Pack at least range-checks (**16450–16456**) and pre-applies SP (SYS-66). Dest then commits onto `bossSpellDest` (**16005–16008**, SYS-45 / #498). Open #1104 is CHC only. Lookup `starterSpells.find` is SYS-119.  
RECOMMENDED_ACTION: AI-SYS-115 + FUT-133. Geometry + AP + SP/RES once. Do not delete SP from pack Frost. Never bolt. Never teleport (SYS-45).  
DEPENDENCIES: AEE-2026-09-01-008 (empty CD map); AEE-2026-09-22 SYS-45 (#498 dest); AEE-2026-09-28-001 (SYS-66); AEE-2026-08-31-002  
REGRESSION_RISK: HIGH if pack Frost loses SP to “match” the boss; HIGH if out-of-range Frost still writes  
VALIDATION_REQUIRED: TS-BOSSRANGE, TS-BOSSSP, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-27-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Charger `canReach` is Chebyshev ≤ budget+1, not membership in the 4-dir `reachable` set  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `canReach = dist <= ENEMY_REACHABLE_STEP_BUDGET + 1` (`enemyAI.ts` **1195–1196**). `computeReachable` is cardinal BFS budget 3 (**354–393**). Target at (origin+3, origin+3) is Chebyshev 3 so the charger does not wait, then `stepToward` cannot take the diagonal (SYS-15) and hits Set-order (SYS-97). Charger test locks Chebyshev 6 wait and Chebyshev 4 cardinal advance (`enemyAI.charger.test.ts` **104–121**) and adjacent `kind: "cast"` (**124–130**, SYS-108).  
RECOMMENDED_ACTION: AI-SYS-116 + FUT-134. Wait unless a tackle tile is in `reachable`. Replace the Chebyshev-4 assertion with reachable membership; keep Chebyshev-6 wait. Do not retune adjacent kind here.  
DEPENDENCIES: AEE-2026-08-31 SYS-03 (budget vs MP); AEE-2026-10-24 SYS-97 (Set fallback); AEE-2026-10-26-001 (SYS-108 adjacent kind)  
REGRESSION_RISK: MEDIUM if Chebyshev-6 wait is deleted; HIGH if the charger walks through occupied/void to “commit”  
VALIDATION_REQUIRED: TS-CHARGEBFS, TS-CHARGEWAIT, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-27-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `decideSummonerAction` emits player/ally midpoint with no occupancy, range, or LoS; WX writes cooldown even when spawn fails  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Midpoint **1894–1905** (`targetId: null`). Wolf/archer range **2**, `targetType: "ground"` (`spellData.ts` **547–631**). WX **16389–16404** short-circuits any summon dest and **always** `enemySummonCooldownRef.set`. SYS-86 is the profile; SYS-89 is skip-eats-kit; SYS-88 is `summonAI = pieceType`. FUT-23 is the chance table.  
RECOMMENDED_ACTION: AI-SYS-117 + FUT-135. Legal ground dest in range or skip **without** CD write; then SYS-89 so the piece kit can fire. Never bolt. Never spawn on the player.  
DEPENDENCIES: AEE-2026-10-22-006 (SYS-89); AEE-2026-10-22-005 (SYS-88 / #842); AEE-2026-08-31-002  
REGRESSION_RISK: HIGH if dest occupancy is skipped to “always summon”; MEDIUM if a failed dest still burns CD  
VALIDATION_REQUIRED: TS-SUMMONCELL, TS-SUMMONCD, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-27-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Boss `type: "attack"` / `type: "move"` without `abilityResult` apply no melee and no walk  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `attackPlayer` `useBossAI.ts` **108–119**; `moveToward` **90–106**; `isAdjacent` Manhattan **121–126**. WX after the spell arm reads `abilityResult` only (**16013–16026**, dest **16226–16229**). `logMessage` can still print “attacks!” (**16015–16016**) with 0 HP change. SYS-45 is the **spell** dest teleport, not this path. 008 currently hides the path by always returning `type: "spell"`. Pack melee is Chebyshev (`enemyAI.ts` 1197) + SYS-68.  
RECOMMENDED_ACTION: AI-SYS-118 + FUT-136. Apply Chebyshev melee via SYS-68; commit walk via `enemyDestToCommit`. Never bolt. Do not walk onto lava as a fix.  
DEPENDENCIES: AEE-2026-09-01-008 (hides this path); AEE-2026-09-22 SYS-45 (#498, distinct); AEE-2026-09-28-003 (SYS-68); AEE-2026-08-31-002  
REGRESSION_RISK: HIGH if diagonal melee is denied to “keep Manhattan”; HIGH if `type: "attack"` becomes Fire Bolt  
VALIDATION_REQUIRED: TS-BOSSMELEE, TS-BOSSWALK, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-27-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Boss kit resolve is `starterSpells.find` only — live catalog / admin ids fall through to a no-op  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX **15814–15816** `starterSpells.find`. Failed lookup falls through to `abilityResult` (**16011–16013**), which a `{ type: "spell", spellId }` action does not have (SYS-118 no-op). Pack assign is `normalizedSpellPool.find` (**11921–11923**, SYS-90 / #911). Motoko ids without a profile must still not cast (SYS-02).  
RECOMMENDED_ACTION: AI-SYS-119 + FUT-137. Same catalog as pack + profile gate. Do not treat Motoko `thunder_clap` as auto-legal.  
DEPENDENCIES: AEE-2026-10-23-001 (SYS-90 / #911); AEE-2026-08-31 SYS-02; AEE-2026-10-27-002 (SYS-115 apply); AEE-2026-10-27-005 (fallthrough no-op)  
REGRESSION_RISK: HIGH if an unprofiled Motoko AoE becomes a boss sniper; MEDIUM if starter-only ids stop resolving  
VALIDATION_REQUIRED: TS-BOSSCATALOG, TS-BOLT3  
STATUS: NEW
