# Player data evolution audit — 2026-09-29

**Guardian:** Save / Data Evolution Guardian  
**Trigger:** cron `0 */48 * * *`  
**HEAD inspected:** `0f5363f` (unchanged since 2026-09-21 / last guardian pass)  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

This run does **not** approve any new required persist field and does **not** attach `(with migration)` to live `main.mo`.  
It does **not** edit `main.mo`, `WorldExploration.tsx`, `BuffShop.tsx`, `deathPenalty.ts`, `versionGate.ts`, or `App.tsx`.  
It does **not** clone #362 / #385 / #386 / #388 / #400 / #408 / #437 / #466 / #490 / #508 / #577 / #622 / #667 / #731 helpers.

## Cohort questions

| Player | What happens today |
| :--- | :--- |
| Created yesterday | 12-field Character, leftover XP under `100 * 2^(N-1)`, per-principal Doka, empty `spellLevelKeys`. Library = starters ∪ every `usableByPlayer` catalog row. `killCount` stays 0 (official never calls `saveKillCount`). Create AP=10 / MP=5 is grandfathered as the persist *cap*. Frontend `APP_VERSION` wipe is the live client migration. |
| Created six months ago | Optional Character fields default null. Purged spell ids stay in arrays; UI also hides **names**. HP/AP/MP grandfather on the *cap*, not on incoming AP/MP. Unclaimed feats still rank 0 on the leaderboard (#622). Name-keyed maps/loot caches on this HEAD (#490 vehicle). Leftover XP is remainder — a curve swap would restack them. Persist AP stops at 20 even if level keeps growing. |
| Created before a feature | Missing dungeon/rush/achievement/GameKey rows → 0 / [] / null. Challenges session-only. Changelog canister maps stay empty (official never marks). **Unsafe** if a required field is added without a later chain file after `20260901`. `killCount=0` is valid, not a hole. |
| Created before a spell/enemy/feat rename | No spell alias table. Boot `OLD_SPELL_IDS` still deletes catalog rows every upgrade, including live starter `physical_attack` (not in `isBuiltInSpellId`). Unknown `pieceType` paints `king.front`. Display-name localStorage keys do not follow a rename on this HEAD. |
| Owns now-retired content | Arrays keep the id. Retired catalog stays in the library only if already in keys/bar/starters. Claim still pays **current** `dokaReward` until #437. Delete-character still leaves principal dungeon, slot canister buffs, feats, and Doka. |
| Deleted then recreated in the same slot | Boss Rush map is removed. Fresh L1 can inherit unpaid 20/40 against the shared wallet until #667. Dungeon depth / `bestRewardMultiplier` / `totalMapsCompleted` still persist on the Principal. |
| After an official APP_VERSION bump | `localStorage.clear()` except spawn/levelup/`*_inventory`. Feat counters, shrine/covenant caches, unpaid death, `pbv_boss_configs`, and changelog flags drop on this HEAD. Canister `setAppVersion` does **not** wipe browsers. |
| After a stale `saveCallerUserProfile` | Full replace; `uiLayout: ""` (create default) wipes a newer HUD blob. `saveUserUiLayout` is the merge writer. |

## Surface matrix

| Surface | Persist | Defaults / migration | ID stability | Stale overwrite | Unbounded level | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CharacterStats (12) | Required on Character | No 15→12 on live actor | n/a | `updateCharacter` keep-stores stats | HP grandfather; **AP/MP hard cap 20** | Live contract OK; `dfx.json` still `backend_extended` (SDEG-011); **09-29-001** |
| Level / leftover XP | Character.level / experience | `applyRewards` Nat loop; remainder under frozen curve | n/a | Client level ignored; Number hydrate can cut leftover | Motoko Nat OK; HUD bigint; applyRewards ceilings | 09-27-003; 09-28-002 |
| Doka | `dokaBalances[Principal]` | Missing → 0 | n/a | Absolute snapshot; persist lock; mint clamp; slot-reuse death replay | Nat OK; per-call 100_000 | 09-01-004; 09-27-001 |
| Owned spells | Implicit catalog ∪ starters | Empty keys ≠ “owns starters” on canister | Purge + name filter; built-in list omits innates | Appearance keep-store | n/a | SDEG-003/004; 09-26-001 |
| Spell levels | Parallel arrays; `upgradeSpell` only | `saveBattleStats` ignores arrays | Same as owned ids | Empty keys hydrate localStorage (#388) | Cost `base*2^level` Nat | Paid path OK |
| Discovery | **None** | Everyone sees current usable catalog | Names in OLD set | `upgradeSpell` grants any usable id | `minLevel` 30 is content | SDEG-004 |
| Achievements | `principal#id` progress | Missing → locked | No alias table | Claim one-shot; reward is **current** config | `level_10` is a feat | SDEG-008; 09-26-002 |
| Challenges | Session + `applyRewards` | Old players have no history (OK) | Catalog ids | n/a | n/a | Do not persist without optional fields |
| Inventory / purchases | BuffShop localStorage; unused canister map; GameKey | Version gate keeps `*_inventory` | `greater_potion` ≠ `greater_health_potion` | #408 in-flight buy; name-keyed caches on HEAD | `nextGameKeyRequestId` wraps | SDEG-005; #466 / #490 |
| Dungeon | Principal map | Missing → null; update seeds zeros | n/a | `totalMapsCompleted + 1`; **survives delete** | Depth 16; Float multiplier | SDEG-007; 09-27-002 |
| Boss Rush | `principal#slot` | Missing → (0,0,0); create/delete clear | Room 0–9 | Run count once per master | n/a | Rush half done (slot reuse **pass**) |
| killCount | Required on CharacterStats | Create must be 0; official never increments | n/a | Additive `saveKillCount` (unused hook) | Nat OK; +64/call | **09-29-002** |
| UserProfile | `name` + `uiLayout` | Empty layout = create default | n/a | `saveCallerUserProfile` full replace | n/a | **09-29-003** |
| Config refs | Admin maps, empty-only seeds | Frozen 20260831 + 20260901 GameKey | Text ids; boot purge | `pbv_boss_configs` wipe resets encounters | Region `levelMax` is content | Later file only; 09-28-001 |
| Version / changelog | Frontend `APP_VERSION` + `pbv_*`; unused canister maps | Empty-only changelog seed | Version string | Wipe is a client migration | n/a | 09-28-001 |
| Visuals | `pieceType` + unused `pixelPattern` JSON; optional sprite URLs | Unknown pieceType → king.front | pieceType strings | Catalog art changes rewrite look | n/a | URLs not mandatory (**pass**); 09-26-003 |

## Unbounded progression

- Backend `applyRewards` / Doka / spell cost use `Nat`. No stored max player level.
- Frontend `xpForNextLevel` uses bigint thresholds; HUD saturates at `MAX_SAFE_INTEGER`.
- **`experience` meaning is leftover under a frozen curve.** A deploy that changes `100 * 2^(N-1)` without converting remainder restacks every cohort (09-28-002).
- Character slot hydrate still `Number()`s Nats, then absolute `saveBattleStats` can cut leftover (09-27-003).
- `applyRewards` still rejects `dokaDelta > 100_000` / `xpDelta > 500_000`. Official client clamps.
- **`MAX_PERSISTED_AP` / `MAX_PERSISTED_MP` = 20 is a silent action-economy max** (09-29-001). Admin threshold 1 (allowed) hits the AP cap at level 12. Incoming AP/MP is still not keep-stored (09-28-003).
- `getEnemyHPForLevel` still uses `Float` — do not change without a human.
- `nextGameKeyRequestId` wraps `999_999_999 → 1` (#362 vehicle).

## Visuals

Owner-uploaded URLs remain optional. `adminDeletePlayerSpriteConfig` does not delete the Character. Unknown `pieceType` uses `getPersistedPiecePattern` → `king.front`. Stored `pixelPattern` JSON is not the live draw source.

**Keep:** never make a URL required on Character or combatant persist.

## Spell discovery (future-proof)

Still no `ownedSpellIds` / observe / commit APIs. Preserving future discovery still requires SDEG-003 + SDEG-004 after a **later** chain file (`20260902+`, `OldActor = {}`). Do not add those required fields on this HEAD. Do not treat `activeSpells : ?[Nat]` as Text spell ids (#362 ignore-stale).

## Migration analysis (do not attach; do not clone shipped NewActor)

| Module | Role | Live-upgrade safe? |
| :--- | :--- | :--- |
| `20260801_000000.mo` | Empty-canister genesis `OldActor = {}` | Fresh import only |
| `20260803_185500.mo` | Name-only no-op | Pass-through |
| `20260827_000000.mo` | Drop transients | Pass-through of then-current shape |
| `20260831_000000.mo` | Frozen Aug-31 deployed shape (no GameKey) | Check-stable tail for Caffeine `.old` |
| `20260901_000000.mo` | Frozen GameKey empty maps | `OldActor = {}`; do not restuff |

Live `main.mo` line 44 is still `actor {`. mops injects the chain (`check-limit = 5`). New required player fields → **new later file only**. Orthogonal stables on live `main.mo` still match `snapshots/orthogonal-stables.txt`. No new `let`/`var` this run.

The official client’s real repeated migration is `App.tsx` `APP_VERSION` → `localStorage.clear()`. That wipe is **not** idempotent for feat counters / unpaid death / boss-config cache on this HEAD. It is re-applied on every bump. Canister `changelogShownVersions` is not the authority.

`saveCallerUserProfile` is a full replace. Replaying the create payload (`uiLayout: ""`) is a destructive overwrite of a newer layout, not an idempotent default (09-29-003).

## What this run will not approve

- New required Character / stats / config fields
- Attaching `(with migration)` as a player-data rewrite
- Editing shipped `20260831` / `20260901` NewActor
- Changing the leftover-XP curve without a conversion generation
- Raising `MAX_PERSISTED_AP`/`MP` to “unbounded” without another mint guard
- Backfilling official `killCount=0` rows
- Cloning #362 / #385 / #386 / #388 / #400 / #408 / #437 / #466 / #490 / #508 / #577 / #622 / #667 / #731
- Editing `versionGate.ts` / `deathPenalty.ts` / `main.mo` / WX / BuffShop / `App.tsx`
- Hard spell-id remap without an alias table and a one-shot generation
- Persisting challenges onto required Character fields
- Making sprite URLs, stored `pixelPattern` JSON, or `pbv_boss_configs` mandatory for combat

## Open vehicles (do not clone)

| Draft PR | Overlap | Guardian stance |
| :--- | :--- | :--- |
| #362 | GameKey serials; `saveActiveSpells` keep-store | Approve (09-02-005 / 09-21-001) |
| #385 | Unpaid death II key | Approve; **union** official delete clear (#667 / 09-27-001) |
| #386 | Victory HP floor vs persist cap | Approve (09-02-001) |
| #388 | Spell-level hydrate from canister only | Approve |
| #400 | Empty-keys bar contract tests | Approve |
| #408 | BuffShop in-flight buy | Approve |
| #437 | Freeze unclaimed feat `dokaReward` | Approve (SDEG-008 vehicle) |
| #466 | Buff alias, minLevel, pow2 helper | Approve; do not clone helpers |
| #490 | Principal-keyed BuffShop/feats/maps-visited | Approve. HEAD still name-keys. Do not clone `progressStorageKey.ts`. |
| #508 | Version-gate unpaid death | Approve. Union feat keys from #577 after this file. |
| #577 | Feat/covenant/shrine version-gate helper | Approve (09-25-001). Do not clone `*Evolve.ts`. |
| #622 | Innate ids / claimed leaderboard / pieceType | Approve (09-26-001..003). Do not clone helpers. |
| #667 | Official delete clears unpaid-death marker | Approve (09-27-001..003). Do not clone helpers. |
| #731 | 09-28 leftover/AP/changelog contracts | Approve. Do not clone those helpers; this run adds 09-29 files only. |
| #742 / #756 / #759 / #764 / #767 | remount / portal XP / death-cut saveBattleStats | Sibling persist. Do not clone. Do not edit WX. |

## Landed this run (read-back)

- `src/frontend/src/utils/persistApHardCapUnbounded.ts` — AP/MP hard cap 20 vs unbounded level / admin threshold 1
- `src/frontend/src/utils/saveKillCountEvolution.ts` — official never writes; 0 is valid; additive retry mints
- `src/frontend/src/utils/userProfileReplacePersist.ts` — `saveCallerUserProfile` full replace vs `saveUserUiLayout` merge
