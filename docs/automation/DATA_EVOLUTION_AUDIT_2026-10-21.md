# Player data evolution audit — 2026-10-21

**Guardian:** Save / Data Evolution Guardian  
**Trigger:** cron `0 */48 * * *`  
**HEAD inspected:** `0f5363f` (unchanged since 2026-09-21 / last guardian pass 2026-09-29 #778)  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

This run does **not** approve any new required persist field and does **not** attach `(with migration)` to live `main.mo`.  
It does **not** edit `main.mo`, `WorldExploration.tsx`, `BuffShop.tsx`, `deathPenalty.ts`, `versionGate.ts`, `App.tsx`, or `AchievementsPanel.tsx`.  
It does **not** clone #362 / #385 / #386 / #388 / #400 / #408 / #437 / #466 / #490 / #508 / #577 / #622 / #667 / #731 / #778 / #803 helpers.

## Cohort questions

| Player | What happens today |
| :--- | :--- |
| Created yesterday | 12-field Character, leftover XP under `100 * 2^(N-1)`, per-principal Doka, empty `spellLevelKeys`. Library = starters ∪ every `usableByPlayer` catalog row, **including `void_collapse` (minLevel 30) at L1**. `killCount` stays 0. Official dungeon depth lives in session refs only — reload starts the chain over. Frontend `APP_VERSION` wipe is the live client migration. |
| Created six months ago | Optional Character fields default null. Purged spell ids stay in arrays; UI also hides **names**. HP/AP/MP grandfather on the *cap*, not on incoming AP/MP. Persist AP stops at 20 even if level keeps growing. Leftover XP is remainder — a curve swap would restack them. A null `dungeonRecords` row is not “never entered a dungeon”; official play never wrote it. |
| Created before a feature | Missing rush/achievement/GameKey rows → 0 / [] / null. Challenges session-only. Changelog canister maps stay empty (official never marks). **Unsafe** if a required field is added without a later chain file after `20260901`. `killCount=0` is valid. Session blood/covenant/shrine stay null; `getSessionState` would substitute blood **50** if wired. |
| Created before a spell/enemy/feat rename | No spell or feat alias table. Boot `OLD_SPELL_IDS` still deletes catalog rows every upgrade, including live starter `physical_attack` (frontend name **Strike**; not in `isBuiltInSpellId`). Unknown `pieceType` paints `king.front`. Display-name localStorage keys do not follow a rename on this HEAD (#490 vehicle). |
| Owns now-retired content | Arrays keep the id. Retired catalog stays in the library only if already in keys/bar/starters. Unclaimed retired feats are **hidden from the official Claim UI** (`configs.filter(cfg => cfg.active)`) while `claimAchievementReward` still pays **current** `dokaReward` to a raw client. Delete-character still leaves principal dungeon, slot canister buffs, feats, and Doka. |
| Deleted then recreated in the same slot | Boss Rush map is removed. Fresh L1 can inherit unpaid 20/40 against the shared wallet until #667. Canister dungeon leftovers only exist if a raw client wrote them. |
| After an official APP_VERSION bump | `localStorage.clear()` except spawn/levelup/`*_inventory`. Feat counters, shrine/covenant caches, unpaid death, `pbv_boss_configs`, and changelog flags drop on this HEAD. Canister `setAppVersion` does **not** wipe browsers. |
| After a stale `saveCallerUserProfile` | Full replace; `uiLayout: ""` (create default) wipes a newer HUD blob. `saveUserUiLayout` is the merge writer. |

## Surface matrix

| Surface | Persist | Defaults / migration | ID stability | Stale overwrite | Unbounded level | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CharacterStats (12) | Required on Character | No 15→12 on live actor | n/a | `updateCharacter` keep-stores stats | HP grandfather; **AP/MP hard cap 20** | Live contract OK; `dfx.json` still `backend_extended` (SDEG-011); 09-29-001 |
| Level / leftover XP | Character.level / experience | `applyRewards` Nat loop; remainder under frozen curve | n/a | Client level ignored; Number hydrate can cut leftover | Motoko Nat OK; HUD bigint; applyRewards ceilings | 09-27-003; 09-28-002 |
| Doka | `dokaBalances[Principal]` | Missing → 0 | n/a | Absolute snapshot; persist lock; mint clamp; slot-reuse death replay | Nat OK; per-call 100_000 | 09-01-004; 09-27-001 |
| Owned spells | Implicit catalog ∪ starters | Empty keys ≠ “owns starters” on canister | Purge + name filter; built-in list omits innates | Appearance keep-store | n/a | SDEG-003/004; 09-26-001 |
| Spell levels | Parallel arrays; `upgradeSpell` only | `saveBattleStats` ignores arrays | Same as owned ids | Empty keys hydrate localStorage (#388) | Cost `base*2^level` Nat | Paid path OK; 09-25-004 mismatch trap |
| Discovery / minLevel | **None** (catalog field only) | Everyone sees current usable catalog; minLevel ignored at hydrate | Names in OLD set | `upgradeSpell` grants any usable id | `void_collapse` minLevel 30 is content | **10-21-002**; SDEG-004 |
| Achievements | `principal#id` progress | Missing → locked | No alias table | Claim one-shot; reward is **current** config; official panel hides `active=false` | `level_10` is a feat | SDEG-008; 09-25-009; **10-21-004** |
| Challenges | Session + `applyRewards` | Old players have no history (OK) | Catalog ids | n/a | n/a | Do not persist without optional fields |
| Inventory / purchases | BuffShop localStorage; unused canister map; GameKey | Version gate keeps `*_inventory` | `greater_potion` ≠ `greater_health_potion` | #408 in-flight buy; name-keyed caches on HEAD | `nextGameKeyRequestId` wraps | SDEG-005; #466 / #490 |
| Dungeon | Principal map **unused by official UI** | Missing → null; live chain = session refs | n/a | Raw `totalMapsCompleted + 1`; **survives delete** | Depth 16; Float multiplier | **10-21-001**; SDEG-007 raw-client only |
| Boss Rush | `principal#slot` | Missing → (0,0,0); create/delete clear | Room 0–9 | Run count once per master | n/a | Rush half done; #803 complete(9) |
| killCount | Required on CharacterStats | Create must be 0; official never increments | n/a | Additive `saveKillCount` (unused hook) | Nat OK; +64/call | 09-29-002 |
| UserProfile | `name` + `uiLayout` | Empty layout = create default | n/a | `saveCallerUserProfile` full replace | n/a | 09-29-003 |
| Config refs | Admin maps, empty-only seeds | Frozen 20260831 + 20260901 GameKey | Text ids; boot purge | `pbv_boss_configs` wipe resets encounters | Region `levelMax` is content | Later file only; 09-28-001 |
| Version / changelog | Frontend `APP_VERSION` + `pbv_*`; unused canister maps | Empty-only changelog seed | Version string | Wipe is a client migration | n/a | 09-28-001 |
| Visuals | `pieceType` + unused catalog `pixelPattern` JSON; optional sprite URLs | Unknown pieceType → king.front | pieceType strings | Catalog art changes rewrite look; editor random grid is not saved | n/a | URLs not mandatory (**pass**); 09-26-003; **10-21-003** |

## Unbounded progression

- Backend `applyRewards` / Doka / spell cost use `Nat`. No stored max player level.
- Frontend `xpForNextLevel` uses bigint thresholds; HUD saturates at `MAX_SAFE_INTEGER`.
- **`experience` meaning is leftover under a frozen curve.** A deploy that changes `100 * 2^(N-1)` without converting remainder restacks every cohort (09-28-002).
- Character slot hydrate still `Number()`s Nats, then absolute `saveBattleStats` can cut leftover (09-27-003).
- `applyRewards` still rejects `dokaDelta > 100_000` / `xpDelta > 500_000`. Official client clamps.
- **`MAX_PERSISTED_AP` / `MAX_PERSISTED_MP` = 20 is a silent action-economy max** (09-29-001). Admin threshold 1 (allowed) hits the AP cap at level 12.
- `getEnemyHPForLevel` still uses `Float` — do not change without a human.
- `nextGameKeyRequestId` wraps `999_999_999 → 1` (#362 vehicle).
- Spell `minLevel` is **not** a persist ceiling; it does not stop L1 from seeing or paying for a minLevel-30 catalog row (10-21-002).

## Visuals

Owner-uploaded URLs remain optional. `adminDeletePlayerSpriteConfig` does not delete the Character. Unknown `pieceType` uses `getPersistedPiecePattern` → `king.front`. Official create writes catalog `chessPiecePatterns[selectedPiece]` JSON into the required `pixelPattern` field; combat ignores that blob.

**Keep:** never make a URL or the stored JSON blob required on Character or combatant persist.

## Spell discovery (future-proof)

Still no `ownedSpellIds` / observe / commit APIs. Preserving future discovery still requires SDEG-003 + SDEG-004 after a **later** chain file (`20260902+`, `OldActor = {}`). Do not add those required fields on this HEAD. Do not treat `activeSpells : ?[Nat]` as Text spell ids (#362 ignore-stale). Do not start enforcing `minLevel` at hydrate until ownership is stored — empty-keys cohorts would lose catalog rows they already played (10-21-002).

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

Official dungeon depth has **no** canister migration because official play never writes `dungeonRecords`. Wiring that map later is a new persist feature: empty defaults must mean “no official history”, not “reset a six-month chain that never lived there” (10-21-001).

## What this run will not approve

- New required Character / stats / config fields
- Attaching `(with migration)` as a player-data rewrite
- Editing shipped `20260831` / `20260901` NewActor
- Changing the leftover-XP curve without a conversion generation
- Raising `MAX_PERSISTED_AP`/`MP` to “unbounded” without another mint guard
- Backfilling official `killCount=0` rows
- Enforcing `SpellConfig.minLevel` at hydrate without an ownership set
- Promoting stored `pixelPattern` JSON or sprite URLs to mandatory combat art
- Cloning #362 / #385 / #386 / #388 / #400 / #408 / #437 / #466 / #490 / #508 / #577 / #622 / #667 / #731 / #778 / #803
- Editing `versionGate.ts` / `deathPenalty.ts` / `main.mo` / WX / BuffShop / `App.tsx` / `AchievementsPanel.tsx`
- Hard spell-id remap without an alias table and a one-shot generation
- Persisting challenges onto required Character fields
- Treating null `dungeonRecords` as proof a six-month player never ran a dungeon

## Open vehicles (do not clone)

| Draft PR | Overlap | Guardian stance |
| :--- | :--- | :--- |
| #362 | GameKey serials; `saveActiveSpells` keep-store | Approve (09-02-005 / 09-21-001) |
| #385 | Unpaid death II key | Approve; **union** official delete clear (#667 / 09-27-001) |
| #386 | Victory HP floor vs persist cap | Approve (09-02-001) |
| #388 | Spell-level hydrate from canister only | Approve |
| #400 | Empty-keys bar contract tests | Approve |
| #408 | BuffShop in-flight buy | Approve |
| #437 | Freeze unclaimed feat `dokaReward` | Approve (SDEG-008 vehicle). Union official Claim visibility (10-21-004). |
| #466 | Buff alias, minLevel, pow2 helper | Approve; do not clone helpers. #466 minLevel grant tests are not hydrate enforcement. |
| #490 | Principal-keyed BuffShop/feats/maps-visited | Approve. HEAD still name-keys. Do not clone `progressStorageKey.ts`. |
| #508 | Version-gate unpaid death | Approve. Union feat keys from #577 after this file. |
| #577 | Feat/covenant/shrine version-gate helper | Approve (09-25-001). Do not clone `*Evolve.ts`. |
| #622 | Innate ids / claimed leaderboard / pieceType | Approve (09-26-001..003). Do not clone helpers. |
| #667 | Official delete clears unpaid-death marker | Approve (09-27-001..003). Do not clone helpers. |
| #731 | 09-28 leftover/AP/changelog contracts | Approve. Do not clone those helpers. |
| #778 | 09-29 AP/MP cap, killCount, profile replace | Approve. Do not clone those helpers. |
| #803 | Boss Rush complete(9) ahead of reset | Approve. Sibling persist. Do not clone. |

## Landed this run (read-back)

- `src/frontend/src/utils/dungeonRecordsOfficialPersist.ts` — official dungeon chain is session refs; canister map unused
- `src/frontend/src/utils/spellMinLevelHydrate.ts` — `minLevel` ignored at hydrate/library/upgradeSpell
- `src/frontend/src/utils/pixelPatternPersistVisual.ts` — catalog JSON blob is not combat art; sprite URLs optional
- `src/frontend/src/utils/retiredFeatClaimHidden.ts` — official Feats panel hides inactive unclaimed rows
