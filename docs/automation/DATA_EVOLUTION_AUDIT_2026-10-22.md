# Player data evolution audit — 2026-10-22

**Guardian:** Save / Data Evolution Guardian  
**Trigger:** cron `0 */48 * * *`  
**HEAD:** `0f5363f` (unchanged since 2026-09-21 / PR #332; same as the 2026-10-21 pass)  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

This run does **not** approve any new required persist field and does **not** attach `(with migration)` to live `main.mo`.  
It does **not** clone open persist vehicles (#362, #385, #386, #388, #400, #408, #437, #466, #490, #508, #577, #622, #667, #731, #778, #803).

## Landed this run (no schema)

- `achievementConditionIds.ts` — stable `boss_defeated_${bossId}` builder + intended prefix allowlist. Victory now emits through that helper. Live `knownAchievementCondition` is still exact-match only (SDEG-2026-10-22-001). Tests lock the gap.

## Cohort questions

| Player | What happens today |
| :--- | :--- |
| Created yesterday | 12-field Character, leftover XP, per-principal Doka, empty `spellLevelKeys` until first `upgradeSpell`. UI library is starters ∪ every `usableByPlayer` catalog spell. Buff potions live in `${principal}_inventory`. Official dungeon chain is session refs (canister `dungeonRecords` unused). |
| Created six months ago | Same maps if the canister stayed on this actor. 15-field `backend_extended` still rejects 12-field saves if someone `dfx deploy`s it (SDEG-011). `spellLevelKeys` may hold purged ids; UI hides by name **and** id; `upgradeSpell` → `Spell not found`. HP stored under the old `level*200+100` cap is grandfathered (`persistHpWriteCap`). |
| Created before a feature | Optional Character fields default null. Dungeon/rush/achievement maps miss the principal → 0/`[]`/null. Challenges are session-only. **Unsafe** if a required field is added without SDEG-001. GameKey empty-map defaults exist on `20260901` (`OldActor = {}`) — idempotent, no player-map rewrite. |
| Created before a spell/enemy rename | No alias table. `OLD_SPELL_IDS` still deleted from `spellConfigs` on **every** start/upgrade, including live starter `physical_attack`. Enemy/boss ids are not stored on Character. Victory still emits `boss_defeated_${bossId}` which cannot be seeded. BuffShop `greater_health_potion` is not the canister id `greater_potion`. |
| Owns now-retired content | Arrays keep the id. Retired catalog stays in the library only if already in keys/bar/starters. `upgradeSpell` still appends any usable catalog id on first paid upgrade, including `void_collapse` at `minLevel = 30`. `setSpellBarOrder` drops ids not in `spellLevelKeys`. Achievement delete-with-progress soft-retires; official Feats panel hides inactive unclaimed rows; claim still pays **current** `dokaReward`. `adminDeletePlayerSpriteConfig` does not delete the Character. |

## Surface matrix

| Surface | Persist | Defaults / migration | ID stability | Stale overwrite | Unbounded level | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CharacterStats (12) | Required on Character | No 15→12 migration on live actor | n/a | `updateCharacter` keeps stored stats | HP write cap grandfathers stored; AP/MP hard cap 20 | Live contract OK; deploy path not (SDEG-011) |
| Level / leftover XP | Character.level / experience | `applyRewards` Nat loop `100 * 2^(N-1)` | n/a | Client level ignored | Motoko Nat OK; HUD bigint helper; `deepNormalizeBigInts` Number() can cut | Generation still missing (SDEG-006) |
| Doka | `dokaBalances[Principal]` | Missing → 0 | n/a | Absolute snapshot; persist lock; mint clamp | Nat OK; **per-call 100_000 clamp** | High-level rolls truncated (09-01-004) |
| Owned spells | Implicit catalog ∪ starters | Empty keys ≠ “owns starters” on canister | Purge + name filter; no remap | Appearance keep-store (no mint) | `minLevel` unused on **write** | Not future-safe (SDEG-004, 10-22-002) |
| Spell levels | Parallel arrays; `upgradeSpell` only | `saveBattleStats` ignores arrays; empty keys fall back to **slot localStorage** | Same as owned ids | Keep-store on appearance | Cost `base*2^level` is Nat; no bounds check on values[idx] | Paid path OK; slot-reuse resurrection (10-22-003) |
| Discovery | **None** | Everyone sees current usable catalog | Names used in OLD set | `upgradeSpell` grants any usable id | `minLevel` 30 is content | SDEG-004 |
| Achievements | `principal#id` progress | Missing → locked; server checks level/doka/spell feats | Delete-with-progress retires; **no alias**; `boss_defeated_*` dead | Claim one-shot; reward is **current** config; survives slot delete | `level_10` is a feat | SDEG-008, 10-22-001, 10-22-006 |
| Challenges | Session + `applyRewards` | Old players have no history (OK) | Catalog ids | n/a | n/a | Do not persist without optional fields |
| Inventory / purchases | Canister shop leftover + unused buff map; BuffShop localStorage; GameKey | BuffShop ids/costs ≠ `BUFF_CATALOG` | No item alias; `greater_health_potion` vs `greater_potion` | Redeem is one-shot; credits **redeemer** | `nextGameKeyRequestId` wraps at 1e9; `purchaseBuff` unbounded stacks | SDEG-005, 10-22-004/005, 09-02-005 |
| Dungeon | Principal map (official unused) | Missing → null; update seeds zeros | n/a | `totalMapsCompleted + 1` every call; depth 16 | Float multiplier | Official session-only (10-21-001); raw-client SDEG-007 |
| Boss Rush | `principal#slot` | Missing → (0,0,0); create/delete clear | Room 0–9 | Run count once per master | n/a | Official complete-then-reset for room 9 (#803) |
| Config refs | Admin maps, empty-only seeds | Frozen NewActors through `20260901` | Text ids; boot purge (bad) | n/a | Region `levelMax` is content | New stables → later file only |
| Visuals | `pixelPattern` JSON + `pieceType`; optional sprite URLs | Unknown pieceType → king.front | pieceType strings | Appearance replaces pattern (intended) | n/a | URLs not mandatory (**pass**) |
| Client migration | `APP_VERSION` localStorage wipe | Keeps only spawn/levelup caches + `*_inventory` | n/a | Drops unpaid death, maps, shrine, covenant, spell_levels | n/a | Canister changelog unused (09-28-001, 10-22-007) |

## Unbounded progression

- Backend `applyRewards` / Doka / spell cost use `Nat`. No stored max player level.
- Frontend `xpForNextLevel` uses bigint thresholds; HUD saturates at `MAX_SAFE_INTEGER`.
- `applyRewards` still rejects `dokaDelta > 100_000` / `xpDelta > 500_000`. Official client clamps.
- `MAX_PERSISTED_AP` / `MAX_PERSISTED_MP` = 20 (`adminGuard.mo` 18–19, 649–665). Admin threshold 1 hits the cap at L12. Grandfather keeps a stored 20 but does not let official growth past 20.
- `saveBattleStats` can only **lower** `atk`/`res`/`init` and never writes `evasion`/`sp`/`sr`/`resilience`/`chc` after create (SDEG-2026-10-22-008). Official level-up HP is a live formula; combat offense stats freeze at starter values across a 50-level career.
- Official victory HP floor `50 + level*10` exceeds linear persist max from **level 10** at 5% growth (`150` vs `145`). Vehicle: #386.
- `nextGameKeyRequestId` wraps `999_999_999 → 1` and can collide. Vehicle: #362.
- `deepNormalizeBigInts` Number() then `saveBattleStats` min can permanently cut leftover XP/Doka at L48+.

## Visuals

Owner-uploaded URLs remain optional. Combat/portrait use `pieceType` → `getPersistedPiecePattern` (`pieceArt.ts` 653–658; WX 3719 / 8289). Stored `pixelPattern` is create-time catalog JSON, not combat art. `adminDeletePlayerSpriteConfig` only removes the catalog row.

**Keep:** never make a URL required on Character or combatant persist.

## Spell discovery (future-proof)

Still no `ownedSpellIds` / observe / commit APIs. Empty `spellLevelKeys` is not “owns starters” on the canister. Do not add those required fields until SDEG-001/002, as a **new later** file after `20260901`.

`upgradeSpell` still does not read `SpellConfig.minLevel` (OQL-only at `main.mo` 3690). A level-1 player can buy `void_collapse`. Distinct from hydrate-only 10-21-002.

## Migration analysis (do not attach full chain)

| Module | Role | Live-upgrade safe? |
| :--- | :--- | :--- |
| `20260801_000000.mo` | Empty-canister genesis `OldActor = {}` | Fresh import only |
| `20260803_185500.mo` | Name-only no-op (Caffeine #347/#348 tail) | Pass-through |
| `20260827_000000.mo` | Drop transients; SpellConfig **without** summon fields | Pass-through of then-current shape |
| `20260831_000000.mo` | Frozen 2026-08-31 deployed shape: summon fields + rollback + `adminAuditLog`, **no GameKey** | Required input at Caffeine’s previous-version position |
| `20260901_000000.mo` | Frozen GameKey empty maps, `OldActor = {}` | **Yes** for GameKey only. Player maps stay orthogonal. Idempotent if already at head. |

Live `main.mo` is still `actor {` (line 44). mops still injects the chain (`check-limit = 5`). New required Character fields → `20260902+` only. Never edit a shipped NewActor. Never blank `.old`.

`dfx.json` still points at missing `src/backend_extended/main.mo`; stale 15-field actor is root `backend_extended/`.

## What this run will not approve

- New required Character / stats / config fields
- Attaching the current chain to live `main.mo` as a player-data rewrite
- Editing shipped `20260831` / `20260901` NewActor
- Cloning listed persist PRs
- Hard spell-id / buff-id remap without an alias table and a one-shot generation
- Persisting challenges onto required Character fields
- Wiring official `saveKillCount` (additive, no generation)
- Raising `MAX_PERSISTED_AP/MP` without a human
- Making sprite URLs required

## Open vehicles (do not clone)

| PR | Overlap | Guardian stance |
| :--- | :--- | :--- |
| #362 | GameKey serial + ignore stale Nat loadouts | Approve for wrap; do not clone |
| #385 | unpaid death owner-key | Approve principal scope; union with #667 |
| #386 | victory HP floor vs persist cap | Approve formula pick |
| #388 | spell-level hydrate from canister arrays only | Approve; covers 10-22-003 if it drops empty-keys localStorage |
| #400 | spell-id / empty-keys bar tests | Approve lock tests |
| #408 | BuffShop pending buy | Do not edit BuffShop.tsx |
| #437 | freeze unclaimed feat rewards | Approve snapshot-at-unlock |
| #466 | buff-id aliases, minLevel grants, killCount add | Union with 10-22-002/004; do not clone helpers |
| #490 | principal-keyed BuffShop/feats | Union with SDEG-005 |
| #508 | unpaid-death versionGate | Approve keep-list; HEAD today **drops** the marker |
| #577 | feat/covenant/shrine version-gate helpers | OR into `versionGate.ts` after #508 |
| #622 | innate ids / claimed leaderboard / pieceType | Approve |
| #667 | delete unpaid-death marker | Union with #385 |
| #731 | leftover/AP/changelog helpers | Do not clone |
| #778 | AP/MP cap / killCount / profile replace | Union with 09-29-* |
| #803 | Boss Rush complete(9) | Official path already complete-then-reset |
