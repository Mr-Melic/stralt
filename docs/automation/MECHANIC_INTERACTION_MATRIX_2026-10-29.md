# Mechanic interaction matrix — 2026-10-29

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / 09-21…10-28)  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. “Watch enemy cast → unlock spell” still does not exist. Push/pull remain unwired (08-31-005). Blood Moon and Mirror Field **are** wired in `resolvePlayerCast` (Sacrifice skip is 10-21-009; player DoT skip is 10-22-001; Swap skip is 10-23-003; summon kit skip is 10-24-001).

## Priority surfaces on this HEAD

Main has not moved since #332. 10-28 scored ability-path roster / Vampire drain / Weeping promote / Final Pawn ghosts. This hunt scored leftover **live kit-spell geometry** that 09-22-001 makes the reachable boss action, plus Dawn's double turn-gate and Midnight Bishop's missing twin body. Same-cron **#1280** already owns kit dest stacking (caster written onto the player cell) — not re-filed. In-flight **#1224** / **#1173** / **#1131** / **#1062** / **#1012** / **#1035** / **#1040** / **#1042** / **#1058** / **#1094** / **#1152** / **#852** / **#858** / **#965** / **#948** are not cloned.

## New ACTION_IDs

`docs/automation/ACTION_IDS_MIMA_2026-10-29.md` 001–003.

| Pair | Should | Do | Deterministic | Contradict | Bypass | Feedback | Tests |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Kit CL / Nova × bounce / AoE | catalog geometry | one `playerTakesDamage` | **Y** | vs “bouncing twice” | **Y** (summons live) | lore lies | **none** |
| DAWN_BUFF × turn count | 3rd-turn roll | AI `% 3` then extra default 1 | **Y** (never) | vs “every 3rd turn” | n/a | silent | none |
| TWIN_FLANK × second body | two bishops | `twin_${id}` nobody owns | **Y** | vs “two bosses” | **Y** | log-only flank | none |

## Rejected almost-findings

| Candidate | Why |
| :--- | :--- |
| Kit caster dest = player cell | **#1280** (same 00:00 cron; `wxBossKitSpellRelocatesCasterToDest`) |
| Shock-tile walk tick / unpainted tiles | **10-27-003** class; consume field **09-22-004** `newShockTiles` (10-28 explicit non-file) |
| Chain lightning adjacent-not-on-tile | same shock persisted-coords family; 10-28-001 already owns chain × empty `allEnemies` |
| WX drops `newPositions` / `damageToTargets` / `newLarvae` | **09-22-004** (003 here is the missing twin *body*, not the field drop) |
| MAP_ROTATE / MIRROR_INVERT `newPositions` | **09-22-004** / **#858** |
| Dawn `damageToPlayer: -10` consume | **09-02-006** (002 here is the extra/currentTurn double-gate that starves that roll) |
| Dawn AP vs MP log | **#376** |
| LIFE_DRAIN extra never passed | **10-27-002** extras-buffer class |
| RESONANCE / SPELL_MIRROR extras | **10-27-002** / **10-26-002** / **#1131** |
| Kit self-buff `debuffStat ?? "atk"` / 0-dmg Mirror/Barrier/Swap/Mark/Sacrifice | **10-25-001** fallthrough |
| Kit Windstorm / Void Mirror / scale / crit | **10-24-002** |
| Player CL bounce / `hitsMultiple` pack | **10-23-002** / **10-22-002** |
| `magicReflectActive` unread | **#1058** |
| Generic HP phase-2 / Weeping full-HP log | **10-26-001** / **#1131** |
| Twin death × MONARCH_ABSORB | **10-26-004** / **#1131** |
| GHOST 5-turn / INVINCIBLE incoming / spawn HP 20 | **10-28-004** / **10-25-004** / **#1152** |
| CURSE `stat: "all"` / Exsanguinated `healing` / PAGES school | **#1035** / **#1040** wrong-key class |
| INK_VEIL → GLYPH_TRAP | **10-25-005** |
| ADVANCE occupancy / destack onto lava | **09-02-002** |
| Push/pull × hazard | **08-31-005** REPORT_ONLY |
| Spell observe → unlock | No path (non-finding) |
| Gravity Well / Fog of War | Unused `_is*` placeholders |
| White / rest **entry** × `mapsVisited` | Correctly skipped (10-24-006 is BR rooms + rest-**exit**) |

## Prior OPEN (re-verified, not re-filed)

08-31-001/002/005/008, 09-01-001/002/005/006, 09-02-001…006, 09-21-001…004, 09-22-001…004, 09-23-001…004, 09-24-001…004, 09-25-001…004, 09-26-001…004, 09-27-001…004, 09-28-001…004, 09-29-001…004, 10-21-001…009, 10-22-001…004, 10-23-001…004, 10-24-001…007, 10-25-001…005, 10-26-001…004, 10-27-001…005, 10-28-001…004. HEAD still `0f5363f`.

## Missing tests (actionable)

1. Kit CL with a player-side wolf 1 tile from the player writes wolf HP (or a bounce id); Frost Nova radius 2 includes a minion (001).
2. `applyBossAbility(DAWN_BUFF, p, { bossPhase1TurnCount: 3 })` has a payload; `?? 1` default does not (002).
3. After TWIN_FLANK, two bishop ids exist **or** the guide no longer says two; merge leaves one (003).

Actionable records: [`ACTION_IDS_MIMA_2026-10-29.md`](./ACTION_IDS_MIMA_2026-10-29.md).
