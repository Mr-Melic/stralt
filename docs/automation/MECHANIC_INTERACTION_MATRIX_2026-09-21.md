# Mechanic interaction matrix — 2026-09-21

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (after #332 report orchestration / #330 persist / #326 Attack Nearest origin)  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. “Watch enemy cast → unlock spell” still does not exist (`ownedSpells` = starter ∪ backend catalog). Gravity Well / Fog of War / Blood Moon / Mirror Field remain announce-only registry placeholders — not re-filed. Drain × `no_healing` is closed (`recordChallengeHealFromHpRestore`). Paper Windstorm rate vs announce stays PXA-owned. Do not clone in-flight **#327** (Striker AoE/bounce) or **#331** (portal destack corridor).

## Priority surfaces (changed since 2026-09-02 matrix on `58302bc`)

| Merge / surface | Why it matters for pairs |
| :--- | :--- |
| `playerTurnStartModifierTarget` | Stopped `[0]` enemy HP mutation; player is absent from `combatantsRef`, so registry turn-start/battle-start hooks never reach live player HP/MP |
| #326 Attack Nearest origin | Execute + Attack Nearest locked to **player tile**; range preview / `probeLiveCast` still use `getActiveCasterPos()` (summon) |
| Frozen/Slime execute + AI | `battleWalkMpCost` / `enemyWalkCostPerTile` closed 09-01-001 and 09-02-001 |
| Wisp / Drain healUsed | Both `heal` callbacks + Life Drain restore call `recordChallengeHealFromHpRestore` |
| Striker control-mode | `applyChallengeDirectHit` on kit casts; **summon AI** executor still never calls it |
| GameKey / unpaid death | Redeem still raw canister Doka (09-02-003) |
| Boss VOID_TILES / Dawn | Still cosmetic / half-applied (09-02-004 / 09-02-006); Dawn **MP** roll is a new AP/MP lie |
| Challenge HUD | `shouldShowChallengeHud` keeps accepted contracts after first action (closed PXA-002) |
| Boss Rush feats | `clientTrustedVictoryAchievementConditions` on room-clear (closed skip) |

## Still OPEN from prior matrices (do not re-file)

| ID | Pair | Status on `0f5363f` |
| :--- | :--- | :--- |
| MIMA-2026-08-31-001 | Swap × lava/ice/rift/thorns | `swapPositions` copies coords only (`WorldExploration.tsx` 9389–9401) |
| MIMA-2026-08-31-002 | Controlled-summon walk × **hazards** | Dest occupancy closed (`resolveControlledSummonMoveDest`). Instant teleport; no lava/thorn/rift landing. MP debit **is** `battleWalkMpCost` |
| MIMA-2026-08-31-005 | Push/pull × hazards | Occupancy tests exist. **Zero** `resolvePlayerCast` call sites. REPORT_ONLY |
| MIMA-2026-08-31-008 | AI/summon × Void Rift **walk** tile | Walk extra still `applyBattleWalkHazards` (player only). Turn-start 3 HP is now a **player** miss — see 09-21-001 (distinct: registry tick vs walk dest) |
| MIMA-2026-09-01-002 | Occupants × player walk **path** | Barriers in `isBattleWalkTileBlocked`. Dest occupancy checked. `findPath` intermediates still ignore living combatants |
| MIMA-2026-09-01-006 | Summon AI walk × lava/ice/spikes | `executeSummonAction.applyMovement` still `isCellFree` only; enemy landing 16872+ |
| MIMA-2026-09-02-002 | Destack / unseal × lava | `isCellFree` / `findBattleStartCell` still hazard-blind (`occupancy.ts` 84–97) |
| MIMA-2026-09-02-003 | GameKey × unpaid death 20/40 | `redeemGameKeyThroughPersist` still commits raw `#ok` |
| MIMA-2026-09-02-004 | Boss VOID_TILES × walk | `newHazardTiles` type `"void"` stored; landing switches lava/ice/spikes only |
| MIMA-2026-09-02-005 | Pacifist × summon damage | `recordPlayerSpellType` omits `summon`; AI/control `dealDamage` never flips the ref |
| MIMA-2026-09-02-006 | Dawn +10 HP | `damageToPlayer > 0` gate; negative heal ignored |

## Closed since last matrix (do not re-open)

| ID | Pair | Closed by |
| :--- | :--- | :--- |
| 09-02-001 | Frozen × AI reach | `enemyWalkCostPerTile` + WX `isFrozenTerrain` into AI ctx / summon executor |
| 09-01-001 | Frozen/Slime execute 1× | `battleWalkMpCost` on player + controlled-summon debit; leftover 1-MP tests |
| 09-01-005 | no_healing × Wisp heal | `recordChallengeHealFromHpRestore` on both `heal` callbacks |
| Drain × no_healing | Self-heal unmarked | `9f36239` / `castHelpers.reflect.test.ts` |
| Pacifist preview | Highlight flips feat | already closed 09-02 |
| Recap × pending persist | World input | `victoryPersistPendingRef` |
| Challenge HUD after first AP | Panel vanished | `shouldShowChallengeHud` |
| Boss Rush × pacifist/leader feats | Room-clear skipped list | `victoryAchievements.ts` |
| Attack Nearest from summon tile | Heal miss / Strike snipe | `attackNearestLiveCasterPos` always player (`targeting.ts` 757–761) |

## Matrix (evidence-backed)

| Pair | Should | Do (on `main`) | Gap |
| :--- | :--- | :--- | :--- |
| Void Rift / Mending Mist / Swift Winds / Titan's Vigor × player HP/MP | Commit to live stats | Registry mutates missing/`combatantsRef` rows; player formula overwrites AP/MP | [001](./ACTION_IDS_MIMA_2026-09-21.md) |
| Vampiric Ground × healing × no_healing | Heal attacker + fail challenge | Stub `attacker.hp +=`; HUD unchanged; `healUsed` false | [001](./ACTION_IDS_MIMA_2026-09-21.md) |
| Dawn +1 MP × AP | Add MP **or** log AP | `playerApModifier: 1` → `setCurrentBattleApSynced` | [002](./ACTION_IDS_MIMA_2026-09-21.md) |
| Striker × summon **AI** kit/melee | Fail beyond Chebyshev 2 | Control path records; `executeSummonAction` does not | [003](./ACTION_IDS_MIMA_2026-09-21.md) |
| Summon-control preview × player-spell execute | One origin | Blue ring / `probeLiveCast` = summon; execute / Attack Nearest = player | [004](./ACTION_IDS_MIMA_2026-09-21.md) |
| Swap × hazards | Same as walk | Still no | 08-31-001 |
| Destack × lava | Avoid or land | Still no | 09-02-002 |
| GameKey × unpaid death | Honour 20/40 | Still raw | 09-02-003 |
| Pacifist × wolf melee | Fail feat | Still true | 09-02-005 |
| Dawn +10 HP | Heal or silent | Log only | 09-02-006 |
| Push/pull × hazards | If shipped | Unwired | 08-31-005 |
| Achievement × spell observation | — | No observe path | not invented |
| Recap / persist-pending × lava | Block | Yes | closed |
| Frozen × player/AI/summon MP | 2× | Yes | closed |

## Missing tests (actionable)

1. Active `void_rift`: player turn-start HP drops by `VOID_RIFT_TICK` (or announce drops the per-turn clause) (001).
2. Active `mending_mist`: `characterStats.hp` rises 5% and `healUsed` is true in-battle (001).
3. Active `vampiric_ground`: player HP after a hit matches 15% of damage **or** no heal log; `easy_1` fails if HP rose (001).
4. Twin Monarchs Dawn MP roll: `currentBattleMp` +1 **or** log says AP (002).
5. Player-side Archer AI Poison Arrow from Chebyshev 4 flips Striker false (003).
6. While `activeControlledSummonId` set, `getSpellRangeTiles` keys match `attackNearestLiveCasterPos` (player), not the wolf tile (004).
7. Still missing from prior ledgers: Swap lava; destack lava; GameKey pending death; VOID_TILES land; wolf melee × pacifist; Wisp already covered; summon AI lava landing; findPath ∩ occupants === ∅.

Actionable records: [`ACTION_IDS_MIMA_2026-09-21.md`](./ACTION_IDS_MIMA_2026-09-21.md).
