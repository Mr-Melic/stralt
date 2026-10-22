# ACTION_IDs — 2026-10-22 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41 / FUT-54…59), [`docs/ENEMY_AI_EVOLUTION_2026-09-24.md`](../ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47 / FUT-60…65), [`docs/ENEMY_AI_EVOLUTION_2026-09-25.md`](../ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53 / FUT-66…71), [`docs/ENEMY_AI_EVOLUTION_2026-09-26.md`](../ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59 / FUT-72…77), [`docs/ENEMY_AI_EVOLUTION_2026-09-27.md`](../ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65 / FUT-78…83), [`docs/ENEMY_AI_EVOLUTION_2026-09-28.md`](../ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71 / FUT-84…89), [`docs/ENEMY_AI_EVOLUTION_2026-09-29.md`](../ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77 / FUT-90…95), [`docs/ENEMY_AI_EVOLUTION_2026-10-21.md`](../ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83 / FUT-96…101), [`docs/ENEMY_AI_EVOLUTION_2026-10-22.md`](../ENEMY_AI_EVOLUTION_2026-10-22.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010, AEE-2026-09-22-001…007, AEE-2026-09-23-001…007, AEE-2026-09-24-001…007, AEE-2026-09-25-001…007, AEE-2026-09-26-001…006, AEE-2026-09-27-001…006, AEE-2026-09-28-001…006, AEE-2026-09-29-001…006, or AEE-2026-10-21-001…006. Those ids belong to PRs #351, #416, #458, #506, #565, #633, #689, #723, #804, and #821.

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
- [#861](https://github.com/Mr-Melic/stralt/pull/861) — player auto-summon empty kit (not pack SYS-88)

## Still-open IDs (line numbers confirmed 2026-10-22; not re-filed)

| ACTION_ID | Live evidence (2026-10-22) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` `combatMath.ts` 36–52. Spawn WX **5823**. Family second roll WX **5865**. Gates WX **15508** / **15595**. |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715** (`e-firebolt` at **16712**). Ally heal WX **16648**. `enemyAI.ts` has **zero** `currentAp`/`currentMp`/`apCost` reads. Fallback also uses `level/5` (**16716–16720**) — SYS-72. |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. Comment still “10 random spells” (**11915**). |
| `AEE-2026-09-01-005` | Focus setter; `scoreTargets` unread. |
| `AEE-2026-09-01-007` | Summoner chance WX **11932–11943**; skip **1857–1887**. Skip-brain is AEE-2026-10-22-006. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map()` (`useBossAI.ts` 169–173). |
| `AEE-2026-09-02-002` | Summon occupied empty WX **15156**. |
| `AEE-2026-09-21-002` | Healer Chebyshev-only 1099–1100. |
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

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21…10-21 honesty. Then this file’s 001–006. Do not start FUT-102 first. Do not implement SYS-59’s “pack immunity.” Do not add `enemy.level` into `calcScaledDamage` as an AI slice. Do not copy #842. Do not re-file FUT-83.

---

ACTION_ID: AEE-2026-10-22-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `scoreTargets` `wLowHp` is identically 0 (`effectiveHp ?? hp`)  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `effectiveHp` (`enemyAI.ts` **341–342**) is `c.effectiveHp ?? c.hp`. `scoreTargets` **540** uses that as the denom. Pack/summon snapshots never set `effectiveHp` (WX **16279–16302**, **15125–15151**). `wLowHp = 30` never fires. SYS-76 / SYS-78 write player `maxHp`; this helper does not read it. Summon `scoreAlly` already uses `hpFrac` (**2029–2030**).  
RECOMMENDED_ACTION: AI-SYS-84 + FUT-102. Denom = `effectiveHp ?? maxHp`. Missing maxHp disables the term.  
DEPENDENCIES: AEE-2026-10-21-001 (SYS-78 HUD max on the row)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-LOWHP, TS-LOWHP0  
STATUS: NEW

ACTION_ID: AEE-2026-10-22-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Lookahead / spill retarget ignores `aiCanCast`  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Caster **953–956** proves geometry for `t`, then `applyLethalLookahead` (**727–735**) / `applyOverkillSpread` (**695–718**) pick any `hp <= estimateDamage`. Flanker/berserker/charger adjacent (**1336–1356**, **1427–1447**, **1197–1210**) can melee a non-adjacent id. Apply Chebyshev-only (WX **16450–16456**) can hit through walls or fail into Fire Bolt (SYS-05). SYS-81 is the Crush stamp, not dest legality.  
RECOMMENDED_ACTION: AI-SYS-85 + FUT-103. Re-check `aiCanCast` / Chebyshev-1 melee on the new id. Keep original if illegal. One apply hit (SYS-19).  
DEPENDENCIES: AEE-2026-10-21-004 (stamp); AEE-2026-08-31-002 (no bolt on failed retarget)  
REGRESSION_RISK: MEDIUM if lookahead is disabled instead of filtered  
VALIDATION_REQUIRED: TS-LOOKLOS, TS-LOOKMELEE, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-10-22-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Summoner dest is an arithmetic midpoint; WX short-circuit skips range 2  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `decideSummonerAction` **1894–1906**. `summon-dire-wolf` range **2** (`spellData.ts` **554**). WX **16389–16404** spawns before apply range. `spawnSummonUnit` **114–135** may snap to a different cell. Player summons pay range.  
RECOMMENDED_ACTION: AI-SYS-86 + FUT-104. Enumerate free ground tiles Chebyshev ≤ range from origin. Snap is not a tactic.  
DEPENDENCIES: AEE-2026-08-31-002 (short-circuit must not bolt); SYS-13  
REGRESSION_RISK: MEDIUM if cap/CD skip is left as the only fallback (see 006)  
VALIDATION_REQUIRED: TS-SUMRNG  
STATUS: NEW

ACTION_ID: AEE-2026-10-22-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `stepFlank` tackle zone is every adjacent tile, not occupied allies  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Comment `enemyAI.ts` **661** says occupied. Loop **664–671** adds all four neighbors. Empty strike cells are skipped (**673**). Only `stepToward` fallback (**679**) can enter Chebyshev 1.  
RECOMMENDED_ACTION: AI-SYS-87 + FUT-105. Tackle = allied bodies on adjacent tiles. Empty adjacent is legal if reachable.  
DEPENDENCIES: SYS-15 (4-dir reachable); SYS-05 (adjacent Crush not bolt)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-FLANKADJ  
STATUS: NEW

ACTION_ID: AEE-2026-10-22-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Hostile spawn stamps `summonAI` with chess `pieceType` (`"wolf"`)  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `spawnEnemySummonUnit` (`summonSpawn.ts` **275**) `summonAI: unitDef.pieceType`. `inferSummonArchetype` **208–223** then `name.includes("wolf")`. SYS-17 forbade that fallback. Empty spells + SYS-55 pack-fallthrough Crush/Bolts. Open **#842** attaches kit and routes `decideSummonAction` — do not re-implement.  
RECOMMENDED_ACTION: AI-SYS-88. Prefer merge/follow #842. Then delete `name.includes` (SYS-17). `#861` is player-side.  
DEPENDENCIES: AEE-2026-09-26-002 (SYS-55); AEE-2026-09-02 SYS-17  
REGRESSION_RISK: HIGH if a second spawn patch races #842  
VALIDATION_REQUIRED: TS-HOSTAI  
STATUS: NEW

ACTION_ID: AEE-2026-10-22-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `isSummoner` skip replaces the piece kit; overlay p=1 at player 44  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: WX **16375–16384** calls only `decideSummonerAction`. Cap/CD/no spell → `kind: "skip"` **1857–1887**. Chance `0.12 + player.level * 0.02` (constants **298–299**; WX **11932–11943**) hits 1.0 at 44 (FUT-23). No level cap ⇒ every later overworld enemy idles every other turn and never frosts. Same class as SYS-73’s last spawn band.  
RECOMMENDED_ACTION: AI-SYS-89 + FUT-104. Fall through to `decideEnemyAction` on skip. Overlay attach = parent §4 `peer`, not `player.level * 0.02`.  
DEPENDENCIES: AEE-2026-09-01-007 (FUT-23 chance); AEE-2026-10-22-003 (legal dest)  
REGRESSION_RISK: MEDIUM if fallthrough also short-circuits spawn  
VALIDATION_REQUIRED: TS-SUMFALL, TS-PEER44, TS-PEER3K  
STATUS: NEW
