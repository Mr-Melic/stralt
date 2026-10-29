# Player data evolution audit — 2026-10-29

**Guardian:** Save / Data Evolution Guardian
**Trigger:** cron `0 */48 * * *`
**HEAD:** `0f5363f` (unchanged since 2026-09-21 / 2026-10-28)
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math

This run does **not** approve any new required persist field, does **not** attach
`(with migration)` to live `main.mo`, and does **not** edit `WorldExploration.tsx`,
`main.mo`, `BuffShop.tsx`, `versionGate.ts`, `deathPenalty.ts`, `App.tsx`,
`AchievementsPanel.tsx`, `combatMath.ts`, `DraggablePanel.tsx`,
`ChallengePanel.tsx`, `SpellbookModal.tsx`, `spellUpgrade.ts`,
`victoryAchievements.ts`, `CharacterCreation.tsx`, `spellData.ts`, or
`dokaPersist.ts`.

Do not clone #362 #385 #386 #388 #400 #408 #437 #466 #490 #508 #577 #622 #667
#731 #778 #803 #828 #893 #1014 #1083 #1126 #1171 #1253 helpers.

## Scope

Character stats, levels/XP, Doka, owned spells, spell levels, discovery,
achievements, challenges, inventory/purchases, dungeon, Boss Rush, config refs,
entity IDs, unbounded progression, owner-uploaded visuals, spell-discovery
future-proofing.

## Explicitly not re-reported

Everything in `ACTION_IDS_SDEG_2026-10-28.md` / `2026-10-27.md` / `2026-10-26.md`
/ `2026-10-25.md` / `2026-10-24.md` and the operator known-list, including:
OLD_SPELL_IDS purge; catalog ∪ starters **rule**; minLevel; empty-keys fallback;
upgradeSpell length; isBuiltInSpellId; dual loadout; empty keys drop Text bar;
pixelPattern unused / sprite URLs optional; BuffShop local vs canister; dungeon
official unused; claim current dokaReward; Feats hide inactive; achievementProgress
survives delete; boss_defeated_* not allowlisted; pickEnemyLevel 999; region
levelMax; GameKey wrap; 12-field stats; never-raise atk/res/init; no writeGeneration;
unpaid-death version wipe; profile full-replace; blood=50; MAX_PERSISTED 20;
killCount 0; Number() leftover XP; principal Doka death tax; mapsVisited/ground-doka
**keying** / count-before-settle / loot_10 idle gate; HUD display-name poison /
post-wipe one-panel replace; shrine/covenant inherit / 100 write cap; shop package
hard-delete; saveUserUiLayout empty-name stub; explore_25_maps portal counter;
boss/rush/zone-lock version-wipe; spell-upgrade JS Infinity; spell_master_8
empty-bar; empty-only catalog seed; challenge ids frontend-only.

Vehicle **#1253** owns 10-28 helpers. **#1171** owns 10-27. **#1126** owns 10-26.
**#1083** owns 10-25. **#1014** owns 10-24. **#508** owns unpaid-death version-gate
keep. **#429** owns DraggablePanel getUserUiLayout share. **#490** owns BuffShop
principal keying.

## Cohort questions (NEW only)

| Player | What happens today |
| :--- | :--- |
| Created yesterday | 32 `starterSpells` ids are granted from the frontend array, not `spellLevelKeys`. A 33rd row tomorrow grants them too (001). Appearance **Update Champion** can change `Character.name` with no 100 Doka debit and no duplicate check (002). Ground coins collected yesterday have `Date.now()` ids that will never be seen again (003). |
| Created six months ago | Same 32 innates as a new forge — adding/removing a `starterSpells` row rewrites the library with no migration (001). A second slot named "Hero" via create/update is legal; paid `renameCharacter("Hero")` then `#err`s because HEAD collides against every slot including self (002). Six months of ground-Doka pickups are a counter only; ids cannot be reconstructed (003). |
| Created before a feature | Optional Character fields stay null. Empty `spellLevelKeys` still sees every live innate (001). Missing profile name does not block Character.name / leaderboard (002). Pre-pickup players have no claimed-id set to migrate (003). |
| Created before a spell/enemy rename | No alias table (known). Renaming `starter-heal` cannot preserve ownership because it was never stored (001). Character rename is not an identity migration for `UserProfile.name` / HUD keys (002). Pickup ids were never stable enough to alias (003). |
| Owns now-retired content | Retired Motoko catalog rows stay in keys (known). Removing a `starterSpells` row revokes it from every cohort (001). Owner-uploaded sprite URLs remain optional / not rendered. Deleting a sprite config, palette, or login ad box does not delete the Character. |

