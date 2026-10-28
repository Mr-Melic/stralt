# Player data evolution audit — 2026-10-28

**Guardian:** Save / Data Evolution Guardian  
**Trigger:** cron `0 */48 * * *`  
**HEAD:** `0f5363f` (unchanged since 2026-09-21 / 2026-10-27)  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

This run does **not** approve any new required persist field, does **not** attach
`(with migration)` to live `main.mo`, and does **not** edit `WorldExploration.tsx`,
`main.mo`, `BuffShop.tsx`, `versionGate.ts`, `deathPenalty.ts`, `App.tsx`,
`AchievementsPanel.tsx`, `combatMath.ts`, `DraggablePanel.tsx`,
`ChallengePanel.tsx`, `SpellbookModal.tsx`, `spellUpgrade.ts`, or
`victoryAchievements.ts`.

Do not clone #362 #385 #386 #388 #400 #408 #437 #466 #490 #508 #577 #622 #667
#731 #778 #803 #828 #893 #1014 #1083 #1126 #1171 helpers.

## Scope

Character stats, levels/XP, Doka, owned spells, spell levels, discovery,
achievements, challenges, inventory/purchases, dungeon, Boss Rush, config refs,
entity IDs, unbounded progression, owner-uploaded visuals, spell-discovery
future-proofing.

## Explicitly not re-reported

Everything in `ACTION_IDS_SDEG_2026-10-27.md` / `2026-10-26.md` / `2026-10-25.md`
/ `2026-10-24.md` and the operator known-list, including: OLD_SPELL_IDS purge;
catalog ∪ starters ownership; minLevel; empty-keys spell-level fallback;
upgradeSpell length; isBuiltInSpellId; dual loadout Text vs Nat; empty keys drop
Text bar; pixelPattern unused / sprite URLs optional / not rendered; sprite
delete does not delete Character; BuffShop local vs canister (`greater_potion`
vs `greater_health_potion`); unbounded purchaseBuff; dungeon official unused;
claim current dokaReward; Feats hide inactive; achievementProgress survives
character delete; boss_defeated_* not allowlisted; pickEnemyLevel 999; region
levelMax; tierSpawn bigint throw; changelog unused / APP_VERSION live; GameKey
wrap; 12-field stats; never-raise atk/res/init; no writeGeneration; unpaid-death
version wipe; deepNormalizeBigInts leftover XP; profile full-replace; blood=50
getSessionState default; MAX_PERSISTED 20; killCount 0 official;
readApplyRewardsOk Number(); principal Doka death tax; mapsVisited/ground-doka
**keying** wipe/inherit; applyRewards vitals lag; starter 10/5 vs PLAYER_BASE
8/4; Character.dokaBalance; silent profile reject; pbv_boss_configs **schema
skew**; SummonUnitDef drop kit; Boss Rush reset vs remove; +1 walk master;
challenge **badges** session; display-name spell keys; enemy hard-delete; ghost
spellLevelKeys; purchaseBuff empty slot; WX boss-rush double-encode; legacy
active-spells overwrite; region/modifier hard-delete; palette not required; WX
never getLevelUpConfig; apMp dual formula; compounding HP; feat/covenant/shrine
version-gate keep-list; leaderboard claimed; pieceType vs pixelPattern;
ground-Doka feat count-before-settle; loot_10 mapsVisited-only idle gate; HUD
**display-name poison**; shrine/covenant write-only inherit; shop package
hard-delete; saveUserUiLayout empty-name stub; explore_25_maps portal counter;
APP_VERSION wipe of boss/rush blobs; spell-upgrade JS Infinity debit;
spell_master_8 empty-bar length / catalog pad; empty-only catalog seed; zone
lock browser-global wipe.

Vehicle **#490** still owns BuffShop + feat-counter **keying** by II principal.
**#1014** owns helpers 10-24-008…019. **#1083** owns 10-25-001…006. **#1126**
owns 10-26-001…003. **#1171** owns 10-27-001…003. **#508** owns unpaid-death
version-gate keep. **#429** owns DraggablePanel getUserUiLayout share. This run
does not restack those files.

## Cohort questions (NEW only)

| Player | What happens today |
| :--- | :--- |
| Created yesterday | HUD lives in canister `uiLayout` **and** `pbv_panel_layout_*`. An APP_VERSION bump clears the cache; the first fold/drag full-replaces the blob with a one-panel object (001). Challenge ids `easy_1`…`legendary_3` are frontend-only; yesterday’s completions are gone after refresh (002). Local shrine visits are unbounded; the unused session writer would `#err` at 101 (003). |
| Created six months ago | Same HUD race — a long-tuned layout is the blob most at risk of a one-panel clobber (001). Six months of challenge wins have no id history to migrate (002). A shrine farmer past 100 visits cannot be moved onto `updateSessionState` without freezing session writes (003). |
| Created before a feature | Optional Character fields stay null. HUD blob may be `""`; 001 must not invent a default layout and save it over a later device’s blob. Challenge feature-absent is OK (no stored ids). `shrineCount` null; getSessionState still reports 0 shrine / **50** blood (known 10-22-009) while 003 is the write-path cap. |
| Created before a spell/enemy rename | No alias table (known). Challenge rename cannot preserve ownership because none is stored (002). HUD panel ids in the blob have no schemaVersion; an old client that saves after wipe drops unknown panel keys (001). |
| Owns now-retired content | Retired spells stay in keys (known). Retired challenge ids cannot corrupt Character (002). Owner-uploaded sprite URLs remain optional / not rendered. Deleting a sprite config or palette still does not delete the Character. |

