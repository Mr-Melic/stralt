# Player data evolution audit — 2026-09-23

**Guardian:** Save / Data Evolution Guardian  
**Trigger:** cron `0 */48 * * *`  
**HEAD inspected:** `0f5363f` (unchanged since 2026-09-21)  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

This run does **not** approve any new required persist field, does **not** attach `(with migration)` to live `main.mo`, and does **not** edit frozen `20260831` / `20260901` NewActor types. New stables still belong in a **later** `20260902+` file with `OldActor = {}`.

Did **not** clone #362 (GameKey serial + saveActiveSpells), #385 (death owner-key), #386 (victory HP floor), #388 (spell-level hydrate), #400 (09-22 spell-id / empty-keys bar contracts), or #437 (freeze live achievement rewards). Did **not** edit `WorldExploration.tsx` or `main.mo`.

## Landed this run (behavior-only, no schema)

- `buffInventoryEvolve.ts` — `greater_health_potion` ↔ `greater_potion` alias, max-not-sum merge, cost-drift table. Live BuffShop prices unchanged.
- `spellDiscoveryEvolve.ts` — `upgradeSpell` minLevel grandfather; boot purge still lists live starter `physical_attack`.
- `playerDataEvolve.ts` — additive `saveKillCount`; `getSessionState` blood default 50; compounding vs linear HP.
- `leftoverXpCannotAffordNextLevel` in `xpCurve.ts` (Motoko `pow2` short-circuit contract).
- `clampSaveBattleStatsOffensiveStats` in `absoluteStatsClamp.ts`.

## Cohort questions

