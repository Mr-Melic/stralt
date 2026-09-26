# Player data evolution audit — 2026-09-26

**Guardian:** Save / Data Evolution Guardian  
**Trigger:** cron `0 */48 * * *`  
**HEAD inspected:** `0f5363f` (unchanged since 2026-09-21 / last guardian pass)  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

This run does **not** approve any new required persist field and does **not** attach `(with migration)` to live `main.mo`.  
It does **not** edit `main.mo`, `WorldExploration.tsx`, `BuffShop.tsx`, `deathPenalty.ts`, or `versionGate.ts`.  
It does **not** clone #362 / #385 / #386 / #388 / #400 / #408 / #437 / #466 / #490 / #508 / #577 helpers.

## Cohort questions

| Player | What happens today |
| :--- | :--- |
| Created yesterday | 12-field Character, leftover XP, per-principal Doka, empty `spellLevelKeys`. Library = starters ∪ every `usableByPlayer` catalog row. Feat counters / unpaid death / shrine caches still drop on `APP_VERSION` wipe until #508 and #577 union into `versionGate.ts`. Leaderboard killCount stays 0; feat rank counts **claimed** rows only. Live look is `pieceType` catalog art, not stored `pixelPattern`. |
| Created six months ago | Optional Character fields default null. Purged spell ids stay in arrays; UI also hides **names**. HP/AP/MP grandfather on absolute writes. New device mid-grind on `explore_25_maps` starts at 0 (09-25-008). Unclaimed feats do not count on the leaderboard (09-26-002). |
| Created before a feature | Missing dungeon/rush/achievement/GameKey rows → 0 / [] / null. Challenges session-only. **Unsafe** if a required field is added without a later chain file after `20260901`. |
| Created before a spell/enemy/feat rename | No spell alias table. Boot `OLD_SPELL_IDS` still deletes catalog rows every upgrade, including live starter `physical_attack` (not in `isBuiltInSpellId`). Achievement rename-by-new-id orphans `principal#oldId` (09-25-009). Unknown `pieceType` paints `king.front`. |
| Owns now-retired content | Arrays keep the id. Retired catalog stays in the library only if already in keys/bar/starters. Claim still pays **current** `dokaReward` until #437. Delete-character does not drop principal dungeon, slot canister buffs, or browser leftovers. |

## Surface matrix

