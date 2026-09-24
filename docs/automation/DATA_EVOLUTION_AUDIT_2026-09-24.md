# Player data evolution audit — 2026-09-24

**Guardian:** Save / Data Evolution Guardian  
**Trigger:** cron `0 */48 * * *`  
**HEAD inspected:** `0f5363f` (unchanged since 2026-09-21)  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

This run does **not** approve any new required persist field, does **not** attach `(with migration)` to live `main.mo`, and does **not** edit frozen `20260831` / `20260901` NewActor types. New stables still belong in a **later** `20260902+` file with `OldActor = {}`.

Did **not** clone #362 (GameKey serial + saveActiveSpells), #385 (death owner-key), #386 (victory HP floor), #388 (spell-level hydrate), #400 (empty-keys bar), #408 (BuffShop), #437 (freeze unclaimed feat rewards), #466 (09-23 helpers), or #490 (principal-keyed BuffShop/feats). Did **not** edit `WorldExploration.tsx` or `main.mo`.

## Landed this run (behavior-only, no schema)

- `versionGate.ts` — preserve `pbv_pending_death_penalty*` across `APP_VERSION` wipe (slot-only on main **and** II-scoped `#385` keys). Unpaid 20/40 is not on the canister (SDEG-2026-09-24-001).
- `userProfileEvolve.ts` — `saveCallerUserProfile` must keep stored `uiLayout` when the incoming blob is empty (SDEG-2026-09-24-002). Motoko not wired.
- `slotOccupancyEvolve.ts` — delete/create leftovers: dungeon Principal-wide, canister buffs slot-scoped, Boss Rush cleared (SDEG-2026-09-24-003).
- `kitSpellIdEvolve.ts` — Motoko `defaultBossConfigs` spell pools vs boot `OLD_SPELL_IDS` purge (SDEG-2026-09-24-004).

## Cohort questions

