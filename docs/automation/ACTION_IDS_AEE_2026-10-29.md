# ACTION_IDs — 2026-10-29 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41 / FUT-54…59), [`docs/ENEMY_AI_EVOLUTION_2026-09-24.md`](../ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47 / FUT-60…65), [`docs/ENEMY_AI_EVOLUTION_2026-09-25.md`](../ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53 / FUT-66…71), [`docs/ENEMY_AI_EVOLUTION_2026-09-26.md`](../ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59 / FUT-72…77), [`docs/ENEMY_AI_EVOLUTION_2026-09-27.md`](../ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65 / FUT-78…83), [`docs/ENEMY_AI_EVOLUTION_2026-09-28.md`](../ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71 / FUT-84…89), [`docs/ENEMY_AI_EVOLUTION_2026-09-29.md`](../ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77 / FUT-90…95), [`docs/ENEMY_AI_EVOLUTION_2026-10-21.md`](../ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83 / FUT-96…101), [`docs/ENEMY_AI_EVOLUTION_2026-10-22.md`](../ENEMY_AI_EVOLUTION_2026-10-22.md) (open PR #874; SYS-84…89 / FUT-102…107), [`docs/ENEMY_AI_EVOLUTION_2026-10-23.md`](../ENEMY_AI_EVOLUTION_2026-10-23.md) (open PR #958; SYS-90…95 / FUT-108…113), [`docs/ENEMY_AI_EVOLUTION_2026-10-24.md`](../ENEMY_AI_EVOLUTION_2026-10-24.md) (open PR #999; SYS-96…101 / FUT-114…119), [`docs/ENEMY_AI_EVOLUTION_2026-10-25.md`](../ENEMY_AI_EVOLUTION_2026-10-25.md) (open PR #1072; SYS-102…107 / FUT-120…125), [`docs/ENEMY_AI_EVOLUTION_2026-10-26.md`](../ENEMY_AI_EVOLUTION_2026-10-26.md) (open PR #1135; SYS-108…113 / FUT-126…131), [`docs/ENEMY_AI_EVOLUTION_2026-10-27.md`](../ENEMY_AI_EVOLUTION_2026-10-27.md) (open PR #1192; SYS-114…119 / FUT-132…137), [`docs/ENEMY_AI_EVOLUTION_2026-10-28.md`](../ENEMY_AI_EVOLUTION_2026-10-28.md) (open PR #1240; SYS-120…125 / FUT-138…143), [`docs/ENEMY_AI_EVOLUTION_2026-10-29.md`](../ENEMY_AI_EVOLUTION_2026-10-29.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010, AEE-2026-09-22-001…007, AEE-2026-09-23-001…007, AEE-2026-09-24-001…007, AEE-2026-09-25-001…007, AEE-2026-09-26-001…006, AEE-2026-09-27-001…006, AEE-2026-09-28-001…006, AEE-2026-09-29-001…006, AEE-2026-10-21-001…006, AEE-2026-10-22-001…006, AEE-2026-10-23-001…006, AEE-2026-10-24-001…006, AEE-2026-10-25-001…006, AEE-2026-10-26-001…006, AEE-2026-10-27-001…006, or AEE-2026-10-28-001…006. Those ids belong to PRs #351, #416, #458, #506, #565, #633, #689, #723, #804, #821, #874, #958, #999, #1072, #1135, #1192, and #1240.

Open production slices (do not duplicate in this docs PR):