## Surface matrix (delta)

| Surface | Persist | NEW this run |
| :--- | :--- | :--- |
| CharacterStats (12) | Required | No schema change. Not approved. |
| Level / leftover XP | Nat leftover | No `MAX_LEVEL`. Number() credit path known. |
| Doka | Principal wallet | Unchanged occupancy. |
| Owned spells / levels / discovery | Catalog ∪ keys | No `ownedSpellIds`. Spell Master occupancy still 10-27-001. |
| Achievements | `principal#id` | Unchanged occupancy. |
| Challenges | Session + anonymous applyRewards | **Ids are frontend-only; no history / alias (002).** Badges still session (known). |
| Inventory / purchases | GameKey live; KYC leftover | Unchanged occupancy. |
| Dungeon / Boss Rush | Session refs / slot map | Unchanged occupancy. |
| Config refs / IDs | Admin maps + localStorage | HUD cache not in version-gate keep-list; saveUserUiLayout is a full replace (001). |
| Visuals | `colors` hex + `pieceType`; optional URLs | Still not mandatory gameplay deps. Palette 10-24-019. Sprite delete ≠ Character delete. |
| HUD / profile | canister `uiLayout` + name-keyed cache | **Post-wipe one-panel fold can clobber the blob (001).** Display-name poison remains 10-25-003. |
| Session | optional Character fields; unused API | **shrineCount write cap 100 is a silent max (003).** blood=50 query default known. |

## Unbounded progression

- **No `MAX_LEVEL`.** `applyRewards` uses Motoko `Nat`. Admin UI: no player level cap.
- Silent caps unchanged: AP/MP 20, applyRewards 100_000 / 500_000, enemy pick 999, summon level 99, HUD `Number.MAX_SAFE_INTEGER` from L48, spell-upgrade advertised JS Infinity (10-26-003).
- **NEW:** `updateSessionState` `shrineCount > 100` / `bloodBalance > 100` (003). Local shrine counter has no cap. Do not persist compounding `getPlayerBaseStats` HP.
- Do not add a Character challenge-id array or HUD schemaVersion field to fix 001/002 until a later chain file after `20260901`.

## Visuals

Owner-uploaded `spriteUrl` / facing URLs remain catalog storage, not combat art
(`adminVisualStatus.ts`). Deleting a sprite config or palette cannot unload a
Character. Do not make a URL or palette id required on Character without a later
migration after `20260901` and a missing-asset fallback. HUD layout (001) is not
a visual asset. Challenge badges (known) are copy-only.

## Spell discovery (future-proof)

Still no `ownedSpellIds` / observe / commit APIs. Owned ids today are catalog ∪
starters ∪ `spellLevelKeys`. Retired catalog rows leave ghost keys (known).
Paid upgrade levels stay on parallel arrays (`upgradeSpell` sole writer).
Challenge ids (002) are the same class of content id: do not treat live catalog
membership as stored ownership. Do not add required ownership/discovery/challenge
fields until SDEG-001/002 (new later file after `20260901`, never edit shipped
NewActor).

## Migration analysis

| Change | Approve? |
| :--- | :--- |
| New required Character / stats / config field | **No** — needs later chain file after `20260901` with empty defaults, idempotent, not a destructive replay. |
| Attaching `(with migration)` as a player rewrite | **No** |
| Editing shipped `20260831` / `20260901` NewActor | **No** |
| Required `ownedSpellIds` / challengeIds / HUD schema field | **No** — 001–002 are helper-only |
| Canister shrineCount as feat SoT | **No** — 003 documents the 100 cap; wiring needs grandfather + later file if required |
| Helper-only frontend locks (this PR) | **Yes** — no persist-schema / EOP chain change |

Repeated deployment of this PR cannot reapply a destructive migration (none
shipped). Client keep-list / merge / catalog-id helpers are idempotent.

## Helper-only without forbidden files?

| ID | Helper+tests only? | This PR |
| :--- | :--- | :--- |
| 001 | Policy yes; lock needs DraggablePanel + versionGate | **helper only** — #429 / #508 |
| 002 | Helper yes; wiring would need WX + later Character field | **helper only** |
| 003 | Helper yes; wiring needs main.mo | **helper only** — persist vehicles own main.mo |

## What this run will not approve

- New required persist fields or EOP chain edits
- Cloning open helper PRs listed above
- Editing WX / main.mo / BuffShop / versionGate / deathPenalty / App /
  AchievementsPanel / combatMath / DraggablePanel / ChallengePanel /
  SpellbookModal / spellUpgrade.ts / victoryAchievements.ts while older
  persist/HUD PRs queue
