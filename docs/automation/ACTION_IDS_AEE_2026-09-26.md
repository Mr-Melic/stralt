# ACTION_IDs — 2026-09-26 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41 / FUT-54…59), [`docs/ENEMY_AI_EVOLUTION_2026-09-24.md`](../ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47 / FUT-60…65), [`docs/ENEMY_AI_EVOLUTION_2026-09-25.md`](../ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53 / FUT-66…71), [`docs/ENEMY_AI_EVOLUTION_2026-09-26.md`](../ENEMY_AI_EVOLUTION_2026-09-26.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010, AEE-2026-09-22-001…007, AEE-2026-09-23-001…007, AEE-2026-09-24-001…007, or AEE-2026-09-25-001…007. Those ids belong to PRs #351, #416, #458, #506, and #565.

Open production slices (do not duplicate in this docs PR):

- [#495](https://github.com/Mr-Melic/stralt/pull/495) — AI-SYS-34 apply `playerPositionRef`
- [#498](https://github.com/Mr-Melic/stralt/pull/498) — AI-SYS-45 boss kit aim is not a walk dest
- [#487](https://github.com/Mr-Melic/stralt/pull/487) — betrayal death pipeline (spectacle, not a tactic)

## Still-open IDs (line numbers confirmed 2026-09-26; not re-filed)

| ACTION_ID | Live evidence (2026-09-26) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` `combatMath.ts` 36–52. Spawn WX **5823**. Family second roll WX **5865**. Gates WX **15508** / **15595**. |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715** (`e-firebolt` at **16712**). Ally heal WX **16648**. `enemyAI.ts` has **zero** `currentAp`/`currentMp`/`apCost` reads. Failed ally `targetId` uses this fallback (SYS-42). |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. |
| `AEE-2026-09-01-005` | Focus setter; `scoreTargets` unread; prepend 1682–1690. Shared ref SYS-44. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map()`. |
| `AEE-2026-09-02-002` | Summon occupied empty WX **15156**. |
| `AEE-2026-09-21-002` | Healer Chebyshev-only 1099–1100. |
| `AEE-2026-09-21-004` | `findKitSpell` assigned fallback 1741–1745. |
| `AEE-2026-09-22-002` | Apply `playerPosition` WX **16438** (open #495). |
| `AEE-2026-09-23-002` | `getEffectiveStat` is `getStatModifier` WX **16347–16348**. |
| `AEE-2026-09-23-003` | `decideHealer` `healAmount` 1095–1097. |
| `AEE-2026-09-24-001` | Ally `targetId` fallback Crush/Fire Bolt 16704–16715. |
| `AEE-2026-09-24-005` | Boss peer dummy AP/MP/RES WX **15444–15448**. |
| `AEE-2026-09-25-001` | Boss portal-as-floor WX **15457–15460**. |
| `AEE-2026-09-25-002` | Choke keys `${_ri},${_ci}` WX **6417–6463**. |
| `AEE-2026-09-25-003` | Mirror consume WX **16496–16528**. |

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21-002 / 004, 09-22-002 / 003, 09-23-001…005, 09-24-001…006, 09-25-001…006. Then this file’s 001–006. Do not start FUT-72/75 first.

---

ACTION_ID: AEE-2026-09-26-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Initiative strip / `resolveEnemyApMp` uses `enemy.level` as AP; dummy RES/ATK  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `resolveEnemyApMp` (`summonIntegration.ts` 195–209) returns `{ ap: enemy.level, mp: max(1, floor(level/2)) }` for non-summons. WX 17402–17411 maps that onto the HUD and hardcodes `atk: e.level * 2`, `res: 0`, `sp: 0`, `chc: 2`. Player row sets `atk: 0` (17396) while `currentBattleAp`/`currentBattleMp` are live (17393–17394). After SYS-07, ingesting this helper would give a level-400 peer 400 AP — a level cap on the resource axis. SYS-46/51 are boss `CombatantEntryLike` dummies, not this HUD. SYS-28 forbids family-catalog AP as the substitute.  
RECOMMENDED_ACTION: AI-SYS-54. Enumerator AP/MP from seeded `currentAp`/`currentMp` / piece table. FUT-32 may read leftover **player** AP/MP from the strip only. FUT-72 reads HUD ATK, never strip 0.  
DEPENDENCIES: AEE-2026-09-01-002 (SYS-07 budget); AEE-2026-09-21 family AP lock (SYS-28)  
REGRESSION_RISK: HIGH if decide copies `resolveEnemyApMp` wholesale  
VALIDATION_REQUIRED: TS-STRIPAP, TS-STRIPATK  
STATUS: NEW

ACTION_ID: AEE-2026-09-26-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Enemy-side summons skip the paid summon executor  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: WX 14980 enters `executeSummonAction` only when `isSummon && side === "player"`. `spawnEnemySummonUnit` (`summonSpawn.ts` 254–284) always passes `side: "enemy"` (turn-order `type: "enemy"`, `summonSpawn.ts` 199–200) so the enemy-AI effect runs, then pack dest-commit (16416–16423) walks for free and Fire-Bolts on a failed cast. `spawnSummonUnit` still seeds `currentAp`/`currentMp` (181–184). SYS-14 is the player-summon empty-occupied snapshot, not this routing gate.  
RECOMMENDED_ACTION: AI-SYS-55. Any `isSummon` uses `decideSummonAction` + executor. Do not grow `runSummonAI`.  
DEPENDENCIES: AEE-2026-08-31-002 (no Fire Bolt); AEE-2026-09-02-002 (SYS-14 occupied); AEE-2026-09-22-001 (SYS-33 side counts)  
REGRESSION_RISK: MEDIUM if `type: "enemy"` is rewritten and the AI effect stops firing  
VALIDATION_REQUIRED: TS-HOSTEXEC  
STATUS: NEW

ACTION_ID: AEE-2026-09-26-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Boss occupancy list is `getPlayerSideTargets` ∩ `type === "enemy"` (empty)  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 15430–15435 filters `getPlayerSideTargets(turnOrder)` (`summonIntegration.ts` 184–186: player-side only) then `c.type === "enemy"`. Live player is `type: "player"`; player summons are `type: "summon"`; pack minions are not player-side. `moveToward` (`useBossAI.ts` 96–105) therefore occupies only the player tile. SYS-46 dummy stats on peer rows never apply because the rows are missing. SYS-48 is portal-as-floor, not bodies.  
RECOMMENDED_ACTION: AI-SYS-56. Occupied = every living combatant except self. Do not reuse `getPlayerSideTargets` as occupancy. FUT-74 interpose waits on this.  
DEPENDENCIES: AEE-2026-09-24-005 (SYS-46 stats); AEE-2026-09-25-001 (SYS-48 portals)  
REGRESSION_RISK: MEDIUM if Cavalier jump is blocked from landing on a listed dest that the ability names  
VALIDATION_REQUIRED: TS-BOSSOCC, TS-INTERP  
STATUS: NEW

ACTION_ID: AEE-2026-09-26-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Erratic dest ignores portal / void / barrier occupancy  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 15531–15549 keeps adjacent cells that are in-bounds, not a wall, not another enemy body, not the player. Then `updateCombatant` at 15590. Pack decide already refuses portals via `isCellFree` (16317–16319). SYS-12 says erratic is not a tactic; SYS-43 bills lava HP; SYS-48 is boss portal-as-floor. Erratic can still camp the sanctuary gateway.  
RECOMMENDED_ACTION: AI-SYS-57. Filter erratic candidates with the same occupancy snapshot. Keep wild-cast log-only. Never treat `aiTier >= 5` as a module.  
DEPENDENCIES: AEE-2026-09-01-006 (SYS-12 isolation); AEE-2026-09-24-002 (SYS-43 hazards)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-ERRPORT  
STATUS: NEW

ACTION_ID: AEE-2026-09-26-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Dest-commit is clamp-only; apply does not re-check `isCellFree`  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `enemyDestToCommit` (`battleSetup.ts` 394–406) returns `{x,y}` whenever dest ≠ origin on the board. WX 16421–16423 writes it. Pack `computeReachable` uses `isCellFree`; apply does not. SYS-27 was reserved cells in decide; SYS-43 was hazard HP on a landing. A skip-with-move dest or a future enumerator can stack bodies or stand on a portal.  
RECOMMENDED_ACTION: AI-SYS-58. Commit only if `isCellFree` (origin treated as free). Illegal ⇒ no patch, no Fire Bolt from a fake origin.  
DEPENDENCIES: AEE-2026-08-31-002; AEE-2026-09-21 reserved-cell honesty (SYS-27)  
REGRESSION_RISK: MEDIUM if legal dests that decide already checked are rejected due to a stale occupied set  
VALIDATION_REQUIRED: TS-DESTFREE  
STATUS: NEW

ACTION_ID: AEE-2026-09-26-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Plague Zone comment says “all units”; apply hits only the player  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: WX 14309–14324 comment “all units lose 2 HP at start of each turn”; apply damages only `characterStats` at player turn start (challenge debit / death). Pack / summons / bosses are not ticked. An ADV module that spreads the pack “because everyone burns” would score a rule that does not exist.  
RECOMMENDED_ACTION: AI-SYS-59 snapshot flag (player-only today). FUT-76 may raise approach from public player-HP pressure; it must not subtract HP from the bishop.  
DEPENDENCIES: None for the flag; FUT-76 waits on this  
REGRESSION_RISK: HIGH if implementers add hidden enemy plague ticks to “feel hard”  
VALIDATION_REQUIRED: TS-PLAGUE, TS-PLAGUEP  
STATUS: NEW

ACTION_ID: AEE-2026-09-26-007  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: T6+ HUD ATK, last-turn summon pip, boss interpose, piece-table AP, plague pressure, summonAI metadata  
CATEGORY: combat-ai  
PRIORITY: P3  
CONFIDENCE: MEDIUM  
EVIDENCE: Player strip `atk: 0` WX 17396 vs `characterStats.atk`. Summon lifespan pips WX 8144–8145; unused `runSummonAI.ts` 365 last-turn detonate. Boss occupancy SYS-56. `resolveEnemyApMp` level-as-AP. Plague player-only 14313–14324. `spawnEnemySummonUnit` `summonAI: unitDef.pieceType` (`summonSpawn.ts` 275).  
RECOMMENDED_ACTION: AI-FUT-72…77 after SYS-05 / SYS-07 / SYS-17 / SYS-54 / SYS-55 / SYS-56 / SYS-59. Never `if (level >= X)` or `ap = enemy.level`.  
DEPENDENCIES: AEE-2026-08-31-002; AEE-2026-09-26-001…006  
REGRESSION_RISK: HIGH if FUT-75 seeds AP from absolute level; HIGH if FUT-76 invents pack plague ticks  
VALIDATION_REQUIRED: TS-STRIPATK, TS-LASTPIP, TS-INTERP, TS-PEERAP, TS-PLAGUEP, TS-SUMAI  
STATUS: NEW
