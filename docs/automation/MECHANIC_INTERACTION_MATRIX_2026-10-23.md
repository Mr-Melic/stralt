# Mechanic interaction matrix — 2026-10-23

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / prior 09-21…10-22 memory runs)  
**Gameplay code:** not modified.

Hunt A: remaining consume-path pairs on the same HEAD — enemy Windstorm
`didAct`, Chain Lightning `hitsMultiple`×bounce, Swap×Windstorm, family
on-hit vs kit.  
Hunt B: rewards / persistence / death / achievements / portals / dungeons /
spell discovery — no new file (10-21-004/005 and 09-25…09-28 persist pairs
still open; no observe path).  
Skip list honored (08-31 / 09-01 / 09-02 / 09-21…09-29 / 10-21 / 10-22 +
in-flight #391/#443/#496/#528/#555/#658/#692/#714/#728/#754/#763/#765/#790/#799/#803/#832/#856/#891).

## New ACTION_IDs

| ID | Pair | Severity |
| :--- | :--- | :--- |
| [001](./ACTION_IDS_MIMA_2026-10-23.md) | Enemy Windstorm miss × adjacent Crush/Fire Bolt (`didAct`) | P1 |
| [002](./ACTION_IDS_MIMA_2026-10-23.md) | Chain Lightning `hitsMultiple` × bounce × Mirror Field | P0 |
| [003](./ACTION_IDS_MIMA_2026-10-23.md) | Swap teleport × Windstorm / Mirror Field | P1 |
| [004](./ACTION_IDS_MIMA_2026-10-23.md) | Ember/Tide on-hit + Shield RES × kit vs Crush fallback | P1 |

## Hunt verdicts (no new file)

| Pair | Result |
| :--- | :--- |
| Player DoT × Windstorm / Mirror Field | 10-22-001 |
| CL bounce RES/`dmg` + Void Mirror | 10-22-002 — bounce **math**; this hunt is bounce **target-set** (002) |
| Plague tick × Shield Charm / RES | 10-22-003 |
| Boss `damageToPlayer` × RES | 10-22-004 |
| Sacrifice × Mirror/Windstorm/Blood Moon | 10-21-009 |
| Swap landing × lava/spikes | 08-31-001 |
| Barrier × Windstorm | Same early-return class as 003; not cloned |
| Bishop/queen Inferno 0-damage kit | `pickBestDamageSpell` requires `damage > 0` — still unreachable |
| `hitsAllies: true` / `isTrap` | No live catalog spell |
| Push/pull × hazards | Unwired REPORT_ONLY — 08-31-005 |
| Spell observation × battle failure | No live observe path |
| Player `debuffStat` (Frost Bolt MP / Slow / Expose) | In-flight **#528** / **#555** / **#905** / **#913** |
| Catalog `res_sp` shred | In-flight **#658** / **#913** |
| Blood Mend / Rallying Cry CHC buff | In-flight **#692** |
| Life Drain advertised SP | In-flight **#921** |
| Drain Courage advertised AP | In-flight **#922** |
| Summon kit Slow `debuffStat` | In-flight **#878** |
| Gravity Well / Fog of War | Unused placeholders |
| LoS through allied summons | Bresenham walls+barriers only — not a player/summon split |
| Pacifist × summon damage | 09-02-005 / **#714** preview half closed |

## Hunt B verdicts (rewards / persist)

| Pair | Result |
| :--- | :--- |
| Spell discovery unlock × death / reload | No live observe path |
| Challenge `applyRewards` × unpaid death | 09-26-004 |
| Feat claim × unpaid death | 09-25-004 |
| GameKey × unpaid death | 09-02-003 / **#391** |
| explore_25 × portal `mapsVisited++` | 10-21-005 |
| Boss Rush room-clear × threshold feats | 10-21-004 |
| Remount Doka-heal / shop / death wipe | Open CPA PRs **#900**–**#927** — not re-filed as MIMA pairs |
| jackpot_heal banner-before-persist | 09-28-001 |
| Doka Fever × shrine/ground/dungeon/challenge | 09-24-004 |

## Missing tests (for new IDs)

1. Adjacent bishop Frost Bolt, forced Paper Windstorm miss ⇒ no Crush/Fire Bolt; kit cooldown set.  
2. Chain Lightning vs three hostiles in a 4-tile disk ⇒ one primary + two bounces total; Mirror Field can reflect the primary.  
3. Swap under `isPaperWindstorm` miss ⇒ cells unchanged, AP spent.  
4. Ember Knight kit Strike applies burn; Shield 1.3 RES reduces Crush; 0-HP shielded Crush does not ignite if that is the product call.

## Matrix (evidence-backed)

| Pair | Should | Do (on `main`) | Gap |
| :--- | :--- | :--- | :--- |
| Enemy Windstorm miss × turn consume | Miss ends the action | Adjacent Crush/Fire Bolt | [001](./ACTION_IDS_MIMA_2026-10-23.md) |
| CL bounce × hitsMultiple × Mirror Field | 1 primary + 2 bounces; reflect primary | Pack nuke + per-target bounces; no reflect | [002](./ACTION_IDS_MIMA_2026-10-23.md) |
| Swap × Windstorm | Missable ranged teleport | Always swaps | [003](./ACTION_IDS_MIMA_2026-10-23.md) |
| Ember/Tide × kit hit / Shield RES | On-hit on the attack that landed; RES buffs Crush | On-hit only on fallback; Crush ignores Shield RES | [004](./ACTION_IDS_MIMA_2026-10-23.md) |
