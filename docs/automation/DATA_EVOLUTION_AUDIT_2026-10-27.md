# Player data evolution audit — 2026-10-27

**Guardian:** Save / Data Evolution Guardian  
**Trigger:** cron `0 */48 * * *`  
**HEAD:** `0f5363f` (unchanged since 2026-09-21 / 2026-10-26)  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

This run does **not** approve any new required persist field, does **not** attach
`(with migration)` to live `main.mo`, and does **not** edit `WorldExploration.tsx`,
`main.mo`, `BuffShop.tsx`, `versionGate.ts`, `deathPenalty.ts`, `App.tsx`,
`AchievementsPanel.tsx`, `combatMath.ts`, `DraggablePanel.tsx`,
`ChallengePanel.tsx`, `SpellbookModal.tsx`, `spellUpgrade.ts`, or
`victoryAchievements.ts`.

Do not clone #362 #385 #386 #388 #400 #408 #437 #466 #490 #508 #577 #622 #667
#731 #778 #803 #828 #893 #1014 #1083 #1126 helpers.

## Scope

Character stats, levels/XP, Doka, owned spells, spell levels, discovery,
achievements, challenges, inventory/purchases, dungeon, Boss Rush, config refs,
entity IDs, unbounded progression, owner-uploaded visuals, spell-discovery
future-proofing.

## Explicitly not re-reported

Everything in `ACTION_IDS_SDEG_2026-10-26.md` / `2026-10-25.md` / `2026-10-24.md`
and the operator known-list, including: OLD_SPELL_IDS purge; catalog ∪ starters
ownership; minLevel; empty-keys spell-level fallback; upgradeSpell length;
isBuiltInSpellId; dual loadout Text vs Nat; empty keys drop Text bar;
pixelPattern unused / sprite URLs optional / not rendered; sprite delete does
not delete Character; BuffShop local vs canister (`greater_potion` vs
`greater_health_potion`); unbounded purchaseBuff; dungeon official unused;
claim current dokaReward; Feats hide inactive; achievementProgress survives
character delete; boss_defeated_* not allowlisted; pickEnemyLevel 999; region
levelMax; tierSpawn bigint throw; changelog unused / APP_VERSION live; GameKey
wrap; 12-field stats; never-raise atk/res/init; no writeGeneration; unpaid-death
version wipe; deepNormalizeBigInts leftover XP; profile full-replace; blood=50;
MAX_PERSISTED 20; killCount 0 official; readApplyRewardsOk Number();
principal Doka death tax; mapsVisited/ground-doka **keying** wipe/inherit;
applyRewards vitals lag; starter 10/5 vs PLAYER_BASE 8/4; Character.dokaBalance;
silent profile reject; pbv_boss_configs **schema skew**; SummonUnitDef drop kit;
Boss Rush reset vs remove; +1 walk master; challenge badges session;
display-name spell keys; enemy hard-delete; ghost spellLevelKeys;
purchaseBuff empty slot; WX boss-rush double-encode; legacy active-spells
overwrite; region/modifier hard-delete; palette not required; WX never
getLevelUpConfig; apMp dual formula; compounding HP; feat/covenant/shrine
version-gate keep-list; leaderboard claimed; pieceType vs pixelPattern;
ground-Doka feat count-before-settle; loot_10 mapsVisited-only idle gate;
HUD display-name poison; shrine/covenant write-only inherit; shop package
hard-delete; saveUserUiLayout empty-name stub; explore_25_maps portal
counter; APP_VERSION wipe of boss/rush blobs; spell-upgrade JS Infinity debit.

Vehicle **#490** still owns BuffShop + feat-counter **keying** by II principal.
**#1014** owns helpers 10-24-008…019. **#1083** owns 10-25-001…006.
**#1126** owns 10-26-001…003. **#508** owns unpaid-death version-gate keep.
This run does not restack those files.

## Cohort questions (NEW only)

| Player | What happens today |
| :--- | :--- |
| Created yesterday | Empty spell bar hydrates as `Array(8).fill(null)` (length 8) and/or first-8 catalog/starters; idle `activeSpells.length >= 8` unlocks Spell Master (100 Doka) without arranging 8 spells (001). Live catalogs already seeded, so a new default feat/spell/SKU in source never appears until admin writes it (002). Zone lock is a browser-global flag; an APP_VERSION bump turns it off (003). |
| Created six months ago | Same client gates. A 3-spell arranged bar is padded with live library ids up to 8 on hydrate, then victory `spellBarCount` also fires Spell Master (001). Seeded canister skipped `defaultAchievements` / `defaultSpells` / shop / bosses / modifiers on every later upgrade (002). Zone lock from last session is gone after any version wipe, and is shared with whoever used this browser (003). |
| Created before a feature | Optional Character fields stay null. Empty `spellBarOrder` is the pre-bar cohort — path (b) derives first 8 `ownedSpells` then `setSpellBarOrder` filters to empty `spellLevelKeys` (known 10-23-004) while the UI length still unlocks 001. New default catalog ids added after first seed never exist for this canister (002). |
| Created before a spell/enemy rename | No alias table (known). Hydrate padding uses **current** library ids, so a rename plus catalog growth both change which fillers occupy empty bar slots (001). Empty-only seed will not remap old ids (002). |
| Owns now-retired content | Retired spells stay in the library only if already owned (known). Empty slots are still filled from remaining usable catalog, which can push occupancy to 8 and mint Spell Master (001). Owner-uploaded sprite URLs remain optional / not rendered. Deleting a sprite config still does not delete the Character. |

