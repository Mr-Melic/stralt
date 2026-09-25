# ACTION_IDs — 2026-09-25 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35 / FUT-48…53), [`docs/ENEMY_AI_EVOLUTION_2026-09-23.md`](../ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41 / FUT-54…59), [`docs/ENEMY_AI_EVOLUTION_2026-09-24.md`](../ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47 / FUT-60…65), [`docs/ENEMY_AI_EVOLUTION_2026-09-25.md`](../ENEMY_AI_EVOLUTION_2026-09-25.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010, AEE-2026-09-22-001…007, AEE-2026-09-23-001…007, or AEE-2026-09-24-001…007. Those ids belong to PRs #351, #416, #458, and #506.

Open production slices (do not duplicate in this docs PR):

- [#495](https://github.com/Mr-Melic/stralt/pull/495) — AI-SYS-34 apply `playerPositionRef`
- [#498](https://github.com/Mr-Melic/stralt/pull/498) — AI-SYS-45 boss kit aim is not a walk dest
- [#487](https://github.com/Mr-Melic/stralt/pull/487) — betrayal death pipeline (spectacle, not a tactic)

## Still-open IDs (line numbers confirmed 2026-09-25; not re-filed)

| ACTION_ID | Live evidence (2026-09-25) |
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

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21-002 / 004, 09-22-002 / 003, 09-23-001…005, 09-24-001…006. Then this file’s 001–006. Do not start FUT-66/68 first.

---

ACTION_ID: AEE-2026-09-25-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Boss walk grid treats portal cells as floor  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 15457–15460 maps `tilesForBossAI` with `t === "floor" \|\| t === "portal"`. `getWalkableMoves` (`useBossAI.ts` 58–80) steps onto any true cell not in the occupied-body list. Pack occupancy refuses portal keys (WX 16317–16319, `isCellFree`). SYS-27 was summon reserved-cell decide, not boss locomotion. `KNIGHT_JUMP_IGNORE_WALLS` is a tagged ability and must stay Cavalier-only.  
RECOMMENDED_ACTION: AI-SYS-48. Floor-only boss grid; share pack portal occupancy. Do not copy wall-ignore.  
DEPENDENCIES: AEE-2026-09-02-004 (SYS-16 tagged abilities); AEE-2026-09-21 reserved-cell honesty (SYS-27)  
REGRESSION_RISK: MEDIUM if Cavalier jump is blocked as a side effect  
VALIDATION_REQUIRED: TS-BOSSPORT  
STATUS: NEW

ACTION_ID: AEE-2026-09-25-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Map choke/bottleneck keys are `${row},${col}` (y,x) vs occupancy `${x},${y}`  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 6417–6463 stores `` `${_ri},${_ci}` `` with `_ri` = row (y), `_ci` = column (x). Occupancy, `markedTilesRef` (3331), barriers, and `computeReachable` use `` `${x},${y}` ``. `ENEMY_AI_TIER_GATES.bottleneckControl = 8` (`gameConstants.ts` 207) is unread. Feeding the live refs into FUT-65/FUT-68 without a rewrite camps the transposed cell.  
RECOMMENDED_ACTION: AI-SYS-49. Rewrite keys to `${x},${y}` before any scorer reads the refs. Never `if (aiTier >= 8)`.  
DEPENDENCIES: None for the rewrite; FUT-68 waits on this  
REGRESSION_RISK: HIGH if POS-05 attaches to the current refs  
VALIDATION_REQUIRED: TS-CHOKEY  
STATUS: NEW

ACTION_ID: AEE-2026-09-25-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Public Mirror token is invisible to decide (`consumePlayerMirror` is apply-only)  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 16496–16528 consumes `mirrorUnitsRef` via `consumePlayerMirror` (`playerMirror.ts` 10–21, key `"player"`). `DecideEnemyContext` / `AICombatant` have no mirror field. FUT-34 assumed a combatant effect; live Mirror never wrote one. A T6 “don’t frost into Mirror” scorer would cheat or no-op.  
RECOMMENDED_ACTION: AI-SYS-50. Read-only `playerMirrorReady` copied at decide time; do not consume. FUT-67 scores after the snapshot.  
DEPENDENCIES: AEE-2026-09-01-004 (SYS-10); FUT-34 stays pack-physical-bias, not token ownership  
REGRESSION_RISK: HIGH if decide deletes the token (player Mirror becomes a no-op)  
VALIDATION_REQUIRED: TS-MIRSNAP, TS-NOFROST  
STATUS: NEW

ACTION_ID: AEE-2026-09-25-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Boss player snapshot hardcodes `atk: 10`  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: WX 15417 `atk: 10` on `playerCELike` while AP/MP/RES/SP copy live values (15415–15419). SYS-46 was peer rows `ap: 3` / `res: 0` (15444–15448). Dummy 10 is the same class of silent budget as SYS-07’s walk-3.  
RECOMMENDED_ACTION: AI-SYS-51. Copy visible ATK from HUD / `characterStats`. Missing ⇒ 0, not 10.  
DEPENDENCIES: AEE-2026-09-24-005 (SYS-46 peer rows)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-BOSSATK  
STATUS: NEW

ACTION_ID: AEE-2026-09-25-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `getWalkableMoves` hardcodes grid 16 instead of `WORLD_GRID_SIZE`  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `useBossAI.ts` 74–77 clips with literals `16`. Pack `computeReachable` uses `WORLD_GRID_SIZE` (`enemyAI.ts` 383; `gameConstants.ts` 8, value 16 today). SYS-45 mentioned this as an edge of aim≠walk; it is a distinct bound check.  
RECOMMENDED_ACTION: AI-SYS-52. Share the constant.  
DEPENDENCIES: AEE-2026-09-24-004 (SYS-45 aim≠walk stays separate)  
REGRESSION_RISK: LOW while the constant remains 16  
VALIDATION_REQUIRED: TS-BOSS16  
STATUS: NEW

ACTION_ID: AEE-2026-09-25-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `getCombatantAt` returns `"__player__"` while decide snapshots `"player"`  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: WX 9334 and 15119 return `{ id: "__player__", side: "player" }`. Pack snapshot id is `"player"` (16293–16301). `isPlayerHealTargetId` accepts both (`challengeCompletion.ts` 239–240). `castHelpers` / `spellEngine` branch on the sentinel. SYS-13 extract that compared ids would miss the player.  
RECOMMENDED_ACTION: AI-SYS-53. Map sentinel → `"player"` at the decide/SYS-13 boundary. Do not emit `"__player__"` from pack AI. Do not change hit-list sentinels.  
DEPENDENCIES: AEE-2026-09-02-001 (SYS-13 helper)  
REGRESSION_RISK: MEDIUM if `hitsAllies` sentinels are rewritten  
VALIDATION_REQUIRED: TS-PID  
STATUS: NEW

ACTION_ID: AEE-2026-09-25-007  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: T6+ step off Mark, don’t frost into Mirror, bottleneck camp, shield HP, Frozen MP, protector soak  
CATEGORY: combat-ai  
PRIORITY: P3  
CONFIDENCE: MEDIUM  
EVIDENCE: Mark ×2 WX 3331–3335 (`${x},${y}`). Mirror consume 16496–16528. `mapBottleneckTilesRef` 6442–6455 plus unread `bottleneckControl: 8`. `shieldHpRef` 16750–16761. Player Frozen 11457–11466.  
RECOMMENDED_ACTION: AI-FUT-66…71 after SYS-05 / SYS-48 / SYS-49 / SYS-50. Never `if (level >= X)` or `if (aiTier >= 8)`.  
DEPENDENCIES: AEE-2026-08-31-002; AEE-2026-09-25-001…006  
REGRESSION_RISK: HIGH if Mirror is consumed at decide; HIGH if choke keys stay y,x  
VALIDATION_REQUIRED: TS-MARKSTEP, TS-NOFROST, TS-BNCAMP, TS-SHIELDK, TS-FROZMP, TS-SOAK  
STATUS: NEW