| Player | What happens today |
| :--- | :--- |
| Created yesterday | 12-field Character, leftover XP, per-principal Doka, empty `spellLevelKeys` at create. Library = starters ∪ every `usableByPlayer` catalog row. Buff potions still `${principal}_inventory`. Unpaid death 20/40 is slot-only localStorage; a version bump no longer drops that marker after this run. GameKey serial still wraps on **main** (#362). |
| Created six months ago | Same maps if the canister stayed on this actor. Optional Character fields default null. `getSessionState` treats missing `bloodBalance` as **50**. `spellLevelKeys` may hold purged ids; UI also hides **names** in `OLD_SPELL_NAMES_SET` (live starter `spell-inferno` is named **Inferno**). HP/AP/MP writes grandfather stored values. 15-field `backend_extended` via `dfx.json` must not be deployed. |
| Created before a feature | Missing dungeon/rush/achievement/GameKey rows → 0 / [] / null / empty maps. Challenges are session-only. **Unsafe** if a required field is added without a later chain file. KYC `purchaseRecords` pending rows still never auto-complete. `saveCallerUserProfile` still full-replaces `uiLayout` on main. |
| Created before a spell/enemy rename | No alias table for player-owned spell ids. Boot `OLD_SPELL_IDS` still deletes catalog rows every upgrade, including `physical_attack`. Motoko boss seeds still list `fireball` / `blood_nova` / … (purged). Frontend `bossKits.ts` uses live ids. Enemy/boss **entity** ids are stable text keys. Unknown `pieceType` paints `king.front`. |
| Owns now-retired content | Arrays keep the id. Retired catalog stays in the library only if already in keys/bar/starters. `upgradeSpell` still appends any **usable** catalog id on first paid upgrade, including `minLevel`-gated rows. `setSpellBarOrder` drops ids not in `spellLevelKeys` (empty keys persist `[]`). Claim still pays **current** `dokaReward`. Deleting a sprite config does not delete the Character. Delete-character does **not** drop principal dungeon or slot canister buffs. |

## Surface matrix

| Surface | Persist | Defaults / migration | ID stability | Stale overwrite | Unbounded level | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CharacterStats (12) | Required on Character | No 15→12 migration on a still-15 live actor | n/a | `updateCharacter` keeps stored stats | HP/AP/MP grandfather; atk/res/init min | Live contract OK; dfx path not (SDEG-011) |
| Level / leftover XP | Character.level / experience | `applyRewards` Nat loop | n/a | Client level ignored; XP `min` | Motoko Nat OK; HUD saturates at L48 | Generation still missing (SDEG-006) |
| Doka | `dokaBalances[Principal]` | Missing → 0 | n/a | Absolute snapshot; persist lock | Nat OK; **per-call 100_000 clamp** | High-level rolls truncated (09-01-004) |
| Owned spells | Implicit catalog ∪ starters | Empty keys ≠ “owns starters” on canister | Purge + **name** filter | Appearance keep-store | n/a | Not future-safe (SDEG-004) |
| Spell levels | Parallel arrays; `upgradeSpell` only | `saveBattleStats` ignores arrays | Same as owned ids | Keep-store; hydrate localStorage on main (#388) | Cost `base*2^level` is Nat | Paid path OK; minLevel ungated |
| Discovery | **None** | Everyone sees current usable catalog | Names used in OLD set | `upgradeSpell` grants any usable id | `void_collapse` minLevel 30 is content-only | Do not add `ownedSpellIds` until a later file |
| Achievements | `principal#id` progress | Missing → locked | Delete-with-progress retires | Claim one-shot; reward is **current** config | `level_10` is a feat | SDEG-008; #437 freeze is admin-side only |
| Challenges | Session + `applyRewards` | Old players have no history (OK) | Catalog ids | n/a | n/a | Do not persist onto required Character fields |
| Inventory / purchases | BuffShop localStorage; unused canister map; GameKey | GameKey empty defaults on `20260901` | greater-potion id split | Redeem one-shot; credits **redeemer** | Serial wraps on main | SDEG-005; 09-23-001; **slot vs principal hydrate 09-24-003** |
| Dungeon | Principal map | Missing → null | n/a | `totalMapsCompleted + 1`; **survives deleteCharacter** | Float multiplier | SDEG-007; **09-24-003** |
| Boss Rush | `principal#slot` | Missing → (0,0,0); create/delete clear | Room 0–9 | Run count once per master | n/a | Rush half done |
| UserProfile | name + uiLayout | Empty string default | n/a | **Full replace**; name-only send wipes layout | n/a | **09-24-002** |
| Unpaid death 20/40 | localStorage only | Missing → no replay | slot-only on main (#385 owner-key) | Version wipe used to drop the marker | n/a | **09-24-001 landed** |
| Boss kit spell ids | Admin `bossConfigs` empty-only seed | Seed lists purged ids | No remap | n/a | n/a | **09-24-004** |
| Visuals | `pixelPattern` JSON + `pieceType`; optional sprite URLs | Unknown pieceType → king.front | pieceType strings | Appearance replaces pattern (intended) | n/a | URLs not mandatory (**pass**) |
| `activeSpells : ?[Nat]` | Leftover Character field | Optional; create clears | Nat ≠ spell id | Still written on main (#362 keep-store) | n/a | Do not delete the field (M0169) |

## Unbounded progression

- Backend `applyRewards` / Doka / spell cost use `Nat`. No stored max player level.
- Frontend `xpForNextLevel` saturates at `MAX_SAFE_INTEGER` from level **48**; persist math uses `xpThresholdBigInt`.
- `applyRewards` still rejects `dokaDelta > 100_000` / `xpDelta > 500_000`. Official client clamps.
- Victory HP floor `50 + level*10` still exceeds linear persist max from **level 10** on main (`150` vs `145`). Vehicle #386.
- Battle-init compounding HP exceeds linear persist from **level 4** at 5%. Vehicle helpers on #466.
- `maxPersistedAp` / `maxPersistedMp` hard-cap at **20**. Stored AP above 20 is grandfathered; **new** growth stops.
- `applyRewards` `pow2` is O(level) on every credit. Helper on #466; Motoko not wired.
- `getEnemyHPForLevel` still uses `Float` — do not change without a human.
- GameKey serial wrap remains on main (#362).
- `atk` / `res` / `sp` / `sr` / `init` / `chc` / `evasion` / `resilience` have no persist grow writer.

## Visuals

Owner-uploaded URLs remain optional. `adminDeletePlayerSpriteConfig` removes only the sprite row. Portrait/player draw uses `getPersistedPiecePattern` (`pieceArt.ts` **653–658**). Combat does not `drawImage` catalog `spriteUrl` (`adminVisualStatus.ts`).

**Keep:** never make a URL required on Character or combatant persist.

## Spell discovery (future-proof)

Still no `ownedSpellIds` / observe / commit APIs. Do not add those required fields until a **new later** migration file after `20260901`.

`upgradeSpell` still ignores `minLevel` (#466 helper). `OLD_SPELL_NAMES_SET` in `WorldExploration.tsx` still filters by **id and display name**. Not patched here: #327 / #331 already edit that file.

Motoko boss seeds still reference boot-purged ids. Frontend kits do not. A six-month canister that never re-seeded keeps those kit arrays forever (empty-only seed).

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
- Changing live BuffShop prices to match canister `BUFF_CATALOG`
- Changing `MAX_PERSISTED_AP` / victory HP floor / `applyRewards` ceilings without a human
- Editing `WorldExploration.tsx` or `main.mo` while older persist PRs are queued
- Cloning #466 / #385 / #362

## Open vehicles (do not clone / do not overwrite)

| Draft PR | Overlap | Guardian stance |
| :--- | :--- | :--- |
| #327 / #331 | `WorldExploration.tsx` | Inferno name-filter stays OPEN (09-21-002). |
| #362 | GameKey serial, `saveActiveSpells`, `main.mo` | Approve keep-store + unbounded serial. Do not clone. |
| #385 / #386 | `deathPenalty.ts`, `App.tsx` | Owner-key + victory HP cap. Version-gate preserve is complementary (this run). |
| #388 | WX spell-level hydrate | Empty keys must not read localStorage. Do not clone. |
| #400 | `spellCatalogEvolve.ts` | Empty-keys bar + hide-by-id. Do not clone. |
| #408 / #490 | `BuffShop.tsx` | Union only if wiring aliases / principal keys. |
| #437 | `adminGuard.mo`, `main.mo` | Freeze unclaimed feat rewards. Snapshot-at-unlock still OPEN. |
| #466 | 09-23 helpers | Do not clone. This run used new files. |
