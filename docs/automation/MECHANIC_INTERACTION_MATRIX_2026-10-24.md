# Mechanic Interaction Matrix — 2026-10-24

HEAD: `0f5363f` (unchanged since #332 / 09-21…10-23).  
Gameplay code: not modified. Ledger: `ACTION_IDS_MIMA_2026-10-24.md`.

## Scope

Prioritized Attack Nearest, summon kit damage, enemy kit vs Mirror Field, Life Drain, Weaken/Slow vs summons, challenge AP/MP vs summon spends, status ticks vs summons, spell discovery vs battle fail, achievement vs death, boss phase abilities vs Shield/RES — plus a second pass on portals/feats/versionGate under-covered by 001–005.

## New findings (7)

| ID | Pair | Severity |
| --- | --- | --- |
| 001 | Summon kit (AI + controlled) × Windstorm / Mirror Field / Blood Moon / crit | P1 |
| 002 | Boss kit spell × SP / Windstorm / Void Mirror (enemy kit has all three) | P1 |
| 003 | Enemy kit × player SP-as-mitigation + double RES; SR never read incoming | P1 |
| 004 | Slow/Weaken on summons × `summonTurnBudget` / hard-coded `casterId: "player"` | P1 |
| 005 | Controlled summon snapshot `res/sp/sr = 0` × target defenses | P2 |
| 006 | Boss Rush / rest / white portal paths × `mapsVisited` / `explore_25_maps` | P1 |
| 007 | versionGate wipe × explore_25 / loot_10 localStorage counters | P1 |

## Rejected almost-findings

| Candidate | Why rejected |
| --- | --- |
| Attack Nearest × modifiers / Shield / RES / crit / SP / SR | Shares `executeCastAttempt` → `resolvePlayerCast`; no unique pair on this HEAD (origin still 09-21-004). |
| Enemy kit × Mirror Field (map modifier) | Mirror Field is a **player-cast** hazard in `resolvePlayerCast`; enemy kits correctly omit it. Void Mirror (player spell) **is** consumed on enemy kit — gap is boss kit (002). |
| Life Drain × Blood Moon / Windstorm / Mirror | Player Life Drain enters the damage loop; modifiers apply. `healAmount: 5` vs `drainPercent` is #543 / catalog drift. Attached SP debuff is **EBMA-2026-09-01-004**, not re-filed. |
| Player Weaken/Slow/Frost `debuffStat` never applied | Still true (`resolvePlayerCast` 876–1028) but **EBMA-004** owns the restore. |
| Blood Mend / Rallying Cry heal × CHC `buffStat` never applied | Heal branch returns without `applyEffect` (`spellEngine.ts` 655–672); **EBMA-012** owns the CHC buff × crit pair (apply + crit read). |
| Vampiric Ground heal never commits | Same `onDamageDealt` wiring hole as Glass/Titans **09-23-001** (throwaway attacker on `enemyTakesDamage`; `playerTakesDamage` skips the hook). |
| Challenge AP vs summon-control kit spend | Memories: product has not required minion AP = player challenge AP; map discount skip remains 09-25-002. |
| Mending Mist / Swift Winds × no_healing / player MP | Unreachable until **09-24-001** (turn-order copy; player not in `combatantsRef`). |
| Status ticks vs summons | `processActiveEffects(summonId)` runs on control and enemy-summon turns (WX ~14448 / 14544). |
| Spell discovery unlock vs battle fail | No spell-observe-on-watch path (non-finding). |
| Achievement vs death / Death Realm 1.5s chrome | Feat claim / jackpot / loot_10 / unpaid death already 09-25…09-28; defeat recap dismiss is 09-27-003; HUD heal/shop intentionally live during recap. |
| versionGate × unpaid death pending key | Unpaid-death class already heavily filed — do not extend here. |
| Gravity Well / Fog of War / push-pull | Unused placeholders / still unwired — do not invent. |
| Bishop 0-damage Inferno execute no-op | Unreachable (`pickBestDamageSpell` requires `damage > 0`) — prior non-file. |
| Barrier × Windstorm pre-loop skip | Shares Swap's skip — explicitly not cloned from 10-23-003. |

## Evidence anchors (absolute paths)

- `/workspace/src/frontend/src/engine/spellEngine.ts` — `resolvePlayerCast` modifiers 895–915; heal early-return 655–672; `resolveSpellCast` 413–505; `computeDamage` 484–498  
- `/workspace/src/frontend/src/engine/summonExecutor.ts` — `applyCast` 162–167  
- `/workspace/src/frontend/src/components/WorldExploration.tsx` — controlled cast 9849–9872; summon `dealDamage` 14997–15003; boss kit 15859–15867; enemy kit 16474–16647; `playerTakesDamage` 3429–3432; player AP/MP restore 14350–14359; portal early-returns 6077–6218; mapsVisited++ 6471  
- `/workspace/src/frontend/src/utils/summonControlCast.ts` — `summonTurnBudget` 356–364  
- `/workspace/src/frontend/src/hooks/useBossAI.ts` — kit always `targetId: player` 176–180  
- `/workspace/src/frontend/src/utils/versionGate.ts` — preserve allow-list 7–12  
- `/workspace/src/frontend/src/App.tsx` — version wipe 298–317  
- `/workspace/src/frontend/src/utils/victoryAchievements.ts` — explore_25 gate 32  
