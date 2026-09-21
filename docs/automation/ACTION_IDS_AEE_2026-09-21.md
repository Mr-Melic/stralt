# ACTION_IDs — 2026-09-21 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-01.md`](../ENEMY_AI_EVOLUTION_2026-09-01.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-02.md`](../ENEMY_AI_EVOLUTION_2026-09-02.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

## Still-open IDs (line numbers refreshed; not re-filed)

| ACTION_ID | Live evidence (2026-09-21) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` still `combatMath.ts` 36–52. Spawn WX **5823**; family re-roll WX **5863–5866**. Gates WX **15507** (`>= 5`) and **15594** (`>= 10`). |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715**. Ally heal WX **16648**. Dest-commit **16416–16423** before apply. `decideEnemyAction` still ignores `currentAp`/`currentMp`. |
| `AEE-2026-08-31-003` | `inferArchetype` 447–452 still heal-first. |
| `AEE-2026-09-01-001` | `findNearestLegalCastTile` 787–824 now uses `aiCanCast`; player helper `targeting.ts` `isTileCastableLive` 466+. Shape gates still missing. |
| `AEE-2026-09-01-002` | `computeReachable` 378 still `ENEMY_REACHABLE_STEP_BUDGET`. Frozen *rate* is wired (`enemyWalkMp.ts`). |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. |
| `AEE-2026-09-01-004` | Snapshot WX **16273–16302** still omits AP/MP/RES/effects/shield. |
| `AEE-2026-09-01-005` | Setter 957–958; `scoreTargets` 528–551 unread. |
| `AEE-2026-09-01-006` | Erratic log WX **15559–15565**; betrayal WX **15594–15657**. |
| `AEE-2026-09-01-007` | Summoner chance WX **11932–11934**. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map()` (`useBossAI.ts` 169–173 and every sibling). |
| `AEE-2026-09-01-009` | `usableByEnemy: true` utilities unchanged in `spellData.ts`. |
| `AEE-2026-09-01-010` | T6+ still proposed only. 2026-09-21 adds FUT-36…47 after 01–35. |
| `AEE-2026-09-02-001` | `isTileCastableLive` ally still `side === "player"` (`targeting.ts` 527+). `enemyCastGeometryOk` is **not** that helper. |
| `AEE-2026-09-02-002` | Summon occupied still empty WX **15156**; available unfiltered **15172**. |
| `AEE-2026-09-02-003` | Summon executor still Chebyshev teleport (`summonExecutor.ts` 125–126). Frozen multiplies the teleport bill, not a 4-dir path. |
| `AEE-2026-09-02-004` | Final Pawn kit-less bolt **992–1001**. Empty cooldown Map unchanged. |
| `AEE-2026-09-02-005` | Minion `ap: 0, mp: 0` WX **16154–16155**. |
| `AEE-2026-09-02-006` | `name.includes` summon routing `enemyAI.ts` **217–223**. |
| `AEE-2026-09-02-007` | `intelligence: 0` WX **16159**. |
| `AEE-2026-09-02-008` | Overkill still retarget (`enemyAI.ts` applyOverkillSpread). |
| `AEE-2026-09-02-009` | Charger `canReach` **1195–1196**. |
| `AEE-2026-09-02-010` | FUT-24…35 still proposed; not before honesty. |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-09-21-001**. Do not start FUT-36+ first.

---

ACTION_ID: AEE-2026-09-21-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Enemy apply twin of `planPlayerCastAttempt`; authored range; no `spellRangeBase` in AI  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Player execute is `playerCastPlan.ts` `planPlayerCastAttempt` (63–80). Enemy apply is private Chebyshev `distAM <= Number(chosenSpell.range)` (WX 16450–16456), no LoS, no AP. `enemySpellRange` is intentionally **not** `spellRangeBase` (`targeting.ts` 128–137). `enemyCastGeometryOk` exists (166–177) and is unused by apply. Fire Bolt fallback WX 16710–16715.  
RECOMMENDED_ACTION: AI-SYS-26 + AI-SYS-22 + AEE-2026-08-31-002. Helper takes side. Self/range-0 stays legal. Never call `spellRangeBase` from AI.  
DEPENDENCIES: AEE-2026-08-31-002  
REGRESSION_RISK: HIGH if `isTileCastableLive` is swapped in wholesale (ally = player-side only)  
VALIDATION_REQUIRED: TS-PLAN, TS-AUTHRANGE, TS-BOLT3  
STATUS: NEW

ACTION_ID: AEE-2026-09-21-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Healer LoS + `pickBestDamageSpell` must use `aiCanCast`  
CATEGORY: combat-ai  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `decideHealer` 1099–1100 Chebyshev only. `targeting.ts` 155–156 still documents healer/guardian/bomber skipping LoS. `pickBestDamageSpell` 554–573 is damage+range, no LoS. Caster re-checks at 953; charger adjacent and apply do not.  
RECOMMENDED_ACTION: AI-SYS-23 + AI-SYS-24. Role is not a wallhack.  
DEPENDENCIES: AEE-2026-09-21-001 for apply re-check  
VALIDATION_REQUIRED: TS-HEALLOS, TS-PICKLOS  
STATUS: NEW

ACTION_ID: AEE-2026-09-21-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: One resource model — pack dest-commit must pay; leftover AP copies summon `reevaluate`  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Pack `enemyDestToCommit` WX 16416–16423 is free, then range from new tile. Summon executor bills Chebyshev × `mpCostPerTile` (125–126) then WX `reevaluate` 15257–15277. Frozen is in the rate (`enemyWalkMp.ts`) but budget is still 3.  
RECOMMENDED_ACTION: AI-SYS-25 + SYS-07 + SYS-15 + FUT-38. Failed heal + adjacent must not Fire-Bolt (FUT-41).  
DEPENDENCIES: AEE-2026-08-31-002; AEE-2026-09-01-002; AEE-2026-09-02-003  
VALIDATION_REQUIRED: TS-REDECIDE, TS-BOLT3, TS-PATHMP  
STATUS: NEW

