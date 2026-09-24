# Mechanic interaction matrix — 2026-09-24

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (same as the 09-21 / 09-22 / 09-23 matrices / #332). No gameplay merge since then.  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. “Watch enemy cast → unlock spell” still does not exist (`ownedSpells` = starter ∪ backend catalog). Gravity Well / Fog of War remain announce-only registry placeholders. Blood Moon 1.25× and Mirror Field 20% reflect stay wired in `spellEngine`. Paper Windstorm rate vs announce stays PXA-owned. Push/pull stay unwired (08-31-005 REPORT_ONLY). Do not clone in-flight **#327** / **#370**, **#331** / **#373**, **#336**, **#376**, **#379**, **#380**, **#382**, **#386**, **#389**, **#391**, **#410**, **#443**, **#467**, **#476**, **#487**, **#489**, **#491**, **#495**, **#496**, **#498**, **#508**.

## Priority surfaces (this run)

HEAD did not move. Re-audit focused on turn-start hooks that Void/Plague already special-case, Null Field’s effect-type split vs terrain statuses, boss relocators vs hazard landing, and Doka Fever’s single `applyRewardMultiplier` call site.

| Surface | Why it matters for pairs |
| :--- | :--- |
| `applyTurnStart` vs store commit | Void Rift / Plague Zone copy HP into `updateCombatant`; Mending Mist / Swift Winds stop at the turn-order **copy** |
| `toCombatantEntry` | Turn-order rows are new objects (`combatantStore.ts` 141–168), so registry HP/MP mutation is not the sprite bar |
| `applyActiveEffect` + Null Field | Dots skip `applyEffectApplication`; ice Frozen is a `debuff` |
| Boss `newBossPosition` | TELEPORT_ADJACENT / KNIGHT_JUMP write x,y with no lava/spike landing |
| `applyRewardMultiplier` | Only `handleBattleEnd` kill Doka; shrine / ground / dungeon / challenge Doka skip it |

## Still OPEN from prior matrices (do not re-file)

| ID | Pair | Status on `0f5363f` |
| :--- | :--- | :--- |
| MIMA-2026-08-31-001 | Swap × lava/ice/rift/thorns | `swapPositions` copies coords only (`WorldExploration.tsx` 9389–9401) |
| MIMA-2026-08-31-002 | Controlled-summon walk × **hazards** | Dest occupancy closed. Instant teleport; no landing. **#467** is occupancy-only |
| MIMA-2026-08-31-005 | Push/pull × hazards | Resolvers + occupancy tests; **zero** `resolvePlayerCast` sites. REPORT_ONLY |
| MIMA-2026-08-31-008 | AI/summon × Void Rift **walk** tile | Walk extra still player-only |
| MIMA-2026-09-01-002 | Occupants × player walk **path** | Barriers in `isBattleWalkTileBlocked`. `findPath` intermediates still ignore living combatants |
| MIMA-2026-09-01-006 | Summon AI walk × lava/ice/spikes | `executeSummonAction.applyMovement` is `isCellFree` only |
| MIMA-2026-09-02-002 | Destack / unseal / spawn slide × lava | `findNearestFreeCell` / `findBattleStartCell` hazard-blind (summon spawn is another call site) |
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
| MIMA-2026-09-23-003 | Arcane Overflow fizzle | Status-apply only — **#476** |
| MIMA-2026-09-23-004 | Iron Curse heal ×0.5 | Constant unused — **#476** |

## Closed / in-flight (do not re-open or clone)

| Pair | Status |
| :--- | :--- |
| Frozen × player/AI/summon MP | Closed (`battleWalkMpCost` / `enemyWalkCostPerTile`) |
| Wisp / Drain × `healUsed` | Closed on main; **#380** leftover PR |
| Pacifist × Strike highlight | Closed |
| Recap / persist-pending × world input | Closed |
| Attack Nearest **execute** origin | Closed (`attackNearestLiveCasterPos`) |
| Void Rift / Mist / Swift Winds player tick | **#443** helper; WX deferred (player row). Enemy/summon Mist/Winds store commit is **this run’s 001** |
| GameKey × unpaid death | **#391** in flight |
| Walk occupancy + summon-control Occupied | **#467** in flight |
| Victory HP floor > persist max | **#386** in flight |
| Challenge Doka on first recap | **#491** in flight (display). Fever skip of that Doka is 004 |
| Betrayal death pipeline | **#487** in flight |

## Matrix (evidence-backed)

| Pair | Should | Do (on `main`) | Gap |
| :--- | :--- | :--- | :--- |
| Mending Mist × enemy/summon HP | 5% max HP on the store + bar | `applyTurnStart` mutates the turn-order copy; Void/Plague have the only `updateCombatant` | [001](./ACTION_IDS_MIMA_2026-09-24.md) |
| Swift Winds × enemy/summon MP | +2 MP on the unit the AI spends | Same copy; `CombatantEntry` has no `mp` field | [001](./ACTION_IDS_MIMA_2026-09-24.md) |
| Null Field × ice Frozen | Suppress **or** let terrain land; log must match | Ice logs “Slowed!” then `debuff` is vetoed; lava Burning is a `dot` and lands | [002](./ACTION_IDS_MIMA_2026-09-24.md) |
| Boss teleport / knight jump × lava/spikes | Avoid or pay landing | `getAdjacentTiles` is walkable+occupied only; WX writes x,y | [003](./ACTION_IDS_MIMA_2026-09-24.md) |
| Doka Fever × shrine / ground / dungeon / challenge Doka | 2× every Doka credit while the modifier is live, **or** announce “kill Doka” | Only `handleBattleEnd` kill Doka calls `applyRewardMultiplier` | [004](./ACTION_IDS_MIMA_2026-09-24.md) |
| Swap × hazards | Same as walk | Still no | 08-31-001 |
| Destack × lava | Avoid or land | Still no | 09-02-002 |
| GameKey × unpaid death | Honour 20/40 | Still raw; **#391** | 09-02-003 |
| Pacifist × wolf melee | Fail feat | Still true | 09-02-005 |
| Void Rift tick × player HP | Commit | Registry misses player; **#443** | 09-21-001 |
| Glass Realm × primary hit | 2× | Bounce/summon only | 09-23-001 |
| Push/pull × hazards | If shipped | Unwired | 08-31-005 |
| Achievement × spell observation | — | No observe path | not invented |
| Recap / persist-pending × lava | Block | Yes | closed |
| Frozen × MP | 2× | Yes | closed |
| Blood Moon × damage | 1.25× | Yes (`spellEngine`) | not a gap |

## Non-findings (do not invent)

- No enemy-cast observation → `ownedSpells` unlock.
- `worldFeatures.ts` teleport pads / conveyor catalog is data + tests only; WX does not consume it.
- Gravity Well / Fog of War remain unused `_is*` flags — already classified as placeholders, not re-filed.
- Timestep is AP/MP restore, not a teleport; extra casts after restore correctly raise `maxApUsedInTurn` (hard_3).
- Ice tile (−2 MP active effect) + Frozen Terrain (2× walk cost) compound through restore + `battleWalkMpCost` **when Frozen actually applies**. Null Field breaks that join (002).
- Death persist does not pay challenge rewards (`deathTriggered` early-return).
- DoT × last hostile still goes through `shouldContinuePlayerTurnAfterHazard` / victory tests.
- Sacrifice already records challenge self-HP (`recordChallengeSelfHpLoss`).
- Thorned Ground walk extra is the parallel `thornedGroundWalkDamage` helper, not the registry `onDamageDealt` `pathLength` hook. Walk still pays. Do not file the dead hook as an interaction.
- Summon-control kit AP is a separate pool from `recordChallengeApSpend` (player execute). Not a hard_3 bypass unless product counts minion AP as the player’s.
- `applyRangeModification` is unused; no live spell writes it. Dead API, not a pair.

## Missing tests (actionable)

1. Mending Mist: after an enemy turn-start, store `hp` and `enemyHpMap` rise by `floor(maxHp * 0.05)` **or** the announce drops regen (001).
2. Swift Winds: AI `currentMp` after turn-start is base+2 **or** copy drops “+2 MP” (001).
3. Null Field + ice step: either Frozen `stat:"mp"` is on `activeEffects` **or** the Slowed log is absent (002).
4. Null Field + lava step: Burning DoT still applies (002 control — must not start suppressing dots).
5. TELEPORT_ADJACENT onto a lava-adjacent player: dest is a non-lava neighbor **or** store HP drops in the lava band and Burning applies (003).
6. Doka Fever map: shrine 300 / ground pickup / dungeon-complete bonus / challenge Doka are 2× **or** announce says kill Doka only (004).
7. Still missing from prior ledgers: Swap lava; destack lava; GameKey pending death; VOID_TILES land; wolf melee × pacifist; summon AI lava landing; findPath ∩ occupants === ∅; Void Rift player tick; Striker × AI archer; control preview origin; kit cooldown map; kit range; Dawn AP surviving restore; MAP_ROTATE `newPositions`; Glass primary hit; Fever enemy HP; Overflow fizzle; Iron Curse ×0.5.

Actionable records: [`ACTION_IDS_MIMA_2026-09-24.md`](./ACTION_IDS_MIMA_2026-09-24.md).