| Surface | Persist | Defaults / migration | ID stability | Stale overwrite | Unbounded level | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CharacterStats (12) | Required on Character | No 15→12 on live actor | n/a | `updateCharacter` keep-stores stats | HP/AP/MP grandfather; AP/MP cap 20 | Live contract OK; `dfx.json` still `backend_extended` (SDEG-011) |
| Level / leftover XP | Character.level / experience | `applyRewards` Nat loop | n/a | Client level ignored | Motoko Nat OK; HUD bigint; applyRewards ceilings | Generation missing (SDEG-006) |
| Doka | `dokaBalances[Principal]` | Missing → 0 | n/a | Absolute snapshot; persist lock; mint clamp | Nat OK; per-call 100_000 | 09-01-004 open |
| Owned spells | Implicit catalog ∪ starters | Empty keys ≠ “owns starters” on canister | Purge + name filter; built-in list omits innates | Appearance keep-store | n/a | SDEG-003/004; **09-26-001** |
| Spell levels | Parallel arrays; `upgradeSpell` only | `saveBattleStats` ignores arrays | Same as owned ids | Empty keys hydrate localStorage (#388) | Cost `base*2^level` Nat | Paid path OK; mismatch traps (09-25-004) |
| Discovery | **None** | Everyone sees current usable catalog | Names in OLD set | `upgradeSpell` grants any usable id | `minLevel` 30 is content | SDEG-004 |
| Achievements | `principal#id` progress | Missing → locked; server checks level/doka/spell_level_5 | No alias table | Claim one-shot; reward is **current** config | `level_10` is a feat | SDEG-008; 09-25-008/009; **09-26-002** |
| Challenges | Session + `applyRewards` | Old players have no history (OK) | Catalog ids | n/a | n/a | Do not persist without optional fields |
| Inventory / purchases | BuffShop localStorage; unused canister map; GameKey | Version gate keeps `*_inventory` | `greater_health_potion` ≠ `greater_potion` | #408 in-flight buy | `nextGameKeyRequestId` wraps | SDEG-005; #466 alias |
| Dungeon | Principal map | Missing → null; update seeds zeros | n/a | `totalMapsCompleted + 1` every call | Depth 16; Float multiplier | SDEG-007 |
| Boss Rush | `principal#slot` | Missing → (0,0,0); create/delete clear | Room 0–9 | Run count once per master | n/a | Rush half done |
| Config refs | Admin maps, empty-only seeds | Frozen 20260831 + 20260901 GameKey | Text ids; boot purge | n/a | Region `levelMax` is content | Later file only for new stables |
| Visuals | `pieceType` + unused `pixelPattern` JSON; optional sprite URLs | Unknown pieceType → king.front | pieceType strings | Appearance replaces stored JSON (unused in play) | n/a | URLs not mandatory (**pass**); **09-26-003** dead JSON |

## Unbounded progression

- Backend `applyRewards` / Doka / spell cost use `Nat`. No stored max player level.
- Frontend `xpForNextLevel` uses bigint thresholds; HUD saturates at `MAX_SAFE_INTEGER`.
- `applyRewards` still rejects `dokaDelta > 100_000` / `xpDelta > 500_000`. Official client clamps.
- `MAX_PERSISTED_AP` / `MAX_PERSISTED_MP` = 20 (content bound, tracked 09-21-003).
- Leaderboard hydrate `Number(level|killCount|achievementsCompleted)` is a silent display cap (**09-26-002**).
- `getEnemyHPForLevel` still uses `Float` — do not change without a human.
- `nextGameKeyRequestId` wraps `999_999_999 → 1` (#362 vehicle).

## Visuals

Owner-uploaded URLs remain optional. `adminDeletePlayerSpriteConfig` does not delete the Character. Unknown `pieceType` uses `getPersistedPiecePattern` → `king.front`.

**Keep:** never make a URL required on Character or combatant persist.

**Gap:** stored `pixelPattern` is not the live draw source. Catalog `pieceType` art changes rewrite every old champion's look without migration (09-26-003).

## Spell discovery (future-proof)

Still no `ownedSpellIds` / observe / commit APIs. Preserving future discovery still requires SDEG-003 + SDEG-004 after a **later** chain file (`20260902+`, `OldActor = {}`). Do not add those required fields on this HEAD. `isBuiltInSpellId` must include live innates before any catalog seed of `physical_attack` / `starter-*` (09-26-001).

## Migration analysis (do not attach; do not clone #259 descendants)

| Module | Role | Live-upgrade safe? |
| :--- | :--- | :--- |
| `20260801_000000.mo` | Empty-canister genesis `OldActor = {}` | Fresh import only |
| `20260803_185500.mo` | Name-only no-op | Pass-through |
| `20260827_000000.mo` | Drop transients | Pass-through of then-current shape |
| `20260831_000000.mo` | Frozen Aug-31 deployed shape (no GameKey) | Check-stable tail for Caffeine `.old` |
| `20260901_000000.mo` | Frozen GameKey empty maps | `OldActor = {}`; do not restuff |

Live `main.mo` line 44 is still `actor {`. mops injects the chain (`check-limit = 5`). New required player fields → **new later file only**. Orthogonal stables on live `main.mo` still match `snapshots/orthogonal-stables.txt`.

## What this run will not approve

- New required Character / stats / config fields
- Attaching `(with migration)` as a player-data rewrite
- Editing shipped `20260831` / `20260901` NewActor
- Cloning #362 / #385 / #386 / #388 / #400 / #408 / #437 / #466 / #490 / #508 / #577
- Editing `versionGate.ts` while #508 owns unpaid-death preserve
- Hard spell-id remap without an alias table and a one-shot generation
- Persisting challenges onto required Character fields
- Making sprite URLs or stored `pixelPattern` JSON mandatory for combat

## Open vehicles (do not clone)

| Draft PR | Overlap | Guardian stance |
| :--- | :--- | :--- |
| #362 | GameKey serials; `saveActiveSpells` keep-store | Approve (09-02-005 / 09-21-001) |
| #385 | Unpaid death II key | Approve |
| #386 | Victory HP floor vs persist cap | Approve (09-02-001) |
| #388 | Spell-level hydrate from canister only | Approve (09-22-003) |
| #400 | Empty-keys bar contract tests | Approve (09-22-002) |
| #408 | BuffShop in-flight buy | Approve |
| #437 | Freeze unclaimed feat `dokaReward` | Approve (SDEG-008 vehicle) |
| #466 | Buff alias, minLevel, pow2 helper | Approve; do not clone helpers |
| #490 | Principal-keyed BuffShop/feats | Approve |
| #508 | Version-gate unpaid death | Approve (09-24-001). Union feat keys from #577 after this file. |
| #577 | Feat/covenant/shrine version-gate helper | Approve (09-25-001). Do not clone `*Evolve.ts`. |

## Landed this run (read-back)

- `src/frontend/src/utils/builtInStarterProtectEvolve.ts` — innate vs `BUILT_IN_SPELL_IDS`
- `src/frontend/src/utils/leaderboardPersistEvolve.ts` — claimed ranking / Number hydrate
- `src/frontend/src/utils/pieceTypeVisualPersistEvolve.ts` — `pieceType` live key + king.front fallback