| Player | What happens today |
| :--- | :--- |
| Created yesterday | 12-field Character, leftover XP, per-principal Doka, empty `spellLevelKeys` at create. Library = starters ∪ every `usableByPlayer` catalog row. Buff potions still `${principal}_inventory` under frontend ids (`greater_health_potion`). GameKey serial still wraps on **main** (#362). |
| Created six months ago | Same maps if the canister stayed on this actor. Optional Character fields default null. `getSessionState` treats missing `bloodBalance` as **50**, not 0. `spellLevelKeys` may hold purged ids; UI also hides **names** in `OLD_SPELL_NAMES_SET` (live starter `spell-inferno` is named **Inferno**). HP/AP/MP writes grandfather stored values. 15-field `backend_extended` via `dfx.json` must not be deployed. |
| Created before a feature | Missing dungeon/rush/achievement/GameKey rows → 0 / [] / null / empty maps. Challenges are session-only. **Unsafe** if a required field is added without a later chain file. KYC `purchaseRecords` pending rows still never auto-complete. |
| Created before a spell/enemy rename | No alias table for spells. Boot `OLD_SPELL_IDS` still deletes catalog rows every upgrade, including `physical_attack`. Buff greater-potion **does** have an alias helper this run; live shop still writes the frontend id only. Enemy/boss ids are config-only. Unknown `pieceType` paints `king.front`. |
| Owns now-retired content | Arrays keep the id. Retired catalog stays in the library only if already in keys/bar/starters. `upgradeSpell` still appends any **usable** catalog id on first paid upgrade, **including minLevel-gated rows** (`void_collapse` minLevel 30). Retired + never owned → `#err Spell is retired`. `setSpellBarOrder` drops ids not in `spellLevelKeys` (empty keys persist `[]`). Claim still pays **current** `dokaReward` (#437 freezes admin edits while unclaimed). Deleting a sprite config does not delete the Character. |

## Surface matrix

| Surface | Persist | Defaults / migration | ID stability | Stale overwrite | Unbounded level | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CharacterStats (12) | Required on Character | No 15→12 migration on a still-15 live actor | n/a | `updateCharacter` keeps stored stats | HP/AP/MP grandfather; atk/res/init min | Live contract OK; dfx path not (SDEG-011) |
| Level / leftover XP | Character.level / experience | `applyRewards` Nat loop | n/a | Client level ignored; XP `min` | Motoko Nat OK; HUD saturates at L48 | Generation still missing (SDEG-006); pow2 O(level) (09-21-004) |
| Doka | `dokaBalances[Principal]` | Missing → 0 | n/a | Absolute snapshot; persist lock | Nat OK; **per-call 100_000 clamp** | High-level rolls truncated (09-01-004) |
| Owned spells | Implicit catalog ∪ starters | Empty keys ≠ “owns starters” on canister | Purge + **name** filter | Appearance keep-store | n/a | Not future-safe (SDEG-004, 09-21-002, 09-23-002) |
| Spell levels | Parallel arrays; `upgradeSpell` only | `saveBattleStats` ignores arrays | Same as owned ids | Keep-store; hydrate localStorage on main (#388) | Cost `base*2^level` is Nat | Paid path OK; minLevel ungated |
| Discovery | **None** | Everyone sees current usable catalog | Names used in OLD set | `upgradeSpell` grants any usable id | `void_collapse` minLevel 30 is content-only | Do not add `ownedSpellIds` until a later file |
| Achievements | `principal#id` progress | Missing → locked | Delete-with-progress retires | Claim one-shot; reward is **current** config | `level_10` is a feat | SDEG-008; #437 freeze is admin-side only |
| Challenges | Session + `applyRewards` | Old players have no history (OK) | Catalog ids | n/a | n/a | Do not persist onto required Character fields |
| Inventory / purchases | BuffShop localStorage; unused canister map; GameKey | GameKey empty defaults on `20260901` | **greater potion id split**; cost drift on 4 items | Redeem one-shot; credits **redeemer** | Serial wraps on main | SDEG-005; **09-23-001** |
| Dungeon | Principal map | Missing → null | n/a | `totalMapsCompleted + 1` every call | Float multiplier | Official frontend **never calls**; SDEG-007 |
| Boss Rush | `principal#slot` | Missing → (0,0,0); create/delete clear | Room 0–9 | Run count once per master | n/a | Rush half done |
| killCount | CharacterStats; `saveKillCount` adds | Create 0; official UI never writes | n/a | Retry mints +N | Per-call 64; total unbounded Nat | **09-23-003** |
| Session blood/covenant | Optional Character fields | Query default blood **50** | covenant is a **name** | Full replace, no generation | shrineCount max 100 | **09-23-004** |
| Config refs | Admin maps, empty-only seeds | Frozen 20260831 / 20260901 | Text ids; boot purge | n/a | Region `levelMax` is content | Do not restuff shipped NewActor |
| Visuals | `pixelPattern` JSON + `pieceType`; optional sprite URLs | Unknown pieceType → king.front | pieceType strings | Appearance replaces pattern (intended) | n/a | URLs not mandatory (**pass**) |
| `activeSpells : ?[Nat]` | Leftover Character field | Optional; create clears | Nat ≠ spell id | Still written on main (#362 keep-store) | n/a | Do not delete the field (M0169) |

## Unbounded progression

- Backend `applyRewards` / Doka / spell cost use `Nat`. No stored max player level.
- Frontend `xpForNextLevel` saturates at `MAX_SAFE_INTEGER` from level **48**; persist math uses `xpThresholdBigInt`.
- `applyRewards` still rejects `dokaDelta > 100_000` / `xpDelta > 500_000`. Official client clamps.
- Victory HP floor `50 + level*10` still exceeds linear persist max from **level 10** on main (`150` vs `145`). Vehicle #386.
- Battle-init compounding HP exceeds linear persist from **level 4** at 5% (`116` vs `115`; `155` vs `145` at L10). Grandfather does not save the **first** write onto a 100-HP row.
- `maxPersistedAp` / `maxPersistedMp` hard-cap at **20**. Stored AP above 20 is grandfathered; **new** growth stops.
- `applyRewards` `pow2` is O(level) on every credit. Helper `leftoverXpCannotAffordNextLevel` is the short-circuit contract; Motoko not wired (do not edit `main.mo` while older persist PRs are queued).
- `getEnemyHPForLevel` still uses `Float` — do not change without a human.
- GameKey serial wrap remains on main (#362).
- `atk` / `res` / `sp` / `sr` / `init` / `chc` / `evasion` / `resilience` have no persist grow writer.

## Visuals

Owner-uploaded URLs remain optional. `adminDeletePlayerSpriteConfig` removes only the sprite row. Portrait/player draw uses `getPersistedPiecePattern` (`pieceArt.ts` **653–658**). CharacterCreation JSON-parses `pixelPattern` with a chess-piece fallback.

**Keep:** never make a URL required on Character or combatant persist.

## Spell discovery (future-proof)

Still no `ownedSpellIds` / observe / commit APIs. Do not add those required fields until a **new later** migration file after `20260901`.

`upgradeSpell` still ignores `minLevel` (this run’s helper grandfathers already-owned ids). `OLD_SPELL_NAMES_SET` in `WorldExploration.tsx` still filters by **id and display name**. Not patched here: #327 / #331 already edit that file.

## Migration analysis (do not attach full chain as a player rewrite)

| Module | Role | Live-upgrade safe? |
| :--- | :--- | :--- |
| `20260801_000000.mo` | Empty-canister genesis `OldActor = {}` | Fresh import only as the first name |
| `20260803_185500.mo` | Name-only no-op (Caffeine #347/#348 tail) | Yes — keep the filename |
| `20260827_000000.mo` | Drop transients; pass-through player maps | Pass-through of then-current shape |
| `20260831_000000.mo` | Frozen deployed tail: summon SpellConfig + rollback + audit; **no GameKey** | **Yes** as the 2026-08-31 Caffeine signature |
| `20260901_000000.mo` | GameKey empty maps; `OldActor = {}` | **Yes** for GameKey only. Player maps stay orthogonal. Idempotent. Replay must not wipe player maps. |

Live `main.mo` is still `actor {` (no annotation). mops still injects the chain.

## What this run will not approve

- New required Character / stats / config fields
- Attaching `(with migration)` on live `main.mo` as a player-data rewrite
- Editing shipped `20260831` / `20260901` NewActor
- Hard spell-id remap without an alias table and a one-shot generation
- Persisting challenges onto required Character fields
- Changing live BuffShop prices to match canister `BUFF_CATALOG` (economy)
- Changing `MAX_PERSISTED_AP` / victory HP floor / `applyRewards` ceilings without a human
- Editing `WorldExploration.tsx` or `main.mo` while older persist PRs are queued

## Open vehicles (do not clone / do not overwrite)

| Draft PR | Overlap | Guardian stance |
| :--- | :--- | :--- |
| #327 / #331 | `WorldExploration.tsx` | Inferno name-filter stays OPEN (09-21-002). |
| #362 | GameKey serial, `saveActiveSpells`, `main.mo` | Approve keep-store + unbounded serial. Do not clone. |
| #385 / #386 | `deathPenalty.ts`, `App.tsx` | Owner-key + victory HP cap. Do not clone. |
| #388 | WX spell-level hydrate | Empty keys must not read localStorage. Do not clone. |
| #400 | `spellCatalogEvolve.ts` | Empty-keys bar + hide-by-id. Do not clone. |
| #408 | `BuffShop.tsx`, `itemShop.ts` | Union only if wiring aliases into loadInventory. This run did not edit those files. |
| #437 | `adminGuard.mo`, `main.mo` | Freeze unclaimed feat rewards. Snapshot-at-unlock still OPEN. |