ACTION_ID: AEE-2026-09-21-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Summon snapshot — occupied, reserved cells, available-only kit lookup, post-move redecide  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Summon `aiOccupied = new Set()` WX 15156; pack fills 16308–16315. Executor slides via `resolveProgressionSafeOccupantCell` (137–146) with reserved cells WX 15208–15214. `findKitSpell` falls back to `assignedSpells` (1741–1745). `reevaluate` reuses empty-occupied ctx.  
RECOMMENDED_ACTION: AI-SYS-14 + AI-SYS-27 + AI-SYS-32 + AI-FUT-47.  
DEPENDENCIES: AEE-2026-09-02-002  
VALIDATION_REQUIRED: TS-SUMOCC, TS-RESERVE, TS-KITCD  
STATUS: NEW

ACTION_ID: AEE-2026-09-21-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Map-modifier parity — `applyApCost`, stacked MP vs `currentMp`, thorned `pathLength`  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyMpCost` stacks Slime and Frozen (`mapModifiers.ts` 155–172, 524–535) → 4/tile vs budget 3 = no dest. Player `planPlayerCastResources` runs `applyApCost` (Arcane Surge 210–217). Enemy casts do not. Thorned Ground uses `pathLength` (175–188); dest-commit has none.  
RECOMMENDED_ACTION: AI-SYS-31. Do not raise `ENEMY_REACHABLE_STEP_BUDGET` to unstick stacked maps.  
DEPENDENCIES: AEE-2026-09-01-002; AEE-2026-09-21-003  
VALIDATION_REQUIRED: TS-STACKMP, TS-SURGE  
STATUS: NEW

ACTION_ID: AEE-2026-09-21-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Family variant must not second-scramble `computeAITier`; catalog AP/MP not an AI seed  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Spawn `aiTier` WX 5823; `applyFamilyVariantsToRoster` 5863–5866 calls `computeAITier` again (30% scramble each time, `combatMath.ts` 48–50). `spawnPolicy.ts` 14–16: family `ap`/`mp` unused. Minions `ap: 0, mp: 0` WX 16154–16155.  
RECOMMENDED_ACTION: AI-SYS-29 + AI-SYS-28 + AEE-2026-08-31-001 (replace `computeAITier` with SYS-01).  
DEPENDENCIES: AEE-2026-08-31-001  
VALIDATION_REQUIRED: TS-TIER2, TS-FAMAP  
STATUS: NEW

ACTION_ID: AEE-2026-09-21-007  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Healer-summon prepend is not focus fire  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `decideEnemyAction` 1678–1690 prepends wisp; `scoreTargets` 528–551 re-sorts and never reads `focusTargetId` (set at 957–958).  
RECOMMENDED_ACTION: AI-SYS-30 + AI-SYS-08. Delete prepend or add `wFocus`.  
DEPENDENCIES: AEE-2026-09-01-005  
VALIDATION_REQUIRED: TS-PREPEND, TS-FOCUS  
STATUS: NEW

ACTION_ID: AEE-2026-09-21-008  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Seed minion/piece AP/MP from an explicit table; 0 means no walk  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Boss minion spawn WX 16154–16159. After SYS-07, `currentMp === 0` is no walk. Family catalog must not fill this (SYS-28). Player summons already seed via `summonSpawn.ts`.  
RECOMMENDED_ACTION: AI-SYS-21 + AI-SYS-28.  
DEPENDENCIES: AEE-2026-09-02-005; AEE-2026-09-01-002  
VALIDATION_REQUIRED: TS-MINIONMP, TS-FAMAP  
STATUS: NEW

ACTION_ID: AEE-2026-09-21-009  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Convert global `AI_*_ENABLED` flags into SYS-01 module attach  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `AI_LETHAL_LOOKAHEAD_ENABLED` and siblings (`gameConstants.ts` 224+) are global on. Tutorial remnants get elite lookahead. `ENEMY_AI_TIER_GATES` still unread.  
RECOMMENDED_ACTION: AI-FUT-40 after SYS-01. Keep constants as dev kill-switches only.  
DEPENDENCIES: AEE-2026-08-31-001  
VALIDATION_REQUIRED: TS-REL (module membership, not `level === 50`)  
STATUS: NEW

ACTION_ID: AEE-2026-09-21-010  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: T6+ FUT-36…47 are stackable scorers after honesty slices  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: 2026-09-21 catalog specifies public shield/mirror, leftover-AP redecide, stacked terrain, self-vacate, `getEffectiveStat` as TGT-05, Windstorm on legal ranged only, boss Manhattan stays tagged, Surge leftover AP, summon redecide snapshot. Eligibility remains parent §4 sigmoid.  
RECOMMENDED_ACTION: One module per PR with `enemyAI*.test.ts`. Never `if (level >= X)`. Not before AEE-2026-08-31-002 and AEE-2026-09-21-001…005.  
DEPENDENCIES: AEE-2026-08-31-001…003; AEE-2026-09-01-001…005; AEE-2026-09-02-001…005; AEE-2026-09-21-001…005  
REGRESSION_RISK: HIGH if stacked before legality  
VALIDATION_REQUIRED: Per-module TEST_SCENARIOS in `ENEMY_AI_EVOLUTION_2026-09-21.md`  
STATUS: NEW
