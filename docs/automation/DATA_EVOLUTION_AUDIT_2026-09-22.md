# Player data evolution audit — 2026-09-22

**Guardian:** Save / Data Evolution Guardian  
**Trigger:** cron `0 */48 * * *`  
**HEAD inspected:** `0f5363f` (merge #332) plus this run’s persist-contract helpers  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

This run does **not** approve any new required persist field, does **not** attach `(with migration)` to live `main.mo`, and does **not** edit frozen `20260831` / `20260901` NewActor types. New stables still belong in a **later** `20260902+` file with `OldActor = {}`.

Older still-open PRs at audit time (oldest `createdAt` first): **#327** (Striker / `WorldExploration.tsx`), **#331** (portal destack / WX + mapGen), then same-day 2026-09-21 vehicles through **#391**. This branch does **not** edit those overlapping files (`main.mo`, WX, `deathPenalty.ts`, `progressPersist`, `dokaGameKey.ts`).

Prior SDEG PR **#362** (GameKey serial + `saveActiveSpells` keep-store) is still open and **not cloned**. Victory HP floor is **#386**. Spell-level localStorage hydrate is **#388**. Unpaid death principal-scope is **#385**.

## Landed this run (behavior-only, no schema)

- `src/frontend/src/utils/spellCatalogEvolve.ts` — restack-safe contracts:
  - hide purged catalog rows by **id only** (`shouldHidePurgedCatalogRow`; live `spell-inferno` / name Inferno stays visible)
  - `filterSpellBarForPersist` — empty `spellLevelKeys` keeps official starters; today’s Motoko `contains()` is `filterSpellBarKeysOnly`
  - compounding battle-init HP vs linear persist cap
  - leftover XP `< 100` cannot afford the next level (min `100 * 2^0`)
- Tests: `spellCatalogEvolve.test.ts` (10 cases). Starter id list locked to `data/spellData.ts`.

No Motoko change (61 older open PRs; many already edit `main.mo`).

## Landed on main since the 2026-09-02 audit (not this PR)

Same as the 2026-09-21 audit: GameKey EOP tail is `20260901_000000` (`OldActor = {}`). Frozen `20260831` has **no** GameKey. `.old` = Caffeine 2026-08-31 import. `persistApWriteCap` / `persistMpWriteCap` grandfather stored AP/MP. Official client no longer calls `saveActiveSpells`. **HEAD has not moved since 2026-09-21.**

## Cohort questions

| Player | What happens today |
| :--- | :--- |
| Created yesterday | 12-field Character, leftover XP, per-principal Doka, **empty `spellLevelKeys`**. Library = frontend `starterSpells` ∪ every `usableByPlayer` catalog row. First `setSpellBarOrder` of starters is filtered to **[]** on the canister; the session bar still works from `ownedSpells` and re-derives on reload. Buff potions still `${principal}_inventory`. GameKey serial still wraps at 999_999_999 onto `gk_1` until **#362**. |
| Created six months ago | Same maps if the canister stayed on this actor. Optional Character fields default null. `spellLevelKeys` may hold purged ids (`fireball`, `physical_attack`); UI also hides **names** in `OLD_SPELL_NAMES_SET` (live starter `spell-inferno` is named **Inferno**). HP/AP/MP writes grandfather stored values above the live formula. `atk` / `res` / `sp` / `sr` / `init` / `chc` / `evasion` / `resilience` stay at create (saveBattleStats cannot raise them). 15-field `backend_extended` via `dfx.json` still must not be deployed (SDEG-011). |
| Created before a feature | Missing dungeon/rush/achievement/GameKey rows → 0 / [] / null / empty maps. Challenges are session-only. **Unsafe** if a required field is added without a later chain file. KYC `purchaseRecords` pending rows still never auto-complete. Empty-keys bar persist is already the create default. |
| Created before a spell/enemy rename | No alias table. Boot `OLD_SPELL_IDS` still deletes catalog rows every upgrade, including `physical_attack`. Enemy/boss ids are config-only. Unknown `pieceType` paints `king.front`. |
| Owns now-retired content | Arrays keep the id. Retired catalog stays in the library only if already in keys/bar/starters. `upgradeSpell` still appends any **usable** catalog id on first paid upgrade; retired + never owned → `#err Spell is retired`. `setSpellBarOrder` drops ids not in `spellLevelKeys`. Claim still pays **current** `dokaReward`. Deleting a sprite config does not delete the Character. Empty-keys hydrate of `{userId}_slotN_pbv_spell_levels` can still scale combat from another occupant’s paid levels until **#388**. |

## Surface matrix

| Surface | Persist | Defaults / migration | ID stability | Stale overwrite | Unbounded level | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CharacterStats (12) | Required on Character | No 15→12 migration on a still-15 live actor | n/a | `updateCharacter` keeps stored stats | HP/AP/MP grandfather stored; **atk/res/sp/… never grow** | Live HP/AP/MP OK; dfx path not (SDEG-011); 09-22-004 |
| Level / leftover XP | Character.level / experience | `applyRewards` Nat loop | n/a | Client level ignored; XP `min(incoming, stored)` | Motoko Nat OK; HUD saturates at L48 | Generation still missing (SDEG-006); pow2 O(level) (09-21-004) |
| Doka | `dokaBalances[Principal]` | Missing → 0 | n/a | Absolute snapshot; persist lock; mint clamp | Nat OK; **per-call 100_000 clamp** | High-level rolls truncated (09-01-004) |
| Owned spells | Implicit catalog ∪ starters | Empty keys ≠ “owns starters” on canister | Purge + **name** filter | Appearance keep-store (no mint) | n/a | Not future-safe (SDEG-004, 09-21-002, 09-22-002) |
| Spell levels | Parallel arrays; `upgradeSpell` only | `saveBattleStats` ignores arrays | Same as owned ids | Keep-store on appearance; **UI hydrate from localStorage when keys empty** | Cost `base*2^level` is Nat | Paid path OK; ghost UI levels until #388 |
| Discovery | **None** | Everyone sees current usable catalog | Names used in OLD set | `upgradeSpell` grants any usable id | `void_collapse` minLevel 30 is content | Do not add `ownedSpellIds` until a later file |
| Achievements | `principal#id` progress | Missing → locked; server checks level/doka/spell feats | Delete-with-progress retires | Claim one-shot; reward is **current** config | `level_10` is a feat | SDEG-008 |
| Challenges | Session + `applyRewards` | Old players have no history (OK) | Catalog ids | n/a | n/a | Do not persist onto required Character fields |
| Inventory / purchases | Canister shop leftover + unused buff map; BuffShop localStorage; GameKey | GameKey empty defaults on `20260901` | GameKey codes 120 chars | Redeem one-shot; credits **redeemer** | Serial still wraps on main (#362) | BuffShop still localStorage (SDEG-005); KYC pending orphaned |
| Dungeon | Principal map | Missing → null | n/a | `totalMapsCompleted + 1` every call; depth 16 | Float multiplier | Official frontend **never calls** the method; SDEG-007 remains |
| Boss Rush | `principal#slot` | Missing → (0,0,0); create/delete clear | Room 0–9 | Run count once per master | n/a | Rush half done |
| Config refs | Admin maps, empty-only seeds | Frozen 20260831 / 20260901 | Text ids; boot purge (bad) | n/a | Region `levelMax` is content | Do not restuff shipped NewActor |
| Visuals | `pixelPattern` JSON + `pieceType`; optional sprite URLs | Unknown pieceType → king.front | pieceType strings | Appearance replaces pattern (intended) | n/a | URLs not mandatory (**pass**) |
| `activeSpells : ?[Nat]` | Leftover Character field | Optional; create clears | Nat ≠ spell id | Official client does not call; **#362** keep-store | n/a | Do not delete the field (M0169) |
| Unpaid death 20/40 | `localStorage` `pbv_pending_death_penalty_slotN` | Slot-only until **#385** | n/a | Replay can tax a later II on the same browser | n/a | Vehicle #385 |

## Unbounded progression

- Backend `applyRewards` / Doka / spell cost use `Nat`. No stored max player level.
- Frontend `xpForNextLevel` saturates at `MAX_SAFE_INTEGER` from level **48**; persist math uses `xpThresholdBigInt`.
- `applyRewards` still rejects `dokaDelta > 100_000` / `xpDelta > 500_000`. Official client clamps. Jackpot / stacked void XP still exceed the cap (`longHorizonSim.test.ts`).
- Victory HP floor `50 + level*10` still exceeds linear persist max from **level 10** (`150` vs `145`) on **main**. Vehicle **#386** caps the floor. Grandfather does not save the **first** write of 150 onto a 100-HP row (SDEG-2026-09-02-001).
- **New:** battle-init `getPlayerBaseStats` HP is **compounding** `100 * 1.05^(level-1)` (`progression.ts` **77–80**, wired in WX). Persist cap is **linear** `100 + (level-1)*5`. At level 10: **155 vs 145**. HUD `maxHp` useMemo in WX **3400–3405** uses the linear form. Two ceilings in one session (SDEG-2026-09-22-001).
- `maxPersistedAp` / `maxPersistedMp` hard-cap at **20**. `formulaAp(325) > 20`. Stored AP above 20 is grandfathered; **new** growth stops (SDEG-2026-09-21-003).
- `atk` / `res` / `sp` / `sr` / `init` / `chc` / `evasion` / `resilience` have **no persist growth writer**. Combat uses `characterStats.sp` / `res` / `chc` / `init`. Enemies scale with level; these player axes stay at create (SDEG-2026-09-22-004). Do not change combat math in this PR.
- `applyRewards` `pow2` is O(level) on every credit (`main.mo` **2129**). Fine at current levels; instruction-limit trap at extreme Nat levels (SDEG-2026-09-21-004). Leftover `< 100` can skip the power (helper this run; Motoko still loops).
- `getEnemyHPForLevel` still uses `Float` — do not change without a human.
- GameKey serial wrap still on main (**#362**).

## Visuals

Owner-uploaded URLs remain optional. `adminDeletePlayerSpriteConfig` (`main.mo` **854–860**) removes only the sprite row. Portrait/player draw uses `getPersistedPiecePattern` (`pieceArt.ts` **653–658**). `pixelPattern` is official carved art on the Character, not a URL.

**Keep:** never make a URL required on Character or combatant persist.

## Spell discovery (future-proof)

Still no `ownedSpellIds` / observe / commit APIs. Do not add those required fields until a **new later** migration file after `20260901`.

`OLD_SPELL_NAMES_SET` in `WorldExploration.tsx` **2356–2393** still filters backend (and fallback starter pool) by **id and display name**. Live starter `spell-inferno` is named `Inferno` (`spellData.ts` **502–503**). Contract helper this run: `shouldHidePurgedCatalogRow`. Not patched in WX: #327 / #331 already edit that file.

`setSpellBarOrder` (`main.mo` **1945–1947**) filters to `spellLevelKeys` only. Create stores `[]` (`_starterCharacter` **225–226**). Official first save of starters persists **empty** bar. Session re-derives from the catalog-all library. That is incompatible with a future ownership set (SDEG-2026-09-22-002). Helper `filterSpellBarForPersist` is the intended Motoko filter; do not wire `main.mo` while persist PRs are queued.

Empty `spellLevelKeys` still falls through to `{userId}_slotN_pbv_spell_levels` / leftover `pbv_spell_levels` in WX **3105–3132**. Combat can use another occupant’s paid levels. Canister arrays stay empty (`saveBattleStats` ignores them). Vehicle **#388**.

## Migration analysis (do not attach full chain as a player rewrite)

| Module | Role | Live-upgrade safe? |
| :--- | :--- | :--- |
| `20260801_000000.mo` | Empty-canister genesis `OldActor = {}` | Fresh import only as the first name |
| `20260803_185500.mo` | Name-only no-op (Caffeine #347/#348 tail) | Yes — keep the filename |
| `20260827_000000.mo` | Drop transients; pass-through player maps | Pass-through of then-current shape |
| `20260831_000000.mo` | Frozen deployed tail: summon SpellConfig + rollback + audit; **no GameKey** | **Yes** as the 2026-08-31 Caffeine signature |
| `20260901_000000.mo` | GameKey empty maps; `OldActor = {}` | **Yes** for GameKey only. Player maps stay orthogonal. Idempotent. Replay must not wipe player maps. |

Live `main.mo` is still `actor {` (no annotation). mops still injects the chain. Empty-canister and `.old` check-stable are covered by `scripts/caffeine-import-gate.sh backend`.

Repeated deployment of the boot `OLD_SPELL_IDS` loop is **idempotent as a delete** (already-missing ids stay missing) and **destructive if an admin re-adds a purged id**. It is not a one-shot generation.

Stale frontend: `saveBattleStats` still `min`s incoming Doka/XP; `updateCharacter` keep-stores progression; `upgradeSpell` is the only paid spell-level writer. Missing: Character `writeGeneration` (SDEG-006).

## What this run will not approve

- New required Character / stats / config fields
- Attaching `(with migration)` on live `main.mo` as a player-data rewrite
- Editing shipped `20260831` / `20260901` NewActor
- Hard spell-id remap without an alias table and a one-shot generation
- Persisting challenges onto required Character fields
- Deleting leftover `activeSpells : ?[Nat]` (would need a later consumer file)
- Changing `MAX_PERSISTED_AP` / victory HP floor / `applyRewards` ceilings / compounding HP without a human
- Cloning #362 / #385 / #386 / #388
- Editing `WorldExploration.tsx` while #327/#331 are queued
- Editing `main.mo` while older persist PRs are queued
- Growing persisted `atk`/`sp`/`res` (adjacent to combat math)

## Open vehicles (do not clone / do not overwrite)

| Draft PR | Overlap | Guardian stance |
| :--- | :--- | :--- |
| #327 | `WorldExploration.tsx`, combat helpers | Independent. Inferno name-filter stays OPEN (09-21-002). Use `shouldHidePurgedCatalogRow` after those merge. |
| #331 | WX, mapGen, persist helpers | Independent. |
| #362 | `main.mo`, `gameKey.mo`, `dokaGameKey.ts` | **Approve.** Unbounded GameKey serial + `saveActiveSpells` keep-store. Do not clone. |
| #385 | `deathPenalty.ts`, `App.tsx` | **Approve.** Principal-scope unpaid death 20/40. |
| #386 | `deathPenalty.ts` (union with #385) | **Approve.** Caps victory HP floor at persist max (09-02-001). |
| #388 | WX + new `spellLevelHydrate.ts` | **Approve.** Canister arrays only for spell-level hydrate (09-22-003). |
