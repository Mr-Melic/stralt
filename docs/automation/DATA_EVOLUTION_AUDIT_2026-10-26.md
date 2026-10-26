# Player data evolution audit — 2026-10-26

**Guardian:** Save / Data Evolution Guardian  
**Trigger:** cron `0 */48 * * *`  
**HEAD:** `0f5363f` (unchanged since 2026-09-21 / 2026-10-25)  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

This run does **not** approve any new required persist field, does **not** attach
`(with migration)` to live `main.mo`, and does **not** edit `WorldExploration.tsx`,
`main.mo`, `BuffShop.tsx`, `versionGate.ts`, `deathPenalty.ts`, `App.tsx`,
`AchievementsPanel.tsx`, `combatMath.ts`, `DraggablePanel.tsx`,
`ChallengePanel.tsx`, `SpellbookModal.tsx`, or `spellUpgrade.ts`.

Do not clone #362 #385 #386 #388 #400 #408 #437 #466 #490 #508 #577 #622 #667
#731 #778 #803 #828 #893 #1014 #1083 helpers.

## Scope

Character stats, levels/XP, Doka, owned spells, spell levels, discovery,
achievements, challenges, inventory/purchases, dungeon, Boss Rush, config refs,
entity IDs, unbounded progression, owner-uploaded visuals, spell-discovery
future-proofing.

## Explicitly not re-reported

Everything in `ACTION_IDS_SDEG_2026-10-25.md` / `ACTION_IDS_SDEG_2026-10-24.md`
and the operator known-list, including: OLD_SPELL_IDS purge; catalog ∪ starters
ownership; minLevel; empty-keys spell-level fallback; upgradeSpell length;
isBuiltInSpellId; dual loadout Text vs Nat; empty keys drop Text bar;
pixelPattern unused / sprite URLs optional / not rendered; sprite delete does
not delete Character; BuffShop local vs canister (`greater_potion` vs
`greater_health_potion`); unbounded purchaseBuff; dungeon official unused;
claim current dokaReward; Feats hide inactive; achievementProgress survives
delete; boss_defeated_* not allowlisted; pickEnemyLevel 999; region levelMax;
tierSpawn bigint throw; changelog unused / APP_VERSION live; GameKey wrap;
12-field stats; never-raise atk/res/init; no writeGeneration; unpaid-death
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
hard-delete; saveUserUiLayout empty-name stub.

Vehicle **#490** still owns BuffShop + feat-counter **keying** by II principal.
**#1014** owns helpers 10-24-008…019. **#1083** owns 10-25-001…006.
**#508** owns unpaid-death version-gate keep. This run does not restack those files.

## Cohort questions (NEW only)

| Player | What happens today |
| :--- | :--- |
| Created yesterday | Explorer feat counts every portal hop, including Death Realm / Rest / revisits (001). Owner-edited `pbv_boss_configs` die on the next `APP_VERSION` bump (002). Spell upgrades still use JS `2 ** level` for the advertised debit (003). |
| Created six months ago | Same client gates. Visit counter cannot be turned into unique map ids (001). High leftover XP Number() cuts remain (known). Spell level 53+ advertised cost can zero the persist lock then `saveBattleStats` (003). |
| Created before a feature | Optional Character fields stay null. No ownedSpellIds. No unique-map set. `saveUserUiLayout` on a missing profile still creates `{name=""; uiLayout}` (known 10-25-006). |
| Created before a spell/enemy rename | No alias table (known). Map visits have no ids to remap (001). Shop package / region / enemy hard-delete known. |
| Owns now-retired content | Spell retire-if-referenced (known). Boss localStorage reset on version bump is not a Character corruption (002). Owner-uploaded sprite URLs remain optional / not rendered. |

## Surface matrix (delta)

