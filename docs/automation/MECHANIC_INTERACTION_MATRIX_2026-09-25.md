# Mechanic interaction matrix — 2026-09-25

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (same as the 09-21 / 09-22 / 09-23 / 09-24 matrices / #332). No gameplay merge since then.  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. “Watch enemy cast → unlock spell” still does not exist (`ownedSpells` = starter ∪ backend catalog). Gravity Well / Fog of War remain announce-only registry placeholders. Blood Moon 1.25× and Mirror Field 20% reflect stay wired in `spellEngine`. Paper Windstorm rate vs announce stays PXA-owned. Push/pull stay unwired (08-31-005 REPORT_ONLY). BoostToggle App state is ignored by GameFlow / WX (`_setBoostMode`) — wiring, not a combat pair. Do not clone in-flight **#327** / **#370**, **#331** / **#373**, **#336**, **#376**, **#379**, **#380**, **#382**, **#386**, **#389**, **#391**, **#410**, **#443**, **#467**, **#476**, **#487**, **#489**, **#491**, **#495**, **#496**, **#498**, **#508**, **#524**, **#541**, **#543**, **#546** / **#547**, **#550**, **#551**, **#553**, **#554**, **#555**.

## Priority surfaces (this run)

HEAD did not move. Re-audit focused on AP-discount consumers that the 09-23 Overflow fizzle ID never scored, Thorned Ground’s player-only walk helper vs enemy/summon walks, and achievement-claim Doka vs the unpaid death cut that GameKey (#391) is already covering on a different helper.

| Surface | Why it matters for pairs |
| :--- | :--- |
| `onApCost` `Math.max(1, base - 1)` | Arcane Surge / Overflow share the floor. Timestep is `apCost: 0`. Preview/execute/`Attack Nearest` all call `applyApCost`. |
| `planSummonControlCast` / `summonExecutor` | Raw `Number(spell.apCost)`. Map-wide AP discount never reaches minion kits. |
| `battleWalkHazardDamages` | Player mouse/touch Thorned tax. Enemy landing is still lava/ice/spikes only. |
| `creditAchievementRewardThroughPersist` | Feat claim is a persist-lock Doka credit with no `applyUnpaidDeathPenaltyToWrite`. Distinct from **#391** (GameKey). |

## Still OPEN from prior matrices (do not re-file)

| ID | Pair | Status on `0f5363f` |
| :--- | :--- | :--- |
| MIMA-2026-08-31-001 | Swap × lava/ice/rift/thorns | `swapPositions` copies coords only. **#541** is live-tile / leftover-walk, not landing. |
| MIMA-2026-08-31-002 | Controlled-summon walk × **hazards** | Dest occupancy closed. Instant teleport; no landing. **#467** is occupancy-only. |
| MIMA-2026-08-31-005 | Push/pull × hazards | Resolvers + occupancy tests; **zero** `resolvePlayerCast` sites. REPORT_ONLY |
| MIMA-2026-08-31-008 | AI/summon × Void Rift **walk** tile | Walk extra still player-only (`voidRiftWalkDamage` inside `applyBattleWalkHazards`) |
| MIMA-2026-09-01-002 | Occupants × player walk **path** | Barriers in dest highlight. `findPath` intermediates still ignore living combatants |
| MIMA-2026-09-01-006 | Summon AI walk × lava/ice/spikes | `executeSummonAction.applyMovement` is `isCellFree` only |
| MIMA-2026-09-02-002 | Destack / unseal / spawn slide × lava | `findNearestFreeCell` / `findBattleStartCell` hazard-blind. **#553** is portal-origin destack, not lava |
| MIMA-2026-09-02-003 | GameKey × unpaid death 20/40 | Raw `#ok` commit — **#391** in flight |
| MIMA-2026-09-02-004 | Boss VOID_TILES × walk | Type `"void"` stored; landing ignores it (also unreachable until 09-22-001) |
| MIMA-2026-09-02-005 | Pacifist × summon damage | `dealDamage` never flips the ref |
| MIMA-2026-09-02-006 | Dawn +10 HP | `damageToPlayer > 0` gate (unreachable until 09-22-001) |
| MIMA-2026-09-21-001 | Registry HP/MP hooks × player | Helper **#443**; WX wire still missing |
| MIMA-2026-09-21-002 | Dawn +1 MP applied as AP | **#376** copy-only |
| MIMA-2026-09-21-003 | Striker × summon **AI** kit | Control path records; executor does not — **#327** / **#370** adjacent |
| MIMA-2026-09-21-004 | Control preview × player execute origin | Blue ring still summon-origin |
| MIMA-2026-09-22-001 | Kit `new Map()` × phase abilities | Still first kit id forever |
| MIMA-2026-09-22-002 | Kit execute × range / LoS | Always player tile |
| MIMA-2026-09-22-003 | `playerApModifier` × turn-start restore | Formula restore wins |
| MIMA-2026-09-22-004 | Ability `newPositions` / larvae / shock | WX consume still drops them |
| MIMA-2026-09-23-001 | Glass / Titans `onDamageDealt` | Primary `applyDamageToEnemy` + incoming skip the hook — **#476** |
| MIMA-2026-09-23-002 | Doka Fever HP / Titans `hpMap` | Predicate + snapshot order — **#476** |
| MIMA-2026-09-23-003 | Arcane Overflow fizzle | Status-apply only — **#476**. AP −1 min-1 **raising 0-AP** is this run’s 001 |
| MIMA-2026-09-23-004 | Iron Curse heal ×0.5 | Constant unused — **#476** |
| MIMA-2026-09-24-001 | Mist / Winds store commit | Turn-order copy only |
| MIMA-2026-09-24-002 | Null Field × ice Frozen vs lava Burning | Debuff veto vs dot land |
| MIMA-2026-09-24-003 | Boss TELEPORT / KNIGHT_JUMP × lava | `getAdjacentTiles` hazard-blind |
| MIMA-2026-09-24-004 | Doka Fever × non-kill Doka | Only `handleBattleEnd` kill Doka |

## Closed / in-flight (do not re-open or clone)

| Pair | Status |
| :--- | :--- |
| Frozen × player/AI/summon MP | Closed (`battleWalkMpCost` / `enemyWalkCostPerTile`) |
| Wisp / Drain × `healUsed` | Closed on main; **#380** leftover PR; **#550** is kit-buff then Blood Mend HP |
| Pacifist × Strike highlight | Closed |
| Recap / persist-pending × world input | Closed |
| Attack Nearest **execute** origin | Closed (`attackNearestLiveCasterPos`) |
| Void Rift / Mist / Swift Winds player tick | **#443** helper; WX deferred (player row) |
| GameKey × unpaid death | **#391** in flight (do not fold achievement claim into that PR) |
| Walk occupancy + summon-control Occupied | **#467** in flight |
| Swap live tile + leftover walk | **#541** in flight |
| Death Realm pending × canvas walk | **#554** in flight |
| Portal-seeded destack origin | **#553** in flight |
| Mark / Lifesteal Nova empty-tile execute | **#551** / **#543** in flight |
| Achievement × spell observation | No observe path — not invented |

## Matrix (evidence-backed)

| Pair | Should | Do (on `main`) | Gap |
| :--- | :--- | :--- | :--- |
| Arcane Surge / Overflow × 0-AP Timestep | Discount never **raises** a free spell; empty wallet can still Timestep | `Math.max(1, base - 1)` turns 0 into 1; preview, execute, and Attack Nearest all gate on that cost | [001](./ACTION_IDS_MIMA_2026-09-25.md) |
| Arcane Surge × summon-control / summon-AI AP | Map-wide AP −1 applies to every AP spend, **or** copy says player spells only | `planSummonControlCast` and `summonExecutor` use raw `spell.apCost` | [002](./ACTION_IDS_MIMA_2026-09-25.md) |
| Thorned Ground × enemy / summon walk | “Moving far deals extra damage” for every combatant, **or** copy says player walks | Only `applyBattleWalkHazards` (player mouse/touch). Enemy landing is lava/ice/spikes. Summon control/AI skip it | [003](./ACTION_IDS_MIMA_2026-09-25.md) |
| Achievement claim × unpaid death 20/40 | Honour pending cut on the persist lock like other Doka credits | `creditAchievementRewardThroughPersist` commits raw `#ok`. Absolute spends honour pending. GameKey is **#391** | [004](./ACTION_IDS_MIMA_2026-09-25.md) |
| Swap × hazards | Same as walk | Still no | 08-31-001 |
| Destack × lava | Avoid or land | Still no | 09-02-002 |
| GameKey × unpaid death | Honour 20/40 | Still raw; **#391** | 09-02-003 |
| Pacifist × wolf melee | Fail feat | Still true | 09-02-005 |
| Void Rift tick × player HP | Commit | Registry misses player; **#443** | 09-21-001 |
| Glass Realm × primary hit | 2× | Bounce/summon only | 09-23-001 |
| Push/pull × hazards | If shipped | Unwired | 08-31-005 |
| Recap / persist-pending × lava | Block | Yes | closed |
| Frozen × MP | 2× | Yes | closed |
| Blood Moon × player-cast damage | 1.25× | Yes (`spellEngine`) | not a gap |
| Drain × no_healing | Fail | Closed | not a gap |

## Non-findings (do not invent)

- No enemy-cast observation → `ownedSpells` unlock.
- `worldFeatures.ts` teleport pads / conveyor catalog is data + tests only; WX does not consume it.
- Gravity Well / Fog of War remain unused `_is*` flags — already classified as placeholders, not re-filed.
- Paper Windstorm announce vs 30%/50% miss stays PXA-owned; `getEffectiveSpellRange` still ignores `MAP_MODIFIER_PAPER_WINDSTORM_RANGE_REDUCTION`.
- Timestep is AP/MP restore, not a teleport; extra casts after restore correctly raise `maxApUsedInTurn` (hard_3) **when the debit happens**. Surge turning Timestep into a 1-AP **gate** is 001; Timestep still returns `"no_ap"` so the debit/hard_3 peak is not the hole.
- Ice tile (−2 MP) + Frozen Terrain (2× walk) still compound when Frozen actually applies. Null Field is 09-24-002.
- Death persist does not pay challenge rewards (`deathTriggered` early-return).
- DoT × last hostile still goes through `shouldContinuePlayerTurnAfterHazard` / victory tests.
- Sacrifice already records challenge self-HP (`recordChallengeSelfHpLoss`).
- Thorned registry `onDamageDealt` `pathLength` hook is still dead (threshold also disagrees with the live helper). Walk helper still pays **the player**. Do not re-file the dead hook; the enemy/summon skip is 003.
- Summon-control kit AP is a separate pool from `recordChallengeApSpend` (player execute). Not a hard_3 bypass unless product counts minion AP as the player’s. Map-wide **discount** skipping that pool is 002, not a challenge-peak claim.
- `applyRangeModification` / `tickModifiableRangeBonuses` are unused; no live writer. Dead API, not a pair.
- Shrine `covenantBuffMapsRef = 3` is written and never read in combat — incomplete content, not scored as a pair.
- App `boostMode` never reaches WX (`GameFlow` prefixes the prop unused; WX `_setBoostMode` unused). Wiring, not a Fever/boost multiply join.
- Void Rift “displacement” is the per-player-turn warped **tile** (`setVoidRiftTile`), not a unit teleport. Walk-on-tile extra remains 08-31-008.

## Missing tests (actionable)

1. `mapModifierRegistry.applyApCost(0, {"arcane_surge"}) === 0` **or** Timestep with Surge and 0 AP still `planPlayerCastResources.ok` (001).
2. Overflow stacked with Surge on base 0 stays 0 (001).
3. Summon-control kit with Surge: wolf 2-AP spell costs 1 **or** announce says player spells only (002).
4. Summon AI executor with Surge: `applyCast` spends 1 on a 2-AP kit **or** same copy change (002).
5. Thorned map: enemy 4-tile walk HP drops by `thornedGroundWalkDamage(4)` **or** announce says player walks (003).
6. Controlled wolf 3-tile walk on Thorned commits store HP (003).
7. Pending unpaid death 80 Doka + feat claim 500 ⇒ lock Doka honours the cut (004). `cutConfirmed` claim does not subtract again.
8. Still missing from prior ledgers: Swap lava; destack lava; GameKey pending death; VOID_TILES land; wolf melee × pacifist; summon AI lava landing; findPath ∩ occupants === ∅; Void Rift player tick; Striker × AI archer; control preview origin; kit cooldown map; kit range; Dawn AP surviving restore; MAP_ROTATE `newPositions`; Glass primary hit; Fever enemy HP; Overflow fizzle; Iron Curse ×0.5; Mist/Winds store; Null Field ice log; boss teleport lava; Fever shrine/ground/challenge Doka.

Actionable records: [`ACTION_IDS_MIMA_2026-09-25.md`](./ACTION_IDS_MIMA_2026-09-25.md).