- [#495](https://github.com/Mr-Melic/stralt/pull/495) — AI-SYS-34 apply `playerPositionRef`
- [#498](https://github.com/Mr-Melic/stralt/pull/498) — AI-SYS-45 boss kit aim is not a walk dest. SYS-128 summon dest currently *also* uses the player cell.
- [#487](https://github.com/Mr-Melic/stralt/pull/487) — betrayal death pipeline (spectacle, not a tactic)
- [#644](https://github.com/Mr-Melic/stralt/pull/644) — player drain-as-lifesteal (not pack SYS-113)
- [#647](https://github.com/Mr-Melic/stralt/pull/647) — Soul Rend apply
- [#649](https://github.com/Mr-Melic/stralt/pull/649) — Trap tile legality
- [#654](https://github.com/Mr-Melic/stralt/pull/654) — void-hole live gate
- [#658](https://github.com/Mr-Melic/stralt/pull/658) — catalog RES/SP shreds in `getStatModifier`
- [#659](https://github.com/Mr-Melic/stralt/pull/659) — Shield RES on melee (distinct from SYS-63 / SYS-66 / SYS-68 / SYS-108 / SYS-129)
- [#700](https://github.com/Mr-Melic/stralt/pull/700) — player auto-summon kit metadata
- [#709](https://github.com/Mr-Melic/stralt/pull/709) — Sentinel Shield on clicked ally (player, not pack SYS-05)
- [#821](https://github.com/Mr-Melic/stralt/pull/821) — 2026-10-21 design increment (SYS-78…83)
- [#842](https://github.com/Mr-Melic/stralt/pull/842) — hostile summon kit + `decideSummonAction` (SYS-88 writer / SYS-55 routing). **Do not re-implement.**
- [#861](https://github.com/Mr-Melic/stralt/pull/861) — player auto-summon empty kit (not pack SYS-90)
- [#874](https://github.com/Mr-Melic/stralt/pull/874) — 2026-10-22 design increment (SYS-84…89)
- [#911](https://github.com/Mr-Melic/stralt/pull/911) — pack kit starter fallback when Motoko catalog misses ids (SYS-90 writer). **Do not re-implement.**
- [#924](https://github.com/Mr-Melic/stralt/pull/924) — WX **pack** enemy heal execute advertised CHC (SYS-95 writer). SYS-131 is the **boss** heal arm. **Do not copy as the whole slice.**
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
- [#1104](https://github.com/Mr-Melic/stralt/pull/1104) — boss kit damage execute advertised CHC (complements SYS-115; not Windstorm/Mirror SYS-127; not summon SYS-128; not heal `buffStat` SYS-131)
- [#1123](https://github.com/Mr-Melic/stralt/pull/1123) — summon-hunter LoS-blocked Venom (SYS-111 writer). **Do not re-implement.**
- [#1135](https://github.com/Mr-Melic/stralt/pull/1135) — 2026-10-26 design increment (SYS-108…113)
- [#1150](https://github.com/Mr-Melic/stralt/pull/1150) — summon-bomber Inferno CD vs `findKitSpell` available (complements SYS-114)
- [#1158](https://github.com/Mr-Melic/stralt/pull/1158) — WX summon `availableSpells` pack CD filter (SYS-114 writer). **Do not re-implement.**
- [#1192](https://github.com/Mr-Melic/stralt/pull/1192) — 2026-10-27 design increment (SYS-114…119 / FUT-132…137). Unique files only.
- [#1240](https://github.com/Mr-Melic/stralt/pull/1240) — 2026-10-28 design increment (SYS-120…125 / FUT-138…143). Unique files only.

## Still-open IDs (line numbers confirmed 2026-10-29; not re-filed)

| ACTION_ID | Live evidence (2026-10-29) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` `combatMath.ts` 36–52. Spawn WX **5823**. Family second roll WX **5865**. Gates WX **15508** / **15595**. |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715** (`e-firebolt` at **16712**). Ally heal WX **16648**. `enemyAI.ts` has **zero** `currentAp`/`currentMp`/`apCost` reads. Ember/tide currently *also* live only on this fallback (SYS-126). |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. Comment still “10 random spells” (**11915**). `_enemyUsableSpells` **11916–11918** unused. Id lookup is SYS-90. |
| `AEE-2026-09-01-005` | Focus setter; `scoreTargets` unread. Wisp-harass promotion 1678–1690 is also unread after the sort. |
| `AEE-2026-09-01-007` | Summoner chance WX **11932–11943**; skip **1857–1887**. Skip-brain is AEE-2026-10-22-006. Placement dest is AEE-2026-10-27-004. Boss kit summon dest is SYS-128. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map<string, number>()` (`useBossAI.ts` 169–173). SYS-115 is the damage apply cheat; SYS-120 is the other arms; SYS-127 is Windstorm/Mirror on the damage arm; SYS-128 is `isSummon`. |
| `AEE-2026-09-02-002` | Summon occupied empty WX **15156**. SYS-114 is the spell list on that same ctx. |
| `AEE-2026-09-21-002` | Healer Chebyshev-only 1099–1100. |
| `AEE-2026-09-21-004` | `findKitSpell` assigned fallback 1737–1745. Survives SYS-114 unless deleted in the same slice. |
| `AEE-2026-09-22-002` | Apply `playerPosition` WX **16436–16438** (open #495). |
| `AEE-2026-09-24-001` | Ally `targetId` fallback Crush/Fire Bolt 16704–16715. |
| `AEE-2026-09-26-001` | Strip / `resolveEnemyApMp` AP=`level` WX **17402–17411**. |
| `AEE-2026-09-26-002` | Hostile summons skip executor (still SYS-55). #842 routes decide only. |
| `AEE-2026-09-27-006` | FUT-83 pack healer `pickBestAlly` — still `allies.find(!isSummon)` at **1142**. Do not re-file. |
| `AEE-2026-09-28-001` | SYS-66 double RES + shield on pack→**player** spells. SYS-129 is pack→**summon**. Boss kit damage skips SP (SYS-115). Boss ability HP skips RES and SP (SYS-121). |
| `AEE-2026-09-28-003` | SYS-68 melee private write. SYS-108 is that kit Strike never reaches it. SYS-126 is family hooks that only reach it. SYS-118 boss melee must use this, not Fire Bolt. SYS-121 ability HP must share it, not a third formula. |
| `AEE-2026-09-29-001` | SYS-72 kit vs Crush/`level/5` formulas. SYS-125 is the **null-spell** crush inside `scoreTargets`, not this helper. |
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
| `AEE-2026-10-23-006` | SYS-95 range-0 heal drops advertised CHC (open #924). SYS-131 is the **boss** heal arm. |
| `AEE-2026-10-24-001` | SYS-96 pack DoT writer nested under `damage > 0`. Boss DoT is a **separate** un-gated arm (SYS-120). |
| `AEE-2026-10-24-003` | SYS-98 guardian Iron Skin preempts Shield approach. |
| `AEE-2026-10-24-004` | SYS-99 wisp Rally self vs ally. |
| `AEE-2026-10-24-006` | SYS-101 range>1 buff/DoT → caster. |
| `AEE-2026-10-25-001` | SYS-102 pack healer approach vs Frost. |
| `AEE-2026-10-25-006` | SYS-107 pack `allies` exclude self (open #985). |
| `AEE-2026-10-26-001` | SYS-108 kit Strike as `kind: "cast"` (charger test **124–130** still expects cast). SYS-126 is ember/tide never reaching that arm. |
| `AEE-2026-10-26-002` | SYS-109 `scoreAlly` raw table. |
| `AEE-2026-10-26-003` | SYS-110 wisp self omitted; approach-ally. |
| `AEE-2026-10-26-004` | SYS-111 hunter venom no sidestep (open #1123). |
| `AEE-2026-10-26-005` | SYS-112 summon `applyCast` no geometry. |
| `AEE-2026-10-26-006` | SYS-113 healer picker `healAmount > 0` as ally heal. |
| `AEE-2026-10-27-001` | SYS-114 summon `availableSpells` raw kit (open #1158). |
| `AEE-2026-10-27-002` | SYS-115 boss kit **damage/drain** arm raw HP (WX **15860–15886**). SYS-127 is Windstorm/Mirror on that arm. SYS-120 is heal/debuff/DoT/buff. |
| `AEE-2026-10-27-003` | SYS-116 charger `canReach` Chebyshev vs `reachable`. |
| `AEE-2026-10-27-004` | SYS-117 summoner midpoint dest. SYS-128 is boss kit `isSummon`. |
| `AEE-2026-10-27-005` | SYS-118 boss `type: "attack"` / `"move"` no-op. SYS-121 is ability HP on the arm that **does** have `abilityResult`. |
| `AEE-2026-10-27-006` | SYS-119 boss `starterSpells.find`. |
| `AEE-2026-10-28-001` | SYS-120 boss kit heal/debuff/DoT/buff un-gated (WX **15889–15972**). SYS-131 is heal **`buffStat`**, not geometry. |
| `AEE-2026-10-28-002` | SYS-121 ability HP `setCharacterStats` (WX **16025–16039**). |
| `AEE-2026-10-28-003` | SYS-122 archer kite `stepAway(..., 1)` at **2328**. |
| `AEE-2026-10-28-004` | SYS-123 pack fused `closes-in` (caster **1014–1029**; dest-commit WX **16416–16423**). |
| `AEE-2026-10-28-005` | SYS-124 pack/boss walks skip `applyBattleWalkHazards` (player-only WX **9906**). |
| `AEE-2026-10-28-006` | SYS-125 `scoreTargets(..., null)` crush killableNow (947 / 1177 / 1296 / 1404 / 1493). |

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21…10-28 honesty. Then this file’s 001–006. Do not start FUT-144 first. Do not implement SYS-59’s “pack immunity.” Do not add `enemy.level` into `calcScaledDamage` as an AI slice. Do not copy #842 / #911 / #924 / #985 / #989 / #1026 / #1033 / #1034 / #1039 / #1072 / #1104 / #1123 / #1135 / #1150 / #1158 / #1192 / #1240. Do not re-file FUT-83, SYS-04, SYS-23, SYS-45, SYS-66, SYS-68, SYS-86, SYS-88, SYS-89, SYS-90, SYS-91, SYS-95, SYS-96, SYS-99, SYS-102, SYS-107, SYS-108, SYS-111, SYS-112, SYS-114, SYS-115, SYS-116, SYS-117, SYS-118, SYS-119, SYS-120, SYS-121, SYS-122, SYS-123, SYS-124, or SYS-125. Do not emit Motoko `thunder_clap` as a bomber blast. Do not bless #1026’s no-LoS/no-AP detector as shipped policy. Do not revive `engine/summonAI.ts`. Do not put player SP on Strike to “match Frost,” and do not delete SP from Frost to “match Strike.” Do not delete SP from boss Frost to “match pack melee.” Do not delete the pack DoT writer to “match” a gated boss Inferno. Do not delete summon RES to “match” SYS-129. Do not delete kit Strike to “restore” ember on the fallback.

---

ACTION_ID: AEE-2026-10-29-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: ember_knight / tide_shade family hooks fire only on the pack melee fallback — kit Strike as `kind: "cast"` never burns or shreds MP  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX **16789–16820** inside the melee→player else after Crush/Fire Bolt. Charger adjacent emits `kind: spell ? "cast" : "melee"` (`enemyAI.ts` **1197–1213**); `enemyAI.charger.test.ts` **124–130** still expects `kind: "cast"`. Kit-cast arm WX **16459–16537** has zero `family` reads. Melee vs summon **16734–16747** also skips the hooks. SYS-108 is the Strike **formula**. FUT-08 is **scoring**. Open #1104 is boss CHC.  
RECOMMENDED_ACTION: AI-SYS-126 + FUT-144. Shared on-hit helper on the legal pack hit. Delete fallback-only copies with P0 Fire Bolt. Never bolt. Do not delete Strike to force the fallback.  
DEPENDENCIES: AEE-2026-10-26-001 (SYS-108); AEE-2026-08-31-002  
REGRESSION_RISK: HIGH if ember writes twice (cast + leftover fallback); HIGH if Fire Bolt remains the only burn path  
VALIDATION_REQUIRED: TS-EMBERCAST, TS-TIDECAST, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-29-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Boss kit damage skips Paper Windstorm miss and player Mirror — pack kit-cast honors both  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Pack Windstorm WX **16491–16496**; `consumePlayerMirror` **16497–16530**. Boss kit damage **15860–15867** is `playerTakesDamage(raw Number(bossSpell.damage))`. SYS-115 is raw HP / no SP / no geometry. SYS-70 is pack Windstorm. SYS-121 is ability HP (do not silently miss tagged abilities). Open #1104 is CHC on the damage arm only.  
RECOMMENDED_ACTION: AI-SYS-127 + FUT-145. Same two public gates as pack kit-cast. Never bolt. Never skip LoS to “make up” a miss.  
DEPENDENCIES: AEE-2026-10-27-002 (SYS-115); AEE-2026-08-31-002  
REGRESSION_RISK: MEDIUM if Windstorm also misses adjacent Strike; HIGH if Mirror bounce uses the Fire Bolt pool  
VALIDATION_REQUIRED: TS-BOSSWIND, TS-BOSSMIRROR, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-29-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Boss kit `isSummon` short-circuit has no range / LoS / AP and dest-commits onto the player tile  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX **15828–15857** `spawnEnemySummonRef.current?.(bossSpellDest, bossSpell)` with `bossSpellDest = { x: targetX ?? enemy.x, y: targetY ?? enemy.y }`. Callers set `targetX/Y` to the player (`useBossAI.ts` **175–180**). CD always written. Wolf/archer `targetType: "ground"` range **2** (`spellData.ts` **547–631**). SYS-117 is pack midpoint. SYS-45 / #498 is dest-commit after a **non-summon** spell. SYS-120 is heal/debuff/DoT/buff.  
RECOMMENDED_ACTION: AI-SYS-128 + FUT-146. SYS-13 ground legality from the boss tile; dest `isCellFree`; never spawn-on-player; never bolt.  
DEPENDENCIES: AEE-2026-09-01-008; AEE-2026-09-22 SYS-45 (#498 dest); AEE-2026-10-27-004 (SYS-117 pack); AEE-2026-08-31-002  
REGRESSION_RISK: HIGH if a legal range-2 dest is rejected as “not the player”; HIGH if failed spawn Fire Bolts  
VALIDATION_REQUIRED: TS-BOSSSUMMON, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-29-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack kit-cast and melee vs player-side summons pre-multiply RES then `enemyTakesDamage` applies RES again  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Kit-cast `plResEff = resolvedTarget.res` WX **16483–16537** then `enemyTakesDamage` **16551–16553**. Helper RES at **3489–3498** (`Math.max(1, …)`). Melee vs summon **16722–16742** then `enemyTakesDamage`. SYS-66 is pack→**player** (then `playerTakesDamage` **3427–3432**). SYS-68 is pack melee→**player**. Open #659 is Shield RES on melee (player).  
RECOMMENDED_ACTION: AI-SYS-129 + FUT-147. One helper, RES once. Do not delete summon RES. Never bolt.  
DEPENDENCIES: AEE-2026-09-28-001 (SYS-66); AEE-2026-08-31-002  
REGRESSION_RISK: HIGH if a 0-damage DoT gains a `Math.max(1, …)` floor; MEDIUM if pack Frost loses SP to “match” summons  
VALIDATION_REQUIRED: TS-SUMRES, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-29-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Decide `getEffectiveStat` is `getStatModifier` — multiplier / AP-MP delta, not HUD RES/AP  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Pack WX **16347–16348**; summon WX **15183–15184**. `getStatModifier` `statusEffects.ts` **45–63**: no-match RES/SR/CHC → `1`; Iron Skin `1.3`; no-match AP/MP → `0`. `estimateDamage` / `scoreTargets` never read it today. SYS-10 is missing snapshot fields. SYS-83 is unread `allyCount`. Charger test stubs `() => 0` (`enemyAI.charger.test.ts` **92**).  
RECOMMENDED_ACTION: AI-SYS-130 + FUT-148. Absolute `base * modifier` / `base + delta` from public strip numbers, or omit the callback until SYS-10 copies fields onto `AICombatant`. Do not treat `1` as RES 1%.  
DEPENDENCIES: AEE-2026-09-01 SYS-10; AEE-2026-08-31-002  
REGRESSION_RISK: HIGH if TGT-05 ships against the multiplier and ranks every unbuffed player as RES 1  
VALIDATION_REQUIRED: TS-STATSHAPE, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-29-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Boss Blood Mend heal arm writes HP only — advertised `buffStat: "chc"` is on the non-heal buff arm  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `starter-heal` `spellData.ts` **85–101** (`healAmount: 12`, `buffStat: "chc"`). Boss heal WX **15889–15905**. Buff arm **15949–15972** requires `bossSpellType !== "heal"`. Pack heal CHC is SYS-95 / open #924. SYS-120 is heal **geometry**. SYS-91 is self range 0 vs ally targeting.  
RECOMMENDED_ACTION: AI-SYS-131 + FUT-149. Legal self dest applies HP **and** CHC. Failed geometry → neither, never bolt. Do not copy #924 into this docs PR.  
DEPENDENCIES: AEE-2026-10-28-001 (SYS-120); AEE-2026-10-23-006 (SYS-95 pack); AEE-2026-08-31-002  
REGRESSION_RISK: MEDIUM if a full-HP boss heals every turn for CHC (RES-06); HIGH if heal geometry is skipped “to land CHC”  
VALIDATION_REQUIRED: TS-BOSSCHC, TS-BOLT3  
STATUS: NEW
