# Mechanic interaction matrix — 2026-10-28

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / 09-21…10-27)  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. “Watch enemy cast → unlock spell” still does not exist. Push/pull remain unwired (08-31-005). Blood Moon and Mirror Field **are** wired in `resolvePlayerCast` (Sacrifice skip is 10-21-009; player DoT skip is 10-22-001; Swap skip is 10-23-003; summon kit skip is 10-24-001).

## Priority surfaces on this HEAD

Main has not moved since #332. This hunt targeted leftover **live** splits that 10-27 did not score: the boss-AI `allEnemies` roster versus `getPlayerSideTargets`, Starved Vampire drain radius/heal, Weeping Pawn promote versus queen rays, and Final Pawn ghost deadline versus lifespan. In-flight **#1173** / **#1131** / **#1062** / **#1012** / **#1035** / **#1040** / **#1042** / **#1058** / **#1094** / **#1152** / **#852** / **#858** / **#965** / **#948** are not cloned.

## New ACTION_IDs

`docs/automation/ACTION_IDS_MIMA_2026-10-28.md` 001–004.

| Pair | Should | Do | Deterministic | Contradict | Bypass | Feedback | Tests |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Boss `allEnemies` × summons/minions occupancy | every other live unit | `getPlayerSideTargets` ∩ `type==="enemy"` → `[]` | **Y** (empty) | vs 19-cap / rays | **Y** (stack) | silent | **none** |
| VAMPIRIC_AOE × range × boss heal | ≤3 tiles; boss heals | always 10 to player; no boss HP | **Y** (global) | vs guide “spread out” | **Y** | radius log lies | none |
| PROMOTE_QUEEN × ATTACK_ALL_LINES / `pieceType` | queen rays after promote | melee/walk only; pawn art | missing | vs “increased range” | **Y** | queen log lies | none |
| GHOST_SUMMON × 5-turn victory | despawn or fail at 0 | timer ticks; ghosts stay | missing | vs “defeat in 5 turns” | **Y** | deadline is flavour | none |

## Rejected almost-findings

| Candidate | Why |
| :--- | :--- |
| WX drops `damageToTargets` / `newPositions` / `newLarvae` / `newShockTiles` / `newIllusions` | **09-22-004** (001 is the *input* roster that would starve that consume) |
| LARVAE_EXPLODE on walk | **10-27-003** / **#1173**; do not re-ask for combatant larvae (**09-22-004**) |
| RESONANCE_SHOCKWAVE player-cast buffer | **10-27-002** |
| REFLECT_SHIELD `turnsLeft` | **10-27-004** |
| SPLIT_ROOKS revive | **10-27-005** |
| Boss `type: move/attack` consume | **10-27-001** |
| LIFE_DRAIN `damageDealtToPlayer` never passed | **10-27-002** extras-buffer class; 002 here is the empty *success* payload + VAMPIRIC radius |
| Exsanguinated `stat: "healing"` vs `healRecv` | **#1040** / **#1035** |
| PAGES_OF_DOOM school counts | **#1035** |
| INVINCIBLE_PHASE incoming HP | **10-25-004** (004 here is despawn/fail, not the incoming gate) |
| Phantom / scroll HP stamp 20 | **#1152** |
| DAMAGE_IMMUNE + ANCHOR step | **#1094** |
| `magicReflectActive` | **#1058** |
| MAP_ROTATE / MIRROR_INVERT `newPositions` | **09-22-004** / **#858** |
| BOARD_CLAIM later AP | **10-26-003** / **#1131** |
| SPELL_MIRROR / COMBO_REPLAY buffer | **10-26-002** / **#1131** |
| Twin death × MONARCH_ABSORB | **10-26-004** / **#1131** |
| Generic HP phase-2 reader / Weeping full-HP log | **10-26-001** / **#1131** (003 does not re-file that heal) |
| Dawn `damageToPlayer: -10` | **09-02-006** |
| INK_VEIL → GLYPH_TRAP | **10-25-005** |
| Shock-tile *walk* tick | same persisted-coords-on-step class as 10-27-003; shock consume field is 09-22-004 |
| Push/pull × hazard | **08-31-005** REPORT_ONLY |
| Spell observe → unlock | No path (non-finding) |
| Gravity Well / Fog of War | Unused `_is*` placeholders |
| White / rest **entry** × `mapsVisited` | Correctly skipped (10-24-006 is BR rooms + rest-**exit**) |

## Prior OPEN (re-verified, not re-filed)

08-31-001/002/005/008, 09-01-001/002/005/006, 09-02-001…006, 09-21-001…004, 09-22-001…004, 09-23-001…004, 09-24-001…004, 09-25-001…004, 09-26-001…004, 09-27-001…004, 09-28-001…004, 09-29-001…004, 10-21-001…009, 10-22-001…004, 10-23-001…004, 10-24-001…007, 10-25-001…005, 10-26-001…004, 10-27-001…005. HEAD still `0f5363f`.

## Missing tests (actionable)

1. Boss roster: player + wolf (`type: "summon"`) + scroll (`type: "enemy"`) ⇒ `allEnemies` length 2, not 0; second scroll dest ≠ live scroll cell (001).
2. VAMPIRIC_AOE: player Manhattan 4 ⇒ `damageToPlayer` 0; dist 2 ⇒ 10 and boss HP increased; LIFE_DRAIN extra 10 ⇒ +15 HP / +1 atk (002).
3. `decideWeepingPawnAction` with `phase2Triggered: true` can return `ATTACK_ALL_LINES`; promote writes `pieceType: "queen"` (003).
4. Five `invincibleTurnsLeft` decrements ⇒ ghost ids gone **or** documented fail; a wolf id remains (004).

Actionable records: [`ACTION_IDS_MIMA_2026-10-28.md`](./ACTION_IDS_MIMA_2026-10-28.md).
