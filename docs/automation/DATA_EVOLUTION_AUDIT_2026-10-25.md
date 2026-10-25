# Player data evolution audit — 2026-10-25

**Guardian:** Save / Data Evolution Guardian  
**Trigger:** cron `0 */48 * * *`  
**HEAD:** `0f5363f` (unchanged since 2026-09-21 / 2026-10-24)  
**Gameplay systems not touched:** RAF body, map generation, turn logic, damage math  

This run does **not** approve any new required persist field, does **not** attach
`(with migration)` to live `main.mo`, and does **not** edit `WorldExploration.tsx`,
`main.mo`, `BuffShop.tsx`, `versionGate.ts`, `deathPenalty.ts`, `App.tsx`,
`AchievementsPanel.tsx`, or `combatMath.ts`.

Do not clone #362 #385 #386 #388 #400 #408 #437 #466 #490 #508 #577 #622 #667
#731 #778 #803 #828 #893 #1014 helpers.

## Scope

Character stats, levels/XP, Doka, owned spells, spell levels, discovery,
achievements, challenges, inventory/purchases, dungeon, Boss Rush, config refs,
entity IDs, unbounded progression, owner-uploaded visuals, spell-discovery
future-proofing.

## Explicitly not re-reported

Everything in `ACTION_IDS_SDEG_2026-10-24.md` and the operator known-list,
including: OLD_SPELL_IDS purge; catalog ∪ starters ownership; minLevel;
empty-keys spell-level fallback; upgradeSpell length; isBuiltInSpellId;
dual loadout Text vs Nat; empty keys drop Text bar; pixelPattern unused /
sprite URLs optional / not rendered; sprite delete does not delete Character;
BuffShop local vs canister; unbounded purchaseBuff; dungeon official unused;
claim current dokaReward; Feats hide inactive; achievementProgress survives
delete; boss_defeated_* not allowlisted; pickEnemyLevel 999; region levelMax;
tierSpawn bigint throw; changelog unused / APP_VERSION live; GameKey wrap;
12-field stats; never-raise atk/res/init; no writeGeneration; unpaid-death
version wipe; deepNormalizeBigInts; profile full-replace; blood=50;
MAX_PERSISTED 20; killCount 0 official; readApplyRewardsOk Number();
principal Doka death tax; mapsVisited/ground-doka wipe/inherit (keying);
applyRewards vitals lag; starter 10/5 vs PLAYER_BASE 8/4; Character.dokaBalance;
silent profile reject; pbv_boss_configs; SummonUnitDef drop kit;
Boss Rush reset vs remove; +1 walk master; challenge badges session;
display-name spell keys; enemy hard-delete; ghost spellLevelKeys;
purchaseBuff empty slot; WX boss-rush double-encode; legacy active-spells
overwrite; region/modifier hard-delete; palette not required; WX never
getLevelUpConfig; apMp dual formula; compounding HP; feat/covenant/shrine
version-gate keep-list; leaderboard claimed; pieceType vs pixelPattern.

Vehicle **#490** still owns BuffShop + feat-counter **keying** by II principal.
**#1014** owns helpers 10-24-008…019. This run does not restack those files.

## Cohort questions (NEW only)

