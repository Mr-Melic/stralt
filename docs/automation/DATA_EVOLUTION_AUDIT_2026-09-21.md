# Player data evolution audit — 2026-09-21

**Guardian:** Save / Data Evolution Guardian  
**Trigger:** cron `0 */48 * * *`  
**HEAD inspected:** `0f5363f` (merge #332) plus this run’s behavior-only persist fixes  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

This run does **not** approve any new required persist field, does **not** attach `(with migration)` to live `main.mo`, and does **not** edit frozen `20260831` / `20260901` NewActor types. New stables still belong in a **later** `20260902+` file with `OldActor = {}`.

Older still-open PRs at audit time (oldest `createdAt` first): #327 (Striker / `WorldExploration.tsx`), #331 (portal destack / WX + mapGen), #333 (TBC docs / README), #334 (admin copy). This branch does **not** edit those overlapping files.

## Landed this run (behavior-only, no schema)

- `GameKey.bumpRequestSerial` / `requestId` (`src/backend/lib/gameKey.mo`) + `requestGameKeyPurchase` (`main.mo` **1439–1449**) — unbounded serial; skip occupied `gk_*` keys; **no wrap** at 999_999_999 (SDEG-2026-09-02-005).
- TS mirror + tests: `nextGameKeyRequestSerial` (`dokaGameKey.ts` **97–113**; `dokaGameKey.security.test.ts` **54–69**).
- `saveActiveSpells` (`main.mo` **3176–3208**) keep-store: official loadout is `spellBarOrder` (`?[Text]`). Incoming `[Nat]` is ignored so a stale client cannot persist catalog indices (SDEG-2026-09-21-001).

## Landed on main since the 2026-09-02 audit (not this PR)

- GameKey EOP tail is `20260901_000000` with `OldActor = {}` empty maps. Frozen `20260831` has **no** GameKey. `.old` = Caffeine 2026-08-31 import (42 stables). `mops.toml` `check-limit = 5`. **SDEG-2026-09-01-005 / SDEG-2026-09-02-002 are implemented.**
- `persistApWriteCap` / `persistMpWriteCap` grandfather stored AP/MP the same way HP does (`adminGuard.mo` **645–671**).
- Official client no longer calls `saveActiveSpells`; bar authority is `setSpellBarOrder`.

## Cohort questions

| Player | What happens today |
| :--- | :--- |
| Created yesterday | 12-field Character, leftover XP, per-principal Doka, empty `spellLevelKeys` at create. Library still = frontend `starterSpells` ∪ every `usableByPlayer` catalog row. Buff potions still `${principal}_inventory`. GameKey ids increment without wrap. |
| Created six months ago | Same maps if the canister stayed on this actor. Optional Character fields default null. `spellLevelKeys` may hold purged ids (`fireball`, …); UI also hides **names** in `OLD_SPELL_NAMES_SET` (live starter `spell-inferno` is named **Inferno**). HP/AP/MP writes grandfather stored values above the live formula. 15-field `backend_extended` via `dfx.json` still must not be deployed (SDEG-011). |
| Created before a feature | Missing dungeon/rush/achievement/GameKey rows → 0 / [] / null / empty maps. Challenges are session-only. **Unsafe** if a required field is added without a later chain file. KYC `purchaseRecords` pending rows still never auto-complete. |
| Created before a spell/enemy rename | No alias table. Boot `OLD_SPELL_IDS` still deletes catalog rows every upgrade, including `physical_attack`. Enemy/boss ids are config-only. Unknown `pieceType` paints `king.front`. |
| Owns now-retired content | Arrays keep the id. Retired catalog stays in the library only if already in keys/bar/starters. `upgradeSpell` still appends any **usable** catalog id on first paid upgrade; retired + never owned → `#err Spell is retired`. `setSpellBarOrder` drops ids not in `spellLevelKeys`. Claim still pays **current** `dokaReward`. Deleting a sprite config does not delete the Character. |

## Surface matrix

| Surface | Persist | Defaults / migration | ID stability | Stale overwrite | Unbounded level | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CharacterStats (12) | Required on Character | No 15→12 migration on a still-15 live actor | n/a | `updateCharacter` keeps stored stats | HP/AP/MP grandfather stored | Live contract OK; dfx path not (SDEG-011) |
| Level / leftover XP | Character.level / experience | `applyRewards` Nat loop | n/a | Client level ignored; XP `min(incoming, stored)` | Motoko Nat OK; HUD saturates at L48 | Generation still missing (SDEG-006) |
| Doka | `dokaBalances[Principal]` | Missing → 0 | n/a | Absolute snapshot; persist lock; mint clamp | Nat OK; **per-call 100_000 clamp** | High-level rolls truncated (09-01-004) |
| Owned spells | Implicit catalog ∪ starters | Empty keys ≠ “owns starters” on canister | Purge + **name** filter | Appearance keep-store (no mint) | n/a | Not future-safe (SDEG-004, 09-21-002) |
| Spell levels | Parallel arrays; `upgradeSpell` only | `saveBattleStats` ignores arrays | Same as owned ids | Keep-store on appearance | Cost `base*2^level` is Nat | Paid path OK; discovery grant hole remains |
| Discovery | **None** | Everyone sees current usable catalog | Names used in OLD set | `upgradeSpell` grants any usable id | `void_collapse` minLevel 30 is content | Do not add `ownedSpellIds` until a later file |
| Achievements | `principal#id` progress | Missing → locked; server checks level/doka/spell feats | Delete-with-progress retires | Claim one-shot; reward is **current** config | `level_10` is a feat | SDEG-008 |
| Challenges | Session + `applyRewards` | Old players have no history (OK) | Catalog ids | n/a | n/a | Do not persist onto required Character fields |
| Inventory / purchases | Canister shop leftover + unused buff map; BuffShop localStorage; GameKey | GameKey empty defaults on `20260901` | GameKey codes 120 chars | Redeem one-shot; credits **redeemer** | Serial no longer wraps | BuffShop still localStorage (SDEG-005); KYC pending orphaned |
| Dungeon | Principal map | Missing → null | n/a | `totalMapsCompleted + 1` every call; depth 16 | Float multiplier | Official frontend **never calls** the method; SDEG-007 remains |
| Boss Rush | `principal#slot` | Missing → (0,0,0); create/delete clear | Room 0–9 | Run count once per master | n/a | Rush half done |
| Config refs | Admin maps, empty-only seeds | Frozen 20260831 / 20260901 | Text ids; boot purge (bad) | n/a | Region `levelMax` is content | Do not restuff shipped NewActor |
| Visuals | `pixelPattern` JSON + `pieceType`; optional sprite URLs | Unknown pieceType → king.front | pieceType strings | Appearance replaces pattern (intended) | n/a | URLs not mandatory (**pass**) |
| `activeSpells : ?[Nat]` | Leftover Character field | Optional; create clears | Nat ≠ spell id | **This run:** `saveActiveSpells` keep-store | n/a | Do not delete the field (M0169) |

## Unbounded progression

- Backend `applyRewards` / Doka / spell cost / GameKey serial use `Nat`. No stored max player level.
- Frontend `xpForNextLevel` saturates at `MAX_SAFE_INTEGER` from level **48**; persist math uses `xpThresholdBigInt`.
- `applyRewards` still rejects `dokaDelta > 100_000` / `xpDelta > 500_000`. Official client clamps. Jackpot / stacked void XP still exceed the cap (`longHorizonSim.test.ts`).
- Victory HP floor `50 + level*10` still exceeds linear persist max from **level 10** (`150` vs `145`). Grandfather does not save the **first** write of 150 onto a 100-HP row (SDEG-2026-09-02-001).
- `maxPersistedAp` / `maxPersistedMp` hard-cap at **20** (`adminGuard.mo` **18–19**). `formulaAp(325) > 20` (`longHorizonSim.test.ts` **49**). Stored AP above 20 is grandfathered; **new** growth stops. Silent level max for AP/MP (SDEG-2026-09-21-003).
- `applyRewards` `pow2` is O(level) on every credit (`main.mo` **2135**). Fine at current levels; instruction-limit trap at extreme Nat levels (SDEG-2026-09-21-004).
- `getEnemyHPForLevel` still uses `Float` — do not change without a human.
- GameKey serial wrap **removed this run**.

## Visuals

Owner-uploaded URLs remain optional. `adminDeletePlayerSpriteConfig` (`main.mo` **854–860**) removes only the sprite row. Portrait/player draw uses `getPersistedPiecePattern` (`pieceArt.ts` **653–658**).

**Keep:** never make a URL required on Character or combatant persist.

## Spell discovery (future-proof)

Still no `ownedSpellIds` / observe / commit APIs. Do not add those required fields until a **new later** migration file after `20260901`.

`OLD_SPELL_NAMES_SET` in `WorldExploration.tsx` **2356–2393** still filters backend (and fallback starter pool) by **id and display name**. Live starter `spell-inferno` is named `Inferno` (`spellData.ts` **502–503**). A backend-only Inferno, or an admin rename to that string, disappears from `filteredBackendSpells`. Not patched here: #327 / #331 already edit `WorldExploration.tsx`.

## Migration analysis (do not attach full chain as a player rewrite)

| Module | Role | Live-upgrade safe? |
| :--- | :--- | :--- |
| `20260801_000000.mo` | Empty-canister genesis `OldActor = {}` | Fresh import only as the first name |
| `20260803_185500.mo` | Name-only no-op (Caffeine #347/#348 tail) | Yes — keep the filename |
| `20260827_000000.mo` | Drop transients; pass-through player maps | Pass-through of then-current shape |
| `20260831_000000.mo` | Frozen deployed tail: summon SpellConfig + rollback + audit; **no GameKey** | **Yes** as the 2026-08-31 Caffeine signature |
| `20260901_000000.mo` | GameKey empty maps; `OldActor = {}` | **Yes** for GameKey only. Player maps stay orthogonal. Idempotent. Replay must not wipe player maps. |

Live `main.mo` is still `actor {` (no annotation). mops still injects the chain. Empty-canister and `.old` check-stable are covered by `scripts/caffeine-import-gate.sh backend`.

## What this run will not approve

- New required Character / stats / config fields
- Attaching `(with migration)` on live `main.mo` as a player-data rewrite
- Editing shipped `20260831` / `20260901` NewActor
- Hard spell-id remap without an alias table and a one-shot generation
- Persisting challenges onto required Character fields
- Deleting leftover `activeSpells : ?[Nat]` (would need a later consumer file)
- Changing `MAX_PERSISTED_AP` / victory HP floor / `applyRewards` ceilings without a human
- Editing `WorldExploration.tsx` while #327/#331 are queued

## Open vehicles (do not clone / do not overwrite)

| Draft PR | Overlap | Guardian stance |
| :--- | :--- | :--- |
| #327 | `WorldExploration.tsx`, combat helpers | Independent. Inferno name-filter stays OPEN (09-21-002). |
| #331 | WX, mapGen, persist helpers | Independent. |
| #333 | TBC docs, README | Docs-only; no persist schema. |
| #334 | `AdminDashboard.tsx`, AFDA ledger | Independent. |