## Surface matrix (delta)

| Surface | Persist | NEW this run |
| :--- | :--- | :--- |
| CharacterStats (12) | Required | No schema change. Not approved. |
| Level / leftover XP | Nat leftover | No `MAX_LEVEL`. Number() credit path known. |
| Doka | Principal wallet | Spell Master claim can mint 100 Doka from hydrate occupancy (001). |
| Owned spells / levels / discovery | Catalog ∪ keys | Empty/short bar occupancy is invented from the live library (001). No `ownedSpellIds`. |
| Achievements | `principal#id` | `spell_master_8` uses UI length including nulls/padding (001). New default feat ids never backfill a seeded canister (002). |
| Challenges | Session | Badges still session-only (known). Catalog ids `easy_1`…`legendary_3` are frontend-only. |
| Inventory / purchases | GameKey live; KYC leftover | Shop package **defaults** also empty-only (002). Hard-delete known. |
| Dungeon / Boss Rush | Session refs / slot map | Unchanged occupancy. |
| Config refs / IDs | Admin maps + localStorage | Empty-only seed on spells/modifiers/shop/feats/bosses/changelogs (002). Zone lock key not in version-gate keep-list (003). |
| Visuals | `colors` hex + `pieceType`; optional URLs | Still not mandatory gameplay deps. Palette 10-24-019. Sprite delete ≠ Character delete. |
| HUD / profile | known 10-25-003/006 | Zone lock is a separate browser-global flag (003). |

## Unbounded progression

- **No `MAX_LEVEL`.** `applyRewards` uses Motoko `Nat`. Admin UI: no player level cap.
- Silent caps unchanged: AP/MP 20, applyRewards 100_000 / 500_000, enemy pick 999, summon level 99, HUD `Number.MAX_SAFE_INTEGER` from L48, `shrineCount > 100` if `updateSessionState` is ever wired, spell-upgrade advertised JS Infinity (10-26-003).
- Do not persist compounding `getPlayerBaseStats` HP.
- Do not add a Character spell-level cap or a required equipped-count field to fix 001.

## Visuals

Owner-uploaded `spriteUrl` / facing URLs remain catalog storage, not combat art
(`adminVisualStatus.ts`). Deleting a sprite config or palette cannot unload a
Character. Do not make a URL or palette id required on Character without a later
migration after `20260901` and a missing-asset fallback. Version-wipe of
`pbv_color_palette` is not a Character corruption (10-24-019). Zone lock (003)
is not a visual asset.

## Spell discovery (future-proof)

Still no `ownedSpellIds` / observe / commit APIs. Owned ids today are catalog ∪
starters ∪ `spellLevelKeys`. Retired catalog rows leave ghost keys (known).
Paid upgrade levels stay on parallel arrays (`upgradeSpell` sole writer).
Hydrate must not treat "usable catalog" as "equipped" (001) or future
discovery grants will silently fill the bar and auto-complete Spell Master.
Do not add required ownership/discovery fields until SDEG-001/002 (new later
file after `20260901`, never edit shipped NewActor).

## Migration analysis

| Change | Approve? |
| :--- | :--- |
| New required Character / stats / config field | **No** — needs later chain file after `20260901` with empty defaults, idempotent, not a destructive replay. |
| Attaching `(with migration)` as a player rewrite | **No** |
| Editing shipped `20260831` / `20260901` NewActor | **No** |
| Required `ownedSpellIds` / equipped-count field | **No** — 001 is helper-only |
| Catalog upsert of missing default ids | **No Motoko this stack** — 002 is helper-only; when wired, insert-missing only, never overwrite, never wipe maps |
| Canister zone-lock field | **No** — 003 is client keying / keep-list only |
| Helper-only frontend locks (this PR) | **Yes** — no persist-schema / EOP chain change |

Repeated deployment of this PR cannot reapply a destructive migration (none
shipped). Client occupancy / upsert / keep-list helpers are idempotent.

## Helper-only without forbidden files?

| ID | Helper+tests only? | This PR |
| :--- | :--- | :--- |
| 001 | Policy yes; lock needs WX + victoryAchievements | **helper only** |
| 002 | Helper yes; wiring needs main.mo | **helper only** — main.mo overlaps persist vehicles |
| 003 | Helper yes; wiring needs versionGate.ts + WX | **helper only** — versionGate overlaps #508 |

## What this run will not approve

- New required persist fields or EOP chain edits
- Cloning open helper PRs listed above
- Editing WX / main.mo / BuffShop / versionGate / deathPenalty / App /
  AchievementsPanel / combatMath / DraggablePanel / ChallengePanel /
  SpellbookModal / spellUpgrade.ts / victoryAchievements.ts while older
  persist PRs queue