| Player | What happens today |
| :--- | :--- |
| Created yesterday | Ground-Doka feat counter advances on claim, not on credit settle (001). Overworld `loot_10_doka` waits for a portal/win (002). HUD cache is still display-name (003 helper; wiring deferred — DraggablePanel overlaps #429+). Shrine/covenant localStorage writes are dead (004). Shop package hard-delete orphans KYC `packageId` (005). |
| Created six months ago | Same client gates. High-level Number() cuts remain (known 001-10-24). Same-name shared-browser HUD poison until 003 is wired onto a DraggablePanel vehicle. Slot delete+recreate inherits shrine/covenant keys (004) and maps/ground (known 003-10-24). |
| Created before a feature | Optional Character fields stay null. No ownedSpellIds. No shrine feat. `saveUserUiLayout` on a missing profile still creates `{name=""; uiLayout}` (006); official ProfileSetup still sends `uiLayout:""`. |
| Created before a spell/enemy rename | No alias table (known). Shop package ids have the same hole (005). Region/modifier/enemy hard-delete known. |
| Owns now-retired content | Spell retire-if-referenced (known). Shop packages hard-delete (005). Dead shrine/covenant keys must not become required Character fields. Owner-uploaded sprite URLs remain optional / not rendered. |

## Surface matrix (delta)

| Surface | Persist | NEW this run |
| :--- | :--- | :--- |
| CharacterStats (12) | Required | No schema change. Not approved. |
| Level / leftover XP | Nat leftover | No `MAX_LEVEL`. Number() credit path known. |
| Doka | Principal wallet | Ground-Doka feat counter ≠ wallet settle (001). |
| Owned spells / levels / discovery | Catalog ∪ keys | No `ownedSpellIds`. Do not add until later chain file after `20260901`. |
| Achievements | `principal#id` | `loot_10` idle gate (002); shrine counter unwired (004). Claim still current `dokaReward` (known). |
| Challenges | Session | Badges still session-only (known). Challenge HUD key now principal (003). |
| Inventory / purchases | GameKey live; KYC leftover | Shop package hard-delete vs `purchaseRecords.packageId` (005). |
| Dungeon / Boss Rush | Session refs / slot map | Unchanged this run. |
| Config refs / IDs | Admin maps | Shop packages (005). No Character package/region/modifier ids. |
| Visuals | `colors` hex + `pieceType`; optional URLs | Still not mandatory gameplay deps. Palette 10-24-019. |
| HUD / profile | `saveUserUiLayout` merge; `saveCallerUserProfile` replace | Display-name poison (003, helper only — DraggablePanel overlaps #429+). Empty-name stub (006). |
| Shrine / covenant | Optional Character session fields unused; localStorage write-only | 004 |

## Unbounded progression

- **No `MAX_LEVEL`.** `applyRewards` uses Motoko `Nat`. Admin UI: no player level cap.
- Silent caps unchanged: AP/MP 20, applyRewards 100_000 / 500_000, enemy pick 999, summon level 99, HUD `Number.MAX_SAFE_INTEGER` from L48, `shrineCount > 100` if `updateSessionState` is ever wired (official never calls it).
- Do not persist compounding `getPlayerBaseStats` HP.

## Visuals

Owner-uploaded `spriteUrl` / facing URLs remain catalog storage, not combat art
(`adminVisualStatus.ts`). Deleting a sprite config or palette cannot unload a
Character. Do not make a URL or palette id required on Character without a later
migration after `20260901` and a missing-asset fallback.

## Spell discovery (future-proof)

Still no `ownedSpellIds` / observe / commit APIs. Owned ids today are catalog ∪
starters ∪ `spellLevelKeys`. Retired catalog rows leave ghost keys (known).
Do not add required ownership/discovery fields until SDEG-001/002 (new later
file after `20260901`, never edit shipped NewActor).

## Migration analysis

| Change | Approve? |
| :--- | :--- |
| New required Character / stats / config field | **No** — needs later chain file after `20260901` with empty defaults, idempotent, not a destructive replay. |
| Attaching `(with migration)` as a player rewrite | **No** |
| Editing shipped `20260831` / `20260901` NewActor | **No** |
| Helper-only frontend locks (this PR) | **Yes** — no persist-schema / EOP chain change |

Repeated deployment of this PR cannot reapply a destructive migration (none
shipped). Client copy-if-missing HUD migrate is idempotent after the name key
is deleted.

## Helper-only without forbidden files?

| ID | Helper+tests only? | This PR |
| :--- | :--- | :--- |
| 001–002 | Policy yes; lock needs WX | helpers only |
| 003 | Helper yes; wiring needs DraggablePanel / ChallengePanel | **helper only** — those files overlap #429+ |
| 004–006 | Yes for lock/docs | helpers only |

## What this run will not approve

- New required persist fields or EOP chain edits
- Cloning open helper PRs listed above
- Editing WX / main.mo / BuffShop / versionGate / deathPenalty / App /
  AchievementsPanel / combatMath while older persist PRs queue