| Surface | Persist | NEW this run |
| :--- | :--- | :--- |
| CharacterStats (12) | Required | No schema change. Not approved. |
| Level / leftover XP | Nat leftover | No `MAX_LEVEL`. Number() credit path known. |
| Doka | Principal wallet | Spell-upgrade Infinity advertised cost can write 0 (003). |
| Owned spells / levels / discovery | Catalog ∪ keys | Advertised upgrade cost is JS Number; Motoko Nat unbounded (003). No `ownedSpellIds`. |
| Achievements | `principal#id` | `explore_25_maps` is a portal counter, not unique map ids (001). |
| Challenges | Session | Badges still session-only (known). |
| Inventory / purchases | GameKey live; KYC leftover | Unchanged this run. |
| Dungeon / Boss Rush | Session refs / slot map | Unchanged occupancy. Live rush **config** blob wiped on version bump (002). |
| Config refs / IDs | Admin maps + localStorage | `pbv_boss_configs` / rush blobs dropped by version-gate (002). Maps have no persist id (001). |
| Visuals | `colors` hex + `pieceType`; optional URLs | Still not mandatory gameplay deps. Palette 10-24-019. |
| HUD / profile | known 10-25-003/006 | Unchanged this run. |

## Unbounded progression

- **No `MAX_LEVEL`.** `applyRewards` uses Motoko `Nat`. Admin UI: no player level cap.
- Silent caps unchanged: AP/MP 20, applyRewards 100_000 / 500_000, enemy pick 999, summon level 99, HUD `Number.MAX_SAFE_INTEGER` from L48, `shrineCount > 100` if `updateSessionState` is ever wired.
- **NEW:** Spell-upgrade advertised cost is `10 * 2 ** level` in JS. Motoko cost is Nat. Around spell level 53 the advertised Number is not a safe integer; `Infinity` debit zeros the persist lock (003).
- Do not persist compounding `getPlayerBaseStats` HP.

## Visuals

Owner-uploaded `spriteUrl` / facing URLs remain catalog storage, not combat art
(`adminVisualStatus.ts`). Deleting a sprite config or palette cannot unload a
Character. Do not make a URL or palette id required on Character without a later
migration after `20260901` and a missing-asset fallback. Version-wipe of
`pbv_color_palette` is not a Character corruption (10-24-019).

## Spell discovery (future-proof)

Still no `ownedSpellIds` / observe / commit APIs. Owned ids today are catalog ∪
starters ∪ `spellLevelKeys`. Retired catalog rows leave ghost keys (known).
Paid upgrade levels stay on parallel arrays (`upgradeSpell` sole writer).
Do not add required ownership/discovery fields until SDEG-001/002 (new later
file after `20260901`, never edit shipped NewActor).

## Migration analysis

| Change | Approve? |
| :--- | :--- |
| New required Character / stats / config field | **No** — needs later chain file after `20260901` with empty defaults, idempotent, not a destructive replay. |
| Attaching `(with migration)` as a player rewrite | **No** |
| Editing shipped `20260831` / `20260901` NewActor | **No** |
| Unique map-id set on Character | **No** — 001 is helper-only; old counters cannot recover ids |
| Canister boss configs as required live SoT | **No** until schema union + later chain file; 002 is keep-list only |
| Helper-only frontend locks (this PR) | **Yes** — no persist-schema / EOP chain change |

Repeated deployment of this PR cannot reapply a destructive migration (none
shipped). Client keep-list / freeze helpers are idempotent.

## Helper-only without forbidden files?

| ID | Helper+tests only? | This PR |
| :--- | :--- | :--- |
| 001 | Policy yes; lock needs WX | helpers only |
| 002 | Helper yes; wiring needs versionGate.ts | **helper only** — versionGate overlaps #508 |
| 003 | Helper yes; wiring needs Spellbook / spellUpgrade.ts | helpers only |

## What this run will not approve

- New required persist fields or EOP chain edits
- Cloning open helper PRs listed above
- Editing WX / main.mo / BuffShop / versionGate / deathPenalty / App /
  AchievementsPanel / combatMath / DraggablePanel / ChallengePanel /
  SpellbookModal / spellUpgrade.ts while older persist PRs queue
