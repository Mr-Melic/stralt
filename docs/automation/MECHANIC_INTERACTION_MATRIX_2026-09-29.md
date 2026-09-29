# Mechanic interaction matrix — 2026-09-29

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since 09-21…09-28 / #332)  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. Do not re-file OPEN 08-31…09-28 IDs or clone in-flight PRs listed on the ACTION_IDs ledger.

## Priority surfaces (still this HEAD)

Combat and persist code did not move. This pass looks at consume joins prior matrices never named: Mark’s ×2 helper vs early-return spells, Fury Potion vs the same early-return / summon funnel, Shield Charm vs **unit/boss** reflect (09-27-002 listed environment + map-modifier Mirror Field only), and map modifiers vs Boss Rush spawn (the only `setActiveMapModifierTypes` writer is the overworld portal roll).

## New ACTION_IDs

See [`ACTION_IDS_MIMA_2026-09-29.md`](./ACTION_IDS_MIMA_2026-09-29.md).

| ID | Pair | Gap |
| :--- | :--- | :--- |
| 001 | Mark × Poison Arrow / Sacrifice / Swap | ×2 + consume only in `calculatePlayerDamage` |
| 002 | Fury Potion × Sacrifice / summon kit-melee / player DoT | 1.25× only in spellEngine damage loop |
| 003 | Shield Charm × Void Mirror family + boss Reflect Shield | raw HP; challenges already recorded |
| 004 | Map modifiers × Boss Rush + Fever × room-clear Doka | modifiers persist; kill Doka skips `applyRewardMultiplier` |

## Still OPEN (do not re-file)

08-31-001/002/005/008, 09-01-002/006, 09-02-002…006, 09-21-001…004, 09-22-001…004, 09-23-001…004, 09-24-001…004, 09-25-001…004, 09-26-001…004, 09-27-001…004, 09-28-001…004.

## Focus non-findings (this run — do not invent)

- No “watch enemy cast → unlock spell” observation path (`ownedSpells` = starter ∪ backend).
- Gravity Well / Fog of War remain unused `_is*` placeholders.
- Blood Moon 1.25× / Mirror Field 20% stay wired in `spellEngine`. Do not re-file Blood Moon as “all damage.” Mirror Field × Shield Charm is 09-27-002; drain heal is 09-28-003.
- Push/pull still unwired (08-31-005 REPORT_ONLY).
- Paper Windstorm range vs announce is PXA-owned.
- `applyRangeModification` unused — no live writer.
- Time Warp is wired (15s).
- Summons × portals occupy/path/cleanup CLOSED.
- DoT/plague × last-hostile victory CLOSED.
- Shrine covenant buff write with no combat reader — incomplete content, not scored.
- App `boostMode` never reaches WX — wiring, not a pair.
- `hitsAllies: true` has no live catalog spell (admin-only). Raw HP on `__player__` is not filed until a spell ships.
- `isTrap` has no live spell (places a barrier if admin-enabled).
- Mark × bounce uses `finalDmg` from the marked primary — not scored as a miss.
- Timestep × hard_3 records both spends into the peak — not a bypass.
- Fury × Attack Nearest **does** interact (same `executeCastAttempt` loop).

## Missing tests (actionable)

1. Mark then Poison Arrow: DoT ppt doubled **or** mark consumed (001).
2. Mark then Sacrifice: outgoing ×2 and mark gone (001).
3. Fury on + Sacrifice / wolf melee / Poison Arrow tick (002).
4. Shield 20 + Void Mirror reflect 10 ⇒ HP unchanged (003).
5. Shield + Reflect Shield 30% uses residual (003).
6. `spawnBossRushRoom` leaves modifiers empty **or** equal to a fresh roll, not the previous overworld set (004).
7. Doka Fever + Boss Rush room-clear kill Doka uses `applyRewardMultiplier` if modifiers stay (004).