## Surface matrix (delta)

| Surface | Persist | NEW this run |
| :--- | :--- | :--- |
| CharacterStats (12) | Required | No schema change. Not approved. |
| Level / leftover XP | Nat leftover | No `MAX_LEVEL`. Number() credit path known. |
| Doka | Principal wallet | Unchanged occupancy. |
| Owned spells / levels / discovery | Catalog ∪ frontend innates | **32 `starterSpells` ids are not in Motoko `defaultSpells()`; overlap is empty; upgradeSpell cannot persist those levels (001).** |
| Achievements | `principal#id` | Unchanged occupancy. |
| Challenges | Session + anonymous applyRewards | Ids still frontend-only (10-28-002). |
| Inventory / purchases | GameKey live; KYC leftover | Unchanged occupancy. |
| Dungeon / Boss Rush | Session refs / slot map | Unchanged occupancy. |
| Config refs / IDs | Admin maps + localStorage | Ground Doka / shrine / dungeon-complete live ids are timestamps or constants (003). |
| Visuals | `colors` hex + `pieceType`; optional URLs | Still not mandatory gameplay deps. Ads are login-page URLs only. |
| Identity | Character.name vs UserProfile.name | **Appearance updateCharacter is a free rename; create/update skip uniqueness (002).** |

## Unbounded progression

- **No `MAX_LEVEL`.** `applyRewards` uses Motoko `Nat`.
- Silent caps unchanged: AP/MP 20, applyRewards 100_000 / 500_000, enemy pick 999, summon level 99, HUD `Number.MAX_SAFE_INTEGER` from L48, spell-upgrade advertised JS Infinity (10-26-003), session shrine/blood 100 (10-28-003).
- Do not persist compounding `getPlayerBaseStats` HP.
- Do not add Character.ownedSpellIds / pickup-id set / displayName fields until a later chain file after `20260901`.

## Visuals

Owner-uploaded `spriteUrl` / facing URLs remain catalog storage, not combat art.
Login `adBoxes` are https image URLs on the landing page only — clearing a slot
cannot unload a Character. Palette / pieceType rules unchanged (10-24-019 /
10-21-003). Do not make a URL required on Character without a later migration
after `20260901` and a missing-asset fallback.

## Spell discovery (future-proof)

Owned ids today are frontend `starterSpells` ∪ Motoko usable catalog ∪
`spellLevelKeys`. The innate **list** is a deploy-time grant, not a stored
set (001). Paid upgrade levels stay on parallel arrays (`upgradeSpell` sole
writer) and cannot land for frontend-only ids. Do not add required
ownership/discovery fields until SDEG-001/002 (new later file after
`20260901`, never edit shipped NewActor).

## Migration analysis

| Change | Approve? |
| :--- | :--- |
| New required Character / stats / config field | **No** — needs later chain file after `20260901` with empty defaults, idempotent, not a destructive replay. |
| Attaching `(with migration)` as a player rewrite | **No** |
| Editing shipped `20260831` / `20260901` NewActor | **No** |
| Required `ownedSpellIds` / pickup-id set / displayName | **No** — 001–003 are helper-only |
| Helper-only frontend locks (this PR) | **Yes** — no persist-schema / EOP chain change |

Repeated deployment of this PR cannot reapply a destructive migration (none
shipped). Catalog-id / name-policy / pickup-id helpers are idempotent.

## Helper-only without forbidden files?

| ID | Helper+tests only? | This PR |
| :--- | :--- | :--- |
| 001 | Policy yes; lock needs WX + later Character field | **helper only** |
| 002 | Policy yes; wiring needs main.mo + CharacterCreation | **helper only** |
| 003 | Policy yes; wiring needs WX | **helper only** |

## What this run will not approve

- New required persist fields or EOP chain edits
- Cloning open helper PRs listed above
- Editing WX / main.mo / BuffShop / versionGate / deathPenalty / App /
  AchievementsPanel / combatMath / DraggablePanel / ChallengePanel /
  SpellbookModal / spellUpgrade.ts / victoryAchievements.ts /
  CharacterCreation.tsx / spellData.ts while older persist/HUD PRs queue
