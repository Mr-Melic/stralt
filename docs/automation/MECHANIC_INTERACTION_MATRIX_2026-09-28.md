# Mechanic interaction matrix — 2026-09-28

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / 09-21…09-27 matrices)  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. “Watch enemy cast → unlock spell” still does not exist (`ownedSpells` = starter ∪ backend catalog). Attack Nearest origin is **player tile** on purpose (`attackNearestLiveCasterPos`). Time Warp **is** wired (15s). Blood Moon 1.25× and Mirror Field 20% reflect **are** wired in `resolvePlayerCast` (announce is flavour — do not invent a summon-kit skip). Paper Windstorm rate vs “reach halved” stays PXA-owned.

## Priority surfaces (this run)

HEAD has not moved since 09-21. Focus was consume joins prior matrices named as examples (achievement × persist, drain × shield, healer AI × heal metadata, unpaid death × spends) but never scored as pairs.

| Surface | Why it matters for pairs |
| :--- | :--- |
| `jackpotHealVisible` + `checkAndFireAchievement` | Banner unlocks before `persistAbsoluteProgress`; `!inBattle` skips in-fight jackpots |
| `upgradeSpell` / `renameCharacter` | Canister spends; only absolute `saveBattleStats` honours unpaid 20/40 |
| Shield Charm `playerTakesDamage` residual vs drain `healAmount` | Absorb returns 0 HP lost; enemy still `hpAfterHeal`s catalog amount |
| Queen kit `starter-heal` + `decideHealer` + WX `spellRange === 0` | Ally-heal intent never consumes |
| In-flight Death Realm / destack / Haste / Pacifist / landing PRs | Do not clone (#554 #576 #595 #596–#608 / **#617** / **#671** / **#714** / **#728**) |

## Still OPEN from prior matrices (do not re-file)

| ID | Pair | Status on `0f5363f` |
| :--- | :--- | :--- |
| MIMA-2026-08-31-001 | Swap × lava/ice/rift/thorns | `swapPositions` still copies coords only (`spellEngine.ts` 768) |
| MIMA-2026-08-31-002 | Controlled-summon walk × **hazards** | Occupancy closed; landing still missing (**#728** helper, unwired) |
| MIMA-2026-08-31-005 | Push/pull × hazards | Resolvers + occupancy tests; **zero** `resolvePlayerCast` call sites. REPORT_ONLY |
| MIMA-2026-08-31-008 | AI/summon × Void Rift **walk** tile | Walk-on extra is still player-walk-only |
| MIMA-2026-09-01-002 | Barrier / occupants × player walk path | Dest highlight yes; A* walls/void/portals only |
| MIMA-2026-09-01-006 | Summon AI walk × lava/ice/spikes | Enemy landing only |
| MIMA-2026-09-02-002 | Destack / unseal × lava | `isCellFree` has no hazard axis |
| MIMA-2026-09-02-003 | GameKey × unpaid death | Shop commit is raw canister Doka (**#391**) |
| MIMA-2026-09-02-004 | Boss VOID_TILES | `newVoidTiles` unused; type `"void"` ignored |
| MIMA-2026-09-02-005 | Pacifist × player-side summon damage | Ref stays true (**#714** kit-cast half only) |
| MIMA-2026-09-02-006 | Dawn +10 HP | Log only (`damageToPlayer > 0`) |
| MIMA-2026-09-21-001…004 | Player modifier ticks; Dawn MP-as-AP; Striker × summon AI; control preview origin | Still open / **#443** / **#376** / **#327** |
| MIMA-2026-09-22-001…004 | Boss kit `new Map()`; kit range/LoS; `playerApModifier` wipe; dropped ability fields | Still open |
| MIMA-2026-09-23-001…004 | Glass/Titans hook miss; Fever HP / Titans snapshot; Overflow fizzle; Iron Curse heal | Still open |
| MIMA-2026-09-24-001…004 | Mist/Winds copy; Null Field ice vs lava; boss teleport × lava; Fever 2× kill-only | Still open |
| MIMA-2026-09-25-001…004 | Surge 0-AP Timestep floor; Surge skip summon kits; Thorned player-only; feat claim × unpaid death | Still open (**#566**) |
| MIMA-2026-09-26-001…004 | Chaos `turnOrderRef`; one-shot / victory `applyRewards` × unpaid death; ice Frozen MP | Still open (**#617**) |
| MIMA-2026-09-27-001…004 | Summon spawn × lava; Shield Charm × env/Mirror Field; Death Realm recap dismiss; `loot_10_doka` counter | Still open (**#671**) |

## Closed since last merged matrix (09-02) — do not re-open

| ID | Pair | Closed by |
| :--- | :--- | :--- |
| 09-02-001 | Frozen × enemy/summon AI reach | `enemyWalkCostPerTile` / `09acff2` |
| 09-01-001 | Frozen/Slime player execute 2× | `battleWalkMpCost` / `054e38b` |
| 09-01-005 | no_healing × Wisp / Drain | Wisp + `9f36239` |
| Pacifist preview | Range paint no longer fails the feat | #232 |
| Recap persist-pending | Overlay + `victoryPersistPending` | #211 / #243 |
| Challenge HUD after first action | `3e95eab` | |
| Boss Rush victory feats | `451d2ed` | |
| Attack Nearest origin | Player tile (`67dd095`) | |

## Matrix (evidence-backed, this run)

| Pair | Should | Do (on `main`) | Gap |
| :--- | :--- | :--- | :--- |
| `jackpot_heal` × heal persist / in-battle HUD | Unlock after commit; battle jackpots still count | Banner unlocks first; `!inBattle` skips combat jackpots | [001](./ACTION_IDS_MIMA_2026-09-28.md) |
| `upgradeSpell` / rename × unpaid death 20/40 | Honour or refuse | Absolute heal/Items honour; these spends do not | [002](./ACTION_IDS_MIMA_2026-09-28.md) |
| Shield Charm × enemy/boss drain heal | Lifesteal tracks residual HP | Catalog `healAmount` even at 0 residual | [003](./ACTION_IDS_MIMA_2026-09-28.md) |
| Healer AI × Blood Mend range 0 / WX self-heal | Ally HP or honest caster | Approach forever; log lies | [004](./ACTION_IDS_MIMA_2026-09-28.md) |
| Swap × hazards | Same as walk | Still no | 08-31-001 |
| Destack / unseal × lava | Avoid or land | `isCellFree` only | 09-02-002 |
| Summon AI / control walk × lava | Same as enemy walk | Enemy landing only | 09-01-006 / 08-31-002 |
| Shield Charm × spell / DoT / melee | Absorb | Yes (`playerTakesDamage`) | closed |
| Shield Charm × lava / Mirror Field | Absorb or honest copy | Raw HP | 09-27-002 |
| Recap visible × world clicks | Block | Yes | closed |
| Victory persist-pending × lava / encounter | Block | Yes | closed |
| Death Realm pending × portal / new encounter | Block | Yes | closed (portals/encounters) |
| Summons × portals (occupy / path / cleanup) | Impassable; reset roster | Yes | closed |
| DoT / plague × last-hostile victory | Victory or death, not both | Yes + tests | closed |
| Achievement × spell observation | — | No observe path | not invented |
| Blood Moon / Mirror Field × player cast | Wired | `spellEngine` 895–907 | not invented |
| Push/pull × hazards | If shipped | Unwired | 08-31-005 |

## Missing tests (actionable)

1. Jackpot persist `false` ⇒ `jackpot_heal` not unlocked and banner cleared; persist `true` in battle still lists the feat on recap (001).
2. Pending unpaid 80 Doka + `upgradeSpell` cost 10 / rename 100 either refuses or commits an honoured wallet; `cutConfirmed` unchanged (002).
3. Shield Charm 20 + enemy Life Drain 10 ⇒ player HP unchanged, caster HP unchanged (003). Boss kit drain same.
4. Queen with only `starter-heal` and a wounded ally: ally HP rises **or** queen does not `kind: "move"` toward them forever (004).
5. Still missing from prior OPEN IDs: Swap lava; destack/unseal lava; summon AI dest === lava; Chaos wrap ref sync; Surge `applyApCost(0) === 0`; feat claim + pending death; summon spawn lava (09-27-001).

Actionable records: [`ACTION_IDS_MIMA_2026-09-28.md`](./ACTION_IDS_MIMA_2026-09-28.md).
